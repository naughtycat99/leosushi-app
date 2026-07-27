import os
content = open('admin.html', 'r', encoding='utf-8').read()
idx = content.find('statusFilter')
for i in range(10):
    idx = content.find('statusFilter', idx+1)
    if idx != -1:
        print(content[idx-50:idx+200])
