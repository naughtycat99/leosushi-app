import re

input_path = 'd:/jatodemo/leosushi2/js/admin-app.js'
with open(input_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Patterns to identify function starts (even with spaces)
# 1. function name(...)
# 2. async function name(...)
# 3. window.name = function(...)
# 4. window.name = async function(...)

fn_start_regex = re.compile(r'^\s*(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(|^\s*window\.([a-zA-Z0-9_]+)\s*=\s*(?:async\s+)?function')

declarations = {} # name -> list of line indices

for i, line in enumerate(lines):
    match = fn_start_regex.search(line)
    if match:
        name = match.group(1) or match.group(2)
        if name not in declarations: declarations[name] = []
        declarations[name].append(i)

to_comment = []
for name, indices in declarations.items():
    if len(indices) > 1:
        # Keep the LAST one, comment out others
        for idx in indices[:-1]:
            to_comment.append(idx)

# Also check for variable redeclarations at top level (var, const, let)
var_regex = re.compile(r'^\s*(?:var|let|const)\s+([a-zA-Z0-9_]+)\s*=')
vars_found = {} # name -> line_idx
for i, line in enumerate(lines):
    if i in to_comment: continue
    match = var_regex.search(line)
    if match:
        name = match.group(1)
        if name in vars_found:
            # Redeclared. For vars, we can just comment out the later ones or earlier ones.
            # Let's keep the FIRST one for vars.
            to_comment.append(i)
        else:
            vars_found[name] = i

for idx in sorted(to_comment):
    lines[idx] = "// CONFLICT REMOVED: " + lines[idx]

with open(input_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Cleaned {len(to_comment)} conflicts.")
