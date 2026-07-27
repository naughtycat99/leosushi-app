import re

path = 'js/admin-app.js'
# Re-read the RESTORED version to start clean (without // DUPLICATE REMOVED)
with open('extracted_scripts.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Add my overrides to the text FIRST, so they are the LAST declarations
with open('js/admin-modern-overrides.js', 'r', encoding='utf-8', errors='ignore') as f:
    overrides = f.read()
    
text = text + "\n" + overrides

lines = text.split('\n')

patterns = [
    (re.compile(r'^(\s*)async\s+function\s+([a-zA-Z0-9_]+)(\s*\()'),  r'\1async function \2_DUP_\3\4'),
    (re.compile(r'^(\s*)function\s+([a-zA-Z0-9_]+)(\s*\()'),        r'\1function \2_DUP_\3\4'),
    (re.compile(r'^(\s*)const\s+([a-zA-Z0-9_]+)(\s*=)'),           r'\1const \2_DUP_\3\4'),
    (re.compile(r'^(\s*)let\s+([a-zA-Z0-9_]+)(\s*=)'),             r'\1let \2_DUP_\3\4'),
    (re.compile(r'^(\s*)var\s+([a-zA-Z0-9_]+)(\s*=)'),             r'\1var \2_DUP_\3\4')
]

declarations = {} 
find_name_p = re.compile(r'\b(async\s+)?(function|const|let|var)\s+([a-zA-Z0-9_]+)\b')

for i, line in enumerate(lines):
    # Don't rename things in my overrides
    if 'MODERN DASHBOARD OVERRIDES' in line:
        break
        
    match = find_name_p.search(line)
    if match:
        name = match.group(3)
        if name not in declarations: declarations[name] = []
        declarations[name].append(i)

to_rename = []
for name, indices in declarations.items():
    if len(indices) > 1:
        # Keep the LAST one, rename all others
        for idx in indices[:-1]:
            to_rename.append((idx, name))

for idx, name in to_rename:
    # Use re.sub to only rename the FIRST occurrence on the line
    original_line = lines[idx]
    new_line = re.sub(r'\b' + name + r'\b', name + f"_DUP_{idx}", original_line, count=1)
    lines[idx] = new_line

with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Renamed {len(to_rename)} duplicate declarations.")
