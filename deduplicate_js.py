import re

path = 'js/admin-app.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

patterns = [
    re.compile(r'^\s*(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\('),
    re.compile(r'^\s*(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*='),
    re.compile(r'^\s*window\.([a-zA-Z0-9_]+)\s*=')
]

declarations = {} 

for i, line in enumerate(lines):
    if 'MODERN DASHBOARD OVERRIDES' in line:
        break
    for p in patterns:
        match = p.search(line)
        if match:
            name = match.group(1)
            if name not in declarations: declarations[name] = []
            declarations[name].append(i)
            break

to_comment = []
for name, indices in declarations.items():
    if len(indices) > 1:
        for idx in indices[:-1]:
            to_comment.append(idx)

for idx in to_comment:
    lines[idx] = "// DUPLICATE REMOVED: " + lines[idx]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Cleaned {len(to_comment)} duplicate declarations.")
