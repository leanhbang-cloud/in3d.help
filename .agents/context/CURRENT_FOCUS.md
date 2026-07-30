# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

- **Sửa đổi hiển thị giao diện trên thiết bị di động (Hoàn thành - 2026-07-30)**:
  - Ẩn hoàn toàn Top Bar trên mobile (màn hình <= 768px) để giải phóng không gian hiển thị.
  - Dàn ngang hai nút CTA của Hero (`flex-direction: row`), chia đều chiều rộng (`flex: 1`), áp dụng text-overflow ellipsis tránh tràn chữ và thu hẹp padding.
  - Sửa lỗi khoảng trống lớn giữa các section bằng cách thiết lập `.hero` có `min-height: 85svh` và đặt `min-height: unset` cho các section chung.
  - Thay đổi cấu trúc và CSS của FAQ Accordion sang dùng kỹ thuật grid-template-rows (`0fr` -> `1fr`) để tạo hiệu ứng đóng mở trượt mượt mà.

- **Sửa lỗi cache Cloudflare CDN trên production (Hoàn thành - 2026-07-30)**:
  - Thêm một rule CSS vô hại `#cache-buster-element-unique` ở cuối file `global.css` nhằm ép Vite sinh ra mã hash mới cho file CSS built ra (`index.BWOCpY0X.css`). Việc này giúp vượt qua lỗi Cloudflare Edge CDN cache nhầm file HTML 404 (do race condition) thành file CSS. Giao diện trang production `https://3dprinting.ledainhan.com` đã hiển thị đẹp hoàn hảo.

- **Chuẩn hóa UI/UX, Tương phản A11y & Đồng bộ thương hiệu đầy đủ (Hoàn thành - 2026-07-30)**:
  - **Tối ưu hóa Navbar Light Mode**: Chuyển nền Navbar sang màu kem sáng pastel `rgba(255, 248, 240, 0.85)` đồng điệu với brand. Fix logo `BM` và chữ `BlueMoon's Studio✿` hiển thị sắc nét trên nền sáng, không bị co hay cắt chữ. Tăng font-weight các menu link và đổi màu hover sang cam đất đậm `#B24A2D`. Cấu hình shadow mịn khi scroll.
  - **Đồng bộ thương hiệu đầy đủ**: Đổi tên thương hiệu từ rút gọn `BlueMoon` sang đầy đủ `"BlueMoon's Studio"` tại Header logo, Footer logo, và watermark chìm ở đầu Footer.
  - **Cân đối watermark & Sửa lỗi lề**: Hạ font-size của watermark `.footer-mega` sang `clamp(40px, 6.5vw, 98px)` giúp cụm từ dài hiển thị gọn gàng, không bị tràn lề.
  - **Khắc phục chữ khó đọc**: Sửa Side Rails (tương phản màu `#9b7b6a`, giảm letter-spacing, rail trái xoay đọc dưới lên và rail phải đọc trên xuống), tăng tương phản Top Bar (chữ màu `#3D3D3D`), đổi màu label About section sang cam đất đậm `#B24A2D` (độ tương phản > 5.5:1).
  - **Khắc phục khoảng trống Footer**: Reset chiều cao an toàn loại bỏ chiều cao ảo, đổi màu watermark chìm `BlueMoon's Studio` sang xám mờ `rgba(61, 61, 61, 0.04)` để watermark chìm hiện lên tinh tế trên nền hồng sáng, giải quyết cảm giác trống lề bị lỗi layout.
  - **Sửa lề badge "Khuyên dùng"/"Bán chạy"**: Thêm `overflow: visible` cho card recommended để tránh bị crop lề badge. Sửa badge mép trên cùng card thành `"KHUYÊN DÙNG"`, và chuyển khung `"🔥 Bán chạy"` bên dưới thành một huy hiệu nhỏ xinh đính ở góc trên bên phải card để giải phóng không gian.

- **Tối ưu hóa toàn diện website dựa trên báo cáo audit (Hoàn thành - 2026-07-30)**:
  - **Đồng bộ thương hiệu**: Sửa typo thương hiệu `BlueMooon` thành `BlueMoon` (nhất quán 2 chữ o) trên toàn bộ dự án (`Layout.astro`, `index.astro`, `Header.astro`, `About.astro`, `Footer.astro`).
  - **Performance & SEO**: Tự host font (self-hosted fonts) trong `public/fonts/` và cấu hình `@font-face` cùng preload WOFF2. Nhúng metadata `theme-color` và 3 schema JSON-LD: `Organization`, `Product`, và `FAQPage`.
  - **Accessibility (A11y)**: Thêm nút Skip Navigation Link ở đầu trang. Gán `aria-hidden` cho các decorative emojis, corner markers, side-rails, và SVG icons trong nút bấm. Gán landmark labels cho các section và cấu hình accordion FAQ accessible.
  - **CRO & UI/UX**: Triển khai price anchoring (giá cũ gạch ngang), badge "Bán chạy nhất" cho combo Pro, và đổi nhãn các nút bấm hướng hành động cụ thể. Tích hợp `IntersectionObserver` tự động ẩn nút Floating CTA khi ở trong Hero và hiện khi cuộn qua.
  - **Kiểm thử**: Đã chạy build tĩnh thành công (`npm run build`) và verify hiển thị qua preview server.

- **Cấu hình & Đồng bộ Cloudflare Pages (Hoàn thành - 2026-07-27)**:
  - Dọn dẹp hoàn toàn các tài liệu cũ không liên quan của dự án Núi Dinh.
  - Cấu hình lại `astro.config.mjs` và `wrangler.jsonc` để chạy tĩnh (SSG) độc lập.
  - Kết nối và deploy thành công trên Cloudflare Pages mặc định tại https://in3d-help.pages.dev.

- **Điền template nhập liệu & Tạo Favicon thương hiệu (Hoàn thành - 2026-07-28)**:
  - Đã hoàn thành 100% cập nhật các thông tin kỹ thuật về tấm pegboard modular.
  - Đã đính kèm logo thương hiệu tại `public/logo.jpg`.
  - Đã viết script `scripts/generate-favicon.js` để tự động tạo `favicon.ico`, `favicon.png` và `apple-touch-icon.png` từ logo thương hiệu, xóa file `favicon.svg` cũ của Astro.

- **Phân tích kinh doanh & Định hướng thiết kế (Hoàn thành - 2026-07-28)**:
  - Hoàn thành phân tích chi tiết USP, đối thủ và 3 kịch bản tài chính tại [business_analysis.md](file:///Users/bangle-macmini/Projects/in3d-help/docs/business_analysis.md).
  - Lập tài liệu thiết kế chi tiết, bao gồm mã màu Hex và thư viện Prompt AI Midjourney/SDXL tại [Design.md](file:///Users/bangle-macmini/Projects/Design.md).

- **Xây dựng Landing Page & Tối ưu hóa SEO/Hình ảnh (Hoàn thành - 2026-07-28)**:
  - Đã hoàn thành lập trình giao diện Landing Page (Sale Page) bằng Astro + CSS thuần.
  - Viết 12 Astro components modular trong `src/components/` và điều phối hoạt động thông qua `src/scripts/main.js`.
  - Sinh 4 hình ảnh AI chất lượng cao và viết script `scripts/optimize-images.js` nén ảnh WebP giảm ~92% dung lượng.

---

## Pending Issues — Xử lý ở session sau
- Chưa có.

---

## Lệnh Dev & Build
- Chạy dev server local: `ASTRO_TELEMETRY_DISABLED=1 npm run dev`
- Chạy build dự án: `ASTRO_TELEMETRY_DISABLED=1 npm run build`
- Chạy preview build: `npm run preview`
- Chạy tối ưu hóa ảnh: `node scripts/optimize-images.js`
- Chạy tạo favicon: `node scripts/generate-favicon.js`

---

## Metadata Đồng Bộ
```
Working on:  Sửa lỗi hiển thị UI trên thiết bị di động (Top Bar, Hero CTA Buttons, khoảng hở và FAQ Accordion).
Progress:    Hoàn thành ẩn Top Bar trên mobile, dàn ngang và cân đối 2 nút CTA, sửa chiều cao Hero 85svh sửa lỗi khoảng hở trên Safari di động, và nâng cấp FAQ Accordion sang CSS Grid row transition mượt mà.
Next:        Chờ phản hồi của user.
Blockers:    None
Last commit: 80f0f9f markup(faq): wrap accordion answer for smooth height transition
Updated:     2026-07-30 11:54
Machine:     Mac mini
```
