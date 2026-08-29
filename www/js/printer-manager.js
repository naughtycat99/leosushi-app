/**
 * PrinterManager.js
 * Unified manager for Bluetooth and Network printers.
 * Handles auto-discovery, persistent connections, queue serialization, and deduplication.
 */
const PrinterManager = (() => {
    let currentPrinter = null;
    let isScanning = false;
    let scanTimeout = null;

    const STORAGE_KEY = 'leo_preferred_printer';
    
    // In-memory print queue and debouncing locks
    let printQueue = Promise.resolve();
    const activeJobs = new Set();
    const recentPrints = new Map(); // orderId -> timestamp

    /**
     * Initialize the manager
     */
    async function init() {
        console.log('🖨️ PrinterManager initializing...');
        const saved = getSavedPrinter();
        if (saved) {
            console.log('🖨️ Found saved printer, attempting auto-connect...');
            autoConnect(saved);
        } else {
            // Auto-discovery if no printer is saved
            console.log('🖨️ No saved printer, starting auto-discovery...');
            startSmartDiscovery();
        }
    }

    /**
     * Get saved printer info from localStorage
     */
    function getSavedPrinter() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Save printer info
     */
    function savePrinter(printer) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(printer));
    }

    /**
     * Auto-connect to a specific printer
     */
    async function autoConnect(printer) {
        try {
            if (printer.type === 'bluetooth') {
                if (typeof BluetoothPrinter !== 'undefined') {
                    await BluetoothPrinter.autoReconnect();
                }
            } else if (printer.type === 'network') {
                if (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge()) {
                    await NativeLanPrinter.autoConnect();
                }
            }
        } catch (err) {
            console.warn('🖨️ Auto-connect failed:', err);
            // If auto-connect fails, maybe try scanning again
            startSmartDiscovery();
        }
    }

    /**
     * Start a background scan for any available printers
     */
    function startSmartDiscovery() {
        if (isScanning) return;
        isScanning = true;

        console.log('🖨️ Starting Smart Discovery (Bluetooth + LAN)...');

        // Parallel scan
        scanBluetoothSilent();
        scanNetworkSilent();

        // Stop scanning after 30 seconds to save battery
        if (scanTimeout) clearTimeout(scanTimeout);
        scanTimeout = setTimeout(() => {
            isScanning = false;
            console.log('🖨️ Smart Discovery timed out.');
        }, 30000);
    }

    async function scanBluetoothSilent() {
        console.log('🖨️ Scanning for Bluetooth printers...');
    }

    async function scanNetworkSilent() {
        if (typeof NativeLanPrinter === 'undefined') return;

        try {
            const ips = await NativeLanPrinter.discoverPrinters();
            console.log('🖨️ LAN Discovery result:', ips);
            // Trigger UI event to show found printers (even if empty)
            window.dispatchEvent(new CustomEvent('printersFound', {
                detail: { type: 'network', devices: ips || [] }
            }));
        } catch (err) {
            console.warn('🖨️ LAN discovery error:', err);
            // Dispatch empty list so UI can show "None found" instead of "Scanning..."
            window.dispatchEvent(new CustomEvent('printersFound', {
                detail: { type: 'network', devices: [], error: err.message }
            }));
        }
    }

    /**
     * Internal printer execution function
     */
    async function executePrintJob(orderData, deliveryAddress, orderId, estimatedTimeText) {
        // Direct Sunmi V3 SDK Integration
        if (typeof SunmiNativePrinter !== 'undefined' && SunmiNativePrinter.hasPlugin()) {
            try {
                const status = await SunmiNativePrinter.getStatus();
                if (status.hasService) {
                    console.log('🖨️ [Sunmi Native] Printing directly from PrinterManager...');
                    const bytes = ReceiptGenerator.generateReceiptBytes(orderData, deliveryAddress, orderId, estimatedTimeText);
                    await SunmiNativePrinter.printRaw(bytes);
                    console.log('🖨️ [Sunmi Native] Print successful.');
                    return { success: true, method: 'sunmi_native' };
                }
            } catch (err) {
                console.error('🖨️ Sunmi direct print error:', err);
                // Continue to normal flow if it fails
            }
        }

        const saved = getSavedPrinter();
        const type = saved ? saved.type : 'network_fallback';

        if (type === 'bluetooth' && typeof BluetoothPrinter !== 'undefined' && BluetoothPrinter.isConnected) {
            return await BluetoothPrinter.printReceipt(orderData, deliveryAddress, orderId, estimatedTimeText);
        } else if (typeof NetworkPrinter !== 'undefined') {
            const hasBridge = (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge());

            // Check if we are in the APK and no printer is configured
            if (hasBridge) {
                const current = getSavedPrinter();
                if (!current || current.type === 'network_fallback') {
                    throw new Error('Bạn chưa cài đặt máy in. Vui lòng vào Cài đặt máy in (Druckereinstellungen) để kết nối (IP: 192.168.x.x) hoặc Pair Bluetooth.');
                }
            }

            // If we have a bridge, we expect direct print. If it fails, we throw to the caller (admin.html)
            // so it can show a native alert instead of falling back to window.print()
            try {
                return await NetworkPrinter.printReceipt(orderData, deliveryAddress, orderId, estimatedTimeText);
            } catch (err) {
                if (hasBridge) throw err;
                throw err;
            }
        } else {
            throw new Error('Máy in không sẵn sàng. Vui lòng kiểm tra lại cài đặt.');
        }
    }

    /**
     * Unified print function with Queue Serialization & Deduplication
     */
    function print(orderData, deliveryAddress, orderId, estimatedTimeText) {
        const idKey = (orderId || 'UNKNOWN').toString();
        const now = Date.now();

        // 1. Strict Deduplication Check:
        if (activeJobs.has(idKey)) {
            console.warn(`🖨️ [PrinterManager] Order ${idKey} is already being printed. Ignoring duplicate call.`);
            return Promise.resolve({ skipped: true, reason: 'in_progress' });
        }

        const lastTime = recentPrints.get(idKey);
        if (lastTime && (now - lastTime < 8000)) {
            console.warn(`🖨️ [PrinterManager] Order ${idKey} was printed ${Math.round((now - lastTime) / 1000)}s ago. Ignoring duplicate call.`);
            return Promise.resolve({ skipped: true, reason: 'debounced' });
        }

        activeJobs.add(idKey);
        recentPrints.set(idKey, now);

        // Clean up old recent prints map
        if (recentPrints.size > 200) {
            const cutoff = now - 60000;
            for (const [k, v] of recentPrints.entries()) {
                if (v < cutoff) recentPrints.delete(k);
            }
        }

        // 2. Sequential Queue Execution
        const jobPromise = printQueue.then(async () => {
            try {
                const res = await executePrintJob(orderData, deliveryAddress, orderId, estimatedTimeText);
                // Pause 300ms between physical ESC/POS print jobs to let printer buffer drain
                await new Promise(r => setTimeout(r, 300));
                return res;
            } finally {
                activeJobs.delete(idKey);
            }
        }).catch(err => {
            activeJobs.delete(idKey);
            throw err;
        });

        // Keep queue moving even if this job fails
        printQueue = jobPromise.catch(() => {});

        return jobPromise;
    }

    return {
        init,
        print,
        startSmartDiscovery,
        getSavedPrinter,
        savePrinter,
        isOrderPrinting: (id) => activeJobs.has((id || '').toString()),
        wasOrderPrintedRecently: (id) => {
            const t = recentPrints.get((id || '').toString());
            return !!(t && (Date.now() - t < 15000));
        }
    };
})();

window.PrinterManager = PrinterManager;
