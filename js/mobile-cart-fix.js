// Mobile App Cart Fix
// Ensure cart button always opens cart sidebar, never opens browser

(function () {
  console.log('📱 Mobile Cart Fix loaded');

  const boundCartElements = new WeakSet();

  // Global click handler to catch ANY element with WARENKORB or BESTELLEN in cart context
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (!target) return;

    const floatingBar = target.closest('#appFloatingCartBar, .app-floating-cart-bar, #appNavCart, .app-top-cart-btn, .app-cart-bar-action, .app-cart-bar-left');
    if (floatingBar) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.openAppCartModal === 'function') {
        window.openAppCartModal();
      }
      return false;
    }

    const text = target.textContent || target.innerText || '';
    if (text.toUpperCase().includes('WARENKORB') && !target.closest('.app-cart-sheet-close, #cartClose')) {
      e.preventDefault();
      e.stopPropagation();

      if (typeof window.openAppCartModal === 'function') {
        window.openAppCartModal();
      } else if (typeof window.openCart === 'function') {
        window.openCart();
      } else if (typeof window.toggleCart === 'function') {
        window.toggleCart();
      }
      return false;
    }
  }, true);

  function initMobileCartFix() {
    const cartSelectors = [
      '#appFloatingCartBar',
      '.app-floating-cart-bar',
      '.app-cart-bar-action',
      '.app-cart-bar-left',
      '#appNavCart',
      '.app-top-cart-btn',
      '#fixedOrderBtn',
      '#cartToggle',
      '.cart-toggle',
      '.fixed-order-btn',
      '[data-cart-toggle]',
      '[aria-label*="Warenkorb"]:not([aria-label*="schließen"])',
      '[aria-label*="warenkorb"]:not([aria-label*="schließen"])',
      'a[href*="cart"]',
      'a[href*="warenkorb"]',
      'button:has(.order-text):not(.cart-close)',
      '*[onclick*="cart"]:not(#cartClose)'
    ];

    const cartElements = [];
    cartSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (!cartElements.includes(el)) {
            cartElements.push(el);
          }
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });

    if (cartElements.length === 0) {
      setTimeout(initMobileCartFix, 500);
      return;
    }

    let newlyBoundCount = 0;

    cartElements.forEach((element) => {
      if (boundCartElements.has(element)) return;
      boundCartElements.add(element);
      newlyBoundCount += 1;

      element.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (typeof window.openAppCartModal === 'function') {
          window.openAppCartModal();
        } else if (typeof window.openCart === 'function') {
          window.openCart();
        } else if (typeof window.toggleCart === 'function') {
          window.toggleCart();
        }
        return false;
      }, true);
    });

    if (newlyBoundCount > 0) {
      console.log(`✅ Mobile cart fix bound ${newlyBoundCount} cart element(s)`);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileCartFix);
  } else {
    initMobileCartFix();
  }

  setTimeout(initMobileCartFix, 500);
  setTimeout(initMobileCartFix, 1500);
  setTimeout(initMobileCartFix, 3000);
  setTimeout(initMobileCartFix, 5000);
})();
