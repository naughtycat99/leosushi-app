import re

# This script finds variables that are commented out but still used below in admin-app.js
path = 'js/admin-app.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

errors = []
for i, line in enumerate(lines):
    if '// CONFLICT REMOVED: ' in line:
        match = re.search(r'(?:const|var|let|function)\s+([a-zA-Z0-9_]+)', line)
        if match:
            item_name = match.group(1)
            # Check next 10 lines for usage
            usage_found = False
            for j in range(i + 1, min(i + 20, len(lines))):
                if re.search(r'\b' + item_name + r'\b', lines[j]) and '//' not in lines[j] and '/*' not in lines[j]:
                    usage_found = True
                    break
            if usage_found:
                errors.append((i+1, item_name))

print("FINDINGS:")
for line_num, name in errors:
    print(f"Line {line_num}: {name} is commented out but used below!")

if errors:
    print("\nAttempting to auto-fix: uncommenting the FIRST uncommented usage's required declaration...")
    # Actually, the best fix is to UNCOMMENT these lines if they are needed.
    for line_num, name in errors:
        lines[line_num-1] = lines[line_num-1].replace('// CONFLICT REMOVED: ', '')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Fixed!")
else:
    print("No dangling references found.")
