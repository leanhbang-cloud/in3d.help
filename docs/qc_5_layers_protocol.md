# Quy Trình Kiểm Thử 5 Lớp (5-Layer QC Protocol) — Dự án in3D.help

Quy trình này hướng dẫn chi tiết cách thực hiện Kiểm soát chất lượng (QC) 5 lớp cho Landing Page `in3D.help` (Astro SSG tĩnh, chạy trên Cloudflare Pages). Đây là bộ tiêu chuẩn bắt buộc thực hiện trong mỗi session làm việc trước khi thực hiện deploy hoặc bàn giao sản phẩm để đảm bảo website luôn đạt chất lượng tối đa về UI/UX, SEO, hiệu năng và khả năng truy cập (Accessibility).

---

## MÔI TRƯỜNG KIỂM THỬ & CHUẨN BỊ

1. **Build cục bộ**:  
   Trước khi test, luôn luôn chạy build để xuất các file tĩnh sạch ra thư mục `dist/`:
   ```bash
   ASTRO_TELEMETRY_DISABLED=1 npm run build
   ```
2. **Khởi chạy Preview Local**:  
   Chạy máy chủ preview local (tránh chạy dev mode khi chạy Lighthouse vì dev mode có chứa các script injection làm kéo thấp điểm performance):
   ```bash
   ASTRO_TELEMETRY_DISABLED=1 npm run preview
   ```
   *Lưu ý:* Mặc định máy chủ sẽ chạy tại `http://localhost:4321/`.

---

## CHI TIẾT 5 LỚP KIỂM THỬ (QC 5-LAYERS)

### LAYER 1: VISUAL DESIGN SYSTEM & UI CONSISTENCY
Mục tiêu: Bảo vệ tính nhất quán của ngôn ngữ thiết kế Atelier Zero Tech Dark. Đảm bảo giao diện responsive hoàn hảo trên mọi thiết bị và không lỗi font Tiếng Việt.

#### TC-L1-001: Xác thực Design Tokens (CSS Variables)
* **Các bước thực hiện**:
  1. Inspect phần tử HTML (`getComputedStyle(document.documentElement)`).
  2. Kiểm tra các giá trị biến màu sắc và font chữ trong `:root` tại `global.css`.
* **Tiêu chuẩn đạt (Expected)**:
  * Nền tối: `--void` (`#0D0D0D`), `--charcoal` (`#1A1A2E`).
  * Màu thương hiệu: `--cobalt` (`#0047AB`), `--cyan` (`#00F0FF`), `--crimson` (`#DC143C`).
  * Typography: `--heading` dùng font `Outfit`, `--body` dùng font `Inter`.

#### TC-L1-002: Kiểm tra nút tương tác & Hover/Active States
* **Các bước thực hiện**:
  1. Rà soát trạng thái hover trên các nút `.btn-zalo` (Zalo CTA) và `.btn-ai` (AI CTA).
* **Tiêu chuẩn đạt (Expected)**:
  * `.btn-zalo`: Nền gradient chéo từ cobalt sang cyan. Khi hover dịch chuyển `translateY(-2px)` kèm hiệu ứng đổ bóng tỏa sáng (cyan glow/cobalt glow).
  * `.btn-ai`: Nền trong suốt, viền cyan. Khi hover chuyển sang nền cyan mờ (`--cyan-dim`).
  * Mọi phần tử có thể click đều hiển thị con trỏ dạng `pointer`.

#### TC-L1-003: Kiểm thử Responsive & Khắc phục lỗi tràn viền ngang (Horizontal Overflow)
* **Các bước thực hiện**:
  1. Bật DevTools giả lập kích thước Mobile (375px width, ví dụ iPhone SE).
  2. Chạy đoạn script sau trên Console để phát hiện phần tử tràn ngang:
     ```javascript
     (() => {
       const docWidth = document.documentElement.clientWidth;
       const overflowing = Array.from(document.querySelectorAll('*')).filter(el => {
         const rect = el.getBoundingClientRect();
         // Bỏ qua các phần tử marquee chạy chữ ngang có overflow: hidden trên cha
         return rect.right > docWidth + 0.1 && !el.closest('.marquee-track') && !el.closest('.marquee-container');
       });
       console.log('Overflowing elements count:', overflowing.length, overflowing);
     })();
     ```
  3. Thử cuộn ngang trang web bằng script:
     ```javascript
     window.scrollTo(10, 0);
     console.log('Horizontal scroll position (should be 0):', window.scrollX);
     ```
* **Tiêu chuẩn đạt (Expected)**:
  * Không có phần tử nội dung nào bị tràn viền (overflowing count = 0, loại trừ marquee).
  * `window.scrollX` luôn bằng `0` (không thể cuộn ngang trang web).

#### TC-L1-004 & TC-L1-005: Kiểm tra khoảng cách & Lỗi phông chữ Tiếng Việt
* **Các bước thực hiện**:
  1. Kiểm tra padding lề trái/phải (`.container`) co giãn thông minh: Desktop (64px) -> Mobile (18px).
  2. Đọc lướt qua toàn bộ copy Tiếng Việt trên giao diện.
* **Tiêu chuẩn đạt (Expected)**:
  * Khoảng cách biên cân đối thị giác, không bị dính sát lề trên mobile.
  * Không có ký tự bị lỗi hiển thị (lỗi font/fallback font) trên các nguyên âm tiếng Việt có dấu (`ủ`, `ỡ`, `ễ`, `á`, `à`...).

---

### LAYER 2: CLIENT-SIDE INTERACTIVE LOGIC & MICRO-ANIMATIONS
Mục tiêu: Đảm bảo JavaScript tương tác thực thi mượt mà, không bị xung đột, đạt hiệu quả trải nghiệm cao.

#### TC-L2-001: Kiểm thử Headroom Navigation (Sticky Header)
* **Các bước thực hiện**:
  1. Cuộn trang xuống dưới > 120px. Header Nav phải tự động trượt lên ẩn đi (`.nav.is-hidden` được chèn).
  2. Cuộn trang lên trên nhẹ. Header Nav phải trượt xuống hiển thị lại (`.nav.is-hidden` bị loại bỏ).
  3. Cuộn nhẹ > 60px. Header Nav chuyển sang dạng nền kính mờ (`.nav.is-scrolled`).

#### TC-L2-002: Kiểm thử Scroll Reveal Animation
* **Các bước thực hiện**:
  1. F5 tải lại trang. Các phần tử mang thuộc tính `[data-reveal]` ở nửa dưới trang (như section About, FAQ) ban đầu phải ẩn (`opacity: 0`).
  2. Cuộn trang từ từ xuống dưới. Khi phần tử tiến sát viewport, class `.is-visible` phải được add và phần tử hiện ra mượt mà.
  3. Trình duyệt phải tự động gọi `unobserve()` sau khi phần tử hiển thị xong để tiết kiệm tài nguyên CPU.

#### TC-L2-003: Kiểm thử FAQ Accordion (Single-Active)
* **Các bước thực hiện**:
  1. Click vào câu hỏi FAQ số 1 -> Nội dung mở ra, class `.active` được thêm.
  2. Click tiếp vào câu hỏi FAQ số 2 -> Câu hỏi số 2 mở ra, đồng thời câu hỏi số 1 **bắt buộc tự động đóng lại**.

#### TC-L2-004: Kiểm thử Smooth Scrolling
* **Các bước thực hiện**:
  1. Click các liên kết trên Menu Navigation (ví dụ `#cach-hoat-dong`, `#faq`).
  2. Xác nhận trang cuộn mượt (smooth scroll) tới đúng section mục tiêu. Section tiêu đề không bị đè khuất bởi Header Nav nhờ khoảng đệm padding-top (130px) của section.

---

### LAYER 3: SEO, METADATA & SEMANTIC HTML
Mục tiêu: Đảm bảo cấu trúc mã nguồn tối ưu cho các bộ máy tìm kiếm (Google Search) và trình đọc màn hình.

#### TC-L3-001: Kiểm tra cấu trúc thẻ Heading (Heading Hierarchy)
* **Các bước thực hiện**:
  1. Đảm bảo chỉ có duy nhất **một** thẻ `<h1>` trên toàn bộ trang.
  2. Không được nhảy cóc cấp độ thẻ heading (ví dụ nhảy từ `H2` xuống `H4` mà không qua `H3`).
  3. Xác thực thứ tự xuất hiện của headings bằng cách chạy script Console:
     ```javascript
     console.log(Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => el.tagName + ': ' + el.innerText.trim()));
     ```
* **Tiêu chuẩn đạt (Expected)**:
  * `h1Count === 1` (Tiêu đề Hero).
  * Tiêu đề các section chính là `H2`.
  * Tiêu đề các bước quy trình, các combo sản phẩm, các module con và tiêu đề cột ở Footer bắt buộc là `H3` (không dùng `H4`).

#### TC-L3-002: Kiểm tra SEO Meta Tags & Canonical URL
* **Các bước thực hiện**:
  1. Inspect mã nguồn `<head>`.
  2. Đảm bảo thẻ `<link rel="canonical">` trỏ chính xác về domain sản xuất `https://3dprinting.ledainhan.com/`.
  3. Thẻ `<meta property="og:image">` phải trỏ tới URL tuyệt đối và **không bị lỗi double slash (`//`)** ở giữa domain và đường dẫn ảnh (ví dụ: `https://3dprinting.ledainhan.com/images/hero-pegboard.webp` chứ không phải `...com//images/...`).

#### TC-L3-003 & TC-L3-004: Kiểm tra Alt Text & Sitemap/Robots.txt
* **Các bước thực hiện**:
  1. Mọi thẻ `<img>` trên trang đều phải được khai báo thuộc tính `alt` mô tả nội dung có nghĩa.
  2. Đọc tệp `dist/robots.txt` sau khi build và đảm bảo dòng khai báo sitemap trỏ đúng:
     `Sitemap: https://3dprinting.ledainhan.com/sitemap-index.xml` (không trỏ về domain dự án cũ `nuidinh.help` hay domain phụ `in3d.help`).

---

### LAYER 4: ASSET OPTIMIZATION, PERFORMANCE & WEB VITALS
Mục tiêu: Tải trang nhanh nhất có thể, đạt điểm số Lighthouse tối đa.

#### TC-L4-001: Kiểm thử tối ưu hóa hình ảnh WebP
* **Các bước thực hiện**:
  1. Mở tab **Network**, filter theo `Img` và hard reload trang (`Cmd + Shift + R`).
  2. Đảm bảo mọi hình ảnh tải về đều có đuôi mở rộng `.webp` (được tối ưu hóa qua script `optimize-images.js`).
  3. Các ảnh nửa trên màn hình (Above-the-fold) như Hero Image phải được set `loading="eager"` và `fetchpriority="high"`. Các ảnh phía dưới phải set `loading="lazy"`.

#### TC-L4-002: Kiểm tra bộ Favicon đa độ phân giải
* **Các bước thực hiện**:
  1. Đảm bảo các tệp `favicon.ico` (cho trình duyệt cũ), `favicon.png` (cho trình duyệt hiện đại), và `apple-touch-icon.png` (cho thiết bị iOS) được khai báo đúng trong `<head>` và tồn tại trong thư mục `public/`.

#### TC-L4-003: Chạy Lighthouse Audit (Local Preview & Live Production)
* **Các bước thực hiện**:
  1. Chạy Lighthouse Audit trực tiếp trên Chrome DevTools ở chế độ Ẩn danh (Incognito Mode).
  2. Thực hiện đo cho cả hai phiên bản **Desktop** và **Mobile**.
* **Tiêu chuẩn đạt (Expected)**:
  * **SEO**: 100 / 100
  * **Best Practices**: 100 / 100
  * **Accessibility (A11y)**: **Tối thiểu >= 96 / 100** (điểm số 96 là tối đa cho thiết kế tech dark có sử dụng một số chi tiết chữ in chìm mỹ thuật).

---

### LAYER 5: BUILD INTEGRITY & DEPLOYMENT VERIFICATION
Mục tiêu: Kiểm soát quy trình đóng gói và đảm bảo trang web hoạt động hoàn hảo trên môi trường sản xuất thực tế.

#### TC-L5-001: Build Integrity
* **Các bước thực hiện**:
  1. Chạy lệnh build Astro. Quá trình build phải hoàn thành sạch sẽ dưới 1 giây mà không hiển thị cảnh báo (warning) hay lỗi đỏ (error) nào từ Astro hay Vite.

#### TC-L5-002: Kiểm tra liên kết hỏng (Broken Links)
* **Các bước thực hiện**:
  1. Quét qua toàn bộ thẻ `<a>` trên trang. Đảm bảo các liên kết Zalo (`https://zalo.me/in3dhelp`), email (`mailto:hello@in3d.help`) và các link mạng xã hội hoạt động chuẩn xác.
  2. Các liên kết ngoài phải có thuộc tính `target="_blank" rel="noopener noreferrer"`.

#### TC-L5-003 & TC-L5-004: Xác thực Live Deploy
* **Các bước thực hiện**:
  1. Truy cập trực tiếp địa chỉ `https://3dprinting.ledainhan.com/`.
  2. Tiến hành chạy nhanh một lượt QC khói (Smoke test): nhấp Zalo CTA, cuộn trang kích hoạt reveal animation, mở faq.
  3. Đo lường lại điểm Lighthouse trực tiếp trên Live URL để đối chiếu hiệu suất thực tế trên CDN của Cloudflare.
