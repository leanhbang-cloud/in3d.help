# TEST PLAN: dinh-mountain-help — Kiểm thử Hậu Chuyển đổi Kỹ thuật

**Phiên bản:** 1.0.0
**Ngày lập:** 2026-06-19
**Người lập:** QA Lead / QC Engineer (Antigravity & Genspark)
**Trạng thái:** Active
**Phạm vi:** Kiểm thử toàn diện sau đợt chuyển đổi Cloudflare Pages SSR → Workers SSR, vá lỗ hổng CORS/CSRF, và cập nhật Cookie SameSite

---

## MỤC LỤC

1. Tổng quan & Mục tiêu
2. Phạm vi kiểm thử
3. Môi trường kiểm thử
4. Layer 1: Frontend UI/UX (Client-side)
5. Layer 2: API & Backend Logic
6. Layer 3: Database & D1 Storage (CRUD & Migrations)
7. Layer 4: KV Storage & Session Management
8. Layer 5: Security & CSRF/SameSite Protection
9. Đánh giá Rủi ro Tiềm ẩn & Đề xuất Khắc phục
10. Tiêu chí Hoàn thành (Exit Criteria)
11. Checklist nhanh trước khi Go-Live

---

## 1. TỔNG QUAN & MỤC TIÊU

### 1.1 Bối cảnh dự án
Website **dinh-mountain-help** là một ứng dụng Astro SSR cung cấp thông tin về Núi Dinh, vận hành trên Cloudflare Workers. Sau đợt chuyển đổi kỹ thuật quan trọng bao gồm thay đổi hosting từ Pages sang Workers, vá bảo mật CORS/CSRF, và điều chỉnh cookie behavior, toàn bộ hệ thống cần được kiểm thử từ đầu đến cuối để đảm bảo không có lỗi phát sinh (regression), không rò rỉ bảo mật, và trải nghiệm người dùng không bị gián đoạn.

### 1.2 Mục tiêu tổng thể
Test Plan này hướng đến ba mục tiêu chính:
1. Xác nhận mọi chức năng hiện có vẫn hoạt động đúng sau khi chuyển đổi hạ tầng (đặc biệt là phục vụ static assets và render trang động).
2. Xác nhận các bản vá bảo mật hoạt động đúng thiết kế và không bị bypass.
3. Phát hiện sớm các rủi ro tiềm ẩn phát sinh từ sự thay đổi về routing, asset serving, cookie và session management.

### 1.3 Các thay đổi cần kiểm thử đặc biệt
- **Chuyển đổi sang Workers SSR**: Thay đổi cấu trúc asset tĩnh, cấu hình `remoteBindings: false` khi build.
- **Vá lỗ hổng validateOrigin**: Thay đổi logic so sánh hostname (toLowerCase) và lọc subdomain chính xác (`.leanhbang27983.workers.dev`).
- **Cookie SameSite=Lax**: Thay đổi thuộc tính cookie để admin không bị logout khi truy cập từ liên kết ngoài.

---

## 2. PHẠM VI KIỂM THỬ

### 2.1 Trong phạm vi (In-Scope)
Toàn bộ 5 layer kỹ thuật sẽ được kiểm thử:
- **Frontend UI/UX**: Render SSR phía server, tải static assets (`.js`, `.css`, ảnh), layout responsive.
- **API & Backend**: Đăng nhập, thêm ảnh, gửi bình luận, duyệt ảnh/bình luận ở admin panel.
- **Database D1**: Kiểm tra cấu trúc các bảng `photos`, `comments`, `admin_sessions` và các index.
- **KV Store**: Kiểm tra tính nhất quán của Session khi ghi nhận token.
- **Security**: CORS origin validation, chống CSRF, Cookie attributes (`HttpOnly`, `Secure`, `SameSite=Lax`).

### 2.2 Ngoài phạm vi (Out-of-Scope)
- Load testing chịu tải hàng ngàn user đồng thời.
- SEO audit chi tiết và tối ưu hóa hiệu năng sâu (ngoài việc xác nhận asset serving).

---

## 3. MÔI TRƯỜNG KIỂM THỬ

### 3.1 Môi trường Local (Dev)
- **Runtime**: `wrangler dev` (giả lập môi trường Workers cục bộ).
- **DB**: D1 Local (SQLite)
- **KV**: KV Local
- **URL**: `http://localhost:4321` hoặc `http://localhost:8788`

### 3.2 Môi trường Production
- **Platform**: Cloudflare Workers
- **Workers URL**: `https://dinh-mountain-help.leanhbang27983.workers.dev`
- **Legacy URL**: `https://dinh-mountain-help.pages.dev` (Pages cũ để test origin bypass)
- **DB**: Cloudflare D1 Remote (`nuidinh-db`)
- **KV**: KV Namespace `SESSION` (ID: `1adf3bbda4f6497695a43dea08d501ed`)

---

## 4. LAYER 1: FRONTEND UI/UX (Client-side)

### 4.1 Mục tiêu kiểm thử
Xác nhận toàn bộ giao diện người dùng vẫn hiển thị đúng và đầy đủ sau khi thay đổi `directory` của static assets từ `./dist` sang `./dist/client` trong `wrangler.jsonc`. Nếu assets không được serve đúng, CSS/JS sẽ trả về lỗi 404 và vỡ giao diện.

---

### TC-FE-001: Kiểm tra static assets được serve đúng đường dẫn
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  1. Mở trình duyệt, truy cập URL: `https://dinh-mountain-help.leanhbang27983.workers.dev`
  2. Mở DevTools (F12) → Tab **Network**, filter theo `JS`, `CSS`, `Img`.
  3. Nhấn `Ctrl + Shift + R` (hoặc `Cmd + Shift + R` trên Mac) để hard reload trang.
  4. Quan sát các file CSS, JS tải từ thư mục `_astro/`.
- **Kết quả mong đợi (Expected Results)**:
  - Mọi static assets tải thành công với mã **HTTP 200** (không có lỗi 404).
  - Giao diện hiển thị đẹp mắt, đầy đủ CSS, font chữ và hình ảnh.

---

### TC-FE-002: Kiểm tra SSR render nội dung động từ Database
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  1. Truy cập trang chủ hoặc trang Thư viện ảnh.
  2. Xem các hình ảnh và bình luận có hiển thị dữ liệu thực tế từ database hay không.
  3. Mở Terminal chạy lệnh: `curl -s https://dinh-mountain-help.leanhbang27983.workers.dev` và kiểm tra xem trong code HTML thô trả về có sẵn thẻ chứa dữ liệu động (bình luận, ảnh) chưa (xác minh server-side rendering hoạt động).
- **Kết quả mong đợi (Expected Results)**:
  - Dữ liệu động được chèn trực tiếp vào HTML thô gửi từ server.
  - Người dùng không phải chờ JS chạy ở client để render dữ liệu.

---

### TC-FE-003: Giao diện Admin quản lý (Dashboard)
- **Mức độ ưu tiên**: High
- **Các bước thực hiện (Steps)**:
  1. Truy cập `/admin` và tiến hành đăng nhập.
  2. Kiểm tra danh sách ảnh đang chờ duyệt và bình luận đang chờ duyệt.
  3. Kiểm tra responsive của bảng điều khiển admin trên các kích thước màn hình điện thoại và máy tính.
- **Kết quả mong đợi (Expected Results)**:
  - Giao diện admin render chính xác, không vỡ layout.
  - Các button Duyệt/Từ chối hiển thị rõ ràng và dễ bấm.

---

## 5. LAYER 2: API & BACKEND LOGIC

### 5.1 Mục tiêu kiểm thử
Kiểm tra các endpoint API phục vụ tương tác (bình luận, upload ảnh) và đăng nhập admin chạy trên Cloudflare Workers.

---

### TC-API-001: Đăng nhập admin thành công (Happy Path)
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  1. Gửi POST request đăng nhập qua cURL hoặc thực hiện trên UI:
     ```bash
     curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
       -H "Content-Type: application/json" \
       -H "Origin: https://dinh-mountain-help.leanhbang27983.workers.dev" \
       -d '{"password":"<mat_khau>"}' -v
     ```
  2. Kiểm tra mã trạng thái HTTP trả về và Cookie trong header.
- **Kết quả mong đợi (Expected Results)**:
  - Trả về **HTTP 200 OK** và JSON `{ "success": true, "message": "Đăng nhập thành công" }`.
  - Header `Set-Cookie` chứa `admin_session=<token>; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`.

---

### TC-API-002: Đăng nhập admin thất bại (Sai mật khẩu)
- **Mức độ ưu tiên**: High
- **Các bước thực hiện (Steps)**:
  1. Gửi POST request đăng nhập với mật khẩu sai hoặc rỗng:
     ```bash
     curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
       -H "Content-Type: application/json" \
       -H "Origin: https://dinh-mountain-help.leanhbang27983.workers.dev" \
       -d '{"password":"mat_khau_sai"}' -v
     ```
- **Kết quả mong đợi (Expected Results)**:
  - Trả về **HTTP 401 Unauthorized** hoặc **HTTP 400 Bad Request**.
  - Không có header `Set-Cookie` cấp session token mới.

---

### TC-API-003: Gửi bình luận và Upload ảnh tĩnh
- **Mức độ ưu tiên**: High
- **Các bước thực hiện (Steps)**:
  1. Gửi bình luận mới ở một trang chi tiết cung đường.
  2. Gửi một ảnh mới qua form upload thư viện ảnh.
- **Kết quả mong đợi (Expected Results)**:
  - API nhận dữ liệu thành công, trả về HTTP 200/201.
  - Bình luận/Ảnh được lưu vào DB ở trạng thái `pending_review` (chưa hiển thị công khai ngay).

---

## 6. LAYER 3: DATABASE & D1 STORAGE (CRUD & Migrations)

### 6.1 Mục tiêu kiểm thử
Xác minh tính toàn vẹn dữ liệu trong D1, cấu trúc bảng và hiệu suất query (sử dụng Index).

---

### TC-DB-001: Xác minh cấu trúc schema và index
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  1. Sử dụng wrangler CLI truy vấn schema từ D1 remote:
     ```bash
     npx wrangler d1 execute nuidinh-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
     ```
  2. Kiểm tra các index tồn tại trên bảng `photos` và `comments`:
     ```bash
     npx wrangler d1 execute nuidinh-db --remote --command "SELECT name, tbl_name FROM sqlite_master WHERE type='index';"
     ```
- **Kết quả mong đợi (Expected Results)**:
  - Tồn tại đủ 3 bảng: `photos`, `comments`, `admin_sessions`.
  - Có index trên `photos(status)`, `photos(slug)`, `comments(page_id, status)` và `admin_sessions(token)`.

---

### TC-DB-002: Kiểm tra các ràng buộc dữ liệu (CHECK & UNIQUE Constraints)
- **Mức độ ưu tiên**: High
- **Các bước thực hiện (Steps)**:
  1. Thử insert một record bình luận có status không hợp lệ (ví dụ `approved_fake` thay vì `approved`):
     ```bash
     npx wrangler d1 execute nuidinh-db --remote --command "INSERT INTO comments (page_id, content, status) VALUES ('cung-duong-den', 'Nội dung test', 'approved_fake');"
     ```
  2. Thử insert session token bị trùng lặp.
- **Kết quả mong đợi (Expected Results)**:
  - Thao tác insert dữ liệu không hợp lệ hoặc trùng lặp token phải bị D1 chặn lại và báo lỗi ràng buộc (**SQLITE_CONSTRAINT**).

---

## 7. LAYER 4: KV STORAGE & SESSION MANAGEMENT

### 7.1 Mục tiêu kiểm thử
Xác minh cơ chế quản lý session admin qua KV kết hợp D1. Đảm bảo session được đồng bộ hóa và hết hạn chính xác.

---

### TC-KV-001: Đồng bộ hóa Session khi Đăng nhập và Đăng xuất
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  1. Đăng nhập qua UI hoặc API thành công, lấy session token.
  2. Truy vấn trực tiếp KV Namespace từ Wrangler CLI để xem token đã được ghi chưa:
     ```bash
     npx wrangler kv key get --binding=SESSION "<token_value>"
     ```
  3. Truy vấn D1 remote bảng `admin_sessions` xem có record tương ứng chưa.
  4. Thực hiện Đăng xuất (Logout) và kiểm tra lại cả KV và D1.
- **Kết quả mong đợi (Expected Results)**:
  - Sau khi đăng nhập: Token tồn tại ở cả KV Namespace `SESSION` và bảng `admin_sessions` của D1.
  - Sau khi đăng xuất: Token bị xóa hoàn toàn khỏi cả KV và D1.

---

### TC-KV-002: Session hết hạn tự động
- **Mức độ ưu tiên**: High
- **Các bước thực hiện (Steps)**:
  1. Thay đổi thời gian hết hạn (`expires_at`) của một session token hoạt động trong D1 về quá khứ:
     ```bash
     npx wrangler d1 execute nuidinh-db --remote --command "UPDATE admin_sessions SET expires_at = datetime('now', '-5 minutes') WHERE token = '<token_id>';"
     ```
  2. Dùng token đó gửi request lên một API cần quyền admin.
- **Kết quả mong đợi (Expected Results)**:
  - API từ chối request và trả về **401 Unauthorized**.
  - Không cho phép admin truy cập giao diện dashboard.

---

## 8. LAYER 5: SECURITY & CSRF/SameSite PROTECTION

### 8.1 Mục tiêu kiểm thử
Đảm bảo các thay đổi bảo mật hoạt động đúng, ngăn chặn hiệu quả các nguồn giả mạo (CORS/CSRF bypass) và khắc phục được lỗi tự động logout của admin.

---

### TC-SEC-001: Kiểm thử Whitelist Origin trong validateOrigin (Chống CSRF)
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  Thực hiện gửi request POST đăng nhập admin với các giá trị header `Origin` khác nhau:

  ```bash
  # 1. Thử Origin hợp lệ của Workers mới (Expected: ALLOW)
  curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
    -H "Content-Type: application/json" \
    -H "Origin: https://dinh-mountain-help.leanhbang27983.workers.dev" \
    -d '{"password":"<mat_khau>"}' -v

  # 2. Thử Origin Pages cũ (Expected: ALLOW)
  curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
    -H "Content-Type: application/json" \
    -H "Origin: https://dinh-mountain-help.pages.dev" \
    -d '{"password":"<mat_khau>"}' -v

  # 3. Thử Origin giả mạo (Expected: BLOCK 403)
  curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
    -H "Content-Type: application/json" \
    -H "Origin: https://attacker.workers.dev" \
    -d '{"password":"<mat_khau>"}' -v

  # 4. Thử Subdomain giả mạo kết hợp đuôi hợp lệ (Expected: BLOCK 403)
  curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
    -H "Content-Type: application/json" \
    -H "Origin: https://dinh-mountain-help.leanhbang27983.workers.dev.evil.com" \
    -d '{"password":"<mat_khau>"}' -v

  # 5. Thử Origin viết HOA để kiểm tra toLowerCase() bypass (Expected: ALLOW)
  curl -X POST https://dinh-mountain-help.leanhbang27983.workers.dev/api/auth/login \
    -H "Content-Type: application/json" \
    -H "Origin: HTTPS://DINH-MOUNTAIN-HELP.LEANHBANG27983.WORKERS.DEV" \
    -d '{"password":"<mat_khau>"}' -v
  ```
- **Kết quả mong đợi (Expected Results)**:
  - Các case **1, 2, 5** phải được **chấp nhận** (HTTP 200 hoặc trả về lỗi đăng nhập thường 401 chứ không phải lỗi origin 403).
  - Các case **3, 4** phải bị **chặn hoàn toàn** với mã **HTTP 403 Forbidden** và thông báo lỗi `"Forbidden: Invalid origin"`.

---

### TC-SEC-002: Kiểm thử Cookie SameSite=Lax (Sửa lỗi logout admin)
- **Mức độ ưu tiên**: Critical
- **Các bước thực hiện (Steps)**:
  1. Đăng nhập vào Admin Dashboard thành công để lưu cookie `admin_session`.
  2. Mở một tab mới trong trình duyệt, truy cập vào một trang web khác (ví dụ: Google, Facebook).
  3. Tại trang web đó, gõ trực tiếp URL `/admin` vào thanh địa chỉ: `https://dinh-mountain-help.leanhbang27983.workers.dev/admin` rồi bấm Enter (Top-level Navigation).
  4. Tạo một trang HTML cục bộ hoặc click vào một liên kết từ ứng dụng chat (như Telegram/Zalo) trỏ thẳng đến `https://dinh-mountain-help.leanhbang27983.workers.dev/admin` (External Link Click).
- **Kết quả mong đợi (Expected Results)**:
  - Cả hai hành động gõ URL trực tiếp và click link từ nguồn ngoài **đều không làm admin bị logout**.
  - Cookie `admin_session` được gửi kèm thành công vì cookie được cấu hình `SameSite=Lax`.

---

## 9. ĐÁNH GIÁ RỦI RO TIỀM ẨN & ĐỀ XUẤT KHẮC PHỤC

Từ những thay đổi kỹ thuật vừa thực hiện, chúng tôi nhận thấy các rủi ro tiềm ẩn sau:

| Rủi ro phát sinh | Ảnh hưởng | Đề xuất khắc phục / Kiểm tra thêm |
|---|---|---|
| **Rủi ro 1**: Lỗi đồng bộ tĩnh (`dist/client` vs `dist`) | Trình duyệt không tải được CSS/JS khiến giao diện bị vỡ nát. | Đảm bảo lệnh build tạo đúng thư mục `dist/client` trước khi deploy. Verify bằng `TC-FE-001`. |
| **Rủi ro 2**: CORS/CSRF whitelist quá rộng | Kẻ tấn công có thể craft các subdomain Workers của riêng họ để gửi request giả mạo. | Hàm `validateOrigin` đã được kiểm duyệt chỉ chấp nhận subdomain chính xác của anh Bang (`.leanhbang27983.workers.dev`). Cần verify nghiêm ngặt bằng `TC-SEC-001`. |
| **Rủi ro 3**: Cookie Lax bị lạm dụng nếu có API thay đổi dữ liệu bằng GET | Nếu API duyệt ảnh hay duyệt bình luận dùng method GET, kẻ tấn công có thể chèn link ẩn để thực hiện thao tác bất hợp pháp thông qua cookie Lax. | **Tuyệt đối không sử dụng GET cho bất kỳ API thay đổi trạng thái nào** (ví dụ duyệt/xóa ảnh, bình luận). Tất cả các API viết đều phải dùng POST, PATCH hoặc DELETE. |
| **Rủi ro 4**: Cache cũ của Cloudflare Pages che khuất code Workers mới | Người dùng truy cập trỏ vào cache cũ hoặc routing cũ không được làm mới. | Thực hiện **Purge Cache (Purge Everything)** trên Cloudflare Dashboard sau khi hoàn tất migration DNS. |
| **Rủi ro 5**: remoteBindings: false ảnh hưởng đến AI bindings khi chạy thật | Nếu code sử dụng Cloudflare AI binding trong runtime thật mà bị config này làm mất liên kết. | Theo config, `remoteBindings: false` chỉ tắt remote binding ở local build. Trên runtime Workers production, Cloudflare tự động tiêm binding trực tiếp nên không bị ảnh hưởng. Tuy nhiên, vẫn cần run test API nào sử dụng AI bindings (nếu có). |

---

## 10. TIÊU CHII HOÀN THÀNH (EXIT CRITERIA)

Môi trường kiểm thử được phê duyệt sẵn sàng vận hành chính thức khi:
1. **100% các Test Case Critical đạt trạng thái PASS** (đặc biệt là phục vụ static assets, login admin và chặn origin CORS giả mạo).
2. Các lỗi phát sinh được ghi nhận đầy đủ vào `ISSUES_LOG.md`.
3. Có bằng chứng xác minh cụ thể (log request hoặc ảnh chụp màn hình).

---

## 11. CHECKLIST NHANH TRƯỚC KHI GO-LIVE

- [ ] `wrangler.jsonc` đã trỏ đúng `"directory": "./dist/client"`.
- [ ] Hàm `validateOrigin` chỉ cho phép domain của anh Bang (`.leanhbang27983.workers.dev`), Pages cũ, và localhost.
- [ ] Toàn bộ API ghi nhận dữ liệu (POST, PUT, DELETE) đều check `validateOrigin` thành công.
- [ ] Cookie đăng nhập có thuộc tính `HttpOnly`, `Secure` và `SameSite=Lax`.
- [ ] Đã chạy seed dữ liệu thành công trên database remote `nuidinh-db`.
- [ ] Đã link đúng KV Namespace `SESSION` ID `1adf3bbda4f6497695a43dea08d501ed`.
