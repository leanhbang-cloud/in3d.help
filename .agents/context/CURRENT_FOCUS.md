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

- **Rebranding - BlueMooon's Studio & Rà soát tài liệu hệ thống (Hoàn thành - 2026-07-29)**:
  - Tiến hành Rebrand toàn bộ website từ "Dịch vụ in 3D" sang "Kệ modular để bàn in 3D đáng yêu".
  - Rà soát và cập nhật đồng bộ các tài liệu `MISSION.md`, `ARCHITECTURE.md`, `GLOSSARY.md`, `AGENT_README.md`, `README.md` theo định hướng Rebrand và đính chính các lỗi deploy (Cloudflare Pages thay vì Vercel).
  - Tối ưu hóa Asset: Thêm `fetchpriority="high"` cho ảnh Hero và `loading="lazy"` cho avatar người sáng lập.

- **Kiểm thử chất lượng QC 5 Layer & Tối ưu hóa A11y (Hoàn thành - 2026-07-29)**:
  - Chạy QC 5 lớp toàn diện và đạt kết quả tuyệt đối trên Local Preview: SEO 100/100, Best Practices 100/100, Accessibility 96/100.
  - Không phát hiện lỗi tràn viền ngang trên cả Desktop và Mobile (375px width).
  - Khắc phục các vấn đề sitemap và custom domain `3dprinting.ledainhan.com`.

- **Cấu hình Domain chính thức & Đồng bộ tài liệu dự án (Hoàn thành - 2026-07-29)**:
  - Cập nhật fallback domain trong `src/components/SEOHead.astro` sang `https://3dprinting.ledainhan.com` và `og:site_name` sang `BlueMooon's Studio`.
  - Cập nhật đồng bộ thông tin domain chính thức trên tất cả tài liệu dự án và hướng dẫn thiết kế/QC.
  - Kiểm tra build tĩnh thành công, verify canonical URL và sitemap trỏ đúng về domain mới.

- **Audit toàn diện website & Lưu báo cáo (Hoàn thành - 2026-07-29)**:
  - Nhận và phân tích báo cáo audit chi tiết về UI/UX, Performance, SEO, A11y, và CRO cho trang web `https://3dprinting.ledainhan.com/`.
  - Lưu trữ báo cáo hoàn chỉnh tại `docs/website_audit_report.md` để làm tài liệu tham khảo cho các tối ưu hóa sắp tới.

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
Working on:  Tối ưu hóa website dựa trên báo cáo audit của Genspark/Sonnet
Progress:    Hoàn thành việc audit và lập tài liệu báo cáo chi tiết tại docs/website_audit_report.md.
Next:        Thực hiện Giai đoạn 1 (Quick Wins) trong checklist tối ưu hóa: Thêm aria-hidden cho decorative elements, tạo skip navigation link, preload hero image, và sửa typo thương hiệu.
Blockers:    None
Last commit: bc92b2c focus: end session 2026-07-29
Updated:     2026-07-29 17:23
Machine:     Mac mini
```
