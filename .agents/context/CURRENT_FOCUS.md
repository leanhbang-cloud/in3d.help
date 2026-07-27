# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

- **Khởi tạo và cấu hình dự án (Hoàn thành - 2026-07-27)**:
  - Nhân bản thành công bộ khung Astro + CSS Design System từ dự án `dinh-mountain-help`.
  - Dọn dẹp sạch sẽ toàn bộ bài viết blog, dữ liệu cung đường, hình ảnh, API endpoints, và các component cũ liên quan đến Núi Dinh.
  - Đưa trang chủ `src/pages/index.astro` về dạng mẫu tối giản sạch sẽ, thừa hưởng CSS dùng chung và kết nối SEOHead.
  - Cập nhật toàn bộ tài liệu của Agent (`AGENT_README.md`, `MISSION.md`, `CURRENT_FOCUS.md`) hướng tới dự án in 3D mới.

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
Working on:  Khởi tạo dự án mới in3D.help & Dọn dẹp dữ liệu cũ
Progress:    Nhân bản dự án thành công, dọn dẹp sạch sẽ và cập nhật tài liệu Agent.
Next:        Nhận yêu cầu chi tiết về nội dung/giao diện in 3D từ anh Bang.
Blockers:    None
Last commit: Initial Setup
Updated:     2026-07-27 16:35
Machine:     Mac mini
```
