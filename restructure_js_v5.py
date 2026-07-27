import re

# 1. Read the original mess
with open('extracted_scripts.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# 2. Add modern overrides at the end
with open('js/admin-modern-overrides.js', 'r', encoding='utf-8', errors='ignore') as f:
    overrides = f.read()
text = text + "\n" + overrides

# 3. Convert to "var" style to allow shadows/redeclarations
# Replace const/let with var
text = re.sub(r'\bconst\s+', 'var ', text)
text = re.sub(r'\blet\s+', 'var ', text)

# Replace function declarations with var assignment
# function name(args) { -> var name = function(args) {
# async function name(args) { -> var name = async function(args) {

# Handle async first
text = re.sub(r'\basync\s+function\s+([a-zA-Z0-9_]+)\s*\(', r'var \1 = async function(', text)

# Handle regular function
# We use a negative lookbehind to avoid catching 'var name = function' (already changed)
text = re.sub(r'(?<!var\s)([a-zA-Z0-9_]+\s*=\s*)?function\s+([a-zA-Z0-9_]+)\s*\(', r'var \2 = function(', text)

# 4. Handle some edge cases like 'window.name = function' -> already fine.

# 5. Fix potential double 'var var' if it happened
text = text.replace('var var ', 'var ')

with open('js/admin-app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Restructured admin-app.js using 'var' redeclaration strategy.")
