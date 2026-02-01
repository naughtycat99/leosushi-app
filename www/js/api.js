// API Client for Backend
// This file replaces Firebase calls with REST API calls

// Auto-detect base URL from current location (supports both HTTP and HTTPS)
function getBaseURL() {
  // Check if running in Capacitor app
  // 1. Check window.Capacitor object
  // 2. Check protocol (capacitor:// for iOS)
  const isCapacitor = (window.Capacitor && window.Capacitor.isNativePlatform()) ||
    window.location.protocol === 'capacitor:' ||
    window.location.protocol === 'ionic:'; // Android sometimes

  if (isCapacitor) {
    // ALWAYS use production API URL for Capacitor apps
    // This ensures API calls work even when app uses local files
    console.log('🔧 Capacitor detected: Using production API URL');
    return 'https://www.leo-sushi-berlin.de/api';
  }

  // If explicitly set, use it (for web development)
  if (window.API_PHP_BASE_URL) {
    return window.API_PHP_BASE_URL;
  }

  // Auto-detect from current location (web browser)
  const protocol = window.location.protocol; // 'http:' or 'https:'
  const host = window.location.host; // e.g., 'www.leo-sushi.de' or 'localhost'
  const pathname = window.location.pathname; // e.g., '/leosushi/' or '/'

  // Determine API path
  let apiPath = '/api';
  if (pathname.includes('/leosushi')) {
    apiPath = '/leosushi/api';
  }

  // Build full URL with detected protocol
  return `${protocol}//${host}${apiPath}`;
}

const API_BASE_URL = window.API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : getBaseURL());
const API_PHP_BASE_URL = getBaseURL();

// Helper function to get auth token
function getAuthToken() {
  const user = localStorage.getItem('leo_user');
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

  try {
    const response = await fetch(fullEndpoint, {
      ...options,
      headers
    });

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
    console.error('API request error:', error);

    // Log details to help debugging on mobile
    if (window.Capacitor) {
      console.log('API Error Details:', {
        endpoint: fullEndpoint,
        error: error.message,
        stack: error.stack,
        base_url: API_PHP_BASE_URL
      });
    }

    // Provide better error messages
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      const serverUrl = API_PHP_BASE_URL.split('/api')[0];
      throw new Error(`Verbindung zum Server fehlgeschlagen (${serverUrl}). Bitte prüfen Sie Ihre Internetverbindung.`);
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
    return await apiRequest('/orders.php', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  // Get order by ID (placeholder - not implemented in PHP yet)
  async getOrder(orderId) {
    return await apiRequest(`/orders.php?action=detail`, {
      method: 'POST',
      body: JSON.stringify({ orderId })
    });
  }
};

// Reservations API
const reservationsAPI = {
  // Save reservation
  async saveReservation(reservationData) {
    return await apiRequest('/reservations.php?action=create', {
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

    const query = params.toString();
    // Use PHP API endpoint
    return await apiRequest(`/menu.php?action=list${query ? '&' + query : ''}`);
  },

  // Categories
  async getCategories() {
    // Use PHP API endpoint
    return await apiRequest('/menu.php?action=categories');
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
    return await apiRequest('/validate-discount.php', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, email })
    });
  }
};

// Points/Loyalty API
const pointsAPI = {
  async getPoints(customerId) {
    return await apiRequest(`/points.php?action=get&customer_id=${customerId}`);
  },

  async getTransactions(customerId) {
    return await apiRequest(`/points.php?action=transactions&customer_id=${customerId}`);
  },

  async earnPoints(customerId, orderId, orderTotal, points = null) {
    return await apiRequest('/points.php?action=earn', {
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
    return await apiRequest('/points.php?action=redeem', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: customerId,
        rule_id: ruleId
      })
    });
  },

  async getRedemptionRules() {
    return await apiRequest('/points.php?action=rules');
  },

  async checkBirthdayPromotion(customerId) {
    return await apiRequest(`/points.php?action=check-birthday&customer_id=${customerId}`);
  }
};

// Reviews API
const reviewsAPI = {
  // Get reviews list
  async list(limit = 10, status = 'approved') {
    return await apiRequest(`/reviews.php?action=list&limit=${limit}&status=${status}`);
  },

  // Get review statistics
  async stats() {
    return await apiRequest('/reviews.php?action=stats');
  },

  // Create review
  async create(reviewData) {
    return await apiRequest('/reviews.php?action=create', {
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
}

