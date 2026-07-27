import sys

# 1. Fix receipt-generator.js
with open('js/receipt-generator.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        let cleanEta = '';
        if (estimatedTimeText) {
            cleanEta = estimatedTimeText.replace(/\\s*Uhr.*$/i, '').trim();
            const timeMatch = cleanEta.match(/(\\d{1,2}:\\d{2})/);
            if (/^\\d+$/.test(cleanEta)) {"""

replacement = """        let cleanEta = '';
        if (estimatedTimeText) {
            cleanEta = estimatedTimeText.replace(/\\s*Uhr.*$/i, '').trim();
            const timeMatch = cleanEta.match(/(\\d{1,2}:\\d{2})/);
            
            // Extract numeric minutes from strings like "30 min", "45 phút", "1 h"
            let numMinsMatch = cleanEta.match(/^\\s*(\\d+)\\s*(min|m|phút|h|hour)\\b/i);
            let isNumericOnly = /^\\d+$/.test(cleanEta.trim());
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
                const mins = parsedMins;"""

content = content.replace(target, replacement)

# 2. Fix admin.html HTML Fallback
with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

target_html = """            let timeDisplay = `${orderDateStr}, ${orderTimeStr}`;
            const estTime = etaOverride || summary.estimated_time || summary.eta || '';
            if (estTime && estTime.includes(':')) {
                timeDisplay = `${orderDateStr}, ${orderTimeStr} - ${estTime}`;
            }"""

replacement_html = """            let timeDisplay = `${orderDateStr}, ${orderTimeStr}`;
            const estTime = (etaOverride || summary.estimated_time || summary.eta || '').trim();
            if (estTime) {
                let parsedEst = estTime;
                let numMinsMatch = estTime.match(/^\\s*(\\d+)\\s*(min|m|phút|h|hour)\\b/i);
                let isNumericOnly = /^\\d+$/.test(estTime);
                
                if (estTime.includes(':')) {
                    parsedEst = estTime.replace(/\\s*Uhr.*$/i, '').trim();
                } else if (isNumericOnly || numMinsMatch) {
                    let mins = 0;
                    if (isNumericOnly) mins = parseInt(estTime, 10);
                    else {
                        mins = parseInt(numMinsMatch[1], 10);
                        if (numMinsMatch[2].toLowerCase().startsWith('h')) mins *= 60;
                    }
                    const etaDate = new Date();
                    etaDate.setMinutes(etaDate.getMinutes() + mins);
                    parsedEst = etaDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
                }
                timeDisplay = `${orderDateStr}, ${orderTimeStr} - ${parsedEst}`;
            }"""

html = html.replace(target_html, replacement_html)

with open('js/receipt-generator.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)
