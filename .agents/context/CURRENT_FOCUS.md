# Current Focus — in3D.help
 
> **Purpose**: Lightweight state file for cross-machine sync.
> Overwrite (not append) at end of each session.
> AI agents read this FIRST when resuming work.

## Trạng thái hiện tại (State of the Project)

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
  - Tối ưu và cắt ghép ảnh gốc của Misa tạo `misa-portrait.webp` và `misa-avatar.webp` dạng WebP sắc nét.
  - Tái cấu trúc copywriting toàn bộ 9 Astro components chính sang giọng văn lễ phép, đáng yêu của bé Misa và bố.

- **Tối ưu hóa Hero Section & Section Spacing (Hoàn thành - 2026-07-30)**:
  - Tối ưu hóa nhãn CTA nút Zalo thành `"Tư vấn miễn phí"` tại [Hero.astro](file:///Users/bangle-macmini/Projects/in3d-help/src/components/Hero.astro).
  - Tái cấu trúc Stats di chuyển xuống chân của Hero Section (nằm dưới visual hình ảnh trên di động).
  - Dàn ngang Stats trên di động, hỗ trợ tự động thu nhỏ vòng ring và cỡ chữ trên thiết bị nhỏ để vừa khít màn hình.
  - Khai báo ánh xạ hệ thống Spacing Tokens chuẩn vào `:root` của [global.css](file:///Users/bangle-macmini/Projects/in3d-help/src/styles/global.css).
  - Điều chỉnh `.hero-art` sử dụng `aspect-ratio: 4 / 3` và `object-fit: cover` giúp khung viền ôm sát tấm ảnh pegboard khít khao.
  - Thiết lập `.hero-stats` cách chân ảnh chuẩn chỉ `48px` (desktop) và `32px` (mobile).

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
Working on:  Đã tối ưu hóa hình ảnh Test sang WebP và dọn dẹp visual.
Progress:    Tối ưu hóa thành công 6 ảnh phân giải cao trong thư mục Test, viết script chuyên biệt.
Next:        Tiếp tục theo dõi phản hồi của khách hàng đối với Landing Page mới.
Blockers:    None
Last commit: e25d2e7 focus: end session 2026-07-31 (remote main)
Updated:     2026-07-31 16:15
Machine:     Mac mini
```
