import os
content = open('admin.bak.html', 'r', encoding='utf-8').read()
idx = content.find('class="admin-filters"')
if idx != -1:
    print(content[idx:idx+2000])
