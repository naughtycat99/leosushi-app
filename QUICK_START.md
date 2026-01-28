# ⚡ Quick Start - Test iOS App trên Windows

## 🎯 3 bước đơn giản

### 1. Push code lên GitHub
```bash
git add .
git commit -m "Add iOS build workflow"
git push
```

### 2. Đợi build xong (5-10 phút)
- Vào: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- Xem workflow **"Build iOS App"** chạy
- Download artifact `ios-app-simulator.zip`

### 3. Test trên Appetize.io
- Vào: https://appetize.io
- Upload file `App.app.zip`
- Click **Run** → Done! 🎉

---

## 📚 Tài liệu chi tiết

- **[IOS_BUILD_GUIDE.md](IOS_BUILD_GUIDE.md)** - Hướng dẫn đầy đủ về build iOS
- **[APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)** - Hướng dẫn chi tiết Appetize.io
- **[.github/workflows/README.md](.github/workflows/README.md)** - Chi tiết về GitHub Actions

---

## ❓ Cần giúp đỡ?

### Build bị lỗi?
→ Xem log trong tab Actions

### Không biết upload như thế nào?
→ Đọc [APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)

### Muốn test trên thiết bị thật?
→ Dùng BrowserStack (free trial 100 phút)

---

**Chúc bạn thành công! 🚀**
