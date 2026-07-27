# Hướng dẫn xuất App iOS cho LEO SUSHI (Admin)

Dự án của bạn đã được cấu hình sẵn với **Capacitor 6** và **Codemagic**, cho phép chuyển đổi từ Web sang App iOS rất chuyên nghiệp.

## Cách 1: Sử dụng Codemagic (Khuyên dùng - Không cần máy Mac)
Đây là cách dễ nhất vì mọi cấu hình đã có sẵn trong file `codemagic.yaml`.

1. Đưa mã nguồn lên GitHub, GitLab hoặc Bitbucket.
2. Đăng ký/Đăng nhập vào [Codemagic.io](https://codemagic.io/).
3. Kết nối kho lưu trữ (Repository) của bạn.
4. Chọn workflow **iOS App Build**.
5. Nhấn **Start build**. Codemagic sẽ tự động:
   - Cài đặt môi trường.
   - Đóng gói file Web vào thư mục `www`.
   - Tạo các biểu tượng (Icon) tự động từ logo.
   - Xuất ra file `.ipa` để bạn cài đặt hoặc đưa lên App Store.

## Cách 2: Build thủ công (Yêu cầu máy Mac và Xcode)
Nếu bạn có máy Mac, hãy thực hiện các bước sau:

1. **Cài đặt môi trường:**
   ```bash
   npm install
   ```

2. **Chuẩn bị file App Admin:**
   Đảm bảo file `capacitor.config.json` đang trỏ đúng vào `admin.html` (Hiện tại đã đúng).

3. **Tạo thư mục build:**
   ```bash
   node build.js
   ```

4. **Thêm platform iOS (nếu chưa có):**
   ```bash
   npx cap add ios
   ```

5. **Sync code và mở Xcode:**
   ```bash
   npx cap sync ios
   npx cap open ios
   ```

6. **Trong Xcode:** Chọn thiết bị (iPhone) và nhấn nút **Play** để chạy thử hoặc **Product > Archive** để xuất bản.

## Một số lưu ý quan trọng:
- **Bundle ID:** Hiện tại app đang dùng ID `com.leosushi.app`. Nếu bạn muốn đổi, hãy sửa trong file `capacitor.config.json`.
- **Icon:** App sẽ tự động dùng ảnh tại `assets/logo.png` để tạo icon. Hãy đảm bảo ảnh này có chất lượng cao.
- **Push Notifications:** Dự án đã có sẵn cấu hình `@capacitor/push-notifications`, bạn cần cấu hình thêm trên [Firebase Console](https://console.firebase.google.com/) và Apple Developer Portal để nhận thông báo đơn hàng mới.
