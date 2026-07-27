# KẾ HOẠCH KIỂM THỬ CHẤT LƯỢNG (QC TEST PLAN) v2.0

## Hệ thống Tương tác Hình ảnh & Bình luận — nuidinh.help

---

## MỤC LỤC

> **Phần 1** — Tổng quan & Phạm vi kiểm thử
> **Phần 2** — Database D1: Photos & Comments & Admin Sessions
> **Phần 3** — R2 Storage & Serve Routes
> **Phần 4** — AI Moderation (Workers AI)
> **Phần 5** — Security (Auth, CSRF, Input Validation, Path Traversal)
> **Phần 6** — Hiệu năng Sóng yếu (Compression, Caching, srcset)
> **Phần 7** — SEO (JSON-LD, Clean URLs, Robots)
> **Phần 8** — Integration & End-to-End Scenarios
> **Phần 9** — Regression Checklist & Sign-off Criteria

---

## PHẦN 1 — TỔNG QUAN & PHẠM VI KIỂM THỬ

### 1.1. Mục tiêu

Đảm bảo **100% chức năng, bảo mật, hiệu năng và SEO** của hệ thống Tương tác Hình ảnh & Bình luận trên `nuidinh.help` hoạt động đúng theo Kế hoạch Triển khai v2.0 trước khi đưa vào production.

### 1.2. Môi trường kiểm thử

```
Production URL  : https://nuidinh.help
Staging URL     : https://staging.nuidinh.help (nếu có)
Công cụ chính   : Chrome DevTools (Network, Console, Lighthouse, Application)
                  cURL / HTTPie (CLI testing)
                  Wrangler CLI (D1 & R2 inspection)
Trình duyệt     : Chrome 120+, Firefox 121+, Safari 17+, Samsung Internet
Thiết bị        : Desktop, Mobile (Android + iOS), Throttle 3G/Slow 4G
```

### 1.3. Quy ước ký hiệu

```
✅ PASS   — Kết quả khớp với Expected Result
❌ FAIL   — Kết quả lệch với Expected Result, tạo bug ticket
⚠️ BLOCK  — Không thể test do dependency chưa sẵn sàng
🔄 RETEST — Đã fix bug, cần kiểm tra lại
```

---

## PHẦN 2 — DATABASE D1: PHOTOS, COMMENTS, ADMIN_SESSIONS

### 2.1. Schema Integrity Tests

#### TC-D1-001: Kiểm tra bảng `photos` tồn tại với đầy đủ cột

```bash
# Lệnh test qua Wrangler CLI
npx wrangler d1 execute nuidinh-db --command \
  "PRAGMA table_info(photos);"
```

**Expected Result:**

```
┌─────┬─────────────┬─────────┬─────────┬──────────┐
│ cid │ name        │ type    │ notnull │ dflt_val │
├─────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ id          │ INTEGER │ 1       │ NULL     │
│ 1   │ filename    │ TEXT    │ 1       │ NULL     │
│ 2   │ slug        │ TEXT    │ 1       │ NULL     │
│ 3   │ alt         │ TEXT    │ 0       │ NULL     │
│ 4   │ status      │ TEXT    │ 1       │ NULL     │
│ 5   │ location    │ TEXT    │ 0       │ NULL     │
│ 6   │ size_bytes  │ INTEGER │ 0       │ NULL     │
│ 7   │ created_at  │ TEXT    │ 0       │ NULL     │
└─────┴─────────────┴─────────┴─────────┴──────────┘
```

**Pass Criteria:** Tất cả các cột `filename, slug, alt, status, location, size_bytes` phải tồn tại. Cột `slug` phải là UNIQUE.

---

#### TC-D1-002: Kiểm tra bảng `comments` tồn tại với đầy đủ cột

```bash
npx wrangler d1 execute nuidinh-db --command \
  "PRAGMA table_info(comments);"
```

**Expected Result:** Các cột `page_id, author, content, status` tồn tại, `page_id` và `author` là NOT NULL.

**Pass Criteria:** Schema khớp thiết kế. Cột `status` có default value là `'pending'`.

---

#### TC-D1-003: Kiểm tra bảng `admin_sessions` tồn tại với đầy đủ cột

```bash
npx wrangler d1 execute nuidinh-db --command \
  "PRAGMA table_info(admin_sessions);"
```

**Expected Result:** Các cột `token` (TEXT, UNIQUE, NOT NULL) và `expires_at` (TEXT/INTEGER, NOT NULL) tồn tại.

**Pass Criteria:** Token phải là UNIQUE, `expires_at` phải NOT NULL.

---

### 2.2. CRUD Operations Tests

#### TC-D1-004: INSERT ảnh mới vào bảng `photos`

```bash
npx wrangler d1 execute nuidinh-db --command \
  "INSERT INTO photos (filename, slug, alt, status, location, size_bytes)
   VALUES ('test-001.webp', 'test-001', 'Ảnh test núi Dinh', 'pending', 'Núi Dinh, BRVT', 245000);
   SELECT * FROM photos WHERE slug = 'test-001';"
```

**Expected Result:** Bản ghi được tạo thành công, trả về đúng giá trị đã insert.

**Pass Criteria:** `status = 'pending'`, `size_bytes = 245000`, `slug = 'test-001'`.

---

#### TC-D1-005: Kiểm tra UNIQUE constraint trên `slug`

```bash
npx wrangler d1 execute nuidinh-db --command \
  "INSERT INTO photos (filename, slug, alt, status, location, size_bytes)
   VALUES ('duplicate.webp', 'test-001', 'Ảnh trùng slug', 'pending', 'Test', 100000);"
```

**Expected Result:** Query thất bại với lỗi `UNIQUE constraint failed: photos.slug`.

**Pass Criteria:** Database từ chối bản ghi trùng slug.

---

#### TC-D1-006: INSERT comment mới vào bảng `comments`

```bash
npx wrangler d1 execute nuidinh-db --command \
  "INSERT INTO comments (page_id, author, content, status)
   VALUES ('gallery-nui-dinh', 'Người dùng A', 'Ảnh đẹp quá!', 'pending');
   SELECT * FROM comments WHERE author = 'Người dùng A';"
```

**Expected Result:** Bản ghi tạo thành công, `status = 'pending'`.

**Pass Criteria:** Hỗ trợ đúng Unicode tiếng Việt (có dấu), `status` mặc định là `'pending'`.

---

#### TC-D1-007: UPDATE trạng thái photo từ `pending` → `approved`

```bash
npx wrangler d1 execute nuidinh-db --command \
  "UPDATE photos SET status = 'approved' WHERE slug = 'test-001';
   SELECT slug, status FROM photos WHERE slug = 'test-001';"
```

**Expected Result:** `status` chuyển thành `'approved'`.

---

#### TC-D1-008: DELETE comment theo ID

```bash
npx wrangler d1 execute nuidinh-db --command \
  "DELETE FROM comments WHERE id = 1;
   SELECT COUNT(*) as remaining FROM comments WHERE id = 1;"
```

**Expected Result:** `remaining = 0`.

---

### 2.3. Admin Sessions Tests

#### TC-D1-009: Tạo session mới và kiểm tra expiry

```bash
npx wrangler d1 execute nuidinh-db --command \
  "INSERT INTO admin_sessions (token, expires_at)
   VALUES ('abc123tokenxyz', datetime('now', '+24 hours'));
   SELECT token, expires_at FROM admin_sessions WHERE token = 'abc123tokenxyz';"
```

**Expected Result:** Session tạo thành công, `expires_at` là 24 giờ sau thời điểm hiện tại.

---

#### TC-D1-010: Kiểm tra query session hết hạn

```bash
npx wrangler d1 execute nuidinh-db --command \
  "INSERT INTO admin_sessions (token, expires_at)
   VALUES ('expired-token-111', datetime('now', '-1 hour'));
   SELECT COUNT(*) as valid FROM admin_sessions
   WHERE token = 'expired-token-111' AND expires_at > datetime('now');"
```

**Expected Result:** `valid = 0`. Session đã hết hạn không được coi là hợp lệ.

**Pass Criteria:** Logic kiểm tra expiry phải dùng `expires_at > datetime('now')`.

---

#### TC-D1-011: Cleanup — Xoá dữ liệu test

```bash
npx wrangler d1 execute nuidinh-db --command \
  "DELETE FROM photos WHERE slug LIKE 'test-%';
   DELETE FROM comments WHERE author = 'Người dùng A';
   DELETE FROM admin_sessions WHERE token LIKE '%token%';"
```

---

## PHẦN 3 — R2 STORAGE & SERVE ROUTES

### 3.1. Upload & Bucket Structure Tests

#### TC-R2-001: Kiểm tra file upload vào `staging/`

**Kịch bản thủ công (Chrome DevTools):**

```
1. Mở https://nuidinh.help/upload
2. Bật DevTools → Tab Network
3. Chọn 1 ảnh JPG < 5MB → Submit form upload
4. Quan sát request POST tới /api/photos/upload
```

**Lệnh cURL tương đương:**

```bash
curl -X POST https://nuidinh.help/api/photos/upload \
  -H "Origin: https://nuidinh.help" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -F "file=@test-image.jpg" \
  -F "alt=Ảnh test upload" \
  -F "location=Núi Dinh" \
  -v
```

**Expected Result:**

```json
{
  "success": true,
  "key": "staging/abc123.webp",
  "message": "Ảnh đã được tải lên và đang chờ duyệt"
}
```

**Pass Criteria:**
- HTTP 200/201
- File nằm trong bucket `staging/` prefix
- Tên file được sanitize (không chứa ký tự đặc biệt, khoảng trắng)
- Response trả về JSON hợp lệ

---

#### TC-R2-002: Kiểm tra file chuyển từ `staging/` → `public/` khi duyệt

```bash
# Duyệt ảnh qua admin API
curl -X POST https://nuidinh.help/api/admin/photos/approve \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -d '{"slug": "abc123"}'
```

**Kiểm tra R2 qua Wrangler:**

```bash
# File phải tồn tại trong public/
npx wrangler r2 object get nuidinh-bucket/public/abc123.webp --pipe > /dev/null && echo "EXISTS in public/" || echo "NOT FOUND"

# File phải KHÔNG CÒN trong staging/
npx wrangler r2 object get nuidinh-bucket/staging/abc123.webp --pipe > /dev/null && echo "STILL in staging (BUG!)" || echo "Removed from staging (OK)"
```

**Pass Criteria:** File tồn tại trong `public/`, không còn trong `staging/`.

---

### 3.2. Serve Route Tests

#### TC-R2-003: Clean URL `/photos/[key]` serve ảnh public

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type} %{size_download}" \
  https://nuidinh.help/photos/abc123
```

**Expected Result:** `200 image/webp [size > 0]`

**Pass Criteria:** HTTP 200, Content-Type là `image/webp` hoặc `image/jpeg`, body không rỗng.

---

#### TC-R2-004: Clean URL trả 404 cho ảnh không tồn tại

```bash
curl -s -o /dev/null -w "%{http_code}" \
  https://nuidinh.help/photos/khong-ton-tai-xyz
```

**Expected Result:** `404`

---

#### TC-R2-005: Staging serve route — CHỈ admin mới truy cập được

```bash
# Không có session → 401/403
curl -s -o /dev/null -w "%{http_code}" \
  https://nuidinh.help/api/photos/serve/staging/abc123

# Có session hợp lệ → 200
curl -s -o /dev/null -w "%{http_code}" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  https://nuidinh.help/api/photos/serve/staging/abc123

# Có session hết hạn → 401/403
curl -s -o /dev/null -w "%{http_code}" \
  -H "Cookie: admin_session=<EXPIRED_TOKEN>" \
  https://nuidinh.help/api/photos/serve/staging/abc123
```

**Expected Result:**

```
Không session     → 401 hoặc 403
Session hợp lệ   → 200 + image body
Session hết hạn   → 401 hoặc 403
```

**Pass Criteria:** Ảnh staging KHÔNG BAO GIỜ được trả về cho người dùng không xác thực.

---

#### TC-R2-006: Serve route trả đúng Cache headers cho ảnh public

```bash
curl -sI https://nuidinh.help/photos/abc123 | grep -i "cache-control"
```

**Expected Result:** `Cache-Control: public, max-age=31536000, immutable` hoặc tương đương edge caching dài hạn.

**Pass Criteria:** Có header `Cache-Control` với `max-age` >= 86400 (1 ngày).

---

## PHẦN 4 — AI MODERATION (WORKERS AI)

### 4.1. Image Classification Tests

#### TC-AI-001: Ảnh phong cảnh hợp lệ — vượt qua AI moderation

**Kịch bản thủ công:**

```
1. Chuẩn bị ảnh phong cảnh núi Dinh (JPG, < 3MB)
2. Upload qua form /upload
3. Mở DevTools → Network → Tìm request tới /api/photos/upload
4. Kiểm tra response body
```

**Expected Result:**

```json
{
  "success": true,
  "ai_check": {
    "passed": true,
    "top_label": "mountain",
    "confidence": 0.87
  }
}
```

**Pass Criteria:** `ai_check.passed = true`, ảnh được lưu vào `staging/`.

---

#### TC-AI-002: Ảnh không phù hợp — bị AI từ chối

**Kịch bản:** Upload một ảnh mà ResNet-50 phân loại là nội dung không liên quan (ví dụ: ảnh text/screenshot, ảnh nhiễu).

```bash
curl -X POST https://nuidinh.help/api/photos/upload \
  -H "Origin: https://nuidinh.help" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -F "file=@screenshot-text.png" \
  -F "alt=Test ảnh không phù hợp" \
  -F "location=Test" \
  -v
```

**Expected Result:**

```json
{
  "success": false,
  "error": "Ảnh không vượt qua kiểm duyệt AI",
  "ai_check": {
    "passed": false,
    "top_label": "web_site",
    "confidence": 0.92
  }
}
```

**Pass Criteria:** `success = false`, file KHÔNG được lưu vào R2 bucket.

---

#### TC-AI-003: Xử lý lỗi khi Workers AI service không khả dụng

**Kịch bản:** Giả lập Workers AI timeout hoặc error (nếu có test doubles/mock), hoặc test với file có định dạng AI không hỗ trợ.

```bash
# Upload file không phải ảnh (ví dụ: .txt rename thành .jpg)
curl -X POST https://nuidinh.help/api/photos/upload \
  -H "Origin: https://nuidinh.help" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -F "file=@fake-image.jpg" \
  -F "alt=File giả" \
  -v
```

**Expected Result:** HTTP 400 hoặc 500 với thông báo lỗi rõ ràng. File KHÔNG được lưu vào R2.

**Pass Criteria:** Hệ thống xử lý graceful — không crash, không lưu file lỗi, trả error message có ý nghĩa.

---

#### TC-AI-004: Kiểm tra kích thước file vượt giới hạn

```bash
# Tạo file 15MB giả lập
dd if=/dev/urandom of=large-test.jpg bs=1M count=15

curl -X POST https://nuidinh.help/api/photos/upload \
  -H "Origin: https://nuidinh.help" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -F "file=@large-test.jpg" \
  -F "alt=File quá lớn" \
  -v
```

**Expected Result:** HTTP 413 hoặc 400 với message `"File quá lớn"` hoặc tương đương.

**Pass Criteria:** File > giới hạn cho phép bị từ chối TRƯỚC KHI gọi AI moderation (tiết kiệm tài nguyên).

---

## PHẦN 5 — SECURITY

### 5.1. Authentication & Password Hashing

#### TC-SEC-001: Mật khẩu được hash bằng SHA-256 — KHÔNG lưu plaintext

```bash
npx wrangler d1 execute nuidinh-db --command \
  "SELECT token FROM admin_sessions LIMIT 1;"
```

**Kịch bản DevTools bổ sung:**

```
1. Đăng nhập admin tại /admin/login
2. DevTools → Network → Tìm POST request tới /api/admin/login
3. Kiểm tra request body: mật khẩu có được gửi dưới dạng plaintext?
   (Chấp nhận nếu giao tiếp qua HTTPS)
4. Kiểm tra: Response KHÔNG trả về mật khẩu dưới bất kỳ dạng nào
```

**Pass Criteria:** Database không chứa plaintext password. Hash phải dài 64 ký tự hex (SHA-256).

---

#### TC-SEC-002: Kiểm tra đăng nhập thành công

```bash
curl -X POST https://nuidinh.help/api/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -d '{"password": "<CORRECT_PASSWORD>"}' \
  -v
```

**Expected Result:**

```
HTTP/1.1 200 OK
Set-Cookie: admin_session=<TOKEN>; HttpOnly; Secure; SameSite=Strict; Path=/
```

**Pass Criteria:** Cookie phải có `HttpOnly`, `Secure`, `SameSite=Strict`. Token phải được tạo mới mỗi lần đăng nhập.

---

#### TC-SEC-003: Kiểm tra đăng nhập thất bại — sai mật khẩu

```bash
curl -X POST https://nuidinh.help/api/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -d '{"password": "wrong-password-123"}' \
  -w "\n%{http_code}" \
  -s
```

**Expected Result:** HTTP 401 hoặc 403. Thông báo lỗi chung chung, KHÔNG tiết lộ `"mật khẩu sai"` (để tránh enumeration).

**Pass Criteria:** Response không tiết lộ thông tin cụ thể. Không tạo session token.

---

### 5.2. CSRF Protection

#### TC-SEC-004: POST request KHÔNG có Origin header → bị từ chối

```bash
curl -X POST https://nuidinh.help/api/photos/upload \
  -F "file=@test.jpg" \
  -F "alt=CSRF test" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -w "\n%{http_code}" -s -o /dev/null
```

**Expected Result:** HTTP 403 (Forbidden).

---

#### TC-SEC-005: POST request với Origin header SAI → bị từ chối

```bash
curl -X POST https://nuidinh.help/api/photos/upload \
  -H "Origin: https://evil-site.com" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -F "file=@test.jpg" \
  -F "alt=CSRF origin giả" \
  -w "\n%{http_code}" -s -o /dev/null
```

**Expected Result:** HTTP 403 (Forbidden).

---

#### TC-SEC-006: POST request với Origin header ĐÚNG → được chấp nhận

```bash
curl -X POST https://nuidinh.help/api/comments \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -d '{"page_id":"gallery","author":"Test User","content":"Hello"}' \
  -w "\n%{http_code}" -s -o /dev/null
```

**Expected Result:** HTTP 200/201.

**Pass Criteria cho toàn bộ CSRF (TC-SEC-004 → 006):** Mọi POST endpoint phải kiểm tra `Origin` header. Chỉ chấp nhận `https://nuidinh.help`.

---

### 5.3. Input Validation & Sanitization

#### TC-SEC-007: XSS trong trường `alt` text

```bash
curl -X POST https://nuidinh.help/api/photos/upload \
  -H "Origin: https://nuidinh.help" \
  -H "Cookie: admin_session=<VALID_TOKEN>" \
  -F "file=@test.jpg" \
  -F 'alt=<script>alert("XSS")</script>' \
  -F "location=Test" \
  -v
```

**Kiểm tra sau khi upload (nếu upload thành công):**

```bash
npx wrangler d1 execute nuidinh-db --command \
  "SELECT alt FROM photos ORDER BY id DESC LIMIT 1;"
```

**Expected Result:** Một trong hai:
- **Option A:** Input bị từ chối (HTTP 400) — tốt nhất
- **Option B:** Input được sanitize, lưu thành `&lt;script&gt;alert("XSS")&lt;/script&gt;` — chấp nhận

**Pass Criteria:** Khi render trên trình duyệt, tag `<script>` KHÔNG BAO GIỜ được thực thi. Kiểm tra bằng cách vào trang gallery, Inspect Element ảnh vừa upload, xác nhận `alt` attribute đã escaped.

---

#### TC-SEC-008: XSS trong trường `author` và `content` bình luận

```bash
curl -X POST https://nuidinh.help/api/comments \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -d '{
    "page_id": "gallery",
    "author": "<img src=x onerror=alert(1)>",
    "content": "Normal comment <script>document.cookie</script>"
  }'
```

**Kịch bản DevTools:**

```
1. Post comment chứa payload XSS ở trên
2. Vào trang hiển thị bình luận
3. DevTools → Console: kiểm tra xem có alert() hay error nào không
4. DevTools → Elements: tìm kiếm "<script>" hoặc "onerror=" trong DOM
```

**Pass Criteria:** Không có script nào được thực thi. Content hiển thị dưới dạng text thuần (escaped HTML entities).

---

#### TC-SEC-009: SQL Injection trong trường `page_id`

```bash
curl -X POST https://nuidinh.help/api/comments \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -d '{
    "page_id": "gallery'; DROP TABLE comments; --",
    "author": "Hacker",
    "content": "SQL injection test"
  }'
```

**Kiểm tra sau test:**

```bash
npx wrangler d1 execute nuidinh-db --command \
  "SELECT COUNT(*) FROM comments;"
```

**Pass Criteria:** Bảng `comments` vẫn tồn tại và dữ liệu cũ không bị mất. Hệ thống dùng parameterized queries.

---

#### TC-SEC-010: Input quá dài — boundary test

```bash
# Tạo chuỗi 10,000 ký tự
LONG_STRING=$(python3 -c "print('A' * 10000)")

curl -X POST https://nuidinh.help/api/comments \
  -H "Content-Type: application/json" \
  -H "Origin: https://nuidinh.help" \
  -d "{
    \"page_id\": \"gallery\",
    \"author\": \"${LONG_STRING}\",
    \"content\": \"Normal content\"
  }"
```

**Expected Result:** HTTP 400 với message về giới hạn độ dài.

**Pass Criteria:** Trường `author` giới hạn tối đa (ví dụ: 100 ký tự), `content` giới hạn tối đa (ví dụ: 2000 ký tự).

---

### 5.4. Path Traversal Prevention

#### TC-SEC-011: Path traversal trong serve route — `..` attack

```bash
# Thử truy cập file ngoài public/
curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/../../etc/passwd"

curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/../staging/secret-photo"

curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/api/photos/serve/staging/../public/abc123"
```

**Expected Result:** Tất cả trả về HTTP 400 hoặc 403 hoặc 404.

---

#### TC-SEC-012: Path traversal với URL encoding

```bash
# %2e%2e = ..
curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/%2e%2e/staging/secret"

# Double encoding: %252e%252e
curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/%252e%252e/staging/secret"

# Backslash variant
curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/..\\staging\\secret"
```

**Pass Criteria:** KHÔNG CÓ trường hợp nào trả về 200 hoặc nội dung ảnh. Hệ thống phải check `..` SAU KHI URL decode.

---

#### TC-SEC-013: Null byte injection trong serve route

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/abc123%00.html"

curl -s -o /dev/null -w "%{http_code}" \
  "https://nuidinh.help/photos/abc123%00../../etc/passwd"
```

**Pass Criteria:** HTTP 400 hoặc 404. Null byte KHÔNG bao giờ bypass logic tìm file.

---

## PHẦN 6 — HIỆU NĂNG SÓNG YẾU

### 6.1. Client-side Image Compression

#### TC-PERF-001: Ảnh > 3MB được nén xuống WebP trước khi POST

**Kịch bản DevTools (quan trọng — test thủ công):**

```
1. Chuẩn bị ảnh JPG kích thước 5MB
2. Mở https://nuidinh.help/upload
3. DevTools → Network tab → Check "Preserve log"
4. Chọn ảnh 5MB → Trước khi nhấn Submit, quan sát:
   - Console có log "Compressing image..." hoặc tương đương không?
5. Nhấn Submit → Trong Network tab, tìm POST request
6. Kiểm tra:
   - Request payload (Form Data) → file size phải < 3MB
   - Content-Type của file trong payload: image/webp
```

**Pass Criteria:**
- File gửi đi phải < 3MB (đã nén client-side)
- Định dạng output là WebP
- Quá trình nén diễn ra **trên client**, KHÔNG phải server (kiểm tra qua thời gian upload: phải có thời gian delay trước khi request được gửi = thời gian nén)

---

#### TC-PERF-002: Ảnh < 3MB — KHÔNG nén lại

```
1. Chuẩn bị ảnh JPG nhỏ hơn 3MB (ví dụ: 800KB)
2. Upload qua form
3. DevTools → Network: kiểm tra file size trong request
```

**Expected Result:** File gửi đi giữ nguyên kích thước gốc (hoặc chỉ convert sang WebP mà không giảm quality thêm).

**Pass Criteria:** Không có quá trình nén không cần thiết gây giảm chất lượng ảnh.

---

### 6.2. Edge Caching cho Gallery SSR

#### TC-PERF-003: Trang gallery có Cache-Control headers

```bash
curl -sI https://nuidinh.help/gallery | grep -iE "cache-control|cf-cache-status|age"
```

**Expected Result:**

```
cache-control: public, max-age=3600, s-maxage=86400
cf-cache-status: HIT (hoặc MISS ở lần đầu)
```

**Pass Criteria:** `cf-cache-status` phải là `HIT` ở lần request thứ 2 (tức Cloudflare đã cache). `s-maxage` >= 3600.

---

#### TC-PERF-004: Edge cache hoạt động — so sánh thời gian response

```bash
# Lần 1 — cache MISS
time curl -s -o /dev/null -w "HTTP %{http_code} | TTFB: %{time_starttransfer}s" \
  https://nuidinh.help/gallery

# Lần 2 — cache HIT (chạy ngay sau lần 1)
time curl -s -o /dev/null -w "HTTP %{http_code} | TTFB: %{time_starttransfer}s" \
  https://nuidinh.help/gallery
```

**Pass Criteria:** TTFB lần 2 phải nhanh hơn đáng kể so với lần 1 (ít nhất nhanh hơn 50% nếu Origin ở xa edge).

---

### 6.3. Responsive Images (srcset)

#### TC-PERF-005: Ảnh trong gallery có thuộc tính `srcset` với size 200w

**Kịch bản DevTools:**

```
1. Mở https://nuidinh.help/gallery
2. DevTools → Elements tab
3. Tìm thẻ <img> của ảnh trong gallery
4. Kiểm tra thuộc tính:
   - srcset phải chứa variant "200w"
   - sizes attribute phải có
```

**Lệnh kiểm tra bằng cURL:**

```bash
curl -s https://nuidinh.help/gallery | grep -oP 'srcset="[^"]*200w[^"]*"' | head -5
```

**Expected Result:** Mỗi ảnh gallery phải có `srcset` chứa ít nhất variant `200w`.

**Pass Criteria:** Tất cả `<img>` trong gallery đều có `srcset` với `200w`. Ảnh 200w phải thực sự tồn tại (trả 200 khi truy cập URL).

---

### 6.4. Lighthouse Performance Test trên 3G giả lập

#### TC-PERF-006: Lighthouse audit trên Slow 3G

**Kịch bản DevTools:**

```
1. Mở https://nuidinh.help/gallery
2. DevTools → Lighthouse tab
3. Cấu hình:
   - Device: Mobile
   - Categories: ☑ Performance
   - Throttling: Simulated Slow 4G (hoặc custom Slow 3G)
   - Clear storage: ☑
4. Click "Analyze page load"
```

**Pass Criteria:**

| Metric | Target |
|---|---|
| Performance Score | >= 70 |
| LCP (Largest Contentful Paint) | < 4.0s |
| FCP (First Contentful Paint) | < 3.0s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TBT (Total Blocking Time) | < 300ms |

---

#### TC-PERF-007: Kiểm tra tổng page weight trên gallery

**Kịch bản DevTools:**

```
1. Mở https://nuidinh.help/gallery
2. DevTools → Network → Disable cache → Hard reload (Ctrl+Shift+R)
3. Đợi trang load xong
4. Kiểm tra ở thanh dưới cùng Network tab:
   - "XX requests | XX MB transferred | XX MB resources"
```

**Pass Criteria:**
- Tổng transferred < 1MB cho initial load (không tính lazy-loaded images)
- Số lượng requests < 30
- Không có request nào > 500KB (trừ ảnh hero nếu có)

---

## PHẦN 7 — SEO

### 7.1. JSON-LD ImageGallery

#### TC-SEO-001: Trang gallery chứa JSON-LD ImageGallery hợp lệ

```bash
curl -s https://nuidinh.help/gallery | \
  grep -oP '<script type="application/ld\+json">[^<]*</script>' | \
  python3 -m json.tool
```

**Kịch bản DevTools:**

```
1. Mở https://nuidinh.help/gallery
2. DevTools → Elements → Ctrl+F → tìm "application/ld+json"
3. Copy nội dung JSON-LD
4. Paste vào https://validator.schema.org/ (hoặc Google Rich Results Test)
```

**Expected Result:**

```json
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": "Thư viện ảnh Núi Dinh",
  "description": "...",
  "image": [
    {
      "@type": "ImageObject",
      "contentUrl": "https://nuidinh.help/photos/...",
      "name": "...",
      "description": "..."
    }
  ]
}
```

**Pass Criteria:**
- `@type` = `"ImageGallery"`
- Mảng `image` chứa ít nhất 1 `ImageObject`
- Mỗi `ImageObject` có `contentUrl` là URL hợp lệ dẫn tới ảnh thực (HTTP 200)
- JSON-LD validate thành công trên Google Rich Results Test

---

#### TC-SEO-002: Validate JSON-LD bằng Google Rich Results Test

```
1. Truy cập https://search.google.com/test/rich-results
2. Nhập URL: https://nuidinh.help/gallery
3. Click "TEST URL"
4. Kiểm tra kết quả
```

**Pass Criteria:** Không có lỗi (errors). Cảnh báo (warnings) có thể chấp nhận nếu không ảnh hưởng indexing.

---

### 7.2. Clean URLs

#### TC-SEO-003: Clean URL `/photos/[slug]` hoạt động và không có extension

```bash
# Clean URL phải hoạt động
curl -s -o /dev/null -w "%{http_code}" https://nuidinh.help/photos/nui-dinh-binh-minh
# Kết quả: 200

# URL không có trailing slash vẫn hoạt động
curl -s -o /dev/null -w "%{http_code}" https://nuidinh.help/gallery
# Kết quả: 200

# URL với trailing slash hoặc redirect hoặc cũng trả 200
curl -s -o /dev/null -w "%{http_code} %{redirect_url}" https://nuidinh.help/gallery/
# Kết quả: 200 hoặc 301 → /gallery
```

**Pass Criteria:** Clean URLs (không .html, không query params cho nội dung chính). Trailing slash xử lý nhất quán (hoặc luôn có, hoặc luôn không, hoặc redirect 301).

---

### 7.3. Robots Directives

#### TC-SEO-004: Trang `/upload` có `noindex`

```bash
curl -s https://nuidinh.help/upload | grep -i "noindex"
```

**Expected Result:** Tìm thấy tag:

```html
<meta name="robots" content="noindex, nofollow">
```

hoặc header:

```bash
curl -sI https://nuidinh.help/upload | grep -i "x-robots-tag"
# X-Robots-Tag: noindex, nofollow
```

---

#### TC-SEO-005: Trang `/admin` và các sub-routes có `noindex`

```bash
for path in "/admin" "/admin/login" "/admin/photos" "/admin/comments"; do
  echo -n "$path → "
  curl -s "https://nuidinh.help${path}" | grep -c "noindex"
done
```

**Expected Result:** Mọi trang admin đều có `noindex`. Output:

```
/admin → 1
/admin/login → 1
/admin/photos → 1
/admin/comments → 1
```

---

#### TC-SEO-006: Trang gallery KHÔNG có `noindex` (phải được index)

```bash
curl -s https://nuidinh.help/gallery | grep -c "noindex"
```

**Expected Result:** `0` (không có meta noindex).

**Pass Criteria:** Trang gallery phải indexable.

---

#### TC-SEO-007: Kiểm tra `robots.txt`

```bash
curl -s https://nuidinh.help/robots.txt
```

**Expected Result:**

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /upload
Disallow: /api/

Sitemap: https://nuidinh.help/sitemap.xml
```

**Pass Criteria:** `/admin`, `/upload`, `/api/` phải nằm trong Disallow. Trang gallery phải KHÔNG bị disallow.

---

### 7.4. Meta Tags cơ bản

#### TC-SEO-008: Trang gallery có đầy đủ meta tags

```bash
curl -s https://nuidinh.help/gallery | grep -iE \
  "<title>|meta name=\"description\"|og:title|og:image|og:description|canonical"
```

**Pass Criteria:**
- Có `<title>` không rỗng, < 60 ký tự
- Có `<meta name="description">` không rỗng, < 160 ký tự
- Có `<link rel="canonical">` trỏ tới chính URL hiện tại
- Có Open Graph tags: `og:title`, `og:description`, `og:image`

---

## PHẦN 8 — INTEGRATION & END-TO-END SCENARIOS

### 8.1. Happy Path — Full User Journey

#### TC-E2E-001: Hành trình hoàn chỉnh: Upload → AI Check → Staging → Approve → Public → View → Comment

```
BƯỚC 1: Admin đăng nhập
  1.1  Truy cập /admin/login
  1.2  Nhập mật khẩu đúng → Submit
  1.3  ✅ Verify: Redirect tới /admin, cookie admin_session tồn tại

BƯỚC 2: Upload ảnh
  2.1  Truy cập /upload
  2.2  Chọn ảnh phong cảnh 4MB
  2.3  Quan sát: client-side compression chạy
  2.4  Submit form
  2.5  ✅ Verify: Response 200, ảnh nằm trong staging/
  2.6  ✅ Verify: D1 → photos có bản ghi mới, status = 'pending'

BƯỚC 3: AI Moderation kiểm duyệt
  3.1  ✅ Verify: Response bước 2 chứa ai_check.passed = true

BƯỚC 4: Admin duyệt ảnh
  4.1  Truy cập /admin/photos (danh sách ảnh chờ duyệt)
  4.2  ✅ Verify: Ảnh vừa upload xuất hiện, thumbnail load được (staging serve route)
  4.3  Click "Duyệt" (Approve)
  4.4  ✅ Verify: R2 → file chuyển từ staging/ → public/
  4.5  ✅ Verify: D1 → photos.status = 'approved'

BƯỚC 5: Ảnh hiển thị trên gallery công khai
  5.1  Truy cập /gallery (không cần login)
  5.2  ✅ Verify: Ảnh vừa duyệt xuất hiện trong gallery
  5.3  ✅ Verify: <img> có srcset chứa 200w
  5.4  ✅ Verify: Clean URL /photos/[slug] trả ảnh đúng (HTTP 200)
  5.5  ✅ Verify: JSON-LD chứa ImageObject mới

BƯỚC 6: Người dùng viết bình luận
  6.1  Truy cập trang chi tiết ảnh (hoặc gallery)
  6.2  Nhập tên + nội dung bình luận → Submit
  6.3  ✅ Verify: Response 200/201
  6.4  ✅ Verify: D1 → comments có bản ghi mới, status = 'pending'

BƯỚC 7: Admin duyệt bình luận
  7.1  Truy cập /admin/comments
  7.2  ✅ Verify: Comment mới xuất hiện
  7.3  Click "Duyệt"
  7.4  ✅ Verify: Comment hiển thị trên trang công khai
```

**Pass Criteria:** TẤT CẢ 7 bước phải PASS. Flow không bị gián đoạn ở bất kỳ bước nào.

---

### 8.2. Unhappy Path — Error Handling

#### TC-E2E-002: Upload khi KHÔNG đăng nhập (nếu upload yêu cầu admin)

```
1. Mở trình duyệt ẩn danh (không có session)
2. Truy cập /upload
3. Expected: Redirect về /admin/login HOẶC hiển thị lỗi 401
```

---

#### TC-E2E-003: Upload file không phải ảnh

```
1. Đăng nhập admin
2. Truy cập /upload
3. Chọn file .pdf hoặc .exe (đổi extension thành .jpg)
4. Submit
5. Expected: Bị từ chối, thông báo lỗi rõ ràng
```

---

#### TC-E2E-004: Truy cập trang admin khi session hết hạn

```
1. Đăng nhập admin → lấy session token
2. Chờ token hết hạn (hoặc sửa expires_at trong D1 về quá khứ)
3. Truy cập /admin/photos
4. Expected: Redirect về /admin/login
```

---

### 8.3. Cross-Browser & Device Testing

#### TC-E2E-005: Ma trận tương thích trình duyệt

| # | Trình duyệt | Thiết bị | Kịch bản test | Pass Criteria |
|---|---|---|---|---|
| 1 | Chrome 120+ | Desktop (Win/Mac) | Upload + Gallery + Comment | Tất cả chức năng hoạt động |
| 2 | Firefox 121+ | Desktop | Upload + Gallery + Comment | Tất cả chức năng hoạt động |
| 3 | Safari 17+ | macOS / iOS | Upload + Gallery + Comment | WebP compression hoạt động |
| 4 | Samsung Internet | Android | Gallery + Comment | Ảnh load đúng, srcset hoạt động |
| 5 | Chrome Mobile | Android | Upload (ảnh từ camera) + Gallery | Compression chạy trên mobile |
| 6 | Safari Mobile | iPhone | Upload (ảnh từ Photos) + Gallery | WebP fallback nếu cần |

**Pass Criteria cho mỗi dòng:** Tất cả chức năng chính hoạt động không có lỗi JavaScript (kiểm tra Console), layout không bị vỡ trên các kích thước màn hình thực tế.

---

## PHẦN 9 — REGRESSION CHECKLIST & SIGN-OFF

### 9.1. Regression Checklist (chạy sau mỗi lần deploy)

```
┌─────┬──────────────────────────────────────────────────────┬────────┐
│ #   │ Test Item                                            │ Status │
├─────┼──────────────────────────────────────────────────────┼────────┤
│ R01 │ Admin login hoạt động                                │ ☐      │
│ R02 │ Upload ảnh → staging/ thành công                     │ ☐      │
│ R03 │ AI moderation trả kết quả (không timeout)            │ ☐      │
│ R04 │ Approve ảnh → chuyển sang public/                    │ ☐      │
│ R05 │ Clean URL /photos/[slug] serve ảnh đúng              │ ☐      │
│ R06 │ Gallery page load < 4s trên 4G                       │ ☐      │
│ R07 │ Comment submit thành công                            │ ☐      │
│ R08 │ CSRF check: POST không origin → 403                  │ ☐      │
│ R09 │ Path traversal: ../staging/ → 400/403                │ ☐      │
│ R10 │ XSS payload trong comment → escaped                  │ ☐      │
│ R11 │ JSON-LD ImageGallery validate thành công              │ ☐      │
│ R12 │ robots.txt disallow /admin, /upload, /api/           │ ☐      │
│ R13 │ Staging serve route: no session → 401/403            │ ☐      │
│ R14 │ Expired session → redirect login                     │ ☐      │
│ R15 │ Gallery srcset chứa 200w                             │ ☐      │
│ R16 │ Cache-Control headers trên gallery page              │ ☐      │
│ R17 │ Upload page + Admin pages có noindex                 │ ☐      │
│ R18 │ Client-side compression hoạt động (file > 3MB)       │ ☐      │
│ R19 │ SQL injection trong comment → không ảnh hưởng DB     │ ☐      │
│ R20 │ HTTPS enforced (HTTP → 301 redirect HTTPS)           │ ☐      │
└─────┴──────────────────────────────────────────────────────┴────────┘
```

### 9.2. Automated Regression Script (gợi ý)

```bash
#!/bin/bash
# File: regression-test.sh
# Chạy: chmod +x regression-test.sh && ./regression-test.sh

BASE="https://nuidinh.help"
PASS=0
FAIL=0

check() {
  local name="$1" expected="$2" actual="$3"
  if [ "$actual" = "$expected" ]; then
    echo "✅ PASS: $name"
    ((PASS++))
  else
    echo "❌ FAIL: $name (expected=$expected, actual=$actual)"
    ((FAIL++))
  fi
}

echo "=== REGRESSION TEST — $(date) ==="

# R01: Homepage trả 200
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/gallery")
check "Gallery returns 200" "200" "$STATUS"

# R05: Clean URL serve ảnh
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/photos/sample-slug")
check "Clean URL /photos/slug returns 200" "200" "$STATUS"

# R06: Gallery TTFB < 2s
TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "$BASE/gallery")
if (( $(echo "$TTFB < 2.0" | bc -l) )); then
  echo "✅ PASS: Gallery TTFB = ${TTFB}s (< 2.0s)"
  ((PASS++))
else
  echo "❌ FAIL: Gallery TTFB = ${TTFB}s (>= 2.0s)"
  ((FAIL++))
fi

# R08: CSRF — POST without Origin → 403
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$BASE/api/comments" \
  -H "Content-Type: application/json" \
  -d '{"page_id":"test","author":"test","content":"test"}')
check "CSRF: POST no Origin → 403" "403" "$STATUS"

# R09: Path traversal → blocked
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/photos/../staging/secret")
check "Path traversal blocked" "400" "$STATUS"

# R12: robots.txt disallows /admin
ROBOTS=$(curl -s "$BASE/robots.txt" | grep -c "Disallow: /admin")
check "robots.txt disallows /admin" "1" "$ROBOTS"

# R13: Staging serve without session → 401 or 403
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "$BASE/api/photos/serve/staging/test-key")
if [ "$STATUS" = "401" ] || [ "$STATUS" = "403" ]; then
  echo "✅ PASS: Staging serve no session → $STATUS"
  ((PASS++))
else
  echo "❌ FAIL: Staging serve no session → $STATUS (expected 401/403)"
  ((FAIL++))
fi

# R15: Gallery contains srcset 200w
SRCSET=$(curl -s "$BASE/gallery" | grep -c "200w")
if [ "$SRCSET" -ge 1 ]; then
  echo "✅ PASS: Gallery srcset contains 200w ($SRCSET occurrences)"
  ((PASS++))
else
  echo "❌ FAIL: Gallery srcset missing 200w"
  ((FAIL++))
fi

# R17: Upload page has noindex
NOINDEX=$(curl -s "$BASE/upload" | grep -ci "noindex")
if [ "$NOINDEX" -ge 1 ]; then
  echo "✅ PASS: /upload has noindex"
  ((PASS++))
else
  echo "❌ FAIL: /upload missing noindex"
  ((FAIL++))
fi

# R20: HTTP → HTTPS redirect
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://nuidinh.help/")
check "HTTP → HTTPS redirect (301)" "301" "$STATUS"

echo ""
echo "=== RESULTS: $PASS passed, $FAIL failed ==="
if [ "$FAIL" -gt 0 ]; then
  echo "⚠️  REGRESSION FAILURES DETECTED — DO NOT DEPLOY"
  exit 1
else
  echo "✅ ALL REGRESSION TESTS PASSED"
  exit 0
fi
```

### 9.3. Tiêu chí Sign-off (Go/No-Go)

```
╔══════════════════════════════════════════════════════════════════════╗
║                    SIGN-OFF CRITERIA — GO LIVE                     ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  ✅ 100% Security tests (Phần 5) PASS — KHÔNG có ngoại lệ         ║
║  ✅ 100% Data integrity tests (Phần 2) PASS                       ║
║  ✅  95% Functional tests (Phần 3, 4, 8) PASS                     ║
║  ✅  90% Performance tests (Phần 6) PASS                          ║
║  ✅  90% SEO tests (Phần 7) PASS                                  ║
║  ✅  Regression script (9.2) exit code = 0                        ║
║  ✅  Không có bug Severity: Critical hoặc High còn mở             ║
║                                                                    ║
║  Nếu BẤT KỲ Security test nào FAIL → NO-GO tuyệt đối.            ║
║                                                                    ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## TÓM TẮT TỔNG SỐ TEST CASES

| Phần | Mô tả | Số TC |
|---|---|---|
| Phần 2 | Database D1 | 11 |
| Phần 3 | R2 Storage & Serve | 6 |
| Phần 4 | AI Moderation | 4 |
| Phần 5 | Security | 13 |
| Phần 6 | Hiệu năng Sóng yếu | 7 |
| Phần 7 | SEO | 8 |
| Phần 8 | E2E & Integration | 5 + matrix |
| **Tổng** | | **54+ test cases** |
