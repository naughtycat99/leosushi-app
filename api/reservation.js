// Reservation Module
// Note: TOTAL_TABLES and RESERVATION_DURATION_MINUTES are defined in config.js

// Get available tables for a specific date and time (from Firebase - primary source)
async function getAvailableTables(date, time) {
  if (!date || !time) return [];

  const reservationDateTime = new Date(`${date}T${time}`);
  const reservationEndTime = new Date(reservationDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);

  // Get reservations from Firebase (primary source - syncs across all devices)
  let reservations = [];
  if (typeof db !== 'undefined' && db && typeof getAllReservationsFromFirebase === 'function') {
    try {
      reservations = await getAllReservationsFromFirebase(date) || [];
    } catch (e) {
      console.error('Error loading reservations from Firebase:', e);
      // Fallback to empty array if Firebase fails
      reservations = [];
    }
  }

  const allTables = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1);

  const reservedTables = reservations
    .filter(res => {
      if (!res.tableNumber) return false;
      const resDateTime = new Date(`${res.date}T${res.time}`);
      const resEndTime = new Date(resDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);
      return (reservationDateTime < resEndTime && reservationEndTime > resDateTime);
    })
    .map(res => res.tableNumber);

  return allTables.filter(table => !reservedTables.includes(table));
}

// Get table status for a specific date and time (from Firebase - primary source)
async function getTableStatus(date, time) {
  if (!date || !time) {
    return Array.from({ length: TOTAL_TABLES }, (_, i) => ({
      number: i + 1,
      status: 'available'
    }));
  }

  const reservationDateTime = new Date(`${date}T${time}`);
  const reservationEndTime = new Date(reservationDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);

  // Get reservations from Firebase (primary source - syncs across all devices)
  let reservations = [];
  if (typeof db !== 'undefined' && db && typeof getAllReservationsFromFirebase === 'function') {
    try {
      reservations = await getAllReservationsFromFirebase(date) || [];
    } catch (e) {
      console.error('Error loading reservations from Firebase:', e);
      // Fallback to empty array if Firebase fails
      reservations = [];
    }
  }

  const tableStatus = Array.from({ length: TOTAL_TABLES }, (_, i) => {
    const tableNumber = i + 1;
    const tableReservations = reservations.filter(res => res.tableNumber === tableNumber);

    const isReserved = tableReservations.some(res => {
      const resDateTime = new Date(`${res.date}T${res.time}`);
      const resEndTime = new Date(resDateTime.getTime() + RESERVATION_DURATION_MINUTES * 60000);
      return (reservationDateTime < resEndTime && reservationEndTime > resDateTime);
    });

    return {
      number: tableNumber,
      status: isReserved ? 'reserved' : 'available'
    };
  });

  return tableStatus;
}

// Render table selection UI
async function renderTableSelection(date, time, containerId = 'tableSelectionContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show loading state
  container.innerHTML = '<p style="color: rgba(255,255,255,.7); text-align: center; padding: 20px;">Tische werden geladen...</p>';

  const tableStatus = await getTableStatus(date, time);
  const availableTables = await getAvailableTables(date, time);

  const gridId = containerId === 'reservationTableSelectionContainer' ? 'reservationTableGrid' : 'tableGrid';
  const inputId = 'selectedTable';

  container.innerHTML = `
    <div class="table-selection-header">
      <h4>Bitte wählen Sie einen Tisch</h4>
      <div class="table-legend">
        <span class="legend-item"><span class="legend-color available"></span> Verfügbar</span>
        <span class="legend-item"><span class="legend-color reserved"></span> Reserviert</span>
      </div>
    </div>
    <div class="table-grid" id="${gridId}">
      ${tableStatus.map(table => `
        <button 
          type="button"
          class="table-btn ${table.status} ${availableTables.includes(table.number) ? 'selectable' : ''}"
          data-table="${table.number}"
          ${!availableTables.includes(table.number) ? 'disabled' : ''}
          onclick="selectTable(${table.number})"
        >
          <span class="table-number">${table.number}</span>
          <span class="table-status">${table.status === 'available' ? '✓' : '✗'}</span>
        </button>
      `).join('')}
    </div>
    <input type="hidden" id="${inputId}" name="${inputId}" value="">
  `;
}

// Select table
function selectTable(tableNumber) {
  const selectedTableInput = document.getElementById('selectedTable');
  if (selectedTableInput) {
    selectedTableInput.value = tableNumber;
  }

  document.querySelectorAll('.table-btn.selectable').forEach(btn => {
    btn.classList.remove('selected');
  });

  const selectedBtn = document.querySelector(`.table-btn[data-table="${tableNumber}"]`);
  if (selectedBtn && selectedBtn.classList.contains('selectable')) {
    selectedBtn.classList.add('selected');
  }
}

// Make selectTable globally available
window.selectTable = selectTable;

// Setup table selection listeners
function setupTableSelectionListeners() {
  const dateInput = document.getElementById('reserveDate');
  const timeInput = document.getElementById('reserveTime');

  const updateTableSelection = async () => {
    const date = dateInput?.value;
    const time = timeInput?.value;
    if (date && time) {
      await renderTableSelection(date, time);
    }
  };

  if (dateInput) {
    dateInput.addEventListener('change', updateTableSelection);
  }

  if (timeInput) {
    timeInput.addEventListener('change', updateTableSelection);
  }
}

// Setup reservation form
function setupReservationForm() {
  const dateInput = document.getElementById('reserveDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const overlay = document.getElementById('reservationOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeReservationModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('reservationModal');
      if (modal && modal.style.display === 'flex') {
        closeReservationModal();
      }
    }
  });

  setupTableSelectionListeners();
}

// Open reservation modal
function openReservationModal() {
  console.log('🔍 openReservationModal called');

  // First, close payment modal if it's open
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal && paymentModal.style.display === 'flex') {
    console.log('🔒 Closing payment modal first...');
    if (typeof window.closePaymentModal === 'function') {
      window.closePaymentModal();
    }
    // Wait a bit for payment modal to close
    setTimeout(() => {
      openReservationModalInternal();
    }, 200);
    return;
  }

  openReservationModalInternal();
}

function openReservationModalInternal() {
  const modal = document.getElementById('reservationModal');
  const overlay = document.getElementById('reservationOverlay');
  console.log('🔍 openReservationModalInternal - Modal element:', modal);
  console.log('🔍 openReservationModalInternal - Overlay element:', overlay);

  if (!modal) {
    console.error('❌ reservationModal element not found!');
    alert('Fehler: Reservierungs-Formular wurde nicht gefunden. Bitte laden Sie die Seite neu.');
    return;
  }

  // Check if this is the correct modal (should have id="reservationModal")
  if (modal.id !== 'reservationModal') {
    console.error('❌ Wrong modal! Expected reservationModal, got:', modal.id);
    return;
  }

  console.log('✅ Found correct reservationModal with id:', modal.id);

  if (!overlay) {
    console.warn('⚠️ reservationOverlay element not found, but continuing...');
  }

  // Ensure payment modal is closed and hidden
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    console.log('🔒 Ensuring payment modal is closed...');
    paymentModal.style.display = 'none';
    paymentModal.style.opacity = '0';
    paymentModal.style.visibility = 'hidden';
    paymentModal.style.zIndex = '0';
  }

  const dateInput = document.getElementById('reserveDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const selectedTableInput = document.getElementById('selectedTable');
  if (selectedTableInput) {
    selectedTableInput.value = '';
  }

  // Show modal - ensure it's visible and on top
  console.log('📋 Setting modal display properties...');
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '0';
  modal.style.zIndex = '10001'; // Higher than payment modal
  if (overlay) {
    overlay.style.display = 'block';
    overlay.classList.add('active');
    overlay.style.zIndex = '10000';
  }
  document.body.style.overflow = 'hidden';

  // Force reflow to ensure display change is applied
  void modal.offsetHeight;

  setTimeout(() => {
    modal.style.opacity = '1';
    console.log('✅ Reservation modal (FORM CŨ) should now be visible');
    console.log('Modal ID:', modal.id);
    console.log('Modal computed style display:', window.getComputedStyle(modal).display);
    console.log('Modal computed style opacity:', window.getComputedStyle(modal).opacity);
    console.log('Modal computed style z-index:', window.getComputedStyle(modal).zIndex);
    console.log('Modal computed style visibility:', window.getComputedStyle(modal).visibility);

    // Verify payment modal is not visible
    if (paymentModal) {
      const paymentDisplay = window.getComputedStyle(paymentModal).display;
      console.log('Payment modal display:', paymentDisplay);
      if (paymentDisplay !== 'none') {
        console.warn('⚠️ Payment modal is still visible! Forcing it closed...');
        paymentModal.style.display = 'none';
      }
    }

    // Auto-fill reservation form with user info
    autoFillReservationInfo();

    // Setup customer code auto-fill for reservation form
    if (typeof window.setupReservationCustomerCodeAutoFill === 'function') {
      setTimeout(() => {
        window.setupReservationCustomerCodeAutoFill();
      }, 100);
    }

    // IMPORTANT: Update cart display AFTER modal is visible
    // Call multiple times with increasing delays to ensure container is ready
    const updateCart = () => {
      console.log('🔄 Attempting to update cart display...');
      const container = document.getElementById('reservationCartItems');
      if (container) {
        console.log('✅ Container found, calling updateReservationCartDisplay');
        if (typeof window.updateReservationCartDisplay === 'function') {
          window.updateReservationCartDisplay();
        } else if (typeof updateReservationCartDisplay === 'function') {
          updateReservationCartDisplay();
        } else {
          console.error('❌ updateReservationCartDisplay function not found!');
        }
      } else {
        console.warn('⚠️ Container not found yet, will retry...');
      }
    };

    // Call immediately after modal becomes visible
    setTimeout(updateCart, 50);
    setTimeout(updateCart, 150);
    setTimeout(updateCart, 300);
    setTimeout(updateCart, 500);
    setTimeout(updateCart, 800);
  }, 10);

  setupTableSelectionListeners();
}

// Close reservation modal
function closeReservationModal() {
  // Clear reservation flag when closing modal
  localStorage.removeItem('leoSelectingForReservation');
  const modal = document.getElementById('reservationModal');
  const overlay = document.getElementById('reservationOverlay');
  if (!modal) return;

  console.log('🔒 Closing reservation modal...');

  // Immediately hide overlay to prevent blocking clicks
  if (overlay) {
    overlay.style.display = 'none';
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '0';
    overlay.classList.remove('active');
    overlay.style.pointerEvents = 'none';
  }

  modal.style.opacity = '0';
  modal.style.visibility = 'hidden';
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.zIndex = '';
    modal.style.visibility = 'hidden';
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.zIndex = '';
      overlay.style.visibility = 'hidden';
      overlay.style.pointerEvents = 'none';
    }
    console.log('✅ Reservation modal closed');

    // Ensure cart can be opened again after closing modal
    // Reset any styles that might prevent cart from opening
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
      cartToggle.style.pointerEvents = 'auto';
      cartToggle.style.zIndex = '';
    }

    // Also ensure payment modal can be opened
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
      paymentModal.style.pointerEvents = 'auto';
    }

    // Force a reflow to ensure all changes are applied
    void document.body.offsetHeight;
  }, 300);
}

// Open menu page for reservation
function openMenuForReservation() {
  localStorage.setItem('leoSelectingForReservation', 'true');
  closeReservationModal();

  if (window.location.pathname.includes('menu') || window.location.pathname.includes('catalog')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.location.href = 'catalog';
  }
}

// Update reservation cart display
function updateReservationCartDisplay() {
  console.log('🔄 updateReservationCartDisplay called');
  console.log('🔍 Current URL:', window.location.href);

  // Try to find container multiple times
  let container = document.getElementById('reservationCartItems');
  if (!container) {
    console.warn('⚠️ reservationCartItems container not found on first try');
    // Try querySelector as backup
    container = document.querySelector('#reservationCartItems');
    if (!container) {
      console.warn('⚠️ reservationCartItems container not found with querySelector either');
      // Try to find it again after a delay
      setTimeout(() => {
        const retryContainer = document.getElementById('reservationCartItems');
        if (retryContainer) {
          console.log('✅ Found container on retry');
          updateReservationCartDisplay();
        } else {
          console.error('❌ Container still not found after retry');
          console.log('🔍 All elements with id containing "reservation":',
            Array.from(document.querySelectorAll('[id*="reservation"]')).map(el => el.id));
          console.log('🔍 All elements with id containing "Cart":',
            Array.from(document.querySelectorAll('[id*="Cart"]')).map(el => el.id));
        }
      }, 100);
      return;
    }
  }

  console.log('✅ Container found:', container);
  console.log('✅ Container parent:', container.parentElement);
  console.log('✅ Container is visible?', container.offsetParent !== null);
  console.log('✅ Container display style:', window.getComputedStyle(container).display);

  // Get items from reservation cart
  const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
  console.log('📦 Reservation cart:', reservationCart);

  // Also get items from regular cart (if user selected items before reserving)
  let regularCart = [];

  // ALWAYS try localStorage first (most reliable source of truth)
  try {
    const cartData = localStorage.getItem('leoCart');
    console.log('🔍 Raw cartData from localStorage:', cartData);
    if (cartData) {
      regularCart = JSON.parse(cartData);
      console.log('📦 Got cart from localStorage:', regularCart);
      console.log('📦 Cart is array?', Array.isArray(regularCart));
      console.log('📦 Cart length:', Array.isArray(regularCart) ? regularCart.length : 0);
    } else {
      console.log('📦 No cart data in localStorage');
    }
  } catch (e) {
    console.error('❌ Error reading cart from localStorage:', e);
  }

  // Also try to get from window.getCart() or window.cart (in-memory, might be more up-to-date)
  if (typeof window.getCart === 'function') {
    try {
      const inMemoryCart = window.getCart();
      if (Array.isArray(inMemoryCart) && inMemoryCart.length > 0) {
        console.log('📦 Also got cart from window.getCart():', inMemoryCart);
        console.log('📦 In-memory cart length:', inMemoryCart.length);
        // Use in-memory cart if it has more items (more up-to-date)
        if (inMemoryCart.length > (Array.isArray(regularCart) ? regularCart.length : 0)) {
          console.log('✅ Using in-memory cart (more up-to-date)');
          regularCart = inMemoryCart;
        }
      }
    } catch (e) {
      console.error('❌ Error getting cart from window.getCart():', e);
    }
  } else if (typeof window.cart !== 'undefined' && Array.isArray(window.cart) && window.cart.length > 0) {
    console.log('📦 Also got cart from window.cart:', window.cart);
    console.log('📦 window.cart length:', window.cart.length);
    // Use window.cart if it has more items
    if (window.cart.length > (Array.isArray(regularCart) ? regularCart.length : 0)) {
      console.log('✅ Using window.cart (more up-to-date)');
      regularCart = window.cart;
    }
  }

  console.log('📦 Final regular cart items:', regularCart.length, regularCart);
  console.log('📦 Reservation cart items:', reservationCart.length, reservationCart);

  // Combine both carts (reservation cart takes priority if duplicate)
  const allItems = [];

  // First add all regular cart items
  if (Array.isArray(regularCart) && regularCart.length > 0) {
    console.log('✅ Adding', regularCart.length, 'items from regular cart');
    regularCart.forEach((item, idx) => {
      console.log(`  Item ${idx + 1}:`, item);
      if (item && item.name) {
        allItems.push({
          name: item.name || '',
          price: parseFloat(item.price) || 0,
          qty: parseInt(item.qty || item.quantity || 1),
          desc: item.desc || item.description || '',
          note: item.note || ''
        });
      }
    });
  } else {
    console.log('⚠️ Regular cart is empty or not an array');
  }

  // Then add reservation cart items (overwrite if duplicate)
  if (Array.isArray(reservationCart) && reservationCart.length > 0) {
    console.log('✅ Adding', reservationCart.length, 'items from reservation cart');
    reservationCart.forEach((resItem, idx) => {
      console.log(`  Reservation Item ${idx + 1}:`, resItem);
      if (resItem && resItem.name) {
        const existingIndex = allItems.findIndex(item => item.name === resItem.name);
        const normalizedItem = {
          name: resItem.name || '',
          price: parseFloat(resItem.price) || 0,
          qty: parseInt(resItem.qty || resItem.quantity || 1),
          desc: resItem.desc || resItem.description || '',
          note: resItem.note || ''
        };
        if (existingIndex >= 0) {
          allItems[existingIndex] = normalizedItem; // Use reservation cart item if duplicate
        } else {
          allItems.push(normalizedItem);
        }
      }
    });
  } else {
    console.log('⚠️ Reservation cart is empty or not an array');
  }

  console.log('📦 All items combined:', allItems.length, allItems);

  if (allItems.length === 0) {
    console.log('⚠️ No items to display - showing empty message');
    container.innerHTML = '<p style="color: rgba(255,255,255,.5); text-align: center; padding: 10px;">Noch keine Gerichte ausgewählt</p>';
    console.log('✅ Empty message set in container');
    return;
  }

  console.log('✅ About to render', allItems.length, 'items in container');

  console.log('✅ Rendering', allItems.length, 'items');
  let total = 0;
  const htmlContent = allItems.map((item, index) => {
    // Handle both cart formats: {name, price, qty} or {name, price, quantity}
    const qty = parseInt(item.qty || item.quantity || 1);
    const price = parseFloat(item.price || 0);
    const itemTotal = price * qty;
    total += itemTotal;

    // Escape HTML in item name to prevent XSS
    const escapedName = (item.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    // Check if item is from reservation cart or regular cart
    const isFromReservationCart = reservationCart.some(resItem => resItem.name === item.name);
    const removeFunction = isFromReservationCart
      ? `removeFromReservationCart(${reservationCart.findIndex(resItem => resItem.name === item.name)})`
      : `removeFromCartForReservation('${escapedName.replace(/'/g, "\\'")}')`;

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; margin-bottom: 8px; background: rgba(255,255,255,.05); border-radius: 6px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${escapedName}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,.6);">Anzahl: ${qty} x €${price.toFixed(2)}</div>
        </div>
        <div style="text-align: right; margin-left: 10px;">
          <div style="font-weight: 600; color: var(--gold);">€${itemTotal.toFixed(2)}</div>
          <button onclick="${removeFunction}" style="margin-top: 4px; padding: 4px 8px; background: rgba(239,68,68,.2); border: 1px solid rgba(239,68,68,.3); color: #ef4444; border-radius: 4px; cursor: pointer; font-size: 11px;">Löschen</button>
        </div>
      </div>
    `;
  }).join('');

  const totalHtml = `
    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,.1); display: flex; justify-content: space-between; font-weight: 600; color: var(--gold);">
      <span>Gesamt:</span>
      <span>€${total.toFixed(2)}</span>
    </div>
  `;

  console.log('📝 Setting innerHTML, length:', (htmlContent + totalHtml).length);
  console.log('📝 HTML preview (first 200 chars):', (htmlContent + totalHtml).substring(0, 200));

  try {
    container.innerHTML = htmlContent + totalHtml;
    console.log('✅ Cart display updated successfully, total:', total.toFixed(2));
    console.log('✅ Container innerHTML length after update:', container.innerHTML.length);

    // Force a reflow to ensure the browser renders the changes
    void container.offsetHeight;

    // Verify the update worked
    setTimeout(() => {
      const verifyContainer = document.getElementById('reservationCartItems');
      if (verifyContainer) {
        console.log('✅ Verification: Container exists, innerHTML length:', verifyContainer.innerHTML.length);
        console.log('✅ Verification: Container has children?', verifyContainer.children.length);
        if (verifyContainer.innerHTML.length < 100) {
          console.warn('⚠️ Container innerHTML seems too short, might not have rendered correctly');
        } else {
          console.log('✅ Cart items successfully displayed!');
        }
      } else {
        console.error('❌ Container disappeared after update!');
      }
    }, 100);
  } catch (error) {
    console.error('❌ Error setting innerHTML:', error);
    console.error('Error details:', error.message, error.stack);
  }
}

// Helper function to remove item from regular cart when viewing in reservation form
function removeFromCartForReservation(itemName) {
  if (typeof window.removeFromCart === 'function') {
    window.removeFromCart(itemName);
  } else {
    // Fallback: remove from localStorage
    try {
      const cartData = localStorage.getItem('leoCart');
      if (cartData) {
        const cart = JSON.parse(cartData);
        const filteredCart = cart.filter(item => item.name !== itemName);
        localStorage.setItem('leoCart', JSON.stringify(filteredCart));
      }
    } catch (e) {
      console.error('Error removing item from cart:', e);
    }
  }
  updateReservationCartDisplay();
  // Also update regular cart UI if function exists
  if (typeof window.updateCartUI === 'function') {
    window.updateCartUI();
  }
}

// Expose function globally
window.removeFromCartForReservation = removeFromCartForReservation;

// Remove item from reservation cart
function removeFromReservationCart(index) {
  const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
  reservationCart.splice(index, 1);
  localStorage.setItem('leoReservationCart', JSON.stringify(reservationCart));
  updateReservationCartDisplay();
}

// Handle reservation form submission
async function handleReservation(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  console.log('📝 handleReservation called');

  const firstName = document.getElementById('reserveFirstName')?.value.trim();
  const lastName = document.getElementById('reserveLastName')?.value.trim();
  const phone = document.getElementById('reservePhone')?.value.trim();
  const email = document.getElementById('reserveEmail')?.value.trim();
  const date = document.getElementById('reserveDate')?.value;
  const time = document.getElementById('reserveTime')?.value;
  const guests = document.getElementById('reserveGuests')?.value;
  const note = document.getElementById('reserveNote')?.value.trim();
  const customerCode = document.getElementById('reservationCustomerCode')?.value.trim() || null;
  // Table selection removed - admin will assign tables manually

  console.log('Form values:', { firstName, lastName, phone, email, date, time, guests, customerCode });

  if (!firstName || !lastName || !phone || !email || !date || !time || !guests) {
    console.warn('⚠️ Missing required fields');
    alert('Bitte füllen Sie alle Pflichtfelder aus.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    return;
  }

  const phoneClean = phone.replace(/[\s\-\+\(\)]/g, '');
  const phoneRegex = /^[\d]{8,15}$/;
  if (!phoneRegex.test(phoneClean)) {
    alert('Bitte geben Sie eine gültige Telefonnummer ein (8-15 Ziffern).');
    return;
  }

  const reservationId = `RES-${Date.now()}`;
  const reservationTimestamp = new Date().toISOString();

  // Save customer information and get customer code
  let savedCustomerInfo = null;
  if (typeof window.saveCustomerInfo === 'function') {
    savedCustomerInfo = await window.saveCustomerInfo({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      street: '',
      postal: '',
      city: '',
      note: note || '',
      customerCode: customerCode // Include customer code if entered
    });
    console.log('✅ Customer info saved, customer code:', savedCustomerInfo?.customerCode);
  }

  // Get final customer code (from savedCustomerInfo or form input)
  const finalCustomerCode = savedCustomerInfo?.customerCode || customerCode || null;

  // Get items from both reservation cart and regular cart
  const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
  let regularCart = [];
  if (typeof window.getCart === 'function') {
    regularCart = window.getCart();
  } else {
    // Fallback: try to get from localStorage
    try {
      const cartData = localStorage.getItem('leoCart');
      if (cartData) {
        regularCart = JSON.parse(cartData);
      }
    } catch (e) {
      console.error('Error reading cart from localStorage:', e);
    }
  }

  // Combine both carts (reservation cart takes priority if duplicate)
  const allItems = [...regularCart];
  reservationCart.forEach(resItem => {
    const existingIndex = allItems.findIndex(item => item.name === resItem.name);
    if (existingIndex >= 0) {
      allItems[existingIndex] = resItem; // Use reservation cart item if duplicate
    } else {
      allItems.push(resItem);
    }
  });

  // Normalize items format (handle both {qty} and {quantity})
  const normalizedItems = allItems.map(item => ({
    name: item.name,
    price: item.price || 0,
    qty: item.qty || item.quantity || 1,
    desc: item.desc || item.description || '',
    note: item.note || ''
  }));

  const reservationData = {
    reservationId: reservationId,
    status: 'pending',
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email,
    date: date,
    time: time,
    guests: parseInt(guests),
    tableNumber: null, // Admin will assign table manually
    note: note || '',
    items: normalizedItems,
    customerCode: finalCustomerCode, // Include customer code
    timestamp: reservationTimestamp,
    createdAt: reservationTimestamp
  };

  // If there are items, create an order linked to this reservation
  if (normalizedItems.length > 0) {
    const orderId = `ORD-${Date.now()}`;
    const orderData = {
      order_id: orderId,
      status: 'pending',
      service_type: 'pickup',
      table_number: null, // Admin will assign table manually
      reservation_id: reservationId,
      items: normalizedItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
        description: item.desc || '',
        note: item.note || '',
        total: (item.price * item.qty).toFixed(2)
      })),
      delivery: {
        address: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          street: '',
          postal: '',
          city: '',
          note: note || '',
          customerCode: finalCustomerCode // Include customer code in delivery address
        },
        fee: '0.00'
      },
      customerCode: finalCustomerCode, // Also store at root level for easy access
      summary: {
        item_count: normalizedItems.reduce((sum, item) => sum + item.qty, 0),
        subtotal: normalizedItems.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2),
        delivery_fee: '0.00',
        total: normalizedItems.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2),
        payment_method: 'cash',
        timestamp: reservationTimestamp
      },
      createdAt: reservationTimestamp
    };

    // Save order (functions should be in payment.js or firebase.js)
    if (typeof saveOrderToDailyReport === 'function') {
      saveOrderToDailyReport(orderData);
    }

    // Clear reservation cart and flag
    localStorage.removeItem('leoReservationCart');
    localStorage.removeItem('leoSelectingForReservation');

    // Also clear regular cart since items have been used for reservation
    if (typeof window.clearCart === 'function') {
      window.clearCart();
    } else {
      localStorage.removeItem('leoCart');
    }

    // Update cart UI if function exists
    if (typeof window.updateCartUI === 'function') {
      window.updateCartUI();
    }
  } else {
    localStorage.removeItem('leoSelectingForReservation');

    // Clear regular cart even if no items (user might have cleared items before submitting)
    if (typeof window.clearCart === 'function') {
      window.clearCart();
    } else {
      localStorage.removeItem('leoCart');
    }

    // Update cart UI if function exists
    if (typeof window.updateCartUI === 'function') {
      window.updateCartUI();
    }
  }

  // Save reservation to MySQL database via API
  try {
    if (window.api && window.api.reservations && window.api.reservations.saveReservation) {
      const apiData = {
        reservation_id: reservationData.reservationId,
        first_name: reservationData.firstName,
        last_name: reservationData.lastName,
        phone: reservationData.phone,
        email: reservationData.email,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests,
        table_number: reservationData.tableNumber,
        note: reservationData.note || '',
        items: reservationData.items || [],
        customer_code: reservationData.customerCode || null,
        status: reservationData.status || 'pending'
      };

      console.log('📦 Saving reservation to database:', apiData);
      const result = await window.api.reservations.saveReservation(apiData);

      if (result && result.success) {
        console.log('✅ Reservation saved to database successfully:', result.reservation_id);
      } else {
        console.error('❌ Failed to save reservation to database:', result?.message);
      }
    } else {
      console.warn('⚠️ API function not found, reservation not saved to database');
    }
  } catch (error) {
    console.error('❌ Error saving reservation to database:', error);
    // Continue even if API fails - don't block user
  }

  // Also save to daily report (for backward compatibility)
  if (typeof saveReservationToDailyReport === 'function') {
    saveReservationToDailyReport(reservationData);
  }

  // Send emails (functions should be in email.js)
  if (typeof sendReservationEmail === 'function') {
    sendReservationEmail(reservationData);
  }
  if (typeof sendReservationConfirmationEmail === 'function') {
    sendReservationConfirmationEmail(reservationData);
  }

  // Show confirmation (functions should be in main.js or separate file)
  // Reservation confirmation - only send email, no print bill
  // showReservationConfirmation removed

  // Close modal if it exists (for backward compatibility)
  if (typeof closeReservationModal === 'function') {
    closeReservationModal();
  }

  // Reset form
  if (event && event.target) {
    event.target.reset();
  }

  // Add notification
  if (window.addNotification && window.NOTIFICATION_TYPES) {
    window.addNotification(
      window.NOTIFICATION_TYPES.RESERVATION_SUCCESS,
      '📅 Reservierung erfolgreich!',
      `Ihre Reservierung wurde erfolgreich abgesendet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.`,
      { reservationId: reservationData.reservationId }
    );
  }

  // If we're on reservation page, redirect to home after success
  if (window.location.pathname.includes('reservation') || window.location.pathname.includes('book-table')) {
    // Redirect to home page after showing notification (2 seconds to see notification)
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }
}

// Auto-fill reservation form with user info
async function autoFillReservationInfo() {
  console.log('🔄 autoFillReservationInfo called');

  // Check if user is logged in
  if (typeof getCurrentUser !== 'function') {
    console.log('⚠️ getCurrentUser function not found');
    return false;
  }

  const localUser = getCurrentUser();
  if (!localUser || !localUser.token) {
    console.log('⚠️ No user logged in or no token');
    return false;
  }

  // Get input fields
  const firstNameInput = document.getElementById('reserveFirstName');
  const lastNameInput = document.getElementById('reserveLastName');
  const emailInput = document.getElementById('reserveEmail');
  const phoneInput = document.getElementById('reservePhone');

  // Check if inputs exist
  if (!firstNameInput || !lastNameInput || !emailInput || !phoneInput) {
    console.log('⚠️ Reservation form inputs not found');
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
          phone: result.user.phone || localUser.phone || ''
        };
        // Update localStorage
        localStorage.setItem('leo_user', JSON.stringify({ ...localUser, ...user }));
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Use localStorage data if API fails
    user = {
      firstName: localUser.firstName || '',
      lastName: localUser.lastName || '',
      email: localUser.email || '',
      phone: localUser.phone || ''
    };
  }

  // Fill ALL fields DIRECTLY (only if empty to allow manual editing)
  if (firstNameInput && !firstNameInput.value) firstNameInput.value = user.firstName || '';
  if (lastNameInput && !lastNameInput.value) lastNameInput.value = user.lastName || '';
  if (emailInput && !emailInput.value) emailInput.value = user.email || '';
  if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';

  console.log('✅ Reservation form auto-filled:', {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || ''
  });

  return true;
}

// Make functions globally available
window.handleReservation = handleReservation;
window.updateReservationCartDisplay = updateReservationCartDisplay;
window.autoFillReservationInfo = autoFillReservationInfo;
// Expose openReservationModal to window - this is the CORRECT function that opens reservationModal (form cũ)
window.openReservationModal = function (...args) {
  console.log('🎯 window.openReservationModal called - this should open reservationModal (FORM CŨ)');
  return openReservationModal(...args);
};
window.closeReservationModal = closeReservationModal;
window.openMenuForReservation = openMenuForReservation;
window.removeFromReservationCart = removeFromReservationCart;

