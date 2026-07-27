# Walkthrough — Kết quả hoàn thiện Phase 3 (Đã Fix Feedback)

Báo cáo chi tiết kết quả thực hiện và sửa đổi hoàn chỉnh Phase 3 cho dự án Núi Dinh Guide. Giao diện và các thành phần tương tác đã được tối ưu hóa tối đa theo tiêu chuẩn **Design System v1.2** và phản hồi từ anh Bang.

---

## 🛠️ Các thay đổi và Files liên quan (Đã cập nhật)

### 1. Sửa đổi trang Hướng dẫn di chuyển (`/di-chuyen`)
* [di-chuyen.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/pages/di-chuyen.astro):
  * **InfoBox Component**: Thay thế toàn bộ các khối `.panel-info-box` inline cũ bằng component `<InfoBox>` dùng chung mới để tránh duplicate CSS và nâng cao cấu trúc ngữ nghĩa A11y.
  * **Rút ngắn Quote**: Quote của Bang được tinh chỉnh ngắn gọn còn 38 từ để không bị tràn màn hình trên mobile.
  * **Border Overlap & Flat bg**: Chuyển border-bottom của tab-bar thành `box-shadow inset` để loại bỏ lỗi active tab đè line dày thêm 1px; gỡ bỏ nền panel-content để layout thanh thoát và thoáng mắt hơn.
  * **Breadcrumb List**: Bổ sung JSON-LD BreadcrumbList để hiển thị phân cấp chuyên nghiệp trên Google Search.
  * **A11y**: Emoji tab được bọc bằng font-stack dự phòng chuyên dụng tránh lỗi hiển thị ô vuông trên các máy Windows cổ.

### 2. Sửa đổi trang Về Núi Dinh (`/ve-nui-dinh`)
* [ve-nui-dinh.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/pages/ve-nui-dinh.astro):
  * **Rút gọn Mobile Strips & Tránh duplicate**: Tinh giản tối đa nội dung dải thông tin Gold Strip và Cognac Strip trên di động để không trùng lặp 100% với Card C/Card D Desktop, tối ưu cho SEO Mobile-first Indexing.
  * **Thêm Mobile Forest Strip**: Bổ sung Forest Strip màu xanh rừng già trên di động để hiển thị số liệu hệ sinh thái của Núi Dinh một cách nhất quán (Gold - Forest - Cognac).
  * **Fix FOUC aria-hidden**: Loại bỏ việc hardcode `aria-hidden="true"` ở HTML ban đầu trên mobile strips. JS sẽ tự động gán dynamic dựa trên viewport thực tế của người dùng.
  * **Astro View Transitions Support**: Bọc toàn bộ script điều khiển Lightbox vào hàm `initLightbox` và đăng ký lắng nghe sự kiện `astro:page-load` kết hợp cơ chế guard chống double-init để Lightbox không bị chết khi chuyển trang.
  * **Focus Trap & Return Focus**: Tích hợp tính năng khoanh vùng focus bằng bàn phím (Focus trap WAI-ARIA) khi mở Modal Lightbox và trả lại focus cho ảnh gốc khi đóng modal.
  * **Tối ưu hóa hình ảnh (Responsive Images)**: Sử dụng batch script `sips` trên máy để tự động convert và nén 6 ảnh phong cảnh chất lượng cao PNG thành 2 phiên bản độc lập: `_thumb.jpg` (rộng 400px, nặng ~45KB, tối ưu tải trang nhanh) và `_full.jpg` (rộng 1000px, nặng ~90KB, chỉ tải khi zoom).
  * **Loading Indicator**: Thêm animation chuyển đổi opacity `.loaded` khi ảnh Full-size tải xong trong Lightbox để tránh việc người dùng nhìn thấy khung hình trống trên kết nối mạng yếu.
  * **Card D Reuse**: Gỡ bỏ mã HTML tự code inline, tái sử dụng chính xác component `<CardD>`.
  * **Breadcrumb List**: Bổ sung cấu trúc Breadcrumb List JSON-LD cho trang.

### 3. Cập nhật CSS & Global
* [global.css](file:///Users/mac/Projects/Dinh-Mountant-help/src/styles/global.css): Bổ sung quy tắc tắt hoàn toàn hiệu ứng chuyển động và transition khi người dùng kích hoạt `prefers-reduced-motion` trên toàn trang (tab-panel, lightbox, copy button).
* [Header.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/components/Header.astro): Tích hợp skip-to-content link ở ngay đầu Header hỗ trợ bàn phím di chuyển nhanh đến phần nội dung chính `#main-content`.
* [DESIGN_SYSTEM.md](file:///Users/mac/Projects/Dinh-Mountant-help/DESIGN_SYSTEM.md): Đăng ký thông tin **Step List Pattern** sử dụng marker mũi tên `➔` màu Gold và bảng tóm tắt spec.

---

## 📸 Bằng chứng Visual (Evidence)

Hình ảnh giao diện thực tế sau khi sửa đổi:

### 🏍️ Hướng dẫn di chuyển (`/di-chuyen`)

- Giao diện desktop mới - Nền panel-content phẳng, InfoBox nổi bật: `di_chuyen_desktop.png`
- Visual khi 1-Click Copy GPS thành công (Đã fix 1px border jump): `di_chuyen_desktop_copied.png`
- Giao diện full trang trên di động - Quote Bang rút gọn & InfoBox A11y: `di_chuyen_mobile_full.png`

### 🌲 Về Núi Dinh (`/ve-nui-dinh`)

- Giao diện desktop - Sticky Sidebar tái sử dụng Card D: `ve_nui_dinh_desktop.png`
- Lightbox modal - Tích hợp Loading Indicator mượt mà và Focus Trap: `ve_nui_dinh_lightbox.png`
- Mobile layout - Kết hợp cả 3 dải màu di động (Gold - Forest - Cognac) rút gọn: `ve_nui_dinh_mobile_full.png`

---

## 🧪 Kết quả kiểm thử & Build
* **Kiểm tra biên dịch**: Chạy `npm run build` thành công 100%, các tệp tĩnh được xuất bản gọn gàng trong `/dist/` mà không gặp bất kỳ lỗi nào.
