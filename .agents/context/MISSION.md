# Mission — in3D.help

> The single source of truth for **why this project exists** and **who it's for**.
> Every feature decision should trace back to something on this page.

---

## 1. Problem

Những người cần dịch vụ in 3D (như kỹ sư, nhà thiết kế sản phẩm, sinh viên kỹ thuật, cá nhân cần làm sản phẩm custom) gặp khó khăn trong việc tìm kiếm đơn vị in nhanh, chất lượng tốt với mức giá rõ ràng, dễ tiếp cận và quy trình đặt in đơn giản.

## 2. Target users

**Primary user** (the one we optimize for):
- Các nhà thiết kế sản phẩm, kỹ sư phần cứng độc lập cần in mẫu thử nghiệm (prototyping) nhanh chóng để đánh giá chức năng sản phẩm.
- Các bạn trẻ, người chơi mô hình (cosplay, figure) cần in các chi tiết tùy biến theo yêu cầu cá nhân.

**Secondary users** (nice to support, not the optimization target):
- Doanh nghiệp nhỏ cần in số lượng ít mẫu sản phẩm thương mại.
- Sinh viên các ngành kỹ thuật, mỹ thuật cần làm đồ án tốt nghiệp.

## 3. The "press release" (1 paragraph)

Hôm nay chúng tôi giới thiệu **in3D.help**, cổng thông tin dịch vụ in 3D nhanh, độ chính xác cao và giá cả minh bạch hàng đầu. Khác với các xưởng in truyền thống yêu cầu quy trình báo giá qua email rườm rà, in3D.help cung cấp trải nghiệm tối ưu để người dùng có thể nhanh chóng nắm bắt các công nghệ in (FDM, SLA), vật liệu phù hợp (PLA, PETG, ABS, Resin) và dễ dàng kết nối để gửi file đặt in. Chúng tôi tin rằng công nghệ in 3D sẽ là cánh tay đắc lực cho những người sáng tạo ý tưởng và in3D.help chính là cầu nối giúp hiện thực hóa những ý tưởng đó một cách nhanh chóng nhất.

## 4. MVP scope (what's IN)

Cung cấp đầy đủ các giá trị cốt lõi hữu ích nhất cho người dùng trong phiên bản đầu tiên:
- [ ] Trang landing page bán hàng (Sale Page) giới thiệu đầy đủ về dịch vụ in 3D.
- [ ] Bảng giá in chi tiết theo khối lượng hoặc thời gian in của các loại vật liệu thông dụng (PLA, PETG, ABS, Resin).
- [ ] Trình bày các mẫu sản phẩm thực tế đã in để làm bằng chứng chất lượng sản phẩm (Portfolio/Gallery).
- [ ] Form liên hệ đặt hàng nhanh qua Zalo, Messenger hoặc Email kèm hướng dẫn định dạng file thiết kế (STL, OBJ, STEP).

## 5. Non-goals (what's OUT of v1)

- Trình báo giá tự động bằng cách phân tích file 3D (STL) ngay trên web (sẽ nhận file và báo giá thủ công qua Zalo/Email).
- Cổng thanh toán trực tuyến tự động (khách hàng sẽ thanh toán qua chuyển khoản ngân hàng theo hướng dẫn).

## 6. Success metrics

- Tốc độ tải trang di động Lighthouse đạt trên 95 điểm.
- Giao diện trực quan giúp tăng tỷ lệ nhấp nút liên hệ đặt hàng.

## 7. Constraints

- **Stack**: Astro Framework, CSS thuần tối giản, deploy lên Cloudflare Pages.

---

## Revision history

- 2026-07-27: Khởi tạo dự án in3D.help ban đầu bởi Bang & Antigravity.
