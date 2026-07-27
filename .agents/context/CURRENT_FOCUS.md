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

---

## Pending Issues — Xử lý ở session sau

### ISS-A: Thiết kế nội dung trang chủ Sale Page in 3D
- **Symptom**: Trang chủ `src/pages/index.astro` hiện tại đang là trang trống/tối giản dạng placeholder.
- **Action**: Thiết kế giao diện và viết nội dung bán hàng chi tiết (Hero, Benefits, Pricing, FAQ, Form CTA).
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
Working on:  Cấu hình và đồng bộ dự án lên Cloudflare Pages & GitHub
Progress:    Dọn dẹp tài liệu cũ, cấu hình độc lập tĩnh (SSG) và deploy thành công lên Cloudflare Pages.
Next:        Thiết kế nội dung trang chủ Sale Page in 3D (Hero, Bảng giá, FAQ, CTA Zalo)
Blockers:    None
Last commit: aac1b48 chore: remove cloudflare adapter to build standard static site into dist/
Updated:     2026-07-27 17:08
Machine:     Mac mini
```
