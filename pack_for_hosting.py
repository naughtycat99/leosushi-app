import os
import zipfile

def create_deployment_zip():
    zip_name = 'leosushi_web_deployment.zip'
    
    # Những thư mục và file sẽ bị bỏ qua không cho vào file zip
    exclude_dirs = {'.git', '.vscode', 'node_modules', 'android', 'ios', 'www', 'AppIcons', '.dart_tool'}
    exclude_exts = {'.aab', '.zip', '.py', '.bat', '.ps1', '.sh', '.yaml', '.log', '.sql'}
    exclude_files = {'package.json', 'package-lock.json', 'sftp.json', 'build.js'}

    print(f"Bắt đầu nén toàn bộ mã nguồn web vào {zip_name}...")
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk('.'):
            # Lọc bỏ các thư mục không cần thiết
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in exclude_exts or file in exclude_files:
                    continue
                
                file_path = os.path.join(root, file)
                # Tính đường dẫn tương đối để lưu trong file zip (bỏ ./ ở đầu)
                arcname = os.path.relpath(file_path, '.')
                
                print(f"Đang nén: {arcname}")
                zf.write(file_path, arcname)

if __name__ == '__main__':
    create_deployment_zip()
    print("\n✅ Tạo gói cài đặt web thành công: leosushi_web_deployment.zip")
    print("Bạn có thể upload file zip này lên hosting (thư mục public_html hoặc thư mục gốc) và giải nén.")
