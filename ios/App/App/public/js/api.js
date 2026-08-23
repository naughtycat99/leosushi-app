// API Client for Backend
// This file replaces Firebase calls with REST API calls

// Auto-detect base URL from current location (supports both HTTP and HTTPS)
function getBaseURL() {
  // If explicitly set, use it
  if (window.API_PHP_BASE_URL) {
    return window.API_PHP_BASE_URL;
  }

  // Check if running in Capacitor app
  const isCapacitor = window.Capacitor && window.Capacitor.isNativePlatform();

  if (isCapacitor) {
    // In Capacitor app, use server URL from config or default production URL
    // You should set this in capacitor.config.js -> server.url
    const capacitorConfig = window.Capacitor?.getConfig?.();
    if (capacitorConfig?.server?.url) {
      // If server.url is set, API is on same domain
      return capacitorConfig.server.url + '/api';
    }
    // Fallback: use production API URL
    return 'https://www.leo-sushi-berlin.de/api'; // Đường dẫn API chính thức
  }


  // Auto-detect from current location (web browser)
  const protocol = window.location.protocol; // 'http:' or 'https:'
  const host = window.location.host; // e.g., 'www.leo-sushi.de' or 'localhost'
  const pathname = window.location.pathname; // e.g., '/leosushi/' or '/'

  // Determine API path — detect project folder from URL
  let apiPath = '/api';
  const folderMatch = pathname.match(/\/(leosushi[^/]*)\//);
  if (folderMatch) {
    apiPath = '/' + folderMatch[1] + '/api';
  }

  // Build full URL with detected protocol
  return `${protocol}//${host}${apiPath}`;
}

const API_BASE_URL = window.API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : getBaseURL());
const API_PHP_BASE_URL = getBaseURL();

// Helper function to get auth token
function getAuthToken() {
  const user = localStorage.getItem('leo_user');
  const adminToken = localStorage.getItem('leo_admin_session_token');

  // Priority to admin token if present (for admin panel)
  if (adminToken) return adminToken;

  if (!user) return null;
  try {
    const userData = JSON.parse(user);
    return userData.token || null;
  } catch (e) {
    return null;
  }
}

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${API_PHP_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

  try {
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    const response = await fetch(fullEndpoint, {
      ...options,
      credentials: isNative ? 'same-origin' : 'include',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('API returned non-JSON response:', text.substring(0, 200));
      throw new Error('Server returned HTML instead of JSON. Check API endpoint: ' + fullEndpoint);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('API request error:', error);

    if (error.name === 'AbortError') {
      throw new Error('Zeitüberschreitung der Anforderung (Timeout). Der Server antwortet zu langsam.');
    }

    // Provide better error messages
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Backend-Server ist nicht erreichbar. Bitte überprüfen Sie Ihre Netzwerkverbindung.');
    }
    throw error;
  }
}

// Auth API
const authAPI = {
  // Register new user
  async register(userData) {
    return await apiRequest('/auth.php?action=register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        street: userData.street,
        postal: userData.postal,
        city: userData.city,
        password: userData.password
      })
    });
  },

  // Login user
  async login(email, phone, password) {
    return await apiRequest('/auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, phone, password })
    });
  },

  // Verify email
  async verifyEmail(token, email) {
    return await apiRequest('/auth.php?action=verify-email', {
      method: 'POST',
      body: JSON.stringify({ token, email })
    });
  },

  // Get current user
  async getCurrentUser() {
    return await apiRequest('/auth.php?action=me');
  },

  // Validate discount code
  async validateDiscountCode(code) {
    return await apiRequest('/auth/validate-discount', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  // Mark discount code as used
  async markDiscountCodeUsed() {
    return await apiRequest('/auth/mark-discount-used', {
      method: 'POST'
    });
  },

  async requestPasswordReset(identifier) {
    return await apiRequest('/auth.php?action=request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
  },

  async resetPassword({ email, token, password, confirmPassword }) {
    return await apiRequest('/auth.php?action=reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password, confirmPassword })
    });
  }
};

// Orders API
const ordersAPI = {
  // Save order
  async saveOrder(orderData) {
    return await apiRequest('/index.php?route=v1/data/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // List orders
  async list(status = 'all') {
    return await apiRequest(`/index.php?route=v1/data/orders/list&status=&_t=${status}`);
  },

  // Get order by ID
  async getOrder(orderId) {
    return await apiRequest(`/index.php?route=v1/data/orders/get&order_id=${orderId}`);
  },

  // Update order status
  async updateStatus(orderId, status, extraData = {}) {
    return await apiRequest('/index.php?route=v1/data/orders/update', {
      method: 'PUT',
      body: JSON.stringify({
        order_id: orderId,
        status: status,
        ...extraData
      })
    });
  }
};

// Reservations API
const reservationsAPI = {
  // Save reservation
  async saveReservation(reservationData) {
    return await apiRequest('/index.php?route=v1/data/reservations/create', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  },

  // Get reservation by ID
  async getReservation(reservationId) {
    return await apiRequest(`/reservations/${reservationId}`);
  }
};

// Menu Management API
const menuAPI = {
  // Categories
  async getCategories() {
    return await apiRequest('/menu/categories');
  },

  async getCategory(categoryId) {
    return await apiRequest(`/menu/categories/${categoryId}`);
  },

  async createCategory(categoryData) {
    return await apiRequest('/menu/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  },

  async updateCategory(categoryId, categoryData) {
    return await apiRequest(`/menu/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  },

  async deleteCategory(categoryId) {
    return await apiRequest(`/menu/categories/${categoryId}`, {
      method: 'DELETE'
    });
  },

  // Menu Items
  async getMenuItems(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.available !== undefined) params.append('available', filters.available);
    if (filters.branch_id) params.append('branch_id', filters.branch_id);

    const query = params.toString();
    // Use PHP API endpoint via Router
    return await apiRequest(`/index.php?route=v1/data/menu/list${query ? '&' + query : ''}`);
  },

  // Categories
  async getCategories(filters = {}) {
    const params = new URLSearchParams();
    if (filters.branch_id) params.append('branch_id', filters.branch_id);
    
    const query = params.toString();
    // Use PHP API endpoint via Router
    return await apiRequest(`/index.php?route=v1/data/menu/categories${query ? '&' + query : ''}`);
  },

  async getMenuItem(itemId) {
    return await apiRequest(`/menu/items/${itemId}`);
  },

  async createMenuItem(itemData) {
    return await apiRequest('/menu/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },

  async updateMenuItem(itemId, itemData) {
    return await apiRequest(`/menu/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  },

  async deleteMenuItem(itemId) {
    return await apiRequest(`/menu/items/${itemId}`, {
      method: 'DELETE'
    });
  },

  // Menu Item Options
  async getMenuItemOptions(itemId) {
    return await apiRequest(`/menu/items/${itemId}/options`);
  },

  async createMenuItemOption(itemId, optionData) {
    return await apiRequest(`/menu/items/${itemId}/options`, {
      method: 'POST',
      body: JSON.stringify(optionData)
    });
  },

  async updateMenuItemOption(optionId, optionData) {
    return await apiRequest(`/menu/options/${optionId}`, {
      method: 'PUT',
      body: JSON.stringify(optionData)
    });
  },

  async deleteMenuItemOption(optionId) {
    return await apiRequest(`/menu/options/${optionId}`, {
      method: 'DELETE'
    });
  }
};

// Promotions API
const promotionsAPI = {
  async validate(code, subtotal = 0, email = '') {
    return await apiRequest('/index.php?route=v1/data/promotions/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, email })
    });
  }
};

// Points/Loyalty API
const pointsAPI = {
  async getPoints(customerId) {
    return await apiRequest(`/index.php?route=v1/data/points/get&customer_id=${customerId}`);
  },

  async getTransactions(customerId) {
    return await apiRequest(`/index.php?route=v1/data/points/transactions&customer_id=${customerId}`);
  },

  async earnPoints(customerId, orderId, orderTotal, points = null) {
    return await apiRequest('/index.php?route=v1/data/points/earn', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        order_id: orderId,
        order_total: orderTotal,
        points: points
      })
    });
  },

  async redeemPoints(customerId, ruleId) {
    return await apiRequest('/index.php?route=v1/data/points/redeem', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        rule_id: ruleId
      })
    });
  },

  async getRedemptionRules() {
    return await apiRequest('/index.php?route=v1/data/points/rules');
  },

  async checkBirthdayPromotion(customerId) {
    return await apiRequest(`/index.php?route=v1/data/points/check-birthday&customer_id=${customerId}`);
  }
};

// Reviews API
const reviewsAPI = {
  // Get reviews list
  async list(limit = 10, status = 'approved') {
    return await apiRequest(`/index.php?route=v1/data/reviews/list&limit=${limit}&status=${status}`);
  },

  // Get review statistics
  async stats() {
    return await apiRequest('/index.php?route=v1/data/reviews/stats');
  },

  // Create review
  async create(reviewData) {
    return await apiRequest('/index.php?route=v1/data/reviews/create', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }
};

// Expose to window
if (typeof window !== 'undefined') {
  window.api = {
    auth: authAPI,
    orders: ordersAPI,
    reservations: reservationsAPI,
    menu: menuAPI,
    promotions: promotionsAPI,
    points: pointsAPI,
    reviews: reviewsAPI
  };

  // Expose global checkout error logger
  window.logCheckoutError = async function(step, message, customerInfo = {}, cartTotal = '0.00 €', paymentMethod = 'N/A') {
    try {
      const errorData = {
        error_step: step,
        error_message: message,
        customer_name: customerInfo.name || customerInfo.customer_name || 'Gast',
        customer_phone: customerInfo.phone || customerInfo.customer_phone || 'N/A',
        customer_email: customerInfo.email || customerInfo.customer_email || 'N/A',
        cart_total: cartTotal,
        payment_method: paymentMethod,
        page_url: window.location.pathname + window.location.search
      };
      
      console.warn('Logging checkout error to server...', errorData);
      
      return await apiRequest('/log-checkout-error.php', {
        method: 'POST',
        body: JSON.stringify(errorData)
      });
    } catch (e) {
      console.error('Failed to report checkout error:', e);
    }
  };

  // Add activity logging functionality
  window.logActivity = async function(action, details, customerInfo = {}, cartTotal = '0.00 €', paymentMethod = 'N/A', cartItems = []) {
    try {
      let cartStr = '';
      if (cartItems && cartItems.length > 0) {
        cartStr = '\n  -> Món đặt: ' + cartItems.map(i => (i.qty || i.quantity || 1) + 'x ' + i.name).join(', ');
        details += cartStr;
      }
      const activityData = {
        action: action,
        details: details,
        customer: (customerInfo.name || customerInfo.customer_name || 'Gast') + ' (' + (customerInfo.phone || 'N/A') + ')',
        total: cartTotal,
        payment_method: paymentMethod
      };
      
      return await apiRequest('/log_activity.php', {
        method: 'POST',
        body: JSON.stringify(activityData)
      });
    } catch (e) {
      console.error('Failed to log activity:', e);
    }
  };
}

