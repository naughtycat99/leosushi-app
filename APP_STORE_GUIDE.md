# 📱 Hướng dẫn xuất app lên App Store & Play Store

## 🍎 iOS - App Store

### Bước 1: Chuẩn bị Apple Developer Account
1. **Đăng ký:** https://developer.apple.com ($99/năm)
2. **Tạo App ID:**
   - Bundle ID: `com.leosushi.app`
   - App Name: `LEO SUSHI`

### Bước 2: Tạo Certificates & Profiles
1. Vào **Certificates, Identifiers & Profiles**
2. Tạo **Distribution Certificate**
3. Tạo **App Store Provisioning Profile**

### Bước 3: Build trên Mac (Cần có Mac)
```bash
# Clone repo
git clone https://github.com/naughtycat99/leosushi-app.git
cd leosushi-app

# Install dependencies
npm install
npm run build

# Sync iOS
npx cap sync ios

# Open Xcode
npx cap open ios

# Trong Xcode:
# 1. Chọn scheme "App"
# 2. Product → Archive
# 3. Distribute App → App Store Connect
# 4. Upload
```

### Bước 4: Submit trên App Store Connect
1. Vào: https://appstoreconnect.apple.com
2. Tạo app mới
3. Điền thông tin app
4. Chọn build đã upload
5. Submit for Review

---

## 🤖 Android - Play Store

### Bước 1: Build APK từ GitHub Actions ⭐ (Dễ nhất)

1. **Vào GitHub Actions:**
   - https://github.com/naughtycat99/leosushi-app/actions
   - Chọn workflow **"Build Android APK"**
   - Click **"Run workflow"**

2. **Download APK:**
   - Đợi build xong (3-5 phút)
   - Download artifact `android-debug-apk`
   - File: `app-debug.apk`

3. **Test APK:**
   - Cài trên điện thoại Android
   - Test tất cả tính năng

### Bước 2: Tạo Keystore (Để sign APK)

```bash
# Tạo keystore
keytool -genkey -v -keystore leosushi.keystore -alias leosushi -keyalg RSA -keysize 2048 -validity 10000

# Nhập thông tin:
# - Password: [tạo password mạnh]
# - Name: LEO SUSHI
# - Organization: LEO SUSHI
# - City: Berlin
# - Country: DE
```

### Bước 3: Sign APK

```bash
# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore leosushi.keystore app-release-unsigned.apk leosushi

# Optimize APK
zipalign -v 4 app-release-unsigned.apk leosushi-release.apk
```

### Bước 4: Upload lên Play Store

1. **Tạo Play Console Account:**
   - https://play.google.com/console ($25 một lần)

2. **Tạo app mới:**
   - App name: LEO SUSHI
   - Package: com.leosushi.app

3. **Upload APK:**
   - Production → Create new release
   - Upload `leosushi-release.apk`
   - Điền release notes
   - Submit for review

---

## 🚀 Cách nhanh nhất (Khuyên dùng)

### Android: Dùng GitHub Actions
✅ **Đã setup sẵn!** Chỉ cần:
1. Click "Run workflow" trên GitHub
2. Download APK
3. Sign và upload

### iOS: Dùng EAS Build (Expo)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

---

## 📋 Checklist trước khi submit

### iOS
- [ ] Apple Developer Account ($99/năm)
- [ ] App Store Connect - App đã tạo
- [ ] Distribution Certificate
- [ ] Provisioning Profile
- [ ] App icons (1024x1024)
- [ ] Screenshots (iPhone & iPad)
- [ ] Privacy Policy URL
- [ ] App description

### Android
- [ ] Play Console Account ($25 một lần)
- [ ] Keystore đã tạo
- [ ] APK đã sign
- [ ] App icons
- [ ] Screenshots
- [ ] Privacy Policy URL
- [ ] App description

---

## 💡 Tips

### Để test nhanh:
- **Android:** Dùng Debug APK từ GitHub Actions
- **iOS:** Dùng TestFlight (beta testing)

### Để tự động hóa:
- **Fastlane:** Automate build & deploy
- **EAS Build:** Cloud build service (Expo)
- **GitHub Actions:** CI/CD (đã setup)

---

## ❓ Cần giúp đỡ?

- **iOS signing issues:** https://developer.apple.com/support
- **Android signing:** https://developer.android.com/studio/publish/app-signing
- **Play Store policies:** https://play.google.com/about/developer-content-policy

---

**Chúc bạn thành công! 🎉**
