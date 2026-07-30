# RAW OUTPUT CỦA GENSPARK CHAT

## PHẦN 1: Layout.astro, SEOHead.astro, global.css @font-face

### Layout.astro (src/layouts/Layout.astro)
```astro
---
import '../styles/global.css';
import SEOHead from '../components/SEOHead.astro';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  /**
   * Truyền JSON-LD schema từ page cụ thể xuống SEOHead.
   * Có thể là một chuỗi JSON hoặc mảng chuỗi JSON.
   */
  jsonLd?: string | string[];
}

const {
  title,
  description = 'Kệ để bàn modular in 3D đáng yêu. Bảng pegboard bằng nhựa in 3D nhẹ, dễ thương, lắp ghép linh hoạt giúp bàn học luôn gọn gàng.',
  ogImage = '/images/hero-desk-setup.webp',
  ogType = 'website',
  jsonLd,
} = Astro.props;
---

<!doctype html>
<html lang="vi">
  <head>
    <SEOHead
      title={title}
      description={description}
      ogImage={ogImage}
      ogType={ogType}
      jsonLd={jsonLd}
    />
  </head>
  <body>
    <!-- ✅ [FIX] Skip Navigation Link: giúp người dùng keyboard/screen reader
         bỏ qua nav và nhảy thẳng vào nội dung chính. Ẩn bằng CSS cho đến khi
         được focus, không ảnh hưởng giao diện người dùng thông thường. -->
    <a href="#main" class="skip-nav" tabindex="0">Bỏ qua và đến nội dung chính</a>

    <div class="shell">
      <!-- ✅ [FIX] Typo: "BlueMooon's" → "BlueMoon's" (nhất quán 2 chữ 'o') -->
      <!-- ✅ [FIX] Accessibility: thêm aria-hidden="true" vì đây là nội dung
           editorial/trang trí thuần túy, không mang thông tin hữu ích cho
           screen reader. Ngăn trình đọc màn hình đọc nội dung lặp lại. -->
      <div class="side-rail left" aria-hidden="true">
        <span class="rail-text">BlueMoon's Studio — Kệ để bàn modular in 3D</span>
      </div>
      <div class="side-rail right" aria-hidden="true">
        <span class="rail-text">MMXXVI — Ho Chi Minh City</span>
      </div>

      <!-- ✅ role="main" kết hợp id="main" để đảm bảo tương thích
           với cả ARIA landmark và skip-nav anchor -->
      <main id="main" role="main" tabindex="-1">
        <slot />
      </main>
    </div>

    <!-- ✅ Đường dẫn script dùng đường dẫn tuyệt đối từ public/ thay vì /src/ -->
    <script src="/scripts/main.js"></script>
  </body>
</html>

<style is:global>
  /*
   * ✅ [FIX] Skip Navigation Link Styles
   * Kỹ thuật chuẩn: ẩn bằng clip/position thay vì display:none
   * để vẫn tồn tại trong DOM và nhận được focus từ keyboard.
   * Khi được focus (Tab đầu tiên), link hiện ra ở góc trên cùng.
   */
  .skip-nav {
    position: fixed;
    top: -100%;
    left: 1rem;
    z-index: 9999;
    padding: 0.75rem 1.25rem;
    background: #1a1a1a;
    color: #fff8f0;
    font-size: 0.9rem;
    font-weight: 700;
    border-radius: 0 0 0.5rem 0.5rem;
    text-decoration: none;
    transition: top 0.15s ease;
    /* Đảm bảo không bị clip bởi overflow hidden của parent */
    clip-path: none;
  }

  .skip-nav:focus,
  .skip-nav:focus-visible {
    top: 0;
    outline: 3px solid #f97316;
    outline-offset: 2px;
  }
</style>
```

### SEOHead.astro (src/components/SEOHead.astro)
```astro
---
export interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  /**
   * JSON-LD schema do page truyền vào (nếu có).
   * SEOHead sẽ merge với các schema mặc định (Organization, etc.)
   */
  jsonLd?: string | string[];
}

const {
  title,
  description,
  ogImage = '/images/hero-desk-setup.webp',
  ogType = 'website',
  jsonLd,
} = Astro.props;

const siteOrigin = Astro.site?.toString().replace(/\/$/, '') ?? 'https://3dprinting.ledainhan.com';
const canonicalURL = new URL(Astro.url.pathname, siteOrigin);
const ogImageAbsolute = ogImage.startsWith('http')
  ? ogImage
  : new URL(ogImage, siteOrigin).toString();

// ------------------------------------------------------------------ //
//  JSON-LD: Schema mặc định được nhúng vào mọi trang                  //
// ------------------------------------------------------------------ //

/**
 * Organization Schema — định danh thương hiệu cho Google
 * @see https://schema.org/Organization
 */
const organizationSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "BlueMoon's Studio",
  alternateName: 'BlueMoon Studio',
  url: siteOrigin,
  logo: {
    '@type': 'ImageObject',
    url: `${siteOrigin}/images/logo.png`,
    width: 200,
    height: 60,
  },
  description:
    'Xưởng thiết kế và in 3D các sản phẩm kệ để bàn modular, bảng pegboard nhựa tại TP. Hồ Chí Minh.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ho Chi Minh City',
    addressCountry: 'VN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Vietnamese'],
  },
  sameAs: [
    // Thêm các URL mạng xã hội khi có
    // 'https://www.facebook.com/bluemoonstudio',
    // 'https://www.instagram.com/bluemoonstudio',
  ],
});

/**
 * Product Schema — cải thiện rich snippet trên Google Shopping
 * @see https://schema.org/Product
 */
const productSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Kệ để bàn Modular in 3D',
  description:
    'Bảng pegboard bằng nhựa in 3D nhẹ, dễ thương, lắp ghép linh hoạt giúp bàn học luôn gọn gàng.',
  image: ogImageAbsolute,
  brand: {
    '@type': 'Brand',
    name: "BlueMoon's Studio",
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'VND',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: "BlueMoon's Studio",
    },
  },
  url: canonicalURL.toString(),
});

/**
 * FAQPage Schema — hiển thị câu hỏi/đáp ngay trên SERP Google
 * @see https://schema.org/FAQPage
 */
const faqSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Kệ để bàn modular in 3D được làm từ chất liệu gì?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sản phẩm được in bằng nhựa PLA và PETG thân thiện môi trường, nhẹ, bền và an toàn khi tiếp xúc.',
      },
    },
    {
      '@type': 'Question',
      name: 'Có thể tùy chỉnh màu sắc và kích thước kệ không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có, BlueMoon\'s Studio hỗ trợ tùy chỉnh màu sắc, kích thước và module theo yêu cầu của khách hàng.',
      },
    },
    {
      '@type': 'Question',
      name: 'Thời gian giao hàng là bao lâu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Thông thường từ 3–5 ngày làm việc tại TP. HCM và 5–7 ngày cho các tỉnh thành khác.',
      },
    },
  ],
});

// Merge schema mặc định với schema do page truyền vào
const pageSchemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
const allSchemas = [organizationSchema, productSchema, faqSchema, ...pageSchemas];

const cfBeaconToken = import.meta.env.PUBLIC_CF_BEACON_TOKEN ?? null;
---

<!-- Primary Meta Tags -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="generator" content={Astro.generator} />

<!-- ✅ [NEW] Theme color: gợi ý màu nền cho browser chrome trên mobile -->
<meta name="theme-color" content="#FFF8F0" />

<!-- Favicons -->
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />

<!-- ============================================================
     SELF-HOSTED FONTS — Thay thế Google CDN
     ============================================================ -->
<link
  rel="preload"
  href="/fonts/nunito/nunito-v26-latin-700.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
<link
  rel="preload"
  href="/fonts/quicksand/quicksand-v31-latin-600.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>

<!-- SEO Core -->
<title>{title}</title>
<meta name="description" content={description} />
<meta name="robots" content="index, follow" />
<link rel="canonical" href={canonicalURL.toString()} />

<!-- Open Graph / Facebook / Zalo -->
<meta property="og:type" content={ogType} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageAbsolute} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={`Ảnh minh họa: ${title}`} />
<meta property="og:url" content={canonicalURL.toString()} />
<meta property="og:site_name" content="BlueMoon's Studio" />
<meta property="og:locale" content="vi_VN" />

<!-- Twitter / X Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageAbsolute} />
<meta name="twitter:image:alt" content={`Ảnh minh họa: ${title}`} />

<!-- JSON-LD Structured Data -->
{allSchemas.map((schema) => (
  <script type="application/ld+json" set:html={schema} />
))}

{cfBeaconToken && (
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={`{"token": "${cfBeaconToken}"}`}
  ></script>
)}
```

### CSS Khai báo Font cục bộ
```css
/* --- Nunito (dùng cho heading / nổi bật) --- */
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/nunito/nunito-v26-latin-regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
    U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD,
    U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/nunito/nunito-v26-latin-600.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/nunito/nunito-v26-latin-700.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
@font-face {
  font-family: 'Nunito';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url('/fonts/nunito/nunito-v26-latin-800.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/quicksand/quicksand-v31-latin-regular.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/quicksand/quicksand-v31-latin-500.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/quicksand/quicksand-v31-latin-600.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
@font-face {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/quicksand/quicksand-v31-latin-700.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169,
    U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309,
    U+0323, U+0329, U+1EA0-1EF9, U+20AB, U+0000-00FF;
}
```

---

## PHẦN 2: Hero.astro, ProductShowcase.astro

### Hero.astro (src/components/Hero.astro)
```astro
---
// Hero: 40% text left / 60% visual right
---

<section class="hero" id="hero" aria-labelledby="hero-heading">
  <div class="container hero-grid">
    <!-- Left: Copy -->
    <div class="hero-copy" data-reveal>
      <span class="label">Kệ modular in 3D đáng yêu <span aria-hidden="true">🌸</span></span>

      <h1 class="display" id="hero-heading">
        Góc bàn xinh,<br/>
        <em>gọn gàng</em> từng centimet<span class="dot" aria-hidden="true">✿</span>
      </h1>

      <p class="lead">
        Kệ pegboard modular in 3D siêu nhẹ — Lắp ghép tùy thích, phối phụ kiện linh hoạt. Biến bàn học, bàn làm việc thành góc decor đáng yêu chỉ từ 299K.
      </p>

      <div class="hero-actions">
        <a href="#san-pham" class="btn btn-zalo">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Xem các gói combo
        </a>
        <a href="https://zalo.me/in3dhelp" class="btn btn-ai">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Tư vấn miễn phí qua Zalo
        </a>
      </div>

      <div class="hero-stats">
        <div class="stat">
          <span class="ring">50+</span>
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
      <span class="corner tl" aria-hidden="true"></span>
      <span class="corner tr" aria-hidden="true"></span>
      <span class="corner bl" aria-hidden="true"></span>
      <span class="corner br" aria-hidden="true"></span>

      <span class="annot annot-tl" aria-hidden="true">SERIES / PB-CUTE</span>
      <span class="annot annot-br" aria-hidden="true">240×240mm · Soft PLA</span>

      <picture>
        <source srcset="/images/hero-desk-setup-mobile.webp" media="(max-width: 768px)" type="image/webp" />
        <source srcset="/images/hero-desk-setup.webp" type="image/webp" />
        <img
          src="/images/hero-desk-setup.webp"
          alt="Kệ pegboard modular in 3D dễ thương trên bàn học gọn gàng"
          width="800"
          height="600"
          loading="eager"
          fetchpriority="high"
        />
      </picture>
    </div>
  </div>
</section>
```

### ProductShowcase.astro (src/components/ProductShowcase.astro)
```astro
---
const products = [
  {
    id: 'starter',
    name: 'Starter Pegboard',
    price: '299',
    oldPrice: '420',
    unit: '.000đ',
    desc: 'Bộ kệ xinh xắn, lý tưởng cho góc học tập và làm việc nhỏ gọn.',
    specs: '24×24 cm · 1 Tấm Main · 4 Tấm Viền · 4 Góc',
    features: [
      '1 tấm nền chính 16×16 cm',
      '4 tấm viền (2 ngang, 2 dọc)',
      '4 tấm góc bo tròn dễ thương',
      'Bộ chốt Connector hoa 4 cánh',
      '4 phụ kiện cute đi kèm',
      'Tháo lắp bằng tay trong 2 phút',
    ],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro Desk Setup',
    price: '399',
    oldPrice: '550',
    unit: '.000đ',
    desc: 'Phù hợp cho bàn làm việc WFH gọn gàng, tối ưu năng suất.',
    specs: '24×40 cm · 2 Tấm Main · 6 Tấm Viền · 4 Góc',
    features: [
      '2 tấm nền chính 16×16 cm',
      '6 tấm viền (2 ngang, 4 dọc)',
      '4 tấm góc bo tròn',
      'Bộ chốt Connector hoa 4 cánh',
      '8 phụ kiện cute đa năng',
      'Miễn phí ship nội thành',
    ],
    recommended: true,
  },
  {
    id: 'creator',
    name: 'Creator Studio',
    price: '599',
    oldPrice: '790',
    unit: '.000đ',
    desc: 'Bảng vuông lớn — trọn gói cho streamer, designer và bàn học sinh lớn.',
    specs: '40×40 cm · 4 Tấm Main · 8 Tấm Viền · 4 Góc',
    features: [
      '4 tấm nền chính 16×16 cm',
      '8 tấm viền (4 ngang, 4 dọc)',
      '4 tấm góc bo tròn',
      'Bộ chốt Connector hoa 4 cánh',
      '15 phụ kiện premium cute',
      'Cá nhân hóa in tên/logo riêng',
      'Tư vấn phối màu setup 1-1',
    ],
    recommended: false,
  },
];
---

<section id="san-pham" aria-labelledby="san-pham-heading">
  <div class="container">
    <div class="sec-rule" aria-hidden="true">
      <span class="roman">III.</span>
      <span class="meta-grp">
        <span>Sản phẩm</span>
        <span>3 Gói combo</span>
      </span>
      <span>003 / 010</span>
    </div>

    <div class="section-header" data-reveal>
      <span class="label">Bảng giá minh bạch</span>
      <h2 class="display" id="san-pham-heading">
        Chọn gói <em>kệ xinh</em> cho góc bàn<span class="dot" aria-hidden="true">✿</span>
      </h2>
      <p class="lead">
        Mỗi gói là sản phẩm kệ pegboard modular hoàn thiện, kèm chốt khóa tháo lắp thông minh và các phụ kiện decor xinh xắn.
      </p>
    </div>

    <div class="product-grid" data-reveal-stagger>
      {products.map((product) => (
        <div
          class={`product-card ${product.recommended ? 'recommended' : ''}`}
          aria-labelledby={`product-name-${product.id}`}
        >
          {product.recommended && (
            <div class="badge-bestseller" aria-label="Sản phẩm bán chạy nhất">
              <span aria-hidden="true">🔥</span> Bán chạy nhất
            </div>
          )}

          <h3 class="product-name" id={`product-name-${product.id}`}>
            {product.name}
          </h3>

          <div class="product-pricing">
            <div class="product-price">
              {product.price}<span class="currency">{product.unit}</span>
            </div>
            <div class="product-old-price" aria-label={`Giá cũ ${product.oldPrice}.000 đồng`}>
              <s>{product.oldPrice}{product.unit}</s>
            </div>
          </div>

          <p class="product-desc">{product.desc}</p>
          <p class="spec">{product.specs}</p>

          <ul class="feature-list" aria-label={`Tính năng của ${product.name}`}>
            {product.features.map((f) => (
              <li>{f}</li>
            ))}
          </ul>

          <a
            href="https://zalo.me/in3dhelp"
            class={`btn ${product.recommended ? 'btn-zalo' : 'btn-ghost'}`}
            style="width:100%; justify-content:center;"
            aria-label={`Đặt combo ${product.name} — ${product.price}${product.unit}`}
          >
            Đặt combo {product.name}
          </a>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  /* ── Badge bán chạy nhất ── */
  .badge-bestseller {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    background: linear-gradient(135deg, #ff6b35, #f7c59f);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.3em 0.85em;
    border-radius: 999px;
    margin-bottom: 0.85rem;
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.35);
  }

  /* ── Price anchoring ── */
  .product-pricing {
    display: flex;
    align-items: baseline;
    gap: 0.6em;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .product-old-price {
    color: #999;
    font-size: 0.9rem;
  }

  .product-old-price s {
    text-decoration: line-through;
    text-decoration-color: #e05252;
    text-decoration-thickness: 1.5px;
  }
</style>
```
