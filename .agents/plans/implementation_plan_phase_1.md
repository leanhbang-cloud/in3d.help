# Kế hoạch thực hiện — Phase 1: Xây dựng nền tảng giao diện & Trang chủ

Kế hoạch này phác thảo cách hiện thực hóa Phase 1 của dự án **dinh-mountain-help** dựa trên tài liệu [DESIGN_SYSTEM.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/DESIGN_SYSTEM.md) và thông tin trong [dinhmountain.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/dinhmountain.md). Mục tiêu là thiết lập hệ thống CSS variables (biến CSS), xây dựng các component giao diện cốt lõi (Header, Footer, Buttons, Cards, Hero) và lắp ghép thành một trang chủ đẹp mắt, tải nhanh và tối ưu hóa cho di động.

---

## User Review Required

> [!IMPORTANT]
> Cần anh Bang duyệt qua các quyết định thiết kế kỹ thuật trước khi bắt đầu viết code:
> 1. **Font loading**: Chúng ta sẽ tích hợp Google Fonts (Roboto Slab, Roboto, Roboto Mono) bằng một request duy nhất trong phần `<head>` của trang chủ để giảm thiểu số lượng kết nối mạng và tối ưu hóa LCP (tốc độ hiển thị phần tử lớn nhất).
> 2. **Mobile Nav Drawer**: Thiết kế navigation slide từ bên phải sử dụng CSS thuần (không dùng JavaScript nặng) bằng cách tận dụng `:checked` state hoặc một script JS cực nhẹ (dưới 10 dòng) để đóng mở mượt mà và hỗ trợ khả năng truy cập (accessibility).
> 3. **Thư mục lưu trữ**: Kế hoạch sẽ lưu trữ các component trong `src/components/` và CSS trong `src/styles/global.css`.

---

## Proposed Changes

Chúng ta sẽ thực hiện các bước thay đổi mã nguồn tuần tự để đảm bảo tính dễ đọc và khả năng kiểm thử.

### 1. Nền tảng CSS & Tokens

#### [NEW] [global.css](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/styles/global.css)
- Thiết lập toàn bộ hệ thống CSS Variables từ `DESIGN_SYSTEM.md` bao gồm:
  - **Colors**: `--color-cognac`, `--color-gold`, `--color-forest`, `--color-cream`, `--color-bronze`, `--color-text`, `--color-text-light`, `--color-bg`, `--color-disabled`.
  - **Typography**: Roboto Slab, Roboto, Roboto Mono kèm theo size và weight cho từng phân cấp (display, h1, h2, h3, h4, body-lg, body, body-sm, data, badge).
  - **Spacing**: `--space-micro` (4px) đến `--space-3xl` (96px).
  - **Animations**: `--duration-fast` (150ms) đến `--duration-reveal` (400ms) và easing tokens.
- Thiết lập CSS Reset tối giản, box-sizing, typography mặc định và cấu trúc responsive grid.
- Triển khai `@media (prefers-reduced-motion: reduce)` để tự động tắt hiệu ứng chuyển động nếu người dùng có cấu hình tiết kiệm chuyển động.

### 2. Các Component Cơ Bản (Base Components)

#### [NEW] [Button.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/Button.astro)
- Component nút đa năng hỗ trợ các biến thể (variants): `primary`, `secondary`, `ghost`, `icon`.
- Hỗ trợ các kích thước (sizes): `large` (Hero CTA), `medium` (Standard), `small` (Inline).
- Tích hợp hiệu ứng hover/active micro-animations (scale 0.98, shadow thay đổi) theo đúng CSS spec.

#### [NEW] [CardA.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/cards/CardA.astro) (Trail Card)
- Dùng hiển thị danh sách các cung đường trekking.
- Thiết kế: Ảnh đại diện full-bleed (tràn viền), badge độ khó góc trên phải, padding 16px cho nội dung bên dưới, tích hợp Forest data strip (km, giờ, độ cao) và nút bấm full-width.
- Hiệu ứng hover: `translateY(-4px)` kèm đổ bóng màu ấm Cognac nhè nhẹ (200ms ease-out).

#### [NEW] [CardB.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/cards/CardB.astro) (At a Glance Box)
- Sidebar widget hiển thị thông tin nhanh: Độ khó, Cự ly, Thời gian, Độ cao, Phù hợp, Điểm xuất phát.
- Thiết kế: Có viền vàng gold 4px bên trái (`4px solid var(--color-gold)`), đường kẻ ngăn cách gold divider, sử dụng font chữ `data` (Roboto Mono) cho các thông số kỹ thuật.

#### [NEW] [CardC.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/cards/CardC.astro) (Local Insight Card)
- Hiển thị những lời khuyên/kinh nghiệm thực tế từ anh Bang ("Góc người địa phương").
- Thiết kế: Viền vàng gold 4px bên trái, logo ngôi sao vàng óng ánh, hiển thị trích dẫn (quote) ấm áp bằng màu Cognac và font body nghiêng nhẹ nhàng.

#### [NEW] [CardD.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/cards/CardD.astro) (Safety Alert Card)
- Hộp cảnh báo lưu ý an toàn cực kỳ nổi bật.
- Thiết kế: Viền nâu Cognac 4px bên trái, icon cảnh báo ⚠️ kèm nội dung lưu ý sống còn, và nút ghost hướng dẫn đọc cẩm nang an toàn.

### 3. Giao diện Cấu trúc Trang (Structural Components)

#### [NEW] [Header.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/Header.astro)
- **Desktop**: Chiều cao 64px, nền nâu Cognac `#5C3D20`, chữ Cream `#F0E6D0`. Sticky cố định khi cuộn trang, đổ bóng nhẹ. Có Logo ⛰ Núi Dinh bên trái (Roboto Slab Bold 22px màu Gold) và nút CTA "Bắt đầu khám phá" bên phải.
- **Mobile**: Chiều cao 56px, nút Hamburger màu Cream mở slide drawer rộng 280px từ bên phải ra, che phủ bởi lớp backdrop màu tối `rgba(0,0,0,0.5)`.
- Chuyển động drawer mượt mà: `300ms cubic-bezier(0.4, 0, 0.2, 1)`.

#### [NEW] [Footer.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/Footer.astro)
- Thiết kế **Option A** đã duyệt: Nền xanh rừng già `#1E3A28`, chữ Cream `#F0E6D0`.
- **Desktop**: 3 cột cân đối (Col 1: Logo + Tagline; Col 2: Khám phá; Col 3: Thông tin) + Dải Cognac strip 40px hiển thị các số điện thoại khẩn cấp (hyperlink `tel:`) + Dòng bản quyền dưới cùng.
- **Mobile**: Thu gọn cột thành dạng accordion mở rộng bằng JS/CSS tối giản + dải khẩn cấp hiển thị thành 3 nút bấm pill vàng óng dễ chạm (`[🚨 115]`, `[👮 113]`, `[🔥 114]`).

#### [NEW] [Hero.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/components/Hero.astro)
- Chiều cao: 600px desktop / 500px mobile.
- Nền là ảnh rừng già Việt Nam buổi sáng sớm với sương mù mờ ảo, phủ lớp gradient tối để làm nổi bật chữ.
- Chứa thẻ pill chỉ vị trí "📍 Bà Rịa – Vũng Tàu · 80km từ Sài Gòn", tiêu đề lớn "Khám phá Núi Dinh" (Roboto Slab display) và các nút hành động.
- Indicator cuộn trang ở góc dưới bên phải (chỉ trên desktop).

### 4. Lắp ghép Trang chủ

#### [MODIFY] [index.astro](file:///Users/bangle-macmini/Projects/dinh-mountain-help/src/pages/index.astro)
- Tích hợp font Google Fonts Roboto Slab, Roboto và Roboto Mono.
- Nhúng Header và Footer.
- Xây dựng phần nội dung trang chủ gồm:
  - **Hero Section**: Nổi bật mở màn.
  - **Giới thiệu Tổng quan**: Cung cấp thông tin địa lý, thảm thực vật từ mục 1 của `dinhmountain.md`.
  - **Danh sách Cung đường (Trail Grid)**: Grid 3 cột (desktop) hiển thị đầy đủ 5 cung đường trekking (Cung 1 đến Cung 5) sử dụng `CardA` (bố trí dòng đầu 3 cung, dòng sau 2 cung căn giữa).
  - **Giao diện Split Layout (8/4)**: Main content 8 cột bên trái (chi tiết kinh nghiệm, bản đồ, chuẩn bị an toàn) + Aside 4 cột bên phải chứa `CardB` (At a Glance) và `CardC` (Local Insight).
  - **Mobile Responsive Logic**: Đảm bảo aside biến mất trên di động và collapse thành các badge strips nằm inline ngay trong phần Main content theo đúng quy tắc thiết kế:
    - Forest strip (km, giờ, độ cao)
    - Gold strip (mẹo từ anh Bang)
    - Cognac strip (thông tin gửi xe, ăn uống)

---

## Verification Plan

### Kiểm thử Tự động & Hiệu năng
- Sử dụng **Lighthouse** (chạy thông qua công cụ Chrome DevTools MCP hoặc terminal) để đánh giá:
  - Điểm số hiệu năng di động tối ưu (mục tiêu >95).
  - Điểm số SEO tối ưu (mục tiêu >95).
- Kiểm tra tính hợp lệ của mã HTML (semantic tag, không trùng lặp ID).

### Kiểm thử Thủ công (Visual Verification)
1. **Chạy server phát triển**: `npm run dev` để kiểm tra trực tiếp giao diện.
2. **Responsive Test**: Dùng DevTools giả lập kích thước iPhone/Android để xác nhận:
   - Hamburger menu hoạt động trơn tru, drawer trượt ra từ bên phải.
   - Layout 8/4 chuyển sang 1 cột.
   - Sidebar collapse thành các dải badge strip (Forest, Gold, Cognac) nằm ngang hiển thị trực quan.
3. **Animations Test**: Rà chuột qua các button và card để kiểm tra cảm giác chạm/hover mượt mà (dưới 400ms).
4. **Reduced Motion Test**: Kích hoạt cấu hình giảm chuyển động trên hệ điều hành và kiểm tra xem toàn bộ hiệu ứng chuyển dịch có dừng lại ngay lập tức không.

### Bằng chứng Kiểm thử
- Chúng tôi sẽ dùng `chrome-devtools` MCP chụp ảnh màn hình (screenshot) các trạng thái:
  - Ảnh Hero và Header trên Desktop & Mobile.
  - Trạng thái hover của Trail Card và Button.
  - Giao diện drawer menu mở trên Mobile.
  - Giao diện dải khẩn cấp và các dải thông tin inline trên Mobile.
