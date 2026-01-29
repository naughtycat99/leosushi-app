# ✅ iOS App Login Issue - FIXED

## Vấn đề
iOS app không đăng nhập được sau khi build từ App Store.

## Nguyên nhân
1. Session không được khởi tạo trong `api/bootstrap.php`
2. CORS không cho phép credentials (cookies/session)
3. `loginUser()` không set `$_SESSION['user_id']`

## Giải pháp đã áp dụng

### 1. Thêm session vào `api/bootstrap.php`
- Khởi tạo session với SameSite=None, Secure=1
- Session lifetime: 7 ngày

### 2. Cập nhật CORS headers
- `Access-Control-Allow-Origin: https://www.leo-sushi-berlin.de`
- `Access-Control-Allow-Credentials: true`

### 3. Set session trong `loginUser()`
- `$_SESSION['user_id']`
- `$_SESSION['user_email']`
- `$_SESSION['logged_in']`

### 4. Cập nhật `cart-sync.php`
- Hỗ trợ cả session và Bearer token
- Verify token từ Authorization header

## Files đã sửa
- `api/bootstrap.php`
- `api/auth.php`
- `api/cart-sync.php`
- `www/api/bootstrap.php`
- `www/api/auth.php`

## Bước tiếp theo

### 1. Deploy lên server
Upload các file trong `www/api/` lên server qua FTP:
- `www/api/bootstrap.php`
- `www/api/auth.php`
- `www/api/cart-sync.php`

### 2. Build iOS app mới
Chạy GitHub Actions workflow:
- Vào: https://github.com/naughtycat99/leosushi-app/actions
- Chọn: "Build iOS Simulator"
- Click: "Run workflow"

### 3. Test
- Test login trên web: https://www.leo-sushi-berlin.de/login.html
- Test login trên iOS app (Appetize.io)
- Test cart sync giữa web và app

## Tài liệu chi tiết
- `DEPLOY_FIX_LOGIN.md` - Hướng dẫn deploy chi tiết
- `APP_STORE_GUIDE.md` - Hướng dẫn xuất app lên App Store

---
**Status:** ✅ Code đã commit và push lên GitHub
**Next:** Deploy lên server production
