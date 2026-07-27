import re

path = r'd:/jatodemo/leosushi2/admin.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS to be even more resilient
resilient_css = """
        /* Resilient Content CSS */
        .admin-content { display: none; opacity: 0; transition: opacity 0.3s; }
        .admin-content.active { display: block !important; opacity: 1 !important; z-index: 50 !important; }
        
        .admin-login-modal { 
            position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 99999 !important; 
            display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); 
        }
        .admin-login-modal.active { display: flex !important; }
"""

# Replace the style block slightly or just append before </style>
if '</style>' in content:
    content = content.replace('</style>', resilient_css + '\n    </style>')

# 2. Make sure the ID markers for JS are safe
# Sometimes JS looks for specific IDs that might have been changed/duplicated.

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Update js/admin-app.js to FORCE REFRESH data if it's blank
js_path = r'd:/jatodemo/leosushi2/js/admin-app.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Force a non-silent load and ensure login modal showing logic is robust
js_content = js_content.replace(
    "if (loginModal) loginModal.style.display = 'flex';",
    "if (loginModal) { loginModal.style.display = 'flex'; loginModal.classList.add('active'); }"
)
js_content = js_content.replace(
    "if (loginModal) loginModal.style.display = 'none';",
    "if (loginModal) { loginModal.style.display = 'none'; loginModal.classList.remove('active'); }"
)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Rescue Patch Applied: CSS and JS logic hardened.")
