// Authentication Module (MySQL Backend)
// This file contains user authentication functions using MySQL API

console.log('auth-mysql.js loaded');

// Check if user is authenticated
function isAuthenticated() {
  const user = localStorage.getItem('leo_user');
  return user !== null;
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem('leo_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
}

// Check if user is new customer (has discount code for first order)
function isNewCustomer() {
  const user = getCurrentUser();
  return user && user.discountCode && !user.discountUsed;
}

// Get user discount code
function getUserDiscountCode() {
  const user = getCurrentUser();
  return user ? user.discountCode : null;
}

// Register new user
async function registerUser(userData) {
  try {
    // Validate required fields
    if (!userData.email || !userData.phone || !userData.firstName || !userData.lastName) {
      throw new Error('Bitte füllen Sie alle Pflichtfelder aus.');
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error('Passwort muss mindestens 6 Zeichen lang sein.');
    }

    // Check if API is available
    if (typeof window === 'undefined' || !window.api) {
      throw new Error('API client not loaded. Please check your connection.');
    }

    const payload = { ...userData };
    delete payload.confirmPassword;

    // Call API
    const result = await window.api.auth.register(payload);

    if (!result.success) {
      throw new Error(result.message || 'Registration failed');
    }

    const normalizedEmail = result.user.email.toLowerCase();

    const user = {
      id: result.user.id,
      email: normalizedEmail,
      phone: result.user.phone || userData.phone,
      firstName: result.user.firstName || userData.firstName,
      lastName: result.user.lastName || userData.lastName,
      street: result.user.street || userData.street || null,
      postal: result.user.postal || userData.postal || null,
      city: result.user.city || userData.city || null,
      emailVerified: result.user.emailVerified,
      discountCode: result.user.discountCode,
      discountUsed: result.user.discountUsed,
      token: result.token
    };

    localStorage.setItem('leo_user', JSON.stringify(user));
    localStorage.setItem('leo_user_email', normalizedEmail);
    if (typeof window.updateHeaderAuth === 'function') {
      window.updateHeaderAuth();
    }

    console.log('✅ User registered successfully (verification pending):', normalizedEmail);
    return {
      success: true,
      user,
      message: result.message,
      verificationCodeSent: result.verificationCodeSent,
      mailError: result.mailError
    };
  } catch (error) {
    console.error('❌ Registration error:', error);
    let errorMessage = error.message;
    
    // Better error messages for common issues
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = 'Backend-Server ist nicht erreichbar. Bitte starten Sie den Backend-Server auf http://localhost:3000';
    } else if (error.message.includes('API client not loaded')) {
      errorMessage = 'API-Client nicht geladen. Bitte laden Sie die Seite neu.';
    } else if (error.message.includes('Số điện thoại đã được sử dụng') || error.message.includes('đã được sử dụng') || error.message.includes('phone')) {
      // Thông báo rõ ràng khi số điện thoại đã được sử dụng - bằng tiếng Đức
      errorMessage = 'Diese Telefonnummer wird bereits verwendet. Bitte verwenden Sie eine andere Telefonnummer oder melden Sie sich an.';
    } else if (error.message.includes('Email đã được sử dụng') || error.message.includes('email đã') || error.message.includes('Email')) {
      errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet. Bitte verwenden Sie eine andere E-Mail-Adresse oder melden Sie sich an.';
    } else if (error.message.includes('Duplicate entry') && error.message.includes('discount_code')) {
      // Lỗi duplicate discount code - bằng tiếng Đức
      errorMessage = 'Fehler bei der Registrierung: Der Gutscheincode wird bereits verwendet. Bitte versuchen Sie es erneut.';
    } else if (error.message.includes('Lỗi đăng ký')) {
      // Chuyển đổi thông báo lỗi đăng ký sang tiếng Đức
      errorMessage = 'Fehler bei der Registrierung. Bitte versuchen Sie es erneut.';
    }
    
    return { success: false, error: errorMessage };
  }
}

// Login user
async function loginUser(email, phone, password) {
  try {
    if (!email && !phone) {
      throw new Error('Bitte geben Sie E-Mail oder Telefonnummer ein.');
    }

    if (!password) {
      throw new Error('Bitte geben Sie Ihr Passwort ein.');
    }

    // Check if API is available
    if (typeof window === 'undefined' || !window.api) {
      throw new Error('API client not loaded. Please check your connection.');
    }

    // Call API
    const result = await window.api.auth.login(email, phone, password);

    if (!result.success) {
      throw new Error(result.message || 'Login failed');
    }

    // Save user to localStorage
    const user = {
      id: result.user.id,
      email: result.user.email,
      phone: result.user.phone,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      street: result.user.street || null,
      postal: result.user.postal || null,
      city: result.user.city || null,
      emailVerified: result.user.emailVerified,
      discountCode: result.user.discountCode,
      discountUsed: result.user.discountUsed,
      token: result.token
    };

    localStorage.setItem('leo_user', JSON.stringify(user));
    localStorage.setItem('leo_user_email', user.email);

    console.log('✅ User logged in successfully:', user.email);
    return { success: true, user: user };
  } catch (error) {
    console.error('❌ Login error:', error);
    return { success: false, error: error.message };
  }
}

// Logout user
function logoutUser() {
  localStorage.removeItem('leo_user');
  localStorage.removeItem('leo_user_email');
  console.log('✅ User logged out');
}

// Mark discount code as used
async function markDiscountCodeUsed() {
  const user = getCurrentUser();
  if (!user) return;

  // Check if API is available
  if (typeof window === 'undefined' || !window.api) {
    console.warn('⚠️ API client not available');
    return;
  }

  try {
    await window.api.auth.markDiscountCodeUsed();
    
    // Update localStorage
    user.discountUsed = true;
    localStorage.setItem('leo_user', JSON.stringify(user));
  } catch (error) {
    console.error('❌ Error marking discount code as used:', error);
  }
}

// Validate discount code
async function validateDiscountCode(code) {
  const user = getCurrentUser();
  if (!user) {
    return { valid: false, message: 'Bitte melden Sie sich an, um einen Gutscheincode zu verwenden.' };
  }

  // Check if API is available
  if (typeof window === 'undefined' || !window.api) {
    return { valid: false, message: 'API client not available' };
  }

  try {
    const result = await window.api.auth.validateDiscountCode(code);
    return result;
  } catch (error) {
    console.error('❌ Error validating discount code:', error);
    return { valid: false, message: error.message || 'Error validating discount code' };
  }
}

// Verify email with token
async function verifyEmail(token, email) {
  try {
    if (!token || !email) {
      return { success: false, error: 'Ungültiger Verifizierungslink.' };
    }

    // Check if API is available
    if (typeof window === 'undefined' || !window.api) {
      return { success: false, error: 'API client not available' };
    }

    // Call API
    const result = await window.api.auth.verifyEmail(token, email);

    if (!result.success) {
      return { success: false, error: result.message || 'Verification failed' };
    }

    // Update localStorage if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.email === email.toLowerCase().trim()) {
      currentUser.emailVerified = true;
      localStorage.setItem('leo_user', JSON.stringify(currentUser));
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error('❌ Email verification error:', error);
    return { success: false, error: error.message || 'Ein Fehler ist aufgetreten.' };
  }
}

// Request password reset
async function requestPasswordReset(identifier) {
  try {
    if (!identifier) {
      throw new Error('Bitte geben Sie E-Mail oder Telefonnummer ein.');
    }

    if (typeof window === 'undefined' || !window.api) {
      throw new Error('API client not loaded. Please check your connection.');
    }

    const result = await window.api.auth.requestPasswordReset(identifier);
    return result;
  } catch (error) {
    console.error('❌ Password reset request error:', error);
    return { success: false, error: error.message };
  }
}

// Reset password with token
async function resetPassword(email, token, password, confirmPassword) {
  try {
    if (!email || !token) {
      throw new Error('Ungültiger Reset-Link.');
    }
    if (!password || password.length < 6) {
      throw new Error('Passwort muss mindestens 6 Zeichen lang sein.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwörter stimmen nicht überein.');
    }

    if (typeof window === 'undefined' || !window.api) {
      throw new Error('API client not loaded. Please check your connection.');
    }

    const result = await window.api.auth.resetPassword({ email, token, password, confirmPassword });
    return result;
  } catch (error) {
    console.error('❌ Reset password error:', error);
    return { success: false, error: error.message };
  }
}

// Expose functions to global scope
if (typeof window !== 'undefined') {
  window.isAuthenticated = isAuthenticated;
  window.getCurrentUser = getCurrentUser;
  window.isNewCustomer = isNewCustomer;
  window.getUserDiscountCode = getUserDiscountCode;
  window.registerUser = registerUser;
  window.loginUser = loginUser;
  window.logoutUser = logoutUser;
  window.markDiscountCodeUsed = markDiscountCodeUsed;
  window.validateDiscountCode = validateDiscountCode;
  window.verifyEmail = verifyEmail;
  window.requestPasswordReset = requestPasswordReset;
  window.resetPassword = resetPassword;
}

