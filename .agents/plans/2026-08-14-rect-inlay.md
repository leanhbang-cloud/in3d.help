# Kế hoạch Thiết kế Hốc Chữ Nhật + Tấm Chữ Rời 2 Màu (Rectangular Inlay)

Giải pháp tối ưu hóa thiết kế nhãn môn học để khắc phục hoàn toàn hiện tượng rớt dấu tiếng Việt (dấu hỏi, dấu nặng...) và hiện tượng kéo sợi tơ (stringing).

## Nguyên nhân của hai hiện tượng

1. **Hiện tượng rớt dấu tiếng Việt (dấu chấm, dấu móc)**:
   - Vì các dấu (như dấu chấm dưới chữ `ậ`, dấu móc chữ `ủ`) là những thực thể hình học tách biệt, không có liên kết vật lý với thân chữ chính. Khi in đục lỗ hoặc in chữ rời đơn lẻ, chúng là những mảnh nhựa vụn siêu nhỏ trên bàn in $\rightarrow$ Rất dễ bị bong tróc, rơi mất khi bóc khỏi bàn in hoặc dán keo.
2. **Hiện tượng kéo sợi tơ (Stringing) ở đỉnh chốt**:
   - Khi in nhiều chi tiết cùng lúc (hoặc chốt chia làm 2 nhánh khe co giãn), đầu phun phải di chuyển qua lại giữa các đỉnh chốt ở các lớp trên cùng. Nhựa PLA bị rỉ ra khi đầu phun di chuyển $\rightarrow$ tạo thành các sợi tơ mỏng.

---

## Giải pháp thiết kế mới (Hốc chữ nhật + Tấm chữ nổi)

Thay vì cắt hốc theo biên dạng chữ, ta làm như sau:
1. **Trên tấm Plate**: Khắc một **hốc hình chữ nhật bo góc** đơn giản ở giữa (ví dụ kích thước `32mm x 9mm`, độ sâu `1.0mm`).
2. **Tấm Chữ Rời**: In một **tấm chữ nhật mỏng** (kích thước khít với hốc, ví dụ `31.7mm x 8.7mm`, độ dày bằng độ sâu hốc `1.0mm`). Trên bề mặt tấm mỏng này, chữ môn học sẽ được **in nổi lên** `0.8mm`.
   - **Cách in 2 màu đơn giản (không cần AMS)**:
     - Lớp 0.0 -> 1.0mm (tấm nền): In màu A (ví dụ màu Đen hoặc Trắng).
     - Lớp 1.0 -> 1.8mm (chữ nổi): Đổi sợi nhựa sang màu B (ví dụ màu Vàng phản quang). Chỉ cần cài lệnh Pause ở độ cao `1.0mm` trên Slicer để thay cuộn nhựa.
   - **Giải quyết rớt dấu**: Tất cả các dấu tiếng Việt đều được đúc liền trên tấm nền chữ nhật mỏng $\rightarrow$ **Không bao giờ bị rớt dấu**.
   - **Giải quyết kéo sợi**: Tấm chữ in ngửa mặt rất phẳng, không có chốt gài $\rightarrow$ chất lượng in chữ cực kỳ nét và không kéo sợi.

---

## Các tham số thiết kế mới trong OpenSCAD

- `generate_mode`: Chế độ xuất file.
  - `"plate"`: Xuất tấm plate có hốc chữ nhật lõm.
  - `"text"`: Xuất tấm nền chữ nhật kèm chữ nổi lên phía trên (chữ ngửa mặt, không mirror).
  - `"assembly"`: Ghép cả hai để xem trước trực quan.
- `cavity_width = 32`: Chiều rộng hốc chữ nhật.
- `cavity_height = 9`: Chiều cao hốc chữ nhật.
- `inlay_depth = 1.0`: Độ sâu hốc chữ nhật.
- `text_raised_height = 0.8`: Độ cao chữ nổi nhô lên từ tấm nền.
- `inlay_tolerance = 0.15`: Dung sai khoảng hở viền tấm chữ nhật.

## Verification Plan

### Automated Tests
- Chạy thử xuất file STL cho mẫu "Chủ Nhật" với 3 độ dày thử nghiệm khác nhau khi anh Bang phản hồi độ dày tối ưu.
