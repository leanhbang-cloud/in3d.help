# Changelog

Tất cả thay đổi đáng chú ý của project sẽ được ghi vào file này.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added
- Initial scaffolding from solo-builder-template

### Fixed
- Lỗi upload ảnh thực địa lớn hơn 3MB bị từ chối bằng cơ chế nén nhiều lượt (Multi-pass compression fallback loop) trên trình duyệt, cho phép người dùng chọn ảnh lên tới 15MB và tự động nén xuống dưới 3MB trước khi gửi.

