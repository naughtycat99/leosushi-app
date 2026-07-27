import sys
import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            let customerName = 'Kunde';
            let phone = 'N/A';
            let note = '';

            if (isReservation) {
                customerName = order.name || 'Kunde';
                phone = order.phone || 'N/A';
                note = order.note || '';
            } else {
                customerName = `${order.delivery_address?.first_name || order.delivery?.address?.firstName || ''} ${order.delivery_address?.last_name || order.delivery?.address?.lastName || ''} `.trim() || 'Kunde';
                phone = order.delivery_address?.phone || order.delivery?.address?.phone || 'N/A';
                note = order.delivery_address?.note || order.delivery?.address?.note || summary.note || '';
            }

            // Parse delivery_address
            let address = null;
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { address = {}; }
                } else { address = order.delivery_address; }
            }"""

replacement = """            // Parse delivery_address
            let address = null;
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { address = {}; }
                } else { address = order.delivery_address; }
            }

            let customerName = 'Kunde';
            let phone = 'N/A';
            let note = '';

            if (isReservation) {
                customerName = order.name || 'Kunde';
                phone = order.phone || 'N/A';
                note = order.note || '';
            } else {
                customerName = `${address?.first_name || address?.firstName || ''} ${address?.last_name || address?.lastName || ''} `.trim() || 'Kunde';
                phone = address?.phone || 'N/A';
                note = address?.note || summary.note || order.note || '';
            }"""

content = content.replace(target, replacement)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
