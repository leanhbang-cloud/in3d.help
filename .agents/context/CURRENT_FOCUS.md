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

- **Điền template nhập liệu (Hoàn thành phần lớn - 2026-07-27)**:
  - Hoàn thành cập nhật các phần: thông tin sáng lập (Ledainhan), thông tin thương hiệu (BlueMooon's Studio), cấu trúc pack giá modular (299k-399k-599k), chân dung khách hàng, quy trình đặt hàng tối giản và yêu cầu kỹ thuật (đa ngôn ngữ, SEO, GA).
  - Đã lưu trữ logo thương hiệu của anh Bang vào dự án tại `public/logo.jpg`.
  - Nhận xét sơ bộ: Dự án có định vị ngách pegboard modular cực tốt, bảng giá pack cố định giúp dễ chốt đơn, quy trình tinh gọn, định hướng visual Dark mode theo phong cách Open Design.

---

## Pending Issues — Xử lý ở session sau

### ISS-A: Bổ sung 4 điểm cần làm rõ trong template & viết tài liệu Design.md
- **Symptom**: Template thông tin còn 4 điểm cần làm rõ trước khi tiến hành code và copywriting chi tiết.
- **Action**: 
  - 1. Làm rõ các thành phần cụ thể trong từng Pack (299k - 399k - 599k).
  - 2. Xác định cơ chế lắp ghép tấm nền pegboard (18x18cm từ máy in Bambu A1 mini) để minh họa trực quan "lúa hóa" cho khách dễ hiểu.
  - 3. Liệt kê các màu sắc nhựa PLA Lite sẵn có của shop.
  - 4. Chuẩn bị tài liệu FAQ cụ thể để làm dữ liệu nạp vào Gemini Notebook hỗ trợ chat tự phục vụ.
  - Sau khi làm rõ, tiến hành phân tích USP chi tiết, viết tài liệu `Design.md`, soạn content và code giao diện Landing Page.
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
Working on:  Cập nhật template nhập liệu (Phần sáng lập, thương hiệu, sản phẩm, giá cả, visual & kỹ thuật)
Progress:    Cập nhật xong 90% template nhập liệu, copy logo vào public/logo.jpg.
Next:        Làm rõ 4 điểm còn thiếu, phân tích USP, viết Design.md và triển khai Landing Page.
Blockers:    None
Last commit: 169b6cc focus: end session 2026-07-27
Updated:     2026-07-27 23:05
Machine:     iMac
```
