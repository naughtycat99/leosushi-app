// Main Module - Initialization
// This file contains main initialization code

console.log('main.js loaded');

// Burger menu setup
const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => {
    const nav = document.getElementById('primaryNav');
    if (!nav) return;
    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    burger.setAttribute('aria-expanded', String(willOpen));

    // Ensure fixed order button is visible when closing burger menu
    if (!willOpen) {
      // Menu is closing
      // REMOVED app-specific hiding to support standard mobile web UI
      /*
      const isApp = document.body.classList.contains('is-capacitor-app');
      if (isApp) {
        // Just make sure it stays hidden on App
        const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
        allFixedOrderBtns.forEach(btn => {
          if (btn) {
            btn.style.setProperty('display', 'none', 'important');
            btn.style.setProperty('visibility', 'hidden', 'important');
          }
        });
        return;
      }
      */

      setTimeout(() => {
        const allFixedOrderBtns = document.querySelectorAll('.fixed-order-btn, #fixedOrderBtn');
        allFixedOrderBtns.forEach(btn => {
          if (btn && !document.body.classList.contains('cart-open')) {
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
        });
      }, 100);
    }
  });
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - Initializing modules...');

  // Skip menu initialization on admin pages
  const isAdminPage = window.location.pathname.includes('admin.html') ||
    window.location.pathname.includes('dashboard') ||
    window.location.pathname.includes('control') ||
    window.location.pathname.includes('admin-panel');

  if (isAdminPage) {
    console.log('Admin page detected - skipping menu initialization');
    return;
  }

  // Initialize modules if functions exist
  if (typeof renderMenuTabs === 'function') {
    try {
      const result = renderMenuTabs();
      // Check if result is a Promise before calling .then()
      if (result && typeof result === 'object' && typeof result.then === 'function') {
        result.then(() => {
          // Default to first category after menu is loaded
          if (typeof window.loadMenuFromAPI === 'function') {
            const loadResult = window.loadMenuFromAPI();
            if (loadResult && typeof loadResult === 'object' && typeof loadResult.then === 'function') {
              loadResult.then(() => {
                const menuData = window.MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
                if (menuData.length > 0 && typeof renderMenuList === 'function') {
                  renderMenuList(menuData[0]?.id);
                }
              }).catch(err => console.warn('Error loading menu from API:', err));
            } else {
              // Not a promise, execute immediately
              const menuData = window.MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
              if (menuData.length > 0 && typeof renderMenuList === 'function') {
                renderMenuList(menuData[0]?.id);
              }
            }
          } else if (typeof MENU_DATA !== 'undefined' && MENU_DATA.length > 0) {
            if (typeof renderMenuList === 'function') {
              renderMenuList(MENU_DATA[0]?.id);
            }
          }
        }).catch(err => console.warn('Error rendering menu tabs:', err));
      } else {
        // Not a promise, execute immediately
        if (typeof window.loadMenuFromAPI === 'function') {
          const loadResult = window.loadMenuFromAPI();
          if (loadResult && typeof loadResult === 'object' && typeof loadResult.then === 'function') {
            loadResult.then(() => {
              const menuData = window.MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
              if (menuData.length > 0 && typeof renderMenuList === 'function') {
                renderMenuList(menuData[0]?.id);
              }
            }).catch(err => console.warn('Error loading menu from API:', err));
          } else {
            const menuData = window.MENU_DATA_FROM_API || (typeof MENU_DATA !== 'undefined' ? MENU_DATA : []);
            if (menuData.length > 0 && typeof renderMenuList === 'function') {
              renderMenuList(menuData[0]?.id);
            }
          }
        } else if (typeof MENU_DATA !== 'undefined' && MENU_DATA.length > 0) {
          if (typeof renderMenuList === 'function') {
            renderMenuList(MENU_DATA[0]?.id);
          }
        }
      }
    } catch (err) {
      console.warn('Error initializing menu tabs:', err);
    }
  }

  if (typeof setupMenuSearch === 'function') {
    setupMenuSearch();
  }

  if (typeof setupGallery === 'function') {
    setupGallery();
  }

  if (typeof setupCart === 'function') {
    setupCart();
  }

  if (typeof setupReviews === 'function') {
    setupReviews();
  }

  if (typeof setupReservationForm === 'function') {
    setupReservationForm();
  }

  if (typeof setupAnimations === 'function') {
    setupAnimations();
  }

  if (typeof setupFooter === 'function') {
    setupFooter();
  }

  if (typeof setupMenuBook === 'function') {
    setupMenuBook();
  }

  // Update cart UI to show fixed order button
  if (typeof updateCartUI === 'function') {
    updateCartUI();
  }

  // Setup intro screen first
  if (typeof setupIntroScreen === 'function') {
    setupIntroScreen();
  }

  console.log('✅ All modules initialized');
});

// Setup footer year
function setupFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Holiday Schedule Modal Functions
async function setupHolidayModal() {
  const holidayModal = document.getElementById('holidayModal');
  const holidayModalClose = document.getElementById('holidayModalClose');

  if (!holidayModal) {
    console.log('Holiday modal not found');
    return;
  }

  // Close button handler
  if (holidayModalClose) {
    holidayModalClose.addEventListener('click', closeHolidayModal);
  }

  // Close on overlay click
  holidayModal.addEventListener('click', (e) => {
    if (e.target === holidayModal) {
      closeHolidayModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && holidayModal.classList.contains('active')) {
      closeHolidayModal();
    }
  });

  // Load holiday schedule from API
  try {
    const response = await fetch('api/holiday-schedule.php?action=active');
    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      // Update modal content with data from API
      updateHolidayModalContent(data.data);

      // Show holiday modal after intro screen (3.5 seconds)
      // Only show on index page (homepage)
      const isIndexPage = !window.location.pathname.includes('menu') &&
        !window.location.pathname.includes('catalog') &&
        !window.location.pathname.includes('checkout') &&
        !window.location.pathname.includes('profile') &&
        !window.location.pathname.includes('reservation');

      if (isIndexPage) {
        // Check if user has already seen the modal today (using localStorage)
        const lastShown = localStorage.getItem('holidayModalLastShown');
        const today = new Date().toDateString();

        // Show modal if not shown today
        const shouldShow = !lastShown || lastShown !== today;

        if (shouldShow) {
          // Wait for intro screen to finish (3.5 seconds)
          setTimeout(() => {
            showHolidayModal();
            // Remember that we showed it today
            localStorage.setItem('holidayModalLastShown', today);
          }, 3500);
        }
      }
    } else {
      // No active holidays, hide modal
      console.log('No active holiday schedule found');
    }
  } catch (error) {
    console.error('Error loading holiday schedule:', error);
    // If API fails, don't show modal
  }
}

function updateHolidayModalContent(holidays) {
  const scheduleContainer = document.querySelector('.holiday-schedule');
  if (!scheduleContainer) return;

  scheduleContainer.innerHTML = holidays.map(holiday => {
    return `
      <div class="holiday-item">
        <span class="holiday-date">${holiday.date}</span>
        <span class="holiday-time">${holiday.time}</span>
      </div>
    `;
  }).join('');
}

function showHolidayModal() {
  const holidayModal = document.getElementById('holidayModal');
  if (!holidayModal) return;

  holidayModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Animate in
  setTimeout(() => {
    holidayModal.style.opacity = '1';
  }, 10);
}

function closeHolidayModal() {
  const holidayModal = document.getElementById('holidayModal');
  if (!holidayModal) return;

  holidayModal.style.opacity = '0';
  setTimeout(() => {
    holidayModal.classList.remove('active');
    document.body.style.overflow = '';
  }, 300);
}

// Initialize holiday modal
document.addEventListener('DOMContentLoaded', () => {
  setupHolidayModal();
});

// Expose functions globally
window.showHolidayModal = showHolidayModal;
window.closeHolidayModal = closeHolidayModal;

