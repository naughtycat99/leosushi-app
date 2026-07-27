with open('js/checkout.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'housedown' in line.lower() or 'house_number' in line.lower() or 'housenumber' in line.lower() or 'deliveryhousenumber' in line.lower() or 'delivery_address' in line.lower():
            print(f"L{i}: {line.strip()}")
