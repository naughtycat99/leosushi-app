# 🔧 Fix Login Issue - Deploy Guide

## Vấn đề
iOS app build từ App Store không đăng nhập được vì:
1. Session không được khởi tạo trong `bootstrap.php`
2. CORS headers không cho phép credentials (cookies/session)
3. `loginUser()` không set session `$_SESSION['user_id']`

## Giải pháp đã áp dụng

### 1. Thêm session vào `api/bootstrap.php`
```php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    // Configure session for cross-domain support (mobile app)
    ini_set('session.cookie_samesite', 'None');
    ini_set('session.cookie_secure', '1'); // Requires HTTPS
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_lifetime', '604800'); // 7 days
    
    session_start();
}
```

### 2. Cập nhật CORS headers trong `api/auth.php`
```php
header('Access-Control-Allow-Origin: https://www.leo-sushi-berlin.de');
header('Access-Control-Allow-Credentials: true');
```

### 3. Set session trong `loginUser()` function
```php
// Set session for cart sync and other features
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['logged_in'] = true;
```

### 4. Cập nhật `api/cart-sync.php` để hỗ trợ token
```php
// Try Authorization header (Bearer token)
if (!$userId && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
    
    // Verify token and get user_id
    try {
        require_once __DIR__ . '/utils.php';
        $decoded = verifyToken($token);
        if ($decoded && isset($decoded['user_id'])) {
            $userId = $decoded['user_id'];
        }
    } catch (Exception $e) {
        // Token invalid, continue without user
    }
}
```

## 📤 Deploy lên Server

### Cách 1: Upload qua FTP (Khuyên dùng)

1. **Kết nối FTP:**
   - Host: `ftp.leo-sushi-berlin.de`
   - Username: [your FTP username]
   - Password: [your FTP password]

2. **Upload các file đã sửa:**
   ```
   www/api/bootstrap.php
   www/api/auth.php
   www/api/cart-sync.php
   ```

3. **Kiểm tra permissions:**
   - Đảm bảo các file có permission `644` (rw-r--r--)

### Cách 2: Dùng Git (Nếu server có Git)

```bash
# SSH vào server
ssh user@leo-sushi-berlin.de

# Pull latest changes
cd /path/to/website
git pull origin main

# Restart PHP-FPM (nếu cần)
sudo systemctl restart php-fpm
```

### Cách 3: Dùng sync script (Local)

```bash
# Chạy script sync
.\sync-api-to-www.bat

# Sau đó upload folder www/api/ lên server qua FTP
```

## ✅ Test sau khi deploy

### 1. Test trên web browser
```
https://www.leo-sushi-berlin.de/login.html
```
- Đăng nhập với tài khoản test
- Kiểm tra giỏ hàng có đồng bộ không

### 2. Test trên iOS app
- Mở app trên Appetize.io hoặc iOS Simulator
- Đăng nhập
- Thêm sản phẩm vào giỏ hàng
- Kiểm tra giỏ hàng có đồng bộ với web không

### 3. Test API endpoint trực tiếp
```bash
# Test login
curl -X POST https://www.leo-sushi-berlin.de/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Test cart sync (với session từ login)
curl -X GET https://www.leo-sushi-berlin.de/api/cart-sync.php?action=get \
  -b cookies.txt
```

## 🔍 Troubleshooting

### Lỗi: "Unauthorized. Please login first."
- Kiểm tra session có được set không
- Kiểm tra CORS headers
- Kiểm tra cookies có được gửi không

### Lỗi: "CORS policy"
- Đảm bảo `Access-Control-Allow-Origin` đúng domain
- Đảm bảo `Access-Control-Allow-Credentials: true`

### Lỗi: "Session not working"
- Kiểm tra HTTPS (session với SameSite=None cần HTTPS)
- Kiểm tra `session.cookie_secure` = 1
- Kiểm tra server có hỗ trợ session không

## 📋 Checklist

- [ ] Upload `www/api/bootstrap.php`
- [ ] Upload `www/api/auth.php`
- [ ] Upload `www/api/cart-sync.php`
- [ ] Test login trên web
- [ ] Test login trên iOS app
- [ ] Test cart sync giữa web và app
- [ ] Kiểm tra logs nếu có lỗi

## 🚀 Build iOS app mới

Sau khi deploy xong, build lại iOS app:

```bash
# Chạy GitHub Actions workflow
# Vào: https://github.com/naughtycat99/leosushi-app/actions
# Chọn: "Build iOS Simulator"
# Click: "Run workflow"
```

Hoặc build local:

```bash
npm run build
npx cap sync ios
npx cap open ios
# Trong Xcode: Product → Build
```

---

**Chúc bạn thành công! 🎉**
