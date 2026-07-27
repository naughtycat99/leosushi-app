import os
with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()
    s = content.find('class="bottom-nav"')
    if s != -1:
        print(content[s-50:s+500])
