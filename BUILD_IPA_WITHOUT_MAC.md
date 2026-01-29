# Hướng dẫn Build IPA cho iPhone (Không có Mac)

## ⚠️ Thực tế về Build iOS App

**Để build IPA cho iPhone thật, BẮT BUỘC cần:**
- ✅ Mac (hoặc Mac cloud)
- ✅ Xcode
- ✅ Apple Developer Account ($99/năm)
- ✅ Certificates & Provisioning Profiles

**Không có Mac?** Có 3 options:

---

## Option 1: Test trên Web Simulator (KHUYÊN DÙNG - Miễn phí)

### Bước 1: Build Simulator App qua GitHub Actions

1. Vào: https://github.com/naughtycat99/leosushi-app/actions
2. Chọn workflow **"Build iOS (Simulator)"**
3. Click **"Run workflow"** > Chọn branch **main** > **"Run workflow"**
4. Đợi 5-10 phút
5. Download file **App.app.zip** từ Artifacts

### Bước 2: Upload lên Appetize.io

1. Vào: https://appetize.io/upload
2. Upload file **App.app.zip**
3. Chọn **iOS Simulator**
4. Click **"Upload"**
5. Bạn sẽ có link để test app trên web!

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Không cần Mac
- ✅ Test được hầu hết tính năng
- ✅ Có thể share link cho người khác test

**Nhược điểm:**
- ❌ Không phải iPhone thật
- ❌ Một số tính năng native không hoạt động

---

## Option 2: Nhờ Bạn Bè Có Mac Build Giúp (Nhanh nhất)

Nếu bạn có bạn bè/đồng nghiệp có Mac, họ chỉ cần 5 phút:

### Hướng dẫn cho người có Mac:

```bash
# 1. Clone repo
git clone https://github.com/naughtycat99/leosushi-app.git
cd leosushi-app

# 2. Install dependencies
npm install

# 3. Sync Capacitor
npx cap sync ios

# 4. Open Xcode
npx cap open ios
```

### Trong Xcode:

1. Chọn **"Any iOS Device (arm64)"** ở thanh toolbar
2. Menu: **Product > Archive**
3. Sau khi archive xong, click **"Distribute App"**
4. Chọn **"Ad Hoc"** (để test) hoặc **"App Store Connect"** (để lên TestFlight)
5. Follow wizard để export IPA
6. Gửi file IPA cho bạn

### Cài IPA lên iPhone:

**Cách 1: Qua AltStore (Không cần Mac sau khi cài)**
1. Cài AltStore: https://altstore.io
2. Mở AltStore trên iPhone
3. Click **"+"** và chọn file IPA
4. App sẽ được cài đặt

**Cách 2: Qua TestFlight (Cần upload lên App Store Connect)**
1. Upload IPA lên App Store Connect
2. Submit lên TestFlight
3. Mở TestFlight app trên iPhone
4. Install app

---

## Option 3: Thuê Mac Cloud (Trả phí)

### MacStadium (Khuyên dùng)

**Giá:** $1-2/giờ (pay-as-you-go)

1. Đăng ký: https://www.macstadium.com
2. Chọn **"Mac mini on demand"**
3. Rent Mac theo giờ
4. Remote vào Mac qua VNC
5. Build app như bình thường

### MacinCloud

**Giá:** $1/giờ hoặc $30/tháng

1. Đăng ký: https://www.macincloud.com
2. Chọn plan **"Pay As You Go"**
3. Remote vào Mac
4. Build app

### AWS EC2 Mac Instances

**Giá:** ~$1.08/giờ (minimum 24 giờ)

1. Cần AWS account
2. Launch EC2 Mac instance
3. Remote vào và build

---

## Option 4: Tiếp tục Setup Codemagic (Phức tạp)

Nếu vẫn muốn dùng Codemagic, cần:

### 1. Tạo App trên App Store Connect

1. Vào: https://appstoreconnect.apple.com
2. Click **"My Apps"** > **"+"** > **"New App"**
3. Điền thông tin:
   - **Platform**: iOS
   - **Name**: LEO SUSHI
   - **Primary Language**: German
   - **Bundle ID**: com.leosushi.app
   - **SKU**: leosushi-app
4. Click **"Create"**

### 2. Tạo App Store Connect API Key

1. Vào: https://appstoreconnect.apple.com/access/api
2. Click **"+"** (Generate API Key)
3. Nhập:
   - **Name**: Codemagic
   - **Access**: Admin
4. Click **"Generate"**
5. **Download file .p8** (CHỈ 1 LẦN!)
6. Lưu lại:
   - **Key ID**
   - **Issuer ID**
   - **File .p8**

### 3. Setup trong Codemagic

1. Vào: https://codemagic.io/teams
2. Click **"Personal Account"**
3. Click **"Code signing identities"**
4. Click **"Add key from App Store Connect"**
5. Upload file .p8 và nhập Key ID, Issuer ID

### 4. Build lại

1. Quay lại app: https://codemagic.io/apps
2. Click **"Start new build"**
3. Chọn branch **main**
4. Đợi 15-20 phút
5. Download IPA từ Artifacts

---

## 🎯 Khuyến nghị

**Cho testing nhanh (cart button fix):**
→ Dùng **Option 1** (Appetize.io) - miễn phí, 10 phút setup

**Cho testing trên iPhone thật:**
→ Dùng **Option 2** (nhờ bạn có Mac) - nhanh nhất, 5 phút

**Cho production/long-term:**
→ Dùng **Option 3** (Mac cloud) hoặc **Option 4** (Codemagic) - tốn tiền nhưng tự động

---

## 📱 Code đã fix cart button

Code fix đã được commit và push lên GitHub:
- Commit: `89d8fff` - "Docs: Add documentation for cart button fix"
- Files changed:
  - `js/mobile-cart-fix.js` - Enhanced cart button handler
  - `menu.html` - Added mobile-cart-fix.js script
  - `www/` - Synced to production

Chỉ cần build lại app (bất kỳ cách nào ở trên), cart button sẽ hoạt động!

---

## ❓ Cần hỗ trợ?

- Email: anhronan@gmail.com
- GitHub Issues: https://github.com/naughtycat99/leosushi-app/issues
