# Kế hoạch Kiểm QC 5 Layers: Chuẩn hóa UI/UX Module Tương tác

**Phiên bản:** 1.0.0  
**Ngày lập:** 2026-06-19  
**Mục tiêu:** Kiểm soát chất lượng toàn diện sau khi cập nhật giao diện Bình luận, Gửi ảnh, Thư viện ảnh, và Admin theo đúng tài liệu Design System.

---

## LAYER 1: FRONTEND UI/UX & ACCESSIBILITY (A11y)

### TC-L1-001: Kiểm tra màu nền và viền trái comment
* **Mức độ ưu tiên:** Critical
* **Các bước thực hiện:**
  1. Mở trang chi tiết cung đường có bình luận.
  2. Inspect element các comment card và form bình luận.
* **Kết quả mong đợi:** 
  * Background-color đúng màu Kem Ấm `#F0E6D0`.
  * Viền trái dày 3px màu Vàng Gold `#C8A45D`.

### TC-L1-002: Kiểm tra nút Primary và trạng thái Hover/Active
* **Mức độ ưu tiên:** High
* **Các bước thực hiện:**
  1. Di chuột (hover) và nhấn (active) vào các nút "Gửi Bình Luận", "Gửi Ảnh".
  2. Đo border-radius, font-family và kiểm tra text format.
* **Kết quả mong đợi:**
  * Nút Primary có nền Cognac `#5C3D20`, chữ Kem `#F0E6D0`, border-radius 8px.
  * Hover đổi sang Cognac tối `#4A3018`. Active có scale `0.98`.
  * Chữ hiển thị dạng Title Case (ví dụ: "Gửi Bình Luận" thay vì "GỬI BÌNH LUẬN").

### TC-L1-003: Kiểm tra nút Secondary và nút Icon
* **Mức độ ưu tiên:** High
* **Các bước thực hiện:**
  1. Inspect nút phân trang (Pagination) ở Thư viện ảnh và nút "Từ chối" ở Admin.
  2. Inspect nút Close (✕) của Lightbox.
* **Kết quả mong đợi:**
  * Nút Secondary có nền transparent, viền 2px solid Cognac `#5C3D20`, chữ Cognac.
  * Nút Close Lightbox có kích thước `40x40px`, nền Forest `#1E3A28`, chữ Kem `#F0E6D0`.

### TC-L1-004: Kiểm tra Badge Variants và tính chất Cursor
* **Mức độ ưu tiên:** High
* **Các bước thực hiện:**
  1. Kích hoạt thông báo thành công (Forest bg) và lỗi (Cognac bg).
  2. Di chuột vào các badge trạng thái duyệt trong Admin.
* **Kết quả mong đợi:**
  * Badge Success: nền Forest `#1E3A28`, chữ Kem. Badge Danger: nền Cognac, chữ Kem. Badge Warning: nền Gold, chữ Cognac.
  * Font Roboto Bold 12px, viết hoa ALL CAPS, border-radius 6px, padding `4px 10px`.
  * **Đặc biệt:** Con trỏ giữ nguyên dạng `default` (không có pointer) và không có hiệu ứng hover để tránh nhầm lẫn với nút bấm.

### TC-L1-005: Kiểm tra Touch Target Size & Focus Visible (A11y)
* **Mức độ ưu tiên:** Critical
* **Các bước thực hiện:**
  1. Chuyển sang chế độ giả lập Mobile (iPhone SE). Đo kích thước touch target của checkbox admin, nút đóng Lightbox, và các mũi tên nav.
  2. Dùng phím `Tab` để duyệt qua toàn bộ form và nút bấm.
* **Kết quả mong đợi:**
  * Clickable area của mọi nút và checkbox tối thiểu đạt `44x44px` (WCAG 2.5.5).
  * Mọi phần tử tương tác đều hiển thị focus ring rõ ràng khi được focus.

---

## LAYER 2: API & FRONTEND LOGIC INTERACTION

### TC-L2-001: Gửi bình luận và sanitize dữ liệu đầu vào
* **Mức độ ưu tiên:** Critical
* **Các bước thực hiện:**
  1. Nhập bình luận trống, nội dung >2000 kí tự, hoặc chứa script HTML `<script>alert('XSS')</script>`.
  2. Gửi bình luận hợp lệ.
* **Kết quả mong đợi:**
  * Client chặn gửi form trống hoặc quá dài.
  * Mã HTML được sanitize hoàn toàn (escaped HTML) và lưu dạng text thuần, không trigger thực thi mã độc.
  * Form tự động reset sau khi gửi thành công và hiển thị badge thông báo chờ duyệt.

### TC-L2-002: Kiểm tra nén ảnh Client-side (Image Compression)
* **Mức độ ưu tiên:** Critical
* **Các bước thực hiện:**
  1. Chọn ảnh JPEG nặng 4MB và gửi.
  2. Theo dõi tiến trình progress bar và inspect dung lượng file thực tế gửi lên qua Network tab.
* **Kết quả mong đợi:**
  * Thư viện `browser-image-compression` giảm kích thước ảnh xuống dưới 3MB (thumbnail < 40KB, full-size < 120KB).
  * Progress bar chạy mượt mà: track nền Trắng Ấm viền Nâu xám, fill Vàng Gold.

### TC-L2-003: Điều khiển Lightbox Thư viện ảnh
* **Mức độ ưu tiên:** High
* **Các bước thực hiện:**
  1. Click vào một thumbnail trong Thư viện ảnh (xác nhận không mở tab mới).
  2. Nhấn phím `←`/`→` hoặc vuốt ngang (swipe) trên mobile để chuyển ảnh.
  3. Nhấp đúp (double-tap) vào ảnh trên mobile.
  4. Nhấn phím `ESC` hoặc click ra ngoài để đóng.
* **Kết quả mong đợi:**
  * Lightbox mở trực tiếp với backdrop `rgba(0,0,0,0.85)`. Counter hiển thị dạng `X / Y`.
  * Chuyển ảnh mượt mà, double-tap zoom lớn đúng 1.5x. Phím `ESC` đóng Lightbox và trả lại tiêu điểm bàn phím về thumbnail vừa chọn.

---

## LAYER 3: DATABASE & D1 STORAGE

### TC-L3-001: CRUD Dữ liệu bình luận & ảnh
* **Mức độ ưu tiên:** High
* **Các bước thực hiện:**
  1. Gửi bình luận và ảnh mới.
  2. Thực hiện duyệt/từ chối/xóa trong Admin.
  3. Kiểm tra trực tiếp bảng D1 SQLite remote.
* **Kết quả mong đợi:**
  * Gửi mới: tạo record với status `pending` trong DB.
  * Duyệt: status chuyển sang `approved`, xuất hiện lập tức trên trang public.
  * Từ chối: status chuyển sang `rejected`, không hiển thị public.
  * Xóa: record bị xóa vĩnh viễn (hoặc status `deleted`), đồng thời file ảnh tương ứng bị xóa khỏi R2 storage.

---

## LAYER 4: KV & SESSION MANAGEMENT

### TC-L4-001: Đồng bộ hóa Session đăng nhập Admin mới
* **Mức độ ưu tiên:** High
* **Các bước thực hiện:**
  1. Đăng nhập Admin từ form login mới. Kiểm tra cookie `admin_session` và dữ liệu KV namespace.
  2. Bấm "Đăng xuất".
* **Kết quả mong đợi:**
  * Sau đăng nhập: Token session được tạo đồng thời ở KV và bảng `admin_sessions` trong D1.
  * Sau đăng xuất: Token bị xóa sạch ở cả 2 nơi. Thử truy cập lại `/admin` bị redirect về `/admin/login`.

---

## LAYER 5: SECURITY & CSRF PROTECTION

### TC-L5-001: Kiểm tra validateOrigin chống giả mạo
* **Mức độ ưu tiên:** Critical
* **Các bước thực hiện:**
  1. Gửi POST request bình luận/đăng nhập/upload ảnh với Origin hợp lệ (`localhost`, `leanhbang27983.workers.dev`).
  2. Gửi request với Origin giả mạo (`attacker.com` hoặc `nuidinh.help.evil.com`).
* **Kết quả mong đợi:**
  * Origin hợp lệ: Được chấp nhận và xử lý bình thường.
  * Origin giả mạo hoặc thiếu Origin: Bị chặn cứng với mã `HTTP 403 Forbidden` và thông báo `"Forbidden: Invalid origin"`.
