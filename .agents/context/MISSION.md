# Mission — in3D.help

> The single source of truth for **why this project exists** and **who it's for**.
> Every feature decision should trace back to something on this page.

---

## 1. Problem

Góc bàn học tập và làm việc (đặc biệt là WFH) dễ bị bừa bộn bởi các vật dụng nhỏ. Các loại kệ pegboard trên thị trường thường làm bằng sắt hoặc nhựa công nghiệp thô cứng, nặng nề, thiếu tính thẩm mỹ đáng yêu (cute) và khó tháo lắp tùy biến linh hoạt theo sở thích cá nhân mà không cần khoan đục hoặc dụng cụ phức tạp.

## 2. Target users

**Primary user** (the one we optimize for):
- Các bạn trẻ, học sinh, sinh viên yêu thích trang trí góc học tập dễ thương, gọn gàng.
- Những người làm việc tại nhà (WFH), designer, creator muốn biến góc làm việc thành không gian đầy cảm hứng với phong cách pastel ấm áp.

**Secondary users** (nice to support, not the optimization target):
- Người sưu tầm mô hình nhỏ, figure, sticker muốn có kệ trưng bày nhỏ xinh trên bàn.
- Những người tìm kiếm quà tặng độc đáo, dễ thương cho bạn bè.

## 3. The "press release" (1 paragraph)

Hôm nay chúng tôi giới thiệu **in3D.help**, website giới thiệu và kinh doanh dòng sản phẩm kệ modular để bàn in 3D đáng yêu thương hiệu **BlueMoon's Studio**. Thay vì các loại kệ cồng kềnh truyền thống, BlueMoon's Studio mang đến giải pháp kệ pegboard mini siêu nhẹ in 3D với thiết kế bo tròn cực cute (`border-radius: 20px`), sử dụng mộng răng cưa jigsaw và chốt Connector hoa 4 cánh (quatrefoil) tháo lắp bằng tay dễ dàng. Với 3 combo linh hoạt chỉ từ 299K cùng bảng màu pastel kem ấm mềm mại, chúng tôi giúp bạn hô biến góc bàn bừa bộn thành một góc decor xinh xắn, tràn đầy năng lượng tích cực.

## 4. MVP scope (what's IN)

Cung cấp đầy đủ các thông tin và trải nghiệm mua sắm nhanh gọn cho khách hàng:
- [x] Landing page bán hàng (Sale Page) với thiết kế pastel kem ấm đồng bộ, bo tròn UI mềm mại.
- [x] Trình bày chi tiết 3 gói combo sản phẩm: **Starter Pegboard** (299K), **Pro Desk Setup** (399K) và **Creator Studio** (599K).
- [x] Minh họa các đặc tính sản phẩm thực tế: tấm nền chính 16x16, tấm viền bo tròn, mộng răng cưa jigsaw, chốt Connector hoa 4 cánh.
- [x] Các nút Call to Action (CTA) liên hệ và đặt mua nhanh dẫn trực tiếp về Zalo tư vấn của shop.

## 5. Non-goals (what's OUT of v1)

- Tính năng giỏ hàng và thanh toán trực tuyến tự động phức tạp (khách hàng chọn gói và thanh toán thủ công qua Zalo/chuyển khoản).
- Trình giả lập phối màu 3D tương tác trên web (việc tư vấn phối màu sẽ thực hiện trực tiếp 1-1 qua Zalo).

## 6. Success metrics

- Tốc độ tải trang di động Lighthouse đạt trên 95 điểm nhờ SSG và nén ảnh tối đa.
- Giao diện trực quan giúp tăng tỷ lệ nhấp nút liên hệ đặt hàng qua Zalo.

## 7. Constraints

- **Stack**: Astro Framework, CSS thuần tối giản, deploy lên Cloudflare Pages.

---

## Revision history

- 2026-07-27: Khởi tạo dự án in3D.help ban đầu bởi Bang & Antigravity.
- 2026-07-29: Rebrand và cập nhật Mission theo định hướng kinh doanh Kệ modular in 3D đáng yêu của BlueMoon's Studio.
