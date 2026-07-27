// Checkout Module - VERSION 20260414
console.log('🔥 CHECKOUT.JS v20260414 LOADED - 5km radius + Photon API');
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

// Check if restaurant is currently open for ordering
function isRestaurantOpen() {
  // Berlin is UTC+1 (CET) or UTC+2 (CEST)
  // We use Intl.DateTimeFormat with 'Europe/Berlin' to get the current hour in Berlin
  const now = new Date();
  const options = { timeZone: 'Europe/Berlin', hour: 'numeric', hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const currentHour = parseInt(formatter.format(now));
  
  return currentHour >= RESTAURANT_HOURS.open && currentHour < RESTAURANT_HOURS.close;
}

// Update the ordering availability UI (banner + button)
function updateOrderingAvailability() {
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  let banner = document.getElementById('restaurantClosedBanner');
  const open = isRestaurantOpen();

  if (!open) {
    // Create banner if not exists
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'restaurantClosedBanner';
      banner.style.cssText = 'background: rgba(239,68,68,.15); border: 2px solid rgba(239,68,68,.5); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center; color: #ff6b6b; font-size: 16px; line-height: 1.6;';
      banner.innerHTML = '<div style="font-size: 28px; margin-bottom: 8px;">🕐</div>' +
        '<div style="font-weight: 700; font-size: 18px; margin-bottom: 4px;">Vorbestellung möglich</div>' +
        '<div>Das Restaurant ist zurzeit geschlossen. Sie können trotzdem vorbestellen:</div>' +
        '<div style="margin-top: 5px;">• Tisch / Abholung: ab <strong>12:00 Uhr</strong></div>' +
        '<div>• Lieferung: ab <strong>12:00 Uhr</strong></div>';
      // Insert at the top of checkout main
      const checkoutMain = document.querySelector('.checkout-main');
      if (checkoutMain) {
        checkoutMain.insertBefore(banner, checkoutMain.firstChild);
      }
    }
    banner.style.display = 'block';
    // Remove disabling logic - allow pre-ordering
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
      confirmBtn.title = '';
      confirmBtn.textContent = 'Vorbestellung';
    }
  } else {
    // Remove banner
    if (banner) banner.style.display = 'none';
    // Reset text
    if (confirmBtn && confirmBtn.textContent.includes('Vorbestellung')) {
      confirmBtn.textContent = 'Bestellung bestätigen';
    }
  }
}

// Haversine formula for distance between two GPS points
function calculateDistanceHaversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Check if delivery address is within delivery range using OpenStreetMap
async function checkDeliveryRange(street, postal, city, coords = null) {
  if (!street || !postal || !city) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine vollständige Adresse ein.' };
  }

  // Validate postal code format
  if (!/^\d{5}$/.test(postal)) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine gültige 5-stellige PLZ ein.' };
  }

  // If we have coordinates (e.g. from autocomplete), use them immediately with Haversine
  const restaurantCoords = { lat: 52.5659, lng: 13.3970 };
  if (coords && coords.lat && coords.lng) {
    const distance = (typeof window.calculateDistanceHaversine === 'function') 
      ? window.calculateDistanceHaversine(restaurantCoords.lat, restaurantCoords.lng, coords.lat, coords.lng)
      : calculateDistanceHaversine(restaurantCoords.lat, restaurantCoords.lng, coords.lat, coords.lng);
    
    const limit = 5.0;
    if (distance <= limit) {
      return {
        withinRange: true,
        distance: distance.toFixed(2),
        message: `✓ Lieferung möglich (${distance.toFixed(2)} km - kostenlos)`
      };
    } else {
      return {
        withinRange: false,
        distance: distance.toFixed(2),
        message: `✗ Lieferung nicht möglich: ${distance.toFixed(2)} km (Limit: ${limit} km).`
      };
    }
  }

  // Use OpenStreetMap for accurate distance calculation as fallback
  if (typeof window.checkDeliveryRangeOSM === 'function') {
    try {
      return await window.checkDeliveryRangeOSM(street, postal, city);
    } catch (error) {
      console.error('Error checking delivery range with OSM:', error);
    }
  }

  // Fallback: Simple postal code check
  const customerPostal = parseInt(postal);
  const valid5kmZips = [
    13187, 13189, 13156, 13158, 13127, 13086, 13088, 13089, 
    13347, 13359, 13357, 10439, 10437, 10435, 10405, 10407, 13409
  ];
  if (valid5kmZips.includes(customerPostal)) {
    return {
      withinRange: true,
      distance: null,
      message: '✓ Lieferung voraussichtlich möglich (PLZ-Prüfung)'
    };
  }

  return {
    withinRange: false,
    distance: null,
    message: '✗ Adresse konnte nicht auf der Karte gefunden werden. Bitte Schreibweise (z.B. Str. vs Straße) überprüfen.'
  };
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

    // If both are empty, check if restaurant is open
    if (!date && !time) {
      if (!isRestaurantOpen()) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Das Restaurant ist zurzeit geschlossen. Bitte wählen Sie ein Lieferdatum và Uhrzeit.';
        return false;
      }
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
async function checkAndUpdateDeliveryStatus(coords = null) {
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const messageEl = document.getElementById('deliveryRangeMessage');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');

  if (!messageEl) return;

  // Save selected coordinates globally for reference if provided
  if (coords) window._selectedAddressCoords = coords;

  if (!street || !postal || !city) {
    messageEl.style.display = 'none';
    // Disable button if address is incomplete for delivery
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.title = 'Bitte geben Sie eine vollständige Lieferadresse ein';
    }
    return;
  }

  const rangeCheck = await checkDeliveryRange(street, postal, city, coords || window._selectedAddressCoords);

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
      confirmBtn.title = 'Lieferung nicht möglich: Adresse liegt außerhalb des 5km-Radius';
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

// Auto-apply 10% flyer discount if user came from QR flyer (one-time only)
function applyFlyerDiscountIfEligible() {
  const flyerStatus = localStorage.getItem('leo_flyer_discount');
  if (flyerStatus !== 'unused') return;

  console.log('🎟️ Flyer discount detected! Auto-applying 10% Rabatt...');

  // Set the discount via the shared window variable
  window.appliedDiscount = {
    code: 'FLYER10',
    discount: 10,
    percentage: 10
  };

  // Show discount banner on checkout page
  setTimeout(() => {
    const checkoutMain = document.querySelector('.checkout-main') || document.querySelector('main');
    if (!checkoutMain) return;

    // Check if banner already exists
    if (document.getElementById('flyerDiscountBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'flyerDiscountBanner';
    banner.style.cssText = 'background: linear-gradient(135deg, rgba(196,30,58,0.15), rgba(196,30,58,0.08)); border: 2px solid rgba(196,30,58,0.4); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; text-align: center; animation: flyerBannerPulse 2s ease infinite;';
    banner.innerHTML = '<div style="font-size: 22px; margin-bottom: 4px;">🎉</div>' +
      '<div style="font-weight: 700; font-size: 16px; color: #ff6b6b; margin-bottom: 4px;">10% Flyer-Rabatt aktiv!</div>' +
      '<div style="font-size: 13px; color: rgba(255,255,255,0.7);">Der Rabatt wird automatisch auf Ihre Bestellung angewendet.</div>';

    // Add animation keyframes
    if (!document.getElementById('flyerBannerStyle')) {
      const style = document.createElement('style');
      style.id = 'flyerBannerStyle';
      style.textContent = '@keyframes flyerBannerPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(196,30,58,0.2); } 50% { box-shadow: 0 0 20px 2px rgba(196,30,58,0.15); } }';
      document.head.appendChild(style);
    }

    checkoutMain.insertBefore(banner, checkoutMain.firstChild);

    // Also auto-fill the discount code input if it exists
    const discountInput = document.getElementById('discountCode');
    if (discountInput) {
      discountInput.value = 'FLYER10';
      discountInput.disabled = true;
      discountInput.style.opacity = '0.7';
    }

    // Hide the apply button if it exists
    const applyBtn = document.getElementById('applyDiscountBtn');
    if (applyBtn) {
      applyBtn.style.display = 'none';
    }

    // Update the discount message
    const discountMsg = document.getElementById('discountCodeMessage');
    if (discountMsg) {
      discountMsg.textContent = '✅ 10% Flyer-Rabatt automatisch angewendet';
      discountMsg.style.color = '#10b981';
    }

    // Update order summary to reflect discount
    if (typeof updateOrderSummary === 'function') {
      updateOrderSummary();
    }
  }, 300);
}

// Initialize checkout page
function initCheckout() {
  console.log('📄 Initializing checkout page...');

  // Auto-apply flyer discount (10%) if user came from QR flyer
  applyFlyerDiscountIfEligible();

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

// Function to setup time options for scheduled delivery
function setupTimeOptions() {
  const scheduledDateEl = document.getElementById('scheduledDeliveryDate');
  const scheduledTimeEl = document.getElementById('scheduledDeliveryTime');

  if (!scheduledDateEl || !scheduledTimeEl || scheduledTimeEl.tagName !== 'SELECT') return;

  const serviceType = window.selectedServiceType || 'delivery';

  let openHour = RESTAURANT_HOURS.open;
  let closeHour = RESTAURANT_HOURS.close;
  
  // Rules: Delivery starts 12:30, Pickup/Dine-in (Đến ăn) starts 12:00
  let startHour = openHour;
  let startMin = 0;
  
  if (serviceType === 'delivery') {
      startMin = 0; // delivery also starts at openHour (12:00)
  }

  const timeOptions = [];

  // Generate time slots
  for (let hour = startHour; hour < closeHour; hour++) {
    const minStart = (hour === startHour) ? startMin : 0;
    for (let minute = minStart; minute < 60; minute += 15) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      timeOptions.push(timeStr);
    }
  }

  let filteredTimeOptions = timeOptions;
  
  // If the user selected today's date, filter out time slots that have already passed
  const now = new Date();
  const berlinDateParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const selectedDate = scheduledDateEl.value;

  if (selectedDate === berlinDateParts) {
    // Determine the current time in Berlin manually
    const berlinTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false });
    const berlinDate = new Date(berlinTimeStr);
    
    // Add preparation buffer (50 min delivery, 20 min pickup/dine-in)
    const bufferMinutes = (serviceType === 'delivery') ? 50 : 20;
    berlinDate.setMinutes(berlinDate.getMinutes() + bufferMinutes);
    
    // Format the "minimum allowed time" as HH:MM
    const minAllowedHour = berlinDate.getHours();
    const minAllowedMinute = berlinDate.getMinutes();
    const minAllowedTimeStr = `${String(minAllowedHour).padStart(2, '0')}:${String(minAllowedMinute).padStart(2, '0')}`;
    
    // Filter array
    filteredTimeOptions = timeOptions.filter(time => time >= minAllowedTimeStr);
  }

  // Clear existing options except the first one (placeholder)
  while (scheduledTimeEl.options.length > 1) {
    scheduledTimeEl.remove(1);
  }

  // Add time options
  filteredTimeOptions.forEach(time => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    scheduledTimeEl.appendChild(option);
  });

  // We do NOT set a default value automatically! 
  // It should remain empty (placeholder) so that orders default to ASAP (Schnellstmöglich)
  // Options are populated but not pre-selected.
}


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

  // Check if restaurant is open for ordering
  updateOrderingAvailability();
  // Re-check every 60 seconds (auto-enable when restaurant opens)
  setInterval(updateOrderingAvailability, 60000);

  // Initialize scheduled delivery time field
  const scheduledDeliveryTimeGroup = document.getElementById('scheduledDeliveryTimeGroup');
  if (scheduledDeliveryTimeGroup) {
    scheduledDeliveryTimeGroup.style.display = 'block';
    const scheduledDateEl = document.getElementById('scheduledDeliveryDate');
    if (scheduledDateEl && !scheduledDateEl.value) {
      // Use Berlin timezone to determine current hour (restaurant is in Berlin)
      const now = new Date();
      const berlinTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false });
      const berlinDate = new Date(berlinTimeStr);
      const berlinHour = berlinDate.getHours();
      
      // Get today's date in Berlin timezone (YYYY-MM-DD)
      const berlinDateParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
      
      let displayDateStr = berlinDateParts; // default: today in Berlin
      
      // If after closing (RESTAURANT_HOURS.close is 22/10 PM in Berlin)
      // shift default and min date to tomorrow
      if (berlinHour >= RESTAURANT_HOURS.close) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        displayDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrow);
      }
      
      scheduledDateEl.value = displayDateStr;
      scheduledDateEl.setAttribute('min', displayDateStr);
    }
    setupTimeOptions(); // Call the new function to populate time options
    
    // Add listener for date change to refresh time options
    if (scheduledDateEl) {
      scheduledDateEl.addEventListener('change', () => {
        setupTimeOptions();
        setupScheduledDeliveryTimeValidation();
      });
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
  console.log('🚚 Selecting service type:', type);
  window.selectedServiceType = type;

  // Update UI buttons
  document.querySelectorAll('.service-type-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const selectedBtn = document.querySelector(`.service-type-btn[data-service="${type}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }

  // Toggle address visibility and required attributes
  const addressContainer = document.getElementById('deliveryAddressSection');
  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');
  
  // Hide map picker button for pickup/dinein
  const locationPickerBtn = document.querySelector('button[onclick="openLocationPicker()"]');

  if (type === 'pickup' || type === 'dinein') {
    // Hide address fields
    if (addressContainer) addressContainer.style.display = 'none';
    if (locationPickerBtn) locationPickerBtn.style.display = 'none';

    // Remove required attributes
    if (streetInput) streetInput.removeAttribute('required');
    if (postalInput) postalInput.removeAttribute('required');
    if (cityInput) cityInput.removeAttribute('required');

  } else {
    // Delivery (default)
    // Show address fields
    if (addressContainer) addressContainer.style.display = 'block';
    if (locationPickerBtn) locationPickerBtn.style.display = 'block';

    // Add required attributes
    if (streetInput) streetInput.setAttribute('required', 'required');
    if (postalInput) postalInput.setAttribute('required', 'required');
    if (cityInput) cityInput.setAttribute('required', 'required');

    // Check delivery range if address is already filled
    checkAndUpdateDeliveryStatus();
  }

  // Reload order summary
  updateOrderSummary();
  
  // Update time options when service type changes (Delivery: 12:30, Others: 12:00)
  setupTimeOptions();
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

  // Check if address is within delivery range (5km)
  if (selectedServiceType === 'delivery') {
    // Delivery fee is calculated elsewhere (usually free within 5km)
    // Free delivery within 5km range
  }
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
    const subtotalAfterAutoDiscount = subtotal - automaticDiscountAmount;
    if (window.appliedDiscount.percentage > 0) {
      discountAmount = (subtotalAfterAutoDiscount * window.appliedDiscount.percentage) / 100;
    } else {
      discountAmount = window.appliedDiscount.discount || 0;
    }
  }

  // Total discount = automatic + code discount
  const totalDiscountAmount = automaticDiscountAmount + discountAmount;

  // Calculate delivery fee
  const deliveryFee = await calculateDeliveryFee();

  // Calculate tip
  let tipAmount = 0;
  if (window.selectedTip) {
    tipAmount = window.selectedTip.amount || 0;
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

  if (vatRow && vatEl) {
    vatEl.textContent = formatPrice(vatAmount);
  }

  const totalEl = document.getElementById('summaryTotal');
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Check minimum order amount for delivery
  const minOrderWarning = document.getElementById('minOrderWarning');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  const isDelivery = window.selectedServiceType === 'delivery';
  
  if (isDelivery && subtotal < 15) {
    if (minOrderWarning) minOrderWarning.style.display = 'block';
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.title = 'Der Mindestbestellwert für eine Lieferung beträgt 15,00 €';
    }
  } else {
    if (minOrderWarning) minOrderWarning.style.display = 'none';
    // Only enable if not already disabled by address check
    const messageEl = document.getElementById('deliveryRangeMessage');
    const isOutOfRange = messageEl && messageEl.style.display !== 'none' && messageEl.innerHTML.includes('✗');
    
    if (confirmBtn && !isOutOfRange) {
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
      confirmBtn.style.cursor = 'pointer';
      confirmBtn.title = '';
    }
  }
}

// Map Picker Variables
let pickerMap = null;
let pickerMarker = null;
let pickerCircle = null;
let selectedPickerCoords = null;

function openLocationPicker() {
  const modal = document.getElementById('mapPickerModal');
  if (!modal) return;

  modal.style.display = 'block';

  // Initialize map if not already done
  setTimeout(() => {
    initMapPicker();
  }, 100);
}

function closeLocationPicker() {
  const modal = document.getElementById('mapPickerModal');
  if (modal) modal.style.display = 'none';
}

function initMapPicker() {
  const container = document.getElementById('mapPickerContainer');
  if (!container) return;

  // Clear container if it was partially initialized or buggy
  if (!pickerMap) {
      container.innerHTML = '';
  } else {
      pickerMap.invalidateSize();
      return;
  }

  const restaurantCoords = { lat: 52.5659, lng: 13.3970 };
  
  // Define bounds for 5km area (approx +/- 0.06 degrees)
  const bounds = [
    [restaurantCoords.lat - 0.06, restaurantCoords.lng - 0.1],
    [restaurantCoords.lat + 0.06, restaurantCoords.lng + 0.1]
  ];

  pickerMap = L.map('mapPickerContainer', {
    minZoom: 14,
    maxZoom: 19,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
  }).setView([restaurantCoords.lat, restaurantCoords.lng], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(pickerMap);

  // Add Mask (Shaded area outside 5km radius)
  // We use a large rectangle with a circular hole
  const worldOuter = [
    [restaurantCoords.lat - 1, restaurantCoords.lng - 1],
    [restaurantCoords.lat - 1, restaurantCoords.lng + 1],
    [restaurantCoords.lat + 1, restaurantCoords.lng + 1],
    [restaurantCoords.lat + 1, restaurantCoords.lng - 1]
  ];
  
  // Create points for the 5km circle hole (36 points for smoothness)
  const holePoints = [];
  const radiusInDegrees = 5000 / 111320; // Rough conversion: 1 degree ~ 111.32km
  for (let i = 0; i <= 360; i += 10) {
    const angle = i * Math.PI / 180;
    const lat = restaurantCoords.lat + (radiusInDegrees * Math.cos(angle));
    const lng = restaurantCoords.lng + (radiusInDegrees * Math.sin(angle) / Math.cos(restaurantCoords.lat * Math.PI / 180));
    holePoints.push([lat, lng]);
  }

  L.polygon([worldOuter, holePoints], {
    color: 'none',
    fillColor: '#000',
    fillOpacity: 0.6,
    interactive: false
  }).addTo(pickerMap);

  // Add restaurant marker
  L.marker([restaurantCoords.lat, restaurantCoords.lng], {
    icon: L.divIcon({
      className: 'restaurant-icon',
      html: '<div style="background: #e5cf8e; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px gold;"></div>',
      iconSize: [14, 14]
    })
  }).addTo(pickerMap).bindPopup('LEO SUSHI');

  // Add 5km radius boundary line
  pickerCircle = L.circle([restaurantCoords.lat, restaurantCoords.lng], {
    color: '#e5cf8e',
    weight: 2,
    fill: false,
    radius: 5000
  }).addTo(pickerMap);

  // Map click handler
  pickerMap.on('click', (e) => {
    const { lat, lng } = e.latlng;
    const distance = pickerMap.distance([restaurantCoords.lat, restaurantCoords.lng], [lat, lng]) / 1000;

    if (distance <= 5.0) {
      updatePickerMarker(lat, lng);
      selectedPickerCoords = { lat, lng };
      const confirmBtn = document.getElementById('confirmLocationBtn');
      if (confirmBtn) confirmBtn.disabled = false;
    } else {
      alert('Dieser Ort liegt außerhalb des 5km-Radius des Restaurants.');
    }
  });
}

function updatePickerMarker(lat, lng) {
  if (pickerMarker) {
    pickerMarker.setLatLng([lat, lng]);
  } else {
    pickerMarker = L.marker([lat, lng], { draggable: true }).addTo(pickerMap);
    pickerMarker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      const restaurantCoords = { lat: 52.5659, lng: 13.3970 };
      const distance = pickerMap.distance([restaurantCoords.lat, restaurantCoords.lng], [lat, lng]) / 1000;
      
      if (distance <= 5.0) {
        selectedPickerCoords = { lat, lng };
      } else {
        if (selectedPickerCoords) {
            pickerMarker.setLatLng([selectedPickerCoords.lat, selectedPickerCoords.lng]);
        }
        alert('Dieser Ort liegt außerhalb des 5km-Radius.');
      }
    });
  }
}

async function confirmLocationSelection() {
  if (!selectedPickerCoords) return;

  const { lat, lng } = selectedPickerCoords;
  const btn = document.getElementById('confirmLocationBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Lade Adresse...';
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&email=leosushiberlin@gmail.com`);
    const data = await response.json();

    if (data.address) {
      const streetInput = document.getElementById('deliveryStreet');
      const postalInput = document.getElementById('deliveryPostal');
      const cityInput = document.getElementById('deliveryCity');

      if (streetInput) {
        streetInput.value = `${data.address.road || ''}${data.address.house_number ? ' ' + data.address.house_number : ''}`.trim() || data.display_name.split(',')[0];
      }
      if (postalInput) postalInput.value = data.address.postcode || '';
      if (cityInput) cityInput.value = data.address.city || data.address.town || data.address.village || 'Berlin';

      if (typeof window.checkAndUpdateDeliveryStatus === 'function') {
        window.checkAndUpdateDeliveryStatus(selectedPickerCoords);
      }
    }
    closeLocationPicker();
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    alert('Fehler beim Abrufen der Adresse.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Standort bestätigen';
    }
  }
}

// Expose to window
window.openLocationPicker = openLocationPicker;
window.closeLocationPicker = closeLocationPicker;
window.confirmLocationSelection = confirmLocationSelection;

// Confirm checkout
async function confirmCheckout() {
  // ══════════════════════════════════════════════════
  // ⛔ HARD BLOCK: PAYPAL CHƯA THANH TOÁN THÀNH CÔNG
  // Đơn hàng KHÔNG được tạo cho đến khi PayPal capture
  // thành công. Cờ _paypalPaymentCompleted chỉ được set
  // trong onApprove SAU KHI actions.order.capture() OK.
  // ══════════════════════════════════════════════════
  if (window.selectedPaymentMethod === 'paypal') {
    if (!window._paypalPaymentCompleted) {
      console.warn('⛔ [confirmCheckout] PayPal chưa hoàn thành thanh toán - chặn đặt đơn!');
      // Hiển thị thông báo
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '⚠️ Thanh toán PayPal chưa hoàn tất',
          'Vui lòng nhấn nút PayPal bên dưới để thanh toán. Đơn hàng sẽ được đặt tự động sau khi thanh toán thành công.',
          { error: true }
        );
      } else {
        alert('⚠️ Bạn đã chọn PayPal nhưng chưa thanh toán!\n\nVui lòng nhấn nút PayPal bên dưới để hoàn tất thanh toán.\n\nĐơn hàng chỉ được xác nhận sau khi PayPal xử lý thành công.');
      }
      // Scroll & highlight PayPal button container
      const paypalContainer = document.getElementById('paypalButtonContainer');
      if (paypalContainer) {
        paypalContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        paypalContainer.style.boxShadow = '0 0 0 3px rgba(229,207,142,0.6)';
        paypalContainer.style.transition = 'box-shadow 0.3s';
        setTimeout(() => { paypalContainer.style.boxShadow = ''; }, 3000);
      }
      return; // ⛔ DỪNG HOÀN TOÀN - không gửi API
    }
    // PayPal đã capture thành công → đơn hàng đã được tạo trong onApprove
    console.log('✅ [confirmCheckout] PayPal đã thanh toán - đơn đã được tạo trong onApprove');
    return; // Không làm gì thêm
  }

  // Time validation (regardless of open status)
  const scheduledTime = document.getElementById('scheduledDeliveryTime')?.value;
  const scheduledDate = document.getElementById('scheduledDeliveryDate')?.value;
  const isDeliverySelection = window.selectedServiceType === 'delivery';

  if (scheduledTime) {
    const [hour, minute] = scheduledTime.split(':').map(Number);
    const timeInMinutes = hour * 60 + minute;
    
    // Delivery: min 12:30 (750 minutes), Others: min 12:00 (720 minutes)
    const minRequiredMinutes = isDeliverySelection ? 750 : 720;
    const minTimeStr = isDeliverySelection ? '12:30' : '12:00';

    if (timeInMinutes < minRequiredMinutes) {
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '❌ Ungültige Uhrzeit',
          `Für ${isDeliverySelection ? 'Lieferung' : 'Vor Ort/Abholung'} ist eine Zeit ab ${minTimeStr} Uhr erforderlich.`,
          { error: true }
        );
      } else {
        alert(`Für ${isDeliverySelection ? 'Lieferung' : 'Vor Ort/Abholung'} ist eine Zeit ab ${minTimeStr} Uhr erforderlich.`);
      }
      return;
    }
  } else if (!isRestaurantOpen()) {
    // If restaurant is closed and NO time is selected, force selection
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '🕐 Vorbestellung erforderlich',
        'Das Restaurant ist zurzeit geschlossen. Bitte wählen Sie eine Zeit aus.',
        { error: true }
      );
    } else {
      alert('Das Restaurant ist zurzeit geschlossen. Bitte wählen Sie eine Zeit aus.');
    }
    return;
  }

  // Validate form
  const firstName = document.getElementById('customerFirstName')?.value.trim();
  const lastName = document.getElementById('customerLastName')?.value.trim();
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const phone = document.getElementById('customerPhone')?.value.trim();
  const email = document.getElementById('customerEmail')?.value.trim();
  const note = document.getElementById('deliveryNote')?.value.trim();

  // Detailed validation
  const missingFields = [];

  if (!firstName) missingFields.push('Vorname');
  if (!lastName) missingFields.push('Nachname');
  if (!phone) missingFields.push('Telefonnummer');
  if (!email) missingFields.push('E-Mail');

  // Only check address if service type is delivery (default)
  // undefined serviceType defaults to delivery
  const isDelivery = typeof window.selectedServiceType === 'undefined' || window.selectedServiceType === 'delivery';

  if (isDelivery) {
    if (!street) missingFields.push('Straße & Hausnummer');
    if (!postal) missingFields.push('PLZ');
    if (!city) missingFields.push('Stadt');
  }

  if (missingFields.length > 0) {
    // Show error notification instead of alert
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Fehlende Angaben',
        'Bitte füllen Sie folgende Pflichtfelder aus:\n• ' + missingFields.join('\n• '),
        { error: true }
      );
    } else {
      alert('Bitte füllen Sie folgende Pflichtfelder aus:\n\n• ' + missingFields.join('\n• '));
    }

    // Highlight first missing field
    const firstMissingFieldId =
      !firstName ? 'customerFirstName' :
        !lastName ? 'customerLastName' :
          !phone ? 'customerPhone' :
            !email ? 'customerEmail' :
              (isDelivery && !street) ? 'deliveryStreet' :
                (isDelivery && !postal) ? 'deliveryPostal' :
                  (isDelivery && !city) ? 'deliveryCity' : null;

    if (firstMissingFieldId) {
      const el = document.getElementById(firstMissingFieldId);
      if (el) {
        el.focus();
        el.style.borderColor = '#ef4444';
        setTimeout(() => el.style.borderColor = '', 3000);
      }
    }
    return;
  }

  // Check if delivery address is within 5km range (Only for Delivery)
  if (selectedServiceType === 'delivery') {
    const rangeCheck = await checkDeliveryRange(street, postal, city);
    if (!rangeCheck.withinRange) {
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '❌ Lieferung nicht möglich',
          rangeCheck.message + '\nBitte wählen Sie stattdessen "Abholung" oder "Tisch reservieren".',
        );
      } else {
        alert('Lieferung nicht möglich!\n\n' + rangeCheck.message + '\n\nBitte wählen Sie stattdessen:\n• "Tisch reservieren" (im Restaurant)');
      }

      // Scroll to delivery address section
      const addressSection = document.getElementById('customerInfoSection');
      if (addressSection) {
        addressSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
  }

  // Check if cart has items
  const cart = getCart();
  if (!cart || cart.length === 0) {
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Warenkorb leer',
        'Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.',
        { error: true }
      );
    } else {
      alert('Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.');
    }
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 1500);
    return;
  }

  // Calculate totals
  const subtotal = calculateSubtotal(cart);

  // Minimum order check for delivery
  if (isDelivery && subtotal < 15) {
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Mindestbestellwert nicht erreicht',
        'Der Mindestbestellwert für eine Lieferung beträgt 15,00 €.',
        { error: true }
      );
    } else {
      alert('Der Mindestbestellwert für eine Lieferung beträgt 15,00 €.');
    }
    return;
  }

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
  
  // Custom validation for minimum times
  if (scheduledTimeValue2) {
    const serviceType = window.selectedServiceType || 'delivery';
    const minTime = (serviceType === 'delivery') ? '12:30' : '12:00';
    
    // Only check if date is today or somehow earlier (though picker should prevent)
    const today = new Date().toISOString().split('T')[0];
    if (scheduledDateValue2 === today && scheduledTimeValue2 < minTime) {
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '❌ Ungültige Zeit',
            `Für ${serviceType === 'delivery' ? 'Lieferung' : 'Tisch (Dine-in)'} ist die früheste Zeit ${minTime} Uhr.`,
            { error: true }
          );
        } else {
          alert(`Giờ sớm nhất cho ${serviceType === 'delivery' ? 'Giao hàng' : 'Đến ăn'} là ${minTime}h.`);
        }
        return;
    }
  }

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
    serviceType: window.selectedServiceType || 'delivery',
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
    // Show loading state
    const confirmBtn = document.getElementById('confirmCheckoutBtn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Wird bearbeitet...';
    }

    // Call API to create order
    if (window.api && window.api.orders && window.api.orders.saveOrder) {

      // ⛔ SAFETY CHECK CUỐI: Không cho phép đặt đơn PayPal qua đây
      // PayPal phải đi qua onApprove trong payment.js
      if (window.selectedPaymentMethod === 'paypal') {
        console.error('⛔ [confirmCheckout] Phát hiện cố gắng đặt đơn PayPal qua confirmCheckout! Chặn lại.');
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = 'Bestellung bestätigen';
        }
        return;
      }

      // Format order data for API
      const paymentLabel = window.selectedPaymentMethod === 'cash' ? 'Barzahlung'
        : window.selectedPaymentMethod === 'card' ? 'Kartenzahlung'
        : window.selectedPaymentMethod === 'paypal' ? 'PayPal' // Should never reach here
        : 'Barzahlung'; // Default fallback

      const apiOrderData = {
        order_id: `LEO-${Date.now()}`, // Temporary ID, backend will overwrite with LEO-XXX
        items: cart.map(item => {
          const quantity = item.qty || item.quantity || 1;
          const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
          return {
            name: item.name,
            quantity: quantity,
            total: (price * quantity).toFixed(2) + ' €'
          };
        }),
        service_type: window.selectedServiceType || 'delivery',
        payment_method: paymentLabel,
        payment_status: 'pending', // Cash/Card: trả sau
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
        // Get the official sequential order ID from the backend
        const orderId = result.order_id || result.orderId || apiOrderData.order_id;
        
        // Update the temporary ID in our local data objects if needed
        apiOrderData.order_id = orderId;
        orderData.order_id = orderId;

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

        // Mark flyer discount as used (one-time only)
        if (localStorage.getItem('leo_flyer_discount') === 'unused') {
          localStorage.setItem('leo_flyer_discount', 'used');
          console.log('🎟️ Flyer discount marked as used');
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
          window.location.href = 'menu.html';
        }, 1500);
      } else {
        // Restore button state
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = 'Bestellung bestätigen';
        }

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
      // Restore button state
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Bestellung bestätigen';
      }

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
    // Restore button state
    const confirmBtn = document.getElementById('confirmCheckoutBtn');
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Bestellung bestätigen';
    }

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
window.confirmCheckout = confirmCheckout;
window.tryAutoFillUserInfo = tryAutoFillUserInfo; // Expose for manual testing
// Override autoFillUserInfo from payment.js with checkout.js version (more complete)
// Mark that checkout.js version is loaded
window._checkoutAutoFillLoaded = true;
window.autoFillUserInfo = autoFillUserInfo; // Override with checkout.js version
console.log('✅ Checkout.js autoFillUserInfo loaded and ready');
console.log('✅ autoFillUserInfo function type:', typeof window.autoFillUserInfo);

// Test function - call this in console: testAutoFill()
window.testAutoFill = async function () {
  console.log('🧪 Testing auto-fill...');
  console.log('localStorage leo_user:', localStorage.getItem('leo_user'));
  const result = await window.autoFillUserInfo();
  console.log('🧪 Test result:', result);
  return result;
};

