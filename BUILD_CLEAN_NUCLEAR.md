# 💣 BUILD iOS - NUCLEAR CLEAN (Phương Án Cuối Cùng)

## 🎯 Workflow Mới Hoàn Toàn

Tạo workflow MỚI, không dùng code cũ, xóa sạch tất cả!

### Tên Workflow
**"iOS Simulator - Clean Build"**

### Cách Hoạt Động

1. **Checkout code** từ GitHub
2. **Verify source** - Kiểm tra file gốc `js/mobile-app.js` đúng chưa
3. **💣 XÓA TOÀN BỘ** folder `ios/` 
4. **Tạo lại từ đầu** - `npx cap add ios` (tạo iOS platform mới)
5. **Verify synced** - Kiểm tra file đã sync có đúng không
6. **Copy icons** - Copy icon app
7. **Build** - Build simulator app
8. **Upload** - Tải lên artifact

### Điểm Khác Biệt

| Workflow Cũ | Workflow Mới (Nuclear) |
|-------------|------------------------|
| Xóa folder `public/` | **XÓA TOÀN BỘ folder `ios/`** |
| `npx cap sync ios` | **`npx cap add ios`** (tạo mới) |
| Có thể còn file cũ | **Chắc chắn 100% code mới** |

## 🚀 Cách Sử Dụng

### Bước 1: Chạy Workflow Mới
1. Vào: https://github.com/naughtycat99/leosushi-app/actions
2. Chọn workflow: **"iOS Simulator - Clean Build"** (MỚI)
3. Click **"Run workflow"** → **"Run workflow"**
4. Đợi ~7-8 phút (lâu hơn vì tạo lại từ đầu)

### Bước 2: Xem Log Verify
Workflow sẽ kiểm tra 2 lần:

**Lần 1: Trước khi sync**
```
🔍 Checking source files in root...
✅ Root mobile-app.js is clean
```

**Lần 2: Sau khi sync**
```
🔍 Verifying synced mobile-app.js...
✅ Synced mobile-app.js is correct!
```

Nếu có lỗi → Build FAIL ngay!

### Bước 3: Tải File
1. Click vào build đã hoàn thành
2. Tải artifact: **"ios-simulator-clean"**
3. Giải nén `App.app.zip`

### Bước 4: Test
1. Vào: https://appetize.io/upload
2. **XÓA app cũ**
3. Upload file MỚI
4. Test

## ✅ Kết Quả Mong Đợi

- ✅ Nút giỏ hàng bay ở góc dưới phải
- ✅ KHÔNG có thanh menu dưới
- ✅ Giao diện giống web mobile

## 🔍 Tại Sao Chắc Chắn Đúng?

1. **Xóa toàn bộ iOS folder** → Không còn code cũ
2. **Tạo lại từ đầu** → iOS platform hoàn toàn mới
3. **Verify 2 lần** → Kiểm tra trước và sau sync
4. **Fail nếu sai** → Không thể build với code sai

## 📝 So Sánh Workflows

### Workflow Cũ (ios-simulator-build.yml)
- Xóa folder `public/`
- Sync code vào iOS có sẵn
- Có thể còn cache

### Workflow Mới (ios-simulator-clean.yml) ⭐
- **XÓA TOÀN BỘ iOS**
- **TẠO LẠI TỪ ĐẦU**
- **CHẮC CHẮN 100% SẠCH**

## 🎯 Khi Nào Dùng?

- ✅ Khi workflow cũ vẫn build sai
- ✅ Khi muốn chắc chắn 100% code mới
- ✅ Khi nghi ngờ có cache hoặc file cũ
- ✅ **DÙNG NGAY BÂY GIỜ!**

## ⚠️ Lưu Ý

- Build lâu hơn (~7-8 phút) vì tạo lại từ đầu
- Nhưng **CHẮC CHẮN ĐÚNG**
- Không thể có code cũ nữa!

---

## 🚀 HÀNH ĐỘNG NGAY

1. Vào GitHub Actions
2. Chọn **"iOS Simulator - Clean Build"**
3. Run workflow
4. Đợi và tải file
5. Test trên Appetize.io

**Lần này CHẮC CHẮN đúng!** 💯
