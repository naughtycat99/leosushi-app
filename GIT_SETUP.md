# 🔧 Setup Git & GitHub

## Bước 1: Cài đặt Git (nếu chưa có)

### Windows
Download và cài đặt từ: https://git-scm.com/download/win

### Kiểm tra Git đã cài chưa
```bash
git --version
```

## Bước 2: Tạo repository trên GitHub

1. Vào https://github.com
2. Đăng nhập (hoặc đăng ký nếu chưa có account)
3. Click nút **"+"** (góc phải trên) → **"New repository"**
4. Điền thông tin:
   - **Repository name:** `leosushi-app` (hoặc tên bạn muốn)
   - **Description:** "LEO SUSHI Mobile App"
   - **Public** hoặc **Private** (khuyên dùng Private)
   - **KHÔNG** tick "Initialize with README"
5. Click **"Create repository"**

## Bước 3: Kết nối project với GitHub

Mở terminal trong folder project và chạy:

```bash
# Khởi tạo Git
git init

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit with iOS build workflow"

# Đổi branch thành main
git branch -M main

# Kết nối với GitHub (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push code lên GitHub
git push -u origin main
```

### Ví dụ cụ thể:
Nếu GitHub username của bạn là `john` và repo tên là `leosushi-app`:
```bash
git remote add origin https://github.com/john/leosushi-app.git
git push -u origin main
```

## Bước 4: Xác thực GitHub

Khi push lần đầu, GitHub sẽ yêu cầu đăng nhập:

### Option 1: Personal Access Token (Khuyên dùng)
1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Điền:
   - **Note:** "LEO SUSHI App"
   - **Expiration:** 90 days (hoặc No expiration)
   - **Scopes:** Tick `repo` (full control)
4. Click **"Generate token"**
5. **COPY TOKEN** (chỉ hiện 1 lần!)
6. Khi Git hỏi password, paste token này

### Option 2: GitHub CLI
```bash
# Cài GitHub CLI
winget install GitHub.cli

# Đăng nhập
gh auth login
```

## Bước 5: Kiểm tra

```bash
# Xem remote
git remote -v

# Kết quả mong đợi:
# origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (fetch)
# origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (push)
```

## Bước 6: Xem build chạy

1. Vào https://github.com/YOUR_USERNAME/YOUR_REPO
2. Click tab **"Actions"**
3. Xem workflow **"Build iOS App"** đang chạy
4. Đợi 5-10 phút
5. Download artifact khi xong!

## 🎉 Xong!

Từ giờ, mỗi khi bạn thay đổi code:
```bash
git add .
git commit -m "Update something"
git push
```

→ GitHub Actions sẽ tự động build iOS app! 🚀

## ❓ Troubleshooting

### Lỗi: "fatal: not a git repository"
→ Chạy `git init` trong folder project

### Lỗi: "remote origin already exists"
→ Chạy `git remote remove origin` rồi add lại

### Lỗi: "Permission denied"
→ Kiểm tra Personal Access Token có đúng không

### Lỗi: "failed to push"
→ Chạy `git pull origin main --allow-unrelated-histories` rồi push lại

---

**Cần giúp đỡ thêm? Hỏi tôi! 😊**
