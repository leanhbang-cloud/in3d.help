# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

- **Cấu hình & Đồng bộ Cloudflare Pages (Hoàn thành - 2026-07-27)**:
  - Dọn dẹp hoàn toàn các tài liệu cũ không liên quan của dự án Núi Dinh.
  - Cấu hình lại `astro.config.mjs` và `wrangler.jsonc` để chạy tĩnh (SSG) độc lập.
  - Kết nối và deploy thành công trên Cloudflare Pages mặc định tại https://in3d-help.pages.dev.

- **Điền template nhập liệu (Hoàn thành - 2026-07-28)**:
  - Đã hoàn thành 100% cập nhật các thông tin kỹ thuật về tấm pegboard modular.
  - Đã đính kèm logo thương hiệu tại `public/logo.jpg`.

- **Phân tích kinh doanh & Định hướng thiết kế (Hoàn thành - 2026-07-28)**:
  - Hoàn thành phân tích chi tiết USP, đối thủ và 3 kịch bản tài chính tại [business_analysis.md](file:///Users/bangle-macmini/Projects/in3d-help/docs/business_analysis.md).
  - Lập tài liệu thiết kế chi tiết, bao gồm mã màu Hex và thư viện Prompt AI Midjourney/SDXL tại [Design.md](file:///Users/bangle-macmini/Projects/Design.md).

- **Xây dựng Landing Page & Tối ưu hóa SEO/Hình ảnh (Hoàn thành - 2026-07-28)**:
  - Đã hoàn thành lập trình giao diện Landing Page (Sale Page) bằng Astro + CSS thuần lấy cảm hứng thiết kế Atelier Zero của Open Design kết hợp hệ tối Dark Tech.
  - Viết 12 Astro components modular trong `src/components/` và điều phối hoạt hoạt ảnh cuộn trang (`data-reveal`), Headroom Nav, FAQ Accordion thông qua `src/scripts/main.js`.
  - Sinh 4 hình ảnh AI chất lượng cao thông qua Genspark Image (hero display, exploded view, founder portrait, lifestyle gallery) và lưu vào `public/images/`.
  - **Mới**: Tích hợp component `SEOHead` vào layout chính và cấu hình ảnh OG đại diện.
  - **Mới**: Viết script `scripts/optimize-images.js` sử dụng thư viện `sharp` để tự động hóa nén và resize tất cả hình ảnh sang định dạng WebP, giảm ~92% tổng dung lượng ảnh (từ 7.1MB xuống ~560KB), tối ưu tốc độ tải trang LCP cho SEO.
  - Chạy `npm run build` thành công trong 0.7s.

---

## Pending Issues — Xử lý ở session sau

### ISS-A: Cấu hình Deploy Preview & Testing trên Vercel/Cloudflare Pages
- **Symptom**: Cần tích hợp deploy tự động (CI/CD) cho branch `main` và kiểm tra điểm số Lighthouse trên môi trường production thực tế.
- **Action**: Theo dõi Cloudflare Pages build hoặc cấu hình thêm nếu cần.
- **Priority**: Medium.

### ISS-B: Thay thế Favicon
- **Symptom**: File `favicon.ico` và `favicon.svg` vẫn là phiên bản cũ mặc định của Astro.
- **Action**: Thiết kế favicon in 3D mới cho Landing Page.
- **Priority**: Low.

---

## Lệnh Dev & Build
- Chạy dev server local: `ASTRO_TELEMETRY_DISABLED=1 npm run dev`
- Chạy build dự án: `ASTRO_TELEMETRY_DISABLED=1 npm run build`
- Chạy preview build: `npm run preview`
- Chạy tối ưu hóa ảnh: `node scripts/optimize-images.js`

---

## Metadata Đồng Bộ
```
Working on:  Hoàn thiện toàn bộ Landing Page in3D.help (Astro + CSS thuần + Assets)
Progress:    Đã code xong 100% components, sinh ảnh AI thành công, tối ưu hóa ảnh WebP & SEO, build thành công dự án.
Next:        Session sau sẽ tiến hành cấu hình lại Favicon và kiểm tra deploy trực tiếp.
Blockers:    Không có.
Last commit: e78d4ee focus: end session 2026-07-28
Updated:     2026-07-28 20:17
Machine:     Mac mini
```
