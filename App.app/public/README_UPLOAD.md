# 📤 Hướng dẫn Upload lên Production

## ⚠️ Vấn đề 503 trên Production

Nếu PHP files trả về 503, đây là vấn đề **server config**, không phải code.

## ✅ Giải pháp

**Liên hệ Hosting Provider** với nội dung trong file `EMAIL_TO_HOSTING.txt`

## 📋 Files cần upload

- Tất cả PHP files trong `api/`
- Tất cả `.htaccess` files
- File `test.php` (root) để test PHP execution

## 🧪 Test sau khi upload

1. `https://leo-sushi-berlin.de/test.php` → Phải thấy "PHP WORKS!"
2. Nếu vẫn 503 → Liên hệ hosting (dùng `EMAIL_TO_HOSTING.txt`)

