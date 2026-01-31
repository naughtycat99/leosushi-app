# 🚀 Build IPA Ngay Bây Giờ

## ✅ Đã làm xong:

Tôi đã update `codemagic.yaml` để Codemagic **TỰ ĐỘNG**:
- ✅ Tạo iOS Distribution Certificate
- ✅ Tạo Provisioning Profile
- ✅ Setup code signing
- ✅ Build IPA
- ✅ Upload lên TestFlight

**Bạn không cần làm gì thêm về certificates!**

---

## 🎯 Làm theo 2 bước:

### Bước 1: Trigger build trên Codemagic

1. Mở: https://codemagic.io/apps
2. Click vào app **"leosushi-app"**
3. Click nút **"Start new build"** (màu xanh, góc phải)
4. Chọn:
   - **Branch**: `main`
   - **Workflow**: `ios-workflow`
5. Click **"Start new build"**

### Bước 2: Đợi build xong (15-20 phút)

Bạn sẽ thấy các bước:
- ⏳ Install dependencies (2 phút)
- ⏳ Capacitor sync (1 phút)
- ⏳ Copy App Icons (10 giây)
- ⏳ **Fetch signing files** (2 phút) ← Tự động tạo certificate!
- ⏳ Use signing files (30 giây)
- ⏳ Build iOS app (10 phút)
- ⏳ Upload to TestFlight (2 phút)

---

## 📱 Bước 3: Test trên iPhone

Sau khi build xong:

1. Mở app **TestFlight** trên iPhone
2. Đăng nhập bằng Apple ID: `nguyenvannam2505@icloud.com`
3. Tìm app **"LEO SUSHI"**
4. Click **"Install"**
5. Mở app và test cart button!

---

## ❌ Nếu build fail:

### Lỗi: "Failed to fetch signing files"

**Nguyên nhân:** Codemagic không thể tạo certificate tự động

**Giải pháp:**

1. Vào: https://codemagic.io/teams
2. Click **"Code signing identities"**
3. Click **"iOS certificates"**
4. Click **"Generate certificate"**
5. Nhập:
   - **Apple ID**: `nguyenvannam2505@icloud.com`
   - **App-Specific Password**: `quuk-dmgh-dktn-qdiz`
6. Click **"Generate"**
7. Build lại

### Lỗi: "No matching provisioning profiles found"

**Giải pháp:**

1. Vào: https://developer.apple.com/account/resources/profiles/add
2. Tạo provisioning profile:
   - Type: **App Store**
   - App ID: **com.leosushi.app**
   - Certificate: Chọn certificate vừa tạo
3. Download file `.mobileprovision`
4. Upload vào Codemagic:
   - Vào: https://codemagic.io/teams
   - Click **"Code signing identities"**
   - Click **"Provisioning profiles"**
   - Upload file

### Lỗi khác:

Gửi screenshot cho tôi, tôi sẽ giúp debug!

---

## 📊 Timeline:

| Bước | Thời gian |
|------|-----------|
| Trigger build | 1 phút |
| Build trên Codemagic | 15-20 phút |
| Upload TestFlight | 2 phút |
| Install trên iPhone | 1 phút |
| **Tổng** | **~25 phút** |

---

## 🎉 Sau khi test xong:

Nếu cart button hoạt động:
- ✅ Code fix đã work!
- ✅ Có thể submit lên App Store
- ✅ Hoặc share TestFlight link cho người khác test

Nếu vẫn lỗi:
- Báo lại cho tôi
- Tôi sẽ debug và fix thêm

---

## 💡 Lưu ý:

- Build đầu tiên có thể lâu hơn (20-25 phút) vì phải tạo certificate
- Build sau sẽ nhanh hơn (10-15 phút)
- Codemagic free tier: 500 phút/tháng (đủ build ~25-30 lần)

---

## 🚀 BẮT ĐẦU NGAY!

Vào: https://codemagic.io/apps

Click **"Start new build"**!

