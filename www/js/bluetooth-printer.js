/**
 * bluetooth-printer.js
 * Web Bluetooth API for auto-printing to thermal receipt printers.
 * Works in Chrome on Android / Windows / Mac.
 *
 * Usage:
 *   await BluetoothPrinter.connect();          // First-time pairing (user picks device)
 *   await BluetoothPrinter.autoReconnect();     // Subsequent loads — reconnect silently
 *   await BluetoothPrinter.printReceipt(order); // Send ESC/POS to printer
 */

const BluetoothPrinter = (() => {
    // ---- State ----
    let device = null;
    let server = null;
    let characteristic = null;
    let isConnected = false;

    // ---- Constants ----
    // Common Bluetooth Low Energy (BLE) service/characteristic UUIDs used by thermal printers.
    // Most Chinese receipt printers (Xprinter, MHT, GOOJPRT, etc.) use one of these.
    const PRINTER_SERVICE_UUIDS = [
        '000018f0-0000-1000-8000-00805f9b34fb',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
        '0000ff00-0000-1000-8000-00805f9b34fb',
        '0000ffe0-0000-1000-8000-00805f9b34fb',
    ];

    const PRINTER_CHAR_UUIDS = [
        '00002af1-0000-1000-8000-00805f9b34fb',
        'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
        '49535343-8841-43f4-a8d4-ecbe34729bb3',
        '0000ff02-0000-1000-8000-00805f9b34fb',
        '0000ffe1-0000-1000-8000-00805f9b34fb',
    ];

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
        UNDERLINE_ON: [ESC, 0x2D, 0x01],
        UNDERLINE_OFF: [ESC, 0x2D, 0x00],
        FONT_A: [ESC, 0x4D, 0x00],            // Normal font
        FONT_B: [ESC, 0x4D, 0x01],            // Smaller font
        CUT: [GS, 0x56, 0x00],             // Full cut
        PARTIAL_CUT: [GS, 0x56, 0x01],             // Partial cut
        FEED_3: [ESC, 0x64, 0x03],            // Feed 3 lines
        FEED_5: [ESC, 0x64, 0x05],
        LINE: [0x0A],                        // Line feed
    };

    // ---- Local storage helpers ----
    function savePrinterInfo() {
        if (device) {
            localStorage.setItem('bt_printer_id', device.id);
            localStorage.setItem('bt_printer_name', device.name || 'Drucker');
        }
    }

    function getSavedPrinterId() {
        return localStorage.getItem('bt_printer_id');
    }

    function getSavedPrinterName() {
        return localStorage.getItem('bt_printer_name') || 'Drucker';
    }

    function clearSavedPrinter() {
        localStorage.removeItem('bt_printer_id');
        localStorage.removeItem('bt_printer_name');
    }

    // ---- Connection ----
    const isCapacitor = () => window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();

    /**
     * Show Bluetooth scan dialog and let user pick a printer.
     * Only needs to happen once — printer ID is saved for auto-reconnect.
     */
    async function connect() {
        if (isCapacitor()) {
            return await connectNative();
        }

        if (!navigator.bluetooth) {
            throw new Error('Web Bluetooth wird von diesem Browser nicht unterstützt. Bitte Chrome sử dụng.');
        }

        try {
            // Let user pick any Bluetooth device (thermal printers may use various services)
            device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: PRINTER_SERVICE_UUIDS,
            });

            device.addEventListener('gattserverdisconnected', onDisconnected);

            await connectToGATT();
            savePrinterInfo();
            console.log('🖨️ Printer connected (Web):', device.name);
            return { name: device.name, id: device.id };
        } catch (err) {
            if (err.name === 'NotFoundError') {
                throw new Error('Kein Drucker ausgewählt.');
            }
            throw err;
        }
    }

    async function connectNative() {
        const plugins = window.Capacitor.Plugins || {};
        const BleClient = plugins.BleClient || plugins.BluetoothLe;
        if (!BleClient) throw new Error('Bluetooth LE plugin not available (BleClient/BluetoothLe)');

        try {
            await BleClient.initialize();
            const deviceObj = await BleClient.requestDevice({
                services: PRINTER_SERVICE_UUIDS,
                optionalServices: PRINTER_SERVICE_UUIDS
            });

            device = { id: deviceObj.deviceId, name: deviceObj.name || 'BT Printer' };
            await BleClient.connect(device.id, onDisconnectedNative);
            
            // Find writable characteristic
            const services = await BleClient.getServices(device.id);
            let found = false;
            for (const s of services) {
                for (const c of s.characteristics) {
                    // Check if characteristic UUID is in our known list, or if it has write properties
                    if (PRINTER_CHAR_UUIDS.includes(c.uuid) || c.properties.write || c.properties.writeWithoutResponse) {
                        characteristic = { 
                            service: s.uuid, 
                            uuid: c.uuid,
                            properties: c.properties
                        };
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) throw new Error('No writable characteristic found');

            isConnected = true;
            savePrinterInfo();
            console.log('🖨️ Printer connected (Native):', device.name);
            return { name: device.name, id: device.id };
        } catch (err) {
            console.error('Native connection error:', err);
            throw err;
        }
    }

    function onDisconnectedNative() {
        console.log('🖨️ Native Printer disconnected.');
        isConnected = false;
        characteristic = null; // Clear characteristic for native
        // Reconnect logic similar to web
        reconnectAttempts = 0; // Reset attempts
        attemptReconnect();
    }

    /**
     * Auto-reconnect to a previously paired printer (no user gesture needed).
     */
    async function autoReconnect() {
        const savedId = getSavedPrinterId();
        if (!savedId) return false;

        if (isCapacitor()) {
            return await autoReconnectNative(savedId);
        }

        if (!navigator.bluetooth || !navigator.bluetooth.getDevices) {
            console.log('🖨️ Auto-reconnect not supported in this browser.');
            return false;
        }

        try {
            // NOTE: navigator.bluetooth.getDevices() is experimental and often blocked
            // unless chrome://flags/#enable-web-bluetooth-new-permissions-backend is enabled
            // or the site is fully installed as a Trusted Web App/PWA.
            const devices = await navigator.bluetooth.getDevices();
            device = devices.find(d => d.id === savedId);
            if (!device) {
                console.log('🖨️ Saved printer not found among paired devices. Ensure Chrome flags are set.');
                return false;
            }

            device.addEventListener('gattserverdisconnected', onDisconnected);

            // Try to connect — this works silently if the printer is on and nearby
            await connectToGATT();
            console.log('🖨️ Auto-reconnected to:', device.name);
            return true;
        } catch (err) {
            // Silently fail, it just means the browser blocks silent background reconnection
            console.log('🖨️ Auto-reconnect permission denied or failed:', err.message);
            return false;
        }
    }

    async function autoReconnectNative(id) {
        if (isConnected && device && device.id === id && characteristic) {
            return true; 
        }

        const plugins = window.Capacitor.Plugins || {};
        const BleClient = plugins.BleClient || plugins.BluetoothLe;
        if (!BleClient) return false;

        try {
            await BleClient.initialize();
            
            // Check if already connected via plugin state
            try {
                const connectedDevices = await BleClient.getConnectedDevices([]);
                if (connectedDevices.some(d => d.id === id)) {
                    console.log('🖨️ Already connected to device via BleClient');
                } else {
                    await BleClient.connect(id, onDisconnectedNative);
                }
            } catch (e) {
                await BleClient.connect(id, onDisconnectedNative);
            }
            
            const services = await BleClient.getServices(id);
            let found = false;
            for (const s of services) {
                for (const c of s.characteristics) {
                    if (PRINTER_CHAR_UUIDS.includes(c.uuid) || c.properties.write || c.properties.writeWithoutResponse) {
                        characteristic = { 
                            service: s.uuid, 
                            uuid: c.uuid,
                            properties: c.properties
                        };
                        device = { id: id, name: getSavedPrinterName() }; // Restore device info
                        isConnected = true;
                        console.log('🖨️ Auto-reconnected (Native) to:', device.name);
                        return true;
                    }
                }
            }
            console.log('🖨️ Auto-reconnect (Native) failed: No writable characteristic found.');
            return false;
        } catch (err) {
            console.log('🖨️ Auto-reconnect (Native) permission denied or failed:', err.message);
            return false;
        }
    }

    async function connectToGATT() {
        server = await device.gatt.connect();

        // Try each known service UUID until we find one the printer supports
        let service = null;
        for (const uuid of PRINTER_SERVICE_UUIDS) {
            try {
                service = await server.getPrimaryService(uuid);
                console.log('🖨️ Found service:', uuid);
                break;
            } catch (_) { /* try next */ }
        }

        if (!service) {
            // Fallback: try to discover any service
            const services = await server.getPrimaryServices();
            if (services.length > 0) {
                service = services[0];
                console.log('🖨️ Using fallback service:', service.uuid);
            } else {
                throw new Error('Kein druckbarer Service auf dem Gerät gefunden.');
            }
        }

        // Find writable characteristic
        characteristic = null;
        for (const uuid of PRINTER_CHAR_UUIDS) {
            try {
                characteristic = await service.getCharacteristic(uuid);
                console.log('🖨️ Found characteristic:', uuid);
                break;
            } catch (_) { /* try next */ }
        }

        if (!characteristic) {
            // Fallback: find first writable characteristic
            const chars = await service.getCharacteristics();
            for (const c of chars) {
                if (c.properties.write || c.properties.writeWithoutResponse) {
                    characteristic = c;
                    console.log('🖨️ Using fallback characteristic:', c.uuid);
                    break;
                }
            }
        }

        if (!characteristic) {
            throw new Error('Keine schreibbare Eigenschaft gefunden. Drucker möglicherweise nicht kompatibel.');
        }

        isConnected = true;
    }

    let reconnectTimeout = null;
    let reconnectAttempts = 0;

    async function attemptReconnect() {
        if (isConnected || !device) return;

        reconnectAttempts++;
        console.log(`🖨️ Auto-reconnect attempt ${reconnectAttempts}...`);

        try {
            if (device && device.gatt && !device.gatt.connected) {
                await connectToGATT();
                if (isConnected) {
                    console.log('🖨️ Reconnected successfully!');
                    reconnectAttempts = 0;
                    if (typeof window.showMenuNotification === 'function') {
                        // Optional silent notification or omit to not be annoying
                        // window.showMenuNotification('🖨️ Drucker wieder verbunden', 'success');
                    }
                    return; // Done
                }
            }
        } catch (e) {
            console.warn('🖨️ Reconnect attempt failed:', e.message);
        }

        // Try again in 5 seconds, up to 2000 times
        if (reconnectAttempts < 2000) {
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(attemptReconnect, 5000);
        } else {
            console.log('🖨️ Gave up auto-reconnecting after too many attempts.');
        }
    }

    function onDisconnected() {
        console.log('🖨️ Printer disconnected.');
        isConnected = false;
        characteristic = null;
        server = null;

        // Reset and start reconnect attempts
        reconnectAttempts = 0;
        attemptReconnect();
    }

    // Add visibility listener to immediately try reconnecting when app wakes up
    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                const savedId = getSavedPrinterId();
                if (savedId && !isConnected) {
                    console.log('📱 App became visible, trying to recover printer connection...');
                    if (device) {
                        reconnectAttempts = 0;
                        attemptReconnect();
                    } else {
                        autoReconnect();
                    }
                }
            }
        });
    }

    function disconnect() {
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        if (device && device.gatt && device.gatt.connected) {
            device.gatt.disconnect();
        }
        isConnected = false;
        characteristic = null;
        server = null;
        device = null;
        clearSavedPrinter();
        console.log('🖨️ Printer disconnected and forgotten.');
    }

    // ---- Low-level send ----
    /**
     * Send raw bytes to printer. BLE has a max packet size (usually 20 bytes),
     * so we chunk the data.
     */
    async function sendRaw(data) {
        if (!characteristic || !isConnected) {
            throw new Error('Drucker nicht verbunden.');
        }

        if (isCapacitor()) {
            const plugins = window.Capacitor.Plugins || {};
            const BleClient = plugins.BleClient || plugins.BluetoothLe;
            const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
            
            // Capacitor BLE plugin handles chunking automatically or via MTU, 
            // but we can still chunk to be safe.
            const CHUNK_SIZE = 120;
            const useWithoutResponse = characteristic.properties && characteristic.properties.writeWithoutResponse;
            for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
                const chunk = bytes.slice(i, i + CHUNK_SIZE);
                try {
                    if (useWithoutResponse) {
                        await BleClient.writeWithoutResponse(device.id, characteristic.service, characteristic.uuid, new DataView(chunk.buffer));
                    } else {
                        await BleClient.write(device.id, characteristic.service, characteristic.uuid, new DataView(chunk.buffer));
                    }
                } catch (e) {
                   console.log('Chunk write error, retrying...', e);
                   await new Promise(r => setTimeout(r, 50));
                   if (useWithoutResponse) {
                        await BleClient.writeWithoutResponse(device.id, characteristic.service, characteristic.uuid, new DataView(chunk.buffer));
                   } else {
                        await BleClient.write(device.id, characteristic.service, characteristic.uuid, new DataView(chunk.buffer));
                   }
                }
                await new Promise(r => setTimeout(r, 20)); // Tiny delay
            }
            return;
        }

        const CHUNK_SIZE = 100; // safe BLE MTU
        const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);

        for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
            const chunk = bytes.slice(i, i + CHUNK_SIZE);
            try {
                if (characteristic.properties.writeWithoutResponse) {
                    await characteristic.writeValueWithoutResponse(chunk);
                } else {
                    await characteristic.writeValueWithResponse(chunk);
                }
            } catch (err) {
                // Retry once
                await new Promise(r => setTimeout(r, 50));
                if (characteristic.properties.writeWithoutResponse) {
                    await characteristic.writeValueWithoutResponse(chunk);
                } else {
                    await characteristic.writeValueWithResponse(chunk);
                }
            }
            // Small delay between chunks to avoid overwhelming the printer
            await new Promise(r => setTimeout(r, 20));
        }
    }

    // ---- Text encoding helpers ----
    /**
     * Encode string to bytes. Thermal printers typically use Code Page 858
     * (Western European with €). We approximate with a basic mapping.
     */
    function encodeText(text) {
        const bytes = [];
        for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (c < 128) {
                bytes.push(c);
            } else {
                // Map common German/special chars
                const map = {
                    0xC4: 0x8E, // Ä
                    0xD6: 0x99, // Ö
                    0xDC: 0x9A, // Ü
                    0xE4: 0x84, // ä
                    0xF6: 0x94, // ö
                    0xFC: 0x81, // ü
                    0xDF: 0xE1, // ß
                    0x20AC: 0xD5, // €
                };
                bytes.push(map[c] || 0x3F); // fallback to '?'
            }
        }
        return bytes;
    }

    // ---- Receipt formatting helpers ----
    function line(text = '') {
        return [...encodeText(text), ...CMD.LINE];
    }

    // Use 48 characters for 80mm printers
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

    // ---- High-level receipt generators ----
    /**
     * Print customer receipt + kitchen ticket for an order.
     * @param {Object} orderData — order object with items, summary, service_type etc.
     * @param {Object} deliveryAddress — customer address/contact info
     * @param {string} orderId
     * @param {string} estimatedTimeText — e.g. "15:30"
     */
    async function printReceipt(orderData, deliveryAddress, orderId, estimatedTimeText) {
        // Guard against null/undefined parameters
        if (!orderData) throw new Error('printReceipt: orderData is null');
        deliveryAddress = deliveryAddress || {};
        orderId = orderId || 'N/A';
        estimatedTimeText = estimatedTimeText || '';

        console.log('🖨️ printReceipt called', { orderId, hasItems: !!(orderData.items), isConnected });

        try {
            const bytes = ReceiptGenerator.generateReceiptBytes(orderData, deliveryAddress, orderId, estimatedTimeText);
            await sendRaw(bytes);
            console.log('🖨️ Receipt printed successfully!');
        } catch (err) {
            console.error('🖨️ Print error:', err);
            throw err;
        }
    }

    /**
     * Print a simple test page to verify connection.
     */
    async function printTest() {
        let data = [];
        data.push(...CMD.INIT);
        data.push(...CMD.ALIGN_CENTER);
        data.push(...CMD.DOUBLE_ON);
        data.push(...line('Leo Sushi'));
        data.push(...CMD.DOUBLE_OFF);
        data.push(...dashes());
        data.push(...line('Drucker-Test'));
        data.push(...line(new Date().toLocaleString('de-DE')));
        data.push(...dashes());
        data.push(...line('Alles funktioniert!'));
        data.push(...CMD.FEED_3);
        data.push(...CMD.PARTIAL_CUT);
        await sendRaw(new Uint8Array(data));
        console.log('🖨️ Test page printed.');
    }

    // ---- Public API ----
    return {
        connect,
        autoReconnect,
        disconnect,
        printReceipt,
        printTest,
        get isConnected() { return isConnected; },
        get printerName() { return device ? device.name : getSavedPrinterName(); },
        get hasSavedPrinter() { return !!getSavedPrinterId(); },
    };
})();

// Make globally available
window.BluetoothPrinter = BluetoothPrinter;
