# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

- **Cấu hình & Đồng bộ Cloudflare Pages (Hoàn thành - 2026-07-27)**:
  - Dọn dẹp hoàn toàn các tài liệu cũ không liên quan của dự án Núi Dinh.
  - Cấu hình lại `astro.config.mjs` và `wrangler.jsonc` để chạy tĩnh (SSG) độc lập.
  - Thiết lập remote và đồng bộ mã nguồn lên GitHub repository mới: https://github.com/leanhbang-cloud/in3d.help.
  - Kết nối và deploy thành công trên Cloudflare Pages mặc định tại https://in3d-help.pages.dev.

- **Tạo template thu thập thông tin dịch vụ (Hoàn thành - 2026-07-27)**:
  - Liên hệ Genspark tạo bộ khung câu hỏi khảo sát chi tiết.
  - Tạo file `docs/template_nhap_lieu.md` để anh Bang điền làm đầu vào cho thiết kế và copywriting.

---

## Pending Issues — Xử lý ở session sau

### ISS-A: Điền thông tin dịch vụ & Thiết kế trang chủ Sale Page in 3D
- **Symptom**: Trang chủ `src/pages/index.astro` là trang trống dạng placeholder; cần thông tin chi tiết từ anh Bang để triển khai.
- **Action**: Đợi anh Bang điền đầy đủ file `docs/template_nhap_lieu.md`, sau đó viết `Design.md`, soạn nội dung bán hàng và code giao diện (Hero, Benefits, Pricing, FAQ, Form CTA).
- **Priority**: High.

### ISS-B: Thay thế Favicon và Hình ảnh thương hiệu
- **Symptom**: File `favicon.ico` và `favicon.svg` vẫn là phiên bản cũ, chưa có ảnh minh họa/ảnh OG cho in 3D.
- **Action**: Thay thế logo/favicon mới và chuẩn bị tài nguyên ảnh in 3D.
- **Priority**: Medium.

---

## Lệnh Dev & Build
- Chạy dev server local: `npm run dev`
- Chạy build dự án: `npm run build`
- Chạy preview build: `npm run preview`

---

## Metadata Đồng Bộ
```
Working on:  Tạo template thu thập thông tin in 3D làm ngữ cảnh thiết kế & nội dung
Progress:    Hoàn thành tạo docs/template_nhap_lieu.md gửi anh Bang.
Next:        Đọc template đã điền, viết Design.md, soạn content và code Landing Page (Hero, Bảng giá, FAQ, CTA).
Blockers:    None
Last commit: 4df781e focus: end session 2026-07-27
Updated:     2026-07-27 17:16
Machine:     Mac mini
```
