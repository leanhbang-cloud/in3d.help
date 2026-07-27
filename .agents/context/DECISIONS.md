# Decisions — Architecture Decision Records (ADRs)

> Why we chose X over Y. Append-only — never delete an ADR.
> If a decision is reversed, add a new ADR that supersedes the old one
> and update the old one's status to "Superseded by ADR-NNN".

> **For AI agents**: Before proposing any architectural change, consult this file.
> If your proposal contradicts an existing ADR, FLAG it explicitly:
> "This contradicts ADR-NNN. Should we supersede it?"
> Do not silently override past decisions.

---

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| ADR-001 | Sử dụng Astro làm framework chính và deploy lên Cloudflare Pages | Accepted | 2026-05-31 |
| ADR-008 | Chuẩn hóa bố cục trang con, cấu trúc Aside Mobile và mã màu Trail mới | Accepted | 2026-06-07 |
| ADR-009 | Tích hợp hệ thống Blog Content Collections và Content Engine sinh bài viết tự động | Accepted | 2026-06-25 |

<!--
How to add a new ADR:
1. Pick the next number (ADR-NNN). Never reuse a number.
2. Add a row to the Index table above.
3. Add a full section below using the template at the bottom of this file.
4. Commit with message: docs(adr): ADR-NNN <short title>
-->

---

## ADR-001: Sử dụng Astro làm framework chính và deploy lên Cloudflare Pages

**Status**: Accepted
**Date**: 2026-05-31
**Deciders**: Bang (Owner), Antigravity (AI Assistant)
**Tags**: frontend, architecture, deployment

### Context

Dự án `dinh-mountain-help` là một website cung cấp thông tin, cẩm nang tra cứu đầy đủ về trekking, tham quan Núi Dinh dành cho người mới bắt đầu.
Các yêu cầu cốt lõi của website bao gồm:
1. Hiệu năng tải trang cực nhanh (do mạng di động tại núi Dinh có thể rất yếu).
2. Tối ưu SEO vượt trội để người dùng dễ dàng tìm thấy qua Google.
3. Chi phí vận hành thấp hoặc miễn phí (phù hợp với mô hình solo builder).
4. Khả năng tích hợp dữ liệu dạng markdown/MDX dễ dàng (do nội dung có sẵn của dự án nằm ở file markdown).

### Decision

Chúng tôi quyết định sử dụng **Astro** làm framework phát triển giao diện (frontend) và triển khai (deploy) lên **Cloudflare Pages** vì những lý do sau:
- **Astro**: Là framework tối ưu nhất cho các website nhiều nội dung tĩnh (content-driven), mặc định xuất ra HTML tĩnh (Zero JS) giúp tối ưu hóa SEO và tốc độ tải trang cực nhanh trên thiết bị di động.
- **Cloudflare Pages**: Cung cấp gói miễn phí vô cùng hào phóng, tốc độ phân phối nội dung (CDN) hàng đầu thế giới, và tích hợp trực tiếp rất mượt mà với Astro.

### Consequences

- Positive:
  - Tốc độ tải trang nhanh vượt trội và điểm Core Web Vitals tối ưu.
  - Viết nội dung bằng Markdown/MDX rất thuận tiện, trực quan.
  - Chi phí lưu trữ và băng thông hoàn toàn miễn phí trên Cloudflare Pages.
- Negative:
  - Việc xử lý các tính năng động (như chatbot hoặc bình luận phức tạp) sẽ cần sử dụng thêm các hòn đảo tương tác (Islands) hoặc API phụ trợ (Serverless Functions).
- Risks:
  - Nếu số lượng trang tăng lên hàng chục nghìn trang trong tương lai, thời gian build tĩnh có thể tăng lên (tuy nhiên với quy mô dự án hiện tại điều này không đáng lo ngại).

### Alternatives considered

- **Option A**: Next.js. Bị từ chối vì Next.js mặc định sinh ra quá nhiều JavaScript dư thừa ở client-side cho một trang web đọc thông tin tĩnh, làm chậm tốc độ tải trang trên các kết nối 3G/4G yếu ở chân núi và tối ưu SEO không tốt bằng Astro đối với nội dung tĩnh.
- **Option B**: React thuần (SPA). Bị từ chối vì SEO cực kỳ kém do client-side rendering (CSR), không phù hợp với mục đích làm cổng thông tin tra cứu.

### References

- [Astro Documentation](https://astro.build/)
- [Cloudflare Pages Deployment Guide for Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

---

## ADR-008: Chuẩn hóa bố cục trang con, cấu trúc Aside Mobile và mã màu Trail mới

**Status**: Accepted
**Date**: 2026-06-07
**Deciders**: Bang (Owner), Antigravity (AI Assistant)
**Tags**: frontend, layout, responsive, trail-data

### Context

Khi kiểm thử visual trên mobile và desktop, chúng tôi phát hiện các trang con không đồng bộ về chiều cao Sub-hero, Spacing đệm gầm Header và cấu trúc cột Aside (Sidebar) chồng chéo.
Đồng thời, bản đồ Trail mới từ Hồ Bên Suối thay đổi toàn bộ 4 cung đường chính và hệ thống màu sắc nhận diện (Xanh Dương, Đỏ, Vàng, Xanh Lá), gây lệch màu nghiêm trọng giữa code CSS cũ và nội dung hiển thị.

### Decision

Chúng tôi quyết định:
1. **Chuẩn hóa Sub-hero**: Cao cố định 320px (Desktop) / 240px (Mobile), nội dung căn lề dưới (`align-items: flex-end`).
2. **Spacing**: `padding-top: var(--space-xl)` (48px) cố định từ gầm Sub-hero xuống phần tử nội dung đầu tiên ở cả 4 trang con.
3. **Lưới 2 cột 8/4**: Áp dụng cho các trang có Sidebar trên Desktop.
4. **Aside Mobile Strip**: Ẩn Aside trên di động và collapse thành các dải màu ngang (Forest/Gold/Cognac) xen kẽ trực tiếp trong luồng đọc chính.
5. **Class Màu Trực Tiếp**: Thay đổi datatype `difficultyClass` của trails thành `'blue' | 'red' | 'yellow' | 'green'` để map trực tiếp sang mã màu badge, giải quyết triệt để lỗi lệch màu dot/card.

### Consequences

- Positive:
  - Đồng bộ hóa visual cao cấp trên toàn bộ trang con.
  - Sửa đổi toàn bộ data `trails.ts` sang 4 tuyến trail xuất phát từ Hồ Bên Suối chuẩn xác 100%.
  - HTML trang Cung đường sạch hơn nhờ loại bỏ hoàn toàn khối Legend rườm rà, thay bằng dòng chú thích inline tinh tế.
  - Đảm bảo điểm hiệu năng và SEO tốt hơn trên di động nhờ tối ưu DOM Aside.
- Negative:
  - Cần chỉnh sửa lại datatype và các định nghĩa màu sắc ở nhiều file liên quan.
- Risks:
  - Cần kiểm tra kỹ lưỡng các trang con có sử dụng component CardA để tránh lỗi kiểu dữ liệu typescript.

### Alternatives considered

- **Option A**: Giữ nguyên hệ màu `cung-1` đến `cung-4`. Bị từ chối vì khi thay đổi cung đường hoặc số lượng cung đường, việc mapping màu sắc sẽ bị lệch và khó bảo trì.

### References

- [DESIGN_SYSTEM.md](file:///Users/mac/Projects/Dinh-Mountant-help/DESIGN_SYSTEM.md)


---

## ADR-009: Tích hợp hệ thống Blog Content Collections và Content Engine sinh bài viết tự động

**Status**: Accepted
**Date**: 2026-06-25
**Deciders**: Bang (Owner), Antigravity (AI Assistant)
**Tags**: content, blog, pipeline, automation

### Context

Để phát triển thương hiệu và tiếp cận lượng người dùng tìm kiếm thông tin leo núi Dinh một cách tự nhiên (SEO), dự án cần có một chuyên mục Blog được cập nhật bài viết liên tục, chất lượng cao, tích hợp thông tin thực địa phong phú từ anh Bang.
Các ràng buộc:
1. Solo builder vận hành một mình, cần tối ưu hóa tối đa thời gian viết bài nhưng vẫn phải giữ chất lượng nội dung chân thực.
2. Code giao diện Blog phải nhẹ, chuẩn SEO, load cực nhanh trên mobile sóng yếu.

### Decision

Chúng tôi quyết định:
1. **Sử dụng Astro Content Collections**: Lưu trữ các bài viết blog trực tiếp trong code dưới dạng Markdown/MDX tại `src/content/blog/` sử dụng schema tĩnh rõ ràng. Điều này giúp tối ưu hóa hiệu năng render tĩnh (SSR/Static), cực kỳ có lợi cho SEO và tốc độ tải trang.
2. **Xây dựng Content Engine tự động**: Phát triển một hệ thống script hàng đợi (`queue.tsv`, `run-queue-pipeline.sh`, `content-generator.sh`, `post-process.sh`) để tự động hóa quy trình viết bài.
3. **Sử dụng Genspark CLI**: Kích hoạt công cụ Genspark để tự động hóa việc tạo nội dung bài viết và sinh hình ảnh minh họa chất lượng cao theo style phẳng (Flat Illustration) phù hợp với Design System v1.2, đồng thời tích hợp chặt chẽ tài liệu chất liệu thực địa của anh Bang.
4. **Đồng bộ hóa Obsidian Vault**: Toàn bộ kết quả bài viết, ảnh, kịch bản Social Media sau khi sinh xong được sao lưu sang `/Users/Shared/obsidian-vault/blog-output/` để dễ quản lý.

### Consequences

- Positive:
  - Khả năng xuất bản 4-8 bài viết chất lượng cao chỉ trong vài phút, giúp duy trì tốc độ cập nhật nội dung cực tốt.
  - Hình ảnh minh họa đồng bộ về phong cách nghệ thuật, tạo dấu ấn thị giác cao cấp.
  - Hệ thống Blog load siêu nhanh, không có JS dư thừa ở client-side.
- Negative:
  - Cần duy trì file chất liệu thực địa thủ công để cung cấp đầu vào chất lượng cho AI.
- Risks:
  - Model AI có thể tạo ra các từ ngữ hoặc địa danh không chính xác nếu chất liệu thực địa đầu vào không đủ chi tiết; cần rà soát lại (QC) trước khi merge.

### Alternatives considered

- **Option A**: Viết blog thủ công qua một CMS bên ngoài (như Sanity, Strapi). Bị từ chối vì mất phí vận hành (hoặc setup phức tạp), tốc độ tải trang chậm hơn và tốn nhiều công sức đăng bài cho solo builder.
- **Option B**: Sử dụng Gemini API viết bài trực tiếp vào database D1. Bị từ chối vì chất lượng nội dung của Gemini API thô sơ hơn và khó tích hợp ảnh minh họa đồng bộ như Genspark CLI.

### References

- [CURRENT_FOCUS.md](file:///Users/bangle-macmini/Projects/dinh-mountain-help/.agents/context/CURRENT_FOCUS.md)
- [scripts/run-queue-pipeline.sh](file:///Users/bangle-macmini/Projects/dinh-mountain-help/scripts/run-queue-pipeline.sh)

---

<!--
=================================================================
TEMPLATE — copy below this line to create a new ADR
=================================================================

## ADR-NNN: <Short, declarative title>

**Status**: Proposed
**Date**: YYYY-MM-DD
**Deciders**: <names or roles>
**Tags**: <optional>

### Context

<problem, forces, constraints>

### Decision

We will <do X> because <reason>.

### Consequences

- Positive: <what gets easier>
- Negative: <what gets harder>
- Risks: <what could go wrong>

### Alternatives considered

- **Option A**: <description>. Rejected because: <reason>.
- **Option B**: <description>. Rejected because: <reason>.

### References

- <links, related ADRs, tickets>

=================================================================
-->
