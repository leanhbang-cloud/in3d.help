# Kế Hoạch Triển Khai (Bản Cuối) - NGƯNG TRIỂN KHAI
# Hướng 2 + Phương Án D: Group Monitoring Bot + Fanpage Automation
# Hệ Thống Kéo Traffic → nuidinh.help

> [!CAUTION]
> **TRẠNG THÁI: KHÔNG KHẢ THI (DEPRECATED)**
> Kế hoạch tự động hóa Facebook bằng Bot đã được **hủy bỏ** sau khi đánh giá kỹ lưỡng các rào cản kỹ thuật (Meta khóa API của Groups, nguy cơ bị ban tài khoản cao khi dùng công cụ lách luật và chi phí vận hành không hiệu quả).
> Dự án quyết định ngừng triển khai phần này và chuyển nguồn lực sang các tính năng cốt lõi khác. Tài liệu này chỉ lưu giữ cho mục đích tham khảo lịch sử.

> **Đã chốt (Lịch sử):** Hướng 2 (Group Monitoring Bot — ưu tiên #1) + Phương án D (Fanpage Hybrid — ưu tiên #2)
> **Phiên bản:** 2.0 | **Ngày:** 28/06/2026
> **Triển khai:** Mac mini (Bangs-Mac-mini.local / 100.65.105.59)

---

## 1. Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MAC MINI (Production Server)                    │
│                                                                         │
│  ╔═══════════════════════════════════════════════════════╗               │
│  ║  ƯU TIÊN #1: GROUP MONITORING BOT                    ║               │
│  ║  (Kéo traffic trực tiếp — triển khai Tuần 1)         ║               │
│  ║                                                       ║               │
│  ║  group_monitor.py                                     ║               │
│  ║    └─ Quét 20 groups trekking công khai mỗi 15 phút  ║               │
│  ║    └─ Lọc bài theo keyword (Núi Dinh, trekking...)   ║               │
│  ║    └─ Gọi OpenAI gợi ý comment phù hợp               ║               │
│  ║    └─ Gửi alert Telegram kèm link + gợi ý comment    ║               │
│  ║                                                       ║               │
│  ║  → Bạn nhận Telegram → click link → comment tay       ║               │
│  ╚═══════════════════════════════════════════════════════╝               │
│                                                                         │
│  ┌───────────────────────────────────────────────────────┐               │
│  │  ƯU TIÊN #2: FANPAGE AUTOMATION (Phương án D)         │               │
│  │  (Xây nền tảng nội dung — triển khai Tuần 3–6)       │               │
│  │                                                       │               │
│  │  PYTHON (Lõi Facebook)          n8n (Hỗ trợ)         │               │
│  │  ├─ content_generator.py        ├─ weather_alert      │               │
│  │  ├─ facebook_publisher.py       ├─ weekly_report      │               │
│  │  ├─ comment_monitor.py          ├─ error_notifier     │               │
│  │  └─ scheduler.py                └─ calendar_sync      │               │
│  └───────────────────────────────────────────────────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Cấu Trúc Thư Mục Dự Án

```
nuidinh-fb-automation/
├── README.md
├── requirements.txt
├── .env                          # Tokens, API keys, Telegram bot token
├── main.py                       # Entry point
│
├── modules/
│   ├── __init__.py
│   │
│   │  # ƯU TIÊN #1 — Group Monitoring
│   ├── group_monitor.py          # Quét groups + alert Telegram
│   ├── comment_suggester.py      # AI gợi ý comment
│   │
│   │  # ƯU TIÊN #2 — Fanpage Automation
│   ├── content_generator.py      # CrewAI tạo nội dung
│   ├── facebook_publisher.py     # Graph API đăng bài
│   ├── comment_monitor.py        # Auto-reply trên Page
│   └── scheduler.py              # Lịch + orchestrator
│
├── config/
│   ├── target_groups.yaml        # 20 groups trekking mục tiêu
│   ├── keywords.yaml             # Từ khóa theo dõi
│   ├── comment_templates.yaml    # Template comment theo tình huống
│   ├── prompts.yaml              # Prompt cho AI tạo content
│   ├── triggers.yaml             # Trigger auto-reply Fanpage
│   ├── schedule.yaml             # Lịch đăng bài
│   └── knowledge_base.yaml       # Thông tin Núi Dinh chính xác
│
├── data/
│   ├── seen_posts.json           # Bài đã quét (tránh duplicate)
│   ├── posts_log.json            # Log bài đăng Fanpage
│   └── replies_log.json          # Log reply
│
├── n8n/
│   ├── weather_alert.json
│   ├── weekly_report.json
│   ├── error_notifier.json
│   └── content_calendar_sync.json
│
├── scripts/
│   ├── setup.sh
│   ├── start.sh
│   └── health_check.sh
│
└── tests/
    ├── test_group_monitor.py
    ├── test_publisher.py
    └── test_content.py
```

---

## 3. Ưu Tiên #1 — Group Monitoring Bot (Chi Tiết)

### Module: group_monitor.py

**Luồng xử lý:**

```
[Cron mỗi 15 phút] 
    → Quét RSS/public feed của 20 groups
    → Lọc bài chứa keyword
    → Kiểm tra seen_posts.json (tránh alert trùng)
    → Gọi comment_suggester.py tạo gợi ý comment
    → Gửi alert Telegram
    → Ghi bài vào seen_posts.json
```

### Module: comment_suggester.py

**Luồng xử lý:**

```
[Nhận nội dung bài viết từ group]
    → Phân loại: hỏi đường? hỏi thời tiết? tìm bạn đi? review?
    → Đọc knowledge_base.yaml (thông tin Núi Dinh)
    → Đọc comment_templates.yaml (mẫu theo tình huống)
    → Gọi OpenAI: "Viết comment hữu ích cho bài này, 
       giọng trekker thân thiện, tự nhiên, 
       gợi ý tham khảo nuidinh.help nếu phù hợp"
    → Trả về 2 phiên bản comment (ngắn + dài)
```

### Config: target_groups.yaml (Mẫu)

```yaml
groups:
  - name: "Trekking Miền Nam"
    url: "https://www.facebook.com/groups/trekkingmiennam"
    type: public
    priority: high
    
  - name: "Phượt Sài Gòn"
    url: "https://www.facebook.com/groups/phuotsaigon"
    type: public
    priority: high
    
  - name: "Cắm Trại Việt Nam"
    url: "https://www.facebook.com/groups/camtraivietnam"
    type: public
    priority: medium

  # ... thêm 17 groups nữa
```

### Config: comment_templates.yaml (Mẫu)

```yaml
templates:
  asking_about_nui_dinh:
    context: "Người hỏi về cung đường, kinh nghiệm Núi Dinh"
    example: >
      Mình mới đi Núi Dinh tuần trước nè! Cung này đẹp lắm 
      nhưng mùa mưa hơi trơn, nhớ mang giày grip tốt. 
      Có trang nuidinh.help có bản đồ offline + GPS khá 
      xịn, mình tải về xài được cả khi mất sóng 🗺️

  asking_about_safety:
    context: "Người hỏi về an toàn, mang gì, chuẩn bị gì"
    example: >
      Đi Núi Dinh nhớ mang đủ nước (ít nhất 2L/người), 
      đèn pin dự phòng, và save sẵn số cứu hộ. 
      Trang nuidinh.help/an-toan có checklist đầy đủ, 
      đọc trước khi đi bạn nhé! 🏔️

  looking_for_group:
    context: "Người tìm bạn đi cùng cuối tuần"
    example: >
      Núi Dinh cuối tuần này thời tiết đẹp lắm! 
      Check dự báo ở nuidinh.help/thoi-tiet trước khi 
      lên lịch nhé, mùa này hay mưa chiều 🌦️
```

### Telegram Alert Format (Mẫu)

```
🔔 BÀI MỚI LIÊN QUAN NÚI DINH

📌 Group: Trekking Miền Nam
👤 Người đăng: Nguyễn Văn A
📝 Nội dung: "Cuối tuần này có ai đi Núi Dinh không? 
   Lần đầu đi cần chuẩn bị gì ạ?"
🔗 Link: https://fb.com/groups/...

💬 Gợi ý comment (ngắn):
"Núi Dinh đẹp lắm! Nhớ mang giày grip tốt, 2L nước, 
đèn pin. Check nuidinh.help/an-toan có checklist đầy đủ 🏔️"

💬 Gợi ý comment (dài):
"Chào bạn! Mình đi Núi Dinh mấy lần rồi, chia sẻ nè: 
[chi tiết hơn + gợi ý nuidinh.help]"
```

### Crontab cho Group Monitor

```bash
# Quét groups mỗi 15 phút (7:00 sáng – 22:00 tối)
*/15 7-22 * * * cd /path/to/project && python main.py monitor-groups
```

---

## 4. Lộ Trình Triển Khai (Đã Điều Chỉnh Ưu Tiên)

### Giai đoạn 0 — Chuẩn bị (Tuần 1, nửa đầu)

| # | Việc | Ai | Thời gian |
|---|---|---|---|
| 0.1 | Tạo Telegram Bot (dùng BotFather) | Bang | 10 phút |
| 0.2 | Liệt kê 20 groups trekking công khai mục tiêu | Bang | 1 giờ |
| 0.3 | Viết `knowledge_base.yaml` — thông tin Núi Dinh | Bang | 2 giờ |
| 0.4 | Viết `comment_templates.yaml` — 10 mẫu comment | Bang | 1 giờ |
| 0.5 | Đăng ký OpenAI API key | Bang | 15 phút |

### Giai đoạn 1A — Group Monitoring Bot (Tuần 1, nửa sau → Tuần 2)

| # | Việc | Thời gian |
|---|---|---|
| 1A.1 | Khởi tạo repo trên Mac mini | 30 phút |
| 1A.2 | Code `group_monitor.py` (quét groups + lọc keyword) | 1 ngày |
| 1A.3 | Code `comment_suggester.py` (AI gợi ý comment) | 0.5 ngày |
| 1A.4 | Tích hợp Telegram Bot API để gửi alert | 0.5 ngày |
| 1A.5 | Test 3 ngày + tinh chỉnh keyword/template | 3 ngày |
| **KPI:** | Nhận alert Telegram ≥5 bài phù hợp/ngày, gợi ý comment chất lượng | |

### Giai đoạn 1B — Fanpage Setup (Song song với 1A)

| # | Việc | Ai | Thời gian |
|---|---|---|---|
| 1B.1 | Tạo Facebook Page "Núi Dinh — Trekking An Toàn" | Bang | 30 phút |
| 1B.2 | Đăng ký Meta Developer Account | Bang | 30 phút |
| 1B.3 | Đăng 10–15 bài seed content thủ công | Bang | 3–5 giờ |

### Giai đoạn 2 — Fanpage Automation (Tuần 3–6)

| # | Việc | Thời gian |
|---|---|---|
| 2.1 | Lấy Page Access Token (System User) | 1 giờ |
| 2.2 | Code `facebook_publisher.py` | 1 ngày |
| 2.3 | Code `comment_monitor.py` (auto-reply trên Page) | 2 ngày |
| 2.4 | Code `content_generator.py` (CrewAI) | 2 ngày |
| 2.5 | Code `scheduler.py` + crontab | 1 ngày |
| 2.6 | Setup 4 n8n workflows hỗ trợ | 1 ngày |
| 2.7 | Test sandbox 7 ngày | 1 tuần |

### Giai đoạn 3 — Tối ưu + Mở rộng (Tháng 2–6)

- Tinh chỉnh keyword, template, prompt dựa trên dữ liệu thực.
- Thêm groups mới vào danh sách.
- Mở rộng sang Instagram.
- Facebook Ads nhỏ boost bài organic tốt.

---

## 5. Chi Phí Tổng Hợp

| Hạng mục | Chi phí/tháng | Ghi chú |
|---|---|---|
| Mac mini (đã có) | 0 | Server chạy cả 2 kênh |
| OpenAI API | ~200k–400k | Gợi ý comment + tạo content |
| Telegram Bot | 0 | Miễn phí |
| n8n (Docker, self-hosted) | 0 | Chạy trên Mac mini |
| Meta Graph API | 0 | Miễn phí |
| **Tổng** | **~200k–400k/tháng** | |

---

## 6. Checklist Bàn Giao Cho Session Mac Mini

Khi bắt đầu session trên Mac mini, thực hiện theo thứ tự:

**Bước 1 — Môi trường:**
- [ ] Cài Python 3.11+ (nếu chưa có)
- [ ] Tạo thư mục dự án: `mkdir -p ~/projects/nuidinh-fb-automation`
- [ ] Tạo virtualenv: `python3 -m venv venv && source venv/bin/activate`
- [ ] Cài dependencies: `pip install openai requests pyyaml python-dotenv python-telegram-bot`

**Bước 2 — Config:**
- [ ] Tạo Telegram Bot qua BotFather → lấy BOT_TOKEN
- [ ] Tạo file `.env` với: `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- [ ] Viết `config/target_groups.yaml` (20 groups)
- [ ] Viết `config/keywords.yaml`
- [ ] Viết `config/comment_templates.yaml`
- [ ] Viết `config/knowledge_base.yaml`

**Bước 3 — Code (Ưu tiên #1):**
- [ ] Code `modules/group_monitor.py`
- [ ] Code `modules/comment_suggester.py`
- [ ] Test chạy thủ công: `python main.py monitor-groups`
- [ ] Setup crontab chạy mỗi 15 phút
- [ ] Verify: nhận được alert Telegram đầu tiên

**Bước 4 — Code (Ưu tiên #2, sau khi #1 chạy ổn):**
- [ ] Lấy Facebook Page Access Token
- [ ] Code các module Fanpage
- [ ] Setup n8n qua Docker
