# Đề Xuất Chuẩn Hóa Bố Cục Trang Con (Sub-hero & Layout Standardization)

Tài liệu này ghi nhận bối cảnh sự việc, phân tích hiện trạng không đồng nhất của website Dinh Mountain Help và đề xuất phương án chuẩn hóa toàn bộ bố cục (Layout) và các component cho trang con trên cả hai phiên bản Desktop và Mobile nhằm tuân thủ chặt chẽ Design System (DS).

---

## 1. Bối cảnh Sự việc (Context)

Trong quá trình rà soát và kiểm thử visual trên môi trường chạy thử (Preview Server), chúng ta phát hiện hai nhóm vấn đề chính:

### Nhóm 1: Các Bug Fix độc lập (Đã khắc phục)
* **Lỗi vỡ ảnh Cung 2**: Ảnh bìa của Cung 2 (Suối Tiên - Suối Đá) bị lỗi hiển thị (hình ảnh bị vỡ) do đường dẫn Unsplash gốc bị xóa phía server (lỗi HTTP 404). Đã thay bằng ảnh suối rừng mới hoạt động tốt (`photo-1488866022504-f2584929ca5f`).
* **Lỗi che khuất Breadcrumb**: Dòng breadcrumb ở đầu trang Danh sách cung đường bị thanh Menu cố định (Fixed Header) che khuất mất một nửa phía trên do khoảng đệm phía trên (`padding-top: 48px`) nhỏ hơn chiều cao của Header (`64px`). Đã nâng khoảng đệm lên để đẩy nội dung xuống dưới gầm Header một cách hoàn hảo.

### Nhóm 2: Sự không đồng nhất về bố cục (Sub-hero & Nội dung dưới Banner)
Khi người dùng chuyển đổi qua lại giữa 4 trang chính trên Menu (Cung đường, Di chuyển, Cẩm nang, Về núi Dinh), cả phần Banner Sub-hero lẫn cấu trúc nội dung ngay bên dưới Banner đều đang thay đổi liên tục, tạo cảm giác chắp vá, thiếu đồng nhất:
* **Khối Banner Sub-hero**: Trang Cung đường dùng khối banner Cream phẳng nhỏ gọn (~160px), trong khi các trang khác dùng khối Banner lớn (`320px`) dạng phẳng hoặc ảnh nền.
* **Cấu trúc dưới Banner**: 
  * *Trang Cung đường*: Dùng khối giải thích độ khó lớn chắn ngang (Full-width Box) ➡️ lưới cung đường (không có cột bên phải - aside).
  * *Trang Di chuyển*: Dùng thanh Tab ngang ➡️ chia 2 cột 8/4 (main content trái + Box mốc đường quan trọng ở aside phải).
  * *Trang Cẩm nang*: Đi thẳng vào 2 cột 8/4 (bảng thời điểm trái + Box hỗ trợ khẩn cấp màu sẫm ở aside phải).
  * *Trang Về núi Dinh*: Đi thẳng vào 2 cột 8/4 (lịch sử trái + Card Góc người địa phương ở aside phải).

### Bằng chứng Visual Hiện tại (Screenshots)

* **Trang chủ (Sau khi đã sửa ảnh Cung 2)**:
  ![Trang chủ đã sửa ảnh Cung 2](/Users/bangle-macmini/.gemini/antigravity/brain/fb51286e-227d-4aae-944d-17341f7ecbc7/homepage_desktop_fixed.png)

* **Trang Danh sách Cung đường (Thử nghiệm Banner phẳng 320px)**:
  ![Trang cung đường 320px](/Users/bangle-macmini/.gemini/antigravity/brain/fb51286e-227d-4aae-944d-17341f7ecbc7/cac_cung_duong_desktop_320px_fixed.png)
  > [!NOTE]
  > Lỗi nội dung: Ảnh của Cung 3 "Hành Trình Tâm Linh & Chùa Cổ" hiện đang bị lấy nhầm ảnh sa mạc cát (cần thay thế bằng ảnh chùa cổ phù hợp).

* **Trang Di chuyển (Thử nghiệm dùng Banner phẳng & CSS global)**:
  ![Trang di chuyển 320px](/Users/bangle-macmini/.gemini/antigravity/brain/fb51286e-227d-4aae-944d-17341f7ecbc7/di_chuyen_desktop_fixed.png)

* **Trang Cẩm Nang An Toàn (Banner ảnh nền tối & cột bên phải có Box khẩn cấp sẫm màu)**:
  ![Trang Cẩm nang banner ảnh nền](/Users/bangle-macmini/.gemini/antigravity/brain/fb51286e-227d-4aae-944d-17341f7ecbc7/cam_nang_an_toan_desktop.png)

* **Trang Về Núi Dinh (Khối Banner lớn có ảnh nền sương mù tối màu)**:
  ![Trang Về núi Dinh banner ảnh nền](/Users/bangle-macmini/.gemini/antigravity/brain/fb51286e-227d-4aae-944d-17341f7ecbc7/ve_nui_dinh_desktop.png)

---

## 2. Phân Tích Đánh Giá Cân Nhắc Cho Cả Hai Hướng

### 🧭 Hướng 1: Đồng nhất theo dạng Sub-hero lớn (320px) cho toàn bộ trang con
Chuyển tất cả các trang con về chung một cấu trúc Banner lớn cao `320px` (Desktop) / `240px` (Mobile) và sử dụng Flexbox căn lề đáy (`align-items: flex-end`).

* **Ưu điểm vững chắc về UX**:
  * **Giảm tải nhận thức (Cognitive Load)**: Use-case thực tế của website là người dùng trekking giữa rừng, sóng yếu, pin yếu. Việc giữ Banner cố định vị trí giúp người dùng chuyển tab không phải "định hình lại" trang web.
  * **Giảm CSS Exception**: Chỉ cần dùng 1 đặc tả duy nhất cho 4 trang con, giúp code sạch, dễ bảo trì, tránh phát sinh nợ kỹ thuật.
  * **Tuân thủ đúng Design System**: Ăn khớp 100% với đặc tả Sub-hero đã được chốt trong `DESIGN_SYSTEM.md` mục 14.
* **Đánh giá nhược điểm**: Nhược điểm chiếm trên dưới 30% diện tích màn hình trên desktop cho trang Cung đường là hoàn toàn chấp nhận được, do đây là trang landing giới thiệu nên việc cuộn trang là hành vi tự nhiên của người dùng.

---

### 🧭 Hướng 2: Đồng nhất theo từng nhóm thiết kế (Nhóm Ảnh nền vs Nhóm Nền phẳng)
Chia 4 trang con thành 2 nhóm: nhóm thông tin sâu dùng ảnh nền lớn (`320px`), nhóm danh sách/tiện ích dùng nền phẳng nhỏ gọn (`180px` - `200px`).

* **Điểm yếu nghiêm trọng**:
  * **Vi phạm Design System**: Phá vỡ đặc tả quy chuẩn `320px` đã chốt của dự án, buộc phải cập nhật lại tài liệu thiết kế.
  * **Breakpoints Mobile dễ vỡ**: Chiều cao `120px` - `140px` trên mobile là quá hẹp đối với H1 font chữ `Roboto Slab 28px` + breadcrumb + padding, gây vỡ bố cục hoặc tràn chữ.
  * **Vấn đề Visual trên Mobile**: Nếu chèn thêm Box giải thích độ khó vào ngay dưới banner nhỏ, phần đầu trang trên mobile sẽ trở nên cực kỳ nặng nề và mất cân đối về nhịp thị giác (visual rhythm).

---

## 3. Đề Xuất Chuẩn Hóa Toàn Diện (Tầng Banner & Tầng Nội Dung)

Dựa trên các đánh giá sâu sắc và sự phê duyệt của anh Bang, chúng ta **chốt thực thi theo Hướng 1** kèm theo các quy chuẩn hóa chặt chẽ cho cả tầng Banner, tầng Nội dung và thiết bị Di động như sau:

### 3.1. Chuẩn hóa tầng Banner Sub-hero (Desktop & Mobile)
* Chiều cao Banner thống nhất: `320px` trên Desktop và `240px` trên Mobile.
* Căn lề nội dung: Flexbox căn lề dưới (`align-items: flex-end`).
* Chia 2 biến thể hiển thị (Variant):
  * **Flat Variant (Nền Cream phẳng, chữ nâu tối)**: Áp dụng cho `Cung đường`, `Di chuyển`.
  * **Image Variant (Có ảnh nền, overlay tối, chữ trắng)**: Áp dụng cho `Cẩm nang`, `Về núi Dinh`, và trang chi tiết `[slug].astro`.

### 3.2. Chuẩn hóa tầng Bố cục nội dung dưới Banner (Desktop)
Để tôn trọng tính chất đặc thù của từng trang (listing vs detail) nhưng vẫn đảm bảo tính đồng bộ cao cấp:
1. **Đồng bộ khoảng cách trên cùng (Spacing)**: Khoảng cách từ mép dưới Banner đến phần tử nội dung đầu tiên ở cả 4 trang con được cố định bằng đúng 1 token spacing: `padding-top: var(--space-xl);` (48px).
2. **Quy chuẩn Lưới 2 cột (8/4 split)**: Các trang có sidebar (`Di chuyển`, `Cẩm nang`, `Về núi Dinh`) bắt buộc tuân thủ đúng tỷ lệ 8 phần (Main Content) và 4 phần (Aside) trên Desktop.
3. **Thứ tự ưu tiên trong Sidebar (Aside)**: 
  * Ưu tiên các thông tin mang tính chất khẩn cấp và cảnh báo lên hàng đầu (**Emergency-first**), sau đó mới đến các thông tin bối cảnh hoặc cảm nhận cá nhân (**Context-last**).
  * Thứ tự cụ thể: Box hỗ trợ khẩn cấp/hotline cứu hộ ➡️ Box cảnh báo an toàn (`CardD`) ➡️ Card thông tin nhanh (`CardB`) ➡️ Card góc người địa phương (`CardC`).

### 3.3. Chuẩn hóa & Bản đồ hóa Component (Renormalize Card Terminology)
Để khớp 100% với tài liệu hệ thống và loại bỏ sự mâu thuẫn:
* **Góc người địa phương** ➡️ **Card C (Local Insight)**: Giữ nguyên (nền Cream, quote nghiêng, star vàng).
* **Lưu ý quan trọng** ➡️ **Card D (Safety Alert)**: Giữ nguyên (nền Cream, viền trái Cognac 4px, warning icon).
* **Mốc đường quan trọng** ➡️ **Card F (Info Note) [NEW]**: Bổ sung vào DS §06. Card ghi chú thông tin phẳng: nền Cream, viền trái Gold 4px, không chứa quote/star/warning icon.
* **Hỗ trợ khẩn cấp** ➡️ **Emergency Box [NEW]**: Bổ sung vào DS. Hộp khẩn cấp đặc biệt: nền Cognac sẫm, chữ màu Gold, đồng bộ visual 100% với dải khẩn cấp ở Footer.
* **Bảng giải thích độ khó (Trang Cung đường)**:
  * **Quyết định**: **Loại bỏ hoàn toàn Box giải thích độ khó full-width này** để tối ưu hóa diện tích hiển thị (above-the-fold), tránh tạo thêm component rườm rà.
  * **Thay thế**: Thay bằng một dòng chú thích ngắn gọn, tinh tế nằm ngay dưới tiêu đề lưới cung đường: *"Chú thích độ khó: 🟢 Dễ · 🔵 Vừa · 🟡 Khó vừa · 🔴 Khó"* (Badge độ khó trên từng card đã rất rõ ràng nên dòng chú thích này là hoàn toàn đủ thông tin).

### 3.4. Xử lý giao diện trên Mobile (Tuân thủ DS §04C)
* **Banner**: Thu nhỏ chiều cao về `240px` để cân đối.
* **Cấu trúc Aside trên Mobile**: 
  * Tuân thủ tuyệt đối quy định trong **DS §04C**: Cột Aside của các trang con **không được phép xếp chồng 1 cột thông thường** xuống dưới đáy trang (gây mỏi tay khi cuộn).
  * Thay vào đó, Aside sẽ **thu gọn (collapse) thành các dải màu ngang (horizontal badge strips)** nằm xen kẽ trực tiếp trong luồng nội dung (Forest / Gold / Cognac strip) để trekker dễ dàng tiếp cận nhanh thông tin cứu hộ hoặc lưu ý.
  * Bản desktop và bản mobile strip dùng chung một DOM và ẩn hiện qua CSS (Media Queries) để tránh duplicate DOM gây ảnh hưởng A11y (không bị lỗi trùng lặp tiêu điểm bàn phím).

---

## 4. Kế Hoạch Triển Khai (Action Plan)

Sau khi anh Bang phê duyệt tài liệu đề xuất này, các bước tiếp theo sẽ được triển khai:
1. **Bước 1**: Sửa lỗi nội dung ảnh Cung 3 (đổi ảnh sa mạc cát thành ảnh chùa Linh Sơn cổ kính).
2. **Bước 2**: Cập nhật file [DESIGN_SYSTEM.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/DESIGN_SYSTEM.md) để bổ sung đặc tả cho **Card F (Info Note)** và **Emergency Box**, cũng như ghi nhận quy chuẩn Spacing 48px và Layout 8:4.
3. **Bước 3**: Tạo file ADR mới trong `.agents/context/DECISIONS.md` để lưu trữ quyết định kiến trúc này.
4. **Bước 4**: Chỉnh sửa CSS global và HTML của trang Cung đường và các trang con để áp dụng đúng Page Layout Template, loại bỏ Box giải thích độ khó và chuẩn hóa aside mobile.
5. **Bước 5**: Chạy biên dịch và Lighthouse Audit để nghiệm thu.
