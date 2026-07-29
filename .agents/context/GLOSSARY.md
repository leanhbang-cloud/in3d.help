# Glossary — in3D.help

> Project-specific terms, abbreviations, and concepts that have a
> specific meaning in this codebase. Read before any unclear word
> "feels obvious" — terms often mean different things in different teams.

---

## Terms

| Term | Definition | Context |
|------|------------|---------|
| **BlueMoon's Studio** | Thương hiệu thiết kế và sản xuất dòng sản phẩm kệ modular để bàn in 3D đáng yêu. | Thương hiệu sản phẩm |
| **Pegboard** | Tấm bảng đục lỗ đều nhau dùng làm nền tảng treo các khay đựng, móc treo, hộp cắm bút và các phụ kiện trang trí. | Cấu trúc sản phẩm |
| **Main Plate (Tấm nền chính)** | Tấm nền cốt lõi kích thước 16×16 cm, có các khớp mộng răng cưa ở 4 cạnh để ghép nối mở rộng vô hạn. | Cấu trúc sản phẩm |
| **Border Plate (Tấm viền)** | Các thanh viền (2×16 cm) lắp xung quanh các tấm nền chính để tạo khung chắc chắn và hoàn chỉnh. | Cấu trúc sản phẩm |
| **Corner Plate (Tấm góc)** | Các tấm bo góc tròn lắp ở 4 góc ngoài cùng của kệ, tạo độ mềm mại dễ thương cho thiết kế (`border-radius: 20px`). | Cấu trúc sản phẩm |
| **Connector hoa 4 cánh (quatrefoil)** | Khớp khóa chốt hình hoa 4 cánh lắp ở mặt sau để khóa chặt các mối ghép mộng răng cưa giữa các tấm nền, viền và góc với nhau. | Cấu trúc sản phẩm |
| **Jigsaw joint (Mộng răng cưa)** | Thiết kế khớp nối răng cưa thông minh ở các cạnh giúp các tấm ghép khớp với nhau khít và chắc chắn mà không cần keo. | Cấu trúc sản phẩm |
| **Astro SSG** | Công nghệ Static Site Generation (Tạo trang tĩnh) của Astro giúp tối ưu hóa tốc độ load trang cực nhanh cho Sale Page. | Công nghệ frontend |
| **Cloudflare Pages** | Dịch vụ hosting tĩnh và CDN của Cloudflare dùng để deploy trang web chính thức `3dprinting.ledainhan.com` từ GitHub. | Deployment & Infra |

---

## Acronyms (quick reference)

| Acronym | Expansion |
|---------|-----------|
| **ADR** | Architecture Decision Record (Hồ sơ quyết định kiến trúc) |
| **MVP** | Minimum Viable Product (Sản phẩm khả dụng tối thiểu) |
| **SSG** | Static Site Generation (Tạo trang tĩnh) |
| **CTA** | Call To Action (Nút kêu gọi hành động, ví dụ: "Đặt mua ngay") |
| **WFH** | Work From Home (Làm việc tại nhà) |

---

## Naming conventions (project-specific)

- **Component names**: Sử dụng PascalCase (ví dụ: `ProductShowcase.astro`, `ModularExplainer.astro`).
- **Styles**: Sử dụng vanilla CSS tổ chức trong các file CSS tại `src/styles/` hoặc viết trực tiếp trong thẻ `<style>` của Astro component.
- **Images**: Định dạng WebP siêu nén, đặt tên theo kiểu kebab-case (ví dụ: `hero-desk-setup.webp`). Lưu ở `public/images/`.

---

## Revision history

- 2026-07-27: Khởi tạo bảng thuật ngữ dự án ban đầu.
- 2026-07-29: Cập nhật toàn bộ thuật ngữ theo hiện trạng kệ modular để bàn in 3D của BlueMoon's Studio.
