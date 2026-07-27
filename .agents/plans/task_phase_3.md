# Tiến độ thực hiện — Phase 3: Trang Di Chuyển & Về Núi Dinh

Checklist chi tiết các đầu việc cần hoàn thành cho Phase 3. Chúng ta sẽ làm từng bước một và test cẩn thận trước khi báo cáo.

---

## 📋 Checklist công việc

- `[x]` **1. Khởi tạo & Cấu hình Header**
  - `[x]` Cập nhật `src/components/Header.astro` để active đúng màu Gold và gạch chân khi truy cập `/di-chuyen` và `/ve-nui-dinh`.

- `[x]` **2. Trang Hướng dẫn di chuyển (`/di-chuyen`)**
  - `[x]` Tạo trang `src/pages/di-chuyen.astro`.
  - `[x]` Lập trình Sub-hero phẳng nền Kem Ấm (`--color-cream`), Roboto Slab H1 Cognac.
  - `[x]` Lập trình Tab Component điều hướng 3 loại phương tiện (Xe máy, Ô tô, Xe khách) bằng Vanilla JS.
  - `[x]` Thiết kế Card E (Service Card) hiển thị 4 bãi xe (Cô Kiều, Cô Hường, Suối Đá, Suối Tiên).
  - `[x]` Lập trình tính năng 1-Click Copy GPS tọa độ bãi xe, có feedback "✓ Đã copy" màu Forest và có fallback iOS Safari.
  - `[x]` Lồng ghép Góc người địa phương (Card C - quote của Bang).
  - `[x]` Bổ sung SEO meta tags và cấu trúc dữ liệu `HowTo` cho trang.

- `[x]` **3. Trang Về Núi Dinh (`/ve-nui-dinh`)**
  - `[x]` Tạo trang `src/pages/ve-nui-dinh.astro`.
  - `[x]` Lập trình Sub-hero ảnh nền có overlay tối màu, Roboto Slab H1 màu Cream.
  - `[x]` Tạo 6 ảnh phong cảnh mẫu chất lượng cao bằng `generate_image` lưu vào `public/images/`.
  - `[x]` Xây dựng cấu trúc Layout 8/4 split (Cột trái 8 cols, Sidebar sticky phải 4 cols).
  - `[x]` Lập trình nội dung Cột trái: Lịch sử chiến khu, Hệ sinh thái, Gallery 6 ảnh (tích hợp Lightbox), Tâm linh.
  - `[x]` Lập trình Cột phải: Card C (Góc người địa phương - câu chuyện của Bang) và Card D rút gọn (Cảnh báo bảo vệ rừng).
  - `[x]` Thiết lập responsive mobile: Ẩn cột phải, hiện Gold Strip (quote) sau Lịch sử, hiện Cognac Strip (cảnh báo) sau Tâm linh.
  - `[x]` Bổ sung SEO meta tags và cấu trúc dữ liệu `TouristAttraction` cho trang.

- `[x]` **4. Kiểm thử & Tối ưu hóa**
  - `[x]` Chạy `npm run build` để xác nhận không lỗi compile.
  - `[x]` Kiểm tra responsive Desktop & Mobile qua Chrome DevTools.
  - `[x]` Test copy GPS trên môi trường iOS Safari (giả lập hoặc debug).
  - `[x]` Chụp ảnh màn hình làm bằng chứng trực quan cho anh Bang review.
