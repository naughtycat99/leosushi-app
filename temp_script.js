
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
    
        // Setup polling for browser clients
        if (!window._adminPollingInterval) {
            window._adminPollingInterval = setInterval(() => {
                if (document.hidden || window.__loadOrdersRunning || typeof loadOrders !== 'function') return;
                if (window.isConfirmingOrder) return;
                loadOrders(true, true).catch(e => console.log('Polling error:', e));
            }, 8000);
        }
    

    


