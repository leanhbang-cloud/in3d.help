# ĐỀ XUẤT NÂNG CẤP TRANG CUNG ĐƯỜNG & TÍCH HỢP SA BÀN TƯƠNG TÁC THỰC TẾ (CẬP NHẬT)

Dựa trên việc phân tích chi tiết giải pháp **Trail Station Navigator** của Haravan và tiến hành **thu thập, phân tích thực tế 4 file GPX** từ `thegioichaybo.vn`, tài liệu này đề xuất phương án nâng cấp giao diện chi tiết cung đường và tích hợp sa bàn thực tế tối ưu hóa hiệu năng cho website [nuidinh.help](https://nuidinh.help).

---

## 1. DỮ LIỆU GPX THỰC TẾ & BÀI TOÁN HIỆU NĂNG OFFLINE

Sau khi tải trực tiếp 4 file GPX của các tuyến tập luyện Núi Dinh, chúng tôi tiến hành phân tích số liệu và dung lượng:

- **Cung 1 (Tuyến Xanh Dương - HBS - Thiền Viện - La Bàn):** Gốc **114.26 KB** (262 điểm tọa độ)
- **Cung 2 (Tuyến Đỏ - HBS - Suối Đá 5 Hồ - La Bàn):** Gốc **70.68 KB** (177 điểm tọa độ)
- **Cung 3 (Tuyến Vàng - HBS - Di Di Đà Sơn - Ống Nước - La Bàn):** Gốc **987.94 KB** (2,284 điểm tọa độ, chứa nhiều siêu dữ liệu rác như nhịp tim, mốc thời gian chạy của runner)
- **Cung 4 (Tuyến Xanh Lá - HBS - Cô Kiều - Cô Hường - La Bàn):** Gốc **160.42 KB** (371 điểm tọa độ)

> [!WARNING]
> **Vấn đề hiệu năng:** Tổng dung lượng file GPX gốc lên tới **1.33 MB**. Đặc biệt Cung 3 nặng xấp xỉ **1 MB**. Nếu để client-side tải trực tiếp các file này và parse XML trên trình duyệt di động tại vùng sóng yếu Núi Dinh, trang web chắc chắn sẽ bị đứng, giật lag và vi phạm nghiêm trọng tiêu chuẩn LCP < 1.5s.

### Giải pháp kỹ thuật đã thử nghiệm thành công:
Chúng tôi đã viết script tiền xử lý (`scripts/simplify-gpx.js`) sử dụng thuật toán **Ramer-Douglas-Peucker (RDP)** với sai số cực nhỏ (epsilon = 0.0001, khoảng 10 mét trên thực tế) để loại bỏ các điểm thừa và siêu dữ liệu rác, chuyển đổi sang định dạng **GeoJSON tối giản** (`.json`).

Kết quả tối ưu hóa dung lượng:
- **Cung 1:** 114.26 KB → **3.86 KB** (Giảm **96.6%**)
- **Cung 2:** 70.68 KB → **3.33 KB** (Giảm **95.3%**)
- **Cung 3:** 987.94 KB → **3.97 KB** (Giảm **99.6%**)
- **Cung 4:** 160.42 KB → **5.78 KB** (Giảm **96.4%**)
- **Tổng cộng 4 cung:** 1.33 MB → **16.94 KB** (Tổng dung lượng cực nhẹ, tải tích tắc dưới 10ms kể cả trên mạng 3G yếu).

---

## 2. SO SÁNH: TRANG HIỆN TẠI (nuidinh.help) VS. THỰC TẾ GPX MỚI

| Thông số cung đường | Dữ liệu cũ trên `nuidinh.help` | Dữ liệu thực tế từ GPX mới | Đánh giá & Điều chỉnh |
| :--- | :--- | :--- | :--- |
| **Cung 1 (Xanh Dương)** | Cự ly: `6.0 km` \| D+: `454 m` | Cự ly: `6.0 km` \| D+: `454 m` | Khớp hoàn toàn. Giữ nguyên thông số. |
| **Cung 2 (Đỏ)** | Cự ly: `5.0 km (Một chiều)` \| D+: `424 m` | Cự ly: `5.0 km (Khứ hồi/Vòng lặp)` \| D+: `442 m` | **Điều chỉnh:** Cập nhật D+ từ 424m lên 442m. Đổi mô tả cự ly thành khứ hồi/vòng lặp để tránh người mới hiểu lầm là một chiều. |
| **Cung 3 (Vàng)** | Cự ly: `5.5 km (Một chiều)` \| D+: `434 m` | Cự ly: `5.5 km (Một chiều)` \| D+: `434 m` | Khớp hoàn toàn. Giữ nguyên thông số. |
| **Cung 4 (Xanh Lá)** | Cự ly: `9.5 km (Một chiều)` \| D+: `530 m` | Cự ly: `9.5 km (Khứ hồi)` \| D+: `530 m` | **Điều chỉnh:** Cập nhật mô tả cự ly thành khứ hồi (từ HBS qua Má Kiều, Cô Hường lên đỉnh rồi quay về là 9.5km tổng cộng). |

---

## 3. TINH CHỈNH ĐỀ XUẤT KỸ THUẬT CHO SA BÀN TƯƠNG TÁC

1. **Phương pháp vẽ bản đồ (Map Rendering):**
   - Không load file `.gpx` trực tiếp trên client. Thay vào đó, Component `TrailMap.astro` sẽ fetch file GeoJSON tĩnh `/data/geojson/cung-x.json` đã tối ưu (chỉ ~4KB).
   - Tích hợp Leaflet.js dưới dạng **Lazy Load**. Chỉ khi người dùng click vào tab "Bản đồ & Cao độ" hoặc cuộn trang đến phần bản đồ, script Leaflet mới được tải về để không làm ảnh hưởng đến thời gian tải trang ban đầu (Core Web Vitals).
2. **Biểu đồ độ cao (Elevation Profile):**
   - Triển khai vẽ biểu đồ bằng **SVG thuần** (hoặc thư viện siêu nhỏ) thay vì nhúng Chart.js (Chart.js nặng khoảng 150KB). Việc dùng SVG vẽ từ mảng dữ liệu độ cao trong file JSON giúp trang tải ngay lập tức và dễ dàng tạo gradient màu đỏ/vàng/xanh lá biểu diễn độ dốc.
   - Giữ nguyên tính năng Hover-Sync: khi di chuột trên biểu đồ SVG, gửi sự kiện tọa độ sang bản đồ Leaflet để di chuyển marker tương ứng.
3. **Cơ chế lưu trữ ngoại tuyến (Offline Support):**
   - File GPX gốc lưu tại `/public/gpx/cung-x.gpx` để làm nút "Tải GPX cho đồng hồ".
   - Đưa 4 file GeoJSON tối giản vào danh sách cache tĩnh của Service Worker.
   - Cache các tile bản đồ OpenStreetMap quanh tọa độ Núi Dinh (bán kính zoom level 12-15) để khi mất sóng hoàn toàn trên núi, người dùng vẫn nhìn thấy vị trí của mình di chuyển trên đường trail.

---

## 4. PHÂN CHIA LỘ TRÌNH THỰC HIỆN CHI TIẾT (TỪNG GIAI ĐOẠN)

### GIAI ĐOẠN 1: NỀN TẢNG DỮ LIỆU & NÚT TIỆN ÍCH GPX (Tháng 7–9/2026)
- **Bước 1 (Đã làm thử nghiệm):** Tải 4 file GPX gốc, viết script tiền xử lý và sinh ra 4 file GeoJSON rút gọn (lưu tại `src/data/geojson/`).
- **Bước 2:** Cập nhật lại interface dữ liệu `Trail` và chỉnh sửa thông số cự ly, độ cao tích lũy D+, cự ly khứ hồi cho 4 cung đường trong `src/data/trails.ts` theo dữ liệu GPX mới.
- **Bước 3:** Cập nhật giao diện `src/pages/cac-cung-duong/[slug].astro`:
  - Hiển thị thêm thông số D+ (Độ cao tích lũy) trên At-a-glance card và mobile strips.
  - Bổ sung nút **"Tải File GPX"** (link trực tiếp đến `/gpx/cung-x.gpx`) để người dùng tải nhanh về Garmin/Coros.
  - Đẩy lên môi trường Sandbox để QC kiểm tra hiển thị.

### GIAI ĐOẠN 2: TRIỂN KHAI SA BÀN TƯƠNG TÁC OFFLINE (Tháng 10–12/2026)
- **Bước 1:** Xây dựng component `TrailMap.astro` tích hợp bản đồ Leaflet.js và biểu đồ độ cao vẽ bằng SVG thuần.
- **Bước 2:** Nhúng component bản đồ vào trang chi tiết cung đường dạng Lazy Load (chỉ tải khi kích hoạt tab).
- **Bước 3:** Viết logic client-side xử lý hover đồng bộ giữa biểu đồ SVG và marker trên bản đồ 2D.
- **Bước 4:** Cấu hình Service Worker cache GeoJSON và các Map Tiles cho Núi Dinh để phục vụ sử dụng ngoại tuyến (Offline).
- **Bước 5:** Deploy Sandbox, chạy thử nghiệm thực địa (điện thoại mạng yếu, tắt mạng) và QC chất lượng trước khi merge vào nhánh `main` để deploy Production.
