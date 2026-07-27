# KẾT QUẢ CRAWL VÀ PHÂN TÍCH THÔ TỪ GENSPARK (RAW OUTPUTS)

Tài liệu này lưu trữ toàn bộ nội dung phân tích thô thu thập được từ Genspark cho hai địa chỉ tham chiếu:
1. Bản đồ & Sa bàn Haravan Trail Station Navigator
2. Link GPX 4 cung đường Núi Dinh trên website Thế Giới Chạy Bộ

---

## PHẦN 1: PHÂN TÍCH CHI TIẾT TRAIL STATION NAVIGATOR
**URL tham chiếu:** `https://trail-station-navigator.myharavan.com/?track=dinh_45k_discovery&hours=11&mins=0&date=2026-06-27&view=detail`

### 1.1. Tổng quan thông số kỹ thuật (Metrics Summary)
Trang trình bày một hệ thống **6 thẻ thông số tổng quan (Metric Cards)** được bố trí dạng grid responsive (`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`), mỗi thẻ chứa ba lớp thông tin: nhãn (label), giá trị chính (value), và chú thích phụ (sub-text). Cụ thể các thông số được hiển thị bao gồm:
- **Quãng đường:** 42.97 km — Tổng cự ly toàn bộ cung đường.
- **Tổng leo (D+):** +2,196 m — Tổng chiều cao tích lũy lên.
- **Tổng xuống (D-):** -2,195 m — Tổng chiều cao tích lũy xuống.
- **Dự kiến hoàn thành:** 11h00m — Thời gian mục tiêu do người dùng nhập qua URL parameter (`hours=11&mins=0`).
- **Độ cao tối đa:** 485 m — Điểm cao nhất trên cung đường.
- **Độ khó tổng thể:** "Khó" — Được tính toán dựa trên phân tích độ dốc trung bình.

### 1.2. Bảng phân tích chi tiết từng chặng (Segment Table)
Bảng dữ liệu chia cung đường thành **7 chặng** (segments), tương ứng với các điểm checkpoint thực tế trên đường trail:
- **Chặng 1:** Water Station 01 – Ngọc Sơn Dinh | 5.39 km | +150m / -133m | 2.8% | Trung bình | ~1h08m (12:39/km) | Lũy kế: 1h08m
- **Chặng 2:** Water Station 02 – Má Kiều | 8.00 km | +445m / -449m | 5.6% | Khó | ~2h08m (16:07/km) | Lũy kế: 3h17m
- **Chặng 3:** CP 01 – Cầu Suối Tiên | 3.18 km | +281m / -59m | 8.8% | Khó | ~57m43s (18:07/km) | Lũy kế: 4h14m
- **Chặng 4:** Water Station 03 – Xanh lá | 6.53 km | +413m / -350m | 6.3% | Khó | ~1h49m (16:46/km) | Lũy kế: 6h04m
- **Chặng 5:** CP 02 – Ong Rừng | 3.42 km | +145m / -144m | 4.3% | Trung bình | ~49m36s (14:30/km) | Lũy kế: 6h53m
- **Chặng 6:** Water Station 04 – Hồ Đá Xanh | 4.12 km | +61m / -338m | 1.5% | Dễ | ~53m37s (13:01/km) | Lũy kế: 7h47m
- **Chặng 7:** Finish – Về đích | 12.32 km | +635m / -643m | 5.2% | Trung bình | ~3h12m (15:37/km) | Lũy kế: 11h00m

### 1.3. Khuyến nghị chi tiết theo từng chặng (Segment Advice Cards)
- **a) Chiến thuật chạy (Pacing Strategy):** Kết hợp đi bộ nhanh leo dốc (Power Hiking) trên dốc đứng và chạy/đi bộ nhanh ở đoạn phẳng.
- **b) Kỹ thuật địa hình (Terrain Technique):** Lời khuyên tư thế sải bước chân phù hợp với độ dốc.
- **c) Năng lượng & Điện giải (Nutrition & Hydration):** Tính toán cụ thể lượng ml điện giải cần bù và số gói gel cần nạp cho mỗi chặng theo thời gian (công thức ~8.3ml/phút và 1 gói gel/45 phút).
- **d) Cảnh báo thời tiết / Lưu ý địa hình:** Tương tác động theo thời tiết thực tế qua API ngày chạy (ví dụ: mưa hiện cảnh báo trơn trượt đá sườn núi).

### 1.4. Thành phần Sa bàn bản đồ tương tác
- **Bản đồ tương tác Leaflet.js v1.9.4:** Render track đường trail GPX vẽ dạng polyline. Popup checkpoint nền tối (`#151c2c`) đồng bộ với giao diện chung.
- **Biểu đồ Elevation Profile (Chart.js):** Biểu đồ mặt cắt dọc (cao độ mét vs km lũy kế) cao 300px.
- **Đồng bộ cao độ (Hover-Sync):** Di chuột trên biểu đồ elevation hiển thị marker tương ứng chạy trên bản đồ 2D.

---

## PHẦN 2: THU THẬP GPX & THÔNG TIN TỪ THEGIOICHAYBO.VN
**URL tham chiếu:** `https://www.thegioichaybo.vn/blogs/maps/ban-do-nui-dinh-gpx`

### 2.1. Danh sách 4 Route tập luyện cơ bản (Có sẵn file GPX)

#### 1. Route HBS – Thiền Viện – La Bàn (Tương ứng Cung 1 - Tuyến Xanh Dương)
- **Cự ly:** ~6 km
- **Độ cao tích lũy D+:** ~454 m
- **Lộ trình:** HBS (Hồ Bên Suối) → qua Thiền Viện Minh Đức → Đỉnh La Bàn.
- **Link tải GPX:** [hbs_thien_vien_la_ban.gpx](https://file.hstatic.net/200000550479/file/hbs_thien_vien_la_ban.gpx)

#### 2. Route HBS – Suối Đá (5 Hồ) – La Bàn (Tương ứng Cung 2 - Tuyến Đỏ)
- **Cự ly:** ~5 km
- **Độ cao tích lũy D+:** ~442 m
- **Lộ trình:** HBS → Suối Đá (5 hồ) → Đỉnh La Bàn.
- **Link tải GPX:** [hbs_suoi_da_nam_ho_la_ban.gpx](https://file.hstatic.net/200000550479/file/hbs_suoi_da_nam_ho_la_ban.gpx)

#### 3. Route HBS – Cô Kiều – Cô Hường – La Bàn (Tương ứng Cung 4 - Tuyến Xanh Lá)
- **Cự ly:** ~9.5 km
- **Độ cao tích lũy D+:** ~530 m
- **Lộ trình:** HBS → Má Kiều → Cô Hường → Đỉnh La Bàn.
- **Link tải GPX:** [hbs_ma_kieu_co_huong_la_ban_ae2473e2c2184208ad5045d4d3f7d921.gpx](https://file.hstatic.net/200000550479/file/hbs_ma_kieu_co_huong_la_ban_ae2473e2c2184208ad5045d4d3f7d921.gpx)

#### 4. Route HBS – Di Đà Sơn – Ống Nước – La Bàn (Tương ứng Cung 3 - Tuyến Vàng)
- **Cự ly:** ~5.5 km
- **Độ cao tích lũy D+:** ~434 m
- **Lộ trình:** HBS → Di Đà Sơn → Ống Nước → Đỉnh La Bàn.
- **Link tải GPX:** [hbs_di_da_son_nga_3_ong_nuoc_la_ban.gpx](https://file.hstatic.net/200000550479/file/hbs_di_da_son_nga_3_ong_nuoc_la_ban.gpx)

### 2.2. Danh sách 4 Route Giải đấu Dinh Harvest Final 2025 (Thông tin thêm)
- **Route 25K:** Cự ly ~28 km | D+ ~1.600m | [Link GPX](https://file.hstatic.net/200000550479/file/dhfinal_-_route_25k_official.gpx)
- **Route 35K:** Cự ly ~37 km | D+ ~2.560m (Có dốc Nấm 1km/300m D+) | [Link GPX](https://file.hstatic.net/200000550479/file/dhfinal_-_route_35k_official.gpx)
- **Route 55K:** Cự ly ~56 km | D+ ~3.291m | [Link GPX](https://file.hstatic.net/200000550479/file/dhfinal_-_route_55k_official.gpx)
- **Route 75K:** Cự ly ~80 km | D+ ~4.367m | [Link GPX](https://file.hstatic.net/200000550479/file/dhfinal_-_route_75k_official.gpx)
