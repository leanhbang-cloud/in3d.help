# 🎨 DESIGN.MD — BlueMooon's Studio | in3D.help
# Tài liệu Hướng dẫn Thiết kế Toàn diện (Design System & AI Prompt Library)
# Phiên bản: 1.0 | Ngày tạo: 2026-07-28
# Tác giả: BlueMooon's Studio Design Team

---

## MỤC LỤC

1. [Moodboard & Visual Direction](#1-moodboard--visual-direction)
2. [Color Palette (Bảng Màu)](#2-color-palette-bảng-màu)
3. [Typography](#3-typography)
4. [UI/UX Layout Guides cho Landing Page](#4-uiux-layout-guides-cho-landing-page)
5. [AI Prompt Library](#5-ai-prompt-library)
6. [Photography & Content Guidelines](#6-photography--content-guidelines)
7. [Packaging Design Guidelines](#7-packaging-design-guidelines)

---

## 1. MOODBOARD & VISUAL DIRECTION

### 1.1. Triết lý thẩm mỹ tổng thể

BlueMooon's Studio theo đuổi phong cách **"Dark Tech Minimalism meets Open Design"** — sự kết hợp giữa thẩm mỹ công nghệ tối (dark mode), tính tối giản (minimalism), và tinh thần mở/DIY của cộng đồng maker. Mọi ấn phẩm thiết kế phải truyền tải được ba cảm xúc chính:

* **Bí ẩn & Cao cấp (Mystery & Premium):** Nền tối sâu, ánh sáng được kiểm soát, tạo chiều sâu và sự tò mò.
* **Công nghệ & Tương lai (Tech & Futuristic):** Các đường neon cyan, hiệu ứng glow, grid lines mờ, gợi nhớ đến giao diện sci-fi / cyberpunk nhẹ nhàng.
* **Gần gũi & Thân thiện (Warm & Approachable):** Dù dark mode, sản phẩm vẫn phải "ấm" nhờ ánh sáng vàng/cam nhẹ từ đèn bàn, và giọng điệu thương hiệu hài hước.

### 1.2. Từ khóa thẩm mỹ (Aesthetic Keywords)

```
Dark Mode / Tối giản / Open Design / Cyberpunk nhẹ / Neon Glow / 
Modular Grid / Maker Spirit / Tech Workspace / 3D Printed Texture / 
Honeycomb Pattern / Cobalt Blue & Crimson Red contrast / 
Floating product on dark background / Dramatic rim lighting
```

### 1.3. Hình ảnh tham chiếu (Reference Mood)

| Yếu tố | Hướng tham chiếu |
|---|---|
| **Nền (Background)** | Xám than đen (#0D0D0D đến #1A1A2E), gradient sâu, có texture noise nhẹ |
| **Ánh sáng sản phẩm** | Rim light neon cyan từ phía sau, key light trắng lạnh 5600K 45° từ trên-trái, fill light xanh dương nhẹ |
| **Bố cục** | Asymmetric layout, sản phẩm lệch trái/phải, text chiếm 40%, ảnh chiếm 60% |
| **Hiệu ứng UI** | Glassmorphism nhẹ cho card, border glow neon, hover animation |
| **Phong cách chụp ảnh** | Studio product photography trên nền tối, lifestyle shots với desk setup tối giản |
| **Tham khảo website** | [open-design.ai](https://open-design.ai/plugins/example-open-design-landing/) — interactive tech landing, dark theme, fluid animation |

### 1.4. Những gì KHÔNG làm (Anti-Patterns)

```
❌ Nền trắng sáng chói (Light mode)
❌ Gradient rainbow/nhiều màu loè loẹt
❌ Đỏ gắt (pure red #FF0000) hoặc cam sáng (#FF8C00) làm màu nền
❌ Font chữ serif cổ điển (Times New Roman, Georgia)
❌ Hình ảnh stock photo generic (tay bắt tay, mũi tên lên, v.v.)
❌ Layout đối xứng nhàm chán
❌ Quá nhiều text, thiếu whitespace
❌ Hiệu ứng bóng đổ quá đậm (drop shadow nặng)
❌ Hiệu ứng neon quá chói và lòe loẹt khắp nơi
```

---

## 2. COLOR PALETTE (BẢNG MÀU)

### 2.1. Bảng màu chính (Primary Palette)

| Vai trò | Tên màu | Hex Code | RGB | Ghi chú |
|---|---|---|---|---|
| **Nền chính (BG Primary)** | Void Black | `#0D0D0D` | 13, 13, 13 | Nền tối nhất, dùng cho body/hero |
| **Nền phụ (BG Secondary)** | Deep Charcoal | `#1A1A2E` | 26, 26, 46 | Card background, section tối |
| **Nền card/section (BG Tertiary)** | Gunmetal | `#16213E` | 22, 33, 62 | Nền card, nền footer |
| **Nền hover/active** | Slate | `#1E2A4A` | 30, 42, 74 | Trạng thái hover, active state |

### 2.2. Màu sản phẩm (Product Colors — Phản ánh màu nhựa PLA thực tế)

| Vai trò | Tên màu | Hex Code | RGB | Ứng dụng |
|---|---|---|---|---|
| **Cobalt Blue (Tấm nền)** | BlueMooon Blue | `#0047AB` | 0, 71, 171 | Màu chính đại diện thương hiệu, tấm nền giữa pegboard |
| **Crimson Red (Viền & phụ kiện)** | Accent Red | `#DC143C` | 220, 20, 60 | Viền pegboard, khay, hộp bút — màu nhấn mạnh |
| **Pure Black (Chân đế)** | Jet Black | `#0A0A0A` | 10, 10, 10 | Chân đế, phụ kiện đen |
| **Snow White (Phụ kiện trắng)** | Clean White | `#F5F5F5` | 245, 245, 245 | Kẹp giấy, phụ kiện trắng, text chính |

### 2.3. Màu nhấn công nghệ (Tech Accent Colors)

| Vai trò | Tên màu | Hex Code | RGB | Ứng dụng |
|---|---|---|---|---|
| **Neon Cyan (Điểm nhấn UI chính)** | Cyber Cyan | `#00F0FF` | 0, 240, 255 | Glow effect, border neon, CTA hover, icon highlight |
| **Electric Blue (Điểm nhấn UI phụ)** | Circuit Blue | `#0A84FF` | 10, 132, 255 | Link, button secondary, progress bar |
| **Neon Cyan mờ (Glow/Shadow)** | Cyan Glow | `#00F0FF33` | 0, 240, 255, 0.2 | Box-shadow glow, text-shadow, backdrop |

### 2.4. Màu chữ & Text (Typography Colors)

| Vai trò | Tên màu | Hex Code | Ứng dụng |
|---|---|---|---|
| **Text chính** | Pure White | `#FFFFFF` | Heading, text nổi bật |
| **Text phụ** | Silver Gray | `#B0B0B0` | Body text, description |
| **Text mờ** | Dim Gray | `#6B6B6B` | Caption, footnote, placeholder |
| **Text link** | Circuit Blue | `#0A84FF` | Hyperlink, interactive text |
| **Text CTA** | Void Black | `#0D0D0D` | Text trên nút CTA sáng |

### 2.5. Gradient đặc trưng

```css
/* Hero Section Gradient (từ trên xuống) */
--gradient-hero: linear-gradient(180deg, #0D0D0D 0%, #1A1A2E 50%, #16213E 100%);

/* Card Glow Gradient (border) */
--gradient-card-border: linear-gradient(135deg, #00F0FF 0%, #0047AB 50%, #DC143C 100%);

/* CTA Button Gradient */
--gradient-cta: linear-gradient(90deg, #0047AB 0%, #00F0FF 100%);

/* Product Spotlight Gradient (radial, phía sau sản phẩm) */
--gradient-spotlight: radial-gradient(circle at 50% 50%, #0047AB33 0%, transparent 70%);
```

### 2.6. Quy tắc sử dụng màu

Tỷ lệ phân bổ màu tuân theo quy tắc 60-30-10: Nền tối (60%), Cobalt Blue + White text (30%), Crimson Red + Neon Cyan (10%). Không bao giờ đặt Crimson Red trực tiếp lên nền Cobalt Blue vì tạo hiệu ứng rung mắt (chromatic vibration). Luôn dùng nền tối hoặc trắng làm lớp đệm giữa hai màu này. Neon Cyan chỉ dùng cho hiệu ứng glow, border, và trạng thái hover — KHÔNG dùng làm màu nền hoặc text chính (quá chói trên dark mode).

---

## 3. TYPOGRAPHY

### 3.1. Font chính — Heading & Display

**Font: [Outfit](https://fonts.google.com/specimen/Outfit)**

```
Font Family: 'Outfit', sans-serif
Weights sử dụng: 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
Vai trò: Tất cả heading (H1-H6), display text, hero title, CTA button text
Lý do chọn: Geometric sans-serif hiện đại, có chút tròn mềm mại nhưng vẫn tech,
             hỗ trợ tiếng Việt tốt (dấu), render đẹp trên dark mode
```

### 3.2. Font phụ — Body & UI

**Font: [Inter](https://fonts.google.com/specimen/Inter)**

```
Font Family: 'Inter', sans-serif
Weights sử dụng: 400 (Regular), 500 (Medium), 600 (SemiBold)
Vai trò: Body text, paragraph, navigation, form input, caption, footnote
Lý do chọn: Được thiết kế đặc biệt cho UI, x-height cao, dễ đọc ở mọi kích cỡ,
             kerning tối ưu cho màn hình, hỗ trợ tiếng Việt hoàn hảo
```

### 3.3. Font đặc biệt — Code/Tech Display (tùy chọn)

**Font: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)**

```
Font Family: 'JetBrains Mono', monospace
Weights sử dụng: 400 (Regular), 700 (Bold)
Vai trò: Hiển thị thông số kỹ thuật, mã sản phẩm, kích thước (24×24cm), 
         tạo cảm giác "tech spec" khi hiển thị thông tin sản phẩm
```

### 3.4. Bảng Type Scale (Desktop)

| Element | Font | Weight | Size | Line Height | Letter Spacing | Color |
|---|---|---|---|---|---|---|
| H1 (Hero Title) | Outfit | 800 | 56px / 3.5rem | 1.1 | -0.02em | `#FFFFFF` |
| H2 (Section Title) | Outfit | 700 | 40px / 2.5rem | 1.2 | -0.01em | `#FFFFFF` |
| H3 (Card Title) | Outfit | 600 | 28px / 1.75rem | 1.3 | 0 | `#FFFFFF` |
| H4 (Sub-heading) | Outfit | 600 | 22px / 1.375rem | 1.4 | 0 | `#F5F5F5` |
| Body Large | Inter | 400 | 18px / 1.125rem | 1.6 | 0 | `#B0B0B0` |
| Body Regular | Inter | 400 | 16px / 1rem | 1.6 | 0 | `#B0B0B0` |
| Body Small | Inter | 400 | 14px / 0.875rem | 1.5 | 0.01em | `#6B6B6B` |
| Caption | Inter | 500 | 12px / 0.75rem | 1.4 | 0.02em | `#6B6B6B` |
| Button/CTA | Outfit | 700 | 16px / 1rem | 1 | 0.05em | `#0D0D0D` |
| Nav Link | Inter | 500 | 15px / 0.9375rem | 1 | 0.01em | `#F5F5F5` |
| Tech Spec | JetBrains Mono | 400 | 14px / 0.875rem | 1.5 | 0 | `#00F0FF` |

### 3.5. Responsive Scale (Mobile)

Trên mobile (viewport < 768px), tất cả font size giảm theo hệ số 0.75×: H1 → 36px, H2 → 28px, H3 → 22px, Body → 15px. Line height tăng thêm 0.1 để dễ đọc hơn trên màn hình nhỏ.

---

## 4. UI/UX LAYOUT GUIDES CHO LANDING PAGE

### 4.1. Cấu trúc tổng thể Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Sticky, Glassmorphism)                              │
│  Logo | Nav: Sản phẩm | Câu chuyện | Bảng giá | FAQ         │
│  CTA: [💬 Chat Zalo] [🤖 AI Hỗ trợ]                         │
├─────────────────────────────────────────────────────────────┤
│  HERO SECTION (Full viewport height)                         │
│  ┌──────────────────────┬──────────────────────────┐        │
│  │  Text (40%)          │  3D Product Visual (60%)  │        │
│  │                      │                          │        │
│  │  "Hãy để cuộc sống   │  [Ảnh/Video 3D Pegboard  │        │
│  │   dễ dàng hơn"       │   floating trên nền tối   │        │
│  │                      │   với rim light cyan]     │        │
│  │  Subtitle nhỏ        │                          │        │
│  │                      │                          │        │
│  │  [CTA: Xem Sản Phẩm] │                          │        │
│  │  [CTA: Chat Ngay]    │                          │        │
│  │  └──────────────────────┴──────────────────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  SOCIAL PROOF BAR (Scrolling text)                           │
│  "Đã phục vụ XX+ bà con cô bác | ⭐⭐⭐⭐⭐ 5.0 đánh giá"      │
├─────────────────────────────────────────────────────────────┤
│  PAIN POINTS SECTION ("Nỗi đau" của bạn?)                   │
│  3 cards ngang (glassmorphism, icon + text):                 │
│  [Bàn bừa bộn] [Kệ nhàm chán] [Quà tặng khó tìm]          │
├─────────────────────────────────────────────────────────────┤
│  PRODUCT SHOWCASE (Interactive)                              │
│  ┌────────┬────────┬────────┐                               │
│  │ Gói    │ Gói    │ Gói    │                               │
│  │ 299k   │ 399k   │ 599k   │                               │
│  │ ★Star  │ ★★Pop  │★★★Pro  │                               │
│  │        │        │        │                               │
│  │ [Chi   │ [Chi   │ [Chi   │                               │
│  │ tiết]  │ tiết]  │ tiết]  │                               │
│  │ └────────┴────────┴────────┘                               │
│  Mỗi card: Ảnh sản phẩm 3D + danh sách bao gồm + CTA       │
├─────────────────────────────────────────────────────────────┤
│  HOW IT WORKS (Quy trình 4 bước)                             │
│  1. Chọn Gói → 2. Đặt Hàng → 3. In & Đóng Gói → 4. Nhận   │
│  (Timeline visual, icon animated)                            │
├─────────────────────────────────────────────────────────────┤
│  MODULAR EXPLAINER (Giải thích hệ Modular)                   │
│  Animation/Video: Tấm nền + viền + góc ghép lại → bảng      │
│  "Bắt đầu nhỏ, mở rộng không giới hạn"                      │
├─────────────────────────────────────────────────────────────┤
│  LIFESTYLE GALLERY (Ảnh phối cảnh)                           │
│  Grid masonry 2x3: Ảnh sản phẩm trên bàn làm việc thực tế   │
├─────────────────────────────────────────────────────────────┤
│  ABOUT / CÂU CHUYỆN (Về Ledainhan)                          │
│  "Solo Builder | Background Product | Hành trình maker"     │
│  (Không ảnh cá nhân, dùng icon/illustration thay thế)        │
├─────────────────────────────────────────────────────────────┤
│  FAQ (Accordion style)                                       │
│  6-8 câu hỏi phổ biến                                       │
├─────────────────────────────────────────────────────────────┤
│  SHIPPING & POLICIES (Bảng phí ship + chính sách)            │
├─────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
│  Logo | Social Links | Zalo | Copyright                      │
│  "BlueMooon's Studio © 2026 | Hãy để cuộc sống dễ dàng hơn" │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FLOATING CTA (Luôn hiển thị góc phải dưới)                  │
│  [💬 Chat Zalo]  ← Nổi bật nhất, màu #0047AB               │
│  [🤖 AI Chat]    ← Phụ, màu #1A1A2E border cyan             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Hướng dẫn thiết kế Header

Header sử dụng hiệu ứng **Glassmorphism** (backdrop-filter: blur(20px), background rgba(13,13,13,0.7), border-bottom 1px solid rgba(0,240,255,0.1)). Logo bên trái, navigation giữa (desktop) hoặc hamburger menu (mobile). Hai nút CTA bên phải: "Chat Zalo" (background #0047AB, text white, border-radius 8px) và "AI Hỗ trợ" (background transparent, border 1px solid #00F0FF, text #00F0FF).

Header sticky khi scroll, giảm chiều cao từ 80px xuống 60px với transition mượt.

### 4.3. Hướng dẫn thiết kế CTA nổi bật

**CTA chính — Chat Zalo:**

```css
.cta-zalo {
  background: linear-gradient(90deg, #0047AB 0%, #00F0FF 100%);
  color: #FFFFFF;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  border: none;
  box-shadow: 0 0 20px rgba(0, 71, 171, 0.4);
  transition: all 0.3s ease;
}
.cta-zalo:hover {
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.6);
  transform: translateY(-2px);
}
```

**CTA phụ — AI Hỗ trợ:**

```css
.cta-ai {
  background: transparent;
  color: #00F0FF;
  border: 1px solid rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}
.cta-ai:hover {
  border-color: #00F0FF;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}
```

**Floating CTA (góc phải dưới):**

* Nút Zalo: Hình tròn 56×56px, icon Zalo trắng trên nền gradient blue, box-shadow glow, pulse animation nhẹ mỗi 3 giây để thu hút chú ý.
* Nút AI: Hình tròn 48×48px, icon robot, nền tối, border cyan, nằm phía trên nút Zalo cách 12px.

### 4.4. Hướng dẫn thiết kế Product Card

Mỗi product card (gói 299k / 399k / 599k) có cấu trúc:

```
┌────────────────────────────┐
│ [Badge: "Phổ biến nhất"]   │  ← Chỉ gói 399k
│                            │
│     [Ảnh sản phẩm 3D]     │  ← Ratio 4:3, nền tối, rim light
│                            │
│ ─── Divider (gradient) ─── │
│                            │
│ TÊN GÓI (Outfit Bold)     │
│ GIÁ: 299.000₫             │  ← Font lớn, màu #00F0FF
│                            │
│ ✓ Bao gồm item 1          │
│ ✓ Bao gồm item 2          │  ← Inter Regular, màu #B0B0B0
│ ✓ Bao gồm item 3          │
│                            │
│ [    ĐẶT HÀNG NGAY    ]   │  ← CTA button full-width
│                            │
└────────────────────────────┘
```

Card background: `#1A1A2E`. Border: 1px solid `#16213E`. Border-radius: 16px. Hover: border chuyển thành gradient (#00F0FF → #0047AB → #DC143C), box-shadow glow.

Card gói 399k (recommended): Border mặc định đã là gradient, có badge "Phổ biến nhất" góc trên phải (background #DC143C, text white).

### 4.5. Spacing & Grid System

```
Max-width container: 1200px (desktop), 100% padding 20px (mobile)
Grid: 12 columns, gutter 24px (desktop), 16px (mobile)
Section padding: 120px top/bottom (desktop), 80px (mobile)
Card gap: 24px
Border-radius tiêu chuẩn: 8px (nhỏ), 12px (button), 16px (card), 24px (hero image)
```

---

## 5. AI PROMPT LIBRARY

### 5.1. Hướng dẫn chung khi sử dụng prompt

Tất cả prompt dưới đây được tối ưu cho **Midjourney v6+** và **Stable Diffusion XL (SDXL)**. Khi sử dụng với DALL-E 3, hãy chuyển đổi sang dạng mô tả tự nhiên (natural language).

Các quy ước chung:
* Mọi prompt đều sử dụng **dark background** mặc định.
* Sản phẩm pegboard luôn có phối màu **Cobalt Blue (tấm nền) + Crimson Red (viền/phụ kiện)**.
* Ánh sáng: **rim light neon cyan** + **key light trắng lạnh (5600K)** + **fill light xanh dương nhạt**.
* Camera: Thường là **Canon EOS R5** hoặc **Sony A7R IV** với **85mm f/1.4** cho product shot.

### 5.2. PROMPT 1 — Lifestyle Product Photography: Pegboard trên bàn làm việc

**Mục đích:** Ảnh hero chính cho website, ảnh bìa fanpage, ảnh đại diện sản phẩm.

```
/imagine prompt: A stunning product lifestyle photograph of a 3D-printed modular pegboard desk organizer (24x24cm) standing upright on a minimalist dark wood desk. The pegboard has a cobalt blue (#0047AB) center panel with crimson red (#DC143C) border frames and corner pieces. Accessories include: a red honeycomb mesh tray holding sticky notes, a small blue square tray with paper clips, black 3D-printed desk stand with quick-lock mechanism. The desk setup includes a matte black mechanical keyboard, a sleek wireless mouse, a small succulent plant, and a cup of coffee. Dark moody environment with dramatic cyan neon rim lighting from behind the pegboard creating a subtle glow effect. Main light source: warm desk lamp (3200K) from the upper left. Background: dark charcoal wall with subtle concrete texture. Shot on Canon EOS R5, 85mm f/1.4 lens, shallow depth of field, product in sharp focus. Color grading: deep blacks, lifted shadows with blue tone, high contrast. Photorealistic, editorial product photography, 8K resolution --ar 16:9 --v 6 --style raw --s 250
```

**Biến thể cho Stable Diffusion (SDXL):**
```
(masterpiece, best quality, photorealistic:1.4), product lifestyle photography, 3D-printed modular pegboard desk organizer 24x24cm, cobalt blue center panel, crimson red border frames, honeycomb mesh accessories, standing on minimalist dark wood desk, mechanical keyboard nearby, matte black mouse, small succulent, coffee cup, dark moody studio lighting, neon cyan rim light from behind, warm desk lamp 3200K upper left, dark charcoal concrete wall background, Canon EOS R5 85mm f1.4 shallow DOF, editorial product photo, deep blacks lifted blue shadows, 8K resolution, (dark mode aesthetic:1.3), (tech workspace:1.2)
Negative: bright background, white background, overexposed, blurry, cartoon, illustration, painting, low quality, watermark
```

### 5.3. PROMPT 2 — 3D Mockup: Tấm Pegboard 24×24cm góc nghiêng 45°

**Mục đích:** Ảnh sản phẩm 3D chi tiết cho trang sản phẩm, Shopee listing.

```
/imagine prompt: A detailed 3D product mockup of a modular pegboard desk organizer viewed at a 45-degree angle from the front-right. The pegboard measures 24x24cm and is composed of: one 16x16cm cobalt blue (#0047AB) center grid panel with evenly spaced circular holes (pegboard pattern), four 4x16cm crimson red (#DC143C) straight border pieces on each side, and four 4x4cm crimson red corner pieces. Two black 3D-printed stand feet with 90-degree quick-lock clips at the bottom. Accessories mounted on the board: one large red honeycomb mesh horizontal tray, one small blue square honeycomb tray. Visible 3D print layer texture (FDM) on the surface, showing quality PLA finish with matte appearance. The product is floating slightly above a reflective dark surface with subtle reflection below. Background: pure dark gradient from #0D0D0D to #1A1A2E. Lighting: three-point studio setup — key light white (5600K) from upper-left at 45°, fill light soft blue from right, rim light neon cyan (#00F0FF) from directly behind creating edge glow. Clean, professional product rendering, no props, isolated product. 8K, photorealistic --ar 4:3 --v 6 --style raw --s 200
```

### 5.4. PROMPT 3 — Macro Close-up: Bề mặt in 3D PLA Lite

**Mục đích:** Ảnh chi tiết chất liệu, dùng cho section "Chất lượng in" trên website, story Instagram.

```
/imagine prompt: An extreme macro close-up photograph of a 3D-printed surface made from PLA Lite filament using FDM technology. The shot shows the smooth, matte-textured layer lines of a cobalt blue PLA panel transitioning to a crimson red border piece where they connect via a snap-fit joint mechanism. The layer height is 0.16mm, creating fine parallel lines that catch the light beautifully. Shallow depth of field with only the center of the frame in sharp focus, creating a beautiful bokeh effect in the foreground and background. Lighting: soft diffused light from above-left revealing the subtle surface texture, with a hint of neon cyan backlight creating a thin glowing edge along the top of the print layers. Dark background (#0D0D0D). Shot on Sony A7R IV with Sony FE 90mm f/2.8 Macro lens at 1:1 magnification. The image conveys precision, quality craftsmanship, and modern technology. Ultra-detailed, photorealistic, 8K resolution --ar 1:1 --v 6 --style raw --s 300
```

### 5.5. PROMPT 4 — Social Media Banner: Cyberpunk/Minimalist Tech Style

**Mục đích:** Banner Facebook/Instagram quảng cáo, TikTok thumbnail, banner Shopee.

```
/imagine prompt: A wide cinematic banner design for social media featuring a 3D-printed modular pegboard desk organizer as the hero product, positioned on the right side of the frame at a dramatic low angle. The pegboard glows with cobalt blue and crimson red colors against an ultra-dark background. Futuristic cyberpunk-inspired environment: subtle holographic grid lines on the floor, floating geometric particles, thin neon cyan light streaks in the air. The left side of the frame has clean negative space for text overlay. A soft volumetric fog adds depth and atmosphere. The overall mood is mysterious, premium, and technological — like a product launch from a high-end tech brand. Color palette: deep black (#0D0D0D), cobalt blue (#0047AB), crimson red (#DC143C), neon cyan (#00F0FF) accents. Cinematic lighting with dramatic shadows. Ultra-wide composition, photorealistic with subtle CGI enhancement, 8K --ar 21:9 --v 6 --style raw --s 350
```

**Biến thể 16:9 cho Facebook Cover:**
```
[Sử dụng prompt trên, thay --ar 21:9 thành --ar 16:9]
```

**Biến thể 9:16 cho Instagram Story / TikTok:**
```
/imagine prompt: A vertical social media story design featuring a 3D-printed modular pegboard organizer centered in the frame, shot from slightly above looking down at 30 degrees. The pegboard with cobalt blue center and crimson red border sits on a dark matte desk surface. Neon cyan light strips frame the edges of the composition. Minimalist tech aesthetic, dark background with subtle particle effects. Space at top and bottom for text overlay (brand name and CTA). Moody, premium, futuristic atmosphere. Vertical composition --ar 9:16 --v 6 --style raw --s 250
```

### 5.6. PROMPT 5 — Modular Explainer: Các tấm ghép rời (Exploded View)

**Mục đích:** Ảnh giải thích cơ chế modular, dùng cho section "How It Works" trên website.

```
/imagine prompt: A technical exploded view illustration of a modular pegboard system floating in dark space. The components are separated and arranged in an organized floating pattern showing how they assemble together: one large 16x16cm cobalt blue center panel with pegboard holes hovering in the center, four crimson red 4x16cm straight border pieces floating outward from each side with visible snap-fit connectors, four crimson red 4x4cm corner pieces floating at each corner, two black stand feet with 90-degree quick-lock mechanisms below. Thin neon cyan (#00F0FF) dashed guide lines connect each piece showing the assembly direction with small arrows. All pieces have visible 3D-printed matte PLA texture. Dark void background (#0D0D0D) with subtle blue gradient glow behind the center panel. Clean isometric view, technical yet artistic, product design rendering, 8K resolution --ar 16:9 --v 6 --style raw --s 200
```

### 5.7. PROMPT 6 — Packaging/Unboxing: Hộp sản phẩm & trải nghiệm mở hộp

**Mục đích:** Ảnh bao bì, ảnh unboxing cho content marketing.

```
/imagine prompt: A premium unboxing experience photograph of a 3D-printed modular pegboard kit. A matte black cardboard box with minimal branding (a simple crescent moon logo in cobalt blue and the text "BlueMooon's Studio" in clean white Outfit font) is partially opened, revealing the neatly arranged components inside: a cobalt blue pegboard panel wrapped in thin tissue paper, crimson red border pieces lined up in a row, black stand feet secured with a small elastic band, and accessories in a small cloth pouch. The box sits on a dark wooden surface. Soft overhead lighting creates gentle shadows. A hand (wearing a dark sleeve) is lifting the lid. The atmosphere is clean, satisfying, and premium — like opening an Apple product but for desk organization. Dark, moody environment, shallow depth of field focused on the product reveal. Shot on Canon EOS R5, 50mm f/1.2 --ar 4:5 --v 6 --style raw --s 200
```

### 5.8. PROMPT 7 — Workspace Comparison: Trước & Sau (Before/After)

**Mục đích:** Content marketing so sánh, ads Facebook/TikTok.

```
/imagine prompt: A dramatic split-screen comparison photograph. LEFT SIDE (Before): A cluttered, messy desk from above — pens scattered everywhere, tangled cables, sticky notes falling off the edge, a phone buried under papers, poor warm yellowish lighting creating an unpleasant atmosphere, slightly desaturated and chaotic. RIGHT SIDE (After): The same desk completely transformed — clean surface, a beautiful cobalt blue and crimson red 3D-printed modular pegboard standing neatly at the back of the desk with all accessories organized (pens in holder, notes on clip, phone on stand), cool balanced lighting with a touch of neon cyan ambient glow, clean and satisfying composition. A thin white vertical dividing line separates the two halves. The right side is noticeably more vibrant and appealing. Dark desk surface, overhead view at 30 degrees. Photorealistic, editorial quality --ar 16:9 --v 6 --style raw --s 250
```

---

## 6. PHOTOGRAPHY & CONTENT GUIDELINES

### 6.1. Quy tắc chụp ảnh sản phẩm thực tế

Khi chụp sản phẩm thực tế (không dùng AI generate), tuân theo các quy tắc sau:

* **Ánh sáng:** Ưu tiên 2-3 nguồn sáng: key light LED 5600K (daylight) từ góc trên-trái 45°, fill light nhẹ từ phải, và 1 dải LED neon cyan đặt phía sau sản phẩm tạo rim light. Tránh flash trực tiếp.
* **Nền chụp:** Tấm nền đen nhung (black velvet) hoặc giấy nền xám than đen. Tuyệt đối không nền trắng hoặc nền bàn gỗ sáng.
* **Góc chụp tiêu chuẩn cho mỗi sản phẩm:**
  * Góc 1 (Hero 45°): Chụp nghiêng 45° từ phía trước-phải, cao hơn sản phẩm ~30°.
  * Góc 2 (Front): Chụp thẳng chính diện.
  * Góc 3 (Top-down): Chụp từ trên xuống, sản phẩm nằm trên nền tối.
  * Góc 4 (Detail): Macro cận cảnh khớp nối, bề mặt in, chốt khóa.
  * Góc 5 (Lifestyle): Đặt trên bàn làm việc thực tế có đồ dùng.
* **Post-processing:** Tăng contrast, giảm highlights, nâng shadows nhẹ (lifted shadows), thêm blue tone vào shadows, giảm saturation tổng thể trừ cobalt blue và crimson red (chọn lọc).

### 6.2. Quy tắc nội dung video

* **Timelapse in 3D:** Quay bằng GoPro hoặc smartphone trên tripod, cố định góc nhìn vào máy in suốt quá trình in 1 chi tiết. Speed up x60-x120. Overlay nhạc lo-fi hoặc ambient tech. Thêm text overlay: tên chi tiết, thời gian in, vật liệu.
* **Unboxing / Assembly:** Quay tay mở hộp, lắp ráp từng chi tiết. Tốc độ thực, cắt ghép nhịp nhàng. Giọng voiceover hài hước theo giọng điệu thương hiệu.
* **Before/After desk setup:** Quay desk bừa bộn → transition effect → desk gọn gàng với pegboard. Dạng reel/short 15-30 giây.

---

## 7. PACKAGING DESIGN GUIDELINES

### 7.1. Hộp đóng gói

* **Chất liệu:** Hộp carton 3 lớp, bề mặt kraft tự nhiên hoặc in đen matte.
* **Kích thước:**
  * Gói 299k & 399k: 28 × 28 × 6 cm.
  * Gói 599k: 44 × 28 × 8 cm.
* **In ấn trên hộp:**
  * Mặt trên: Logo BlueMooon's Studio (cobalt blue + white trên nền kraft/đen). Slogan "Hãy để cuộc sống dễ dàng hơn" nhỏ phía dưới logo.
  * Mặt bên: QR code link đến hướng dẫn lắp ráp (video YouTube hoặc website).
  * Mặt dưới: Thông tin sản phẩm (tên gói, danh sách bao gồm, thông số).

### 7.2. Bên trong hộp

* **Lớp trên:** Card cảm ơn (thiết kế tối, chữ trắng + cyan, kích thước name card 90×55mm). Mặt trước: "Cảm ơn bà con cô bác!" + logo. Mặt sau: QR code Zalo + QR code review Google.
* **Bọt khí/xốp lót:** Lót 1 lớp xốp mỏng phía trên và dưới, giữ sản phẩm không va đập.
* **Sắp xếp:** Tấm nền giữa nằm phẳng ở đáy, viền + góc xếp xung quanh, phụ kiện + chân đế trong túi zip nhỏ.

### 7.3. Sticker & Phụ kiện nhỏ

* **Sticker logo tròn (đường kính 35mm):** Dán seal hộp, khách có thể dán trang trí laptop/bình nước.
* **Tờ hướng dẫn lắp ráp:** Giấy A5, 1 mặt, in ảnh minh họa các bước ghép module + cắm phụ kiện. Tông tối, chữ trắng, icon minh họa.

---

## PHỤ LỤC: CSS VARIABLES TỔNG HỢP

```css
:root {
  /* ===== BACKGROUNDS ===== */
  --bg-primary: #0D0D0D;
  --bg-secondary: #1A1A2E;
  --bg-tertiary: #16213E;
  --bg-hover: #1E2A4A;

  /* ===== PRODUCT COLORS ===== */
  --color-blue: #0047AB;       /* Cobalt Blue - Tấm nền */
  --color-red: #DC143C;        /* Crimson Red - Viền & Phụ kiện */
  --color-black: #0A0A0A;      /* Jet Black - Chân đế */
  --color-white: #F5F5F5;      /* Snow White - Phụ kiện trắng */

  /* ===== TECH ACCENTS ===== */
  --accent-cyan: #00F0FF;      /* Neon Cyan - UI highlight */
  --accent-blue: #0A84FF;      /* Electric Blue - Links */
  --accent-cyan-glow: rgba(0, 240, 255, 0.2);

  /* ===== TEXT ===== */
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-muted: #6B6B6B;
  --text-link: #0A84FF;
  --text-cta: #0D0D0D;

  /* ===== TYPOGRAPHY ===== */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* ===== GRADIENTS ===== */
  --gradient-hero: linear-gradient(180deg, #0D0D0D 0%, #1A1A2E 50%, #16213E 100%);
  --gradient-card-border: linear-gradient(135deg, #00F0FF 0%, #0047AB 50%, #DC143C 100%);
  --gradient-cta: linear-gradient(90deg, #0047AB 0%, #00F0FF 100%);
  --gradient-spotlight: radial-gradient(circle at 50% 50%, rgba(0,71,171,0.2) 0%, transparent 70%);

  /* ===== SPACING ===== */
  --container-max: 1200px;
  --section-padding: 120px;
  --section-padding-mobile: 80px;
  --card-gap: 24px;
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;

  /* ===== SHADOWS ===== */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-cta-glow: 0 0 20px rgba(0, 71, 171, 0.4), 0 0 40px rgba(0, 71, 171, 0.2);
  --shadow-cyan-glow: 0 0 15px rgba(0, 240, 255, 0.3);
}
```

---

_Tài liệu này được tạo cho dự án in3D.help — BlueMooon's Studio._
_Phiên bản 1.0 | Cập nhật: 2026-07-28_
_Mọi ấn phẩm thiết kế, ảnh sản phẩm, banner marketing, và UI website phải tuân theo hướng dẫn trong tài liệu này để đảm bảo tính nhất quán thương hiệu (brand consistency)._
