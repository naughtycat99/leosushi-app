import os

target = "ĐỊA CHỈ"
results = []

for root, dirs, files in os.walk('.'):
    # Skip build directories or node_modules to keep it fast
    if 'node_modules' in root or '.git' in root or 'build' in root or 'platforms' in root:
        continue
    for file in files:
        if file.endswith(('.js', '.html')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f, 1):
                        if target in line:
                            results.append(f"{path}:{i}: {line.strip()}")
            except Exception as e:
                pass

with open('search_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print(f"Found {len(results)} matches.")
