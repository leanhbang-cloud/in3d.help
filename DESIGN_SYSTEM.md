# Design System — Núi Dinh Website
> Phiên bản: 1.0 · Duyệt: 31/05/2026 · Status: ✅ Hoàn chỉnh, sẵn sàng code

---

## 01. Color Palette — Option C (Đã duyệt ✅)

> Kết hợp 2 màu chủ đạo Louis Vuitton (Cognac + Gold) với Xanh Rừng Già undertone ấm.
> Cả 5 màu cùng "nhiệt độ ấm" — không có màu nào lạc tông.

### Màu nền & UI chính

| CSS Token | Tên | Hex | Dùng cho |
|---|---|---|---|
| `--color-cognac` | Nâu Cognac | `#5C3D20` | Header, nav background, primary buttons |
| `--color-gold` | Vàng Gold | `#C8A45D` | Logo text, heading accent, badge border |
| `--color-forest` | Xanh Rừng Già | `#1E3A28` | Difficulty badges, secondary headings, highlights, footer |
| `--color-cream` | Kem Ấm | `#F0E6D0` | Background sections, cards, body backdrop |
| `--color-bronze` | Đồng Cổ | `#75560C` | Body text nhỏ, icon, caption |

### Màu text & utility

| CSS Token | Tên | Hex | Dùng cho |
|---|---|---|---|
| `--color-text` | Charcoal | `#1C1C1E` | Body text chính |
| `--color-text-light` | Nâu nhạt | `#7A5C3A` | Secondary text, caption — warm hơn gray thuần |
| `--color-bg` | Trắng Ấm | `#FAF6EF` | Page background tổng |
| `--color-disabled` | Nâu xám | `#B0957A` | Disabled state |

### Phân cấp sử dụng màu
```
Cognac (#5C3D20)  ████████████  Header, nav, primary CTA button, emergency strip bg
Gold (#C8A45D)    ████████      Logo, heading highlight, star icon
Forest (#1E3A28)  ██████        Badge độ khó, section heading phụ, section labels, footer bg, pill buttons
Cream (#F0E6D0)   ████████████  Card bg, section bg, "Góc người địa phương" bg, emergency labels
Bronze (#75560C)  ████          Caption, icon nhỏ, decorative
```

### Màu cung đường (chỉ dùng cho badge/tag nhận diện, KHÔNG dùng cho UI chung)
- 🔵 Tuyến Xanh Dương — HBS – Thiền Viện – La Bàn: `#1976D2` (Xanh dương đậm — Đạt A11y)
- 🔴 Tuyến Đỏ — HBS – Suối Đá (5 hồ) – La Bàn: `#F44336` (Đỏ)
- 🟡 Tuyến Vàng — HBS – Di Đà Sơn – Ống Nước – La Bàn: `#FFC107` (Vàng)
- 🟢 Tuyến Xanh Lá — HBS – Cô Kiều – Cô Hường – La Bàn: `#2E7D32` (Xanh lá đậm)

### Mobile Strip Variants (3 màu — mỗi loại 1 mục đích)
| Strip | Nền | Chữ | Dùng cho |
|---|---|---|---|
| Forest strip | `#1E3A28` | `#F0E6D0` | Data kỹ thuật: km, thời gian, độ cao |
| Gold strip | `#C8A45D` | `#5C3D20` | Góc người địa phương — tip của Bang (ép toàn bộ chữ con dùng màu Cognac) |
| Cognac strip | `#5C3D20` | `#F0E6D0` | Thông tin thực tế: gửi xe, ăn uống, hỗ trợ khẩn cấp |

---

## 02. Typography — (Đã duyệt ✅)

**Font family:** Roboto Slab (display/hero) + Roboto (body/heading) + Roboto Mono (data)
**Load:** Google Fonts — 1 request, cùng family

### Type Scale

| Level | Font | Size Desktop | Size Mobile | Weight | Letter-spacing | Dùng cho |
|---|---|---|---|---|---|---|
| `display` | Roboto Slab | `56px` | `36px` | 700 | `-0.5px` | Hero title chính |
| `h1` | Roboto Slab | `40px` | `28px` | 700 | `-0.3px` | Page title |
| `h2` | Roboto | `32px` | `24px` | 600 | `0` | Section heading |
| `h3` | Roboto | `24px` | `20px` | 600 | `0` | Sub-section, card title, timeline title |
| `h4` | Roboto | `18px` | `16px` | 600 | `+0.2px` | Label heading |
| `body-lg` | Roboto | `18px` | `16px` | 400 | `0` | Lead paragraph |
| `body` | Roboto | `16px` | `15px` | 400 | `0` | Body text chính |
| `body-sm` | Roboto | `14px` | `13px` | 400 | `0` | Caption, note, reset button |
| `data` | Roboto Mono | `14px` | `13px` | 500 | `+0.5px` | Số liệu: km, giờ, GPS |
| `badge` | Roboto | `12px` | `12px` | 700 | `+1px` | Badge độ khó, tag, section labels — ALL CAPS |

### Color Assignment
- `display`, `h1`, `h4`: màu Cognac `#5C3D20`
- `h2`, `h3`: màu Forest `#1E3A28`
- `body-lg`, `body`: màu Charcoal `#1C1C1E`
- `body-sm`: màu Nâu nhạt `#7A5C3A`
- `data`: màu Forest `#1E3A28`, nền Forest strip
- `badge`: chữ trắng `#FFFFFF`, nền Forest `#1E3A28`
- `section-label` (badge-text): màu Forest `#1E3A28` trên nền Kem hoặc Trắng (Contrast 6.5:1) để đạt chuẩn A11y.
- `reset-btn`: màu Cognac `#5C3D20` trên nền Kem/Trắng (Contrast 5.5:1) để đạt chuẩn A11y.

### Line-height
- Headings: `1.2`
- Body: `1.6`

---

## 03. Spacing System — (Đã duyệt ✅)

**Base unit: 8px** — mọi khoảng cách đều là bội số của 8.

| Token | Value | Dùng cho |
|---|---|---|
| `--space-micro` | `4px` | Icon gap, badge padding nhỏ |
| `--space-xs` | `8px` | Gap inline nhỏ |
| `--space-sm` | `16px` | Padding button, card content padding |
| `--space-md` | `24px` | Gap giữa elements trong section |
| `--space-lg` | `32px` | Gap giữa sections nhỏ |
| `--space-xl` | `48px` | Margin giữa sections |
| `--space-2xl` | `64px` | Padding section lớn, hero padding |
| `--space-3xl` | `96px` | Hero top/bottom padding |

---

## 04. Grid System — (Đã duyệt ✅)

### Desktop (max-width: 1280px)
- 12 columns
- Gutter: `24px`
- Side padding: `64px`

### Mobile (390px)
- 4 columns
- Gutter: `16px`
- Side padding: `20px`

### Layout Patterns

**A. Hero** — Full-width `100vw`, text centered (mobile) / left-aligned (desktop)

**B. Trail Cards** — 3-col grid desktop / 1-col stack mobile

**C. Content + Aside (Grid 8:4 split layout)**
- Desktop: main content 8 cols (left) + aside 4 cols (right, sticky) với khoảng cách gap cố định `32px` (`var(--space-lg)`).
  - Aside chứa các component theo thứ tự ưu tiên: Emergency Box ➡️ Card D (Safety Alert) ➡️ Card B (At a Glance) ➡️ Card C (Local Insight).
- Mobile: Aside cột bên phải tự động ẩn đi (`display: none`), và co gọn (collapse) thành các dải banner nằm ngang (**Mobile Strips**) xen kẽ trực tiếp vào trong luồng đọc nội dung chính (không dồn xuống đáy trang).
  - Forest strip: dữ liệu kỹ thuật (KM, thời gian, độ cao).
  - Gold strip: Góc người địa phương (các mẹo của Bang).
  - Cognac strip: thông tin thực địa thực tế (gửi xe, ăn uống).
  - Quy tắc: Bản desktop và mobile strip dùng chung một DOM và ẩn hiện qua CSS để tránh trùng lặp tiêu điểm bàn phím (A11y) và nội dung trùng lặp (SEO). Dùng `aria-hidden="true"` cho phiên bản đang ẩn.

---

## 05. Buttons — (Đã duyệt ✅)

### Variants

| Variant | Nền | Chữ | Border | Dùng cho |
|---|---|---|---|---|
| Primary | `#5C3D20` | `#F0E6D0` | none | CTA chính |
| Secondary | transparent | `#5C3D20` | `2px solid #5C3D20` | CTA phụ |
| Ghost | transparent | `#5C3D20` | none | Link hành động, inline |
| Icon | `#1E3A28` | `#F0E6D0` | none | Action icon 40×40px |

### Sizes

| Size | Height | Padding | Font | Dùng cho |
|---|---|---|---|---|
| Large | `52px` | `16px 32px` | `18px` | Hero CTA |
| Medium | `44px` | `14px 24px` | `16px` | Standard |
| Small | `36px` | `10px 18px` | `14px` | Inline action |

### States
- **Default**: như trên
- **Hover**: Primary → `#4A3018` + shadow `0 4px 12px rgba(92,61,32,0.3)`
- **Active**: `#3A2510` + scale `0.98`
- **Disabled**: `#B0957A`, opacity `0.6`, cursor `not-allowed`

### Border radius: `8px` cho tất cả buttons

### Chữ: Title Case (KHÔNG ALL CAPS, kể cả Secondary)

---

## 06. Cards — (Đã duyệt ✅)

**Border radius:** `12px` | **Shadow:** `0 2px 8px rgba(0,0,0,0.08)`

### Card A — Trail Card

```
┌──────────────────────────────┐
│  [Hero Image — full bleed]   │  ← KHÔNG có padding bên (chạm mép card)
│                     [Badge]  │  ← Badge góc phải trên ảnh
├──────────────────────────────┤
│  16px padding trái/phải      │
│  H3: Tên cung đường          │  ← Cognac
│  Body-sm: Mô tả ngắn         │
│  [Forest data strip]         │  ← Inset 16px hai bên, align với text
│  [Primary button]            │  ← Full width trong vùng padding
└──────────────────────────────┘
```
> **Rule quan trọng:** Hero image full-bleed. Data strip + button phải có `margin: 0 16px` — KHÔNG chạm mép card.

### Card B — At a Glance Box

```
┌─ (4px gold border left) ────┐
│  Thông tin nhanh    🧭       │
│  ─────────────────────────  │  ← gold divider
│  Độ khó     ⭐⭐⭐⭐ Khó      │
│  Cự ly          13–15 km    │
│  Thời gian        5–7 giờ   │
│  Độ cao            504 m    │
│  Phù hợp  Trekker KN        │
│  Xuất phát   Quán Cô Kiều   │
└─────────────────────────────┘
```
Desktop: sidebar sticky 4 cols. Mobile: collapse thành Forest strip.

### Card C — Local Insight Card

```
┌─ (4px gold border left) ────┐
│  ★ Góc người địa phương     │  ← Gold star + Cognac bold
│  Bang · Trekker Núi Dinh 5+ năm  │  ← Bronze italic
│  ─────────────────────────  │
│  "[Quote thực tế của Bang]" │  ← Cognac, body size
│                             │
│  [💡 Tip đường mòn]         │  ← Bronze tag
│  [🏃 Tip luyện tập]         │  ← Bronze tag (nếu có)
└─────────────────────────────┘
```

### Card D — Safety Alert Card

```
┌─ (4px cognac border left) ──┐
│  ⚠️ Lưu ý quan trọng        │  ← Cognac bold
│  [body text cảnh báo]       │
│  Đọc cẩm nang đầy đủ →      │  ← Ghost button
└─────────────────────────────┘
```

### Card F — Info Note Card [NEW]

```
┌─ (4px gold border left) ────┐
│  [Tiêu đề mốc đường]        │  ← Cognac bold
│  [Nội dung mốc đường]       │  ← body-sm
└─────────────────────────────┘
```
- Nền: Kem Ấm `--color-cream` (`#F0E6D0`).
- Viền trái: Vàng Gold `--color-gold` (`#C8A45D`) dày 4px.
- Dùng hiển thị thông tin mốc đường hoặc chú ý nhẹ.

### Emergency Box — Hộp Khẩn Cấp [NEW]

```
┌─────────────────────────────┐
│  🚨 Hotline Cứu Hộ          │  ← Gold text, Cognac bg
│  ─────────────────────────  │  ← gold divider
│  Cấp cứu: 115               │  ← tel link
│  Công an: 113 | Cứu hỏa: 114│
└─────────────────────────────┘
```
- Nền: Nâu Cognac `--color-cognac` (`#5C3D20`) sẫm.
- Chữ: Vàng Gold `--color-gold` (`#C8A45D`).
- Đồng bộ màu sắc 100% với dải hotline khẩn cấp ở Footer để trekker nhận diện nhanh nhất.

---

## 07. Navigation & Header — (Đã duyệt ✅)

### Desktop Header
- Background: Cognac `#5C3D20`
- Height: `64px`
- Layout: Logo (left) + Nav links (center) + CTA button (right)
- Logo: `"⛰ Núi Dinh"` — Roboto Slab Bold 22px, Gold `#C8A45D`
- Nav links: Roboto SemiBold 15px, Cream `#F0E6D0`
  - Active: Gold `#C8A45D` + underline 2px
  - Hover: Gold `#C8A45D`
- CTA button: Cream bg, Cognac text, border-radius 6px, padding `8px 16px`, font 14px — `"Bắt đầu khám phá →"`
- **Sticky on scroll** + `box-shadow: 0 2px 12px rgba(0,0,0,0.15)` khi scroll

### Nav items (4 links)
1. Cung đường → `/cac-cung-duong`
2. Di chuyển → `/di-chuyen`
3. Cẩm nang → `/cam-nang-an-toan`
4. Về Núi Dinh → `/ve-nui-dinh`

### Mobile Header
- Background: Cognac `#5C3D20`
- Height: `56px`
- Layout: Logo (left) + Hamburger icon (right, 24px, Cream)

### Mobile Nav Drawer
- Slides từ **phải**
- Width: `280px`
- Background: Cognac `#5C3D20`
- Transition: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Nav items: 56px height mỗi item, icon + label, divider cream mỏng
  - Active: Gold text
  - Default: Cream text
- Bottom: CTA button full-width `"Bắt đầu khám phá →"`
- Backdrop: `rgba(0,0,0,0.5)` behind drawer

---

## 08. Footer — Option A (Đã duyệt ✅)

### Layout
- Background: Forest Green `#1E3A28`
- 3 columns cân bằng + Emergency strip + Copyright bar

### Desktop Structure
```
┌─────────────────────────────────────────────────────┐
│  Col 1: Logo + tagline + description                │
│  Col 2: KHÁM PHÁ + 5 trail links                   │  padding: 48px 64px
│  Col 3: THÔNG TIN + 4 info links                   │
├─────────────────────────────────────────────────────┤
│  [Cognac strip 40px] Các số khẩn cấp | 🚨115 · 👮113 · 🔥114  │  ← hyperlinks
├─────────────────────────────────────────────────────┤
│  © 2026 Núi Dinh Guide        Làm bằng ❤️ bởi...  │
└─────────────────────────────────────────────────────┘
```

### Mobile Structure
- Logo + tagline (full width)
- Accordion: KHÁM PHÁ `+` / THÔNG TIN `+`
- Cognac strip: "Các số khẩn cấp" + 3 gold pill buttons tappable `[🚨 115]` `[👮 113]` `[🔥 114]`
- Copyright

### Số khẩn cấp — hyperlinks (tel:)
- `tel:115` — 🚨 Cấp cứu
- `tel:113` — 👮 Công an
- `tel:114` — 🔥 Cứu hỏa

### Typography trong footer
- Section labels: Gold `#C8A45D`, Roboto Bold 12px, spacing `+1px`
- Links: Cream `#F0E6D0`, Roboto 14px
- Copyright: Cream 12px
- Emergency numbers: Gold `#C8A45D`, Roboto Mono, underlined

---

## 09. Hero Section — (Đã duyệt ✅)

### Desktop (1280px × 600px)
- Full-bleed background image: rừng nhiệt đới Việt Nam, **green tone** (xanh tươi buổi sáng, sương mù, ánh sáng xuyên tán cây)
- Overlay gradient: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)`
- Content: bottom-left, padding `64px` từ mép

```
[📍 Bà Rịa – Vũng Tàu · 80km từ Sài Gòn]  ← Gold pill tag
Khám phá Núi Dinh                            ← Display, White
Thiên nhiên · Tâm linh · Lịch sử            ← H2, Cream
[Chọn cung đường →]  [Cẩm nang an toàn]     ← Primary + Ghost (cream border)
4 cung đường · Miễn phí vào cổng · Cập nhật 5/2026  ← body-sm, cream
```

- Scroll indicator: gold vertical line + "Khám phá" rotated 90°, bottom-right

### Mobile (390px × clamp(320px, 60vh, 420px))
- Chiều cao được điều chỉnh linh hoạt từ 320px đến 420px nhằm tránh Chromium loại trừ ảnh khỏi LCP (Full-Viewport Image Exclusion) khi ảnh phủ kín toàn bộ viewport trên các thiết bị màn hình ngắn, đồng thời lộ một phần nội dung tiếp theo ở cạnh dưới màn hình giúp tăng hiệu quả UX cuộn trang.
- Same image, same overlay
- Content: centered
- Buttons: stacked full-width
- Không có scroll indicator

### Ảnh Hero
- **Ưu tiên:** ảnh thực tế từ Bang (authentic, trust cao)
- **Placeholder:** AI generate với prompt: *"Realistic photo of lush green Vietnamese tropical mountain forest, morning mist, mossy rocks, sunlight through canopy, cinematic, no people, high resolution"*

---

## 10. Micro-animations — (Đã duyệt ✅)

### Global Timing Tokens

```css
--duration-fast:   150ms;  /* buttons, small UI */
--duration-base:   200ms;  /* cards, nav links */
--duration-slow:   300ms;  /* drawers, panels */
--duration-reveal: 400ms;  /* scroll reveals */
--ease-standard:   ease-out;
--ease-spring:     cubic-bezier(0.4, 0, 0.2, 1); /* drawers */
```

### Animation Specs

| # | Element | Trigger | Effect | Duration | Easing |
|---|---|---|---|---|---|
| 01 | Trail Card | Hover | `translateY(-4px)` + shadow cognac | 200ms | ease-out |
| 02 | Primary Button | Hover | bg `#4A3018` + shadow | 150ms | ease |
| 03 | Nav Link | Hover/Active | Gold color + underline slide left→right | 200ms | ease-out |
| 04 | Sections | Scroll into view | `opacity: 0→1` + `translateY(20px→0)`, stagger 100ms | 400ms | ease-out |
| 05 | Mobile Drawer | Tap hamburger | Slide từ phải vào | 300ms | cubic-bezier spring |
| 06 | Data Strip | Card appear | `opacity: 0→1` + `scale(0.95→1)` | 300ms | ease-out |

### Rules
- KHÔNG dùng animation > 400ms (trừ scroll reveal)
- KHÔNG dùng bounce/elastic trừ drawer
- Tất cả transitions phải có `will-change: transform` nếu dùng translateY
- Respect `prefers-reduced-motion`: tắt toàn bộ animation nếu user bật reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 11. Lightbox Component (Component #11)

> Dùng để phóng to và duyệt qua các bức ảnh trong thư viện ảnh (Gallery) hoặc các ảnh chi tiết khác, đảm bảo tối ưu hóa cho di động (sóng yếu).

### Visual & Layout Specs
- **Backdrop Overlay**: Màu đen sẫm `rgba(0,0,0,0.85)` để cô lập ảnh và tăng mức độ tập trung thị giác, loại bỏ chi tiết nền xao nhãng.
- **Close Button**: Tái sử dụng Icon Button variant đã có sẵn ở mục 05 (kích thước `40x40px`, nền xanh Rừng Già `#1E3A28`, biểu tượng dấu `✕` màu Kem `#F0E6D0`). Vị trí cố định ở góc trên bên phải màn hình (cách mép 16px trên mobile, 24px trên desktop).
- **Navigation Arrows**: 
  - Nút tròn, viền vàng Gold `#C8A45D`, nền trong suốt, mũi tên màu Gold.
  - Kích thước: `48px` trên desktop, tự động co về `40px` trên mobile để tránh che khuất ảnh.
  - Vị trí: Căn giữa theo chiều dọc ở hai mép trái và phải của màn hình.
  - Hover state: Nền màu Gold `#C8A45D`, mũi tên màu nâu Cognac `#5C3D20`.
- **Caption**: Font `body-sm` (Roboto 14px desktop / 13px mobile), chữ màu Kem `#F0E6D0` căn giữa phía dưới ảnh.

### Motion & Timing
- **Duration**: Sử dụng token `--duration-slow` (`300ms`) cho hiệu ứng mở/đóng. Chuyển ảnh sử dụng token `--duration-base` (`200ms`).
- **Easing**: Sử dụng `--ease-spring` (`cubic-bezier(0.4, 0, 0.2, 1)`).
- **Hiệu ứng**: Lớp nền đen fade-in/out (`opacity: 0 ↔ 1`), ảnh zoom-in/out (`scale(0.95) ↔ 1`).

### Interactions & Controls
- **Desktop**:
  - Click nút `✕` hoặc click vào khoảng không đen bên ngoài ảnh để ĐÓNG Lightbox.
  - Click mũi tên trái/phải để chuyển ảnh.
  - Hỗ trợ bàn phím: Phím `ESC` để đóng, phím mũi tên `←` / `→` để chuyển ảnh.
- **Mobile**:
  - Hỗ trợ vuốt ngang (`swipe` trái/phải) để chuyển ảnh nhanh chóng bằng một tay.
  - Nhấp đúp (double-tap) để zoom ảnh lên 1.5x (không sử dụng thư viện zoom ngoài để giữ code cực nhẹ).

### Performance Rules
- **Tách biệt Thumbnail và Full-size**: Thumbnail trên grid (rộng tối đa 400px, dưới 40 KB, định dạng `.webp`, `loading="lazy"`). Chỉ tải ảnh Full-size khi bấm phóng to (rộng tối đa 1000px, dưới 120 KB, định dạng `.webp`).

---

## 12. Badge Variants (Phân cấp độ đề xuất) — (Đã duyệt v1.1 ✅)

> Dùng để phân loại các mức độ đề xuất, trạng thái hoặc cảnh báo trực quan theo màu sắc ngữ nghĩa.

### Visual Specs
- **Success Badge (Lý tưởng / An toàn)**:
  - Nền: Xanh Rừng Già `#1E3A28`
  - Chữ: Kem Ấm `#F0E6D0`
- **Warning Badge (Phù hợp / Cần lưu ý)**:
  - Nền: Vàng Gold `#C8A45D`
  - Chữ: Nâu Cognac `#5C3D20`
- **Danger Badge (Hạn chế / Nguy hiểm)**:
  - Nền: Nâu Cognac `#5C3D20`
  - Chữ: Kem Ấm `#F0E6D0`

### Typography & Layout
- **Font**: Roboto Bold 12px, weight 700, letter-spacing `+1px` (ALL CAPS).
- **Padding**: `4px 10px` | **Border radius**: `6px`.
- **Phân biệt với Button**: Các Badge này bắt buộc phải cấu hình `cursor: default` và **không có hiệu ứng hover** (no hover state) để tránh việc trekker nhầm lẫn là các nút bấm có thể nhấp được (đặc biệt là Danger Badge có màu giống Primary Button).

---

## 13. Checkbox & Checklist Component — (Đã duyệt v1.1 ✅)

> Sử dụng cho danh sách chuẩn bị đồ dùng hoặc các checklist tương tác, đảm bảo dễ bấm chạm trên di động.

### Checkbox Spec
- **Kích thước visual**: `20px × 20px` (kích thước hiển thị thực tế).
- **Clickable Area (Vùng tương tác cảm ứng)**: Mở rộng tối thiểu `44px × 44px` (chuẩn WCAG 2.5.5 và Apple HIG) bằng cách thêm padding cho dòng chứa và cho phép bấm vào toàn bộ dòng để kích hoạt checkbox.
- **Border**: Viền rộng `2px`, màu nâu xám `--color-disabled` (`#B0957A`) mặc định. Chuyển sang màu nâu Cognac `--color-cognac` (`#5C3D20`) khi hovered hoặc focused.
- **Nền (Background)**: Trắng Ấm `--color-bg` (`#FAF6EF`). Khi checked đổi sang nền màu nâu Cognac `--color-cognac` (`#5C3D20`).
- **Dấu tick (Checkmark)**: Dấu tick chữ V màu Kem `--color-cream` (`#F0E6D0`), nét vẽ dày `2px`, xoay 45 độ, căn giữa checkbox.
- **Bo góc (Border radius)**: `4px`.
- **Timing**: Chuyển đổi trạng thái checked/unchecked bằng transition `150ms ease-out`.
- **Vô hiệu hóa (Disabled State)**: Opacity giảm còn `0.5`, `cursor: not-allowed` và không có hiệu ứng hover.

### Checklist Item Layout
- **Bố cục**: Xếp hàng ngang, checkbox bên trái, nhãn văn bản bên phải. Khoảng cách (gap) giữa checkbox và text là `12px`.
- **Typography**: `body-sm` (Roboto 14px desktop / 13px mobile), chữ màu Charcoal `--color-text` (`#1C1C1E`).
- **Trạng thái Checked**: Khi checkbox được tick, chữ chuyển màu sang màu nâu nhạt `--color-text-light` (`#7A5C3A`) bằng transition `color 150ms ease-out`, đồng thời hiển thị đường gạch ngang chữ (`text-decoration: line-through`) ngay lập tức.
- **Reset Button**: Tái sử dụng Ghost Button variant ở mục 05 (nền trong suốt, chữ màu nâu nhạt, hover đổi Cognac, chiều cao 36px). Kèm theo một dòng text warning nhỏ màu nâu nhạt kế bên: `"Xóa toàn bộ dấu tick đã chọn"`.

### Mobile Aside Duplicate Content Rule
- Để tối ưu hóa cho SEO di động (Mobile-First Indexing) và Trình đọc màn hình (Accessibility), nội dung bị trùng lặp do chuyển đổi từ Sidebar Desktop sang Mobile Strip phải sử dụng thuộc tính `aria-hidden="true"` cho phiên bản đang ẩn, đảm bảo Google và thiết bị hỗ trợ không quét trùng lặp dữ liệu trong DOM.

---

## 14. Sub-hero Section — (Đã duyệt v1.2 ✅)

> Dùng cho các trang con (trang thông tin phụ) để tạo sự phân biệt với trang chủ và tập trung vào nội dung cụ thể của từng trang.

### Visual & Layout Specs
- **Chiều cao**: Cố định `320px` trên desktop, co về `240px` trên mobile.
- **Biến thể phẳng (Flat variant - dùng cho trang `/di-chuyen`)**:
  - Nền: Kem Ấm `--color-cream` (`#F0E6D0`), không sử dụng ảnh nền để tăng tính rõ ràng cho dữ liệu kỹ thuật.
  - Text: Tiêu đề H1 Roboto Slab Bold màu Cognac `--color-cognac` (`#5C3D20`), subtitle là font `body-lg`.
- **Biến thể hình ảnh (Image variant - dùng cho trang `/ve-nui-dinh`)**:
  - Nền: Ảnh phong cảnh (chùa cổ giữa rừng hoặc view từ đỉnh La Bàn), có lớp overlay tối màu `linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)`.
  - Text: Tiêu đề H1 Roboto Slab Bold màu Kem Ấm `--color-cream` (`#F0E6D0`) hoặc Trắng Ấm `--color-bg` (`#FAF6EF`).
- **Padding dọc**: `--space-2xl` (`64px`) cho cả trên và dưới.
- **Quy tắc**: Không có scroll indicator, không có pill tag địa lý (chỉ xuất hiện ở Hero trang chủ).

---

## 15. Tab Component — (Đã duyệt v1.2 ✅)

> Dùng để chuyển đổi nhanh giữa các nhóm nội dung tương quan trên cùng một trang (ví dụ: các phương tiện di chuyển).

### Visual & Layout Specs
- **Tab bar height**: `48px`.
- **Default tab**: Nền trong suốt (`transparent`), border-bottom `2px solid transparent`, chữ màu Cognac `--color-cognac` (`#5C3D20`), font Roboto 16px, weight 500.
- **Active tab**: Border-bottom `2px solid #C8A45D` (Gold), chữ màu Cognac `--color-cognac` (`#5C3D20`), weight 600. Không dùng nền màu đặc biệt hay màu chữ sáng (tránh nhầm lẫn với Primary Button).
- **Hover state**: Chữ chuyển màu Gold `--color-gold` (`#C8A45D`), transition `200ms ease-out`.
- **Mobile Responsive**: 
  - 3 tab chia đều chiều rộng (`flex: 1`).
  - Hỗ trợ stack icon trên + label dưới nếu độ dài chữ quá dài để tránh tràn ngang.
- **Tab bar container**: Có đường viền dưới `1px solid #B0957A` (màu disabled) chạy full-width bên dưới toàn bộ tab bar để phân tách rõ ràng phần điều hướng tab và nội dung hiển thị bên dưới.

---

## 16. Card E (Service Card) — (Đã duyệt v1.2 ✅)

> Dùng hiển thị các bãi xe, điểm dịch vụ ăn uống dưới dạng lưới grid song song, gộp toàn bộ thông tin thay vì tách bảng.

### Visual & Layout Specs
- **Nền (Background)**: Kem Ấm `--color-cream` (`#F0E6D0`), bo góc `border-radius: 12px`, không có border-left dày màu gold (phân biệt với Card B & C).
- **Padding**: `24px` đều các phía.
- **Tiêu đề**: H4 tên bãi xe/điểm dịch vụ, màu Cognac `--color-cognac` (`#5C3D20`).
- **Forest Data Strip**: Chứa thông tin giá gửi xe & giờ mở cửa, chữ màu Kem Ấm trên nền Xanh Rừng Già `--color-forest` (`#1E3A28`).
- **Body Content**: Font `body-sm` (Roboto 14px desktop / 13px mobile) hiển thị danh sách các dịch vụ đi kèm (yaourt, đặt cơm gà, tắm thay đồ).
- **GPS Coordinates**: 
  - Hiển thị tọa độ dạng inline code: font Roboto Mono 14px, màu Forest `#1E3A28`, nền Cream nhạt (`#FAF6EF` hoặc tương đương), padding `4px 8px`, border-radius `4px`.
- **Action Button**: Nút bấm Ghost Button Small (36px height) nằm ở hàng dưới cùng với icon 📋 và text "Sao chép".
  - **Visual Feedback**: Khi click, nút chuyển sang text "✓ Đã copy" và đổi màu chữ sang Forest `#1E3A28` trong vòng 2 giây trước khi tự động revert về trạng thái mặc định.
  - **Fallback**: Tương thích tốt với iOS Safari bằng cách sử dụng `navigator.clipboard` kết hợp fallback `document.execCommand` cho các dòng máy cũ.

---

## 17. Step List Pattern — (Đã duyệt v1.2 ✅)

> Sử dụng cho các danh sách hướng dẫn từng bước (ví dụ: các bước di chuyển, các bước chuẩn bị) để tăng tính mạch lạc và trực quan cho người đọc.

### Visual & Layout Specs
- **Biểu tượng (List Marker)**: Sử dụng mũi tên unicode `➔` màu Gold `--color-gold` (`#C8A45D`), font-weight bold, hiển thị tuyệt đối bên trái dòng.
- **Bố cục (Layout)**: 
  - Thẻ `ul` có `list-style: none`, padding `0`, margin dọc.
  - Các thẻ `li` có `position: relative`, `padding-left: 24px` để chừa chỗ cho biểu tượng.
  - Line-height `1.6` cho text bên trong.
- **Typography**: Kế thừa `body` (Roboto 16px desktop / 15px mobile), chữ màu Charcoal `--color-text` (`#1C1C1E`). Các mốc quan trọng/tiêu đề con có thể dùng thẻ `<strong>`.

---

## Summary — Quyết định đã lock

| Element | Quyết định |
|---|---|
| Color palette | Option C: Cognac `#5C3D20` + Gold `#C8A45D` + Forest `#1E3A28` + Cream `#F0E6D0` |
| Font | Roboto Slab (hero) + Roboto (body) + Roboto Mono (data) |
| Grid | 12 col desktop / 4 col mobile, max-width 1280px |
| Mobile aside | Horizontal badge strips (3 variants) thay vì sidebar stack |
| Card padding | Hero image full-bleed, content inset `16px` |
| Footer | Option A: Emergency cognac strip giữa columns và copyright |
| Hero image | Green tone (rừng xanh buổi sáng) — ảnh thật từ Bang khi có |
| Nav drawer | Slide từ phải, `300ms spring` |
| Animations | Subtle, max 400ms, respect reduced-motion |
| Lightbox | Backdrop rgba(0,0,0,0.85), Icon Button close, key/swipe navigation, 3G optimization |
| Sub-hero | Cao 320px/240px, Flat variant (Kem Ấm) & Image variant (Overlay tối) |
| Tab | Cao 48px, Default transparent, Active border-bottom Gold chữ Cognac |
| Card E | Service Card nền Cream, padding 24px, tích hợp copy GPS feedback + iOS Safari fallback |
| Step List | Dùng marker `➔` màu Gold, padding-left 24px, position relative |
| Blog Table | Nền Kem mờ, header Forest, zebra striping, viền bo 8px, không kẻ dọc |
| Auto-GPS Links | Quét client-side regex `10.x, 107.x`, bọc link Google Maps, icon 📍 tự động, hover nhấc 1px |

---

## 18. Blog Table Style — (Đã duyệt v1.3 ✅)

> Sử dụng cho các bảng so sánh dữ liệu hoặc thống kê trong nội dung bài viết (blog), đảm bảo cấu trúc thông tin rõ ràng và thị giác dễ chịu.

### Visual & Layout Specs
- **Khung chứa (Container)**: Bảng chiếm full-width nội dung chính, bo góc `border-radius: 8px`, có viền ngoài mỏng `1px solid rgba(92, 61, 32, 0.15)` (màu Cognac mờ) và đổ bóng nhẹ `box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05)`.
- **Header (`th`)**: Nền màu Xanh Rừng Già `--color-forest` (`#1E3A28`), chữ màu Kem Ấm `--color-cream` (`#F0E6D0`), font chữ Roboto Slab (`--font-display`), weight 700. Căn lề trái (`text-align: left`), padding `16px`.
- **Dữ liệu (`td`)**: Padding `16px` đều các phía, chữ màu Charcoal `--color-text` (`#1C1C1E`), cỡ chữ `0.95rem` để hiển thị gọn gàng.
- **Đường kẻ hàng**: Có đường viền dưới mờ `1px solid rgba(92, 61, 32, 0.1)` phân tách giữa các hàng. Riêng hàng cuối cùng không có border-bottom để giữ thiết kế sạch sẽ.
- **Zebra Striping (Đọc xen kẽ)**: Các hàng chẵn có màu nền mờ nhạt `rgba(240, 230, 208, 0.25)` (màu Cream ấm mờ) giúp mắt dễ đối chiếu thông tin giữa các cột.
- **Quy tắc**: Tuyệt đối không sử dụng các đường kẻ dọc (vertical borders), loại bỏ toàn bộ các ký tự phân cách `---` thủ công bên ngoài bảng trong nội dung MDX để tránh lỗi render.

---

## 19. Auto-GPS Coordinate Links — (Đã duyệt v1.3 ✅)

> Giải pháp tự động nhận diện và liên kết bản đồ toàn cục cho mọi tọa độ địa lý xuất hiện trên website.

### Cấu trúc kỹ thuật & Trải nghiệm
- **Nhận diện tự động**: Một script chạy toàn cục ở client-side tự động quét các text node chứa tọa độ GPS dạng số (regex Núi Dinh `10.xxxx, 107.xxxx`).
- **Liên kết**: Chuyển hóa chuỗi số thô thành link `<a>` trỏ tới Google Maps (`https://www.google.com/maps/search/?api=1&query=LAT,LNG`) mở tab mới.
- **Tự động chèn Icon**: Script tự chèn thêm biểu tượng `📍 ` ở đầu link để tăng nhận diện thị giác mà không cần nhập thủ công trong nội dung.

### Visual Specs
- **Mặc định (Default)**:
  - Chữ màu Cognac `--color-cognac` (`#5C3D20`), nền màu Gold mờ `rgba(200, 164, 93, 0.15)`.
  - Có border-bottom nét đứt `1px dashed var(--color-gold)`.
  - Padding `2px 6px` và border-radius `4px` tạo hình khối nút bấm rõ ràng.
- **Tương tác (Hover)**:
  - Nền chuyển sang màu Gold `--color-gold` (`#C8A45D`), chữ chuyển màu Xanh Rừng Già `--color-forest` (`#1E3A28`).
  - Border-bottom nét đứt chuyển thành nét liền, nhấc nhẹ nút lên 1px (`translateY(-1px)`) kèm bóng mờ nhẹ để tạo phản hồi xúc giác cho người dùng.



