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

- **Điền template nhập liệu (Hoàn thành - 2026-07-28)**:
  - Đã hoàn thành 100% cập nhật các thông tin kỹ thuật về tấm pegboard modular (24x24cm ghép từ tấm giữa 16x16, 4 viền 4x16, 4 góc 4x4).
  - Làm rõ chi tiết gói sản phẩm 299k (bảng + chân đế + khay ngang + khay vuông) và gói 399k (thêm hộp bút + kẹp giấy).
  - Cập nhật chính sách phí ship theo vùng (Nội thành TP.HCM: 30k/<500k, Freeship >=500k; Ngoại thành: 50k/<1M, Freeship >=1M).
  - Đã đính kèm logo thương hiệu tại `public/logo.jpg`.

- **Phân tích kinh doanh & Định hướng thiết kế (Hoàn thành - 2026-07-28)**:
  - Hoàn thành phân tích chi tiết USP, đối thủ và 3 kịch bản tài chính tại [business_analysis.md](file:///Users/bangle-macmini/Projects/in3d-help/docs/business_analysis.md).
  - Lập tài liệu thiết kế chi tiết, bao gồm mã màu Hex và thư viện Prompt AI Midjourney/SDXL tại [Design.md](file:///Users/bangle-macmini/Projects/in3d-help/docs/Design.md).

---

## Pending Issues — Xử lý ở session sau

### ISS-C: Lập Kế hoạch thực thi & Viết code giao diện Landing Page
- **Symptom**: Cần lập Kế hoạch thực thi (Implementation Plan) chi tiết cho việc thiết kế trang Landing Page và tiến hành code bằng Astro + CSS thuần.
- **Action**:
  - 1. Soạn thảo tệp `implementation_plan.md` cho giao diện Landing Page để anh Bang duyệt.
  - 2. Soạn thảo copywriting chi tiết cho các mục trên trang.
  - 3. Triển khai lập trình các thành phần Astro và thiết lập CSS tương ứng.
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
Working on:  Phân tích kinh doanh, tài chính, định hướng thiết kế và chuẩn bị code Landing Page
Progress:    Hoàn thành 100% template nhập liệu, tạo xong business_analysis.md và Design.md.
Next:        Lập kế hoạch thực thi (Implementation Plan) và bắt đầu code giao diện Landing Page.
Blockers:    None
Last commit: 2a69596 focus: end session 2026-07-27
Updated:     2026-07-28 16:00
Machine:     Mac mini
```
