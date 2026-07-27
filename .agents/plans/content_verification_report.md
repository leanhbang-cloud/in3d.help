# Báo cáo Xác thực Nội dung (Content Verification) — Phase 6

**Ngày thực hiện**: 2026-06-03
**QC Engineer**: Antigravity
**Trạng thái**: 🔴 CÓ LỖI NGHIÊM TRỌNG (INCONSISTENCY) - Phát hiện sự không đồng bộ lớn về số lượng, tên gọi và liên kết cung đường trekking giữa các thành phần giao diện (Hero, Footer) và cơ sở dữ liệu (`trails.ts`). Các nội dung văn phong và thông tin thực tế khác của anh Bang hoạt động chuẩn chỉnh.

---

## 📌 1. Phát hiện lỗi không đồng bộ Cung đường (Inconsistency Report)

Qua việc đối chiếu văn bản trích xuất (Content Snapshot) và mã nguồn, chúng tôi phát hiện sự sai lệch nghiêm trọng về thông tin cung đường giữa các phần:

### 1.1. Sai lệch về số lượng và tên gọi cung đường:
* **Trong CSDL (`src/data/trails.ts`)**: Chỉ định nghĩa **4 cung đường**:
  1. `Cung 1`: Chinh Phục Đỉnh La Bàn (Dễ đến Vừa)
  2. `Cung 2`: Khám Phá Suối Tiên – Suối Đá (Trung bình)
  3. `Cung 3`: Hành Trình Tâm Linh & Chùa Cổ (Dễ)
  4. `Cung 4`: Băng Rừng Hoang Sơ (Full Combo) (Khó)
* **Ở phần Hero (`src/components/Hero.astro`)**: Khai báo: `"5 cung đường · Miễn phí vào cổng · Cập nhật 5/2026"`.
* **Ở phần Footer (`src/components/Footer.astro`)**: Khai báo **5 cung đường** với tên gọi hoàn toàn khác:
  1. `Cung 1`: Khởi động
  2. `Cung 2`: Đỉnh Sân Bay
  3. `Cung 3`: Đỉnh La Bàn
  4. `Cung 4`: Quán Cô Kiều
  5. `Cung 5`: Cung Đỏ Băng Rừng

### 1.2. Sai lệch về liên kết (Navigation Links):
* Các liên kết ở chân trang (Footer) trỏ đến dạng `/cac-cung-duong#cung-1` đến `#cung-5`.
* Tuy nhiên, trên trang `/cac-cung-duong/index.astro`, các thẻ bao bọc card cung đường **không hề khai báo thuộc tính `id`** (ví dụ `id="cung-1"`), khiến neo liên kết (anchor link) bị hỏng hoàn toàn. Người dùng nhấp chuột từ chân trang sẽ chỉ chuyển hướng về đầu trang các cung đường mà không tự động cuộn đến card mong muốn.

---

## ✍️ 2. Đánh giá Văn phong & Chính tả

* **Ưu điểm**:
  * Các câu trích dẫn của anh Bang (Local Insights) có văn phong gần gũi, thực tế, mang đậm tính trải nghiệm cá nhân ("Mẹo của Bang", "Trekker 5+ năm").
  * Tên các địa danh địa phương (Quán Cô Kiều, Quán Cô Hường, Suối Tiên, Suối Đá, Đỉnh La Bàn, Thiền Tôn Phật Quang) viết đúng chính tả tiếng Việt.
  * Các số liệu kỹ thuật (80km, 504m, 5.245 ha) thống nhất trên toàn website.
* **Lỗi nhỏ phát hiện**:
  * Tại `src/components/Hero.astro` (dòng 15), từ "Khám Phá" đã được sửa thành "Khám phá" chuẩn ngữ pháp Việt, nhưng tại `src/pages/ve-nui-dinh.astro` (dòng 198) nhãn phụ ghi: `"mb-sm"`, có một số từ tiếng Anh dính trong class chưa dọn sạch.

---

## 🛠️ Đề xuất Khắc phục & Xin ý kiến (Action Items Phase 6)

> [!IMPORTANT]
> Đây là quyết định sản phẩm (Product Decision) thuộc thẩm quyền của anh Bang. Em đề xuất hai hướng giải quyết để thống nhất nội dung:

### Phương án A (Thống nhất 4 cung đường theo CSDL - Khuyên dùng):
* **Lý do**: CSDL chỉ có dữ liệu chi tiết cho 4 cung này (mô tả, timeline chặng, highlights, ảnh gallery thực tế).
* **Cách sửa**:
  1. Sửa text ở Hero thành: `"4 cung đường · Miễn phí vào cổng..."`.
  2. Cập nhật danh sách liên kết ở Footer khớp chính xác 4 cung đường trong database:
     * `Cung 1 — Đỉnh La Bàn` (`/cac-cung-duong#cung-1`)
     * `Cung 2 — Suối Tiên - Suối Đá` (`/cac-cung-duong#cung-2`)
     * `Cung 3 — Hành Trình Tâm Linh` (`/cac-cung-duong#cung-3`)
     * `Cung 4 — Băng Rừng Hoang Sơ` (`/cac-cung-duong#cung-4`)
  3. Thêm thuộc tính `id={trail.id}` vào thẻ `.trail-card-wrapper` trong `src/pages/cac-cung-duong/index.astro` để anchor link hoạt động mượt mà.

### Phương án B (Nâng cấp hệ thống lên 5 cung đường):
* **Lý do**: Nếu anh thực sự muốn có 5 cung đường như ở Footer (thêm cung Đỉnh Sân Bay, chia tách các cung khác).
* **Yêu cầu**: Anh cần cung cấp thêm dữ liệu chi tiết cho cung đường thứ 5 (tên, mô tả, cự ly, timeline, v.v.) để em viết thêm vào `src/data/trails.ts` và tạo trang chi tiết `/cac-cung-duong/cung-5`.

---

## 📁 Tệp Snapshot Đã Tạo
Toàn bộ nội dung chữ đã được em trích xuất đầy đủ tại:
* [.agents/plans/content_snapshot.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/plans/content_snapshot.md) (Vui lòng click vào link để duyệt thủ công).
