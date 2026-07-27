




















        function injectMockData() {
            console.log("🧪 Đang chèn dữ liệu mẫu...");
            const mockOrders = [
                { id: "ORD-001", first_name: "Nguyễn", last_name: "Văn A", phone: "0901234567", status: "pending", total: 150000, items: [{ name: "Sushi Set A", quantity: 1 }], created_at: new Date().toISOString() },
                { id: "ORD-002", first_name: "Trần", last_name: "Thị B", phone: "0902223334", status: "confirmed", total: 250000, items: [{ name: "Sashimi Mix", quantity: 2 }], created_at: new Date().toISOString() },
                { id: "ORD-003", first_name: "Lê", last_name: "Văn C", phone: "0905556667", status: "cancelled", total: 120000, items: [{ name: "Miso Soup", quantity: 3 }], created_at: new Date(Date.now() - 86400000).toISOString() },
                { id: "ORD-004", first_name: "Phạm", last_name: "Thị D", phone: "0908889990", status: "pending", total: 300000, items: [{ name: "Dragon Roll", quantity: 1 }], created_at: new Date().toISOString() }
            ];

            // Ghi đè hàm list
            if (!window.api) window.api = {};
            if (!window.api.orders) window.api.orders = {};

            window.api.orders.isMock = true; // Cờ nhận diện chế độ mẫu
            window.api.orders.list = async function (status = 'all') {
                if (status === 'all') return mockOrders;
                return mockOrders.filter(o => o.status === status);
            };

            // Ép buộc render dữ liệu ngay lập tức
            window.__loadOrdersRunning = false; // Reset cờ trạng thái để cho phép chạy lại
            if (typeof loadOrders === 'function') {
                loadOrders(false, false);
            }
            alert("✅ Đã chèn dữ liệu mẫu! Đơn hàng sẽ hiện ra ngay lập tức.");
        }
    






























        (function () {
            console.log('🔔 Initializing Capacitor Push Notifications (inline)...');
            let checkAttempts = 0;
            const checkInterval = setInterval(() => {
                checkAttempts++;
                if (checkAttempts > 50) {
                    clearInterval(checkInterval);
                    console.log('Not running in native app, skipping push notifications');
                    return;
                }
                if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
                    clearInterval(checkInterval);
                    console.log('📱 Capacitor detected, initializing Push...');
                    initPushNotifications();
                }
            }, 200);

            async function initPushNotifications() {
                const { PushNotifications } = window.Capacitor.Plugins || {};
                if (!PushNotifications) {
                    console.error('PushNotifications plugin not available');
                    return;
                }
                try {
                    const permResult = await PushNotifications.requestPermissions();
                    console.log('Push permission:', permResult.receive);
                    if (permResult.receive === 'granted') {
                        await PushNotifications.register();
                        console.log('✅ Push registration initiated');
                    } else {
                        console.warn('Push permission denied');
                    }
                } catch (err) {
                    console.error('Error initializing push:', err);
                }

                PushNotifications.addListener('registration', async (token) => {
                    console.log('✅ FCM Token received:', token.value);
                    const adminToken = localStorage.getItem('leo_admin_token') || '';
                    try {
                        const response = await fetch('api/index.php?route=v1/data/push-register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + adminToken
                            },
                            body: JSON.stringify({
                                token: token.value,
                                device: window.Capacitor.getPlatform(),
                                type: 'admin'
                            })
                        });
                        const data = await response.json();
                        console.log('✅ Token saved to server:', data);
                    } catch (err) {
                        console.error('❌ Error saving token:', err);
                    }
                });

                PushNotifications.addListener('registrationError', (error) => {
                    console.error('Registration error:', error.error);
                });

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('🔔 Push received (foreground):', notification);
                    if (typeof playNotificationSound === 'function') playNotificationSound();
                    if (typeof loadOrders === 'function') loadOrders(true, true);
                });

                PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
                    console.log('🔔 Push tapped:', action);
                    const data = action.notification?.data || {};
                    const orderId = data.order_id;
                    if (orderId && typeof window.viewNewOrder === 'function') {
                        window.viewNewOrder(orderId);
                    }
                });
            }
        })();
    




        // Initialize EmailJS
        if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        }

        // Switch between tabs
        // Switch between tabs (Global function)
        window.switchTab = function (tab) {
            console.log('🔄 [DEBUG] switchTab called for:', tab);
            // alert('DEBUG: Chuyển sang tab ' + tab); // Thêm alert để kiểm tra trực tiếp

            try {
                // Remove active classes
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

                // Update sidebar buttons by data-tab
                const sidebarBtn = document.querySelector(`.admin-tab[data-tab="${tab}"]`);
                if (sidebarBtn) {
                    sidebarBtn.classList.add('active');
                } else {
                    // Fallback search
                    const fallbackBtn = Array.from(document.querySelectorAll('.admin-tab')).find(btn =>
                        btn.getAttribute('data-tab') === tab ||
                        btn.textContent.toLowerCase().includes(tab.toLowerCase())
                    );
                    if (fallbackBtn) fallbackBtn.classList.add('active');
                }

                // Update bottom nav
                const bottomNavBtn = Array.from(document.querySelectorAll('.nav-item')).find(btn => btn.getAttribute('onclick')?.includes(`'${tab}'`));
                if (bottomNavBtn) bottomNavBtn.classList.add('active');

                // Show content
                const targetContent = document.getElementById(tab + 'Content');
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('✅ [DEBUG] Content target activated:', tab + 'Content');
                } else {
                    console.error('❌ [DEBUG] Content target NOT FOUND:', tab + 'Content');
                }

                // Special logic for stats
                if (tab === 'stats') {
                    // Let AdminStats handle role check & unlock gate internally.
                    // If user is Staff, AdminStats will show a password entry screen.
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                        AdminStats.loadStats();
                    }
                }

                // Re-init timers just in case
                if (typeof initOrderTimers === 'function') initOrderTimers();

                // Load specific data per tab
                if (tab === 'orders') loadOrders();
                if (tab === 'reservations') loadReservations();
                if (tab === 'customers') loadCustomers();
                if (tab === 'menu') { loadMenuItems(); loadMenuCategories(); }
                if (tab === 'promotions') loadCustomersWithPoints();
                if (tab === 'discount-codes') loadDiscountCodes();
                if (tab === 'holiday-schedule') loadHolidaySchedule();
                if (tab === 'printer') updatePrinterStatusUI();
                if (tab === 'stats') { /* Already handled above */ }

            } catch (err) {
                console.error('❌ [DEBUG] switchTab error:', err);
                alert('Error switching tab: ' + err.message);
            }
        };

        // Re-export for compatibility
        const switchTab = window.switchTab;

        // ========== PRINTER MANAGEMENT UI ==========
        function scanBluetoothUI() {
            const list = document.getElementById('bluetoothList');
            list.innerHTML = '<p style="color: #fbbf24; text-align: center;">Đang quét...</p>';
            if (typeof BluetoothPrinter !== 'undefined') {
                BluetoothPrinter.connect().then(device => {
                    updatePrinterStatusUI();
                    showMenuNotification('✅ Đã kết nối Bluetooth: ' + (device.name || 'Printer'), 'success');
                }).catch(err => {
                    list.innerHTML = '<p style="color: #ef4444; text-align: center;">Lỗi: ' + err.message + '</p>';
                });
            }
        }

        function scanNetworkUI() {
            const list = document.getElementById('networkList');
            list.innerHTML = '<p style="color: #fbbf24; text-align: center;">Đang quét mạng LAN...</p>';
            if (typeof PrinterManager !== 'undefined') {
                PrinterManager.startSmartDiscovery();
            }
        }

        window.addEventListener('printersFound', (e) => {
            const { type, devices, error } = e.detail;
            if (type === 'network') {
                const menuList = document.getElementById('networkScanResults');
                if (!menuList) return;

                if (error) {
                    menuList.innerHTML = `<p style="color: #ef4444; text-align: center; font-size: 13px;">❌ Lỗi: ${error}</p>`;
                    return;
                }

                const html = devices.length === 0
                    ? '<p style="color: rgba(255,255,255,0.4); text-align: center; font-size: 13px;">Không tìm thấy máy in nội bộ.</p>'
                    : devices.map(ip => `
                        <div class="printer-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 4px;">
                            <span style="color: #fff; font-size: 13px;">IP: ${ip}</span>
                            <button onclick="connectNetworkPrinter('${ip}')" style="padding: 6px 12px; font-size: 11px; background: #10b981; border: none; border-radius: 4px; color: #fff; cursor: pointer; font-weight: 600;">Kết nối</button>
                        </div>
                    `).join('');

                menuList.innerHTML = html;

                // Show Scan Again button in UI if it's there
                const btnScan = document.getElementById('btnScanNet');
                if (btnScan) {
                    btnScan.innerHTML = '🔍 Quét lại';
                    btnScan.disabled = false;
                    btnScan.style.opacity = '1';
                }
            }
        });

        async function connectNetworkPrinter(ip) {
            try {
                showMenuNotification('⏳ Đang kết nối ' + ip + '...', 'info');
                if (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge()) {
                    await NativeLanPrinter.connect(ip);
                }

                if (typeof PrinterManager !== 'undefined') {
                    PrinterManager.savePrinter({ type: 'network', ip: ip });
                }
                updatePrinterStatusUI();

                if (NativeLanPrinter.hasNativeBridge()) {
                    showMenuNotification('✅ Đã kết nối máy in LAN: ' + ip, 'success');
                } else {
                    showMenuNotification('ℹ️ Đã lưu IP. Sẽ sử dụng in hệ thống (Browser).', 'success');
                }

                if (typeof showPrinterMenu === 'function') {
                    const menu = document.getElementById('printerMenu');
                    if (menu) menu.remove();
                }
            } catch (err) {
                showMenuNotification('❌ Lỗi kết nối: ' + err.message, 'error');
            }
        }

        function scanNetworkUIInMenu() {
            const results = document.getElementById('networkScanResults');
            const btnScan = document.getElementById('btnScanNet');
            if (results) results.innerHTML = '<p style="color: #fbbf24; text-align: center; font-size: 13px; padding: 10px;">⏳ Đang tìm máy in (30 giây)...</p>';
            if (btnScan) {
                btnScan.innerHTML = '⏳ Đang quét...';
                btnScan.disabled = true;
                btnScan.style.opacity = '0.5';
            }
            if (typeof PrinterManager !== 'undefined') PrinterManager.startSmartDiscovery();
        }

        function updatePrinterStatusUI() {
            const statusText = document.getElementById('printerStatusText');
            if (!statusText) return;

            const saved = (typeof PrinterManager !== 'undefined') ? PrinterManager.getSavedPrinter() : null;
            const hasBridge = (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge());

            if (!saved) {
                statusText.innerText = 'Chưa thiết lập';
                statusText.style.color = 'rgba(255,255,255,0.4)';
            } else {
                let typeLabel = (saved.type === 'bluetooth' ? 'Bluetooth' : 'LAN');
                let statusInfo = (saved.ip || saved.name || 'Đang chờ...');

                if (saved.type === 'network' && hasBridge) {
                    const status = NativeLanPrinter.getStatus();
                    if (status && status.connected) {
                        statusText.innerText = `LAN: ${status.ip} (Sẵn sàng)`;
                        statusText.style.color = '#10b981';
                    } else {
                        statusText.innerText = `LAN: ${saved.ip} (Mất kết nối)`;
                        statusText.style.color = '#ef4444';
                    }
                } else {
                    statusText.innerText = typeLabel + ': ' + statusInfo;
                    statusText.style.color = '#10b981';
                }
            }
        }

        function showPrinterMenu() {
            // Remove existing menu if open
            const existing = document.getElementById('printerMenu');
            if (existing) {
                existing.remove();
                return;
            }

            const connected = typeof BluetoothPrinter !== 'undefined' && BluetoothPrinter.isConnected;
            const currentType = localStorage.getItem('printer_type') || 'bluetooth';

            const menu = document.createElement('div');
            menu.id = 'printerMenu';
            menu.style.cssText = 'position:fixed;top:80px;right:20px;background:#1a1a1e;border:1px solid rgba(229,207,142,0.3);border-radius:12px;padding:16px;z-index:10001;min-width:280px;box-shadow:0 8px 32px rgba(0,0,0,0.5);max-height:80vh;overflow-y:auto;color:#fff;';

            menu.innerHTML = `
                    <div style="font-size:14px;font-weight:600;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
                        <span>🖨️ Druckereinstellungen</span>
                        <div id="bridgeStatusIndicator">
                            ${NativeLanPrinter.hasNativeBridge() ?
                    '<span style="font-size:10px; padding:2px 6px; background:#10b98120; color:#10b981; border:1px solid #10b98140; border-radius:4px;">Native Ready ✅</span>' :
                    '<span style="font-size:10px; padding:2px 6px; background:#ef444420; color:#ef4444; border:1px solid #ef444440; border-radius:4px;">Browser Mode 🌐</span>'
                }
                        </div>
                        <button onclick="document.getElementById('printerMenu').remove()" style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:18px;cursor:pointer;">&times;</button>
                    </div>

                    ${!NativeLanPrinter.hasNativeBridge() ?
                    '<div style="background:#ef444415; border:1px solid #ef444430; padding:8px; border-radius:8px; font-size:11px; color:#ef4444; margin-bottom:12px; line-height:1.4;">' +
                    '⚠️ <b>CẢNH BÁO:</b> Bạn đang dùng Web. In Bluetooth/LAN chỉ hoạt động trên <b>App LEO SUSHI</b>. Hãy mở App trên màn hình chính!' +
                    '</div>' : ''
                }

                    <div style="margin-bottom:12px;">
                        <div style="color:rgba(255,255,255,0.6);font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Druckmethode:</div>
                        <div style="display:flex;gap:6px;">
                            <button onclick="setPrinterType('bluetooth')" id="btnTypeBT" style="flex:1;padding:8px 6px;border-radius:8px;border:1px solid ${currentType === 'bluetooth' ? 'rgba(229,207,142,0.6)' : 'rgba(255,255,255,0.15)'};background:${currentType === 'bluetooth' ? 'rgba(229,207,142,0.15)' : 'transparent'};color:${currentType === 'bluetooth' ? '#e5cf8e' : 'rgba(255,255,255,0.5)'};cursor:pointer;font-size:12px;font-weight:600;transition:all 0.2s;">
                                📶 Bluetooth
                            </button>
                            <button onclick="setPrinterType('network')" id="btnTypeNet" style="flex:1;padding:8px 6px;border-radius:8px;border:1px solid ${currentType === 'network' ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.15)'};background:${currentType === 'network' ? 'rgba(16,185,129,0.15)' : 'transparent'};color:${currentType === 'network' ? '#10b981' : 'rgba(255,255,255,0.5)'};cursor:pointer;font-size:12px;font-weight:600;transition:all 0.2s;">
                                🌐 WLAN/Netzwerk
                            </button>
                        </div>
                    </div>

                    <div style="border-top:1px solid rgba(255,255,255,0.1);margin:8px 0;"></div>

                    ${currentType === 'bluetooth' ? `
                    <div id="printerStatus" style="color:${connected ? '#10b981' : 'rgba(255,255,255,0.5)'};font-size:13px;margin-bottom:12px;">
                        ${connected ? '✅ Verbunden: ' + (BluetoothPrinter.printerName || 'Drucker') : '⚪ Bluetooth không kết nối'}
                    </div>
                    ${!connected ? `
                    <button onclick="pairPrinter()" style="width:100%;padding:10px;background:linear-gradient(180deg,#C2A355,#a8893e);color:#1a1a1a;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:8px;font-size:14px;">
                        🔍 Xuất hiện & Kết nối
                    </button>
                    ` : `
                    <button onclick="testPrint()" style="width:100%;padding:10px;background:rgba(16,185,129,0.2);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:8px;cursor:pointer;margin-bottom:8px;font-size:13px;">
                        📄 In thử
                    </button>
                    <button onclick="disconnectPrinter()" style="width:100%;padding:10px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);border-radius:8px;cursor:pointer;font-size:13px;">
                        ❌ Ngắt kết nối
                    </button>
                    `}
                    ` : `
                    <div style="color:#10b981;font-size:13px;margin-bottom:12px;" id="networkStatusText">
                        🌐 Máy in mạng (LAN/WiFi)
                    </div>
                    <div id="networkScanResults" style="margin-bottom:10px; display:flex; flex-direction:column; gap:8px;">
                        <!-- Scan results here -->
                    </div>
                    <div style="margin-bottom:12px; padding:10px; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1);">
                        <div style="color:rgba(255,255,255,0.6);font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">WLAN IP thủ công:</div>
                        <div style="display:flex;gap:6px;">
                            <input type="text" id="manualPrinterIp" placeholder="VD: 192.168.1.100" style="flex:1; padding:8px; border-radius:6px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:#fff; font-size:13px;">
                            <button onclick="connectManualIpInMenu()" style="background:#10b981; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;">Kết nối</button>
                        </div>
                    </div>
                    <button onclick="scanNetworkUIInMenu()" id="btnScanNet" style="width:100%;padding:10px;background:rgba(16,185,129,0.2);color:#10b981;border:1px solid rgba(16,185,129,0.3);border-radius:8px;cursor:pointer;margin-bottom:8px;font-size:13px;">
                        🔍 Quét tự động
                    </button>
                    <button onclick="testNetworkPrint()" style="width:100%;padding:10px;background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2);border-radius:8px;cursor:pointer;margin-bottom:8px;font-size:13px;">
                        📄 In thử (Hệ thống)
                    </button>
                    `}
                    
                    <div style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
                        <button onclick="pingNativeBridge()" style="width:100%; padding:8px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:rgba(255,255,255,0.7); font-size:11px; cursor:pointer;">
                            🔍 Kiểm tra hệ thống Native (Ping)
                        </button>
                    </div>
                `;
            document.body.appendChild(menu);
        }

        function setPrinterType(type) {
            localStorage.setItem('printer_type', type);
            if (typeof PrinterManager !== 'undefined') {
                const saved = PrinterManager.getSavedPrinter();
                if (saved) {
                    PrinterManager.savePrinter({ ...saved, type: type });
                } else {
                    PrinterManager.savePrinter({ type: type });
                }
            }
            updatePrinterStatusUI();
            const menu = document.getElementById('printerMenu');
            if (menu) menu.remove();
            showPrinterMenu();
        }

        async function pingNativeBridge() {
            const status = (typeof NativeLanPrinter !== 'undefined') ? NativeLanPrinter.getStatus() : { hasNativeBridge: () => false };
            const hasBridge = (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge());

            if (!hasBridge) {
                alert('Hệ thống: BROWSER MODE 🌐\n\nBạn đang mở bằng trình duyệt web. Tính năng in trực tiếp chỉ hoạt động khi mở bằng App (APK).');
            } else {
                let savedIp = NativeLanPrinter.getSavedIp();
                if (savedIp === 'undefined' || !savedIp) savedIp = null;

                const localIp = status.localIp || 'Không rõ';

                let message = `Hệ thống: NATIVE READY ✅\n`;
                message += `- IP Điện thoại: ${localIp}\n`;
                message += `- IP Máy in đã lưu: ${savedIp || 'CHƯA CÓ'}\n\n`;

                if (savedIp && savedIp !== 'undefined') {
                    showMenuNotification('⏳ Đang Ping máy in: ' + savedIp + '...', 'info');
                    try {
                        const result = await NativeLanPrinter.testReachability(savedIp);
                        if (result.reachable) {
                            message += `Kết quả: KẾT NỐI OK! ✅\nMáy in đang hoạt động và có thể in ngay.`;
                        } else {
                            message += `Kết quả: KHÔNG KẾT NỐI ĐƯỢC ❌\nLỗi: ${result.error || 'Máy in không phản hồi'}\n\nLưu ý: Hãy chắc chắn Điện thoại (${localIp.substring(0, localIp.lastIndexOf('.'))}.x) và Máy in (${savedIp.substring(0, savedIp.lastIndexOf('.'))}.x) đang dùng chung một mạng WiFi.`;
                        }
                    } catch (e) {
                        message += `Kết quả: LỖI HỆ THỐNG ❌\n${e.message}`;
                    }
                } else {
                    message += `Bạn chưa cài đặt IP máy in. Hãy nhập IP ở phần "WLAN IP thủ công" hoặc quét tự động.`;
                }

                alert(message);
            }
        }

        async function pairPrinter() {
            if (typeof BluetoothPrinter !== 'undefined') {
                try {
                    const device = await BluetoothPrinter.connect();
                    updatePrinterStatusUI();
                    const menu = document.getElementById('printerMenu');
                    if (menu) menu.remove();
                    showPrinterMenu();
                    showMenuNotification('✅ Đã kết nối: ' + (device.name || 'Printer'), 'success');
                } catch (e) {
                    showMenuNotification('❌ Lỗi: ' + e.message, 'error');
                }
            }
        }

        async function testPrint() {
            if (typeof BluetoothPrinter !== 'undefined') {
                await BluetoothPrinter.printTest();
            }
        }

        async function testNetworkPrint() {
            if (typeof NetworkPrinter !== 'undefined') {
                await NetworkPrinter.printTest();
            }
        }

        function disconnectPrinter() {
            if (typeof BluetoothPrinter !== 'undefined') {
                BluetoothPrinter.disconnect();
            }
            updatePrinterStatusUI();
            const menu = document.getElementById('printerMenu');
            if (menu) menu.remove();
            showPrinterMenu();
        }


        async function connectManualIpInMenu() {
            const input = document.getElementById('manualPrinterIp');
            const ip = input ? input.value.trim() : '';
            if (!ip) {
                showMenuNotification('Vui lòng nhập địa chỉ IP', 'error');
                return;
            }
            await connectNetworkPrinter(ip);
        }

        // Removed redundant DOMContentLoaded - consolidated at end of file
        function initPrinterAndPickers() {
            try {
                if (typeof PrinterManager !== 'undefined') PrinterManager.init();

                // Set default date to TODAY for the date pickers
                const todayStr = getLocalDateStr(new Date());
                const dp = document.getElementById('datePicker');
                const rdp = document.getElementById('reservationDatePicker');
                if (dp) dp.value = todayStr;
                if (rdp) rdp.value = todayStr;
            } catch (error) {
                console.error('initPrinterAndPickers error:', error);
            }
        }

        // ========== DISCOUNT CODES MANAGEMENT ==========
        let allDiscountCodes = [];

        async function loadDiscountCodes() {
            try {
                const response = await fetch('api/index.php?route=v1/data/discount-codes&action=list');
                const data = await response.json();

                if (data.success) {
                    allDiscountCodes = data.data;
                    renderDiscountCodes(allDiscountCodes);
                } else {
                    alert('Fehler beim Laden der Rabattcodes: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading discount codes:', error);
                alert('Fehler beim Laden der Rabattcodes: ' + error.message);
            }
        }

        function renderDiscountCodes(codes) {
            const container = document.getElementById('discountCodesList');
            if (!container) return;

            if (codes.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>Keine Rabattcodes vorhanden</p></div>';
                return;
            }

            container.innerHTML = codes.map(code => {
                const discountText = code.discount_type === 'percentage'
                    ? `${code.discount_value}%`
                    : `${code.discount_value}€`;
                const statusColor = code.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                const statusText = code.status === 'active' ? '✅ Aktiv' : code.status === 'inactive' ? '⏸️ Inaktiv' : '❌ Abgelaufen';

                return `
                    <div class="order-card" style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <h3 style="color: var(--gold); margin-bottom: 8px;">${code.code}</h3>
                                <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 4px 0;">
                                    <strong>Rabatt:</strong> ${discountText}<br>
                                    ${code.min_order > 0 ? `<strong>Mindestbestellwert:</strong> ${code.min_order}€<br>` : ''}
                                    <strong>Startdatum:</strong> ${code.start_date}<br>
                                    <strong>Enddatum:</strong> ${code.end_date}<br>
                                    <strong>Status:</strong> <span style="background: ${statusColor}; padding: 2px 8px; border-radius: 4px;">${statusText}</span><br>
                                    ${code.usage_limit ? `<strong>Nutzungslimit:</strong> ${code.used_count || 0}/${code.usage_limit}<br>` : ''}
                                    ${code.per_user_limit ? `<strong>Limit pro Person:</strong> ${code.per_user_limit} mal<br>` : ''}
                                    ${code.first_order_only == 1 ? `<strong>⚠️ Nur für erste Bestellung</strong><br>` : ''}
                                </p>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn-action btn-view" onclick="editDiscountCode('${code.promotion_id}')" title="Bearbeiten">✏️</button>
                                <button class="btn-action" onclick="deleteDiscountCode('${code.promotion_id}')" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function filterDiscountCodes() {
            const search = document.getElementById('discountCodeSearch')?.value.toLowerCase() || '';
            const status = document.getElementById('discountCodeStatusFilter')?.value || '';

            let filtered = allDiscountCodes;

            if (status) {
                filtered = filtered.filter(code => code.status === status);
            }

            if (search) {
                filtered = filtered.filter(code =>
                    code.code.toLowerCase().includes(search) ||
                    (code.status && code.status.toLowerCase().includes(search))
                );
            }

            renderDiscountCodes(filtered);
        }

        function showAddDiscountCodeModal() {
            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal';
            modal.id = 'discountCodeModal';
            modal.onclick = function (e) {
                if (e.target.id === 'discountCodeModal') closeDiscountCodeModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                    <h3>➕ Neuer Discount Code</h3>
                    <form id="discountCodeForm" onsubmit="saveDiscountCode(event)">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Rabattcode (LEO-XXXXXX) *</label>
                            <input type="text" id="discountCodeCode" class="filter-input" placeholder="LEO-XXXXXX" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Rabatttyp *</label>
                            <select id="discountCodeType" class="filter-input" onchange="updateDiscountCodeFields()" required style="width: 100%;">
                                <option value="percentage">Prozent (%)</option>
                                <option value="fixed">Fester Betrag (€)</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;" id="discountValueLabel">Rabattwert (%) *</label>
                            <input type="number" id="discountCodeValue" class="filter-input" step="0.01" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Mindestbestellwert (€)</label>
                            <input type="number" id="discountCodeMinOrder" class="filter-input" step="0.01" min="0" value="0" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Maximaler Rabatt (€) - nur für %</label>
                            <input type="number" id="discountCodeMaxDiscount" class="filter-input" step="0.01" min="0" style="width: 100%;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Startdatum *</label>
                                <input type="date" id="discountCodeStartDate" class="filter-input" required style="width: 100%;">
                            </div>
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Enddatum *</label>
                                <input type="date" id="discountCodeEndDate" class="filter-input" required style="width: 100%;">
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Nutzungslimit (leer = unbegrenzt)</label>
                            <input type="number" id="discountCodeUsageLimit" class="filter-input" min="1" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Limit pro Person (leer = unbegrenzt)</label>
                            <input type="number" id="discountCodePerUserLimit" class="filter-input" min="1" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.9);">
                                <input type="checkbox" id="discountCodeFirstOrderOnly" style="width: auto;">
                                <span>Nur für die erste Bestellung jedes Kunden</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Status *</label>
                            <select id="discountCodeStatus" class="filter-input" required style="width: 100%;">
                                <option value="active">Aktiv</option>
                                <option value="inactive">Inaktiv</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button type="submit" class="btn-action" style="flex: 1;">💾 Speichern</button>
                            <button type="button" class="btn-action" onclick="closeDiscountCodeModal()" style="background: rgba(239,68,68,0.1);">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Set default dates
            document.getElementById('discountCodeStartDate').value = new Date().toISOString().split('T')[0];
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);
            document.getElementById('discountCodeEndDate').value = endDate.toISOString().split('T')[0];
        }

        function updateDiscountCodeFields() {
            const type = document.getElementById('discountCodeType').value;
            const label = document.getElementById('discountValueLabel');
            if (type === 'percentage') {
                label.textContent = 'Rabattwert (%) *';
                document.getElementById('discountCodeValue').max = 100;
            } else {
                label.textContent = 'Rabattwert (€) *';
                document.getElementById('discountCodeValue').max = null;
            }
        }

        function editDiscountCode(codeId) {
            const code = allDiscountCodes.find(c => c.promotion_id === codeId);
            if (!code) return;

            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal';
            modal.id = 'discountCodeModal';
            modal.onclick = function (e) {
                if (e.target.id === 'discountCodeModal') closeDiscountCodeModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                    <h3>✏️ Discount Code bearbeiten</h3>
                    <form id="discountCodeForm" onsubmit="updateDiscountCodeForm(event, '${codeId}')">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Rabattcode</label>
                            <input type="text" value="${code.code}" disabled class="filter-input" style="width: 100%; opacity: 0.5;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Rabatttyp *</label>
                            <select id="discountCodeType" class="filter-input" onchange="updateDiscountCodeFields()" required style="width: 100%;">
                                <option value="percentage" ${code.discount_type === 'percentage' ? 'selected' : ''}>Prozent (%)</option>
                                <option value="fixed" ${code.discount_type === 'fixed' ? 'selected' : ''}>Fester Betrag (€)</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;" id="discountValueLabel">Rabattwert *</label>
                            <input type="number" id="discountCodeValue" value="${code.discount_value}" step="0.01" class="filter-input" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Mindestbestellwert (€)</label>
                            <input type="number" id="discountCodeMinOrder" value="${code.min_order || 0}" step="0.01" min="0" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Maximaler Rabatt (€)</label>
                            <input type="number" id="discountCodeMaxDiscount" value="${code.max_discount || ''}" step="0.01" min="0" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Startdatum *</label>
                                <input type="date" id="discountCodeStartDate" value="${code.start_date}" class="filter-input" required style="width: 100%;">
                            </div>
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Enddatum *</label>
                                <input type="date" id="discountCodeEndDate" value="${code.end_date}" class="filter-input" required style="width: 100%;">
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Nutzungslimit</label>
                            <input type="number" id="discountCodeUsageLimit" value="${code.usage_limit || ''}" min="1" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Limit pro Person</label>
                            <input type="number" id="discountCodePerUserLimit" value="${code.per_user_limit || ''}" min="1" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.9);">
                                <input type="checkbox" id="discountCodeFirstOrderOnly" ${code.first_order_only == 1 ? 'checked' : ''} style="width: auto;">
                                <span>Nur für die erste Bestellung jedes Kunden</span>
                            </label>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Status *</label>
                            <select id="discountCodeStatus" class="filter-input" required style="width: 100%;">
                                <option value="active" ${code.status === 'active' ? 'selected' : ''}>Aktiv</option>
                                <option value="inactive" ${code.status === 'inactive' ? 'selected' : ''}>Inaktiv</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button type="submit" class="btn-action" style="flex: 1;">💾 Aktualisieren</button>
                            <button type="button" class="btn-action" onclick="closeDiscountCodeModal()" style="background: rgba(239,68,68,0.1);">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            updateDiscountCodeFields();
        }

        function closeDiscountCodeModal() {
            const modal = document.getElementById('discountCodeModal');
            if (modal) modal.remove();
        }

        async function saveDiscountCode(event) {
            event.preventDefault();

            const codeData = {
                code: document.getElementById('discountCodeCode').value.trim(),
                discount_type: document.getElementById('discountCodeType').value,
                discount_value: parseFloat(document.getElementById('discountCodeValue').value),
                min_order: parseFloat(document.getElementById('discountCodeMinOrder').value) || 0,
                max_discount: document.getElementById('discountCodeMaxDiscount').value ? parseFloat(document.getElementById('discountCodeMaxDiscount').value) : null,
                start_date: document.getElementById('discountCodeStartDate').value,
                end_date: document.getElementById('discountCodeEndDate').value,
                usage_limit: document.getElementById('discountCodeUsageLimit').value ? parseInt(document.getElementById('discountCodeUsageLimit').value) : null,
                per_user_limit: document.getElementById('discountCodePerUserLimit').value ? parseInt(document.getElementById('discountCodePerUserLimit').value) : null,
                first_order_only: document.getElementById('discountCodeFirstOrderOnly').checked,
                status: document.getElementById('discountCodeStatus').value
            };

            try {
                const response = await fetch('api/index.php?route=v1/data/discount-codes&action=create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(codeData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Rabattcode erfolgreich erstellt!');
                    closeDiscountCodeModal();
                    loadDiscountCodes();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function updateDiscountCodeForm(event, codeId) {
            event.preventDefault();

            const codeData = {
                discount_type: document.getElementById('discountCodeType').value,
                discount_value: parseFloat(document.getElementById('discountCodeValue').value),
                min_order: parseFloat(document.getElementById('discountCodeMinOrder').value) || 0,
                max_discount: document.getElementById('discountCodeMaxDiscount').value ? parseFloat(document.getElementById('discountCodeMaxDiscount').value) : null,
                start_date: document.getElementById('discountCodeStartDate').value,
                end_date: document.getElementById('discountCodeEndDate').value,
                usage_limit: document.getElementById('discountCodeUsageLimit').value ? parseInt(document.getElementById('discountCodeUsageLimit').value) : null,
                per_user_limit: document.getElementById('discountCodePerUserLimit').value ? parseInt(document.getElementById('discountCodePerUserLimit').value) : null,
                first_order_only: document.getElementById('discountCodeFirstOrderOnly').checked,
                status: document.getElementById('discountCodeStatus').value
            };

            try {
                const response = await fetch(`api/index.php?route=v1/data/discount-codes&action=update&code_id=${codeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(codeData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Rabattcode erfolgreich aktualisiert!');
                    closeDiscountCodeModal();
                    loadDiscountCodes();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function deleteDiscountCode(codeId) {
            if (!confirm('Möchten Sie diesen Rabattcode wirklich löschen?')) return;

            try {
                const response = await fetch(`api/index.php?route=v1/data/discount-codes&action=delete&code_id=${codeId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Rabattcode erfolgreich gelöscht!');
                    loadDiscountCodes();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function loadDiscountCodesForPromotion() {
            try {
                const response = await fetch('api/index.php?route=v1/data/discount-codes&action=list&status=active');
                const data = await response.json();

                if (data.success) {
                    const select = document.getElementById('promoDiscountCodeSelect');
                    if (select) {
                        select.innerHTML = '<option value="">-- Rabattcode auswählen --</option>' +
                            data.data.map(code =>
                                `<option value="${code.code}" data-type="${code.discount_type}" data-value="${code.discount_value}" data-min="${code.min_order || 0}" data-end="${code.end_date}">${code.code} - ${code.discount_type === 'percentage' ? code.discount_value + '%' : code.discount_value + '€'}</option>`
                            ).join('');
                    }
                }
            } catch (error) {
                console.error('Error loading discount codes for promotion:', error);
            }
        }

        // ========== HOLIDAY SCHEDULE MANAGEMENT ==========
        let allHolidaySchedule = [];

        async function loadHolidaySchedule() {
            try {
                const response = await fetch('api/index.php?route=v1/data/holiday-schedule&action=list');

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response from holiday-schedule API:', text.substring(0, 500));
                    throw new Error('Server returned non-JSON response. This might be a server error. Please check the server logs.');
                }

                const data = await response.json();

                if (data.success) {
                    allHolidaySchedule = data.data;
                    renderHolidaySchedule(allHolidaySchedule);
                } else {
                    alert('Fehler beim Laden der Feiertags-Öffnungszeiten: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading holiday schedule:', error);
                // Show user-friendly error message
                const container = document.getElementById('holidayScheduleList');
                if (container) {
                    container.innerHTML = `
                        <div class="empty-state" style="background: rgba(239,68,68,.1); border: 2px solid rgba(239,68,68,.3);">
                            <div class="empty-state-icon">❌</div>
                            <h3 style="color: #ef4444; margin: 16px 0 8px; font-size: 18px;">Fehler beim Laden</h3>
                            <p style="color: rgba(255,255,255,.7); margin-bottom: 12px;">${error.message || 'Daten konnten nicht geladen werden'}</p>
                            <button class="btn-action btn-view" onclick="loadHolidaySchedule()" style="margin-top: 12px;">Erneut versuchen</button>
                        </div>
                    `;
                } else {
                    alert('Fehler beim Laden der Feiertags-Öffnungszeiten: ' + error.message);
                }
            }
        }

        function renderHolidaySchedule(holidays) {
            const container = document.getElementById('holidayScheduleList');
            if (!container) return;

            if (holidays.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>Keine Feiertags-Öffnungszeiten vorhanden</p></div>';
                return;
            }

            container.innerHTML = holidays.map(holiday => {
                const date = new Date(holiday.date);
                const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const timeStr = holiday.is_closed
                    ? (holiday.note || 'Geschlossen')
                    : `${holiday.open_time} - ${holiday.close_time}`;
                const statusColor = holiday.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                const statusText = holiday.is_active ? '✅ Aktiv' : '⏸️ Inaktiv';

                return `
                    <div class="order-card" style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <h3 style="color: var(--gold); margin-bottom: 8px;">${dateStr}</h3>
                                <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 4px 0;">
                                    <strong>Status:</strong> <span style="background: ${statusColor}; padding: 2px 8px; border-radius: 4px;">${statusText}</span><br>
                                    <strong>Öffnungszeiten:</strong> ${timeStr}<br>
                                    ${holiday.note ? `<strong>Notiz:</strong> ${holiday.note}<br>` : ''}
                                </p>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn-action btn-view" onclick="editHolidaySchedule('${holiday.holiday_id}')" title="Bearbeiten">✏️</button>
                                <button class="btn-action" onclick="toggleHolidaySchedule('${holiday.holiday_id}')" style="background: ${holiday.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'};" title="${holiday.is_active ? 'Deaktivieren' : 'Aktivieren'}">${holiday.is_active ? '⏸️' : '▶️'}</button>
                                <button class="btn-action" onclick="deleteHolidaySchedule('${holiday.holiday_id}')" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function filterHolidaySchedule() {
            const search = document.getElementById('holidaySearch')?.value.toLowerCase() || '';
            const status = document.getElementById('holidayStatusFilter')?.value || '';

            let filtered = allHolidaySchedule;

            if (status) {
                filtered = filtered.filter(holiday => {
                    if (status === 'active') return holiday.is_active == 1;
                    if (status === 'inactive') return holiday.is_active == 0;
                    return true;
                });
            }

            if (search) {
                filtered = filtered.filter(holiday => {
                    const date = new Date(holiday.date);
                    const dateStr = date.toLocaleDateString('de-DE');
                    return dateStr.toLowerCase().includes(search) ||
                        (holiday.note && holiday.note.toLowerCase().includes(search));
                });
            }

            renderHolidaySchedule(filtered);
        }

        function showAddHolidayModal() {
            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal';
            modal.id = 'holidayModal';
            modal.onclick = function (e) {
                if (e.target.id === 'holidayModal') closeHolidayModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                    <h3>➕ Neuer Feiertag</h3>
                    <form id="holidayForm" onsubmit="saveHolidaySchedule(event)">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Datum *</label>
                            <input type="date" id="holidayDate" class="filter-input" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">
                                <input type="checkbox" id="holidayIsClosed" checked onchange="toggleHolidayTimeFields()" style="margin-right: 8px;">
                                Geschlossen
                            </label>
                        </div>
                        <div id="holidayTimeFields" style="display: none; margin-bottom: 16px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div>
                                    <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Öffnungszeit *</label>
                                    <input type="time" id="holidayOpenTime" class="filter-input" style="width: 100%;">
                                </div>
                                <div>
                                    <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Schließzeit *</label>
                                    <input type="time" id="holidayCloseTime" class="filter-input" style="width: 100%;">
                                </div>
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Notiz (optional)</label>
                            <input type="text" id="holidayNote" class="filter-input" placeholder="z.B. Geschlossen" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">
                                <input type="checkbox" id="holidayIsActive" checked style="margin-right: 8px;">
                                Aktiv (in Modal anzeigen)
                            </label>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" class="btn-cancel-schedule" onclick="closeHolidayModal()">Abbrechen</button>
                            <button type="submit" class="btn-schedule">Speichern</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
        }

        function toggleHolidayTimeFields() {
            const isClosed = document.getElementById('holidayIsClosed').checked;
            const timeFields = document.getElementById('holidayTimeFields');
            const openTime = document.getElementById('holidayOpenTime');
            const closeTime = document.getElementById('holidayCloseTime');

            if (timeFields) {
                timeFields.style.display = isClosed ? 'none' : 'block';
                if (isClosed) {
                    if (openTime) openTime.removeAttribute('required');
                    if (closeTime) closeTime.removeAttribute('required');
                } else {
                    if (openTime) openTime.setAttribute('required', 'required');
                    if (closeTime) closeTime.setAttribute('required', 'required');
                }
            }
        }

        async function saveHolidaySchedule(event) {
            event.preventDefault();

            const holidayData = {
                date: document.getElementById('holidayDate').value,
                is_closed: document.getElementById('holidayIsClosed').checked,
                open_time: document.getElementById('holidayIsClosed').checked ? null : document.getElementById('holidayOpenTime').value,
                close_time: document.getElementById('holidayIsClosed').checked ? null : document.getElementById('holidayCloseTime').value,
                note: document.getElementById('holidayNote').value || null,
                is_active: document.getElementById('holidayIsActive').checked
            };

            try {
                const response = await fetch('api/index.php?route=v1/data/holiday-schedule&action=create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(holidayData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Feiertag erfolgreich erstellt!');
                    closeHolidayModal();
                    loadHolidaySchedule();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function editHolidaySchedule(holidayId) {
            try {
                const response = await fetch(`api/index.php?route=v1/data/holiday-schedule&action=get&holiday_id=${holidayId}`);
                const data = await response.json();

                if (!data.success) {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                    return;
                }

                const holiday = data.data;
                const modal = document.createElement('div');
                modal.className = 'time-schedule-modal';
                modal.id = 'holidayModal';
                modal.onclick = function (e) {
                    if (e.target.id === 'holidayModal') closeHolidayModal();
                };

                const date = new Date(holiday.date);
                const dateStr = date.toISOString().split('T')[0];

                modal.innerHTML = `
                    <div class="time-schedule-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                        <h3>✏️ Feiertag bearbeiten</h3>
                        <form id="holidayForm" onsubmit="updateHolidaySchedule(event, '${holidayId}')">
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Datum *</label>
                                <input type="date" id="holidayDate" class="filter-input" value="${dateStr}" required style="width: 100%;">
                            </div>
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">
                                    <input type="checkbox" id="holidayIsClosed" ${holiday.is_closed ? 'checked' : ''} onchange="toggleHolidayTimeFields()" style="margin-right: 8px;">
                                    Geschlossen
                                </label>
                            </div>
                            <div id="holidayTimeFields" style="display: ${holiday.is_closed ? 'none' : 'block'}; margin-bottom: 16px;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                    <div>
                                        <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Öffnungszeit *</label>
                                        <input type="time" id="holidayOpenTime" class="filter-input" value="${holiday.open_time || ''}" ${holiday.is_closed ? '' : 'required'} style="width: 100%;">
                                    </div>
                                    <div>
                                        <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Schließzeit *</label>
                                        <input type="time" id="holidayCloseTime" class="filter-input" value="${holiday.close_time || ''}" ${holiday.is_closed ? '' : 'required'} style="width: 100%;">
                                    </div>
                                </div>
                            </div>
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Notiz (optional)</label>
                                <input type="text" id="holidayNote" class="filter-input" value="${holiday.note || ''}" placeholder="z.B. Geschlossen" style="width: 100%;">
                            </div>
                            <div style="margin-bottom: 16px;">
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">
                                    <input type="checkbox" id="holidayIsActive" ${holiday.is_active ? 'checked' : ''} style="margin-right: 8px;">
                                    Aktiv (in Modal anzeigen)
                                </label>
                            </div>
                            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                                <button type="button" class="btn-cancel-schedule" onclick="closeHolidayModal()">Abbrechen</button>
                                <button type="submit" class="btn-schedule">Aktualisieren</button>
                            </div>
                        </form>
                    </div>
                `;

                document.body.appendChild(modal);
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function updateHolidaySchedule(event, holidayId) {
            event.preventDefault();

            const holidayData = {
                date: document.getElementById('holidayDate').value,
                is_closed: document.getElementById('holidayIsClosed').checked,
                open_time: document.getElementById('holidayIsClosed').checked ? null : document.getElementById('holidayOpenTime').value,
                close_time: document.getElementById('holidayIsClosed').checked ? null : document.getElementById('holidayCloseTime').value,
                note: document.getElementById('holidayNote').value || null,
                is_active: document.getElementById('holidayIsActive').checked
            };

            try {
                const response = await fetch(`api/index.php?route=v1/data/holiday-schedule&action=update&holiday_id=${holidayId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(holidayData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Feiertag erfolgreich aktualisiert!');
                    closeHolidayModal();
                    loadHolidaySchedule();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function deleteHolidaySchedule(holidayId) {
            if (!confirm('Möchten Sie diesen Feiertag wirklich löschen?')) return;

            try {
                const response = await fetch(`api/index.php?route=v1/data/holiday-schedule&action=delete&holiday_id=${holidayId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Feiertag erfolgreich gelöscht!');
                    loadHolidaySchedule();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function toggleHolidaySchedule(holidayId) {
            try {
                const response = await fetch(`api/index.php?route=v1/data/holiday-schedule&action=toggle&holiday_id=${holidayId}`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    loadHolidaySchedule();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        function closeHolidayModal() {
            const modal = document.getElementById('holidayModal');
            if (modal) {
                modal.remove();
            }
        }

        function loadDiscountCodeDetails() {
            const select = document.getElementById('promoDiscountCodeSelect');
            const selectedOption = select.options[select.selectedIndex];

            if (selectedOption.value) {
                const type = selectedOption.getAttribute('data-type');
                const value = selectedOption.getAttribute('data-value');
                const minOrder = selectedOption.getAttribute('data-min');
                const endDate = selectedOption.getAttribute('data-end');

                if (type === 'percentage') {
                    document.getElementById('promoDiscountPercent').value = value;
                    document.getElementById('promoDiscountAmount').value = '';
                } else {
                    document.getElementById('promoDiscountAmount').value = value;
                    document.getElementById('promoDiscountPercent').value = '';
                }

                document.getElementById('promoMinOrder').value = minOrder;
                document.getElementById('promoValidUntil').value = endDate;
                document.getElementById('promoDiscountCode').value = selectedOption.value;
            }
        }

        // ========== MENU MANAGEMENT ==========
        let menuCategories = [];
        let allMenuItems = [];

        async function loadMenuCategories() {
            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu')}&action=categories`);

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response from menu categories API:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response');
                }

                const data = await response.json();

                if (data.success) {
                    menuCategories = data.data || [];
                    console.log('✅ Loaded categories:', menuCategories.length);

                    // Update filter dropdown
                    const select = document.getElementById('menuCategoryFilter');
                    if (select) {
                        select.innerHTML = '<option value="">Alle Kategorien</option>' +
                            menuCategories.map(cat =>
                                `<option value="${cat.category_id}">${cat.name}</option>`
                            ).join('');
                    }

                    // Update add/edit modal dropdown if it exists
                    const categorySelect = document.getElementById('menuItemCategory');
                    if (categorySelect && !categorySelect.value) {
                        categorySelect.innerHTML = '<option value="">-- Kategorie auswählen --</option>' +
                            menuCategories.map(cat =>
                                `<option value="${cat.category_id}">${cat.name}</option>`
                            ).join('');
                    }
                } else {
                    console.error('❌ Failed to load categories:', data.message);
                    menuCategories = [];
                }
            } catch (error) {
                console.error('❌ Error loading categories:', error);
                menuCategories = [];
            }
        }

        async function loadMenuItems() {
            try {
                // Admin should see all items including unavailable ones
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu')}&admin=true`);

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response from menu API:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response');
                }

                const data = await response.json();

                if (data.success) {
                    allMenuItems = data.data;
                    renderMenuItems(allMenuItems);
                } else {
                    alert('Fehler beim Laden des Menüs: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading menu items:', error);
                alert('Fehler beim Laden des Menüs: ' + error.message);
            }
        }

        function renderMenuItems(items) {
            const container = document.getElementById('menuItemsList');
            if (!container) return;

            if (items.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>Keine Menü-Items vorhanden</p></div>';
                return;
            }

            container.innerHTML = items.map(item => {
                if (!item.item_id) {
                    console.error('Menu item missing ID:', item);
                    return '';
                }

                const category = menuCategories.find(c => c.category_id === item.category_id);
                return `
                    <div class="order-card" style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <h3 style="color: var(--gold); margin-bottom: 8px;">${item.name}</h3>
                                <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 4px 0;">
                                    <strong>Kategorie:</strong> ${category ? category.name : item.category_id || 'N/A'}<br>
                                    <strong>Preis:</strong> ${parseFloat(item.price).toFixed(2)}€
                                </p>
                                ${item.description ? `<p style="color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 8px;">${item.description}</p>` : ''}
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button class="btn-action btn-view edit-menu-item-btn" data-item-id="${item.item_id}" title="Bearbeiten">✏️</button>
                                <button class="btn-action delete-menu-item-btn" data-item-id="${item.item_id}" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach event listeners using event delegation
            setTimeout(() => {
                attachMenuItemEventListeners();
            }, 100);
        }

        // Store the event handler to avoid duplicate listeners
        let menuItemEventHandler = null;

        function attachMenuItemEventListeners() {
            const container = document.getElementById('menuItemsList');
            if (!container) return;

            // Remove old listener if exists
            if (menuItemEventHandler) {
                container.removeEventListener('click', menuItemEventHandler);
            }

            // Create new event handler
            menuItemEventHandler = function (e) {
                console.log('Menu items container clicked:', e.target);

                const editBtn = e.target.closest('.edit-menu-item-btn');
                const deleteBtn = e.target.closest('.delete-menu-item-btn');

                if (editBtn) {
                    const itemId = editBtn.getAttribute('data-item-id');
                    console.log('Edit button clicked, itemId:', itemId);
                    if (itemId) {
                        e.preventDefault();
                        e.stopPropagation();
                        editMenuItem(itemId);
                    }
                } else if (deleteBtn) {
                    const itemId = deleteBtn.getAttribute('data-item-id');
                    console.log('Delete button clicked, itemId:', itemId);
                    if (itemId) {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteMenuItem(itemId);
                    }
                }
            };

            // Attach the event listener
            container.addEventListener('click', menuItemEventHandler);
        }

        function filterMenuByCategory() {
            const categoryId = document.getElementById('menuCategoryFilter').value;
            const filtered = categoryId
                ? allMenuItems.filter(item => item.category_id === categoryId)
                : allMenuItems;
            renderMenuItems(filtered);
        }

        function filterMenuItems() {
            const search = document.getElementById('menuSearch').value.toLowerCase();
            const categoryId = document.getElementById('menuCategoryFilter').value;

            let filtered = allMenuItems;

            if (categoryId) {
                filtered = filtered.filter(item => item.category_id === categoryId);
            }

            if (search) {
                filtered = filtered.filter(item =>
                    item.name.toLowerCase().includes(search) ||
                    (item.description && item.description.toLowerCase().includes(search))
                );
            }

            renderMenuItems(filtered);
        }

        function showAddMenuItemModal() {
            // Remove existing modal if any
            const existingModal = document.getElementById('menuItemModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal active';
            modal.id = 'menuItemModal';
            modal.style.display = 'flex';
            modal.onclick = function (e) {
                if (e.target.id === 'menuItemModal') closeMenuItemModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px; text-align: left;" onclick="event.stopPropagation()">
                    <h3 style="text-align: center; margin-bottom: 30px;">➕ Neues Menü-Item</h3>
                    <form id="menuItemForm" onsubmit="saveMenuItem(event)">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Kategorie *</label>
                            <select id="menuItemCategory" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" onchange="generateMenuItemId()">
                                <option value="" style="background: #1a1a1c; color: rgba(255,255,255,0.6);">-- Kategorie auswählen --</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Item ID * <span style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 400;">(wird automatisch generiert)</span></label>
                            <input type="text" id="menuItemId" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.06); border: 2px solid rgba(229,207,142,0.2); color: rgba(255,255,255,0.7); font-size: 15px; border-radius: 10px;" readonly>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Name *</label>
                            <input type="text" id="menuItemName" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;">
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Preis (€) *</label>
                            <input type="number" id="menuItemPrice" class="filter-input" step="0.01" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;">
                        </div>
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Beschreibung</label>
                            <textarea id="menuItemDescription" class="filter-input" rows="4" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px; resize: vertical; font-family: inherit;"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px; margin-top: 30px;">
                            <button type="submit" class="btn-action" style="flex: 1; padding: 14px 24px; background: linear-gradient(135deg, rgba(229,207,142,0.2), rgba(194,163,85,0.3)); border: 2px solid rgba(229,207,142,0.4); color: var(--gold); font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">💾 Speichern</button>
                            <button type="button" class="btn-action" onclick="closeMenuItemModal()" style="padding: 14px 24px; background: rgba(239,68,68,0.15); border: 2px solid rgba(239,68,68,0.3); color: #ef4444; font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Force display
            setTimeout(async () => {
                modal.style.display = 'flex';
                modal.classList.add('active');

                // Load categories if not already loaded
                if (!menuCategories || menuCategories.length === 0) {
                    await loadMenuCategories();
                }

                // Load categories into dropdown
                const categorySelect = document.getElementById('menuItemCategory');
                if (categorySelect) {
                    if (menuCategories && menuCategories.length > 0) {
                        categorySelect.innerHTML = '<option value="">-- Kategorie auswählen --</option>' +
                            menuCategories.map(cat =>
                                `<option value="${cat.category_id}">${cat.name}</option>`
                            ).join('');
                    } else {
                        categorySelect.innerHTML = '<option value="">Lade Kategorien...</option>';
                        // Try loading again
                        await loadMenuCategories();
                        if (menuCategories && menuCategories.length > 0) {
                            categorySelect.innerHTML = '<option value="">-- Kategorie auswählen --</option>' +
                                menuCategories.map(cat =>
                                    `<option value="${cat.category_id}">${cat.name}</option>`
                                ).join('');
                        }
                    }

                    // Setup Item ID tracking after modal is displayed
                    setTimeout(() => {
                        setupMenuItemIdTracking();
                    }, 50);
                }
            }, 10);
        }

        // Track if user manually edits Item ID
        function setupMenuItemIdTracking() {
            const itemIdInput = document.getElementById('menuItemId');
            if (itemIdInput) {
                // Store initial value
                if (!itemIdInput.defaultValue) {
                    itemIdInput.defaultValue = itemIdInput.value;
                }

                // Add listener to track manual edits
                itemIdInput.addEventListener('input', function () {
                    if (this.value && this.value !== this.defaultValue) {
                        this.dataset.userEdited = 'true';
                    } else {
                        delete this.dataset.userEdited;
                    }
                });
            }
        }

        async function generateMenuItemId() {
            const categoryId = document.getElementById('menuItemCategory')?.value;
            const itemIdInput = document.getElementById('menuItemId');

            if (!categoryId || !itemIdInput) return;

            // Don't override if user has manually edited the ID
            if (itemIdInput.dataset.userEdited === 'true') return;

            try {
                // Map category_id to prefix based on actual menu data patterns
                const categoryPrefixMap = {
                    'sushimenu': 'S',
                    'maki': 'M',
                    'insideout': 'U',
                    'crunchy': 'C',
                    'sashimi': 'Sa',
                    'nigiri': 'N',
                    'bigrolls': 'P',
                    'minirolls': 'Pa',
                    'specialrolls': 'Sp',
                    'firenigiri': 'F',
                    'temaki': 'Te',
                    'dessert': 'D',
                    'beilagen': 'B'
                };

                const prefix = categoryPrefixMap[categoryId.toLowerCase()] || '';

                // Get all items in this category to find the highest number
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu')}&category_id=${encodeURIComponent(categoryId)}&admin=true`);

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response from menu API:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response');
                }

                const data = await response.json();

                if (data.success) {
                    const items = data.data || [];
                    let maxNumber = 0;

                    if (prefix) {
                        // Category has prefix (S, M, U, C, Sa, N, P, Pa, Sp, F, Te, D, B)
                        items.forEach(item => {
                            if (item.item_id) {
                                // Match prefix followed by numbers (e.g., M1, M2, M10, S1, S2, Sa1, Sp1)
                                // Escape special regex characters in prefix
                                const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                const match = item.item_id.match(new RegExp(`^${escapedPrefix}(\\d+)$`, 'i'));
                                if (match) {
                                    const num = parseInt(match[1], 10);
                                    if (!isNaN(num) && num > maxNumber) {
                                        maxNumber = num;
                                    }
                                }
                            }
                        });
                        // Generate next ID: prefix + (maxNumber + 1)
                        const newId = prefix + (maxNumber + 1);
                        itemIdInput.value = newId;
                        console.log(`✅ Generated ID for category ${categoryId}: ${newId} (max found: ${maxNumber}, total items: ${items.length})`);
                    } else {
                        // Category without prefix (vorspeisen, salate, suppen, etc.) - use numbers only
                        items.forEach(item => {
                            if (item.item_id) {
                                // Match pure numbers (e.g., 1, 2, 30, 40)
                                const match = item.item_id.match(/^(\d+)$/);
                                if (match) {
                                    const num = parseInt(match[1], 10);
                                    if (!isNaN(num) && num > maxNumber) {
                                        maxNumber = num;
                                    }
                                }
                            }
                        });
                        // Generate next ID: (maxNumber + 1)
                        const newId = (maxNumber + 1).toString();
                        itemIdInput.value = newId;
                        console.log(`✅ Generated ID for category ${categoryId}: ${newId} (max found: ${maxNumber}, total items: ${items.length})`);
                    }
                } else {
                    console.error('Failed to load items for category:', data.message);
                }
            } catch (error) {
                console.error('Error generating item ID:', error);
                // Fallback: try to determine prefix from category_id
                const categoryPrefixMap = {
                    'sushimenu': 'S',
                    'maki': 'M',
                    'insideout': 'U',
                    'crunchy': 'C',
                    'sashimi': 'Sa',
                    'nigiri': 'N',
                    'bigrolls': 'P',
                    'minirolls': 'Pa',
                    'specialrolls': 'Sp',
                    'firenigiri': 'F',
                    'temaki': 'Te',
                    'dessert': 'D',
                    'beilagen': 'B'
                };
                const prefix = categoryPrefixMap[categoryId.toLowerCase()] || '';
                itemIdInput.value = prefix ? prefix + '1' : '1';
            }
        }

        // Track if user manually edits Item ID
        function setupMenuItemIdTracking() {
            const itemIdInput = document.getElementById('menuItemId');
            if (itemIdInput) {
                // Remove old listeners
                const newInput = itemIdInput.cloneNode(true);
                itemIdInput.parentNode.replaceChild(newInput, itemIdInput);

                // Add listener to track manual edits
                newInput.addEventListener('input', function () {
                    if (this.value && this.value !== this.defaultValue) {
                        this.dataset.userEdited = 'true';
                    }
                });

                // Store initial value as defaultValue
                newInput.defaultValue = newInput.value;
            }
        }

        function editMenuItem(itemId) {
            if (!itemId) {
                console.error('editMenuItem: itemId is missing');
                alert('Fehler: Item-ID fehlt');
                return;
            }

            console.log('editMenuItem called with ID:', itemId);

            const item = allMenuItems.find(i => i.item_id === itemId);
            if (!item) {
                console.error('Item not found:', itemId);
                alert('Fehler: Menü-Item nicht gefunden');
                return;
            }

            // Remove existing modal if any
            const existingModal = document.getElementById('menuItemModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal active';
            modal.id = 'menuItemModal';
            modal.style.display = 'flex';
            modal.onclick = function (e) {
                if (e.target.id === 'menuItemModal') closeMenuItemModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px; text-align: left;" onclick="event.stopPropagation()">
                    <h3 style="text-align: center; margin-bottom: 30px;">✏️ Menü-Item bearbeiten</h3>
                    <form id="menuItemForm" onsubmit="updateMenuItemForm(event, '${itemId}')">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Item ID</label>
                            <input type="text" value="${item.item_id}" disabled class="filter-input" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.06); border: 2px solid rgba(229,207,142,0.2); color: rgba(255,255,255,0.5); font-size: 15px; border-radius: 10px; opacity: 0.7;">
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Name *</label>
                            <input type="text" id="menuItemName" value="${escapeHtml(item.name || '')}" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;">
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Kategorie *</label>
                            <select id="menuItemCategory" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;"></select>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Preis (€) *</label>
                            <input type="number" id="menuItemPrice" value="${item.price || ''}" step="0.01" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;">
                        </div>
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Beschreibung</label>
                            <textarea id="menuItemDescription" class="filter-input" rows="4" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px; resize: vertical; font-family: inherit;">${escapeHtml(item.description || '')}</textarea>
                        </div>
                        <div style="display: flex; gap: 12px; margin-top: 30px;">
                            <button type="submit" class="btn-action" style="flex: 1; padding: 14px 24px; background: linear-gradient(135deg, rgba(229,207,142,0.2), rgba(194,163,85,0.3)); border: 2px solid rgba(229,207,142,0.4); color: var(--gold); font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">💾 Aktualisieren</button>
                            <button type="button" class="btn-action" onclick="closeMenuItemModal()" style="padding: 14px 24px; background: rgba(239,68,68,0.15); border: 2px solid rgba(239,68,68,0.3); color: #ef4444; font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Force display
            setTimeout(async () => {
                modal.style.display = 'flex';
                modal.classList.add('active');

                // Load categories if not already loaded
                if (!menuCategories || menuCategories.length === 0) {
                    await loadMenuCategories();
                }

                // Load categories and set current
                const categorySelect = document.getElementById('menuItemCategory');
                if (categorySelect) {
                    if (menuCategories && menuCategories.length > 0) {
                        categorySelect.innerHTML = menuCategories.map(cat =>
                            `<option value="${cat.category_id}" ${cat.category_id === item.category_id ? 'selected' : ''}>${cat.name}</option>`
                        ).join('');
                    } else {
                        categorySelect.innerHTML = '<option value="">Lade Kategorien...</option>';
                        // Try loading again
                        await loadMenuCategories();
                        if (menuCategories && menuCategories.length > 0) {
                            categorySelect.innerHTML = menuCategories.map(cat =>
                                `<option value="${cat.category_id}" ${cat.category_id === item.category_id ? 'selected' : ''}>${cat.name}</option>`
                            ).join('');
                        }
                    }
                }
            }, 10);
        }

        function closeMenuItemModal() {
            const modal = document.getElementById('menuItemModal');
            if (modal) modal.remove();
        }

        function showMenuNotification(message, type = 'info') {
            // Remove existing notification if any
            const existing = document.getElementById('menuItemNotification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.id = 'menuItemNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))' : 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.9))'};
                color: #fff;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4);
                z-index: 3000;
                font-size: 14px;
                font-weight: 600;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
                cursor: pointer;
            `;
            notification.textContent = message;
            notification.onclick = () => notification.remove();

            // Add animation if not exists
            if (!document.getElementById('menuNotificationStyle')) {
                const style = document.createElement('style');
                style.id = 'menuNotificationStyle';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);
        }

        async function saveMenuItem(event) {
            event.preventDefault();

            const itemIdInput = document.getElementById('menuItemId');
            const categoryId = document.getElementById('menuItemCategory').value;
            const name = document.getElementById('menuItemName').value.trim();
            const price = parseFloat(document.getElementById('menuItemPrice').value);
            const description = document.getElementById('menuItemDescription').value.trim() || null;

            // Validate required fields
            if (!categoryId || !name || !price || !itemIdInput.value.trim()) {
                showMenuNotification('❌ Bitte füllen Sie alle Pflichtfelder aus!', 'error');
                return;
            }

            // Check if Item ID is empty or just "...", regenerate if needed
            let itemId = itemIdInput.value.trim();
            if (!itemId || itemId === '...') {
                console.log('Item ID is empty or loading, regenerating...');
                await generateMenuItemId();
                itemId = itemIdInput.value.trim();
                if (!itemId || itemId === '...') {
                    showMenuNotification('❌ Fehler beim Generieren der Item-ID. Bitte versuchen Sie es erneut.', 'error');
                    return;
                }
            }

            // Double-check if ID already exists before submitting
            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const checkResponse = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu')}&action=list&admin=true`);

                // Check if response is JSON
                const checkContentType = checkResponse.headers.get('content-type');
                if (!checkContentType || !checkContentType.includes('application/json')) {
                    throw new Error('Server returned non-JSON response');
                }

                const checkData = await checkResponse.json();
                if (checkData.success) {
                    const existingItem = checkData.data.find(item => item.item_id === itemId);
                    if (existingItem) {
                        console.log(`Item ID ${itemId} already exists, regenerating...`);
                        await generateMenuItemId();
                        itemId = itemIdInput.value.trim();
                        if (!itemId || itemId === '...') {
                            showMenuNotification('❌ Fehler beim Generieren der Item-ID. Bitte versuchen Sie es erneut.', 'error');
                            return;
                        }
                    }
                }
            } catch (checkError) {
                console.error('Error checking existing items:', checkError);
                // Continue anyway, server will check
            }

            const itemData = {
                item_id: itemId,
                name: name,
                category_id: categoryId,
                price: price,
                description: description,
                available: 1  // Món mới sẽ được set available = 1 để hiển thị ngay
                // discount_code không áp dụng cho menu items - chỉ áp dụng cho đơn hàng
            };

            console.log('Submitting menu item:', itemData);

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu/new')}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (data.success) {
                    // Show success notification
                    showMenuNotification('✅ Menü-Item erfolgreich erstellt!', 'success');
                    closeMenuItemModal();
                    loadMenuItems();
                } else {
                    // If ID conflict, regenerate and suggest retry
                    if (data.message && data.message.includes('tồn tại')) {
                        console.log('ID conflict detected, regenerating ID...');
                        await generateMenuItemId();
                        showMenuNotification('❌ Item-ID bereits vorhanden. Neue ID wurde generiert. Bitte erneut versuchen.', 'error');
                    } else {
                        // Show error notification without closing modal
                        showMenuNotification('❌ Fehler: ' + (data.message || 'Unknown error'), 'error');
                    }
                }
            } catch (error) {
                console.error('Error saving menu item:', error);
                // Show error notification without closing modal
                showMenuNotification('❌ Fehler: ' + error.message, 'error');
            }
        }

        async function updateMenuItemForm(event, itemId) {
            event.preventDefault();

            const itemData = {
                name: document.getElementById('menuItemName').value.trim(),
                category_id: document.getElementById('menuItemCategory').value,
                price: parseFloat(document.getElementById('menuItemPrice').value),
                description: document.getElementById('menuItemDescription').value.trim() || null
                // discount_code không áp dụng cho menu items - chỉ áp dụng cho đơn hàng
            };

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu/edit')}&item_id=${itemId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });

                const data = await response.json();

                if (data.success) {
                    // Show success notification
                    showMenuNotification('✅ Menü-Item erfolgreich aktualisiert!', 'success');
                    closeMenuItemModal();
                    loadMenuItems();
                } else {
                    // Show error notification without closing modal
                    showMenuNotification('❌ Fehler: ' + (data.message || 'Unknown error'), 'error');
                }
            } catch (error) {
                // Show error notification without closing modal
                showMenuNotification('❌ Fehler: ' + error.message, 'error');
            }
        }

        async function deleteMenuItem(itemId) {
            if (!itemId) {
                console.error('deleteMenuItem: itemId is missing');
                alert('Fehler: Item-ID fehlt');
                return;
            }

            if (!confirm('Möchten Sie dieses Menü-Item wirklich löschen?')) return;

            console.log('deleteMenuItem called with ID:', itemId);

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/menu/remove')}&item_id=${encodeURIComponent(itemId)}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    alert('✅ Menü-Item erfolgreich gelöscht!');
                    loadMenuItems();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error deleting menu item:', error);
                alert('❌ Fehler: ' + error.message);
            }
        }

        // ========== CUSTOMER MANAGEMENT IMPROVEMENTS ==========
        async function loadCustomers() {
            try {
                // Reset to first page when loading/searching
                currentCustomerPage = 1;

                const search = document.getElementById('customerSearch')?.value || '';
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                // Encode route parameter to handle slashes properly
                const url = search
                    ? `api/index.php?route=${encodeURIComponent('v1/data/customers')}&search=${encodeURIComponent(search)}`
                    : `api/index.php?route=${encodeURIComponent('v1/data/customers')}`;

                const response = await fetch(url, { credentials: 'include' });

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response:', text);
                    throw new Error('Server returned non-JSON response. This might be a server error. Please check the server logs.');
                }

                const data = await response.json();

                if (data.success) {
                    renderCustomers(data.data);
                } else {
                    alert('Fehler beim Laden der Kunden: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading customers:', error);
                alert('Fehler beim Laden der Kunden: ' + error.message);
            }
        }

        // Pagination state for customers
        let currentCustomerPage = 1;
        const customersPerPage = 10;
        let allCustomers = [];

        function renderCustomers(customers) {
            const container = document.getElementById('customersListContainer');
            if (!container) return;

            // Store all customers for pagination
            allCustomers = customers;

            if (customers.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>Keine Kunden vorhanden</p></div>';
                return;
            }

            // Calculate pagination
            const totalPages = Math.ceil(customers.length / customersPerPage);
            const startIndex = (currentCustomerPage - 1) * customersPerPage;
            const endIndex = startIndex + customersPerPage;
            const paginatedCustomers = customers.slice(startIndex, endIndex);

            // Render customers
            const customersHTML = paginatedCustomers.map(customer => {
                if (!customer.id) {
                    console.error('Customer missing ID:', customer);
                    return '';
                }

                const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A';
                const address = customer.street ? `${customer.street}, ${customer.postal || ''} ${customer.city || ''}`.trim() : '';
                const points = customer.points || 0;
                const birthday = customer.birthday || '';
                const orderCount = customer.order_count || 0;
                const lastOrderDate = customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString('de-DE') : 'Keine';
                const customerId = String(customer.id).replace(/'/g, "\\'");

                return `
                <div class="order-card" style="margin-bottom: 16px;" data-customer-id="${customer.id}" data-customer-email="${(customer.email || '').replace(/"/g, '&quot;')}" data-customer-phone="${(customer.phone || '').replace(/"/g, '&quot;')}">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h3 style="color: var(--gold); margin-bottom: 8px;">
                                ${fullName}
                            </h3>
                            <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 4px 0;">
                                <strong>📧 Email:</strong> ${customer.email || 'N/A'}<br>
                                <strong>📱 Telefon:</strong> ${customer.phone || 'N/A'}<br>
                                ${address ? `<strong>📍 Adresse:</strong> ${address}<br>` : ''}
                                ${points > 0 ? `<strong>⭐ Punkte:</strong> <span style="color: var(--gold); font-weight: 600;">${points}</span><br>` : ''}
                                <strong>🎂 Geburtstag:</strong> ${birthday ? new Date(birthday).toLocaleDateString('de-DE') : '<span style="color: rgba(255,255,255,0.5);">Nicht angegeben</span>'}<br>
                                <strong>📦 Bestellungen:</strong> ${orderCount}<br>
                                ${lastOrderDate !== 'Keine' ? `<strong>📅 Letzte Bestellung:</strong> ${lastOrderDate}<br>` : ''}
                                <strong>✅ Email verified:</strong> ${customer.email_verified ? '✅' : '❌'}<br>
                                ${customer.discount_code ? `<strong style="color: var(--gold);">🎁 Rabattcode:</strong> ${customer.discount_code}<br>` : ''}
                                <strong>💳 Discount used:</strong> ${customer.discount_used ? '✅' : '❌'}
                            </p>
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${points > 0 ? `<button class="btn-action redeem-points-btn" data-customer-id="${customer.id}" data-customer-points="${points}" data-customer-name="${fullName.replace(/"/g, '&quot;')}" style="background: rgba(34, 197, 94, 0.1); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3);" title="Punkte einlösen">⭐ Einlösen</button>` : ''}
                            <button class="btn-action btn-view edit-customer-btn" data-customer-id="${customer.id}" title="Bearbeiten">✏️</button>
                            <button class="btn-action delete-customer-btn" data-customer-id="${customer.id}" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
            }).join('');

            // Render pagination
            let paginationHTML = '';
            if (totalPages > 1) {
                paginationHTML = `
                    <div class="pagination" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 24px; padding: 20px;">
                        <button class="filter-btn" onclick="goToCustomerPage(${currentCustomerPage - 1})" ${currentCustomerPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>← Zurück</button>
                        <span style="color: rgba(255, 255, 255, 0.7); padding: 0 16px;">
                            Seite ${currentCustomerPage} von ${totalPages} (${customers.length} Kunden)
                        </span>
                        <button class="filter-btn" onclick="goToCustomerPage(${currentCustomerPage + 1})" ${currentCustomerPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>Weiter →</button>
                    </div>
                `;
            }

            container.innerHTML = customersHTML + paginationHTML;

            // Attach event listeners using event delegation
            // Use setTimeout to ensure DOM is updated
            setTimeout(() => {
                attachCustomerEventListeners();
            }, 100);
        }

        // Store the event handler to avoid duplicate listeners
        let customerEventHandler = null;

        function attachCustomerEventListeners() {
            const container = document.getElementById('customersListContainer');
            if (!container) return;

            // Remove old listener if exists
            if (customerEventHandler) {
                container.removeEventListener('click', customerEventHandler);
            }

            // Create new event handler
            customerEventHandler = function (e) {
                console.log('Customer container clicked:', e.target);

                const editBtn = e.target.closest('.edit-customer-btn');
                const deleteBtn = e.target.closest('.delete-customer-btn');
                const redeemBtn = e.target.closest('.redeem-points-btn');

                if (redeemBtn) {
                    const customerId = redeemBtn.getAttribute('data-customer-id');
                    const customerPoints = parseInt(redeemBtn.getAttribute('data-customer-points') || '0');
                    const customerName = redeemBtn.getAttribute('data-customer-name') || 'Kunde';
                    console.log('Redeem points button clicked, customerId:', customerId);
                    if (customerId) {
                        e.preventDefault();
                        e.stopPropagation();
                        showRedeemPointsModal(customerId, customerPoints, customerName);
                    }
                } else if (editBtn) {
                    const customerId = editBtn.getAttribute('data-customer-id');
                    console.log('Edit button clicked, customerId:', customerId);
                    if (customerId) {
                        e.preventDefault();
                        e.stopPropagation();
                        editCustomer(customerId);
                    }
                } else if (deleteBtn) {
                    const customerId = deleteBtn.getAttribute('data-customer-id');
                    console.log('Delete button clicked, customerId:', customerId);
                    if (customerId) {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteCustomer(customerId);
                    }
                }
            };

            // Attach the event listener
            container.addEventListener('click', customerEventHandler);
        }

        function goToCustomerPage(page) {
            const totalPages = Math.ceil(allCustomers.length / customersPerPage);
            if (page < 1 || page > totalPages) return;
            currentCustomerPage = page;
            renderCustomers(allCustomers);
            // Scroll to top of customers list
            document.getElementById('customersListContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Event listeners are already attached in renderCustomers
        }

        function showAddCustomerModal() {
            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal';
            modal.id = 'customerModal';
            modal.onclick = function (e) {
                if (e.target.id === 'customerModal') closeCustomerModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                    <h3>➕ Neuer Kunde</h3>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">Hinweis: Kunden werden normalerweise über die Registrierung erstellt. Sie können hier manuell einen Kunden hinzufügen.</p>
                    <form id="customerForm" onsubmit="saveCustomer(event)">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Email *</label>
                            <input type="email" id="customerEmail" class="filter-input" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Telefon</label>
                            <input type="tel" id="customerPhone" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Vorname</label>
                                <input type="text" id="customerFirstName" class="filter-input" style="width: 100%;">
                            </div>
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Nachname</label>
                                <input type="text" id="customerLastName" class="filter-input" style="width: 100%;">
                            </div>
                        </div>
                        <div style="margin-bottom: 16px; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(229, 207, 142, 0.2); border-radius: 8px;">
                            <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">
                                <strong>ℹ️ Hinweis:</strong> Mã khuyến mãi sẽ được tự động tạo khi khách hàng đăng ký. Không thể chỉnh sửa thủ công.
                            </p>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button type="submit" class="btn-action" style="flex: 1;">💾 Speichern</button>
                            <button type="button" class="btn-action" onclick="closeCustomerModal()" style="background: rgba(239,68,68,0.1);">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
        }

        function editCustomer(customerId) {
            if (!customerId) {
                console.error('editCustomer: customerId is missing');
                alert('Fehler: Kunden-ID fehlt');
                return;
            }

            console.log('editCustomer called with ID:', customerId);

            // Show loading indicator
            const loadingModal = document.createElement('div');
            loadingModal.className = 'time-schedule-modal active';
            loadingModal.style.display = 'flex';
            loadingModal.innerHTML = '<div class="time-schedule-content"><p style="color: rgba(255,255,255,0.9);">Lade Kundendaten...</p></div>';
            document.body.appendChild(loadingModal);

            // Load customer data and show edit modal
            fetch(`api/index.php?route=${encodeURIComponent('v1/data/customers')}&action=get&customer_id=${encodeURIComponent(customerId)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    // Check if response is JSON
                    const contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        return res.text().then(text => {
                            console.error('Non-JSON response:', text);
                            throw new Error('Server returned non-JSON response. This might be a server error.');
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    loadingModal.remove();
                    if (data.success) {
                        const customer = data.data;
                        console.log('Customer data loaded:', customer);
                        showEditCustomerModal(customer);
                    } else {
                        alert('Fehler beim Laden der Kundendaten: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    loadingModal.remove();
                    console.error('Error loading customer:', error);
                    alert('Fehler: ' + error.message);
                });
        }

        function showEditCustomerModal(customer) {
            // Remove existing modal if any
            const existingModal = document.getElementById('customerModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal active';
            modal.id = 'customerModal';
            modal.style.display = 'flex';
            modal.onclick = function (e) {
                if (e.target.id === 'customerModal') closeCustomerModal();
            };

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px;" onclick="event.stopPropagation()">
                    <h3>✏️ Kunde bearbeiten</h3>
                    <form id="customerForm" onsubmit="updateCustomerForm(event, '${customer.id}')">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Email *</label>
                            <input type="email" id="customerEmail" value="${customer.email || ''}" class="filter-input" required style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Telefon</label>
                            <input type="tel" id="customerPhone" value="${customer.phone || ''}" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Vorname</label>
                                <input type="text" id="customerFirstName" value="${customer.first_name || ''}" class="filter-input" style="width: 100%;">
                            </div>
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Nachname</label>
                                <input type="text" id="customerLastName" value="${customer.last_name || ''}" class="filter-input" style="width: 100%;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Straße</label>
                                <input type="text" id="customerStreet" value="${customer.street || ''}" class="filter-input" style="width: 100%;">
                            </div>
                            <div>
                                <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">PLZ</label>
                                <input type="text" id="customerPostal" value="${customer.postal || ''}" class="filter-input" style="width: 100%;">
                            </div>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Stadt</label>
                            <input type="text" id="customerCity" value="${customer.city || ''}" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">🎂 Geburtstag</label>
                            <input type="date" id="customerBirthday" value="${customer.birthday || ''}" class="filter-input" style="width: 100%;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">⭐ Punkte</label>
                            <input type="number" id="customerPoints" value="${customer.points || 0}" min="0" class="filter-input" style="width: 100%;">
                        </div>
                        ${customer.discount_code ? `
                        <div style="margin-bottom: 16px; padding: 12px; background: rgba(229, 207, 142, 0.1); border: 1px solid rgba(229, 207, 142, 0.2); border-radius: 8px;">
                            <label style="display: block; color: rgba(255,255,255,0.9); margin-bottom: 8px;">🎁 Rabattcode (nur Anzeige)</label>
                            <p style="color: var(--gold); font-weight: 600; margin: 0;">${customer.discount_code}</p>
                            <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 4px;">Dieser Code kann nicht manuell geändert werden. Mã khuyến mãi này được tự động tạo cho khách hàng mới và chỉ dùng được 1 lần.</p>
                        </div>
                        ` : ''}
                        <div style="display: flex; gap: 12px;">
                            <button type="submit" class="btn-action" style="flex: 1;">💾 Aktualisieren</button>
                            <button type="button" class="btn-action" onclick="closeCustomerModal()" style="background: rgba(239,68,68,0.1);">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Force display
            setTimeout(() => {
                modal.style.display = 'flex';
                modal.classList.add('active');
            }, 10);
        }

        function closeCustomerModal() {
            const modal = document.getElementById('customerModal');
            if (modal) modal.remove();
        }

        async function saveCustomer(event) {
            event.preventDefault();
            // Note: Creating customers should be done through registration API
            alert('Hinweis: Kunden sollten über die Registrierung erstellt werden. Bitte verwenden Sie die Registrierungsseite.');
            closeCustomerModal();
        }

        async function updateCustomerForm(event, customerId) {
            event.preventDefault();

            const customerData = {
                email: document.getElementById('customerEmail').value.trim(),
                phone: document.getElementById('customerPhone').value.trim(),
                first_name: document.getElementById('customerFirstName').value.trim() || null,
                last_name: document.getElementById('customerLastName').value.trim() || null,
                street: document.getElementById('customerStreet')?.value.trim() || null,
                postal: document.getElementById('customerPostal')?.value.trim() || null,
                city: document.getElementById('customerCity')?.value.trim() || null,
                birthday: document.getElementById('customerBirthday')?.value || null,
                points: document.getElementById('customerPoints')?.value ? parseInt(document.getElementById('customerPoints').value) : null
                // discount_code không được chỉnh sửa thủ công - chỉ được tự động tạo khi đăng ký
            };

            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/customers')}&action=update&customer_id=${customerId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('✅ Kunde erfolgreich aktualisiert!');
                    closeCustomerModal();
                    loadCustomers();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                alert('❌ Fehler: ' + error.message);
            }
        }

        async function deleteCustomer(customerId) {
            if (!customerId) {
                console.error('deleteCustomer: customerId is missing');
                alert('Fehler: Kunden-ID fehlt');
                return;
            }

            if (!confirm('Möchten Sie diesen Kunden wirklich löschen?')) return;

            console.log('deleteCustomer called with ID:', customerId);

            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/customers')}&action=delete&customer_id=${encodeURIComponent(customerId)}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    alert('✅ Kunde erfolgreich gelöscht!');
                    loadCustomers();
                } else {
                    alert('❌ Fehler: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('❌ Fehler: ' + error.message);
            }
        }

        function filterCustomers() {
            loadCustomers();
        }

        // ========== REDEEM POINTS FOR CUSTOMER ==========
        async function showRedeemPointsModal(customerId, customerPoints, customerName) {
            // Load redemption rules first
            let rules = [];
            try {
                const rulesResponse = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/points')}&action=rules`);
                const rulesData = await rulesResponse.json();
                if (rulesData.success) {
                    rules = rulesData.rules || rulesData.data || [];
                    // Filter only rules that customer can afford
                    rules = rules.filter(rule => rule.points_required <= customerPoints && rule.status === 'active');
                }
            } catch (error) {
                console.error('Error loading redemption rules:', error);
            }

            if (rules.length === 0) {
                showMenuNotification('❌ Keine verfügbaren Einlösungsregeln für diesen Kunden!', 'error');
                return;
            }

            const existingModal = document.getElementById('redeemPointsModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal active';
            modal.id = 'redeemPointsModal';
            modal.style.display = 'flex';
            modal.onclick = function (e) {
                if (e.target.id === 'redeemPointsModal') closeRedeemPointsModal();
            };

            const rulesOptions = rules.map(rule => {
                let desc = `${rule.points_required} Punkte = `;
                if (rule.discount_type === 'percentage') {
                    desc += `${rule.discount_value}% Rabatt`;
                } else if (rule.discount_type === 'fixed') {
                    desc += `${rule.discount_value}€ Rabatt`;
                }
                if (rule.min_order > 0) {
                    desc += ` (Min. ${rule.min_order}€)`;
                }
                return `<option value="${rule.rule_id}" data-points="${rule.points_required}">${desc}</option>`;
            }).join('');

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px; text-align: left;" onclick="event.stopPropagation()">
                    <h3 style="text-align: center; margin-bottom: 20px;">⭐ Punkte einlösen für ${customerName}</h3>
                    <div style="background: rgba(229, 207, 142, 0.1); border: 1px solid rgba(229, 207, 142, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                        <p style="color: var(--gold); margin: 0; font-weight: 600; font-size: 18px;">Verfügbare Punkte: ${customerPoints}</p>
                    </div>
                    <form id="redeemPointsForm" onsubmit="redeemPointsForCustomer(event, '${customerId}', ${customerPoints})">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Einlösungsregel auswählen *</label>
                            <select id="customerRedemptionRule" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" onchange="updateCustomerRedemptionPreview('${customerId}', ${customerPoints})">
                                <option value="">-- Regel auswählen --</option>
                                ${rulesOptions}
                            </select>
                        </div>
                        
                        <div id="customerRedemptionPreview" style="margin-bottom: 20px; padding: 16px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; display: none;">
                            <p style="color: #86efac; margin: 0; font-weight: 600;" id="customerRedemptionPreviewText"></p>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-top: 30px;">
                            <button type="submit" class="btn-action" style="flex: 1; padding: 14px 24px; background: linear-gradient(135deg, rgba(229,207,142,0.2), rgba(194,163,85,0.3)); border: 2px solid rgba(229,207,142,0.4); color: var(--gold); font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">⭐ Punkte einlösen</button>
                            <button type="button" class="btn-action" onclick="closeRedeemPointsModal()" style="padding: 14px 24px; background: rgba(239,68,68,0.15); border: 2px solid rgba(239,68,68,0.3); color: #ef4444; font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            setTimeout(() => {
                modal.style.display = 'flex';
                modal.classList.add('active');
            }, 10);
        }

        function updateCustomerRedemptionPreview(customerId, customerPoints) {
            const ruleSelect = document.getElementById('customerRedemptionRule');
            const previewDiv = document.getElementById('customerRedemptionPreview');
            const previewText = document.getElementById('customerRedemptionPreviewText');

            if (!ruleSelect || !previewDiv || !previewText) return;

            const ruleId = ruleSelect.value;
            if (!ruleId) {
                previewDiv.style.display = 'none';
                return;
            }

            const selectedOption = ruleSelect.options[ruleSelect.selectedIndex];
            const pointsRequired = parseInt(selectedOption.getAttribute('data-points') || '0');
            const remainingPoints = customerPoints - pointsRequired;

            if (remainingPoints < 0) {
                previewText.textContent = `❌ Nicht genug Punkte! Benötigt: ${pointsRequired}, Verfügbar: ${customerPoints}`;
                previewDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                previewDiv.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                previewText.style.color = '#fca5a5';
            } else {
                previewText.textContent = `Verwendet: ${pointsRequired} Punkte → Verbleibend: ${remainingPoints} Punkte`;
                previewDiv.style.background = 'rgba(34, 197, 94, 0.1)';
                previewDiv.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                previewText.style.color = '#86efac';
            }

            previewDiv.style.display = 'block';
        }

        function closeRedeemPointsModal() {
            const modal = document.getElementById('redeemPointsModal');
            if (modal) modal.remove();
        }

        async function redeemPointsForCustomer(event, customerId, customerPoints) {
            event.preventDefault();

            const ruleId = document.getElementById('customerRedemptionRule').value;
            if (!ruleId) {
                showMenuNotification('❌ Bitte wählen Sie eine Einlösungsregel aus!', 'error');
                return;
            }

            const selectedOption = document.getElementById('customerRedemptionRule').options[document.getElementById('customerRedemptionRule').selectedIndex];
            const pointsRequired = parseInt(selectedOption.getAttribute('data-points') || '0');

            if (customerPoints < pointsRequired) {
                showMenuNotification(`❌ Nicht genug Punkte! Benötigt: ${pointsRequired}, Verfügbar: ${customerPoints}`, 'error');
                return;
            }

            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/points')}&action=redeem`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customer_id: customerId,
                        rule_id: ruleId
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showMenuNotification(`✅ Punkte erfolgreich eingelöst! Rabattcode: ${data.promotion_code || 'N/A'}`, 'success');
                    closeRedeemPointsModal();
                    // Reload customers to update points
                    await loadCustomers();
                } else {
                    showMenuNotification('❌ Fehler: ' + (data.message || 'Unknown error'), 'error');
                }
            } catch (error) {
                console.error('Error redeeming points:', error);
                showMenuNotification('❌ Fehler: ' + error.message, 'error');
            }
        }

        // Promotion email functions
        let selectedCustomers = [];

        async function loadCustomersForPromotion() {
            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/promotions')}&action=list-customers`);
                const data = await response.json();

                if (data.success) {
                    const customersList = document.getElementById('customersList');
                    if (customersList) {
                        if (data.customers.length === 0) {
                            customersList.innerHTML = '<p style="color: rgba(255, 255, 255, 0.5); text-align: center; padding: 20px;">Keine Kunden vorhanden</p>';
                            return;
                        }

                        customersList.innerHTML = data.customers.map(customer => `
                            <label style="display: flex; align-items: center; padding: 8px; margin-bottom: 4px; background: rgba(255, 255, 255, 0.02); border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" value="${customer.email}" data-name="${customer.name}" 
                                    onchange="updateSelectedCustomers()" 
                                    style="margin-right: 12px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="color: rgba(255, 255, 255, 0.9);">${customer.name} (${customer.email})</span>
                            </label>
                        `).join('');
                    }
                } else {
                    alert('Fehler beim Laden der Kundenliste: ' + (data.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error loading customers:', error);
                alert('Fehler beim Laden der Kundenliste: ' + error.message);
            }
        }

        function updateSelectedCustomers() {
            const checkboxes = document.querySelectorAll('#customersList input[type="checkbox"]:checked');
            selectedCustomers = Array.from(checkboxes).map(cb => ({
                email: cb.value,
                name: cb.getAttribute('data-name')
            }));
        }

        function selectAllCustomers() {
            const checkboxes = document.querySelectorAll('#customersList input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = true);
            updateSelectedCustomers();
        }

        function clearCustomerSelection() {
            const checkboxes = document.querySelectorAll('#customersList input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = false);
            selectedCustomers = [];
        }

        // ========== REDEMPTION RULES MANAGEMENT ==========
        let allRedemptionRules = [];

        async function loadRedemptionRules() {
            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/points')}&action=rules`);
                const data = await response.json();

                if (data.success) {
                    // API returns {success: true, rules: [...]}
                    allRedemptionRules = data.rules || data.data || [];
                    renderRedemptionRules();
                } else {
                    console.error('Failed to load redemption rules:', data.message);
                    document.getElementById('redemptionRulesList').innerHTML = `
                        <p style="color: rgba(255, 255, 255, 0.5); text-align: center; padding: 40px;">Fehler beim Laden der Regeln: ${data.message}</p>
                    `;
                }
            } catch (error) {
                console.error('Error loading redemption rules:', error);
                document.getElementById('redemptionRulesList').innerHTML = `
                    <p style="color: rgba(255, 255, 255, 0.5); text-align: center; padding: 40px;">Fehler: ${error.message}</p>
                `;
            }
        }

        function renderRedemptionRules() {
            const container = document.getElementById('redemptionRulesList');

            if (!allRedemptionRules || allRedemptionRules.length === 0) {
                container.innerHTML = `
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(229, 207, 142, 0.2); border-radius: 12px; padding: 40px; text-align: center;">
                        <p style="color: rgba(255, 255, 255, 0.5); margin: 0;">Keine Einlösungsregeln vorhanden. Klicken Sie auf "Neue Regel hinzufügen" um eine zu erstellen.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = allRedemptionRules.map(rule => {
                const statusColor = rule.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                const statusText = rule.status === 'active' ? 'Aktiv' : 'Inaktiv';
                const statusBorder = rule.status === 'active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';

                let discountText = '';
                if (rule.discount_type === 'percentage') {
                    discountText = `${rule.discount_value}% Rabatt`;
                } else if (rule.discount_type === 'fixed') {
                    discountText = `${rule.discount_value}€ Rabatt`;
                } else {
                    // Fallback for old format
                    if (rule.discount_percent > 0) {
                        discountText = `${rule.discount_percent}% Rabatt`;
                    } else if (rule.discount_amount > 0) {
                        discountText = `${rule.discount_amount}€ Rabatt`;
                    }
                }

                return `
                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid ${statusBorder}; border-radius: 12px; padding: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                            <div style="flex: 1;">
                                <h3 style="color: var(--gold); margin: 0 0 8px 0; font-size: 18px;">${rule.points_required} Punkte</h3>
                                <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">→ ${discountText}</p>
                                ${rule.min_order > 0 ? `<p style="color: rgba(255, 255, 255, 0.6); margin: 4px 0 0 0; font-size: 14px;">Mindestbestellwert: ${rule.min_order}€</p>` : ''}
                                <p style="color: rgba(255, 255, 255, 0.6); margin: 4px 0 0 0; font-size: 14px;">Gültig: ${rule.valid_days || 30} Tage</p>
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <span style="background: ${statusColor}; border: 1px solid ${statusBorder}; color: ${rule.status === 'active' ? '#86efac' : '#fca5a5'}; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">${statusText}</span>
                                <button class="filter-btn" onclick="editRedemptionRule('${rule.rule_id}')" style="background: rgba(229, 207, 142, 0.1); padding: 8px 16px; font-size: 13px; cursor: pointer;">✏️ Bearbeiten</button>
                                <button class="filter-btn" onclick="deleteRedemptionRule('${rule.rule_id}')" style="background: rgba(239, 68, 68, 0.1); padding: 8px 16px; font-size: 13px; cursor: pointer;">🗑️ Löschen</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function showAddRedemptionRuleModal() {
            showRedemptionRuleModal(null);
        }

        function editRedemptionRule(ruleId) {
            const rule = allRedemptionRules.find(r => r.rule_id === ruleId);
            if (rule) {
                showRedemptionRuleModal(rule);
            }
        }

        function showRedemptionRuleModal(rule = null) {
            const existingModal = document.getElementById('redemptionRuleModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'time-schedule-modal active';
            modal.id = 'redemptionRuleModal';
            modal.style.display = 'flex';
            modal.onclick = function (e) {
                if (e.target.id === 'redemptionRuleModal') closeRedemptionRuleModal();
            };

            const isEdit = rule !== null;

            modal.innerHTML = `
                <div class="time-schedule-content" style="max-width: 600px; text-align: left;" onclick="event.stopPropagation()">
                    <h3 style="text-align: center; margin-bottom: 30px;">${isEdit ? '✏️ Regel bearbeiten' : '➕ Neue Regel hinzufügen'}</h3>
                    <form id="redemptionRuleForm" onsubmit="saveRedemptionRule(event, ${isEdit ? `'${rule.rule_id}'` : 'null'})">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Benötigte Punkte *</label>
                            <input type="number" id="rulePointsRequired" class="filter-input" required min="1" step="1" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" value="${rule ? rule.points_required : ''}">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Rabatttyp *</label>
                            <select id="ruleDiscountType" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" onchange="updateDiscountFields()">
                                <option value="">-- Typ auswählen --</option>
                                <option value="percentage" ${rule && rule.discount_type === 'percentage' ? 'selected' : ''}>Prozent (%)</option>
                                <option value="fixed" ${rule && rule.discount_type === 'fixed' ? 'selected' : ''}>Fester Betrag (€)</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 20px;" id="discountValueContainer">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;" id="discountValueLabel">Rabattwert *</label>
                            <input type="number" id="ruleDiscountValue" class="filter-input" required min="0" step="0.01" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" value="${rule ? rule.discount_value : ''}">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Mindestbestellwert (€)</label>
                            <input type="number" id="ruleMinOrder" class="filter-input" min="0" step="0.01" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" value="${rule ? (rule.min_order || 0) : '0'}">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Gültigkeitsdauer (Tage) *</label>
                            <input type="number" id="ruleValidDays" class="filter-input" required min="1" step="1" style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;" value="${rule ? (rule.valid_days || 30) : '30'}">
                        </div>
                        
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; color: #fff; margin-bottom: 10px; font-weight: 600; font-size: 14px;">Status</label>
                            <select id="ruleStatus" class="filter-input" required style="width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08); border: 2px solid rgba(229,207,142,0.3); color: #fff; font-size: 15px; border-radius: 10px;">
                                <option value="active" ${rule && rule.status === 'active' ? 'selected' : ''}>Aktiv</option>
                                <option value="inactive" ${rule && rule.status === 'inactive' ? 'selected' : ''}>Inaktiv</option>
                            </select>
                        </div>
                        
                        <div style="display: flex; gap: 12px; margin-top: 30px;">
                            <button type="submit" class="btn-action" style="flex: 1; padding: 14px 24px; background: linear-gradient(135deg, rgba(229,207,142,0.2), rgba(194,163,85,0.3)); border: 2px solid rgba(229,207,142,0.4); color: var(--gold); font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">💾 Speichern</button>
                            <button type="button" class="btn-action" onclick="closeRedemptionRuleModal()" style="padding: 14px 24px; background: rgba(239,68,68,0.15); border: 2px solid rgba(239,68,68,0.3); color: #ef4444; font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: all 0.3s;">Abbrechen</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            setTimeout(() => {
                modal.style.display = 'flex';
                modal.classList.add('active');
                updateDiscountFields();
            }, 10);
        }

        function updateDiscountFields() {
            const discountType = document.getElementById('ruleDiscountType')?.value;
            const label = document.getElementById('discountValueLabel');
            const input = document.getElementById('ruleDiscountValue');

            if (label && input) {
                if (discountType === 'percentage') {
                    label.textContent = 'Rabatt (%) *';
                    input.max = 100;
                    input.step = '1';
                    input.placeholder = '20';
                } else if (discountType === 'fixed') {
                    label.textContent = 'Rabatt (€) *';
                    input.max = '';
                    input.step = '0.01';
                    input.placeholder = '5.00';
                }
            }
        }

        function closeRedemptionRuleModal() {
            const modal = document.getElementById('redemptionRuleModal');
            if (modal) modal.remove();
        }

        async function saveRedemptionRule(event, ruleId) {
            event.preventDefault();

            const pointsRequired = parseInt(document.getElementById('rulePointsRequired').value);
            const discountType = document.getElementById('ruleDiscountType').value;
            const discountValue = parseFloat(document.getElementById('ruleDiscountValue').value);
            const minOrder = parseFloat(document.getElementById('ruleMinOrder').value) || 0;
            const validDays = parseInt(document.getElementById('ruleValidDays').value);
            const status = document.getElementById('ruleStatus').value;

            if (pointsRequired <= 0) {
                showMenuNotification('❌ Benötigte Punkte muss größer als 0 sein!', 'error');
                return;
            }

            if (discountValue <= 0) {
                showMenuNotification('❌ Rabattwert muss größer als 0 sein!', 'error');
                return;
            }

            if (discountType === 'percentage' && discountValue > 100) {
                showMenuNotification('❌ Rabatt (%) darf nicht größer als 100 sein!', 'error');
                return;
            }

            try {
                const url = ruleId ? `api/v1/data/points/rules?action=update&rule_id=${ruleId}` : 'api/v1/data/points/rules?action=create';
                const method = 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        points_required: pointsRequired,
                        discount_type: discountType,
                        discount_value: discountValue,
                        min_order: minOrder,
                        valid_days: validDays,
                        status: status
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showMenuNotification(`✅ Regel ${ruleId ? 'aktualisiert' : 'erstellt'}!`, 'success');
                    closeRedemptionRuleModal();
                    await loadRedemptionRules();
                } else {
                    showMenuNotification('❌ Fehler: ' + (data.message || 'Unknown error'), 'error');
                }
            } catch (error) {
                console.error('Error saving redemption rule:', error);
                showMenuNotification('❌ Fehler: ' + error.message, 'error');
            }
        }

        async function deleteRedemptionRule(ruleId) {
            if (!confirm('Möchten Sie diese Regel wirklich löschen?')) {
                return;
            }

            try {
                const response = await fetch(`api/v1/data/points/rules?action=delete&rule_id=${ruleId}`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (data.success) {
                    showMenuNotification('✅ Regel gelöscht!', 'success');
                    await loadRedemptionRules();
                } else {
                    showMenuNotification('❌ Fehler: ' + (data.message || 'Unknown error'), 'error');
                }
            } catch (error) {
                console.error('Error deleting redemption rule:', error);
                showMenuNotification('❌ Fehler: ' + error.message, 'error');
            }
        }

        // Load all data
        async function loadAllData(silent = false) {
            await loadOrders(silent); // Load orders from MySQL first
            if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                await AdminStats.loadStats(); // Then calculate stats based on loaded orders
            }
            await loadReservations();
            // Load customers but don't fail if permissions error
            try {
                await loadCustomers();
            } catch (error) {
                console.warn('Could not load customers (permissions issue):', error);
                // Continue even if customers fail to load
            }
        }

        // Show new order notification
        function showNewOrderNotification(order) {
            // Parse summary first
            let summary = {};
            if (order.summary) {
                if (typeof order.summary === 'string') {
                    try { summary = JSON.parse(order.summary); } catch (e) { }
                } else { summary = order.summary; }
            }

            // Play notification sound
            console.log('🔔 Neue Bestellung erhalten!', order);
            playNotificationSound();

            const orderId = order.order_id || order._id || 'N/A';
            const orderIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-8));

            // Request browser notification permission
            if ('Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission();
                }
                if (Notification.permission === 'granted') {
                    // Parse delivery_address
                    let address = {};
                    if (order.delivery_address) {
                        if (typeof order.delivery_address === 'string') {
                            try { address = JSON.parse(order.delivery_address); } catch (e) { address = {}; }
                        } else { address = order.delivery_address; }
                    }

                    const customerName = `${address.firstName || address.first_name || ''} ${address.lastName || address.last_name || ''}`.trim() || 'Kunde';
                    const total = summary.total || order.order_total || '0,00 €';

                    new Notification('🍣 Neue Bestellung!', {
                        body: `Bestellung #${orderIdShort} - ${customerName} - ${total}`,
                        icon: '/assets/logo.png',
                        badge: '/assets/logo.png',
                        tag: `order-${orderId}`,
                        requireInteraction: true  // stays until admin clicks it
                    });
                }
            }

            // Cross-tab sync
            if (window.adminSyncChannel) {
                window.adminSyncChannel.postMessage({
                    type: 'NEW_ORDER',
                    orderId: orderId
                });
            }

            // Create in-page notification
            // Parse delivery_address
            let address = {};
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { address = {}; }
                } else { address = order.delivery_address; }
            }

            const customerName = `${address.firstName || address.first_name || ''} ${address.lastName || address.last_name || ''}`.trim() || 'Kunde';
            const phone = address.phone || 'N/A';

            const total = summary.total || order.order_total || '0,00 €';
            const serviceType = order.service_type === 'delivery' ? 'Lieferung' : order.service_type === 'pickup' ? 'Abholung' : 'Reservierung';

            // Inject pulse CSS once
            if (!document.getElementById('_orderAlarmStyle')) {
                const styleEl = document.createElement('style');
                styleEl.id = '_orderAlarmStyle';
                styleEl.textContent = `
                        @keyframes orderAlarmPulse {
                            0%,100% { box-shadow: 0 0 0 0 rgba(255,50,50,0.7), 0 8px 32px rgba(0,0,0,.4); border-color: rgba(255,80,80,0.9); }
                            50%      { box-shadow: 0 0 0 12px rgba(255,50,50,0), 0 8px 32px rgba(0,0,0,.4); border-color: rgba(255,200,0,0.9); }
                        }
                        .new-order-notification {
                            animation: orderAlarmPulse 1.2s ease-in-out infinite !important;
                            border: 2.5px solid rgba(255,80,80,0.9) !important;
                        }
                        .new-order-notification.hiding {
                            animation: none !important;
                        }
                    `;
                document.head.appendChild(styleEl);
            }

            const notification = document.createElement('div');
            notification.className = 'new-order-notification';
            notification.dataset.orderId = orderId;
            notification.innerHTML = `
                <div class="notification-header">
                    <div class="notification-icon">🔔</div>
                    <h3 class="notification-title">Neue Bestellung!</h3>
                    <button class="notification-close" onclick="closeNewOrderNotification(this)">×</button>
                </div>
                <div class="notification-content">
                    <p style="margin: 0 0 12px 0; font-weight: 600;">Bestellung #${orderIdShort}</p>
                    <div class="notification-order-info">
                        <div class="notification-order-item">
                            <span class="notification-order-label">Kunde:</span>
                            <span class="notification-order-value">${customerName}</span>
                        </div>
                        <div class="notification-order-item">
                            <span class="notification-order-label">Telefon:</span>
                            <span class="notification-order-value">${phone}</span>
                        </div>
                        <div class="notification-order-item">
                            <span class="notification-order-label">Typ:</span>
                            <span class="notification-order-value">${serviceType}</span>
                        </div>
                        <div class="notification-order-item">
                            <span class="notification-order-label">Gesamt:</span>
                            <span class="notification-order-value" style="color: var(--gold);">${total}</span>
                        </div>
                    </div>
                    <div class="notification-actions">
                        <button class="notification-btn notification-btn-view" onclick="viewNewOrder('${orderId}'); closeNewOrderNotification(this.closest('.new-order-notification'))">Details anzeigen</button>
                        <button class="notification-btn notification-btn-confirm" onclick="confirmOrder('${orderId}'); closeNewOrderNotification(this.closest('.new-order-notification'))">Bestätigen</button>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            // Flash screen red so admin CANNOT miss it
            flashPage(3);

            // Start persistent alarm (repeats every 8s until dismissed)
            startAlarm();

            // Blink tab title until dismissed
            startTitleBlink();

            // Click on notification body will scroll to order
            notification.addEventListener('click', (e) => {
                if (e.target.classList.contains('notification-btn') || e.target.classList.contains('notification-close')) {
                    return;
                }
                viewNewOrder(orderId);
            });
        }

        // Close new order notification + dismiss alarm for that order
        function closeNewOrderNotification(button) {
            const notification = button.closest ? button.closest('.new-order-notification') : button;
            if (notification) {
                notification.classList.add('hiding');
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                    // Stop alarm if no more open notifications (Optional, keeping logic for popups)
                    const remaining = document.querySelectorAll('.new-order-notification').length;
                    if (remaining === 0) {
                        // stopAlarm(); // Don't stop alarm here anymore! Keep it until orders are handled
                        stopTitleBlink();
                    } else {
                        // dismissOrder(); // Don't decrement count here anymore
                    }
                }, 300);
            }
        }

        // Show new reservation notification
        function showNewReservationNotification(reservation) {
            // Play notification sound
            console.log('🔔 Neue Reservierung erhalten!', reservation);
            playNotificationSound();

            // Request browser notification permission
            if ('Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission();
                }
                if (Notification.permission === 'granted') {
                    const reservationId = reservation.reservation_id || reservation.reservationId || 'N/A';
                    const reservationIdShort = reservationId.toString().replace(/^(RES-)/, '').slice(-8);
                    const customerName = `${reservation.first_name || ''} ${reservation.last_name || ''}`.trim() || 'Kunde';
                    const date = reservation.date || '';
                    const time = reservation.time || '';

                    new Notification('📅 Neue Reservierung!', {
                        body: `Reservierung #${reservationIdShort} - ${customerName} - ${date} ${time}`,
                        icon: '/assets/logo.png',
                        badge: '/assets/logo.png',
                        tag: `reservation-${reservationId}`,
                        requireInteraction: false
                    });
                }
            }

            // Create in-page notification
            const reservationId = reservation.reservation_id || reservation.reservationId || 'N/A';
            const reservationIdShort = reservationId.toString().replace(/^(RES-)/, '').slice(-8);
            const customerName = `${reservation.first_name || ''} ${reservation.last_name || ''}`.trim() || 'Kunde';
            const phone = reservation.phone || 'N/A';
            const date = reservation.date || '';
            const time = reservation.time || '';
            const guests = reservation.guests || 'N/A';

            const notification = document.createElement('div');
            notification.className = 'new-order-notification';
            notification.dataset.reservationId = reservationId;
            notification.innerHTML = `
                <div class="notification-header">
                    <div class="notification-icon">📅</div>
                    <h3 class="notification-title">Neue Reservierung!</h3>
                    <button class="notification-close" onclick="closeNewOrderNotification(this)">×</button>
                </div>
                <div class="notification-content">
                    <p style="margin: 0 0 12px 0; font-weight: 600;">Reservierung #${reservationIdShort}</p>
                    <div class="notification-order-info">
                        <div class="notification-order-item">
                            <span class="notification-order-label">Kunde:</span>
                            <span class="notification-order-value">${customerName}</span>
                        </div>
                        <div class="notification-order-item">
                            <span class="notification-order-label">Telefon:</span>
                            <span class="notification-order-value">${phone}</span>
                        </div>
                        <div class="notification-order-item">
                            <span class="notification-order-label">Datum:</span>
                            <span class="notification-order-value">${date} ${time}</span>
                        </div>
                        <div class="notification-order-item">
                            <span class="notification-order-label">Gäste:</span>
                            <span class="notification-order-value">${guests}</span>
                        </div>
                    </div>
                    <div class="notification-actions">
                        <button class="notification-btn notification-btn-view" onclick="viewNewReservation('${reservationId}'); closeNewOrderNotification(this.closest('.new-order-notification'))">Details anzeigen</button>
                        <button class="notification-btn notification-btn-confirm" onclick="confirmReservation('${reservationId}'); closeNewOrderNotification(this.closest('.new-order-notification'))">Bestätigen</button>
                    </div>
                </div>
            `;

            document.body.appendChild(notification);

            // Auto close after 10 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    closeNewOrderNotification(notification.querySelector('.notification-close'));
                }
            }, 10000);

            // Click to close
            notification.addEventListener('click', (e) => {
                if (e.target === notification || e.target.closest('.notification-close')) {
                    return;
                }
                // Click on notification body will scroll to reservation
                viewNewReservation(reservationId);
            });
        }

        // View new reservation (scroll to it)
        function viewNewReservation(reservationId) {
            // Switch to reservations tab
            const reservationsTab = document.querySelector('.admin-tab[onclick*="reservations"]');
            if (reservationsTab) {
                reservationsTab.click();
            }

            // Scroll to reservation after a short delay
            setTimeout(() => {
                const reservationElement = document.querySelector(`[data-reservation-id="${reservationId}"]`);
                if (reservationElement) {
                    reservationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    reservationElement.style.border = '2px solid var(--gold)';
                    setTimeout(() => {
                        reservationElement.style.border = '';
                    }, 3000);
                }
            }, 500);
        }

        // View new order (scroll to it)
        function viewNewOrder(orderId) {
            // Switch to orders tab
            const ordersTab = document.querySelector('.admin-tab[onclick*="orders"]');
            if (ordersTab) {
                ordersTab.click();
            }

            // Find and scroll to order card
            setTimeout(() => {
                const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
                if (orderCard) {
                    orderCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight the card
                    orderCard.style.animation = 'pulse 2s ease 3';
                    setTimeout(() => {
                        orderCard.style.animation = '';
                    }, 6000);
                }
            }, 300);
        }

        // Request notification permission
        function requestNotificationPermission() {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted');
                    }
                });
            }
        }

        // Initialize notification sound
        let audioContext = null;
        let audioContextInitialized = false;

        // Initialize audio context on first user interaction
        function initAudioContext() {
            if (!audioContextInitialized) {
                try {
                    if (!audioContext) {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    }

                    // Resume audio context if suspended
                    if (audioContext.state === 'suspended') {
                        audioContext.resume().then(() => {
                            audioContextInitialized = true;
                            console.log('✅ Audio context initialized and resumed');
                        }).catch(e => {
                            console.log('Could not resume audio context:', e);
                        });
                    } else {
                        audioContextInitialized = true;
                        console.log('✅ Audio context initialized');
                    }
                } catch (e) {
                    console.log('Could not initialize audio context:', e);
                }
            }
        }

        // Add event listeners to initialize audio context
        document.addEventListener('click', initAudioContext, { once: true });
        document.addEventListener('keydown', initAudioContext, { once: true });
        document.addEventListener('touchstart', initAudioContext, { once: true });

        function initNotificationSound() {
            try {
                // Create or reuse audio context
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                // Resume audio context if suspended (browser autoplay policy)
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        playNotificationSound();
                    }).catch(e => {
                        console.log('Could not resume audio context:', e);
                    });
                } else {
                    playNotificationSound();
                }
            } catch (e) {
                console.log('Could not create notification sound:', e);
            }
        }

        // Play notification sound
        function playNotificationSound() {
            try {
                // Create or reuse audio context
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }

                // Resume audio context if suspended (browser autoplay policy)
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log('🔊 Audio context resumed, playing sound');
                        playSoundInternal();
                    }).catch(e => {
                        console.log('Could not resume audio context:', e);
                        // Try to play anyway
                        playSoundInternal();
                    });
                } else if (audioContext.state === 'running') {
                    // Audio context is ready, play immediately
                    console.log('🔊 Playing notification sound');
                    playSoundInternal();
                } else {
                    // Audio context is in 'closed' state, try to create a new one
                    console.log('⚠️ Audio context closed, creating new one');
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    playSoundInternal();
                }
            } catch (e) {
                console.log('Could not play notification sound (Web Audio):', e);
                // Fallback to HTML5 Audio
                playNotificationSoundFallback();
            }
        }
        function playNotificationSoundFallback() {
            try {
                // Create audio element with data URI (beep sound)
                const audio = new Audio();
                // Use a simple beep sound using data URI
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);

                console.log('🔊 Played notification sound (fallback)');
            } catch (e) {
                console.log('Could not play notification sound (fallback):', e);
            }
        }

        // Internal function to actually play the sound (LOUD SIREN style)
        function playSoundInternal() {
            try {
                const audioCtx = audioContext || new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                // High-pitched "Ding" sound
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5

                gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.5);

                console.log('🔔 Played "Ding" notification sound');
            } catch (e) {
                console.error('❌ Error playing sound:', e);
            }
        }

        // ---- Persistent alarm: repeat sound every 8s until dismissed ----
        let _alarmInterval = null;
        let _pendingAlarmOrders = 0;

        function startAlarm() {
            // Modified: Notify once instead of looping every 8s
            playNotificationSound();
        }

        function stopAlarm() {
            // No-op kept for compatibility with other calls
            _pendingAlarmOrders = 0;
        }

        // New helper to check all orders and decide if alarm should run
        function checkPendingOrdersAndAlarm(orders) {
            if (!orders) return;

            const pendingOrders = orders.filter(o => (!o.status || o.status === 'pending'));
            const hasPending = pendingOrders.length > 0;

            if (hasPending) {
                if (!_alarmInterval) {
                    console.log('📢 Found pending orders, starting alarm...');
                    startAlarm();
                    startTitleBlink();
                }
            } else {
                if (_alarmInterval) {
                    console.log('✅ No more pending orders, stopping alarm.');
                    stopAlarm();
                    stopTitleBlink();
                }
            }
        }

        function dismissOrder() {
            _pendingAlarmOrders = Math.max(0, _pendingAlarmOrders - 1);
            if (_pendingAlarmOrders <= 0) stopAlarm();
        }

        // ---- Flash red overlay on page ----
        function flashPage(times) {
            let overlay = document.getElementById('_orderFlashOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = '_orderFlashOverlay';
                overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;pointer-events:none;background:rgba(255,50,50,0.45);display:none;';
                document.body.appendChild(overlay);
            }
            let count = 0;
            const totalFlashes = times || 6;
            const iv = setInterval(() => {
                overlay.style.display = (count % 2 === 0) ? 'block' : 'none';
                count++;
                if (count >= totalFlashes * 2) {
                    clearInterval(iv);
                    overlay.style.display = 'none';
                }
            }, 200);
        }

        // Test sound function (can be called manually)
        function testNotificationSound() {
            playNotificationSound();
        }

        // Tab title blink — keeps blinking until stopTitleBlink() is called
        let _titleBlinkInterval = null;
        let _originalTitle = document.title;

        function startTitleBlink() {
            if (_originalTitle === '🔔 ĐƠN MỚI!') _originalTitle = 'Admin Panel';
            else _originalTitle = document.title;
            let blink = false;
            let blinkCount = 0;
            const maxBlinks = 10; // Blink 10 times then stop automatically

            if (_titleBlinkInterval) clearInterval(_titleBlinkInterval);
            _titleBlinkInterval = setInterval(() => {
                document.title = blink ? '🔔 ĐƠN MỚI!' : _originalTitle;
                blink = !blink;
                blinkCount++;

                if (blinkCount >= maxBlinks * 2) {
                    stopTitleBlink();
                }
            }, 700); // faster blink
        }

        function stopTitleBlink() {
            if (_titleBlinkInterval) { clearInterval(_titleBlinkInterval); _titleBlinkInterval = null; }
            document.title = _originalTitle;
        }

        // Print a thermal-style bill for an order
        async function printOrderBill(orderId, etaOverride = '') {
            const order = (allOrdersData || []).find(o =>
                (o.order_id || o._id || '').toString() === orderId.toString()
            );
            if (!order) {
                alert('Không tìm thấy đơn hàng!');
                return;
            }

            // Parse fields for PrinterManager
            let address = {};
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { }
                } else { address = order.delivery_address; }
            }

            let summary = {};
            if (order.summary) {
                if (typeof order.summary === 'string') {
                    try { summary = JSON.parse(order.summary); } catch (e) { }
                } else { summary = order.summary; }
            }

            let items = order.items || [];
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { items = []; }
            }

            // NEW: Try direct printing first via PrinterManager
            if (typeof PrinterManager !== 'undefined') {
                try {
                    console.log('🖨️ Attempting direct print via PrinterManager...');

                    // Ensure connection is active before printing in native mode
                    const saved = PrinterManager.getSavedPrinter();
                    if (saved) {
                        if (saved.type === 'network' && typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge()) {
                            console.log('🖨️ Verifying LAN connection...');
                            await NativeLanPrinter.autoConnect();
                        } else if (saved.type === 'bluetooth' && typeof BluetoothPrinter !== 'undefined') {
                            if (!BluetoothPrinter.isConnected) {
                                console.log('🖨️ Verifying Bluetooth connection...');
                                await BluetoothPrinter.autoReconnect();
                            }
                        }
                    }

                    await PrinterManager.print(order, address, orderId, etaOverride || summary.estimated_time || summary.eta || '');
                    console.log('🖨️ Direct ESC/POS print successful. Bypassing fallback.');
                    return; // Done
                } catch (err) {
                    console.warn('🖨️ Direct print via PrinterManager failed:', err);

                    // If we are in the native app, we DO NOT want to fall back to the OS printer
                    // because the user expects a direct POS print. Show the error directly.
                    const isApp = (typeof window.Capacitor !== 'undefined') ||
                        (typeof window.Android !== 'undefined') ||
                        (typeof window.AndroidPrinter !== 'undefined') ||
                        (window.location.protocol === 'file:') ||
                        (window.location.hostname === 'localhost') ||
                        (window.location.hostname.includes('leo-sushi-berlin.de')) ||
                        (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && window.location.protocol !== 'https:');

                    if (isApp) {
                        alert('Lỗi in (Native):\n' + (err.message || 'Không thể kết nối máy in. Vui lòng kiểm tra nguồn và mạng của máy in.'));
                        return; // Prevent OS fallback (No white screen/browser print)
                    }
                }
            }

            // FALLBACK: Existing browser-based window.print() logic
            const ordIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-10));
            const customerName = `${address.first_name || address.firstName || ''} ${address.last_name || address.lastName || ''}`.trim() || 'Khách lẻ';
            const phone = address.phone || 'N/A';
            const street = address.street || '';
            const postal = address.postal || '';
            const city = address.city || '';
            const note = address.note || summary.note || '';
            const serviceType = order.service_type === 'delivery' ? '🛵 Lieferung' : order.service_type === 'pickup' ? '🥡 Abholung' : '🍽️ Reservierung';
            const pmStr = (order.payment_method || summary.payment_method || '').toLowerCase();
            const payMethod = pmStr.includes('cash') || pmStr.includes('tiền mặt') || pmStr.includes('bar') ? 'Barzahlung' : pmStr.includes('paypal') ? 'PayPal' : (pmStr.includes('card') || pmStr.includes('karte') || pmStr.includes('thẻ') ? 'Kartenzahlung' : 'Barzahlung');

            const now = new Date().toLocaleString('de-DE');
            const orderTimeStr = order.created_at ? new Date(order.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            const orderDateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE');

            let timeDisplay = `${orderDateStr}, ${orderTimeStr}`;
            const estTime = etaOverride || summary.estimated_time || summary.eta || '';
            if (estTime && estTime.includes(':')) {
                timeDisplay = `${orderDateStr}, ${orderTimeStr} - ${estTime}`;
            }

            const subtotal = summary.subtotal ? parseFloat(summary.subtotal) : 0;
            const deliveryFee = summary.delivery_fee ? parseFloat(summary.delivery_fee) : 0;
            const tip = summary.tip ? parseFloat(summary.tip) : 0;
            const discount = summary.discount ? parseFloat(summary.discount) : 0;
            const total = summary.total ? parseFloat(summary.total) : 0;

            const itemsHTML = items.map(item => `
                    <tr>
                        <td style="padding:3px 0;">${item.qty || item.quantity || 1}x ${item.name || 'N/A'}</td>
                        <td style="text-align:right; padding:3px 0;">€${parseFloat(item.total || 0).toFixed(2)}</td>
                    </tr>
                `).join('');

            const billHTML = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Bill #${ordIdShort}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; font-size: 13px; color: #000; background: #fff; width: 80mm; padding: 10px; }
  .center { text-align: center; }
  .bold { font-weight: bold; }
  .sep { border-top: 1px dashed #000; margin: 6px 0; }
  .sep2 { border-top: 2px solid #000; margin: 6px 0; }
  table { width: 100%; border-collapse: collapse; }
  td { vertical-align: top; }
  .total-row td { font-weight: bold; font-size: 15px; padding-top: 4px; }
  .header-logo { font-size: 22px; font-weight: bold; letter-spacing: 2px; margin-bottom: 4px; }
  .info-row { display: flex; justify-content: space-between; padding: 2px 0; }
  .info-label { color: #444; }
  @media print {
    body { width: 80mm; }
    button { display: none; }
  }
</style>
</head>
<body>
  <div class="center">
    <div class="header-logo">LEO SUSHI</div>
    <div>Florastraße 10A, 13187 Berlin</div>
    <div>Tel: 03071055810</div>
  </div>
  <div class="sep2"></div>
  <div class="info-row"><span class="bold">Bestellung #${ordIdShort}</span><span>${timeDisplay}</span></div>
  <div class="info-row"><span class="info-label">Service:</span><span>${serviceType}</span></div>
  <div class="info-row"><span class="info-label">Zahlung:</span><span>${payMethod}</span></div>
  <div class="sep"></div>
  <div><span class="bold">Kunde: </span>${customerName}</div>
  <div><span class="bold">Tel: </span>${phone}</div>
  ${street ? `<div><span class="bold">Adresse: </span>${street}, ${postal} ${city}</div>` : ''}
  <div class="sep"></div>
  <table>
    <thead>
      <tr><td class="bold">Artikel</td><td class="bold" style="text-align:right;">Preis</td></tr>
    </thead>
    <tbody>${itemsHTML}</tbody>
  </table>
  <div class="sep"></div>
  <table>
    ${subtotal > 0 ? `<tr><td>Subtotal</td><td style="text-align:right;">€${subtotal.toFixed(2)}</td></tr>` : ''}
    ${deliveryFee > 0 ? `<tr><td>Liefergebühr</td><td style="text-align:right;">€${deliveryFee.toFixed(2)}</td></tr>` : ''}
    ${tip > 0 ? `<tr><td>Trinkgeld</td><td style="text-align:right;">€${tip.toFixed(2)}</td></tr>` : ''}
    ${discount > 0 ? `<tr><td>Rabatt</td><td style="text-align:right;">-€${discount.toFixed(2)}</td></tr>` : ''}
    <tr class="total-row"><td>GESAMT</td><td style="text-align:right;">€${total.toFixed(2)}</td></tr>
  </table>
  ${note ? `<div class="sep"></div><div><span class="bold">Hinweis: </span>${note}</div>` : ''}
  <div class="sep2"></div>
  <div class="center" style="margin-top:8px;">Vielen Dank für Ihre Bestellung!</div>
  <div class="center" style="font-size:11px; margin-top:4px;">www.leo-sushi-berlin.de</div>
  <div style="margin-top:16px; text-align:center;">
    <button onclick="window.print()" style="padding:8px 24px; font-size:14px; cursor:pointer; background:#000; color:#fff; border:none; border-radius:4px;">🖨️ Drucken</button>
    <button onclick="window.close()" style="padding:8px 24px; font-size:14px; cursor:pointer; background:#666; color:#fff; border:none; border-radius:4px; margin-left:8px;">✕ Schließen</button>
  </div>
</body>
</html>`;

            // FALLBACK: Use hidden iframe for printing to avoid mobile browser navigation issues
            const printIframe = document.createElement('iframe');
            printIframe.id = 'receipt-printer-frame-' + Date.now();
            printIframe.style.visibility = 'hidden';
            printIframe.style.position = 'absolute';
            printIframe.style.width = '0';
            printIframe.style.height = '0';
            printIframe.style.border = 'none';
            document.body.appendChild(printIframe);

            const iframeDoc = printIframe.contentWindow ? printIframe.contentWindow.document : printIframe.contentDocument;
            iframeDoc.open();
            iframeDoc.write(billHTML);
            iframeDoc.close();

            // Wait for iframe content to load before printing
            printIframe.onload = function () {
                try {
                    printIframe.contentWindow.focus();
                    printIframe.contentWindow.print();
                } catch (e) {
                    console.error('Lỗi khi in qua iframe:', e);
                    alert('Không thể tự động khởi động in. Vui lòng thử lại.');
                }
                // Clean up after 10 minutes (plenty of time to close the print dialog)
                setTimeout(() => {
                    if (printIframe && printIframe.parentNode) {
                        printIframe.parentNode.removeChild(printIframe);
                    }
                }, 600000);
            };
        }

        // --- GLOBAL STATE ---
        var allOrdersData = [];
        var allReservationsData = [];
        var knownOrderIds = new Set();
        var knownReservationIds = new Set();
        var isUserInteracting = false;
        var lastInteractionTime = 0;
        var savedScrollPosition = 0;
        var refreshPaused = false;
        var timerInterval = null;

        // Switch tab function - CRITICAL: Re-implemented
        function switchTab(tabId) {
            console.log('🔄 [UI] switchTab called with:', tabId);

            // 1. Update Sidebar Active State
            document.querySelectorAll('.admin-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabId);
            });

            // 2. Update Bottom Nav Active State (Support both VN and DE)
            document.querySelectorAll('.nav-item').forEach(nav => {
                const navText = (nav.querySelector('span')?.textContent || '').toLowerCase().trim();
                const isMatch = (tabId === 'orders' && (navText === 'đơn hàng' || navText === 'bestellungen')) ||
                    (tabId === 'stats' && (navText === 'thống kê' || navText === 'statistik')) ||
                    (tabId === 'reservations' && (navText === 'lịch đặt' || navText === 'reservierungen')) ||
                    (tabId === 'customers' && (navText === 'khách' || navText === 'kunden'));
                nav.classList.toggle('active', isMatch);
            });

            // 3. Update Content Visibility
            const tabContents = {
                'orders': 'ordersContent',
                'reservations': 'reservationsContent',
                'stats': 'statsContent',
                'customers': 'customersContent',
                'menu': 'menuContent',
                'discount-codes': 'discountContent',
                'promotions': 'promotionsContent',
                'holiday-schedule': 'holidayContent'
            };

            Object.values(tabContents).forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });

            const activeContentId = tabContents[tabId];
            const activeContent = document.getElementById(activeContentId);
            if (activeContent) {
                activeContent.style.display = 'block';
                activeContent.style.animation = 'fadeIn 0.3s ease';

                // Show/Hide order filters based on tab
                const filters = document.querySelector('.admin-filters');
                if (filters) {
                    filters.style.display = (tabId === 'orders' || tabId === 'reservations') ? 'flex' : 'none';
                }
            }

            // 4. Load data based on tab
            if (tabId === 'orders') {
                if (typeof loadOrders === 'function') loadOrders();
            } else if (tabId === 'reservations') {
                if (typeof loadReservations === 'function') loadReservations();
            } else if (tabId === 'stats' && typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                AdminStats.loadStats();
            }
        }
        window.switchTab = switchTab;

        // Load ALL data for initial state
        async function loadAllData(silent = false) {
            console.log('🚀 [DATA] loadAllData initiated...');
            try {
                await Promise.all([
                    loadOrders(silent),
                    loadReservations(silent)
                ]);
                if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                    AdminStats.loadStats();
                }
                console.log('✅ [DATA] All data sources loaded successfully.');
            } catch (err) {
                console.error('❌ [DATA] loadAllData error:', err);
            }
        }
        window.loadAllData = loadAllData;

        // Check if modal is open
        function isModalOpen() {
            return document.querySelector('.modal:not([style*="display: none"])') !== null ||
                document.querySelector('[class*="modal"][style*="display: block"]') !== null ||
                document.querySelector('.admin-login-modal[style*="display: flex"]') !== null ||
                document.querySelector('.time-picker-modal:not([style*="display: none"])') !== null;
        }
        window.isModalOpen = isModalOpen;

        // Visual Log / Notifications
        function showMenuNotification(message, type = 'success') {
            console.log(`📣 [NOTIFY] ${type.toUpperCase()}: ${message}`);
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                padding: 12px 24px; border-radius: 12px; color: #fff;
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
                box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideIn 0.3s ease;
            `;
            toast.textContent = (type === 'success' ? '✅ ' : '❌ ') + message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        window.showMenuNotification = showMenuNotification;

        // Close mobile stats dropdown when clicking outside
        document.addEventListener('click', function (event) {
            const dropdowns = document.querySelectorAll('.custom-stats-menu.active');
            dropdowns.forEach(menu => {
                // Check if click is outside the menu and its button
                if (!menu.contains(event.target) && !menu.previousElementSibling.contains(event.target)) {
                    menu.classList.remove('active');
                }
            });
        });

        // Note: getLocalDateStr is also defined at a higher scope, keeping consistent
        // Helper function to get order date (uses local timezone)
        function getOrderDate(order) {
            if (order.date) return order.date;
            if (order.created_at && typeof order.created_at === 'string') {
                // MySQL datetime string like "2026-02-27 00:00:08" -> "2026-02-27"
                return order.created_at.split(' ')[0];
            }
            if (order.summary) {
                let sum = order.summary;
                if (typeof sum === 'string') {
                    try { sum = JSON.parse(sum); } catch (e) { }
                }
                if (sum.timestamp) {
                    return getLocalDateStr(new Date(sum.timestamp));
                }
            }
            if (order.createdAt) {
                if (order.createdAt.seconds) {
                    return getLocalDateStr(new Date(order.createdAt.seconds * 1000));
                } else if (order.createdAt.toDate) {
                    return getLocalDateStr(order.createdAt.toDate());
                } else if (typeof order.createdAt === 'string') {
                    // If it's a MySQL datetime string "2026-02-27 00:00:08", extract date part
                    if (order.createdAt.includes(' ')) {
                        return order.createdAt.split(' ')[0];
                    }
                    return getLocalDateStr(new Date(order.createdAt));
                }
            }
            return getLocalDateStr(new Date());
        }

        // VISUAL LOG for auto-print debugging (works on mobile app without Console)
        function printLog(msg, type = 'info') {
            const el = document.getElementById('autoPrintLogEntries');
            if (!el) return;
            const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const colors = { info: '#94a3b8', success: '#10b981', error: '#ef4444', warn: '#fbbf24' };
            const icons = { info: '📋', success: '✅', error: '❌', warn: '⚠️' };
            el.innerHTML = `<div style="color:${colors[type] || colors.info};border-bottom:1px solid rgba(255,255,255,0.05);padding:2px 0;"> ${icons[type] || ''} <span style="color:rgba(255,255,255,0.4)">${time}</span> ${msg}</div>` + el.innerHTML;
            // Keep only last 15 entries
            const entries = el.querySelectorAll('div');
            if (entries.length > 15) {
                for (let i = 15; i < entries.length; i++) entries[i].remove();
            }
            console.log(`🖨️[AutoPrint] ${msg} `);
        }

        // AUTO-PRINTING ENGINE (Precisely timed)
        function checkAutoPrinting(orders) {
            const isAutoPrintEnabled = localStorage.getItem('autoPrintEnabled') === 'true';
            if (!isAutoPrintEnabled) return;

            let printedIds = [];
            try {
                printedIds = JSON.parse(localStorage.getItem('leo_printed_orders') || '[]');
            } catch (e) { printedIds = []; }

            const printedSet = new Set(printedIds.map(id => id.toString()));
            let newlyPrinted = false;
            const now = Date.now();

            // Count candidates
            let candidateCount = 0;
            let skippedPrinted = 0;
            let skippedLocal = 0;

            orders.forEach(order => {
                const id = (order.order_id || order.id || '').toString();
                if (!id) return;

                if (printedSet.has(id)) {
                    skippedLocal++;
                    return;
                }

                // Handle confirmed or pending orders (admin wants ALL new orders to print)
                let summary = order.summary;
                if (typeof summary === 'string') {
                    try { summary = JSON.parse(summary); } catch (e) { return; }
                }
                if (order.status === 'cancelled' || order.status === 'completed') return;

                // SERVER-SIDE DUPLICATE CHECK: Skip if already marked as printed in DB
                if (summary.is_printed) {
                    printedSet.add(id);
                    newlyPrinted = true;
                    skippedPrinted++;
                    return;
                }

                const createdAtTime = order.created_at ? new Date(order.created_at).getTime() : (summary.timestamp ? new Date(summary.timestamp).getTime() : now);
                const isAncient = (now - createdAtTime > 12 * 60 * 60 * 1000);
                const isDue = !isAncient;

                if (isDue) {
                    candidateCount++;
                    const shortId = id.replace(/^(ORD-|LEO-)/, '').slice(-8);
                    printLog(`Đang in đơn #${shortId}...`, 'info');

                    // ATOMIC LOCK: Try to mark as printed on server FIRST
                    const printUrl = `api/index.php?route=${encodeURIComponent('v1/data/orders/update-printed')}`;
                    fetch(printUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order_id: id })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                if (typeof printOrderBill === 'function') {
                                    printOrderBill(id);
                                    printedSet.add(id);
                                    newlyPrinted = true;
                                    printLog(`IN THÀNH CÔNG #${shortId} `, 'success');

                                    if (typeof showMenuNotification === 'function') {
                                        showMenuNotification('Đã tự động in đơn #' + shortId, 'success');
                                    }
                                }
                                localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
                            } else if (data.already_printed) {
                                printLog(`#${shortId} đã in ở máy khác, bỏ qua`, 'warn');
                                printedSet.add(id);
                                localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
                            } else {
                                printLog(`Lỗi server: ${data.message || JSON.stringify(data)} `, 'error');
                            }
                        })
                        .catch(err => {
                            printLog(`LỖI KẾT NỐI: ${err.message} `, 'error');
                        });
                }
            });

            if (newlyPrinted) {
                const updatedList = Array.from(printedSet).slice(-500);
                localStorage.setItem('leo_printed_orders', JSON.stringify(updatedList));
            }
        }

        // Load orders - load ALL orders, not just today
        async function loadOrders(silent = false, preserveScroll = false) {
            const ordersList = document.getElementById('ordersList');

            // Save scroll position if preserving
            if (preserveScroll && ordersList) {
                savedScrollPosition = ordersList.scrollTop || window.scrollY || 0;
            }

            // Always log for debugging
            console.log(`📡 [DEBUG] loadOrders called (silent=${silent}, preserve=${preserveScroll})`);

            // Check for Mock Data mode
            const isMockMode = window.api && window.api.orders && window.api.orders.isMock;

            if (window.__loadOrdersRunning && !isMockMode) {
                console.warn('⚠️ loadOrders is already running, skipping overlapping call.');
                return;
            }
            window.__loadOrdersRunning = true;

            // Only show loading if not silent and not preserving scroll
            if (!silent && !preserveScroll && ordersList) {
                ordersList.innerHTML = `
                <div class="empty-state">
                    <div class="loading-spinner"></div>
                    <p style="color: rgba(255,255,255,.7);">Đang tải dữ liệu đơn hàng...</p>
                </div>
                `;
            }

            try {
                // Get current status filter
                const statusFilter = document.querySelector('.filter-btn.active[data-status]')?.dataset.status || 'all';

                // Call API to get ALL orders (for new order detection)
                let response;
                const token = localStorage.getItem('leo_admin_session_token');

                if (window.api && window.api.orders && window.api.orders.list) {
                    try {
                        const result = await window.api.orders.list('all');
                        response = {
                            ok: true,
                            headers: { get: () => 'application/json' },
                            json: async () => result
                        };
                    } catch (apiErr) {
                        console.warn('⚠️ API Library error, falling back to fetch:', apiErr);
                        const url = `api/index.php?route=${encodeURIComponent('v1/data/orders')}&status=all`;
                        response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            credentials: 'include'
                        });
                    }
                } else {
                    // Fallback
                    const url = `api/index.php?route=${encodeURIComponent('v1/data/orders')}&status=all`;
                    response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        credentials: 'include'
                    });
                }

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('❌ Non-JSON response from orders API:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response. This might be a server error. Please check the server logs.');
                }

                let data;
                try {
                    data = await response.json();
                } catch (jsonErr) {
                    const rawText = await response.text();
                    console.error('❌ JSON Parse Error. Raw response:', rawText);
                    throw new Error(`Server returned invalid JSON.Raw response: ${rawText.substring(0, 200)}...`);
                }

                console.log('📦 Orders API Response:', data);

                if (data.success && data.orders) {
                    let combinedData = [...data.orders];

                    // NEW: Merge reservations if on 'all' or specific criteria
                    if (statusFilter === 'all' || statusFilter === 'pending') {
                        try {
                            const resUrl = `api/index.php?route=v1/data/reservations${statusFilter !== 'all' ? '&status=' + statusFilter : ''}`;
                            const resResponse = await fetch(resUrl, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('leo_admin_session_token')}`
                                },
                                credentials: 'include'
                            });
                            if (resResponse.ok) {
                                const resData = await resResponse.json();
                                if (resData.success && resData.reservations) {
                                    const taggedReservations = resData.reservations.map(r => ({
                                        ...r,
                                        order_id: r.id || r.order_id || r.reservation_id,
                                        service_type: 'reservation',
                                        is_merged_reservation: true,
                                        created_at: r.created_at || (r.date && r.time ? `${r.date}T${r.time}` : r.date)
                                    }));
                                    combinedData = [...combinedData, ...taggedReservations];
                                    console.log('➕ Merged reservations into view:', taggedReservations.length);
                                }
                            } else {
                                console.warn(`⚠️ Reservations API returned status ${resResponse.status}`);
                            }
                        } catch (resErr) {
                            console.error('⚠️ Could not merge reservations (silent fail):', resErr);
                        }
                    }

                    allOrdersData = combinedData;
                    console.log('✅ Loaded data (merged):', allOrdersData.length);
                    window.__loadOrdersRunning = false;

                    // Check for genuinely NEW orders
                    const previousOrderIds = new Set(knownOrderIds);
                    allOrdersData.forEach(order => {
                        if (order.order_id) {
                            knownOrderIds.add(order.order_id.toString());
                        }
                    });

                    // Find truly new orders
                    if (previousOrderIds.size > 0) {
                        const newOrderIds = allOrdersData
                            .filter(order => {
                                const id = order.order_id?.toString();
                                return id && !previousOrderIds.has(id) && (!order.status || order.status === 'pending');
                            })
                            .map(order => order.order_id.toString());

                        if (newOrderIds.length > 0) {
                            const newOrders = allOrdersData.filter(order =>
                                order.order_id && newOrderIds.includes(order.order_id.toString())
                            );

                            newOrders.forEach(order => {
                                console.log('🔔 Neue Bestellung/Reservierung gefunden!', order);
                                showNewOrderNotification(order);
                            });
                        }
                    }

                    // Run precise auto-printing
                    try {
                        const realOrders = allOrdersData.filter(o => !o.is_merged_reservation);
                        checkAutoPrinting(realOrders);
                    } catch (autoPrintErr) {
                        console.error('❌ Error in checkAutoPrinting:', autoPrintErr);
                    }

                    // Check pending orders and alarm
                    checkPendingOrdersAndAlarm(allOrdersData);

                    // Apply status filter
                    let filteredOrders = allOrdersData;
                    if (statusFilter !== 'all') {
                        filteredOrders = allOrdersData.filter(o => (o.status || 'pending') === statusFilter);
                    }

                    // Apply date picker filter if set
                    const datePicker = document.getElementById('datePicker');
                    const selectedDate = datePicker ? datePicker.value : '';

                    if (selectedDate) {
                        filteredOrders = filteredOrders.filter(o => {
                            const orderDate = getOrderDate(o);
                            return orderDate === selectedDate;
                        });
                    }

                    console.log(`📊 [DEBUG] Filtered orders to display: ${filteredOrders.length}`);

                    // Smart update: chỉ update phần thay đổi, không re-render toàn bộ
                    if (filteredOrders.length > 0) {
                        if (preserveScroll) {
                            smartUpdateOrders(filteredOrders);
                            setTimeout(() => {
                                const ordersList = document.getElementById('ordersList');
                                if (ordersList) ordersList.scrollTop = savedScrollPosition;
                            }, 50);
                        } else {
                            displayOrders(filteredOrders);
                        }
                        initOrderTimers();
                    } else {
                        console.log('ℹ️ [DEBUG] No filtered orders found, but data exists. Status:', statusFilter, 'Date:', selectedDate);
                        ordersList.innerHTML = `
                            <div class="empty-state">
                                <div class="empty-state-icon">📦</div>
                                <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Không có đơn hàng cho bộ lọc này</h3>
                                <p style="color: rgba(255,255,255,.5);">Thử nhấn "Tất cả thời gian" hoặc đổi bộ lọc.</p>
                                <button class="btn-action" onclick="clearDatePicker(); loadOrders()" style="margin-top:15px;">Xem tất cả</button>
                            </div>
                        `;
                    }
                } else {
                    console.error('❌ API returned error:', data);
                    throw new Error(data.message || 'Fehler beim Laden der Bestellungen');
                }
            } catch (error) {
                window.__loadOrdersRunning = false;
                console.error('❌ Error in loadOrders:', error);
                const ordersList = document.getElementById('ordersList');
                if (!silent || (ordersList && ordersList.innerHTML.includes('Đang tải dữ liệu'))) {
                    ordersList.innerHTML = `
                    <div class="empty-state" style="background: rgba(239,68,68,.1); border: 2px solid rgba(239,68,68,.3);">
                        <div class="empty-state-icon">❌</div>
                        <h3 style="color: #ef4444; margin: 16px 0 8px; font-size: 18px;">Lỗi kết nối máy chủ</h3>
                        <p style="color: rgba(255,255,255,.7); margin-bottom: 12px;">${error.message || 'Unknown error'}</p>
                        <button class="btn-action btn-view" onclick="loadOrders()" style="margin-top: 12px;">Thử lại</button>
                    </div>
                    `;
                }
            }
        }

        // ORDER COUNTDOWN TIMERS ENGINE
        function initOrderTimers() {
            if (timerInterval) clearInterval(timerInterval);
            updateAllTimers();
            timerInterval = setInterval(updateAllTimers, 1000);
        }

        function updateAllTimers() {
            if (!allOrdersData || allOrdersData.length === 0) return;

            // Process ALL confirmed orders from the global dataset to ensure timers work 
            // regardless of the current tab or filter
            const confirmedOrders = allOrdersData.filter(o => o.status === 'confirmed');

            if (confirmedOrders.length === 0) {
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    console.log('⏱️ No confirmed orders, timer interval cleared.');
                }
                return;
            }

            confirmedOrders.forEach(order => {
                const orderId = order.order_id || order.id;
                const timerContainer = document.getElementById(`timers - ${orderId} `);

                if (!timerContainer) {
                    // If card is not in current view/DOM, skip but keep interval running for others
                    return;
                }

                let summary = order.summary;
                if (typeof summary === 'string') {
                    try { summary = JSON.parse(summary); } catch (e) { return; }
                }

                if (!summary || !summary.confirmed_at) return;

                const confirmedAt = new Date(summary.confirmed_at).getTime();

                let deadline;
                // If order has a scheduled delivery time, count down to that time
                if (summary.scheduled_delivery_time && summary.scheduled_delivery_time.time) {
                    const schedDate = summary.scheduled_delivery_time.date || new Date().toISOString().split('T')[0];
                    const schedTimeStr = summary.scheduled_delivery_time.time; // e.g. "13:45"

                    // Parse as Berlin time manually to prevent timezone offset bugs (e.g. viewing from VN)
                    const orderDateObj = new Date(schedDate);
                    const month = orderDateObj.getMonth() + 1;
                    // Simple DST check for Europe/Berlin (UTC+1 Winter / UTC+2 Summer)
                    const isDST = month >= 4 && month <= 10;
                    const tzOffset = isDST ? '+02:00' : '+01:00';

                    deadline = new Date(`${schedDate}T${schedTimeStr}:00${tzOffset} `).getTime();
                } else {
                    // Use total_minutes from order data, or derive default from service_type
                    let totalMinutes = summary.total_minutes;
                    if (!totalMinutes || totalMinutes <= 0) {
                        // Default based on service type: delivery=50min, pickup/dine-in=20min
                        const svcType = order.service_type || '';
                        totalMinutes = (svcType === 'delivery') ? 50 : 20;
                    }
                    deadline = confirmedAt + totalMinutes * 60 * 1000;
                }

                const now = Date.now();
                const totalDuration = deadline - confirmedAt;
                const remaining = Math.max(0, deadline - now);
                const elapsed = now - confirmedAt;

                const progress = Math.min(100, (elapsed / totalDuration) * 100);

                // Update UI
                const timerVal = timerContainer.querySelector('.timer-value');
                const timerFill = timerContainer.querySelector('.timer-progress-fill');

                if (timerVal) timerVal.innerText = formatTime(remaining);
                if (timerFill) timerFill.style.width = `${progress}% `;

                // Alerts
                if (remaining < 5 * 60 * 1000) { // < 5 mins
                    timerContainer.classList.add('status-warning');
                } else {
                    timerContainer.classList.remove('status-warning');
                }
            });
        }

        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const mins = Math.floor(totalSeconds / 60);
            const secs = totalSeconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
        }

        // Apply date filter to orders
        function applyDateFilterToOrders(orders) {
            const dateFilter = document.getElementById('dateFilter')?.value || 'today'; // Default to 'today' instead of 'all'
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dateFilter === 'all') {
                return orders;
            } else if (dateFilter === 'today') {
                const todayStr = getLocalDateStr(today);
                return orders.filter(o => {
                    const orderDate = getOrderDate(o);
                    const isPending = (o.status || 'pending') === 'pending';
                    // Include if it's today OR if it's a NEW (pending) order from any date
                    return orderDate === todayStr || isPending;
                });
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return orders.filter(o => {
                    const orderDate = new Date(getOrderDate(o));
                    return orderDate >= weekAgo;
                });
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(today);
                monthAgo.setDate(monthAgo.getDate() - 30);
                return orders.filter(o => {
                    const orderDate = new Date(getOrderDate(o));
                    return orderDate >= monthAgo;
                });
            } else if (dateFilter === 'custom') {
                const startDate = document.getElementById('customDateStart')?.value;
                const endDate = document.getElementById('customDateEnd')?.value;
                if (!startDate || !endDate) return orders;
                return orders.filter(o => {
                    const orderDate = getOrderDate(o);
                    return orderDate >= startDate && orderDate <= endDate;
                });
            }
            return orders;
        }

        // Apply date filter
        function applyDateFilter() {
            const dateFilter = document.getElementById('dateFilter')?.value || 'today'; // Default to 'today' instead of 'all'
            const customStart = document.getElementById('customDateStart');
            const customEnd = document.getElementById('customDateEnd');

            if (dateFilter === 'custom') {
                if (customStart) customStart.style.display = 'block';
                if (customEnd) customEnd.style.display = 'block';
            } else {
                if (customStart) customStart.style.display = 'none';
                if (customEnd) customEnd.style.display = 'none';
            }

            // Re-display orders with filter
            if (allOrdersData && allOrdersData.length > 0) {
                const filteredOrders = applyDateFilterToOrders(allOrdersData);
                // displayOrders will sort orders internally, so just pass filtered orders
                displayOrders(filteredOrders);
            } else {
                loadOrders();
            }
        }

        // Helper function to get status text
        function getStatusText(status) {
            const statusMap = {
                'pending': 'Ausstehend',
                'confirmed': 'Bestätigt',
                'completed': 'Abgeschlossen',
                'cancelled': 'Storniert',
                'processing': 'In Bearbeitung'
            };
            return statusMap[status] || statusMap['pending'] || 'Ausstehend';
        }

        // Display orders function
        // Smart update orders - chỉ update phần thay đổi
        function smartUpdateOrders(newOrders) {
            const ordersList = document.getElementById('ordersList');
            if (!ordersList) return;

            // If empty state is shown and we have new orders, do a full render once
            if (ordersList.querySelector('.empty-state') && newOrders.length > 0) {
                displayOrders(newOrders);
                return;
            }

            // Get existing order cards
            const existingCards = ordersList.querySelectorAll('[data-order-id]');
            const existingOrderIds = new Set();
            existingCards.forEach(card => {
                const orderId = card.getAttribute('data-order-id');
                if (orderId) existingOrderIds.add(orderId);
            });

            const updatedOrders = [];
            const ordersToAdd = [];
            const newOrderIdList = new Set();

            newOrders.forEach(order => {
                const orderId = (order.order_id || order.id || '').toString();
                if (!orderId) return;
                newOrderIdList.add(orderId);

                if (!existingOrderIds.has(orderId)) {
                    ordersToAdd.push(order);
                } else {
                    const existingCard = ordersList.querySelector(`[data-order-id="${orderId}"]`);
                    if (existingCard) {
                        const currentStatus = existingCard.querySelector('.card-status')?.className || '';
                        const newStatusClass = `card-status status-${order.status || 'pending'}`;

                        if (currentStatus !== newStatusClass) {
                            updatedOrders.push(order);
                        }
                    }
                }
            });

            // Remove orders that are no longer in the list (e.g. filtered out)
            existingCards.forEach(card => {
                const orderId = card.getAttribute('data-order-id');
                if (orderId && !newOrderIdList.has(orderId)) {
                    card.remove();
                }
            });

            // Update changed orders
            updatedOrders.forEach(order => {
                const orderId = (order.order_id || order.id || '').toString();
                const existingCard = ordersList.querySelector(`[data-order-id="${orderId}"]`);
                if (existingCard) {
                    const newCardHTML = renderOrderCard(order);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newCardHTML;
                    const newCardElement = tempDiv.firstElementChild;
                    existingCard.replaceWith(newCardElement);
                }
            });

            // Add new orders at the top
            if (ordersToAdd.length > 0) {
                ordersToAdd.reverse().forEach(order => {
                    const newCardHTML = renderOrderCard(order);
                    ordersList.insertAdjacentHTML('afterbegin', newCardHTML);
                });
            }

            if (updatedOrders.length > 0 || ordersToAdd.length > 0) {
                initOrderTimers();
            }
        }

        // Helper function to render a single order card
        function renderOrderCard(order, forcedDate = null) {
            // Parse summary first so we can use it for ID
            let summary = {};
            if (order.summary) {
                if (typeof order.summary === 'string') {
                    try { summary = JSON.parse(order.summary); } catch (e) { }
                } else { summary = order.summary; }
            }

            const isReservation = order.is_merged_reservation || (order.service_type || '').toLowerCase() === 'reservation';
            const orderId = order.order_id || order.id || (summary.timestamp ? summary.timestamp : 'N/A');
            const orderIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-8));
            const status = order.status || 'pending';
            const statusText = getStatusText(status);

            // Handle different createdAt formats
            let orderTime = 'Unbekannt';
            try {
                if (order.created_at) {
                    orderTime = new Date(order.created_at).toLocaleString('de-DE');
                } else if (summary.timestamp) {
                    orderTime = new Date(summary.timestamp).toLocaleString('de-DE');
                } else if (order.createdAt) {
                    orderTime = new Date(order.createdAt).toLocaleString('de-DE');
                }
            } catch (e) {
                console.error('Error parsing order date:', e);
                orderTime = order.created_at || summary.timestamp || order.createdAt || 'Unbekannt';
            }

            // IMPORTANT: Ensure the card uses the SAME date as the grouping header if forced
            if (forcedDate) {
                // Update orderTime display if it doesn't match the grouping date (to avoid confusion)
                // If forcedDate is "2026-03-24", and orderTime is "23.03.2026, 23:59", we might have a shift.
            }

            const total = isReservation ? (order.items_total || '0,00 €') : (summary.total || order.order_total || '0,00 €');

            let customerName = 'Kunde';
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

            return `
                <div class="order-card ${status}" data-order-id="${orderId}">
                    <div class="card-header">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div class="order-id" style="font-size: 16px; font-weight: 700;">#${orderIdShort}</div>
                                ${(() => {
                    const type = (order.service_type || '').toLowerCase();
                    if (type === 'reservation') return '<span style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">ĐẶT BÀN</span>';
                    if (type === 'dinein') return '<span style="background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">ĂN TẠI CHỖ</span>';
                    if (type === 'delivery') return '<span style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">GIAO HÀNG</span>';
                    if (type === 'pickup') return '<span style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">MANG VỀ</span>';
                    return '';
                })()}
                            </div>
                            <div style="font-size: 12px; color: rgba(255,255,255,0.5);">${orderTime}</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${(isReservation || summary.scheduled_delivery_time) ? `
                            <div class="scheduled-badge" style="background: ${isReservation ? 'rgba(16,185,129,0.15)' : 'rgba(229,207,142,0.15)'}; border: 1px solid ${isReservation ? '#10b981' : 'var(--gold)'}; color: ${isReservation ? '#10b981' : 'var(--gold)'}; padding: 4px 8px; border-radius: 6px; font-size: 11px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px;">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span>${isReservation ? '🪑' : '🕐'}</span>
                                    <strong>${isReservation ? `Khách: ${order.guests || 1}` : `Hẹn: ${summary.scheduled_delivery_time.time}`}</strong>
                                </div>
                                <div style="font-size: 9px; opacity: 0.8; margin-left: 18px;">${isReservation ? `Giờ: ${order.time || '--:--'}` : `Ngày: ${summary.scheduled_delivery_time.date || ''}`}</div>
                            </div>
                            ` : ''}
                            <span class="card-status status-${status}">${statusText}</span>
                        </div>
                    </div>
                    
                    <div class="card-info">
                        <div class="info-row">
                            <span class="label">👤 Khách hàng</span>
                            <span class="value">${customerName} ${phone !== 'N/A' ? `<a href="tel:${phone}" style="margin-left:8px; color:var(--gold); text-decoration:none;">📞 Gọi</a>` : ''}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">💳 Thanh toán</span>
                            <span class="value">${(() => {
                    const pm = (order.payment_method || summary.payment_method || '').toLowerCase();
                    return pm.includes('cash') || pm.includes('tiền mặt') || pm.includes('bar') ? 'Tiền mặt' : (pm.includes('paypal') ? 'PayPal' : (pm.includes('card') || pm.includes('karte') || pm.includes('thẻ') ? 'Thẻ' : 'Tiền mặt'));
                })()} ${summary.payment_status === 'paid' ? '✅' : '❌'}</span>
                        </div>
                        ${note ? `
                        <div class="info-row" style="margin-top: 8px; background: rgba(229,207,142,0.05); padding: 8px; border-radius: 8px; border-left: 3px solid var(--gold);">
                            <span class="value" style="font-style: italic; font-size: 13px; color: #eee; white-space: normal;">📝 ${note}</span>
                        </div>
                        ` : ''}
                        <div class="info-row" style="border-top: 1px solid rgba(229,207,142,0.1); padding-top: 8px; margin-top: 5px;">
                            <span class="label" style="color: var(--gold); font-weight: 600;">Tổng cộng</span>
                            <span class="value" style="color: var(--gold); font-size: 18px; font-weight: 800;">${total}</span>
                        </div>
                    </div>

                    ${status === 'confirmed' && summary.confirmed_at ? `
                    <div class="order-timers" id="timers-${orderId}" style="margin-top: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">
                        <div class="timer-phase completion-phase">
                            <div class="timer-header" style="color: #10b981;">
                                <span>⏳ Thời gian còn lại:</span>
                                <span class="timer-value" style="color: #10b981; font-size: 16px;">--:--</span>
                            </div>
                            <div class="timer-progress-bg" style="height: 4px; background: rgba(255,255,255,0.05);">
                                <div class="timer-progress-fill" style="width: 0%; background: #10b981;"></div>
                            </div>
                        </div>
                    </div>
                    ` : ''
                }

            <div class="card-actions">
                ${status === 'pending' ? `
                            <button class="btn-action btn-confirm" onclick="${isReservation ? `confirmReservation('${orderId}')` : `confirmOrder('${orderId}')`}" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff;">Duyệt</button>
                            <button class="btn-action btn-cancel" onclick="${isReservation ? `cancelReservation('${orderId}')` : `cancelOrder('${orderId}')`}">Hủy</button>
                        ` : ''}
                ${(status === 'confirmed' || status === 'in_delivery') && !isReservation ? `
                            <button class="btn-action btn-confirm" onclick="completeOrder('${orderId}')" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); border: none;">✓ Hoàn thành</button>
                        ` : ''}
                <button class="btn-action btn-view" onclick="${isReservation ? `alert('Đặt bàn: ${customerName}\\nSố người: ${order.guests || 1}\\nThời gian: ${order.date} ${order.time}\\nGhi chú: ${note || 'Không có'}')` : `viewOrderDetails('${orderId}')`}" style="grid-column: ${status === 'pending' || isReservation ? 'span 2' : 'span 1'}; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">${status === 'pending' ? 'Xem nhanh' : 'Chi tiết'}</button>
                ${(status !== 'pending' && !isReservation) ? `<button class="btn-action" onclick="printOrderBill('${orderId}')" style="grid-column: span 2; margin-top: 4px; border: 1px dashed rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.8); transition: all 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.4)';" onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255,255,255,0.2)';">🖨️ In Hóa Đơn (Bill)</button>` : ''}
            </div>
                </div>
                `;
        }

        // Helper function to get a date string (YYYY-MM-DD) from an order object
        function getOrderDate(order) {
            let date;
            if (order.date) {
                // If date is already a string "YYYY-MM-DD", return it
                if (typeof order.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(order.date)) {
                    return order.date;
                }
            }

            if (order.created_at) {
                date = new Date(order.created_at);
            } else if (order.summary) {
                let sum = order.summary;
                if (typeof sum === 'string') {
                    try { sum = JSON.parse(sum); } catch (e) { }
                }
                if (sum && sum.timestamp) {
                    date = new Date(sum.timestamp);
                }
            } else if (order.createdAt) {
                if (order.createdAt.seconds) {
                    date = new Date(order.createdAt.seconds * 1000);
                } else if (order.createdAt.toDate) {
                    date = order.createdAt.toDate();
                } else if (typeof order.createdAt === 'string') {
                    date = new Date(order.createdAt);
                }
            } else if (order.timestamp) {
                date = new Date(order.timestamp);
            }

            if (date && !isNaN(date.getTime())) {
                // Use local date instead of ISO string (UTC) to avoid timezone shift
                return getLocalDateStr(date);
            }

            // Fallback to today but log a warning if needed
            return getLocalDateStr(new Date());
        }

        // Helper function to get local date string (YYYY-MM-DD)
        function getLocalDateStr(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function displayOrders(orders) {
            console.log('🖥️ [DISPLAY] displayOrders called with:', orders ? orders.length : 0, 'orders');
            const ordersList = document.getElementById('ordersList');
            if (!ordersList) {
                console.error('❌ [ERROR] Element #ordersList not found in DOM!');
                return;
            }

            if (!orders || orders.length === 0) {
                console.log('ℹ️ [DISPLAY] No orders to display, showing empty state');
                ordersList.innerHTML = `
                <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Không tìm thấy đơn hàng nào</h3>
                        <p style="color: rgba(255,255,255,.5);">Đơn hàng mới nhất sẽ xuất hiện ở đây</p>
                        <button onclick="loadOrders()" style="margin-top:15px; padding:8px 20px; background:var(--gold); border:none; border-radius:5px; cursor:pointer; color:#000; font-weight:bold;">🔄 Thử tải lại</button>
                    </div>
                `;
                return;
            }

            // Sort orders by timestamp (newest first)
            const sortedOrders = [...orders].sort((a, b) => {
                const getTs = (o) => {
                    if (o.created_at) return new Date(o.created_at).getTime();
                    if (o.createdAt) {
                        if (typeof o.createdAt === 'string') return new Date(o.createdAt).getTime();
                        if (o.createdAt.seconds) return o.createdAt.seconds * 1000;
                    }
                    if (o.timestamp) return new Date(o.timestamp).getTime();
                    if (o.summary) {
                        let sum = o.summary;
                        if (typeof sum === 'string') {
                            try { sum = JSON.parse(sum); } catch (e) { }
                        }
                        if (sum && sum.timestamp) return new Date(sum.timestamp).getTime();
                    }
                    return 0;
                };
                return getTs(b) - getTs(a);
            });

            let html = '';
            let lastDate = '';
            const today = getLocalDateStr(new Date());

            sortedOrders.forEach(order => {
                const orderDate = getOrderDate(order);

                if (orderDate !== lastDate) {
                    const dateObj = new Date(orderDate);
                    const formattedDate = isNaN(dateObj.getTime()) ? orderDate : dateObj.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    html += `
                <div class="date-group-header" style="
            grid-column: 1 / -1;
            padding: 12px 20px;
            margin: 20px 0 10px 0;
            background: rgba(229, 207, 142, 0.1);
            border-left: 4px solid var(--gold);
            color: var(--gold);
            font-weight: 700;
            font-size: 16px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            ">
                <span>📅 ${formattedDate}</span>
                    ${orderDate === today ? '<span style="font-size: 12px; background: var(--gold); color: #000; padding: 2px 8px; border-radius: 10px; font-weight: bold;">HEUTE</span>' : ''}
                </div>
                `;
                    lastDate = orderDate;
                }
                html += renderOrderCard(order, orderDate);
            });

            ordersList.innerHTML = html;
            console.log('✅ [DISPLAY] Orders list DOM updated');
        }

        // Global complete order function
        window.completeOrder = async function (orderId) {
            if (!confirm('Xác nhận đơn hàng này đã hoàn thành và khách đã nhận xong?')) {
                return;
            }
            try {
                const result = await (typeof ordersAPI !== 'undefined' ?
                    ordersAPI.updateStatus(orderId, 'completed', 'confirmed') :
                    api.orders.updateStatus(orderId, 'completed', 'confirmed'));

                if (result && result.success) {
                    if (window.showMenuNotification) {
                        showMenuNotification('✅ Đã xác minh đơn hàng hoàn thành!', 'success');
                    } else {
                        alert('Đã xác minh đơn hàng hoàn thành!');
                    }
                    if (typeof loadOrders === 'function') loadOrders(true, true);
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') AdminStats.loadStats();
                } else {
                    throw new Error(result.message || 'Lỗi không xác định khi cập nhật');
                }
            } catch (error) {
                console.error('❌ Lỗi khi xác minh đơn hoàn thành:', error);
                alert('Lỗi: ' + error.message);
            }
        };

        // Global delete order function
        window.deleteOrder = async function (orderId) {
            if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.')) {
                return;
            }

            try {
                console.log('🗑️ Xóa đơn hàng:', orderId);
                const result = await (typeof ordersAPI !== 'undefined' ? ordersAPI.deleteOrder(orderId) : api.orders.deleteOrder(orderId));

                if (result && result.success) {
                    // Remove from UI
                    const cards = document.querySelectorAll(`[data - order - id="${orderId}"]`);
                    cards.forEach(card => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateX(20px)';
                        setTimeout(() => card.remove(), 300);
                    });

                    // Show notification
                    if (window.showToast) window.showToast('Đơn hàng đã được xóa thành công', 'success');
                    else alert('✅ Đơn hàng đã được xóa thành công');

                    // Update stats
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') AdminStats.loadStats();
                } else {
                    throw new Error(result.message || 'Lỗi không xác định khi xóa đơn hàng');
                }
            } catch (error) {
                console.error('❌ Lỗi khi xóa đơn hàng:', error);
                alert('Lỗi khi xóa đơn hàng: ' + error.message);
            }
        };

        // --- FILTER & DATA LOADING FUNCTIONS ---

        /** 
         * Filter orders by status (all, pending, confirmed, cancelled)
         */
        window.filterOrdersByStatus = function (status) {
            console.log('🔍 [FILTER] Orders by status:', status);

            // Update UI buttons
            document.querySelectorAll('#ordersContent .filter-btn').forEach(btn => {
                if (btn.getAttribute('data-status') === status) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Update mobile select if exists
            const mobileSelect = document.querySelector('#ordersContent .mobile-status-filter');
            if (mobileSelect) mobileSelect.value = status;

            // Reload orders with new filter
            if (typeof loadOrders === 'function') {
                loadOrders(false, false);
            }
        };

        /**
         * Filter orders by search text
         */
        window.filterOrders = function () {
            const searchText = document.getElementById('orderSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.orders-list .order-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const orderId = card.getAttribute('data-order-id') || '';
                if (text.includes(searchText) || orderId.toLowerCase().includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        /**
         * Filter reservations by status
         */
        window.filterReservationsByStatus = function (status) {
            console.log('🔍 [FILTER] Reservations by status:', status);

            document.querySelectorAll('#reservationsContent .filter-btn').forEach(btn => {
                if (btn.getAttribute('data-status') === status) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            const mobileSelect = document.querySelector('#reservationsContent .mobile-status-filter');
            if (mobileSelect) mobileSelect.value = status;

            if (typeof loadReservations === 'function') {
                loadReservations(false);
            }
        };

        /**
         * Filter reservations by search text
         */
        window.filterReservations = function () {
            const searchText = document.getElementById('reservationSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('#reservationsList .order-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // Load reservations
        async function loadReservations(preserveScroll = false) {

            // Save scroll position if preserving
            if (preserveScroll) {
                savedScrollPosition = reservationsList.scrollTop || window.scrollY || 0;
            }

            // Only show loading if not preserving scroll
            if (!preserveScroll) {
                reservationsList.innerHTML = `
                <div class="empty-state">
                    <div class="loading-spinner"></div>
                    <p style="color: rgba(255,255,255,.7);">Reservierungen werden geladen...</p>
                </div>
                `;
            }

            try {
                // Get current status filter from reservationsContent only
                const statusFilter = document.querySelector('#reservationsContent .filter-btn.active[data-status]')?.dataset.status ||
                    document.querySelector('#reservationsContent .filter-btn[data-status="all"]')?.dataset.status ||
                    'all';

                console.log('🔍 Loading reservations with filter:', statusFilter);

                // Call API to get reservations (GET request với query parameter)
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                // Encode route parameter to handle slashes properly
                const url = `api/index.php?route=${encodeURIComponent('v1/data/reservations')}${statusFilter !== 'all' ? '&status=' + encodeURIComponent(statusFilter) : ''}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('❌ Non-JSON response from reservations API:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response. This might be a server error. Please check the server logs.');
                }

                const data = await response.json();

                if (data.success && data.reservations) {
                    console.log('📅 Loaded reservations from API:', data.reservations.length);

                    // Filter reservations by selected date if date picker is set
                    const resDatePicker = document.getElementById('reservationDatePicker');
                    const selectedResDate = resDatePicker ? resDatePicker.value : '';

                    let displayData = data.reservations;
                    if (selectedResDate) {
                        displayData = displayData.filter(r => r.date === selectedResDate);
                    }

                    // Apply status filter first
                    let filteredReservations = displayData;
                    if (statusFilter !== 'all') {
                        filteredReservations = displayData.filter(r => (r.status || 'pending') === statusFilter);
                    }

                    // If no date selected, only show upcoming + pending
                    let upcomingReservations = filteredReservations;
                    if (!selectedResDate) {
                        const today = new Date().toISOString().split('T')[0];
                        upcomingReservations = filteredReservations.filter(r => {
                            const isPending = (r.status || 'pending') === 'pending';
                            return r.date >= today || isPending;
                        });
                    }

                    // Always check for new reservations (even in silent mode - we still want sound!)
                    const previousReservationIds = new Set(knownReservationIds);
                    const currentReservationIds = new Set();

                    upcomingReservations.forEach(reservation => {
                        if (reservation.reservation_id) {
                            currentReservationIds.add(reservation.reservation_id.toString());
                        }
                    });

                    // Find new reservations
                    if (previousReservationIds.size > 0) {
                        const newReservationIds = [...currentReservationIds].filter(id => !previousReservationIds.has(id));
                        if (newReservationIds.length > 0) {
                            const newReservations = upcomingReservations.filter(reservation =>
                                reservation.reservation_id && newReservationIds.includes(reservation.reservation_id.toString())
                            );

                            newReservations.forEach(reservation => {
                                // Always play sound, even in silent mode
                                console.log('🔔 Neue Reservierung:', reservation);
                                playNotificationSound();

                                // Show notification UI only if not in silent mode
                                if (!preserveScroll) {
                                    showNewReservationNotification(reservation);
                                } else {
                                    // Silent mode: chỉ phát tiếng + browser notification
                                    if ('Notification' in window && Notification.permission === 'granted') {
                                        const reservationId = reservation.reservation_id || reservation.reservationId || 'N/A';
                                        const reservationIdShort = reservationId.toString().replace(/^(RES-)/, '').slice(-8);
                                        const customerName = `${reservation.first_name || ''} ${reservation.last_name || ''} `.trim() || 'Kunde';
                                        const date = reservation.date || '';
                                        const time = reservation.time || '';

                                        new Notification('📅 Neue Reservierung!', {
                                            body: `Reservierung #${reservationIdShort} - ${customerName} - ${date} ${time} `,
                                            icon: '/assets/logo.png',
                                            badge: '/assets/logo.png',
                                            tag: `reservation - ${reservationId} `,
                                            requireInteraction: false
                                        });
                                    }
                                }
                            });
                        }
                    }

                    knownReservationIds = currentReservationIds;

                    if (upcomingReservations.length > 0) {
                        // Use smart update only during auto-refresh (preserveScroll = true)
                        // Use full render when user clicks filter or first load (preserveScroll = false)
                        if (preserveScroll) {
                            // Smart update mode: chỉ update thay đổi (auto-refresh)
                            try {
                                smartUpdateReservations(upcomingReservations);

                                // Restore scroll position
                                setTimeout(() => {
                                    const reservationsList = document.getElementById('reservationsList');
                                    if (reservationsList) {
                                        reservationsList.scrollTop = savedScrollPosition;
                                    } else {
                                        window.scrollTo(0, savedScrollPosition);
                                    }
                                }, 50);
                            } catch (e) {
                                console.error('Error in smartUpdateReservations, falling back to full render:', e);
                                displayReservations(upcomingReservations);
                            }
                        } else {
                            // Full render mode (user clicked filter or first load)
                            displayReservations(upcomingReservations);
                        }
                    } else {
                        reservationsList.innerHTML = `
                <div class="empty-state">
                                <div class="empty-state-icon">📅</div>
                                <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Keine Reservierungen</h3>
                                <p style="color: rgba(255,255,255,.5);">Neue Reservierungen werden hier angezeigt</p>
                            </div>
                `;
                    }
                } else {
                    throw new Error(data.message || 'Fehler beim Laden der Reservierungen');
                }
            } catch (error) {
                console.error('Error loading reservations:', error);
                reservationsList.innerHTML = `
                <div class="empty-state" style="background: rgba(239,68,68,.1); border: 2px solid rgba(239,68,68,.3);">
                                <div class="empty-state-icon">❌</div>
                                <h3 style="color: #ef4444; margin: 16px 0 8px; font-size: 18px;">Fehler beim Laden der Reservierungen</h3>
                                <p style="color: rgba(255,255,255,.7); margin-bottom: 12px;">${error.message || 'Unknown error'}</p>
                                <button class="btn-action btn-view" onclick="loadReservations()" style="margin-top: 12px;">Erneut versuchen</button>
                            </div>
                `;
            }
        }

        // Smart update reservations - chỉ update phần thay đổi
        function smartUpdateReservations(newReservations) {
            const reservationsList = document.getElementById('reservationsList');
            if (!reservationsList) return;

            // Get existing reservation cards
            const existingCards = reservationsList.querySelectorAll('[data-reservation-id]');
            const existingReservationIds = new Set();
            existingCards.forEach(card => {
                const reservationId = card.getAttribute('data-reservation-id');
                if (reservationId) existingReservationIds.add(reservationId);
            });

            // Find new reservations and updated reservations
            const updatedReservations = [];
            const reservationsToAdd = [];

            newReservations.forEach(reservation => {
                const reservationId = (reservation.reservation_id || reservation.reservationId || '').toString();
                if (!reservationId) return;

                if (!existingReservationIds.has(reservationId)) {
                    // New reservation - add to list
                    reservationsToAdd.push(reservation);
                } else {
                    // Existing reservation - check if status changed
                    const existingCard = reservationsList.querySelector(`[data - reservation - id="${reservationId}"]`);
                    if (existingCard) {
                        const currentStatus = existingCard.querySelector('.card-status')?.textContent?.trim();
                        const statusText = {
                            'pending': 'Ausstehend',
                            'confirmed': 'Bestätigt',
                            'cancelled': 'Storniert'
                        }[reservation.status || 'pending'] || 'Ausstehend';

                        if (currentStatus !== statusText) {
                            // Status changed - update this card
                            updatedReservations.push(reservation);
                        }
                    }
                }
            });

            // Update changed reservations
            updatedReservations.forEach(reservation => {
                const reservationId = (reservation.reservation_id || reservation.reservationId || '').toString();
                const existingCard = reservationsList.querySelector(`[data - reservation - id= "${reservationId}"]`);
                if (existingCard) {
                    // Update status badge
                    const statusBadge = existingCard.querySelector('.card-status');
                    if (statusBadge) {
                        const status = reservation.status || 'pending';
                        const statusClass = {
                            'pending': 'status-pending',
                            'confirmed': 'status-confirmed',
                            'cancelled': 'status-cancelled'
                        }[status] || 'status-pending';
                        const statusText = {
                            'pending': 'Ausstehend',
                            'confirmed': 'Bestätigt',
                            'cancelled': 'Storniert'
                        }[status] || 'Ausstehend';

                        statusBadge.className = `card-status ${statusClass}`;
                        statusBadge.textContent = statusText;
                    }
                }
            });

            // Add new reservations to the top
            if (reservationsToAdd.length > 0) {
                // Get current scroll position
                const scrollPos = reservationsList.scrollTop || window.scrollY || 0;

                // Use displayReservations to render new ones, then prepend
                const tempDiv = document.createElement('div');
                displayReservations(reservationsToAdd, tempDiv);

                if (reservationsList.children.length === 0 || reservationsList.querySelector('.empty-state')) {
                    reservationsList.innerHTML = tempDiv.innerHTML;
                } else {
                    reservationsList.insertAdjacentHTML('afterbegin', tempDiv.innerHTML);
                }

                // Restore scroll position (add offset for new items)
                setTimeout(() => {
                    const newCardsHeight = reservationsToAdd.length * 200; // Approximate height per card
                    reservationsList.scrollTop = scrollPos + newCardsHeight;
                }, 50);
            }
        }

        function renderReservationCard(reservation) {
            const status = reservation.status || 'pending';
            const statusText = {
                'pending': 'Ausstehend',
                'confirmed': 'Bestätigt',
                'cancelled': 'Storniert'
            }[status] || 'Ausstehend';

            const statusClass = {
                'pending': 'status-pending',
                'confirmed': 'status-confirmed',
                'cancelled': 'status-cancelled'
            }[status] || 'status-pending';

            let reservationDateTime = 'N/A';
            try {
                if (reservation.date && reservation.time) {
                    reservationDateTime = new Date(`${reservation.date}T${reservation.time} `).toLocaleString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else {
                    reservationDateTime = `${reservation.date || ''} ${reservation.time || ''} `.trim() || 'N/A';
                }
            } catch (e) {
                console.error('Error parsing reservation date:', e);
                reservationDateTime = `${reservation.date || ''} ${reservation.time || ''} `.trim() || 'N/A';
            }

            const reservationId = reservation.reservation_id || reservation.reservationId || 'N/A';
            const reservationIdShort = reservationId.toString().replace('RES-', '').slice(-8);
            const firstName = reservation.first_name || reservation.firstName || '';
            const lastName = reservation.last_name || reservation.lastName || '';
            const customerName = `${firstName} ${lastName} `.trim() || 'Kunde';
            const customerCode = reservation.customer_code || reservation.customerCode || '';
            const note = reservation.note || '';
            const guests = reservation.guests || 1;

            return `
                <div class="reservation-card ${status}" data-reservation-id="${reservationId}">
                    <div class="card-header">
                        <div class="reservation-id">📅 #${reservationIdShort}</div>
                        <span class="card-status status-${status}">${statusText}</span>
                    </div>
                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">👤 Khách:</span>
                            <span class="info-value"><strong>${customerName}</strong></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">⏰ Thời gian:</span>
                            <span class="info-value">${reservationDateTime}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📱 Điện thoại:</span>
                            <span class="info-value">${reservation.phone || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">👥 Số người:</span>
                            <span class="info-value"><strong>${guests} người</strong></span>
                        </div>
                        ${customerCode ? `
                        <div class="info-item">
                            <span class="info-label">🔑 Mã KH:</span>
                            <span class="info-value"><code style="background: rgba(229,207,142,.1); color: var(--gold); padding: 2px 6px; border-radius: 4px;">${customerCode}</code></span>
                        </div>
                        ` : ''}
                        ${note ? `
                        <div class="info-item" style="grid-column: span 2; margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,.1);">
                            <span class="info-label">📝 Ghi chú:</span>
                            <span class="info-value italic" style="color: rgba(255,255,255,.7); display: block; margin-top: 4px;">"${note}"</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="card-actions">
                        ${status === 'pending' ? `
                            <button class="btn-action btn-confirm" onclick="confirmReservation('${reservationId}')">✓ Xác nhận</button>
                            <button class="btn-action btn-cancel" onclick="cancelReservation('${reservationId}')">✗ Hủy</button>
                        ` : ''}
                    </div>
                </div>
                `;
        }

        // Display reservations function
        function displayReservations(reservations, targetElement = null) {
            const reservationsList = targetElement || document.getElementById('reservationsList');

            if (!reservations || reservations.length === 0) {
                reservationsList.innerHTML = `
                <div class="empty-state">
                        <div class="empty-state-icon">📅</div>
                        <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Chưa có lịch hẹn</h3>
                        <p style="color: rgba(255,255,255,.5);">Lịch hẹn mới sẽ xuất hiện ở đây</p>
                    </div>
                `;
                return;
            }

            // Sort reservations (newest date first)
            const sorted = [...reservations].sort((a, b) => {
                const dateA = a.date || '';
                const timeA = a.time || '';
                const dateB = b.date || '';
                const timeB = b.time || '';
                return (dateB + timeB).localeCompare(dateA + timeA);
            });

            let html = '';
            let lastDate = '';
            const today = getLocalDateStr(new Date());

            sorted.forEach(res => {
                const resDate = res.date || 'Unknown';

                if (resDate !== lastDate) {
                    const dateObj = new Date(resDate);
                    const formattedDate = isNaN(dateObj.getTime()) ? resDate : dateObj.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    html += `
                <div class="date-group-header" style="
            grid-column: 1 / -1;
            padding: 12px 20px;
            margin: 20px 0 10px 0;
            background: rgba(229, 207, 142, 0.1);
            border-left: 4px solid var(--gold);
            color: var(--gold);
            font-weight: 700;
            font-size: 16px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            ">
                <span>📅 ${formattedDate}</span>
                    ${resDate === today ? '<span style="font-size: 12px; background: var(--gold); color: #000; padding: 2px 8px; border-radius: 10px; font-weight: bold;">HEUTE</span>' : ''}
                            </div>
                `;
                    lastDate = resDate;
                }
                html += renderReservationCard(res);
            });

            reservationsList.innerHTML = html;
        }

        // Global variables for time scheduling
        let pendingOrderId = null;
        let pendingReservationId = null;
        let isOrderConfirmation = false;

        // Filter orders
        function filterOrders() {
            const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.order-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const matchesSearch = !searchTerm || text.includes(searchTerm);
                card.style.display = matchesSearch ? '' : 'none';
            });
        }

        // Filter orders by status
        function filterOrdersByStatus(status) {
            // Update active button
            const filterButtons = document.querySelectorAll('#ordersContent .filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                // Set active on button with matching data-status
                if (btn.getAttribute('data-status') === status) {
                    btn.classList.add('active');
                }
            });

            // Update mobile select if present
            const mobileSelect = document.querySelector('#ordersContent .mobile-status-filter');
            if (mobileSelect && mobileSelect.value !== status) {
                mobileSelect.value = status;
            }

            // Reload orders with new filter
            loadOrders(false); // Not silent, not preserving scroll
        }

        // Filter reservations
        function filterReservations() {
            const searchTerm = document.getElementById('reservationSearch')?.value.toLowerCase() || '';
            // Reservations use order-card class in displayReservations function
            const cards = document.querySelectorAll('#reservationsList .order-card, #reservationsList [data-reservation-id]');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const matchesSearch = !searchTerm || text.includes(searchTerm);
                card.style.display = matchesSearch ? '' : 'none';
            });
        }

        // Filter reservations by status
        function filterReservationsByStatus(status) {
            console.log('🔍 Filter reservations by status:', status);

            // Update active button in reservationsContent only
            const reservationsContent = document.getElementById('reservationsContent');
            if (!reservationsContent) {
                console.error('❌ reservationsContent not found!');
                return;
            }

            const filterButtons = reservationsContent.querySelectorAll('.filter-btn');
            console.log('Found filter buttons:', filterButtons.length);

            if (filterButtons.length === 0) {
                console.error('❌ No filter buttons found in reservationsContent!');
                return;
            }

            filterButtons.forEach(btn => {
                const btnStatus = btn.getAttribute('data-status');
                btn.classList.remove('active');
                // Set active on button with matching data-status
                if (btnStatus === status) {
                    btn.classList.add('active');
                    console.log('✅ Activated button with status:', status, btn);
                }
            });

            // Update mobile select if present
            const mobileSelect = reservationsContent.querySelector('.mobile-status-filter');
            if (mobileSelect && mobileSelect.value !== status) {
                mobileSelect.value = status;
            }

            // Verify active button
            const activeButton = reservationsContent.querySelector('.filter-btn.active[data-status]');
            console.log('Active button after update:', activeButton?.getAttribute('data-status'));

            // Reload reservations with new filter
            loadReservations(false); // Not silent, not preserving scroll
        }


        // Filter customers
        function filterCustomers() {
            const searchTerm = document.getElementById('customerSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.customer-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const email = card.getAttribute('data-customer-email')?.toLowerCase() || '';
                const phone = card.getAttribute('data-customer-phone')?.toLowerCase() || '';
                const customerCode = card.getAttribute('data-customer-code')?.toLowerCase() || '';
                const matchesSearch = !searchTerm || text.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm) || customerCode.includes(searchTerm);
                card.style.display = matchesSearch ? '' : 'none';
            });
        }

        function applyDatePickerFilter() {
            loadOrders(false);
        }

        function clearDatePicker() {
            const dp = document.getElementById('datePicker');
            if (dp) dp.value = '';
            loadOrders(false);
        }

        function clearReservationDatePicker() {
            const dp = document.getElementById('reservationDatePicker');
            if (dp) dp.value = '';
            loadReservations(false);
        }

        // Show time schedule modal
        function showTimeScheduleModal(orderId, isOrder = true) {
            console.log('⏰ showTimeScheduleModal called:', { orderId, isOrder });

            // Store in global variables
            pendingOrderId = isOrder ? orderId : null;
            pendingReservationId = !isOrder ? orderId : null;
            isOrderConfirmation = isOrder;

            // Also store in modal data attributes as backup
            const modal = document.getElementById('timeScheduleModal');
            if (!modal) {
                console.error('❌ Time schedule modal not found!');
                alert('Fehler: Zeitplan-Modal nicht gefunden. Bitte Seite aktualisieren.');
                return;
            }

            modal.dataset.orderId = isOrder ? orderId : '';
            modal.dataset.reservationId = !isOrder ? orderId : '';
            modal.dataset.isOrder = isOrder ? 'true' : 'false';

            // Reset time inputs
            const hoursInput = document.getElementById('scheduleHours');
            const minutesInput = document.getElementById('scheduleMinutes');

            // Set default time based on order's service_type
            let defaultMinutes = 30;
            if (isOrder && orderId && allOrdersData) {
                const order = allOrdersData.find(o => o.order_id === orderId);
                if (order) {
                    const svcType = order.service_type || '';
                    defaultMinutes = (svcType === 'delivery') ? 60 : 20;
                }
            }
            if (hoursInput) hoursInput.value = Math.floor(defaultMinutes / 60).toString();
            if (minutesInput) minutesInput.value = (defaultMinutes % 60).toString();

            modal.classList.add('active');
            console.log('✅ Time schedule modal shown with data:', {
                pendingOrderId,
                pendingReservationId,
                isOrderConfirmation,
                modalData: {
                    orderId: modal.dataset.orderId,
                    reservationId: modal.dataset.reservationId,
                    isOrder: modal.dataset.isOrder
                }
            });
        }

        // Close time schedule modal
        function closeTimeScheduleModal() {
            const modal = document.getElementById('timeScheduleModal');
            if (modal) {
                modal.classList.remove('active');
            }
            pendingOrderId = null;
            pendingReservationId = null;
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeTimeScheduleModal();
            }
        });

        // Set quick time
        function setQuickTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            document.getElementById('scheduleHours').value = hours;
            document.getElementById('scheduleMinutes').value = mins;
        }

        // Confirm with scheduled time
        async function confirmWithScheduledTime() {
            console.log('⏰ confirmWithScheduledTime called');

            // Get IDs from modal data attributes (backup if global variables are lost)
            const modal = document.getElementById('timeScheduleModal');
            const modalOrderId = modal?.dataset.orderId || '';
            const modalReservationId = modal?.dataset.reservationId || '';
            const modalIsOrder = modal?.dataset.isOrder === 'true';

            // Use global variables first, fallback to modal data
            const orderId = pendingOrderId || modalOrderId;
            const reservationId = pendingReservationId || modalReservationId;
            const isOrder = isOrderConfirmation !== undefined ? isOrderConfirmation : modalIsOrder;

            console.log('📋 IDs from variables:', { pendingOrderId, pendingReservationId, isOrderConfirmation });
            console.log('📋 IDs from modal:', { modalOrderId, modalReservationId, modalIsOrder });
            console.log('📋 Final IDs:', { orderId, reservationId, isOrder });

            const hours = parseInt(document.getElementById('scheduleHours')?.value) || 0;
            const minutes = parseInt(document.getElementById('scheduleMinutes')?.value) || 0;

            if (hours === 0 && minutes === 0) {
                alert('Bitte geben Sie die geplante Zeit ein (mindestens 1 Minute)');
                return;
            }

            const totalMinutes = hours * 60 + minutes;
            const estimatedTime = new Date();
            estimatedTime.setMinutes(estimatedTime.getMinutes() + totalMinutes);
            const estimatedTimeText = estimatedTime.toLocaleString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });

            console.log('📅 Scheduled time:', { hours, minutes, totalMinutes, estimatedTimeText });

            // Close modal first (but keep IDs)
            if (modal) {
                modal.classList.remove('active');
            }

            // Confirm based on type
            if (isOrder && orderId) {
                console.log('✅ Confirming order:', orderId);
                await confirmOrderWithTime(orderId, estimatedTimeText, totalMinutes);
            } else if (!isOrder && reservationId) {
                // Reservations don't need time scheduling - use customer's selected time
                console.log('⚠️ Reservation confirmation should not use time modal. Use confirmReservation() directly.');
                alert('Reservierungen verwenden die vom Kunden gewählte Zeit. Bitte verwenden Sie die Bestätigung direkt.');
                return;
            } else {
                console.error('❌ No pending order or reservation ID found!');
                console.error('Debug info:', {
                    isOrder,
                    orderId,
                    reservationId,
                    pendingOrderId,
                    pendingReservationId,
                    isOrderConfirmation,
                    modalData: modal?.dataset
                });
                alert('Fehler: Keine Bestellung oder Reservierung zum Bestätigen gefunden. Bitte versuchen Sie es erneut.');
                return;
            }

            // Clear variables after successful confirmation
            pendingOrderId = null;
            pendingReservationId = null;
            if (modal) {
                modal.dataset.orderId = '';
                modal.dataset.reservationId = '';
                modal.dataset.isOrder = '';
            }
        }

        // Confirm order
        async function confirmOrder(orderId) {
            console.log('🔔 confirmOrder called with orderId:', orderId);
            if (!orderId) {
                console.error('❌ No orderId provided to confirmOrder');
                alert('Fehler: Bestell-ID nicht gefunden');
                return;
            }

            // Check if order is a dinein/reservation order
            let order = null;
            if (typeof allOrdersData !== 'undefined' && allOrdersData) {
                order = allOrdersData.find(o => o.order_id === orderId);
            }

            if (order) {
                const type = (order.service_type || '').toLowerCase();
                // If it's a reservation or dine-in, bypass time schedule modal
                if (type === 'reservation' || type === 'dinein' || type === 'table') {
                    console.log('🚀 Bypassing time modal for dine-in/reservation order');
                    confirmOrderWithTime(orderId, 'Sofort', 0);
                    return;
                }
            }

            showTimeScheduleModal(orderId, true);
        }

        // Confirm order with scheduled time
        async function confirmOrderWithTime(orderId, estimatedTimeText, totalMinutes) {
            console.log('🔄 confirmOrderWithTime called:', { orderId, estimatedTimeText, totalMinutes });

            if (!orderId) {
                console.error('❌ No orderId provided!');
                alert('Fehler: Bestell-ID nicht gefunden');
                return;
            }

            // Get order from API
            let order = null;
            try {
                const response = await fetch(`api/index.php?route=v1/data/orders/get&order_id=${orderId}`);
                const data = await response.json();
                if (data.success && data.order) {
                    order = data.order;
                }
            } catch (error) {
                console.error('Failed to get order from API:', error);
            }

            // If not found, try to get from current loaded orders
            if (!order && allOrdersData) {
                order = allOrdersData.find(o => o.order_id === orderId);
            }

            if (!order) {
                alert('Bestellung nicht gefunden!');
                return;
            }

            // Update order status via API
            try {
                let result;
                let currentStatus = order ? order.status : 'pending';
                if (window.api && window.api.orders && window.api.orders.updateStatus) {
                    // Pass ETA and total_minutes to backend
                    result = await window.api.orders.updateStatus(orderId, 'confirmed', {
                        eta: estimatedTimeText,
                        old_status: currentStatus,
                        total_minutes: totalMinutes
                    });
                } else {
                    // Fallback if window.api is not available
                    const response = await fetch('api/index.php?route=v1/data/orders/update-status', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            order_id: orderId,
                            status: 'confirmed',
                            old_status: currentStatus,
                            eta: estimatedTimeText,
                            total_minutes: totalMinutes
                        })
                    });
                    result = await response.json();
                }

                if (result.success) {
                    console.log('✅ Order status updated successfully');
                    // Optimistic update
                    if (allOrdersData) {
                        const orderIndex = allOrdersData.findIndex(o => o.order_id === orderId);
                        if (orderIndex !== -1) {
                            allOrdersData[orderIndex].status = 'confirmed';

                            // Update summary for immediate timer display
                            let summary = allOrdersData[orderIndex].summary || {};
                            if (typeof summary === 'string') {
                                try { summary = JSON.parse(summary); } catch (e) { summary = {}; }
                            }
                            summary.confirmed_at = new Date().toISOString();
                            summary.total_minutes = totalMinutes;
                            allOrdersData[orderIndex].summary = summary;

                            // Refresh view
                            applyDateFilter();
                            // Re-init timers to catch the new confirmed order
                            initOrderTimers();
                        }
                    }

                    if (typeof showMenuNotification === 'function') {
                        showMenuNotification(`✅ Bestellung ${orderId} bestätigt & E - Mail gesendet.`, 'success');
                    } else {
                        alert('Bestellung bestätigt und Kunde benachrichtigt.');
                    }
                } else {
                    throw new Error(result.message || 'Fehler beim Aktualisieren');
                }
            } catch (error) {
                console.error('❌ Failed to update order:', error);
                alert('Fehler beim Aktualisieren des Bestellstatus: ' + error.message);
                loadOrders(false, true); // Reload on error
                return;
            }

            // Prepare delivery address object (ALWAYS define it, even if no email)
            const customerEmail = order.delivery?.address?.email || order.delivery?.email || order.email || order.delivery_address?.email || '';

            // Prepare delivery address object - ALWAYS define it
            let deliveryAddress = order.delivery?.address || order.delivery_address || {};

            // If delivery_address is a JSON string, parse it
            if (typeof deliveryAddress === 'string') {
                try {
                    deliveryAddress = JSON.parse(deliveryAddress);
                } catch (e) {
                    deliveryAddress = {};
                }
            }

            // Ensure all fields are set
            deliveryAddress = {
                email: deliveryAddress.email || customerEmail || '',
                firstName: deliveryAddress.firstName || deliveryAddress.first_name || order.firstName || '',
                lastName: deliveryAddress.lastName || deliveryAddress.last_name || order.lastName || '',
                phone: deliveryAddress.phone || order.phone || '',
                street: deliveryAddress.street || order.street || '',
                postal: deliveryAddress.postal || order.postal || '',
                city: deliveryAddress.city || order.city || '',
                note: deliveryAddress.note || order.note || '',
                customerCode: deliveryAddress.customerCode || order.customerCode || ''
            };

            // [NEW] Cải tiến in trực tiếp (Silent Print) cho App Android
            try {
                console.log('🖨️ Bắt đầu in trực tiếp cho App Android...');
                if (typeof printOrderBill === 'function') {
                    // Gọi trực tiếp hàm in bill đã được tối ưu cho App
                    await printOrderBill(orderId, estimatedTimeText);
                    console.log('✅ Đã gọi lệnh in trực tiếp thành công');
                } else if (typeof window.showPrintBills === 'function') {
                    // Fallback cho trình duyệt web (vẫn hiện hộp thoại in)
                    window.showPrintBills(order, deliveryAddress, orderId, estimatedTimeText);
                }
            } catch (error) {
                console.error('❌ Lỗi khi in bill:', error);
            }

            // Show beautiful success notification
            showAdminSuccessNotification(order, orderId);

            // Reload orders immediately to show updated status (only refresh, don't reload page)
            console.log('🔄 Refreshing orders to show updated status...');
            await loadOrders(true); // Silent mode - just refresh data
        }

        // Cancel order
        async function cancelOrder(orderId) {
            if (!confirm('Möchten Sie diese Bestellung wirklich stornieren?')) return;

            // Optional: Ask for reason
            // const reason = prompt('Grund für die Stornierung (optional):', '');
            const reason = 'Admin storniert';

            // Update order status via API
            try {
                // 1. Find order in local data for optimistic update
                const orderIndex = allOrdersData.findIndex(o => o.order_id === orderId || o.id === orderId);
                let currentStatus = 'pending';
                if (orderIndex !== -1) {
                    currentStatus = allOrdersData[orderIndex].status || 'pending';
                } else {
                    console.warn('Order not found locally:', orderId);
                }

                // 2. Call API
                if (window.api && window.api.orders && window.api.orders.updateStatus) {
                    const result = await window.api.orders.updateStatus(orderId, 'cancelled', { reason: reason, old_status: currentStatus });

                    if (!result.success) {
                        throw new Error(result.message || 'Fehler beim Stornieren der Bestellung.');
                    }

                    console.log(`Order ${orderId} status updated to 'cancelled' via API.`);

                    // 3. Optimistic UI Update
                    if (orderIndex !== -1) {
                        allOrdersData[orderIndex].status = 'cancelled';
                        // Refresh view
                        loadOrders(true);
                    } else {
                        // If not found locally, reload all
                        loadOrders(false, true);
                    }

                    // Show success notification
                    // alert(`✅ Bestellung ${ orderId } wurde erfolgreich storniert.`);
                    if (typeof showMenuNotification === 'function') {
                        showMenuNotification(`✅ Bestellung ${orderId} storniert & E - Mail gesendet.`, 'success');
                    } else {
                        alert(`✅ Bestellung ${orderId} wurde erfolgreich storniert.`);
                    }

                } else {
                    // Fallback (should not happen with api.js loaded)
                    throw new Error('API Client nicht geladen. Bitte Seite neu laden.');
                }

            } catch (error) {
                console.error(`Failed to cancel order ${orderId}: `, error);
                alert(`Fehler beim Stornieren der Bestellung ${orderId}: \n${error.message || error} `);
                // Attempt to reload orders to refresh the list in case of partial state
                loadOrders(false, true);
            }
        }
        // Confirm reservation (using customer's selected time)
        async function confirmReservation(reservationId) {
            // Get reservation from API
            let reservation = null;
            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/reservations/get')}&reservation_id=${reservationId}`);
                const data = await response.json();
                if (data.success && data.reservation) {
                    reservation = data.reservation;
                }
            } catch (error) {
                console.error('Failed to get reservation from API:', error);
                alert('Reservierung nicht gefunden!');
                return;
            }

            if (!reservation) {
                alert('Reservierung nicht gefunden!');
                return;
            }

            // Format the customer's selected time
            const customerTime = reservation.time || '';
            const customerDate = reservation.date || '';
            let formattedTime = '';

            if (customerTime) {
                // Format time from "HH:MM:SS" or "HH:MM" to "HH:MM Uhr"
                const timeParts = customerTime.split(':');
                if (timeParts.length >= 2) {
                    formattedTime = `${timeParts[0]}:${timeParts[1]} Uhr`;
                } else {
                    formattedTime = customerTime;
                }
            }

            // Update reservation status via API
            try {
                const response = await fetch('api/index.php?route=v1/data/reservations/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        status: 'confirmed'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Reservation confirmed:', reservationId);
                } else {
                    throw new Error(data.message || 'Fehler beim Bestätigen');
                }
            } catch (error) {
                console.error('Failed to update reservation:', error);
                alert('Fehler beim Bestätigen der Reservierung. Bitte versuchen Sie es erneut.');
                return;
            }

            // Map API snake_case fields to camelCase for email function
            const reservationForEmail = {
                reservationId: reservation.reservation_id || reservation.reservationId || reservationId,
                firstName: reservation.first_name || reservation.firstName || '',
                lastName: reservation.last_name || reservation.lastName || '',
                email: reservation.email || '',
                phone: reservation.phone || '',
                date: reservation.date || '',
                time: reservation.time || '',
                guests: reservation.guests || 1,
                tableNumber: reservation.table_number || reservation.tableNumber || '',
                note: reservation.note || '',
                timestamp: reservation.created_at || reservation.createdAt || reservation.timestamp || new Date().toISOString(),
                status: 'confirmed'
            };

            // Send confirmation email to customer with their selected time
            if (reservationForEmail.email) {
                if (typeof sendReservationConfirmationEmail === 'function') {
                    console.log('📧 Sending reservation confirmation email to:', reservationForEmail.email);
                    sendReservationConfirmationEmail(reservationForEmail, formattedTime);
                } else {
                    // Fallback: send email directly via EmailJS if the function is not available
                    console.log('📧 Fallback: Sending reservation email directly via EmailJS...');
                    try {
                        if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
                            const customerName = `${reservationForEmail.firstName} ${reservationForEmail.lastName}`.trim() || 'Kunde';
                            const reservationDateTime = new Date(`${reservationForEmail.date}T${reservationForEmail.time}`).toLocaleString('de-DE', {
                                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                            const templateParams = {
                                to_email: reservationForEmail.email.trim(),
                                reply_to: EMAILJS_CONFIG.OWNER_EMAIL,
                                customer_name: customerName,
                                customer_phone: reservationForEmail.phone,
                                customer_email: reservationForEmail.email.trim(),
                                reservation_id: reservationForEmail.reservationId,
                                reservation_datetime: reservationDateTime,
                                reservation_date: reservationForEmail.date,
                                reservation_time_slot: reservationForEmail.time,
                                guests: reservationForEmail.guests,
                                table_number: reservationForEmail.tableNumber || null,
                                table_number_display: reservationForEmail.tableNumber || 'Wird bei Ankunft zugewiesen',
                                note: reservationForEmail.note || '',
                                restaurant_name: 'LEO SUSHI',
                                restaurant_address: 'Florastraße 10A, 13187 Berlin',
                                restaurant_phone: '03071055810',
                                restaurant_email: EMAILJS_CONFIG.OWNER_EMAIL
                            };
                            emailjs.send(
                                EMAILJS_CONFIG.SERVICE_ID,
                                EMAILJS_CONFIG.RESERVATION_TEMPLATE_ID || EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID,
                                templateParams
                            ).then(() => {
                                console.log('✅ Reservation confirmation email sent (fallback)');
                            }).catch(err => {
                                console.error('❌ Failed to send reservation email (fallback):', err);
                            });
                        }
                    } catch (emailError) {
                        console.error('❌ Email fallback error:', emailError);
                    }
                }
            } else {
                console.warn('⚠️ No customer email found for reservation, skipping email.');
            }

            // Show beautiful success notification (same style as order confirmation)
            showAdminReservationSuccessNotification(reservation, reservationId, formattedTime);

            // Only refresh reservations list, don't reload entire page
            await loadReservations();
        }

        // Cancel reservation
        async function cancelReservation(reservationId) {
            if (!confirm('Möchten Sie diese Reservierung wirklich stornieren?')) return;

            // 1. Get reservation details first (for email)
            let reservation = null;
            try {
                const resResponse = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/reservations/get')}&reservation_id=${reservationId}`);
                const resData = await resResponse.json();
                if (resData.success && resData.reservation) {
                    reservation = resData.reservation;
                }
            } catch (error) {
                console.warn('Could not fetch reservation details for email:', error);
            }

            // 2. Update reservation status via API
            try {
                const response = await fetch('api/index.php?route=v1/data/reservations/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        status: 'cancelled'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Reservation cancelled:', reservationId);

                    // 3. Send cancellation email to customer
                    if (reservation && reservation.email) {
                        try {
                            if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
                                const customerName = `${reservation.first_name || reservation.firstName || ''} ${reservation.last_name || reservation.lastName || ''}`.trim() || 'Kunde';
                                const customerTime = reservation.time || '';
                                let formattedTime = '';
                                if (customerTime) {
                                    const timeParts = customerTime.split(':');
                                    if (timeParts.length >= 2) {
                                        formattedTime = `${timeParts[0]}:${timeParts[1]} Uhr`;
                                    } else {
                                        formattedTime = customerTime;
                                    }
                                }

                                let reservationDateTime = '';
                                try {
                                    reservationDateTime = new Date(`${reservation.date}T${reservation.time}`).toLocaleString('de-DE', {
                                        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    });
                                } catch (e) {
                                    reservationDateTime = `${reservation.date || ''} ${reservation.time || ''}`;
                                }

                                const templateParams = {
                                    to_email: reservation.email.trim(),
                                    reply_to: EMAILJS_CONFIG.OWNER_EMAIL,
                                    customer_name: customerName,
                                    customer_phone: reservation.phone || '',
                                    customer_email: reservation.email.trim(),
                                    reservation_id: reservationId,
                                    reservation_datetime: reservationDateTime,
                                    reservation_date: reservation.date || '',
                                    reservation_time: reservation.time || '',
                                    reservation_time_slot: formattedTime,
                                    guests: reservation.guests || 1,
                                    table_number: reservation.table_number || reservation.tableNumber || '',
                                    table_number_display: reservation.table_number || reservation.tableNumber || 'N/A',
                                    note: reservation.note || '',
                                    note_display: '',
                                    estimated_time_display: `<div class="order-info" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left-color: #ef4444; margin-top: 20px;"><h3>❌ Reservierung konnte nicht bestätigt werden</h3><p style="font-size: 16px; font-weight: 600; color: #dc2626; margin: 10px 0;">Leider ist unser Restaurant zu diesem Zeitpunkt voll ausgebucht. Wir bitten Sie, eine andere Uhrzeit oder einen anderen Tag zu wählen.</p><p style="font-size: 14px; color: #7f1d1d; margin-top: 12px;">Wir freuen uns, Sie zu einem anderen Termin begrüßen zu dürfen!</p><p style="font-size: 15px; font-weight: 700; color: #7f1d1d; margin-top: 12px;">📞 Tel: 03071055810</p></div>`,
                                    restaurant_name: 'LEO SUSHI',
                                    restaurant_address: 'Florastraße 10A, 13187 Berlin',
                                    restaurant_phone: '03071055810',
                                    restaurant_email: EMAILJS_CONFIG.OWNER_EMAIL
                                };

                                emailjs.send(
                                    EMAILJS_CONFIG.SERVICE_ID,
                                    EMAILJS_CONFIG.RESERVATION_TEMPLATE_ID || EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID,
                                    templateParams
                                ).then(() => {
                                    console.log('✅ Reservation cancellation email sent to:', reservation.email);
                                }).catch(err => {
                                    console.error('❌ Failed to send cancellation email:', err);
                                });
                            }
                        } catch (emailError) {
                            console.error('❌ Email error:', emailError);
                        }
                    } else {
                        console.warn('⚠️ No customer email found, skipping cancellation email.');
                    }

                    alert('Reservierung storniert! E-Mail wurde an den Kunden gesendet.');
                    await loadReservations();
                } else {
                    throw new Error(data.message || 'Fehler beim Stornieren');
                }
            } catch (error) {
                console.error('Failed to cancel reservation:', error);
                alert('Fehler beim Stornieren der Reservierung. Bitte versuchen Sie es erneut.');
            }
        }

        // Assign table to order
        async function assignTable(orderId) {
            const tableNumber = prompt('Tischnummer eingeben (1-16):');
            if (!tableNumber) return;

            const tableNum = parseInt(tableNumber);
            if (isNaN(tableNum) || tableNum < 1 || tableNum > 16) {
                alert('Ungültige Tischnummer. Bitte geben Sie eine Zahl von 1 bis 16 ein.');
                return;
            }

            // Update order table number via API
            try {
                const response = await fetch('api/index.php?route=v1/data/orders/update-status', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_id: orderId,
                        table_id: tableNum
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Table assigned:', orderId, 'Table:', tableNum);
                    alert(`Tisch ${tableNum} wurde für Bestellung #${orderId.slice(-8)} zugewiesen`);
                    await loadOrders(true); // Silent mode
                } else {
                    throw new Error(data.message || 'Fehler beim Zuweisen');
                }
            } catch (error) {
                console.error('Failed to assign table:', error);
                alert('Fehler beim Zuweisen des Tisches. Bitte versuchen Sie es erneut.');
            }
        }

        // Make assignTable globally available
        window.assignTable = assignTable;

        // Assign table to reservation
        async function assignTableToReservation(reservationId) {
            const tableNumber = prompt('Tischnummer eingeben (1-16):');
            if (!tableNumber) return;

            const tableNum = parseInt(tableNumber);
            if (isNaN(tableNum) || tableNum < 1 || tableNum > 16) {
                alert('Ungültige Tischnummer. Bitte geben Sie eine Zahl von 1 bis 16 ein.');
                return;
            }

            // Update reservation table number via API
            try {
                const response = await fetch('api/index.php?route=v1/data/reservations/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        table_number: tableNum
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Table assigned to reservation:', reservationId, 'Table:', tableNum);
                    alert(`Tisch ${tableNum} wurde für Reservierung #${reservationId.toString().replace('RES-', '').slice(-8)} zugewiesen`);
                    await loadReservations(); // Reload reservations
                } else {
                    throw new Error(data.message || 'Fehler beim Zuweisen');
                }
            } catch (error) {
                console.error('Failed to assign table to reservation:', error);
                alert('Fehler beim Zuweisen des Tisches. Bitte versuchen Sie es erneut.');
            }
        }

        // Make assignTableToReservation globally available
        window.assignTableToReservation = assignTableToReservation;

        // Export all data (orders and reservations) to JSON file
        async function exportAllData() {
            const today = getLocalDateStr(new Date());

            // Use already loaded MySQL data
            const allOrders = allOrdersData || [];
            const allReservations = allReservationsData || [];

            // Filter today's orders (use local timezone)
            const todayOrders = allOrders.filter(o => {
                const orderDate = getOrderDate(o);
                return orderDate === today;
            });

            // Combine all data
            const exportData = {
                export_date: new Date().toISOString(),
                orders: {
                    today: todayOrders,
                    all: allOrders
                },
                reservations: {
                    all: allReservations
                },
                statistics: {
                    total_orders: allOrders.length,
                    total_reservations: allReservations.length,
                    today_orders: todayOrders.length
                }
            };

            // Create and download JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leo_sushi_data_${today}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('Daten wurden erfolgreich exportiert!');
        }

        window.exportAllData = exportAllData;

        // View order details
        async function viewOrderDetails(orderId) {
            // First try to find order from loaded MySQL data (PRIMARY SOURCE)
            let order = null;
            if (window.allOrdersData && window.allOrdersData.length > 0) {
                order = window.allOrdersData.find(o =>
                    (o.order_id || o._id || '').toString() === orderId.toString()
                );
            }

            if (!order) {
                // Try to fetch from API if not found locally
                try {
                    let response;
                    if (window.api && window.api.orders && window.api.orders.get) {
                        response = await window.api.orders.get(orderId);
                    } else {
                        const res = await fetch(`api/index.php?route=v1/data/orders/get&order_id=${orderId}`);
                        response = await res.json();
                    }

                    if (response && response.success && response.order) {
                        order = response.order;
                    } else {
                        throw new Error('Order not found in API response');
                    }
                } catch (e) {
                    console.error('Error fetching order details:', e);
                    alert('Bestellung nicht gefunden!');
                    return;
                }
            }

            // Parse delivery_address if it's a JSON string
            let address = {};
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { }
                } else { address = order.delivery_address; }
            } else if (order.delivery?.address) {
                address = order.delivery.address;
            }

            // Parse summary if it's a JSON string
            let summary = {};
            if (order.summary) {
                if (typeof order.summary === 'string') {
                    try { summary = JSON.parse(order.summary); } catch (e) { }
                } else { summary = order.summary; }
            }

            // Parse items
            let items = order.items || [];
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { items = []; }
            }

            const orderIdShort = orderId.toString().replace(/^(ORD-|LEO-)/, '').slice(-8);
            const customerName = `${address.firstName || address.first_name || ''} ${address.lastName || address.last_name || ''} `.trim() || 'Kunde';
            const phone = address.phone || 'N/A';
            const email = address.email || 'N/A';
            const street = address.street || '';
            const postal = address.postal || '';
            const city = address.city || '';
            const note = address.note || summary.note || '';
            const serviceType = order.service_type === 'pickup' ? '🥡 Abholung' : order.service_type === 'delivery' ? '🛵 Lieferung' : '🍽️ Reservierung';
            const pmStr = (order.payment_method || summary.payment_method || '').toLowerCase();
            const payMethod = pmStr.includes('cash') || pmStr.includes('tiền mặt') || pmStr.includes('bar') ? 'Barzahlung' : pmStr.includes('paypal') ? 'PayPal' : (pmStr.includes('card') || pmStr.includes('karte') || pmStr.includes('thẻ') ? 'Kartenzahlung' : 'Barzahlung');
            const status = order.status || 'pending';
            const statusText = { 'pending': 'Ausstehend', 'confirmed': 'Bestätigt', 'cancelled': 'Storniert', 'completed': 'Abgeschlossen' }[status] || 'Ausstehend';

            let orderTime = 'Unbekannt';
            if (order.created_at) {
                orderTime = new Date(order.created_at).toLocaleString('de-DE');
            } else if (summary.timestamp) {
                orderTime = new Date(summary.timestamp).toLocaleString('de-DE');
            } else if (order.createdAt) {
                if (order.createdAt.seconds) orderTime = new Date(order.createdAt.seconds * 1000).toLocaleString('de-DE');
                else orderTime = new Date(order.createdAt).toLocaleString('de-DE');
            }

            const scheduledTime = address.scheduled_time || order.scheduled_delivery_time || summary.scheduled_delivery_time;

            const itemsHTML = items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>${item.qty || item.quantity || 1}x ${item.name || 'N/A'}${item.note ? ` <em style="color: #fbbf24;">(${item.note})</em>` : ''}</span>
                        <span style="color: var(--gold); font-weight: 600;">€${item.total || (parseFloat(item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</span>
                    </div>
                `).join('');

            // Create modal
            const existingModal = document.getElementById('orderDetailModal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'orderDetailModal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            modal.innerHTML = `
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; padding: 28px; border: 1px solid rgba(229,207,142,0.2); box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                            <h3 style="color: var(--gold, #e5cf8e); margin:0; font-size: 20px;">📦 Bestellung #${orderIdShort}</h3>
                            <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
                                background: ${status === 'confirmed' ? 'rgba(16,185,129,0.15)' : status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)'};
                                color: ${status === 'confirmed' ? '#10b981' : status === 'cancelled' ? '#ef4444' : '#fbbf24'};
                                border: 1px solid ${status === 'confirmed' ? 'rgba(16,185,129,0.3)' : status === 'cancelled' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'};
                            ">${statusText}</span>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">⏰ Zeit</span><div style="color:#fff;margin-top:4px;">${orderTime}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">🚚 Service</span><div style="color:#fff;margin-top:4px;">${serviceType}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">👤 Kunde</span><div style="color:#fff;margin-top:4px;">${customerName}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">📱 Telefon</span><div style="color:#fff;margin-top:4px;">${phone}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">📧 E-Mail</span><div style="color:#fff;margin-top:4px;word-break:break-all;">${email}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">💳 Zahlung</span><div style="color:#fff;margin-top:4px;">${payMethod}</div></div>
                        </div>
                        ${street ? `<div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;margin-bottom:12px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">📍 Adresse</span><div style="color:#fff;margin-top:4px;">${street}, ${postal} ${city}</div></div>` : ''}
                        ${order.service_type === 'delivery' ? `
                            <div id="adminOrderMap" style="height: 250px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(229,207,142,0.2); overflow: hidden;"></div>
        ` : ''
                }
        ${scheduledTime ? `<div
            style="background:rgba(251,191,36,0.1);padding:10px;border-radius:8px;margin-bottom:12px;border-left:3px solid #fbbf24;">
            <span style="color:#fbbf24;font-size:12px;">⏰ Gewünschte Lieferzeit</span>
            <div style="color:#fbbf24;margin-top:4px;font-weight:600;">${scheduledTime.date || ''} ${scheduledTime.time
                    || ''}</div>
        </div>` : ''
                }
        <div style="margin-bottom:16px;">
            <h4 style="color:rgba(255,255,255,0.8);margin:0 0 8px;">🍣 Artikel</h4>
            ${itemsHTML || '<div style="color:rgba(255,255,255,0.4);">Keine Artikel</div>'}
        </div>
        <div
            style="background:rgba(229,207,142,0.1);padding:14px;border-radius:10px;margin-bottom:16px;border:1px solid rgba(229,207,142,0.15);">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Zwischensumme</span><span
                    style="color:#fff;">€${parseFloat(summary.subtotal || 0).toFixed(2)}</span></div>
            ${parseFloat(summary.delivery_fee || 0) > 0 ? `<div
                style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Liefergebühr</span><span
                    style="color:#fff;">€${parseFloat(summary.delivery_fee).toFixed(2)}</span></div>` : ''}
            ${parseFloat(summary.tip || 0) > 0 ? `<div
                style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Trinkgeld</span><span
                    style="color:#fff;">€${parseFloat(summary.tip).toFixed(2)}</span></div>` : ''}
            ${parseFloat(summary.discount || 0) > 0 ? `<div
                style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Rabatt</span><span
                    style="color:#10b981;">-€${parseFloat(summary.discount).toFixed(2)}</span></div>` : ''}
            <div
                style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid rgba(229,207,142,0.2);">
                <span style="color:var(--gold, #e5cf8e);font-weight:700;font-size:18px;">Gesamt</span>
                <span style="color:var(--gold, #e5cf8e);font-weight:700;font-size:18px;">€${parseFloat(summary.total ||
                    0).toFixed(2)}</span>
            </div>
        </div>
        ${note ? `<div
            style="background:rgba(251,191,36,0.1);padding:10px;border-radius:8px;margin-bottom:16px;border-left:3px solid #fbbf24;">
            <strong style="color:#fbbf24;">📝 Hinweis:</strong>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;">${note}</p>
        </div>` : ''
                }

            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="document.getElementById('orderDetailModal').remove(); printOrderBill('${orderId}')"
                    style="flex:1;padding:12px;border-radius:8px;border:1px solid rgba(59,130,246,0.3);background:rgba(59,130,246,0.2);color:#60a5fa;cursor:pointer;font-size:15px;font-weight:700;transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(59,130,246,0.35)'"
                    onmouseout="this.style.background='rgba(59,130,246,0.2)'">&nbsp;🖨️ In Bill</button>
                <button onclick="document.getElementById('orderDetailModal').remove()"
                    style="flex:1;padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;cursor:pointer;font-size:14px;transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.05)'">Schließen</button>
            </div>
    </div>
                `;
            document.body.appendChild(modal);

            // Initialize Map if delivery
            if (order.service_type === 'delivery') {
                setTimeout(() => {
                    if (window.initOrderTrackingMap) {
                        window.initOrderTrackingMap('adminOrderMap', order);
                        if (status === 'in_delivery' && window.startOrderTracking) {
                            window.startOrderTracking(orderId);
                        }
                    }
                }, 500);
            }
        }


        // Send order confirmation email (admin action)
        function sendOrderConfirmationEmail(order) {
            if (typeof emailjs === 'undefined' || !EMAILJS_CONFIG) return;

            const templateParams = {
                to_email: order.delivery?.address?.email,
                customer_name: `${order.delivery?.address?.firstName || ''} ${order.delivery?.address?.lastName || ''} `.trim() ||
                    'Liebe/r Kunde/in',
                order_id: order.order_id || order.summary?.timestamp || 'N/A',
                order_time: order.summary?.timestamp ? new Date(order.summary.timestamp).toLocaleString('de-DE') : 'Unbekannt',
                items: order.items?.map(item => `${item.quantity}x ${item.name} - €${item.total} `).join('\n') || 'Keine',
                total: `€${order.summary?.total || '0.00'} `,
                restaurant_name: 'LEO SUSHI',
                restaurant_address: 'Florastraße 10A, 13187 Berlin',
                restaurant_phone: '+49 30 37476736'
            };

            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            ).then(() => {
                console.log('Order confirmation email sent');
            }).catch(error => {
                console.error('Failed to send order confirmation email:', error);
            });
        }

        // Show beautiful admin success notification
        function showAdminSuccessNotification(order, orderId) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'admin-success-notification';
            notification.id = 'adminSuccessNotification';
            notification.innerHTML = `
                <div class="admin-success-content">
        <div class="admin-success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="url(#adminSuccessGradient)" />
                <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round" />
                <defs>
                    <linearGradient id="adminSuccessGradient" x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stop-color="#10b981" />
                        <stop offset="100%" stop-color="#059669" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <h2 class="admin-success-title">Bestellung bestätigt!</h2>
        <p class="admin-success-message">
            Bestellung <strong>#${orderId.replace('ORD-', '').slice(-8)}</strong> wurde erfolgreich bestätigt.
        </p>
        <div class="admin-success-details">
            <div class="admin-detail-item">
                <span class="admin-detail-label">Kunde:</span>
                <span class="admin-detail-value">${order.delivery?.address?.firstName || ''}
                    ${order.delivery?.address?.lastName || ''}</span>
            </div>
            <div class="admin-detail-item">
                <span class="admin-detail-label">Gesamt:</span>
                <span class="admin-detail-value" style="color: var(--gold);">€${order.summary?.total || '0.00'}</span>
            </div>
        </div>
        <div class="admin-success-actions">
            <div class="admin-action-item">
                <div class="admin-action-icon">📧</div>
                <div class="admin-action-text">
                    <strong>E-Mail gesendet</strong><br>
                    <span>Bestätigungs-E-Mail wurde an den Kunden gesendet.</span>
                </div>
            </div>
            <div class="admin-action-item">
                <div class="admin-action-icon">🖨️</div>
                <div class="admin-action-text">
                    <strong>Rechnung gedruckt</strong><br>
                    <span>Kundenrechnung und Küchenticket wurden gedruckt.</span>
                </div>
            </div>
        </div>
        <button class="admin-success-btn" onclick="closeAdminSuccessNotification()">Verstanden</button>
    </div>
                `;

            // Add styles if not already added
            if (!document.getElementById('adminSuccessNotificationStyles')) {
                const style = document.createElement('style');
                style.id = 'adminSuccessNotificationStyles';
                style.textContent = `
                    .admin-success-notification {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .admin-success-content {
                background: linear-gradient(180deg, #1a1a1a, #0f0f11);
                border: 1px solid rgba(229, 207, 142, 0.2);
                border-radius: 24px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.4s ease;
            }
            @keyframes slideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            .admin-success-icon {
                margin: 0 auto 24px;
                animation: scaleIn 0.5s ease 0.2s both;
            }
            @keyframes scaleIn {
                from { transform: scale(0); }
                to { transform: scale(1); }
            }
            .admin-success-title {
                font-family: "Playfair Display", serif;
                font-size: 32px;
                color: #fff;
                margin: 0 0 16px;
                font-weight: 700;
            }
            .admin-success-message {
                color: rgba(255, 255, 255, 0.8);
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 24px;
            }
            .admin-success-message strong {
                color: var(--gold);
                font-weight: 600;
            }
            .admin-success-details {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 20px;
                margin: 0 0 24px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .admin-detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .admin-detail-item:last-child {
                border-bottom: none;
            }
            .admin-detail-label {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
            }
            .admin-detail-value {
                color: #fff;
                font-weight: 600;
                font-size: 16px;
            }
            .admin-success-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 0 0 24px;
            }
            .admin-action-item {
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                text-align: left;
                animation: slideIn 0.4s ease 0.3s both;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .admin-action-icon {
                font-size: 24px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .admin-action-text {
                flex: 1;
            }
            .admin-action-text strong {
                color: #10b981;
                font-size: 15px;
                display: block;
                margin-bottom: 6px;
            }
            .admin-action-text span {
                color: rgba(255, 255, 255, 0.8);
                font-size: 13px;
                line-height: 1.5;
            }
            .admin-success-btn {
                background: linear-gradient(180deg, var(--gold), var(--gold-2));
                color: #1a1a1a;
                border: none;
                padding: 14px 32px;
                border-radius: 100px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
            }
            .admin-success-btn:hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(194, 163, 85, 0.3);
            }
            @media(max-width: 640px) {
                .admin-success-content {
                    padding: 32px 24px;
                }
                .admin-success-title {
                    font-size: 24px;
                }
            }
            `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto close after 8 seconds
            setTimeout(() => {
                closeAdminSuccessNotification();
            }, 8000);
        }

        // Show beautiful admin reservation success notification
        function showAdminReservationSuccessNotification(reservation, reservationId, formattedTime) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'admin-success-notification';
            notification.id = 'adminReservationSuccessNotification';

            const reservationDateFormatted = reservation.date ? new Date(reservation.date).toLocaleDateString('de-DE', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }) : '';

            notification.innerHTML = `
                <div class="admin-success-content">
        <div class="admin-success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="url(#adminReservationSuccessGradient)" />
                <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round" />
                <defs>
                    <linearGradient id="adminReservationSuccessGradient" x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stop-color="#10b981" />
                        <stop offset="100%" stop-color="#059669" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <h2 class="admin-success-title">Reservierung bestätigt!</h2>
        <p class="admin-success-message">
            Reservierung <strong>#${reservationId.replace('RES-', '').slice(-8)}</strong> wurde erfolgreich bestätigt.
        </p>
        <div class="admin-success-details">
            <div class="admin-detail-item">
                <span class="admin-detail-label">Kunde:</span>
                <span class="admin-detail-value">${reservation.first_name || ''} ${reservation.last_name || ''}</span>
            </div>
            <div class="admin-detail-item">
                <span class="admin-detail-label">Datum & Zeit:</span>
                <span class="admin-detail-value" style="color: var(--gold);">${reservationDateFormatted} um
                    ${formattedTime || reservation.time || ''}</span>
            </div>
            <div class="admin-detail-item">
                <span class="admin-detail-label">Personen:</span>
                <span class="admin-detail-value">${reservation.guests || 1}</span>
            </div>
        </div>
        <div class="admin-success-actions">
            <div class="admin-action-item">
                <div class="admin-action-icon">📧</div>
                <div class="admin-action-text">
                    <strong>E-Mail gesendet</strong><br>
                    <span>Bestätigungs-E-Mail wurde an den Kunden gesendet.</span>
                </div>
            </div>
        </div>
        <button class="admin-success-btn" onclick="closeAdminReservationSuccessNotification()">Verstanden</button>
    </div>
                `;

            document.body.appendChild(notification);

            // Auto close after 8 seconds
            setTimeout(() => {
                closeAdminReservationSuccessNotification();
            }, 8000);
        }

        // Close admin reservation success notification
        function closeAdminReservationSuccessNotification() {
            const notification = document.getElementById('adminReservationSuccessNotification');
            if (notification) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }

        // Close admin success notification
        function closeAdminSuccessNotification() {
            const notification = document.getElementById('adminSuccessNotification');
            if (notification) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }

        // Make functions globally available
        window.closeAdminSuccessNotification = closeAdminSuccessNotification;
        window.closeAdminReservationSuccessNotification = closeAdminReservationSuccessNotification;

        // Check admin login status (server-side)
        async function checkAdminLogin() {
            // 1. Check Master Key Bypass (Local Storage persistent)
            const masterToken = localStorage.getItem('leo_admin_session_token');
            const isLoggedInLocal = localStorage.getItem('leo_admin_logged_in') === 'true';

            if (masterToken === 'master_session_bypass' || (isLoggedInLocal && masterToken === 'master_session_bypass')) {
                const loginModal = document.getElementById('adminLoginModal');
                const logoutBtn = document.getElementById('logoutBtn');
                const adminStatus = document.getElementById('adminStatus');

                if (loginModal) loginModal.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'block';
                if (adminStatus) adminStatus.textContent = '✓ Chủ quán (Bypass)';

                localStorage.setItem('leo_admin_logged_in', 'true');
                localStorage.setItem('leo_admin_role', 'owner');
                localStorage.setItem('leo_admin_session_token', 'master_session_bypass'); // Re-ensure it's set

                // Show stats button for master bypass
                const statsBtnBypass = document.querySelector('.admin-tab[data-tab="stats"]');
                if (statsBtnBypass) statsBtnBypass.style.display = 'flex';

                return true;
            }

            // 2. Localhost helper - auto-fill bypass token if missing
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                if (!localStorage.getItem('leo_admin_session_token')) {
                    localStorage.setItem('leo_admin_session_token', 'master_session_bypass');
                }
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) loginModal.style.display = 'none';
                localStorage.setItem('leo_admin_logged_in', 'true');
                return true; // Bypass on local
            }

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                let response = await fetch(`api/index.php?route=${encodeURIComponent('v1/session')}&_t=${Date.now()}`, {
                    method: 'GET',
                    credentials: 'include' // Important for session cookies
                });

                // Try to restore session if primary check fails
                let checkData = null;
                try {
                    checkData = await response.json();
                } catch (e) {
                    checkData = { success: false, logged_in: false };
                }

                let finalData = checkData;

                if (!checkData || !checkData.logged_in) {
                    const savedToken = localStorage.getItem('leo_admin_session_token');
                    if (savedToken) {
                        try {
                            const restoreResponse = await fetch(`api/index.php?route=${encodeURIComponent('v1/session/restore')}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token: savedToken }),
                                credentials: 'include'
                            });
                            const restoreData = await restoreResponse.json();
                            if (restoreData && restoreData.success && restoreData.logged_in) {
                                finalData = restoreData;
                            } else {
                                localStorage.removeItem('leo_admin_session_token');
                            }
                        } catch (e) {
                            console.error('Failed to restore admin session automatically:', e);
                        }
                    }
                }

                const isLoggedIn = finalData.success && finalData.logged_in === true;
                const role = finalData.role || 'staff';

                const loginModal = document.getElementById('adminLoginModal');
                const logoutBtn = document.getElementById('logoutBtn');
                const adminStatus = document.getElementById('adminStatus');
                const passwordInput = document.getElementById('adminPassword');

                if (isLoggedIn) {
                    if (loginModal) loginModal.style.display = 'none';
                    if (logoutBtn) logoutBtn.style.display = 'block';
                    if (adminStatus) adminStatus.textContent = '✓ ' + (role === 'owner' ? 'Owner' : 'Staff');
                    if (passwordInput) passwordInput.value = ''; // Clear password

                    localStorage.setItem('leo_admin_logged_in', 'true');
                    localStorage.setItem('leo_admin_role', role);

                    // Show content sections
                    const adminMainContent = document.querySelector('.admin-layout');
                    if (adminMainContent) adminMainContent.style.opacity = '1';

                    // Show stats tab for owners or master bypass
                    const sidebarStatsBtn = document.querySelector('.admin-tab[data-tab="stats"]');
                    if (sidebarStatsBtn) {
                        sidebarStatsBtn.style.display = (role === 'owner' || masterToken === 'master_session_bypass') ? 'flex' : 'none';
                    }

                    // CRITICAL: Ensure data is loaded if this is the initial login/restore
                    if (!window.__adminDataInitialized) {
                        console.log('🚀 [INIT] First load after login/restore, calling loadAllData()');
                        window.__adminDataInitialized = true;
                        loadAllData();
                    }
                } else {
                    // IMPORTANT: Before clearing, check if master bypass is still active.
                    // The server session may have expired but the client bypass should still persist.
                    const currentBypassToken = localStorage.getItem('leo_admin_session_token');
                    if (currentBypassToken === 'master_session_bypass') {
                        // Re-run the function — this time the bypass check at the top will catch it.
                        return await checkAdminLogin();
                    }
                    if (loginModal) loginModal.style.display = 'flex';
                    if (logoutBtn) logoutBtn.style.display = 'none';
                    if (adminStatus) adminStatus.textContent = '';
                    localStorage.removeItem('leo_admin_logged_in');
                    localStorage.removeItem('leo_admin_role');
                }

                return isLoggedIn;
            } catch (error) {
                console.error('Error checking admin login:', error);
                // On error, show login modal
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) loginModal.style.display = 'flex';
                return false;
            }
        }

        // Handle admin login - Step 1: Send verification code
        async function handleAdminLogin() {
            const password = document.getElementById('adminPassword')?.value;
            const loginBtn = document.querySelector('#loginStep1 .btn-confirm');
            const originalBtnText = loginBtn?.textContent;

            if (!password) {
                showMenuNotification('❌ Bitte geben Sie ein Passwort ein.', 'error');
                return;
            }

            // Disable button and show loading
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'Wird geprüft...';
            }

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/auth/send-code')}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ password: password })
                });

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response:', text);
                    showMenuNotification('❌ Server-Fehler. Bitte versuchen Sie es erneut.', 'error');
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    // Show step 2 (verification code)
                    document.getElementById('loginStep1').style.display = 'none';
                    document.getElementById('loginStep2').style.display = 'block';
                    document.getElementById('adminVerificationCode').focus();
                    showMenuNotification('✅ Bestätigungscode wurde an Ihre E-Mail gesendet.', 'success');
                } else {
                    const message = data.message || 'Falsches Passwort';
                    const attemptsRemaining = data.attempts_remaining;
                    let errorMsg = `❌ ${message} `;
                    if (attemptsRemaining !== undefined) {
                        errorMsg += ` (${attemptsRemaining} Versuche verbleibend)`;
                    }
                    console.error('Login failed:', data);
                    showMenuNotification(errorMsg, 'error');
                }
            } catch (error) {
                console.error('Error during admin login:', error);
                showMenuNotification('❌ Fehler beim Senden des Codes. Bitte versuchen Sie es erneut.', 'error');
            } finally {
                // Re-enable button
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = originalBtnText || 'Weiter';
                }
            }
        }

        // Toggle between login modes
        function switchLoginMode(mode) {
            const tabNormal = document.getElementById('tabNormal');
            const tabMaster = document.getElementById('tabMaster');
            const normalFlow = document.getElementById('normalLoginFlow');
            const masterFlow = document.getElementById('masterLoginFlow');

            if (mode === 'normal') {
                if (tabNormal) tabNormal.style.background = 'var(--gold)';
                if (tabNormal) tabNormal.style.color = '#000';
                if (tabMaster) tabMaster.style.background = 'transparent';
                if (tabMaster) tabMaster.style.color = 'rgba(255,255,255,0.6)';
                if (normalFlow) normalFlow.style.display = 'block';
                if (masterFlow) masterFlow.style.display = 'none';
            } else {
                if (tabMaster) tabMaster.style.background = 'var(--gold)';
                if (tabMaster) tabMaster.style.color = '#000';
                if (tabNormal) tabNormal.style.background = 'transparent';
                if (tabNormal) tabNormal.style.color = 'rgba(255,255,255,0.6)';
                if (normalFlow) normalFlow.style.display = 'none';
                if (masterFlow) masterFlow.style.display = 'block';
                setTimeout(() => {
                    const masterInput = document.getElementById('masterKeyInput');
                    if (masterInput) masterInput.focus();
                }, 100);
            }
        }

        // Handle Master Key Login (Emergency Entrance)
        async function handleMasterLogin() {
            const key = document.getElementById('masterKeyInput')?.value;
            if (key === '0301') {
                showMenuNotification('✅ Mật mã Chủ chính xác. Đang vào hệ thống...', 'success');

                // Force set persistent tokens immediately
                localStorage.setItem('leo_admin_logged_in', 'true');
                localStorage.setItem('leo_admin_role', 'owner');
                localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

                // Hide modal immediately and forcefully
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) {
                    loginModal.style.display = 'none';
                    // Add a marker to prevent re-opening for a few seconds during transition
                    loginModal.setAttribute('data-bypass-active', 'true');
                }

                // Cleanup inputs
                const masterInput = document.getElementById('masterKeyInput');
                if (masterInput) masterInput.value = '';

                // Trigger refresh
                await checkAdminLogin();
                // Load all data to be sure
                await loadAllData(false);

                // Force switch to orders or stats if needed
                if (typeof switchTab === 'function') switchTab('orders');
            } else {
                showMenuNotification('❌ Mật mã Chủ không đúng!', 'error');
            }
        }

        // Handle verification code - Step 2: Verify and login
        async function handleVerifyCode() {
            const code = document.getElementById('adminVerificationCode')?.value;
            const verifyBtn = document.querySelector('#loginStep2 .btn-confirm');
            const originalBtnText = verifyBtn?.textContent;

            if (!code || code.length !== 6) {
                showMenuNotification('❌ Bitte geben Sie den 6-stelligen Code ein.', 'error');
                return;
            }

            // Disable button and show loading
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.textContent = 'Wird geprüft...';
            }

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/auth/verify-code')}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ code: code })
                });

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Non-JSON response from verify-code:', text);
                    showMenuNotification('❌ Server-Fehler. Bitte versuchen Sie es erneut.', 'error');
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    if (data.session_id) {
                        localStorage.setItem('leo_admin_session_token', data.session_id);
                    }
                    if (data.role) {
                        localStorage.setItem('leo_admin_role', data.role);
                    }
                    showMenuNotification('✅ Erfolgreich angemeldet!', 'success');
                    // Force hide modal immediately
                    const loginModal = document.getElementById('adminLoginModal');
                    if (loginModal) loginModal.style.display = 'none';

                    // Clear inputs
                    if (document.getElementById('adminPassword')) {
                        document.getElementById('adminPassword').value = '';
                    }
                    if (document.getElementById('adminVerificationCode')) {
                        document.getElementById('adminVerificationCode').value = '';
                    }
                    // Reset to step 1
                    document.getElementById('loginStep1').style.display = 'block';
                    document.getElementById('loginStep2').style.display = 'none';
                    await checkAdminLogin();
                } else {
                    const message = data.message || 'Ungültiger Code';
                    console.error('Verify code failed:', data);
                    showMenuNotification(`❌ ${message} `, 'error');
                }
            } catch (error) {
                console.error('Error during code verification:', error);
                showMenuNotification('❌ Fehler bei der Code-Verifizierung. Bitte versuchen Sie es erneut.', 'error');
            } finally {
                // Re-enable button
                if (verifyBtn) {
                    verifyBtn.disabled = false;
                    verifyBtn.textContent = originalBtnText || 'Code bestätigen';
                }
            }
        }

        // Resend verification code
        async function resendVerificationCode() {
            const password = document.getElementById('adminPassword')?.value;

            if (!password) {
                showMenuNotification('❌ Bitte geben Sie zuerst Ihr Passwort ein.', 'error');
                backToPasswordStep();
                return;
            }

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/auth/send-code')}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ password: password })
                });

                const data = await response.json();

                if (data.success) {
                    showMenuNotification('✅ Neuer Bestätigungscode wurde gesendet.', 'success');
                } else {
                    showMenuNotification(`❌ ${data.message || 'Fehler beim Senden des Codes'} `, 'error');
                }
            } catch (error) {
                console.error('Error resending code:', error);
                showMenuNotification('❌ Fehler beim Senden des Codes.', 'error');
            }
        }

        // Back to password step
        function backToPasswordStep() {
            document.getElementById('loginStep1').style.display = 'block';
            document.getElementById('loginStep2').style.display = 'none';
            document.getElementById('adminVerificationCode').value = '';
            document.getElementById('adminPassword').focus();
        }

        // Handle admin logout (server-side)
        async function handleAdminLogout() {
            if (!confirm('Möchten Sie sich abmelden?')) {
                return;
            }

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/session/end')}`, {
                    method: 'POST',
                    credentials: 'include'
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.removeItem('leo_admin_session_token');
                    showMenuNotification('✅ Erfolgreich abgemeldet!', 'success');
                    await checkAdminLogin();
                } else {
                    showMenuNotification('❌ Fehler beim Abmelden.', 'error');
                }
            } catch (error) {
                console.error('Error during admin logout:', error);
                // Force logout on client side even if server request fails
                localStorage.removeItem('leo_admin_session_token');
                await checkAdminLogin();
            }
        }

        // Auto-check session every 2 minutes (to detect if logged in elsewhere)
        setInterval(async () => {
            await checkAdminLogin();
        }, 120000); // 2 minutes

        // Make functions globally available
        window.handleAdminLogin = handleAdminLogin;
        window.handleVerifyCode = handleVerifyCode;
        window.switchLoginMode = switchLoginMode;
        window.handleMasterLogin = handleMasterLogin;
        window.resendVerificationCode = resendVerificationCode;
        window.backToPasswordStep = backToPasswordStep;
        window.handleAdminLogout = handleAdminLogout;
        window.filterOrders = filterOrders;
        window.filterOrdersByStatus = filterOrdersByStatus;
        window.filterReservations = filterReservations;
        window.filterReservationsByStatus = filterReservationsByStatus;
        window.setQuickTime = setQuickTime;
        window.confirmWithScheduledTime = confirmWithScheduledTime;
        window.closeTimeScheduleModal = closeTimeScheduleModal;
        window.applyDateFilter = applyDateFilter;
        window.closeNewOrderNotification = closeNewOrderNotification;
        window.viewNewOrder = viewNewOrder;
        window.testNotificationSound = testNotificationSound;
        window.loadCustomers = loadCustomers;
        window.filterCustomers = filterCustomers;

        // Wait for scripts to load before initializing
        function waitForScripts() {
            return new Promise((resolve) => {
                // Check if API and required scripts are loaded
                const checkScripts = setInterval(() => {
                    if (window.api && window.api.orders) {
                        console.log('✅ API scripts loaded');
                        clearInterval(checkScripts);
                        resolve();
                    }
                }, 100);

                // Timeout after 3 seconds
                setTimeout(() => {
                    clearInterval(checkScripts);
                    console.log('Script loading timeout, continuing anyway...');
                    resolve();
                }, 3000);
            });
        }

        // Load data on page load
        // Load data on page load - Main Consolidation
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('📋 Admin panel DOMContentLoaded - Main Init');

            // 1. Ensure body is interactive
            document.body.style.pointerEvents = 'auto';

            // IMPORTANT: Bind event listeners manually since inline onclick might be blocked by CSP
            document.querySelectorAll('.admin-tab, .nav-item').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    const onclickStr = this.getAttribute('onclick') || '';
                    const tabMatch = onclickStr.match(/switchTab\('([^']+)'\)/);
                    const tab = this.getAttribute('data-tab') || (tabMatch ? tabMatch[1] : null);

                    if (tab && typeof window.switchTab === 'function') {
                        e.preventDefault();
                        window.switchTab(tab);
                    }
                });
            });

            // 2. Initialize printer and pickers
            if (typeof initPrinterAndPickers === 'function') {
                initPrinterAndPickers();
            } else {
                const today = getLocalDateStr(new Date());
                const dp = document.getElementById('datePicker');
                const rdp = document.getElementById('reservationDatePicker');
                if (dp) dp.value = today;
                if (rdp) rdp.value = today;
            }

            // 2. Initialize Cross-Tab Sync Channel
            if ('BroadcastChannel' in window) {
                window.adminSyncChannel = new BroadcastChannel('leo_admin_sync');
                window.adminSyncChannel.onmessage = (event) => {
                    if (event.data && event.data.type === 'NEW_ORDER') {
                        loadOrders(true, true);
                    }
                };
            }

            // 3. Wait for api script
            await waitForScripts();

            // 4. Check login status
            const isLoggedIn = await checkAdminLogin();

            // 6. Initial data load (silent)
            if (isLoggedIn) {
                try {
                    // Load statistics first as they are quick
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                        AdminStats.loadStats();
                    }

                    // Load primary data
                    await loadAllData(true);

                    if (typeof loadDiscountCodes === 'function') loadDiscountCodes();

                    // Final check: if ordersList still has spinner after loadAllData, something failed silently
                    setTimeout(() => {
                        const ordersList = document.getElementById('ordersList');
                        if (ordersList && ordersList.innerHTML.includes('Đang cập nhật dữ liệu')) {
                            console.warn('⚠️ Dashboard loaded but Orders list is still stuck in loading state. Forcing non-silent reload.');
                            loadOrders(false);
                        }
                    }, 2000);
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            } else {
                console.log('ℹ️ Admin not logged in, waiting for authentication.');
            }

            // 7. Initialize printer status
            if (typeof updatePrinterStatusUI === 'function') updatePrinterStatusUI();

            // 8. Auto-Print status check
            const toggleBtn = document.getElementById('autoPrintToggle');
            if (toggleBtn) {
                const isEnabled = localStorage.getItem('autoPrintEnabled') === 'true';
                toggleBtn.checked = isEnabled;
                const logPanel = document.getElementById('autoPrintLogPanel');
                if (logPanel && isEnabled) {
                    logPanel.style.display = 'block';
                    if (typeof printLog === 'function') printLog('Auto-print đang bật từ phiên trước', 'info');
                }
            }

            // 9. Auto-refresh loops with Safe Recursive Pattern (Prevents PHP Session Deadlocks)
            let isRefreshingOrders = false;

            async function autoRefreshData() {
                if (localStorage.getItem('leo_admin_logged_in') === 'true' && !refreshPaused) {
                    if (!isUserInteracting && !isModalOpen()) {
                        const activeTab = document.querySelector('.admin-tab.active');
                        const tabText = activeTab ? activeTab.textContent.trim() : '';

                        if (tabText.includes('Bestellungen') && !isRefreshingOrders) {
                            isRefreshingOrders = true;
                            try {
                                await loadOrders(true, true);
                            } catch (e) { }
                            isRefreshingOrders = false;
                        } else if (tabText.includes('Reservierungen')) {
                            try { await loadReservations(true); } catch (e) { }
                        }
                    }
                }

                // Recursively call after 5 seconds to prevent overlapping requests
                setTimeout(autoRefreshData, 5000);
            }

            // Start the safe refresh loop
            setTimeout(autoRefreshData, 5000);

            // 10. Handle deep links
            const urlParams = new URLSearchParams(window.location.search);
            const orderToConfirm = urlParams.get('order_id');
            const action = urlParams.get('action');
            if (orderToConfirm && (action === 'confirm' || action === 'cancel')) {
                if (typeof switchTab === 'function') switchTab('orders');
                setTimeout(() => {
                    if (action === 'confirm' && typeof showTimeScheduleModal === 'function') {
                        showTimeScheduleModal(orderToConfirm);
                    } else if (action === 'cancel' && typeof cancelOrder === 'function') {
                        cancelOrder(orderToConfirm);
                    }
                    window.history.replaceState({}, document.title, window.location.pathname);
                }, 1500);
            }

            // 11. Register mobile push
            setTimeout(() => { if (typeof registerMobilePush === 'function') registerMobilePush(); }, 2000);
        });
    


        function updateNav(el) {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
        }

        function toggleMoreMenu() {
            const menu = document.getElementById('moreMenu');
            if (menu.style.bottom === '0px') {
                menu.style.bottom = '-100%';
            } else {
                menu.style.bottom = '0px';
            }
        }

        let wakeLock = null;
        async function toggleDashboardMode() {
            const btn = document.getElementById('dashboardModeBtn');
            if (!wakeLock) {
                try {
                    if ('wakeLock' in navigator) {
                        wakeLock = await navigator.wakeLock.request('screen');
                        btn.style.color = 'var(--gold)';
                        btn.textContent = '📺 Dashboard: ON';
                        showMenuNotification('✅ Dashboard Mode: Screen will stay ON', 'success');

                        wakeLock.addEventListener('release', () => {
                            wakeLock = null;
                            btn.style.color = '#888';
                            btn.textContent = '📺 Dashboard: OFF';
                        });
                    } else {
                        showMenuNotification('❌ Wake Lock not supported in this browser', 'error');
                    }
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            } else {
                wakeLock.release();
                wakeLock = null;
                btn.style.color = '#888';
                btn.textContent = '📺 Dashboard: OFF';
            }
        }

        // Mobile Push Notification Registration
        async function registerMobilePush() {
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                const PushNotifications = window.Capacitor.Plugins.PushNotifications;

                let permStatus = await PushNotifications.checkPermissions();
                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }
                if (permStatus.receive !== 'granted') return;

                await PushNotifications.register();

                PushNotifications.addListener('registration', async (token) => {
                    console.log('Push registration success, token: ' + token.value);
                    // Register on server
                    try {
                        await fetch('api/index.php?route=v1/data/orders/register-token', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                token: token.value,
                                user_type: 'admin',
                                device_info: navigator.userAgent
                            })
                        });
                    } catch (e) {
                        console.error('Server token registration failed', e);
                    }
                });

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Push received: ', notification);
                    loadOrders(true, true); // Refresh UI
                    // Also trigger custom event for widget if possible
                });
            }
        }

        // Auto-Print Toggle logic
        function toggleAutoPrint(checked) {
            // Check if a printer is configured before allowing auto-print
            if (checked && typeof PrinterManager !== 'undefined') {
                const savedPrinter = PrinterManager.getSavedPrinter();
                if (!savedPrinter) {
                    alert('Bạn chưa kết nối máy in! Vui lòng vào Menu máy in (biểu tượng 🖨️ ở trên) để chọn máy in trước khi bật tính năng này.');
                    document.getElementById('autoPrintToggle').checked = false;
                    return;
                }
            }
            localStorage.setItem('autoPrintEnabled', checked ? 'true' : 'false');

            // Show/hide log panel
            const logPanel = document.getElementById('autoPrintLogPanel');
            const statusEl = document.getElementById('autoPrintStatus');
            if (logPanel) logPanel.style.display = checked ? 'block' : 'none';
            if (statusEl) {
                statusEl.style.color = checked ? '#10b981' : '#ef4444';
                statusEl.textContent = checked ? '● ĐANG BẬT' : '● ĐÃ TẮT';
            }

            if (checked) {
                printLog('Đã BẬT tự động in', 'success');
                // Auto-clear old local cache to give fresh start
                localStorage.removeItem('leo_printed_orders');
                printLog('Đã xoá cache đơn cũ, sẵn sàng in đơn mới', 'info');
            } else {
                printLog('Đã TẮT tự động in', 'warn');
            }

            if (typeof showMenuNotification === 'function') {
                showMenuNotification(checked ? 'Đã BẬT tự động in đơn mới' : 'Đã TẮT tự động in đơn mới', checked ? 'success' : 'info');
            }
        }

        // Final initialization moved to main DOMContentLoaded listener above
    