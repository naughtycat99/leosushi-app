// Main Module - Initialization
// This file contains main initialization code

console.log('main.js loaded');

// --- STORE STATUS CHECK ---
window.STORE_IS_OPEN = true;
fetch('api/store_status.php')
  .then(res => res.json())
  .then(data => {
     let storeIsOpen = data.is_open !== false;
     try {
         const currentSaved = localStorage.getItem('leoSelectedBranch');
         if (currentSaved) {
             const parsed = JSON.parse(currentSaved);
             if (parsed && parsed.id && data.branches && typeof data.branches[parsed.id] !== 'undefined') {
                 storeIsOpen = data.branches[parsed.id] !== false;
             }
         }
     } catch (e) {}
     window.STORE_IS_OPEN = storeIsOpen;
     
     // Only show banner on menu or checkout pages
     const isOrderPage = window.location.pathname.includes('menu') || window.location.pathname.includes('checkout') || window.location.pathname.includes('reservation');
     if (!window.STORE_IS_OPEN && isOrderPage) {
         // Show banner
         const banner = document.createElement('div');
         banner.style.cssText = 'position:fixed; top:0; left:0; right:0; background:#e63946; color:white; text-align:center; padding:12px; z-index:999999; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.5); font-size: 14px;';
         banner.innerHTML = '⚠️ Derzeit nehmen wir aufgrund von Überlastung oder ausverkauften Artikeln vorübergehend keine Bestellungen an. Wir bitten um Ihr Verständnis!';
         document.body.appendChild(banner);
         document.body.style.paddingTop = '45px';
     }
  })
  .catch(err => {
      window.STORE_IS_OPEN = true;
  });
// --------------------------


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
    const apiUrl = (typeof API_PHP_BASE_URL !== 'undefined' ? API_PHP_BASE_URL : 'api') + '/holiday-schedule.php?action=active';
    const response = await fetch(apiUrl);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return;
    }

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


function setupIntroScreen() {
  const introScreen = document.getElementById("introScreen");
  if (!introScreen) {
    setupPageLoadAnimations();
    return;
  }
  document.body.style.visibility = "visible";
  document.body.style.opacity = "1";
  document.body.style.display = "block";
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    introScreen.classList.add("hidden");
    setTimeout(() => {
      introScreen.style.display = "none";
      introScreen.style.visibility = "hidden";
      introScreen.style.pointerEvents = "none";
      introScreen.style.opacity = "0";
      introScreen.style.zIndex = "-1";
      document.body.style.overflow = "";
      document.body.style.overflowX = "hidden";
      setupPageLoadAnimations();
    }, 800);
  }, 2500);
}

function setupPageLoadAnimations() {
  const header = document.querySelector(".site-header");
  if (header) header.classList.add("page-load-animate", "animate-fade-in-down");
  const heroSection = document.querySelector(".hero-luxe");
  if (heroSection) heroSection.classList.add("page-load-animate", "animate-fade-in");
  const sections = document.querySelectorAll("section:not(.hero-luxe)");
  sections.forEach((section, index) => {
    section.classList.add("page-load-animate", "animate-fade-in-up", `animate-delay-${Math.min(index + 1, 8)}`);
  });
}



// --- LEO ALERT / NOTIFICATION ---
window.showLeoAlert = function(message, type = 'error') {
    // Remove existing if any
    const existing = document.getElementById('leo-alert-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'leo-alert-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ef4444' : (type === 'success' ? '#22c55e' : '#333')};
        color: white;
        padding: 14px 24px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        z-index: 9999999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease, top 0.3s ease;
        max-width: 90vw;
        text-align: center;
    `;

    const icon = document.createElement('span');
    icon.innerHTML = type === 'error' ? '⚠️' : '✅';
    icon.style.fontSize = '20px';

    const text = document.createElement('span');
    text.innerHTML = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.top = '40px';
    }, 10);

    // Remove after 3.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.top = '20px';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};
