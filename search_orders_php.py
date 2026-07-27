with open('api/orders.php', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'delivery_address' in line or 'street' in line.lower() or 'housenumber' in line.lower() or 'house_number' in line.lower() or 'postal' in line.lower():
            print(f"L{i}: {line.strip()}")
