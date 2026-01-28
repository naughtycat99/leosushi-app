// Cart Module
// Global cart variable
let cart = JSON.parse(localStorage.getItem('leoCart')) || [];

// Expose cart to global scope for backward compatibility with script.js
Object.defineProperty(window, 'cart', {
  get: () => cart,
  set: (value) => { cart = value; },
  configurable: true,
  enumerable: true
});

// Global function to handle reserve button click (called from onclick in HTML)
// This must be defined at the top level so it's available immediately when HTML loads
window.handleReserveButtonClick = function (e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  console.log('📍 Reserve button clicked (via onclick handler)!');

  // Close payment modal if open
  if (typeof window.closePaymentModal === 'function') {
    console.log('🔒 Closing payment modal if open...');
    window.closePaymentModal();
  }

  // Close cart first (need to get closeCart function)
  if (typeof window.closeCart === 'function') {
    console.log('🛒 Closing cart...');
    window.closeCart();
  }

  // Wait a bit for cart to close, then open reservation modal
  setTimeout(() => {
    console.log('🔍 Checking for openReservationModal function...');
    console.log('window.openReservationModal:', typeof window.openReservationModal);

    // Open reservation modal
    if (typeof window.openReservationModal === 'function') {
      console.log('✅ Calling window.openReservationModal()');
      try {
        window.openReservationModal();
      } catch (error) {
        console.error('❌ Error calling openReservationModal:', error);
        alert('Fehler beim Öffnen des Reservierungs-Formulars. Bitte versuchen Sie es erneut.');
      }
    } else {
      console.warn('⚠️ openReservationModal not found, retrying...');
      setTimeout(() => {
        if (typeof window.openReservationModal === 'function') {
          console.log('✅ Calling window.openReservationModal() (retry)');
          try {
            window.openReservationModal();
          } catch (error) {
            console.error('❌ Error calling openReservationModal:', error);
            alert('Fehler beim Öffnen des Reservierungs-Formulars. Bitte laden Sie die Seite neu.');
          }
        } else {
          console.error('❌ openReservationModal function not found!');
          alert('Fehler: Reservierungs-Modal konnte nicht geöffnet werden. Bitte laden Sie die Seite neu.');
        }
      }, 200);
    }
  }, 300);
};

function addToCart(name, price, desc, btn) {
  // Open modal to add note and quantity
  openAddToCartModal(name, price, desc);
}

window.openAddToCartModal = function (name, price, desc) {
  console.log('🛒 openAddToCartModal called:', { name, price, desc });

  const modal = document.getElementById('noteModal');
  const noteInput = document.getElementById('noteInput');
  const noteItemName = document.getElementById('noteItemName');
  const quantityInput = document.getElementById('quantityInput');
  const modalTotal = document.getElementById('modalTotal');

  if (!modal) {
    console.error('❌ Modal not found!');
    return;
  }
  if (!noteInput) {
    console.error('❌ NoteInput not found!');
    return;
  }
  if (!noteItemName) {
    console.error('❌ NoteItemName not found!');
    return;
  }

  console.log('✅ All modal elements found');

  // Check if item already in cart
  const existingItem = cart.find(i => i.name === name);
  const initialQty = existingItem ? existingItem.qty : 1;
  const initialNote = existingItem ? (existingItem.note || '') : '';

  // Set content
  noteItemName.innerHTML = `${name}<br><span style="color: var(--gold); font-size: 14px;">€${price}</span>`;
  noteInput.value = initialNote;

  // Setup quantity
  if (quantityInput) {
    quantityInput.value = initialQty;
    quantityInput.addEventListener('input', updateModalTotal);
    quantityInput.addEventListener('change', updateModalTotal);
  }

  // Store data for save
  modal.dataset.currentItem = name;
  modal.dataset.currentPrice = price;
  modal.dataset.currentDesc = desc || '';

  // Update total immediately
  if (modalTotal && quantityInput) {
    const priceNum = parseFloat(price.replace(',', '.'));
    const qty = parseInt(quantityInput.value) || 1;
    const total = priceNum * qty;
    modalTotal.textContent = formatPrice(total);
  }

  // Show modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
    if (quantityInput) quantityInput.focus();
  }, 10);

  document.body.style.overflow = 'hidden';

  // Keyboard shortcuts
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeNoteModal();
    }
  };

  document.addEventListener('keydown', handleKeydown);
  modal._keydownHandler = handleKeydown;

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === modal) closeNoteModal();
  };
  modal.addEventListener('click', handleOverlayClick);
  modal._overlayHandler = handleOverlayClick;
}

function updateModalTotal() {
  const modal = document.getElementById('noteModal');
  const quantityInput = document.getElementById('quantityInput');
  const modalTotal = document.getElementById('modalTotal');

  if (!modal || !quantityInput || !modalTotal) return;

  const price = parseFloat(modal.dataset.currentPrice.replace(',', '.'));
  const qty = parseInt(quantityInput.value) || 1;
  const total = price * qty;

  modalTotal.textContent = formatPrice(total);
}

window.changeQuantity = function (delta) {
  const quantityInput = document.getElementById('quantityInput');
  if (!quantityInput) return;

  const current = parseInt(quantityInput.value) || 1;
  const newQty = Math.max(1, Math.min(20, current + delta));
  quantityInput.value = newQty;
  updateModalTotal();
}

function updateAddButtons() {
  // No longer needed - buttons removed from menu
  // Kept for backward compatibility
}

// Get cart function
window.getCart = function () {
  // Return current cart array
  return cart;
};

window.removeFromCart = function (name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  updateCartUI();
  updateAddButtons();

  // Also update reservation cart display if reservation modal is open
  const reservationModal = document.getElementById('reservationModal');
  if (reservationModal && reservationModal.style.display === 'flex') {
    if (typeof window.updateReservationCartDisplay === 'function') {
      console.log('🔄 Updating reservation cart display after removing from cart');
      window.updateReservationCartDisplay();
    }
  }
}

window.updateQuantity = function (name, delta) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    if (item.qty === 0) window.removeFromCart(name);
    else saveCart();
    updateCartUI();
    updateAddButtons();

    // Also update reservation cart display if reservation modal is open
    const reservationModal = document.getElementById('reservationModal');
    if (reservationModal && reservationModal.style.display === 'flex') {
      if (typeof window.updateReservationCartDisplay === 'function') {
        console.log('🔄 Updating reservation cart display after updating quantity');
        window.updateReservationCartDisplay();
      }
    }
  }
}

window.openNoteModal = function (name, currentNote = '') {
  // This function is for editing notes from cart
  // For adding items, use openAddToCartModal instead
  const modal = document.getElementById('noteModal');
  const noteInput = document.getElementById('noteInput');
  const noteItemName = document.getElementById('noteItemName');
  const quantityInput = document.getElementById('quantityInput');
  const modalTotal = document.getElementById('modalTotal');

  if (!modal || !noteInput || !noteItemName) return;

  // Find the item in cart to get price
  const item = cart.find(i => i.name === name);
  if (!item) return;

  // Set content
  noteItemName.innerHTML = `${name}<br><span style="color: var(--gold); font-size: 14px;">€${formatPrice(item.price)}</span>`;
  noteInput.value = currentNote || '';

  // Setup quantity
  if (quantityInput) {
    quantityInput.value = item.qty;
    quantityInput.addEventListener('input', updateModalTotal);
    quantityInput.addEventListener('change', updateModalTotal);
  }

  // Store data for save
  modal.dataset.currentItem = name;
  modal.dataset.currentPrice = formatPrice(item.price);
  modal.dataset.currentDesc = item.desc || '';

  // Update total
  if (modalTotal && quantityInput) {
    const qty = parseInt(quantityInput.value) || 1;
    const total = item.price * qty;
    modalTotal.textContent = formatPrice(total);
  }

  // Show modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
    if (quantityInput) quantityInput.focus();
  }, 10);

  document.body.style.overflow = 'hidden';

  // Keyboard shortcuts
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeNoteModal();
    }
  };

  document.addEventListener('keydown', handleKeydown);
  modal._keydownHandler = handleKeydown;

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === modal) closeNoteModal();
  };
  modal.addEventListener('click', handleOverlayClick);
  modal._overlayHandler = handleOverlayClick;
}

window.closeNoteModal = function () {
  const modal = document.getElementById('noteModal');
  if (modal) {
    // Cleanup event listeners
    if (modal._keydownHandler) {
      document.removeEventListener('keydown', modal._keydownHandler);
      delete modal._keydownHandler;
    }
    if (modal._overlayHandler) {
      modal.removeEventListener('click', modal._overlayHandler);
      delete modal._overlayHandler;
    }

    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
  }
}

window.saveNote = function () {
  console.log('💾 saveNote() called!');
  try {
    const modal = document.getElementById('noteModal');
    const noteInput = document.getElementById('noteInput');
    const quantityInput = document.getElementById('quantityInput');
    const name = modal?.dataset.currentItem;
    const price = modal?.dataset.currentPrice;
    const desc = modal?.dataset.currentDesc;

    console.log('🔍 saveNote data check:', {
      modal: !!modal,
      noteInput: !!noteInput,
      quantityInput: !!quantityInput,
      name: name,
      price: price,
      desc: desc
    });

    if (!name || !noteInput) {
      console.error('❌ Missing required data:', { name, noteInput: !!noteInput });
      alert('Fehler: Bitte versuchen Sie es erneut.');
      return;
    }

    const note = noteInput.value.trim();
    const qty = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

    console.log('💾 saveNote processing:', { name, price, qty, note });

    // DEFAULT: Always add to REGULAR cart unless we're 100% sure reservation modal is open
    const reservationModal = document.getElementById('reservationModal');
    let isForReservation = false;

    // CRITICAL: Clear any stale flags first
    localStorage.removeItem('leoSelectingForReservation');

    // ONLY check if modal exists AND is truly visible
    if (reservationModal) {
      const computedStyle = window.getComputedStyle(reservationModal);
      const display = computedStyle.display;
      const opacity = parseFloat(computedStyle.opacity) || 0;
      const visibility = computedStyle.visibility;
      const zIndex = parseInt(computedStyle.zIndex) || 0;

      // EXTREMELY STRICT: Modal must be FULLY visible with ALL conditions met
      // We use opacity > 0.95 to ensure it's not in transition
      const isModalReallyOpen =
        display === 'flex' &&
        visibility === 'visible' &&
        opacity > 0.95 &&  // Very strict - must be almost fully opaque
        zIndex >= 10000;   // High z-index when modal is active

      isForReservation = isModalReallyOpen;

      console.log('🔍 Reservation modal ULTRA-STRICT check:', {
        display: display,
        visibility: visibility,
        opacity: opacity,
        zIndex: zIndex,
        isModalReallyOpen: isModalReallyOpen,
        isForReservation: isForReservation,
        modalElement: reservationModal ? 'found' : 'not found'
      });

      // If modal is not open, ensure flag is cleared
      if (!isForReservation) {
        localStorage.removeItem('leoSelectingForReservation');
        console.log('✅ Modal is NOT open - will add to REGULAR cart');
      } else {
        console.log('⚠️ Modal IS open - will add to RESERVATION cart');
      }
    } else {
      // No modal found - definitely regular cart
      console.log('✅ No reservation modal found - adding to REGULAR cart');
    }

    // FINAL SAFETY CHECK: Even if flag exists, if modal is not open, use regular cart
    if (!isForReservation) {
      // Double-check: clear any flags and force regular cart
      localStorage.removeItem('leoSelectingForReservation');
      isForReservation = false;
    }

    // ONLY add to reservation cart if modal is ACTUALLY open
    // DOUBLE-CHECK: Verify modal is still open right before adding
    if (isForReservation) {
      // Final verification - check modal one more time
      const finalCheck = reservationModal && window.getComputedStyle(reservationModal).display === 'flex'
        && window.getComputedStyle(reservationModal).opacity > 0.95
        && window.getComputedStyle(reservationModal).visibility === 'visible';

      if (!finalCheck) {
        console.warn('⚠️ Final check failed - modal not actually open, switching to regular cart');
        isForReservation = false;
        localStorage.removeItem('leoSelectingForReservation');
      }
    }

    if (isForReservation) {
      console.log('📋 Adding to RESERVATION cart (modal is confirmed open)');
      // Add to reservation cart
      const reservationCart = JSON.parse(localStorage.getItem('leoReservationCart') || '[]');
      const existingItem = reservationCart.find(i => i.name === name);

      if (existingItem) {
        existingItem.qty = qty;
        existingItem.note = note;
      } else {
        reservationCart.push({
          name,
          price: parseFloat(price.replace(',', '.')),
          desc: desc || '',
          qty: qty,
          note: note
        });
      }

      localStorage.setItem('leoReservationCart', JSON.stringify(reservationCart));

      // Show notification
      alert('Gericht wurde zum Reservierungswarenkorb hinzugefügt!');

      // Update reservation cart display
      if (typeof updateReservationCartDisplay === 'function') {
        updateReservationCartDisplay();
      }

      // Close note modal and return early - don't add to regular cart
      closeNoteModal();
      return;
    } else {
      // Add to regular cart (default behavior)
      console.log('🛒 Adding to REGULAR cart (modal is not open)');
      const item = cart.find(i => i.name === name);

      if (item) {
        // Update existing item
        item.qty = qty;
        item.note = note;
      } else {
        // Add new item
        cart.push({
          name,
          price: parseFloat(price.replace(',', '.')),
          desc: desc || '',
          qty: qty,
          note: note
        });
      }

      saveCart();
      updateCartUI();
      updateAddButtons();

      console.log('✅ Added to regular cart:', { name, qty, note, cartLength: cart.length });

      // Show notification for regular cart
      // alert('Gericht wurde zum Warenkorb hinzugefügt!');
    }

    closeNoteModal();
  } catch (error) {
    console.error('❌ Error in saveNote:', error);
    alert('Fehler beim Hinzufügen zum Warenkorb: ' + error.message);
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
      noteModal.style.display = 'none';
      noteModal.style.opacity = '0';
      document.body.style.overflow = '';
    }
  }
}

function saveCart() {
  // Ensure all items have note field
  cart.forEach(item => {
    if (!item.hasOwnProperty('note')) {
      item.note = '';
    }
  });
  localStorage.setItem('leoCart', JSON.stringify(cart));
}

function getTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const fixedOrderTotal = document.getElementById('fixedOrderTotal');
  const fixedOrderBtn = document.getElementById('fixedOrderBtn');
  const orderBadge = document.getElementById('orderBadge');

  const total = getTotal();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  if (badge) badge.textContent = count;
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (fixedOrderTotal) fixedOrderTotal.textContent = formatPrice(total);

  // Update checkout button - only enable when cart has items
  if (checkoutBtn) {
    if (cart.length === 0) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.5';
      checkoutBtn.style.cursor = 'not-allowed';
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = '1';
      checkoutBtn.style.cursor = 'pointer';
    }
  }

  // Update order badge
  if (orderBadge) {
    orderBadge.textContent = count;
    if (count > 0) {
      orderBadge.classList.add('show');
      orderBadge.classList.add('pulse');
      setTimeout(() => orderBadge.classList.remove('pulse'), 600);
    } else {
      orderBadge.classList.remove('show');
    }
  }

  // Add pulse animation class when cart has items
  if (fixedOrderBtn) {
    if (cart.length > 0) {
      fixedOrderBtn.classList.add('has-items');
    } else {
      fixedOrderBtn.classList.remove('has-items');
    }
  }

  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Ihr Warenkorb ist leer</div>';
    } else {
      itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${escapeHtml(item.name)}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-actions">
              <div class="cart-item-qty">
                <button onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="updateQuantity('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
              </div>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')" aria-label="Entfernen">×</button>
        </div>
      `).join('');
    }
  }
}

function setupCart() {
  console.log('🛒 setupCart() called');

  // Clear stale reservation flag on page load if modal is not open
  const reservationModal = document.getElementById('reservationModal');
  if (reservationModal) {
    const computedStyle = window.getComputedStyle(reservationModal);
    const display = computedStyle.display;
    const opacity = parseFloat(computedStyle.opacity) || 0;
    const zIndex = parseInt(computedStyle.zIndex) || 0;
    const isModalOpen = display === 'flex' && opacity > 0.5 && zIndex >= 10000;

    if (!isModalOpen) {
      localStorage.removeItem('leoSelectingForReservation');
      console.log('🧹 Cleared stale reservation flag on page load');
    }
  } else {
    localStorage.removeItem('leoSelectingForReservation');
    console.log('🧹 Cleared reservation flag - no modal found');
  }
  const toggle = document.getElementById('cartToggle');
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const close = document.getElementById('cartClose');
  const checkout = document.getElementById('checkoutBtn');
  const fixedOrderBtn = document.getElementById('fixedOrderBtn');
  console.log('Cart elements found:', { toggle, sidebar, overlay, close, checkout, fixedOrderBtn });

  function openCart() {
    // Don't open cart if order was just completed (to prevent reopening after success notification)
    if (sessionStorage.getItem('orderJustCompleted') === 'true') {
      // Clear the flag after a delay to allow normal cart usage again
      setTimeout(() => {
        sessionStorage.removeItem('orderJustCompleted');
      }, 5000);
      return;
    }

    sidebar?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cart-open');

    // NOTE: Do NOT hide cart toggle button when cart is open - it should remain visible
    // The cart toggle button should always be visible so users can close the cart

    // Force hide fixed order button when cart is open
    const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
    allFixedOrderBtns.forEach(btn => {
      if (btn) {
        // Remove force-show class when opening cart
        btn.classList.remove('force-show');

        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
        btn.style.setProperty('transform', 'translateX(200%)', 'important');
        btn.style.setProperty('right', '-9999px', 'important');
        btn.style.setProperty('bottom', '-9999px', 'important');
        btn.style.setProperty('z-index', '-1', 'important');
      }
    });
  }

  function closeCart() {
    console.log('🛒 closeCart() called');

    // FIRST: Remove cart-open class immediately
    document.body.classList.remove('cart-open');
    console.log('✅ body.classList.remove("cart-open") - cart-open class removed');

    // THEN: Close sidebar and overlay
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';

    // Show fixed order button (WARENKORB) when cart is closed
    // Remove ALL inline styles first, then set new ones with !important
    const showFixedOrderBtn = () => {
      const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
      const isApp = document.body.classList.contains('is-capacitor-app');
      console.log('🔍 Found fixed order buttons:', allFixedOrderBtns.length, 'isApp:', isApp);

      allFixedOrderBtns.forEach((btn, index) => {
        if (btn) {
          // CRITICAL: Remove ALL inline styles that were set in openCart()
          // This must be done before setting new styles
          btn.style.removeProperty('display');
          btn.style.removeProperty('visibility');
          btn.style.removeProperty('opacity');
          btn.style.removeProperty('pointer-events');
          btn.style.removeProperty('transform');
          btn.style.removeProperty('right');
          btn.style.removeProperty('bottom');
          btn.style.removeProperty('left');
          btn.style.removeProperty('top');
          btn.style.removeProperty('z-index');
          btn.style.removeProperty('position');

          // REMOVED app-specific hiding to support standard mobile web UI
          /*
          if (isApp) {
            // Hide on App
            btn.style.setProperty('display', 'none', 'important');
            btn.style.setProperty('visibility', 'hidden', 'important');
            btn.style.setProperty('opacity', '0', 'important');
            btn.style.setProperty('pointer-events', 'none', 'important');
            return;
          }
          */

          // Add force-show class to override CSS rules
          btn.classList.add('force-show');

          // Force show with !important - must override any remaining styles
          const isMobile = window.innerWidth <= 720;
          btn.style.setProperty('display', 'flex', 'important');
          btn.style.setProperty('visibility', 'visible', 'important');
          btn.style.setProperty('opacity', '1', 'important');
          btn.style.setProperty('position', 'fixed', 'important');
          btn.style.setProperty('right', isMobile ? '12px' : '20px', 'important');
          btn.style.setProperty('bottom', isMobile ? '16px' : '20px', 'important');
          btn.style.setProperty('left', 'auto', 'important');
          btn.style.setProperty('top', 'auto', 'important');
          btn.style.setProperty('z-index', '99999', 'important');
          btn.style.setProperty('pointer-events', 'auto', 'important');
          btn.style.setProperty('transform', 'none', 'important');

          console.log(`✅ Button ${index + 1} styles applied:`, {
            display: btn.style.display,
            visibility: btn.style.visibility,
            opacity: btn.style.opacity,
            position: btn.style.position,
            right: btn.style.right,
            bottom: btn.style.bottom
          });
        }
      });
    };

    // Apply immediately
    showFixedOrderBtn();

    // Apply again after short delays to ensure CSS has updated and override any conflicting styles
    setTimeout(() => {
      showFixedOrderBtn();
    }, 0);
    setTimeout(() => {
      showFixedOrderBtn();
    }, 50);
    setTimeout(() => {
      showFixedOrderBtn();
    }, 100);
  }

  toggle?.addEventListener('click', openCart);
  close?.addEventListener('click', closeCart);
  overlay?.addEventListener('click', closeCart);

  // Expose closeCart globally
  window.closeCart = closeCart;

  // Setup fixed order button for menu page
  if (fixedOrderBtn) {
    const isMenuPage = window.location.pathname.includes('menu') || window.location.pathname.includes('catalog') || document.getElementById('menuOrderPage');

    if (isMenuPage) {
      // On menu page: open cart when clicked
      fixedOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    }
  }
  // Also setup document-level event delegation as backup
  console.log('🔧 Setting up reserve button handler with document-level event delegation');
  document.addEventListener('click', function (e) {
    const reserveBtn = e.target.closest('#reserveBtn');
    if (reserveBtn) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📍 Reserve button clicked (document-level delegation backup)!');
      if (typeof window.handleReserveButtonClick === 'function') {
        window.handleReserveButtonClick(e);
      }
    }
  });

  console.log('✅ Reserve button handler setup complete');

  // Expose openCart globally
  window.openCart = openCart;

  // Setup Checkout button - only enabled when cart has items
  // Mark button to prevent duplicate handlers from script.js
  if (checkout && !checkout.hasAttribute('data-checkout-handler')) {
    checkout.setAttribute('data-checkout-handler', 'true');
    checkout.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('💳 Checkout button clicked, cart length:', cart.length);

      // Check if cart is empty
      if (cart.length === 0) {
        console.warn('⚠️ Cart is empty, cannot checkout');
        alert('Ihr Warenkorb ist leer. Bitte fügen Sie Artikel hinzu.');
        return;
      }

      // Close cart first
      closeCart();

      // Redirect to checkout page
      setTimeout(() => {
        console.log('✅ Redirecting to checkout');
        window.location.href = 'checkout.html';
      }, 200);
    });
  }

  // Setup payment modal close on overlay click (only once)
  const paymentModal = document.getElementById('paymentModal');
  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) {
        if (typeof closePaymentModal === 'function') {
          closePaymentModal();
        }
      }
    });
  }

  // Delegate add to cart clicks (for backward compatibility)
  // Note: menu.js already handles menu-item-add-btn clicks, but we keep this for other add buttons
  document.addEventListener('click', (e) => {
    // Check if clicked element or its parent has the add-btn class
    const addBtn = e.target.closest('.add-btn, .menu-item-add-btn');
    if (addBtn && addBtn.classList.contains('add-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const name = addBtn.dataset.name;
      const price = addBtn.dataset.price;
      const desc = addBtn.dataset.desc;
      if (name && price) {
        addToCart(name, price, desc, addBtn);
      }
    }
  });

  updateCartUI();
  updateAddButtons();

  // Expose setupCart to window for manual initialization if needed
  window.setupCart = setupCart;

  // Monitor button visibility and force show if hidden when cart is closed
  function monitorButtonVisibility() {
    // Only monitor if cart is closed
    if (!document.body.classList.contains('cart-open')) {
      const btn = document.getElementById('fixedOrderBtn');
      if (btn) {
        const computed = window.getComputedStyle(btn);
        if (computed.display === 'none' || computed.visibility === 'hidden' || parseFloat(computed.opacity) < 0.1) {
          console.warn('⚠️ Button is hidden but cart is closed! Forcing show...');
          btn.classList.add('force-show');
          const isMobile = window.innerWidth <= 720;
          btn.style.setProperty('display', 'flex', 'important');
          btn.style.setProperty('visibility', 'visible', 'important');
          btn.style.setProperty('opacity', '1', 'important');
          btn.style.setProperty('position', 'fixed', 'important');
          btn.style.setProperty('right', isMobile ? '12px' : '20px', 'important');
          btn.style.setProperty('bottom', isMobile ? '16px' : '20px', 'important');
          btn.style.setProperty('z-index', '99999', 'important');
          btn.style.setProperty('pointer-events', 'auto', 'important');
          btn.style.setProperty('transform', 'none', 'important');
        }
      }
    }
  }

  // Monitor button visibility periodically (every 100ms)
  setInterval(monitorButtonVisibility, 100);

  // Also monitor on DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      monitorButtonVisibility();
    });

    const btn = document.getElementById('fixedOrderBtn');
    if (btn) {
      observer.observe(btn, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

