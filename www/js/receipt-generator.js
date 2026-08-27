/**
 * receipt-generator.js
 * Generates raw ESC/POS bytes for thermal printers.
 * Centralized logic for both Bluetooth and Direct LAN printing.
 */
const ReceiptGenerator = (() => {
    // ESC/POS commands
    const ESC = 0x1B;
    const GS = 0x1D;
    const CMD = {
        INIT: [ESC, 0x40],                  // Initialize printer
        ALIGN_CENTER: [ESC, 0x61, 0x01],
        ALIGN_LEFT: [ESC, 0x61, 0x00],
        ALIGN_RIGHT: [ESC, 0x61, 0x02],
        BOLD_ON: [ESC, 0x45, 0x01],
        BOLD_OFF: [ESC, 0x45, 0x00],
        DOUBLE_ON: [GS, 0x21, 0x11],             // Double width + height
        DOUBLE_HEIGHT: [GS, 0x21, 0x01],         // Double height only
        DOUBLE_OFF: [GS, 0x21, 0x00],
        FONT_A: [ESC, 0x4D, 0x00],            // Normal font
        LINE: [0x0A],                        // Line feed
        FEED_3: [ESC, 0x64, 0x03],            // Feed 3 lines
        FEED_5: [ESC, 0x64, 0x05],
        CUT: [GS, 0x56, 0x00],               // Full cut
        PARTIAL_CUT: [GS, 0x56, 0x01],       // Partial cut
    };

    /**
     * Encode string to bytes approximating Code Page 858.
     */
    function encodeText(text) {
        const bytes = [];
        for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (c < 128) {
                bytes.push(c);
            } else {
                const map = {
                    0xC4: 0x8E, 0xD6: 0x99, 0xDC: 0x9A,
                    0xE4: 0x84, 0xF6: 0x94, 0xFC: 0x81,
                    0xDF: 0xE1, 0x20AC: 0xD5,
                };
                bytes.push(map[c] || 0x3F);
            }
        }
        return bytes;
    }

    function line(text = '') {
        return [...encodeText(text), ...CMD.LINE];
    }

    function dashes(len = 48) {
        return line('-'.repeat(len));
    }

    function leftRight(left, right, width = 48) {
        const space = width - left.length - right.length;
        const pad = space > 0 ? ' '.repeat(space) : ' ';
        return line(left + pad + right);
    }

    function formatPrice(price) {
        let num = typeof price === 'string'
            ? parseFloat(price.replace(/[^\d.,\-]/g, '').replace(',', '.'))
            : parseFloat(price);
        if (isNaN(num)) num = 0;
        return num.toFixed(2).replace('.', ',') + ' EUR';
    }

    /**
     * Generate bytes for customer receipt and kitchen ticket.
     */
    function generateReceiptBytes(orderData, deliveryAddress, orderId, estimatedTimeText) {
        deliveryAddress = deliveryAddress || {};
        orderId = orderId || 'N/A';
        estimatedTimeText = estimatedTimeText || '';

        const now = new Date();
        const timeStr = now.toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const items = orderData.items || [];
        const summary = orderData.summary || {};
        const serviceType = orderData.service_type === 'delivery' ? 'Lieferung' : 'Abholung';
        const pm = (summary.payment_method || '').toLowerCase();
        const payMethod = (pm.includes('cash') || pm.includes('tiền mặt') || pm.includes('bar')) ? 'Barzahlung' :
            (pm.includes('paypal') ? 'PayPal' : 'Kartenzahlung');

        let data = [];

        // ===== CUSTOMER RECEIPT =====
        data.push(...CMD.INIT);
        data.push(...CMD.ALIGN_CENTER, ...CMD.DOUBLE_ON, ...line('Leo Sushi'), ...CMD.DOUBLE_OFF);
        const branchAddr = (summary.branch && summary.branch.address) ? summary.branch.address : 'Florastraße 10A, 13187 Berlin';
        const branchPhone = (summary.branch && summary.branch.id === 'branch_haupt') ? '03055617056' : '03037476736';
        data.push(...CMD.FONT_A, ...line(branchAddr), ...line(branchPhone), ...dashes());

        let etaDisplay = estimatedTimeText;
        let cleanEta = '';
        if (estimatedTimeText) {
            cleanEta = estimatedTimeText.replace(/\s*Uhr.*$/i, '').trim();
            const timeMatch = cleanEta.match(/(\d{1,2}:\d{2})/);
            
            // Extract numeric minutes from strings like "30 min", "45 phút", "1 h"
            let numMinsMatch = cleanEta.match(/^\s*(\d+)\s*(min|m|phút|h|hour)\b/i);
            let isNumericOnly = /^\d+$/.test(cleanEta.trim());
            let parsedMins = 0;
            let hasMins = false;
            
            if (isNumericOnly) {
                parsedMins = parseInt(cleanEta, 10);
                hasMins = true;
            } else if (numMinsMatch) {
                parsedMins = parseInt(numMinsMatch[1], 10);
                if (numMinsMatch[2].toLowerCase().startsWith('h')) {
                    parsedMins *= 60;
                }
                hasMins = true;
            }

            if (hasMins) {
                const mins = parsedMins;
                const etaDate = new Date();
                etaDate.setMinutes(etaDate.getMinutes() + mins);
                cleanEta = etaDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                etaDisplay = cleanEta + ' Uhr';
            } else if (timeMatch) {
                cleanEta = timeMatch[1];
                etaDisplay = cleanEta + ' Uhr';
            }
        }

        data.push(...CMD.ALIGN_LEFT);
        if (estimatedTimeText) {
            data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...leftRight('GEPLANT:', etaDisplay, 24), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF, ...dashes());
        }

        let timeDisplay = timeStr;
        if (estimatedTimeText) {
            timeDisplay = `${timeStr} - ${cleanEta}`;
        }

        const ordIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-8));

        data.push(...leftRight('Bestellung:', ordIdShort));
        data.push(...leftRight('Typ:', serviceType), ...leftRight('Datum:', timeDisplay), ...dashes());

        data.push(...line('Kundendaten:'));
        const firstName = deliveryAddress.firstName || deliveryAddress.first_name || '';
        const lastName = deliveryAddress.lastName || deliveryAddress.last_name || '';
        data.push(...leftRight('Vorname:', firstName), ...leftRight('Nachname:', lastName), ...leftRight('Telefon:', deliveryAddress.phone || '-'));
        if (orderData.service_type === 'delivery') {
            const street = deliveryAddress.street || '';
            const houseNum = deliveryAddress.houseNumber || deliveryAddress.house_number || deliveryAddress.housenumber || '';
            const streetLine = [street, houseNum].filter(Boolean).join(' ');
            const cityLine = [deliveryAddress.postal, deliveryAddress.city].filter(Boolean).join(' ');
            
            data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_HEIGHT, ...line('ADRESSE:'), ...line(streetLine), ...line(cityLine), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF);
        }
        data.push(...dashes(), ...CMD.BOLD_ON, ...line('ARTIKEL'), ...CMD.BOLD_OFF, ...dashes());

        data.push(...CMD.DOUBLE_HEIGHT);
        items.forEach(item => {
            const qty = item.quantity || item.qty || 1;
            let name = item.name || 'N/A';
            // Remove allergens like "(A, B, 1, 2)" from the end
            name = name.replace(/\s*\([0-9A-Z,\s]+\)\s*$/, '');
            name = name.substring(0, 34);
            const total = formatPrice(item.total || (item.price * qty) || 0);
            data.push(...leftRight(qty + 'x ' + name, total));
            if (item.note) data.push(...line('   > ' + item.note));
        });
        data.push(...CMD.DOUBLE_OFF, ...dashes());

        if (summary.subtotal) data.push(...leftRight('Zwischensumme:', formatPrice(summary.subtotal)));
        if (summary.delivery_fee && parseFloat(summary.delivery_fee) > 0) data.push(...leftRight('Liefergebuehr:', formatPrice(summary.delivery_fee)));
        if (summary.tip && parseFloat(summary.tip) > 0) data.push(...leftRight('Trinkgeld:', formatPrice(summary.tip)));
        if (summary.discount && parseFloat(summary.discount) > 0) data.push(...leftRight('Rabatt:', '-' + formatPrice(summary.discount)));

        const subtotalNum = parseFloat(String(summary.subtotal || 0).replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        data.push(...leftRight('MwSt. (7% inkl.):', formatPrice(subtotalNum * 7 / 107)), ...dashes());
        data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...leftRight('TOTAL:', formatPrice(summary.total || 0), 24), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF);

        const isCash = (payMethod === 'Barzahlung');
        if (isCash) {
            data.push(...CMD.LINE);
            data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...leftRight('Zu zahlen:', formatPrice(summary.total || 0), 24), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF);
        } else {
            data.push(...CMD.LINE);
            data.push(...leftRight('Bereits bezahlt:', formatPrice(summary.total || 0)));
            data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...leftRight('Zu zahlen:', formatPrice(0), 24), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF);
        }
        data.push(...CMD.ALIGN_CENTER, ...line('Zahlung: ' + payMethod), ...CMD.LINE, ...line('Vielen Dank für Ihre Bestellung!'), ...line('www.leo-sushi-berlin.de'), ...CMD.LINE);
        data.push(...CMD.ALIGN_CENTER, ...CMD.BOLD_ON, ...line('10% RABATT FUER DIE NAECHSTE BESTELLUNG:'), ...CMD.BOLD_OFF, ...line('Leo Sushi App laden & Code APP10 nutzen!'), ...line('leo-sushi-berlin.de/download-app'), ...CMD.LINE);
        // --- GOOGLE MAPS NAVIGATION QR CODE ---
        if (orderData.service_type === 'delivery') {
            const street = deliveryAddress.street || '';
            const houseNum = deliveryAddress.houseNumber || deliveryAddress.house_number || deliveryAddress.housenumber || '';
            const streetLine = (houseNum && !street.includes(houseNum)) ? `${street} ${houseNum}` : street;
            const addressString = `${streetLine}, ${deliveryAddress.postal || ''} ${deliveryAddress.city || ''}`.trim();
            
            if (addressString.length > 5) {
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString)}`;
                data.push(...CMD.ALIGN_CENTER, ...line('MAPS NAVIGATION: SCAN TO ROUTE'));
                
                const mapsUrlBytes = encodeText(mapsUrl);
                const mapsPL = (mapsUrlBytes.length + 3) & 0xFF;
                const mapsPH = ((mapsUrlBytes.length + 3) >> 8) & 0xFF;

                data.push(GS, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00);
                data.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, 0x05); // Size 5
                data.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, 0x31);
                data.push(GS, 0x28, 0x6B, mapsPL, mapsPH, 0x31, 0x50, 0x30, ...mapsUrlBytes);
                data.push(GS, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30);
                
                data.push(...CMD.LINE, ...CMD.LINE);
            }
        }

        if (deliveryAddress.note) {
            data.push(...dashes(), ...CMD.BOLD_ON, ...line('HINWEIS:'), ...CMD.BOLD_OFF, ...line(deliveryAddress.note));
        }
        data.push(...CMD.FEED_5, ...CMD.PARTIAL_CUT);

        // ===== KITCHEN TICKET =====
        data.push(...CMD.INIT, ...CMD.ALIGN_CENTER, ...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...line('KUECHENTICKET'), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF, ...dashes());
        data.push(...CMD.ALIGN_CENTER, ...CMD.DOUBLE_ON, ...CMD.BOLD_ON, ...line(serviceType.toUpperCase()), ...CMD.BOLD_OFF, ...CMD.DOUBLE_OFF, ...dashes());

        data.push(...CMD.ALIGN_LEFT);
        if (estimatedTimeText) {
            data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...leftRight('GEPLANT (HEN GIOR):', '', 24), ...line(etaDisplay), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF, ...dashes());
        }
        // Time range for kitchen if estimatedTimeText exists
        let kitchenTimeDisplay = timeStr;
        if (estimatedTimeText) {
            kitchenTimeDisplay = `${timeStr} - ${cleanEta}`;
        }

        data.push(...leftRight('Nr:', ordIdShort), ...leftRight('Zeit:', kitchenTimeDisplay), ...dashes());

        data.push(...line('Kundendaten:'), ...leftRight('Vorname:', firstName), ...leftRight('Nachname:', lastName));
        if (orderData.service_type === 'delivery') {
            const street = deliveryAddress.street || '';
            const houseNum = deliveryAddress.houseNumber || deliveryAddress.house_number || deliveryAddress.housenumber || '';
            const streetLine = (houseNum && !street.includes(houseNum)) ? `${street} ${houseNum}` : street;
            const cityLine = [deliveryAddress.postal, deliveryAddress.city].filter(Boolean).join(' ');
            const addr = [streetLine, cityLine].filter(Boolean).join(', ');
            data.push(...line('Adr: ' + addr));
        }
        data.push(...dashes(), ...CMD.DOUBLE_ON);
        items.forEach(item => {
            const qty = item.quantity || item.qty || 1;
            let name = item.name || 'N/A';
            // Remove allergens like "(A, B, 1, 2)" from the end
            name = name.replace(/\s*\([0-9A-Z,\s]+\)\s*$/, '');
            const desc = item.description ? ` (${item.description})` : '';
            // Do not truncate too aggressively, let it wrap if needed. Max length for Double Width is ~24 char per line (58mm=16)
            data.push(...line(qty + 'x ' + name + desc));
            if (item.note) {
                data.push(...CMD.DOUBLE_OFF, ...CMD.DOUBLE_HEIGHT, ...CMD.BOLD_ON, ...line('!! ' + item.note), ...CMD.BOLD_OFF, ...CMD.DOUBLE_OFF, ...CMD.DOUBLE_ON);
            }
        });
        data.push(...CMD.DOUBLE_OFF);

        // Add TOTAL and PAYMENT METHOD for Kitchen/Driver awareness
        data.push(...dashes());
        data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...leftRight('TOTAL:', formatPrice(summary.total || 0), 24), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF);


        data.push(...CMD.LINE);
        data.push(...CMD.BOLD_ON, ...CMD.DOUBLE_HEIGHT, ...line('Zahlung: ' + payMethod), ...CMD.DOUBLE_OFF, ...CMD.BOLD_OFF);

        if (deliveryAddress.note) {
            data.push(...dashes(), ...CMD.BOLD_ON, ...CMD.DOUBLE_ON, ...line('HINWEIS:'), ...CMD.DOUBLE_OFF, ...line(deliveryAddress.note), ...CMD.BOLD_OFF);
        }
        data.push(...CMD.FEED_5, ...CMD.CUT);

        return new Uint8Array(data);
    }

    return { generateReceiptBytes };
})();

window.ReceiptGenerator = ReceiptGenerator;
