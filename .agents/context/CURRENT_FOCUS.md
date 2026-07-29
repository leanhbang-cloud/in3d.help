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
  - Khắc phục các vấn đề Accessibility (tăng từ 93 lên 96/100), sitemap, custom domain `3dprinting.ledainhan.com`.

- **Redesign & Rebranding - BlueMooon's Studio (Hoàn thành - 2026-07-29)**:
  - Tiến hành Rebrand toàn bộ website từ "Dịch vụ in 3D" sang "Kệ modular để bàn in 3D đáng yêu".
  - Áp dụng hệ màu pastel kem ấm mới, bo tròn UI (`border-radius: 20px`) và bóng đổ shadow mềm mại.
  - Nhúng Google Fonts mới (`Nunito` + `Quicksand`), sửa lỗi hiển thị tiếng Việt có dấu hoàn hảo.
  - Tích hợp kết cấu sản phẩm thực tế (tấm nền 16x16, 4x16, 4x4 và chốt chữ thập Connector quatrefoil mặt sau) vào toàn bộ nội dung copywrite của sản phẩm.
  - Sinh mới 4 ảnh AI với độ chính xác cao mô tả mộng răng cưa jigsaw và chốt Connector hoa 4 cánh, tối ưu hóa kích thước WebP cực nhẹ (tất cả ảnh dưới 65KB).

- **Khắc phục lỗi hệ thống Antigravity IDE (Hoàn thành - 2026-07-29)**:
  - Sửa lỗi cú pháp sandbox (loại bỏ glob ** lỗi thời trong file config.json của IDE).
  - Đồng bộ thành công mã nguồn với origin main bằng git pull.

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
Working on:  Khắc phục lỗi hệ thống Antigravity và đồng bộ Git
Progress:    Sửa lỗi cấu hình sandbox trong config.json, chạy thử git status và git pull origin main thành công.
Next:        Triển khai Vercel preview hoặc tiếp tục phát triển giao diện dự án.
Blockers:    Không có.
Last commit: ea2ab1f docs(qc): add 5-layer QC protocol guide
Updated:     2026-07-29 16:04
Machine:     Mac mini
```
