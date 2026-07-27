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

-- Bảng thống kê lượt tải file GPX (ẩn danh hóa IP bằng băm)
CREATE TABLE IF NOT EXISTS gpx_downloads (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    trail_id      TEXT    NOT NULL,
    ip_hash       TEXT    NOT NULL,
    downloaded_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gpx_downloads_trail ON gpx_downloads(trail_id);
