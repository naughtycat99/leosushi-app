import sys

with open('admin.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'checkAutoPrinting(realOrders);' in lines[i]:
        lines[i] = lines[i].replace('checkAutoPrinting(realOrders);', '// checkAutoPrinting(realOrders); // Disabled per user request')
        print(f"Commented out at line {i+1}")

with open('admin.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
