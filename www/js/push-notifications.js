/**
 * Push Notification Handler for LEO SUSHI (Admin & Customer)
 * Registers device token and handles incoming push notifications using Capacitor PushNotifications plugin.
 */
(function () {
    console.log('🔔 Initializing Capacitor Push Notifications...');

    // In Capacitor Online Mode, window.Capacitor is injected asynchronously.
    let checkAttempts = 0;
    const checkInterval = setInterval(() => {
        checkAttempts++;
        if (checkAttempts > 50) { // Give up after 10 seconds
            clearInterval(checkInterval);
            console.log('Not running in native app (Capacitor not found), skipping native push notifications');
            return;
        }

        if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
            clearInterval(checkInterval);
            console.log('📱 Capacitor native platform detected, initializing Push Notifications...');
            initPushNotifications();
        }
    }, 200);

    async function initPushNotifications() {
        const { PushNotifications } = window.Capacitor.Plugins || {};
        if (!PushNotifications) {
            console.error('PushNotifications plugin not available');
            return;
        }

        // Request permission
        try {
            const permResult = await PushNotifications.requestPermissions();
            console.log('Push permission result:', permResult.receive);

            if (permResult.receive === 'granted') {
                await PushNotifications.register();
                console.log('✅ Push registration initiated');
            } else {
                console.warn('Push permission denied');
            }
        } catch (err) {
            console.error('Error initializing push:', err);
        }

        // Handle registration success
        PushNotifications.addListener('registration', async (token) => {
            console.log('✅ FCM Token received:', token.value);
            
            // Determine user type: admin or customer (email)
            let userType = 'admin';
            let adminToken = localStorage.getItem('leo_admin_token') || '';
            
            // If not an admin, check if customer is logged in
            if (!adminToken) {
                const userJson = localStorage.getItem('user');
                if (userJson) {
                    try {
                        const user = JSON.parse(userJson);
                        if (user && user.email) {
                            userType = user.email;
                        }
                    } catch (e) {
                        console.error('Error parsing user for push registration:', e);
                    }
                }
            }
            
            try {
                // Use absolute URL since Capacitor runs on localhost internally
                const apiUrl = typeof API_PHP_BASE_URL !== 'undefined' ? API_PHP_BASE_URL : 'https://www.leo-sushi-berlin.de/api';
                const response = await fetch(`${apiUrl}/push-register.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': adminToken ? 'Bearer ' + adminToken : ''
                    },
                    body: JSON.stringify({
                        token: token.value,
                        device: window.Capacitor.getPlatform(),
                        type: userType // 'admin' or customer email
                    })
                });
                const data = await response.json();
                console.log('Token saved to server:', data);
            } catch (err) {
                console.error('Error saving token:', err);
            }
        });

        // Handle registration error
        PushNotifications.addListener('registrationError', (error) => {
            console.error('Registration error:', error.error);
        });

        // Handle incoming notification (foreground)
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('🔔 Push received (foreground):', notification);
            
            // Play sound if possible
            if (typeof playNotificationSound === 'function') {
                playNotificationSound();
            }
        });

        // Handle notification action (tapped)
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            console.log('🔔 Push tapped:', action);
            const data = action.notification?.data || {};
            const orderId = data.order_id;

            if (orderId) {
                // If admin app, view order
                if (typeof window.viewNewOrder === 'function') {
                    window.viewNewOrder(orderId);
                } 
                // If customer app, go to tracking
                else if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                    window.location.href = 'profile.html#orders';
                }
            }
        });
    }
})();
