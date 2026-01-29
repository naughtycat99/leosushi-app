// Header Authentication Management
// This file handles the display of auth links vs user menu based on login status

console.log('header-auth.js loaded');

// Update header based on authentication status
function updateHeaderAuth() {
  const authLinks = document.getElementById('authLinks');
  const userMenuWrapper = document.getElementById('userMenuWrapper');
  
  if (!authLinks || !userMenuWrapper) {
    console.warn('Header auth elements not found');
    return;
  }

  // Check if user is authenticated
  const isAuth = typeof window.isAuthenticated === 'function' && window.isAuthenticated();
  const user = typeof window.getCurrentUser === 'function' ? window.getCurrentUser() : null;

  if (isAuth && user) {
    // User is logged in - show user menu, hide auth links
    authLinks.style.display = 'none';
    userMenuWrapper.style.display = 'flex';

    // Update user info
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const userStatusEl = document.getElementById('userStatus');
    const userAvatarEl = document.getElementById('userAvatar');

    if (userNameEl) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      userNameEl.textContent = fullName || user.email?.split('@')[0] || 'Benutzer';
    }

    if (userEmailEl) {
      userEmailEl.textContent = user.email || '';
    }

    if (userStatusEl) {
      if (user.emailVerified) {
        userStatusEl.textContent = 'E-Mail verifiziert';
        userStatusEl.classList.add('verified');
      } else {
        userStatusEl.textContent = 'E-Mail nicht verifiziert';
        userStatusEl.classList.remove('verified');
      }
    }

    // Generate avatar from name
    if (userAvatarEl && user.firstName) {
      const initial = user.firstName.charAt(0).toUpperCase();
      userAvatarEl.textContent = initial;
    }
  } else {
    // User is not logged in - show auth links, hide user menu
    authLinks.style.display = 'flex';
    userMenuWrapper.style.display = 'none';
  }
}

// Setup user menu toggle
function setupUserMenu() {
  const userMenuToggle = document.getElementById('userMenuToggle');
  const userMenu = userMenuToggle?.closest('.user-menu');
  const logoutBtn = document.getElementById('logoutBtn');

  if (userMenuToggle && userMenu) {
    userMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.logoutUser === 'function') {
        window.logoutUser();
        updateHeaderAuth();
        // Redirect to home page
        if (window.location.pathname.includes('menu') || window.location.pathname.includes('catalog')) {
          window.location.href = '/';
        }
      }
    });
  }

  // Notification toggle is now handled by notifications.js
  // No need to set up here - notifications.js will handle it
}

// Initialize header auth on page load
function initHeaderAuth() {
  // Wait for auth-mysql.js to load
  if (typeof window.isAuthenticated === 'function') {
    updateHeaderAuth();
    setupUserMenu();
  } else {
    // Retry after a short delay if auth-mysql.js hasn't loaded yet
    setTimeout(() => {
      if (typeof window.isAuthenticated === 'function') {
        updateHeaderAuth();
        setupUserMenu();
      } else {
        console.warn('auth-mysql.js not loaded, retrying...');
        setTimeout(initHeaderAuth, 500);
      }
    }, 100);
  }
}

// Listen for storage changes (when user logs in/out in another tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'leo_user' || e.key === null) {
    updateHeaderAuth();
  }
});

// Expose update function globally so it can be called after login/register
if (typeof window !== 'undefined') {
  window.updateHeaderAuth = updateHeaderAuth;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderAuth);
} else {
  initHeaderAuth();
}

