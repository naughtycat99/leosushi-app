# Hướng dẫn Test App trên Appetize.io (Miễn phí)

## 🎯 Tại sao dùng Appetize.io?

- ✅ **Miễn phí** - 100 phút/tháng free
- ✅ **Không cần Mac** - Test trên web browser
- ✅ **Không cần iPhone** - Simulator chạy trên cloud
- ✅ **Nhanh** - 10 phút setup
- ✅ **Share được** - Gửi link cho người khác test

## 📋 Bước 1: Build Simulator App

### Cách 1: Qua GitHub Actions (Khuyên dùng)

1. Vào: https://github.com/naughtycat99/leosushi-app/actions
2. Chọn workflow **"Build iOS Simulator App"**
3. Click **"Run workflow"**
4. Chọn branch: **main**
5. Click **"Run workflow"** (nút xanh)
6. Đợi **5-10 phút**
7. Sau khi xong, click vào build
8. Scroll xuống **"Artifacts"**
9. Download file **App.app.zip**

### Cách 2: Build local (Nếu có Mac)

```bash
cd ios/App
xcodebuild \
  -workspace App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO

cd build/Build/Products/Debug-iphonesimulator
zip -r App.app.zip App.app
```

## 📤 Bước 2: Upload lên Appetize.io

1. Vào: https://appetize.io/upload
2. Click **"Choose file"** hoặc kéo thả file **App.app.zip**
3. Chọn platform: **iOS**
4. Click **"Upload"**
5. Đợi 1-2 phút upload

## 🎮 Bước 3: Test App

Sau khi upload xong, bạn sẽ thấy:

### Simulator Controls
- **Device**: Chọn iPhone model (iPhone 14, 15, etc.)
- **iOS Version**: Chọn iOS version
- **Scale**: Zoom in/out
- **Rotate**: Xoay ngang/dọc

### Test Cart Button Fix

1. Click **"Launch"** để khởi động app
2. Đợi app load (2-3 giây)
3. Click vào **"MENU"** ở bottom navigation
4. Browse menu và add items vào cart
5. Click **"WARENKORB"** ở bottom navigation
6. ✅ Cart sidebar phải slide in từ bên phải
7. ✅ Hiển thị items trong cart
8. ✅ Có thể checkout

### Test Other Features

- **Login/Register**: Test authentication
- **Menu browsing**: Scroll, filter, search
- **Add to cart**: Click items, adjust quantity
- **Checkout**: Fill form, submit order
- **Profile**: View/edit profile
- **Points**: Check loyalty points
- **Orders**: View order history

## 🔗 Bước 4: Share Link

Sau khi test xong, bạn có thể:

1. Click **"Share"** button
2. Copy link (ví dụ: `https://appetize.io/app/abc123xyz`)
3. Gửi link cho:
   - Khách hàng để demo
   - Team để test
   - Stakeholders để review

## 💰 Pricing

### Free Tier
- ✅ 100 phút/tháng
- ✅ Public apps
- ✅ Unlimited uploads
- ✅ All devices

### Paid Plans (Nếu cần thêm)
- **Starter**: $40/tháng - 500 phút
- **Team**: $100/tháng - 1500 phút
- **Enterprise**: Custom pricing

## ⚠️ Limitations

Appetize.io là simulator, không phải iPhone thật:

### ✅ Hoạt động:
- UI/UX testing
- Navigation
- Forms, buttons, inputs
- API calls
- LocalStorage
- Most JavaScript features

### ❌ Không hoạt động:
- Push notifications
- Camera
- GPS/Location (có thể mock)
- Touch ID/Face ID
- App Store features
- Some native plugins

## 🆚 So sánh với TestFlight

| Feature | Appetize.io | TestFlight |
|---------|-------------|------------|
| **Cost** | Free (100 min/month) | Free |
| **Setup Time** | 10 phút | 2-3 ngày |
| **Device** | Simulator | iPhone thật |
| **Share** | Link public | Invite testers |
| **Native Features** | Limited | Full |
| **Best For** | Quick testing | Final testing |

## 🎯 Khi nào dùng Appetize.io?

### ✅ Dùng khi:
- Test UI/UX changes (như cart button fix)
- Demo cho khách hàng
- Quick testing trong development
- Không có iPhone/Mac
- Cần share link nhanh

### ❌ Không dùng khi:
- Test push notifications
- Test camera/GPS features
- Final testing trước release
- Test performance trên device thật

## 📱 Alternative: iOS Simulator trên Mac

Nếu bạn có Mac:

```bash
# Build và run simulator
cd ios/App
xcodebuild \
  -workspace App.xcworkspace \
  -scheme App \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath build

# Open simulator
open -a Simulator

# Install app
xcrun simctl install booted build/Build/Products/Debug-iphonesimulator/App.app

# Launch app
xcrun simctl launch booted com.leosushi.app
```

## 🔧 Troubleshooting

### Upload failed
- Đảm bảo file là **App.app.zip** (không phải .ipa)
- File size < 500MB
- Chọn đúng platform: **iOS**

### App crashes on launch
- Check console logs trong Appetize
- Verify API endpoints accessible
- Check for missing dependencies

### Cart button still not working
- Verify `js/mobile-cart-fix.js` included in build
- Check browser console for errors
- Try different iOS versions

## 📞 Support

Nếu cần hỗ trợ:
- Appetize Docs: https://docs.appetize.io
- Email: anhronan@gmail.com
- GitHub Issues: https://github.com/naughtycat99/leosushi-app/issues

---

## ✅ Next Steps

Sau khi test trên Appetize.io:

1. **Nếu cart button hoạt động** ✅
   - Proceed với TestFlight build
   - Submit lên App Store

2. **Nếu vẫn lỗi** ❌
   - Check console logs
   - Debug và fix
   - Build lại và test

3. **Nếu muốn test trên iPhone thật**
   - Dùng Codemagic (đã setup)
   - Hoặc nhờ bạn có Mac build
   - Hoặc thuê Mac cloud

