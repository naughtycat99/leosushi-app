import re
from collections import Counter

path = r'd:/jatodemo/leosushi2/js/admin-app.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Match standard function declarations
fns = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', content)
# Match window assignments
win_fns = re.findall(r'window\.([a-zA-Z0-9_]+)\s*=', content)

all_names = fns + win_fns
counts = Counter(all_names)
duplicates = {name: count for name, count in counts.items() if count > 1}

print("DUPLICATES REPORT:")
for name, count in duplicates.items():
    print(f"- {name}: {count} times")
