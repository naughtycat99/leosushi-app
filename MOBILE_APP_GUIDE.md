# 📱 Hướng Dẫn Build App Android & iOS - LEO SUSHI

## 📋 Checklist Trước Khi Build (QUAN TRỌNG!)

### ⚠️ CẦN LÀM TRƯỚC KHI APP HOẠT ĐỘNG:

1. **Cập nhật API URL** (BẮT BUỘC)
   - File `capacitor.config.js`: Thay `https://your-domain.com` bằng domain thật
   - File `js/api.js` (dòng ~20): Thay `https://your-domain.com/api` bằng domain thật

2. **Cấu hình CORS trên server PHP**
   - Đảm bảo server cho phép requests từ app

3. **Cập nhật App ID**
   - Trong `capacitor.config.js`: Đổi `appId` thành ID duy nhất của bạn

4. **Thêm Icon và Splash Screen**
   - Android: Icon 192x192, 512x512 vào `android/app/src/main/res/mipmap-*/`
   - iOS: Icon 1024x1024 vào `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

---

## 🔧 Yêu Cầu Hệ Thống

### Cho Android:
- **Node.js** (v16 trở lên)
- **Java JDK** (v11 hoặc v17)
- **Android Studio** (latest version)
- **Android SDK** (cài qua Android Studio)

### Cho iOS (chỉ trên macOS):
- **Node.js** (v16 trở lên)
- **Xcode** (latest version từ App Store)
- **CocoaPods** (`sudo gem install cocoapods`)

---

## 📦 Bước 1: Cài Đặt Dependencies

```bash
# Cài đặt các package cần thiết
npm install

# Nếu chưa có, cài thêm các plugin Capacitor
npm install @capacitor/camera @capacitor/geolocation @capacitor/push-notifications
```

---

## 🤖 Bước 2: Tạo App Android

### 2.1. Khởi tạo Android project

```bash
# Thêm platform Android
npx cap add android

# Sync code vào Android project
npx cap sync android
```

### 2.2. Mở và build trong Android Studio

```bash
# Mở Android Studio
npx cap open android
```

**Trong Android Studio:**
1. Chờ Gradle sync hoàn tất
2. Chọn device/emulator từ toolbar
3. Click nút **Run** (▶️) để build và chạy app

### 2.3. Tạo file APK/AAB để publish

1. **Build > Generate Signed Bundle / APK**
2. Chọn **Android App Bundle** (cho Google Play) hoặc **APK**
3. Tạo keystore mới hoặc dùng keystore có sẵn
4. Chọn build variant: **release**
5. Hoàn tất và lấy file tại: `android/app/release/`

---

## 🍎 Bước 3: Tạo App iOS (chỉ trên macOS)

### 3.1. Khởi tạo iOS project

```bash
# Thêm platform iOS
npx cap add ios

# Sync code vào iOS project
npx cap sync ios
```

### 3.2. Cài đặt CocoaPods dependencies

```bash
cd ios/App
pod install
cd ../..
```

### 3.3. Mở và build trong Xcode

```bash
# Mở Xcode
npx cap open ios
```

**Trong Xcode:**
1. Chọn **App** scheme và device/Simulator
2. Click nút **Run** (▶️) để build và chạy app
3. Để publish: **Product > Archive** > Upload to App Store

---

## 🔄 Bước 4: Cập Nhật Code Sau Khi Sửa Web

Mỗi khi bạn sửa code web (HTML, CSS, JS), cần sync lại:

```bash
# Sync cho Android
npm run sync:android

# Sync cho iOS
npm run sync:ios

# Hoặc sync cả hai
npx cap sync
```

---

## ⚙️ Cấu Hình Quan Trọng

### 1. Cập nhật API URL trong `capacitor.config.js`

```javascript
server: {
  url: 'https://your-api-domain.com', // ⚠️ Thay bằng domain thật
  cleartext: true // Chỉ dùng cho development
}
```

### 2. Cập nhật App ID

```javascript
appId: 'com.leosushi.app' // Đổi thành ID của bạn
```

### 3. Network Security (Android)

File `android/app/src/main/res/xml/network_security_config.xml` đã được tạo.
- **Development**: Đã cho phép HTTP (cleartext)
- **Production**: Uncomment và cập nhật domain, xóa `cleartextTrafficPermitted="true"`

---

## 📱 Test App

### Android:
```bash
# Chạy trên emulator/device
npx cap run android
```

### iOS:
```bash
# Chạy trên simulator/device
npx cap run ios
```

---

## 🚀 Publish App

### Google Play Store (Android):
1. Tạo tài khoản Google Play Developer ($25 một lần)
2. Tạo app mới trong Google Play Console
3. Upload file AAB từ `android/app/release/`
4. Điền thông tin app, screenshots, mô tả
5. Submit để review

### Apple App Store (iOS):
1. Tạo tài khoản Apple Developer ($99/năm)
2. Tạo App ID và certificates trong Apple Developer Portal
3. Archive app trong Xcode
4. Upload qua Xcode hoặc Transporter
5. Điền thông tin trong App Store Connect
6. Submit để review

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Command not found: npx"
```bash
npm install -g npm@latest
```

### Lỗi: Android build failed
- Kiểm tra Java JDK version (cần v11 hoặc v17)
- Kiểm tra Android SDK đã cài đầy đủ trong Android Studio

### Lỗi: iOS build failed
- Chạy `pod install` trong thư mục `ios/App`
- Kiểm tra Xcode và Command Line Tools đã cài đầy đủ

### Lỗi: "Failed to fetch" hoặc "Network error"
- ✅ Kiểm tra API URL đã đúng chưa
- ✅ Kiểm tra CORS settings trên server
- ✅ Kiểm tra network security config (Android)
- ✅ Kiểm tra server có đang chạy không

### Lỗi: "CORS policy"
- ✅ Thêm CORS headers trên server
- ✅ Kiểm tra `capacitor.config.js` có đúng URL không

### Lỗi: App không load được
- ✅ Kiểm tra `webDir: '.'` trong `capacitor.config.js`
- ✅ Chạy `npx cap sync` lại
- ✅ Xóa và rebuild app

---

## 💡 Tips

1. **Development**: Dùng `npx cap serve` để test nhanh trên browser
2. **Hot Reload**: Sửa code web → sync → app tự reload
3. **Debugging**: Dùng Chrome DevTools cho Android, Safari Web Inspector cho iOS
4. **Performance**: Tối ưu images, lazy load, cache API responses

---

## 📚 Tài Liệu Tham Khảo

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Development Guide](https://developer.android.com/)
- [iOS Development Guide](https://developer.apple.com/ios/)

---

**Chúc bạn thành công! 🎉**

