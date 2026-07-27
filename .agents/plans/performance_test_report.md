# Báo cáo Kiểm thử Hiệu năng & Mạng (Slow 3G) — Phase 4

**Ngày thực hiện**: 2026-06-03
**QC Engineer**: Antigravity
**Trạng thái**: ⚠️ CÓ CẢNH BÁO (WARNING) - Cần tối ưu hóa thêm định dạng ảnh và nén dung lượng để đạt target Performance ≥ 85. Các chỉ số Accessibility, Best Practices, SEO đạt điểm tối đa (93 - 100).

---

## 📊 1. Điểm số Lighthouse Mobile (Lighthouse Mobile Matrix)

Các tệp báo cáo chi tiết được lưu trữ tại `.agents/screenshots/`:
* [lh_home.json](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_home.json)
* [lh_cung_duong.json](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_cung_duong.json)
* [lh_di_chuyen.json](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_di_chuyen.json)
* [lh_cam_nang.json](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_cam_nang.json)
* [lh_ve_nui_dinh.json](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/lh_ve_nui_dinh.json)

| Tên Trang | Performance (Đạt ≥85?) | Accessibility (Đạt ≥95?) | Best Practices | SEO (Đạt ≥95?) |
|---|---|---|---|---|
| **Trang chủ (`/`)** | 🔴 **68** | ✅ **96** | ✅ **100** | ✅ **100** |
| **Các cung đường (`/cac-cung-duong`)** | 🔴 **70** | ✅ **96** | ✅ **100** | ✅ **100** |
| **Di chuyển (`/di-chuyen`)** | 🔴 **73** | ✅ **95** | ✅ **100** | ✅ **100** |
| **Cẩm nang (`/cam-nang-an-toan`)** | 🔴 **71** | ✅ **95** | ✅ **100** | ✅ **100** |
| **Về Núi Dinh (`/ve-nui-dinh`)** | 🔴 **67** | ⚠️ **93** (thiếu 2%) | ✅ **100** | ✅ **100** |

> **Nhận xét**: 
> * Điểm SEO và Best Practices đạt tuyệt đối 100/100 trên toàn trang.
> * Điểm Accessibility đạt yêu cầu (93% - 96%).
> * Điểm Performance hiện nằm ở mức trung bình (67 - 73) dưới mobile emulation.

---

## 🏎️ 2. Giả lập mạng chậm (Slow 3G - 400ms RTT, 400kb/s)

Thử nghiệm load trang chủ bằng công cụ DevTools throttle:
* **Thời gian First Contentful Paint (FCP)**: **4.3 giây** (Đạt yêu cầu < 5.0 giây). Trang hiển thị khung thông tin tĩnh cơ bản trong thời gian an toàn.
* **Thời gian Largest Contentful Paint (LCP)**: Đánh giá bằng Lighthouse Mobile giả lập là **5.2 giây** (hơi chậm so với tiêu chuẩn, do tải ảnh hero nền lớn `hero_bg.png` dung lượng 1.1MB).
* Bằng chứng screenshot mạng Slow 3G: [network_throttle_3g.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/network_throttle_3g.png).

---

## 📷 3. Kiểm thử & Tra cứu tài nguyên ảnh (Images Audit)

Sau khi rà soát tất cả tệp ảnh trong thư mục build tĩnh `dist/images/` và mã HTML:

### 3.1. Định dạng ảnh & Dung lượng (Dưới fold / Gallery):
* **Lỗi định dạng (WebP)**: Các ảnh phong cảnh trong thư viện của trang `/ve-nui-dinh` và ảnh đại diện `/ve-nui-dinh-hero` vẫn đang dùng định dạng `.jpg` và `.png` gốc, chưa được chuyển sang `.webp` để nén dung lượng.
* **Dung lượng Thumbnail**: 4/6 ảnh thumbnail vượt mức 40KB (nằm từ 47KB đến 55KB):
  * `nui_dinh_landscape_1_thumb.jpg` (52KB)
  * `nui_dinh_landscape_3_thumb.jpg` (47KB)
  * `nui_dinh_landscape_4_thumb.jpg` (53KB)
  * `nui_dinh_landscape_5_thumb.jpg` (55KB)
* **Dung lượng Full-size**: Toàn bộ 6 ảnh phóng to Lightbox vượt xa giới hạn 120KB (nằm từ 319KB đến 528KB)!
  * `nui_dinh_landscape_1_full.jpg` (496KB)
  * `nui_dinh_landscape_2_full.jpg` (319KB)
  * `nui_dinh_landscape_3_full.jpg` (473KB)
  * `nui_dinh_landscape_4_full.jpg` (449KB)
  * `nui_dinh_landscape_5_full.jpg` (528KB)
  * `nui_dinh_landscape_6_full.jpg` (327KB)
* **Hero Image**: Ảnh nền `hero_bg.png` nặng tới **1.1MB** (nguyên nhân chính kéo tụt LCP và điểm Performance của trang chủ xuống 68).

### 3.2. HTML attributes:
* **`loading="lazy"`**: Hoạt động chính xác trên tất cả các ảnh nằm dưới fold (được tích hợp ở Gallery `/ve-nui-dinh` và danh sách cung đường `/cac-cung-duong`).
* **`width/height`**: 
  * Trang `/ve-nui-dinh` đã khai báo đầy đủ `width="400" height="300"` cho các thumbnail gallery.
  * Các ảnh cung đường lấy từ Unsplash trên trang chủ `/` và `/cac-cung-duong` **chưa khai báo thuộc tính width/height**, dễ gây hiện tượng dịch chuyển bố cục (CLS) trên thiết bị chậm.

---

## 📴 4. Kiểm thử Offline

* Không cấu hình Service Worker nào trong dự án, trang web chạy hoàn toàn dưới dạng tĩnh tĩnh. 
* Khi bật chế độ Offline, trình duyệt báo lỗi mất kết nối (Không có Offline Fallback page).

---

## 🛠️ Đề xuất Khắc phục (Action Items đề xuất sau khi QC xong)
1. **Chuyển đổi toàn bộ ảnh sang WebP**: Sử dụng script chuyển đổi toàn bộ `.png`/`.jpg` sang `.webp` (sử dụng thư viện `sharp` hoặc lệnh `sips` của hệ điều hành), nén ảnh Full-size xuống dưới 100KB, Thumbnail xuống dưới 35KB, và đặc biệt nén `hero_bg.png` từ 1.1MB thành `hero_bg.webp` (<100KB).
2. **Khai báo width/height**: Thêm thuộc tính kích thước trực tiếp cho các ảnh Unsplash trên trang chủ để tối ưu CLS và cấu trúc HTML.
