# Kế hoạch Chuẩn hóa UI/UX Module Tương tác theo Design System (Đã qua Audit)

Chuẩn hóa giao diện của 4 component/trang tương tác mới phát triển bao gồm: **Bình luận (`CommentsSection.astro`)**, **Gửi ảnh (`upload-anh.astro`)**, **Thư viện ảnh (`thu-vien-anh.astro`)**, và **Giao diện Admin (`admin/index.astro`)** để tuân thủ 100% tài liệu [DESIGN_SYSTEM.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/DESIGN_SYSTEM.md) của dự án. 

Bản kế hoạch này đã được audit bởi Genspark để bổ sung các đặc tả a11y, border-radius, disabled states, focus visible, checkbox/checklist, và tích hợp kế hoạch QC 5 layers.

---

## User Review Required

> [!IMPORTANT]
> **Đảm bảo tính nguyên vẹn của Logic Backend**: Việc tái cấu trúc HTML & CSS này sẽ được tiến hành vô cùng cẩn thận để giữ nguyên toàn bộ logic tương tác API Cloudflare D1/R2, nén ảnh client-side, và các hàm kiểm duyệt hiện có.
>
> **Tích hợp Lightbox nội bộ**: Chuyển đổi cơ chế xem ảnh trong Thư viện ảnh từ mở tab mới (`target="_blank"`) sang hiển thị dạng Lightbox Overlay trực tiếp trên trang, có hỗ trợ vuốt chạm trên mobile, phím điều hướng trên desktop và nút đóng thiết kế riêng biệt theo mục 11 của Design System.

---

## Các cập nhật & bổ sung sau khi Audit

### 1. Quy định kiểu dáng & Trạng thái phần tử tương tác (Buttons & Inputs)
* **Border Radius:** 
  * Buttons: Cố định `8px`.
  * Badges: Cố định `6px`.
  * Cards, Forms, Dropzone, và Image Previews: Cố định `12px`.
  * Text inputs & Textarea: Cố định `8px`.
* **Title Case cho tiếng Việt:** Các nút bấm tiếng Việt phải được viết hoa chữ cái đầu của mỗi từ (Ví dụ: *"Gửi Bình Luận"*, *"Chọn Từ Máy"*, *"Duyệt"*, *"Từ Chối"*, *"Xóa"*). Không viết thường toàn bộ và không viết hoa ALL CAPS (trừ Badge).
* **Trạng thái Disabled (Vô hiệu hóa):** Khi đang xử lý dữ liệu (loading/uploading), nút bấm phải chuyển sang nền Nâu xám `--color-disabled` (`#B0957A`), chữ Kem, giảm opacity xuống `0.6` và cursor là `not-allowed`.
* **Focus Visible (A11y):** Khi người dùng navigate bằng phím Tab, mọi phần tử tương tác (inputs, buttons, links, pagination, checkboxes) phải có viền outline màu Vàng Gold `2px solid #C8A45D`, cách phần tử 2px (`outline-offset: 2px`).

### 2. Checkbox & Checklist (Dành cho trang Admin)
* **Kích thước:** Checkbox visual có kích thước `20px x 20px` với border-radius `4px`.
* **Vùng chạm (Touch target):** Mở rộng clickable area tối thiểu đạt `44px x 44px` (WCAG 2.5.5 AA) bằng cách thêm padding cho dòng chứa.
* **Màu sắc:**
  * Default: Viền `2px` màu Nâu xám `#B0957A`, nền Trắng Ấm `#FAF6EF`.
  * Hover/Focus: Viền màu Cognac `#5C3D20`.
  * Checked: Nền đổi sang màu Cognac `#5C3D20`, hiển thị dấu check màu Kem `#F0E6D0`.
  * Checked text: Chữ nhãn chuyển sang màu Nâu nhạt `#7A5C3A` và gạch ngang chữ.

### 3. Cấu trúc Lightbox (Thư viện ảnh)
* **Semantic HTML & ARIA:** Lightbox container sử dụng `role="dialog"`, `aria-modal="true"`, và `aria-label="Xem ảnh lớn"`. Khi mở Lightbox, thực hiện focus trap bằng JS để giữ focus phím Tab tuần hoàn bên trong các nút điều hướng của Lightbox.
* **Touch Target Size Mobile:** Nút đóng (✕) và các mũi tên điều hướng trái/phải co về visual `40px` trên mobile nhưng phải cấu hình padding CSS để diện tích tương tác thực tế đạt tối thiểu `44px x 44px`.

### 4. Progress Bar & Alert (Trang Tải ảnh)
* **Aria attributes:** Progress bar sử dụng các thuộc tính ARIA: `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, và cập nhật `aria-valuenow` động bằng JS.
* **Empty State:** Khi Thư viện ảnh hoặc danh sách phê duyệt trống, hiển thị một thông báo Kem Ấm, chữ Nâu nhạt với icon tinh tế thay vì để khoảng trống.

---

## Proposed Changes

Chúng ta sẽ thực hiện sửa đổi trên 4 file UI chính tại nhánh `feat/interactive-module`.

### Component Bình luận

#### [MODIFY] [CommentsSection.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/CommentsSection.astro)
- Đổi background form viết bình luận và comment card sang **Kem Ấm** (`#F0E6D0`), viền trái comment card dày 3px màu **Vàng Gold** (`#C8A45D`).
- Đổi nút "Gửi bình luận" sang nút **Primary** (Cognac `#5C3D20` nền, Kem `#F0E6D0` chữ, hover sang Cognac tối `#4A3018`, radius 8px).
- Sửa font chữ theo Design System (Roboto/Roboto Mono).
- Chuyển thông báo thành công/thất bại sang dùng **Badge Variants** (Thành công: Xanh Rừng Già `#1E3A28` nền, chữ Kem; Thất bại: Cognac `#5C3D20` nền, chữ Kem).

### Giao diện Gửi ảnh

#### [MODIFY] [upload-anh.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/pages/upload-anh.astro)
- Cập nhật background form và dropzone sang Kem Ấm.
- Đổi nút "Gửi ảnh" sang nút **Primary** (Cognac bg, Kem text).
- Đổi style thanh tiến trình (Progress Bar): track nền Trắng Ấm (`#FAF6EF`) viền Nâu xám (`#B0957A`), phần chạy (Fill) dùng màu **Vàng Gold** (`#C8A45D`). Thêm thuộc tính ARIA.
- Thay thế các class status thành công/lỗi mặc định của Tailwind bằng Badge Variants.
- Cấu hình border input mặc định Nâu xám, focus Vàng Gold.

### Giao diện Thư viện ảnh

#### [MODIFY] [thu-vien-anh.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/pages/thu-vien-anh.astro)
- Loại bỏ thẻ `<a>` mở tab mới trên các ảnh. Thay thế bằng phần tử `<button type="button" class="gallery-item" ...>` để kích hoạt Lightbox.
- **Tích hợp Lightbox Component** ngay trên trang:
  - Lớp nền mờ (Backdrop): `rgba(0, 0, 0, 0.85)`.
  - Nút đóng (✕): Icon button tròn `40x40px`, nền Forest `#1E3A28`, chữ Kem `#F0E6D0`, hover sang Cognac. Touch target tối thiểu 44px.
  - Nút mũi tên chuyển ảnh: Nút tròn viền Gold, nền transparent, chữ Gold; hover đổi nền Gold chữ Cognac. Co size 48px -> 40px mobile (đảm bảo touch area 44px).
  - Tích hợp điều khiển bàn phím (`ESC`, `←`, `→`), vuốt chạm ngang (`swipe`) và double-tap để zoom 1.5x trên mobile.
  - Tách thumbnail (dưới 40KB) và full-size (chỉ load khi phóng to).
- Cải tiến nút phân trang (Pagination):
  - Nút thường dùng dạng **Secondary Button** (transparent, viền Cognac 2px, chữ Cognac; hover đổi nền Cognac chữ Kem).
  - Nút trang hiện tại dùng nền Cognac, chữ Kem.

### Giao diện Admin

#### [MODIFY] [admin/index.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/pages/admin/index.astro)
- Đổi background stats card và panels sang Kem Ấm, viền trái Gold.
- Chuẩn hóa nút kiểm duyệt:
  - Nút **Duyệt** (Approve): Nền Forest `#1E3A28`, chữ Kem `#F0E6D0` (Success Badge color).
  - Nút **Từ chối** (Reject): Cấu hình giống nút **Secondary** (nền trong suốt, viền Cognac 2px, chữ Cognac).
  - Nút **Xóa** (Delete): Nền Cognac `#5C3D20`, chữ Kem `#F0E6D0` (Danger Badge color).
- Đổi badge trạng thái của mục sang các badge chuẩn (CHỜ DUYỆT: Warning Badge; ĐÃ DUYỆT: Success Badge; TỪ CHỐI: Danger Badge).
- Chuẩn hóa Header bảng quản trị: Nền Cognac `#5C3D20`, chữ Kem `#F0E6D0`. Border bảng dùng màu Nâu xám (`#B0957A`).

---

## Verification Plan

### Automated Tests
- Chạy build cục bộ để kiểm tra lỗi TypeScript hoặc Astro compiler:
  ```bash
  npm run build
  ```

### Kế hoạch Kiểm QC Chi tiết
Chúng ta sẽ chạy bộ kiểm QC 5 layers đầy đủ gồm 59 test cases đã được xây dựng tại:
* File dự án: [.agents/plans/2026-06-19-ui-qc-test-plan.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/plans/2026-06-19-ui-qc-test-plan.md)
* File Artifact: [2026-06-19-ui-qc-test-plan.md](file:///Users/bangle-macmini/.gemini/antigravity/brain/4a5c30c6-2d09-4c67-bdf1-3e435be5f4ce/2026-06-19-ui-qc-test-plan.md)
