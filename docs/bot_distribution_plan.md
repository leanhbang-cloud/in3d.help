# 🤖 KẾ HOẠCH XÂY DỰNG HỆ THỐNG BOT PHÂN PHỐI NỘI DUNG TỰ ĐỘNG (NGƯNG TRIỂN KHAI)
# nuidinh.help → Facebook Groups & Threads
# Ngân sách: $0 | Phiên bản: 1.0 | Cập nhật: 07/2026

> [!CAUTION]
> **TRẠNG THÁI: KHÔNG KHẢ THI (DEPRECATED)**
> Kế hoạch này đã được **hủy bỏ** và ngừng triển khai do các hạn chế nghiêm ngặt từ phía Meta (Graph API không hỗ trợ Groups, rủi ro khóa tài khoản rất cao). Tài liệu chỉ dùng để tham khảo lịch sử.

---

## MỤC LỤC

1. [Mục Tiêu & Cơ Chế Hoạt Động](#1-muc-tieu--co-che-hoat-dong)
2. [Phân Tích Kênh & Đối Tượng](#2-phan-tich-kenh--doi-tuong)
3. [Kịch Bản Phân Phối & Mẫu Nội Dung](#3-kich-ban-phan-phoi--mau-noi-dung)
4. [Giải Pháp Kỹ Thuật & Kiến Trúc Hệ Thống](#4-giai-phap-ky-thuat--kien-truc-he-thong)
5. [Rủi Ro & Biện Pháp Phòng Tránh](#5-rui-ro--bien-phap-phong-tranh)
6. [Lộ Trình Triển Khai & KPI Đo Lường](#6-lo-trinh-trien-khai--kpi-do-luong)
7. [Phụ Lục: Code Snippets Tham Khảo](#7-phu-luc-code-snippets-tham-khao)

---

## 1. MỤC TIÊU VÀ CƠ CHẾ HOẠT ĐỘNG

### 1.1 Mục Tiêu Tổng Thể

| Mục tiêu | Chỉ tiêu 3 tháng | Chỉ tiêu 6 tháng |
|---|---|---|
| Organic traffic từ Social | +500 sessions/tháng | +2.000 sessions/tháng |
| Click-through rate link | ≥ 3.5% | ≥ 5% |
| Tài khoản bot sống sót | 100% (giai đoạn test) | ≥ 80% |
| Mentions thương hiệu tự nhiên | 20 lần/tháng | 80 lần/tháng |

### 1.2 Triết Lý Cốt Lõi: VALUE-FIRST

> **"Đừng là người bán hàng dạo. Hãy là người bạn đồng hành biết hết mọi thứ về Núi Dinh."**

Bot không bao giờ đăng link trơ trọi. Mỗi lần xuất hiện phải mang lại giá trị thực sự cho người đọc. Link `nuidinh.help` chỉ xuất hiện dưới dạng **"nguồn tham khảo sâu hơn"** sau khi đã cung cấp câu trả lời đầy đủ ngay trong bình luận/bài đăng.

### 1.3 Luồng Hoạt Động Tổng Thể (Master Pipeline)

```
┌─────────────────────────────────────────────────────────────────┐
│                        NGUỒN ĐẦU VÀO                           │
│   [Facebook Groups]   [Threads Feed]   [nuidinh.help RSS/API]  │
└──────────┬──────────────────┬──────────────────┬───────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TẦNG THU THẬP DỮ LIỆU                      │
│  Playwright Scraper  │  Threads API  │  Website Content Parser │
│  (Cookie Auth)       │  (OAuth 2.0)  │  (BeautifulSoup/RSS)    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TẦNG XỬ LÝ & PHÂN LOẠI                     │
│                                                                  │
│  ┌─────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ Keyword Intent  │  │  Sentiment     │  │  Relevance      │  │
│  │ Classifier      │  │  Filter        │  │  Scoring (0-10) │  │
│  │ (spaCy/regex)   │  │  (bỏ toxic)    │  │  Ngưỡng ≥ 7    │  │
│  └────────┬────────┘  └───────┬────────┘  └────────┬────────┘  │
│           └──────────────────┴────────────────────┘            │
│                               │                                  │
│                         [Queue SQLite]                           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   TẦNG SINH NỘI DUNG (AI)                       │
│                                                                  │
│  Template Engine ──► Groq API (Llama 3 Free) ──► Fact-Check    │
│  (Jinja2)           hoặc Google Gemini Free      với DB local   │
│                                                                  │
│  Output: Văn bản Value-First + Link có ngữ cảnh                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  TẦNG KIỂM DUYỆT NỘI DUNG                      │
│                                                                  │
│  Anti-Spam Check  │  Link Density Check  │  Human Review Queue │
│  (≤ 1 link/post)  │  (≤ 15% nội dung)   │  (score < 8 → hold) │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  TẦNG PHÂN PHỐI & ĐO LƯỜNG                     │
│                                                                  │
│  Facebook Groups          Threads API             UTM Tracking  │
│  (Playwright + Delay)     (Official API)          ?utm_source=  │
│  Jitter: 5-30 phút        250 posts/24h           fb_bot        │
│                                                                  │
│                    [Log SQLite / Sheets API]                    │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Sơ Đồ Quyết Định Bot (Decision Tree)

```
Phát hiện bài đăng mới trong nhóm
              │
              ▼
    [Có chứa keyword Núi Dinh?]
         Có ──────► [Là câu hỏi hay chia sẻ?]
         Không ────► Bỏ qua
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
          CÂU HỎI                  CHIA SẺ/CHECKIN
              │                       │
              ▼                       ▼
    [Intent Classification]   [Sentiment tích cực?]
    - Đường đi / cung đường       Có ──► Like/React
    - Bãi xe / nơi ăn             Không ──► Bỏ qua
    - Thời tiết / mùa vụ
    - An toàn / cứu hộ
    - Camping / trail run
              │
              ▼
    [Tìm câu trả lời trong KB]
    (Knowledge Base từ nuidinh.help)
              │
         Tìm thấy
              │
              ▼
    [Sinh nội dung Value-First]
    Câu trả lời đầy đủ (3-5 câu)
    + "Xem thêm chi tiết: nuidinh.help/..."
              │
              ▼
    [Delay ngẫu nhiên 15-45 phút]
    (Giả lập hành vi người thật)
              │
              ▼
         [Đăng bình luận]
              │
              ▼
    [Log vào SQLite + Theo dõi engagement]
```

---

## 2. PHÂN TÍCH KÊNH & ĐỐI TƯỢNG

### 2.1 Facebook Groups — Danh Sách Mục Tiêu Ưu Tiên

#### TIER 1 — Nhóm Siêu Liên Quan (Tập Trung 80% Nguồn Lực)

| # | Tên nhóm | Từ khóa tìm kiếm | Lý do ưu tiên |
|---|---|---|---|
| 1 | **Hội Leo Núi Dinh** | "leo núi dinh hội" | 100% audience phù hợp |
| 2 | **Hội Những Con Nghiện Núi Dinh** | "nghiện núi dinh" | Community core, UGC cao |
| 3 | **Trekking & Hiking Vietnam** | "trekking hiking vietnam" | Scale lớn, nhiều câu hỏi |
| 4 | **Phượt Thủ Miền Nam** | "phượt miền nam group" | Địa lý gần, intent cao |
| 5 | **Camping & Dã Ngoại Việt Nam** | "camping dã ngoại vn" | Camping = use case nuidinh.help |

#### TIER 2 — Nhóm Liên Quan Gián Tiếp (Phân Bổ 15% Nguồn Lực)

| # | Tên nhóm | Chiến lược |
|---|---|---|
| 6 | **Chạy Trail Vietnam** | Chia sẻ thông tin trail run Núi Dinh |
| 7 | **Hành Hương Miền Nam** | Góc độ tâm linh — 100+ chùa tại Núi Dinh |
| 8 | **Saigon Healthy Lifestyle** | Frame góc "day trip wellness" từ Sài Gòn |
| 9 | **Du Lịch Bà Rịa – Vũng Tàu** | Địa phương, audience sẵn có |
| 10 | **Nhiếp Ảnh Thiên Nhiên Việt Nam** | Chia sẻ ảnh đẹp Núi Dinh, link cung đường |

#### TIER 3 — Nhóm Dự Phòng Mở Rộng (5% Nguồn Lực)

Các nhóm phượt tỉnh thành lân cận: Đồng Nai, Bình Dương, Long An — tiếp cận với content "Núi Dinh — day trip hoàn hảo cho người [tỉnh X]".

### 2.2 Chiến Lược Tiếp Cận Facebook Groups

**Nguyên tắc vàng:** Bot phải được **join nhóm thủ công trước** bởi người thật. Tài khoản phải có lịch sử tham gia tự nhiên ≥ 30 ngày trước khi bot bắt đầu hoạt động trong nhóm đó.

**Chu kỳ đăng an toàn:**
- Tối đa **1 bình luận có giá trị** mỗi ngày mỗi nhóm Tier 1
- Tối đa **3 lần/tuần** mỗi nhóm Tier 2
- Tối đa **1 lần/tuần** mỗi nhóm Tier 3
- Mỗi bài đăng chủ động (không phải reply): **1-2 lần/tuần/nhóm**

### 2.3 Threads — Phân Tích Thuật Toán & Chiến Lược

**Điểm khác biệt cốt lõi của Threads so với Facebook Groups:**
Threads ưu tiên **thảo luận dạng chuỗi (thread)** và **reply chất lượng cao**. Thuật toán không phân phối nội dung chỉ có link. Seeding tự nhiên và được chia sẻ lại (repost) bởi người thật là tín hiệu mạnh nhất.

**Lợi thế kỹ thuật:** Threads có **Official API** (Threads API v1.0) cho phép đăng bài lên đến **250 posts/24h** hoàn toàn miễn phí — không cần Playwright/Selenium, không rủi ro bị ban.

**Chiến lược nội dung Threads (Content Pillars):**
- **Pillar 1: MICRO-GUIDES (40% nội dung)**: "5 điều bạn CHƯA biết về Cung 2 Núi Dinh 🔴" -> Mỗi point là 1 thông tin thực dụng. Kết thúc: link bản đồ tương tác.
- **Pillar 2: REAL-TIME UPDATES (30% nội dung)**: "⛈️ Update mùa mưa [ngày hiện tại]: Suối Đá đang đẹp hay nguy hiểm?" -> Thông tin thực tế. Kêu gọi người leo chia sẻ lại.
- **Pillar 3: COMMUNITY QUESTIONS (20% nội dung)**: "Bạn leo Núi Dinh lần đầu, điều gì khiến bạn bất ngờ nhất?" -> Tăng tương tác, thu thập insight cho content mới.
- **Pillar 4: TIPS & HACKS (10% nội dung)**: "Mẹo tiết kiệm: Nơi gửi xe miễn phí gần trạm HBS" -> High share rate vì giá trị ngay lập tức.

**Tần suất đăng Threads:** 1-2 posts/ngày, cách nhau ≥ 6 tiếng. Tuyệt đối không đăng liên tục nhiều bài trong vòng 1 giờ.

---

## 3. KỊCH BẢN PHÂN PHỐI & MẪU NỘI DUNG

### Kịch Bản 1: Bot Phát Hiện & Trả Lời Câu Hỏi (REACTIVE BOT)

**Trigger:** Bài đăng trong nhóm chứa các từ khóa như: "núi dinh", "leo núi dinh", "đường lên núi dinh", "bãi xe núi dinh", "suối tiên", "hbs", "cung đường"...

**Keyword Matrix:**
```python
INTENT_KEYWORDS = {
    "duong_di": [
        "đường đi", "cung đường", "lối nào", "đi từ đâu",
        "cung 1", "cung 2", "cung 3", "cung 4", "tuyến xanh",
        "tuyến đỏ", "tuyến vàng", "hbs", "suối đá"
    ],
    "bai_xe": [
        "bãi xe", "gửi xe", "để xe", "đỗ xe", "gần đâu",
        "cô kiều", "cô hường", "hồ bên suối"
    ],
    "thoi_tiet": [
        "thời tiết", "mùa nào", "mùa mưa", "nước suối",
        "có trơn không", "an toàn không", "đi được chưa"
    ],
    "an_toan": [
        "cứu hộ", "khẩn cấp", "lạc đường", "bị thương",
        "số điện thoại", "liên hệ"
    ],
    "trang_bi": [
        "mang theo gì", "chuẩn bị", "giày", "nước", "đồ ăn",
        "cần gì", "lần đầu"
    ],
    "camping": [
        "cắm trại", "ngủ qua đêm", "bivouac", "lều", "nơi cắm"
    ],
    "trail_run": [
        "chạy trail", "trail run", "chạy núi", "strava",
        "gpx", "tải gpx"
    ]
}
```

**Mẫu Nội Dung — Intent: `duong_di`**
```
Chào {tên_người_hỏi} 👋 

Núi Dinh có 4 cung chính, mình tóm tắt nhanh để bạn chọn:

🔵 Cung 1 (Xanh Dương): HBS → Thiền Viện → La Bàn
   • 6km khứ hồi | 2.5-4h | Dễ-Vừa ✅ Lý tưởng cho lần đầu

🔴 Cung 2 (Đỏ): HBS → Suối Đá 5 Hồ → La Bàn  
   • 5km | 3-5h | Dễ-Trung bình ✅ Đẹp nhất, có tắm suối

🟡 Cung 3 (Vàng): HBS → Di Đà Sơn → Ống Nước → La Bàn
   • 5.5km một chiều | 2.5-4h | Nhiều chùa, tĩnh lặng

🟢 Cung 4 (Xanh Lá): HBS → Cô Kiều → Cô Hường → La Bàn
   • 9.5km khứ hồi | 4.5-6.5h | Khó nhất, cho tay leo bàn

Bản đồ tương tác + tải GPX từng cung: nuidinh.help/cac-cung-duong

Bạn đi lần đầu hay đã quen? Mình tư vấn cụ thể hơn nhé 🏔️
```

**Mẫu Nội Dung — Intent: `bai_xe`**
```
Bãi xe quanh Núi Dinh mình hay đi nhất:

🅿️ Quán Cô Kiều (Cung 4): Có cơm gà ngon, gửi xe + ăn sáng luôn
🅿️ Quán Cô Hường (Cung 4): Tương tự, gần lối vào Cung 4
🅿️ Khu vực HBS (Hồ Bên Suối): Điểm xuất phát Cung 1-2-3, có chỗ đậu  
🅿️ Thiền Viện Minh Đức: Có thể gửi xe nếu đi lễ kết hợp trekking

Lưu ý: Cuối tuần đông, nên đến trước 6h sáng để có chỗ đẹp 🕕

Danh sách đầy đủ + số điện thoại liên hệ: nuidinh.help/tien-ich
```

**Mẫu Nội Dung — Intent: `an_toan`**
```
⚠️ Số điện thoại cứu hộ Núi Dinh:

🆘 Cứu hộ Núi Dinh (địa phương): [SỐ TỪ WEBSITE]
🏥 Bệnh viện Bà Rịa gần nhất: [SỐ TỪ WEBSITE]  
🚒 PCCC huyện Châu Đức: 114

Lưu vào điện thoại trước khi leo, sóng trên núi yếu!

Đầy đủ số khẩn cấp + bản đồ điểm nguy hiểm: nuidinh.help/an-toan
```

### Kịch Bản 2: Bot Định Kỳ Chia Sẻ Nội Dung Cập Nhật (PROACTIVE BOT)

**Lịch đăng bài định kỳ:**
- **THỨ 2 — "Đầu tuần leo núi"**: Facebook: Tips nhỏ cho người lên kế hoạch cuối tuần / Threads: Poll "Cuối tuần này bạn đi cung mấy?".
- **THỨ 4 — "Cập nhật giữa tuần"**: Facebook: Update điều kiện đường (mùa mưa: thông tin nước suối) / Threads: Thread dài về 1 điểm đặc sắc trên cung đường.
- **THỨ 6 — "Hype cuối tuần"**: Facebook: Dự báo thời tiết cuối tuần + lời khuyên / Threads: Micro-guide: "Checklist 10 thứ phải mang theo".
- **CHỦ NHẬT — "UGC & Community"**: Facebook: Tổng hợp ảnh đẹp cộng đồng trong tuần / Threads: "Hỏi cộng đồng" — thu thập kinh nghiệm thực tế.

**Mẫu bài Thứ 4 — Cập nhật mùa mưa:**
```
⛈️ UPDATE ĐIỀU KIỆN ĐƯỜNG — Núi Dinh [{ngày tháng}]

Mùa mưa đã về, một số anh em hỏi tình hình nên mình cập nhật:

☑️ Cung 1 (Xanh): Đường ổn, dốc đất ướt nhưng đi được
⚠️ Cung 2 (Đỏ): Suối Đá dâng nước đẹp, nhưng đá TRƠN — đi giày bám gai là bắt buộc, không đi sandal
🚫 Cung 4 (Xanh Lá): Dốc Cô Hường trơn trượt mạnh — khuyến cáo tay leo mới chờ khô ráo

🌡️ Thời tiết cuối tuần này: Buổi sáng quang mây, chiều có mưa → Xuất phát 5h30 sáng, xuống núi trước 12h

📍 Bản đồ điểm nguy hiểm mùa mưa: nuidinh.help/an-toan

Ai vừa leo có update thực tế không? Comment xuống cho anh em biết! 👇
```

### Kịch Bản 3: Tổng Hợp UGC Hàng Tuần (UGC CURATOR BOT)

**Quy trình thu thập UGC:**
Mỗi Thứ 7, bot quét các nhóm Tier 1 để tìm bài đăng có:
- Ảnh Núi Dinh đẹp (nhận diện qua caption, không dùng CV)
- Engagement cao (≥ 10 like, ≥ 3 comment tích cực)
- Được đăng trong 7 ngày gần nhất

**Mẫu bài UGC Tổng Hợp Chủ Nhật:**
```
📸 KHOẢNH KHẮC NÚI DINH — TUẦN [{số tuần}]

Mỗi tuần cộng đồng mình lại ghi lại được những khoảnh khắc tuyệt vời trên núi. Cảm ơn các anh em đã chia sẻ! 🙏

🌄 Ảnh bình minh tuyệt đẹp của {tên_tác_giả_1}: [Tag bài gốc]
🌊 Suối Đá sau mưa của {tên_tác_giả_2}: [Tag bài gốc]  
🏕️ Góc cắm trại đêm của {tên_tác_giả_3}: [Tag bài gốc]

Cảm ơn {tên_1}, {tên_2}, {tên_3} đã góp phần làm đẹp hơn cộng đồng Núi Dinh của chúng ta! ❤️

---
Lên kế hoạch cho chuyến đi? Xem bản đồ tương tác + cung đường:
🗺️ nuidinh.help
```

> **Lưu ý pháp lý:** Luôn tag/mention tác giả gốc và chỉ dùng thông tin công khai (tên, bài đăng) từ các group công khai. Không sử dụng ảnh nếu không được tác giả cho phép tường minh.

---

## 4. GIẢI PHÁP KỸ THUẬT & KIẾN TRÚC HỆ THỐNG ($0 BUDGET)

### 4.1 Tech Stack Tổng Quan

- **Infrastructure Layer**: GitHub Actions (CI/CD + Cron, 2.000 phút/tháng miễn phí), Cloudflare Workers (API/Hooks, 100k requests/ngày miễn phí).
- **Runtime Layer**: Python 3.11+, SQLite (Local DB trong cache GHA), GitHub Secrets (biến môi trường bảo mật).
- **Tool & Library Layer**: Playwright (FB Scraping), BeautifulSoup4 (HTML Parsing), httpx (API Calls), Groq API Free (Llama 3.3 Versatile), Jinja2 Templates (Render content).

### 4.2 Module 1: Thu Thập Dữ Liệu (Data Collector)

#### 4.2.1 Thu Thập Từ Facebook Groups (Playwright)

Facebook cấm các API cào công khai. Giải pháp duy nhất miễn phí là giả lập đăng nhập bằng Cookie đã export thủ công.

```python
# collector/facebook_collector.py

import asyncio
import json
import random
from playwright.async_api import async_playwright
from datetime import datetime, timedelta
import sqlite3

KEYWORDS = [
    "núi dinh", "leo núi dinh", "cung đường", "suối tiên",
    "trail núi dinh", "camping núi dinh", "hbs núi dinh"
]

class FacebookGroupCollector:
    def __init__(self, cookies_path: str, db_path: str):
        self.cookies_path = cookies_path
        self.db_path = db_path
        
    async def init_browser(self, playwright):
        """Khởi tạo browser với profile giả lập người thật."""
        browser = await playwright.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
            ]
        )
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent=(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                "AppleWebKit/605.1.15 (KHTML, like Gecko) "
                "Version/17.0 Mobile/15E148 Safari/604.1"
            ),
            locale="vi-VN",
            timezone_id="Asia/Ho_Chi_Minh",
        )
        with open(self.cookies_path, "r") as f:
            cookies = json.load(f)
        await context.add_cookies(cookies)
        return browser, context
    
    async def scrape_group_feed(self, context, group_url: str, max_posts: int = 20):
        """Quét feed nhóm, thu thập bài đăng mới trong 24h qua."""
        page = await context.new_page()
        posts = []
        try:
            await page.goto(group_url, wait_until="domcontentloaded")
            await asyncio.sleep(random.uniform(2, 5))
            collected = 0
            scroll_count = 0
            while collected < max_posts and scroll_count < 15:
                new_posts = await page.evaluate("""
                    () => {
                        const posts = [];
                        document.querySelectorAll('[data-pagelet^="GroupFeed"] > div').forEach(el => {
                            const text = el.innerText;
                            const timeEl = el.querySelector('[data-utime]');
                            if (text && text.length > 50) {
                                posts.push({
                                    text: text.substring(0, 2000),
                                    timestamp: timeEl ? timeEl.getAttribute('data-utime') : null,
                                    url: window.location.href
                                });
                            }
                        });
                        return posts;
                    }
                """)
                for post in new_posts:
                    if self._is_relevant(post['text']) and self._is_recent(post['timestamp']):
                        posts.append(post)
                        collected += 1
                await page.evaluate("window.scrollBy(0, window.innerHeight * 0.8)")
                await asyncio.sleep(random.uniform(1.5, 4.0))
                scroll_count += 1
        except Exception as e:
            print(f"[Collector Error] {group_url}: {e}")
        finally:
            await page.close()
        return posts
    
    def _is_relevant(self, text: str) -> bool:
        text_lower = text.lower()
        return any(kw in text_lower for kw in KEYWORDS)
    
    def _is_recent(self, timestamp: str) -> bool:
        if not timestamp:
            return True
        post_time = datetime.fromtimestamp(int(timestamp))
        return datetime.now() - post_time < timedelta(hours=24)
    
    def save_to_db(self, posts: list, group_name: str):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS collected_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_name TEXT,
                post_text TEXT,
                timestamp TEXT,
                processed INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        for post in posts:
            c.execute("""
                INSERT OR IGNORE INTO collected_posts 
                (group_name, post_text, timestamp)
                SELECT ?, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1 FROM collected_posts 
                    WHERE substr(post_text, 1, 100) = substr(?, 1, 100)
                    AND created_at > datetime('now', '-7 days')
                )
            """, (group_name, post['text'], post['timestamp']))
        conn.commit()
        conn.close()
```

#### 4.2.2 Thu Thập Từ Threads (Official API)

```python
# collector/threads_collector.py

import httpx
import os

class ThreadsCollector:
    BASE_URL = "https://graph.threads.net/v1.0"
    
    def __init__(self):
        self.access_token = os.environ["THREADS_ACCESS_TOKEN"]
        self.user_id = os.environ["THREADS_USER_ID"]
    
    def search_threads(self, query: str, limit: int = 25) -> list:
        response = httpx.get(
            f"{self.BASE_URL}/threads",
            params={
                "q": query,
                "fields": "id,text,timestamp,permalink_url,username",
                "limit": limit,
                "access_token": self.access_token
            }
        )
        if response.status_code == 200:
            return response.json().get("data", [])
        return []
```

#### 4.2.3 Content Parser từ nuidinh.help (Build Knowledge Base)

```python
# collector/website_parser.py

import httpx
from bs4 import BeautifulSoup

class NuiDinhKnowledgeBase:
    PAGES = {
        "cung_duong": "https://nuidinh.help/cac-cung-duong",
        "cung_1": "https://nuidinh.help/cac-cung-duong/cung-1",
        "cung_2": "https://nuidinh.help/cac-cung-duong/cung-2",
        "cung_3": "https://nuidinh.help/cac-cung-duong/cung-3",
        "cung_4": "https://nuidinh.help/cac-cung-duong/cung-4",
        "tien_ich": "https://nuidinh.help/tien-ich",
        "an_toan": "https://nuidinh.help/an-toan",
        "home": "https://nuidinh.help",
    }
    
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.kb = {}
    
    def crawl_and_cache(self):
        for key, url in self.PAGES.items():
            try:
                r = httpx.get(url, timeout=15, follow_redirects=True)
                soup = BeautifulSoup(r.text, "html.parser")
                for tag in soup(["script", "style", "nav", "footer"]):
                    tag.decompose()
                text = soup.get_text(separator="\n", strip=True)
                self.kb[key] = {
                    "url": url,
                    "content": text[:5000],
                    "cached_at": __import__("datetime").datetime.now().isoformat()
                }
            except Exception as e:
                print(f"[KB Parser Error] {key}: {e}")
        return self.kb
```

### 4.3 Module 2: Phân Loại Intent (Intent Classifier)

```python
# processor/intent_classifier.py

import re

class IntentClassifier:
    INTENT_PATTERNS = {
        "duong_di": [
            r"cung (đường|[1-4])", r"đường (đi|lên|xuống)",
            r"(tuyến|lối|hướng).*(núi|lên)", r"đi (từ|theo) đâu",
            r"(xanh|đỏ|vàng|la bàn|hbs)", r"bao (lâu|xa|km)"
        ],
        "bai_xe": [
            r"(bãi|gửi|để|đỗ|chỗ)\s*xe", r"(xe máy|ô tô).*(đâu|gửi|để)",
            r"(cô kiều|cô hường|hồ bên suối)"
        ],
        "an_toan": [
            r"(số điện thoại|cứu hộ|khẩn cấp|liên hệ|lạc đường)",
            r"(nguy hiểm|có an toàn|cẩn thận|rủi ro)"
        ],
        "thoi_tiet": [
            r"(thời tiết|mùa|tháng nào|mưa|nắng|trơn)",
            r"(nước suối|suối có|suối đang)", r"(đi được chưa|có đi được)"
        ]
    }
    
    def classify(self, text: str) -> tuple[str, float]:
        text_lower = text.lower()
        scores = {}
        for intent, patterns in self.INTENT_PATTERNS.items():
            matches = sum(1 for p in patterns if re.search(p, text_lower, re.UNICODE))
            if matches > 0:
                scores[intent] = matches / len(patterns)
        if not scores:
            return "unknown", 0.0
        best_intent = max(scores, key=scores.get)
        return best_intent, scores[best_intent]
```

### 4.4 Module 3: Sinh Nội Dung AI (Content Generator)

```python
# generator/content_generator.py

import os
import httpx

class ContentGenerator:
    GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
    SYSTEM_PROMPT = """Bạn là một trekker nhiều kinh nghiệm tại Núi Dinh, Bà Rịa Vũng Tàu. Khi trả lời câu hỏi, hãy:
1. Cung cấp thông tin THỰC TẾ, CHÍNH XÁC dựa trên knowledge base được cung cấp
2. Viết bằng tiếng Việt tự nhiên, thân thiện như người trong cộng đồng
3. Sử dụng emoji phù hợp (không quá 5 emoji/bài)
4. Độ dài: 80-150 từ cho bình luận
5. Cuối bài: gắn link nuidinh.help/[trang-phù-hợp] một cách tự nhiên"""

    def __init__(self):
        self.groq_key = os.environ.get("GROQ_API_KEY", "")
    
    def generate_reply(self, question: str, intent: str, kb_content: dict) -> str:
        context_text = "\n\n".join([f"[{k}]: {v.get('content', '')[:800]}" for k, v in kb_content.items()])
        prompt = f"""
Câu hỏi từ thành viên nhóm: "{question}"
Intent: {intent}
Knowledge Base:
{context_text}
URL tham khảo: {list(kb_content.values())[0].get('url', 'nuidinh.help')}
Hãy viết câu trả lời ngắn gọn, hữu ích cho bình luận.
"""
        if self.groq_key:
            return self._call_groq(prompt)
        return "Bạn tham khảo cẩm nang tại nuidinh.help nhé! 🏔️"
        
    def _call_groq(self, prompt: str) -> str:
        try:
            response = httpx.post(
                self.GROQ_URL,
                headers={"Authorization": f"Bearer {self.groq_key}", "Content-Type": "application/json"},
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": self.SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 400,
                    "temperature": 0.7
                },
                timeout=30
            )
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[Groq Error]: {e}")
        return "Bạn tham khảo cẩm nang tại nuidinh.help nhé! 🏔️"
```

### 4.5 Module 4: Phân Phối Nội Dung (Publisher)

#### 4.5.1 Threads Publisher (Meta API - Rất an toàn)

```python
# publisher/threads_publisher.py

import httpx
import os
import time
import random

class ThreadsPublisher:
    BASE_URL = "https://graph.threads.net/v1.0"
    
    def __init__(self):
        self.access_token = os.environ["THREADS_ACCESS_TOKEN"]
        self.user_id = os.environ["THREADS_USER_ID"]
        
    def create_text_post(self, text: str) -> str | None:
        container_resp = httpx.post(
            f"{self.BASE_URL}/{self.user_id}/threads",
            params={"media_type": "TEXT", "text": text[:500], "access_token": self.access_token}
        )
        if container_resp.status_code != 200:
            return None
        container_id = container_resp.json().get("id")
        time.sleep(30 + random.uniform(5, 15)) # Meta docs yêu cầu delay
        publish_resp = httpx.post(
            f"{self.BASE_URL}/{self.user_id}/threads_publish",
            params={"creation_id": container_id, "access_token": self.access_token}
        )
        return publish_resp.json().get("id") if publish_resp.status_code == 200 else None
```

#### 4.5.2 Facebook Group Publisher (Playwright - Rủi ro cao, cần delay ngẫu nhiên lớn)

```python
# publisher/facebook_publisher.py

import asyncio
import random
from playwright.async_api import async_playwright
import json

class FacebookGroupPublisher:
    def __init__(self, cookies_path: str):
        self.cookies_path = cookies_path
        
    async def post_comment(self, post_url: str, comment_text: str) -> bool:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={"width": 390, "height": 844},
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS]"
            )
            with open(self.cookies_path) as f:
                await context.add_cookies(json.load(f))
            page = await context.new_page()
            try:
                await page.goto(post_url, wait_until="networkidle")
                await asyncio.sleep(random.uniform(5, 15)) # Giả lập đọc bài
                comment_box = await page.wait_for_selector('[data-testid="UFI2CommentFormText"]', timeout=10000)
                await comment_box.click()
                for char in comment_text:
                    await page.keyboard.type(char)
                    await asyncio.sleep(random.uniform(0.03, 0.12)) # Gõ chậm giả lập người
                await asyncio.sleep(random.uniform(2, 5))
                await page.keyboard.press("Enter")
                await asyncio.sleep(3)
                return True
            except Exception as e:
                print(f"[FB Publisher Error]: {e}")
                return False
            finally:
                await browser.close()
```

### 4.6 Tự Động Hóa: GitHub Actions Workflow

```yaml
# .github/workflows/collect_and_process.yml
name: Collect & Process FB/Threads Posts

on:
  schedule:
    - cron: '0 1,3,5,7,9,11,13,15 * * *' # Chạy mỗi 2 tiếng (giờ VN)
  workflow_dispatch:

jobs:
  collect_and_post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install playwright beautifulsoup4 httpx jinja2
          playwright install chromium --with-deps
      - name: Restore DB cache
        uses: actions/cache@v4
        with:
          path: data/nuidinh_bot.db
          key: nuidinh-db-${{ hashFiles('data/nuidinh_bot.db') }}
          restore-keys: nuidinh-db-
      - name: Write cookies
        run: echo '${{ secrets.FB_COOKIES_JSON }}' > data/fb_cookies.json
      - name: Run bot pipeline
        env:
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
          THREADS_ACCESS_TOKEN: ${{ secrets.THREADS_ACCESS_TOKEN }}
          THREADS_USER_ID: ${{ secrets.THREADS_USER_ID }}
        run: python -m bot.run_collector
```

### 4.7 UTM Link Builder

```python
# utils/utm_builder.py
from urllib.parse import urlencode, urlparse, urlunparse

def build_utm_link(base_url: str, source: str, medium: str, campaign: str) -> str:
    params = {
        "utm_source": source,
        "utm_medium": medium,
        "utm_campaign": campaign.lower().replace(" ", "_"),
    }
    parsed = urlparse(base_url)
    query = urlencode(params)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, query, parsed.fragment))
```

---

## 5. RỦI RO VÀ BIỆN PHÁP PHÒNG TRÁNH

### 5.1 Ma Trận Rủi Ro

| Rủi Ro | Xác Suất | Tác Động | Biện pháp giảm thiểu |
|---|---|---|---|
| Checkpoint/Tạm khóa tài khoản FB | Cao | Cao | Bắt buộc warm-up tài khoản 30 ngày. Thiết lập delay ngẫu nhiên lớn (15-45 phút). |
| Bị admin nhóm kick & report | Trung bình | Trung bình | Luôn áp dụng triết lý "Value-First". Cung cấp câu trả lời hữu ích trước khi gắn link. |
| Bị shadowban (giảm reach) | Trung bình | Trung bình | Không dùng lặp lại một mẫu câu. Giới hạn tần suất đăng dưới mức an toàn. |

### 5.2 Nuôi Tài Khoản & Warm-up (Chi tiết)

1. **Tuần 1-2**: Đăng nhập thủ công, scroll feed, like dạo, tham gia 1 nhóm/ngày. Tuyệt đối không đăng bài hoặc bình luận có link.
2. **Tuần 3**: Bình luận ngắn không kèm link (2-3 câu, tương tác bình thường).
3. **Tuần 4**: Bắt đầu bình luận có giá trị, chèn tối đa 1 link/tuần để test.
4. **Sau 30 ngày**: Chạy bot tự động nhưng giới hạn tối đa 5-8 bình luận/ngày.

---

## 6. LỘ TRÌNH TRIỂN KHAI & KPI ĐO LƯỜNG

### Giai đoạn 1: Chuẩn Bị & Test (Tuần 1-4)
- Setup repo GitHub Private, cấu hình Secrets.
- Tạo và lấy mã thông báo của Threads API (Meta Developers).
- Viết và kiểm thử các file script Python chạy thử nghiệm cục bộ (Local Dry-run).
- Warm-up tài khoản Facebook thủ công.

### Giai đoạn 2: Chạy Có Giám Sát (Tháng 2-3)
- **Hệ thống Human-in-the-Loop**: Bot cào thông tin và soạn sẵn nội dung trả lời -> Gửi duyệt qua Telegram bot -> Người dùng nhấn nút Approve trên Telegram -> Bot mới tiến hành đăng.
- Chỉ đăng 1 bài/ngày trên Threads và 2-3 bình luận/ngày trên FB Groups.

### Giai đoạn 3: Tự Động Hóa Hoàn Toàn (Tháng 4+)
- Tự động hóa hoàn toàn qua GitHub Actions Cron.
- Triển khai thuật toán kiểm tra độ trùng lặp (Cosine Similarity) để chặn spam trùng nội dung.
- Báo cáo KPI tự động về Google Sheet.

---

## 7. LƯU Ý QUAN TRỌNG KHI TRIỂN KHAI

### Về rủi ro pháp lý & Điều khoản dịch vụ:
Facebook nghiêm cấm việc dùng bot tự động tương tác trong các nhóm công khai thông qua tài khoản cá nhân giả lập. Do đó:
- 🟢 **Kênh Threads**: Hoàn toàn an toàn do dùng API chính thức của Meta cung cấp. Nên ưu tiên phát triển trước.
- 🟡 **Kênh Facebook Giai đoạn đầu**: Khuyến nghị dùng cơ chế **Semi-Automated (AI soạn bài - Người đăng)**. Bot sẽ quét và soạn sẵn nội dung rồi gửi về Telegram của bạn, bạn chỉ cần copy và paste vào nhóm bằng tài khoản thật của mình. Đây là giải pháp an toàn tuyệt đối cho tài khoản.
- 🔴 **Kênh Facebook Tự động hóa**: Chỉ chạy hoàn toàn tự động bằng Playwright khi đã chuẩn bị sẵn các tài khoản clone dự phòng và chấp nhận rủi ro bị khóa.

---
*Tài liệu được tạo vào 06/2026 cho dự án nuidinh.help.*
*Bản quyền thuộc về nuidinh.help. Lưu hành nội bộ.*
