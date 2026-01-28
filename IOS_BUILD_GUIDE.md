# 📱 Hướng dẫn Build & Test iOS App trên Windows

## ✨ Tổng quan
Bạn có thể build và test iOS app trên Windows bằng GitHub Actions - hoàn toàn **MIỄN PHÍ**!

## 🚀 Bắt đầu nhanh (5 phút)

### 1️⃣ Push code lên GitHub
```bash
# Nếu chưa có repository, tạo mới trên GitHub rồi:
git init
git add .
git commit -m "Initial commit with iOS build workflow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2️⃣ Xem build tự động
- Vào https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- Workflow **"Build iOS App"** sẽ tự động chạy
- Đợi 5-10 phút để build xong

### 3️⃣ Download iOS app
- Scroll xuống phần **Artifacts**
- Download `ios-app-simulator.zip`
- Giải nén ra file `App.app.zip`

### 4️⃣ Test trên Appetize.io
1. Vào https://appetize.io
2. Click **"Upload"**
3. Kéo thả file `App.app.zip`
4. Chọn iOS 17
5. Click **"Run"** → App chạy ngay trên browser! 🎉

## 🎯 Các cách test khác

### Option 1: Appetize.io ⭐ (Khuyên dùng)
- **Miễn phí:** 100 phút/tháng
- **Ưu điểm:** Nhanh, dễ dùng, chạy trên browser
- **Link:** https://appetize.io

### Option 2: BrowserStack
- **Free trial:** 100 phút
- **Ưu điểm:** Test trên thiết bị thật, nhiều iOS version
- **Link:** https://www.browserstack.com

### Option 3: LambdaTest
- **Miễn phí:** 100 phút/tháng
- **Ưu điểm:** Giá rẻ, nhiều tính năng
- **Link:** https://www.lambdatest.com

## 🔄 Workflow tự động

Mỗi khi bạn push code:
```
Push code → GitHub Actions build → Download .app → Test trên cloud
```

Không cần làm gì thêm! 🚀

## 📋 Checklist

- [ ] Push code lên GitHub
- [ ] Vào tab Actions, xem build chạy
- [ ] Download artifact sau khi build xong
- [ ] Upload lên Appetize.io
- [ ] Test app trên iOS simulator

## 💡 Tips

### Chạy build thủ công (không cần push code)
1. Vào tab **Actions**
2. Chọn **Build iOS App**
3. Click **Run workflow** → **Run workflow**

### Debug nếu build lỗi
- Xem log chi tiết trong Actions
- Kiểm tra `package.json` có đủ dependencies
- Đảm bảo `capacitor.config.js` đúng

### Test nhanh hơn
- Dùng responsive mode trong Chrome để test UI trước
- Chỉ build iOS khi cần test tính năng native

## 🎉 Kết quả

Bây giờ bạn có thể:
- ✅ Build iOS app trên Windows
- ✅ Test trên iOS simulator
- ✅ Không cần Mac
- ✅ Hoàn toàn miễn phí!

## ❓ Câu hỏi thường gặp

**Q: Build mất bao lâu?**
A: Khoảng 5-10 phút

**Q: Có giới hạn số lần build không?**
A: Không, GitHub Actions miễn phí cho public repos

**Q: File build có hết hạn không?**
A: Có, sau 30 ngày. Nhưng bạn có thể build lại bất cứ lúc nào

**Q: Có thể test trên thiết bị iOS thật không?**
A: Có, nhưng cần thêm signing certificate. Dùng BrowserStack để test trên thiết bị thật dễ hơn

**Q: App có chạy giống như trên thiết bị thật không?**
A: Gần như 100%, trừ một số tính năng hardware-specific

---

**Chúc bạn build thành công! 🚀**
