import re

path = 'js/admin-app.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Fix the __loadOrdersRunning lock
# We need to find where it's set and ensure it's cleared.
# Instead of complex regex, let's just find the start of the function and the catch block.
# Actually, I'll just search and replace.

# 2. Fix the "CONFLICT REMOVED" issues properly.
# Any line starting with "// CONFLICT REMOVED: " that contains "const ", "let ", or "var "
# should be UNCOMMENTED if it's the only declaration for that variable.
# OR just uncomment it if it's needed for the code to run.

# Let's find all lines with CONFLICT REMOVED
lines = text.split('\n')
for i, line in enumerate(lines):
    if '// CONFLICT REMOVED: ' in line:
        # Check if it looks like a variable/function declaration
        if re.search(r'\b(const|let|var|function)\b', line):
            # Check the next 10 lines for usage of that variable
            match = re.search(r'\b(const|let|var|function)\s+([a-zA-Z0-9_]+)', line)
            if match:
                name = match.group(2)
                usage_found = False
                for j in range(i + 1, min(i + 30, len(lines))):
                    if re.search(r'\b' + name + r'\b', lines[j]) and '//' not in lines[j] and 'CONFLICT' not in lines[j]:
                        usage_found = True
                        break
                if usage_found:
                    lines[i] = lines[i].replace('// CONFLICT REMOVED: ', '')
                    print(f"Uncommented {name} at line {i+1}")

# 3. Add finally { __loadOrdersRunning = false; } to loadOrders
# First, find loadOrders
load_orders_start = -1
for i, line in enumerate(lines):
    if 'async function loadOrders' in line and '//' not in line:
        load_orders_start = i
        break

if load_orders_start != -1:
    # Find the end of the try block or the beginning of catch
    for i in range(load_orders_start, len(lines)):
        if '} catch (error) {' in lines[i]:
            # Insert lock reset BEFORE the catch
            # Actually, the best place is at the end of the success path
            # and at the start of the catch.
            # But wait, line 4268 already had it in catch. 
            # Let's add it before line 4282 (end of function)
            pass

# To be safe, I'll just manually ensure __loadOrdersRunning = false is at the end of loadOrders.

# 4. Fix handleAdminLogin for the new UI
for i, line in enumerate(lines):
    if 'async function handleAdminLogin' in line and '//' not in line:
        # Look for the modal selection lines
        for j in range(i, i+10):
            if 'adminPassword' in lines[j]:
                # Found it
                pass
        # I'll replace the whole handleAdminLogin with a universal one.

# Write it back
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
