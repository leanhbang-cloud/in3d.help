# 📋 TEMPLATE THU THẬP THÔNG TIN — DỰ ÁN in3D.help

> **Mục đích:** Sau khi anh Bang điền xong toàn bộ template này, AI sẽ có đủ ngữ cảnh để (1) code Landing Page bằng Astro + CSS, (2) tạo file `Design.md`, và (3) viết toàn bộ copywriting bán hàng.
>
> **Hướng dẫn điền:**
> - Điền vào chỗ `→ ...`
> - Nếu câu nào chưa có/chưa quyết định, ghi `[chưa có]` hoặc `[để AI đề xuất]`
> - Có thể ghi bằng gạch đầu dòng, không cần viết văn hoàn chỉnh
> - Các phần đánh dấu ⭐ là **bắt buộc** (ảnh hưởng trực tiếp đến copy & code)

---

## PHẦN 1 — TỔNG QUAN DỰ ÁN & CON NGƯỜI ĐẰNG SAU

### 1.1 Thông tin cá nhân người sáng lập ⭐

| Mục | Trả lời |
|---|---|
| Tên hiển thị trên website | → Ledainhan |
| Tagline cá nhân / Vai trò | → Solo Builder |
| Số năm kinh nghiệm in 3D | → chưa nhiều |
| Background chuyên môn | → Anh chàng Product |
| Câu chuyện ngắn: Vì sao bắt đầu dịch vụ in 3D? | → Trên hành trình khám phá những điều mới mẻ trong cuộc sống, va phải một xu hướng giúp rất nhiều cho việc DIY của mỗi cá nhân |
| Có muốn hiển thị ảnh cá nhân trên page không? | → Không |

### 1.2 Thông tin thương hiệu ⭐

| Mục | Trả lời |
|---|---|
| Tên thương hiệu chính thức | → BlueMooon's Studio |
| Đã có logo chưa? | → Có (đã đính kèm ảnh và lưu tại public/logo.jpg) |
| Slogan / Câu khẩu hiệu (nếu có) | → Hãy để cuộc sống dễ dàng hơn |
| Giọng điệu thương hiệu mong muốn | → Chuyên nghiệp nhưng gần gũi qua việc hài hước |
| Xưng hô với khách hàng trên page | → Bà con cô bác |

---

## PHẦN 2 — DỊCH VỤ & KỸ THUẬT IN 3D

### 2.1 Công nghệ & Máy móc ⭐

| Mục | Trả lời |
|---|---|
| Công nghệ in đang sử dụng | → FDM |
| Tên & model máy in đang dùng | → Bambu A1 mini AMS (AMS lite hỗ trợ in tối đa 4 màu) |
| Số lượng máy in hiện có | → 1 |
| Kích thước in tối đa (build volume) | → 180 mm × 180 mm × 180 mm |
| Độ chính xác / Layer height tối thiểu | → 0.08 mm - 0.2 mm (FDM tiêu chuẩn) |
| Có khả năng in nhiều màu trong 1 print? | → Có (Nhờ hệ thống AMS lite) |
| Có dịch vụ hậu xử lý không? | → Không (Chỉ tháo support và làm sạch cơ bản) |

### 2.2 Vật liệu (Filament / Resin) ⭐

> *Liệt kê tất cả vật liệu anh Bang đang cung cấp. AI sẽ dùng để tạo bảng so sánh trên page.*

| Vật liệu | Có cung cấp? | Ghi chú đặc điểm / Use case |
|---|---|---|
| PLA | → Có | → Sử dụng nhựa PLA Lite chuyên dụng của Bambu Lab, cho độ hoàn thiện mịn màng và chịu lực tốt cho nhu cầu sắp xếp đồ đạc. |
| PLA+ / PLA Silk / PLA Matte | → Không | → |
| PETG | → Không | → |
| ABS / ASA | → Không | → |
| TPU (dẻo) | → Không | → |
| Nylon / PA | → Không | → |
| Resin tiêu chuẩn | → Không | → |
| Resin chịu nhiệt / Resin dẻo | → Không | → |
| Vật liệu khác | → Không | → |
| Màu sắc có sẵn | → [để AI đề xuất dựa trên các cuộn màu phổ biến của PLA Lite] |

### 2.3 Phạm vi dịch vụ ⭐

> *Đánh dấu ✅ hoặc ❌ vào từng dịch vụ:*

| Dịch vụ | Có cung cấp? | Chi tiết thêm |
|---|---|---|
| In 3D theo file khách gửi | → ❌ | → Studio tập trung in các sản phẩm thuộc hệ sinh thái Kaidis Pegboard và phụ kiện sắp xếp, không nhận in gia công file ngoài. |
| Tư vấn chọn vật liệu & hướng in | → ✅ | → Tư vấn cách bố trí, sắp xếp pegboard tối ưu cho từng không gian. |
| Thiết kế 3D theo yêu cầu (modeling) | → ❌ | → Không nhận thiết kế 3D tự do, nhưng có hỗ trợ thiết kế các module phụ kiện đi kèm pegboard nếu khách hàng yêu cầu đặc biệt. |
| Sửa file / Repair file STL lỗi | → ❌ | → |
| Scan 3D đối tượng thực | → ❌ | → |
| In số lượng lớn (batch production) | → ✅ | → Cung cấp số lượng lớn cho các dự án setup văn phòng, nhà hàng, khách sạn, cửa hàng bán lẻ. |
| Gia công hậu kỳ (sơn, lắp ráp...) | → ❌ | → |
| In mẫu prototype nhanh | → ❌ | → |
| Giao hàng toàn quốc | → ✅ | → Đóng gói cẩn thận và giao tận nơi trên toàn quốc. |

---

## PHẦN 3 — BẢNG GIÁ & CHÍCH SÁCH

### 3.1 Cấu trúc giá ⭐

> *AI cần thông tin này để build phần Pricing Section. Điền càng cụ thể càng tốt.*

| Mục | Trả lời |
|---|---|
| Cách tính giá chính | → Bán theo pack sản phẩm Modular cố định |
| Giá tham khảo FDM (PLA) | → Không áp dụng (Bán theo trọn gói pack sản phẩm) |
| Giá tham khảo Resin | → Không áp dụng |
| Phí tối thiểu mỗi đơn (minimum order) | → Không có |
| Phí thiết kế 3D (nếu có) | → Không có |
| Phí sửa file (nếu có) | → Không có |
| Có bảng giá cố định hay báo giá từng đơn? | → Có bảng giá cố định cho các pack sản phẩm |
| Có gói combo / package nào không? | → Các pack Kaidis Pegboard Modular bao gồm tấm kệ để bàn + các module phụ kiện đi kèm với 3 mức giá: 299k, 399k và 599k |

### 3.2 Chính sách giao hàng & thanh toán ⭐

| Mục | Trả lời |
|---|---|
| Khu vực phục vụ | → Toàn quốc |
| Địa chỉ workshop/cơ sở (nếu muốn hiển thị) | → [để ẩn hoặc chỉ ghi khu vực TP.HCM] |
| Hình thức giao hàng | → Ship toàn quốc; Hỗ trợ giao hỏa tốc trong ngày tại TP.HCM |
| Phí ship | → [để AI đề xuất mức phí hoặc chính sách freeship] |
| Lead time trung bình (từ lúc xác nhận → giao) | → [để AI đề xuất] |
| Hình thức thanh toán | → Đa dạng hình thức (Chuyển khoản ngân hàng, Momo, ZaloPay, COD...) |
| Thông tin tài khoản ngân hàng (nếu muốn hiển thị) | → [ẩn, sẽ gửi trực tiếp khi chốt đơn] |
| Chính sách bảo hành / đổi trả | → [để AI đề xuất - ví dụ: 1 đổi 1 nếu lỗi do vận chuyển/sản xuất] |
| Có yêu cầu cọc trước không? | → [để AI đề xuất] |

---

## PHẦN 4 — KHÁCH HÀNG MỤC TIÊU & NỖI ĐAU

### 4.1 Chân dung khách hàng ⭐

> *Anh Bang hình dung ai sẽ vào trang in3D.help và đặt hàng? Có thể chọn nhiều nhóm.*

| Nhóm khách hàng | Có nhắm tới? | Mô tả thêm / Ưu tiên chính-phụ |
|---|---|---|
| Maker / Hobbyist (in đồ chơi, figure, trang trí) | → Có (Phụ) | → Nhóm thích tự tay cá nhân hóa các góc trưng bày hoặc vật dụng yêu thích. |
| Cosplayer (prop, armor, mặt nạ...) | → ❌ | → Không nhắm tới |
| Kỹ sư / Startup cần prototype sản phẩm | → ❌ | → Không nhắm tới |
| Sinh viên (đồ án, mô hình kiến trúc, cơ khí) | → Có (Phụ) | → Sắp xếp góc học tập gọn gàng, tăng cảm hứng học tập. |
| Doanh nghiệp nhỏ cần linh kiện/jig/fixture | → Có (Phụ) | → Setup quầy reception (lễ tân) nhà hàng, quán ăn, hotel, cửa hàng bán lẻ... |
| Người bán hàng online cần mẫu sản phẩm | → ❌ | → Không nhắm tới |
| Khách lẻ cần in quà tặng / vật dụng cá nhân | → ✅ (Chính) | → Tập trung mạnh vào nhóm thích trang trí bàn làm việc, tự tay decor các góc riêng theo ý thích cá nhân. |
| Nhóm khác | → Có (Chính) | → Nhân viên văn phòng cần tối ưu hóa không gian làm việc gọn gàng và thẩm mỹ. |

### 4.2 Nỗi đau & vấn đề khách hàng thường gặp ⭐

> *AI sẽ dùng phần này để viết copy "đánh trúng nỗi đau". Anh Bang liệt kê những khó khăn mà khách hàng HAY GẶP hoặc HAY PHÀN NÀN:*

→ [Gợi ý từ AI dựa trên sản phẩm Pegboard]
- Góc làm việc, bàn học hoặc quầy lễ tân bừa bộn với vô vàn vật dụng linh tinh (bút, son, nhẫn, ví, mèo thần tài...) nhưng không có kệ lưu trữ nào vừa khít, gọn gàng và đẹp mắt.
- Các loại kệ trưng bày trên thị trường đều cố định một khuôn mẫu nhàm chán, không thể tùy biến vị trí các ngăn theo thói quen sử dụng cá nhân.
- Khó tìm thấy một món quà tặng độc lạ, mang đậm chất cá nhân hóa cho bạn bè hoặc người thân thích decor bàn làm việc.

### 4.3 Kết quả mong muốn của khách hàng

> *Sau khi sử dụng dịch vụ, khách hàng muốn đạt được gì?*

→ [Gợi ý từ AI dựa trên sản phẩm Pegboard]
- Sở hữu một góc bàn làm việc/học tập hoặc quầy lễ tân siêu ngăn nắp và cực kỳ "chất", thể hiện rõ cá tính riêng qua cách bài trí modular.
- Tự do tháo ráp, thay đổi vị trí các mô-đun chức năng (khay để son, móc treo ví, hộp cắm bút, chậu cây nhỏ...) bất kỳ lúc nào để tối ưu không gian.
- Có ngay một góc chụp hình decor lung linh để "khoe" trên MXH.

---

## PHẦN 5 — USP & KHÁC BIỆT CẠNH TRANH

> **Trạng thái:** Sẽ tiến hành nhờ AI phân tích kỹ ở session sau.

### 5.1 Lý do chọn in3D.help ⭐

> *Hãy liệt kê 3-7 lý do tại sao khách hàng nên chọn anh Bang thay vì đặt chỗ khác:*

| # | USP / Điểm mạnh | Giải thích ngắn |
|---|---|---|
| 1 | → ... | → ... |
| 2 | → ... | → ... |
| 3 | → ... | → ... |
| 4 | → ... | → ... |
| 5 | → ... | → ... |

### 5.2 So sánh với đối thủ

| Mục so sánh | in3D.help (Anh Bang) | Đối thủ / Thị trường chung |
|---|---|---|
| Chất lượng bề mặt | → ... | → ... |
| Thời gian giao hàng | → ... | → ... |
| Giá cả | → ... | → ... |
| Tư vấn kỹ thuật | → ... | → ... |
| Độ chính xác | → ... | → ... |
| Khác | → ... | → ... |

### 5.3 Social Proof / Bằng chứng xã hội

| Mục | Trả lời |
|---|---|
| Số đơn hàng đã hoàn thành (ước tính) | → ... |
| Có testimonial / review từ khách cũ không? | → ... (nếu có, copy-paste vào đây) |
| Có ảnh sản phẩm đã in thực tế không? | → Có (sẽ cung cấp file) / Chưa có / [để AI dùng placeholder] |
| Đã từng in cho dự án / thương hiệu nào nổi bật? | → ... |
| Có chứng nhận / giải thưởng gì không? | → ... |

---

## PHẦN 6 — QUY TRÌNH ĐẶT HÀNG

### 6.1 Các bước đặt hàng ⭐

> *Mô tả quy trình từ lúc khách hàng liên hệ đến lúc nhận sản phẩm. AI sẽ dùng để tạo phần "Cách đặt hàng" trên page.*

| Bước | Mô tả |
|---|---|
| Bước 1 | → Truy cập website thông qua các link entry points để tham khảo các Package thiết kế sẵn cho người mới. |
| Bước 2 | → Tìm hiểu thêm về các phần mở rộng (tấm nền lắp ráp tăng diện tích, các bộ phận chức năng để bút, ví, son, hoa...) qua các bài viết mô tả sản phẩm. |
| Bước 3 | → Lựa chọn package mong muốn hoặc tùy biến chọn thêm các module bộ phận mở rộng theo sở thích cá nhân. |
| Bước 4 | → Nhắn tin (chat) đặt hàng hoặc gửi đơn đặt hàng trực tiếp trên website. |
| Bước 5 | → Cung cấp thông tin giao hàng, thanh toán và nhận kệ pegboard được đóng gói sẵn để tự tay lắp ghép. |

### 6.2 Định dạng file hỗ trợ ⭐

| Mục | Trả lời |
|---|---|
| Định dạng file chấp nhận | → Không áp dụng (Bán sản phẩm modular thiết kế sẵn, không in theo file ngoài) |
| Phần mềm slicer đang dùng | → Bambu Studio (Sử dụng nội bộ) |
| Có hỗ trợ khách không biết tạo file 3D không? | → Khách không cần biết tạo file, chỉ cần chọn các module chức năng có sẵn của studio và lắp ghép dễ dàng. |
| Kích thước file tối đa chấp nhận | → Không áp dụng |
| Yêu cầu kỹ thuật đặc biệt khi gửi file | → Không áp dụng |

---

## PHẦN 7 — THÔNG TIN LIÊN HỆ & CTA

### 7.1 Kênh liên hệ ⭐

> *Đánh dấu kênh nào muốn hiển thị trên page + cung cấp link/số:*

| Kênh | Hiển thị? | Link / Số / ID |
|---|---|---|
| Zalo | → Có | → 0918712710 |
| Messenger (Facebook) | → Không | → |
| Facebook Page | → Không | → |
| Instagram | → Không | → |
| TikTok | → Không | → |
| Số điện thoại | → Có | → 0918712710 (Hotline) |
| Email | → Không | → |
| Website khác (nếu có) | → Có | → [Link Gemini Notebook / NotebookLM giải đáp thắc mắc tự động] |

### 7.2 CTA (Call-to-Action) chính ⭐

| Mục | Trả lời |
|---|---|
| Hành động chính bạn muốn khách làm khi vào page | → Nhắn Zalo đặt hàng nhanh, hoặc click link Gemini Notebook để tự chat hỏi đáp nếu không rành công nghệ. |
| Nút CTA chính nên ghi gì? | → Nút 1: "Nhắn Zalo Đặt Kệ Ngay" (mở Zalo chat 0918712710) <br> Nút 2: "Hỏi Đáp Tự Động Với AI" (gắn link Gemini Notebook) |
| Có muốn form liên hệ trực tiếp trên page không? | → Không (Để tối giản nhất, tránh gây bối rối cho người không rành công nghệ) |
| Nếu có form, cần thu thập thông tin gì? | → Không áp dụng |
| Thời gian phản hồi cam kết | → Phản hồi tức thì qua Zalo |

---

## PHẦN 8 — ĐỊNH HƯỚNG VISUAL & PHONG CÁCH THIẾT KẾ

### 8.1 Phong cách tổng thể ⭐

| Mục | Trả lời |
|---|---|
| Phong cách thiết kế mong muốn | → Công nghệ hiện đại, tối giản và trực quan (Interactive tech landing) |
| Tone màu chủ đạo | → Xanh dương đậm, xanh neon/cyan kết hợp với trắng trên nền xám tối/đen (theo logo) |
| Có màu nào KHÔNG muốn dùng? | → Tránh các tông màu quá rực rỡ không liên quan như đỏ gắt hoặc cam sáng. |
| Website nào anh thấy đẹp / muốn tham khảo? | → https://open-design.ai/plugins/example-open-design-landing/ |
| Dark mode hay Light mode? | → Dark mode làm mặc định |

### 8.2 Hình ảnh & Media

| Mục | Trả lời |
|---|---|
| Có ảnh sản phẩm chất lượng cao sẵn sàng dùng? | → Chưa có (sẽ cung cấp sau); Cần thiết kế trước các khu vực hiển thị sản phẩm 3D tương tác trực quan để khách dễ hình dung. |
| Có video máy in đang chạy / sản phẩm hoàn thiện? | → [sẽ cập nhật sau] |
| Muốn dùng ảnh thực hay có thể dùng stock/placeholder? | → Sử dụng ảnh thực tế của sản phẩm do anh Bang cung cấp, phối hợp các mô phỏng 3D đẹp mắt. |
| Có ảnh workshop / góc làm việc không? | → [sẽ cập nhật sau] |

### 8.3 Nội dung page — Cấu trúc mong muốn

> **Trạng thái:** Sẽ cùng AI thảo luận và xây dựng chi tiết cấu trúc các section ở session sau.

| Section | Có muốn? | Ghi chú |
|---|---|---|
| Hero (banner đầu trang + CTA) | → ⭐ Bắt buộc | → Thiết kế theo phong cách open-design |
| Giới thiệu dịch vụ / "Tại sao in 3D?" | → | → |
| Bảng vật liệu & công nghệ | → | → |
| Quy trình đặt hàng (steps) | → | → |
| Bảng giá / Pricing | → | → |
| Gallery ảnh sản phẩm | → | → |
| Testimonials / Đánh giá khách hàng | → | → |
| About / Giới thiệu anh Bang | → | → |
| FAQ (Câu hỏi thường gặp) | → | → |
| Form liên hệ / CTA cuối trang | → ⭐ Bắt buộc | → |
| Section khác muốn thêm | → | → |

---

## PHẦN 9 — FAQ — CÂU HỎI KHÁCH HÀNG THƯỜNG GẶP

> **Trạng thái:** Sẽ làm kỹ với AI ở session sau.

| # | Câu hỏi | Câu trả lời tóm tắt |
|---|---|---|
| 1 | → ... | → ... |
| 2 | → ... | → ... |
| 3 | → ... | → ... |
| 4 | → ... | → ... |
| 5 | → ... | → ... |

> *Nếu chưa nghĩ ra, ghi `[để AI đề xuất dựa trên ngành in 3D]` — AI sẽ tạo 5-8 câu FAQ phổ biến.*

---

## PHẦN 10 — YÊU CẦU KỸ THUẬT WEBSITE

### 10.1 Hosting & Domain

| Mục | Trả lời |
|---|---|
| Domain đã có chưa? | → Chưa có (tạm thời dùng domain mặc định của Cloudflare Pages, sẽ mua sau) |
| Dự định hosting ở đâu? | → Cloudflare Pages (theo cấu hình hiện tại) |
| Cần tích hợp Google Analytics? | → Có |
| Cần SEO cơ bản (meta tags, OG image)? | → Có (SEO cơ bản + nâng cao nếu phù hợp và sẵn sàng) |

### 10.2 Tính năng đặc biệt

| Tính năng | Có cần? | Ghi chú |
|---|---|---|
| Đa ngôn ngữ (Việt + Anh) | → Có | → Sẽ thảo luận chi tiết cấu trúc đa ngôn ngữ sau |
| Nút Zalo chat floating | → | → [Sẽ thảo luận với AI sau] |
| Nút scroll-to-top | → | → [Sẽ thảo luận với AI sau] |
| Animation / hiệu ứng khi scroll | → | → [Sẽ thảo luận với AI sau] |
| Responsive mobile-first | → ⭐ Bắt buộc | → |
| Tích hợp upload file trên form | → | → [Sẽ thảo luận với AI sau] |
| Trang riêng cho blog/portfolio | → | → [Sẽ thảo luận với AI sau] |
| Khác | → | → [Sẽ thảo luận với AI sau] |

---

## PHẦN 11 — BỔ SUNG TỰ DO

> *Bất kỳ thông tin nào anh Bang muốn chia sẻ thêm mà chưa được hỏi ở trên — ghi thoải mái vào đây:*

→ ...

---

## ✅ CHECKLIST TRƯỚC KHI GỬI LẠI CHO AI

Anh Bang kiểm tra lại trước khi gửi:

- [ ] Đã điền tất cả các mục có dấu ⭐
- [ ] Đã cung cấp ít nhất 3 USP / điểm mạnh
- [ ] Đã mô tả khách hàng mục tiêu & nỗi đau
- [ ] Đã xác định CTA chính (Zalo / Form / Messenger?)
- [ ] Đã chọn phong cách thiết kế hoặc ghi [để AI đề xuất]
- [ ] Đã đính kèm logo / ảnh sản phẩm (nếu có)
