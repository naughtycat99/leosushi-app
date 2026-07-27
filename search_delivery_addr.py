with open('js/checkout.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'delivery_address' in line or 'deliveryAddress' in line.lower():
            print(f"L{i}: {line.strip()}")
