# Báo cáo Kiểm thử Visual Regression — Phase 2

**Ngày thực hiện**: 2026-06-03
**QC Engineer**: Antigravity
**Trạng thái**: ✅ ĐẠT (PASS) - Không phát hiện lỗi vỡ giao diện (UI regression) hoặc sai lệch thiết kế so với Design System v1.2.

---

## 📸 Danh sách Bằng chứng Visual (10 Screenshots)

Các tệp ảnh chụp toàn trang (full-page screenshot) được lưu trữ tại thư mục `.agents/screenshots/`:

| Tên Trang | URL | Viewport Desktop (1280x800) | Viewport Mobile (390x844) |
|---|---|---|---|
| **Trang chủ** | `/` | [homepage_desktop.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/homepage_desktop.png) | [homepage_mobile.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/homepage_mobile.png) |
| **Cung đường** | `/cac-cung-duong` | [cac-cung-duong_desktop.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/cac-cung-duong_desktop.png) | [cac-cung-duong_mobile.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/cac-cung-duong_mobile.png) |
| **Di chuyển** | `/di-chuyen` | [di-chuyen_desktop.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/di-chuyen_desktop.png) | [di-chuyen_mobile.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/di-chuyen_mobile.png) |
| **Cẩm nang** | `/cam-nang-an-toan` | [cam-nang-an-toan_desktop.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/cam-nang-an-toan_desktop.png) | [cam-nang-an-toan_mobile.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/cam-nang-an-toan_mobile.png) |
| **Về Núi Dinh** | `/ve-nui-dinh` | [ve-nui-dinh_desktop.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/ve-nui-dinh_desktop.png) | [ve-nui-dinh_mobile.png](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/screenshots/ve-nui-dinh_mobile.png) |

---

## 🔍 Chi tiết Kết quả Đối chiếu với Design System v1.2

### 1. Phân tích Màu sắc & Micro-Typography (Token Verification)
* **Màu Cognac chủ đạo**: Xác thực mã màu tại file CSS `src/styles/global.css` là `--color-cognac: #5C3D20` (Đúng CSS Token).
* **Màu Gold & Rừng Già**: `--color-gold: #C8A45D` và `--color-forest: #1E3A28` được áp dụng nhất quán trên các tiêu đề phụ và badge.
* **Tải Fonts**: Google Fonts load thành công thông qua duy nhất 1 request `@import` trong `global.css`, đảm bảo không bị chặn hoặc lag font khi tải trang.

### 2. Kiểm tra Vùng Nhạy cảm trên Trang Chủ
* **Hero Section**: 
  * Lớp overlay gradient phủ tối chính xác ở phần đáy giúp chữ trắng và Cream nổi rõ trên nền ảnh cây rừng.
  * Cụm nút CTA ("Chọn cung đường →" và "Cẩm nang an toàn") được căn chỉnh lùi góc trái (bottom-left) cân đối.
* **Trail Slider**:
  * Chữ nút bấm hiển thị đúng **"Xem Chi Tiết"** (12 ký tự), không bị rớt dòng ở cả Viewport Desktop và Mobile.
  * Dải Forest Data Strip có khoảng đệm thụt lề (inset) đúng 16px so với hai bên mép card nhờ padding `.content` bao ngoài (không bị dính mép).
  * Nút điều hướng `<prev-slide>` hiển thị chính xác trạng thái disabled giả lập (opacity 0.3, pointer-events none) khi slider đang ở vị trí bắt đầu (scrollLeft = 0).
* **Footer (Thanh chân trang)**:
  * Emergency strip màu Cognac hiển thị nổi bật với 3 nút khẩn cấp `🚨 115`, `👮 113`, `🔥 114` đi kèm đường link `tel:` hoạt động chuẩn xác.
  * Trên Desktop: Hiển thị 3 cột cân xứng.
  * Trên Mobile: Co lại thành dạng accordion details/summary hoạt động native, các nút số khẩn cấp tự động đổi thành cụm pill button màu Gold bo tròn dễ chạm.

### 3. Layout Grid & Responsive Spacing (8px Grid)
* Không phát hiện lỗi tràn viền (overflow-x) trên Mobile. Mép biên lề luôn giữ khoảng đệm tối thiểu 20px (mobile) và 64px (desktop) chuẩn spec.
* Khoảng cách giữa các phần tử tuân thủ hệ số của 8px (`--space-sm: 16px`, `--space-md: 24px`, `--space-lg: 32px`).

---

**Kết luận**: Hệ thống giao diện hiển thị sạch sẽ, đảm bảo trải nghiệm đồng nhất trên cả thiết bị di động màn hình dọc và máy tính để bàn. Sẵn sàng cho Phase tiếp theo.
