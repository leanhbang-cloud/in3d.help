# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

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

- **Kiểm thử chất lượng QC 5 Layer & Tối ưu hóa A11y (Hoàn thành - 2026-07-29)**:
  - Đã chạy QC toàn diện theo checklist 5 lớp kế thừa từ luxury-gold-theme và dinh-mountain-help.
  - Khắc phục các vấn đề Accessibility (tăng từ 93 lên 96/100) bao gồm: bổ sung main landmark cho Layout, sửa lỗi nhảy cấp Heading (H4 sang H3) ở quy trình và footer, tăng độ tương phản của text trang trí biên và footer links.
  - Khắc phục lỗi double slash (//) ở ảnh OG đại diện.
  - Cấu hình custom domain mới `3dprinting.ledainhan.com` đồng bộ vào robots.txt, astro.config.mjs, và wrangler.jsonc.
  - Verify toàn bộ link hoạt động mượt mà và điểm Lighthouse đạt trên 96+ trên môi trường Live Production.

---

## Pending Issues — Xử lý ở session sau

- Chưa có (Tất cả checklist QC và tối ưu đã hoàn tất và pass).

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
Working on:  Chạy QC và khắc phục các vấn đề tối ưu cho in3D.help
Progress:    Đã hoàn thành QC 5 lớp trên local & live production, đạt 96/100 Accessibility, 100/100 SEO & Best Practices.
Next:        Xác định định hướng phát triển tiếp theo của website.
Blockers:    Không có.
Last commit: 8066e2d focus: end session 2026-07-29 after successful QC
Updated:     2026-07-29 11:49
Machine:     Mac mini
```
