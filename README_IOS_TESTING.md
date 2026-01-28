# 📱 Test iOS App trên Windows - Hướng dẫn đầy đủ

## 🎯 Tổng quan

Bạn có thể build và test iOS app trên Windows **HOÀN TOÀN MIỄN PHÍ** bằng GitHub Actions + Appetize.io!

## ⚡ Quick Start (10 phút)

### 1. Setup Git & GitHub
```bash
# Khởi tạo Git
git init
git add .
git commit -m "Initial commit with iOS build workflow"
git branch -M main

# Kết nối GitHub (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

📖 **Chi tiết:** [GIT_SETUP.md](GIT_SETUP.md)

### 2. Xem build tự động
- Vào: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- Workflow **"Build iOS App"** tự động chạy
- Đợi 5-10 phút

### 3. Download iOS app
- Scroll xuống phần **Artifacts**
- Download `ios-app-simulator.zip`
- Giải nén ra `App.app.zip`

### 4. Test trên Appetize.io
- Vào: https://appetize.io
- Upload `App.app.zip`
- Click **Run** → Test app! 🎉

📖 **Chi tiết:** [APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)

---

## 📚 Tài liệu chi tiết

| File | Mô tả |
|------|-------|
| **[QUICK_START.md](QUICK_START.md)** | Hướng dẫn nhanh 3 bước |
| **[GIT_SETUP.md](GIT_SETUP.md)** | Setup Git & GitHub từ đầu |
| **[IOS_BUILD_GUIDE.md](IOS_BUILD_GUIDE.md)** | Hướng dẫn build iOS đầy đủ |
| **[APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)** | Hướng dẫn chi tiết Appetize.io |
| **[.github/workflows/README.md](.github/workflows/README.md)** | Chi tiết GitHub Actions |

---

## 🔄 Workflow

```
Code → Push GitHub → Actions Build → Download .app → Test Appetize.io
  ↓         ↓              ↓              ↓              ↓
 5s       10s          5-10 phút        30s           Ngay lập tức
```

---

## 💰 Chi phí

| Service | Miễn phí | Trả phí |
|---------|----------|---------|
| **GitHub Actions** | ✅ Unlimited (public repo) | $0.008/phút (private) |
| **Appetize.io** | ✅ 100 phút/tháng | $0.05/phút |
| **BrowserStack** | ✅ 100 phút trial | $29/tháng |
| **LambdaTest** | ✅ 100 phút/tháng | $15/tháng |

→ **Hoàn toàn miễn phí** nếu dùng public repo + Appetize.io!

---

## ✅ Tính năng test được

- ✅ UI/UX và responsive
- ✅ Navigation giữa màn hình
- ✅ Forms (login, register, checkout)
- ✅ API calls
- ✅ Cart & order flow
- ✅ Menu browsing
- ✅ Animations
- ✅ Local storage
- ✅ Capacitor plugins cơ bản

## ❌ Tính năng KHÔNG test được

- ❌ Push notifications
- ❌ Camera
- ❌ Biometric (Face ID, Touch ID)
- ❌ In-app purchases
- ❌ Performance chi tiết

→ Để test những tính năng này, dùng **BrowserStack** (test trên thiết bị thật)

---

## 🎮 Các cách test

### 1. Appetize.io (Simulator) ⭐⭐⭐⭐⭐
- **Ưu điểm:** Nhanh, dễ, miễn phí 100 phút
- **Nhược điểm:** Không phải thiết bị thật
- **Phù hợp:** Test UI, navigation, basic features

### 2. BrowserStack (Real Device) ⭐⭐⭐⭐
- **Ưu điểm:** Thiết bị thật, nhiều iOS version
- **Nhược điểm:** Chậm hơn, giới hạn free
- **Phù hợp:** Test cuối cùng trước release

### 3. LambdaTest (Real Device) ⭐⭐⭐⭐
- **Ưu điểm:** Giá rẻ, nhiều tính năng
- **Nhược điểm:** UI hơi phức tạp
- **Phù hợp:** Alternative cho BrowserStack

---

## 🐛 Troubleshooting

### Build bị lỗi
1. Vào tab **Actions** → Click vào workflow bị lỗi
2. Xem log chi tiết
3. Thường gặp:
   - Thiếu dependencies → Check `package.json`
   - Lỗi Capacitor config → Check `capacitor.config.js`
   - Lỗi CocoaPods → Workflow sẽ tự fix

### Không thấy Artifacts
- Đợi workflow chạy xong (có dấu ✅ xanh)
- Scroll xuống cuối trang
- Nếu vẫn không có → Build bị lỗi, xem log

### App không chạy trên Appetize.io
- Đảm bảo upload đúng file `App.app.zip`
- Chọn iOS version >= 15.0
- Xem Console để debug

### Hết thời gian miễn phí
- Đợi tháng sau (reset 100 phút)
- Dùng platform khác (BrowserStack, LambdaTest)
- Trả phí nếu cần gấp

---

## 💡 Tips & Best Practices

### Tiết kiệm thời gian build
- Chỉ push khi cần test iOS
- Dùng branch riêng cho iOS testing
- Test web version trước

### Tiết kiệm thời gian Appetize.io
- Pause app khi không dùng
- Đóng session sau khi test xong
- Test có kế hoạch, không random

### Tối ưu workflow
- Test UI trên Chrome responsive mode trước
- Chỉ build iOS khi cần test native features
- Dùng `workflow_dispatch` để build thủ công

---

## 📋 Checklist hoàn chỉnh

### Setup lần đầu
- [ ] Cài Git
- [ ] Tạo GitHub repository
- [ ] Push code lên GitHub
- [ ] Xem workflow chạy lần đầu
- [ ] Download artifact
- [ ] Đăng ký Appetize.io
- [ ] Upload và test app

### Mỗi lần update
- [ ] Test web version trước
- [ ] Commit và push code
- [ ] Đợi build xong
- [ ] Download artifact mới
- [ ] Upload lên Appetize.io
- [ ] Test các tính năng đã thay đổi

---

## 🎉 Kết luận

Bây giờ bạn có thể:
- ✅ Build iOS app trên Windows
- ✅ Test trên iOS simulator
- ✅ Không cần Mac
- ✅ Hoàn toàn miễn phí
- ✅ Tự động hóa hoàn toàn

**Chúc bạn build thành công! 🚀**

---

## ❓ Cần giúp đỡ?

- 📖 Đọc các file hướng dẫn chi tiết
- 🐛 Check phần Troubleshooting
- 💬 Hỏi tôi trực tiếp!

---

**Made with ❤️ for LEO SUSHI App**
