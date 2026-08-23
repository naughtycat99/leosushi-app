// Customer Module
// This file contains customer management and auto-fill functions
// All data is stored in MySQL via API (Firebase has been removed)

console.log('customer.js loaded');

// Cache for customer lookups (in-memory cache to speed up repeated searches)
const customerCodeCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL

// Helper: Get API base URL
function getCustomerApiUrl() {
  if (typeof getBaseURL === 'function') return getBaseURL() + '/customers.php';
  if (typeof API_PHP_BASE_URL !== 'undefined') return API_PHP_BASE_URL + '/customers.php';
  // fallback
  const loc = window.location;
  const basePath = loc.pathname.substring(0, loc.pathname.lastIndexOf('/'));
  return loc.origin + basePath + '/api/customers.php';
}

// Helper: API request with error handling
async function customerApiRequest(action, params = {}, method = 'GET', body = null) {
  const url = new URL(getCustomerApiUrl());
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  const options = { method };
  if (body && method === 'POST') {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);
  return await response.json();
}

// Load customer info from MySQL API
async function loadCustomerInfo(email = null, phone = null, customerCode = null) {
  if (!email && !phone && !customerCode) return null;

  try {
    // Try by customer code first (fastest, unique identifier)
    if (customerCode) {
      const codeUpper = customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
      console.log('🔍 Searching for customerCode:', codeUpper);

      // Check in-memory cache first
      const cacheKey = `code_${codeUpper}`;
      const cached = customerCodeCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log('✅ Customer found in cache:', codeUpper);
        return cached.data;
      }

      const result = await customerApiRequest('search', { code: codeUpper });
      if (result.success && result.found && result.data) {
        console.log('✅ Customer found by code:', codeUpper);
        customerCodeCache.set(cacheKey, { data: result.data, timestamp: Date.now() });
        // Cache to localStorage for faster access
        cacheToLocalStorage(result.data);
        return result.data;
      }

      console.log('⚠️ Customer code not found:', codeUpper);
      return null;
    }

    // Try by email
    if (email) {
      const emailKey = email.toLowerCase().trim();
      const result = await customerApiRequest('search', { email: emailKey });
      if (result.success && result.found && result.data) {
        console.log('✅ Customer found by email:', emailKey);
        cacheToLocalStorage(result.data);
        return result.data;
      }
    }

    // Try by phone
    if (phone) {
      const phoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');
      const result = await customerApiRequest('search', { phone: phoneNormalized });
      if (result.success && result.found && result.data) {
        console.log('✅ Customer found by phone');
        cacheToLocalStorage(result.data);
        return result.data;
      }
    }

    return null;
  } catch (e) {
    console.error('Error loading customer info:', e);

    // Fallback to localStorage on network error
    if (email || phone || customerCode) {
      return loadFromLocalStorageCache(email, phone, customerCode);
    }
    return null;
  }
}

// Cache customer to localStorage
function cacheToLocalStorage(customerData) {
  try {
    const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
    if (customerData.email) {
      savedCustomers[customerData.email.toLowerCase().trim()] = customerData;
    }
    if (customerData.phone) {
      const phoneKey = customerData.phone.replace(/[\s\-\+\(\)]/g, '');
      savedCustomers[`phone_${phoneKey}`] = customerData;
    }
    if (customerData.customerCode) {
      savedCustomers[`code_${customerData.customerCode.toUpperCase()}`] = customerData;
    }
    localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
  } catch (e) {
    console.error('Error caching customer to localStorage:', e);
  }
}

// Load from localStorage cache (offline fallback)
function loadFromLocalStorageCache(email, phone, customerCode) {
  try {
    const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
    if (customerCode) {
      const codeKey = `code_${customerCode.toUpperCase().trim()}`;
      if (savedCustomers[codeKey]) return savedCustomers[codeKey];
    }
    if (email) {
      const emailKey = email.toLowerCase().trim();
      if (savedCustomers[emailKey]) return savedCustomers[emailKey];
    }
    if (phone) {
      const phoneKey = phone.replace(/[\s\-\+\(\)]/g, '');
      if (savedCustomers[`phone_${phoneKey}`]) return savedCustomers[`phone_${phoneKey}`];
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
  return null;
}

// Auto-fill customer information in form (only fill empty fields)
function autoFillCustomerInfo(customerInfo, skipEmailPhone = false) {
  if (!customerInfo) return;

  // Fill order form fields (only if empty)
  const firstNameField = document.getElementById('customerFirstName');
  const lastNameField = document.getElementById('customerLastName');
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');
  const streetField = document.getElementById('deliveryStreet');
  const postalField = document.getElementById('deliveryPostal');
  const cityField = document.getElementById('deliveryCity');
  const noteField = document.getElementById('deliveryNote');

  if (firstNameField && !firstNameField.value) firstNameField.value = customerInfo.firstName || '';
  if (lastNameField && !lastNameField.value) lastNameField.value = customerInfo.lastName || '';
  if (emailField && !skipEmailPhone && !emailField.value) emailField.value = customerInfo.email || '';
  if (phoneField && !skipEmailPhone && !phoneField.value) phoneField.value = customerInfo.phone || '';
  if (streetField && !streetField.value) streetField.value = customerInfo.street || '';
  if (postalField && !postalField.value) postalField.value = customerInfo.postal || '';
  if (cityField && !cityField.value) cityField.value = customerInfo.city || '';
  if (noteField && !noteField.value) noteField.value = customerInfo.note || '';

  // Fill reservation form fields (only if empty)
  const reserveFirstNameField = document.getElementById('reserveFirstNameInPayment');
  const reserveLastNameField = document.getElementById('reserveLastNameInPayment');
  const reserveEmailField = document.getElementById('reserveEmailInPayment');
  const reservePhoneField = document.getElementById('reservePhoneInPayment');

  if (reserveFirstNameField && !reserveFirstNameField.value) reserveFirstNameField.value = customerInfo.firstName || '';
  if (reserveLastNameField && !reserveLastNameField.value) reserveLastNameField.value = customerInfo.lastName || '';
  if (reserveEmailField && !skipEmailPhone && !reserveEmailField.value) reserveEmailField.value = customerInfo.email || '';
  if (reservePhoneField && !skipEmailPhone && !reservePhoneField.value) reservePhoneField.value = customerInfo.phone || '';

  // Show notification
  showCustomerInfoLoadedNotification();
}

// Show notification when customer info is loaded
function showCustomerInfoLoadedNotification() {
  showNotification('✓ Kundeninformationen wurden automatisch ausgefüllt');
}

// Show notification helper function
function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#ff4444' : 'linear-gradient(180deg, var(--gold), var(--gold-2))'};
    color: ${isError ? 'white' : '#1a1a1a'};
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,.3);
    z-index: 100000;
    font-weight: 600;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Load address from orders (via MySQL API)
async function loadAddressFromOrders(customerCode) {
  if (!customerCode) return null;

  const codeUpper = customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');

  try {
    // Search customer by code - address info should be included
    const result = await customerApiRequest('search', { code: codeUpper });
    if (result.success && result.found && result.data) {
      const data = result.data;
      if (data.street || data.postal || data.city) {
        return {
          street: data.street || '',
          postal: data.postal || '',
          city: data.city || '',
          note: data.note || ''
        };
      }
    }
    return null;
  } catch (e) {
    console.warn('Error loading address:', e);
    return null;
  }
}

// Validate customer code - ensure it exists
async function validateCustomerCode(customerCode) {
  if (!customerCode) {
    return { isValid: false, message: 'Kunden-Code darf nicht leer sein' };
  }

  const codeUpper = customerCode.toUpperCase().trim();

  // Check format
  if (!codeUpper.match(/^LEO-[A-Z0-9]+$/)) {
    return { isValid: false, message: 'Kunden-Code hat falsches Format (LEO-XXXXXX)' };
  }

  const cacheKey = `code_${codeUpper}`;

  // Check in-memory cache first (fastest)
  const cached = customerCodeCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log('✅ Customer code validated from cache:', codeUpper);
    return { isValid: true, customerInfo: cached.data, message: 'Kunden-Code gültig' };
  }

  // Check localStorage cache second
  try {
    const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
    const cachedCustomer = savedCustomers[cacheKey];
    if (cachedCustomer) {
      console.log('✅ Customer code validated from localStorage:', codeUpper);
      customerCodeCache.set(cacheKey, { data: cachedCustomer, timestamp: Date.now() });
      return { isValid: true, customerInfo: cachedCustomer, message: 'Kunden-Code gültig' };
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }

  // Search via API
  try {
    console.log('🔍 Validating customerCode via API:', codeUpper);
    const result = await customerApiRequest('search', { code: codeUpper });

    if (result.success && result.found && result.data) {
      console.log('✅ Customer code validated via API:', codeUpper);
      customerCodeCache.set(cacheKey, { data: result.data, timestamp: Date.now() });
      cacheToLocalStorage(result.data);
      return { isValid: true, customerInfo: result.data, message: 'Kunden-Code gültig' };
    }

    return { isValid: false, message: 'Kein Kunde mit diesem Code gefunden' };
  } catch (e) {
    console.error('Error validating customer code:', e);
    return { isValid: false, message: 'Fehler bei der Validierung. Bitte versuchen Sie es erneut.' };
  }
}

// Validate customer uniqueness (1 email + 1 phone = 1 code)
async function validateCustomerUniqueness(email, phone, customerCode = null) {
  if (!email || !phone) {
    return { isValid: false, message: 'E-Mail und Telefonnummer sind erforderlich' };
  }

  const emailKey = email.toLowerCase().trim();

  try {
    // Check if customer exists by email
    const emailResult = await customerApiRequest('search', { email: emailKey });
    if (emailResult.success && emailResult.found && emailResult.data) {
      const existingData = emailResult.data;
      const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');
      const phoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');

      if (existingPhone === phoneNormalized) {
        // Same email + same phone = same customer
        if (existingData.customerCode) {
          if (customerCode && existingData.customerCode.toUpperCase() !== customerCode.toUpperCase()) {
            return {
              isValid: false,
              message: `Diese E-Mail und Telefonnummer haben bereits einen anderen Kunden-Code: ${existingData.customerCode}`
            };
          }
          return {
            isValid: true,
            existingCustomerCode: existingData.customerCode,
            message: 'Kunde existiert bereits mit Code: ' + existingData.customerCode
          };
        }
        return { isValid: true, message: 'Kunde existiert bereits, neuer Code wird erstellt' };
      } else {
        return { isValid: false, message: 'Diese E-Mail wird bereits mit einer anderen Telefonnummer verwendet' };
      }
    }

    // Check by phone
    const phoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');
    const phoneResult = await customerApiRequest('search', { phone: phoneNormalized });
    if (phoneResult.success && phoneResult.found && phoneResult.data) {
      const existingData = phoneResult.data;
      const existingEmail = (existingData.email || '').toLowerCase().trim();
      if (existingEmail !== emailKey) {
        return { isValid: false, message: 'Diese Telefonnummer wird bereits mit einer anderen E-Mail verwendet' };
      }
      if (existingData.customerCode) {
        if (customerCode && existingData.customerCode.toUpperCase() !== customerCode.toUpperCase()) {
          return {
            isValid: false,
            message: `Diese E-Mail und Telefonnummer haben bereits einen anderen Kunden-Code: ${existingData.customerCode}`
          };
        }
        return {
          isValid: true,
          existingCustomerCode: existingData.customerCode,
          message: 'Kunde existiert bereits mit Code: ' + existingData.customerCode
        };
      }
    }

    // Check if customer code already taken by someone else
    if (customerCode) {
      const codeUpper = customerCode.toUpperCase().trim();
      const codeResult = await customerApiRequest('search', { code: codeUpper });
      if (codeResult.success && codeResult.found && codeResult.data) {
        const existingData = codeResult.data;
        const existingEmail = (existingData.email || '').toLowerCase().trim();
        const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');
        if (existingEmail !== emailKey || existingPhone !== phoneNormalized) {
          return {
            isValid: false,
            message: 'Dieser Kunden-Code wird bereits von einem anderen Kunden verwendet'
          };
        }
      }
    }

    return { isValid: true, message: 'Kundeninformationen gültig' };
  } catch (e) {
    console.error('Error validating customer uniqueness:', e);
    return { isValid: false, message: 'Fehler bei der Validierung der Kundeninformationen' };
  }
}

// Check if customer exists by email+phone and auto-fill customer code
async function checkExistingCustomerByEmailPhone() {
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');
  const codeField = document.getElementById('customerCode');

  if (!emailField || !phoneField || !codeField) return;

  const email = emailField.value.trim();
  const phone = phoneField.value.trim();

  if (!email || !phone) return;

  try {
    const customerInfo = await loadCustomerInfo(email, phone);
    if (customerInfo && customerInfo.customerCode) {
      if (!codeField.value) {
        codeField.value = customerInfo.customerCode;
        showNotification('✓ Kunden-Code automatisch gefunden: ' + customerInfo.customerCode);
      }
      autoFillCustomerInfo(customerInfo, true);
    }
  } catch (e) {
    console.error('Error checking existing customer:', e);
  }
}

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Setup auto-fill when customer code is entered
function setupCustomerCodeAutoFill() {
  const customerCodeInput = document.getElementById('customerCode');
  const emailInput = document.getElementById('customerEmail');
  const phoneInput = document.getElementById('customerPhone');

  if (!customerCodeInput) return;

  // Debounced email/phone lookup
  const handleEmailPhoneInput = debounce(async () => {
    const email = emailInput?.value.trim();
    const phone = phoneInput?.value.trim();
    if (email && phone) {
      await checkExistingCustomerByEmailPhone();
    }
  }, 800);

  if (emailInput) emailInput.addEventListener('blur', handleEmailPhoneInput);
  if (phoneInput) phoneInput.addEventListener('blur', handleEmailPhoneInput);

  // Customer code auto-fill on blur or Enter key
  const handleCustomerCodeInput = async () => {
    const code = customerCodeInput.value.trim();
    if (!code || code.length < 7) return; // At least LEO-XXX

    console.log('🔍 Looking up customer code:', code);

    try {
      const result = await validateCustomerCode(code);
      if (result.isValid && result.customerInfo) {
        autoFillCustomerInfo(result.customerInfo, false);
        console.log('✅ Customer auto-filled from code:', code);
      } else {
        console.log('⚠️ Customer code not found:', code);
      }
    } catch (e) {
      console.error('Error looking up customer code:', e);
    }
  };

  customerCodeInput.addEventListener('blur', handleCustomerCodeInput);
  customerCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomerCodeInput();
    }
  });

  // Auto-uppercase customer code
  customerCodeInput.addEventListener('input', () => {
    const pos = customerCodeInput.selectionStart;
    customerCodeInput.value = customerCodeInput.value.toUpperCase();
    customerCodeInput.setSelectionRange(pos, pos);
  });
}

// Setup auto-fill for reservation customer code field
function setupReservationCustomerCodeAutoFill() {
  const customerCodeInput = document.getElementById('reservationCustomerCode');
  if (!customerCodeInput) return;

  const handleReservationCustomerCodeInput = async () => {
    const code = customerCodeInput.value.trim();
    if (!code || code.length < 7) return;

    console.log('🔍 Looking up reservation customer code:', code);

    try {
      const result = await validateCustomerCode(code);
      if (result.isValid && result.customerInfo) {
        const info = result.customerInfo;
        // Fill reservation form fields
        const fields = {
          'reserveFirstName': info.firstName,
          'reserveLastName': info.lastName,
          'reserveEmail': info.email,
          'reservePhone': info.phone
        };
        for (const [id, value] of Object.entries(fields)) {
          const field = document.getElementById(id);
          if (field && !field.value && value) field.value = value;
        }
        showNotification('✓ Kundeninformationen automatisch ausgefüllt');
      }
    } catch (e) {
      console.error('Error looking up reservation customer code:', e);
    }
  };

  customerCodeInput.addEventListener('blur', handleReservationCustomerCodeInput);
  customerCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleReservationCustomerCodeInput();
    }
  });

  // Auto-uppercase
  customerCodeInput.addEventListener('input', () => {
    const pos = customerCodeInput.selectionStart;
    customerCodeInput.value = customerCodeInput.value.toUpperCase();
    customerCodeInput.setSelectionRange(pos, pos);
  });
}

// Setup early customer code entry (at top of page, before ordering)
function setupEarlyCustomerCodeEntry() {
  const earlyCodeInput = document.getElementById('earlyCustomerCode');
  const earlyCodeBtn = document.getElementById('earlyCustomerCodeBtn');

  if (!earlyCodeInput) return;

  const loadCustomerFromEarlyCode = async () => {
    const code = earlyCodeInput.value.trim();
    if (!code || code.length < 7) {
      showNotification('Bitte geben Sie einen gültigen Kunden-Code ein (z.B. LEO-ABC123)', true);
      return;
    }

    try {
      const result = await validateCustomerCode(code);
      if (result.isValid && result.customerInfo) {
        // Store for later use when payment modal opens
        localStorage.setItem('leoEarlyCustomerCode', code);
        localStorage.setItem('leoEarlyCustomerInfo', JSON.stringify(result.customerInfo));
        showNotification(`✓ Willkommen zurück, ${result.customerInfo.firstName || 'Kunde'}!`);

        // Update the early entry display
        const statusEl = document.getElementById('earlyCustomerStatus');
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: var(--gold);">✓ ${result.customerInfo.firstName} ${result.customerInfo.lastName} (${code})</span>`;
        }
      } else {
        showNotification('Kunden-Code nicht gefunden', true);
      }
    } catch (e) {
      console.error('Error loading customer from early code:', e);
      showNotification('Fehler beim Laden der Kundeninformationen', true);
    }
  };

  if (earlyCodeBtn) {
    earlyCodeBtn.addEventListener('click', loadCustomerFromEarlyCode);
  }
  earlyCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadCustomerFromEarlyCode();
    }
  });

  // Auto-uppercase
  earlyCodeInput.addEventListener('input', () => {
    const pos = earlyCodeInput.selectionStart;
    earlyCodeInput.value = earlyCodeInput.value.toUpperCase();
    earlyCodeInput.setSelectionRange(pos, pos);
  });
}

// Auto-fill payment modal from early entry
function autoFillFromEarlyEntry() {
  try {
    const earlyCode = localStorage.getItem('leoEarlyCustomerCode');
    const earlyInfoStr = localStorage.getItem('leoEarlyCustomerInfo');

    if (earlyCode && earlyInfoStr) {
      const earlyInfo = JSON.parse(earlyInfoStr);

      // Fill customer code field
      const codeField = document.getElementById('customerCode');
      if (codeField && !codeField.value) {
        codeField.value = earlyCode;
      }

      // Auto-fill customer info
      autoFillCustomerInfo(earlyInfo, false);
      console.log('✅ Auto-filled from early entry:', earlyCode);
    }
  } catch (e) {
    console.error('Error auto-filling from early entry:', e);
  }
}

// Generate customer code
function generateCustomerCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'LEO-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Save customer information to MySQL via API
async function saveCustomerInfo(customerData) {
  if (!customerData || !customerData.email || !customerData.phone) {
    return null;
  }

  const customerKey = customerData.email.toLowerCase().trim();

  // Prepare customer info
  let customerInfo = {
    firstName: customerData.firstName || '',
    lastName: customerData.lastName || '',
    email: customerKey,
    phone: customerData.phone,
    birthday: customerData.birthday || null,
    street: customerData.street || '',
    postal: customerData.postal || '',
    city: customerData.city || '',
    note: customerData.note || '',
    customerCode: customerData.customerCode || null
  };

  // Validate uniqueness
  if (typeof validateCustomerUniqueness === 'function') {
    try {
      const validationResult = await validateCustomerUniqueness(
        customerInfo.email,
        customerInfo.phone,
        customerInfo.customerCode || null
      );

      if (!validationResult.isValid) {
        console.error('❌ Customer validation failed:', validationResult.message);
      } else if (validationResult.existingCustomerCode) {
        customerInfo.customerCode = validationResult.existingCustomerCode;
        console.log('✅ Using existing customer code:', validationResult.existingCustomerCode);
      }
    } catch (e) {
      console.error('❌ Error validating customer uniqueness:', e);
    }
  }

  // Generate code if needed
  if (!customerInfo.customerCode) {
    customerInfo.customerCode = generateCustomerCode();
    console.log('🆕 Generated new customer code:', customerInfo.customerCode);
  }

  // Save to MySQL via API
  try {
    const result = await customerApiRequest('create', {}, 'POST', customerInfo);

    if (result.success) {
      // Use returned customer code (might be existing one preserved by API)
      if (result.customerCode) {
        customerInfo.customerCode = result.customerCode;
      }
      if (result.orderCount) {
        customerInfo.orderCount = result.orderCount;
      }
      console.log('✅ Customer saved via API:', customerInfo.email, 'Code:', customerInfo.customerCode);

      // Cache to localStorage
      cacheToLocalStorage(customerInfo);

      // Update in-memory cache
      if (customerInfo.customerCode) {
        const cacheKey = `code_${customerInfo.customerCode.toUpperCase()}`;
        customerCodeCache.set(cacheKey, { data: customerInfo, timestamp: Date.now() });
      }
    } else {
      console.error('❌ Failed to save customer:', result.message);
      return null;
    }
  } catch (e) {
    console.error('❌ Error saving customer via API:', e);
    return null;
  }

  return customerInfo;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupCustomerCodeAutoFill();
    setupReservationCustomerCodeAutoFill();
    setupEarlyCustomerCodeEntry();
  });
} else {
  setupCustomerCodeAutoFill();
  setupReservationCustomerCodeAutoFill();
  setupEarlyCustomerCodeEntry();
}

// Expose functions globally
window.loadCustomerInfo = loadCustomerInfo;
window.loadAddressFromOrders = loadAddressFromOrders;
window.autoFillCustomerInfo = autoFillCustomerInfo;
window.setupCustomerCodeAutoFill = setupCustomerCodeAutoFill;
window.setupReservationCustomerCodeAutoFill = setupReservationCustomerCodeAutoFill;
window.setupEarlyCustomerCodeEntry = setupEarlyCustomerCodeEntry;
window.autoFillFromEarlyEntry = autoFillFromEarlyEntry;
window.validateCustomerCode = validateCustomerCode;
window.validateCustomerUniqueness = validateCustomerUniqueness;
window.showNotification = showNotification;
window.saveCustomerInfo = saveCustomerInfo;
window.generateCustomerCode = generateCustomerCode;
