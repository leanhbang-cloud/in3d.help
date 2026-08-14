# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

- **Nghiên cứu & Thiết kế Nhãn TKB Kadis Pegboard (Hoàn thành - 2026-08-14)**:
  - Nghiên cứu thành công thông số kỹ thuật của bảng IKEA SKÅDIS chính hãng (lỗ oval 5x15mm, độ dày 5mm, lưới so le pitch 20mm/40mm).
  - Phân tích thiết kế bảng 3MF (`SKADIS_modular_board_3.0_mini_comp.3mf`): lưới so le pitch 20mm, viền răng cưa lắp ghép sâu 10/30mm (trên/dưới) và 15/35mm (trái/phải) để giữ thành lỗ dày đều 1.5mm.
  - Trích xuất thành công 2 file STL chuẩn (`SKADIS_board_158x158.stl` và `SKADIS_mounting_clip.stl`) từ file 3MF để sử dụng độc lập.
  - Thiết kế thành công file OpenSCAD nhãn môn học `SKADIS_subject_tag.scad` dạng đục lỗ chữ thông suốt (stencil) tối ưu in úp mặt (Face-down), không cần support, chân cắm (peg) lệch lên mép trên 4.5mm chống cấn chữ. Sửa lỗi gương ngược chữ khi in úp bằng lệnh `mirror([1,0,0])`.
  - Tạo script Python `generate_all_tags.py` tự động hóa kết xuất 43 file STL (Thứ, Tiết, Môn học viết tắt không dấu) xuất vào thư mục `stl_outputs`. Sửa lỗi Unicode ký tự có dấu khiến Bambu Studio báo lỗi lệch bàn in.

- **Tối ưu hóa hình ảnh Test phân giải cao (Hoàn thành - 2026-07-31)**:
  - Tạo script [optimize-test-folder.js](file:///Users/bangle-macmini/Projects/in3d-help/scripts/optimize-test-folder.js) hỗ trợ tự động tối ưu hóa và chuyển đổi ảnh trong thư mục `Test`.
  - Nén thành công 6 file PNG siêu nặng (~50MB) của Gemini sinh ra trong thư mục `Test` sang định dạng WebP siêu nhẹ dưới 200KB (giảm hơn 98% dung lượng), lưu tại [public/images/Test/](file:///Users/bangle-macmini/Projects/in3d-help/public/images/Test).

- **Thay thế và tối ưu hóa hình ảnh sản phẩm thực tế mới (Hoàn thành - 2026-07-31)**:
  - Tích hợp thành công ảnh mèo thần tài (`lifestyle-kitty.webp`, 74KB) và ảnh sơ đồ kích thước 40cm chính xác (`detail-assembly-v3.webp`, 35KB) vào dự án.
  - Sử dụng cơ chế Cache Busting (đổi tên file thành `-v3` và `lifestyle-kitty`) để vượt qua bộ nhớ đệm CDN của Cloudflare và trình duyệt.
  - Chạy tối ưu hóa nén Sharp sang định dạng WebP siêu nhẹ cho các tài nguyên ảnh mới.
  - Cập nhật lại các component `LifestyleGallery.astro` và `ModularExplainer.astro`.

- **Thay thế Hero Image bằng Video Lắp Ráp & Phối màu (Hoàn thành - 2026-07-31)**:
  - Nén video gốc thành `hero-video.mp4` (560KB) và `hero-video.webm` (664KB) loại bỏ âm thanh để tối ưu tải trang.
  - Trích xuất poster frame giây thứ 2 lưu thành `hero-video-poster.webp` siêu nhẹ (11.7KB).
  - Tái cấu trúc [Hero.astro](file:///Users/bangle-macmini/Projects/in3d-help/src/components/Hero.astro) chèn thẻ `<video>` hỗ trợ autoplay, muted, playsinline, loop, và preload metadata.
  - Viết code JS trong Hero component dùng `IntersectionObserver` tự động tạm dừng phát video khi người dùng cuộn ra ngoài màn hình và tôn trọng thiết lập `prefers-reduced-motion: reduce`.
  - Cấu hình CSS trong [global.css](file:///Users/bangle-macmini/Projects/in3d-help/src/styles/global.css) đảm bảo z-index chính xác (spotlight sau video, các corner bracket và annotation chữ nằm trên video), ẩn control bar và responsive mượt mà tỷ lệ 4:3 trên mobile.
  - Preload ảnh poster và WebM video trong thẻ head của [Layout.astro](file:///Users/bangle-macmini/Projects/in3d-help/src/layouts/Layout.astro).

- **Thay đổi nhân vật sang bé Misa 9 tuổi (Hoàn thành - 2026-07-30)**:
  - Tối ưu và cắt ghép ảnh gốc của Misa tạo `misa-portrait.webp` and `misa-avatar.webp` dạng WebP sắc nét.
  - Tái cấu trúc copywriting toàn bộ 9 Astro components chính sang giọng văn lễ phép, đáng yêu của bé Misa và bố.

- **Tối ưu hóa Hero Section & Section Spacing (Hoàn thành - 2026-07-30)**:
  - Tối ưu hóa nhãn CTA nút Zalo thành `"Tư vấn miễn phí"` tại [Hero.astro](file:///Users/bangle-macmini/Projects/in3d-help/src/components/Hero.astro).
  - Tái cấu trúc Stats di chuyển xuống chân của Hero Section (nằm dưới visual hình ảnh trên di động).
  - Dàn ngang Stats trên di động, hỗ trợ tự động thu nhỏ vòng ring và cỡ chữ trên thiết bị nhỏ để vừa khít màn hình.
  - Khai báo ánh xạ hệ thống Spacing Tokens chuẩn vào `:root` của [global.css](file:///Users/bangle-macmini/Projects/in3d-help/src/styles/global.css).
  - Điều chỉnh `.hero-art` sử dụng `aspect-ratio: 4 / 3` and `object-fit: cover` giúp khung viền ôm sát tấm ảnh pegboard khít khao.
  - Thiết lập `.hero-stats` cách chân ảnh chuẩn chỉ `48px` (desktop) and `32px` (mobile).

- **Sửa lỗi hiển thị giao diện trên thiết bị di động (Hoàn thành - 2026-07-30)**:
  - Ẩn hoàn toàn Top Bar trên mobile (màn hình <= 768px).
  - Dàn ngang hai nút CTA của Hero, chia đều chiều rộng, áp dụng text-overflow ellipsis tránh tràn chữ và thu hẹp padding.

- **Sửa lỗi cache Cloudflare CDN trên production (Hoàn thành - 2026-07-30)**:
  - Thêm một rule CSS vô hại `#cache-buster-element-unique` ở cuối file `global.css` nhằm ép Vite sinh ra mã hash mới cho file CSS built ra.

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
Working on:  Nghiên cứu & Thiết kế Nhãn TKB Kadis Pegboard
Progress:    Hoàn thành xuất 43 file STL đục chữ không dấu in úp mặt và trích xuất mesh từ 3MF.
Next:        Tiến hành in thử nghiệm các nhãn môn học STL và gắn thử lên bảng.
Blockers:    None
Last commit: 98414b4
Updated:     2026-08-14 16:15
Machine:     Mac mini
```
