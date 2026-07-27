import os
import re

files = ['admin.html', 'tmp-live-admin.html']

for file in files:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Remove Tabs Div
        content = re.sub(r'<!-- Tabs for Normal vs Master Login -->.*?<div id="normalLoginFlow">', '<div>', content, flags=re.DOTALL)
        
        # 2. Remove Master Login Flow
        content = re.sub(r'<!-- Master Login Flow \(Emergency Bypass\) -->.*?(<div class="admin-header">)', r'</div>\n          </div>\n\n          \1', content, flags=re.DOTALL)

        # 3. Remove switchLoginMode
        content = re.sub(r'// Toggle between login modes.*?function switchLoginMode\(mode\) \{.*?\}(?=\s*//)', '', content, flags=re.DOTALL)
        
        # 4. Remove handleMasterLogin
        content = re.sub(r'// Handle Master Key Login \(Emergency Entrance\).*?async function handleMasterLogin\(\) \{.*?\}(?=\s*window)', '', content, flags=re.DOTALL)
        
        # 5. Remove window assignments
        content = re.sub(r'window\.switchLoginMode\s*=\s*switchLoginMode;\s*', '', content)
        content = re.sub(r'window\.handleMasterLogin\s*=\s*handleMasterLogin;\s*', '', content)

        # 6. We replaced <div id="normalLoginFlow"> with <div>. Now let's remove the <div id="loginStep1" style="display: block;"> display style, but keeping the div is fine.
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Cleaned up {file}')
