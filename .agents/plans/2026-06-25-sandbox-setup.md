# Kế hoạch thiết lập môi trường Sandbox (Staging)

> **Mục tiêu**: Xây dựng một môi trường thử nghiệm (Sandbox) độc lập chạy trên sub-domain `sandbox.nuidinh.help` để kiểm thử toàn bộ tính năng, giao diện và nội dung blog trước khi merge vào nhánh `main` và deploy lên production.

---

## 1. Yêu cầu & Ràng buộc thiết kế

1. **Cô lập dữ liệu (Data Isolation)**:
   - Sandbox phải chạy trên database D1 độc lập (`nuidinh-db-sandbox`) để tránh việc kiểm thử làm thay đổi dữ liệu thật trên production (`nuidinh-db`).
   - R2 Bucket lưu trữ ảnh cũng nên được tách biệt hoặc cấu hình riêng để tránh xung đột file ảnh thực địa.
2. **Cấu hình gọn nhẹ (Single Config Source)**:
   - Sử dụng tính năng **Wrangler Environments** ngay trong file `wrangler.jsonc` hiện tại thay vì tạo nhiều file config khác nhau.
3. **Domain định tuyến**:
   - Sub-domain: `sandbox.nuidinh.help` cấu hình SSL tự động qua Cloudflare DNS.

---

## 2. Kế hoạch thực hiện (session sau)

### Bước 1: Khởi tạo tài nguyên trên Cloudflare
1. Tạo database D1 mới cho môi trường Sandbox:
   ```bash
   npx wrangler d1 create nuidinh-db-sandbox
   ```
2. Lưu lại `database_id` của database mới sinh.
3. Khởi tạo schema cho database sandbox bằng file sql hiện tại:
   ```bash
   npx wrangler d1 execute nuidinh-db-sandbox --env sandbox --file=./schema.sql
   ```

### Bước 2: Cập nhật cấu hình `wrangler.jsonc`
Bổ sung cấu hình môi trường `sandbox` dưới dạng `env.sandbox` vào file [wrangler.jsonc](file:///Users/bangle-macmini/Projects/dinh-mountain-help/wrangler.jsonc):

```json
{
  // Cấu hình production giữ nguyên
  "name": "dinh-mountain-help",
  "compatibility_date": "2026-05-31",
  ...
  
  // Cấu hình môi trường sandbox
  "env": {
    "sandbox": {
      "name": "dinh-mountain-help-sandbox",
      "routes": [
        {
          "pattern": "sandbox.nuidinh.help",
          "custom_domain": true
        }
      ],
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "nuidinh-db-sandbox",
          "database_id": "<database_id_sandbox_vừa_tạo>"
        }
      ],
      "vars": {
        "SITE_ORIGIN": "https://sandbox.nuidinh.help"
      }
    }
  }
}
```

### Bước 3: Cấu hình DNS trên Cloudflare
1. Truy cập Cloudflare Dashboard -> Domain `nuidinh.help` -> DNS Records.
2. Thêm bản ghi CNAME hoặc cấu hình Custom Domain cho Worker `dinh-mountain-help-sandbox` trỏ về sub-domain `sandbox.nuidinh.help`.

### Bước 4: Tích hợp script Deploy Sandbox
Cập nhật [package.json](file:///Users/bangle-macmini/Projects/dinh-mountain-help/package.json) để thêm script deploy sandbox:
```json
"scripts": {
  ...
  "deploy:sandbox": "npm run build && wrangler deploy --env sandbox"
}
```

---

## 3. Tiêu chí nghiệm thu (Acceptance Criteria)

- Chạy `npm run deploy:sandbox` thành công không lỗi.
- Truy cập được vào đường dẫn `https://sandbox.nuidinh.help`.
- Mọi thao tác ghi/đọc dữ liệu (như bình luận hoặc upload ảnh trong admin) chỉ tác động lên database `nuidinh-db-sandbox`, không ảnh hưởng tới production.
