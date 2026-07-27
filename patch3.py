import re

def fix_ui(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    if "masterLoginFlow" not in text.split("function switchLoginMode")[0]:
        # Need to insert masterLoginFlow HTML
        # Look for ZurAck or Zurück button block end
        match = re.search(r'Zur[A-Za-z]+ck</button>\s*</div>\s*(</div>)?', text)
        if match:
            # Check if normalLoginFlow exists
            if '<div id="normalLoginFlow"' in text:
                # the </div> is for loginStep2 and normalLoginFlow
                replacement = match.group(0)
                if not match.group(1):
                    # We need to close normalLoginFlow
                    replacement += '\n                </div>'
            else:
                replacement = match.group(0)

            # Add masterLoginFlow
            master_flow = '''

                <!-- Master Login Flow -->
                <div id="masterLoginFlow" style="display: none;">
                    <p style="color: rgba(255, 255, 255, 0.6); font-size: 13px; margin-bottom: 20px; text-align: center;">
                        Dành riêng cho Chủ quán (Owner Entry)
                    </p>
                    <input type="password" id="masterKeyInput" class="admin-password-input"
                        placeholder="Mật mã Chủ (4-5 số)" maxlength="5"
                        style="text-align: center; font-size: 20px; letter-spacing: 10px;"
                        onkeypress="if(event.key==='Enter') handleMasterLogin()">
                    <button class="btn-action btn-confirm" onclick="handleMasterLogin()"
                        style="background: linear-gradient(135deg, var(--gold), #fbbf24); color: #000;">VÀO TRANG QUẢN TRỊ</button>
                </div>'''
            
            text = text[:match.end()] + master_flow + text[match.end():]
            
            # also if normalLoginFlow isn't there, we need to wrap loginStep1 and loginStep2
            if '<div id="normalLoginFlow"' not in text:
                text = text.replace('<!-- Step 1: Password -->', '<div id="normalLoginFlow" style="display: block;">\n                  <!-- Step 1: Password -->')
                # close it after master_flow insertion, actually we did it above or need to adjust
                
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

# Let's do a simpler string replacement
def simple_insert(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    if '<div id="masterLoginFlow"' not in text:
        # Find where to insert
        target = '</button>\n                  </div>\n  \n                  <p style="color: rgba(255, 255, 255, 0.4);'
        if target not in text:
            # fallback target
            target = 'ck</button>\n                  </div>\n\n                  <p style="color: rgba(255, 255, 255, 0.4);'
        
        # We also need to close normalLoginFlow if it exists
        if '<div id="normalLoginFlow"' in text:
            replacement = '</button>\n                  </div>\n                </div>\n'
        else:
            replacement = '</button>\n                  </div>\n'
            
        replacement += '''
                <!-- Master Login Flow -->
                <div id="masterLoginFlow" style="display: none;">
                    <p style="color: rgba(255, 255, 255, 0.6); font-size: 13px; margin-bottom: 20px; text-align: center;">
                        Dành riêng cho Chủ quán (Owner Entry)
                    </p>
                    <input type="password" id="masterKeyInput" class="admin-password-input"
                        placeholder="Mật mã Chủ (4-5 số)" maxlength="5"
                        style="text-align: center; font-size: 20px; letter-spacing: 10px;"
                        onkeypress="if(event.key==='Enter') handleMasterLogin()">
                    <button class="btn-action btn-confirm" onclick="handleMasterLogin()"
                        style="background: linear-gradient(135deg, var(--gold), #fbbf24); color: #000;">VÀO TRANG QUẢN TRỊ</button>
                </div>\n                  <p style="color: rgba(255, 255, 255, 0.4);'''
                
        # Actually let's use regex to be safe
        text = re.sub(r'ck</button>\s*</div>\s*<p style="color: rgba\(255, 255, 255, 0.4\);', replacement, text)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

simple_insert('admin.html')
simple_insert('tmp-live-admin.html')
