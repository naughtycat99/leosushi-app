# 📑 Index - Tài liệu Test iOS trên Windows

## 🎯 Bắt đầu tại đây
**[START_HERE.md](START_HERE.md)** - Hướng dẫn 4 bước nhanh nhất

---

## 📚 Tài liệu chính

### 1. Quick Start
- **[QUICK_START.md](QUICK_START.md)** - 3 bước đơn giản
- **[START_HERE.md](START_HERE.md)** - 4 bước với giải thích

### 2. Setup từ đầu
- **[GIT_SETUP.md](GIT_SETUP.md)** - Cài Git, tạo GitHub repo, push code
- **[README_IOS_TESTING.md](README_IOS_TESTING.md)** - Hướng dẫn đầy đủ nhất

### 3. Build iOS
- **[IOS_BUILD_GUIDE.md](IOS_BUILD_GUIDE.md)** - Chi tiết về GitHub Actions workflow
- **[.github/workflows/README.md](.github/workflows/README.md)** - Cách sử dụng workflow

### 4. Test trên Cloud
- **[APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)** - Hướng dẫn chi tiết Appetize.io

### 5. Theo dõi & Checklist
- **[CHECKLIST.md](CHECKLIST.md)** - Checklist đầy đủ để theo dõi

---

## 🔧 Files kỹ thuật

### GitHub Actions Workflows
- `.github/workflows/ios-build.yml` - Build iOS app tự động
- `.github/workflows/test-build.yml` - Test build nhanh (web only)

### Capacitor Config
- `capacitor.config.js` - Cấu hình Capacitor
- `package.json` - Dependencies

---

## 📖 Cách sử dụng Index này

### Nếu bạn là người mới
1. Đọc **[START_HERE.md](START_HERE.md)**
2. Nếu chưa có Git/GitHub → Đọc **[GIT_SETUP.md](GIT_SETUP.md)**
3. Follow các bước trong **[QUICK_START.md](QUICK_START.md)**
4. Test trên Appetize.io theo **[APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)**

### Nếu bạn đã biết Git/GitHub
1. Đọc **[QUICK_START.md](QUICK_START.md)**
2. Push code lên GitHub
3. Download artifact
4. Test trên Appetize.io

### Nếu bạn muốn hiểu sâu
1. Đọc **[README_IOS_TESTING.md](README_IOS_TESTING.md)** - Overview đầy đủ
2. Đọc **[IOS_BUILD_GUIDE.md](IOS_BUILD_GUIDE.md)** - Chi tiết build
3. Đọc **[APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)** - Chi tiết testing

### Nếu gặp lỗi
1. Check **Troubleshooting** trong **[README_IOS_TESTING.md](README_IOS_TESTING.md)**
2. Check **Troubleshooting** trong **[APPETIZE_GUIDE.md](APPETIZE_GUIDE.md)**
3. Xem log trong GitHub Actions

---

## 🎯 Workflow tổng quan

```
1. Setup Git/GitHub
   ↓
2. Push code
   ↓
3. GitHub Actions build iOS app (5-10 phút)
   ↓
4. Download artifact
   ↓
5. Upload lên Appetize.io
   ↓
6. Test app trên iOS simulator
```

---

## 💡 Tips

- **Lần đầu:** Đọc từ đầu đến cuối **[START_HERE.md](START_HERE.md)**
- **Đã setup:** Chỉ cần **[QUICK_START.md](QUICK_START.md)**
- **Cần checklist:** In **[CHECKLIST.md](CHECKLIST.md)** ra giấy
- **Cần reference:** Bookmark **[README_IOS_TESTING.md](README_IOS_TESTING.md)**

---

## 📊 So sánh các file

| File | Độ dài | Độ chi tiết | Phù hợp cho |
|------|--------|-------------|-------------|
| START_HERE.md | ⭐ | ⭐ | Người mới, cần nhanh |
| QUICK_START.md | ⭐⭐ | ⭐⭐ | Đã biết Git |
| GIT_SETUP.md | ⭐⭐⭐ | ⭐⭐⭐ | Chưa biết Git |
| IOS_BUILD_GUIDE.md | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Muốn hiểu build |
| APPETIZE_GUIDE.md | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Muốn hiểu testing |
| README_IOS_TESTING.md | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Đọc tất cả |
| CHECKLIST.md | ⭐⭐⭐ | ⭐⭐⭐ | Theo dõi progress |

---

## ✅ Checklist nhanh

- [ ] Đọc START_HERE.md
- [ ] Setup Git/GitHub (nếu chưa có)
- [ ] Push code lên GitHub
- [ ] Xem build chạy
- [ ] Download artifact
- [ ] Test trên Appetize.io
- [ ] Done! 🎉

---

**Chúc bạn thành công! 🚀**
