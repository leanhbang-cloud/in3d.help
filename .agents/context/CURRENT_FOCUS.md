# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

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
Working on:  Đã hoàn tất tối ưu hóa toàn diện website theo báo cáo audit
Progress:    Hoàn thành toàn bộ tối ưu hóa A11y, SEO, Performance, CRO, typo thương hiệu và build test thành công.
Next:        Push lên Vercel/Cloudflare Pages và thực hiện các giai đoạn tiếp theo (Wall of Love, A/B Testing...).
Blockers:    None
Last commit: aa22100 feat: optimize landing page performance, SEO, accessibility, and CRO
Updated:     2026-07-30 09:37
Machine:     Mac mini
```
