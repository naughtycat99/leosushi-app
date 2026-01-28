# ✅ Checklist - Test iOS App trên Windows

## 📋 Setup lần đầu (Làm 1 lần)

### Git & GitHub
- [ ] Cài Git: https://git-scm.com/download/win
- [ ] Tạo GitHub account: https://github.com
- [ ] Tạo repository mới trên GitHub
- [ ] Copy URL repository

### Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit with iOS build workflow"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
- [ ] Chạy các lệnh trên
- [ ] Nhập Personal Access Token khi được hỏi

### Xem build lần đầu
- [ ] Vào: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- [ ] Thấy workflow "Build iOS App" đang chạy
- [ ] Đợi 5-10 phút cho build xong
- [ ] Thấy dấu ✅ xanh

### Download iOS app
- [ ] Scroll xuống phần "Artifacts"
- [ ] Click download `ios-app-simulator.zip`
- [ ] Giải nén file
- [ ] Có file `App.app.zip`

### Setup Appetize.io
- [ ] Vào: https://appetize.io
- [ ] Đăng ký account (hoặc dùng không cần đăng ký)
- [ ] Ghi nhớ: 100 phút miễn phí/tháng

### Test app lần đầu
- [ ] Click "Upload" trên Appetize.io
- [ ] Kéo thả file `App.app.zip`
- [ ] Chọn iOS 17
- [ ] Click "Run"
- [ ] App chạy thành công! 🎉

---

## 🔄 Mỗi lần update code (Làm nhiều lần)

### 1. Test web version trước
- [ ] Chạy: `npm run build`
- [ ] Test trên Chrome responsive mode
- [ ] Đảm bảo không có lỗi

### 2. Push code
```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```
- [ ] Chạy các lệnh trên

### 3. Xem build
- [ ] Vào tab Actions trên GitHub
- [ ] Xem workflow đang chạy
- [ ] Đợi build xong (5-10 phút)

### 4. Download & test
- [ ] Download artifact mới
- [ ] Upload lên Appetize.io
- [ ] Test các tính năng đã thay đổi
- [ ] Kiểm tra không có bug

---

## 🎯 Test checklist

### UI/UX
- [ ] App mở được
- [ ] Logo và branding đúng
- [ ] Màu sắc và font chữ đúng
- [ ] Responsive trên các màn hình
- [ ] Animations mượt mà

### Navigation
- [ ] Menu navigation hoạt động
- [ ] Back button hoạt động
- [ ] Deep linking (nếu có)
- [ ] Tab bar (nếu có)

### Authentication
- [ ] Login form
- [ ] Register form
- [ ] Password reset
- [ ] Logout
- [ ] Session persistence

### Core Features
- [ ] Menu browsing
- [ ] Search (nếu có)
- [ ] Add to cart
- [ ] Cart management
- [ ] Checkout flow
- [ ] Order confirmation

### Profile & Orders
- [ ] View profile
- [ ] Edit profile
- [ ] Order history
- [ ] Order details
- [ ] Points/Loyalty (nếu có)

### API Integration
- [ ] API calls thành công
- [ ] Loading states
- [ ] Error handling
- [ ] Offline mode (nếu có)

### Performance
- [ ] App load nhanh
- [ ] Không bị lag
- [ ] Images load đúng
- [ ] No memory leaks

---

## 🐛 Debug checklist

Nếu có lỗi:
- [ ] Xem Console trong Appetize.io
- [ ] Xem Network tab
- [ ] Xem build log trong GitHub Actions
- [ ] Check `capacitor.config.js`
- [ ] Check `package.json`

---

## 💾 Lưu trữ

### Sau mỗi lần test thành công
- [ ] Lưu URL Appetize.io
- [ ] Screenshot các màn hình chính
- [ ] Note lại các bug tìm được
- [ ] Update changelog

### Trước khi release
- [ ] Test trên BrowserStack (thiết bị thật)
- [ ] Test nhiều iOS versions
- [ ] Test trên nhiều kích thước màn hình
- [ ] Final QA checklist

---

## 📊 Tracking

| Date | Version | Build Status | Test Status | Notes |
|------|---------|--------------|-------------|-------|
| | | ✅/❌ | ✅/❌ | |
| | | ✅/❌ | ✅/❌ | |
| | | ✅/❌ | ✅/❌ | |

---

**Print checklist này ra để theo dõi! 📋**
