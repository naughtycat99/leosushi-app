# 🚀 Hướng Dẫn Deploy LEO SUSHI (Web & API)

Để ứng dụng di động (Android & iOS) hoạt động được, bạn cần đưa các tệp tin mới nhất lên server hosting tại địa chỉ **leo-sushi-berlin.de**.

## 📂 Các thư mục/file CẦN Upload:

1. **Thư mục `api/`**: 
   - Đây là quan trọng nhất. Nó chứa logic đặt hàng, bảo mật và kết nối database. 
   - Xóa thư mục `api/` cũ trên server và upload toàn bộ thư mục `api/` mới này lên.

2. **Thư mục `www/`**: 
   - Chứa giao diện web mới nhất đã được build gọn gàng.
   - Nếu bạn muốn cập nhật giao diện web trên domain chính, hãy upload nội dung trong này.

3. **File `.htaccess` (ở thư mục gốc)**:
   - File này điều hướng các yêu cầu từ App vào API. Đảm bảo file này đã được cập nhật trên server.

## ⚠️ Lưu ý Quan Trọng:

- **Database**: Đảm bảo thông tin trong `api/config.php` (trên server) khớp với thông số database của hosting.
- **SSL**: Server CẦN có chứng chỉ SSL (HTTPS) để App có thể kết nối an toàn.
- **CORS**: Tôi đã tích hợp sẵn cấu hình CORS trong `.htaccess` và `security-config.php`, bạn chỉ cần upload đúng là xong.

## 🍎 Đối với iOS:
- Thư mục `ios/` đã được tạo. 
- **Lưu ý**: Để build ra file cài đặt cho iPhone, bạn cần copy toàn bộ code này sang một máy **Mac** và dùng **Xcode** để biên dịch (theo hướng dẫn trong `MOBILE_APP_GUIDE.md`).

---
*Sau khi upload xong, hãy thử truy cập `https://leo-sushi-berlin.de/api/menu.php` để xem API đã hoạt động chưa nhé!*
