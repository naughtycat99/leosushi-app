// Payment Module
// This file contains payment-related functions

console.log('payment.js loaded');

// Service type variable - expose to window to share with checkout.js
window.selectedServiceType = window.selectedServiceType || 'delivery'; // 'delivery', 'pickup', or 'reservation'
let selectedServiceType = window.selectedServiceType; // Reference to shared variable
let selectedPaymentMethod = null;
// Expose to window for access from script.js
window.selectedPaymentMethod = selectedPaymentMethod;

// Discount code variables
let appliedDiscount = null; // { code: string, discount: number, percentage: number }
window.appliedDiscount = appliedDiscount;

// Tip variables
let selectedTip = null; // { type: 'percent' | 'custom', value: number, amount: number }
window.selectedTip = selectedTip;

// Helper function to get delivery address from form
function getDeliveryAddress() {
  const customerFirstName = document.getElementById('customerFirstName')?.value.trim() || '';
  const customerLastName = document.getElementById('customerLastName')?.value.trim() || '';
  const streetOnly = document.getElementById('deliveryStreet')?.value.trim() || '';
  const houseNumber = document.getElementById('deliveryHouseNumber')?.value.trim() || '';
  const street = streetOnly && houseNumber ? `${streetOnly} ${houseNumber}` : streetOnly;

  const postal = document.getElementById('deliveryPostal')?.value.trim() || '';
  const city = document.getElementById('deliveryCity')?.value.trim() || '';
  const note = document.getElementById('deliveryNote')?.value.trim() || '';
  const customerPhone = document.getElementById('customerPhone')?.value.trim() || '';
  const customerEmail = document.getElementById('customerEmail')?.value.trim() || '';

  return {
    firstName: customerFirstName,
    lastName: customerLastName,
    street: streetOnly,
    houseNumber: houseNumber,
    postal: postal,
    city: city,
    note: note,
    phone: customerPhone,
    email: customerEmail
  };
}

// Auto-fill user info in payment form - ONLY when user is logged in
async function autoFillUserInfo() {
  // Check if user is logged in first
  if (typeof getCurrentUser !== 'function') {
    return false;
  }

  const localUser = getCurrentUser();
  if (!localUser || !localUser.token) {
    // User not logged in - don't auto-fill
    return false;
  }

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
    return false;
  }

  // Fetch fresh data from API
  let user = localUser;
  try {
    if (window.api && window.api.auth && window.api.auth.getCurrentUser) {
      const result = await window.api.auth.getCurrentUser();
      if (result && result.success && result.user) {
        user = {
          firstName: result.user.firstName || localUser.firstName || '',
          lastName: result.user.lastName || localUser.lastName || '',
          email: result.user.email || localUser.email || '',
          phone: result.user.phone || localUser.phone || '',
          street: result.user.street || localUser.street || '',
          postal: result.user.postal || localUser.postal || '',
          city: result.user.city || localUser.city || '',
          note: result.user.note || localUser.note || ''
        };
        // Update localStorage
        localStorage.setItem('leo_user', JSON.stringify({ ...localUser, ...user }));
      }
    }
  } catch (error) {
    // Use localStorage data if API fails
    user = {
      firstName: localUser.firstName || '',
      lastName: localUser.lastName || '',
      email: localUser.email || '',
      phone: localUser.phone || '',
      street: localUser.street || '',
      postal: localUser.postal || '',
      city: localUser.city || '',
      note: localUser.note || ''
    };
  }

  // Fill fields with user info (auto-fill when user is logged in)
  // Always fill if user is logged in, but allow manual editing after
  if (firstNameInput) firstNameInput.value = user.firstName || firstNameInput.value || '';
  if (lastNameInput) lastNameInput.value = user.lastName || lastNameInput.value || '';
  if (emailInput) emailInput.value = user.email || emailInput.value || '';
  if (phoneInput) phoneInput.value = user.phone || phoneInput.value || '';
  if (streetInput) streetInput.value = user.street || streetInput.value || '';
  if (postalInput) postalInput.value = user.postal || postalInput.value || '';
  if (cityInput) cityInput.value = user.city || cityInput.value || '';
  if (noteInput) noteInput.value = user.note || noteInput.value || '';

  // Trigger events to notify any listeners
  [firstNameInput, lastNameInput, emailInput, phoneInput, streetInput, postalInput, cityInput, noteInput].forEach(input => {
    if (input && input.value) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  return true;
}

// Don't expose autoFillUserInfo here - let checkout.js handle it to avoid conflicts
// This function is only used internally in payment modal

// Check if delivery address is within 5km radius using GPS
async function checkDeliveryRange(street, postal, city) {
  const RESTAURANT_GPS = { lat: 52.5505, lng: 13.4304 }; // Florastraße 10A, 13187 Berlin
  const MAX_KM = 5;

  if (!street || !postal || !city) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine vollständige Adresse ein.' };
  }

  // Validate postal code format
  if (!/^\d{5}$/.test(postal)) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine gültige 5-stellige PLZ ein.' };
  }

  // Geocode customer address via Photon
  let coords = null;
  try {
    const q = `${street}, ${postal} ${city}, Deutschland`;
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`
    );
    const data = await res.json();
    if (data && data.features && data.features.length > 0) {
      coords = {
        lat: parseFloat(data.features[0].geometry.coordinates[1]),
        lng: parseFloat(data.features[0].geometry.coordinates[0])
      };
    }
  } catch (e) {
    console.error('Geocoding error:', e);
  }

  if (coords) {
    // Haversine distance (km)
    const R = 6371;
    const dLat = (coords.lat - RESTAURANT_GPS.lat) * Math.PI / 180;
    const dLng = (coords.lng - RESTAURANT_GPS.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(RESTAURANT_GPS.lat * Math.PI / 180) * Math.cos(coords.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distStr = distance.toFixed(1);

    if (distance <= MAX_KM) {
      return { withinRange: true, distance: distStr, message: `✓ Lieferung möglich (${distStr} km — kostenlos)` };
    } else {
      return {
        withinRange: false, distance: distStr,
        message: `✗ Lieferung nicht möglich: ${distStr} km entfernt (Maximal ${MAX_KM} km). Bitte wählen Sie „Abholung" oder „Tisch reservieren".`
      };
    }
  }

  // Geocoding failed — strict postal code fallback
  const valid5kmZips = [
    13187, 13189, 13156, 13158, 13127, 13086, 13088, 13089,
    13347, 13359, 13357, 10439, 10437, 10435, 10405, 10407, 13409
  ];
  if (valid5kmZips.includes(parseInt(postal))) {
    return { withinRange: true, distance: null, message: '✓ Lieferung voraussichtlich möglich (PLZ-Prüfung)' };
  }
  return {
    withinRange: false, distance: null,
    message: '✗ Adresse konnte nicht exakt auf der Karte gefunden werden. Bitte überprüfen Sie die Schreibweise von Straße und PLZ.'
  };
}

// Check delivery address and update UI
async function checkAndUpdateDeliveryStatus(street, postal, city) {
  const deliveryStatusEl = document.getElementById('deliveryStatusMessage');

  if (!deliveryStatusEl) {
    // Create status message element if it doesn't exist
    const deliveryAddressSection = document.getElementById('deliveryAddressSection');
    if (deliveryAddressSection) {
      const statusDiv = document.createElement('div');
      statusDiv.id = 'deliveryStatusMessage';
      statusDiv.style.marginTop = '12px';
      statusDiv.style.padding = '12px';
      statusDiv.style.borderRadius = '8px';
      statusDiv.style.fontSize = '14px';
      deliveryAddressSection.appendChild(statusDiv);
    } else {
      return;
    }
  }

  const rangeCheck = await checkDeliveryRange(street, postal, city);
  const statusEl = document.getElementById('deliveryStatusMessage');

  if (statusEl) {
    if (rangeCheck.withinRange) {
      statusEl.innerHTML = `<div style="color: #10b981; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">✓</span>
        <span>${rangeCheck.message}</span>
      </div>`;
      statusEl.style.background = 'rgba(16,185,129,.1)';
      statusEl.style.border = '1px solid rgba(16,185,129,.3)';
    } else {
      statusEl.innerHTML = `<div style="color: #ef4444; display: flex; align-items: flex-start; gap: 8px;">
        <span style="font-size: 18px; margin-top: 2px;">✗</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">${rangeCheck.message}</div>
          <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
            Bitte wählen Sie stattdessen "Tisch reservieren"
          </div>
        </div>
      </div>`;
      statusEl.style.background = 'rgba(239,68,68,.1)';
      statusEl.style.border = '1px solid rgba(239,68,68,.3)';
    }
  }

  // Update payment summary to reflect delivery status
  if (typeof updatePaymentSummary === 'function') {
    updatePaymentSummary();
  }
}

// Get current location using geolocation API
function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation wird von Ihrem Browser nicht unterstützt.');
    return;
  }

  const streetInput = document.getElementById('deliveryStreet');
  const postalInput = document.getElementById('deliveryPostal');
  const cityInput = document.getElementById('deliveryCity');

  if (!streetInput || !postalInput || !cityInput) {
    return;
  }

  // Show loading state
  const originalStreetValue = streetInput.value;
  streetInput.value = 'Position wird ermittelt...';
  streetInput.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Use reverse geocoding to get address
        // Note: In production, use a proper geocoding service like Google Maps Geocoding API
        // For now, we'll use a free service like Nominatim (OpenStreetMap)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
        const data = await response.json();

        if (data && data.address) {
          const address = data.address;

          // Fill in the address fields
          if (address.road) {
            streetInput.value = address.road + (address.house_number ? ' ' + address.house_number : '');
          } else if (address.pedestrian) {
            streetInput.value = address.pedestrian;
          }

          if (address.postcode) {
            postalInput.value = address.postcode;
          }

          if (address.city) {
            cityInput.value = address.city;
          } else if (address.town) {
            cityInput.value = address.town;
          } else if (address.village) {
            cityInput.value = address.village;
          }

          // Check delivery range after filling address
          if (streetInput.value && postalInput.value && cityInput.value) {
            checkAndUpdateDeliveryStatus(streetInput.value, postalInput.value, cityInput.value);
          }
        } else {
          alert('Adresse konnte nicht ermittelt werden. Bitte geben Sie die Adresse manuell ein.');
          streetInput.value = originalStreetValue;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        alert('Fehler beim Ermitteln der Adresse. Bitte geben Sie die Adresse manuell ein.');
        streetInput.value = originalStreetValue;
      } finally {
        streetInput.disabled = false;
      }
    },
    (error) => {
      streetInput.disabled = false;
      streetInput.value = originalStreetValue;

      let errorMessage = 'Fehler beim Ermitteln der Position. ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Berechtigung zur Standortfreigabe wurde verweigert.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Standortinformationen sind nicht verfügbar.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Zeitüberschreitung beim Ermitteln der Position.';
          break;
        default:
          errorMessage += 'Unbekannter Fehler.';
          break;
      }
      alert(errorMessage + ' Bitte geben Sie die Adresse manuell ein.');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Select service type in payment modal
function selectServiceType(type) {
  window.selectedServiceType = type;
  selectedServiceType = type; // Keep local reference in sync

  // Update UI buttons
  document.querySelectorAll('.service-type-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });

  const activeBtn = document.querySelector(`.service-type-btn[data-service="${type}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.borderColor = 'var(--gold)';
    activeBtn.style.background = 'linear-gradient(135deg, rgba(194,163,85,.2), rgba(229,207,142,.1))';
  }

  // Update payment modal UI
  updatePaymentModalServiceType();

  // If delivery is selected, check address if already filled
  if (type === 'delivery') {
    const street = document.getElementById('deliveryStreet')?.value.trim();
    const postal = document.getElementById('deliveryPostal')?.value.trim();
    const city = document.getElementById('deliveryCity')?.value.trim();

    if (street && postal && city) {
      checkAndUpdateDeliveryStatus(street, postal, city);
    }
  }
}

// Set service type (for menu page)
function setServiceType(type) {
  window.selectedServiceType = type;
  selectedServiceType = type; // Keep local reference in sync

  // Update UI
  document.querySelectorAll('.service-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = event?.target?.closest('.service-btn');
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Update delivery fee and table selection visibility
  if (typeof updateServiceTypeUI === 'function') {
    updateServiceTypeUI();
  }
}

// Payment Method Modal Functions
function openPaymentModal() {
  // Redirect to checkout page instead of opening modal
  const isApp = (document.body && document.body.classList.contains('is-capacitor-app')) ||
    window.location.search.includes('app=true') ||
    sessionStorage.getItem('leo_app_preview') === 'true';
  window.location.href = isApp ? 'checkout.html?app=true' : 'checkout.html';
  return;

  console.log('🔍 openPaymentModal called');

  // First, close reservation modal if it's open
  const reservationModal = document.getElementById('reservationModal');
  if (reservationModal && reservationModal.style.display === 'flex') {
    console.log('🔒 Closing reservation modal first...');
    if (typeof window.closeReservationModal === 'function') {
      window.closeReservationModal();
    } else {
      // Fallback: manually close reservation modal
      reservationModal.style.opacity = '0';
      reservationModal.style.visibility = 'hidden';
      const reservationOverlay = document.getElementById('reservationOverlay');
      if (reservationOverlay) {
        reservationOverlay.style.display = 'none';
        reservationOverlay.classList.remove('active');
      }
      setTimeout(() => {
        reservationModal.style.display = 'none';
        reservationModal.style.zIndex = '';
      }, 300);
    }
    // Wait a bit for reservation modal to close
    setTimeout(() => {
      openPaymentModalInternal();
    }, 350);
    return;
  }

  openPaymentModalInternal();
}

function openPaymentModalInternal() {
  const modal = document.getElementById('paymentModal');
  console.log('Modal element:', modal);
  if (!modal) {
    console.error('❌ Payment modal not found! Make sure paymentModal element exists in HTML.');
    alert('Fehler: Zahlungs-Modal wurde nicht gefunden. Bitte laden Sie die Seite neu.');
    return;
  }

  console.log('✅ Opening payment modal...');

  // Ensure reservation modal is completely closed and hidden
  const reservationModal = document.getElementById('reservationModal');
  if (reservationModal) {
    console.log('🔒 Ensuring reservation modal is completely closed...');
    reservationModal.style.display = 'none';
    reservationModal.style.opacity = '0';
    reservationModal.style.visibility = 'hidden';
    reservationModal.style.zIndex = '0';
    reservationModal.style.pointerEvents = 'none';

    const reservationOverlay = document.getElementById('reservationOverlay');
    if (reservationOverlay) {
      reservationOverlay.style.display = 'none';
      reservationOverlay.style.visibility = 'hidden';
      reservationOverlay.style.opacity = '0';
      reservationOverlay.style.zIndex = '0';
      reservationOverlay.style.pointerEvents = 'none';
      reservationOverlay.classList.remove('active');
    }
  }

  // Force a reflow to ensure reservation modal is fully closed
  void document.body.offsetHeight;

  // Reset form
  window.selectedServiceType = 'delivery'; // Default to delivery
  selectedServiceType = 'delivery'; // Keep local reference in sync

  // Reset service type buttons
  document.querySelectorAll('.service-type-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });
  const defaultBtn = document.querySelector('.service-type-btn[data-service="delivery"]');
  if (defaultBtn) {
    defaultBtn.classList.add('active');
    defaultBtn.style.borderColor = 'var(--gold)';
    defaultBtn.style.background = 'linear-gradient(135deg, rgba(194,163,85,.2), rgba(229,207,142,.1))';
  }

  // Set min date for reservation date input
  const reserveDateInput = document.getElementById('reserveDateInPayment');
  if (reserveDateInput) {
    const today = new Date().toISOString().split('T')[0];
    reserveDateInput.setAttribute('min', today);
  }

  // Update payment modal UI
  updatePaymentModalServiceType();

  // Auto-fill from early customer code entry (deprecated - now using autoFillUserInfo)
  // Removed - using autoFillUserInfo instead

  // Disable confirm payment button until customer code is entered and validated
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  if (confirmPaymentBtn) {
    confirmPaymentBtn.disabled = true;
    confirmPaymentBtn.style.opacity = '0.5';
    confirmPaymentBtn.style.cursor = 'not-allowed';
  }

  // Setup customer code validation listener
  setupPaymentCustomerCodeValidation();

  // Reset payment options UI
  const cashOption = document.getElementById('paymentOptionCash');
  const cardOption = document.getElementById('paymentOptionCard');
  const paypalOption = document.getElementById('paymentOptionPayPal');
  if (cashOption) cashOption.classList.remove('selected');
  if (cardOption) cardOption.classList.remove('selected');
  if (paypalOption) paypalOption.classList.remove('selected');

  // Set default payment method to "cash" if not already selected
  if (!selectedPaymentMethod) {
    selectedPaymentMethod = 'cash';
    window.selectedPaymentMethod = 'cash';
    if (cashOption) {
      cashOption.classList.add('selected');
    }
  } else {
    // If already selected, restore the selection
    window.selectedPaymentMethod = selectedPaymentMethod;
    if (selectedPaymentMethod === 'cash' && cashOption) {
      cashOption.classList.add('selected');
    } else if (selectedPaymentMethod === 'card' && cardOption) {
      cardOption.classList.add('selected');
    } else if (selectedPaymentMethod === 'paypal' && paypalOption) {
      paypalOption.classList.add('selected');
    }
  }

  // Reset tip selection
  selectedTip = null;
  window.selectedTip = null;
  document.querySelectorAll('.tip-option').forEach(btn => {
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });
  const customInput = document.querySelector('.tip-custom-input');
  if (customInput) customInput.style.display = 'none';
  const customAmountInput = document.getElementById('customTipAmount');
  if (customAmountInput) customAmountInput.value = '';

  // Update order summary (this will also update tip options)
  if (typeof updatePaymentSummary === 'function') {
    updatePaymentSummary();
  }

  // Hide PayPal button container initially
  const paypalButtonContainer = document.getElementById('paypalButtonContainer');
  if (paypalButtonContainer) {
    paypalButtonContainer.style.display = 'none';
  }

  // Show confirm button initially (reuse the variable declared above)
  if (confirmPaymentBtn) {
    confirmPaymentBtn.style.display = 'block';
  }

  // Show modal
  modal.style.display = 'flex';
  modal.style.opacity = '0';
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    modal.style.opacity = '1';

    // Auto-fill user info - call multiple times to ensure it works
    const fillInfo = async () => {
      if (typeof autoFillUserInfo === 'function') {
        await autoFillUserInfo();
      }
      // Also try autoFillFromEarlyEntry if available
      if (typeof window.autoFillFromEarlyEntry === 'function') {
        window.autoFillFromEarlyEntry();
      }
      // Also try loadCustomerInfo if available (from customer.js)
      if (typeof window.loadCustomerInfo === 'function') {
        const emailInput = document.getElementById('customerEmail');
        const phoneInput = document.getElementById('customerPhone');
        if (emailInput && emailInput.value) {
          const customerInfo = await window.loadCustomerInfo(emailInput.value, null, null);
          if (customerInfo && typeof window.autoFillCustomerInfo === 'function') {
            window.autoFillCustomerInfo(customerInfo);
          }
        } else if (phoneInput && phoneInput.value) {
          const customerInfo = await window.loadCustomerInfo(null, phoneInput.value, null);
          if (customerInfo && typeof window.autoFillCustomerInfo === 'function') {
            window.autoFillCustomerInfo(customerInfo);
          }
        }
      }
    };

    // Try immediately after modal is visible
    setTimeout(fillInfo, 200);

    // Try again after longer delay
    setTimeout(fillInfo, 600);

    // Try one more time
    setTimeout(fillInfo, 1200);
  }, 10);

  // Also use MutationObserver to catch when modal becomes fully visible
  const observer = new MutationObserver((mutations) => {
    const isVisible = modal.style.display === 'flex' &&
      (modal.style.opacity === '1' || parseFloat(modal.style.opacity) > 0);
    if (isVisible && typeof autoFillUserInfo === 'function') {
      setTimeout(async () => {
        await autoFillUserInfo();
      }, 100);
    }
  });

  observer.observe(modal, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    childList: false,
    subtree: false
  });

  // Disconnect observer after 3 seconds
  setTimeout(() => {
    observer.disconnect();
  }, 3000);

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closePaymentModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (!modal) return;

  console.log('🔒 Closing payment modal...');

  modal.style.opacity = '0';
  modal.style.visibility = 'hidden';
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.zIndex = '';
    console.log('✅ Payment modal closed');

    // Ensure cart can be opened again after closing modal
    // Reset any styles that might prevent cart from opening
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
      cartToggle.style.pointerEvents = 'auto';
      cartToggle.style.zIndex = '';
    }

    // Also ensure cart sidebar can be opened
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
      cartSidebar.style.pointerEvents = 'auto';
    }
  }, 300);
}

// Update payment modal based on service type
function updatePaymentModalServiceType() {
  const deliveryAddressSection = document.getElementById('deliveryAddressSection');
  const reservationDetailsSection = document.getElementById('reservationDetailsSection');
  const orderTableStatusSection = document.getElementById('orderTableStatusSection');
  const reservationTableSelectionSection = document.getElementById('reservationTableSelectionSection');
  const deliveryStreet = document.getElementById('deliveryStreet');
  const deliveryPostal = document.getElementById('deliveryPostal');
  const deliveryCity = document.getElementById('deliveryCity');
  const deliveryFeeEl = document.getElementById('paymentDelivery');

  if (selectedServiceType === 'reservation') {
    // Reservation - show reservation form, hide delivery address
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'none';
    if (reservationDetailsSection) reservationDetailsSection.style.display = 'block';
    if (orderTableStatusSection) orderTableStatusSection.style.display = 'none';

    // Hide scheduled delivery time for reservation
    const scheduledDeliveryTimeGroup = document.getElementById('scheduledDeliveryTimeGroup');
    if (scheduledDeliveryTimeGroup) {
      scheduledDeliveryTimeGroup.style.display = 'none';
    }

    // Table selection removed - admin will assign tables manually
    // Setup reservation customer code auto-fill (with delay to ensure field exists)
    setTimeout(() => {
      if (typeof window.setupReservationCustomerCodeAutoFill === 'function') {
        window.setupReservationCustomerCodeAutoFill();
      }
    }, 100);

    // No delivery fee for reservation
    if (deliveryFeeEl && typeof window.formatPrice === 'function') {
      deliveryFeeEl.textContent = window.formatPrice(0);
    } else if (deliveryFeeEl) {
      deliveryFeeEl.textContent = '€0,00';
    }
  } else if (selectedServiceType === 'pickup') {
    // Pickup - hide delivery address (match checkout.js logic)
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'none';
    if (reservationDetailsSection) reservationDetailsSection.style.display = 'none';
    if (orderTableStatusSection) orderTableStatusSection.style.display = 'block';

    // Hide scheduled delivery time for pickup
    const scheduledDeliveryTimeGroup = document.getElementById('scheduledDeliveryTimeGroup');
    if (scheduledDeliveryTimeGroup) {
      scheduledDeliveryTimeGroup.style.display = 'none';
    }

    // Make address fields optional
    if (deliveryStreet) deliveryStreet.removeAttribute('required');
    if (deliveryPostal) deliveryPostal.removeAttribute('required');
    if (deliveryCity) deliveryCity.removeAttribute('required');

    // Update table status
    if (typeof window.updateTableStatus === 'function') {
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().slice(0, 5);
      window.updateTableStatus(date, time);
    }

    // No delivery fee
    if (deliveryFeeEl && typeof window.formatPrice === 'function') {
      deliveryFeeEl.textContent = window.formatPrice(0);
    } else if (deliveryFeeEl) {
      deliveryFeeEl.textContent = '€0,00';
    }
  } else {
    // Delivery - show delivery address, hide reservation
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'block';
    if (reservationDetailsSection) reservationDetailsSection.style.display = 'none';
    if (orderTableStatusSection) orderTableStatusSection.style.display = 'none';

    // Show scheduled delivery time field for delivery
    const scheduledDeliveryTimeGroup = document.getElementById('scheduledDeliveryTimeGroup');
    if (scheduledDeliveryTimeGroup) {
      scheduledDeliveryTimeGroup.style.display = 'block';
      // Initialize date and time inputs
      const scheduledDate = document.getElementById('scheduledDeliveryDate');
      const scheduledTime = document.getElementById('scheduledDeliveryTime');
      if (scheduledDate && !scheduledDate.value) {
        const today = new Date();
        scheduledDate.value = today.toISOString().split('T')[0];
        scheduledDate.setAttribute('min', today.toISOString().split('T')[0]);
      }
      // We do NOT set a default value automatically! 
      // It should remain empty so that orders default to ASAP.
      // Setup validation
      setupScheduledDeliveryTimeValidation();
    }

    // Make address fields required
    if (deliveryStreet) deliveryStreet.setAttribute('required', 'required');
    if (deliveryPostal) deliveryPostal.setAttribute('required', 'required');
    if (deliveryCity) deliveryCity.setAttribute('required', 'required');

    // Add event listeners to check delivery range when address changes
    if (deliveryStreet) {
      deliveryStreet.removeEventListener('blur', handleAddressChange);
      deliveryStreet.addEventListener('blur', handleAddressChange);
    }
    if (deliveryPostal) {
      deliveryPostal.removeEventListener('blur', handleAddressChange);
      deliveryPostal.addEventListener('blur', handleAddressChange);
    }
    if (deliveryCity) {
      deliveryCity.removeEventListener('blur', handleAddressChange);
      deliveryCity.addEventListener('blur', handleAddressChange);
    }

    // Delivery fee (free within 5km)
    if (deliveryFeeEl && typeof window.formatPrice === 'function') {
      deliveryFeeEl.textContent = window.formatPrice(0);
    } else if (deliveryFeeEl) {
      deliveryFeeEl.textContent = '€0,00';
    }
  }

  // Hide scheduled delivery time for non-delivery service types
  if (selectedServiceType !== 'delivery') {
    const scheduledDeliveryTimeGroup = document.getElementById('scheduledDeliveryTimeGroup');
    if (scheduledDeliveryTimeGroup) {
      scheduledDeliveryTimeGroup.style.display = 'none';
    }
  }

  // Helper function for address change
  function handleAddressChange() {
    const street = document.getElementById('deliveryStreet')?.value.trim();
    const postal = document.getElementById('deliveryPostal')?.value.trim();
    const city = document.getElementById('deliveryCity')?.value.trim();

    if (street && postal && city) {
      checkAndUpdateDeliveryStatus(street, postal, city);
    }
  }

  // Update total
  if (typeof updatePaymentSummary === 'function') {
    updatePaymentSummary();
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

    // Validate that the scheduled time is in the future
    const now = new Date();
    const scheduledDateTime = new Date(`${date}T${time}`);
    const minDateTime = new Date(now.getTime()); // from now

    if (scheduledDateTime < minDateTime) {
      errorDiv.style.display = 'block';
      const minTimeStr = minDateTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      errorDiv.textContent = `Die gewünschte Lieferzeit muss in der Zukunft liegen (frühestens ${minTimeStr}).`;
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

// Get scheduled delivery time from form
function getScheduledDeliveryTime() {
  const scheduledDate = document.getElementById('scheduledDeliveryDate')?.value;
  const scheduledTime = document.getElementById('scheduledDeliveryTime')?.value;

  if (scheduledDate && scheduledTime) {
    return {
      date: scheduledDate,
      time: scheduledTime,
      datetime: `${scheduledDate}T${scheduledTime}`
    };
  }

  return null;
}

// Setup table selection listeners for reservation in payment modal
function setupReservationTableSelectionListeners() {
  const dateInput = document.getElementById('reserveDateInPayment');
  const timeInput = document.getElementById('reserveTimeInPayment');
  const container = document.getElementById('reservationTableSelectionContainer');
  const section = document.getElementById('reservationTableSelectionSection');

  if (!dateInput || !timeInput || !container) return;

  const updateTableSelection = () => {
    const date = dateInput.value;
    const time = timeInput.value;

    if (date && time) {
      if (typeof window.renderTableSelection === 'function') {
        window.renderTableSelection(date, time, 'reservationTableSelectionContainer');
      }
      if (section) section.style.display = 'block';
    } else {
      if (section) section.style.display = 'none';
    }
  };

  // Remove old listeners
  dateInput.removeEventListener('change', updateTableSelection);
  timeInput.removeEventListener('change', updateTableSelection);

  // Add new listeners
  dateInput.addEventListener('change', updateTableSelection);
  timeInput.addEventListener('change', updateTableSelection);

  // Initial check
  updateTableSelection();
}

function selectPaymentOption(method) {
  console.log('🔄 [selectPaymentOption] Called with method:', method);
  window.selectedPaymentMethod = method;
  selectedPaymentMethod = window.selectedPaymentMethod; // Keep local reference in sync

  // Update UI
  const cashOption = document.getElementById('paymentOptionCash');
  const cardOption = document.getElementById('paymentOptionCard');
  const paypalOption = document.getElementById('paymentOptionPayPal');
  const stripeOption = document.getElementById('paymentOptionStripe');
  const paypalButtonContainer = document.getElementById('paypalButtonContainer');
  const stripePaymentContainer = document.getElementById('stripePaymentContainer');

  // Support both modal (confirmPaymentBtn) and checkout page (confirmCheckoutBtn)
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const confirmCheckoutBtn = document.getElementById('confirmCheckoutBtn');

  if (cashOption) cashOption.classList.remove('selected');
  if (cardOption) cardOption.classList.remove('selected');
  if (paypalOption) paypalOption.classList.remove('selected');
  if (stripeOption) stripeOption.classList.remove('selected');

  // Hide PayPal button container by default
  if (paypalButtonContainer) {
    paypalButtonContainer.style.display = 'none';
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';
  }

  // Hide Stripe payment container by default
  if (stripePaymentContainer) {
    stripePaymentContainer.style.display = 'none';
  }

  if (method === 'paypal' || method === 'stripe') {
    // Ẩn nút đặt hàng thường - chỉ cho phép đặt qua PayPal / Stripe submit button
    if (confirmPaymentBtn) {
      confirmPaymentBtn.style.display = 'none';
    }
    if (confirmCheckoutBtn) {
      confirmCheckoutBtn.style.display = 'none';
    }
    window._paypalPaymentCompleted = false;
  } else {
    // Hiện lại nút đặt hàng cho cash/card
    if (confirmPaymentBtn) {
      confirmPaymentBtn.style.display = 'block';
    }
    if (confirmCheckoutBtn) {
      confirmCheckoutBtn.style.display = 'block';
    }
    window._paypalPaymentCompleted = false;
  }

  if (method === 'cash' && cashOption) {
    cashOption.classList.add('selected');
  } else if (method === 'card' && cardOption) {
    cardOption.classList.add('selected');
  } else if (method === 'paypal' && paypalOption) {
    console.log('💳 [selectPaymentOption] PayPal selected');
    paypalOption.classList.add('selected');
    if (paypalButtonContainer) {
      paypalButtonContainer.style.display = 'block';
      if (typeof renderPayPalButton === 'function') {
        renderPayPalButton();
      } else {
        console.error('❌ [selectPaymentOption] renderPayPalButton function not found!');
      }
    } else {
      console.error('❌ [selectPaymentOption] paypalButtonContainer not found!');
    }
  } else if (method === 'stripe' && stripeOption) {
    console.log('⚡ [selectPaymentOption] Stripe (Apple Pay/Google Pay/Card) selected');
    stripeOption.classList.add('selected');
    if (stripePaymentContainer) {
      stripePaymentContainer.style.display = 'block';
      if (typeof initStripePaymentElement === 'function') {
        initStripePaymentElement();
      }
    }
  }
}

window.selectPaymentOption = selectPaymentOption;

// ==========================================
// 💳 STRIPE PAYMENT INTEGRATION (Apple Pay, Google Pay, Credit/Debit Card)
// ==========================================

function getCheckoutTotalAmount() {
  // 1. First priority: Check the actual calculated total text on the checkout page (e.g. "16,11 €")
  const totalEl = document.getElementById('summaryTotal');
  if (totalEl && totalEl.textContent) {
    const text = totalEl.textContent.trim();
    const match = text.match(/[\d.,]+/);
    if (match) {
      const numStr = match[0].replace(/\./g, '').replace(',', '.');
      const val = parseFloat(numStr);
      if (!isNaN(val) && val > 0) {
        return val;
      }
    }
  }

  // 2. Fallback: Parse from localStorage leoCart
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('leoCart') || '[]');
  } catch(e) { cart = []; }

  let subtotal = 0;
  cart.forEach(item => {
    const qty = parseInt(item.qty || item.quantity || 1) || 1;
    let price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
    subtotal += (price * qty);
  });

  let autoDiscount = subtotal > 15 ? (subtotal * 0.10) : 0;
  let couponDiscount = 0;
  if (window.appliedDiscount) {
    const after = subtotal - autoDiscount;
    couponDiscount = (window.appliedDiscount.percentage > 0) ? (after * window.appliedDiscount.percentage / 100) : (parseFloat(window.appliedDiscount.discount) || 0);
  }

  let tip = 0;
  if (window.selectedTip && window.selectedTip.amount) {
    tip = parseFloat(window.selectedTip.amount) || 0;
  }

  return Math.max(0, subtotal - autoDiscount - couponDiscount + tip);
}

let _stripeObj = null;
let _stripeElements = null;
let _stripePaymentElement = null;
let _currentStripeClientSecret = null;
let _isStripeInitializing = false;
let _mountedStripeTotal = 0;

function getStripeCartSnapshot() {
  if (typeof window.getCart === 'function') return window.getCart() || [];
  if (Array.isArray(window.cart)) return window.cart;
  try { return JSON.parse(localStorage.getItem('leoCart') || '[]'); } catch (e) { return []; }
}

function getExplicitStripeBranch() {
  const rawBranch = localStorage.getItem('leoSelectedBranch');
  const legacyBranch = localStorage.getItem('selected_branch');
  if (!rawBranch && !['flora', 'haupt'].includes(legacyBranch)) return null;
  const branch = typeof window.getSelectedBranch === 'function' ? window.getSelectedBranch() : null;
  if (!branch || !['branch_flora', 'branch_haupt'].includes(branch.id)) return null;
  return branch;
}

function buildStripeOrderDraft(orderId, paymentIntentId = null) {
  const addr = getDeliveryAddress();
  const cartItems = getStripeCartSnapshot();
  const branch = getExplicitStripeBranch();
  const svcType = window.selectedServiceType || (typeof selectedServiceType !== 'undefined' ? selectedServiceType : '') || 'delivery';
  const total = getCheckoutTotalAmount();
  const subtotal = typeof window.getTotal === 'function' ? window.getTotal() : total;

  if (!branch) throw new Error('Bitte wählen Sie zuerst eine Filiale aus.');
  if (!Array.isArray(cartItems) || cartItems.length === 0) throw new Error('Ihr Warenkorb ist leer.');
  const cartBranchId = localStorage.getItem('leoCartBranchId') || cartItems.find(item => item.branchId)?.branchId || branch.id;
  if (cartBranchId !== branch.id || cartItems.some(item => item.branchId && item.branchId !== branch.id)) {
    throw new Error('Der Warenkorb gehört zu einer anderen Filiale. Bitte wählen Sie die Gerichte für die aktuelle Filiale erneut aus.');
  }

  let autoDiscount = subtotal > 15 ? (subtotal * 10 / 100) : 0;
  let discountCode = null;
  if (window.appliedDiscount) discountCode = window.appliedDiscount.code || null;
  let tipAmount = window.selectedTip ? (window.selectedTip.amount || 0) : 0;

  return {
    order_id: orderId,
    branch,
    branch_id: branch.id,
    cart_branch_id: cartBranchId,
    items: cartItems.map(item => ({
      item_id: item.item_id || item.menuItemId || item.id || null,
      name: item.name,
      quantity: item.qty || item.quantity || 1,
      branch_id: item.branchId || branch.id,
      total: item.total || (((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2) + ' €')
    })),
    service_type: svcType === 'pickup' ? 'pickup' : (svcType === 'dinein' ? 'dinein' : 'delivery'),
    payment_method: 'Stripe (Apple Pay/Karte/Klarna)',
    payment_status: 'pending',
    order_total: total.toFixed(2) + ' €',
    subtotal,
    customer: {
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      email: addr.email || '',
      phone: addr.phone || '',
      street: addr.street || '',
      houseNumber: addr.houseNumber || '',
      postal: addr.postal || '',
      city: addr.city || '',
      note: addr.note || ''
    },
    discount_code: discountCode,
    promotion_id: window.appliedDiscount ? window.appliedDiscount.promotion_id : null,
    automatic_discount: autoDiscount > 0 ? { percentage: 10, amount: autoDiscount.toFixed(2) + ' €' } : null,
    tip: tipAmount > 0 ? tipAmount.toFixed(2) + ' €' : null,
    scheduled_delivery_time: (window.getScheduledDeliveryTime && window.getScheduledDeliveryTime()) || null,
    delivery_distance_km: svcType === 'delivery' ? (window.selectedDeliveryDistanceKm || null) : null,
    payment_intent_id: paymentIntentId
  };
}

function cleanStripeReturnUrl() {
  const url = new URL(window.location.href);
  ['payment_intent', 'payment_intent_client_secret', 'redirect_status'].forEach(key => url.searchParams.delete(key));
  return url.toString();
}

async function initStripePaymentElement() {
  console.log('💳 [Stripe] Initializing Payment Element...');
  const container = document.getElementById('stripePaymentContainer');
  const elementDiv = document.getElementById('stripe-payment-element');
  const amountSpan = document.getElementById('stripePayAmount');
  const errorDiv = document.getElementById('stripe-error-message');
  const payBtn = document.getElementById('stripePayBtn');

  if (!container || !elementDiv) return;
  if (errorDiv) { errorDiv.style.display = 'none'; errorDiv.textContent = ''; }

  if (typeof Stripe === 'undefined') {
    console.error('❌ Stripe.js SDK not loaded!');
    elementDiv.innerHTML = '<p style="color: #ef4444; padding: 10px;">Stripe SDK konnte nicht geladen werden. Bitte Seite neu laden.</p>';
    return;
  }

  const total = getCheckoutTotalAmount();
  console.log('💰 [Stripe] Exact total amount to charge:', total);

  if (amountSpan) {
    amountSpan.textContent = total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }

  if (total <= 0) {
    if (_stripePaymentElement) {
      try { _stripePaymentElement.destroy(); } catch (e) {}
      _stripePaymentElement = null;
    }
    elementDiv.innerHTML = '<p style="color: #e5cf8e; padding: 15px; text-align: center; background: rgba(229,207,142,0.08); border-radius: 8px; border: 1px dashed rgba(229,207,142,0.3);">🛒 Ihr Warenkorb ist leer (0,00 €). Bitte wählen Sie zuerst Speisen auf der <a href="menu.html" style="color: #e5cf8e; text-decoration: underline; font-weight: bold;">Speisekarte</a> aus.</p>';
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.style.opacity = '0.5';
      payBtn.style.cursor = 'not-allowed';
    }
    return;
  }

  // If already mounted with the exact same total and valid element, do not re-create
  if (_stripePaymentElement && _mountedStripeTotal === total && _stripeElements) {
    console.log('⚡ [Stripe] Element already mounted for current total, reusing.');
    return;
  }

  // If initializing right now, wait
  if (_isStripeInitializing) return;
  _isStripeInitializing = true;

  // Cleanly destroy existing element if any
  if (_stripePaymentElement) {
    try {
      _stripePaymentElement.destroy();
    } catch (e) {
      console.warn('Error destroying old stripe element:', e);
    }
    _stripePaymentElement = null;
  }

  // Show loading indicator
  elementDiv.innerHTML = `
    <div id="stripeLoadingIndicator" style="color: rgba(255,255,255,0.6); font-size: 14px; text-align: center; padding: 30px 0;">
        <div style="display: inline-block; width: 28px; height: 28px; border: 3px solid rgba(229,207,142,0.3); border-top-color: #e5cf8e; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 10px;"></div>
        <div>Zahlungsformular wird sicher geladen...</div>
    </div>
  `;

  try {
    const publishableKey = (window.STRIPE_CONFIG && window.STRIPE_CONFIG.PUBLISHABLE_KEY) || 'pk_live_51U4LumD62AOvzFwzgvQfwbAZAAbXXeWK5zu5yWYbMl5qLrIo9DY5pWdPuVXM8AWX98XXvHzNci1P2duYmWI1eWD100MPWiUQUs';
    if (!_stripeObj) {
      _stripeObj = Stripe(publishableKey);
    }

    const addr = getDeliveryAddress();
    const draftOrderId = 'LEO-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const initialOrderDraft = buildStripeOrderDraft(draftOrderId, null);
    const apiUrl = (window.API_BASE_URL || '/api') + '/create-payment-intent.php';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        customer_email: addr.email || '',
        customer_name: `${addr.firstName} ${addr.lastName}`.trim(),
        customer_phone: addr.phone || '',
        order_id: draftOrderId,
        branch_id: initialOrderDraft.branch_id,
        service_type: initialOrderDraft.service_type,
        order_data: initialOrderDraft
      })
    });

    const data = await response.json();
    if (!data.success || !data.clientSecret) {
      throw new Error(data.message || 'Fehler beim Erstellen der Zahlung');
    }

    _currentStripeClientSecret = data.clientSecret;
    window._currentStripePaymentIntentId = data.paymentIntentId;
    window._currentStripeDraftOrderId = data.orderId || draftOrderId;

    _stripeElements = _stripeObj.elements({
      clientSecret: _currentStripeClientSecret,
      locale: 'de',
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#e5cf8e',
          colorBackground: '#1f1f1f',
          colorText: '#ffffff',
          colorDanger: '#ff6b6b',
          borderRadius: '8px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      }
    });

    // Clear loading indicator right before mounting
    elementDiv.innerHTML = '';

    _stripePaymentElement = _stripeElements.create('payment', {
      layout: 'tabs',
      wallets: {
        applePay: 'auto',
        googlePay: 'auto',
        link: 'auto'
      },
      fields: {
        billingDetails: {
          address: {
            country: 'auto'
          }
        }
      }
    });

    _stripePaymentElement.on('ready', () => {
      console.log('🎉 [Stripe] Payment Element is READY and rendered!');
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.style.opacity = '1';
        payBtn.style.cursor = 'pointer';
      }
    });

    _stripePaymentElement.on('loaderror', (event) => {
      console.error('❌ [Stripe] Element load error:', event);
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = event.error?.message || 'Zahlungsformular konnte nicht geladen werden.';
      }
    });

    _stripePaymentElement.mount('#stripe-payment-element');
    _mountedStripeTotal = total;
    console.log('✅ [Stripe] Payment Element mounted successfully for €' + total);
  } catch (err) {
    console.error('❌ [Stripe] Error initializing:', err);
    elementDiv.innerHTML = `<p style="color: #ef4444; padding: 15px; text-align: center;">Fehler: ${err.message || 'Verbindung zu Stripe fehlgeschlagen.'}</p>`;
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.style.opacity = '0.5';
      payBtn.style.cursor = 'not-allowed';
    }
  } finally {
    _isStripeInitializing = false;
  }
}

async function handleStripePaymentSubmit() {
  console.log('💳 [Stripe] Submitting payment...');
  const payBtn = document.getElementById('stripePayBtn');
  const errorDiv = document.getElementById('stripe-error-message');
  if (errorDiv) { errorDiv.style.display = 'none'; errorDiv.textContent = ''; }

  // Validate form fields
  const addr = getDeliveryAddress();
  const missing = [];
  if (!addr.email) missing.push('E-Mail-Adresse');
  if (!addr.firstName) missing.push('Vorname');
  if (!addr.lastName) missing.push('Nachname');
  if (!addr.phone) missing.push('Telefonnummer');

  const svcType = window.selectedServiceType || (typeof selectedServiceType !== 'undefined' ? selectedServiceType : 'delivery');
  if (svcType === 'delivery') {
    if (!addr.street) missing.push('Straße');
    if (!addr.postal) missing.push('PLZ');
    if (!addr.city) missing.push('Stadt');
  }

  if (missing.length > 0) {
    alert('Bitte füllen Sie folgende Felder aus, bevor Sie bezahlen:\n\n• ' + missing.join('\n• '));
    const firstEmptyId = !addr.firstName ? 'customerFirstName' :
      !addr.lastName ? 'customerLastName' :
        !addr.email ? 'customerEmail' :
          !addr.phone ? 'customerPhone' :
            !addr.street ? 'deliveryStreet' :
              !addr.postal ? 'deliveryPostal' : 'deliveryCity';
    const el = document.getElementById(firstEmptyId);
    if (el) { el.focus(); el.style.borderColor = '#ef4444'; setTimeout(() => el.style.borderColor = '', 3000); }
    return;
  }

  if (!_stripeObj || !_stripeElements || !_stripePaymentElement) {
    alert('Zahlungsformular wird noch geladen. Bitte einen Moment warten.');
    initStripePaymentElement();
    return;
  }

  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = '⏳ Zahlung wird sicher verarbeitet...';
  }

  const total = getCheckoutTotalAmount();
  const cartSnapshot = getStripeCartSnapshot();
  let prebuiltOrderData;
  try {
    prebuiltOrderData = buildStripeOrderDraft(
      window._currentStripeDraftOrderId || ('LEO-' + Date.now()),
      window._currentStripePaymentIntentId || null
    );
  } catch (draftError) {
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = draftError.message;
    }
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = '💳 Jetzt bezahlen (' + (document.getElementById('stripePayAmount')?.textContent || '€0,00') + ')';
    }
    return;
  }

  // Log to server activity.log
  if (typeof window.logActivity === 'function') {
    window.logActivity('stripe_submit', 'Khách xác nhận thanh toán Stripe/Klarna/Thẻ', {
      name: `${addr.firstName} ${addr.lastName}`.trim(),
      phone: addr.phone || 'N/A',
      email: addr.email || 'N/A'
    }, total.toFixed(2) + ' €', 'stripe', cartSnapshot);
  }

  // 1. Save to localStorage and sessionStorage before potential redirect
  try {
    const serialized = JSON.stringify(prebuiltOrderData);
    localStorage.setItem('leo_pending_stripe_order', serialized);
    sessionStorage.setItem('leo_pending_stripe_order', serialized);
  } catch (e) {
    console.warn('Could not store pending stripe order to storage:', e);
  }

  // 2. Persist the final snapshot and WAIT for server acknowledgement before
  // Stripe is allowed to redirect to Klarna/3D Secure.
  try {
    if (!window._currentStripePaymentIntentId) throw new Error('PaymentIntent fehlt.');
    const draftResponse = await fetch((window.API_BASE_URL || '/api') + '/create-payment-intent.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_intent_id: window._currentStripePaymentIntentId,
        order_data: prebuiltOrderData
      })
    });
    const draftResult = await draftResponse.json();
    if (!draftResponse.ok || !draftResult.success || !draftResult.updated) {
      throw new Error(draftResult.message || 'Die Bestellung konnte nicht sicher gespeichert werden.');
    }
  } catch (draftSaveError) {
    console.error('❌ [Stripe] Durable draft save failed:', draftSaveError);
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = 'Die Bestellung konnte nicht sicher gespeichert werden. Es wurde nichts abgebucht. Bitte versuchen Sie es erneut.';
    }
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = '💳 Jetzt bezahlen (' + (document.getElementById('stripePayAmount')?.textContent || '€0,00') + ')';
    }
    return;
  }

  try {
    const { error, paymentIntent } = await _stripeObj.confirmPayment({
      elements: _stripeElements,
      confirmParams: {
        return_url: cleanStripeReturnUrl(),
        receipt_email: addr.email || undefined
      },
      redirect: 'if_required'
    });

    if (error) {
      console.error('❌ [Stripe] Payment confirmation error:', error);
      if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = error.message || 'Die Zahlung konnte nicht durchgeführt werden.';
      }
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML = '💳 Jetzt bezahlen (' + (document.getElementById('stripePayAmount')?.textContent || '€0,00') + ')';
      }
      return;
    }

    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
      console.log('🎉 [Stripe] Payment SUCCEEDED:', paymentIntent.id);
      
      // Show overlay
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'stripeProcessingOverlay';
      loadingDiv.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 99999; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; font-family: sans-serif;">
              <div style="width: 50px; height: 50px; border: 5px solid #fff; border-top: 5px solid #e5cf8e; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
              <h2 style="margin:0; padding:0; text-align:center;">Zahlung erfolgreich!</h2>
              <p style="font-size: 18px; font-weight: bold; margin-top: 10px; color: #e5cf8e; text-align:center;">Ihre Bestellung wird gespeichert. Bitte warten...</p>
              <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
          </div>
      `;
      document.body.appendChild(loadingDiv);

      await processSuccessfulStripeOrder(paymentIntent, prebuiltOrderData);
    }
  } catch (err) {
    console.error('❌ [Stripe] Exception during payment:', err);
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = err.message || 'Unerwarteter Fehler bei der Zahlung.';
    }
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = '💳 Jetzt bezahlen (' + (document.getElementById('stripePayAmount')?.textContent || '€0,00') + ')';
    }
  }
}

async function processSuccessfulStripeOrder(paymentIntent, injectedOrderData = null) {
  try {
    let restoredData = injectedOrderData;
    if (!restoredData) {
      try {
        const cached = localStorage.getItem('leo_pending_stripe_order') || sessionStorage.getItem('leo_pending_stripe_order');
        if (cached) restoredData = JSON.parse(cached);
      } catch (e) {}
    }

    const deliveryAddress = restoredData?.customer || getDeliveryAddress();
    let orderId = restoredData?.order_id || ('LEO-' + Date.now());

    let customerCode = null;
    let user = null;
    if (typeof getCurrentUser === 'function') {
      user = getCurrentUser();
      if (user) customerCode = user.customerCode || null;
    }

    const total = restoredData?.order_total ? parseFloat(restoredData.order_total.replace('€', '').replace(',', '.').trim()) : getCheckoutTotalAmount();
    const cart = restoredData?.items ? restoredData.items : getStripeCartSnapshot();
    const branch = restoredData?.branch || (typeof window.getSelectedBranch === 'function' ? window.getSelectedBranch() : null);

    const subtotal = restoredData?.subtotal || (typeof window.getTotal === 'function' ? window.getTotal() : total);
    let autoDiscount = subtotal > 15 ? (subtotal * 10 / 100) : 0;
    let couponDiscount = 0;
    let discountCode = restoredData?.discount_code || null;
    if (window.appliedDiscount) {
      const afterAuto = subtotal - autoDiscount;
      couponDiscount = window.appliedDiscount.percentage > 0 ? (afterAuto * window.appliedDiscount.percentage / 100) : (window.appliedDiscount.discount || 0);
      discountCode = window.appliedDiscount.code || null;
    }

    let tipAmount = 0;
    if (window.selectedTip) tipAmount = window.selectedTip.amount || 0;

    const svcType = restoredData?.service_type || window.selectedServiceType || (typeof selectedServiceType !== 'undefined' ? selectedServiceType : 'delivery');

    const formattedItems = cart.map(item => ({
      name: item.name,
      quantity: item.qty || item.quantity || 1,
      total: item.total || (((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2) + ' €')
    }));

    // Finalise server-side. The server independently retrieves the
    // PaymentIntent from Stripe and returns the canonical database order id.
    const finalizeResponse = await fetch((window.API_BASE_URL || '/api') + '/finalize-stripe-order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_intent_id: paymentIntent.id })
    });
    const apiResult = await finalizeResponse.json();
    if (finalizeResponse.status === 202 && apiResult.processing) {
      if (document.getElementById('stripeProcessingOverlay')) document.getElementById('stripeProcessingOverlay').remove();
      alert('Ihre Zahlung wird noch von Stripe verarbeitet. Bitte bezahlen Sie nicht erneut. Sobald sie bestätigt ist, wird Ihre Bestellung automatisch an das Restaurant gesendet.');
      return false;
    }
    if (!finalizeResponse.ok || !apiResult.success || !apiResult.order_id) {
      throw new Error(apiResult.message || 'Die bezahlte Bestellung konnte noch nicht bestätigt werden.');
    }
    orderId = apiResult.order_id;

    if (typeof window.rememberLeoOrder === 'function') {
      window.rememberLeoOrder({ ...(restoredData || {}), items: formattedItems, payment_status: 'paid', status: 'pending' }, orderId);
    }

    // Clean up stored pending order
    try {
      localStorage.removeItem('leo_pending_stripe_order');
      sessionStorage.removeItem('leo_pending_stripe_order');
    } catch (e) {}

    // Save customer info to localStorage
    try {
      const customerKey = (deliveryAddress.email || '').toLowerCase().trim();
      const customerInfo = {
        firstName: deliveryAddress.firstName || deliveryAddress.first_name || '',
        lastName: deliveryAddress.lastName || deliveryAddress.last_name || '',
        email: deliveryAddress.email || '',
        phone: deliveryAddress.phone || '',
        street: deliveryAddress.street || '',
        houseNumber: deliveryAddress.houseNumber || deliveryAddress.house_number || '',
        postal: deliveryAddress.postal || '',
        city: deliveryAddress.city || '',
        note: deliveryAddress.note || '',
        customerCode: apiResult?.customer_code || null
      };
      if (customerKey) {
        const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
        savedCustomers[customerKey] = customerInfo;
        localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
      }
      localStorage.setItem('leo_last_customer_info', JSON.stringify(customerInfo));
      localStorage.setItem('leo_checkout_customer', JSON.stringify(customerInfo));
    } catch (e) {
      console.error('Error saving customer info to localStorage:', e);
    }

    // Save recent order
    const recentOrders = JSON.parse(localStorage.getItem('leoRecentOrders') || '[]');
    if (orderId && !recentOrders.includes(orderId)) {
      recentOrders.unshift(orderId);
      if (recentOrders.length > 10) recentOrders.pop();
      localStorage.setItem('leoRecentOrders', JSON.stringify(recentOrders));
    }

    // Clear cart
    try {
      localStorage.removeItem('leoCart');
      localStorage.removeItem('cart');
      localStorage.setItem('leoCart', '[]');
      localStorage.setItem('cart', '[]');
      if (typeof window.clearAppCart === 'function') window.clearAppCart();
      if (typeof window.clearCart === 'function') window.clearCart();
      if (typeof window.cart !== 'undefined') window.cart = [];
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('cart:updated'));
    } catch (e) {
      console.error('Error clearing cart:', e);
    }

    if (document.getElementById('stripeProcessingOverlay')) {
      document.getElementById('stripeProcessingOverlay').remove();
    }

    const orderData = {
      summary: {
        item_count: formattedItems.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0),
        total: typeof total === 'number' ? total.toFixed(2) : total
      }
    };

    showOrderSuccessNotification(orderData, deliveryAddress, orderId);
  } catch (e) {
    console.error('Error processing successful Stripe order:', e);
    if (document.getElementById('stripeProcessingOverlay')) {
      document.getElementById('stripeProcessingOverlay').remove();
    }
    const paymentId = paymentIntent && paymentIntent.id ? paymentIntent.id : '';
    alert('Die Zahlung war erfolgreich, aber die Bestellbestätigung ist noch nicht abgeschlossen. Bitte NICHT erneut bezahlen. Das Restaurant prüft die Zahlung automatisch.' + (paymentId ? '\n\nZahlungs-ID: ' + paymentId : ''));
    return false;
  }
}

// Auto-check for 3D secure / Klarna redirect return on page load
async function checkStripeRedirectResult() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientSecret = urlParams.get('payment_intent_client_secret');
  const redirectStatus = urlParams.get('redirect_status');

  if (clientSecret && (redirectStatus === 'succeeded' || redirectStatus === 'processing')) {
    console.log('🔄 [Stripe] Detected redirect payment return URL!');
    const publishableKey = (window.STRIPE_CONFIG && window.STRIPE_CONFIG.PUBLISHABLE_KEY) || 'pk_live_51U4LumD62AOvzFwzgvQfwbAZAAbXXeWK5zu5yWYbMl5qLrIo9DY5pWdPuVXM8AWX98XXvHzNci1P2duYmWI1eWD100MPWiUQUs';
    if (!_stripeObj && typeof Stripe !== 'undefined') {
      _stripeObj = Stripe(publishableKey);
    }
    if (_stripeObj) {
      try {
        const { paymentIntent } = await _stripeObj.retrievePaymentIntent(clientSecret);
        if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
          const cleanUrl = new URL(window.location.href);
          ['payment_intent', 'payment_intent_client_secret', 'redirect_status'].forEach(key => cleanUrl.searchParams.delete(key));
          window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
          await processSuccessfulStripeOrder(paymentIntent);
        }
      } catch (err) {
        console.error('Error retrieving redirect payment intent:', err);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkStripeRedirectResult();
});

window.initStripePaymentElement = initStripePaymentElement;
window.handleStripePaymentSubmit = handleStripePaymentSubmit;


// Apply discount code
async function applyDiscountCode() {
  const discountCodeInput = document.getElementById('discountCode');
  const discountCodeMessage = document.getElementById('discountCodeMessage');
  const applyBtn = document.getElementById('applyDiscountBtn');

  if (!discountCodeInput || !discountCodeMessage) return;

  const code = discountCodeInput.value.trim().toUpperCase();

  if (!code) {
    discountCodeMessage.textContent = 'Bitte geben Sie einen Gutscheincode ein';
    discountCodeMessage.style.color = 'rgba(255,255,255,.6)';
    return;
  }

  // Disable button
  if (applyBtn) {
    applyBtn.disabled = true;
    applyBtn.textContent = 'Wird geprüft...';
  }

  // Validate discount code
  if (typeof validateDiscountCode === 'function') {
    const result = await validateDiscountCode(code);

    if (result.valid) {
      // Apply discount
      appliedDiscount = {
        code: code,
        discount: result.discount || 10,
        percentage: result.discount || 10
      };
      window.appliedDiscount = appliedDiscount;

      discountCodeMessage.textContent = result.message || 'Gutscheincode erfolgreich angewendet!';
      discountCodeMessage.style.color = '#10b981';

      // Update payment summary
      updatePaymentSummary();
    } else {
      appliedDiscount = null;
      window.appliedDiscount = null;

      discountCodeMessage.textContent = result.message || 'Ungültiger Gutscheincode';
      discountCodeMessage.style.color = '#ef4444';

      // Update payment summary
      updatePaymentSummary();
    }
  } else {
    discountCodeMessage.textContent = 'Fehler: Validierungsfunktion nicht verfügbar';
    discountCodeMessage.style.color = '#ef4444';
  }

  // Re-enable button
  if (applyBtn) {
    applyBtn.disabled = false;
    applyBtn.textContent = 'Anwenden';
  }
}

// Expose to window
if (typeof window !== 'undefined') {
  window.applyDiscountCode = applyDiscountCode;
}

async function updatePaymentSummary() {
  if (typeof getTotal !== 'function') {
    console.warn('getTotal function not available');
    return;
  }

  const subtotal = getTotal();
  let deliveryFee = 0;

  if (selectedServiceType === 'delivery') {
    // Check if address is filled and within range
    const street = document.getElementById('deliveryStreet')?.value.trim();
    const postal = document.getElementById('deliveryPostal')?.value.trim();
    const city = document.getElementById('deliveryCity')?.value.trim();

    if (street && postal && city) {
      const rangeCheck = await checkDeliveryRange(street, postal, city);
      if (rangeCheck.withinRange) {
        deliveryFee = 0; // Free within 5km
      } else {
        deliveryFee = 0; // Still 0, but delivery not possible
      }
    } else {
      deliveryFee = 0; // Default to 0 until address is entered
    }
  } else if (selectedServiceType === 'pickup' || selectedServiceType === 'reservation') {
    deliveryFee = 0;
  }

  // Calculate discount
  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = (subtotal * appliedDiscount.percentage) / 100;
  }

  // Calculate tip
  let tipAmount = 0;
  if (selectedTip) {
    if (selectedTip.type === 'percent') {
      // Calculate tip based on subtotal after discount
      const amountAfterDiscount = subtotal - discountAmount;
      tipAmount = (amountAfterDiscount * selectedTip.value) / 100;
    } else if (selectedTip.type === 'custom') {
      tipAmount = selectedTip.amount || 0;
    }
  }

  // Service fee (3% of subtotal after discount)
  const serviceFee = ((subtotal - discountAmount) * 0.03);

  const total = subtotal - discountAmount + deliveryFee + tipAmount + serviceFee;

  const subtotalEl = document.getElementById('paymentSubtotal');
  const discountEl = document.getElementById('paymentDiscount');
  const discountRow = document.getElementById('discountRow');
  const deliveryEl = document.getElementById('paymentDelivery');
  const tipEl = document.getElementById('paymentTip');
  const tipRow = document.getElementById('tipRow');
  const serviceFeeEl = document.getElementById('paymentServiceFee');
  const serviceFeeRow = document.getElementById('serviceFeeRow');
  const totalEl = document.getElementById('paymentTotal');

  if (subtotalEl && typeof formatPrice === 'function') subtotalEl.textContent = formatPrice(subtotal);

  // Show/hide discount row
  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      if (discountEl && typeof formatPrice === 'function') {
        discountEl.textContent = '-' + formatPrice(discountAmount);
      }
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (deliveryEl && typeof formatPrice === 'function') deliveryEl.textContent = formatPrice(deliveryFee);

  // Show/hide tip row
  if (tipRow) {
    if (tipAmount > 0) {
      tipRow.style.display = 'flex';
      if (tipEl && typeof formatPrice === 'function') {
        tipEl.textContent = formatPrice(tipAmount);
      }
    } else {
      tipRow.style.display = 'none';
    }
  }

  // Show/hide service fee row
  if (serviceFeeRow) {
    if (serviceFee > 0) {
      serviceFeeRow.style.display = 'flex';
      if (serviceFeeEl && typeof formatPrice === 'function') {
        serviceFeeEl.textContent = formatPrice(serviceFee);
      }
    } else {
      serviceFeeRow.style.display = 'none';
    }
  }

  if (totalEl && typeof formatPrice === 'function') totalEl.textContent = formatPrice(total);

  // Update tip option amounts
  updateTipOptions();

  // Re-render PayPal button if PayPal is selected and total changed
  if (selectedPaymentMethod === 'paypal') {
    const paypalButtonContainer = document.getElementById('paypalButtonContainer');
    if (paypalButtonContainer && paypalButtonContainer.style.display !== 'none') {
      if (typeof renderPayPalButton === 'function') {
        renderPayPalButton();
      }
    }
  }
}

// Confirm payment function
async function confirmPayment() {
  // Check if reservation section is visible - if so, treat as reservation
  const reservationDetailsSection = document.getElementById('reservationDetailsSection');
  const isReservationVisible = reservationDetailsSection && reservationDetailsSection.style.display !== 'none';

  // If reservation section is visible, override selectedServiceType
  if (isReservationVisible && selectedServiceType !== 'reservation') {
    window.selectedServiceType = 'reservation';
    selectedServiceType = 'reservation'; // Keep local reference in sync
  }

  // Get customer info from authentication (user is already logged in)
  let customerCode = null;
  let user = null;

  if (typeof getCurrentUser === 'function') {
    user = getCurrentUser();
    if (user) {
      customerCode = user.customerCode || null;
    }
  }

  // Fallback: try to get from form if not in user object
  if (!customerCode) {
    if (selectedServiceType === 'reservation') {
      customerCode = document.getElementById('reservationCustomerCode')?.value.trim() || '';
    } else {
      customerCode = document.getElementById('customerCode')?.value.trim() || '';
    }
  }

  // VALIDATE: For payment (not reservation), cart must have items
  if (selectedServiceType !== 'reservation' && !isReservationVisible) {
    const cart = typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]');
    if (!cart || cart.length === 0) {
      alert('⚠️ Bitte fügen Sie mindestens ein Gericht zum Warenkorb hinzu, bevor Sie fortfahren.');
      return;
    }
  }

  // Validate form
  const customerFirstName = document.getElementById('customerFirstName')?.value.trim();
  const customerLastName = document.getElementById('customerLastName')?.value.trim();
  const street = document.getElementById('deliveryStreet')?.value.trim();
  const postal = document.getElementById('deliveryPostal')?.value.trim();
  const city = document.getElementById('deliveryCity')?.value.trim();
  const note = document.getElementById('deliveryNote')?.value.trim();
  const customerPhone = document.getElementById('customerPhone')?.value.trim();
  const customerEmail = document.getElementById('customerEmail')?.value.trim();

  // Helper to log validation errors
  const logValidationError = (errType, message) => {
    if (typeof window.logCheckoutError === 'function') {
      const name = ((customerFirstName || '') + ' ' + (customerLastName || '')).trim() || 'Gast';
      const totalEl = document.getElementById('paymentModalTotal') || document.getElementById('cart-total-value');
      const totalStr = totalEl ? (totalEl.innerText || totalEl.textContent) : '0.00 €';
      window.logCheckoutError(
        'validation_' + errType,
        message,
        { name, phone: customerPhone || 'N/A', email: customerEmail || 'N/A' },
        totalStr,
        selectedPaymentMethod || 'N/A'
      );
    }
  };

  // Handle reservation service type
  if (selectedServiceType === 'reservation') {
    // Get reservation-specific fields
    const reserveFirstName = document.getElementById('reserveFirstNameInPayment')?.value.trim();
    const reserveLastName = document.getElementById('reserveLastNameInPayment')?.value.trim();
    const reserveEmail = document.getElementById('reserveEmailInPayment')?.value.trim();
    const reservePhone = document.getElementById('reservePhoneInPayment')?.value.trim();
    const reserveDate = document.getElementById('reserveDateInPayment')?.value;
    const reserveTime = document.getElementById('reserveTimeInPayment')?.value;
    const reserveGuests = document.getElementById('reserveGuestsInPayment')?.value;
    const reservationCustomerCode = document.getElementById('reservationCustomerCode')?.value.trim() || '';

    // Validate reservation fields
    if (!reserveFirstName || !reserveLastName || !reserveEmail || !reservePhone) {
      alert('Bitte füllen Sie alle Pflichtfelder (Vorname, Nachname, E-Mail, Telefon) aus.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reserveEmail)) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    // Validate phone format (more flexible - accepts various formats)
    const phoneClean = reservePhone.replace(/[\s\-\+\(\)]/g, ''); // Remove spaces, dashes, plus, parentheses
    const phoneRegex = /^[\d]{8,15}$/; // 8-15 digits only
    if (!phoneRegex.test(phoneClean)) {
      alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
      return;
    }

    // Validate reservation details
    if (!reserveDate || !reserveTime || !reserveGuests) {
      alert('Bitte füllen Sie alle Reservierungsinformationen aus (Datum, Uhrzeit, Anzahl Personen).');
      return;
    }

    // Table selection removed - admin will assign tables manually
    // No need to validate table selection

    if (!selectedPaymentMethod) {
      alert('Bitte wählen Sie eine Zahlungsmethode aus.');
      return;
    }

    // Table selection removed - admin will assign tables manually
    // No need to check table availability

    // Get items from reservation cart if available, otherwise use regular cart
    const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
    const cart = typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]');
    const itemsToUse = reservationCart.length > 0 ? reservationCart : cart;

    // Create reservation with order
    const reservationId = `RES-${Date.now()}`;
    const reservationTimestamp = new Date().toISOString();

    // Calculate subtotal from items
    const subtotal = itemsToUse.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const reservationData = {
      reservationId: reservationId,
      status: 'pending',
      firstName: reserveFirstName,
      lastName: reserveLastName,
      phone: reservePhone,
      email: reserveEmail,
      customerCode: reservationCustomerCode || null,
      date: reserveDate,
      time: reserveTime,
      guests: parseInt(reserveGuests),
      tableNumber: null, // Admin will assign table manually
      note: note || '',
      items: itemsToUse.map(item => ({ name: item.name, price: item.price, qty: item.qty, desc: item.desc || '', note: item.note || '' })),
      timestamp: reservationTimestamp,
      createdAt: reservationTimestamp
    };

    // Create order linked to reservation (only if there are items)
    let orderData = null;
    if (itemsToUse.length > 0) {
      const orderId = `ORD-${Date.now()}`;
      orderData = {
        order_id: orderId,
        status: 'pending',
        service_type: 'dinein',
        table_number: null, // Admin will assign table manually
        reservation_id: reservationId,
        items: itemsToUse.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty,
          description: item.desc || '',
          note: item.note || '',
          total: (item.price * item.qty).toFixed(2)
        })),
        delivery: {
          address: {
            firstName: reserveFirstName,
            lastName: reserveLastName,
            phone: reservePhone,
            email: reserveEmail,
            street: '',
            postal: '',
            city: '',
            note: note || ''
          },
          fee: '0.00'
        },
        summary: {
          item_count: itemsToUse.reduce((sum, item) => sum + item.qty, 0),
          subtotal: subtotal.toFixed(2),
          delivery_fee: '0.00',
          total: subtotal.toFixed(2),
          payment_method: selectedPaymentMethod,
          timestamp: reservationTimestamp
        },
        createdAt: reservationTimestamp
      };
    }

    // Get customer code from form if entered
    const customerCode = document.getElementById('customerCode')?.value.trim() || null;

    // Save customer information for future orders (and get customer code)
    if (typeof window.saveCustomerInfo === 'function') {
      const savedCustomerInfo = await window.saveCustomerInfo({
        firstName: reserveFirstName,
        lastName: reserveLastName,
        email: reserveEmail,
        phone: reservePhone,
        street: '',
        postal: '',
        city: '',
        note: note || '',
        customerCode: customerCode // Include customer code if entered
      });

      // Store customer code in reservation data if available
      if (savedCustomerInfo && savedCustomerInfo.customerCode) {
        reservationData.customerCode = savedCustomerInfo.customerCode;
      }
    }

    // Save reservation
    if (typeof window.saveReservationToDailyReport === 'function') {
      window.saveReservationToDailyReport(reservationData);
    }

    // Save order only if there are items
    if (orderData && typeof window.saveOrderToDailyReport === 'function') {
      window.saveOrderToDailyReport(orderData);
    }

    // NOTE: KHÔNG gửi email khi khách đặt bàn
    // Email sẽ CHỈ được gửi cho customer SAU KHI admin xác nhận đặt bàn (trong admin.html)
    // Admin xem đặt bàn trong admin panel, không cần email thông báo

    // Show confirmation
    showNotification('✓ Reservierung erfolgreich! Wir haben Ihre Reservierung erhalten und werden Sie per E-Mail bestätigen.', false);

    // Close payment modal after a short delay
    setTimeout(() => {
      closePaymentModal();
    }, 2000);

    // Clear carts
    if (typeof window.clearCart === 'function') {
      window.clearCart();
    } else {
      localStorage.setItem('leoCart', '[]');
    }
    localStorage.removeItem('leoReservationCart');
    localStorage.removeItem('leoSelectingForReservation');
    if (typeof window.updateCartUI === 'function') {
      window.updateCartUI();
    }
    if (typeof window.updateReservationCartDisplay === 'function') {
      window.updateReservationCartDisplay();
    }

    // Close modal
    closePaymentModal();
    return;
  }

  // Validate based on service type (for delivery and pickup only, reservation is handled above)
  // Only validate customer info for delivery and pickup
  if (selectedServiceType === 'delivery' || selectedServiceType === 'pickup') {
    if (!customerFirstName || !customerLastName || !customerPhone || !customerEmail) {
      logValidationError('missing_fields', 'Fehlende Pflichtfelder (Vorname, Nachname, Telefon or Email)');
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    // Validate phone format (more flexible - accepts various formats)
    const phoneClean = customerPhone.replace(/[\s\-\+\(\)]/g, ''); // Remove spaces, dashes, plus, parentheses
    const phoneRegex = /^[\d]{8,15}$/; // 8-15 digits only
    if (!phoneRegex.test(phoneClean)) {
      logValidationError('invalid_phone', 'Ungültige Telefonnummer: ' + customerPhone);
      alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      logValidationError('invalid_email', 'Ungültige E-Mail-Adresse: ' + customerEmail);
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
  }

  if (!selectedPaymentMethod) {
    logValidationError('missing_payment_method', 'Keine Zahlungsmethode ausgewählt');
    alert('Bitte wählen Sie eine Zahlungsmethode aus.');
    return;
  }

  // For delivery, address is required and must be within range
  // Only validate if service type is delivery AND reservation section is not visible
  if (selectedServiceType === 'delivery' && !isReservationVisible) {
    if (!street || !postal || !city) {
      logValidationError('missing_address', 'Lieferadresse fehlt (Strasse, PLZ or Stadt)');
      alert('Bitte füllen Sie die Lieferadresse aus.');
      return;
    }

    // Validate postal code for delivery
    if (postal && !/^\d{5}$/.test(postal)) {
      logValidationError('invalid_postal', 'Ungültige PLZ: ' + postal);
      alert('Bitte geben Sie eine gültige 5-stellige PLZ ein.\n\nBeispiel: 13187');
      return;
    }

    // Check if address is within delivery range (5km)
    const rangeCheck = await checkDeliveryRange(street, postal, city);
    if (!rangeCheck.withinRange) {
      logValidationError('out_of_range', 'Adresse ausserhalb des Liefergebiets: ' + street + ', ' + postal + ' | ' + rangeCheck.message);
      alert('Lieferung nicht möglich!\n\n' + rangeCheck.message + '\n\nBitte wählen Sie stattdessen:\n• "Tisch reservieren"');
      return;
    }
  }

  // For pickup, check if tables are available
  if (selectedServiceType === 'pickup') {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5); // Current time HH:MM
    if (typeof getAvailableTables === 'function') {
      const availableTables = getAvailableTables(date, time);
      if (availableTables.length === 0) {
        logValidationError('no_tables_available', 'Keine Tische für Abholung verfügbar');
        alert('Entschuldigung, derzeit sind keine Tische verfügbar. Bitte wählen Sie eine andere Zeit oder bestellen Sie eine Lieferung.');
        return;
      }
    }
  }

  // Prepare delivery address
  const deliveryAddress = {
    firstName: customerFirstName,
    lastName: customerLastName,
    street: street || '',
    postal: postal || '',
    city: city || '',
    note: note || '',
    phone: customerPhone,
    email: customerEmail
  };

  // Customer code already validated at the beginning of function
  // Reuse the customerCode variable declared earlier (line 653)
  if (selectedServiceType === 'reservation') {
    customerCode = document.getElementById('reservationCustomerCode')?.value.trim() || null;
  } else {
    customerCode = document.getElementById('customerCode')?.value.trim() || null;
  }

  // Save customer information for future orders (and get customer code)
  let savedCustomerInfo = null;
  if (typeof window.saveCustomerInfo === 'function') {
    savedCustomerInfo = await window.saveCustomerInfo({
      firstName: customerFirstName,
      lastName: customerLastName,
      email: customerEmail,
      phone: customerPhone,
      street: street || '',
      postal: postal || '',
      city: city || '',
      note: note || '',
      customerCode: customerCode // Include customer code if entered
    });
  }

  // Store customer code for display in success notification and in order data
  if (savedCustomerInfo && savedCustomerInfo.customerCode) {
    deliveryAddress.customerCode = savedCustomerInfo.customerCode;
    console.log('✅ Customer code saved to deliveryAddress:', savedCustomerInfo.customerCode);
  } else {
    console.warn('⚠️ No customer code in savedCustomerInfo:', savedCustomerInfo);
    // Try to get customer code from form if still not set
    if (!deliveryAddress.customerCode && customerCode) {
      deliveryAddress.customerCode = customerCode;
      console.log('✅ Using customer code from form:', customerCode);
    }
  }

  // Calculate totals
  const subtotal = typeof window.getTotal === 'function' ? window.getTotal() : 0;
  let deliveryFee = 0;
  if (selectedServiceType === 'delivery') {
    // Delivery is free within 5km (already validated above)
    deliveryFee = 0;
  }

  // Calculate discount
  let discountAmount = 0;
  let discountCode = null;
  if (appliedDiscount) {
    discountAmount = (subtotal * appliedDiscount.percentage) / 100;
    discountCode = appliedDiscount.code;
  }

  // Calculate tip
  let tipAmount = 0;
  if (selectedTip) {
    if (selectedTip.type === 'percent') {
      const amountAfterDiscount = subtotal - discountAmount;
      tipAmount = (amountAfterDiscount * selectedTip.value) / 100;
    } else if (selectedTip.type === 'custom') {
      tipAmount = selectedTip.amount || 0;
    }
  }

  // Service fee (0% - Disabled to match checkout.js flow)
  const serviceFee = 0;

  const total = subtotal - discountAmount + deliveryFee + tipAmount + serviceFee;

  // Generate unique order ID
  const orderId = `ORD-${Date.now()}`;
  const orderTimestamp = new Date().toISOString();

  // Get cart
  const cart = typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]');

  // Prepare detailed cart data for GloriaFood
  const orderData = {
    order_id: orderId,
    status: 'pending', // pending, confirmed, cancelled
    service_type: selectedServiceType, // 'pickup' or 'delivery'
    table_number: null, // Will be assigned by admin later
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.qty,
      description: item.desc || '',
      note: item.note || '',
      total: (item.price * item.qty).toFixed(2)
    })),
    delivery: {
      address: {
        ...deliveryAddress,
        customerCode: deliveryAddress.customerCode || savedCustomerInfo?.customerCode || null // Ensure customerCode is included
      },
      fee: deliveryFee.toFixed(2)
    },
    customerCode: deliveryAddress.customerCode || savedCustomerInfo?.customerCode || null, // Also store at root level for easy access
    summary: {
      item_count: cart.reduce((sum, item) => sum + item.qty, 0),
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      discount_code: discountCode || null,
      delivery_fee: deliveryFee.toFixed(2),
      tip: tipAmount.toFixed(2),
      service_fee: serviceFee.toFixed(2),
      total: total.toFixed(2),
      payment_method: selectedPaymentMethod,
      timestamp: orderTimestamp
    },
    createdAt: orderTimestamp
  };

  // Log customer code in order data
  if (orderData.customerCode) {
    console.log('✅ Customer code included in orderData:', orderData.customerCode);
  } else {
    console.warn('⚠️ No customer code in orderData');
  }

  // Handle PayPal payment
  // Note: PayPal payment is handled directly by the PayPal button's onApprove callback
  // If user selected PayPal but somehow reached here, show error
  if (selectedPaymentMethod === 'paypal') {
    alert('Bitte verwenden Sie den PayPal-Button zum Bezahlen.');
    return;
  }

  // Save to localStorage - GloriaFood widget/script can read this
  localStorage.setItem('leoOrderData', JSON.stringify(orderData));
  localStorage.setItem('gloriafood_cart', JSON.stringify(orderData.items));
  localStorage.setItem('order_summary', JSON.stringify(orderData.summary));
  localStorage.setItem('payment_method', selectedPaymentMethod);
  localStorage.setItem('delivery_address', JSON.stringify(deliveryAddress));

  // Save order to daily orders list for reporting
  if (typeof window.saveOrderToDailyReport === 'function') {
    window.saveOrderToDailyReport(orderData);
  }

  // Mark discount code as used if applied
  if (appliedDiscount && typeof markDiscountCodeUsed === 'function') {
    await markDiscountCodeUsed();
    appliedDiscount = null;
    window.appliedDiscount = null;
  }

  // Note: Table will be assigned by admin later, no automatic reservation needed

  // NOTE: KHÔNG gửi email khi khách đặt hàng
  // Email sẽ CHỈ được gửi cho customer SAU KHI admin xác nhận đơn hàng (trong admin.html)
  // Admin xem đơn hàng trong admin panel, không cần email thông báo

  // NOTE: Print bills will be generated when admin confirms the order

  // Clear cart after successful order
  if (typeof window.clearCart === 'function') {
    window.clearCart();
  } else {
    localStorage.setItem('leoCart', '[]');
  }

  // Set flag to prevent cart from auto-opening after successful payment
  sessionStorage.setItem('orderJustCompleted', 'true');

  // Close payment modal
  closePaymentModal();

  // Ensure customer code is in deliveryAddress for display
  // Priority: savedCustomerInfo > orderData > form input
  if (!deliveryAddress.customerCode) {
    if (orderData.customerCode) {
      deliveryAddress.customerCode = orderData.customerCode;
    } else if (savedCustomerInfo && savedCustomerInfo.customerCode) {
      deliveryAddress.customerCode = savedCustomerInfo.customerCode;
    } else if (customerCode) {
      deliveryAddress.customerCode = customerCode;
    }
  }

  console.log('📋 Final deliveryAddress.customerCode:', deliveryAddress.customerCode);

  // Show beautiful success notification
  showOrderSuccessNotification(orderData, deliveryAddress, orderId);

  // Update cart UI after a delay to ensure notification is shown first
  setTimeout(() => {
    if (typeof window.updateCartUI === 'function') {
      window.updateCartUI();
    }
  }, 500);

  // NOTE: Disabled GloriaFood widget trigger to prevent cart from reopening
  // If you need GloriaFood integration, uncomment and test carefully
  /*
  // Try to trigger GloriaFood ordering widget/iframe
  // Option 1: Check if GloriaFood widget exists on page
  const gloriaWidget = document.querySelector('[id*="gloria"], [class*="gloria"], iframe[src*="gloriafood"]');
  
  if (gloriaWidget) {
    // If widget exists, try to open it
    gloriaWidget.click();
    // Try to inject items after widget opens
    setTimeout(() => {
      if (typeof window.tryInjectGloriaFoodCart === 'function') {
        window.tryInjectGloriaFoodCart();
      }
    }, 1000);
  } else {
    // Option 2: Try to trigger GloriaFood widget if it exists globally
    if (typeof window.gloriafood !== 'undefined' && window.gloriafood.openOrdering) {
      window.gloriafood.openOrdering();
      setTimeout(() => {
        if (typeof window.tryInjectGloriaFoodCart === 'function') {
          window.tryInjectGloriaFoodCart();
        }
      }, 1500);
    } else {
      // Option 3: Redirect to GloriaFood ordering page
      // Get your ordering URL from: Dashboard > Smart links > Copy your ordering link
      const gloriaOrderUrl = 'YOUR_GLORIAFOOD_ORDERING_URL_HERE'; // Paste from Smart links
      
      // If you have the URL, redirect
      if (gloriaOrderUrl !== 'YOUR_GLORIAFOOD_ORDERING_URL_HERE') {
        window.open(gloriaOrderUrl, '_blank');
        sessionStorage.setItem('has_gloria_cart', 'true');
      } else {
        // Fallback: Show order confirmation (already handled by showOrderSuccessNotification above)
      }
    }
  }
  */
}

// Make functions and variables globally available
window.closePaymentModal = closePaymentModal;
window.selectServiceType = selectServiceType;
window.getCurrentLocation = getCurrentLocation;
window.selectPaymentOption = selectPaymentOption;
console.log('✅ [payment.js] selectPaymentOption exposed to window:', typeof window.selectPaymentOption);
window.setServiceType = setServiceType;
window.openPaymentModal = openPaymentModal;
window.updatePaymentSummary = updatePaymentSummary;
window.checkDeliveryRange = checkDeliveryRange;
window.checkAndUpdateDeliveryStatus = checkAndUpdateDeliveryStatus;
window.getDeliveryAddress = getDeliveryAddress;
window.confirmPayment = confirmPayment;
window.updatePaymentModalServiceType = updatePaymentModalServiceType;
window.setupReservationTableSelectionListeners = setupReservationTableSelectionListeners;
window.setupScheduledDeliveryTimeValidation = setupScheduledDeliveryTimeValidation;
window.getScheduledDeliveryTime = getScheduledDeliveryTime;
// Expose variables for backward compatibility with script.js
// Create getters/setters to keep variables in sync
Object.defineProperty(window, 'selectedServiceType', {
  get: () => selectedServiceType,
  set: (value) => { selectedServiceType = value; },
  configurable: true,
  enumerable: true
});
Object.defineProperty(window, 'selectedPaymentMethod', {
  get: () => selectedPaymentMethod,
  set: (value) => { selectedPaymentMethod = value; },
  configurable: true,
  enumerable: true
});

// Show order success notification
function showOrderSuccessNotification(orderData, deliveryAddress, orderId) {
  // Trigger Google Analytics 4 Ecommerce Purchase Event
  if (typeof window.gtag === 'function') {
    try {
      const rawTotal = parseFloat(String(orderData.summary.total || 0).replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        value: rawTotal,
        currency: 'EUR',
        items: (orderData.items || []).map(item => ({
          item_id: item.id || item.name,
          item_name: item.name,
          price: parseFloat(item.price || 0),
          quantity: parseInt(item.quantity || item.qty || 1, 10)
        }))
      });
      console.log('📊 GA4 Purchase event tracked:', orderId, rawTotal);
    } catch(e) {
      console.warn('GA4 tracking error:', e);
    }
  }

  // Create notification modal
  const notification = document.createElement('div');
  notification.className = 'order-success-notification';
  notification.id = 'orderSuccessNotification';
  notification.innerHTML = `
    <div class="order-success-content">
      <div class="order-success-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="url(#successGradient)"/>
          <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stop-color="#10b981"/>
              <stop offset="100%" stop-color="#059669"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h2 class="order-success-title">Bestellung erfolgreich!</h2>
      <p class="order-success-message">
        Vielen Dank für Ihre Bestellung!<br>
        Ihre Bestellnummer: <strong>${orderId.replace('ORD-', '')}</strong>
      </p>
      ${deliveryAddress.customerCode ? `
      <div class="customer-code-display" style="background: rgba(229,207,142,.1); border: 2px solid rgba(229,207,142,.3); border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: rgba(255,255,255,.7); font-size: 13px; margin-bottom: 8px;">🔑 Ihr Kunden-Code:</div>
        <div style="color: var(--gold); font-size: 24px; font-weight: 700; letter-spacing: 2px; font-family: monospace;">${deliveryAddress.customerCode}</div>
        <div style="color: rgba(255,255,255,.6); font-size: 12px; margin-top: 8px;">Speichern Sie diesen Code für schnellere Bestellungen in Zukunft!</div>
      </div>
      ` : ''}
      <div class="order-success-details">
        <div class="success-detail-item">
          <span class="success-detail-label">Artikel:</span>
          <span class="success-detail-value">${orderData.summary.item_count}</span>
        </div>
        <div class="success-detail-item">
          <span class="success-detail-label">Gesamt:</span>
          <span class="success-detail-value">€${orderData.summary.total}</span>
        </div>
        <div class="success-detail-item">
          <span class="success-detail-label">Status:</span>
          <span class="success-detail-value" style="color: var(--gold);">Wird bearbeitet</span>
        </div>
      </div>
      <p class="order-success-note">
        Sie erhalten in Kürze eine Bestätigungs-E-Mail.<br>
        Wir werden Sie über den Status Ihrer Bestellung informieren.
      </p>
      <div class="order-success-email-reminder">
        <div class="email-reminder-icon">📧</div>
        <div class="email-reminder-text">
          <strong>Bitte überprüfen Sie Ihr E-Mail-Postfach!</strong><br>
          <span>Die Bestätigungs-E-Mail wurde an <strong>${deliveryAddress.email || 'Ihre E-Mail-Adresse'}</strong> gesendet.</span>
        </div>
      </div>
      <!-- App Download Incentive Section (Web users) -->
      ${(!document.body.classList.contains('is-capacitor-app') && !window.location.search.includes('mock-app')) ? `
      <div class="order-success-app-banner" style="background: linear-gradient(135deg, rgba(229,207,142,.12), rgba(194,163,85,.06)); border: 1px solid rgba(229,207,142,.3); border-radius: 14px; padding: 18px; margin: 20px 0; text-align: center;">
        <div style="font-size: 15px; font-weight: 700; color: var(--gold); margin-bottom: 6px;">📱 LEO SUSHI App herunterladen</div>
        <div style="font-size: 12px; color: rgba(255,255,255,.8); line-height: 1.5; margin-bottom: 14px;">
          Bestellen Sie beim nächsten Mal über unsere App & sichern Sie sich <strong>10% Rabatt (Code: APP10)</strong> + Live-Tracking!
        </div>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <a href="https://apps.apple.com/de/app/leo-sushi/id6758460309" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: #1a1a1e; border: 1px solid rgba(255,255,255,.15); color: #fff; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; text-decoration: none; transition: 0.2s;">
            <span>🍎</span> App Store
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.leosushi.berlin" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; background: #1a1a1e; border: 1px solid rgba(255,255,255,.15); color: #fff; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; text-decoration: none; transition: 0.2s;">
            <span>▶️</span> Google Play
          </a>
        </div>
      </div>
      ` : ''}
      <button class="order-success-btn" onclick="closeOrderSuccessNotification()">Verstanden</button>
    </div>
  `;

  // Add styles if not already added
  if (!document.getElementById('orderSuccessNotificationStyles')) {
    const style = document.createElement('style');
    style.id = 'orderSuccessNotificationStyles';
    style.textContent = `
      .order-success-notification {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .order-success-content {
        background: linear-gradient(180deg, #1a1a1a, #0f0f11);
        border: 1px solid rgba(229, 207, 142, 0.2);
        border-radius: 24px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.4s ease;
      }
      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      .order-success-icon {
        margin: 0 auto 24px;
        animation: scaleIn 0.5s ease 0.2s both;
      }
      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
      .order-success-title {
        font-family: "Playfair Display", serif;
        font-size: 32px;
        color: #fff;
        margin: 0 0 16px;
        font-weight: 700;
      }
      .order-success-message {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        line-height: 1.6;
        margin: 0 0 24px;
      }
      .order-success-message strong {
        color: var(--gold);
        font-weight: 600;
      }
      .order-success-details {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 20px;
        margin: 0 0 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .success-detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .success-detail-item:last-child {
        border-bottom: none;
      }
      .success-detail-label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
      }
      .success-detail-value {
        color: #fff;
        font-weight: 600;
        font-size: 16px;
      }
      .order-success-note {
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 20px;
      }
      .order-success-email-reminder {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        padding: 16px;
        margin: 0 0 24px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        animation: slideIn 0.4s ease 0.3s both;
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .email-reminder-icon {
        font-size: 24px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .email-reminder-text {
        flex: 1;
        text-align: left;
      }
      .email-reminder-text strong {
        color: #10b981;
        font-size: 15px;
        display: block;
        margin-bottom: 6px;
      }
      .email-reminder-text span {
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        line-height: 1.5;
      }
      .email-reminder-text span strong {
        color: var(--gold);
        font-size: 13px;
        display: inline;
        margin: 0;
      }
      .order-success-btn {
        background: linear-gradient(180deg, var(--gold), var(--gold-2));
        color: #1a1a1a;
        border: none;
        padding: 14px 32px;
        border-radius: 100px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
      }
      .order-success-btn:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(194, 163, 85, 0.3);
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @media (max-width: 640px) {
        .order-success-content {
          padding: 32px 24px;
        }
        .order-success-title {
          font-size: 24px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto close after 10 seconds
  setTimeout(() => {
    closeOrderSuccessNotification();
  }, 10000);
}

// Close order success notification
function closeOrderSuccessNotification() {
  const notification = document.getElementById('orderSuccessNotification');
  if (notification) {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
      // Clear the flag when notification is closed so cart can be used normally again
      sessionStorage.removeItem('orderJustCompleted');
    }, 300);
  }
}

// Setup customer code validation in payment modal
function setupPaymentCustomerCodeValidation() {
  const customerCodeField = document.getElementById('customerCode');
  const reservationCustomerCodeField = document.getElementById('reservationCustomerCode');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

  if (!confirmPaymentBtn) return;

  const validateAndEnableButton = async () => {
    let code = '';
    if (selectedServiceType === 'reservation' && reservationCustomerCodeField) {
      code = reservationCustomerCodeField.value.trim();
    } else if (customerCodeField) {
      code = customerCodeField.value.trim();
    }

    // Check if code is valid
    if (code && code.length >= 7 && code.match(/^LEO-[A-Z0-9]+$/i)) {
      // Check if already loaded
      const savedInfo = localStorage.getItem('leoEarlyCustomerInfo');
      let isValid = false;

      if (savedInfo) {
        try {
          const info = JSON.parse(savedInfo);
          const savedCode = (info.customerCode || '').toUpperCase().trim().replace(/\s+/g, '');
          const inputCode = code.toUpperCase().trim().replace(/\s+/g, '');
          if (savedCode === inputCode && info.loadedAt && (Date.now() - info.loadedAt) < 24 * 60 * 60 * 1000) {
            isValid = true;
          }
        } catch (e) {
          console.error('Error checking saved customer info:', e);
        }
      }

      // If not in localStorage, try to validate
      if (!isValid && typeof window.validateCustomerCode === 'function') {
        try {
          const validationResult = await window.validateCustomerCode(code);
          if (validationResult.isValid && validationResult.customerInfo) {
            isValid = true;
            // Save and auto-fill
            localStorage.setItem('leoEarlyCustomerInfo', JSON.stringify({
              ...validationResult.customerInfo,
              customerCode: code.toUpperCase().trim().replace(/\s+/g, ''),
              loadedAt: Date.now()
            }));
            if (typeof window.autoFillFromEarlyEntry === 'function') {
              window.autoFillFromEarlyEntry();
            }
            if (typeof window.showNotification === 'function') {
              window.showNotification('✓ Kunden-Code gültig! Sie können jetzt fortfahren.', false);
            }
          }
        } catch (e) {
          console.error('Error validating customer code:', e);
        }
      }

      if (isValid) {
        confirmPaymentBtn.disabled = false;
        confirmPaymentBtn.style.opacity = '1';
        confirmPaymentBtn.style.cursor = 'pointer';
      } else {
        confirmPaymentBtn.disabled = true;
        confirmPaymentBtn.style.opacity = '0.5';
        confirmPaymentBtn.style.cursor = 'not-allowed';
      }
    } else {
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.style.opacity = '0.5';
      confirmPaymentBtn.style.cursor = 'not-allowed';
    }
  };

  // Simple debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Listen to customer code fields
  if (customerCodeField) {
    customerCodeField.addEventListener('blur', validateAndEnableButton);
    customerCodeField.addEventListener('input', debounce(validateAndEnableButton, 500));
  }

  if (reservationCustomerCodeField) {
    reservationCustomerCodeField.addEventListener('blur', validateAndEnableButton);
    reservationCustomerCodeField.addEventListener('input', debounce(validateAndEnableButton, 500));
  }

  // Also check when service type changes - use event listener instead of override
  // Store reference to validate function
  window._validatePaymentCustomerCode = validateAndEnableButton;

  // Check initially
  setTimeout(validateAndEnableButton, 300);
}

const PAYPAL_PENDING_ORDER_KEY = 'leo_pending_paypal_order_v1';

function queuePendingPayPalOrder(orderData) {
  try {
    localStorage.setItem(PAYPAL_PENDING_ORDER_KEY, JSON.stringify({
      savedAt: Date.now(),
      orderData: orderData
    }));
  } catch (error) {
    console.warn('Could not persist pending PayPal order locally:', error);
  }
}

function clearPendingPayPalOrder() {
  try { localStorage.removeItem(PAYPAL_PENDING_ORDER_KEY); } catch (error) {}
}

function sendPendingPayPalOrderBeacon(orderData) {
  try {
    if (!navigator.sendBeacon) return false;
    const apiBase = window.API_PHP_BASE_URL || `${window.location.origin}/api`;
    const payload = new Blob([JSON.stringify(orderData)], { type: 'application/json' });
    return navigator.sendBeacon(`${apiBase}/index.php?route=v1/data/orders/create`, payload);
  } catch (error) {
    console.warn('PayPal order recovery beacon failed:', error);
    return false;
  }
}

async function savePayPalOrderReliably(orderData) {
  queuePendingPayPalOrder(orderData);
  // Queue the independent delivery immediately. Waiting for two long fetch
  // timeouts first defeats sendBeacon's purpose when the app/tab is closed.
  // paypal_capture_id is unique server-side, so this parallel request is safe.
  sendPendingPayPalOrderBeacon(orderData);
  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const result = await window.api.orders.saveOrder(orderData, { timeoutMs: 60000 });
      if (result && result.success) {
        clearPendingPayPalOrder();
        return result;
      }
      lastError = new Error(result?.message || 'PayPal order save was declined');
    } catch (error) {
      lastError = error;
    }
    if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Retry the independent delivery once more after ordinary requests fail.
  sendPendingPayPalOrderBeacon(orderData);
  throw lastError || new Error('PayPal order could not be saved');
}

async function retryPendingPayPalOrder() {
  if (!window.api?.orders?.saveOrder) return;
  let pending = null;
  try { pending = JSON.parse(localStorage.getItem(PAYPAL_PENDING_ORDER_KEY) || 'null'); } catch (error) {}
  if (!pending?.orderData?.paypal_capture_id && !pending?.orderData?.paypal_order_id) return;

  try {
    const result = await window.api.orders.saveOrder(pending.orderData, { timeoutMs: 60000 });
    if (result?.success) clearPendingPayPalOrder();
  } catch (error) {
    console.warn('Pending PayPal order will be retried later:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(retryPendingPayPalOrder, 1500), { once: true });
} else {
  setTimeout(retryPendingPayPalOrder, 1500);
}
window.addEventListener('online', retryPendingPayPalOrder);

// Render PayPal button
async function renderPayPalButton() {
  console.log('🔄 [renderPayPalButton] Starting...');
  const container = document.getElementById('paypal-button-container');
  if (!container) {
    console.error('❌ [renderPayPalButton] paypal-button-container not found!');
    return;
  }
  console.log('✅ [renderPayPalButton] Container found');

  // Check if PayPal SDK is loaded
  if (typeof paypal === 'undefined') {
    console.error('❌ [renderPayPalButton] PayPal SDK not loaded!');
    container.innerHTML = '<p style="color: #ef4444; padding: 10px;">PayPal SDK konnte nicht geladen werden. Bitte Seite neu laden.</p>';
    return;
  }
  console.log('✅ [renderPayPalButton] PayPal SDK loaded');

  // Clear container
  container.innerHTML = '';
  // Reset idempotency guard for fresh PayPal session
  window._paypalOrderSubmitting = false;
  console.log('🔄 [renderPayPalButton] Container cleared, _paypalOrderSubmitting reset, calculating totals...');

  // Calculate total with discount
  // Try multiple ways to get subtotal
  let subtotal = 0;

  // Method 1: Try getTotal() from cart.js
  if (typeof getTotal === 'function') {
    subtotal = getTotal();
    console.log('💰 [renderPayPalButton] Got subtotal from getTotal():', subtotal);
  }
  // Method 2: Try calculateSubtotal from checkout.js
  else if (typeof calculateSubtotal === 'function' && typeof getCart === 'function') {
    const cart = getCart();
    subtotal = calculateSubtotal(cart);
    console.log('💰 [renderPayPalButton] Got subtotal from calculateSubtotal():', subtotal);
  }
  // Method 3: Calculate manually from cart
  else {
    const cart = typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]');
    if (cart && cart.length > 0) {
      subtotal = cart.reduce((sum, item) => {
        const quantity = item.qty || item.quantity || 1;
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        return sum + (price * quantity);
      }, 0);
      console.log('💰 [renderPayPalButton] Calculated subtotal manually from cart:', subtotal);
    } else {
      console.warn('⚠️ [renderPayPalButton] Cart is empty or not found');
    }
  }

  let deliveryFee = 0;
  if (window.selectedServiceType === 'delivery') {
    const street = document.getElementById('deliveryStreet')?.value || '';
    const postal = document.getElementById('deliveryPostal')?.value || '';
    const city = document.getElementById('deliveryCity')?.value || '';
    if (street && postal && city) {
      const rangeCheck = await checkDeliveryRange(street, postal, city);
      if (rangeCheck.withinRange) {
        deliveryFee = 0; // Free within 5km
      }
    }
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
      discountAmount = window.appliedDiscount.discount || 0;
    }
  }

  // Total discount = automatic + code discount
  const totalDiscountAmount = automaticDiscountAmount + discountAmount;

  // Calculate tip
  let tipAmount = 0;
  if (window.selectedTip) {
    if (window.selectedTip.type === 'percent') {
      // Standardize: Tip is calculated on GROSS subtotal (before discounts) to match checkout.js
      tipAmount = (subtotal * window.selectedTip.value) / 100;
    } else if (window.selectedTip.type === 'custom') {
      tipAmount = window.selectedTip.amount || 0;
    }
  }

  // Service fee (0% - Sync with checkout.js)
  const serviceFee = 0;

  const total = subtotal - totalDiscountAmount + deliveryFee + tipAmount + serviceFee;
  console.log('💰 [renderPayPalButton] Total calculated:', {
    subtotal,
    automaticDiscountAmount,
    discountAmount,
    totalDiscountAmount,
    deliveryFee,
    tipAmount,
    serviceFee,
    total
  });

  // Get cart - try multiple methods
  let cart = [];
  if (typeof window.getCart === 'function') {
    cart = window.getCart();
    console.log('🛒 [renderPayPalButton] Got cart from window.getCart():', cart.length, 'items');
  } else if (typeof getCart === 'function') {
    cart = getCart();
    console.log('🛒 [renderPayPalButton] Got cart from getCart():', cart.length, 'items');
  } else {
    try {
      cart = JSON.parse(localStorage.getItem('leoCart') || '[]');
      console.log('🛒 [renderPayPalButton] Got cart from localStorage:', cart.length, 'items');
    } catch (e) {
      console.error('❌ [renderPayPalButton] Error parsing cart from localStorage:', e);
      cart = [];
    }
  }

  console.log('🛒 [renderPayPalButton] Cart details:', {
    length: cart.length,
    items: cart.map(item => ({ name: item.name, price: item.price, qty: item.qty || item.quantity }))
  });

  // Validate total - PayPal requires minimum amount
  if (total <= 0) {
    console.error('❌ [renderPayPalButton] Total is 0 or negative, cannot create PayPal order');
    container.innerHTML = '<p style="color: #ef4444; padding: 10px;">Fehler: Gesamtbetrag ist 0. Bitte fügen Sie Artikel zum Warenkorb hinzu.</p>';
    return;
  }

  if (!cart || cart.length === 0) {
    console.error('❌ [renderPayPalButton] Cart is empty, cannot create PayPal order');
    container.innerHTML = '<p style="color: #ef4444; padding: 10px;">Fehler: Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.</p>';
    return;
  }

  // Validate Minimum Order for Delivery (15 €)
  const svcType = window.selectedServiceType || (typeof selectedServiceType !== 'undefined' ? selectedServiceType : 'delivery');
  if (svcType === 'delivery' && subtotal < 15) {
    console.warn('⚠️ [renderPayPalButton] Subtotal under 15€ for delivery. PayPal disabled.');
    container.innerHTML = `<p style="color: #ef4444; padding: 10px; font-weight: 600; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; background: rgba(239, 68, 68, 0.05);">⚠️ Mindestbestellwert für Lieferung: 15,00 €<br><span style="font-size: 13px; font-weight: normal; opacity: 0.8;">Aktuell: ${subtotal.toFixed(2)} €</span></p>`;
    return;
  }

  // Render PayPal button
  console.log('🔄 [renderPayPalButton] Creating PayPal button with total:', total);
  try {
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: async function (data, actions) {
        console.log('🔄 [PayPal createOrder] Creating order with total:', total.toFixed(2));
        console.log('🛒 [PayPal createOrder] Cart items:', cart.length);

        // ★ VALIDATE FORM BEFORE ALLOWING PAYPAL ★
        const addr = getDeliveryAddress();
        const missingFields = [];
        if (!addr.email) missingFields.push('E-Mail-Adresse');
        if (!addr.firstName) missingFields.push('Vorname');
        if (!addr.lastName) missingFields.push('Nachname');
        if (!addr.phone) missingFields.push('Telefonnummer');
        // For delivery, also require address fields
        const svcType = window.selectedServiceType || selectedServiceType || 'delivery';
        if (svcType === 'delivery') {
          if (!addr.street) missingFields.push('Straße');
          if (!addr.postal) missingFields.push('PLZ');
          if (!addr.city) missingFields.push('Stadt');
        }
        if (missingFields.length > 0) {
          alert('Bitte füllen Sie folgende Felder aus, bevor Sie mit PayPal bezahlen:\n\n• ' + missingFields.join('\n• '));
          // Scroll to the first empty field
          const firstEmptyId = !addr.firstName ? 'customerFirstName' :
            !addr.lastName ? 'customerLastName' :
              !addr.email ? 'customerEmail' :
                !addr.phone ? 'customerPhone' :
                  !addr.street ? 'deliveryStreet' :
                    !addr.postal ? 'deliveryPostal' : 'deliveryCity';
          const el = document.getElementById(firstEmptyId);
          if (el) { el.focus(); el.style.borderColor = '#ef4444'; setTimeout(() => el.style.borderColor = '', 3000); }
          return Promise.reject(new Error('Form validation failed'));
        }

        // Preferred durable flow: persist the complete order on our server
        // before PayPal is allowed to create anything payable.
        let legacyClientFlow = false;
        try {
          const clientOrderId = window._paypalDraftOrderId ||
            ('LEO-PP-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));
          window._paypalDraftOrderId = clientOrderId;
          const durableDraft = buildStripeOrderDraft(clientOrderId, null);
          durableDraft.payment_method = 'PayPal';
          durableDraft.payment_status = 'pending';
          delete durableDraft.payment_intent_id;

          const serverResponse = await fetch((window.API_BASE_URL || '/api') + '/paypal-create-order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_data: durableDraft })
          });
          let serverResult = {};
          try { serverResult = await serverResponse.json(); } catch (e) {}
          if (serverResponse.ok && serverResult.success && serverResult.orderId) {
            window._paypalServerFlow = true;
            window._paypalServerOrderId = serverResult.orderId;
            console.log('✅ [PayPal createOrder] Durable server order created:', serverResult.orderId);
            return serverResult.orderId;
          }
          if (serverResponse.status === 503 && serverResult.server_flow_available === false) {
            // Temporary compatibility until the existing PayPal app secret is
            // installed on the server. No silent fallback for other errors.
            legacyClientFlow = true;
            window._paypalServerFlow = false;
          } else {
            throw new Error(serverResult.message || 'PayPal konnte nicht sicher vorbereitet werden.');
          }
        } catch (serverError) {
          if (!legacyClientFlow) {
            console.error('❌ [PayPal createOrder] Durable server preparation failed:', serverError);
            throw serverError;
          }
        }

        // Compatibility flow while server credentials are not configured.
        try {
          const orderData = {
            intent: 'CAPTURE',
            purchase_units: [{
              reference_id: 'default',
              amount: {
                value: total.toFixed(2),
                currency_code: 'EUR',
                breakdown: {
                  item_total: {
                    value: subtotal.toFixed(2),
                    currency_code: 'EUR'
                  },
                  discount: totalDiscountAmount > 0 ? {
                    value: totalDiscountAmount.toFixed(2),
                    currency_code: 'EUR'
                  } : undefined,
                  shipping: deliveryFee > 0 ? {
                    value: deliveryFee.toFixed(2),
                    currency_code: 'EUR'
                  } : undefined,
                  handling: (tipAmount + serviceFee) > 0 ? {
                    value: (tipAmount + serviceFee).toFixed(2),
                    currency_code: 'EUR'
                  } : undefined
                }
              },
              description: `LEO SUSHI Bestellung - ${cart.length} Artikel${window.appliedDiscount ? ` (Rabatt: ${window.appliedDiscount.code})` : ''}${automaticDiscountAmount > 0 ? ' (Inkl. 10% Auto-Rabatt)' : ''}`,
              items: cart.map(item => {
                const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                return {
                  name: item.name || 'Item',
                  unit_amount: {
                    value: itemPrice.toFixed(2),
                    currency_code: 'EUR'
                  },
                  quantity: (item.qty || item.quantity || 1).toString()
                };
              })
            }],
            application_context: {
              brand_name: 'LEO SUSHI',
              landing_page: 'NO_PREFERENCE',
              user_action: 'PAY_NOW',
              return_url: window.location.href,
              cancel_url: window.location.href
            }
          };
          console.log('📦 [PayPal createOrder] Order data:', JSON.stringify(orderData, null, 2));
          return actions.order.create(orderData).then(function (orderId) {
            console.log('✅ [PayPal createOrder] Order created successfully:', orderId);
            return orderId;
          }).catch(function (error) {
            console.error('❌ [PayPal createOrder] Error creating order:', error);
            throw error;
          });
        } catch (error) {
          console.error('❌ [PayPal createOrder] Exception creating order:', error);
          throw error;
        }
      },
      onApprove: async function (data, actions) {
        console.log('✅ [PayPal onApprove] Payment approved by user, capturing payment...');
        console.log('📦 [PayPal onApprove] PayPal Order ID:', data.orderID);

        // ⛔ IDEMPOTENCY GUARD: Ngăn chặn gọi onApprove nhiều lần
        if (window._paypalOrderSubmitting) {
          console.warn('⛔ [PayPal onApprove] BLOCKED: Order already being submitted! Ignoring duplicate onApprove call.');
          return;
        }
        window._paypalOrderSubmitting = true;
        console.log('🔒 [PayPal onApprove] Lock acquired: _paypalOrderSubmitting = true');

        // 🔥 HIỂN THỊ MÀN HÌNH KHÓA (LOADING) ĐỂ NGĂN KHÁCH TẮT TRÌNH DUYỆT SỚM
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'paypalProcessingOverlay';
        loadingDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); z-index: 99999; display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; font-family: sans-serif;">
                <div style="width: 50px; height: 50px; border: 5px solid #fff; border-top: 5px solid #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
                <h2 style="margin:0; padding:0; text-align:center;">Zahlung erfolgreich!</h2>
                <p style="font-size: 18px; font-weight: bold; margin-top: 10px; color: #d4af37; text-align:center;">Ihre Bestellung wird gespeichert. Bitte schließen Sie diese Seite NICHT...</p>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            </div>
        `;
        document.body.appendChild(loadingDiv);

        // Capture on the server whenever the durable flow created this PayPal
        // order. The webhook can then finish the order if the app disappears.
        const capturePromise = (window._paypalServerFlow && window._paypalServerOrderId === data.orderID)
          ? fetch((window.API_BASE_URL || '/api') + '/paypal-capture-order.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paypal_order_id: data.orderID })
            }).then(async response => {
              let result = {};
              try { result = await response.json(); } catch (e) {}
              if (!response.ok || !result.success || !result.paypal_details) {
                throw new Error(result.message || 'PayPal konnte serverseitig nicht bestätigt werden.');
              }
              const details = result.paypal_details;
              details._leo_server_saved = !!result.order_id;
              details._leo_order_id = result.order_id || null;
              details._leo_server_processing = !!result.processing;
              return details;
            })
          : actions.order.capture();

        return capturePromise.then(async function (details) {
          console.log('✅ [PayPal onApprove] Payment CAPTURED successfully:', details.id);
          console.log('💰 [PayPal onApprove] Capture status:', details.status);
          console.log('💰 [PayPal onApprove] Amount:', details.purchase_units[0]?.payments?.captures[0]?.amount);
          const paypalCapture = details.purchase_units?.[0]?.payments?.captures?.[0] || {};

          // ✅ Chấp nhận COMPLETED, PENDING, PROCESSING (SEPA/Bank Transfer sẽ trả về PENDING)
          if (!['COMPLETED', 'PENDING', 'PROCESSING'].includes(details.status)) {
            console.error('❌ [PayPal onApprove] Capture status không hợp lệ:', details.status);
            window._paypalPaymentCompleted = false;
            window._paypalOrderSubmitting = false; // Release lock
            if (document.getElementById('paypalProcessingOverlay')) {
                document.getElementById('paypalProcessingOverlay').remove();
            }
            alert('⚠️ PayPal-Zahlung wurde nicht bestätigt oder abgelehnt. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.');
            return;
          }

          window._paypalPaymentCompleted = true;
          console.log('🎉 [PayPal onApprove] Cờ _paypalPaymentCompleted = true - tiến hành tạo đơn hàng...');

          // Get order data (similar to confirmPayment but for PayPal)
          const deliveryAddress = getDeliveryAddress();
          let orderId = `LEO-${Date.now()}`;
          const orderTimestamp = new Date().toISOString();

          // Get customer info from authentication
          let customerCode = null;
          let user = null;
          if (typeof getCurrentUser === 'function') {
            user = getCurrentUser();
            if (user) {
              customerCode = user.customerCode || null;
            }
          }

          // Calculate totals with discount
          const subtotal = typeof window.getTotal === 'function' ? window.getTotal() : 0;
          let deliveryFee = 0;
          if (window.selectedServiceType === 'delivery') {
            deliveryFee = 0; // Free within 5km
          }

          // Calculate automatic discount (10% if subtotal > 15€)
          let automaticDiscountAmount = 0;
          if (subtotal > 15) {
            automaticDiscountAmount = (subtotal * 10) / 100;
          }

          // Calculate discount code (applied after automatic discount)
          let discountAmount = 0;
          let discountCode = null;
          if (window.appliedDiscount) {
            const subtotalAfterAutoDiscount = subtotal - automaticDiscountAmount;
            if (window.appliedDiscount.percentage > 0) {
              discountAmount = (subtotalAfterAutoDiscount * window.appliedDiscount.percentage) / 100;
            } else {
              discountAmount = window.appliedDiscount.discount || 0;
            }
            discountCode = window.appliedDiscount.code;
          }

          // Total discount = automatic + code discount
          const totalDiscountAmount = automaticDiscountAmount + discountAmount;

          // Calculate tip
          let tipAmount = 0;
          if (window.selectedTip) {
            if (window.selectedTip.type === 'percent') {
              // Standardize: Tip is calculated on GROSS subtotal (before discounts) to match checkout.js
              tipAmount = (subtotal * window.selectedTip.value) / 100;
            } else if (window.selectedTip.type === 'custom') {
              tipAmount = window.selectedTip.amount || 0;
            }
          }

          // Calculate VAT (7% of subtotal after all discounts) - informational
          const vatAmount = ((subtotal - totalDiscountAmount) * 7) / 100;

          // Service fee (0% - Sync with checkout.js)
          const serviceFee = 0;

          const total = subtotal - totalDiscountAmount + deliveryFee + tipAmount + serviceFee;

          // Get cart
          const cart = typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]');

          // Prepare order data
          const orderData = {
            order_id: orderId,
            status: 'pending',
            service_type: selectedServiceType,
            table_number: null,
            items: cart.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.qty,
              description: item.desc || '',
              note: item.note || '',
              total: (item.price * item.qty).toFixed(2)
            })),
            delivery: {
              address: {
                ...deliveryAddress,
                customerCode: customerCode || null
              },
              fee: deliveryFee.toFixed(2)
            },
            customerCode: customerCode || null,
            summary: {
              item_count: cart.reduce((sum, item) => sum + item.qty, 0),
              subtotal: subtotal.toFixed(2),
              discount: discountAmount.toFixed(2),
              discount_code: discountCode || null,
              delivery_fee: deliveryFee.toFixed(2),
              tip: tipAmount.toFixed(2),
              serviceFee: serviceFee.toFixed(2),
              total: total.toFixed(2),
              payment_method: 'paypal',
              automatic_discount: automaticDiscountAmount > 0 ? {
                percentage: 10,
                amount: automaticDiscountAmount.toFixed(2)
              } : null,
              timestamp: orderTimestamp
            },
            createdAt: orderTimestamp,
            paypal_payment_id: details.id
          };

          // Fallback to PayPal payer info if checkout form fields are empty
          const payerEmail = deliveryAddress.email || details?.payer?.email_address || '';
          const payerFirstName = deliveryAddress.firstName || details?.payer?.name?.given_name || '';
          const payerLastName = deliveryAddress.lastName || details?.payer?.name?.surname || '';

          // Get branch info
          const branch = typeof window.getSelectedBranch === 'function' ? window.getSelectedBranch() : null;

          // Prepare API order data strictly matching the expected backend format
          const apiOrderData = {
            order_id: orderId,
            branch: branch,
            branch_id: branch ? branch.id : null,
            items: cart.map(item => ({
              name: item.name,
              quantity: item.qty || item.quantity || 1,
              total: ((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2) + ' €'
            })),
            service_type: (selectedServiceType === 'pickup') ? 'Abholung' : (selectedServiceType === 'dinein' ? 'Vor Ort' : 'Lieferung'),
            payment_method: 'PayPal',
            payment_status: 'paid', // Explicitly mark as paid since funds are captured
            order_total: total.toFixed(2) + ' €',
            customer: {
              firstName: payerFirstName,
              lastName: payerLastName,
              email: payerEmail,
              phone: deliveryAddress.phone || '',
              street: deliveryAddress.street || '',
              houseNumber: deliveryAddress.houseNumber || '',
              postal: deliveryAddress.postal || '',
              city: deliveryAddress.city || '',
              note: deliveryAddress.note || ''
            },
            discount_code: discountCode || null,
            promotion_id: window.appliedDiscount ? window.appliedDiscount.promotion_id : null,
            automatic_discount: automaticDiscountAmount > 0 ? {
              percentage: 10,
              amount: automaticDiscountAmount.toFixed(2) + ' €'
            } : null,
            tip: tipAmount > 0 ? tipAmount.toFixed(2) + ' €' : null,
            deliveryFee: deliveryFee > 0 ? deliveryFee.toFixed(2) + ' €' : null,
            vat: vatAmount > 0 ? vatAmount.toFixed(2) + ' €' : null,
            serviceFee: serviceFee > 0 ? serviceFee.toFixed(2) + ' €' : null,
            scheduled_delivery_time: (window.getScheduledDeliveryTime && window.getScheduledDeliveryTime()) || null,
            delivery_distance_km: window.selectedServiceType === 'delivery' ? (window.selectedDeliveryDistanceKm || null) : null,
            paypal_payment_id: details.id,
            paypal_order_id: details.id,
            paypal_capture_id: paypalCapture.id || null,
            paypal_capture_status: paypalCapture.status || details.status,
            paypal_capture_amount: paypalCapture.amount?.value || total.toFixed(2),
            paypal_capture_currency: paypalCapture.amount?.currency_code || 'EUR'
          };

          // Call API to create order
          let apiResult = null;
          if (details._leo_server_saved && details._leo_order_id) {
            apiResult = { success: true, order_id: details._leo_order_id, server_finalized: true };
            clearPendingPayPalOrder();
            console.log('✅ PayPal order was already finalized by the server:', details._leo_order_id);
          } else if (window.api && window.api.orders && window.api.orders.saveOrder) {
            console.log('📦 Sending PayPal order to API:', apiOrderData);
            try {
              apiResult = await savePayPalOrderReliably(apiOrderData);
              console.log('📦 API Response:', apiResult);
              if (!apiResult || !apiResult.success) {
                console.error('API declined order saving:', apiResult);
                if (typeof window.logCheckoutError === 'function') {
                  window.logCheckoutError('paypal_api_save_declined', apiResult ? apiResult.message : 'No response', {
                    name: (apiOrderData.customer?.firstName || '') + ' ' + (apiOrderData.customer?.lastName || ''),
                    phone: apiOrderData.customer?.phone || '',
                    email: apiOrderData.customer?.email || ''
                  }, apiOrderData.order_total, 'paypal');
                }
                alert('Zahlung war erfolgreich, aber es gab einen Fehler beim Speichern der Bestellung im System. Bitte kontaktieren Sie uns!');
                window._paypalOrderSubmitting = false;
                document.getElementById('paypalProcessingOverlay')?.remove();
                return;
              }
              if (apiResult.order_id) {
                orderId = apiResult.order_id;
                orderData.order_id = orderId;
              }
            } catch (apiErr) {
              console.error('API Error saving order:', apiErr);
              if (typeof window.logCheckoutError === 'function') {
                window.logCheckoutError('paypal_api_save_exception', apiErr.message, {
                  name: (apiOrderData.customer?.firstName || '') + ' ' + (apiOrderData.customer?.lastName || ''),
                  phone: apiOrderData.customer?.phone || '',
                  email: apiOrderData.customer?.email || ''
                }, apiOrderData.order_total, 'paypal');
              }
              alert('Zahlung war erfolgreich, aber das System konnte nicht erreicht werden.\n\nFehlerdetail: ' + apiErr.message + '\n\nBitte rufen Sie uns an!');
              window._paypalOrderSubmitting = false;
              document.getElementById('paypalProcessingOverlay')?.remove();
              return;
            }
          } else {
            console.error('API not found for saving order.');
            if (typeof window.logCheckoutError === 'function') {
              window.logCheckoutError('paypal_api_not_found', 'window.api.orders.saveOrder not defined', {
                name: (apiOrderData.customer?.firstName || '') + ' ' + (apiOrderData.customer?.lastName || ''),
                phone: apiOrderData.customer?.phone || '',
                email: apiOrderData.customer?.email || ''
              }, apiOrderData.order_total, 'paypal');
            }
            alert('Interner Systemfehler. Zahlung erfolgreich, aber Bestellung konnte nicht übermittelt werden.');
            window._paypalOrderSubmitting = false;
            document.getElementById('paypalProcessingOverlay')?.remove();
            return;
          }
          if (typeof window.rememberLeoOrder === 'function') {
            window.rememberLeoOrder({ ...apiOrderData, status: 'pending' }, orderId);
          }
          // Save customer info to localStorage for profile page (matching Cash flow)
          try {
            const customerKey = payerEmail.toLowerCase().trim();
            const customerInfo = {
              firstName: payerFirstName,
              lastName: payerLastName,
              email: payerEmail,
              phone: deliveryAddress.phone || '',
              street: deliveryAddress.street || '',
              houseNumber: deliveryAddress.houseNumber || '',
              postal: deliveryAddress.postal || '',
              city: deliveryAddress.city || '',
              note: deliveryAddress.note || '',
              customerCode: apiResult?.customer_code || apiOrderData.customer?.customerCode || null
            };

            const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
            savedCustomers[customerKey] = customerInfo;
            localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));

            if (customerInfo.customerCode) {
              localStorage.setItem('leo_customer_code', customerInfo.customerCode);
            }
            console.log('✅ [PayPal] Saved customer info to localStorage:', customerInfo);
          } catch (e) {
            console.error('Error saving customer to localStorage:', e);
          }

          // Save order ID to recent orders for polling (matching Cash flow)
          const recentOrders = JSON.parse(localStorage.getItem('leoRecentOrders') || '[]');
          if (orderId && !recentOrders.includes(orderId)) {
            recentOrders.unshift(orderId);
            if (recentOrders.length > 10) recentOrders.pop();
            localStorage.setItem('leoRecentOrders', JSON.stringify(recentOrders));
          }
          // Save order to daily report (local storage fallback)
          if (typeof window.saveOrderToDailyReport === 'function') {
            window.saveOrderToDailyReport(orderData);
          }

          // Mark discount code as used
          if (appliedDiscount && typeof markDiscountCodeUsed === 'function') {
            await markDiscountCodeUsed();
            appliedDiscount = null;
            window.appliedDiscount = null;
          }

          // Clear cart
          try {
            localStorage.removeItem('leoCart');
            localStorage.removeItem('cart');
            localStorage.setItem('leoCart', '[]');
            localStorage.setItem('cart', '[]');
            if (typeof window.clearAppCart === 'function') window.clearAppCart();
            if (typeof window.clearCart === 'function') window.clearCart();
            if (typeof window.cart !== 'undefined') window.cart = [];
            window.dispatchEvent(new Event('cartUpdated'));
            window.dispatchEvent(new Event('cart:updated'));
          } catch (e) {
            console.error('Error clearing cart:', e);
          }

          // Close payment modal
          closePaymentModal();

          // Ensure customer code is in deliveryAddress for display
          deliveryAddress.customerCode = customerCode || apiResult.customer_code || null;

          // Show beautiful success notification
          showOrderSuccessNotification(orderData, deliveryAddress, orderId);

          // Redirect to menu after 5 seconds to show success
          setTimeout(() => {
            window.location.href = 'menu.html';
          }, 5000);

          // Show success notification and redirect (matching Cash flow)
          console.log('🎉 [PayPal onApprove] Showing success notification...');
          const orderIdShort = orderId ? orderId.replace(/^(LEO-|ORD-)/, '') : 'N/A';

          if (window.addNotification && window.NOTIFICATION_TYPES) {
            window.addNotification(
              window.NOTIFICATION_TYPES.ORDER_SUCCESS,
              '✅ PayPal Zahlung erfolgreich!',
              `Ihre Bestellung #${orderIdShort} wurde bezahlt und aufgegeben. Sie werden zum Menü weitergeleitet.`,
              { orderId: orderId }
            );
          } else if (typeof showOrderSuccessNotification === 'function') {
            showOrderSuccessNotification(orderData, deliveryAddress, orderId);
          } else {
            alert('✅ Zahlung erfolgreich! Bestellnummer: ' + orderId);
          }

          // Disable the main order button to prevent double submission
          const confirmBtn = document.getElementById('confirmCheckoutBtn');
          if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '✅ Bezahlt & Aufgegeben';
          }

          // Redirect to menu page after a short delay
          setTimeout(() => {
            window._paypalOrderSubmitting = false; // Release lock before redirect
            window.location.href = 'menu.html';
          }, 2500);

          console.log('✅ [PayPal onApprove] Order processing completed');
        }).catch(async function (captureError) {
          console.error('❌ [PayPal onApprove] Error during capture:', captureError);
          // ⛔ Reset flags - order not created
          window._paypalPaymentCompleted = false;
          window._paypalOrderSubmitting = false; // Release lock on error

          if (document.getElementById('paypalProcessingOverlay')) {
              document.getElementById('paypalProcessingOverlay').remove();
          }

          let detailedError = captureError ? (captureError.message || JSON.stringify(captureError)) : 'Unknown capture error';
          
          if (typeof window.logCheckoutError === 'function') {
              window.logCheckoutError('paypal_capture_failed', detailedError, { name: 'Capture Failed' }, '0', 'paypal');
          }

          // Klare Benachrichtigung: BESTELLUNG FEHLGESCHLAGEN
          if (window.addNotification && window.NOTIFICATION_TYPES) {
            window.addNotification(
              window.NOTIFICATION_TYPES.ORDER_SUCCESS,
              '❌ Bestellung fehlgeschlagen!',
              'Die PayPal-Zahlung konnte nicht verarbeitet werden. Grund: ' + detailedError + '. Bitte versuchen Sie es erneut.',
              { error: true }
            );
          } else {
            alert('❌ Bestellung fehlgeschlagen!\n\nDie PayPal-Zahlung konnte nicht verarbeitet werden.\nGrund: ' + detailedError + '\n\nBitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.');
          }

          // UI aktualisieren - PayPal-Button wieder anzeigen
          const errContainer = document.getElementById('paypal-button-container');
          if (errContainer) {
            errContainer.innerHTML = `
              <div style="background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.5); border-radius: 10px; padding: 18px; text-align: center; color: #ff6b6b; margin-top: 8px;">
                <div style="font-size: 28px; margin-bottom: 8px;">❌</div>
                <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">Bestellung fehlgeschlagen</div>
                <div style="font-size: 13px; margin-bottom: 14px; opacity: 0.85;">PayPal-Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.</div>
                <button onclick="selectPaymentOption('paypal')" style="padding: 10px 20px; background: rgba(229,207,142,.2); border: 1px solid rgba(229,207,142,.5); border-radius: 8px; color: #e5cf8e; cursor: pointer; font-size: 14px; margin: 4px;">🔄 PayPal erneut versuchen</button>
                <button onclick="selectPaymentOption('cash')" style="padding: 10px 20px; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.4); border-radius: 8px; color: #10b981; cursor: pointer; font-size: 14px; margin: 4px;">💵 Barzahlung wählen</button>
              </div>
            `;
          }
        });
      },
      onError: function (err) {
        console.error('❌ [PayPal onError] PayPal error:', err);

        // ⛔ Reset flag - order not created
        window._paypalPaymentCompleted = false;
        console.log('⛔ [PayPal onError] Reset _paypalPaymentCompleted = false');

        // Extract error details
        let errorMessage = '❌ PayPal-Zahlung fehlgeschlagen!';
        let errorDetails = 'Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.';

        // Log checkout error to server
        if (typeof window.logCheckoutError === 'function') {
          const savedAddr = localStorage.getItem('delivery_address');
          let custName = 'Gast';
          let custPhone = 'N/A';
          let custEmail = 'N/A';
          let totalStr = '0.00 €';
          try {
            if (savedAddr) {
              const addr = JSON.parse(savedAddr);
              custName = ((addr.firstName || addr.first_name || '') + ' ' + (addr.lastName || addr.last_name || '')).trim() || 'Gast';
              custPhone = addr.phone || 'N/A';
              custEmail = addr.email || 'N/A';
            }
            const totalEl = document.getElementById('paymentModalTotal') || document.getElementById('cart-total-value');
            if (totalEl) {
              totalStr = totalEl.innerText || totalEl.textContent;
            }
          } catch(e){}
          
          window.logCheckoutError(
            'paypal_button_onerror',
            'PayPal Button triggered onError. Details: ' + errorDetails + ' | Raw error: ' + (err ? (err.message || (typeof err === 'string' ? err : JSON.stringify(err))) : 'No error object'),
            { name: custName, phone: custPhone, email: custEmail },
            totalStr,
            'paypal'
          );
        }

        if (err && err.data && err.data.body) {
          const body = err.data.body;
          if (body.name === 'UNPROCESSABLE_ENTITY') {
            if (body.details && body.details.length > 0) {
              const detail = body.details[0];
              if (detail.issue === 'PAYEE_ACCOUNT_RESTRICTED') {
                errorMessage = '❌ PayPal derzeit nicht verfügbar';
                errorDetails = 'Das PayPal-Konto des Restaurants ist eingeschränkt.\nBitte wählen Sie eine andere Zahlungsmethode: Barzahlung oder Kartenzahlung.';
              } else {
                errorDetails = detail.description || body.message || errorDetails;
              }
            } else {
              errorDetails = body.message || errorDetails;
            }
          } else {
            errorDetails = body.message || err.message || errorDetails;
          }
        } else if (err && err.message) {
          errorDetails = err.message;
        }

        // Klare Fehlermeldung — BESTELLUNG FEHLGESCHLAGEN
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '❌ Bestellung fehlgeschlagen!',
            errorMessage.replace('❌ ', '') + ' — ' + errorDetails + '\nIhre Bestellung wurde nicht aufgegeben.',
            { error: true }
          );
        } else {
          alert('❌ Bestellung fehlgeschlagen!\n\n' + errorMessage.replace('❌ ', '') + '\n' + errorDetails + '\n\nIhre Bestellung wurde nicht aufgegeben.');
        }

        // UI im PayPal-Button-Container aktualisieren
        const paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer) {
          paypalContainer.innerHTML = `
            <div style="background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.5); border-radius: 10px; padding: 18px; text-align: center; color: #ff6b6b; margin-top: 8px;">
              <div style="font-size: 28px; margin-bottom: 8px;">❌</div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Bestellung fehlgeschlagen</div>
              <div style="font-size: 13px; margin-bottom: 6px; font-weight: 600;">${errorMessage.replace('❌ ', '')}</div>
              <div style="font-size: 12px; margin-bottom: 14px; opacity: 0.85;">${errorDetails}</div>
              <button onclick="selectPaymentOption('paypal')" style="padding: 10px 20px; background: rgba(229,207,142,.2); border: 1px solid rgba(229,207,142,.5); border-radius: 8px; color: #e5cf8e; cursor: pointer; font-size: 14px; margin: 4px;">🔄 PayPal erneut versuchen</button>
              <button onclick="selectPaymentOption('cash')" style="padding: 10px 20px; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.4); border-radius: 8px; color: #10b981; cursor: pointer; font-size: 14px; margin: 4px;">💵 Barzahlung wählen</button>
            </div>
          `;
        }
      },
      onCancel: function (data) {
        if(typeof window.logActivity==='function')window.logActivity('paypal_cancelled', 'Khách hàng đã tắt cửa sổ PayPal', {}, '0.00 €', 'paypal', typeof window.getCart === 'function' ? window.getCart() : JSON.parse(localStorage.getItem('leoCart') || '[]'));
        console.log('⚠️ [PayPal onCancel] User cancelled PayPal payment:', data);
        // ⛔ Reset flag - order not created
        window._paypalPaymentCompleted = false;
        console.log('⛔ [PayPal onCancel] Reset _paypalPaymentCompleted = false - order not created');

        // Klare Benachrichtigung: BESTELLUNG NICHT AUFGEGEBEN
        if (window.addNotification && window.NOTIFICATION_TYPES) {
          window.addNotification(
            window.NOTIFICATION_TYPES.ORDER_SUCCESS,
            '⚠️ Bestellung nicht aufgegeben',
            'Sie haben die PayPal-Zahlung abgebrochen. Ihre Bestellung wurde nicht aufgegeben. Ihr Warenkorb bleibt erhalten — Sie können es erneut versuchen oder eine andere Zahlungsmethode wählen.',
            { error: true }
          );
        } else {
          alert('⚠️ Bestellung nicht aufgegeben!\n\nSie haben die PayPal-Zahlung abgebrochen.\nIhre Bestellung wurde nicht aufgegeben.\n\nIhr Warenkorb bleibt erhalten. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.');
        }

        // UI aktualisieren - Optionen wieder anzeigen
        const paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer) {
          paypalContainer.innerHTML = `
            <div style="background: rgba(229,207,142,.08); border: 1px solid rgba(229,207,142,.3); border-radius: 10px; padding: 18px; text-align: center; color: rgba(255,255,255,0.85); margin-top: 8px;">
              <div style="font-size: 28px; margin-bottom: 8px;">⚠️</div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px; color: #f59e0b;">Bestellung nicht aufgegeben</div>
              <div style="font-size: 13px; margin-bottom: 14px; opacity: 0.75;">Sie haben die Zahlung abgebrochen. Ihr Warenkorb bleibt erhalten.</div>
              <button onclick="selectPaymentOption('paypal')" style="padding: 10px 20px; background: rgba(229,207,142,.2); border: 1px solid rgba(229,207,142,.5); border-radius: 8px; color: #e5cf8e; cursor: pointer; font-size: 14px; margin: 4px;">🔄 Erneut mit PayPal bezahlen</button>
              <button onclick="selectPaymentOption('cash')" style="padding: 10px 20px; background: rgba(16,185,129,.15); border: 1px solid rgba(16,185,129,.4); border-radius: 8px; color: #10b981; cursor: pointer; font-size: 14px; margin: 4px;">💵 Barzahlung wählen</button>
            </div>
          `;
        }
      }
    }).render('#paypal-button-container');
    console.log('✅ [renderPayPalButton] PayPal button rendered successfully');
  } catch (error) {
    console.error('❌ [renderPayPalButton] Error rendering PayPal button:', error);
    container.innerHTML = '<p style="color: #ef4444; padding: 10px;">Fehler beim Laden des PayPal-Buttons. Bitte versuchen Sie es erneut.</p>';
  }
}

// Tip functions
function selectTip(percent) {
  selectedTip = {
    type: 'percent',
    value: percent,
    amount: 0 // Will be calculated in updatePaymentSummary
  };
  window.selectedTip = selectedTip;

  // Update UI
  document.querySelectorAll('.tip-option').forEach(btn => {
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });

  const selectedBtn = document.querySelector(`.tip-option[data-tip-percent="${percent}"]`);
  if (selectedBtn) {
    selectedBtn.style.borderColor = 'var(--gold)';
    selectedBtn.style.background = 'linear-gradient(135deg, rgba(194,163,85,.2), rgba(229,207,142,.1))';
  }

  // Hide custom input
  const customInput = document.querySelector('.tip-custom-input');
  if (customInput) customInput.style.display = 'none';

  // Update summary
  if (typeof updatePaymentSummary === 'function') {
    updatePaymentSummary();
  }
}

function openCustomTip() {
  // Show custom input
  const customInput = document.querySelector('.tip-custom-input');
  if (customInput) {
    customInput.style.display = 'block';
    const input = document.getElementById('customTipAmount');
    if (input) {
      input.focus();
      input.value = selectedTip && selectedTip.type === 'custom' ? selectedTip.amount : '';
    }
  }

  // Update button styles
  document.querySelectorAll('.tip-option').forEach(btn => {
    if (btn.classList.contains('tip-custom')) {
      btn.style.borderColor = 'var(--gold)';
      btn.style.background = 'linear-gradient(135deg, rgba(194,163,85,.2), rgba(229,207,142,.1))';
    } else {
      btn.style.borderColor = 'rgba(229,207,142,.2)';
      btn.style.background = 'rgba(255,255,255,.05)';
    }
  });
}

function updateCustomTip(value) {
  const amount = parseFloat(value) || 0;
  selectedTip = {
    type: 'custom',
    value: 0,
    amount: amount
  };
  window.selectedTip = selectedTip;

  if (typeof updatePaymentSummary === 'function') {
    updatePaymentSummary();
  }
}

function clearTip() {
  selectedTip = null;
  window.selectedTip = null;

  // Reset UI
  document.querySelectorAll('.tip-option').forEach(btn => {
    btn.style.borderColor = 'rgba(229,207,142,.2)';
    btn.style.background = 'rgba(255,255,255,.05)';
  });

  const customInput = document.querySelector('.tip-custom-input');
  if (customInput) customInput.style.display = 'none';
  const customAmountInput = document.getElementById('customTipAmount');
  if (customAmountInput) customAmountInput.value = '';

  if (typeof updatePaymentSummary === 'function') {
    updatePaymentSummary();
  }
}

function updateTipOptions() {
  if (typeof getTotal !== 'function') return;

  const subtotal = getTotal();
  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = (subtotal * appliedDiscount.percentage) / 100;
  }
  const amountAfterDiscount = subtotal - discountAmount;

  // Update tip option amounts
  [5, 10, 15].forEach(percent => {
    const btn = document.querySelector(`.tip-option[data-tip-percent="${percent}"]`);
    if (btn) {
      const tipAmount = (amountAfterDiscount * percent) / 100;
      const amountEl = btn.querySelector('.tip-amount');
      if (amountEl && typeof formatPrice === 'function') {
        amountEl.textContent = formatPrice(tipAmount);
      }
    }
  });

  // Update selected tip display
  const selectedTipEl = document.getElementById('selectedTipAmount');
  if (selectedTipEl) {
    let tipAmount = 0;
    if (selectedTip) {
      if (selectedTip.type === 'percent') {
        tipAmount = (amountAfterDiscount * selectedTip.value) / 100;
      } else if (selectedTip.type === 'custom') {
        tipAmount = selectedTip.amount || 0;
      }
    }
    if (typeof formatPrice === 'function') {
      selectedTipEl.textContent = formatPrice(tipAmount);
    }
  }
}

// Expose functions globally
window.renderPayPalButton = renderPayPalButton;
window.showOrderSuccessNotification = showOrderSuccessNotification;
window.closeOrderSuccessNotification = closeOrderSuccessNotification;
window.selectTip = selectTip;
window.openCustomTip = openCustomTip;
window.updateCustomTip = updateCustomTip;
window.clearTip = clearTip;
// Don't expose autoFillUserInfo - checkout.js will handle it to avoid conflicts
