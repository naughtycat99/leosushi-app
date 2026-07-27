import os

target = "delivery_address"
results = []

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'build' in root or 'platforms' in root:
        continue
    for file in files:
        if 'checkout' in file:
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f, 1):
                        if target in line or 'street' in line or 'house' in line or 'extra' in line or 'apartment' in line:
                            results.append(f"{path}:{i}: {line.strip()}")
            except Exception as e:
                pass

with open('checkout_search.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print(f"Found {len(results)} matches.")
