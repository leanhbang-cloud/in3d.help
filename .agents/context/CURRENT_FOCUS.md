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
  - Lập tài liệu thiết kế chi tiết, bao gồm mã màu Hex và thư viện Prompt AI Midjourney/SDXL tại [Design.md](file:///Users/bangle-macmini/Projects/in3d-help/docs/Design.md).

- **Xây dựng Landing Page (Hoàn thành - 2026-07-28)**:
  - Đã hoàn thành lập trình giao diện Landing Page (Sale Page) bằng Astro + CSS thuần lấy cảm hứng thiết kế Atelier Zero của Open Design kết hợp hệ tối Dark Tech.
  - Viết 12 Astro components modular trong `src/components/` và điều phối hoạt ảnh cuộn trang (`data-reveal`), Headroom Nav, FAQ Accordion thông qua `src/scripts/main.js`.
  - Sinh 4 hình ảnh AI chất lượng cao thông qua Genspark Image (hero display, exploded view, founder portrait, lifestyle gallery) và lưu vào `public/images/`.
  - Chạy `npm run build` thành công trong 1.07s. Đồng bộ hóa mã nguồn lên GitHub tại repo `leanhbang-cloud/in3d.help` (Commit: `36da7f4`).

---

## Pending Issues — Xử lý ở session sau

### ISS-A: Cấu hình Deploy Preview & Testing trên Vercel/Cloudflare Pages
- **Symptom**: Cần tích hợp deploy tự động (CI/CD) cho branch `main` và kiểm tra điểm số Lighthouse trên môi trường production thực tế.
- **Action**: Theo dõi Cloudflare Pages build hoặc cấu hình thêm nếu cần.
- **Priority**: Medium.

### ISS-B: Thay thế Favicon và Hình ảnh OG
- **Symptom**: File `favicon.ico` và `favicon.svg` vẫn là phiên bản cũ mặc định của Astro.
- **Action**: Thiết kế favicon in 3D mới và chỉ định ảnh OG (Open Graph) đại diện cho Landing Page.
- **Priority**: Low.

---

## Lệnh Dev & Build
- Chạy dev server local: `ASTRO_TELEMETRY_DISABLED=1 npm run dev`
- Chạy build dự án: `ASTRO_TELEMETRY_DISABLED=1 npm run build`
- Chạy preview build: `npm run preview`

---

## Metadata Đồng Bộ
```
Working on:  Hoàn thiện toàn bộ Landing Page in3D.help (Astro + CSS thuần + Assets)
Progress:    Đã code xong 100% components, sinh ảnh AI thành công và build thành công dự án.
Next:        Session sau sẽ tiến hành cấu hình lại Favicon, thiết lập OG image và kiểm tra deploy trực tiếp.
Blockers:    Không có.
Last commit: 36da7f4 feat: Implement Dark Tech Editorial Landing Page for in3D.help
Updated:     2026-07-28 17:31
Machine:     Mac mini
```
