# Kế hoạch thực hiện Phase 3: Trang Di Chuyển & Về Núi Dinh (Cập nhật v1.2)

Mục tiêu của Phase 3 là phát triển 2 trang thông tin phụ: Trang Hướng dẫn di chuyển (`/di-chuyen`) và Trang thông tin văn hóa/lịch sử (`/ve-nui-dinh`), tuân thủ tuyệt đối quy chuẩn Design System v1.2.

---

## Quyết định Thiết kế & Specs (Đã lock với User)

### 1. Sub-hero Section
- **Kích thước**: Cao `320px` desktop / `240px` mobile. Padding dọc `64px`. Không có scroll indicator hay location pill.
- **`/di-chuyen`**: Biến thể phẳng, nền Kem Ấm `#F0E6D0`, tiêu đề H1 Roboto Slab Bold màu Cognac, không dùng ảnh nền để tập trung vào thông tin.
- **`/ve-nui-dinh`**: Biến thể hình ảnh, có ảnh nền chùa cổ trong rừng, overlay `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)`, tiêu đề màu Cream.

### 2. Tab Component (trên `/di-chuyen`)
- **Kích thước**: Tab bar cao `48px`.
- **Default**: Nền `transparent`, border-bottom `2px solid transparent`, chữ Cognac `#5C3D20`, font Roboto 16px weight 500.
- **Active**: Border-bottom `2px solid #C8A45D` (Gold), chữ Cognac weight 600.
- **Hover**: Chữ chuyển sang Gold, transition `200ms ease-out`.
- **Container**: Border-bottom `1px solid #B0957A` (màu disabled) chạy full-width dưới tab bar.
- **Mobile**: 3 tabs chia đều `flex: 1`, stack icon trên + label dưới nếu chữ dài.

### 3. Card E (Service Card - trên `/di-chuyen`)
- Thay thế hoàn toàn đề xuất dùng Card B cũ.
- Nền Cream `#F0E6D0`, padding 24px, border-radius 12px, không border-left.
- H4 tên bãi xe (Cognac).
- Forest data strip: Giá gửi xe + giờ mở cửa.
- Body-sm: Dịch vụ đi kèm.
- Dưới cùng: Tọa độ GPS (hiển thị dạng inline code: Roboto Mono 14px, màu Forest, nền Cream nhạt) + nút Ghost "Sao chép" (cao 36px, kèm icon 📋).
- **Visual Feedback**: Click nút copy → text đổi thành "✓ Đã copy", chữ chuyển Forest `#1E3A28` trong 2 giây rồi revert.
- **iOS Fallback**: Sử dụng `navigator.clipboard` kết hợp `document.execCommand` fallback cho iOS Safari cũ.
- **Gộp dữ liệu**: Bỏ bảng GPS riêng biệt, tích hợp trực tiếp dữ liệu GPS và hành động sao chép vào từng Card E để giảm cognitive load.

### 4. Gallery & Lightbox (trên `/ve-nui-dinh`)
- Tích hợp Gallery 6-8 ảnh ở giữa section Lịch sử và Tâm linh.
- Click ảnh → mở Lightbox (màu đen sẫm `rgba(0,0,0,0.85)`, hỗ trợ phím ESC/mũi tên trên desktop và vuốt swipe/double-tap trên mobile).
- Ảnh mẫu sẽ được tạo bằng `generate_image` với prompt chuẩn tông màu ấm của rừng núi và chùa cổ.
- **Quy tắc hiệu năng**: Thumbnail .webp <40KB, Full-size .webp <120KB.

### 5. Định vị Mobile Strips trên `/ve-nui-dinh`
Khi ở chế độ mobile (sidebar ẩn), các strips xuất hiện theo trình tự đọc:
- **Gold Strip** (Góc của Bang - quote về tĩnh lặng Suối Tiên) đặt ngay sau đoạn "Lịch sử & Căn cứ Cách mạng".
- **Cognac Strip** (Cảnh báo bảo vệ rừng) đặt sau đoạn "Hành trình tâm linh" (trước footer/section cuối).

### 6. Rút gọn Card D (trên `/ve-nui-dinh`)
Rút gọn nội dung cảnh báo về 3 dòng và 1 nút ghost trỏ sang `/cam-nang-an-toan`:
> ⚠️ **Lưu ý quan trọng**
> Núi Dinh là rừng phòng hộ. Vui lòng mang rác xuống núi, không đốt lửa ngoài khu vực cho phép — vụ cháy năm 2023 đã thiêu rụi 15 ha rừng.
> *Đọc cẩm nang an toàn đầy đủ →*

### 7. SEO & Meta Specs
- **`/di-chuyen`**:
  - Title: `"Hướng dẫn di chuyển đến Núi Dinh từ Sài Gòn | Núi Dinh Guide"`
  - Description: `"Thông tin chi tiết đường đi, phương tiện xe máy, ô tô, xe khách và tọa độ GPS các bãi gửi xe uy tín tại Núi Dinh."`
  - Schema: `HowTo` (các bước di chuyển).
- **`/ve-nui-dinh`**:
  - Title: `"Về Núi Dinh — Lịch sử, văn hóa & hệ sinh thái | Núi Dinh Guide"`
  - Description: `"Khám phá nguồn gốc lịch sử căn cứ kháng chiến, hệ sinh thái rừng phòng hộ và hệ thống hơn 100 ngôi chùa cổ kính tại Núi Dinh."`
  - Schema: `TouristAttraction`.
- **Fallback**: Sử dụng ảnh hero trang chủ làm ảnh đại diện chia sẻ (OG Image).

---

## Proposed Changes

### 1. Route Cấu hình & Navigation

#### [MODIFY] [Header.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/components/Header.astro)
- Đảm bảo trạng thái hoạt động (active link) hoạt động chính xác cho `/di-chuyen` và `/ve-nui-dinh` (chữ màu Gold và gạch chân).

### 2. Trang Hướng dẫn di chuyển (`/di-chuyen`)

#### [NEW] [di-chuyen.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/pages/di-chuyen.astro)
- Lập trình trang di chuyển sử dụng Sub-hero phẳng (Kem Ấm) + Tab component (Vanilla JS) + 4 Card E (Service Card) cho các bãi đỗ xe:
  - **Quán Cô Kiều** (Tọa độ: `10.5143, 107.1352`)
  - **Quán Cô Hường** (Tọa độ: `10.5218, 107.1294`)
  - **Bãi xe Suối Đá** (Tọa độ: `10.5098, 107.1415`)
  - **Bãi xe Suối Tiên** (Tọa độ: `10.5175, 107.1320`)
- Gộp code JS Tab navigation và JS copy clipboard (kèm fallback iOS Safari + feedback "✓ Đã copy") trực tiếp trong script tag của Astro.

### 3. Trang Về Núi Dinh (`/ve-nui-dinh`)

#### [NEW] [ve-nui-dinh.astro](file:///Users/mac/Projects/Dinh-Mountant-help/src/pages/ve-nui-dinh.astro)
- Lập trình trang Về Núi Dinh sử dụng Sub-hero hình ảnh + Layout 8/4 split:
  - Cột trái: Lịch sử, Hệ sinh thái, Gallery 6 ảnh (tích hợp Lightbox), Tâm linh.
  - Cột phải (Desktop sticky / Mobile ẩn): Card C (Góc người địa phương - quote của Bang) + Card D rút gọn (Cảnh báo).
  - Bản mobile: Ẩn cột phải, hiện Gold Strip (quote) sau Lịch sử, hiện Cognac Strip (cảnh báo) sau Tâm linh.

---

## Verification Plan

### Automated Tests & Quality Checks
- Chạy `npm run build` kiểm tra lỗi compile.
- Audit Lighthouse đảm bảo hiệu năng và SEO > 95.

### Manual Verification
- Test chức năng Tab và sao chép tọa độ GPS.
- **Quan trọng**: Test hành vi sao chép GPS trên trình duyệt iOS Safari (sử dụng công cụ hoặc giả lập của devtools) để verify fallback clipboard hoạt động đúng.
- Chụp ảnh màn hình các trang giao diện làm bằng chứng thực tế cho anh Bang duyệt.
