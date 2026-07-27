with open('checkout.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'input' in line.lower() or 'label' in line.lower() or 'select' in line.lower():
            if any(x in line.lower() for x in ['street', 'strasse', 'haus', 'adresse', 'plz', 'ort', 'note', 'extra', 'detail']):
                print(f"L{i}: {line.strip()}")
