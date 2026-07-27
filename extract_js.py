import os

html_file = 'd:/jatodemo/leosushi2/admin.html'
js_file = 'd:/jatodemo/leosushi2/js/admin-app.js'

with open(html_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the start and end of the huge script block
# It starts around line 2614 with '<script>'
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if i > 2500 and '<script>' in line and start_idx == -1:
        start_idx = i
    if start_idx != -1 and i > start_idx and '</script>' in line:
        end_idx = i
        # Check if it's the massive block (>1000 lines)
        if end_idx - start_idx > 5000:
            break

if start_idx != -1 and end_idx != -1:
    js_content = "".join(lines[start_idx+1:end_idx])
    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    # Replace the block with the script src
    new_html = lines[:start_idx] + ['    <script src="js/admin-app.js?v=' + str(os.urandom(4).hex()) + '"></script>\n'] + lines[end_idx+1:]
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.writelines(new_html)
    
    print(f"Success! Extracted {end_idx - start_idx} lines to {js_file}")
    print(f"New admin.html size: {len(new_html)} lines.")
else:
    print("Could not find the massive script block.")
