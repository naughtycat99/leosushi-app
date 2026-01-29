# Fix Codemagic Code Signing Error

## ❌ Lỗi hiện tại:

```
Error building the application - see the log above
fastlane finished with errors
```

**Nguyên nhân:** Thiếu iOS Distribution Certificate

---

## ✅ Giải pháp: Tạo Certificate

### Bước 1: Tạo Certificate Signing Request (CSR)

**Cách 1: Dùng Codemagic (Khuyên dùng)**

1. Vào: https://codemagic.io/teams
2. Click **"Personal Account"**
3. Click **"Code signing identities"** (bên trái)
4. Click **"iOS certificates"**
5. Click **"Generate certificate"**
6. Codemagic sẽ tự động:
   - Tạo CSR
   - Tạo certificate trên Apple Developer Portal
   - Download và lưu vào Codemagic

**Cách 2: Tạo thủ công (Nếu cách 1 không work)**

1. Vào: https://developer.apple.com/account/resources/certificates/add
2. Chọn **"iOS Distribution"**
3. Click **"Continue"**
4. Bạn sẽ thấy yêu cầu upload CSR file

**Tạo CSR trên Windows:**

```powershell
# Cài OpenSSL (nếu chưa có)
# Download từ: https://slproweb.com/products/Win32OpenSSL.html

# Tạo private key
openssl genrsa -out ios_distribution.key 2048

# Tạo CSR
openssl req -new -key ios_distribution.key -out ios_distribution.csr -subj "/emailAddress=nguyenvannam2505@icloud.com/CN=LEO SUSHI/C=DE"
```

5. Upload file **ios_distribution.csr**
6. Click **"Continue"**
7. Download file **.cer**

### Bước 2: Upload Certificate vào Codemagic

**Nếu dùng Cách 1 ở trên:** Bỏ qua bước này (đã tự động)

**Nếu dùng Cách 2:**

1. Convert .cer sang .p12:

```powershell
# Download certificate từ Apple Developer Portal
# Giả sử file tên là: ios_distribution.cer

# Convert sang .pem
openssl x509 -in ios_distribution.cer -inform DER -out ios_distribution.pem -outform PEM

# Tạo .p12
openssl pkcs12 -export -out ios_distribution.p12 -inkey ios_distribution.key -in ios_distribution.pem
# Nhập password (ví dụ: 123456)
```

2. Upload vào Codemagic:
   - Vào: https://codemagic.io/teams
   - Click **"Code signing identities"**
   - Click **"iOS certificates"**
   - Click **"Upload certificate"**
   - Upload file **ios_distribution.p12**
   - Nhập password

### Bước 3: Codemagic tự động tạo Provisioning Profile

Sau khi có certificate, Codemagic sẽ tự động:
- Tạo Provisioning Profile trên Apple Developer Portal
- Download và sử dụng khi build

### Bước 4: Build lại

1. Vào: https://codemagic.io/apps
2. Click vào app **"leosushi-app"**
3. Click **"Start new build"**
4. Chọn branch: **main**
5. Click **"Start new build"**
6. Đợi 15-20 phút

---

## 🎯 Nếu vẫn lỗi:

### Lỗi: "No provisioning profile found"

**Giải pháp:**

1. Vào: https://developer.apple.com/account/resources/profiles/add
2. Chọn **"App Store"**
3. Click **"Continue"**
4. Chọn App ID: **com.leosushi.app**
5. Click **"Continue"**
6. Chọn certificate vừa tạo
7. Click **"Continue"**
8. Nhập tên: **LEO SUSHI Distribution**
9. Click **"Generate"**
10. Download file **.mobileprovision**

Upload vào Codemagic:
1. Vào: https://codemagic.io/teams
2. Click **"Code signing identities"**
3. Click **"Provisioning profiles"**
4. Click **"Upload profile"**
5. Upload file **.mobileprovision**

### Lỗi: "Bundle identifier mismatch"

**Kiểm tra:**
- Bundle ID trong `capacitor.config.js`: `com.leosushi.app`
- App ID trên Apple Developer Portal: `com.leosushi.app`
- Phải giống nhau!

---

## 🚀 Sau khi build xong:

1. Download file **.ipa** từ Artifacts
2. Upload lên TestFlight:
   - Codemagic sẽ tự động upload (nếu config đúng)
   - Hoặc upload thủ công qua Transporter app

3. Test trên iPhone:
   - Mở TestFlight app
   - Tìm app "LEO SUSHI"
   - Click "Install"

---

## 💡 Tóm tắt:

| Bước | Thời gian | Khó |
|------|-----------|-----|
| 1. Tạo Certificate | 5 phút | ⭐⭐ |
| 2. Upload vào Codemagic | 2 phút | ⭐ |
| 3. Build lại | 15 phút | ⭐ |
| **Tổng** | **22 phút** | **⭐⭐** |

---

## ❓ Vẫn khó quá?

**Dùng cách nhanh hơn:**

### Option A: Test trên Appetize.io (10 phút)
- Đọc file `TEST_CART_FIX_NHANH.md`
- Build simulator app qua GitHub Actions
- Upload lên Appetize.io
- Test ngay trên browser!

### Option B: Nhờ bạn có Mac (5 phút)
- Gửi code cho bạn có Mac
- Họ build và gửi IPA cho bạn
- Cài qua AltStore hoặc TestFlight

### Option C: Thuê Mac cloud ($1-2/giờ)
- MacStadium: https://www.macstadium.com
- MacinCloud: https://www.macincloud.com
- Remote vào và build như bình thường

---

## 📞 Cần hỗ trợ?

Nếu bạn muốn tôi hướng dẫn chi tiết từng bước, ping tôi!

