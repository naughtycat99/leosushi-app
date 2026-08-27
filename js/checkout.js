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

// Restaurant working hours (24-hour format)
const RESTAURANT_HOURS = {
  open: 12,  // 12:00
  close: 22  // 22:00
};

// Get branch info
function getSelectedBranch() {
  const savedBranch = localStorage.getItem('leoSelectedBranch');
  if (savedBranch) {
    try {
      const parsedBranch = JSON.parse(savedBranch);
      if (parsedBranch && (parsedBranch.id === 'branch_flora' || parsedBranch.id === 'branch_haupt')) {
        return parsedBranch;
      }
    } catch (e) { }
  }

  const branchKey = localStorage.getItem('selected_branch');
  if (branchKey === 'haupt') {
    return { id: 'branch_haupt', name: 'Leo Sushi - Hauptstraße', address: 'Hauptstraße 29a, 13158 Berlin' };
  }

  return { id: 'branch_flora', name: 'Leo Sushi - Florastraße', address: 'Florastraße 10A, 13187 Berlin' };
}

// Get branch coordinates
function getBranchCoords() {
  const branch = getSelectedBranch();
  if (!branch) return { lat: 52.5659, lng: 13.3970 }; // Default: Florastraße 10A (Chi nhánh 1)
  if (branch.id === 'branch_haupt') {
    return { lat: 52.5869484, lng: 13.3682051 }; // Hauptstraße 29a
  }
  return { lat: 52.5659, lng: 13.3970 }; // Florastraße 10A
}

// Restaurant address for delivery range check
function getRestaurantAddress() {
  const branch = getSelectedBranch();
  if (!branch) return null;
  if (branch.id === 'branch_haupt') {
    return { street: 'Hauptstraße 29a', postal: '13158', city: 'Berlin' };
  }
  return { street: 'Florastraße 10A', postal: '13187', city: 'Berlin' };
}

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
      banner.style.cssText = `
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 107, 107, 0.2);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
        text-align: center;
        color: #ff6b6b;
        font-size: 15px;
        line-height: 1.6;
        box-shadow: 0 8px 32px rgba(255, 107, 107, 0.05);
        transition: all 0.3s ease;
        animation: pulseBanner 2s infinite alternate;
      `;
      // Inject keyframes for animation if not exists
      if (!document.getElementById('banner-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'banner-pulse-style';
        style.innerHTML = `
          @keyframes pulseBanner {
            0% { box-shadow: 0 8px 32px rgba(255, 107, 107, 0.05); border-color: rgba(255, 107, 107, 0.2); }
            100% { box-shadow: 0 8px 32px rgba(255, 107, 107, 0.15); border-color: rgba(255, 107, 107, 0.4); }
          }
        `;
        document.head.appendChild(style);
      }
      banner.innerHTML = '<div style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(255,107,107,0.3));">🕒</div>' +
        '<div style="font-weight: 700; font-size: 20px; margin-bottom: 8px; letter-spacing: -0.5px;">Vorbestellung möglich</div>' +
        '<div style="opacity: 0.9; margin-bottom: 12px; max-width: 90%; margin-left: auto; margin-right: auto;">Das Restaurant ist zurzeit geschlossen. Sie können trotzdem vorbestellen:</div>' +
        '<div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">' +
          '<div style="background: rgba(255, 107, 107, 0.1); padding: 8px 16px; border-radius: 20px; display: inline-flex; align-items: center; gap: 8px;">' +
            '<span>🛍️ Abholung:</span><strong style="color: #ff5252;">ab 12:00 Uhr</strong>' +
          '</div>' +
          '<div style="background: rgba(255, 107, 107, 0.1); padding: 8px 16px; border-radius: 20px; display: inline-flex; align-items: center; gap: 8px;">' +
            '<span>🛵 Lieferung:</span><strong style="color: #ff5252;">ab 12:00 Uhr</strong>' +
          '</div>' +
        '</div>';
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
  const restaurantCoords = getBranchCoords();
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
        errorDiv.textContent = 'Das Restaurant ist zurzeit geschlossen. Bitte wählen Sie ein Lieferdatum und eine Uhrzeit.';
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
  const streetOnly = document.getElementById('deliveryStreet')?.value.trim();
  const houseNumber = document.getElementById('deliveryHouseNumber')?.value.trim();
  const street = streetOnly && houseNumber ? `${streetOnly} ${houseNumber}` : streetOnly;
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const messageEl = document.getElementById('deliveryRangeMessage');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');

  if (!messageEl) return;

  // Save selected coordinates globally for reference if provided
  if (coords) {
    selectedAddressCoords = coords;
    window.selectedAddressCoords = coords;
  }

  if (!streetOnly || !houseNumber || !postal || !city) {
    messageEl.style.display = 'none';
    // Disable button if address is incomplete for delivery
    if (confirmBtn && window.selectedServiceType === 'delivery') {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.title = 'Bitte geben Sie eine vollständige Lieferadresse ein';
    }
    return;
  }

  const rangeCheck = await checkDeliveryRange(street, postal, city, coords || selectedAddressCoords || window.selectedAddressCoords);

  if (rangeCheck.withinRange) {
    window.selectedDeliveryDistanceKm = rangeCheck.distance ? Number(rangeCheck.distance) : null;
    messageEl.innerHTML = `<div style="color: #10b981; display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 18px;">✓</span>
      <span>${rangeCheck.message}<br><small style="opacity:.8">Voraussichtliche Lieferzeit: ca. 30–45 Min.</small></span>
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
// Auto-fill function that delegates directly to autoFillUserInfo
async function tryAutoFillUserInfo() {
  return await autoFillUserInfo();
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

  // Auto-apply saved coupon from wallet (e.g. APP10)
  const savedCoupon = localStorage.getItem('leo_applied_coupon') || localStorage.getItem('leo_applied_voucher') || localStorage.getItem('discountCode');
  if (savedCoupon) {
    const discountInput = document.getElementById('discountCode');
    if (discountInput && !discountInput.value) {
      discountInput.value = savedCoupon;
      if (typeof applyDiscountCode === 'function') {
        setTimeout(applyDiscountCode, 300);
      }
    }
  }

  // Check Table Dine-in mode (Khi khách đặt món tại bàn qua QR)
  const urlParams = new URLSearchParams(window.location.search);
  const tableNum = urlParams.get('table') || urlParams.get('table_id') || urlParams.get('t') || localStorage.getItem('leo_table_number');
  if (tableNum) {
    localStorage.setItem('leo_table_number', tableNum);
    localStorage.setItem('leo_service_type', 'dine-in');
    
    setTimeout(() => {
      if (typeof selectServiceType === 'function') {
        selectServiceType('dinein');
      }
      
      const noteEl = document.getElementById('orderNote');
      if (noteEl && !noteEl.value.includes('Tisch')) {
        noteEl.value = `[DINE-IN] Tisch ${tableNum}. ` + (noteEl.value || '');
      }

      // Add prominent Table Banner on Checkout
      const checkoutContainer = document.querySelector('.checkout-container') || document.querySelector('.checkout-main') || document.querySelector('.checkout-grid');
      if (checkoutContainer && !document.getElementById('dineInTableCheckoutBanner')) {
        const tableBanner = document.createElement('div');
        tableBanner.id = 'dineInTableCheckoutBanner';
        tableBanner.style.cssText = 'background: linear-gradient(135deg, rgba(229,207,142,0.2), rgba(194,163,85,0.1)); border: 2px solid #e5cf8e; border-radius: 12px; padding: 14px 20px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;';
        tableBanner.innerHTML = `
          <div>
            <div style="color: var(--gold, #e5cf8e); font-weight: 800; font-size: 16px;">🍽️ Tisch-Bestellung: TISCH ${tableNum}</div>
            <div style="color: rgba(255,255,255,0.7); font-size: 12px;">Ihre Bestellung wird direkt an Ihren Tisch serviert.</div>
          </div>
          <span style="font-size: 24px;">🍣</span>
        `;
        checkoutContainer.insertBefore(tableBanner, checkoutContainer.firstChild);
      }
    }, 200);
  } else {
    window.selectedDeliveryDistanceKm = null;
    const savedServiceType = localStorage.getItem('selected_service_type') || localStorage.getItem('leo_service_type') || 'delivery';
    const normalizedServiceType = savedServiceType === 'dine-in' ? 'dinein' : savedServiceType;
    selectServiceType(['delivery', 'pickup', 'dinein'].includes(normalizedServiceType) ? normalizedServiceType : 'delivery');
  }

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
    for (let minute = minStart; minute < 60; minute += 5) {
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

  // Attach real-time auto-saving to all checkout form inputs
  const autoSaveFieldIds = [
    'customerFirstName', 'customerLastName', 'customerEmail', 'customerPhone',
    'deliveryStreet', 'deliveryPostal', 'deliveryCity', 'deliveryNote'
  ];
  autoSaveFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', debounceSaveCheckoutFormData);
      el.addEventListener('change', saveCheckoutFormData);
    }
  });

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

// Auto-save form inputs in real-time
function saveCheckoutFormData() {
  try {
    const data = {
      firstName: document.getElementById('customerFirstName')?.value?.trim() || '',
      lastName: document.getElementById('customerLastName')?.value?.trim() || '',
      email: document.getElementById('customerEmail')?.value?.trim() || '',
      phone: document.getElementById('customerPhone')?.value?.trim() || '',
      street: document.getElementById('deliveryStreet')?.value?.trim() || '',
      postal: document.getElementById('deliveryPostal')?.value?.trim() || '',
      city: document.getElementById('deliveryCity')?.value?.trim() || '',
      note: document.getElementById('deliveryNote')?.value?.trim() || ''
    };
    // Only save if at least one field has content
    if (data.firstName || data.lastName || data.email || data.phone || data.street) {
      localStorage.setItem('leo_checkout_customer', JSON.stringify(data));
      localStorage.setItem('leo_last_customer_info', JSON.stringify(data));
    }
  } catch (e) {
    console.error('Error saving checkout form data:', e);
  }
}

let _saveCheckoutTimer = null;
function debounceSaveCheckoutFormData() {
  if (_saveCheckoutTimer) clearTimeout(_saveCheckoutTimer);
  _saveCheckoutTimer = setTimeout(saveCheckoutFormData, 250);
}

// Auto-fill user info from database or local storage (works for both logged in users and guests)
async function autoFillUserInfo() {
  console.log('🔍 [autoFillUserInfo] Starting auto-fill...');

  const firstNameInput = document.getElementById('customerFirstName');
  const lastNameInput = document.getElementById('customerLastName');
  const emailInput = document.getElementById('customerEmail');
  const phoneInput = document.getElementById('customerPhone');
  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');
  const noteInput = document.getElementById('deliveryNote');

  if (!firstNameInput && !lastNameInput && !emailInput && !phoneInput) {
    console.log('⚠️ [autoFillUserInfo] Form fields not found on this page');
    return false;
  }

  // Priority 1: Logged-in user
  let userData = null;
  try {
    const userStr = localStorage.getItem('leo_user');
    if (userStr) userData = JSON.parse(userStr);
  } catch (e) {}

  // Priority 2: Auto-saved draft from typing / previous reload
  let savedDraft = null;
  try {
    const draftStr = localStorage.getItem('leo_checkout_customer');
    if (draftStr) savedDraft = JSON.parse(draftStr);
  } catch (e) {}

  // Priority 3: Last placed order customer info
  let lastOrderInfo = null;
  try {
    const lastStr = localStorage.getItem('leo_last_customer_info');
    if (lastStr) lastOrderInfo = JSON.parse(lastStr);
  } catch (e) {}

  // Priority 4: Saved customers dictionary
  let lastSavedCustomer = null;
  try {
    const custStr = localStorage.getItem('leoCustomers');
    if (custStr) {
      const custs = JSON.parse(custStr);
      const keys = Object.keys(custs);
      if (keys.length > 0) {
        lastSavedCustomer = custs[keys[keys.length - 1]];
      }
    }
  } catch (e) {}

  // Merge data sources (higher priority overwrites lower if non-empty)
  const merged = {
    firstName: userData?.firstName || savedDraft?.firstName || lastOrderInfo?.firstName || lastSavedCustomer?.firstName || '',
    lastName: userData?.lastName || savedDraft?.lastName || lastOrderInfo?.lastName || lastSavedCustomer?.lastName || '',
    email: userData?.email || savedDraft?.email || lastOrderInfo?.email || lastSavedCustomer?.email || '',
    phone: userData?.phone || savedDraft?.phone || lastOrderInfo?.phone || lastSavedCustomer?.phone || '',
    street: userData?.street || savedDraft?.street || lastOrderInfo?.street || lastSavedCustomer?.street || '',
    postal: userData?.postal || savedDraft?.postal || lastOrderInfo?.postal || lastSavedCustomer?.postal || '',
    city: userData?.city || savedDraft?.city || lastOrderInfo?.city || lastSavedCustomer?.city || '',
    note: userData?.note || savedDraft?.note || lastOrderInfo?.note || lastSavedCustomer?.note || ''
  };

  // If logged in and has token, try fetching fresh profile from API
  try {
    if (userData && userData.token && window.api?.auth?.getCurrentUser) {
      const result = await window.api.auth.getCurrentUser();
      if (result?.success && result?.user) {
        Object.assign(merged, {
          firstName: result.user.firstName || merged.firstName,
          lastName: result.user.lastName || merged.lastName,
          email: result.user.email || merged.email,
          phone: result.user.phone || merged.phone,
          street: result.user.street || merged.street,
          postal: result.user.postal || merged.postal,
          city: result.user.city || merged.city,
          note: result.user.note || merged.note
        });
      }
    }
  } catch (e) {}

  let filledAny = false;
  if (firstNameInput && !firstNameInput.value && merged.firstName) { firstNameInput.value = merged.firstName; filledAny = true; }
  if (lastNameInput && !lastNameInput.value && merged.lastName) { lastNameInput.value = merged.lastName; filledAny = true; }
  if (emailInput && !emailInput.value && merged.email) { emailInput.value = merged.email; filledAny = true; }
  if (phoneInput && !phoneInput.value && merged.phone) { phoneInput.value = merged.phone; filledAny = true; }
  if (streetInput && !streetInput.value && merged.street) { streetInput.value = merged.street; filledAny = true; }
  if (postalInput && !postalInput.value && merged.postal) { postalInput.value = merged.postal; filledAny = true; }
  if (cityInput && !cityInput.value && merged.city) { cityInput.value = merged.city; filledAny = true; }
  if (noteInput && !noteInput.value && merged.note) { noteInput.value = merged.note; filledAny = true; }

  // Trigger change and input events
  [firstNameInput, lastNameInput, emailInput, phoneInput, streetInput, postalInput, cityInput, noteInput].forEach(inp => {
    if (inp && inp.value) {
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Trigger delivery check
  if (streetInput && postalInput && cityInput && streetInput.value && postalInput.value) {
    if (typeof checkAndUpdateDeliveryStatus === 'function') {
      checkAndUpdateDeliveryStatus();
    }
  }

  console.log('✅ [autoFillUserInfo] Restored customer data into checkout form:', merged);
  return filledAny;
}

// Select service type
function selectServiceType(type) {
  console.log('🚚 Selecting service type:', type);
  window.selectedServiceType = type;
  const storedType = type === 'dinein' ? 'dine-in' : type;
  localStorage.setItem('selected_service_type', storedType);
  localStorage.setItem('leo_service_type', storedType);

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

    // Xử lý thông báo chuyển cơ sở khi chọn Pickup/Dinein
    const pickupWarning = document.getElementById('pickupBranchWarning');
    if (pickupWarning) {
        const branch = typeof window.getSelectedBranch === 'function' ? window.getSelectedBranch() : null;
        if (branch) {
            document.getElementById('pickupBranchName').innerText = branch.name;
            document.getElementById('pickupBranchAddress').innerText = branch.address;
            const prefix = type === 'dinein' ? '🍽️ Vor Ort in:' : '📍 Abholung in:';
            pickupWarning.querySelector('div').innerText = prefix;
        }
        pickupWarning.style.display = 'block';
    }
  } else {
    const pickupWarning = document.getElementById('pickupBranchWarning');
    if (pickupWarning) pickupWarning.style.display = 'none';
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
function selectTip(percent, selectedButton) {
  // Remove active class from all tip buttons
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active class to selected button
  const selectedBtn = selectedButton || (window.event && window.event.target ? window.event.target.closest('.tip-btn') : null);
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
function openCustomTip(selectedButton) {
  // Remove active class from all tip buttons
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (selectedButton) selectedButton.classList.add('active');

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

  const stripePayAmount = document.getElementById('stripePayAmount');
  if (stripePayAmount) stripePayAmount.textContent = formatPrice(total);

  if (window.selectedPaymentMethod === 'stripe' && typeof initStripePaymentElement === 'function') {
    if (window._lastStripeTotal !== total && total > 0) {
      window._lastStripeTotal = total;
      initStripePaymentElement();
    }
  }

  // Check minimum order amount for delivery (Check BEFORE discounts as requested)
  const minOrderWarning = document.getElementById('minOrderWarning');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  const isDelivery = window.selectedServiceType === 'delivery';

  if (isDelivery && subtotal < 15) {
    if (minOrderWarning) {
      minOrderWarning.style.display = 'block';
      minOrderWarning.innerHTML = `⚠️ Mindestbestellwert für Lieferung: 15,00 €. Aktuell: ${subtotal.toFixed(2)} €`;
    }
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.5';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.title = 'Mindestbestellwert für Lieferung: 15,00 €. Bitte mehr bestellen oder Abholung wählen.';
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

// --- Smart Autocomplete Location Search ---
let addressSearchTimeout = null;
let selectedAddressCoords = null;


function debounceAddressSearch() {
  const input = document.getElementById('addressSearchInput');
  const clearBtn = document.getElementById('clearAddressSearch');

  // Show/hide clear button
  if (input && input.value.length > 0) {
    if (clearBtn) clearBtn.style.display = 'block';
  } else {
    if (clearBtn) clearBtn.style.display = 'none';
  }

  if (addressSearchTimeout) clearTimeout(addressSearchTimeout);
  addressSearchTimeout = setTimeout(() => {
    executeAddressSearch();
  }, 400);
}

function clearAddressInput() {
  selectedAddressCoords = null;
  window.selectedAddressCoords = null;
  window.selectedDeliveryDistanceKm = null;
  const input = document.getElementById('addressSearchInput');
  if (input) input.value = '';
  const resultsDiv = document.getElementById('addressSearchResults');
  if (resultsDiv) resultsDiv.style.display = 'none';
  const clearBtn = document.getElementById('clearAddressSearch');
  if (clearBtn) clearBtn.style.display = 'none';

  // Reset Grid
  const grid = document.getElementById('addressDetailsGrid');
  if (grid) grid.style.display = 'none';
  const st = document.getElementById('deliveryStreet'); if (st) st.value = '';
  const hn = document.getElementById('deliveryHouseNumber'); if (hn) hn.value = '';
  const cy = document.getElementById('deliveryCity'); if (cy) cy.value = '';
  const pt = document.getElementById('deliveryPostal'); if (pt) pt.value = '';

  // Reset Validation Message
  const messageEl = document.getElementById('deliveryRangeMessage');
  if (messageEl) messageEl.style.display = 'none';

  // Lock Checkout (because delivery info cleared)
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  if (confirmBtn && window.selectedServiceType === 'delivery') {
    confirmBtn.disabled = true;
  }
}

// Distance Helper (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

async function executeAddressSearch(isFocus = false) {
  const input = document.getElementById('addressSearchInput');
  const resultsDiv = document.getElementById('addressSearchResults');
  if (!input || !resultsDiv) return;

  let query = input.value.trim();

  if (query.length < 3) {
    if (isFocus) {
      // Provide an empty/generic fallback query near the restaurant
      query = 'Pankow, Berlin';
    } else {
      resultsDiv.style.display = 'none';
      return;
    }
  }

  // Use branch coords if available, fallback to default Florastraße (Chi nhánh 1)
  const branchCoords = getBranchCoords() || { lat: 52.5659, lng: 13.3970 };

  // Use Photon API for searching
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${branchCoords.lat}&lon=${branchCoords.lng}&limit=6&lang=de`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      resultsDiv.innerHTML = '';
      resultsDiv.style.display = 'block';

      data.features.forEach(feature => {
        const coords = feature.geometry.coordinates; // [lon, lat]
        const lat = coords[1];
        const lng = coords[0];
        const props = feature.properties;

        const street = props.street || props.name || '';
        const houseNumber = props.housenumber || '';
        const postcode = props.postcode || '';
        const city = props.city || props.town || props.village || props.state || '';

        let displayStr = `${street} ${houseNumber}`.trim();
        if (displayStr && city) displayStr += ', ';
        displayStr += `${postcode} ${city}`.trim();

        if (!displayStr) displayStr = 'Unbekannter Ort';

        const item = document.createElement('div');
        item.style.padding = '12px 15px';
        item.style.borderBottom = '1px solid #444';
        item.style.color = '#fff';
        item.style.cursor = 'pointer';
        item.style.fontSize = '14px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '10px';

        const distance = getDistanceFromLatLonInKm(branchCoords.lat, branchCoords.lng, lat, lng).toFixed(1);

        item.innerHTML = `<span style="font-size:18px; color:#aaa;">📍</span> 
                          <div style="flex:1;">
                            <div style="font-weight:bold;">${street} ${houseNumber}</div>
                            <div style="font-size:12px; color:#aaa;">${postcode} ${city}</div>
                          </div>
                          <span style="font-size:12px; font-weight:bold; color:${distance <= 5.0 ? '#10b981' : '#ff6b6b'};">${distance} km</span>`;

        item.onclick = () => {
          resultsDiv.style.display = 'none';

          input.value = displayStr;

          // Reveal Explicit fields
          const grid = document.getElementById('addressDetailsGrid');
          if (grid) grid.style.display = 'block';

          const st = document.getElementById('deliveryStreet'); if (st) st.value = street;
          const cy = document.getElementById('deliveryCity'); if (cy) cy.value = city;
          const pt = document.getElementById('deliveryPostal'); if (pt) pt.value = postcode;

          const hnInput = document.getElementById('deliveryHouseNumber');
          if (hnInput) {
            if (houseNumber) {
              hnInput.value = houseNumber;
            } else {
              hnInput.value = '';
            }
            // Focus the house number logically so they complete it
            setTimeout(() => {
              hnInput.focus();
              // A tiny animation to show it requires input
              hnInput.style.boxShadow = '0 0 0 2px var(--gold)';
              setTimeout(() => hnInput.style.boxShadow = '', 1500);
            }, 100);
          }

          selectedAddressCoords = { lat, lng };

          // Trigger the universal delivery check
          if (typeof window.checkAndUpdateDeliveryStatus === 'function') {
            window.checkAndUpdateDeliveryStatus(selectedAddressCoords);
          }
        };

        // Add hover effect
        item.addEventListener('mouseenter', () => item.style.background = 'rgba(229,207,142,0.1)');
        item.addEventListener('mouseleave', () => item.style.background = 'transparent');

        resultsDiv.appendChild(item);
      });
    } else {
      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = '<div style="padding: 12px 15px; color: #ff6b6b; font-size: 14px;">Keine Ergebnisse gefunden</div>';
    }
  } catch (err) {
    console.error('Address search error:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    const resultsDiv = document.getElementById('addressSearchResults');
    const input = document.getElementById('addressSearchInput');
    if (resultsDiv && e.target !== resultsDiv && e.target !== input && !resultsDiv.contains(e.target)) {
      resultsDiv.style.display = 'none';
    }
  });

  const hnInput = document.getElementById('deliveryHouseNumber');
  if (hnInput) {
    hnInput.addEventListener('input', () => {
      // They are freely typing the house number - address object still refers to the main street coordinate 
      // which is perfectly fine for radius calculation.
      // Let's just immediately check form validity to unlock button if they deleted then re-typed it.
      const st = document.getElementById('deliveryStreet').value;
      if (st && hnInput.value && selectedAddressCoords) {
        if (typeof window.checkAndUpdateDeliveryStatus === 'function') {
          window.checkAndUpdateDeliveryStatus(selectedAddressCoords);
        }
      }
    });
  }
});

window.debounceAddressSearch = debounceAddressSearch;
window.clearAddressInput = clearAddressInput;
window.executeAddressSearch = executeAddressSearch;

// Confirm checkout
function showOrderProcessingOverlay(msg) {
  let overlay = document.getElementById('leoOrderProcessingOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'leoOrderProcessingOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:inherit;text-align:center;padding:20px;';
    overlay.innerHTML = '<div style="width:50px;height:50px;border:3px solid rgba(229,207,142,0.2);border-top:3px solid #e5cf8e;border-radius:50%;animation:leoSpin 0.8s linear infinite;margin-bottom:20px;"></div><div id="leoOverlayMsg" style="font-size:18px;font-weight:600;color:#e5cf8e;margin-bottom:8px;">Bestellung wird übermittelt...</div><div style="font-size:13px;color:rgba(255,255,255,0.6);">Bitte schließen Sie das Fenster nicht.</div><style>@keyframes leoSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>';
    document.body.appendChild(overlay);
  }
  if (msg) {
    const msgEl = document.getElementById('leoOverlayMsg');
    if (msgEl) msgEl.textContent = msg;
  }
  overlay.style.display = 'flex';
}

function hideOrderProcessingOverlay() {
  const overlay = document.getElementById('leoOrderProcessingOverlay');
  if (overlay) overlay.style.display = 'none';
}

window.showOrderProcessingOverlay = showOrderProcessingOverlay;
window.hideOrderProcessingOverlay = hideOrderProcessingOverlay;

async function confirmCheckout() {
  if (window._isSubmittingOrder) {
    console.warn('⛔ [confirmCheckout] Đơn hàng đang được xử lý, bỏ qua click trùng!');
    return;
  }
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
          '⚠️ PayPal-Zahlung noch nicht abgeschlossen',
          'Bitte klicken Sie auf den PayPal-Button unten, um die Zahlung abzuschließen. Die Bestellung wird automatisch nach erfolgreicher Zahlung aufgegeben.',
          { error: true }
        );
      } else {
        alert('⚠️ Sie haben PayPal gewählt, aber die Zahlung noch nicht abgeschlossen!\n\nBitte klicken Sie auf den PayPal-Button unten.\n\nDie Bestellung wird erst nach erfolgreicher PayPal-Zahlung bestätigt.');
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
  const streetOnly = document.getElementById('deliveryStreet')?.value.trim();
  const houseNumber = document.getElementById('deliveryHouseNumber')?.value.trim();
  const street = streetOnly && houseNumber ? `${streetOnly} ${houseNumber}` : streetOnly;
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

  // Verify branch is selected
  const branch = getSelectedBranch();
  if (!branch) {
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Filiale nicht ausgewählt',
        'Bitte wählen Sie eine Filiale aus, bevor Sie bestellen.',
        { error: true }
      );
    } else {
      alert('Bitte wählen Sie eine Filiale aus, bevor Sie bestellen.');
    }

    // Attempt to open the branch selector modal if it exists
    if (typeof openBranchSelector === 'function') {
      openBranchSelector(true);
    }
    return;
  }

  // Only check address if service type is delivery (default)
  // undefined serviceType defaults to delivery
  const isDelivery = typeof window.selectedServiceType === 'undefined' || window.selectedServiceType === 'delivery';

  if (isDelivery) {
    if (!streetOnly) missingFields.push('Straße');
    if (!houseNumber) missingFields.push('Hausnummer');
    if (!postal) missingFields.push('PLZ');
    if (!city) missingFields.push('Stadt');
  }

  if (missingFields.length > 0) {
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Fehlende Angaben',
        'Bitte füllen Sie die folgenden Pflichtfelder aus:\n• ' + missingFields.join('\n• '),
        { error: true }
      );
    } else {
      alert('Bitte füllen Sie die folgenden Pflichtfelder aus:\n\n• ' + missingFields.join('\n• '));
    }

    // Highlight first missing field
    const firstMissingFieldId =
      !firstName ? 'customerFirstName' :
        !lastName ? 'customerLastName' :
          !phone ? 'customerPhone' :
            !email ? 'customerEmail' :
              (isDelivery && !streetOnly) ? 'addressSearchInput' :
                (isDelivery && !houseNumber) ? 'deliveryHouseNumber' :
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
    // OPTIMIZATION: Pass coordinates if available to make it instant
    const rangeCheck = await checkDeliveryRange(street, postal, city, selectedAddressCoords || window.selectedAddressCoords);
    if (!rangeCheck.withinRange) {
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '❌ Lieferung nicht möglich',
          rangeCheck.message + '\nBitte wählen Sie stattdessen "Abholung" oder "Tisch reservieren".',
        );
      } else {
        alert('Lieferung nicht möglich!\n\n' + rangeCheck.message + '\n\nBitte wählen Sie:\n• "Abholung" oder "Tisch reservieren" (im Restaurant)');
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
        '❌ Warenkorb ist leer',
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

  if (window.LEO_IS_NATIVE_APP === true) {
    const cartBranchId = localStorage.getItem('leoCartBranchId') ||
      (cart.find(item => item && item.branchId)?.branchId || '');
    const containsWrongBranch = cart.some(item => item && item.branchId && item.branchId !== branch.id);
    if (!cartBranchId || cartBranchId !== branch.id || containsWrongBranch) {
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '❌ Warenkorb passt nicht zur Filiale',
          'Bitte wähle die Filiale erneut und füge die Gerichte aus der passenden Speisekarte hinzu.',
          { error: true }
        );
      } else {
        alert('Der Warenkorb gehört nicht zur ausgewählten Filiale. Bitte wähle die Filiale erneut.');
      }
      return;
    }
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
      discountAmount = window.appliedDiscount.discount || 0;
    }
  }

  if (isDelivery && subtotal < 15) {
    const msg = `Mindestbestellwert für Lieferung beträgt 15,00 €. (Aktuell: ${subtotal.toFixed(2)} €)`;
    if (window.addNotification && window.NOTIFICATION_TYPES) {
      window.addNotification(
        window.NOTIFICATION_TYPES.ORDER_SUCCESS,
        '❌ Mindestbestellwert nicht erreicht',
        msg,
        { error: true }
      );
    } else {
      alert(msg);
    }
    return;
  }

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
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (scheduledDateValue2 === today && scheduledTimeValue2 < minTime) {
      if (window.addNotification && window.NOTIFICATION_TYPES) {
        window.addNotification(
          window.NOTIFICATION_TYPES.ORDER_SUCCESS,
          '❌ Ungültige Uhrzeit',
          `Für ${serviceType === 'delivery' ? 'Lieferung' : 'Verzehr vor Ort / Abholung'} ist die früheste Zeit ${minTime} Uhr.`,
          { error: true }
        );
      } else {
        alert(`Früheste Zeit für ${serviceType === 'delivery' ? 'Lieferung' : 'Verzehr vor Ort / Abholung'}: ${minTime} Uhr.`);
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
      street: streetOnly,
      houseNumber,
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
    window._isSubmittingOrder = true;
    if (typeof showOrderProcessingOverlay === 'function') showOrderProcessingOverlay();
    // Show loading state
    const confirmBtn = document.getElementById('confirmCheckoutBtn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Bitte warten...';
    }

    // Call API to create order
    if (window.api && window.api.orders && window.api.orders.saveOrder) {

      // ⛔ SAFETY CHECK CUỐI: Không cho phép đặt đơn PayPal qua đây
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
        branch: branch, // The backend expects the full branch object here (to save inside summary)
        branch_id: branch ? branch.id : null,
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
          street: streetOnly,
          houseNumber,
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
        scheduled_delivery_time: scheduledDeliveryTime || null,
        delivery_distance_km: isDelivery ? (window.selectedDeliveryDistanceKm || null) : null,
        branch: getSelectedBranch()
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

        if (typeof window.rememberLeoOrder === 'function') {
          window.rememberLeoOrder({ ...apiOrderData, status: 'pending' }, orderId);
        }

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
          localStorage.setItem('leo_last_customer_info', JSON.stringify(customerInfo));
          localStorage.setItem('leo_checkout_customer', JSON.stringify(customerInfo));

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

        // Clear cart thoroughly across all keys
        try {
          localStorage.removeItem('leoCart');
          localStorage.removeItem('cart');
          localStorage.setItem('leoCart', '[]');
          localStorage.setItem('cart', '[]');
          localStorage.removeItem('leo_applied_voucher');
          localStorage.removeItem('applied_discount');
          if (typeof window.cart !== 'undefined') window.cart = [];
          if (typeof window.clearAppCart === 'function') window.clearAppCart();
          if (typeof window.clearCart === 'function') window.clearCart();
          window.dispatchEvent(new Event('cartUpdated'));
          window.dispatchEvent(new Event('cart:updated'));
        } catch (e) {
          console.error('Error clearing cart on order success:', e);
        }

        // Add notification
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          const orderIdShort = orderId ? orderId.replace(/^(LEO-|ORD-)/, '') : 'N/A';
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '✅ Bestellung erfolgreich!',
            `Ihre Bestellung #${orderIdShort} wurde erfolgreich aufgegeben. Wir bearbeiten sie sofort.`,
            { orderId: orderId }
          );
        }

        // Check app mode for redirect
        const isAppMode = document.body.classList.contains('is-capacitor-app') ||
          window.location.search.includes('app=true') ||
          sessionStorage.getItem('leo_app_preview') === 'true';

        // Redirect IMMEDIATELY (Only short delay for notification to trigger)
        setTimeout(() => {
          window.location.href = isAppMode
            ? `menu.html?status=success&id=${orderId}&app=true`
            : `menu.html?status=success&id=${orderId}`;
        }, 100);
      } else {
        // Restore button state
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = 'Bestellung bestätigen';
        }

        // Show error notification
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '❌ Bestellfehler',
            (result ? result.message : 'Ungültige Daten'),
            { error: true }
          );
        } else {
          alert('Fehler: ' + (result ? result.message : 'Bestellung konnte nicht gesendet werden'));
        }
      }
    } else {
      console.error('❌ API not available');
      alert('Das System wird gewartet. Bitte versuchen Sie es später erneut.');
    }
  } catch (err) {
    console.error('Final Submission Error:', err);
    alert('Fehler beim Senden: ' + err.message);
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
window.getCart = getCart;
window.calculateSubtotal = calculateSubtotal;
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

