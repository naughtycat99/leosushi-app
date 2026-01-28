# 🍎 Hướng dẫn chi tiết sử dụng Appetize.io

## 📖 Appetize.io là gì?
Appetize.io cho phép bạn chạy iOS app trực tiếp trên browser, không cần Mac hay iPhone thật.

## 💰 Giá
- **Miễn phí:** 100 phút/tháng
- **Trả phí:** $0.05/phút (chỉ tính khi app đang chạy)

## 🚀 Cách sử dụng

### Bước 1: Lấy file iOS app
1. Push code lên GitHub
2. Vào tab **Actions** → chọn workflow **Build iOS App**
3. Đợi build xong (5-10 phút)
4. Download artifact `ios-app-simulator.zip`
5. Giải nén ra file `App.app.zip`

### Bước 2: Upload lên Appetize.io

#### Lần đầu tiên (Không cần đăng ký)
1. Vào https://appetize.io
2. Click nút **"Upload"** (màu xanh)
3. Kéo thả file `App.app.zip` vào
4. Đợi upload xong (30 giây - 2 phút)

#### Cấu hình app
- **Platform:** iOS
- **Device:** iPhone 15 (hoặc bất kỳ)
- **OS Version:** iOS 17.0 (khuyên dùng)
- **Scale:** 75% (vừa màn hình)
- **Orientation:** Portrait

### Bước 3: Chạy app
1. Click nút **"Run"** (màu xanh)
2. Đợi simulator khởi động (10-20 giây)
3. App sẽ tự động mở! 🎉

## 🎮 Cách test app

### Thao tác cơ bản
- **Click:** Click chuột trái
- **Scroll:** Kéo chuột lên/xuống
- **Swipe:** Kéo nhanh
- **Pinch zoom:** Ctrl + Scroll (hoặc dùng nút zoom)

### Debug tools
1. Click nút **"Debug"** (góc phải)
2. Mở **Console** để xem logs
3. Xem **Network** để check API calls

### Test các tính năng
- ✅ Navigation giữa các màn hình
- ✅ Form input (login, register)
- ✅ Cart & checkout
- ✅ Menu browsing
- ✅ Responsive layout
- ✅ Animations & transitions

### Tính năng không test được
- ❌ Push notifications (cần thiết bị thật)
- ❌ Camera (simulator không có camera)
- ❌ Biometric (Face ID, Touch ID)
- ❌ In-app purchases

## 💡 Tips & Tricks

### Tiết kiệm thời gian miễn phí
- Pause app khi không dùng (click nút Pause)
- Đóng session khi test xong
- Chỉ test những tính năng quan trọng

### Upload app mới
- Mỗi lần build mới, upload lại file mới
- Appetize sẽ tạo URL mới cho mỗi version
- Lưu URL để test lại sau

### Share với người khác
1. Copy URL của app (sau khi upload)
2. Share URL cho team
3. Họ có thể test mà không cần upload lại

### Keyboard shortcuts
- **Cmd + K:** Mở keyboard
- **Cmd + R:** Reload app
- **Cmd + H:** Home button
- **Cmd + Shift + H:** App switcher

## 📊 So sánh với các platform khác

| Tính năng | Appetize.io | BrowserStack | LambdaTest |
|-----------|-------------|--------------|------------|
| Miễn phí | 100 phút | 100 phút | 100 phút |
| Thiết bị thật | ❌ | ✅ | ✅ |
| Dễ sử dụng | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Debug tools | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Tốc độ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🐛 Troubleshooting

### App không upload được
- **Lỗi:** "Invalid app format"
- **Giải pháp:** Đảm bảo upload file `App.app.zip` (không phải file khác)

### App crash khi mở
- **Lỗi:** App mở rồi tắt ngay
- **Giải pháp:** 
  - Kiểm tra log trong Console
  - Build lại với iOS version thấp hơn
  - Kiểm tra `capacitor.config.js`

### Simulator chậm
- **Giải pháp:**
  - Giảm scale xuống 50%
  - Đóng các tab khác
  - Thử browser khác (Chrome khuyên dùng)

### Hết thời gian miễn phí
- **Giải pháp:**
  - Đợi tháng sau (reset 100 phút)
  - Dùng BrowserStack hoặc LambdaTest
  - Trả $0.05/phút nếu cần gấp

## 📝 Checklist test app

- [ ] App mở được
- [ ] Navigation hoạt động
- [ ] Login/Register form
- [ ] Menu hiển thị đúng
- [ ] Add to cart
- [ ] Checkout flow
- [ ] Profile page
- [ ] Order history
- [ ] Responsive trên các màn hình
- [ ] Không có lỗi trong Console

## 🎯 Kết luận

Appetize.io là công cụ tốt nhất để:
- ✅ Test nhanh iOS app trên Windows
- ✅ Demo app cho client
- ✅ Share với team
- ✅ Debug UI issues

**Không phù hợp cho:**
- ❌ Test performance chi tiết
- ❌ Test tính năng hardware
- ❌ Test trên thiết bị thật

---

**Happy testing! 🚀**
