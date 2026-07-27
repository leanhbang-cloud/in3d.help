# Báo cáo Kiểm thử Khả năng truy cập (Accessibility) & SEO — Phase 5

**Ngày thực hiện**: 2026-06-03
**QC Engineer**: Antigravity
**Trạng thái**: ⚠️ CÓ CẢNH BÁO (WARNING) - Cần khắc phục một số lỗi tương phản màu, thứ tự heading và thuộc tính Lightbox Modal để đạt chuẩn Accessibility tối đa. Phần SEO đạt điểm tối đa trên các trang nhưng thiếu tệp cấu hình robots.txt và sitemap.xml.

---

## 📊 1. Bảng điểm số Lighthouse A11y & SEO

Các tệp báo cáo và ảnh chụp màn hình chi tiết được lưu trữ tại `.agents/screenshots/`:
* [lh_a11y_seo_home.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_a11y_seo_home.png) (Ảnh chụp Lighthouse trang chủ)
* [lh_a11y_seo_ve_nui_dinh.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_a11y_seo_ve_nui_dinh.png) (Ảnh chụp Lighthouse trang Về Núi Dinh)
* [lh_a11y_seo_cung_1.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_a11y_seo_cung_1.png) (Ảnh chụp Lighthouse trang chi tiết cung 1)

| Tên Trang | Đường dẫn | Accessibility Score | SEO Score | Trạng thái chính |
|---|---|---|---|---|
| **Trang chủ** | `/` | 96/100 | 100/100 | ⚠️ Lỗi tương phản màu |
| **Các cung đường** | `/cac-cung-duong` | 96/100 | 100/100 | ⚠️ Lỗi tương phản màu |
| **Chi tiết Cung 1** | `/cac-cung-duong/cung-1` | 91/100 | 100/100 | 🔴 Lỗi tương phản, heading, lightbox |
| **Di chuyển** | `/di-chuyen` | 95/100 | 100/100 | ⚠️ Lỗi tương phản, heading |
| **Cẩm nang an toàn** | `/cam-nang-an-toan` | 95/100 | 100/100 | ⚠️ Lỗi tương phản, heading |
| **Về Núi Dinh** | `/ve-nui-dinh` | 93/100 | 100/100 | 🔴 Lỗi tương phản, lightbox |

---

## ♿ 2. Chi tiết lỗi Khả năng truy cập (Accessibility Audit)

### 2.1. Lỗi tương phản màu (Color Contrast - Nghiêm trọng)
Nhiều phần tử văn bản có độ tương phản với màu nền không đạt chuẩn tối thiểu **4.5:1** (theo tiêu chuẩn WCAG AA), gây khó đọc:
1. **Nút/Pill Khẩn cấp (Mobile)**: Chữ Nâu Cognac `#5C3D20` trên nền Vàng Gold `#C8A45D` (Tỉ lệ đạt **4.16:1**, cần 4.5:1).
2. **Nhãn phần khẩn cấp ở Footer (Desktop)**: Chữ Vàng Gold `#C8A45D` trên nền Nâu Cognac `#5C3D20` (Tỉ lệ đạt **4.16:1**, cần 4.5:1).
3. **Mục Section Labels**: Các nhãn như `TỔNG QUAN`, `KHÁM PHÁ`, `LỊCH SỬ`, `HỆ SINH THÁI`, `TÂM LINH` đang dùng chữ Vàng Gold `#C8A45D` trên nền Kem nhạt `#FAF6EF` hoặc Trắng ấm (Tỉ lệ đạt **2.09:1 - 2.18:1**, cực kỳ thấp và mờ mắt).
4. **Mẹo của Bang (Gold Strip)**: Chữ Nâu nhạt body-sm `#7A5C3A` (`--color-text-light`) trên nền Vàng Gold `#C8A45D` (Tỉ lệ đạt **2.6:1**, cần 4.5:1).
5. **Nút Reset Checklist (Trang Cẩm nang)**: Chữ Nâu nhạt `#7A5C3A` trên nền Kem `#FAF6EF` (Tỉ lệ đạt **3.1:1**).

### 2.2. Lỗi thứ tự Tiêu đề (Heading Order)
Thứ tự các thẻ tiêu đề (H1 -> H6) bị nhảy cấp, không tuần tự:
1. **Trang chi tiết cung đường (`[slug].astro`)**: Tiêu đề phần lộ trình là `H2` (`Lộ Trình Chi Tiết`), nhưng các tiêu đề chặng bên dưới lại dùng `H4` (`.timeline-title`), bỏ qua `H3`.
2. **Trang Cẩm nang (`cam-nang-an-toan.astro`)**: Sử dụng `H4` cho `.category-title` (`🧥 Trang phục`) và `.safety-title` (`Phòng tránh lạc đường`) ngay dưới phần tiêu đề chính, gây đứt đoạn phân cấp.
3. **Trang Di chuyển (`di-chuyen.astro`)**: Quán ăn/điểm gửi xe dùng `H4` (`.card-e-title`) không có `H3` làm cha.

### 2.3. Lỗi Lightbox Modal (`aria-hidden` chứa phần tử nhận Focus)
* **Triệu chứng**: Khi Lightbox đóng, thẻ Modal bao ngoài (`.lightbox` hoặc `.lightbox-modal`) được gán thuộc tính `aria-hidden="true"`, nhưng các nút đóng `✕`, chuyển ảnh `◀` `▶` bên trong vẫn có thể nhận tiêu điểm (Tab Focus) từ bàn phím.
* **Hậu quả**: Lighthouse chấm điểm 0 cho phần này vì screen reader và bàn phím của người dùng bị điều hướng vào một khu vực ẩn vô hình, cực kỳ nhiễu loạn trải nghiệm.

---

## 🔍 3. Chi tiết lỗi SEO Audit

### 3.1. Điểm đạt (SEO Score 100/100)
* Toàn bộ 5 trang chính đã khai báo đầy đủ thẻ `<title>` độc lập, thẻ `<meta name="description">` tóm tắt nội dung hấp dẫn, không trùng lặp.
* Đã khai báo thẻ `<meta name="robots" content="index, follow" />` giúp Google Spider thu thập thông tin dễ dàng.
* Tích hợp Open Graph Metadata chuẩn chỉnh phục vụ chia sẻ Facebook.

### 3.2. Điểm thiếu sót (Cần bổ sung cấu hình)
* Không tồn tại tệp `robots.txt` tại thư mục `/public` để hướng dẫn bot tìm kiếm.
* Không có tệp `sitemap.xml` để liệt kê các đường dẫn tĩnh phục vụ lập chỉ mục tự động.

---

## 🛠️ Đề xuất Khắc phục & Phương án xử lý (Action Items Phase 5)

### Hướng giải quyết Accessibility (A11y):
1. **Sửa tương phản màu (Footer & Hero)**:
   * Đổi màu chữ của `.pill-btn` (mobile khẩn cấp) từ `--color-cognac` (`#5C3D20`) sang màu đậm hẳn là màu Xanh Rừng Già `--color-forest` (`#1E3A28` -> Đạt tỉ lệ tương phản **6.9:1**, vượt chuẩn 4.5:1).
   * Đổi màu chữ `.emergency-label` ở dải khẩn cấp Footer thành màu `--color-cream` (`#F0E6D0` -> Đạt tỉ lệ tương phản **6.2:1**) thay vì dùng màu Gold mờ nhạt.
   * Đổi màu chữ của `.section-label` (badge in hoa) thành màu `--color-forest` (`#1E3A28` -> Đạt **6.5:1** trên nền Kem) để hiển thị rõ ràng và sắc nét.
   * Cấu hình CSS cho `.strip-gold` ép toàn bộ chữ con (kể cả thẻ `strong` hay `body-sm`) dùng đúng màu `--color-cognac` (`#5C3D20` -> Đạt **4.16:1** sát nút, hoặc dùng màu Forest `#1E3A28` để đạt **6.9:1**).
2. **Sửa thứ tự Heading**:
   * Sửa các thẻ `h4` của `.timeline-title` thành `h3` trong `src/pages/cac-cung-duong/[slug].astro`.
   * Sửa các thẻ `h4` lỗi phân cấp trong `cam-nang-an-toan.astro` và `di-chuyen.astro` thành `h3`.
3. **Sửa Lightbox Modal Focus**:
   * Khi đóng Lightbox, ngoài việc set `aria-hidden="true"`, ta cần gán thêm CSS `visibility: hidden;` cho `.lightbox-modal` và `.lightbox`. Thuộc tính `visibility: hidden` sẽ ẩn phần tử khỏi cây Accessibility và ngăn chặn việc nhận Tab Focus từ bàn phím một cách tự nhiên. Khi mở modal, set lại `visibility: visible;` trong class `.is-active` / `.is-open`.

### Hướng giải quyết SEO:
1. **Thêm tệp `public/robots.txt`**:
   ```txt
   User-agent: *
   Allow: /
   Sitemap: https://billy-ai-blog.vercel.app/sitemap.xml
   ```
2. **Tích hợp Sitemap Generator**:
   * Cài đặt tích hợp `@astrojs/sitemap` để Astro tự động kết xuất tệp `sitemap.xml` khi chạy build production.
