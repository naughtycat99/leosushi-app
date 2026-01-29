# Hướng dẫn Setup Codemagic để Build iOS App

## Bước 1: Đăng ký Codemagic

1. Vào https://codemagic.io/signup
2. Chọn **"Sign up with GitHub"**
3. Authorize Codemagic truy cập GitHub repository

## Bước 2: Add Repository

1. Sau khi đăng nhập, click **"Add application"**
2. Chọn repository: **naughtycat99/leosushi-app**
3. Click **"Finish: Add application"**

## Bước 3: Configure iOS Signing

### 3.1. Tạo App Store Connect API Key

1. Vào https://appstoreconnect.apple.com/access/api
2. Click **"+"** để tạo key mới
3. Nhập tên: **"Codemagic Build Key"**
4. Chọn quyền: **"Developer"**
5. Click **"Generate"**
6. **Download file .p8** (chỉ download được 1 lần!)
7. Lưu lại:
   - **Key ID** (ví dụ: ABC123XYZ)
   - **Issuer ID** (ở trên cùng trang)
   - **File .p8**

### 3.2. Add Credentials vào Codemagic

1. Trong Codemagic, vào **"Teams" > "Team settings" > "Code signing identities"**
2. Click **"iOS certificates"**
3. Upload:
   - **App Store Connect API Key** (.p8 file)
   - Nhập **Key ID**
   - Nhập **Issuer ID**

### 3.3. Add Provisioning Profile

Codemagic sẽ tự động tạo provisioning profile nếu bạn có:
- Apple Developer Account
- App Store Connect API Key đã setup

## Bước 4: Configure Build

1. Trong Codemagic app settings, chọn tab **"Workflow Editor"**
2. Chọn workflow: **"ios-workflow"**
3. Trong **"Environment variables"**, thêm:
   - `APP_STORE_CONNECT_PRIVATE_KEY`: Paste nội dung file .p8
   - `APP_STORE_CONNECT_KEY_IDENTIFIER`: Key ID
   - `APP_STORE_CONNECT_ISSUER_ID`: Issuer ID

## Bước 5: Start Build

1. Click **"Start new build"**
2. Chọn branch: **main**
3. Click **"Start new build"**

Build sẽ mất khoảng **15-20 phút**.

## Bước 6: Download IPA

Sau khi build xong:
1. Vào **"Builds"** tab
2. Click vào build vừa hoàn thành
3. Download file **.ipa** từ **"Artifacts"**

## Bước 7: Upload lên TestFlight (Tự động)

Nếu đã config đúng App Store Connect API Key, Codemagic sẽ tự động:
- Upload IPA lên App Store Connect
- Submit lên TestFlight
- Gửi email thông báo

## Bước 8: Test trên iPhone

1. Mở app **TestFlight** trên iPhone
2. Tìm app **"LEO SUSHI"**
3. Click **"Install"**
4. Test app!

---

## Troubleshooting

### Lỗi: "No signing certificate found"

**Giải pháp**:
1. Vào Apple Developer Portal: https://developer.apple.com/account/resources/certificates
2. Tạo certificate mới:
   - Chọn **"iOS Distribution"**
   - Upload CSR (Codemagic sẽ tạo tự động)
3. Download và upload vào Codemagic

### Lỗi: "No provisioning profile found"

**Giải pháp**:
1. Vào Apple Developer Portal: https://developer.apple.com/account/resources/profiles
2. Tạo profile mới:
   - Chọn **"App Store"**
   - Chọn App ID: **com.leosushi.app**
   - Chọn certificate vừa tạo
3. Download và upload vào Codemagic

### Lỗi: "Bundle identifier mismatch"

**Giải pháp**:
- Đảm bảo bundle ID trong `capacitor.config.js` khớp với App ID trên Apple Developer Portal
- Hiện tại: `com.leosushi.app`

---

## Free Tier Limits

Codemagic Free tier:
- ✅ 500 phút build/tháng
- ✅ Unlimited apps
- ✅ iOS + Android builds
- ✅ TestFlight submission

Đủ để build khoảng **25-30 lần/tháng** (mỗi build ~15-20 phút).

---

## Alternative: Build thủ công trên Mac

Nếu bạn có Mac hoặc bạn bè có Mac:

```bash
# Clone repo
git clone https://github.com/naughtycat99/leosushi-app.git
cd leosushi-app

# Install dependencies
npm install

# Sync Capacitor
npx cap sync ios

# Open Xcode
npx cap open ios

# Trong Xcode:
# 1. Chọn "Any iOS Device (arm64)"
# 2. Product > Archive
# 3. Distribute App > App Store Connect
# 4. Upload
```

---

## Liên hệ

Nếu cần hỗ trợ:
- Email: anhronan@gmail.com
- GitHub Issues: https://github.com/naughtycat99/leosushi-app/issues
