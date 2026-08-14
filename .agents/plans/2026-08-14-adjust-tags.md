# Điều chỉnh nhãn TKB Kadis Pegboard

Tăng độ dày của phần plate chữ nhật và làm dày nét chữ môn học để cải thiện độ bền cơ học và chất lượng hiển thị khi in 3D.

## User Review Required

> [!IMPORTANT]
> - Tăng độ dày plate từ `1.6mm` lên `2.4mm` (tương đương 12 layers ở độ cao layer 0.2mm). Phần chốt gài (pegs) vẫn được giữ nguyên vị trí và chiều dài để khớp tốt với bảng lỗ IKEA SKÅDIS.
> - Làm nét chữ môn học dày thêm bằng cách áp dụng bộ lọc `offset(delta = 0.35)` trong OpenSCAD. Điều này giúp nét chữ rõ ràng hơn và giảm thiểu lỗi in nét quá mỏng.

## Open Questions

Không có câu hỏi nào. Anh Bang đã nêu rõ yêu cầu: tăng độ dày plate và làm chữ dày hơn.

## Proposed Changes

---

### OpenSCAD Design Component

#### [MODIFY] [SKADIS_subject_tag.scad](file:///Users/mac/Projects/in3d-help/SKADIS_subject_tag.scad)
- Cập nhật biến `tag_thickness = 2.4` (mặc định cũ là 1.6).
- Thêm tham số `stroke_offset = 0.35` để làm dày nét chữ.
- Áp dụng hàm `offset(delta=stroke_offset)` bao bọc hàm `text()` trong phần `linear_extrude` của cả hai trường hợp `face_down` (in úp mặt) và `face_up` (in ngửa mặt).

---

### Python Generation Script Component

#### [MODIFY] [generate_all_tags.py](file:///Users/mac/Projects/in3d-help/generate_all_tags.py)
- Thay đổi đường dẫn cứng chứa `/Users/bangle-macmini/` thành đường dẫn động tự động nhận diện theo thư mục hiện tại của workspace để tránh lỗi đường dẫn khi chạy trên máy anh Bang.
- Thêm kiểm tra và trỏ trực tiếp đến executable `/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD` trên macOS nếu lệnh `openscad` chưa được đăng ký trong biến môi trường PATH.

## Verification Plan

### Automated Tests
- Chạy thử lệnh python để sinh 1 file STL demo và kiểm tra log output:
  `python3 generate_all_tags.py`
  (Chúng ta sẽ sửa đổi script để hỗ trợ sinh và kiểm tra tất cả 43 môn học).

### Manual Verification
- Xác nhận các file STL được tạo ra tại thư mục [stl_outputs](file:///Users/mac/Projects/in3d-help/stl_outputs).
- Kiểm tra kích thước hình học bằng cách chạy renderer OpenSCAD thử nghiệm hoặc kiểm tra file sinh ra.
