import os

files = ["admin.html", "temp_admin.js", "render_order_card.js", "js/render_order_card.js", "js/admin.js", "js/checkout.js"]
old_str = "summary.payment_status === 'paid'"
new_str = "(order.payment_status === 'paid' || summary.payment_status === 'paid')"

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        if old_str in content:
            content = content.replace(old_str, new_str)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated {f}")
        else:
            print(f"String not found in {f}")
