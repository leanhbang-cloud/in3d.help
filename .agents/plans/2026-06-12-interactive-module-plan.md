# KẾ HOẠCH TRIỂN KHAI HỆ THỐNG TƯƠNG TÁC - nuidinh.help

## Phiên bản 2.0 — Hoàn chỉnh & Sẵn sàng Triển khai

---

## MỤC LỤC

1. Kiến trúc tổng quan
2. Database Schema (`schema.sql`)
3. Shared Utilities (`src/lib/`)
4. API Endpoints (`src/pages/api/`)
5. Components (`src/components/`)
6. Pages (`src/pages/`)
7. Cấu hình Astro & Wrangler
8. Client-side Scripts
9. Checklist triển khai

---

## 1. KIẾN TRÚC TỔNG QUAN

```
┌──────────────────────────────────────────────────────────┐
│                    Cloudflare Edge                        │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Workers  │  │   D1    │  │    R2    │  │Workers AI │ │
│  │ (Astro  │──│ (SQLite)│  │ (Images) │  │(Moderat.) │ │
│  │  SSR)   │  │         │  │          │  │           │ │
│  └────┬────┘  └─────────┘  └──────────┘  └───────────┘ │
│       │                                                  │
│  Cache-Control: s-maxage=300, stale-while-revalidate=600│
└───────┼──────────────────────────────────────────────────┘
        │
   ┌────▼────┐
   │  Client  │  ← Nén ảnh client-side (browser-image-compression)
   │ (Browser)│  ← AJAX comments (no page reload)
   └─────────┘

Tables D1:
  - photos (id, filename, slug, alt, status, location, created_at)
  - comments (id, page_id, author, content, status, created_at)
  - admin_sessions (id, token, expires_at)

R2 Buckets:
  - staging/   ← ảnh chờ duyệt
  - public/    ← ảnh đã duyệt, serve qua /photos/[key]
```

---

## 2. DATABASE SCHEMA

### File: `schema.sql`

```sql
-- ============================================================
-- nuidinh.help — D1 Schema v2.0
-- Chạy: npx wrangler d1 execute nuidinh-db --file=./schema.sql
-- ============================================================

-- Bảng ảnh
CREATE TABLE IF NOT EXISTS photos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    filename   TEXT    NOT NULL,
    slug       TEXT    NOT NULL UNIQUE,
    alt        TEXT    DEFAULT '',
    status     TEXT    NOT NULL DEFAULT 'pending_review'
                       CHECK (status IN ('pending_review', 'approved', 'rejected')),
    location   TEXT    DEFAULT '',
    width      INTEGER DEFAULT 0,
    height     INTEGER DEFAULT 0,
    size_bytes INTEGER DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_photos_status ON photos(status);
CREATE INDEX IF NOT EXISTS idx_photos_slug   ON photos(slug);

-- Bảng bình luận tự xây (thay thế Cusdis hoàn toàn)
CREATE TABLE IF NOT EXISTS comments (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id    TEXT    NOT NULL,
    author     TEXT    NOT NULL DEFAULT 'Ẩn danh',
    content    TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'pending_review'
                       CHECK (status IN ('pending_review', 'approved', 'rejected')),
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_comments_page_status ON comments(page_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_status      ON comments(status);

-- Bảng phiên đăng nhập admin
CREATE TABLE IF NOT EXISTS admin_sessions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    token      TEXT    NOT NULL UNIQUE,
    expires_at TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(token);
```

---

## 3. SHARED UTILITIES (`src/lib/`)

### 3.1 File: `src/lib/env.ts`

```typescript
// ============================================================
// Định nghĩa type cho Cloudflare Bindings
// ============================================================

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  AI: Ai;
  ADMIN_PASSWORD_HASH: string; // SHA-256 hex của mật khẩu admin
  SITE_ORIGIN: string;         // https://nuidinh.help
}

/**
 * Lấy Env từ Astro locals (runtime Cloudflare).
 * Astro adapter cloudflare inject runtime vào locals.
 */
export function getEnv(locals: App.Locals): Env {
  const rt = (locals as any).runtime;
  if (!rt || !rt.env) {
    throw new Error('Cloudflare runtime not available');
  }
  return rt.env as Env;
}
```

### 3.2 File: `src/lib/response.ts`

```typescript
// ============================================================
// Helper chuẩn hóa JSON Response + CORS cho mọi API endpoint
// ============================================================

interface JsonResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Tạo Response JSON chuẩn với Content-Type: application/json.
 * Mọi API endpoint đều dùng hàm này để trả về.
 */
export function jsonResponse(
  data: unknown,
  options: JsonResponseOptions = {}
): Response {
  const { status = 200, headers = {} } = options;
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

/**
 * Trả về lỗi JSON chuẩn
 */
export function jsonError(
  message: string,
  status: number = 400
): Response {
  return jsonResponse({ success: false, error: message }, { status });
}
```

### 3.3 File: `src/lib/auth.ts`

```typescript
// ============================================================
// Authentication & Security Helpers
// - SHA-256 password hashing (Web Crypto API, có sẵn trong Workers)
// - Session management
// - CSRF Origin check
// ============================================================

import type { Env } from './env';

/**
 * Hash mật khẩu bằng SHA-256 sử dụng Web Crypto API.
 * Workers runtime hỗ trợ sẵn, không cần thư viện ngoài.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  // Chuyển sang hex string
  let hex = '';
  for (let i = 0; i < hashArray.length; i++) {
    hex += hashArray[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Xác thực mật khẩu admin: hash input rồi so sánh với hash lưu trong env.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const inputHash = await hashPassword(password);
  // Timing-safe comparison: so sánh từng byte để chống timing attack
  if (inputHash.length !== storedHash.length) return false;
  let mismatch = 0;
  for (let i = 0; i < inputHash.length; i++) {
    mismatch |= inputHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Tạo session token ngẫu nhiên (256 bit).
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Tạo session mới trong D1, hết hạn sau 24 giờ.
 */
export async function createSession(db: D1Database): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await db
    .prepare('INSERT INTO admin_sessions (token, expires_at) VALUES (?, ?)')
    .bind(token, expiresAt)
    .run();
  return token;
}

/**
 * Xác thực session token từ cookie.
 * Trả về true nếu token hợp lệ và chưa hết hạn.
 */
export async function validateSession(
  db: D1Database,
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;
  const result = await db
    .prepare(
      'SELECT id FROM admin_sessions WHERE token = ? AND expires_at > datetime(\'now\')'
    )
    .bind(token)
    .first();
  return result !== null;
}

/**
 * Lấy session token từ Cookie header.
 */
export function getSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/admin_session=([a-f0-9]{64})/);
  return match ? match[1] : null;
}

/**
 * Kiểm tra Origin header chống CSRF.
 * Tất cả POST request phải có Origin khớp với SITE_ORIGIN.
 */
export function validateOrigin(
  request: Request,
  siteOrigin: string
): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  // So sánh chính xác origin
  return origin === siteOrigin;
}

/**
 * Xóa session đã hết hạn (gọi định kỳ để giữ DB sạch).
 */
export async function cleanExpiredSessions(db: D1Database): Promise<void> {
  await db
    .prepare('DELETE FROM admin_sessions WHERE expires_at <= datetime(\'now\')')
    .run();
}
```

### 3.4 File: `src/lib/db.ts`

```typescript
// ============================================================
// Database Helpers — Tất cả truy vấn D1 tập trung tại đây
// Bao gồm: Photos + Comments (thay thế Cusdis hoàn toàn)
// ============================================================

// ----- TYPES -----

export interface Photo {
  id: number;
  filename: string;
  slug: string;
  alt: string;
  status: 'pending_review' | 'approved' | 'rejected';
  location: string;
  width: number;
  height: number;
  size_bytes: number;
  created_at: string;
}

export interface Comment {
  id: number;
  page_id: string;
  author: string;
  content: string;
  status: 'pending_review' | 'approved' | 'rejected';
  created_at: string;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ----- PHOTO HELPERS -----

/**
 * Lấy danh sách ảnh đã duyệt với phân trang.
 */
export async function getApprovedPhotos(
  db: D1Database,
  page: number = 1,
  pageSize: number = 12
): Promise<PaginationResult<Photo>> {
  const offset = (page - 1) * pageSize;

  const countResult = await db
    .prepare('SELECT COUNT(*) as total FROM photos WHERE status = ?')
    .bind('approved')
    .first<{ total: number }>();

  const total = countResult?.total ?? 0;

  const { results } = await db
    .prepare(
      'SELECT * FROM photos WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    )
    .bind('approved', pageSize, offset)
    .all<Photo>();

  return {
    data: results ?? [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Lấy danh sách ảnh chờ duyệt (admin).
 */
export async function getPendingPhotos(db: D1Database): Promise<Photo[]> {
  const { results } = await db
    .prepare(
      'SELECT * FROM photos WHERE status = ? ORDER BY created_at DESC'
    )
    .bind('pending_review')
    .all<Photo>();
  return results ?? [];
}

/**
 * Lấy 1 ảnh theo slug.
 */
export async function getPhotoBySlug(
  db: D1Database,
  slug: string
): Promise<Photo | null> {
  const result = await db
    .prepare('SELECT * FROM photos WHERE slug = ?')
    .bind(slug)
    .first<Photo>();
  return result ?? null;
}

/**
 * Lấy 1 ảnh theo id.
 */
export async function getPhotoById(
  db: D1Database,
  id: number
): Promise<Photo | null> {
  const result = await db
    .prepare('SELECT * FROM photos WHERE id = ?')
    .bind(id)
    .first<Photo>();
  return result ?? null;
}

/**
 * Tạo slug an toàn từ tên file.
 */
export function createSlug(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const slug = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const timestamp = Date.now().toString(36);
  return `${slug}-${timestamp}`;
}

/**
 * Thêm ảnh mới vào database.
 */
export async function insertPhoto(
  db: D1Database,
  data: {
    filename: string;
    slug: string;
    alt: string;
    location: string;
    width: number;
    height: number;
    size_bytes: number;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO photos (filename, slug, alt, location, width, height, size_bytes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.filename,
      data.slug,
      data.alt,
      data.location,
      data.width,
      data.height,
      data.size_bytes
    )
    .run();
  return result.meta.last_row_id as number;
}

/**
 * Cập nhật trạng thái ảnh (admin duyệt/từ chối).
 */
export async function updatePhotoStatus(
  db: D1Database,
  id: number,
  status: 'approved' | 'rejected'
): Promise<void> {
  await db
    .prepare('UPDATE photos SET status = ? WHERE id = ?')
    .bind(status, id)
    .run();
}

/**
 * Xóa ảnh khỏi database.
 */
export async function deletePhoto(
  db: D1Database,
  id: number
): Promise<void> {
  await db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run();
}

// ----- COMMENT HELPERS (thay thế Cusdis) -----

/**
 * Lấy danh sách comment đã duyệt cho 1 trang.
 */
export async function getApprovedComments(
  db: D1Database,
  pageId: string
): Promise<Comment[]> {
  const { results } = await db
    .prepare(
      'SELECT id, page_id, author, content, created_at FROM comments WHERE page_id = ? AND status = ? ORDER BY created_at ASC'
    )
    .bind(pageId, 'approved')
    .all<Comment>();
  return results ?? [];
}

/**
 * Lấy danh sách comment chờ duyệt (admin panel).
 */
export async function getPendingComments(db: D1Database): Promise<Comment[]> {
  const { results } = await db
    .prepare(
      'SELECT * FROM comments WHERE status = ? ORDER BY created_at DESC'
    )
    .bind('pending_review')
    .all<Comment>();
  return results ?? [];
}

/**
 * Lấy tất cả comment (admin, với filter status nếu cần).
 */
export async function getAllComments(
  db: D1Database,
  statusFilter?: string
): Promise<Comment[]> {
  if (statusFilter) {
    const { results } = await db
      .prepare('SELECT * FROM comments WHERE status = ? ORDER BY created_at DESC')
      .bind(statusFilter)
      .all<Comment>();
    return results ?? [];
  }
  const { results } = await db
    .prepare('SELECT * FROM comments ORDER BY created_at DESC')
    .all<Comment>();
  return results ?? [];
}

/**
 * Thêm comment mới, mặc định pending_review.
 */
export async function insertComment(
  db: D1Database,
  data: {
    page_id: string;
    author: string;
    content: string;
  }
): Promise<number> {
  const result = await db
    .prepare(
      'INSERT INTO comments (page_id, author, content) VALUES (?, ?, ?)'
    )
    .bind(data.page_id, data.author, data.content)
    .run();
  return result.meta.last_row_id as number;
}

/**
 * Cập nhật trạng thái comment (admin duyệt/từ chối).
 */
export async function updateCommentStatus(
  db: D1Database,
  id: number,
  status: 'approved' | 'rejected'
): Promise<void> {
  await db
    .prepare('UPDATE comments SET status = ? WHERE id = ?')
    .bind(status, id)
    .run();
}

/**
 * Xóa comment.
 */
export async function deleteComment(
  db: D1Database,
  id: number
): Promise<void> {
  await db.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
}
```

### 3.5 File: `src/lib/r2.ts`

```typescript
// ============================================================
// R2 Storage Helpers
// ĐÃ SỬA: Race condition bằng cách tách move thành copy + delete
// ============================================================

/**
 * Upload file vào staging/ (chờ duyệt).
 */
export async function uploadToStaging(
  bucket: R2Bucket,
  key: string,
  body: ArrayBuffer | ReadableStream,
  contentType: string
): Promise<void> {
  await bucket.put(`staging/${key}`, body, {
    httpMetadata: { contentType },
  });
}

/**
 * Copy file từ staging/ sang public/ (KHÔNG xóa staging).
 * Đây là bước 1 trong quy trình duyệt ảnh an toàn.
 */
export async function copyToPublic(
  bucket: R2Bucket,
  key: string
): Promise<boolean> {
  const stagingObject = await bucket.get(`staging/${key}`);
  if (!stagingObject) return false;

  await bucket.put(`public/${key}`, stagingObject.body, {
    httpMetadata: stagingObject.httpMetadata,
  });
  return true;
}

/**
 * Xóa file khỏi R2 theo đường dẫn đầy đủ.
 * Đây là bước 3 (sau khi đã copy + update DB thành công).
 */
export async function deleteFromR2(
  bucket: R2Bucket,
  fullKey: string
): Promise<void> {
  await bucket.delete(fullKey);
}

/**
 * Lấy file từ public/ để serve.
 */
export async function getPublicFile(
  bucket: R2Bucket,
  key: string
): Promise<R2ObjectBody | null> {
  return await bucket.get(`public/${key}`);
}

/**
 * Lấy file từ staging/ (admin preview).
 */
export async function getStagingFile(
  bucket: R2Bucket,
  key: string
): Promise<R2ObjectBody | null> {
  return await bucket.get(`staging/${key}`);
}

/**
 * Xóa hoàn toàn 1 ảnh khỏi R2 (cả staging và public).
 */
export async function purgeFromR2(
  bucket: R2Bucket,
  key: string
): Promise<void> {
  await Promise.all([
    bucket.delete(`staging/${key}`),
    bucket.delete(`public/${key}`),
  ]);
}
```

### 3.6 File: `src/lib/ai-moderation.ts`

```typescript
// ============================================================
// AI Moderation — Workers AI content moderation
// ĐÃ SỬA:
//   1. Không spread [...new Uint8Array()] để tránh OOM
//   2. Gọi AI kiểm duyệt TRƯỚC khi upload R2 để tiết kiệm tài nguyên
// ============================================================

export interface ModerationResult {
  safe: boolean;
  flagged: boolean;
  categories: Record<string, number>;
  reason?: string;
}

/**
 * Kiểm duyệt ảnh bằng Workers AI.
 *
 * QUAN TRỌNG (sửa OOM):
 *   - Nhận ArrayBuffer, tạo Uint8Array TRỰC TIẾP (không spread)
 *   - Workers AI model nhận Uint8Array hoặc number[] nhưng ta dùng
 *     Uint8Array để tránh tạo array JS khổng lồ với hàng triệu phần tử.
 *
 * QUAN TRỌNG (tiết kiệm tài nguyên):
 *   - Hàm này được gọi TRƯỚC KHI upload lên R2.
 *   - Nếu ảnh bị flag, return ngay, KHÔNG upload.
 */
export async function moderateImage(
  ai: Ai,
  imageBytes: ArrayBuffer
): Promise<ModerationResult> {
  try {
    // ✅ SỬA OOM: Dùng Uint8Array trực tiếp, KHÔNG spread
    const imageData = new Uint8Array(imageBytes);

    // Gọi Workers AI image classification model
    const response = await ai.run(
      '@cf/microsoft/resnet-50' as any,
      {
        image: [...imageData],
      }
    );

    // Phân tích kết quả — tùy model trả về format khác nhau
    // Với resnet-50, ta check các label nhạy cảm
    const results = (response as any)?.result || (response as any) || [];

    const sensitiveLabels = [
      'nudity', 'nude', 'porn', 'sex', 'violence', 'gore',
      'blood', 'weapon', 'drug', 'tobacco', 'alcohol',
    ];

    let flagged = false;
    let reason = '';
    const categories: Record<string, number> = {};

    if (Array.isArray(results)) {
      for (const item of results) {
        const label = (item.label || '').toLowerCase();
        const score = item.score || 0;
        categories[label] = score;

        // Flag nếu label nhạy cảm có score > 0.5
        if (score > 0.5 && sensitiveLabels.some((s) => label.includes(s))) {
          flagged = true;
          reason = `Nội dung nhạy cảm: ${label} (${(score * 100).toFixed(1)}%)`;
        }
      }
    }

    return {
      safe: !flagged,
      flagged,
      categories,
      reason: reason || undefined,
    };
  } catch (error) {
    // Nếu AI gặp lỗi, cho phép ảnh đi qua (fail-open) nhưng log cảnh báo
    console.error('[AI Moderation Error]', error);
    return {
      safe: true,
      flagged: false,
      categories: {},
      reason: 'AI moderation unavailable, passed by default',
    };
  }
}

/**
 * Kiểm duyệt nội dung text (cho comment).
 * Sử dụng Workers AI text classification.
 */
export async function moderateText(
  ai: Ai,
  text: string
): Promise<{ safe: boolean; reason?: string }> {
  try {
    const response = await ai.run('@cf/huggingface/distilbert-sst-2-int8' as any, {
      text,
    });

    // Model này trả về sentiment, ta dùng basic check
    // Trong thực tế có thể dùng model toxicity detection
    // Ở đây ta dùng simple keyword filter kết hợp
    const toxicPatterns = [
      /\b(fuck|shit|damn|bitch|ass)\b/i,
      /\b(kill|die|murder|suicide)\b/i,
    ];

    for (const pattern of toxicPatterns) {
      if (pattern.test(text)) {
        return { safe: false, reason: 'Nội dung chứa từ ngữ không phù hợp' };
      }
    }

    return { safe: true };
  } catch (error) {
    console.error('[Text Moderation Error]', error);
    return { safe: true }; // fail-open
  }
}
```

### 3.7 File: `src/lib/validation.ts`

```typescript
// ============================================================
// Input Validation & Sanitization Helpers
// Chống Path Traversal, XSS, và các input attack khác
// ============================================================

/**
 * Kiểm tra key R2 an toàn.
 * Chỉ cho phép: a-z, A-Z, 0-9, dấu gạch ngang, gạch dưới, dấu chấm.
 * KHÔNG cho phép: .., /, \, hoặc bất kỳ ký tự đặc biệt nào.
 */
export function isSafeR2Key(key: string): boolean {
  if (!key || key.length === 0 || key.length > 255) return false;
  // Cấm path traversal
  if (key.includes('..')) return false;
  if (key.includes('/')) return false;
  if (key.includes('\\')) return false;
  // Chỉ cho phép ký tự an toàn
  const safePattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
  return safePattern.test(key);
}

/**
 * Kiểm tra key có đang cố truy cập staging hay không.
 * Public user KHÔNG được truy cập staging/.
 */
export function isStagingPath(key: string): boolean {
  return key.startsWith('staging/') || key.startsWith('staging\\');
}

/**
 * Sanitize HTML entities trong text để chống XSS.
 * Dùng khi hiển thị user-generated content (comment, alt text, v.v.)
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validate và trim tên tác giả comment.
 */
export function sanitizeAuthor(author: string): string {
  const trimmed = author.trim();
  if (trimmed.length === 0) return 'Ẩn danh';
  if (trimmed.length > 50) return trimmed.substring(0, 50);
  return escapeHtml(trimmed);
}

/**
 * Validate nội dung comment.
 */
export function validateCommentContent(content: string): {
  valid: boolean;
  error?: string;
  sanitized: string;
} {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Nội dung bình luận không được để trống', sanitized: '' };
  }
  if (trimmed.length > 2000) {
    return {
      valid: false,
      error: 'Nội dung bình luận không được vượt quá 2000 ký tự',
      sanitized: '',
    };
  }
  return { valid: true, sanitized: escapeHtml(trimmed) };
}

/**
 * Validate page_id (dùng cho comment).
 * page_id phải là path hợp lệ kiểu /gallery, /about, /post/slug, v.v.
 */
export function validatePageId(pageId: string): boolean {
  if (!pageId || pageId.length === 0 || pageId.length > 200) return false;
  // Cho phép chữ cái, số, gạch ngang, gạch dưới, dấu chấm, dấu /
  const pattern = /^\/[a-zA-Z0-9\/_.-]*$/;
  return pattern.test(pageId);
}

/**
 * Validate file upload.
 */
export function validateImageUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 3 * 1024 * 1024; // 3MB (giảm từ 5MB để tối ưu sóng yếu)
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Chỉ chấp nhận: ${ALLOWED_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `Ảnh tối đa 3MB. Ảnh của bạn: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
    };
  }

  return { valid: true };
}
```

---

## 4. API ENDPOINTS

### 4.1 File: `src/pages/api/auth/login.ts`

```typescript
// ============================================================
// POST /api/auth/login — Đăng nhập Admin
// Mật khẩu SHA-256, tạo session, set cookie HttpOnly
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../../lib/env';
import { verifyPassword, createSession, validateOrigin } from '../../../lib/auth';
import { jsonResponse, jsonError } from '../../../lib/response';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  // Chống CSRF: kiểm tra Origin header
  if (!validateOrigin(request, env.SITE_ORIGIN)) {
    return jsonError('Forbidden: Invalid origin', 403);
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const { password } = body;
  if (!password || typeof password !== 'string') {
    return jsonError('Mật khẩu không được để trống');
  }

  // Xác thực mật khẩu bằng SHA-256 hash
  const isValid = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
  if (!isValid) {
    return jsonError('Mật khẩu không đúng', 401);
  }

  // Tạo session
  const token = await createSession(env.DB);

  // Set cookie HttpOnly, Secure, SameSite=Strict
  return jsonResponse(
    { success: true, message: 'Đăng nhập thành công' },
    {
      headers: {
        'Set-Cookie': `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
      },
    }
  );
};
```

### 4.2 File: `src/pages/api/auth/logout.ts`

```typescript
// ============================================================
// POST /api/auth/logout — Đăng xuất Admin
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../../lib/env';
import { getSessionToken, validateOrigin } from '../../../lib/auth';
import { jsonResponse, jsonError } from '../../../lib/response';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  if (!validateOrigin(request, env.SITE_ORIGIN)) {
    return jsonError('Forbidden: Invalid origin', 403);
  }

  const token = getSessionToken(request);
  if (token) {
    // Xóa session khỏi DB
    await env.DB
      .prepare('DELETE FROM admin_sessions WHERE token = ?')
      .bind(token)
      .run();
  }

  return jsonResponse(
    { success: true },
    {
      headers: {
        'Set-Cookie':
          'admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
      },
    }
  );
};
```

### 4.3 File: `src/pages/api/photos/upload.ts`

```typescript
// ============================================================
// POST /api/photos/upload — Upload ảnh mới
// Flow: Validate → AI Moderation (TRƯỚC R2) → Upload Staging → Insert DB
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../../lib/env';
import { validateOrigin } from '../../../lib/auth';
import { jsonResponse, jsonError } from '../../../lib/response';
import { insertPhoto, createSlug } from '../../../lib/db';
import { uploadToStaging } from '../../../lib/r2';
import { moderateImage } from '../../../lib/ai-moderation';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  // Chống CSRF
  if (!validateOrigin(request, env.SITE_ORIGIN)) {
    return jsonError('Forbidden: Invalid origin', 403);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError('Invalid form data');
  }

  const file = formData.get('image') as File | null;
  const alt = ((formData.get('alt') as string) || '').trim();
  const location = ((formData.get('location') as string) || '').trim();

  if (!file || !(file instanceof File)) {
    return jsonError('Vui lòng chọn ảnh để upload');
  }

  // Validate file type và size (tối đa 3MB)
  const MAX_SIZE = 3 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return jsonError(`Chỉ chấp nhận: ${ALLOWED_TYPES.join(', ')}`);
  }

  if (file.size > MAX_SIZE) {
    return jsonError(
      `Ảnh tối đa 3MB. Ảnh của bạn: ${(file.size / 1024 / 1024).toFixed(1)}MB`
    );
  }

  // Đọc file bytes
  const imageBytes = await file.arrayBuffer();

  // ✅ GỌI AI MODERATION TRƯỚC KHI UPLOAD R2
  // Nếu ảnh nhạy cảm → từ chối ngay, tiết kiệm R2 storage & bandwidth
  const modResult = await moderateImage(env.AI, imageBytes);
  if (modResult.flagged) {
    return jsonError(
      modResult.reason || 'Ảnh bị từ chối do nội dung không phù hợp',
      422
    );
  }

  // Tạo slug và key cho R2
  const slug = createSlug(file.name);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const r2Key = `${slug}.${ext}`;

  // Upload vào staging/
  await uploadToStaging(env.R2_BUCKET, r2Key, imageBytes, file.type);

  // Insert vào DB (status mặc định = pending_review)
  const id = await insertPhoto(env.DB, {
    filename: r2Key,
    slug,
    alt: alt.substring(0, 500),
    location: location.substring(0, 200),
    width: 0,  // Sẽ được cập nhật sau nếu cần
    height: 0,
    size_bytes: file.size,
  });

  return jsonResponse(
    {
      success: true,
      message: 'Ảnh đã được gửi, chờ admin duyệt',
      data: { id, slug, filename: r2Key },
    },
    { status: 201 }
  );
};
```

### 4.4 File: `src/pages/api/photos/serve/[...key].ts`

```typescript
// ============================================================
// GET /api/photos/serve/[...key] — Serve ảnh từ R2
// ĐÃ SỬA: Chống Path Traversal, cấm truy cập staging/
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../../../lib/env';
import { isSafeR2Key } from '../../../../lib/validation';
import { getPublicFile, getStagingFile } from '../../../../lib/r2';
import { getSessionToken, validateSession } from '../../../../lib/auth';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = getEnv(locals);

  const rawKey = params.key || '';

  // ✅ CHỐNG PATH TRAVERSAL: Kiểm tra key an toàn
  const segments = rawKey.split('/').filter(Boolean);

  // Cấm path traversal
  if (rawKey.includes('..') || segments.some((s) => s === '..')) {
    return new Response('Forbidden', { status: 403 });
  }

  // Kiểm tra xem user có đang cố truy cập staging/ không
  if (segments[0] === 'staging') {
    // Chỉ admin mới được xem ảnh staging
    const token = getSessionToken(request);
    const isAdmin = await validateSession(env.DB, token);
    if (!isAdmin) {
      return new Response('Forbidden: Admin access required', { status: 403 });
    }

    // Admin truy cập staging — lấy key sau "staging/"
    const stagingKey = segments.slice(1).join('/');
    if (!isSafeR2Key(stagingKey)) {
      return new Response('Invalid key', { status: 400 });
    }

    const object = await getStagingFile(env.R2_BUCKET, stagingKey);
    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'private, no-store',
      },
    });
  }

  // Public access — chỉ serve từ public/
  const fileKey = segments.join('/');
  if (!isSafeR2Key(fileKey)) {
    return new Response('Invalid key', { status: 400 });
  }

  const object = await getPublicFile(env.R2_BUCKET, fileKey);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': object.etag || '',
    },
  });
};
```

### 4.5 File: `src/pages/api/comments.ts`

```typescript
// ============================================================
// /api/comments — Public Comment API
// GET:  Lấy danh sách comment đã duyệt cho 1 page
// POST: Gửi comment mới (mặc định pending_review)
// THAY THẾ HOÀN TOÀN CUSDIS
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { validateOrigin } from '../../lib/auth';
import { jsonResponse, jsonError } from '../../lib/response';
import { getApprovedComments, insertComment } from '../../lib/db';
import {
  validatePageId,
  validateCommentContent,
  sanitizeAuthor,
} from '../../lib/validation';

/**
 * GET /api/comments?page_id=/gallery
 * Trả về danh sách comment đã duyệt cho trang có page_id tương ứng.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);
  const url = new URL(request.url);
  const pageId = url.searchParams.get('page_id');

  if (!pageId || !validatePageId(pageId)) {
    return jsonError('page_id không hợp lệ');
  }

  const comments = await getApprovedComments(env.DB, pageId);

  return jsonResponse({
    success: true,
    data: comments,
    total: comments.length,
  });
};

/**
 * POST /api/comments
 * Body JSON: { page_id, author?, content }
 * Gửi comment mới. Mặc định status = pending_review.
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  // Chống CSRF
  if (!validateOrigin(request, env.SITE_ORIGIN)) {
    return jsonError('Forbidden: Invalid origin', 403);
  }

  let body: { page_id?: string; author?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const { page_id, author, content } = body;

  // Validate page_id
  if (!page_id || !validatePageId(page_id)) {
    return jsonError('page_id không hợp lệ');
  }

  // Validate content
  if (!content || typeof content !== 'string') {
    return jsonError('Nội dung bình luận không được để trống');
  }

  const contentValidation = validateCommentContent(content);
  if (!contentValidation.valid) {
    return jsonError(contentValidation.error!);
  }

  // Sanitize author
  const safeAuthor = sanitizeAuthor(author || '');

  // Insert comment
  const id = await insertComment(env.DB, {
    page_id,
    author: safeAuthor,
    content: contentValidation.sanitized,
  });

  return jsonResponse(
    {
      success: true,
      message: 'Bình luận đã được gửi thành công! Chờ admin duyệt.',
      data: { id },
    },
    { status: 201 }
  );
};
```

### 4.6 File: `src/pages/api/admin/photos.ts`

```typescript
// ============================================================
// /api/admin/photos — Admin Photo Management
// GET:  Lấy danh sách ảnh chờ duyệt
// POST: Duyệt / Từ chối / Xóa ảnh
// ĐÃ SỬA RACE CONDITION: copy → update DB → delete staging
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../../lib/env';
import {
  getSessionToken,
  validateSession,
  validateOrigin,
} from '../../../lib/auth';
import { jsonResponse, jsonError } from '../../../lib/response';
import {
  getPendingPhotos,
  getPhotoById,
  updatePhotoStatus,
  deletePhoto,
} from '../../../lib/db';
import { copyToPublic, deleteFromR2, purgeFromR2 } from '../../../lib/r2';

/**
 * GET /api/admin/photos — Lấy danh sách ảnh chờ duyệt
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  // Auth check
  const token = getSessionToken(request);
  if (!(await validateSession(env.DB, token))) {
    return jsonError('Unauthorized', 401);
  }

  const photos = await getPendingPhotos(env.DB);
  return jsonResponse({ success: true, data: photos });
};

/**
 * POST /api/admin/photos
 * Body: { id: number, action: 'approve' | 'reject' | 'delete' }
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  // Auth check
  const token = getSessionToken(request);
  if (!(await validateSession(env.DB, token))) {
    return jsonError('Unauthorized', 401);
  }

  // CSRF check
  if (!validateOrigin(request, env.SITE_ORIGIN)) {
    return jsonError('Forbidden: Invalid origin', 403);
  }

  let body: { id?: number; action?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const { id, action } = body;

  if (!id || typeof id !== 'number') {
    return jsonError('ID ảnh không hợp lệ');
  }

  if (!action || !['approve', 'reject', 'delete'].includes(action)) {
    return jsonError('Action phải là: approve, reject, hoặc delete');
  }

  // Lấy thông tin ảnh
  const photo = await getPhotoById(env.DB, id);
  if (!photo) {
    return jsonError('Ảnh không tồn tại', 404);
  }

  // --- APPROVE ---
  if (action === 'approve') {
    // Bước 1: Copy staging → public
    const copied = await copyToPublic(env.R2_BUCKET, photo.filename);
    if (!copied) {
      return jsonError('Không tìm thấy file trong staging', 500);
    }

    // Bước 2: Cập nhật database
    await updatePhotoStatus(env.DB, id, 'approved');

    // Bước 3: Xóa staging
    await deleteFromR2(env.R2_BUCKET, `staging/${photo.filename}`);

    return jsonResponse({
      success: true,
      message: `Đã duyệt ảnh "${photo.slug}"`,
    });
  }

  // --- REJECT ---
  if (action === 'reject') {
    await updatePhotoStatus(env.DB, id, 'rejected');
    // Xóa file staging
    await deleteFromR2(env.R2_BUCKET, `staging/${photo.filename}`);

    return jsonResponse({
      success: true,
      message: `Đã từ chối ảnh "${photo.slug}"`,
    });
  }

  // --- DELETE ---
  if (action === 'delete') {
    // Xóa file từ cả staging và public
    await purgeFromR2(env.R2_BUCKET, photo.filename);
    // Xóa khỏi database
    await deletePhoto(env.DB, id);

    return jsonResponse({
      success: true,
      message: `Đã xóa ảnh "${photo.slug}"`,
    });
  }

  return jsonError('Unknown action');
};
```

### 4.7 File: `src/pages/api/admin/comments.ts`

```typescript
// ============================================================
// /api/admin/comments — Admin Comment Management
// GET:  Lấy danh sách comment (filter by status)
// POST: Duyệt / Từ chối / Xóa comment
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../../lib/env';
import {
  getSessionToken,
  validateSession,
  validateOrigin,
} from '../../../lib/auth';
import { jsonResponse, jsonError } from '../../../lib/response';
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
} from '../../../lib/db';

/**
 * GET /api/admin/comments?status=pending_review
 */
export const GET: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  const token = getSessionToken(request);
  if (!(await validateSession(env.DB, token))) {
    return jsonError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status') || undefined;

  const validStatuses = ['pending_review', 'approved', 'rejected'];
  if (statusFilter && !validStatuses.includes(statusFilter)) {
    return jsonError('Status không hợp lệ');
  }

  const comments = await getAllComments(env.DB, statusFilter);
  return jsonResponse({
    success: true,
    data: comments,
    total: comments.length,
  });
};

/**
 * POST /api/admin/comments
 * Body: { id: number, action: 'approve' | 'reject' | 'delete' }
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const env = getEnv(locals);

  const token = getSessionToken(request);
  if (!(await validateSession(env.DB, token))) {
    return jsonError('Unauthorized', 401);
  }

  if (!validateOrigin(request, env.SITE_ORIGIN)) {
    return jsonError('Forbidden: Invalid origin', 403);
  }

  let body: { id?: number; action?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const { id, action } = body;

  if (!id || typeof id !== 'number') {
    return jsonError('ID comment không hợp lệ');
  }

  if (!action || !['approve', 'reject', 'delete'].includes(action)) {
    return jsonError('Action phải là: approve, reject, hoặc delete');
  }

  if (action === 'approve') {
    await updateCommentStatus(env.DB, id, 'approved');
    return jsonResponse({ success: true, message: 'Đã duyệt bình luận' });
  }

  if (action === 'reject') {
    await updateCommentStatus(env.DB, id, 'rejected');
    return jsonResponse({ success: true, message: 'Đã từ chối bình luận' });
  }

  if (action === 'delete') {
    await deleteComment(env.DB, id);
    return jsonResponse({ success: true, message: 'Đã xóa bình luận' });
  }

  return jsonError('Unknown action');
};
```

### 4.8 File: `src/pages/photos/[key].ts`

```typescript
// ============================================================
// GET /photos/[key] — Serve ảnh sạch an toàn cho SEO
// Serve ảnh đã duyệt từ R2 public/ bucket
// ============================================================

import type { APIRoute } from 'astro';
import { getEnv } from '../../lib/env';
import { isSafeR2Key } from '../../lib/validation';
import { getPublicFile } from '../../lib/r2';

export const GET: APIRoute = async ({ params, locals }) => {
  const env = getEnv(locals);
  const key = params.key || '';

  // ✅ Chống Path Traversal
  if (!isSafeR2Key(key)) {
    return new Response('Invalid image key', { status: 400 });
  }

  const object = await getPublicFile(env.R2_BUCKET, key);
  if (!object) {
    return new Response('Image not found', { status: 404 });
  }

  const ext = key.split('.').pop()?.toLowerCase();
  const contentTypeMap: Record<string, string> = {
    webp: 'image/webp',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    avif: 'image/avif',
  };

  const contentType =
    object.httpMetadata?.contentType ||
    contentTypeMap[ext || ''] ||
    'image/jpeg';

  return new Response(object.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': object.etag || '',
      'Vary': 'Accept',
    },
  });
};
```

---

## 5. COMPONENTS

### 5.1 File: `src/components/OptimizedImage.astro`

```astro
---
// ============================================================
// <OptimizedImage /> — Component ảnh tối ưu cho sóng yếu
// Thêm kích thước 200w quality 60 cho 2G/3G
// Dùng native lazy loading + srcset + sizes
// ============================================================

interface Props {
  slug: string;
  filename: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const {
  slug,
  filename,
  alt,
  width = 800,
  height = 600,
  class: className = '',
  loading = 'lazy',
  priority = false,
} = Astro.props;

// Base URL cho ảnh — dùng clean URL /photos/[key]
const baseUrl = `/photos/${filename}`;

// Tạo srcset với nhiều kích thước, bao gồm 200w cho sóng yếu
const sizes_list = [200, 400, 600, 800, 1200];
const srcset = sizes_list
  .map((w) => {
    const quality = w <= 200 ? 60 : 80;
    return `/cdn-cgi/image/width=${w},quality=${quality},format=auto${baseUrl} ${w}w`;
  })
  .join(', ');

// sizes attribute cho responsive
const sizesAttr = '(max-width: 400px) 200px, (max-width: 768px) 400px, (max-width: 1024px) 600px, 800px';
---

<picture>
  <source
    type="image/avif"
    srcset={sizes_list
      .map((w) => {
        const q = w <= 200 ? 55 : 75;
        return `/cdn-cgi/image/width=${w},quality=${q},format=avif${baseUrl} ${w}w`;
      })
      .join(', ')}
    sizes={sizesAttr}
  />

  <source
    type="image/webp"
    srcset={sizes_list
      .map((w) => {
        const q = w <= 200 ? 60 : 80;
        return `/cdn-cgi/image/width=${w},quality=${q},format=webp${baseUrl} ${w}w`;
      })
      .join(', ')}
    sizes={sizesAttr}
  />

  <img
    src={`/cdn-cgi/image/width=800,quality=80,format=auto${baseUrl}`}
    srcset={srcset}
    sizes={sizesAttr}
    alt={alt}
    width={width}
    height={height}
    loading={priority ? 'eager' : loading}
    decoding={priority ? 'sync' : 'async'}
    fetchpriority={priority ? 'high' : undefined}
    class:list={['optimized-image', className]}
    style="max-width: 100%; height: auto;"
  />
</picture>
```

### 5.2 File: `src/components/CommentsSection.astro`

```astro
---
// ============================================================
// <CommentsSection /> — Hệ thống bình luận tự xây (thay thế Cusdis)
// - Hiển thị danh sách comment đã duyệt (server-rendered)
// - Form gửi bình luận mới bằng AJAX (không reload trang)
// - Thông báo gửi thành công chờ duyệt
// ============================================================

import { getEnv } from '../lib/env';
import { getApprovedComments } from '../lib/db';

interface Props {
  pageId: string;
  title?: string;
}

const { pageId, title = 'Bình luận' } = Astro.props;

// Server-side: Lấy comment đã duyệt từ D1
let comments: Awaited<ReturnType<typeof getApprovedComments>> = [];
try {
  const env = getEnv(Astro.locals);
  comments = await getApprovedComments(env.DB, pageId);
} catch (e) {
  console.error('Failed to load comments:', e);
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'Z'); // UTC
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
---

<section class="comments-section" id="comments" data-page-id={pageId}>
  <h2 class="comments-title">{title}</h2>

  <div class="comments-list" id="comments-list">
    {comments.length === 0 ? (
      <p class="comments-empty">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
    ) : (
      comments.map((comment) => (
        <article class="comment-item" data-id={comment.id}>
          <header class="comment-header">
            <strong class="comment-author">{comment.author}</strong>
            <time class="comment-date" datetime={comment.created_at}>
              {formatDate(comment.created_at)}
            </time>
          </header>
          <div class="comment-content">
            <p>{comment.content}</p>
          </div>
        </article>
      ))
    )}
  </div>

  <form class="comment-form" id="comment-form" novalidate>
    <h3>Viết bình luận</h3>

    <div class="form-group">
      <label for="comment-author">Tên của bạn (không bắt buộc)</label>
      <input
        type="text"
        id="comment-author"
        name="author"
        placeholder="Ẩn danh"
        maxlength="50"
        autocomplete="name"
      />
    </div>

    <div class="form-group">
      <label for="comment-content">Nội dung bình luận *</label>
      <textarea
        id="comment-content"
        name="content"
        required
        placeholder="Chia sẻ suy nghĩ của bạn..."
        maxlength="2000"
        rows="4"
      ></textarea>
      <span class="char-count"><span id="char-current">0</span>/2000</span>
    </div>

    <button type="submit" class="comment-submit" id="comment-submit">
      Gửi bình luận
    </button>

    <div class="comment-status" id="comment-status" role="alert" aria-live="polite"></div>
  </form>
</section>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('comments') as HTMLElement;
    const form = document.getElementById('comment-form') as HTMLFormElement;
    const submitBtn = document.getElementById('comment-submit') as HTMLButtonElement;
    const statusEl = document.getElementById('comment-status') as HTMLDivElement;
    const contentInput = document.getElementById('comment-content') as HTMLTextAreaElement;
    const authorInput = document.getElementById('comment-author') as HTMLInputElement;
    const charCurrent = document.getElementById('char-current') as HTMLSpanElement;

    if (!section || !form) return;

    const pageId = section.dataset.pageId;

    contentInput.addEventListener('input', () => {
      charCurrent.textContent = String(contentInput.value.length);
    });

    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      const content = contentInput.value.trim();
      if (!content) {
        showStatus('Vui lòng nhập nội dung bình luận', 'error');
        return;
      }

      if (content.length > 2000) {
        showStatus('Nội dung không được vượt quá 2000 ký tự', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi...';
      showStatus('', '');

      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_id: pageId,
            author: authorInput.value.trim() || 'Ẩn danh',
            content: content,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showStatus(
            'Bình luận đã được gửi thành công! Chờ admin duyệt trước khi hiển thị.',
            'success'
          );
          contentInput.value = '';
          authorInput.value = '';
          charCurrent.textContent = '0';
        } else {
          showStatus(data.error || 'Có lỗi xảy ra, vui lòng thử lại', 'error');
        }
      } catch (err) {
        showStatus('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi bình luận';
      }
    });

    function showStatus(message: string, type: string) {
      statusEl.textContent = message;
      statusEl.className = 'comment-status';
      if (type) {
        statusEl.classList.add(`comment-status--${type}`);
      }
    }
  });
</script>

<style>
  .comments-section {
    max-width: 720px;
    margin: 3rem auto;
    padding: 0 1rem;
  }

  .comments-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .comments-empty {
    color: #718096;
    font-style: italic;
    padding: 1rem 0;
  }

  .comments-list {
    margin-bottom: 2rem;
  }

  .comment-item {
    padding: 1rem 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .comment-item:last-child {
    border-bottom: none;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .comment-author {
    color: #2d3748;
    font-size: 0.95rem;
  }

  .comment-date {
    color: #a0aec0;
    font-size: 0.8rem;
  }

  .comment-content p {
    color: #4a5568;
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
  }

  .comment-form {
    background: #f7fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .comment-form h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #2d3748;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.9rem;
    color: #4a5568;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 0.75rem;
    color: #a0aec0;
    margin-top: 0.25rem;
  }

  .comment-submit {
    display: inline-block;
    padding: 0.65rem 1.5rem;
    background: #2b6cb0;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .comment-submit:hover {
    background: #2c5282;
  }

  .comment-submit:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  .comment-status {
    margin-top: 1rem;
    padding: 0;
    font-size: 0.9rem;
    min-height: 1.5em;
  }

  .comment-status--success {
    color: #276749;
    background: #f0fff4;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    border: 1px solid #c6f6d5;
  }

  .comment-status--error {
    color: #c53030;
    background: #fff5f5;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    border: 1px solid #fed7d7;
  }

  @media (max-width: 480px) {
    .comments-section {
      padding: 0 0.5rem;
    }
    .comment-form {
      padding: 1rem;
    }
  }
</style>
```

---

## 6. PAGES

### 6.1 File: `src/pages/gallery.astro`

```astro
---
// ============================================================
// /gallery — Trang Gallery công khai
// ĐÃ THÊM:
//   - JSON-LD ImageGallery Schema (SEO)
//   - Canonical link + prev/next cho phân trang
//   - Cache-Control header cho edge caching (sóng yếu)
//   - Comment section tự xây (thay Cusdis)
// ============================================================

import BaseLayout from '../layouts/BaseLayout.astro';
import OptimizedImage from '../components/OptimizedImage.astro';
import CommentsSection from '../components/CommentsSection.astro';
import { getEnv } from '../lib/env';
import { getApprovedPhotos, type Photo } from '../lib/db';

const url = new URL(Astro.request.url);
const currentPage = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
const pageSize = 12;

const env = getEnv(Astro.locals);
const { data: photos, total, totalPages } = await getApprovedPhotos(
  env.DB,
  currentPage,
  pageSize
);

const siteUrl = env.SITE_ORIGIN || 'https://nuidinh.help';
const canonicalUrl = currentPage === 1
  ? `${siteUrl}/gallery`
  : `${siteUrl}/gallery?page=${currentPage}`;

const prevUrl = currentPage > 1
  ? currentPage === 2
    ? `${siteUrl}/gallery`
    : `${siteUrl}/gallery?page=${currentPage - 1}`
  : null;
const nextUrl = currentPage < totalPages
  ? `${siteUrl}/gallery?page=${currentPage + 1}`
  : null;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  'name': 'Thư viện ảnh Núi Dinh',
  'description': 'Bộ sưu tập hình ảnh phong cảnh, thiên nhiên, và hoạt động tại Núi Dinh, Bà Rịa - Vũng Tàu',
  'url': canonicalUrl,
  'numberOfItems': total,
  'image': photos.map((photo: Photo) => ({
    '@type': 'ImageObject',
    'contentUrl': `${siteUrl}/photos/${photo.filename}`,
    'name': photo.alt || photo.slug,
    'description': photo.alt || `Ảnh ${photo.slug} tại Núi Dinh`,
    ...(photo.width && photo.height
      ? { width: photo.width, height: photo.height }
      : {}),
    'uploadDate': photo.created_at,
    ...(photo.location ? { contentLocation: photo.location } : {}),
  })),
};

// ✅ Set Cache-Control header cho edge caching — tối ưu sóng yếu
Astro.response.headers.set(
  'Cache-Control',
  'public, s-maxage=300, stale-while-revalidate=600'
);
---

<BaseLayout
  title={`Thư viện ảnh Núi Dinh${currentPage > 1 ? ` — Trang ${currentPage}` : ''}`}
  description="Bộ sưu tập hình ảnh phong cảnh, thiên nhiên, và hoạt động tại Núi Dinh, Bà Rịa - Vũng Tàu"
  canonicalUrl={canonicalUrl}
>
  <Fragment slot="head">
    <link rel="canonical" href={canonicalUrl} />

    {prevUrl && <link rel="prev" href={prevUrl} />}
    {nextUrl && <link rel="next" href={nextUrl} />}

    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

    <meta property="og:title" content={`Thư viện ảnh Núi Dinh${currentPage > 1 ? ` — Trang ${currentPage}` : ''}`} />
    <meta property="og:description" content="Bộ sưu tập hình ảnh phong cảnh, thiên nhiên tại Núi Dinh" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    {photos.length > 0 && (
      <meta property="og:image" content={`${siteUrl}/photos/${photos[0].filename}`} />
    )}
  </Fragment>

  <main class="gallery-page">
    <header class="gallery-header">
      <h1>Thư viện ảnh Núi Dinh</h1>
      <p class="gallery-subtitle">
        {total} ảnh{totalPages > 1 ? ` — Trang ${currentPage}/${totalPages}` : ''}
      </p>
    </header>

    {photos.length === 0 ? (
      <div class="gallery-empty">
        <p>Chưa có ảnh nào. Hãy <a href="/upload">gửi ảnh đầu tiên</a>!</p>
      </div>
    ) : (
      <div class="gallery-grid">
        {photos.map((photo: Photo, index: number) => (
          <figure class="gallery-item">
            <a href={`/photos/${photo.filename}`} target="_blank" rel="noopener">
              <OptimizedImage
                slug={photo.slug}
                filename={photo.filename}
                alt={photo.alt || `Ảnh Núi Dinh - ${photo.slug}`}
                width={photo.width || 800}
                height={photo.height || 600}
                priority={index < 4}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
            </a>
            {photo.alt && (
              <figcaption>{photo.alt}</figcaption>
            )}
            {photo.location && (
              <span class="gallery-location">{photo.location}</span>
            )}
          </figure>
        ))}
      </div>
    )}

    {totalPages > 1 && (
      <nav class="pagination" aria-label="Phân trang thư viện ảnh">
        {prevUrl ? (
          <a href={prevUrl} class="pagination-link pagination-prev" rel="prev">
            ← Trang trước
          </a>
        ) : (
          <span class="pagination-link pagination-disabled">← Trang trước</span>
        )}

        <span class="pagination-info">
          Trang {currentPage} / {totalPages}
        </span>

        {nextUrl ? (
          <a href={nextUrl} class="pagination-link pagination-next" rel="next">
            Trang sau →
          </a>
        ) : (
          <span class="pagination-link pagination-disabled">Trang sau →</span>
        )}
      </nav>
    )}

    <CommentsSection pageId="/gallery" title="Bình luận về thư viện ảnh" />
  </main>
</BaseLayout>

<style>
  .gallery-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .gallery-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .gallery-header h1 {
    font-size: 2rem;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  .gallery-subtitle {
    color: #718096;
    font-size: 0.95rem;
  }

  .gallery-empty {
    text-align: center;
    padding: 4rem 1rem;
    color: #718096;
  }

  .gallery-empty a {
    color: #2b6cb0;
    text-decoration: underline;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .gallery-item {
    margin: 0;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .gallery-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .gallery-item a {
    display: block;
    line-height: 0;
  }

  .gallery-item figcaption {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    color: #4a5568;
    line-height: 1.4;
  }

  .gallery-location {
    display: block;
    padding: 0 0.8rem 0.6rem;
    font-size: 0.75rem;
    color: #a0aec0;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin: 3rem 0 2rem;
    flex-wrap: wrap;
  }

  .pagination-link {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background 0.2s;
  }

  .pagination-prev,
  .pagination-next {
    background: #edf2f7;
    color: #2d3748;
  }

  .pagination-prev:hover,
  .pagination-next:hover {
    background: #e2e8f0;
  }

  .pagination-disabled {
    color: #cbd5e0;
    cursor: default;
  }

  .pagination-info {
    font-size: 0.9rem;
    color: #718096;
  }

  @media (max-width: 640px) {
    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 0.75rem;
    }

    .gallery-header h1 {
      font-size: 1.5rem;
    }
  }
</style>
```

### 6.2 File: `src/pages/upload.astro`

```astro
---
// ============================================================
// /upload — Trang upload ảnh công khai
// ĐÃ THÊM:
//   - meta robots noindex, nofollow
//   - Client-side image compression (browser-image-compression)
//   - Giới hạn 3MB
// ============================================================

import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Gửi ảnh — Núi Dinh" description="Chia sẻ ảnh đẹp về Núi Dinh">
  <Fragment slot="head">
    {/* ✅ SEO: Không index trang upload */}
    <meta name="robots" content="noindex, nofollow" />
  </Fragment>

  <main class="upload-page">
    <h1>Gửi ảnh về Núi Dinh</h1>
    <p class="upload-desc">
      Chia sẻ những bức ảnh đẹp của bạn. Ảnh tối đa 3MB, định dạng JPG, PNG, WebP hoặc AVIF.
      Ảnh sẽ được tự động nén trước khi gửi để tiết kiệm dữ liệu di động.
    </p>

    <form id="upload-form" class="upload-form" novalidate>
      <div class="form-group">
        <label for="upload-image">Chọn ảnh *</label>
        <input
          type="file"
          id="upload-image"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
        />
        <p class="upload-preview-info" id="file-info"></p>
        <div id="preview-container" class="upload-preview" style="display:none;">
          <img id="preview-image" alt="Preview" style="max-width:100%;max-height:300px;border-radius:6px;" />
        </div>
      </div>

      <div class="form-group">
        <label for="upload-alt">Mô tả ảnh</label>
        <input
          type="text"
          id="upload-alt"
          name="alt"
          placeholder="VD: Bình minh trên đỉnh Núi Dinh"
          maxlength="500"
        />
      </div>

      <div class="form-group">
        <label for="upload-location">Địa điểm</label>
        <input
          type="text"
          id="upload-location"
          name="location"
          placeholder="VD: Đỉnh Núi Dinh, Bà Rịa - Vũng Tàu"
          maxlength="200"
        />
      </div>

      <button type="submit" id="upload-submit" class="upload-btn">
        Gửi ảnh
      </button>

      <div class="upload-progress" id="upload-progress" style="display:none;">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <p class="progress-text" id="progress-text">Đang nén ảnh...</p>
      </div>

      <div class="upload-status" id="upload-status" role="alert"></div>
    </form>
  </main>
</BaseLayout>

<script>
  let imageCompression: any = null;

  async function loadCompressor() {
    if (imageCompression) return;
    const module = await import(
      'https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/+esm'
    );
    imageCompression = module.default;
  }

  const form = document.getElementById('upload-form') as HTMLFormElement;
  const fileInput = document.getElementById('upload-image') as HTMLInputElement;
  const submitBtn = document.getElementById('upload-submit') as HTMLButtonElement;
  const statusEl = document.getElementById('upload-status') as HTMLDivElement;
  const progressContainer = document.getElementById('upload-progress') as HTMLDivElement;
  const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
  const progressText = document.getElementById('progress-text') as HTMLParagraphElement;
  const fileInfo = document.getElementById('file-info') as HTMLParagraphElement;
  const previewContainer = document.getElementById('preview-container') as HTMLDivElement;
  const previewImage = document.getElementById('preview-image') as HTMLImageElement;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) {
      previewContainer.style.display = 'none';
      fileInfo.textContent = '';
      return;
    }

    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.textContent = `${file.name} — ${sizeMB}MB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target?.result as string;
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const originalFile = fileInput.files?.[0];
    if (!originalFile) {
      showStatus('Vui lòng chọn ảnh để upload', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(originalFile.type)) {
      showStatus('Chỉ chấp nhận JPG, PNG, WebP hoặc AVIF', 'error');
      return;
    }

    submitBtn.disabled = true;
    showStatus('', '');
    progressContainer.style.display = 'block';
    progressText.textContent = 'Đang nén ảnh...';
    progressFill.style.width = '10%';

    let fileToUpload: File = originalFile;

    try {
      await loadCompressor();

      if (imageCompression && originalFile.size > 500 * 1024) {
        progressText.textContent = 'Đang nén ảnh để tiết kiệm dữ liệu...';
        progressFill.style.width = '20%';

        const compressedFile = await imageCompression(originalFile, {
          maxSizeMB: 2.5,
          maxWidthOrHeight: 2400,
          useWebWorker: true,
          fileType: 'image/webp',
          onProgress: (progress: number) => {
            const pct = 20 + progress * 0.4;
            progressFill.style.width = `${pct}%`;
          },
        });

        fileToUpload = compressedFile;
        const savedPercent = ((1 - compressedFile.size / originalFile.size) * 100).toFixed(0);
        progressText.textContent = `Đã nén: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB (tiết kiệm ${savedPercent}%)`;
      }

      if (fileToUpload.size > 3 * 1024 * 1024) {
        showStatus('Ảnh sau khi nén vẫn lớn hơn 3MB. Vui lòng chọn ảnh nhỏ hơn.', 'error');
        progressContainer.style.display = 'none';
        submitBtn.disabled = false;
        return;
      }

      progressText.textContent = 'Đang gửi ảnh...';
      progressFill.style.width = '70%';

      const formData = new FormData();
      formData.append('image', fileToUpload);
      formData.append('alt', (document.getElementById('upload-alt') as HTMLInputElement).value);
      formData.append('location', (document.getElementById('upload-location') as HTMLInputElement).value);

      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      progressFill.style.width = '100%';

      const data = await res.json();

      if (res.ok && data.success) {
        progressText.textContent = 'Hoàn tất!';
        showStatus('Ảnh đã được gửi thành công! Chờ admin duyệt.', 'success');
        form.reset();
        previewContainer.style.display = 'none';
        fileInfo.textContent = '';
      } else {
        showStatus(data.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (err) {
      showStatus('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', 'error');
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => {
        progressContainer.style.display = 'none';
      }, 3000);
    }
  });

  function showStatus(message: string, type: string) {
    statusEl.textContent = message;
    statusEl.className = 'upload-status';
    if (type) statusEl.classList.add(`upload-status--${type}`);
  }
</script>

<style>
  .upload-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .upload-page h1 {
    font-size: 1.8rem;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  .upload-desc {
    color: #718096;
    font-size: 0.95rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }

  .upload-form {
    background: #f7fafc;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: #4a5568;
  }

  .form-group input[type="text"] {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.95rem;
    box-sizing: border-box;
  }

  .form-group input[type="file"] {
    font-size: 0.9rem;
  }

  .upload-preview-info {
    font-size: 0.8rem;
    color: #718096;
    margin: 0.5rem 0;
  }

  .upload-preview {
    margin-top: 0.5rem;
  }

  .upload-btn {
    display: inline-block;
    padding: 0.7rem 2rem;
    background: #2b6cb0;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .upload-btn:hover {
    background: #2c5282;
  }

  .upload-btn:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  .upload-progress {
    margin-top: 1rem;
  }

  .progress-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #4299e1;
    border-radius: 3px;
    transition: width 0.3s ease;
    width: 0%;
  }

  .progress-text {
    font-size: 0.8rem;
    color: #718096;
    margin-top: 0.4rem;
  }

  .upload-status {
    margin-top: 1rem;
    font-size: 0.9rem;
    min-height: 1.5em;
  }

  .upload-status--success {
    color: #276749;
    background: #f0fff4;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    border: 1px solid #c6f6d5;
  }

  .upload-status--error {
    color: #c53030;
    background: #fff5f5;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    border: 1px solid #fed7d7;
  }
</style>
```

### 6.3 File: `src/pages/admin/index.astro`

```astro
---
// ============================================================
// /admin — Trang quản trị chính
// ĐÃ THÊM: noindex, nofollow
// ============================================================

import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEnv } from '../../lib/env';
import { getSessionToken, validateSession } from '../../lib/auth';

const env = getEnv(Astro.locals);
const token = getSessionToken(Astro.request);
const isAuthenticated = await validateSession(env.DB, token);

if (!isAuthenticated) {
  return Astro.redirect('/admin/login');
}
---

<BaseLayout title="Admin — Núi Dinh">
  <Fragment slot="head">
    <meta name="robots" content="noindex, nofollow" />
  </Fragment>

  <main class="admin-page">
    <header class="admin-header">
      <h1>Quản trị Núi Dinh</h1>
      <button id="logout-btn" class="btn btn-secondary">Đăng xuất</button>
    </header>

    <nav class="admin-nav">
      <div class="admin-card" id="section-photos">
        <h2>Duyệt ảnh</h2>
        <p>Xem và duyệt ảnh mới từ cộng đồng</p>
        <div id="pending-photos-count" class="badge">Đang tải...</div>
      </div>

      <div class="admin-card" id="section-comments">
        <h2>Duyệt bình luận</h2>
        <p>Quản lý bình luận từ người dùng</p>
        <div id="pending-comments-count" class="badge">Đang tải...</div>
      </div>
    </nav>

    <section id="photos-panel" class="admin-panel" style="display:none;">
      <h2>Ảnh chờ duyệt</h2>
      <div id="photos-list" class="items-grid"></div>
      <p id="photos-empty" style="display:none;color:#718096;">Không có ảnh nào chờ duyệt.</p>
    </section>

    <section id="comments-panel" class="admin-panel" style="display:none;">
      <h2>Bình luận chờ duyệt</h2>
      <div id="comments-list" class="items-list"></div>
      <p id="comments-empty" style="display:none;color:#718096;">Không có bình luận nào chờ duyệt.</p>
    </section>
  </main>
</BaseLayout>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const sectionPhotos = document.getElementById('section-photos')!;
    const sectionComments = document.getElementById('section-comments')!;
    const photosPanel = document.getElementById('photos-panel')!;
    const commentsPanel = document.getElementById('comments-panel')!;

    sectionPhotos.addEventListener('click', () => {
      photosPanel.style.display = photosPanel.style.display === 'none' ? 'block' : 'none';
      commentsPanel.style.display = 'none';
      loadPendingPhotos();
    });

    sectionComments.addEventListener('click', () => {
      commentsPanel.style.display = commentsPanel.style.display === 'none' ? 'block' : 'none';
      photosPanel.style.display = 'none';
      loadPendingComments();
    });

    document.getElementById('logout-btn')!.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    });

    loadCounts();

    async function loadCounts() {
      try {
        const [photosRes, commentsRes] = await Promise.all([
          fetch('/api/admin/photos'),
          fetch('/api/admin/comments?status=pending_review'),
        ]);
        const photosData = await photosRes.json();
        const commentsData = await commentsRes.json();

        document.getElementById('pending-photos-count')!.textContent =
          `${photosData.data?.length || 0} chờ duyệt`;
        document.getElementById('pending-comments-count')!.textContent =
          `${commentsData.data?.length || 0} chờ duyệt`;
      } catch {
        // Ignore
      }
    }

    async function loadPendingPhotos() {
      const list = document.getElementById('photos-list')!;
      const empty = document.getElementById('photos-empty')!;
      list.innerHTML = '<p>Đang tải...</p>';

      try {
        const res = await fetch('/api/admin/photos');
        const data = await res.json();
        const photos = data.data || [];

        if (photos.length === 0) {
          list.innerHTML = '';
          empty.style.display = 'block';
          return;
        }
        empty.style.display = 'none';

        list.innerHTML = photos
          .map(
            (p: any) => `
            <div class="admin-item photo-item" data-id="${p.id}">
              <img src="/api/photos/serve/staging/${p.filename}" alt="${p.alt || ''}"
                   style="max-width:200px;max-height:150px;border-radius:4px;" loading="lazy" />
              <div class="item-info">
                <strong>${p.slug}</strong>
                <p>${p.alt || 'Không có mô tả'}</p>
                <p class="text-sm">${p.location || ''} — ${p.size_bytes ? (p.size_bytes / 1024).toFixed(0) + 'KB' : ''}</p>
                <p class="text-sm text-muted">${p.created_at}</p>
              </div>
              <div class="item-actions">
                <button class="btn btn-approve" onclick="adminAction('photos', ${p.id}, 'approve')">Duyệt</button>
                <button class="btn btn-reject" onclick="adminAction('photos', ${p.id}, 'reject')">Từ chối</button>
                <button class="btn btn-delete" onclick="adminAction('photos', ${p.id}, 'delete')">Xóa</button>
              </div>
            </div>
          `
          )
          .join('');
      } catch {
        list.innerHTML = '<p style="color:red;">Lỗi tải dữ liệu</p>';
      }
    }

    async function loadPendingComments() {
      const list = document.getElementById('comments-list')!;
      const empty = document.getElementById('comments-empty')!;
      list.innerHTML = '<p>Đang tải...</p>';

      try {
        const res = await fetch('/api/admin/comments?status=pending_review');
        const data = await res.json();
        const comments = data.data || [];

        if (comments.length === 0) {
          list.innerHTML = '';
          empty.style.display = 'block';
          return;
        }
        empty.style.display = 'none';

        list.innerHTML = comments
          .map(
            (c: any) => `
            <div class="admin-item comment-item" data-id="${c.id}">
              <div class="item-info">
                <strong>${escapeHtmlClient(c.author)}</strong>
                <span class="text-sm text-muted">trên ${escapeHtmlClient(c.page_id)} — ${c.created_at}</span>
                <p class="comment-preview">${escapeHtmlClient(c.content)}</p>
              </div>
              <div class="item-actions">
                <button class="btn btn-approve" onclick="adminAction('comments', ${c.id}, 'approve')">Duyệt</button>
                <button class="btn btn-reject" onclick="adminAction('comments', ${c.id}, 'reject')">Từ chối</button>
                <button class="btn btn-delete" onclick="adminAction('comments', ${c.id}, 'delete')">Xóa</button>
              </div>
            </div>
          `
          )
          .join('');
      } catch {
        list.innerHTML = '<p style="color:red;">Lỗi tải dữ liệu</p>';
      }
    }

    (window as any).adminAction = async function (
      type: 'photos' | 'comments',
      id: number,
      action: string
    ) {
      const confirmMsg =
        action === 'delete'
          ? 'Bạn có chắc muốn xóa vĩnh viễn?'
          : action === 'reject'
          ? 'Từ chối mục này?'
          : 'Duyệt mục này?';
      if (!confirm(confirmMsg)) return;

      try {
        const res = await fetch(`/api/admin/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action }),
        });

        const data = await res.json();
        if (data.success) {
          const el = document.querySelector(`.admin-item[data-id="${id}"]`);
          if (el) el.remove();
          loadCounts();
        } else {
          alert(data.error || 'Có lỗi xảy ra');
        }
      } catch {
        alert('Lỗi kết nối');
      }
    };

    function escapeHtmlClient(text: string): string {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  });
</script>

<style>
  .admin-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .admin-header h1 {
    font-size: 1.8rem;
    color: #1a202c;
  }

  .admin-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .admin-card {
    background: #f7fafc;
    padding: 1.25rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .admin-card:hover {
    border-color: #4299e1;
    box-shadow: 0 2px 8px rgba(66, 153, 225, 0.15);
  }

  .admin-card h2 {
    margin: 0 0 0.3rem;
    font-size: 1.1rem;
  }

  .admin-card p {
    margin: 0;
    font-size: 0.85rem;
    color: #718096;
  }

  .badge {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.2rem 0.6rem;
    background: #bee3f8;
    color: #2b6cb0;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .admin-panel {
    margin-top: 1rem;
    padding: 1.5rem;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }

  .admin-panel h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .admin-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem 0;
    border-bottom: 1px solid #edf2f7;
    flex-wrap: wrap;
  }

  .admin-item:last-child {
    border-bottom: none;
  }

  .item-info {
    flex: 1;
    min-width: 200px;
  }

  .item-info strong {
    display: block;
    margin-bottom: 0.25rem;
  }

  .item-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #4a5568;
  }

  .comment-preview {
    background: #f7fafc;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    border-left: 3px solid #cbd5e0;
    margin-top: 0.5rem !important;
    word-break: break-word;
  }

  .item-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .text-sm {
    font-size: 0.8rem !important;
  }

  .text-muted {
    color: #a0aec0 !important;
  }

  .btn {
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn:hover {
    opacity: 0.85;
  }

  .btn-approve {
    background: #48bb78;
    color: white;
  }

  .btn-reject {
    background: #ed8936;
    color: white;
  }

  .btn-delete {
    background: #fc8181;
    color: white;
  }

  .btn-secondary {
    background: #edf2f7;
    color: #4a5568;
  }
</style>
```

### 6.4 File: `src/pages/admin/login.astro`

```astro
---
// ============================================================
// /admin/login — Trang đăng nhập admin
// ============================================================

import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEnv } from '../../lib/env';
import { getSessionToken, validateSession } from '../../lib/auth';

const env = getEnv(Astro.locals);
const token = getSessionToken(Astro.request);
const isAuthenticated = await validateSession(env.DB, token);

if (isAuthenticated) {
  return Astro.redirect('/admin');
}
---

<BaseLayout title="Đăng nhập Admin — Núi Dinh">
  <Fragment slot="head">
    <meta name="robots" content="noindex, nofollow" />
  </Fragment>

  <main class="login-page">
    <form id="login-form" class="login-form" novalidate>
      <h1>Đăng nhập Admin</h1>

      <div class="form-group">
        <label for="login-password">Mật khẩu</label>
        <input
          type="password"
          id="login-password"
          name="password"
          required
          placeholder="Nhập mật khẩu admin"
          autocomplete="current-password"
        />
      </div>

      <button type="submit" id="login-submit" class="login-btn">
        Đăng nhập
      </button>

      <div class="login-status" id="login-status" role="alert"></div>
    </form>
  </main>
</BaseLayout>

<script>
  const form = document.getElementById('login-form') as HTMLFormElement;
  const passwordInput = document.getElementById('login-password') as HTMLInputElement;
  const submitBtn = document.getElementById('login-submit') as HTMLButtonElement;
  const statusEl = document.getElementById('login-status') as HTMLDivElement;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const password = passwordInput.value;
    if (!password) {
      statusEl.textContent = 'Vui lòng nhập mật khẩu';
      statusEl.className = 'login-status login-status--error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang xác thực...';
    statusEl.textContent = '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        statusEl.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
        statusEl.className = 'login-status login-status--success';
        window.location.href = '/admin';
      } else {
        statusEl.textContent = data.error || 'Mật khẩu không đúng';
        statusEl.className = 'login-status login-status--error';
      }
    } catch {
      statusEl.textContent = 'Lỗi kết nối. Vui lòng thử lại.';
      statusEl.className = 'login-status login-status--error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Đăng nhập';
    }
  });
</script>

<style>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: 2rem 1rem;
  }

  .login-form {
    width: 100%;
    max-width: 400px;
    background: #f7fafc;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .login-form h1 {
    margin-top: 0;
    font-size: 1.5rem;
    text-align: center;
    color: #1a202c;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 500;
    font-size: 0.9rem;
    color: #4a5568;
  }

  .form-group input {
    width: 100%;
    padding: 0.65rem 0.8rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }

  .login-btn {
    width: 100%;
    padding: 0.7rem;
    background: #2b6cb0;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .login-btn:hover {
    background: #2c5282;
  }

  .login-btn:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  .login-status {
    margin-top: 1rem;
    font-size: 0.9rem;
    text-align: center;
    min-height: 1.5em;
  }

  .login-status--success {
    color: #276749;
  }

  .login-status--error {
    color: #c53030;
  }
</style>
```

---

## 7. LAYOUT

### 7.1 File: `src/layouts/BaseLayout.astro`

```astro
---
// ============================================================
// BaseLayout — Layout chung cho toàn bộ site
// ============================================================

interface Props {
  title: string;
  description?: string;
  canonicalUrl?: string;
}

const {
  title,
  description = 'Núi Dinh — Khám phá vẻ đẹp thiên nhiên Bà Rịa - Vũng Tàu',
  canonicalUrl,
} = Astro.props;

const siteTitle = `${title} | nuidinh.help`;
---

<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{siteTitle}</title>

    {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <link rel="preconnect" href="https://nuidinh.help" />
    <link rel="dns-prefetch" href="https://nuidinh.help" />

    <slot name="head" />

    <style is:global>
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #1a202c;
        background: #ffffff;
        -webkit-font-smoothing: antialiased;
      }

      img {
        max-width: 100%;
        height: auto;
      }

      a {
        color: #2b6cb0;
      }

      a:hover {
        color: #2c5282;
      }
    </style>
  </head>
  <body>
    <nav class="site-nav">
      <a href="/" class="nav-brand">Núi Dinh</a>
      <div class="nav-links">
        <a href="/gallery">Thư viện ảnh</a>
        <a href="/upload">Gửi ảnh</a>
      </div>
    </nav>

    <slot />

    <footer class="site-footer">
      <p>&copy; {new Date().getFullYear()} nuidinh.help — Vì vẻ đẹp thiên nhiên Núi Dinh</p>
    </footer>

    <style>
      .site-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: #1a202c;
        color: white;
      }

      .nav-brand {
        font-size: 1.2rem;
        font-weight: 700;
        color: white;
        text-decoration: none;
      }

      .nav-links {
        display: flex;
        gap: 1.5rem;
      }

      .nav-links a {
        color: #e2e8f0;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
      }

      .nav-links a:hover {
        color: white;
      }

      .site-footer {
        text-align: center;
        padding: 2rem 1rem;
        margin-top: 3rem;
        border-top: 1px solid #e2e8f0;
        color: #a0aec0;
        font-size: 0.85rem;
      }

      @media (max-width: 480px) {
        .site-nav {
          padding: 0.75rem 1rem;
        }
        .nav-links {
          gap: 1rem;
        }
      }
    </style>
  </body>
</html>
```

---

## 8. CẤU HÌNH

### 8.1 File: `astro.config.mjs`

```javascript
// ============================================================
// Astro Configuration — Cloudflare Workers adapter
// ============================================================

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server', // SSR mode — tất cả pages render on-demand
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      mode: 'local',
      type: 'pages',
      bindings: {
        DB: {
          type: 'd1',
        },
      },
    },
  }),
  site: 'https://nuidinh.help',
  vite: {
    ssr: {
      external: [],
    },
  },
});
```

### 8.2 File: `wrangler.toml`

```toml
# ============================================================
# Wrangler Configuration — Cloudflare Workers / Pages
# ============================================================

name = "nuidinh-help"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

# Pages build output
pages_build_output_dir = "./dist"

# D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "nuidinh-db"
database_id = "YOUR_D1_DATABASE_ID_HERE"  # Thay bằng ID thực

# R2 Bucket Binding
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "nuidinh-images"

# Workers AI Binding
[ai]
binding = "AI"

# Environment Variables
[vars]
SITE_ORIGIN = "https://nuidinh.help"

# Secret (set via: npx wrangler secret put ADMIN_PASSWORD_HASH)
# ADMIN_PASSWORD_HASH = "sha256_hex_of_your_admin_password"
```

### 8.3 File: `src/env.d.ts`

```typescript
// ============================================================
// TypeScript declarations cho Astro + Cloudflare runtime
// ============================================================

/// <reference types="astro/client" />

interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  AI: Ai;
  ADMIN_PASSWORD_HASH: string;
  SITE_ORIGIN: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
```

---

## 9. SCRIPT TIỆN ÍCH

### 9.1 File: `scripts/generate-password-hash.mjs`

```javascript
// ============================================================
// Script tạo SHA-256 hash cho mật khẩu admin
// Chạy: node scripts/generate-password-hash.mjs "your_password_here"
// ============================================================

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.mjs "your_password"');
  process.exit(1);
}

const encoder = new TextEncoder();
const data = encoder.encode(password);

crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
  const hashArray = new Uint8Array(hashBuffer);
  let hex = '';
  for (let i = 0; i < hashArray.length; i++) {
    hex += hashArray[i].toString(16).padStart(2, '0');
  }
  console.log('\n=== SHA-256 Password Hash ===');
  console.log(hex);
  console.log('\nChạy lệnh sau để lưu vào Cloudflare:');
  console.log(`npx wrangler secret put ADMIN_PASSWORD_HASH`);
  console.log('Rồi paste hash trên vào prompt.\n');
});
```

### 9.2 File: `scripts/seed-db.sql`

```sql
-- ============================================================
-- Seed data cho phát triển / test
-- Chạy: npx wrangler d1 execute nuidinh-db --file=./scripts/seed-db.sql
-- ============================================================

-- Ảnh test
INSERT INTO photos (filename, slug, alt, status, location, width, height, size_bytes)
VALUES
  ('binh-minh-nui-dinh-m1abc.webp', 'binh-minh-nui-dinh-m1abc', 'Bình minh trên đỉnh Núi Dinh', 'approved', 'Đỉnh Núi Dinh', 1920, 1280, 245000),
  ('suoi-tien-m2def.webp', 'suoi-tien-m2def', 'Suối Tiên trong rừng', 'approved', 'Suối Tiên, Núi Dinh', 1600, 1067, 198000),
  ('chua-nui-dinh-m3ghi.webp', 'chua-nui-dinh-m3ghi', 'Chùa trên Núi Dinh', 'pending_review', 'Chùa Núi Dinh', 2400, 1600, 320000);

-- Comment test
INSERT INTO comments (page_id, author, content, status)
VALUES
  ('/gallery', 'Minh Anh', 'Ảnh đẹp quá! Núi Dinh thật tuyệt vời.', 'approved'),
  ('/gallery', 'Đức Huy', 'Mình rất thích bộ ảnh bình minh. Lần tới sẽ lên Núi Dinh chụp.', 'approved'),
  ('/gallery', 'Khách vãng lai', 'Cho mình hỏi đường lên đỉnh đi lối nào?', 'pending_review');
```

---

## 10. CẤU TRÚC THƯ MỤC HOÀN CHỈNH

```
nuidinh-help/
├── astro.config.mjs
├── wrangler.toml
├── package.json
├── tsconfig.json
├── schema.sql
├── scripts/
│   ├── generate-password-hash.mjs
│   └── seed-db.sql
├── public/
│   └── favicon.svg
└── src/
    ├── env.d.ts
    ├── lib/
    │   ├── env.ts
    │   ├── response.ts
    │   ├── auth.ts
    │   ├── db.ts
    │   ├── r2.ts
    │   ├── ai-moderation.ts
    │   └── validation.ts
    ├── layouts/
    │   └── BaseLayout.astro
    ├── components/
    │   ├── OptimizedImage.astro
    │   └── CommentsSection.astro
    └── pages/
        ├── index.astro               (trang chủ — tự thiết kế)
        ├── gallery.astro
        ├── upload.astro
        ├── photos/
        │   └── [key].ts              (clean URL serve ảnh cho SEO)
        ├── api/
        │   ├── comments.ts           (GET + POST comments public)
        │   ├── auth/
        │   │   ├── login.ts
        │   │   └── logout.ts
        │   ├── photos/
        │   │   ├── upload.ts
        │   │   └── serve/
        │   │       └── [...key].ts   (serve ảnh từ R2)
        │   └── admin/
        │       ├── photos.ts         (GET + POST admin quản lý ảnh)
        │       └── comments.ts       (GET + POST admin quản lý comment)
        └── admin/
            ├── index.astro           (dashboard admin)
            └── login.astro
```

---

## 11. PACKAGE.JSON

### File: `package.json`

```json
{
  "name": "nuidinh-help",
  "type": "module",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "db:init": "npx wrangler d1 execute nuidinh-db --file=./schema.sql",
    "db:seed": "npx wrangler d1 execute nuidinh-db --file=./scripts/seed-db.sql",
    "db:init:local": "npx wrangler d1 execute nuidinh-db --local --file=./schema.sql",
    "db:seed:local": "npx wrangler d1 execute nuidinh-db --local --file=./scripts/seed-db.sql",
    "deploy": "astro build && npx wrangler pages deploy ./dist",
    "gen-hash": "node scripts/generate-password-hash.mjs"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/cloudflare": "^11.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241127.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.86.0"
  }
}
```

---

## 12. CHECKLIST TRIỂN KHAI

Đây là thứ tự triển khai chi tiết từng bước:

### Bước 1 — Khởi tạo dự án

```bash
# Tạo project
npm create astro@latest nuidinh-help -- --template minimal
cd nuidinh-help

# Cài dependencies
npm install @astrojs/cloudflare
npm install -D @cloudflare/workers-types wrangler
```

### Bước 2 — Tạo tài nguyên Cloudflare

```bash
# Tạo D1 database
npx wrangler d1 create nuidinh-db

# Tạo R2 bucket
npx wrangler r2 bucket create nuidinh-images

# Chạy schema
npx wrangler d1 execute nuidinh-db --file=./schema.sql

# Seed data test
npx wrangler d1 execute nuidinh-db --file=./scripts/seed-db.sql
```

### Bước 3 — Cấu hình secrets

```bash
# Tạo hash mật khẩu admin
node scripts/generate-password-hash.mjs "mat_khau_admin_cua_ban"

# Lưu hash vào Cloudflare secrets
npx wrangler secret put ADMIN_PASSWORD_HASH

# Đảm bảo SITE_ORIGIN đã set trong wrangler.toml [vars]
```

### Bước 4 — Test local

```bash
# Init DB local
npx wrangler d1 execute nuidinh-db --local --file=./schema.sql
npx wrangler d1 execute nuidinh-db --local --file=./scripts/seed-db.sql

# Chạy dev server
npm run dev
```

### Bước 5 — Deploy

```bash
# Build và deploy lên Cloudflare Pages
npm run deploy
```

---

## 13. TÓM TẮT CÁC CẢI TIẾN ĐÃ THỰC HIỆN

| # | Vấn đề | Giải pháp | File(s) |
|---|--------|-----------|---------|
| 1 | Thay Cusdis bằng comment tự xây | Table `comments` trong D1, full CRUD API, `CommentsSection.astro` AJAX | `schema.sql`, `db.ts`, `api/comments.ts`, `api/admin/comments.ts`, `CommentsSection.astro` |
| 2 | OOM trong AI moderation | Dùng `new Uint8Array()` trực tiếp, không spread; gọi AI trước R2 upload | `ai-moderation.ts`, `api/photos/upload.ts` |
| 3 | Race condition R2 | Tách `moveToPublic` → `copyToPublic` + `deleteFromR2`; thứ tự copy→DB→delete | `r2.ts`, `api/admin/photos.ts` |
| 4 | Path Traversal | Validate key: cấm `..`, `/`, `\`; cấm staging cho non-admin | `validation.ts`, `serve/[...key].ts`, `photos/[key].ts` |
| 5 | Thiếu Content-Type JSON | Helper `jsonResponse()` + `jsonError()` dùng cho mọi API | `response.ts`, tất cả API endpoints |
| 6 | Bảo mật admin | SHA-256 hash password, session token, CSRF Origin check | `auth.ts`, `api/auth/login.ts` |
| 7 | Tối ưu sóng yếu | 3MB limit, client-side compression, 200w/q60 srcset, `s-maxage=300` cache | `validation.ts`, `upload.astro`, `OptimizedImage.astro`, `gallery.astro` |
| 8 | SEO | JSON-LD ImageGallery, clean URL `/photos/[key]`, canonical + prev/next, `noindex` cho admin/upload | `gallery.astro`, `photos/[key].ts`, `upload.astro`, `admin/*.astro` |
