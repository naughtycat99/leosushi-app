/**
 * network-printer.js
 * LAN printer support:
 *   - In Android app (Capacitor): uses native TCP/ESC-POS via window.AndroidPrinter
 *   - In browser: uses OS print dialog (window.print)
 *
 * Usage:
 *   await NativeLanPrinter.discoverPrinters()     // Find printers on LAN
 *   await NativeLanPrinter.connect(ip)             // Connect to IP
 *   await NativeLanPrinter.print(escPosBytes)      // Send ESC/POS bytes
 *   NetworkPrinter.printReceipt(...)               // OS dialog (browser fallback)
 */

// ============================================================
// NativeLanPrinter — Direct TCP/ESC-POS via native Android bridge
// Only available in the Capacitor Android app (window.AndroidPrinter)
// ============================================================
const NativeLanPrinter = (() => {
    function hasNativeBridge() {
        return !!(window.AndroidPrinter);
    }

    /** Promise that resolves when a JS callback fires */
    function waitForCallback(callbackName, timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                window[callbackName] = null;
                reject(new Error('Timeout: ' + callbackName));
            }, timeoutMs);

            window[callbackName] = (jsonStr) => {
                clearTimeout(timer);
                window[callbackName] = null;
                try {
                    resolve(typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr);
                } catch (e) {
                    resolve(jsonStr);
                }
            };
        });
    }

    /**
     * Scan the local LAN for devices listening on port 9100 (thermal printers).
     * Returns array of IP strings, e.g. ["192.168.1.105"]
     */
    async function discoverPrinters() {
        if (!hasNativeBridge()) throw new Error('Native bridge not available');
        const promise = waitForCallback('__onPrinterDiscoveryResult', 35000);
        window.AndroidPrinter.discoverPrinters();
        const result = await promise;
        if (result && result.error) throw new Error(result.error);
        // Result is a JSON array string or parsed array
        const ips = Array.isArray(result) ? result : JSON.parse(result);
        return ips;
    }

    /**
     * Connect to LAN printer at given IP on port 9100.
     */
    async function connect(ip) {
        if (!hasNativeBridge()) throw new Error('Native bridge not available');
        // Save to localStorage for future auto-connect
        localStorage.setItem('lan_printer_ip', ip);
        
        // Also save branch-specifically if logged in as a branch admin or selected branch
        try {
            const savedRole = localStorage.getItem('leo_admin_role');
            if (savedRole) {
                const roleInfo = JSON.parse(savedRole);
                const activeBranch = roleInfo.role === 'branch_admin' ? roleInfo.branch : (document.getElementById('adminBranchSelect')?.value || 'branch_flora');
                if (activeBranch && activeBranch !== 'all') {
                    localStorage.setItem('lan_printer_ip_' + activeBranch, ip);
                }
            }
        } catch (e) {}

        const promise = waitForCallback('__onPrinterConnected', 8000);
        window.AndroidPrinter.connect(ip);
        const result = await promise;
        if (!result.success) throw new Error(result.error || 'Connection failed');
        return result;
    }

    /**
     * Auto-connect to the last used printer IP (if saved).
     */
    async function autoConnect() {
        const savedIp = localStorage.getItem('lan_printer_ip');
        if (!savedIp || !hasNativeBridge()) return false;
        try {
            await connect(savedIp);
            console.log('🖨️ Auto-connected to LAN printer:', savedIp);
            return true;
        } catch (e) {
            console.warn('🖨️ LAN printer auto-connect failed:', e.message);
            return false;
        }
    }

    /**
     * Send raw ESC/POS bytes to the connected printer.
     * Accepts Uint8Array or Array of numbers.
     */
    async function printRaw(bytes) {
        if (!hasNativeBridge()) throw new Error('Native bridge not available');
        
        // Ensure we are connected
        const status = getStatus();
        if (!status.connected) {
            console.log('🖨️ Not connected, attempting auto-reconnect before print...');
            const reconnected = await autoConnect();
            if (!reconnected) throw new Error('Máy in chưa được kết nối hoặc IP không đúng.');
        }

        const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        // Encode to base64 for transfer to Java
        let binary = '';
        for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
        const base64 = btoa(binary);
        const promise = waitForCallback('__onPrinterPrintResult', 15000);
        window.AndroidPrinter.print(base64);
        const result = await promise;
        if (!result.success) throw new Error(result.error || 'Print failed');
        return result;
    }

    function disconnect() {
        if (hasNativeBridge()) window.AndroidPrinter.disconnect();
        localStorage.removeItem('lan_printer_ip');
    }

    function getStatus() {
        if (!hasNativeBridge()) return { connected: false, ip: null, localIp: null, bridgeReady: false };
        try { return JSON.parse(window.AndroidPrinter.getStatus()); }
        catch (e) { return { connected: false, ip: null, localIp: null, bridgeReady: true }; }
    }

    /**
     * Test if a specific IP is reachable on the network.
     */
    async function testReachability(ip) {
        if (!hasNativeBridge()) return { reachable: false, error: 'Bridge not available' };
        const promise = waitForCallback('__onPrinterReachabilityResult', 5000);
        window.AndroidPrinter.testReachability(ip);
        return await promise;
    }

    function getSavedIp(branchId = null) {
        if (branchId && branchId !== 'all') {
            const branchIp = localStorage.getItem('lan_printer_ip_' + branchId);
            if (branchIp) return branchIp;
        }
        return localStorage.getItem('lan_printer_ip');
    }

    return { hasNativeBridge, discoverPrinters, connect, autoConnect, printRaw, disconnect, getStatus, getSavedIp, testReachability };
})();

window.NativeLanPrinter = NativeLanPrinter;

// ============================================================
// NetworkPrinter — OS print dialog (browser / fallback)
// ============================================================

const NetworkPrinter = (() => {
    // ---- Helpers ----
    function formatPrice(price) {
        let num = typeof price === 'string'
            ? parseFloat(price.replace(/[^\d.,\-]/g, '').replace(',', '.'))
            : parseFloat(price);
        if (isNaN(num)) num = 0;
        return num.toFixed(2).replace('.', ',') + ' €';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ---- Core print engine ----
    /**
     * Print arbitrary HTML content via a hidden iframe.
     * Opens the native OS print dialog which supports WiFi/LAN printers.
     */
    function printHTML(htmlContent) {
        return new Promise((resolve, reject) => {
            try {
                // Remove any previous print iframe
                const old = document.getElementById('networkPrintFrame');
                if (old) old.remove();

                // Method 1: Check if we are on Android Mobile (Browser ONLY)
                const isAndroid = /Android/i.test(navigator.userAgent);
                if (isAndroid && !NativeLanPrinter.hasNativeBridge()) {
                    console.log('🖨️ Method 1: Browser-based window.open on Android');
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                        printWindow.document.open();
                        printWindow.document.write(htmlContent);
                        printWindow.document.close();
                        printWindow.onload = () => {
                            setTimeout(() => {
                                try {
                                    printWindow.focus();
                                    printWindow.print();
                                    setTimeout(() => { if (!printWindow.closed) printWindow.close(); resolve(); }, 1500);
                                } catch (e) { try { printWindow.close(); } catch (_) { } reject(e); }
                            }, 500);
                        };
                        return;
                    } else {
                        console.log('🖨️ window.open blocked. Falling back to Method 3 (div injection) for Android.');
                        // Fall straight to Method 3 since Android Chrome doesn't support iframe printing
                        const printDiv = document.createElement('div');
                        printDiv.id = 'networkPrintContent';
                        printDiv.innerHTML = htmlContent;
                        printDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#fff;overflow:auto;';
                        document.body.appendChild(printDiv);
                        window.print();
                        setTimeout(() => {
                            printDiv.remove();
                            resolve();
                        }, 2000);
                        return;
                    }
                }

                // Method 2: Fallback — use iframe (for desktop browsers)
                const iframe = document.createElement('iframe');
                iframe.id = 'networkPrintFrame';
                iframe.style.cssText = 'position:fixed;top:-1000px;left:-1000px;width:1px;height:1px;border:none;opacity:0.01;z-index:-1;';
                document.body.appendChild(iframe);

                // Check if contentWindow is available
                if (!iframe.contentWindow || !iframe.contentDocument) {
                    iframe.remove();
                    
                    // IF we are in the APK, Method 3 (Last resort) is FORBIDDEN as it causes the white screen
                    if (NativeLanPrinter.hasNativeBridge()) {
                         throw new Error('Dịch vụ in của hệ thống không sẵn sàng.');
                    }

                    // Method 3: Last resort — print the main window with injected content
                    const printDiv = document.createElement('div');
                    printDiv.id = 'networkPrintContent';
                    printDiv.innerHTML = htmlContent;
                    printDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#fff;overflow:auto;';
                    document.body.appendChild(printDiv);
                    window.print();
                    setTimeout(() => {
                        printDiv.remove();
                        resolve();
                    }, 2000);
                    return;
                }

                const doc = iframe.contentDocument;
                doc.open();
                doc.write(htmlContent);
                doc.close();

                setTimeout(() => {
                    try {
                        if (iframe.contentWindow) {
                            iframe.contentWindow.focus();
                            iframe.contentWindow.print();
                        }
                        setTimeout(() => {
                            iframe.remove();
                            resolve();
                        }, 2000);
                    } catch (err) {
                        iframe.remove();
                        reject(err);
                    }
                }, 1000);

            } catch (err) {
                reject(err);
            }
        });
    }

    // ---- Receipt CSS ----
    const RECEIPT_CSS = `
        @page {
            size: 80mm auto;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            line-height: 1.4;
            width: 72mm;
            padding: 4mm;
            color: #000;
            background: #fff;
        }
        .receipt {
            width: 100%;
        }
        .center { text-align: center; }
        .left { text-align: left; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .big {
            font-size: 18px;
            font-weight: bold;
        }
        .medium {
            font-size: 14px;
            font-weight: bold;
        }
        .small { font-size: 10px; }
        .dashes {
            border-top: 1px dashed #000;
            margin: 4px 0;
        }
        .row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .row .label { flex: 1; }
        .row .value { text-align: right; white-space: nowrap; }
        .item-note {
            padding-left: 16px;
            font-style: italic;
            font-size: 11px;
            color: #333;
        }
        .highlight-box {
            border: 2px solid #000;
            padding: 4px 8px;
            margin: 4px 0;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
        }
        .total-row {
            font-size: 16px;
            font-weight: bold;
        }
        .spacer { height: 8px; }
        .kitchen-title {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            border: 2px solid #000;
            padding: 4px;
            margin-bottom: 6px;
        }
        .kitchen-item {
            font-size: 16px;
            font-weight: bold;
            margin: 2px 0;
        }
        .kitchen-note {
            font-size: 14px;
            font-weight: bold;
            padding-left: 12px;
            color: #000;
        }
        .page-break {
            page-break-before: always;
        }
    `;

    // ---- Receipt HTML generators ----
    function buildCustomerReceipt(orderData, deliveryAddress, orderId, estimatedTimeText) {
        const items = orderData.items || [];
        const summary = orderData.summary || {};
        const serviceType = orderData.service_type === 'delivery' ? 'Lieferung' : 'Abholung';
        const pm = (summary.payment_method || '').toLowerCase();
        const payMethod = (pm.includes('cash') || pm.includes('tiền mặt') || pm.includes('bar')) ? 'Barzahlung' :
            (pm.includes('paypal') ? 'PayPal' : 'Kartenzahlung');

        const now = new Date();
        const timeStr = now.toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const firstName = deliveryAddress.firstName || deliveryAddress.first_name || '';
        const lastName = deliveryAddress.lastName || deliveryAddress.last_name || '';

        let html = `<div class="receipt">`;

        // Header
        html += `<div class="center big">Leo Sushi</div>`;
        const receiptBranchAddr = (summary.branch && summary.branch.address) ? escapeHtml(summary.branch.address) : 'Florastraße 10A, 13187 Berlin';
        const receiptBranchPhone = (summary.branch && summary.branch.id === 'branch_haupt') ? '03055617056' : '03037476736';
        html += `<div class="center small">${receiptBranchAddr}</div>`;
        html += `<div class="center small">${receiptBranchPhone}</div>`;
        html += `<div class="dashes"></div>`;

        let etaDisplay = estimatedTimeText;
        let cleanEta = '';
        if (estimatedTimeText) {
            cleanEta = estimatedTimeText.replace(/\s*Uhr.*$/i, '').trim();
            if (/^\d+$/.test(cleanEta)) {
                const mins = parseInt(cleanEta, 10);
                const etaDate = new Date();
                etaDate.setMinutes(etaDate.getMinutes() + mins);
                cleanEta = etaDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                etaDisplay = cleanEta + ' Uhr';
            } else if (/^\d{1,2}:\d{2}$/.test(cleanEta)) {
                etaDisplay = cleanEta + ' Uhr';
            }
        }

        // Estimated time
        if (estimatedTimeText) {
            html += `<div class="highlight-box">Geplant: ${escapeHtml(etaDisplay)}</div>`;
            html += `<div class="dashes"></div>`;
        }

        // Order info
        const ordIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-8));
        let timeDisplay = timeStr;
        if (estimatedTimeText) {
            timeDisplay = `${timeStr} - ${cleanEta}`;
        }
        
        html += `<div class="row"><span class="label">Bestellung:</span><span class="value">${escapeHtml(ordIdShort)}</span></div>`;
        html += `<div class="row"><span class="label">Typ:</span><span class="value">${serviceType}</span></div>`;
        html += `<div class="row"><span class="label">Datum:</span><span class="value">${timeDisplay}</span></div>`;
        html += `<div class="dashes"></div>`;

        // Customer info
        html += `<div class="bold">Kundendaten:</div>`;
        html += `<div class="row"><span class="label">Vorname:</span><span class="value">${escapeHtml(firstName)}</span></div>`;
        html += `<div class="row"><span class="label">Nachname:</span><span class="value">${escapeHtml(lastName)}</span></div>`;
        html += `<div class="row"><span class="label">Telefon:</span><span class="value">${escapeHtml(deliveryAddress.phone || '-')}</span></div>`;
        if (orderData.service_type === 'delivery') {
            const addr = [deliveryAddress.street, deliveryAddress.postal, deliveryAddress.city].filter(Boolean).join(', ');
            html += `<div>Adr: ${escapeHtml(addr)}</div>`;
        }
        html += `<div class="dashes"></div>`;

        // Items
        html += `<div class="bold center">ARTIKEL</div>`;
        html += `<div class="dashes"></div>`;
        items.forEach(item => {
            const qty = item.quantity || item.qty || 1;
            let name = item.name || 'N/A';
            // Remove allergens like "(A, B, 1, 2)" from the end
            name = name.replace(/\s*\([0-9A-Z,\s]+\)\s*$/, '');
            name = escapeHtml(name.substring(0, 34));
            const total = formatPrice(item.total || ((item.price || 0) * qty));
            html += `<div class="row medium"><span class="label">${qty}x ${name}</span><span class="value">${total}</span></div>`;
            const itemNote = (item.note || item.notes || item.options || item.comment || item.special_instructions || '').trim();
            if (itemNote) {
                html += `<div class="item-note" style="font-weight: bold; color: #d9534f; margin-left: 10px;">&gt; HINWEIS: ${escapeHtml(itemNote)}</div>`;
            }
        });
        html += `<div class="dashes"></div>`;

        // Totals
        if (summary.subtotal) {
            html += `<div class="row"><span class="label">Zwischensumme:</span><span class="value">${formatPrice(summary.subtotal)}</span></div>`;
        }
        if (summary.delivery_fee && parseFloat(summary.delivery_fee) > 0) {
            html += `<div class="row"><span class="label">Liefergebühr:</span><span class="value">${formatPrice(summary.delivery_fee)}</span></div>`;
        }
        if (summary.tip && parseFloat(summary.tip) > 0) {
            html += `<div class="row"><span class="label">Trinkgeld:</span><span class="value">${formatPrice(summary.tip)}</span></div>`;
        }
        if (summary.discount && parseFloat(summary.discount) > 0) {
            html += `<div class="row"><span class="label">Rabatt:</span><span class="value">-${formatPrice(summary.discount)}</span></div>`;
        }

        // VAT
        const subtotalNum = parseFloat(String(summary.subtotal || 0).replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const vatAmount = (subtotalNum * 7 / 107);
        html += `<div class="row small"><span class="label">MwSt. (7% inkl.):</span><span class="value">${formatPrice(vatAmount)}</span></div>`;

        html += `<div class="dashes"></div>`;
        html += `<div class="row total-row"><span class="label">TOTAL:</span><span class="value">${formatPrice(summary.total || 0)}</span></div>`;
        
        const isCash = (payMethod === 'Barzahlung');
        if (isCash) {
            html += `<div class="dashes"></div>`;
            html += `<div class="row total-row"><span class="label">Zu zahlen:</span><span class="value">${formatPrice(summary.total || 0)}</span></div>`;
        } else {
            html += `<div class="dashes"></div>`;
            html += `<div class="row"><span class="label">Bereits bezahlt:</span><span class="value">${formatPrice(summary.total || 0)}</span></div>`;
            html += `<div class="row total-row"><span class="label">Zu zahlen:</span><span class="value">${formatPrice(0)}</span></div>`;
        }
        
        html += `<div class="dashes"></div>`;

        // Footer
        html += `<div class="center">Zahlung: ${payMethod}</div>`;
        html += `<div class="spacer"></div>`;
        html += `<div class="center bold">Vielen Dank!</div>`;
        html += `<div class="center small">www.leo-sushi-berlin.de</div>`;

        // Note
        if (deliveryAddress.note) {
            html += `<div class="dashes"></div>`;
            html += `<div class="bold">HINWEIS:</div>`;
            html += `<div>${escapeHtml(deliveryAddress.note)}</div>`;
        }

        html += `</div>`;
        return html;
    }

    function buildKitchenTicket(orderData, deliveryAddress, orderId, estimatedTimeText) {
        const items = orderData.items || [];
        const serviceType = orderData.service_type === 'delivery' ? 'LIEFERUNG' : 'ABHOLUNG';
        const firstName = deliveryAddress.firstName || deliveryAddress.first_name || '';
        const lastName = deliveryAddress.lastName || deliveryAddress.last_name || '';

        const now = new Date();
        const timeStr = now.toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        let html = `<div class="receipt">`;

        html += `<div class="kitchen-title">KÜCHENTICKET</div>`;
        html += `<div class="highlight-box">${serviceType}</div>`;

        let etaDisplay = estimatedTimeText;
        let cleanEta = '';
        if (estimatedTimeText) {
            cleanEta = estimatedTimeText.replace(/\s*Uhr.*$/i, '').trim();
            if (/^\d+$/.test(cleanEta)) {
                const mins = parseInt(cleanEta, 10);
                const etaDate = new Date();
                etaDate.setMinutes(etaDate.getMinutes() + mins);
                cleanEta = etaDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
                etaDisplay = cleanEta + ' Uhr';
            } else if (/^\d{1,2}:\d{2}$/.test(cleanEta)) {
                etaDisplay = cleanEta + ' Uhr';
            }
        }

        if (estimatedTimeText) {
            html += `<div class="highlight-box">Geplant: ${escapeHtml(etaDisplay)}</div>`;
        }

        let kitchenTimeDisplay = timeStr;
        if (estimatedTimeText) {
            kitchenTimeDisplay = `${timeStr} - ${cleanEta}`;
        }

        const summary = orderData.summary || {};
        const ordIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-8));
        html += `<div class="row"><span class="label">Nr:</span><span class="value">${escapeHtml(ordIdShort)}</span></div>`;
        html += `<div class="row"><span class="label">Zeit:</span><span class="value">${kitchenTimeDisplay}</span></div>`;
        html += `<div class="dashes"></div>`;

        // Customer
        html += `<div class="bold">Kundendaten:</div>`;
        html += `<div class="row"><span class="label">Vorname:</span><span class="value">${escapeHtml(firstName)}</span></div>`;
        html += `<div class="row"><span class="label">Nachname:</span><span class="value">${escapeHtml(lastName)}</span></div>`;
        if (orderData.service_type === 'delivery') {
            const addr = [deliveryAddress.street, deliveryAddress.postal, deliveryAddress.city].filter(Boolean).join(', ');
            html += `<div>Adr: ${escapeHtml(addr)}</div>`;
        }
        html += `<div class="dashes"></div>`;

        const pm = (summary.payment_method || '').toLowerCase();
        const payMethod = (pm.includes('cash') || pm.includes('tiền mặt') || pm.includes('bar')) ? 'Barzahlung' :
            (pm.includes('paypal') ? 'PayPal' : 'Kartenzahlung');

        // Items (larger for kitchen)
        items.forEach(item => {
            const qty = item.quantity || item.qty || 1;
            let name = item.name || 'N/A';
            // Remove allergens like "(A, B, 1, 2)" from the end
            name = name.replace(/\s*\([0-9A-Z,\s]+\)\s*$/, '');
            const desc = item.description ? ` (${item.description})` : '';
            html += `<div class="kitchen-item">${qty}x ${escapeHtml(name + desc)}</div>`;
            const itemNote = (item.note || item.notes || item.options || item.comment || item.special_instructions || '').trim();
            if (itemNote) {
                html += `<div class="kitchen-note" style="font-weight: bold; color: #d9534f; font-size: 1.1em; margin-left: 10px;">!! HINWEIS: ${escapeHtml(itemNote)}</div>`;
            }
        });

        // Add TOTAL and PAYMENT METHOD for Kitchen/Driver awareness
        html += `<div class="dashes"></div>`;
        html += `<div class="row total-row"><span class="label">TOTAL:</span><span class="value">${formatPrice(summary.total || 0)}</span></div>`;

        const isCashKitchen = (payMethod === 'Barzahlung');
        if (isCashKitchen) {
            html += `<div class="dashes"></div>`;
            html += `<div class="row total-row"><span class="label">Zu zahlen:</span><span class="value">${formatPrice(summary.total || 0)}</span></div>`;
        } else {
            html += `<div class="dashes"></div>`;
            html += `<div class="row"><span class="label">Bereits bezahlt:</span><span class="value">${formatPrice(summary.total || 0)}</span></div>`;
            html += `<div class="row total-row"><span class="label">Zu zahlen:</span><span class="value">${formatPrice(0)}</span></div>`;
        }

        html += `<div class="highlight-box" style="margin-top: 8px;">Zahlung: ${payMethod}</div>`;

        // Note
        if (deliveryAddress.note) {
            html += `<div class="dashes"></div>`;
            html += `<div class="highlight-box">HINWEIS: ${escapeHtml(deliveryAddress.note)}</div>`;
        }

        html += `</div>`;
        return html;
    }

    // ---- Public API ----

    // ============================================================
    // SunmiNativePrinter — Direct Integration with Sunmi SDK via Capacitor Plugin
    // ============================================================
    const SunmiNativePrinter = (() => {
        function hasPlugin() {
            return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SunmiPrinter;
        }

        async function printRaw(bytes) {
            if (!hasPlugin()) throw new Error('SunmiPrinter plugin not available');
            const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
            let binary = '';
            for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
            const base64 = btoa(binary);
            await window.Capacitor.Plugins.SunmiPrinter.printRaw({ data: base64 });
        }

        async function getStatus() {
            if (!hasPlugin()) return { connected: false, hasService: false };
            try {
                return await window.Capacitor.Plugins.SunmiPrinter.getStatus();
            } catch (e) {
                return { connected: false, hasService: false };
            }
        }

        return { hasPlugin, printRaw, getStatus };
    })();
    
    // Export globally for UI checking
    window.SunmiNativePrinter = SunmiNativePrinter;

    /**
     * Print customer receipt + kitchen ticket for an order.
     * Same signature as BluetoothPrinter.printReceipt for easy swapping.
     */
    async function printReceipt(orderData, deliveryAddress, orderId, estimatedTimeText) {
        if (!orderData) throw new Error('printReceipt: orderData is null');
        deliveryAddress = deliveryAddress || {};
        orderId = orderId || 'N/A';
        estimatedTimeText = estimatedTimeText || '';

        console.log('🖨️ [Network] printReceipt called', { orderId });

        // 1. Try Direct Sunmi Integration First!
        if (typeof SunmiNativePrinter !== 'undefined' && SunmiNativePrinter.hasPlugin()) {
            try {
                const status = await SunmiNativePrinter.getStatus();
                if (status.hasService) {
                    console.log('🖨️ [Sunmi Native] Using Direct Sunmi SDK printing...');
                    const bytes = ReceiptGenerator.generateReceiptBytes(orderData, deliveryAddress, orderId, estimatedTimeText);
                    await SunmiNativePrinter.printRaw(bytes);
                    console.log('🖨️ [Sunmi Native] Direct print successful.');
                    return; // Done
                }
            } catch (err) {
                console.warn('🖨️ [Sunmi Native] Print failed, falling back:', err);
            }
        }

        // Try direct ESC/POS printing if in Native App (LAN Printer Fallback)
        if (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge()) {
            try {
                const branchId = (orderData.summary && orderData.summary.branch && orderData.summary.branch.id) ? orderData.summary.branch.id : (orderData.branch_id || 'branch_flora');
                const targetIp = NativeLanPrinter.getSavedIp(branchId);
                const status = NativeLanPrinter.getStatus();
                if (targetIp) {
                    if (!status.connected || status.ip !== targetIp) {
                        console.log(`🖨️ [Network] Reconnecting to branch ${branchId} printer at ${targetIp}...`);
                        await NativeLanPrinter.connect(targetIp);
                    }
                }
                
                console.log('🖨️ [Network] Using Direct ESC/POS printing...');
                const bytes = ReceiptGenerator.generateReceiptBytes(orderData, deliveryAddress, orderId, estimatedTimeText);
                await NativeLanPrinter.printRaw(bytes);
                console.log('🖨️ [Network] Direct print successful.');
                return; // Done
            } catch (err) {
                console.warn('🖨️ [Network] Direct print failed, falling back:', err);
            }
        }
        
        console.log('🖨️ [Network] Using Browser OS Print Dialog fallback...');
        const customerHtml = buildCustomerReceipt(orderData, deliveryAddress, orderId, estimatedTimeText);
        const kitchenHtml = buildKitchenTicket(orderData, deliveryAddress, orderId, estimatedTimeText);
        
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Bestellung ${orderId}</title>
<style>${RECEIPT_CSS}</style>
</head>
<body>
${customerHtml}
<div class="page-break"></div>
${kitchenHtml}
</body>
</html>`;

        await printHTML(fullHtml);
    }

    /**
     * Print a test page.
     */
    async function printTest() {
        const now = new Date().toLocaleString('de-DE');
        const testHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Druckertest</title>
<style>${RECEIPT_CSS}</style>
</head>
<body>
<div class="receipt">
    <div class="center big">Leo Sushi</div>
    <div class="dashes"></div>
    <div class="center">Drucker-Test</div>
    <div class="center">${now}</div>
    <div class="dashes"></div>
    <div class="center bold">Alles funktioniert! ✅</div>
    <div class="spacer"></div>
</div>
</body>
</html>`;

        await printHTML(testHTML);
        console.log('🖨️ [Network] Test page printed.');
    }

    return {
        printReceipt,
        printTest,
        // Network printer is always "connected" — it uses the OS print spooler
        get isConnected() { return true; },
        get printerName() { return 'Netzwerkdrucker (System)'; },
    };
})();

// Make globally available
window.NetworkPrinter = NetworkPrinter;
