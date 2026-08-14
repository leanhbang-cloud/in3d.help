# Kế hoạch Thiết kế Khảm Chữ đối xứng (Symmetrical Inlay Design)

Phân tích nguyên nhân gốc rễ (Root Cause) của thiết kế lệch tâm và định nghĩa lại cấu trúc hình học chuẩn đối xứng cho nhãn TKB Kadis Pegboard.

## Phân tích nguyên nhân gốc rễ (Root Cause Analysis)

1. **Tại sao trước đây thiết kế bị lệch tâm (Y-offset)?**
   - **Nguyên nhân**: Ở phiên bản đầu tiên, chữ được đục lỗ (stencil) thủng hoàn toàn qua tấm plate. Nếu chốt gài nằm ở chính giữa mặt sau (Y=0), các chữ cái sẽ đục xuyên qua chân chốt gài, làm hỏng kết cấu cơ học. Do đó, chốt gài buộc phải đẩy lên sát mép trên (`peg_y_offset = 4.5`), còn chữ phải đẩy xuống sát mép dưới (`Y = -2.0`). Đây là giải pháp chắp vá (ad-hoc) bắt buộc của thiết kế đục lỗ.
2. **Đánh giá trên thiết kế mới (Inlay / Khắc chìm)**:
   - **Thực tế**: Hiện tại ta đã chuyển sang thiết kế hốc khắc chìm sâu `1.2mm` trên plate dày `3.0mm`. Mặt sau của hốc vẫn còn lớp nhựa đặc dày `1.8mm` vô cùng chắc chắn.
   - **Kết luận**: Chốt gài ở mặt sau và hốc chữ nhật ở mặt trước hoàn toàn không chạm nhau và không ảnh hưởng đến nhau về mặt cơ học.
3. **Giải pháp định nghĩa lại hệ thống hình học**:
   - Loại bỏ toàn bộ các tham số dịch chuyển ad-hoc cũ.
   - Đặt cả chốt gài (mặt sau) và hốc chữ nhật (mặt trước) về chính giữa tâm đối xứng của tấm plate (`peg_y_offset = 0` và `cavity_y_offset = 0`).
   - Điều này giúp nhãn cân đối hoàn hảo:
     - Lề trên và lề dưới của hốc chữ nhật đều bằng nhau: `3.0mm` (tính từ mép hốc 9mm đến mép plate 15mm).
     - Lề trái và lề phải đều bằng nhau: `4.0mm` (tính từ mép hốc 30mm đến mép plate 38mm).
     - Tấm plate che khít hoàn toàn lỗ bảng IKEA SKÅDIS vì chốt nằm chính giữa lỗ và plate phủ đều ra các phía.

---

## Tối ưu hóa nét chữ và Font chữ

- **Nét chữ**: Loại bỏ hoàn toàn việc bù nét chữ (`stroke_offset = 0`). Chữ sẽ được hiển thị với nét mảnh sắc sảo và thanh lịch tự nhiên của font gốc (Arial Bold hoặc bất kỳ font nào khác), không còn bị phình to (bloated) hay thô kệch.
- **Canh lề**: Chữ được căn giữa tuyệt đối theo cả 2 trục X và Y của tấm nền chữ nhật mỏng.

---

## Proposed Changes

### OpenSCAD Design Component

#### [MODIFY] [SKADIS_subject_tag.scad](file:///Users/mac/Projects/in3d-help/SKADIS_subject_tag.scad)
- Đặt mặc định: `tag_thickness = 3.0`, `inlay_depth = 1.2`, `peg_y_offset = 0`, `cavity_y_offset = 0`, `stroke_offset = 0.0`.
- Sửa đổi hình học:
  - Hốc chữ nhật và tấm chữ rời được đặt tại tọa độ `Y = cavity_y_offset = 0`.
  - Chốt gài được đặt tại tọa độ `Y = peg_y_offset = 0`.

### Python Generation Script Component

#### [MODIFY] [generate_all_tags.py](file:///Users/mac/Projects/in3d-help/generate_all_tags.py)
- Đặt mặc định `stroke_offset = 0.0` trong mọi câu lệnh kết xuất.

---

## Verification Plan

### Automated Tests
- Chạy script python để sinh file mẫu "Chủ Nhật" với thiết kế mới chuẩn đối xứng.
- Render hình ảnh xem trước từ mặt trước và mặt sau bằng OpenSCAD.
