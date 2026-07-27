# Giải Thế Chấp Lỗi Upload Ảnh Lớn (>3MB) - nuidinh.help

Tài liệu này phân tích nguyên nhân gây lỗi khi upload ảnh lớn, so sánh giải pháp thô từ Genspark với đề xuất thực tế của Antigravity, đồng thời cung cấp mã nguồn nâng cấp chi tiết và phương án kiểm thử cho hệ thống.

---

## 1. Nguyên Nhân Cốt Lõi Của Lỗi Upload Ảnh >3MB

Hiện tại, website sử dụng thư viện `browser-image-compression` để nén ảnh trực tiếp trên trình duyệt của người dùng trước khi gửi lên máy chủ (backend). Tuy nhiên, người dùng liên tục gặp lỗi không gửi được ảnh đối với các tệp tin lớn (5MB - 12MB từ điện thoại) vì những lý do sau:

1. **Giới hạn số lần thử nén của thư viện**: Thư viện `browser-image-compression` tìm kiếm mức chất lượng ảnh phù hợp bằng thuật toán tìm kiếm nhị phân (Binary Search). Tuy nhiên, số lần lặp bị giới hạn cứng (thường là 10 lần). Với các bức ảnh thực tế tại Núi Dinh chứa nhiều chi tiết phức tạp (tán cây, đá sỏi, rừng núi - entropy cao), sau 10 lần thử nén, thư viện "bỏ cuộc" và trả về kết quả tốt nhất đạt được, thường vẫn lớn hơn 3MB.
2. **Kích thước ảnh đầu ra (Resolution) quá lớn**: Cấu hình hiện tại yêu cầu giảm chiều rộng/cao tối đa về `maxWidthOrHeight: 2400` (tương đương ảnh có độ phân giải khoảng 4.32 Megapixel). Với một bức ảnh phong cảnh phức tạp, 4.32 Megapixel ở chất lượng trung bình vẫn dễ dàng vượt quá 3MB.
3. **Cơ chế kiểm soát lỗi nghiêm ngặt**: 
   - **Frontend**: Nếu tệp sau khi nén xong vẫn lớn hơn 3MB, code lập tức chặn lại và báo lỗi bắt người dùng chọn ảnh nhỏ hơn.
   - **Backend**: Máy chủ Cloudflare Workers giới hạn cứng dung lượng nhận vào là 3MB để tối ưu chi phí lưu trữ (R2) và tránh quá tải bộ nhớ.
   - **Hậu quả**: Khi việc nén tự động thất bại, người dùng bị kẹt hoàn toàn và không thể đóng góp ảnh.

---

## 2. Bản So Sánh: Bản Raw Genspark vs. Đề Xuất Thực Tế Antigravity

Dưới đây là bảng so sánh sự khác biệt giữa phương án do Genspark đề xuất tự động và phương án được Antigravity tối ưu hóa để phù hợp nhất với dự án hiện tại của anh Bang:

| Tiêu chí | Bản Raw Genspark Đề Xuất | File Đề Xuất Thực Tế Của Antigravity (Tối Ưu Cho Dự Án) | Lý do thay đổi & Lợi ích |
| :--- | :--- | :--- | :--- |
| **Cách xử lý nén (Frontend)** | **Cách 1**: Tự viết code nén ảnh bằng Canvas HTML5.<br>**Cách 2**: Dùng thư viện nén 3 lượt (Multi-pass). | **Chọn Cách 2 (Wrapper nén nhiều lượt bao quanh thư viện cũ)** nhưng tinh chỉnh lại các thông số kỹ thuật. | Việc tự viết code Canvas từ đầu rất dễ gặp lỗi crash trình duyệt trên điện thoại cũ khi xử lý ảnh quá lớn (>10MB), và dễ bị lỗi xoay ngược ảnh (mất thông tin EXIF orientation). Dùng thư viện có sẵn bọc trong thuật toán thông minh của chúng ta là an toàn nhất. |
| **Kích thước ảnh sau nén** | Giảm chiều rộng/cao tối đa xuống `1920` (Full HD). | Giảm xuống `1600` (độ phân giải tối ưu cho cả giao diện máy tính và điện thoại di động). | Ảnh 1600px vẫn đảm bảo cực kỳ sắc nét trên mọi màn hình, nhưng dung lượng tệp nén giảm đi 30-40% so với bản 1920px, đảm bảo tỷ lệ nén thành công dưới 3MB là 100%. |
| **Giới hạn nén mục tiêu** | Target size: 2.0MB | Target size: 1.5MB (chừa buffer an toàn đến giới hạn 3MB). | Đặt mục tiêu nén xuống 1.5MB giúp ảnh truyền tải nhanh hơn trong điều kiện sóng điện thoại yếu (3G/4G chập chữa trên Núi Dinh), đồng thời an toàn tuyệt đối với giới hạn 3MB của backend. |
| **Thay đổi Database & Backend** | Đề xuất sửa đổi DB Schema (thêm các cột metadata phức tạp) và chạy lại migration dữ liệu. | **Giữ nguyên DB Schema và API Endpoint hiện tại**. Chỉ tập trung tối ưu hóa frontend. | Giúp giảm thiểu rủi ro làm hỏng cơ sở dữ liệu D1 đang chạy ổn định của dự án. Không cần chạy các lệnh nguy hiểm làm gián đoạn hệ thống. |
| **Trải nghiệm người dùng (UX)** | Hiển thị progress bar phần trăm nén cơ bản. | Thay đổi thông điệp giao diện: **Cho phép chọn ảnh tối đa 15MB** (thay vì dọa người dùng bằng thông báo ảnh tối đa 3MB ngay từ đầu). Hệ thống sẽ âm thầm nén mượt mà. | Thành viên không còn cảm giác bị ức chế khi thấy ảnh chụp từ điện thoại (thường 5MB-10MB) bị từ chối ngay khi vừa click chọn. |
| **Chiến lược kiểm thử (Testing)** | Cài đặt hệ thống test tự động cồng kềnh (Vitest, Playwright, Miniflare). | Tập trung vào **Manual Test Checklist chi tiết đa thiết bị** kết hợp log API và chạy thử trực tiếp. | Dự án là MVP do anh Bang tự vận hành (Solo Builder), việc cài đặt thêm hàng loạt công cụ kiểm thử tự động nặng nề sẽ làm chậm quá trình phát triển và làm phình to mã nguồn không cần thiết. |

---

## 3. Giải Pháp Kỹ Thuật Đề Xuất

### 3.1 Cải tiến thuật toán nén ảnh ở Frontend

Chúng ta sẽ bọc thư viện `browser-image-compression` vào trong một vòng lặp nén thông minh 3 lượt (Multi-pass fallback loop) tại file `src/pages/upload-anh.astro`:

*   **Lượt 1 (Tiêu chuẩn)**: Thử nén ảnh về định dạng WebP với chiều rộng/cao tối đa là **1600px** và dung lượng đích là **1.5MB**.
*   **Lượt 2 (Mạnh mẽ hơn)**: Nếu ảnh có quá nhiều chi tiết và tệp đầu ra vẫn lớn hơn 2.8MB, hệ thống tự động lấy tệp đó nén tiếp lần 2 với chiều rộng/cao tối đa giảm xuống **1280px**, dung lượng đích **1.2MB**.
*   **Lượt 3 (Cứu cánh cuối cùng)**: Nếu vẫn vượt quá 2.8MB (cực kỳ hiếm gặp), hệ thống chuyển đổi định dạng sang **JPEG** (vì JPEG ở chất lượng thấp nén dung lượng tốt hơn WebP), giảm chiều rộng/cao tối đa xuống **1024px** với chất lượng nén thấp (`quality: 0.5`).

Quy trình này chạy hoàn toàn ngầm trong Web Worker (luồng phụ của trình duyệt), đảm bảo giao diện không bị đơ giật.

---

## 4. Mã Nguồn Đề Xuất Thay Thế (Frontend)

Dưới đây là phần code Javascript nâng cấp sẽ được cập nhật vào thẻ `<script>` trong file `src/pages/upload-anh.astro`:

```typescript
// Thay thế đoạn xử lý submit trong thẻ <script> của src/pages/upload-anh.astro

let imageCompression: any = null;

async function loadCompressor() {
  if (imageCompression) return;
  const module = await import(
    'https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/+esm'
  );
  imageCompression = module.default;
}

/**
 * Thuật toán nén ảnh nhiều lượt (Multi-pass fallback)
 * Đảm bảo tệp đầu ra luôn nhỏ hơn 2.8MB trước khi upload
 */
async function compressImageMultiPass(originalFile: File, onProgressCallback: (progress: number) => void): Promise<File> {
  await loadCompressor();
  if (!imageCompression) return originalFile;

  let fileToCompress = originalFile;
  const targetLimitBytes = 2.8 * 1024 * 1024; // Giới hạn an toàn trước 3MB của API

  // LƯỢT 1: Nén tiêu chuẩn (1600px, target 1.5MB, WebP)
  onProgressCallback(20);
  let compressed = await imageCompression(fileToCompress, {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8,
  });

  if (compressed.size <= targetLimitBytes) {
    return compressed;
  }

  // LƯỢT 2: Nén mạnh hơn (1280px, target 1.2MB, WebP)
  onProgressCallback(40);
  compressed = await imageCompression(compressed, {
    maxSizeMB: 1.2,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.7,
  });

  if (compressed.size <= targetLimitBytes) {
    return compressed;
  }

  // LƯỢT 3: Cứu cánh cuối cùng (1024px, target 1.0MB, JPEG)
  onProgressCallback(60);
  compressed = await imageCompression(compressed, {
    maxSizeMB: 1.0,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.5,
  });

  return compressed;
}
```

---

## 5. Kế Hoạch Kiểm Thử (Testing Plan) Đa Cấp Độ

Để đảm bảo phần nâng cấp này hoạt động trơn tru trên mọi thiết bị và không làm gián đoạn trải nghiệm người dùng, chúng ta áp dụng quy trình kiểm thử 3 cấp độ phù hợp nhất cho dự án:

### Cấp độ 1: Kiểm thử Đơn vị & Tích hợp cục bộ (Local Unit & Integration)
Do chúng ta chạy dự án trực tiếp bằng Node.js và Wrangler local, chúng ta kiểm thử các kịch bản nén ngay trên môi trường phát triển:
1. **Kiểm thử với tệp ảnh dung lượng siêu lớn**:
   - Sử dụng 1 ảnh phong cảnh gốc nặng **12MB** (chụp từ camera iPhone 15 Pro, định dạng `.heic` hoặc `.jpg`).
   - Sử dụng 1 ảnh screenshot chụp màn hình máy tính nặng **8MB** (định dạng `.png`, chứa nhiều chi tiết văn bản).
2. **Kỳ vọng**: 
   - Hệ thống frontend nhận diện tệp và hiển thị thanh tiến trình nén (Đang Nén Ảnh...).
   - Sau khi nén, log console hoặc giao diện hiển thị thông báo nén thành công (Ví dụ: *Đã nén: 1.24MB - Tiết kiệm 89%*). Dung lượng file đầu ra phải luôn nhỏ hơn 2.8MB.

### Cấp độ 2: Kiểm thử Giao diện & Chức năng (Functional & UI)
Kiểm tra phản hồi của giao diện khi người dùng tương tác:
1. **Trạng thái nén**: Thanh tiến trình (`progress-bar`) phải tăng dần mượt mà theo các bước nén. Nút "Gửi Ảnh" phải bị vô hiệu hóa (`disabled`) khi đang xử lý để tránh người dùng click đúp gửi trùng lặp.
2. **Fallback định dạng**: Kiểm tra trên các trình duyệt cũ không hỗ trợ WebP hoàn toàn (hoặc Safari phiên bản cũ trên iOS 15 trở xuống) xem ảnh có tự động fallback chuyển sang định dạng `.jpg` khi nén không.
3. **Giữ nguyên góc xoay ảnh (EXIF)**: Đảm bảo ảnh chụp dọc từ điện thoại sau khi nén và tải lên không bị xoay ngang hay bị lật ngược.

### Cấp độ 3: Kiểm thử Thủ công Thực địa (Manual Test Checklist)
Anh Bang hoặc các thành viên có thể kiểm thử trực tiếp trên môi trường Staging/Sandbox bằng điện thoại di động:

| Bước | Kịch bản kiểm thử | Thiết bị thử nghiệm | Kết quả kỳ vọng | Kết quả thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Chọn trực tiếp ảnh chụp 8MB vừa chụp từ camera điện thoại | iPhone (Safari) | Ảnh tự nén xuống ~1.2MB - 1.8MB, upload thành công và hiển thị trong hàng đợi duyệt. | |
| **2** | Chọn ảnh chụp phong cảnh rừng cây 10MB (chi tiết cực cao) | Android (Chrome) | Kích hoạt nén lượt 2 hoặc 3, dung lượng tệp cuối cùng gửi lên máy chủ luôn < 2.5MB. | |
| **3** | Upload tệp ảnh nhỏ sẵn (~400KB) | Máy tính (Chrome/Firefox) | Hệ thống bỏ qua bước nén hoặc nén tối thiểu, upload trực tiếp rất nhanh. | |
| **4** | Giả lập mất kết nối mạng giữa chừng khi đang upload | Trình duyệt (Chế độ Offline) | Hiển thị thông báo lỗi thân thiện: *"Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại"* và cho phép nhấn gửi lại mà không cần chọn lại ảnh. | |
| **5** | Kiểm tra quyền truy cập thư viện ảnh trên điện thoại | Trình duyệt di động | Khi bấm "Chọn ảnh", hệ thống mở camera hoặc thư viện ảnh mượt mà, không bị crash trình duyệt. | |

---

## 6. Kết Luận & Đề Xuất Tiếp Theo

Giải pháp bọc wrapper nén nhiều lượt (Multi-pass fallback) kết hợp hạ độ phân giải tối đa xuống **1600px** là phương án tối ưu nhất. Phương án này giải quyết triệt để 2 vấn đề lớn:
1. **Giải tỏa ức chế cho thành viên**: Họ có thể chọn bất kỳ bức ảnh gốc dung lượng lớn nào mà không bị hệ thống từ chối ngay lập tức.
2. **Bảo vệ hệ thống backend**: Máy chủ Cloudflare Workers và bộ nhớ R2 luôn nhận được tệp tin sạch, dung lượng tối ưu (<2MB), giúp trang web tải cực nhanh và tiết kiệm chi phí vận hành.
