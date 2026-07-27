
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
    