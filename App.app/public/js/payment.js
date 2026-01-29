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
  const street = document.getElementById('deliveryStreet')?.value.trim() || '';
  const postal = document.getElementById('deliveryPostal')?.value.trim() || '';
  const city = document.getElementById('deliveryCity')?.value.trim() || '';
  const note = document.getElementById('deliveryNote')?.value.trim() || '';
  const customerPhone = document.getElementById('customerPhone')?.value.trim() || '';
  const customerEmail = document.getElementById('customerEmail')?.value.trim() || '';
  
  return {
    firstName: customerFirstName,
    lastName: customerLastName,
    street: street,
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
      switch(error.code) {
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
  window.location.href = 'checkout.html';
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
    // Pickup - show delivery address but make it optional, show table status
    if (deliveryAddressSection) deliveryAddressSection.style.display = 'block';
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
      if (scheduledTime && !scheduledTime.value) {
        const now = new Date();
        const minTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
        const hours = String(minTime.getHours()).padStart(2, '0');
        const minutes = String(minTime.getMinutes()).padStart(2, '0');
        scheduledTime.value = `${hours}:${minutes}`;
      }
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
    
    // Validate that the scheduled time is at least 30 minutes from now
    const now = new Date();
    const scheduledDateTime = new Date(`${date}T${time}`);
    const minDateTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now
    
    if (scheduledDateTime < minDateTime) {
      errorDiv.style.display = 'block';
      const minTimeStr = minDateTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
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
  const paypalButtonContainer = document.getElementById('paypalButtonContainer');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  
  console.log('🔍 [selectPaymentOption] Elements found:', {
    cashOption: !!cashOption,
    cardOption: !!cardOption,
    paypalOption: !!paypalOption,
    paypalButtonContainer: !!paypalButtonContainer,
    confirmPaymentBtn: !!confirmPaymentBtn
  });
  
  if (cashOption) cashOption.classList.remove('selected');
  if (cardOption) cardOption.classList.remove('selected');
  if (paypalOption) paypalOption.classList.remove('selected');
  
  // Hide PayPal button container by default
  if (paypalButtonContainer) {
    paypalButtonContainer.style.display = 'none';
    // Clear existing PayPal buttons
    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';
  }
  
  // Show/hide confirm button based on payment method
  if (confirmPaymentBtn) {
    confirmPaymentBtn.style.display = method === 'paypal' ? 'none' : 'block';
  }
  
  if (method === 'cash' && cashOption) {
    cashOption.classList.add('selected');
  } else if (method === 'card' && cardOption) {
    cardOption.classList.add('selected');
  } else if (method === 'paypal' && paypalOption) {
    console.log('💳 [selectPaymentOption] PayPal selected');
    paypalOption.classList.add('selected');
    // Show PayPal button container and render PayPal button
    if (paypalButtonContainer) {
      console.log('✅ [selectPaymentOption] PayPal container found, showing...');
      paypalButtonContainer.style.display = 'block';
      console.log('✅ [selectPaymentOption] PayPal container shown, rendering button...');
      if (typeof renderPayPalButton === 'function') {
        console.log('✅ [selectPaymentOption] renderPayPalButton function found, calling...');
        renderPayPalButton();
      } else {
        console.error('❌ [selectPaymentOption] renderPayPalButton function not found!');
        console.error('❌ [selectPaymentOption] typeof renderPayPalButton:', typeof renderPayPalButton);
      }
    } else {
      console.error('❌ [selectPaymentOption] paypalButtonContainer not found!');
    }
  } else {
    console.log('⚠️ [selectPaymentOption] Method not matched:', method);
  }
}

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
        service_type: 'pickup',
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
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    // Validate phone format (more flexible - accepts various formats)
    const phoneClean = customerPhone.replace(/[\s\-\+\(\)]/g, ''); // Remove spaces, dashes, plus, parentheses
    const phoneRegex = /^[\d]{8,15}$/; // 8-15 digits only
    if (!phoneRegex.test(phoneClean)) {
      alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
  }
  
  if (!selectedPaymentMethod) {
    alert('Bitte wählen Sie eine Zahlungsmethode aus.');
    return;
  }
  
  // For delivery, address is required and must be within range
  // Only validate if service type is delivery AND reservation section is not visible
  if (selectedServiceType === 'delivery' && !isReservationVisible) {
    if (!street || !postal || !city) {
      alert('Bitte füllen Sie die Lieferadresse aus.');
      return;
    }
    
    // Validate postal code for delivery
    if (postal && !/^\d{5}$/.test(postal)) {
      alert('Bitte geben Sie eine gültige 5-stellige PLZ ein.\n\nBeispiel: 13187');
      return;
    }
    
    // Check if address is within delivery range (5km)
    const rangeCheck = await checkDeliveryRange(street, postal, city);
    if (!rangeCheck.withinRange) {
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
  
  // Service fee (3% of subtotal after discount)
  const serviceFee = ((subtotal - discountAmount) * 0.03);
  
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
  console.log('🔄 [renderPayPalButton] Container cleared, calculating totals...');
  
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
  
  // Calculate discount
  let discountAmount = 0;
  if (window.appliedDiscount) {
    if (window.appliedDiscount.percentage > 0) {
      discountAmount = (subtotal * window.appliedDiscount.percentage) / 100;
    } else {
      discountAmount = window.appliedDiscount.discount || 0;
    }
  }
  
  const total = subtotal - discountAmount + deliveryFee;
  console.log('💰 [renderPayPalButton] Total calculated:', {
    subtotal,
    discountAmount,
    deliveryFee,
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
    createOrder: function(data, actions) {
      console.log('🔄 [PayPal createOrder] Creating order with total:', total.toFixed(2));
      console.log('🛒 [PayPal createOrder] Cart items:', cart.length);
      // Create order on PayPal
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
                discount: discountAmount > 0 ? {
                  value: discountAmount.toFixed(2),
                  currency_code: 'EUR'
                } : undefined,
                shipping: deliveryFee > 0 ? {
                  value: deliveryFee.toFixed(2),
                  currency_code: 'EUR'
                } : undefined
              }
            },
            description: `LEO SUSHI Bestellung - ${cart.length} Artikel${window.appliedDiscount ? ` (Rabatt: ${window.appliedDiscount.code})` : ''}`,
            items: cart.map(item => ({
              name: item.name || 'Item',
              unit_amount: {
                value: item.price.toFixed(2),
                currency_code: 'EUR'
              },
              quantity: (item.qty || item.quantity || 1).toString()
            }))
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
        return actions.order.create(orderData).then(function(orderId) {
          console.log('✅ [PayPal createOrder] Order created successfully:', orderId);
          return orderId;
        }).catch(function(error) {
          console.error('❌ [PayPal createOrder] Error creating order:', error);
          throw error;
        });
      } catch (error) {
        console.error('❌ [PayPal createOrder] Exception creating order:', error);
        throw error;
      }
    },
    onApprove: async function(data, actions) {
      console.log('✅ [PayPal onApprove] Payment approved, capturing...');
      console.log('📦 [PayPal onApprove] Order ID:', data.orderID);
      // Capture the payment
      return actions.order.capture().then(async function(details) {
        console.log('✅ [PayPal onApprove] Payment captured successfully:', details);
        console.log('💰 [PayPal onApprove] Payment amount:', details.purchase_units[0]?.payments?.captures[0]?.amount);
        
        // Get order data (similar to confirmPayment but for PayPal)
        const deliveryAddress = getDeliveryAddress();
        const orderId = `ORD-${Date.now()}`;
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
        
        let discountAmount = 0;
        let discountCode = null;
        if (window.appliedDiscount) {
          if (window.appliedDiscount.percentage > 0) {
            discountAmount = (subtotal * window.appliedDiscount.percentage) / 100;
          } else {
            discountAmount = window.appliedDiscount.discount || 0;
          }
          discountCode = window.appliedDiscount.code;
        }
        
        // Calculate tip
        let tipAmount = 0;
        if (window.selectedTip) {
          if (window.selectedTip.type === 'percent') {
            const amountAfterDiscount = subtotal - discountAmount;
            tipAmount = (amountAfterDiscount * window.selectedTip.value) / 100;
          } else if (window.selectedTip.type === 'custom') {
            tipAmount = window.selectedTip.amount || 0;
          }
        }
        
        // Service fee (3% of subtotal after discount)
        const serviceFee = ((subtotal - discountAmount) * 0.03);
        
        const total = subtotal - discountAmount + deliveryFee + tipAmount + serviceFee;
        
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
            service_fee: serviceFee.toFixed(2),
            total: total.toFixed(2),
            payment_method: 'paypal',
            timestamp: orderTimestamp
          },
          createdAt: orderTimestamp,
          paypal_payment_id: details.id
        };
        
        // Save order
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
        if (typeof window.clearCart === 'function') {
          window.clearCart();
        } else {
          localStorage.setItem('leoCart', '[]');
        }
        
        // Close payment modal
        if (typeof closePaymentModal === 'function') {
          closePaymentModal();
        }
        
        // Show success notification
        console.log('🎉 [PayPal onApprove] Showing success notification...');
        if (typeof showOrderSuccessNotification === 'function') {
          showOrderSuccessNotification(orderData, deliveryAddress, orderId);
        } else {
          console.error('❌ [PayPal onApprove] showOrderSuccessNotification function not found!');
          alert('✅ Zahlung erfolgreich! Bestellnummer: ' + orderId);
        }
        
        console.log('✅ [PayPal onApprove] Order processing completed');
      }).catch(function(error) {
        console.error('❌ [PayPal onApprove] Error capturing payment:', error);
        alert('Fehler beim Verarbeiten der Zahlung. Bitte kontaktieren Sie uns mit Ihrer Bestellnummer.');
      });
    },
    onError: function(err) {
      console.error('❌ [PayPal onError] PayPal error:', err);
      console.error('❌ [PayPal onError] Error details:', JSON.stringify(err, null, 2));
      
      // Extract error details
      let errorMessage = 'Fehler bei der PayPal-Zahlung.';
      let errorDetails = '';
      
      if (err && err.data && err.data.body) {
        const body = err.data.body;
        if (body.name === 'UNPROCESSABLE_ENTITY') {
          if (body.details && body.details.length > 0) {
            const detail = body.details[0];
            if (detail.issue === 'PAYEE_ACCOUNT_RESTRICTED') {
              errorMessage = 'PayPal-Zahlung nicht verfügbar';
              errorDetails = 'Das PayPal-Merchant-Konto ist derzeit eingeschränkt. Bitte verwenden Sie eine andere Zahlungsmethode (Barzahlung oder Kartenzahlung).';
            } else {
              errorDetails = detail.description || body.message || '';
            }
          } else {
            errorDetails = body.message || '';
          }
        } else {
          errorDetails = body.message || err.message || '';
        }
      } else if (err && err.message) {
        errorDetails = err.message;
      }
      
      if (errorDetails) {
        errorMessage += '\n\n' + errorDetails;
      }
      
      console.error('❌ [PayPal onError] Final error message:', errorMessage);
      alert(errorMessage);
    },
    onCancel: function(data) {
      console.log('⚠️ [PayPal onCancel] User cancelled PayPal payment:', data);
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
