

Tôi sẽ phân tích template mẫu của Open Design trước, sau đó xây dựng toàn bộ Landing Page cho bạn.Tôi cần lấy nội dung CSS thực tế. Hãy thử cách khác.Tôi đã thu thập đủ thông tin về phong cách Atelier Zero. Giờ tôi sẽ lấy phần CSS còn lại.Tôi đã thu thập đủ thông tin về phong cách Atelier Zero CSS gốc. Giờ tôi sẽ xây dựng toàn bộ Landing Page cho bạn.

Dưới đây là bản thiết kế hoàn chỉnh với cấu trúc dự án Astro + CSS thuần, kết hợp phong cách editorial magazine của Atelier Zero với hệ thống Dark Tech của in3D.help.

---

# IN3D.HELP — Landing Page: Astro + CSS thuần

## 1. Cấu trúc dự án

```
src/
├── layouts/
│   └── Layout.astro
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   ├── SocialProofBar.astro
│   ├── PainPoints.astro
│   ├── ProductShowcase.astro
│   ├── HowItWorks.astro
│   ├── ModularExplainer.astro
│   ├── LifestyleGallery.astro
│   ├── About.astro
│   ├── FAQ.astro
│   ├── Footer.astro
│   └── FloatingCTA.astro
├── styles/
│   └── global.css
├── scripts/
│   └── main.js
└── pages/
    └── index.astro
```

---

## 2. `src/styles/global.css` — Toàn bộ hệ thống thiết kế

```css
/*
 * in3D.help — Dark Tech Editorial Landing Page
 *
 * Phong cách: Atelier Zero editorial collage, ĐÃ CHUYỂN SANG Dark Tech palette.
 * Giữ nguyên: hairline rules, Roman-numeral section markers, asymmetric grids,
 * scroll-reveal, Headroom sticky nav, editorial annotations.
 * Thay đổi: paper → void black, coral → crimson/neon cyan, serif → Outfit display.
 */

/* =========================================================
   FONTS
   ========================================================= */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* =========================================================
   DESIGN TOKENS (in3D.help DESIGN.MD)
   ========================================================= */
:root {
  /* — Backgrounds — */
  --void:           #0D0D0D;
  --charcoal:       #1A1A2E;
  --gunmetal:       #16213E;

  /* — Brand Colors — */
  --cobalt:         #0047AB;
  --crimson:        #DC143C;
  --cyan:           #00F0FF;

  /* — Derived / Utility — */
  --cyan-dim:       rgba(0, 240, 255, 0.15);
  --cyan-glow:      rgba(0, 240, 255, 0.35);
  --crimson-dim:    rgba(220, 20, 60, 0.15);
  --crimson-glow:   rgba(220, 20, 60, 0.4);
  --cobalt-dim:     rgba(0, 71, 171, 0.25);
  --cobalt-glow:    rgba(0, 71, 171, 0.5);

  /* — Text — */
  --text-primary:   #F0F0F0;
  --text-secondary: #B0B0C0;
  --text-muted:     #6B6B80;
  --text-faint:     #3E3E52;

  /* — Lines — */
  --line:           rgba(240, 240, 240, 0.12);
  --line-soft:      rgba(240, 240, 240, 0.06);
  --line-cyan:      rgba(0, 240, 255, 0.2);

  /* — Shadows — */
  --shadow-card:    0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow:    0 0 30px rgba(0, 240, 255, 0.1);

  /* — Glass — */
  --glass-bg:       rgba(26, 26, 46, 0.6);
  --glass-border:   rgba(240, 240, 240, 0.08);
  --glass-blur:     16px;

  /* — Typography Stacks — */
  --heading:  'Outfit', -apple-system, system-ui, sans-serif;
  --body:     'Inter', -apple-system, system-ui, sans-serif;
  --mono:     'JetBrains Mono', 'SF Mono', Menlo, monospace;

  /* — Spacing — */
  --container:      1360px;
  --section-pad:    130px;
  --section-pad-sm: 80px;

  /* — Transitions — */
  --ease:     cubic-bezier(0.22, 0.61, 0.36, 1);
  --duration: 0.2s;
}

/* =========================================================
   RESET & BASE
   ========================================================= */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--void);
  overflow-x: hidden;
  position: relative;
}

/* =========================================================
   TECH NOISE OVERLAY (Atelier Zero texture → adapted to dark)
   — SVG fractal noise tiled at low opacity,
   — Two soft radial glow spots for "ambient tech" feel
   ========================================================= */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background-image:
    radial-gradient(ellipse at 15% 20%, rgba(0, 71, 171, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 75%, rgba(0, 240, 255, 0.04) 0%, transparent 45%),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.06  0 0 0 0 0.08  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size: auto, auto, 200px 200px;
  mix-blend-mode: screen;
  opacity: 0.7;
}

/* =========================================================
   SHELL & CONTAINER
   ========================================================= */
.shell { position: relative; z-index: 2; }

.container {
  max-width: var(--container);
  padding: 0 64px;
  margin: 0 auto;
  position: relative;
}

/* =========================================================
   SIDE RAILS (editorial vertical text strips)
   — Fixed on left & right edges, hairline border, rotated label
   ========================================================= */
.side-rail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 36px;
  z-index: 3;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.side-rail.left  { left: 0;  border-right: 1px solid var(--line-soft); }
.side-rail.right { right: 0; border-left:  1px solid var(--line-soft); }

.side-rail .rail-text {
  font-family: var(--heading);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: var(--text-faint);
  writing-mode: vertical-rl;
  white-space: nowrap;
}
.side-rail.right .rail-text { transform: rotate(180deg); }

/* =========================================================
   TOP METADATA STRIP (editorial volume/issue bar)
   ========================================================= */
.topbar {
  border-bottom: 1px solid var(--line);
  padding: 10px 0;
  background: var(--void);
  position: relative;
  z-index: 4;
}

.topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  font-family: var(--heading);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.topbar-inner b      { color: var(--text-secondary); font-weight: 600; }
.topbar-inner .cyan   { color: var(--cyan); }
.topbar-inner .mid    { display: inline-flex; gap: 26px; }
.topbar-inner .right  { display: inline-flex; gap: 18px; align-items: center; }

.topbar .pulse {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--cyan);
  display: inline-block;
  margin-right: 6px;
  animation: pulse 2.4s ease-in-out infinite;
}

/* =========================================================
   GLASSMORPHISM HEADER / NAV (Headroom-style)
   — Always sticky, slides up when scrolling down, back on scroll-up
   — Glassmorphism: backdrop-blur + semi-transparent bg
   ========================================================= */
.nav {
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13, 13, 13, 0.75);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-bottom: 1px solid var(--line);
  transform: translateY(0);
  transition:
    transform 360ms var(--ease),
    box-shadow 220ms ease,
    border-color 220ms ease;
  will-change: transform;
}
.nav.is-scrolled {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  border-bottom-color: var(--line-cyan);
}
.nav.is-hidden {
  transform: translateY(-100%);
  pointer-events: none;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  flex-shrink: 0;
}
.brand-mark {
  width: 40px; height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--cyan);
  border-radius: 50%;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--cyan);
  background: transparent;
  box-shadow: 0 0 12px var(--cyan-dim);
}
.brand-name {
  font-family: var(--heading);
  font-weight: 800;
  font-size: 20px;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.brand-name .dot { color: var(--cyan); }

.nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
}
.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-family: var(--heading);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color var(--duration) ease;
  position: relative;
}
.nav-links a:hover { color: var(--cyan); }
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--cyan);
  transition: width 0.3s var(--ease);
}
.nav-links a:hover::after { width: 100%; }

.nav-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

/* =========================================================
   BUTTONS
   ========================================================= */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 999px;
  font-family: var(--heading);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--duration) ease;
}

/* CTA Zalo — gradient blue→cyan */
.btn-zalo {
  background: linear-gradient(135deg, var(--cobalt), #0066CC, var(--cyan));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 20px var(--cobalt-glow);
}
.btn-zalo:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px var(--cobalt-glow), 0 0 20px var(--cyan-dim);
}

/* CTA AI — viền cyan, nền transparent */
.btn-ai {
  background: transparent;
  color: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 12px var(--cyan-dim);
}
.btn-ai:hover {
  background: var(--cyan-dim);
  transform: translateY(-2px);
  box-shadow: 0 0 24px var(--cyan-glow);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--line);
}
.btn-ghost:hover {
  border-color: var(--cyan);
  color: var(--cyan);
}

/* =========================================================
   TYPOGRAPHY PRIMITIVES
   ========================================================= */
.label {
  font-family: var(--heading);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--cyan);
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.label::before {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--cyan);
  display: inline-block;
}

.display {
  font-family: var(--heading);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1.05;
}
/* "em" inside display = italic emphasis with crimson color pop */
.display em {
  font-style: italic;
  color: var(--crimson);
}
.display .dot { color: var(--cyan); }

.lead {
  font-family: var(--body);
  font-size: 17px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 48ch;
}

.meta {
  font-family: var(--heading);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.coord {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--text-faint);
}

.price {
  font-family: var(--mono);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--cyan);
}

.roman {
  font-family: var(--heading);
  font-style: italic;
  font-weight: 500;
  color: var(--cyan);
}

/* =========================================================
   SECTION COMMON
   ========================================================= */
section {
  position: relative;
  padding: var(--section-pad) 0;
}
section.tight { padding: 90px 0; }

/* Editorial section rule: [Roman] ——— [meta] ——— [page] */
.sec-rule {
  border-top: 1px solid var(--line);
  padding-top: 18px;
  margin-bottom: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--heading);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.sec-rule .roman {
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: none;
}
.sec-rule .meta-grp { display: inline-flex; gap: 26px; }

.section-header { margin-bottom: 70px; }
.section-header .label { margin-bottom: 28px; }
.section-header h2 {
  font-size: clamp(38px, 4.5vw, 64px);
  max-width: 20ch;
}
.section-header .lead { margin-top: 18px; }

/* =========================================================
   GLASSMORPHISM CARD
   ========================================================= */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: transform var(--duration) ease, border-color var(--duration) ease;
}
.glass-card:hover {
  transform: translateY(-4px);
  border-color: var(--line-cyan);
}

/* Subtle inner glow on hover */
.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(ellipse at 50% 0%, var(--cyan-dim) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.glass-card:hover::before { opacity: 1; }

/* =========================================================
   ============================
    S E C T I O N S
   ============================
   ========================================================= */

/* ——————————————————————————
   I. HERO
   40% text left / 60% visual right
   —————————————————————————— */
.hero {
  position: relative;
  padding: 0;
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--line);
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.4fr) minmax(0, 0.6fr);
  gap: 48px;
  align-items: center;
  flex: 1;
  width: 100%;
}

.hero-copy {
  padding: 6vh 0;
  display: flex;
  flex-direction: column;
}
.hero-copy .label { margin-bottom: 24px; }
.hero-copy h1 {
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1.05;
  margin-bottom: 24px;
}
.hero-copy .lead {
  margin-bottom: 32px;
  max-width: 40ch;
}

.hero-actions {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.hero-stats .stat {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.hero-stats .stat .ring {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px dashed var(--text-faint);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}
.hero-stats .stat .ring.cyan {
  border-color: var(--cyan);
  color: var(--cyan);
  border-style: solid;
  box-shadow: 0 0 10px var(--cyan-dim);
}
.hero-stats .stat-label {
  font-family: var(--heading);
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.hero-stats .stat-label b {
  display: block;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 12px;
}

/* Hero art / pegboard visual with spotlight */
.hero-art {
  position: relative;
  height: calc(100vh - 160px);
  max-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-art img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  position: relative;
  z-index: 2;
}

/* Spotlight glow behind pegboard */
.hero-art::before {
  content: '';
  position: absolute;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  background: radial-gradient(ellipse, var(--cobalt-glow) 0%, transparent 70%);
  filter: blur(60px);
  z-index: 1;
}

/* Corner brackets (Atelier Zero annotation style) */
.corner {
  position: absolute;
  width: 24px; height: 24px;
  border-color: var(--cyan);
  border-style: solid;
  border-width: 0;
  opacity: 0.4;
  z-index: 3;
}
.corner.tl { top: 0; left: 0; border-top-width: 1px; border-left-width: 1px; }
.corner.tr { top: 0; right: 0; border-top-width: 1px; border-right-width: 1px; }
.corner.bl { bottom: 0; left: 0; border-bottom-width: 1px; border-left-width: 1px; }
.corner.br { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; }

/* Annotation labels on hero image */
.annot {
  position: absolute;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--text-faint);
  white-space: nowrap;
  z-index: 3;
}
.annot-tl { top: 8px; left: 8px; }
.annot-tr { top: 8px; right: 8px; text-align: right; }
.annot-bl { bottom: 8px; left: 8px; }
.annot-br { bottom: 8px; right: 8px; text-align: right; }

/* ——————————————————————————
   II. SOCIAL PROOF BAR (Ticker / Marquee)
   —————————————————————————— */
.social-proof {
  border-bottom: 1px solid var(--line);
  padding: 20px 0;
  overflow: hidden;
  background: var(--charcoal);
}

.marquee-wrapper {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
}

.marquee-track {
  display: inline-flex;
  align-items: center;
  gap: 48px;
  width: max-content;
  white-space: nowrap;
  animation: marquee-x 40s linear infinite;
  will-change: transform;
}
.marquee-track:hover { animation-play-state: paused; }

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--heading);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.marquee-item .dot {
  color: var(--cyan);
  font-size: 8px;
}
.marquee-item .highlight {
  color: var(--cyan);
}

/* ——————————————————————————
   III. PAIN POINTS — 3 Glass Cards
   —————————————————————————— */
.pain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.pain-card { text-align: center; }
.pain-card .icon-wrap {
  width: 64px; height: 64px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: var(--crimson-dim);
  border: 1px solid rgba(220, 20, 60, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.pain-card h3 {
  font-family: var(--heading);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
}
.pain-card p {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ——————————————————————————
   IV. PRODUCT SHOWCASE — 3 Pricing Cards
   —————————————————————————— */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}

.product-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform var(--duration) ease, border-color var(--duration) ease;
}
.product-card:hover {
  transform: translateY(-6px);
}

/* Recommended card — gradient border */
.product-card.recommended {
  border: none;
  background:
    linear-gradient(var(--charcoal), var(--charcoal)) padding-box,
    linear-gradient(135deg, var(--cobalt), var(--cyan), var(--cobalt)) border-box;
  border: 2px solid transparent;
  box-shadow: 0 0 40px var(--cyan-dim), var(--shadow-card);
}
.product-card.recommended::after {
  content: 'RECOMMENDED';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: linear-gradient(135deg, var(--cobalt), var(--cyan));
  color: #fff;
  font-family: var(--heading);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  padding: 6px 20px;
  border-radius: 999px;
}

.product-card .product-name {
  font-family: var(--heading);
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.product-card .product-price {
  font-family: var(--mono);
  font-size: 42px;
  font-weight: 700;
  color: var(--cyan);
  margin-bottom: 4px;
  line-height: 1;
}
.product-card .product-price .currency {
  font-size: 18px;
  color: var(--text-muted);
  vertical-align: super;
}

.product-card .product-desc {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 28px;
  line-height: 1.5;
}

.product-card .feature-list {
  list-style: none;
  margin-bottom: 32px;
  flex: 1;
}
.product-card .feature-list li {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-secondary);
  padding: 8px 0;
  border-bottom: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  gap: 10px;
}
.product-card .feature-list li::before {
  content: '✓';
  color: var(--cyan);
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.product-card .spec {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.02em;
}

/* ——————————————————————————
   V. HOW IT WORKS — Timeline 4 Steps
   (Atelier Zero method grid adapted to dark)
   —————————————————————————— */
.timeline-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
  position: relative;
}

/* Horizontal connecting hairline */
.timeline-grid::before {
  content: '';
  position: absolute;
  top: 48px;
  left: 60px;
  right: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--line-cyan), var(--line-cyan), transparent);
}

.timeline-step {
  position: relative;
  text-align: center;
}

.timeline-step .step-num {
  width: 72px; height: 72px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: var(--charcoal);
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 24px;
  font-weight: 700;
  color: var(--cyan);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}
.timeline-step:hover .step-num {
  border-color: var(--cyan);
  box-shadow: 0 0 24px var(--cyan-dim);
}

.timeline-step .step-icon {
  font-size: 28px;
  margin-bottom: 16px;
}

.timeline-step h4 {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.timeline-step p {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 22ch;
  margin: 0 auto;
}

/* ——————————————————————————
   VI. MODULAR EXPLAINER
   —————————————————————————— */
.modular-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.modular-visual {
  position: relative;
  aspect-ratio: 1 / 1;
  max-width: 560px;
}
.modular-visual img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Glow ring behind the modular image */
.modular-visual::before {
  content: '';
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--cobalt-dim) 0%, transparent 70%);
  filter: blur(40px);
  z-index: -1;
}

.modular-copy h2 {
  font-size: clamp(36px, 4vw, 56px);
  margin-bottom: 24px;
}
.modular-copy .lead { margin-bottom: 28px; }

.module-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.module-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--glass-bg);
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  transition: border-color var(--duration) ease;
}
.module-item:hover { border-color: var(--cyan); }
.module-item .mod-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: var(--cobalt-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.module-item h4 {
  font-family: var(--heading);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}
.module-item p {
  font-family: var(--body);
  font-size: 13px;
  color: var(--text-muted);
}

/* ——————————————————————————
   VII. LIFESTYLE GALLERY — Masonry Grid
   —————————————————————————— */
.masonry {
  columns: 3;
  column-gap: 20px;
}
.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.masonry-item img {
  width: 100%;
  display: block;
  transition: transform 0.4s var(--ease);
}
.masonry-item:hover img {
  transform: scale(1.04);
}
/* Overlay caption */
.masonry-item .caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px 16px;
  background: linear-gradient(transparent, rgba(13, 13, 13, 0.85));
  color: var(--text-primary);
  font-family: var(--heading);
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
}
.masonry-item:hover .caption {
  opacity: 1;
  transform: translateY(0);
}
.masonry-item .caption .tag {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--cyan);
  display: block;
  margin-bottom: 4px;
}

/* ——————————————————————————
   VIII. ABOUT (Ledainhan)
   —————————————————————————— */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 80px;
  align-items: center;
}
.about-art {
  position: relative;
  aspect-ratio: 3 / 4;
  max-width: 480px;
  border-radius: 20px;
  overflow: hidden;
}
.about-art img {
  width: 100%; height: 100%;
  object-fit: cover;
}
/* Tech annotation overlays */
.about-art .overlay-tag {
  position: absolute;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--cyan);
  opacity: 0.6;
}
.about-art .overlay-tag.top    { top: 12px; left: 12px; }
.about-art .overlay-tag.bottom { bottom: 12px; right: 12px; }

.about-copy .label { margin-bottom: 24px; }
.about-copy h2 {
  font-size: clamp(36px, 4.5vw, 60px);
  margin-bottom: 24px;
}
.about-copy .lead { margin-bottom: 24px; max-width: 44ch; }
.about-copy .bio {
  font-family: var(--body);
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 32px;
}
.about-copy .maker-sig {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.maker-sig .avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 2px solid var(--cyan);
  object-fit: cover;
}
.maker-sig .sig-text {
  font-family: var(--heading);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}
.maker-sig .sig-text span {
  display: block;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
  font-weight: 400;
}

/* ——————————————————————————
   IX. FAQ — Accordion
   —————————————————————————— */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.faq-item {
  border-bottom: 1px solid var(--line);
}
.faq-question {
  width: 100%;
  background: none;
  border: none;
  padding: 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  font-family: var(--heading);
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  transition: color var(--duration) ease;
}
.faq-question:hover { color: var(--cyan); }
.faq-question .chevron {
  width: 24px; height: 24px;
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.3s var(--ease);
}
.faq-item.active .faq-question .chevron {
  transform: rotate(180deg);
  color: var(--cyan);
}
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s var(--ease), padding 0.3s ease;
}
.faq-item.active .faq-answer {
  max-height: 300px;
  padding-bottom: 24px;
}
.faq-answer p {
  font-family: var(--body);
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
}

/* ——————————————————————————
   X. FOOTER
   —————————————————————————— */
.footer {
  background: var(--gunmetal);
  padding: 80px 0 40px;
  border-top: 1px solid var(--line);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 48px;
  margin-bottom: 60px;
}
.footer-brand .brand-name {
  font-size: 28px;
  margin-bottom: 16px;
}
.footer-brand .footer-desc {
  font-family: var(--body);
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 32ch;
  margin-bottom: 20px;
}
.footer-col h4 {
  font-family: var(--heading);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 20px;
}
.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul a {
  color: var(--text-muted);
  text-decoration: none;
  font-family: var(--body);
  font-size: 14px;
  transition: color var(--duration) ease;
}
.footer-col ul a:hover { color: var(--cyan); }

/* Giant kicker word (Atelier Zero mega-footer) */
.footer-mega {
  font-family: var(--heading);
  font-weight: 900;
  font-size: clamp(60px, 12vw, 180px);
  letter-spacing: -0.04em;
  color: rgba(240, 240, 240, 0.04);
  line-height: 1;
  margin-bottom: 32px;
  text-align: center;
  user-select: none;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
}
.footer-bottom a { color: var(--text-muted); text-decoration: none; }
.footer-bottom a:hover { color: var(--cyan); }

/* ——————————————————————————
   FLOATING CTA
   —————————————————————————— */
.floating-cta {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-end;
}

.fab {
  width: 56px; height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.fab:hover {
  transform: scale(1.1);
}

.fab-zalo {
  background: linear-gradient(135deg, var(--cobalt), var(--cyan));
  box-shadow: 0 4px 20px var(--cobalt-glow);
}
.fab-zalo:hover {
  box-shadow: 0 8px 30px var(--cobalt-glow), 0 0 20px var(--cyan-dim);
}

.fab-ai {
  background: var(--charcoal);
  border: 1.5px solid var(--cyan);
  box-shadow: 0 0 16px var(--cyan-dim);
}
.fab-ai:hover {
  box-shadow: 0 0 28px var(--cyan-glow);
}

/* Pulse ring on FABs */
.fab::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--cyan);
  opacity: 0;
  animation: fab-pulse 3s ease-in-out infinite;
}
@keyframes fab-pulse {
  0%, 100% { opacity: 0; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.15); }
}

/* =========================================================
   KEYFRAMES
   ========================================================= */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@keyframes marquee-x {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes glow-border {
  0%, 100% {
    box-shadow: 0 0 10px var(--cyan-dim), inset 0 0 10px var(--cyan-dim);
  }
  50% {
    box-shadow: 0 0 25px var(--cyan-glow), inset 0 0 15px var(--cyan-dim);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* =========================================================
   SCROLL REVEAL
   — Elements with [data-reveal] start invisible,
   — JS IntersectionObserver adds .is-visible
   ========================================================= */
[data-reveal] {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}
[data-reveal-stagger].is-visible > *:nth-child(1) { transition-delay: 0.05s; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(2) { transition-delay: 0.12s; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(3) { transition-delay: 0.19s; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(4) { transition-delay: 0.26s; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(5) { transition-delay: 0.33s; opacity: 1; transform: translateY(0); }
[data-reveal-stagger].is-visible > *:nth-child(6) { transition-delay: 0.40s; opacity: 1; transform: translateY(0); }

/* =========================================================
   BORDER GRADIENT UTILITY
   ========================================================= */
.border-gradient {
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}
.border-gradient::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, var(--cobalt), var(--cyan), var(--crimson));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* =========================================================
   GLOW HOVER UTILITY
   ========================================================= */
.glow-hover {
  transition: box-shadow 0.3s ease;
}
.glow-hover:hover {
  box-shadow: 0 0 30px var(--cyan-dim), 0 0 60px rgba(0, 240, 255, 0.08);
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width: 1280px) {
  .side-rail { display: none; }
  .container { padding: 0 44px; }
}

@media (max-width: 1080px) {
  .container { padding: 0 32px; }
  .nav-links { display: none; }
  .hero-grid { grid-template-columns: 1fr; }
  .hero-art {
    height: 50vh;
    max-height: 480px;
  }
  .about-grid,
  .modular-grid,
  .capabilities-grid { grid-template-columns: 1fr; gap: 48px; }
  .pain-grid { grid-template-columns: 1fr 1fr; }
  .product-grid { grid-template-columns: 1fr 1fr; }
  .timeline-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .timeline-grid::before { display: none; }
  .labs-grid { grid-template-columns: repeat(3, 1fr); }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
}

@media (max-width: 768px) {
  :root {
    --section-pad: 80px;
  }
  .container { padding: 0 24px; }
  section { padding: var(--section-pad) 0; }
  .pain-grid,
  .product-grid,
  .timeline-grid { grid-template-columns: 1fr; }
  .masonry { columns: 2; }
  .footer-grid { grid-template-columns: 1fr; }
  .hero-copy h1 { font-size: clamp(32px, 8vw, 48px); }
  .section-header h2 { font-size: clamp(30px, 7vw, 44px); }
}

@media (max-width: 480px) {
  .container { padding: 0 18px; }
  .masonry { columns: 1; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-stats { flex-direction: column; align-items: flex-start; }
  .floating-cta { bottom: 18px; right: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  [data-reveal-stagger] > * { opacity: 1; transform: none; transition: none; }
  .fab::before { animation: none; }
  .topbar .pulse { animation: none; }
}
```

---

## 3. `src/layouts/Layout.astro`

```astro
---
interface Props {
  title: string;
  description?: string;
}
const {
  title,
  description = 'Dịch vụ in 3D chất lượng cao, giá cả minh bạch. Pegboard modular tùy chỉnh.',
} = Astro.props;
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />

    <!-- Styles -->
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <div class="shell">
      <!-- Side Rails (editorial) -->
      <div class="side-rail left">
        <span class="rail-text">in3D.help — Dịch vụ In 3D Việt Nam</span>
      </div>
      <div class="side-rail right">
        <span class="rail-text">MMXXVI — Ho Chi Minh City</span>
      </div>

      <slot />
    </div>

    <script src="/src/scripts/main.js"></script>
  </body>
</html>
```

---

## 4. `src/scripts/main.js` — Scroll Reveal + Headroom Nav + FAQ Accordion

```js
/*
 * in3D.help — Client-side interactivity
 * 1. IntersectionObserver scroll-reveal
 * 2. Headroom-style nav (hide on scroll-down, show on scroll-up)
 * 3. FAQ accordion toggle
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ====================================
     1. SCROLL REVEAL (IntersectionObserver)
     — Adds .is-visible when elements enter viewport
     ==================================== */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // once only
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ====================================
     2. HEADROOM NAV
     — Hides nav on scroll-down past deadband
     — Shows nav on scroll-up
     — Adds .is-scrolled when past top
     ==================================== */
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastScrollY = 0;
    let ticking = false;
    const deadband = 8; // px tolerance before toggling

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      // Show/hide based on direction
      if (delta > deadband && currentY > 120) {
        nav.classList.add('is-hidden');
      } else if (delta < -deadband) {
        nav.classList.remove('is-hidden');
      }

      // Scrolled state (border glow)
      if (currentY > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }

      lastScrollY = currentY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ====================================
     3. FAQ ACCORDION
     — Toggles .active on .faq-item
     ==================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close all
        faqItems.forEach((i) => i.classList.remove('active'));
        // Toggle current
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

});
```

---

## 5. `src/pages/index.astro` — Page assembly

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import SocialProofBar from '../components/SocialProofBar.astro';
import PainPoints from '../components/PainPoints.astro';
import ProductShowcase from '../components/ProductShowcase.astro';
import HowItWorks from '../components/HowItWorks.astro';
import ModularExplainer from '../components/ModularExplainer.astro';
import LifestyleGallery from '../components/LifestyleGallery.astro';
import About from '../components/About.astro';
import FAQ from '../components/FAQ.astro';
import Footer from '../components/Footer.astro';
import FloatingCTA from '../components/FloatingCTA.astro';
---

<Layout title="in3D.help — Dịch vụ In 3D chất lượng cao, giá minh bạch">
  <Header />
  <Hero />
  <SocialProofBar />
  <PainPoints />
  <ProductShowcase />
  <HowItWorks />
  <ModularExplainer />
  <LifestyleGallery />
  <About />
  <FAQ />
  <Footer />
  <FloatingCTA />
</Layout>
```

---

## 6. Các Components

### `src/components/Header.astro`

```astro
---
// Topbar + Nav (Headroom sticky, glassmorphism)
---

<!-- Top Metadata Strip (editorial) -->
<div class="topbar">
  <div class="container">
    <div class="topbar-inner">
      <span><span class="pulse"></span> <b>in3D.help</b></span>
      <span class="mid">
        <span>Vol. 01 / <span class="cyan">Pegboard Collection</span></span>
        <span>Ho Chi Minh City · 10.8231° N, 106.6297° E</span>
      </span>
      <span class="right">
        <span>v2.0 · 2026</span>
        <span>VI / EN</span>
      </span>
    </div>
  </div>
</div>

<!-- Sticky Glassmorphism Nav -->
<nav class="nav" role="navigation" aria-label="Main Navigation">
  <div class="container">
    <div class="nav-inner">
      <!-- Brand -->
      <a href="/" class="brand">
        <span class="brand-mark">3D</span>
        <span class="brand-name">in3D<span class="dot">.</span>help</span>
      </a>

      <!-- Links -->
      <ul class="nav-links">
        <li><a href="#san-pham">Sản phẩm</a></li>
        <li><a href="#cach-hoat-dong">Cách hoạt động</a></li>
        <li><a href="#bo-suu-tap">Bộ sưu tập</a></li>
        <li><a href="#ve-chung-toi">Về chúng tôi</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>

      <!-- Actions -->
      <div class="nav-actions">
        <a href="#san-pham" class="btn btn-zalo" style="padding:9px 18px; font-size:13px;">
          Đặt hàng Zalo
        </a>
      </div>
    </div>
  </div>
</nav>
```

### `src/components/Hero.astro`

```astro
---
// Hero: 40% text left / 60% visual right
---

<section class="hero" id="hero">
  <div class="container hero-grid">
    <!-- Left: Copy -->
    <div class="hero-copy" data-reveal>
      <span class="label">Dịch vụ in 3D chất lượng cao</span>

      <h1 class="display">
        Bàn làm việc<br/>
        <em>gọn gàng</em> hơn,<br/>
        sáng tạo hơn<span class="dot">.</span>
      </h1>

      <p class="lead">
        Pegboard modular in 3D — lắp ráp tùy chỉnh theo phong cách của bạn. 
        Giá minh bạch, giao hàng toàn quốc.
      </p>

      <div class="hero-actions">
        <a href="https://zalo.me/in3dhelp" class="btn btn-zalo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Chat Zalo ngay
        </a>
        <a href="#ai-advisor" class="btn btn-ai">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          Tư vấn AI
        </a>
      </div>

      <div class="hero-stats">
        <div class="stat">
          <span class="ring cyan">50+</span>
          <span class="stat-label"><b>Phụ kiện</b>Modular</span>
        </div>
        <div class="stat">
          <span class="ring">3</span>
          <span class="stat-label"><b>Gói combo</b>Sẵn hàng</span>
        </div>
        <div class="stat">
          <span class="ring">24h</span>
          <span class="stat-label"><b>Giao hàng</b>Nội thành</span>
        </div>
      </div>
    </div>

    <!-- Right: Visual -->
    <div class="hero-art" data-reveal>
      <!-- Corner brackets (Atelier Zero editorial annotations) -->
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>

      <!-- Annotations -->
      <span class="annot annot-tl">FIG. 01 / PB-26</span>
      <span class="annot annot-br">300×400mm · PLA+</span>

      <!-- Pegboard hero image (replace src with your asset) -->
      <img
        src="/assets/hero-pegboard.png"
        alt="Pegboard modular in 3D trên bàn làm việc với spotlight xanh dương"
        width="800"
        height="600"
        loading="eager"
      />
    </div>
  </div>
</section>
```

### `src/components/SocialProofBar.astro`

```astro
---
// Social Proof — Infinite scrolling marquee
const items = [
  '500+ khách hàng hài lòng',
  'Chất liệu PLA+ an toàn',
  'In chính xác 0.15mm',
  'Bảo hành 12 tháng',
  'Ship COD toàn quốc',
  'Thiết kế tại Việt Nam',
  'Modular — Lắp ráp dễ dàng',
  'Giá từ 299.000đ',
];
---

<section class="social-proof" aria-label="Social Proof">
  <div class="marquee-wrapper">
    <div class="marquee-track">
      {/* Duplicate for seamless loop */}
      {[...items, ...items].map((item) => (
        <span class="marquee-item">
          <span class="dot">●</span>
          {item}
        </span>
      ))}
    </div>
  </div>
</section>
```

### `src/components/PainPoints.astro`

```astro
---
// Pain Points: 3 glassmorphism cards
const pains = [
  {
    icon: '😤',
    title: 'Bàn bừa bộn, mất tập trung',
    desc: 'Dây cáp, phụ kiện, bút viết nằm lung tung. Mỗi sáng mất 10 phút dọn dẹp trước khi làm việc.',
  },
  {
    icon: '💸',
    title: 'Mua kệ đắt, không vừa bàn',
    desc: 'Kệ công nghiệp giá cao, kích thước cố định, không phù hợp với setup cá nhân của bạn.',
  },
  {
    icon: '🔧',
    title: 'Thiếu sự tùy chỉnh',
    desc: 'Mỗi người một phong cách làm việc — nhưng giải pháp trên thị trường thì "one-size-fits-all".',
  },
];
---

<section class="tight" id="van-de">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">II.</span>
      <span class="meta-grp">
        <span>Vấn đề</span>
      </span>
      <span>002 / 010</span>
    </div>

    <div class="section-header" data-reveal>
      <span class="label">Bạn đang gặp phải</span>
      <h2 class="display">
        Những <em>rắc rối</em> quen thuộc<span class="dot">.</span>
      </h2>
    </div>

    <div class="pain-grid" data-reveal-stagger>
      {pains.map((pain) => (
        <div class="glass-card pain-card">
          <div class="icon-wrap">{pain.icon}</div>
          <h3>{pain.title}</h3>
          <p>{pain.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### `src/components/ProductShowcase.astro`

```astro
---
// Product Showcase: 3 pricing tiers
const products = [
  {
    name: 'Starter Board',
    price: '299',
    unit: '.000đ',
    desc: 'Bộ pegboard cơ bản, phù hợp góc học tập nhỏ gọn.',
    specs: '200×300mm · 6 phụ kiện · PLA+',
    features: [
      'Tấm pegboard 200×300mm',
      '6 phụ kiện cơ bản',
      '1 giá đỡ điện thoại',
      'Hướng dẫn lắp đặt',
    ],
    recommended: false,
  },
  {
    name: 'Pro Desk Setup',
    price: '399',
    unit: '.000đ',
    desc: 'Gói phổ biến nhất — đầy đủ cho bàn làm việc WFH.',
    specs: '300×400mm · 12 phụ kiện · PLA+',
    features: [
      'Tấm pegboard 300×400mm',
      '12 phụ kiện đa năng',
      'Giá đỡ tablet + kẹp cáp',
      'Khay bút & hộp đựng nhỏ',
      'Miễn phí ship nội thành',
    ],
    recommended: true,
  },
  {
    name: 'Creator Studio',
    price: '599',
    unit: '.000đ',
    desc: 'Combo hoàn chỉnh cho maker, streamer, designer.',
    specs: '400×600mm · 20+ phụ kiện · PLA+',
    features: [
      'Tấm pegboard 400×600mm',
      '20+ phụ kiện premium',
      'Giá headphone + arm monitor',
      'LED holder & cable management',
      'Thiết kế phụ kiện custom 1 món',
      'Tư vấn setup 1-1',
    ],
    recommended: false,
  },
];
---

<section id="san-pham">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">III.</span>
      <span class="meta-grp">
        <span>Sản phẩm</span>
        <span>3 Gói combo</span>
      </span>
      <span>003 / 010</span>
    </div>

    <div class="section-header" data-reveal>
      <span class="label">Bảng giá minh bạch</span>
      <h2 class="display">
        Chọn gói <em>phù hợp</em> với bạn<span class="dot">.</span>
      </h2>
      <p class="lead">
        Mỗi gói bao gồm tấm pegboard + phụ kiện + hướng dẫn. Giá đã bao gồm in 3D, hoàn thiện và đóng gói.
      </p>
    </div>

    <div class="product-grid" data-reveal-stagger>
      {products.map((product) => (
        <div class={`product-card ${product.recommended ? 'recommended' : ''}`}>
          <h3 class="product-name">{product.name}</h3>
          <div class="product-price">
            {product.price}<span class="currency">{product.unit}</span>
          </div>
          <p class="product-desc">{product.desc}</p>
          <p class="spec">{product.specs}</p>
          <ul class="feature-list">
            {product.features.map((f) => (
              <li>{f}</li>
            ))}
          </ul>
          <a href="https://zalo.me/in3dhelp" class={`btn ${product.recommended ? 'btn-zalo' : 'btn-ghost'}`} style="width:100%; justify-content:center;">
            {product.recommended ? 'Đặt hàng ngay' : 'Tìm hiểu thêm'}
          </a>
        </div>
      ))}
    </div>
  </div>
</section>
```

### `src/components/HowItWorks.astro`

```astro
---
// How It Works: 4-step timeline
const steps = [
  {
    num: '01',
    icon: '💬',
    title: 'Chat tư vấn',
    desc: 'Nhắn Zalo hoặc dùng AI advisor để chọn gói phù hợp với setup bàn làm việc.',
  },
  {
    num: '02',
    icon: '🎨',
    title: 'Tùy chỉnh',
    desc: 'Chọn màu sắc, kích thước pegboard và phụ kiện. Xem preview 3D trước khi in.',
  },
  {
    num: '03',
    icon: '⚙️',
    title: 'In & Kiểm tra',
    desc: 'In 3D chính xác 0.15mm layer. QC kỹ từng chi tiết trước khi đóng gói.',
  },
  {
    num: '04',
    icon: '📦',
    title: 'Giao & Lắp ráp',
    desc: 'Ship COD toàn quốc 2-5 ngày. Lắp ráp trong 15 phút, không cần dụng cụ.',
  },
];
---

<section id="cach-hoat-dong">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">IV.</span>
      <span class="meta-grp">
        <span>Quy trình</span>
      </span>
      <span>004 / 010</span>
    </div>

    <div class="section-header" data-reveal>
      <span class="label">4 bước đơn giản</span>
      <h2 class="display">
        Từ ý tưởng đến<br/> <em>bàn làm việc</em> hoàn hảo<span class="dot">.</span>
      </h2>
    </div>

    <div class="timeline-grid" data-reveal-stagger>
      {steps.map((step) => (
        <div class="timeline-step">
          <div class="step-num">{step.num}</div>
          <div class="step-icon">{step.icon}</div>
          <h4>{step.title}</h4>
          <p>{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### `src/components/ModularExplainer.astro`

```astro
---
// Modular Explainer
const modules = [
  {
    icon: '🔲',
    title: 'Tấm nền Pegboard',
    desc: 'Tấm nền lỗ chuẩn 25mm, chịu lực tốt, nhiều kích thước',
  },
  {
    icon: '🪝',
    title: 'Móc & Giá treo',
    desc: 'Treo tai nghe, chìa khóa, phụ kiện — snap-fit chắc chắn',
  },
  {
    icon: '📱',
    title: 'Giá đỡ thiết bị',
    desc: 'Đứng điện thoại, tablet, Nintendo Switch tùy góc nghiêng',
  },
  {
    icon: '🔌',
    title: 'Cable Management',
    desc: 'Kẹp cáp, ống luồn dây — bàn gọn không rối',
  },
  {
    icon: '🖊️',
    title: 'Khay & Hộp đựng',
    desc: 'Khay bút, hộp nhỏ, ngăn chứa linh hoạt theo nhu cầu',
  },
];
---

<section id="modular">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">V.</span>
      <span class="meta-grp">
        <span>Hệ sinh thái Modular</span>
      </span>
      <span>005 / 010</span>
    </div>

    <div class="modular-grid">
      <!-- Left: Visual -->
      <div class="modular-visual" data-reveal>
        <!-- Corner brackets -->
        <span class="corner tl"></span>
        <span class="corner br"></span>
        <img
          src="/assets/modular-assembly.png"
          alt="Mô phỏng lắp ráp modular pegboard"
          width="560"
          height="560"
          loading="lazy"
        />
      </div>

      <!-- Right: Copy + Module list -->
      <div class="modular-copy" data-reveal>
        <span class="label">Thiết kế Modular</span>
        <h2 class="display">
          Một hệ thống,<br/><em>vô vàn</em> cách phối<span class="dot">.</span>
        </h2>
        <p class="lead">
          Mỗi phụ kiện thiết kế theo chuẩn snap-fit. Lắp vào — tháo ra — đổi vị trí. 
          Không cần keo, không cần khoan tường.
        </p>

        <div class="module-list" data-reveal-stagger>
          {modules.map((mod) => (
            <div class="module-item">
              <div class="mod-icon">{mod.icon}</div>
              <div>
                <h4>{mod.title}</h4>
                <p>{mod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
```

### `src/components/LifestyleGallery.astro`

```astro
---
// Lifestyle Gallery: Masonry grid
const images = [
  { src: '/assets/gallery/desk-01.jpg', alt: 'Setup bàn làm việc developer', tag: 'SETUP #01', caption: 'Developer WFH' },
  { src: '/assets/gallery/desk-02.jpg', alt: 'Bàn học sinh viên gọn gàng', tag: 'SETUP #02', caption: 'Study Corner' },
  { src: '/assets/gallery/desk-03.jpg', alt: 'Gaming setup với pegboard', tag: 'SETUP #03', caption: 'Gaming Desk' },
  { src: '/assets/gallery/desk-04.jpg', alt: 'Bàn crafting với dụng cụ', tag: 'SETUP #04', caption: 'Maker Studio' },
  { src: '/assets/gallery/desk-05.jpg', alt: 'Minimal desk pegboard trắng', tag: 'SETUP #05', caption: 'Minimal Setup' },
  { src: '/assets/gallery/desk-06.jpg', alt: 'Pegboard phòng bếp', tag: 'SETUP #06', caption: 'Kitchen Board' },
];
---

<section id="bo-suu-tap">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">VI.</span>
      <span class="meta-grp">
        <span>Phòng trưng bày</span>
      </span>
      <span>006 / 010</span>
    </div>

    <div class="section-header" data-reveal>
      <span class="label">Ảnh thực tế</span>
      <h2 class="display">
        Khách hàng <em>yêu thích</em><br/>setup của họ<span class="dot">.</span>
      </h2>
    </div>

    <div class="masonry" data-reveal-stagger>
      {images.map((img) => (
        <div class="masonry-item">
          <img src={img.src} alt={img.alt} loading="lazy" />
          <div class="caption">
            <span class="tag">{img.tag}</span>
            {img.caption}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### `src/components/About.astro`

```astro
---
// About: Ledainhan's maker story
---

<section id="ve-chung-toi">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">VII.</span>
      <span class="meta-grp">
        <span>Câu chuyện</span>
      </span>
      <span>007 / 010</span>
    </div>

    <div class="about-grid">
      <!-- Left: Portrait -->
      <div class="about-art" data-reveal>
        <img
          src="/assets/ledainhan-portrait.jpg"
          alt="Ledainhan — Founder in3D.help"
          width="480"
          height="640"
          loading="lazy"
        />
        <span class="overlay-tag top">FOUNDER / MAKER</span>
        <span class="overlay-tag bottom">HCM · 2024 → now</span>
      </div>

      <!-- Right: Copy -->
      <div class="about-copy" data-reveal>
        <span class="label">Người đứng sau in3D.help</span>
        <h2 class="display">
          Xin chào, tôi là<br/><em>Ledainhan</em><span class="dot">.</span>
        </h2>
        <p class="lead">
          Từ một chiếc máy in 3D trong phòng trọ, tôi bắt đầu làm pegboard cho chính bàn làm việc bừa bộn của mình.
        </p>
        <p class="bio">
          Bạn bè thấy hay, nhờ in giùm. Rồi đồng nghiệp cũng muốn. Thế là in3D.help ra đời — 
          không phải từ một business plan hoàn hảo, mà từ một nhu cầu thật: có một góc làm việc gọn gàng, 
          đẹp mắt, và đúng phong cách của mình. Mỗi sản phẩm đều được tôi kiểm tra tay, đóng gói cẩn thận, 
          và ship đến bạn như gửi cho một người bạn.
        </p>

        <div class="maker-sig">
          <img class="avatar" src="/assets/ledainhan-avatar.jpg" alt="Ledainhan" width="48" height="48" />
          <div class="sig-text">
            Ledainhan
            <span>Maker & Founder · in3D.help</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### `src/components/FAQ.astro`

```astro
---
// FAQ: Accordion
const faqs = [
  {
    q: 'Pegboard được in bằng chất liệu gì?',
    a: 'Tất cả sản phẩm được in bằng PLA+ (Polylactic Acid Plus) — nhựa sinh học, an toàn, không mùi, độ bền cao. Chịu nhiệt đến 60°C, phù hợp sử dụng trong nhà.',
  },
  {
    q: 'Thời gian giao hàng bao lâu?',
    a: 'Nội thành HCM: 1-2 ngày. Các tỉnh thành khác: 3-5 ngày qua GHTK/GHN. Đơn hàng được in sau khi xác nhận, nên cần thêm 1-2 ngày sản xuất.',
  },
  {
    q: 'Tôi có thể đặt thiết kế phụ kiện riêng không?',
    a: 'Có! Gói Creator Studio bao gồm 1 phụ kiện custom. Bạn cũng có thể đặt riêng thiết kế phụ kiện với giá từ 50.000đ/món. Chat Zalo để tư vấn chi tiết.',
  },
  {
    q: 'Pegboard treo tường hay đặt bàn?',
    a: 'Cả hai! Mỗi tấm pegboard đi kèm chân đỡ (đặt bàn) và miếng dán tường 3M (treo tường). Bạn chọn cách nào phù hợp với không gian.',
  },
  {
    q: 'Chính sách bảo hành như thế nào?',
    a: 'Bảo hành 12 tháng cho tấm pegboard với lỗi sản xuất. Phụ kiện bảo hành 6 tháng. Nếu gãy/hỏng do sử dụng bình thường, gửi ảnh qua Zalo để được hỗ trợ thay mới.',
  },
  {
    q: 'Có hỗ trợ thanh toán trả góp không?',
    a: 'Hiện tại chưa hỗ trợ trả góp. Thanh toán qua chuyển khoản ngân hàng, MoMo, ZaloPay, hoặc COD (thanh toán khi nhận hàng).',
  },
];
---

<section id="faq">
  <div class="container">
    <div class="sec-rule">
      <span class="roman">VIII.</span>
      <span class="meta-grp">
        <span>Câu hỏi thường gặp</span>
      </span>
      <span>008 / 010</span>
    </div>

    <div class="section-header" data-reveal style="text-align:center;">
      <span class="label" style="justify-content:center;">FAQ</span>
      <h2 class="display" style="margin:0 auto;">
        Bạn thắc mắc,<br/>chúng tôi <em>giải đáp</em><span class="dot">.</span>
      </h2>
    </div>

    <div class="faq-list" data-reveal>
      {faqs.map((faq) => (
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>{faq.q}</span>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div class="faq-answer">
            <p>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### `src/components/Footer.astro`

```astro
---
// Footer
---

<footer class="footer">
  <div class="container">
    <!-- Giant kicker word (Atelier Zero mega-footer) -->
    <div class="footer-mega" aria-hidden="true">in3D.help</div>

    <div class="footer-grid">
      <!-- Brand column -->
      <div class="footer-brand">
        <div class="brand-name" style="font-family:var(--heading); font-weight:800;">
          in3D<span class="dot" style="color:var(--cyan);">.</span>help
        </div>
        <p class="footer-desc">
          Dịch vụ in 3D chất lượng cao, giá cả minh bạch. 
          Pegboard modular cho bàn làm việc hiện đại.
        </p>
        <div style="display:flex; gap:12px; align-items:center;">
          <span class="pulse" style="width:6px;height:6px;border-radius:50%;background:var(--cyan);animation:pulse 2.4s ease-in-out infinite;"></span>
          <span class="coord">10.8231° N, 106.6297° E</span>
        </div>
      </div>

      <!-- Link columns -->
      <div class="footer-col">
        <h4>Sản phẩm</h4>
        <ul>
          <li><a href="#san-pham">Starter Board</a></li>
          <li><a href="#san-pham">Pro Desk Setup</a></li>
          <li><a href="#san-pham">Creator Studio</a></li>
          <li><a href="#san-pham">Phụ kiện rời</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Hỗ trợ</h4>
        <ul>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#cach-hoat-dong">Cách đặt hàng</a></li>
          <li><a href="#">Chính sách bảo hành</a></li>
          <li><a href="#">Hướng dẫn lắp đặt</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Liên hệ</h4>
        <ul>
          <li><a href="https://zalo.me/in3dhelp">Zalo</a></li>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">TikTok</a></li>
          <li><a href="mailto:hello@bluemoooon.vn">hello@bluemoooon.vn</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 BlueMooon's Studio — Made with ❤ in Saigon</span>
      <span class="coord">BUILD 2026.07 · PLA+ · FDM</span>
    </div>
  </div>
</footer>
```

### `src/components/FloatingCTA.astro`

```astro
---
// Floating CTA: Zalo + AI Robot FABs
---

<div class="floating-cta">
  <!-- AI Robot button -->
  <a href="#ai-advisor" class="fab fab-ai" aria-label="Tư vấn AI" title="Tư vấn AI">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="9" cy="16" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="16" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M8 11V7a4 4 0 018 0v4"/>
      <line x1="12" y1="3" x2="12" y2="5"/>
      <circle cx="12" cy="2" r="1"/>
    </svg>
  </a>

  <!-- Zalo button -->
  <a href="https://zalo.me/in3dhelp" class="fab fab-zalo" aria-label="Chat Zalo" title="Chat Zalo" target="_blank" rel="noopener">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  </a>
</div>
```

---

## 7. Tổng kết kiến trúc thiết kế

Bảng ánh xạ phong cách Atelier Zero → in3D.help Dark Tech:

| Atelier Zero (gốc) | in3D.help (thay thế) |
|---|---|
| Paper `#efe7d2` background | Void Black `#0D0D0D` |
| Ink `#15140f` text | Text Primary `#F0F0F0` |
| Coral `#ed6f5c` accent | Neon Cyan `#00F0FF` (chính) + Crimson `#DC143C` (phụ) |
| Playfair Display italic serif | Outfit italic (cùng font, dùng italic cho emphasis) |
| Inter Tight sans | Outfit (headings) |
| Inter body | Inter (giữ nguyên) |
| JetBrains Mono | JetBrains Mono (giữ nguyên) |
| Paper noise texture (multiply) | Dark noise texture (screen blend) |
| Bone cards `#f7f1de` | Glassmorphism cards (blur + semi-transparent) |
| 1px hairline rules (dark on light) | 1px hairline rules (light on dark, with cyan glow) |
| Warm radial gradients | Cool cobalt/cyan radial gradients |
| Coral terminating dots | Cyan terminating dots |
| Section Roman numerals (coral) | Section Roman numerals (cyan) |
| Side rails (ink-faint text) | Side rails (text-faint, same structure) |
| Top metadata strip | Top metadata strip (dark variant) |
| Headroom sticky nav | Headroom sticky nav + glassmorphism |
| `data-reveal` scroll animation | Identical IntersectionObserver system |
| CSS `marquee-x` keyframe ticker | Identical ticker for Social Proof |

Những yếu tố editorial cốt lõi được giữ nguyên 100%: Roman-numeral section markers, hairline rules phân tách, corner bracket annotations trên hình ảnh, side rails chữ xoay dọc, metadata strip trên cùng, mega-word footer, scroll-reveal staggered, và Headroom show/hide nav. Toàn bộ palette và feel đã chuyển từ warm-paper editorial sang dark-tech cyberpunk nhưng vẫn giữ cấu trúc editorial magazine gốc, tạo ra một phong cách "Dark Tech Editorial" độc đáo cho in3D.help.