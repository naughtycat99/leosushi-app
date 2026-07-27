import os
def fix_vn(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    text = text.replace('Dnh ring cho Ch? qun', 'Dành riêng cho Chủ quán')
    text = text.replace('VO TRANG QU?N TR?', 'VÀO TRANG QUẢN TRỊ')
    text = text.replace('M?t m Ch?', 'Mật mã Chủ')
    text = text.replace('M?t m chnh xc', 'Mật mã chính xác')
    text = text.replace('M?t m khng dng!', 'Mật mã không đúng!')
    text = text.replace('Dang vo h? th?ng...', 'Đang vào hệ thống...')
    text = text.replace('Ch? - T?t c? chi nhnh', 'Chủ - Tất cả chi nhánh')
    text = text.replace('? Mật', '✅ Mật')
    text = text.replace('? Mật', '❌ Mật') # This might collide, let's be careful
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix_vn('admin.html')
fix_vn('tmp-live-admin.html')
