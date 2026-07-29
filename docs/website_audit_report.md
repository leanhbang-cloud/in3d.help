# Báo cáo Audit toàn diện — Website 3dprinting.ledainhan.com
(Thương hiệu: BlueMoon's Studio — Kệ modular pegboard in 3D)

---

## 1. UI/UX & DESIGN AESTHETICS

### 1.1 Những điểm đã làm tốt
- Trang đã có một hệ thống phân cấp thị giác (visual hierarchy) khá rõ ràng ở khu vực Hero: label nhỏ phía trên tạo context, tiêu đề h1 cỡ lớn với thẻ `<em>` nhấn mạnh từ khóa “gọn gàng”, đoạn lead mô tả ngắn gọn giá trị cốt lõi, theo sau là hai nút CTA song song và ba chỉ số stats tạo social proof tức thì. Cấu trúc này tuân theo pattern F-pattern reading phổ biến và phù hợp với đối tượng mục tiêu trẻ, thích aesthetic.
- Việc sử dụng hai font Nunito (cho body text) và Quicksand (cho heading) đều thuộc dòng rounded sans-serif, tạo cảm giác thống nhất “cute, mềm mại” đúng với brand voice của BlueMoon’s Studio. Hệ thống grid hai cột hero-copy và hero-art cũng là layout chuẩn cho landing page thương mại.
- Thiết kế “editorial” với hai side-rail chứa thông tin thương hiệu hai bên là một chi tiết thẩm mỹ tinh tế, gợi cảm giác magazine/lookbook phù hợp với sản phẩm decor lifestyle. Bốn corner markers cùng hai annotation trên ảnh hero cũng tăng cường tính “thiết kế có chủ đích” (intentional design).

### 1.2 Vấn đề cần cải thiện
- **Thiếu micro-interactions và feedback trực quan**: Hiện tại, mã nguồn chỉ có data-reveal attribute (có thể dùng cho scroll animation) nhưng không thấy CSS transitions hay hover states nào được định nghĩa trong mã nguồn đã cung cấp. Các nút CTA cần có hover/focus/active states rõ ràng với transition mượt mà (ví dụ: `transition: transform 0.2s ease, box-shadow 0.2s ease`). Khi người dùng hover lên nút “Chat Zalo ngay”, nút nên có hiệu ứng nhẹ như scale lên 1.02-1.05 kèm shadow lan tỏa để tăng cảm giác tương tác.
- **Hero section thiếu cơ chế responsive rõ ràng trong markup**: Mặc dù có `<picture>` element với source riêng cho mobile (max-width: 768px), bản thân hero-grid không thể hiện rõ strategy responsive trong mã nguồn. Với CSS thuần, cần đảm bảo grid chuyển từ 2 cột thành 1 cột ở breakpoint 768px, hero-art được đẩy lên trên hero-copy trên mobile (vì ảnh sản phẩm trực quan tạo ấn tượng đầu tiên tốt hơn text trên màn hình nhỏ), và hero-stats chuyển từ dạng row thành stack hoặc grid 3 cột nhỏ gọn.
- **Phân cấp thị giác giữa hai CTA chưa tối ưu**: Hai nút `btn-zalo` và `btn-ai` hiện đặt ngang hàng, nhưng chúng phục vụ hai mục đích khác nhau: “Xem mẫu kệ cute” là hành động khám phá (scroll đến section combo), còn “Chat Zalo ngay” là hành động chuyển đổi trực tiếp. CTA chuyển đổi nên được ưu tiên thị giác hơn bằng cách dùng variant filled/solid cho nút Zalo và variant outlined/ghost cho nút xem mẫu, hoặc ngược lại tùy chiến lược (nếu muốn người dùng xem sản phẩm trước rồi mới chat). Hiện tại không rõ nút nào là primary, nút nào là secondary.
- **Side-rail editorial trên mobile**: Hai `div.side-rail` chứa text dọc hai bên rất đẹp trên desktop nhưng cần phải `display: none` hoàn toàn trên mobile/tablet vì chúng chiếm không gian quý giá và không mang lại giá trị chuyển đổi. Cần kiểm tra xem CSS có xử lý trường hợp này chưa.
- **Thiếu visual trust signals ở Hero**: Ba stats (50+ phụ kiện, 3 combo, 24h giao hàng) là thông tin tốt nhưng chưa phải trust signal thực sự. Nên bổ sung một dòng nhỏ ngay dưới stats hoặc ngay dưới CTA buttons, ví dụ: “Đã phục vụ 200+ khách hàng tại TP.HCM” hoặc một micro-testimonial dạng “Cute quá, mua thêm bộ nữa luôn! — @username” kèm avatar nhỏ.

### 1.3 Đề xuất cụ thể cho UI/UX
- Thêm một subtle animation cho hero image: không cần phức tạp, chỉ cần `@keyframes float` nhẹ nhàng với `translateY(-8px)` qua lại khoảng 3-4 giây tạo cảm giác sống động cho ảnh sản phẩm.
- Bổ sung skeleton loading hoặc placeholder blur cho ảnh hero (dù đã `loading="eager"`, vẫn cần fallback visual).
- Cân nhắc thêm một dải color accent chạy gradient nhẹ phía sau hero section để tạo chiều sâu, tách biệt rõ ràng Hero khỏi SocialProofBar bên dưới.
- Xem xét thêm một “scroll indicator” nhỏ ở cuối hero (ví dụ: mũi tên bounce nhẹ kèm text “Khám phá thêm”) để khuyến khích scroll trên mobile, nơi người dùng có thể không nhận ra còn nội dung bên dưới.

---

## 2. PERFORMANCE

### 2.1 Phân tích hiện trạng
- **Google Fonts là điểm nghẽn lớn nhất**: Hiện tại, website load hai font families (Nunito với 4 weights: 400, 600, 700, 800 và Quicksand với 4 weights: 400, 500, 600, 700) qua Google Fonts CDN. Điều này tạo ra chuỗi request waterfall: DNS lookup đến fonts.googleapis.com, tiếp đến request CSS file, rồi DNS lookup đến fonts.gstatic.com, cuối cùng download từng file font WOFF2. Dù đã có preconnect cho cả hai domain, đây vẫn là render-blocking resource vì thẻ `<link>` CSS mặc định là render-blocking. Với 8 font files (ước tính khoảng 15-25KB mỗi file), tổng cộng có thể lên đến 120-200KB font data, ảnh hưởng trực tiếp đến First Contentful Paint (FCP) và Largest Contentful Paint (LCP).
  - *Giải pháp font tối ưu*: Self-host cả hai font bằng cách download file WOFF2 từ Google Fonts, đặt vào thư mục `public/fonts/`, và khai báo `@font-face` trực tiếp trong CSS với `font-display: swap`. Điều này loại bỏ hoàn toàn hai external DNS lookups và cho phép font files được served từ cùng origin, tận dụng HTTP/2 multiplexing. Cụ thể hơn, cân nhắc chỉ load các weight thực sự sử dụng: nếu Nunito 800 chỉ dùng ở heading, có thể subset chỉ giữ lại ký tự tiếng Việt (Unicode range U+0102-024F, U+1EA0-1EF9) bằng công cụ glyphhanger hoặc subfont, giảm kích thước mỗi file xuống còn 8-12KB.
- **Ảnh hero cần kiểm tra kỹ hơn**: Element `<picture>` đã dùng WebP và tách bản mobile riêng, đây là điểm tốt. Tuy nhiên, cần xác nhận: ảnh desktop `hero-desk-setup.webp` với width="800" thực sự chỉ nên có intrinsic width khoảng 800-1000px (không cần 2000px+ cho một container giới hạn); ảnh mobile `hero-desk-setup-mobile.webp` nên có intrinsic width khoảng 400-500px; cả hai file nên được nén ở quality 75-80% (WebP vẫn rất sắc nét ở mức này); nên thêm AVIF source bổ sung vì AVIF tiết kiệm thêm 20-30% so với WebP trên trình duyệt hỗ trợ. Bổ sung thêm source AVIF vào `<picture>` element theo thứ tự AVIF trước, rồi WebP, cuối cùng là fallback JPG/PNG.
- **Script loading strategy**: Dòng `<script src="/src/scripts/main.js"></script>` ở cuối body là chấp nhận được, nhưng nên thêm `defer` attribute để tránh parser blocking trong trường hợp browser chưa kịp parse hết HTML. Với Astro, tốt hơn nên import script qua `<script>` tag inline trong component hoặc dùng `client:load` directive để Astro tự bundle và optimize. Đồng thời, nếu `main.js` chứa scroll animations (reveal effects), cân nhắc dùng `client:visible` hoặc IntersectionObserver native để delay execution cho đến khi cần.
- **Cloudflare beacon script**: Đã dùng `defer`, đúng best practice. Tuy nhiên, cân nhắc load script này bằng strategy `afterInteractive` hoặc thêm timeout 3 giây sau page load để không ảnh hưởng đến Total Blocking Time (TBT) trong quá trình tải trang ban đầu.
- **CSS optimization**: Landing page dùng CSS thuần (qua global.css import) là lựa chọn tốt cho performance, tránh overhead của CSS-in-JS. Tuy nhiên, cần kiểm tra: file `global.css` có được minify trong production build không (Astro mặc định xử lý việc này), có unused CSS không (dùng PurgeCSS hoặc Astro’s built-in treeshaking), và có sử dụng `will-change` hoặc `contain` property cho các animated elements để tối ưu rendering performance không.

### 2.2 Ước lượng Core Web Vitals hiện tại và mục tiêu
- **LCP (Largest Contentful Paint)**: Ảnh hero là LCP candidate chính; với `loading="eager"` và `fetchpriority="high"` đã được set đúng, nhưng font blocking và external requests có thể đẩy LCP lên 2.5-3.5 giây. Mục tiêu sau tối ưu nên dưới 2.0 giây.
- **CLS (Cumulative Layout Shift)**: Cần đảm bảo ảnh hero có width và height explicit (đã có: 800×600), font `display: swap` không gây layout shift lớn (kiểm tra bằng cách so sánh fallback font metrics với Nunito/Quicksand bằng công cụ như fontaine để tạo size-adjust, ascent-override, descent-override).
- **INP (Interaction to Next Paint)**: Thay thế FID từ 2024, cần đảm bảo click vào CTA buttons phản hồi dưới 200ms, không có long tasks blocking main thread lúc page load.

### 2.3 Đề xuất cụ thể cho Performance
- Thêm `<link rel="preload">` cho ảnh hero desktop ngay trong `<head>`: `<link rel="preload" as="image" type="image/webp" href="/images/hero-desk-setup.webp" media="(min-width: 769px)" />` kèm một preload tương tự cho bản mobile. Điều này báo cho browser biết ảnh LCP quan trọng ngay lập tức, trước cả khi parser gặp `<picture>` element trong body.
- Triển khai critical CSS inline: extract CSS cần thiết cho above-the-fold content (Hero section) và inline trực tiếp vào `<style>` tag trong `<head>`, defer phần CSS còn lại. Astro có thể hỗ trợ việc này thông qua plugin hoặc manual extraction.
- Thiết lập cache headers phù hợp trên Cloudflare: static assets như images và fonts nên có `Cache-Control: public, max-age=31536000, immutable`; HTML nên có `max-age=0, s-maxage=3600` để CDN cache nhưng browser luôn revalidate.

---

## 3. SEO & SEMANTIC HTML

### 3.1 Điểm mạnh hiện tại
- `SEOHead` component đã cover khá đầy đủ các meta tags cơ bản: title, description, canonical URL, Open Graph (bao gồm cả locale vi_VN, image dimensions), Twitter Card, và slot cho JSON-LD structured data. Việc set robots: index, follow cùng canonical URL giúp tránh duplicate content issues. OG image có explicit dimensions (1200×630) phù hợp chuẩn chia sẻ mạng xã hội.

### 3.2 Vấn đề cần cải thiện
- **JSON-LD Structured Data chưa được triển khai thực tế**: Mặc dù `SEOHead` component có slot cho `jsonLd` prop, không thấy bằng chứng nào cho thấy dữ liệu JSON-LD đang được truyền vào từ `index.astro`. Đây là thiếu sót lớn, đặc biệt cho một trang thương mại. Cần triển khai ít nhất ba schema: Organization cho BlueMoon’s Studio (bao gồm name, logo, url, sameAs links đến Zalo/Facebook/Instagram), Product cho mỗi combo sản phẩm (bao gồm name, description, image, offers với price “299000”, priceCurrency “VND”, availability “InStock”), và FAQPage cho section FAQ (giúp hiển thị rich snippets trên Google Search). Ngoài ra, nên thêm LocalBusiness schema nếu có địa chỉ vật lý, hoặc WebSite schema với potentialAction: SearchAction nếu có chức năng tìm kiếm.
- **Thiếu meta tags bổ sung quan trọng**: Không thấy `<meta name="theme-color">` — cần thêm để tùy chỉnh thanh địa chỉ trên mobile browser, ví dụ `<meta name="theme-color" content="#FFB6C1">` (hoặc màu brand chính). Không thấy `<link rel="manifest">` cho Progressive Web App cơ bản. Không thấy `<meta name="author">` hoặc `<link rel="me">` cho author attribution.
- **Semantic HTML cần cải thiện ở Hero section**: Thẻ `<section class="hero" id="hero">` thiếu `aria-labelledby` trỏ đến h1. Nên thêm `aria-labelledby="hero-heading"` và gán `id="hero-heading"` cho thẻ h1. Thẻ `<span class="label">` chứa “Kệ modular in 3D đáng yêu 🌸” nên được semantic hóa, ví dụ dùng `<p class="label">` hoặc ít nhất `role="text"` để screen reader đọc chính xác. Emoji 🌸 và ✿ trong heading nên có `aria-hidden="true"` hoặc được wrap trong `<span aria-hidden="true">` vì screen reader sẽ đọc “cherry blossom” hoặc tên Unicode character, gây rối context.
- **Cấu trúc heading hierarchy**: Với mã nguồn đã cung cấp, h1 nằm trong Hero section. Cần đảm bảo toàn bộ landing page chỉ có DUY NHẤT MỘT h1, và các section tiếp theo (PainPoints, ProductShowcase, HowItWorks, v.v.) sử dụng h2, sub-sections dùng h3. Đây là nguyên tắc cơ bản nhưng rất thường bị vi phạm trong landing page.
- **Thiếu hreflang tag**: Nếu website chỉ phục vụ tiếng Việt, nên thêm `<link rel="alternate" hreflang="vi" href="https://3dprinting.ledainhan.com/" />` cùng `<link rel="alternate" hreflang="x-default" href="https://3dprinting.ledainhan.com/" />`.
- **Sitemap và robots.txt**: Không thấy mention nào về hai file này. Astro có integration `@astrojs/sitemap` cần được cài đặt và cấu hình. File `robots.txt` cần được tạo trong `public/` với nội dung cho phép crawl toàn bộ và trỏ đến sitemap URL.

### 3.3 Đề xuất cụ thể cho SEO
- Về title tag, title hiện tại chưa được show trong mã cung cấp (nó được truyền từ `index.astro`). Title tối ưu nên theo format: “Kệ Để Bàn Modular In 3D Dễ Thương | Từ 299K | BlueMoon’s Studio” — chứa keyword chính, USP giá, và brand name, nằm trong khoảng 50-60 ký tự.
- Về meta description, description mặc định hiện tại khá tốt nhưng thiếu CTA: nên thêm “Đặt hàng ngay qua Zalo!” ở cuối, và đảm bảo nằm trong 150-160 ký tự.
- Cần tạo file `public/robots.txt` với nội dung:
  ```text
  User-agent: *
  Allow: /
  Sitemap: https://3dprinting.ledainhan.com/sitemap-index.xml
  ```
  và cài `@astrojs/sitemap` trong `astro.config.mjs`.
- Đối với Product schema JSON-LD, dưới đây là mẫu cần triển khai cho mỗi combo:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Combo Starter — Kệ Pegboard Modular In 3D",
    "description": "Bộ kệ pegboard modular in 3D nhỏ gọn, phù hợp góc bàn học sinh viên.",
    "image": "https://3dprinting.ledainhan.com/images/combo-starter.webp",
    "brand": {
      "@type": "Brand",
      "name": "BlueMoon's Studio"
    },
    "offers": {
      "@type": "Offer",
      "price": "299000",
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "BlueMoon's Studio"
      }
    }
  }
  ```

---

## 4. ACCESSIBILITY (A11y)

### 4.1 Vấn đề nghiêm trọng (Critical)
- **Thiếu Skip Navigation Link**: Đây là vi phạm WCAG 2.1 Level A, criterion 2.4.1. Layout có `<main id="main">` nhưng không có `<a href="#main" class="skip-link">Chuyển đến nội dung chính</a>` ở đầu `<body>`. Người dùng keyboard hoặc screen reader phải tab qua toàn bộ header, side-rails trước khi đến nội dung chính.
  - *Giải pháp*: thêm skip link ngay sau thẻ `<body>`, visually hidden bằng CSS nhưng hiện ra khi focus (`position: absolute; top: -100%; &:focus { top: 0; }`).
- **SVG icons trong CTA buttons thiếu accessible name**: Hai nút CTA chứa inline SVG trước text. Mặc dù text label đã có (“Xem mẫu kệ cute”, “Chat Zalo ngay”), SVG icons nên có `aria-hidden="true"` để screen reader không cố diễn giải chúng. Nếu không có `aria-hidden`, screen reader có thể đọc “graphic” hoặc bỏ qua, tạo trải nghiệm không nhất quán.
- **Emoji trong heading không có aria treatment**: Như đã đề cập ở phần SEO, emoji ✿ trong h1 và 🌸 trong label sẽ bị screen reader đọc thành tên Unicode. Nên wrap chúng: `<span aria-hidden="true">✿</span>`.
- **Hero image alt text**: Alt text hiện tại “Kệ pegboard modular in 3D dễ thương trên bàn học gọn gàng” là tốt, mô tả đúng nội dung ảnh. Tuy nhiên, nếu ảnh cũng chứa text overlay hoặc product details quan trọng, alt text cần phản ánh điều đó.

### 4.2 Vấn đề quan trọng (Major)
- **Không thể đánh giá color contrast từ mã nguồn**: Vì `global.css` không được cung cấp, không thể verify: contrast ratio giữa text trên hero background (cần ≥ 4.5:1 cho normal text, ≥ 3:1 cho large text theo WCAG AA), contrast của `.label` text (thường nhỏ và nhạt, dễ fail), contrast của `.stat-label` text, và contrast của CTA button text trên button background. Cần kiểm tra tất cả bằng công cụ như axe DevTools, Lighthouse, hoặc WebAIM Contrast Checker. Đặc biệt lưu ý: với theme “cute, pastel” của thương hiệu, rất dễ rơi vào bẫy dùng màu pastel nhạt cho text trên nền trắng/sáng — đây là lỗi contrast phổ biến nhất của các website aesthetic-focused.
- **Thiếu focus styles rõ ràng**: Với CSS thuần, cần đảm bảo mọi interactive element (links, buttons) có `:focus-visible` style rõ ràng, không bị `outline: none` reset. Focus ring nên có contrast ≥ 3:1 với background xung quanh, và nên dùng `outline-offset: 2px` để tách ring khỏi element boundary.
- **Side-rail text có thể gây confusion cho screen reader**: Hai `div.side-rail` chứa decorative text (“BlueMooon’s Studio — Kệ để bàn modular in 3D” và “MMXXVI — Ho Chi Minh City”). Đây là nội dung editorial/decorative, không mang ý nghĩa navigation hay content. Nên thêm `aria-hidden="true"` cho cả hai side-rail để screen reader bỏ qua. Ngoài ra, lưu ý có lỗi chính tả: “BlueMooon’s” (3 chữ ‘o’) trong side-rail nhưng “BlueMoon’s” ở nơi khác — cần thống nhất (hoặc nếu “BlueMooon” là intentional branding, cần nhất quán toàn site).
- **Landmark roles**: `<main>` tag đã có, nhưng `<section>` tags nên có `aria-labelledby` trỏ đến heading tương ứng, hoặc ít nhất `aria-label` mô tả. Header component cần dùng `<header>` semantic tag, Footer dùng `<footer>`, navigation dùng `<nav>`.

### 4.3 Đề xuất cụ thể cho A11y
- Triển khai skip link là ưu tiên số một.
- Thêm `aria-hidden="true"` cho tất cả decorative elements: SVG icons trong buttons, emoji, corner markers, annotations, side-rails.
- Kiểm tra và bổ sung `role="img"` cho `<picture>` element nếu cần.
- Thêm `<meta name="color-scheme" content="light">` để báo cho browser biết trang chỉ hỗ trợ light mode (tránh flash khi browser có dark mode preference).
- Nếu có animations/transitions, thêm `@media (prefers-reduced-motion: reduce)` query để tắt hoặc giảm animation cho người dùng nhạy cảm với chuyển động.
- Kiểm tra toàn bộ trang bằng keyboard-only navigation (Tab, Shift+Tab, Enter, Space, Escape) và screen reader (NVDA trên Windows, VoiceOver trên Mac) ít nhất một lần.

---

## 5. CRO — CONVERSION RATE OPTIMIZATION

### 5.1 Phân tích funnel hiện tại
- Landing page có conversion funnel tương đối đơn giản: người dùng vào trang → đọc Hero (nhận biết sản phẩm, giá trị cốt lõi) → scroll qua SocialProofBar (tăng trust) → PainPoints (đồng cảm vấn đề) → ProductShowcase (xem combo, giá) → qua các sections bổ sung → click CTA Zalo để chat đặt hàng. FloatingCTA Zalo luôn hiện giúp conversion point không bao giờ xa tầm tay. Đây là funnel phù hợp cho sản phẩm niche, giá thấp (từ 299K), target audience trẻ (Gen Z/Y Việt Nam) quen giao tiếp qua Zalo.

### 5.2 Vấn đề ảnh hưởng conversion
- **CTA naming chưa tối ưu**: Nút “Xem mẫu kệ cute” dùng ngôn ngữ mơ hồ — “cute” là adjective chủ quan, không truyền tải giá trị hành động rõ ràng. Nên đổi thành “Xem 3 combo kệ” hoặc “Chọn combo phù hợp” — cụ thể hơn, cho người dùng biết chính xác họ sẽ thấy gì khi click. Nút “Chat Zalo ngay” đã tốt hơn, nhưng có thể cải thiện thành “Tư vấn miễn phí qua Zalo” để giảm rào cản tâm lý (người dùng biết chat là miễn phí và được tư vấn, không phải bị ép mua).
- **Hero stats thiếu social proof mạnh**: “50+ Phụ kiện Modular” và “3 Gói combo Sẵn hàng” là product features, không phải social proof. “24h Giao hàng Nội thành” là service feature. Để tăng trust signal ở Hero, cân nhắc thay thế hoặc bổ sung stat liên quan đến khách hàng: “200+ khách hàng đã đặt” (nếu có dữ liệu), “4.9★ đánh giá từ khách” (nếu có), hoặc “500+ sản phẩm đã giao”. Con số liên quan đến khách hàng thực tạo trust mạnh hơn nhiều so với product specs.
- **Thiếu urgency/scarcity cues**: Với sản phẩm in 3D (thời gian sản xuất có hạn), có thể tận dụng scarcity tự nhiên: “Mỗi combo được in riêng theo đơn — Thời gian chờ 3-5 ngày” hoặc “Chỉ nhận 10 đơn/tuần để đảm bảo chất lượng”. Đây không phải manipulative scarcity mà là thực tế của sản xuất in 3D, và nó tạo perceived value + urgency hợp lý.
- **Section ProductShowcase cần CTA mạnh hơn**: Hiện tại, theo mô tả, mỗi combo dẫn link Zalo chat để đặt hàng. Nên đảm bảo mỗi product card có CTA button rõ ràng với text khác nhau phù hợp context: combo Starter có thể là “Đặt combo 299K”, combo Standard là “Đặt combo phổ biến nhất” (kèm badge “Bán chạy”), combo Pro Desk là “Đặt combo đầy đủ”. Nhấn mạnh combo giữa (Standard) là “most popular” để tận dụng decoy effect.
- **Thiếu price anchoring**: Giá “từ 299K” trong hero lead text là tốt, nhưng ở ProductShowcase, nên hiển thị giá gạch ngang (so sánh với giá mua lẻ từng phụ kiện) để thể hiện giá trị combo. Ví dụ: “450K 299K — Tiết kiệm 34%” tạo cảm giác deal tốt.
- **FAQ section cần đặt đúng vị trí chiến lược**: FAQ nên nằm ngay trước hoặc ngay sau ProductShowcase vì đây là lúc người dùng có nhiều thắc mắc nhất trước khi quyết định mua. Đặt FAQ ở cuối trang (sau About) có nghĩa nhiều người sẽ không scroll đến nơi. Nếu giữ FAQ ở cuối, ít nhất nên có link “Xem câu hỏi thường gặp” ở ProductShowcase section.
- **FloatingCTA cần smart behavior**: Nút CTA Zalo trôi nổi nên: ẩn khi đang ở Hero section (vì Hero đã có CTA Zalo), hiện ra khi scroll qua Hero, có subtle pulse animation mỗi 30 giây để thu hút chú ý mà không gây phiền, và trên mobile nên thu nhỏ thành icon tròn (không chiếm quá nhiều screen real estate) kèm tooltip “Chat Zalo” khi hover/tap.

### 5.3 Đề xuất nâng cao cho CRO
- **Thêm Social Proof cụ thể**: Nếu có ảnh sản phẩm từ khách hàng thực (user-generated content), tạo một dải “Wall of Love” nhỏ với screenshots Zalo reviews hoặc ảnh góc bàn khách hàng. Đây là loại social proof mạnh nhất cho sản phẩm lifestyle/decor.
- **Thêm badges trust ở Footer hoặc gần CTA**: “Đổi trả 7 ngày”, “Bảo hành 30 ngày”, “Thanh toán COD”, “Ship toàn quốc” — mỗi badge kèm icon nhỏ.
- **Tối ưu cho Zalo conversion**: Vì toàn bộ conversion đi qua Zalo, cần đảm bảo: link Zalo dùng deep link format đúng (https://zalo.me/...) để mở app trực tiếp trên mobile, có message template pre-filled nếu Zalo API cho phép (ví dụ: “Mình muốn đặt Combo Starter 299K ạ!”), và tracking UTM parameters hoặc Zalo OA analytics để đo lường nguồn traffic.
- **A/B testing opportunities**: Với Astro + Cloudflare, có thể triển khai edge-side A/B testing đơn giản: test CTA text variations (“Chat Zalo ngay” vs “Tư vấn miễn phí” vs “Đặt hàng qua Zalo”), test hero image (lifestyle setup vs close-up sản phẩm), và test price display format (giá gạch ngang vs badge “Tiết kiệm X%”). Sử dụng Cloudflare Workers hoặc đơn giản là JavaScript-based split bằng cookie random.

---

## CHECKLIST TRIỂN KHAI THEO THỨ TỰ ƯU TIÊN

### Giai đoạn 1 — Quick Wins (1-3 ngày, ảnh hưởng lớn, effort thấp)
- [ ] Thêm `aria-hidden="true"` cho tất cả SVG icons, emoji decorative, side-rails, và corner markers.
- [ ] Thêm skip navigation link `<a href="#main" class="skip-link">Chuyển đến nội dung chính</a>` ngay sau thẻ `<body>`.
- [ ] Thêm `defer` vào thẻ `<script src="/src/scripts/main.js">`.
- [ ] Thêm `<link rel="preload">` cho hero image vào `<head>`.
- [ ] Thêm `<meta name="theme-color" content="[brand-color]">` vào `SEOHead`.
- [ ] Sửa typo “BlueMooon’s” thành “BlueMoon’s” (hoặc ngược lại) để nhất quán.
- [ ] Thêm `aria-labelledby` cho `<section class="hero">` trỏ đến h1.

### Giai đoạn 2 — Performance & SEO (3-7 ngày)
- [ ] Self-host Google Fonts (download WOFF2, khai báo `@font-face` với `font-display: swap`).
- [ ] Subset font cho Vietnamese Unicode range.
- [ ] Tạo file `public/robots.txt`.
- [ ] Cài đặt `@astrojs/sitemap` và cấu hình.
- [ ] Triển khai JSON-LD structured data cho Organization, Product (3 combos), FAQPage.
- [ ] Thêm AVIF source vào `<picture>` element.
- [ ] Inline critical CSS cho above-the-fold content (Hero section).
- [ ] Thêm hreflang tags cho tiếng Việt.
- [ ] Kiểm tra và tối ưu kích thước ảnh hero (đúng intrinsic dimensions).

### Giai đoạn 3 — CRO & UX Enhancement (1-2 tuần)
- [ ] Redesign CTA hierarchy (primary vs secondary button styles).
- [ ] Đổi CTA text thành action-oriented cụ thể hơn.
- [ ] Thêm trust badges (“Đổi trả 7 ngày”, “Ship COD toàn quốc”, v.v.).
- [ ] Thêm price anchoring (giá gạch ngang) ở `ProductShowcase`.
- [ ] Thêm “Bán chạy” badge cho combo Standard.
- [ ] Triển khai smart `FloatingCTA` behavior (ẩn ở Hero, hiện khi scroll).
- [ ] Thêm scroll indicator ở cuối Hero.
- [ ] Bổ sung micro-testimonial hoặc customer count ở Hero stats.

### Giai đoạn 4 — A11y Deep Dive & Polish (1-2 tuần)
- [ ] Audit toàn bộ color contrast với axe DevTools.
- [ ] Thiết lập focus-visible styles cho mọi interactive element.
- [ ] Thêm `@media (prefers-reduced-motion: reduce)` cho tất cả animations.
- [ ] Kiểm tra keyboard navigation toàn trang.
- [ ] Test với screen reader (VoiceOver + NVDA).
- [ ] Đảm bảo heading hierarchy đúng (chỉ 1 h1, các section dùng h2).
- [ ] Thêm role, aria-label phù hợp cho tất cả landmarks.

### Giai đoạn 5 — Advanced Optimization (2-4 tuần)
- [ ] Triển khai font fallback metrics (`size-adjust`, `ascent-override`) để giảm CLS từ font swap.
- [ ] Thiết lập Cloudflare cache rules tối ưu.
- [ ] Cân nhắc service worker cho offline basic experience.
- [ ] Triển khai A/B testing framework đơn giản.
- [ ] Thêm conversion tracking (Zalo OA analytics hoặc custom events).
- [ ] Tạo “Wall of Love” section với UGC (User Generated Content).
- [ ] Tối ưu Zalo deep links với pre-filled messages.

---

> *Báo cáo này dựa trên mã nguồn được cung cấp (Layout.astro, SEOHead.astro, Hero.astro) và mô tả cấu trúc trang. Để audit sâu hơn, sẽ cần xem thêm file global.css (để đánh giá contrast, responsive breakpoints, animation performance), file main.js (để đánh giá runtime performance và interaction handling), các component còn lại đặc biệt là ProductShowcase, FloatingCTA, FAQ, và kết quả Lighthouse/PageSpeed Insights thực tế từ URL production.*
