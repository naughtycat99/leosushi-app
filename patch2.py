import re

def fix(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Replace maxlength and placeholder for masterKeyInput
    text = re.sub(r'(id="masterKeyInput".*?)maxlength="4"', r'\1maxlength="5"', text, flags=re.DOTALL)
    text = text.replace('Mật mã Chủ (4 số)', 'Mật mã Chủ (4-5 số)')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

fix('admin.html')
fix('tmp-live-admin.html')
