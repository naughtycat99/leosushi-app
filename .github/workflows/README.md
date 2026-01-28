# GitHub Actions - iOS Build Workflow

## 🎯 Mục đích
Workflow này tự động build iOS app mỗi khi bạn push code lên GitHub, giúp bạn test app iOS trên Windows mà không cần Mac.

## 🚀 Cách sử dụng

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Add iOS build workflow"
git push origin main
```

### Bước 2: Xem quá trình build
1. Vào repository trên GitHub
2. Click tab **Actions**
3. Chọn workflow **Build iOS App**
4. Xem log build (mất khoảng 5-10 phút)

### Bước 3: Download file iOS app
1. Sau khi build xong, scroll xuống phần **Artifacts**
2. Download file `ios-app-simulator.zip`
3. Giải nén để có file `App.app.zip`

### Bước 4: Test trên Cloud Simulator

#### Option A: Appetize.io (Miễn phí 100 phút/tháng)
1. Vào https://appetize.io
2. Click **Upload**
3. Upload file `App.app.zip`
4. Chọn **iOS version** (khuyên dùng iOS 17)
5. Click **Run** để test app

#### Option B: BrowserStack (Free trial 100 phút)
1. Đăng ký tại https://www.browserstack.com
2. Vào **App Live**
3. Upload file `App.app.zip`
4. Chọn thiết bị iOS
5. Test app

## 🔧 Chạy build thủ công

Nếu muốn build mà không cần push code:
1. Vào tab **Actions** trên GitHub
2. Chọn workflow **Build iOS App**
3. Click **Run workflow** → **Run workflow**

## 📝 Lưu ý

- Build chỉ chạy khi push lên branch: `main`, `master`, hoặc `develop`
- File build được lưu 30 ngày
- Build type: **Debug** (cho simulator, không phải thiết bị thật)
- Nếu cần build cho thiết bị thật (TestFlight), cần thêm signing certificate

## ❓ Troubleshooting

### Build bị lỗi?
- Kiểm tra log trong tab Actions
- Đảm bảo `package.json` có đầy đủ dependencies
- Đảm bảo `capacitor.config.js` đúng cấu hình

### Không thấy Artifacts?
- Đợi build chạy xong (có dấu ✅ xanh)
- Scroll xuống cuối trang workflow run

### App không chạy trên Appetize.io?
- Đảm bảo upload đúng file `App.app.zip`
- Chọn iOS version >= 15.0
- Thử build lại nếu file bị lỗi

## 🎉 Kết quả

Sau khi setup xong, mỗi lần bạn push code:
- ✅ Tự động build iOS app
- ✅ Download về test trên cloud simulator
- ✅ Không cần Mac!
