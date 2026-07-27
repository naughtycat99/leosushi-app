// Authentication Module
// This file contains user authentication functions (login, register, logout)

console.log('auth.js loaded');

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
  return user && user.isNewCustomer === true && user.discountCodeUsed === false;
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

    // Check if user already exists
    if (typeof db !== 'undefined' && db) {
      const emailKey = userData.email.toLowerCase().trim();
      const customerRef = db.collection('customers').doc(emailKey);
      const customerDoc = await customerRef.get();
      
      if (customerDoc.exists) {
        throw new Error('Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.');
      }
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    
    // Generate discount code for new customer (will be sent after email verification)
    const discountCode = generateDiscountCode();
    
    // Create user object
    const user = {
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      street: userData.street || '',
      postal: userData.postal || '',
      city: userData.city || '',
      discountCode: discountCode,
      isNewCustomer: true,
      discountCodeUsed: false,
      emailVerified: false,
      verificationToken: verificationToken,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // Save to Firebase
    if (typeof db !== 'undefined' && db) {
      const emailKey = user.email;
      await db.collection('customers').doc(emailKey).set({
        ...user,
        customerCode: userData.customerCode || null // Preserve if exists
      }, { merge: true });
    }

    // Save to localStorage
    localStorage.setItem('leo_user', JSON.stringify(user));
    localStorage.setItem('leo_user_email', user.email);

    // Send verification email (without discount code)
    if (typeof sendVerificationEmail === 'function') {
      sendVerificationEmail(user, verificationToken);
    }

    console.log('✅ User registered successfully:', user.email);
    return { success: true, user: user, message: 'Bitte überprüfen Sie Ihr E-Mail-Postfach zur Bestätigung Ihrer E-Mail-Adresse.' };
  } catch (error) {
    console.error('❌ Registration error:', error);
    return { success: false, error: error.message };
  }
}

// Login user
async function loginUser(email, phone) {
  try {
    if (!email && !phone) {
      throw new Error('Bitte geben Sie E-Mail oder Telefonnummer ein.');
    }

    let user = null;

    // Try to find user in Firebase
    if (typeof db !== 'undefined' && db) {
      if (email) {
        const emailKey = email.toLowerCase().trim();
        const customerRef = db.collection('customers').doc(emailKey);
        const customerDoc = await customerRef.get();
        
        if (customerDoc.exists) {
          const data = customerDoc.data();
          // Verify phone matches if provided
          if (phone && data.phone !== phone) {
            throw new Error('E-Mail und Telefonnummer stimmen nicht überein.');
          }
          user = {
            email: data.email || emailKey,
            phone: data.phone,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            street: data.street || '',
            postal: data.postal || '',
            city: data.city || '',
            discountCode: data.discountCode || null,
            isNewCustomer: data.isNewCustomer === true && data.discountCodeUsed !== true,
            discountCodeUsed: data.discountCodeUsed === true,
            registeredAt: data.registeredAt || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            customerCode: data.customerCode || null
          };
        }
      } else if (phone) {
        // Search by phone
        const phoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');
        const querySnapshot = await db.collection('customers')
          .where('phone', '==', phone)
          .limit(1)
          .get();
        
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          user = {
            email: data.email,
            phone: data.phone,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            street: data.street || '',
            postal: data.postal || '',
            city: data.city || '',
            discountCode: data.discountCode || null,
            isNewCustomer: data.isNewCustomer === true && data.discountCodeUsed !== true,
            discountCodeUsed: data.discountCodeUsed === true,
            registeredAt: data.registeredAt || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            customerCode: data.customerCode || null
          };
        }
      }
    }

    if (!user) {
      throw new Error('Benutzer nicht gefunden. Bitte registrieren Sie sich zuerst.');
    }

    // Update last login
    if (typeof db !== 'undefined' && db) {
      const emailKey = user.email;
      await db.collection('customers').doc(emailKey).update({
        lastLoginAt: new Date().toISOString()
      });
    }

    // Save to localStorage
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

// Generate discount code for new customers
function generateDiscountCode() {
  const prefix = 'WELCOME';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomPart}`;
}

// Generate verification token
function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Mark discount code as used
async function markDiscountCodeUsed() {
  const user = getCurrentUser();
  if (!user) return;

  user.discountCodeUsed = true;
  user.isNewCustomer = false;

  // Update in Firebase
  if (typeof db !== 'undefined' && db) {
    const emailKey = user.email;
    await db.collection('customers').doc(emailKey).update({
      discountCodeUsed: true,
      isNewCustomer: false
    });
  }

  // Update localStorage
  localStorage.setItem('leo_user', JSON.stringify(user));
}

// Validate discount code
async function validateDiscountCode(code) {
  const user = getCurrentUser();
  if (!user) {
    return { valid: false, message: 'Bitte melden Sie sich an, um einen Gutscheincode zu verwenden.' };
  }

  // Check if user has a discount code and hasn't used it
  if (user.discountCode && user.discountCode.toUpperCase() === code.toUpperCase().trim()) {
    if (user.discountCodeUsed) {
      return { valid: false, message: 'Dieser Gutscheincode wurde bereits verwendet.' };
    }
    return { valid: true, discount: 10, message: 'Gutscheincode gültig! 10% Rabatt wird angewendet.' }; // 10% discount for new customers
  }

  return { valid: false, message: 'Ungültiger Gutscheincode.' };
}

// Send verification email (without discount code) via Cloud Functions
function sendVerificationEmail(user, verificationToken) {
  // Check if Firebase Functions is available
  if (typeof firebase === 'undefined' || !firebase.functions) {
    console.warn('⚠️ Firebase Functions not available, skipping verification email');
    return;
  }

  try {
    const functions = firebase.functions();
    
    // Nếu đang chạy local, dùng emulator
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        functions.useEmulator('localhost', 5001);
        console.log('🔧 Using Firebase Functions Emulator (local)');
      } catch (e) {
        // Emulator might not be running, continue with production
        console.log('⚠️ Emulator not available, using production functions');
      }
    }
    
    const sendVerificationEmailFunc = functions.httpsCallable('sendVerificationEmail');

    // Generate verification URL
    const baseUrl = window.location.origin;
    const verificationUrl = `${baseUrl}/verify.html?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;

    // Call Cloud Function
    sendVerificationEmailFunc({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim() || 'Liebe/r Kunde/in',
      verificationUrl: verificationUrl
    })
    .then((result) => {
      console.log('✅ Verification email sent successfully!', result.data);
    })
    .catch((error) => {
      console.error('❌ Failed to send verification email:', error);
      console.error('Error details:', error.code, error.message);
    });
  } catch (error) {
    console.error('❌ Error calling sendVerificationEmail function:', error);
  }
}

// Send thank you email with discount code (after email verification) via Cloud Functions
function sendThankYouEmailWithDiscount(user, discountCode) {
  // Check if Firebase Functions is available
  if (typeof firebase === 'undefined' || !firebase.functions) {
    console.warn('⚠️ Firebase Functions not available, skipping thank you email');
    return;
  }

  try {
    const functions = firebase.functions();
    
    // Nếu đang chạy local, dùng emulator
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        functions.useEmulator('localhost', 5001);
        console.log('🔧 Using Firebase Functions Emulator (local)');
      } catch (e) {
        // Emulator might not be running, continue with production
        console.log('⚠️ Emulator not available, using production functions');
      }
    }
    
    const sendThankYouEmailFunc = functions.httpsCallable('sendThankYouEmail');

    // Call Cloud Function
    sendThankYouEmailFunc({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim() || 'Liebe/r Kunde/in',
      discountCode: discountCode
    })
    .then((result) => {
      console.log('✅ Thank you email with discount code sent successfully!', result.data);
    })
    .catch((error) => {
      console.error('❌ Failed to send thank you email:', error);
      console.error('Error details:', error.code, error.message);
    });
  } catch (error) {
    console.error('❌ Error calling sendThankYouEmail function:', error);
  }
}

// Verify email with token
async function verifyEmail(token, email) {
  try {
    if (!token || !email) {
      return { success: false, error: 'Ungültiger Verifizierungslink.' };
    }

    const emailKey = email.toLowerCase().trim();

    // Check in Firebase
    if (typeof db !== 'undefined' && db) {
      const customerRef = db.collection('customers').doc(emailKey);
      const customerDoc = await customerRef.get();
      
      if (!customerDoc.exists) {
        return { success: false, error: 'Benutzer nicht gefunden.' };
      }

      const userData = customerDoc.data();
      
      // Check if token matches
      if (userData.verificationToken !== token) {
        return { success: false, error: 'Ungültiger Verifizierungstoken.' };
      }

      // Check if already verified
      if (userData.emailVerified === true) {
        return { success: true, alreadyVerified: true, message: 'Ihre E-Mail-Adresse wurde bereits bestätigt.' };
      }

      // Update user to verified
      await customerRef.update({
        emailVerified: true,
        verifiedAt: new Date().toISOString()
      });

      // Update localStorage if user is logged in
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.email === emailKey) {
        currentUser.emailVerified = true;
        localStorage.setItem('leo_user', JSON.stringify(currentUser));
      }

      // Send thank you email with discount code
      const user = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        discountCode: userData.discountCode
      };
      
      if (typeof sendThankYouEmailWithDiscount === 'function') {
        sendThankYouEmailWithDiscount(user, userData.discountCode);
      }

      return { success: true, message: 'E-Mail-Adresse erfolgreich bestätigt! Eine E-Mail mit Ihrem Gutscheincode wurde gesendet.' };
    }

    return { success: false, error: 'Fehler bei der Verifizierung.' };
  } catch (error) {
    console.error('❌ Email verification error:', error);
    return { success: false, error: error.message || 'Ein Fehler ist aufgetreten.' };
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
  window.sendVerificationEmail = sendVerificationEmail;
  window.sendThankYouEmailWithDiscount = sendThankYouEmailWithDiscount;
  window.verifyEmail = verifyEmail;
}

