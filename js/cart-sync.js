/**
 * Cart Synchronization Module
 * Đồng bộ giỏ hàng giữa các thiết bị khi user đăng nhập
 */

(function () {
  console.log('🔄 Cart Sync Module loaded');

  // Check if user is logged in
  function isUserLoggedIn() {
    const user = localStorage.getItem('user');
    return user && user !== 'null';
  }

  // Get API base URL
  function getApiUrl() {
    if (typeof window.getApiBaseUrl === 'function') {
      return window.getApiBaseUrl();
    }
    return 'https://www.leo-sushi-berlin.de/api';
  }

  /**
   * Sync cart to server
   */
  async function syncCartToServer() {
    if (!isUserLoggedIn()) {
      console.log('⚠️ User not logged in, skip cart sync');
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('leoCart') || '[]');
      console.log('📤 Syncing cart to server:', cart.length, 'items');

      const response = await fetch(`${getApiUrl()}/cart-sync.php?action=sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Leo-Client-ID': 'leosushi-client-app-v1'
        },
        credentials: 'include',
        body: JSON.stringify({ cart })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Cart synced to server successfully');
        localStorage.setItem('cartLastSynced', Date.now().toString());
      } else {
        console.error('❌ Failed to sync cart:', data.error);
      }
    } catch (error) {
      console.error('❌ Error syncing cart to server:', error);
    }
  }

  /**
   * Load cart from server
   */
  async function loadCartFromServer() {
    if (!isUserLoggedIn()) {
      console.log('⚠️ User not logged in, skip cart load');
      return;
    }

    try {
      console.log('📥 Loading cart from server...');

      const response = await fetch(`${getApiUrl()}/cart-sync.php?action=get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Leo-Client-ID': 'leosushi-client-app-v1'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success && data.cart) {
        const serverCart = data.cart;
        const localCart = JSON.parse(localStorage.getItem('leoCart') || '[]');

        console.log('📊 Server cart:', serverCart.length, 'items');
        console.log('📊 Local cart:', localCart.length, 'items');

        // Merge carts: prefer server cart if it's newer
        if (serverCart.length > 0) {
          // Check if we should use server cart
          const lastSynced = parseInt(localStorage.getItem('cartLastSynced') || '0');
          const serverUpdated = new Date(data.updated_at).getTime();

          if (serverUpdated > lastSynced || localCart.length === 0) {
            console.log('✅ Using server cart (newer or local is empty)');
            localStorage.setItem('leoCart', JSON.stringify(serverCart));
            localStorage.setItem('cartLastSynced', Date.now().toString());

            // Update UI
            if (typeof window.updateCartUI === 'function') {
              window.updateCartUI();
            }
          } else {
            console.log('ℹ️ Local cart is newer, syncing to server');
            await syncCartToServer();
          }
        } else if (localCart.length > 0) {
          // Server cart is empty but local has items, sync to server
          console.log('ℹ️ Server cart empty, syncing local cart');
          await syncCartToServer();
        }
      }
    } catch (error) {
      console.error('❌ Error loading cart from server:', error);
    }
  }

  /**
   * Clear cart on server
   */
  async function clearCartOnServer() {
    if (!isUserLoggedIn()) {
      return;
    }

    try {
      console.log('🗑️ Clearing cart on server...');

      const response = await fetch(`${getApiUrl()}/cart-sync.php?action=clear`, {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Cart cleared on server');
        localStorage.removeItem('cartLastSynced');
      }
    } catch (error) {
      console.error('❌ Error clearing cart on server:', error);
    }
  }

  /**
   * Initialize cart sync
   */
  function initCartSync() {
    console.log('🔄 Initializing cart sync...');

    // Load cart from server when page loads (if logged in)
    if (isUserLoggedIn()) {
      loadCartFromServer();
    }

    // Sync cart to server when cart changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);

      if (key === 'leoCart' && isUserLoggedIn()) {
        // Debounce sync to avoid too many requests
        clearTimeout(window.cartSyncTimeout);
        window.cartSyncTimeout = setTimeout(() => {
          syncCartToServer();
        }, 1000);
      }
    };

    // Listen for login event
    window.addEventListener('userLoggedIn', function () {
      console.log('👤 User logged in, loading cart from server');
      loadCartFromServer();
    });

    // Listen for logout event
    window.addEventListener('userLoggedOut', function () {
      console.log('👤 User logged out, clearing cart sync');
      localStorage.removeItem('cartLastSynced');
    });

    console.log('✅ Cart sync initialized');
  }

  // Expose functions globally
  window.syncCartToServer = syncCartToServer;
  window.loadCartFromServer = loadCartFromServer;
  window.clearCartOnServer = clearCartOnServer;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartSync);
  } else {
    initCartSync();
  }
})();
