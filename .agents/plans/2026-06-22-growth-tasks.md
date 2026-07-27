# Bảng Quản Lý Task — nuidinh.help Growth Roadmap

> **Ngày tạo**: 2026-06-22
> **Trạng thái tổng thể**: Đang thực hiện Phase 2D (WS-2)
> 
> File này dùng để theo dõi tiến độ của từng task trong kế hoạch phát triển nuidinh.help. 
> Định dạng ký hiệu:
> - `[ ]` Chưa thực hiện
> - `[/]` Đang thực hiện
> - `[x]` Đã hoàn thành

---

## 🏔️ WS-1: TECHNICAL FOUNDATION (SEO & Performance)
*Mục tiêu: Đặt nền tảng kỹ thuật để Google index và rank trang web tốt nhất.*

### Phase 1A: Technical SEO Foundation
- [x] **1A-01**: Setup Google Search Console (Verify domain `nuidinh.help` qua DNS TXT Cloudflare)
- [x] **1A-02**: Setup Bing Webmaster Tools
- [x] **1A-03**: Cấu hình tự động tạo `sitemap.xml` bằng `@astrojs/sitemap`
- [x] **1A-04**: Thêm FAQ Schema Markup cho các trang cung đường (Cung Xanh, Cung Đỏ, Cung Vàng...)
- [x] **1A-05**: Thêm BreadcrumbList Schema Markup để làm rõ cấu trúc trang
- [x] **1A-06**: Thêm LocalBusiness Schema Markup cho các bãi xe (Cô Kiều, Cô Hường...), quán ăn chân núi
- [x] **1A-07**: Tạo Image Sitemap giúp index hình ảnh vào Google Images
- [x] **1A-08**: Bổ sung Meta tags SEO đầy đủ (Title, Description, OG tags, Twitter cards) cho toàn bộ các trang hiện có
- [x] **1A-09**: Cấu hình Canonical URLs trên mọi trang để tránh lỗi trùng lặp nội dung
- [x] **1A-10**: Kiểm tra và tối ưu hóa file `robots.txt`

### Phase 1B: Performance Optimization
- [x] **1B-01**: Chạy Core Web Vitals audit qua PageSpeed Insights, ghi nhận baseline ban đầu
- [x] **1B-02**: Tối ưu LCP (Largest Contentful Paint) — tối ưu ảnh hero (sử dụng `<picture>` kèm WebP/AVIF và thuộc tính fetchpriority="high")
- [x] **1B-03**: Triệt tiêu CLS (Cumulative Layout Shift) — gán kích thước width/height cố định cho tất cả hình ảnh/iframe
- [x] **1B-04**: Lazy load gallery ảnh & khu vực comment (chỉ tải dữ liệu khi người dùng cuộn đến)
- [x] **1B-05**: Cấu hình Caching headers tối ưu trên Cloudflare (static assets cache dài hạn, API cache ngắn hạn)
- [x] **1B-06**: Tích hợp Cloudflare Web Analytics (công cụ miễn phí, không cookie, nhẹ và an toàn quyền riêng tư)

### Phase 1C: PWA & Offline
- [ ] **1C-01**: Tạo file Web App Manifest (`manifest.json`) với đầy đủ metadata, màu sắc chủ đạo và bộ icon
- [ ] **1C-02**: Viết Service Worker script (`sw.js`) để tự động cache các tài nguyên tĩnh quan trạng (CSS, JS, Fonts, logo)
- [ ] **1C-03**: Triển khai chiến lược cache phù hợp (Stale-While-Revalidate cho trang thông tin và Cache-First cho ảnh/assets tĩnh)
- [ ] **1C-04**: Thiết kế trang Offline Fallback (`/offline`) hiển thị khi mất mạng hoàn toàn và chưa có cache trang yêu cầu
- [ ] **1C-05**: Đăng ký Service Worker trong component Layout chung của trang web
- [ ] **1C-06**: Kiểm thử offline mode trên các thiết bị di động thực tế và qua Chrome DevTools

---

## 📝 WS-2: CONTENT ENGINE (Blog & Pillar Pages)
*Mục tiêu: Xây dựng hệ thống blog nội bộ và sản xuất nội dung leo núi chất lượng để phủ từ khóa.*

### Phase 2A: Blog Infrastructure (Tích hợp tại Repo hiện tại)
- [x] **2A-01**: Khởi tạo Astro Content Collections cho Blog (`src/content/blog/` sử dụng schema MDX)
- [x] **2A-02**: Thiết kế layout & UI trang bài viết chi tiết (kèm sidebar, mục lục, bài viết liên quan)
- [x] **2A-03**: Xây dựng trang danh sách bài viết `/blog` đẹp mắt, phân loại theo danh mục
- [x] **2A-04**: Tích hợp Article Schema Markup (author, datePublished, dateModified) cho từng bài viết blog
- [x] **2A-05**: Viết Component gợi ý bài viết liên quan dựa trên tag/category để tăng internal link
- [x] **2A-06**: Tạo RSS feed tự động (`/rss.xml`) cho blog bằng `@astrojs/rss`

### Phase 2B: Content Sprint #1 (Sản xuất bằng Genspark + Chất liệu từ anh Bang)
- [x] **2B-01**: Bài viết 1: *Trekking Núi Dinh mùa mưa: Có nên đi không & cần lưu ý gì?* (Từ khóa: `núi dinh mùa mưa`)
- [x] **2B-02**: Bài viết 2: *So sánh chi tiết: Trekking Núi Dinh vs Chứa Chan vs Bà Đen* (Từ khóa: `núi dinh hay chứa chan`)
- [x] **2B-03**: Bài viết 3: *Camping qua đêm trên Đỉnh La Bàn: Hướng dẫn từ A-Z* (Từ khóa: `cắm trại núi dinh`)
- [x] **2B-04**: Bài viết 4: *Checklist chuẩn bị trekking Núi Dinh: 27 món đồ không thể thiếu* (Từ khóa: `đi núi dinh cần chuẩn bị gì`)

### Phase 2C: Content Sprint #2
- [x] **2C-01**: Bài viết 5: *Review top 5 quán gà nướng lòng đào ngon nhất chân Núi Dinh* (Từ khóa: `quán ăn núi dinh`)
- [x] **2C-02**: Bài viết 6: *Hướng dẫn các cách di chuyển từ TP.HCM đến Núi Dinh chi tiết* (Từ khóa: `đường đi núi dinh từ TPHCM`)
- [x] **2C-03**: Bài viết 7: *An toàn sinh tồn trên Núi Dinh: Những điều cần biết* (Từ khóa: `núi dinh có rắn không`)
- [x] **2C-04**: Bài viết 8: *Suối Tiên & Suối Đá Núi Dinh: Bản đồ tọa độ chi tiết* (Từ khóa: `suối tiên núi dinh`)

### Phase 2D: Pillar Pages (Trang cột trụ xây dựng Authority)
- [ ] **2D-01**: Xây dựng Pillar Page: *Trekking Núi Dinh: Cẩm Nang Toàn Diện* (`/trekking-nui-dinh/` — quy mô 3.000-5.000 từ)
- [ ] **2D-02**: Xây dựng Pillar Page: *Chùa Núi Dinh: Hướng dẫn Hành hương từ A-Z* (`/chua-nui-dinh/` — quy mô 2.000-3.000 từ)

---

## 🎮 WS-3: UGC ENHANCEMENT (Gamification & Tương tác)
*Mục tiêu: Thúc đẩy người dùng đóng góp nội dung, tạo vòng lặp UGC tăng trưởng tự nhiên.*

### Phase 3A: Gamification & Thúc đẩy đóng góp
- [ ] **3A-01**: Xây dựng hệ thống Huy hiệu Trekker dựa trên số lượng ảnh/bình luận đã được duyệt (🌱 -> 🥾 -> 📸 -> 🏔️ -> ⭐)
- [ ] **3A-02**: Feature "Ảnh Đẹp Trong Tuần" — tự động chọn hoặc admin chọn hiển thị trên trang chủ
- [ ] **3A-03**: Thêm nút "Hữu ích" (Upvote) cho bình luận & cơ chế ghim bình luận chất lượng nhất lên đầu
- [ ] **3A-04**: Xây dựng trang "Thử thách 4 Cung đường Núi Dinh" cho phép check-in ảo và nhận huy hiệu ảo

### Phase 3B: UGC-Powered SEO Features
- [ ] **3B-01**: Chuyển đổi cơ chế render comment sang SSR (Server-Side Rendering) để Googlebot có thể cào nội dung bình luận
- [ ] **3B-02**: Widget "Tình hình thực tế mới nhất" hiển thị 3-5 bình luận mới nhất của trekker tại mỗi trang thông tin cung đường
- [ ] **3B-03**: Tạo trang Nhật ký hành trình `/nhat-ky` hiển thị timeline các cập nhật, ảnh và feedback mới nhất từ cộng đồng
- [ ] **3B-04**: Auto-generate Alt Text thân thiện với SEO cho ảnh UGC từ nội dung mô tả của người dùng
- [ ] **3B-05**: Tạo banner kêu gọi đóng góp thông minh (ví dụ: phát hiện user đã đọc hết bài viết -> hiển thị pop-up nhỏ gợi ý chia sẻ ảnh)

---

## 📱 WS-4: DISTRIBUTION (Social & Community)
*Mục tiêu: Đưa nội dung nuidinh.help tiếp cận đúng tệp khách hàng tiềm năng trên mạng xã hội.*
*(Phần lớn là công việc thủ công, anh Bang tự thực hiện)*

### Phase 4A: Facebook Groups Strategy
- [ ] **4A-01**: Gia nhập từ 5-8 Facebook Groups chuyên leo núi, phượt và cắm trại quanh Sài Gòn
- [ ] **4A-02**: Chia sẻ bài viết giá trị (value-first) định kỳ 2-3 bài/tuần lên các group, đính kèm link nuidinh.help làm nguồn tham khảo chi tiết
- [ ] **4A-03**: Trực chiến trả lời các câu hỏi về Núi Dinh trong nhóm và dẫn link về trang web
- [ ] **4A-04**: Tiếp cận và nhờ 10-15 phượt thủ thường đi Núi Dinh đóng góp ảnh & bình luận mồi trên trang web

### Phase 4B: TikTok & Zalo OA
- [ ] **4B-01**: Thiết lập kênh TikTok `@nuidinh.help` và đăng tải 2-3 video ngắn giới thiệu cung đường kèm link website trên bio
- [ ] **4B-02**: Tạo trang Zalo Official Account cho nuidinh.help để gửi tin tức về du lịch tâm linh, hành hương chùa Núi Dinh
- [ ] **4B-03**: Tổ chức Hashtag challenge `#NuiDinhMoment` trên TikTok để thu hút người tham gia chia sẻ video hành trình

---

## 🤝 WS-5: LOCAL PARTNERSHIPS (Offline sang Online)
*Mục tiêu: Hợp tác với các hộ kinh doanh địa phương để kéo traffic thực địa.*

### Phase 5A: QR Code Partners (Thực địa)
- [ ] **5A-01**: Thiết kế và in ấn 10 tấm bảng QR Code giới thiệu nuidinh.help (đã ép plastic)
- [ ] **5A-02**: Đặt bảng QR Code tại bãi xe Cô Kiều, Cô Hường kèm lời kêu gọi check-in cung đường
- [ ] **5A-03**: Đặt standee QR Code nhỏ tại các bàn ăn của các quán gà nướng chân núi
- [ ] **5A-04**: Liên hệ hợp tác chéo với các đơn vị tổ chức camping tự phát trên Đỉnh La Bàn
- [ ] **5A-05**: Cấu hình UTM Tracking cụ thể cho từng QR Code địa điểm (`?utm_source=co-kieu`, `?utm_source=ga-nuong`...) để đo lường hiệu quả

### Phase 5B: Digital Footprint
- [ ] **5B-01**: Cập nhật thông tin nuidinh.help lên các địa điểm nổi tiếng trên Google Maps (Thêm link web vào mô tả địa điểm)
- [ ] **5B-02**: Tạo và tối ưu hóa 4 cung đường Núi Dinh trên ứng dụng AllTrails, gắn link dẫn về bài viết chi tiết của website
- [ ] **5B-03**: Tiếp cận các trang blog du lịch lớn đang xếp hạng bài viết về Núi Dinh để đề xuất trao đổi liên kết (backlink)
