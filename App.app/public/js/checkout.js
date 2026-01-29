// Checkout Module
// Handles checkout page functionality: auto-fill user info, calculate totals, process payment

// Service type variable - Only delivery (reservation has separate form)
// Use window.selectedServiceType (shared with payment.js), default to 'delivery' if not set
if (typeof window.selectedServiceType === 'undefined') {
  window.selectedServiceType = 'delivery';
}
// Don't declare let - just use window.selectedPaymentMethod (shared with payment.js)
if (typeof window.selectedPaymentMethod === 'undefined') {
  window.selectedPaymentMethod = 'cash';
}

// Discount code variables - use window variables from payment.js
// Don't declare let - use window.appliedDiscount (shared with payment.js)
if (typeof window.appliedDiscount === 'undefined') {
  window.appliedDiscount = null;
}
let automaticDiscount = null; // { amount: number, percentage: 10 } - Auto 10% discount for orders > 15€

// Tip variables - use window variable from payment.js
// Don't declare let - use window.selectedTip (shared with payment.js)
if (typeof window.selectedTip === 'undefined') {
  window.selectedTip = null;
}

// Restaurant address for delivery range check
const RESTAURANT_ADDRESS = {
  street: 'Pankow',
  postal: '13187',
  city: 'Berlin'
};

// Restaurant working hours (24-hour format)
const RESTAURANT_HOURS = {
  open: 12,  // 12:00
  close: 22  // 22:00
};

// Check if delivery address is within delivery range using OpenStreetMap
async function checkDeliveryRange(street, postal, city) {
  if (!street || !postal || !city) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine vollständige Adresse ein.' };
  }
  
  // Validate postal code format
  if (!/^\d{5}$/.test(postal)) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine gültige 5-stellige PLZ ein.' };
  }
  
  // Use OpenStreetMap for accurate distance calculation
  if (typeof window.checkDeliveryRangeOSM === 'function') {
    try {
      return await window.checkDeliveryRangeOSM(street, postal, city);
    } catch (error) {
      console.error('Error checking delivery range with OSM:', error);
      // Fallback to simple postal code check
    }
  }
  
  // Fallback: Simple postal code check
  const customerPostal = parseInt(postal);
  const restaurantPostal = parseInt(RESTAURANT_ADDRESS.postal);
  const postalDiff = Math.abs(customerPostal - restaurantPostal);
  
  if (postalDiff <= 1600) {
    return { 
      withinRange: true, 
      distance: null, 
      message: '✓ Lieferung möglich (innerhalb 4km - kostenlos)' 
    };
  } else {
    return { 
      withinRange: false, 
      distance: null, 
      message: '✗ Lieferung nicht möglich: Adresse liegt außerhalb des 4km-Radius. Bitte wählen Sie stattdessen "Tisch reservieren".' 
    };
  }
}

// Setup validation for scheduled delivery time
function setupScheduledDeliveryTimeValidation() {
  const scheduledDate = document.getElementById('scheduledDeliveryDate');
  const scheduledTime = document.getElementById('scheduledDeliveryTime');
  const errorDiv = document.getElementById('scheduledDeliveryTimeError');
  
  if (!scheduledDate || !scheduledTime || !errorDiv) return;
  
  const validateScheduledTime = () => {
    const date = scheduledDate.value;
    const time = scheduledTime.value;
    
    // If both are empty, it's optional (immediate delivery)
    if (!date && !time) {
      errorDiv.style.display = 'none';
      errorDiv.textContent = '';
      return true;
    }
    
    // If one is filled but not the other, show error
    if ((date && !time) || (!date && time)) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Bitte wählen Sie sowohl Datum als auch Uhrzeit.';
      return false;
    }
    
    // Validate that the scheduled time is at least 30 minutes from now
    const now = new Date();
    // Parse date and time as local time (not UTC)
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDateTime = new Date(year, month - 1, day, hours, minutes);
    const minDateTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    
    // Validate working hours first (delivery starts at 12:30)
    if (hours < RESTAURANT_HOURS.open || hours >= RESTAURANT_HOURS.close || 
        (hours === RESTAURANT_HOURS.open && minutes < 30)) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = `Die gewünschte Lieferzeit muss zwischen ${RESTAURANT_HOURS.open}:30 und ${RESTAURANT_HOURS.close}:00 Uhr liegen (Öffnungszeiten).`;
      return false;
    }
    
    // Debug log
    console.log('🕐 Time validation:', {
      now: now.toLocaleString('de-DE'),
      scheduled: scheduledDateTime.toLocaleString('de-DE'),
      minDateTime: minDateTime.toLocaleString('de-DE'),
      isValid: scheduledDateTime >= minDateTime,
      withinHours: hours >= RESTAURANT_HOURS.open && hours < RESTAURANT_HOURS.close
    });
    
    if (scheduledDateTime < minDateTime) {
      errorDiv.style.display = 'block';
      const minHours = String(minDateTime.getHours()).padStart(2, '0');
      const minMinutes = String(minDateTime.getMinutes()).padStart(2, '0');
      const minTimeStr = `${minHours}:${minMinutes}`;
      errorDiv.textContent = `Die gewünschte Lieferzeit muss mindestens 30 Minuten ab jetzt sein (frühestens ${minTimeStr}).`;
      return false;
    }
    
    // Valid
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    return true;
  };
  
  // Remove old listeners
  scheduledDate.removeEventListener('change', validateScheduledTime);
  scheduledTime.removeEventListener('change', validateScheduledTime);
  scheduledDate.removeEventListener('blur', validateScheduledTime);
  scheduledTime.removeEventListener('blur', validateScheduledTime);
  
  // Add new listeners
  scheduledDate.addEventListener('change', validateScheduledTime);
  scheduledTime.addEventListener('change', validateScheduledTime);
  scheduledDate.addEventListener('blur', validateScheduledTime);
  scheduledTime.addEventListener('blur', validateScheduledTime);
  
  // Initial validation
  validateScheduledTime();
}

// Check delivery address and update UI
async function checkAndUpdateDeliveryStatus() {
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const messageEl = document.getElementById('deliveryRangeMessage');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  
  if (!messageEl) return;
  
  if (!street || !postal || !city) {
    messageEl.style.display = 'none';
    // Disable button if address is incomplete
    if (confirmBtn) {
      confirmBtn.disabled = false; // Allow if not filled yet (will be checked on submit)
    }
    return;
  }
  
  const rangeCheck = await checkDeliveryRange(street, postal, city);
  
  if (rangeCheck.withinRange) {
    messageEl.innerHTML = `<div style="color: #10b981; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 18px;">✓</span>
      <span>${rangeCheck.message}</span>
    </div>`;
    messageEl.style.background = 'rgba(16,185,129,.1)';
    messageEl.style.border = '1px solid rgba(16,185,129,.3)';
    messageEl.style.display = 'block';
    
    // Enable checkout button if address is valid
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
    }
  } else {
    messageEl.innerHTML = `<div style="color: #ef4444; display: flex; align-items: flex-start; gap: 8px;">
      <span style="font-size: 18px; margin-top: 2px;">✗</span>
      <div>
        <div style="font-weight: 600; margin-bottom: 4px;">${rangeCheck.message}</div>
        <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
          Bitte wählen Sie stattdessen "Tisch reservieren"
        </div>
      </div>
    </div>`;
    messageEl.style.background = 'rgba(239,68,68,.1)';
    messageEl.style.border = '1px solid rgba(239,68,68,.3)';
    messageEl.style.display = 'block';
    
    // Disable checkout button if address is out of range
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.title = 'Lieferung nicht möglich: Adresse liegt außerhalb des 4km-Radius';
    }
  }
  
  // Update order summary to reflect delivery fee (always 0, but update anyway)
  updateOrderSummary();
}

// Initialize checkout page
// Auto-fill function that can be called multiple times
async function tryAutoFillUserInfo() {
  console.log('🔄 Trying to auto-fill user info...');
  
  // Check if getCurrentUser is available (from auth-mysql.js)
  let user = null;
  
  if (typeof getCurrentUser === 'function') {
    user = getCurrentUser();
    console.log('✅ getCurrentUser available, user:', user ? { email: user.email, phone: user.phone } : 'null');
  } else {
    // Fallback: try to get from localStorage directly
    try {
      const userStr = localStorage.getItem('leo_user');
      if (userStr) {
        user = JSON.parse(userStr);
        console.log('✅ Got user from localStorage directly:', { email: user.email, phone: user.phone });
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e);
    }
  }
  
  if (!user) {
    console.log('⚠️ No user found, skipping auto-fill');
    console.log('💡 Debug: localStorage.getItem("leo_user") =', localStorage.getItem('leo_user'));
    return false;
  }
  
  // Try to fetch fresh data from API if user has token
  if (user.token && window.api && window.api.auth && window.api.auth.getCurrentUser) {
    try {
      console.log('🔄 Fetching fresh user data from API...');
      const result = await window.api.auth.getCurrentUser();
      if (result && result.success && result.user) {
        // Merge API data with localStorage data
        user = {
          ...user,
          firstName: result.user.firstName || user.firstName || '',
          lastName: result.user.lastName || user.lastName || '',
          email: result.user.email || user.email || '',
          phone: result.user.phone || user.phone || '',
          street: result.user.street || user.street || '',
          postal: result.user.postal || user.postal || '',
          city: result.user.city || user.city || '',
          note: result.user.note || user.note || ''
        };
        // Update localStorage
        localStorage.setItem('leo_user', JSON.stringify(user));
        console.log('✅ Updated user data from API');
      }
    } catch (error) {
      console.log('⚠️ Could not fetch from API, using localStorage data:', error);
    }
  }
  
  // Debug: Log full user object (without sensitive data)
  console.log('👤 User data found:', {
    hasFirstName: !!user.firstName,
    hasLastName: !!user.lastName,
    hasEmail: !!user.email,
    hasPhone: !!user.phone,
    hasStreet: !!user.street,
    hasPostal: !!user.postal,
    hasCity: !!user.city
  });
  
  // Get input fields
  const firstNameInput = document.getElementById('customerFirstName');
  const lastNameInput = document.getElementById('customerLastName');
  const emailInput = document.getElementById('customerEmail');
  const phoneInput = document.getElementById('customerPhone');
  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');
  const noteInput = document.getElementById('deliveryNote');
  
  if (!firstNameInput || !lastNameInput || !emailInput || !phoneInput) {
    console.log('⚠️ Form fields not found yet');
    return false;
  }
  
  // Fill fields with user info - always fill if user is logged in
  let filledAny = false;
  if (user.firstName) {
    firstNameInput.value = user.firstName;
    filledAny = true;
  }
  if (user.lastName) {
    lastNameInput.value = user.lastName;
    filledAny = true;
  }
  if (user.email) {
    emailInput.value = user.email;
    filledAny = true;
  }
  if (user.phone) {
    phoneInput.value = user.phone;
    filledAny = true;
  }
  if (user.street) {
    streetInput.value = user.street;
    filledAny = true;
  }
  if (user.postal) {
    postalInput.value = user.postal;
    filledAny = true;
  }
  if (user.city) {
    cityInput.value = user.city;
    filledAny = true;
  }
  if (user.note) {
    noteInput.value = user.note;
  }
  
  if (!filledAny) {
    console.log('⚠️ User found but no data to fill');
    return false;
  }
  
  console.log('✅ Auto-filled form fields:', {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    street: streetInput.value,
    postal: postalInput.value,
    city: cityInput.value
  });
  
  // Trigger events
  [firstNameInput, lastNameInput, emailInput, phoneInput, streetInput, postalInput, cityInput].forEach(input => {
    if (input && input.value) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  // Check delivery range if address is filled
  if (streetInput && postalInput && cityInput && streetInput.value && postalInput.value && cityInput.value) {
    const rangeCheck = await checkDeliveryRange(streetInput.value, postalInput.value, cityInput.value);
    const messageDiv = document.getElementById('deliveryRangeMessage');
    if (messageDiv) {
      messageDiv.style.display = 'block';
      messageDiv.textContent = rangeCheck.message;
      messageDiv.style.background = rangeCheck.withinRange ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      messageDiv.style.border = rangeCheck.withinRange ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)';
      messageDiv.style.color = rangeCheck.withinRange ? '#10b981' : '#ef4444';
    }
  }
  
  return true;
}

// Initialize checkout page
function initCheckout() {
  console.log('📄 Initializing checkout page...');
  
  // Update order summary immediately
  console.log('🔄 Updating order summary...');
  updateOrderSummary();
  
  // Wait a bit for all scripts to load, then try auto-fill
  setTimeout(() => {
    console.log('🔄 First auto-fill attempt...');
    tryAutoFillUserInfo().catch(err => console.error('Auto-fill error:', err));
  }, 100);
  
  // Retry after delays to ensure it works
  setTimeout(() => {
    console.log('🔄 Second auto-fill attempt...');
    tryAutoFillUserInfo().catch(err => console.error('Auto-fill retry error:', err));
    updateOrderSummary();
  }, 500);
  
  setTimeout(() => {
    console.log('🔄 Third auto-fill attempt (autoFillUserInfo)...');
    // Use the checkout.js version directly
    if (typeof autoFillUserInfo === 'function') {
      autoFillUserInfo().catch(err => console.error('autoFillUserInfo error:', err));
    } else {
      console.log('⚠️ autoFillUserInfo function not found');
    }
    updateOrderSummary();
  }, 2000);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
    setupCheckoutPage();
  });
} else {
  // DOM already loaded
  initCheckout();
  setupCheckoutPage();
}

// Also run when window fully loads
window.addEventListener('load', () => {
  console.log('🔄 Window fully loaded, retry auto-fill and update summary...');
  setTimeout(() => {
    tryAutoFillUserInfo();
    updateOrderSummary(); // Update summary when window fully loads
    if (typeof autoFillUserInfo === 'function') {
      autoFillUserInfo();
    }
  }, 300);
});

// Setup checkout page event listeners and initial state
function setupCheckoutPage() {
  // Set default payment method (wait for payment.js to load)
  if (typeof window.selectPaymentOption === 'function') {
    window.selectPaymentOption('cash');
  } else {
    // Retry after a short delay if payment.js hasn't loaded yet
    setTimeout(() => {
      if (typeof window.selectPaymentOption === 'function') {
        window.selectPaymentOption('cash');
      } else {
        console.warn('⚠️ selectPaymentOption not available, payment.js may not be loaded');
      }
    }, 100);
  }
  
  // Add event listeners for delivery address check
  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');
  
  if (streetInput) {
    streetInput.addEventListener('blur', checkAndUpdateDeliveryStatus);
    streetInput.addEventListener('input', () => {
      // Clear message while typing
      const messageEl = document.getElementById('deliveryRangeMessage');
      if (messageEl) messageEl.style.display = 'none';
    });
  }
  
  if (postalInput) {
    postalInput.addEventListener('blur', checkAndUpdateDeliveryStatus);
    postalInput.addEventListener('input', () => {
      const messageEl = document.getElementById('deliveryRangeMessage');
      if (messageEl) messageEl.style.display = 'none';
    });
  }
  
  if (cityInput) {
    cityInput.addEventListener('blur', checkAndUpdateDeliveryStatus);
    cityInput.addEventListener('input', () => {
      const messageEl = document.getElementById('deliveryRangeMessage');
      if (messageEl) messageEl.style.display = 'none';
      // Re-enable button while typing (will be checked on blur)
      const confirmBtn = document.getElementById('confirmCheckoutBtn');
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.title = '';
      }
    });
  }
  
  // Also check on page load if address is already filled
  setTimeout(() => {
    checkAndUpdateDeliveryStatus();
  }, 500);
  
  // Initialize scheduled delivery time field
  const scheduledDeliveryTimeGroup = document.getElementById('scheduledDeliveryTimeGroup');
  if (scheduledDeliveryTimeGroup) {
    scheduledDeliveryTimeGroup.style.display = 'block';
    const scheduledDateEl = document.getElementById('scheduledDeliveryDate');
    const scheduledTimeEl = document.getElementById('scheduledDeliveryTime');
    if (scheduledDateEl && !scheduledDateEl.value) {
      const today = new Date();
      scheduledDateEl.value = today.toISOString().split('T')[0];
      scheduledDateEl.setAttribute('min', today.toISOString().split('T')[0]);
    }
    if (scheduledTimeEl && scheduledTimeEl.tagName === 'SELECT') {
      // Populate time dropdown with working hours (12:30 - 22:00) in 15-minute intervals
      const timeOptions = [];
      
      // Generate time slots from 12:30 to 22:00 in 15-minute intervals
      for (let hour = RESTAURANT_HOURS.open; hour < RESTAURANT_HOURS.close; hour++) {
        // Start from 12:30 for the first hour (12), then normal intervals for other hours
        const startMinute = (hour === RESTAURANT_HOURS.open) ? 30 : 0;
        for (let minute = startMinute; minute < 60; minute += 15) {
          const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          timeOptions.push(timeStr);
        }
      }
      
      // Clear existing options except the first one
      while (scheduledTimeEl.options.length > 1) {
        scheduledTimeEl.remove(1);
      }
      
      // Add time options
      timeOptions.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        scheduledTimeEl.appendChild(option);
      });
      
      // Set default value if empty (at least 30 minutes from now, but within working hours)
      if (!scheduledTimeEl.value) {
        const now = new Date();
        const minTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
        
        // Ensure time is within working hours
        let defaultHours = minTime.getHours();
        let defaultMinutes = minTime.getMinutes();
        
        // Round up to nearest 15 minutes
        defaultMinutes = Math.ceil(defaultMinutes / 15) * 15;
        if (defaultMinutes >= 60) {
          defaultMinutes = 0;
          defaultHours++;
        }
        
        // If before opening time, set to first delivery time (12:30)
        if (defaultHours < RESTAURANT_HOURS.open || (defaultHours === RESTAURANT_HOURS.open && defaultMinutes < 30)) {
          defaultHours = RESTAURANT_HOURS.open;
          defaultMinutes = 30;
        }
        // If after closing time, set to opening time next day (user should select tomorrow)
        if (defaultHours >= RESTAURANT_HOURS.close) {
          defaultHours = RESTAURANT_HOURS.open;
          defaultMinutes = 0;
        }
        
        const defaultTime = `${String(defaultHours).padStart(2, '0')}:${String(defaultMinutes).padStart(2, '0')}`;
        scheduledTimeEl.value = defaultTime;
      }
    }
    // Setup validation
    setupScheduledDeliveryTimeValidation();
  }
}

// Auto-fill user info from database - ONLY when user is logged in
async function autoFillUserInfo() {
  console.log('🔍 [autoFillUserInfo] Starting...');
  
  // Get user from localStorage first (most reliable)
  let localUser = null;
  try {
    const userStr = localStorage.getItem('leo_user');
    if (userStr) {
      localUser = JSON.parse(userStr);
      console.log('✅ [autoFillUserInfo] Got user from localStorage:', {
        hasEmail: !!localUser.email,
        hasPhone: !!localUser.phone,
        hasFirstName: !!localUser.firstName,
        hasLastName: !!localUser.lastName
      });
    } else {
      console.log('⚠️ [autoFillUserInfo] No user in localStorage');
    }
  } catch (e) {
    console.error('❌ [autoFillUserInfo] Error reading localStorage:', e);
  }
  
  // Fallback: try getCurrentUser if available
  if (!localUser && typeof getCurrentUser === 'function') {
    try {
      localUser = getCurrentUser();
      console.log('✅ [autoFillUserInfo] Got user from getCurrentUser');
    } catch (e) {
      console.error('❌ [autoFillUserInfo] Error calling getCurrentUser:', e);
    }
  }
  
  if (!localUser) {
    console.log('⚠️ [autoFillUserInfo] No user found, skipping auto-fill');
    return false;
  }
  
  // Check if user has at least email or phone (basic info)
  if (!localUser.email && !localUser.phone) {
    console.log('⚠️ [autoFillUserInfo] User found but no email or phone, skipping auto-fill');
    return false;
  }
  
  console.log('✅ User logged in, fetching user info...', { email: localUser.email, phone: localUser.phone });
  
  // Get input fields
  const firstNameInput = document.getElementById('customerFirstName');
  const lastNameInput = document.getElementById('customerLastName');
  const emailInput = document.getElementById('customerEmail');
  const phoneInput = document.getElementById('customerPhone');
  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');
  const noteInput = document.getElementById('deliveryNote');
  
  // Check if inputs exist
  if (!firstNameInput || !lastNameInput || !emailInput || !phoneInput) {
    console.log('⚠️ [autoFillUserInfo] Form fields not found:', {
      firstNameInput: !!firstNameInput,
      lastNameInput: !!lastNameInput,
      emailInput: !!emailInput,
      phoneInput: !!phoneInput
    });
    return false;
  }
  
  console.log('✅ [autoFillUserInfo] All form fields found');
  
  // Use localStorage data directly (faster and more reliable)
  // Only fetch from API if we have a token and want fresh data
  let user = {
    firstName: localUser.firstName || '',
    lastName: localUser.lastName || '',
    email: localUser.email || '',
    phone: localUser.phone || '',
    street: localUser.street || '',
    postal: localUser.postal || '',
    city: localUser.city || '',
    note: localUser.note || ''
  };
  
  // Try to fetch fresh data from API if available (optional)
  try {
    if (localUser.token && window.api && window.api.auth && window.api.auth.getCurrentUser) {
      console.log('🔄 [autoFillUserInfo] Fetching fresh data from API...');
      const result = await window.api.auth.getCurrentUser();
      if (result && result.success && result.user) {
        user = {
          firstName: result.user.firstName || user.firstName || '',
          lastName: result.user.lastName || user.lastName || '',
          email: result.user.email || user.email || '',
          phone: result.user.phone || user.phone || '',
          street: result.user.street || user.street || '',
          postal: result.user.postal || user.postal || '',
          city: result.user.city || user.city || '',
          note: result.user.note || user.note || ''
        };
        // Update localStorage
        localStorage.setItem('leo_user', JSON.stringify({ ...localUser, ...user }));
        console.log('✅ [autoFillUserInfo] Updated user data from API');
      }
    }
  } catch (error) {
    console.log('⚠️ [autoFillUserInfo] API fetch failed, using localStorage data:', error);
    // Continue with localStorage data
  }
  
  // Fill fields with user info (auto-fill when user is logged in)
  // Always fill if user is logged in, but allow manual editing after
  console.log('📝 Starting to fill form fields with user data:', {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    street: user.street,
    postal: user.postal,
    city: user.city
  });
  
  let filledAny = false;
  if (firstNameInput && user.firstName) {
    firstNameInput.value = user.firstName;
    filledAny = true;
    console.log('✅ Filled firstName:', user.firstName);
  }
  if (lastNameInput && user.lastName) {
    lastNameInput.value = user.lastName;
    filledAny = true;
    console.log('✅ Filled lastName:', user.lastName);
  }
  if (emailInput && user.email) {
    emailInput.value = user.email;
    filledAny = true;
    console.log('✅ Filled email:', user.email);
  }
  if (phoneInput && user.phone) {
    phoneInput.value = user.phone;
    filledAny = true;
    console.log('✅ Filled phone:', user.phone);
  }
  if (streetInput && user.street) {
    streetInput.value = user.street;
    filledAny = true;
    console.log('✅ Filled street:', user.street);
  }
  if (postalInput && user.postal) {
    postalInput.value = user.postal;
    filledAny = true;
    console.log('✅ Filled postal:', user.postal);
  }
  if (cityInput && user.city) {
    cityInput.value = user.city;
    filledAny = true;
    console.log('✅ Filled city:', user.city);
  }
  if (noteInput && user.note) {
    noteInput.value = user.note;
    filledAny = true;
    console.log('✅ Filled note:', user.note);
  }
  
  if (!filledAny) {
    console.log('⚠️ [autoFillUserInfo] No data to fill - user object:', user);
    return false;
  } else {
    console.log('✅ [autoFillUserInfo] Successfully filled', filledAny, 'field(s)');
  }
  
  // Trigger events to notify any listeners
  [firstNameInput, lastNameInput, emailInput, phoneInput, streetInput, postalInput, cityInput, noteInput].forEach(input => {
    if (input && input.value) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  // Trigger delivery range check if address is filled
  if (streetInput && postalInput && cityInput && streetInput.value && postalInput.value && cityInput.value) {
    const rangeCheck = await checkDeliveryRange(streetInput.value, postalInput.value, cityInput.value);
    const messageDiv = document.getElementById('deliveryRangeMessage');
    if (messageDiv) {
      messageDiv.style.display = 'block';
      messageDiv.textContent = rangeCheck.message;
      messageDiv.style.background = rangeCheck.withinRange ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      messageDiv.style.border = rangeCheck.withinRange ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)';
      messageDiv.style.color = rangeCheck.withinRange ? '#10b981' : '#ef4444';
    }
  }
  
  console.log('✅ [autoFillUserInfo] Auto-filled user info:', {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    street: user.street,
    postal: user.postal,
    city: user.city
  });
  
  // Trigger events to notify any listeners
  [firstNameInput, lastNameInput, emailInput, phoneInput, streetInput, postalInput, cityInput, noteInput].forEach(input => {
    if (input && input.value) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  
  // Trigger delivery range check if address is filled
  if (streetInput && postalInput && cityInput && streetInput.value && postalInput.value && cityInput.value) {
    const rangeCheck = await checkDeliveryRange(streetInput.value, postalInput.value, cityInput.value);
    const messageDiv = document.getElementById('deliveryRangeMessage');
    if (messageDiv) {
      messageDiv.style.display = 'block';
      messageDiv.textContent = rangeCheck.message;
      messageDiv.style.background = rangeCheck.withinRange ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      messageDiv.style.border = rangeCheck.withinRange ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)';
      messageDiv.style.color = rangeCheck.withinRange ? '#10b981' : '#ef4444';
    }
  }
  
  return true;
}

// Select service type
function selectServiceType(type) {
  window.selectedServiceType = type;
  
  // Update UI
  document.querySelectorAll('.service-type-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const selectedBtn = document.querySelector(`.service-type-btn[data-service="${type}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }
  
  // Update delivery fee
  updateOrderSummary();
}

// Select payment option - use payment.js version (has PayPal logic)
// Don't override - let payment.js handle it
// This function is kept for backward compatibility but will be overridden by payment.js

// Select tip percentage
function selectTip(percent) {
  // Remove active class from all tip buttons
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to selected button
  const selectedBtn = event.target.closest('.tip-btn');
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }
  
  // Calculate tip amount
  const cart = getCart();
  const subtotal = calculateSubtotal(cart);
  const tipAmount = (subtotal * percent) / 100;
  
  window.selectedTip = {
    type: 'percent',
    value: percent,
    amount: tipAmount
  };
  
  // Hide custom tip input
  const customTipContainer = document.getElementById('customTipContainer');
  if (customTipContainer) {
    customTipContainer.style.display = 'none';
  }
  
  updateOrderSummary();
}

// Open custom tip input
function openCustomTip() {
  // Remove active class from all tip buttons
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show custom tip input
  const customTipContainer = document.getElementById('customTipContainer');
  if (customTipContainer) {
    customTipContainer.style.display = 'block';
    const input = document.getElementById('customTipAmount');
    if (input) {
      input.focus();
    }
  }
}

// Update custom tip
function updateCustomTip() {
  const input = document.getElementById('customTipAmount');
  if (!input) return;
  
  const amount = parseFloat(input.value) || 0;
  
  window.selectedTip = {
    type: 'custom',
    value: amount,
    amount: amount
  };
  
  updateOrderSummary();
}

// Clear tip
function clearTip() {
  window.selectedTip = null;
  
  // Remove active class from all tip buttons
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Hide custom tip input
  const customTipContainer = document.getElementById('customTipContainer');
  if (customTipContainer) {
    customTipContainer.style.display = 'none';
  }
  
  // Clear custom tip input
  const customTipInput = document.getElementById('customTipAmount');
  if (customTipInput) {
    customTipInput.value = '';
  }
  
  updateOrderSummary();
}

// Apply discount code
async function applyDiscountCode() {
  const codeInput = document.getElementById('discountCode');
  const messageEl = document.getElementById('discountCodeMessage');
  
  if (!codeInput || !messageEl) return;
  
  const code = codeInput.value.trim().toUpperCase();
  
  if (!code) {
    messageEl.textContent = 'Bitte geben Sie einen Gutscheincode ein';
    messageEl.style.color = 'rgba(255, 255, 255, 0.6)';
    return;
  }
  
  try {
    // Get current subtotal and email for validation
    const cart = getCart();
    const subtotal = calculateSubtotal(cart);
    const emailInput = document.getElementById('customerEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    
    // Call API to validate discount code
    if (window.api && window.api.promotions && window.api.promotions.validate) {
      const result = await window.api.promotions.validate(code, subtotal, email);
      
      if (result && result.valid) {
        window.appliedDiscount = {
          code: code,
          discount: result.discount_amount || result.discount || 0,
          percentage: result.percentage || 0,
          promotion_id: result.promotion_id || null
        };
        
        messageEl.textContent = result.message || `✅ Gutscheincode "${code}" angewendet!`;
        messageEl.style.color = '#10b981';
        
        updateOrderSummary();
      } else {
        window.appliedDiscount = null;
        messageEl.textContent = result.message || 'Ungültiger Gutscheincode';
        messageEl.style.color = '#ef4444';
      }
    } else {
      // Fallback: simple validation
      if (code.startsWith('LEO-')) {
        window.appliedDiscount = {
          code: code,
          discount: 5,
          percentage: 10
        };
        messageEl.textContent = `✅ Gutscheincode "${code}" angewendet!`;
        messageEl.style.color = '#10b981';
        updateOrderSummary();
      } else {
        window.appliedDiscount = null;
        messageEl.textContent = 'Ungültiger Gutscheincode';
        messageEl.style.color = '#ef4444';
      }
    }
  } catch (error) {
    console.error('Error applying discount code:', error);
    window.appliedDiscount = null;
    messageEl.textContent = 'Fehler beim Anwenden des Gutscheincodes';
    messageEl.style.color = '#ef4444';
  }
}

// Get cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('leoCart') || '[]');
  } catch (e) {
    return [];
  }
}

// Calculate subtotal
function calculateSubtotal(cart) {
  if (!cart || cart.length === 0) {
    return 0;
  }
  
  return cart.reduce((total, item) => {
    // Handle both 'qty' and 'quantity' for compatibility
    const quantity = item.qty || item.quantity || 1;
    // Ensure price is a number
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    
    return total + (price * quantity);
  }, 0);
}

// Calculate delivery fee
async function calculateDeliveryFee() {
  // Check if delivery address is within range
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  
  // If address is not filled yet, default to 0
  if (!street || !postal || !city) {
    return 0;
  }
  
  // Check if address is within delivery range (4km)
  const rangeCheck = await checkDeliveryRange(street, postal, city);
  
  // Free delivery within 4km range
  // If outside range, delivery is not possible (button is disabled), so fee is 0
  return 0;
}

// Update order summary
async function updateOrderSummary() {
  const cart = getCart();
  const subtotal = calculateSubtotal(cart);
  
  // Calculate automatic discount (10% if subtotal > 15€)
  let automaticDiscountAmount = 0;
  if (subtotal > 15) {
    automaticDiscountAmount = (subtotal * 10) / 100;
    automaticDiscount = {
      amount: automaticDiscountAmount,
      percentage: 10
    };
  } else {
    automaticDiscount = null;
  }
  
  // Calculate discount code (applied after automatic discount)
  let discountAmount = 0;
  if (window.appliedDiscount) {
    // Apply discount code on subtotal after automatic discount
    const subtotalAfterAutoDiscount = subtotal - automaticDiscountAmount;
    if (window.appliedDiscount.percentage > 0) {
      discountAmount = (subtotalAfterAutoDiscount * window.appliedDiscount.percentage) / 100;
    } else {
      discountAmount = window.appliedDiscount.discount;
    }
  }
  
  // Total discount = automatic + code discount
  const totalDiscountAmount = automaticDiscountAmount + discountAmount;
  
  // Calculate delivery fee
  const deliveryFee = await calculateDeliveryFee();
  
  // Calculate tip
  let tipAmount = 0;
  if (window.selectedTip) {
    tipAmount = window.selectedTip.amount;
  }
  
  // Calculate VAT (7% of subtotal after all discounts) - chỉ hiển thị, không tính vào total
  const vatAmount = ((subtotal - totalDiscountAmount) * 7) / 100;
  
  // Calculate total (KHÔNG cộng VAT - VAT đã tính trong giá)
  const total = subtotal - totalDiscountAmount + deliveryFee + tipAmount;
  
  // Update UI
  const subtotalEl = document.getElementById('summarySubtotal');
  const discountRow = document.getElementById('discountRow');
  const discountEl = document.getElementById('summaryDiscount');
  const deliveryEl = document.getElementById('summaryDelivery');
  const tipRow = document.getElementById('tipRow');
  const tipEl = document.getElementById('summaryTip');
  const vatRow = document.getElementById('vatRow');
  const vatEl = document.getElementById('summaryVAT');
  const totalEl = document.getElementById('summaryTotal');
  
  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  
  // Show/hide discount row (show if any discount exists)
  if (discountRow && discountEl) {
    if (totalDiscountAmount > 0) {
      discountRow.style.display = 'flex';
      // Show discount breakdown if both automatic and code discount exist
      if (automaticDiscountAmount > 0 && discountAmount > 0) {
        discountEl.innerHTML = `
          <div style="font-size: 12px; opacity: 0.8; margin-bottom: 2px;">Automatischer Rabatt (10%): -${formatPrice(automaticDiscountAmount)}</div>
          <div style="font-size: 12px; opacity: 0.8; margin-bottom: 2px;">Gutscheincode: -${formatPrice(discountAmount)}</div>
          <div style="font-weight: 600; margin-top: 4px;">-${formatPrice(totalDiscountAmount)}</div>
        `;
      } else if (automaticDiscountAmount > 0) {
        discountEl.innerHTML = `
          <div style="font-size: 12px; opacity: 0.8; margin-bottom: 2px;">Automatischer Rabatt (10%)</div>
          <div style="font-weight: 600; margin-top: 4px;">-${formatPrice(automaticDiscountAmount)}</div>
        `;
      } else {
        discountEl.innerHTML = `<div style="font-weight: 600;">-${formatPrice(discountAmount)}</div>`;
      }
    } else {
      discountRow.style.display = 'none';
    }
  }
  
  if (deliveryEl) deliveryEl.textContent = formatPrice(deliveryFee);
  
  // Show/hide tip row
  if (tipRow && tipEl) {
    if (tipAmount > 0) {
      tipRow.style.display = 'flex';
      tipEl.textContent = formatPrice(tipAmount);
    } else {
      tipRow.style.display = 'none';
    }
  }
  
  // Show VAT (always visible, informational only)
  if (vatRow && vatEl) {
    vatEl.textContent = formatPrice(vatAmount);
  }
  
  if (totalEl) totalEl.textContent = formatPrice(total);
}

// Get current location (for address auto-fill)
function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation wird von Ihrem Browser nicht unterstützt.');
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
        const data = await response.json();
        
        if (data.address) {
          const streetInput = document.getElementById('deliveryStreet');
          const postalInput = document.getElementById('deliveryPostal');
          const cityInput = document.getElementById('deliveryCity');
          
          if (streetInput && data.address.road) {
            streetInput.value = `${data.address.road}${data.address.house_number ? ' ' + data.address.house_number : ''}`;
          }
          if (postalInput && data.address.postcode) {
            postalInput.value = data.address.postcode;
          }
          if (cityInput && data.address.city) {
            cityInput.value = data.address.city;
          }
          
          // Check delivery range after auto-filling address
          setTimeout(() => {
            checkAndUpdateDeliveryStatus();
          }, 500);
        }
      } catch (error) {
        alert('Fehler beim Abrufen der Adresse.');
      }
    },
    (error) => {
      alert('Fehler beim Abrufen der Position.');
    }
  );
}

// Confirm checkout
async function confirmCheckout() {
  // Validate form
  const firstName = document.getElementById('customerFirstName')?.value.trim();
  const lastName = document.getElementById('customerLastName')?.value.trim();
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  const email = document.getElementById('customerEmail')?.value.trim();
  const note = document.getElementById('deliveryNote')?.value.trim();
  
  if (!firstName || !lastName || !street || !postal || !city || !phone || !email) {
    alert('Bitte füllen Sie alle Pflichtfelder aus.');
    return;
  }
  
  // Check if delivery address is within 4km range
  const rangeCheck = await checkDeliveryRange(street, postal, city);
  if (!rangeCheck.withinRange) {
    alert('Lieferung nicht möglich!\n\n' + rangeCheck.message + '\n\nBitte wählen Sie stattdessen:\n• "Tisch reservieren"');
    // Scroll to delivery address section
    const addressSection = document.getElementById('customerInfoSection');
    if (addressSection) {
      addressSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Validate scheduled delivery time if provided
  const scheduledDateValue = document.getElementById('scheduledDeliveryDate')?.value;
  const scheduledTimeValue = document.getElementById('scheduledDeliveryTime')?.value;
  if (scheduledDateValue && scheduledTimeValue) {
    const now = new Date();
    // Parse date and time as local time (not UTC)
    const [year, month, day] = scheduledDateValue.split('-').map(Number);
    const [hours, minutes] = scheduledTimeValue.split(':').map(Number);
    const scheduledDateTime = new Date(year, month - 1, day, hours, minutes);
    const minDateTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    
    if (scheduledDateTime < minDateTime) {
      const minHours = String(minDateTime.getHours()).padStart(2, '0');
      const minMinutes = String(minDateTime.getMinutes()).padStart(2, '0');
      const minTimeStr = `${minHours}:${minMinutes}`;
      alert(`Die gewünschte Lieferzeit muss mindestens 30 Minuten ab jetzt sein (frühestens ${minTimeStr}).`);
      const errorDiv = document.getElementById('scheduledDeliveryTimeError');
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Die gewünschte Lieferzeit muss mindestens 30 Minuten ab jetzt sein (frühestens ${minTimeStr}).`;
      }
      return;
    }
  }
  
  // Check if cart has items
  const cart = getCart();
  if (!cart || cart.length === 0) {
    alert('Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.');
    window.location.href = 'catalog';
    return;
  }
  
  // Calculate totals
  const subtotal = calculateSubtotal(cart);
  
  // Calculate automatic discount (10% if subtotal > 15€)
  let automaticDiscountAmount = 0;
  if (subtotal > 15) {
    automaticDiscountAmount = (subtotal * 10) / 100;
  }
  
  // Calculate discount code (applied after automatic discount)
  let discountAmount = 0;
  if (window.appliedDiscount) {
    const subtotalAfterAutoDiscount = subtotal - automaticDiscountAmount;
    if (window.appliedDiscount.percentage > 0) {
      discountAmount = (subtotalAfterAutoDiscount * window.appliedDiscount.percentage) / 100;
    } else {
      discountAmount = window.appliedDiscount.discount;
    }
  }
  
  // Total discount = automatic + code discount
  const totalDiscountAmount = automaticDiscountAmount + discountAmount;
  
  const deliveryFee = await calculateDeliveryFee();
  const tipAmount = window.selectedTip ? window.selectedTip.amount : 0;
  // Calculate VAT (7% of subtotal after all discounts) - chỉ hiển thị, không tính vào total
  const vatAmount = ((subtotal - totalDiscountAmount) * 7) / 100;
  // Calculate total (KHÔNG cộng VAT - VAT đã tính trong giá)
  const total = subtotal - totalDiscountAmount + deliveryFee + tipAmount;
  
  // Get scheduled delivery time if provided
  const scheduledDateValue2 = document.getElementById('scheduledDeliveryDate')?.value;
  const scheduledTimeValue2 = document.getElementById('scheduledDeliveryTime')?.value;
  const scheduledDeliveryTime = (scheduledDateValue2 && scheduledTimeValue2) ? {
    date: scheduledDateValue2,
    time: scheduledTimeValue2,
    datetime: `${scheduledDateValue2}T${scheduledTimeValue2}`
  } : null;
  
  // Prepare order data
  const orderData = {
    items: cart,
    customer: {
      firstName,
      lastName,
      email,
      phone,
      street,
      postal,
      city,
      note
    },
    serviceType: window.selectedServiceType,
    paymentMethod: window.selectedPaymentMethod,
    discount: window.appliedDiscount ? {
      code: window.appliedDiscount.code,
      amount: discountAmount
    } : null,
    automaticDiscount: automaticDiscountAmount > 0 ? {
      percentage: 10,
      amount: automaticDiscountAmount
    } : null,
    tip: window.selectedTip ? {
      type: window.selectedTip.type,
      amount: tipAmount
    } : null,
    deliveryFee,
    vat: vatAmount, // VAT chỉ để hiển thị, không tính vào total
    subtotal,
    total,
    scheduledDeliveryTime: scheduledDeliveryTime
  };
  
  try {
    // Call API to create order
    if (window.api && window.api.orders && window.api.orders.saveOrder) {
      // Format order data for API
      const apiOrderData = {
        order_id: `LEO-${Date.now()}`,
        items: cart.map(item => {
          const quantity = item.qty || item.quantity || 1;
          const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
          return {
            name: item.name,
            quantity: quantity,
            total: (price * quantity).toFixed(2) + ' €'
          };
        }),
        service_type: window.selectedServiceType === 'delivery' ? 'Lieferung' : 'Abholung',
        payment_method: window.selectedPaymentMethod === 'cash' ? 'Barzahlung' : window.selectedPaymentMethod === 'card' ? 'Kartenzahlung' : 'PayPal',
        order_total: total.toFixed(2) + ' €',
        customer: {
          firstName,
          lastName,
          email,
          phone,
          street,
          postal,
          city,
          note
        },
        discount_code: window.appliedDiscount ? window.appliedDiscount.code : null,
        promotion_id: window.appliedDiscount ? window.appliedDiscount.promotion_id : null,
        automatic_discount: automaticDiscountAmount > 0 ? {
          percentage: 10,
          amount: automaticDiscountAmount.toFixed(2) + ' €'
        } : null,
        tip: tipAmount > 0 ? tipAmount.toFixed(2) + ' €' : null,
        deliveryFee: deliveryFee > 0 ? deliveryFee.toFixed(2) + ' €' : null,
        vat: vatAmount > 0 ? vatAmount.toFixed(2) + ' €' : null,
        scheduled_delivery_time: scheduledDeliveryTime || null
      };
      
      console.log('📦 Sending order to API:', apiOrderData);
      const result = await window.api.orders.saveOrder(apiOrderData);
      console.log('📦 API Response:', result);
      
      if (result && result.success) {
        // Get order ID from result or use the one we created
        const orderId = result.order_id || result.orderId || apiOrderData.order_id;
        
        // Save customer info to localStorage for profile page
        try {
          const customerKey = email.toLowerCase().trim();
          const customerInfo = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            street: street,
            postal: postal,
            city: city,
            note: note,
            customerCode: result.customer_code || apiOrderData.customer?.customerCode || null
          };
          
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
          savedCustomers[customerKey] = customerInfo;
          localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
          
          if (customerInfo.customerCode) {
            localStorage.setItem('leo_customer_code', customerInfo.customerCode);
          }
          
          console.log('✅ Saved customer info to localStorage:', customerInfo);
        } catch (e) {
          console.error('Error saving customer to localStorage:', e);
        }
        
        // Save order ID to recent orders for polling
        const recentOrders = JSON.parse(localStorage.getItem('leoRecentOrders') || '[]');
        if (orderId && !recentOrders.includes(orderId)) {
          recentOrders.unshift(orderId);
          // Keep only last 10 orders
          if (recentOrders.length > 10) {
            recentOrders.pop();
          }
          localStorage.setItem('leoRecentOrders', JSON.stringify(recentOrders));
        }
        
        // Clear cart
        localStorage.removeItem('leoCart');
        
        // Add notification
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          const orderIdShort = orderId ? orderId.replace(/^(LEO-|ORD-)/, '') : 'N/A';
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '✅ Bestellung erfolgreich!',
            `Ihre Bestellung #${orderIdShort} wurde erfolgreich aufgegeben. Sie erhalten eine Bestätigungs-E-Mail.`,
            { orderId: orderId }
          );
        }
        
        // Redirect after a short delay to show notification
        setTimeout(() => {
          window.location.href = 'catalog';
        }, 1000);
      } else {
        // Show error notification instead of alert
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '❌ Fehler beim Aufgeben der Bestellung',
            result.message || 'Unbekannter Fehler. Bitte versuchen Sie es erneut.',
            { error: true }
          );
        } else {
          alert('Fehler beim Aufgeben der Bestellung: ' + (result.message || 'Unbekannter Fehler'));
        }
      }
    } else {
      console.error('❌ API not available:', {
        window_api: !!window.api,
        orders: !!window.api?.orders,
        saveOrder: !!window.api?.orders?.saveOrder
      });
      // Show error notification
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '❌ API nicht verfügbar',
          'Bitte laden Sie die Seite neu und versuchen Sie es erneut.',
          { error: true }
        );
      } else {
        alert('❌ API nicht verfügbar. Bitte Seite neu laden.');
      }
    }
  } catch (error) {
    console.error('❌ Error in confirmCheckout:', error);
    // Show error notification
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Fehler beim Aufgeben der Bestellung',
        error.message || 'Unbekannter Fehler. Bitte versuchen Sie es erneut.',
        { error: true }
      );
    } else {
      alert('Fehler beim Aufgeben der Bestellung: ' + (error.message || 'Unbekannter Fehler') + '. Bitte versuchen Sie es erneut.');
    }
  }
}

// Expose functions to window
window.selectServiceType = selectServiceType;
// Don't expose selectPaymentOption - let payment.js handle it (has PayPal logic)
// window.selectPaymentOption = selectPaymentOption;
window.selectTip = selectTip;
window.openCustomTip = openCustomTip;
window.updateCustomTip = updateCustomTip;
window.clearTip = clearTip;
window.applyDiscountCode = applyDiscountCode;
window.getCurrentLocation = getCurrentLocation;
window.confirmCheckout = confirmCheckout;
window.tryAutoFillUserInfo = tryAutoFillUserInfo; // Expose for manual testing
// Override autoFillUserInfo from payment.js with checkout.js version (more complete)
// Mark that checkout.js version is loaded
window._checkoutAutoFillLoaded = true;
window.autoFillUserInfo = autoFillUserInfo; // Override with checkout.js version
console.log('✅ Checkout.js autoFillUserInfo loaded and ready');
console.log('✅ autoFillUserInfo function type:', typeof window.autoFillUserInfo);

// Test function - call this in console: testAutoFill()
window.testAutoFill = async function() {
  console.log('🧪 Testing auto-fill...');
  console.log('localStorage leo_user:', localStorage.getItem('leo_user'));
  const result = await window.autoFillUserInfo();
  console.log('🧪 Test result:', result);
  return result;
};

