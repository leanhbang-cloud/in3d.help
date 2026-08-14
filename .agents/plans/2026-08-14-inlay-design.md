# Kế hoạch Thiết kế Khảm Chữ (Inlay Design) cho Nhãn TKB

Phương án kết hợp khắc chìm trên tấm plate và in các chữ cái rời để lắp ghép (khảm) vào lòng đĩa. Giúp giữ nguyên việc in úp mặt (không cần support cho chốt) và hiển thị trọn vẹn nét chữ, không bị rơi nốt chữ bên trong.

## Đánh giá tính khả thi (Feasibility Analysis)

- **Cơ chế hoạt động**: 
  - **Tấm plate** sẽ có một lòng khuôn khắc chìm sâu `1.0mm` (trên tấm plate dày `2.4mm`). Phần ruột chữ (các nốt chữ) vẫn dính liền với lớp đáy dày `1.4mm` nên không bị rơi ra.
  - **Chữ cái** sẽ được in rời dưới dạng một tấm mỏng `1.0mm`. Mặt trước của chữ cũng được in úp mặt xuống bàn in để tạo độ vân bề mặt (texture) đồng bộ hoàn toàn với tấm plate.
  - **Lắp ghép**: Dùng keo dán (keo 502 hoặc keo AB) để cố định chữ cái vào lòng khuôn của tấm plate.
- **Dung sai lắp ghép (Tolerance)**: Để nhét chữ vào khít mà không bị kích, cần áp dụng một khoảng hở dung sai khoảng `0.15mm` cho viền chữ cái.

## Các tham số thiết kế mới trong OpenSCAD

- `generate_mode`: Chế độ xuất file.
  - `"plate"`: Chỉ xuất tấm plate có lòng khuôn khắc chìm.
  - `"text"`: Chỉ xuất chữ cái rời đã được co nhỏ viền theo dung sai lắp ghép.
  - `"assembly"`: Xuất cả hai (tô màu khác nhau) để xem trước hoặc in nhiều màu tự động (AMS).
- `inlay_depth = 1.0`: Độ sâu lòng khuôn khắc chữ.
- `inlay_tolerance = 0.15`: Khoảng hở dung sai xung quanh chữ cái khi in rời.

## Proposed Changes

---

### OpenSCAD Design Component

#### [MODIFY] [SKADIS_subject_tag.scad](file:///Users/mac/Projects/in3d-help/SKADIS_subject_tag.scad)
- Định nghĩa thêm các biến cấu hình: `generate_mode`, `inlay_depth`, `inlay_tolerance`.
- Tách biệt logic hình học thành 3 nhánh dựa trên `generate_mode`.
- Sử dụng hàm `offset(delta = stroke_offset - inlay_tolerance)` cho chế độ xuất chữ rời để tự động tạo khoảng hở lắp ghép mượt mà.

---

### Python Generation Script Component

#### [MODIFY] [generate_all_tags.py](file:///Users/mac/Projects/in3d-help/generate_all_tags.py)
- Cập nhật script hỗ trợ xuất ra hai bộ file STL riêng biệt:
  - `stl_outputs/Tag_<Name>_Plate.stl` (Tấm plate có lòng khuôn)
  - `stl_outputs/Tag_<Name>_Text.stl` (Các chữ cái rời để khảm)

## Verification Plan

### Automated Tests
- Chạy script python để sinh cả hai file cho môn "Chủ Nhật" và kiểm tra lỗi biên dịch.

### Manual Verification
- Render ảnh xem trước của cả hai file `Plate` và `Text` bằng OpenSCAD để xác nhận lòng khuôn và chữ cái khớp nhau hoàn hảo.
