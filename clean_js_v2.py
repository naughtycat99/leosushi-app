import re

input_path = 'd:/jatodemo/leosushi2/js/admin-app.js'
output_path = 'd:/jatodemo/leosushi2/js/admin-app.js'

with open(input_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Clean HTML fragments that shouldn't be there
text = re.sub(r'<\?php.*?\?>', '', text, flags=re.DOTALL)
text = re.sub(r'<\s*!--.*?--\s*>', '', text, flags=re.MULTILINE)

# 2. Extract function bodies carefully
# This regex matches "function name(args) { body }"
# We look for top-level functions
functions = {} # name -> content

# Regex for "function name(args) {"
# We use a non-greedy match for the body but inclusive of balanced braces is hard with regex.
# However, many functions in this file have a similar style.
# We will use a simpler approach: identify where functions start and use the LATEST one.

# Let's find all function starts
matches = list(re.finditer(r'^function\s+([a-zA-Z0-9_]+)\s*\(', text, re.MULTILINE))
matches += list(re.finditer(r'^async\s+function\s+([a-zA-Z0-9_]+)\s*\(', text, re.MULTILINE))
matches += list(re.finditer(r'^window\.([a-zA-Z0-9_]+)\s*=\s*function\s*\(', text, re.MULTILINE))
matches += list(re.finditer(r'^window\.([a-zA-Z0-9_]+)\s*=\s*async\s+function\s*\(', text, re.MULTILINE))

# Sort by position
matches.sort(key=lambda x: x.start())

# Group by name
declarations = {} # name -> list of (start, name)
for m in matches:
    name = m.group(1)
    if name not in declarations: declarations[name] = []
    declarations[name].append(m.start())

# For every duplicate name, we keep the LAST one.
# For simplicity, we will COMMENT OUT all but the last one.
# This avoids logic breakage if we miss a body boundary.

lines = text.split('\n')
# Map positions to line indices
pos_to_line = []
curr = 0
for line in lines:
    pos_to_line.append(curr)
    curr += len(line) + 1

def get_line_index(pos):
    for i, p in enumerate(pos_to_line):
        if p > pos: return i - 1
    return len(lines) - 1

to_comment = []
for name, positions in declarations.items():
    if len(positions) > 1:
        # Keep the last one
        for pos in positions[:-1]:
            line_idx = get_line_index(pos)
            to_comment.append(line_idx)

for idx in to_comment:
    lines[idx] = "// DUPLICATE REMOVED: " + lines[idx]

# Final Cleanup: ensure no top-level await outside async
# That's harder, but node -c already passed after my manual fix.

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Deduplicated {len(to_comment)} function declarations.")
