// Auth Modal Management
// Handles login and register forms with sliding animation

console.log('auth-modal.js loaded');

let currentForm = 'login'; // 'login' or 'register'
let lastRegisteredEmail = '';

// Open auth modal with specific form
function openAuthModal(formType = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  
  // Set current form
  currentForm = formType;
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Show correct form
  switchAuthForm(formType);
  
  // Update header title
  updateAuthModalTitle(formType);
  
  // Focus first input
  setTimeout(() => {
    const activeWrapper = modal.querySelector('.auth-form-wrapper.active');
    if (activeWrapper) {
      const firstInput = activeWrapper.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  }, 100);
}

// Switch between login and register forms
function switchAuthForm(formType) {
  const loginWrapper = document.getElementById('loginFormWrapper');
  const registerWrapper = document.getElementById('registerFormWrapper');
  const forgotWrapper = document.getElementById('forgotFormWrapper');
  
  if (!loginWrapper || !registerWrapper || !forgotWrapper) return;
  
  if (formType === 'login') {
    loginWrapper.classList.add('active');
    registerWrapper.classList.remove('active');
    forgotWrapper.classList.remove('active');
    currentForm = 'login';
    updateAuthModalTitle('login');
  } else if (formType === 'register') {
    registerWrapper.classList.add('active');
    loginWrapper.classList.remove('active');
    forgotWrapper.classList.remove('active');
    currentForm = 'register';
    updateAuthModalTitle('register');
  } else if (formType === 'forgot') {
    forgotWrapper.classList.add('active');
    loginWrapper.classList.remove('active');
    registerWrapper.classList.remove('active');
    currentForm = 'forgot';
    updateAuthModalTitle('forgot');
  }
}

// Update modal header title
function updateAuthModalTitle(formType) {
  const title = document.getElementById('authModalTitle');
  if (title) {
    if (formType === 'login') {
      title.textContent = 'Willkommen zurück';
    } else if (formType === 'register') {
      title.textContent = 'Willkommen bei LEO SUSHI';
    } else if (formType === 'forgot') {
      title.textContent = 'Passwort vergessen';
    }
  }
}

// Close auth modal
function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear forms and messages
  clearAuthForms();
}

// Clear all forms and messages
function clearAuthForms() {
  // Clear login form
  const loginForm = document.getElementById('loginModalForm');
  if (loginForm) loginForm.reset();
  
  const loginError = document.getElementById('loginErrorMessage');
  if (loginError) {
    loginError.classList.remove('show');
    loginError.style.display = 'none';
    loginError.textContent = '';
  }
  
  // Clear register form
  const registerForm = document.getElementById('registerModalForm');
  if (registerForm) registerForm.reset();
  
  const registerError = document.getElementById('registerErrorMessage');
  if (registerError) {
    registerError.classList.remove('show');
    registerError.style.display = 'none';
    registerError.textContent = '';
  }
  
  const registerSuccess = document.getElementById('registerSuccessMessage');
  if (registerSuccess) {
    registerSuccess.classList.remove('show');
    registerSuccess.style.display = 'none';
    registerSuccess.textContent = '';
  }
  
  const discountBadge = document.getElementById('registerDiscountBadge');
  if (discountBadge) discountBadge.classList.add('hidden');

  const forgotForm = document.getElementById('forgotPasswordForm');
  if (forgotForm) forgotForm.reset();
  const forgotError = document.getElementById('forgotErrorMessage');
  const forgotSuccess = document.getElementById('forgotSuccessMessage');
  if (forgotError) {
    forgotError.classList.remove('show');
    forgotError.style.display = 'none';
    forgotError.textContent = '';
  }
  if (forgotSuccess) {
    forgotSuccess.classList.remove('show');
    forgotSuccess.style.display = 'none';
    forgotSuccess.textContent = '';
  }

  hideVerifySection();
}

function showVerifySection(email) {
  const section = document.getElementById('registerVerifySection');
  const verifyEmail = document.getElementById('registerVerifyEmail');
  const verifyCodeInput = document.getElementById('registerVerifyCode');
  const verifyError = document.getElementById('verifyErrorMessage');
  const verifySuccess = document.getElementById('verifySuccessMessage');

  if (verifyError) {
    verifyError.classList.remove('show');
    verifyError.textContent = '';
  }
  if (verifySuccess) {
    verifySuccess.classList.remove('show');
    verifySuccess.textContent = '';
  }

  if (section) {
    section.classList.remove('hidden');
  }
  if (verifyEmail && email) {
    verifyEmail.textContent = email;
  }
  if (verifyCodeInput) {
    verifyCodeInput.value = '';
    verifyCodeInput.focus();
  }
}

function hideVerifySection() {
  const section = document.getElementById('registerVerifySection');
  const verifyError = document.getElementById('verifyErrorMessage');
  const verifySuccess = document.getElementById('verifySuccessMessage');
  const verifyCodeInput = document.getElementById('registerVerifyCode');
  if (section) section.classList.add('hidden');
  if (verifyCodeInput) verifyCodeInput.value = '';
  if (verifyError) {
    verifyError.classList.remove('show');
    verifyError.textContent = '';
  }
  if (verifySuccess) {
    verifySuccess.classList.remove('show');
    verifySuccess.textContent = '';
  }
}

function handleAuthParam() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const authParam = url.searchParams.get('auth');
    if (authParam && (authParam === 'login' || authParam === 'register' || authParam === 'forgot')) {
      // Delay slightly to ensure modal initialized
      setTimeout(() => openAuthModal(authParam), 150);
      // Remove auth param from URL to avoid reopening on refresh
      url.searchParams.delete('auth');
      window.history.replaceState({}, '', url.pathname + (url.search ? '?' + url.searchParams.toString() : '') + url.hash);
    }
  } catch (error) {
    console.warn('handleAuthParam error:', error);
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('auth-modal')) {
    closeAuthModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.auth-modal.active');
    if (activeModal) {
      closeAuthModal();
    }
  }
});

// Initialize login form
function initLoginModal() {
  const form = document.getElementById('loginModalForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginModalBtn');
    const errorMessage = document.getElementById('loginErrorMessage');
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Hide error
    if (errorMessage) {
      errorMessage.classList.remove('show');
      errorMessage.textContent = '';
    }
    
    // Validate
    if (!identifier) {
      if (errorMessage) {
        errorMessage.textContent = 'Bitte geben Sie E-Mail oder Telefonnummer ein.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      return;
    }

    if (!password) {
      if (errorMessage) {
        errorMessage.textContent = 'Bitte geben Sie Ihr Passwort ein.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      return;
    }
    
    // Disable button
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Anmeldung läuft...';
    }
    
    // Login
    try {
      if (typeof window.loginUser === 'function') {
        let email = '';
        let phone = '';
        if (identifier.includes('@')) {
          email = identifier;
        } else {
          phone = identifier;
        }

        const result = await window.loginUser(email, phone, password);
        
        if (result.success) {
          // Close modal
          closeAuthModal();
          
          // Update header
          if (typeof window.updateHeaderAuth === 'function') {
            window.updateHeaderAuth();
          }
          
          // Show success message (optional)
          console.log('✅ Login successful');
        } else {
          // Show error
          if (errorMessage) {
            errorMessage.textContent = result.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
            errorMessage.style.display = 'block';
            setTimeout(() => errorMessage.classList.add('show'), 10);
          }
          
          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Anmelden';
          }
        }
      } else {
        throw new Error('Login function not available');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (errorMessage) {
        errorMessage.textContent = error.message || 'Ein Fehler ist aufgetreten.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Anmelden';
      }
    }
  });
}

// Initialize register form
function initRegisterModal() {
  const form = document.getElementById('registerModalForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const registerBtn = document.getElementById('registerModalBtn');
    const errorMessage = document.getElementById('registerErrorMessage');
    const successMessage = document.getElementById('registerSuccessMessage');
    const discountBadge = document.getElementById('registerDiscountBadge');
    
    // Hide messages
    if (errorMessage) {
      errorMessage.classList.remove('show');
      errorMessage.textContent = '';
    }
    if (successMessage) {
      successMessage.classList.remove('show');
      successMessage.textContent = '';
    }
    if (discountBadge) {
      discountBadge.classList.add('hidden');
    }
    
    // Get form data
    const userData = {
      firstName: document.getElementById('registerFirstName').value.trim(),
      lastName: document.getElementById('registerLastName').value.trim(),
      email: document.getElementById('registerEmail').value.trim(),
      phone: document.getElementById('registerPhone').value.trim(),
      password: document.getElementById('registerPassword').value,
      confirmPassword: document.getElementById('registerConfirmPassword').value,
      birthday: document.getElementById('registerBirthday')?.value || null,
      street: document.getElementById('registerStreet').value.trim(),
      postal: document.getElementById('registerPostal').value.trim(),
      city: document.getElementById('registerCity').value.trim()
    };
    
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
      if (errorMessage) {
        errorMessage.textContent = 'Bitte füllen Sie alle Pflichtfelder aus.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      return;
    }
    
    if (!userData.password || userData.password.length < 6) {
      if (errorMessage) {
        errorMessage.textContent = 'Passwort muss mindestens 6 Zeichen lang sein.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      if (errorMessage) {
        errorMessage.textContent = 'Passwörter stimmen nicht überein.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      return;
    }

    // Disable button
    if (registerBtn) {
      registerBtn.disabled = true;
      registerBtn.textContent = 'Registrierung läuft...';
    }
    
    // Register
    try {
      if (typeof window.registerUser === 'function') {
        const result = await window.registerUser(userData);
        
        if (result.success) {
          lastRegisteredEmail = userData.email;

          if (registerBtn) {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Registrieren';
          }

          if (typeof window.updateHeaderAuth === 'function') {
            window.updateHeaderAuth();
          }

          // Registration successful - user is automatically logged in
          // Welcome email with discount code has been sent
          closeAuthModal();
          
          // Show welcome discount code notification
          // Mã khuyến mãi cố định cho thành viên mới: LEO-WELCOME20 (20% off)
          const discountCode = result.user?.discountCode || 'LEO-WELCOME20';
          showWelcomeDiscountNotification(discountCode, userData.email);
        } else {
          // Show error
          if (errorMessage) {
            // Hiển thị thông báo lỗi rõ ràng - chuyển sang tiếng Đức nếu cần
            let errorText = result.error || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
            
            // Chuyển đổi thông báo lỗi từ tiếng Việt sang tiếng Đức
            if (errorText.includes('Số điện thoại đã được sử dụng') || errorText.includes('đã được sử dụng')) {
              errorText = 'Diese Telefonnummer wird bereits verwendet. Bitte verwenden Sie eine andere Telefonnummer oder melden Sie sich an.';
            } else if (errorText.includes('Email đã được sử dụng')) {
              errorText = 'Diese E-Mail-Adresse wird bereits verwendet. Bitte verwenden Sie eine andere E-Mail-Adresse oder melden Sie sich an.';
            }
            
            errorMessage.textContent = errorText;
            errorMessage.style.display = 'block';
            errorMessage.style.color = '#ef4444'; // Đảm bảo màu đỏ để dễ nhận biết
            setTimeout(() => errorMessage.classList.add('show'), 10);
          }
          
          if (registerBtn) {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Registrieren';
          }
        }
      } else {
        throw new Error('Register function not available');
      }
    } catch (error) {
      console.error('Register error:', error);
      if (errorMessage) {
        // Hiển thị thông báo lỗi rõ ràng, đặc biệt cho số điện thoại đã được sử dụng
        let errorText = error.message || 'Ein Fehler ist aufgetreten.';
        
        // Kiểm tra và thông báo rõ ràng hơn cho các lỗi phổ biến - bằng tiếng Đức
        if (error.message && (error.message.includes('Số điện thoại đã được sử dụng') || error.message.includes('phone'))) {
          errorText = 'Diese Telefonnummer wird bereits verwendet. Bitte verwenden Sie eine andere Telefonnummer oder melden Sie sich an.';
        } else if (error.message && (error.message.includes('Email đã được sử dụng') || error.message.includes('Email'))) {
          errorText = 'Diese E-Mail-Adresse wird bereits verwendet. Bitte verwenden Sie eine andere E-Mail-Adresse oder melden Sie sich an.';
        }
        
        errorMessage.textContent = errorText;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#ef4444'; // Đảm bảo màu đỏ để dễ nhận biết
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      if (registerBtn) {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Registrieren';
      }
    }
  });
}

function initForgotPasswordForm() {
  const form = document.getElementById('forgotPasswordForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('forgotPasswordBtn');
    const errorMessage = document.getElementById('forgotErrorMessage');
    const successMessage = document.getElementById('forgotSuccessMessage');
    const identifierInput = document.getElementById('forgotIdentifier');
    const identifier = identifierInput ? identifierInput.value.trim() : '';

    if (errorMessage) {
      errorMessage.classList.remove('show');
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }
    if (successMessage) {
      successMessage.classList.remove('show');
      successMessage.textContent = '';
      successMessage.style.display = 'none';
    }

    if (!identifier) {
      if (errorMessage) {
        errorMessage.textContent = 'Bitte geben Sie E-Mail oder Telefonnummer ein.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Wird gesendet...';
    }

    try {
      if (typeof window.requestPasswordReset === 'function') {
        const result = await window.requestPasswordReset(identifier);
        if (result.success) {
          if (successMessage) {
            successMessage.textContent = result.message || 'Wir haben Ihnen eine E-Mail geschickt.';
            successMessage.style.display = 'block';
            setTimeout(() => successMessage.classList.add('show'), 10);
          }
        } else {
          throw new Error(result.error || 'Ein Fehler ist aufgetreten.');
        }
      } else {
        throw new Error('API-Client nicht geladen. Bitte versuchen Sie es später erneut.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      if (errorMessage) {
        errorMessage.textContent = error.message || 'Ein Fehler ist aufgetreten.';
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.classList.add('show'), 10);
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Reset-Link senden';
      }
    }
  });
}

function initVerifySection() {
  const verifyBtn = document.getElementById('registerVerifyBtn');
  const verifyLaterBtn = document.getElementById('registerVerifyLaterBtn');

  if (verifyBtn) {
    verifyBtn.addEventListener('click', async () => {
      const codeInput = document.getElementById('registerVerifyCode');
      const verifyError = document.getElementById('verifyErrorMessage');
      const verifySuccess = document.getElementById('verifySuccessMessage');
      const emailField = document.getElementById('registerEmail');
      const email = lastRegisteredEmail || (emailField ? emailField.value.trim() : '');
      const code = codeInput ? codeInput.value.trim() : '';

      if (verifyError) {
        verifyError.classList.remove('show');
        verifyError.textContent = '';
      }
      if (verifySuccess) {
        verifySuccess.classList.remove('show');
        verifySuccess.textContent = '';
      }

      if (!code || !email) {
        if (verifyError) {
          verifyError.textContent = 'Bitte geben Sie den Verifizierungscode ein.';
          verifyError.style.display = 'block';
          setTimeout(() => verifyError.classList.add('show'), 10);
        }
        return;
      }

      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Prüfen...';

      try {
        if (!window.api || !window.api.auth || typeof window.api.auth.verifyEmail !== 'function') {
          throw new Error('API-Client nicht geladen. Bitte laden Sie die Seite neu.');
        }

        const result = await window.api.auth.verifyEmail(code, email);
        if (result.success) {
          if (verifySuccess) {
            verifySuccess.textContent = result.message || 'E-Mail erfolgreich bestätigt!';
            verifySuccess.style.display = 'block';
            setTimeout(() => verifySuccess.classList.add('show'), 10);
          }
          if (typeof window.updateHeaderAuth === 'function') {
            window.updateHeaderAuth();
          }
        } else {
          throw new Error(result.message || 'Verifizierung fehlgeschlagen.');
        }
      } catch (error) {
        console.error('Verify error:', error);
        if (verifyError) {
          verifyError.textContent = error.message || 'Ein Fehler ist aufgetreten.';
          verifyError.style.display = 'block';
          setTimeout(() => verifyError.classList.add('show'), 10);
        }
      } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Code bestätigen';
      }
    });
  }

  if (verifyLaterBtn) {
    verifyLaterBtn.addEventListener('click', () => {
      hideVerifySection();
    });
  }
}

// Initialize modals when DOM is ready
function initAuthModals() {
  // Wait for auth functions to be available
  if (typeof window.loginUser === 'function' && typeof window.registerUser === 'function') {
    initLoginModal();
    initRegisterModal();
    initVerifySection();
    initForgotPasswordForm();
    handleAuthParam();
  } else {
    // Retry after a short delay
    setTimeout(() => {
      if (typeof window.loginUser === 'function' && typeof window.registerUser === 'function') {
        initLoginModal();
        initRegisterModal();
        initVerifySection();
        initForgotPasswordForm();
        handleAuthParam();
      } else {
        console.warn('Auth functions not available, retrying...');
        setTimeout(initAuthModals, 500);
      }
    }, 100);
  }
}

/**
 * Show welcome discount code notification after successful registration
 */
function showWelcomeDiscountNotification(discountCode, email) {
  // Create notification modal
  const notification = document.createElement('div');
  notification.className = 'welcome-discount-notification';
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 2px solid var(--gold);
    border-radius: 16px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    z-index: 100001;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: fadeInScale 0.3s ease;
  `;
  
  notification.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
      <h2 style="color: var(--gold); margin: 0 0 12px 0; font-size: 24px; font-weight: 700;">
        Willkommen bei LEO SUSHI!
      </h2>
      <p style="color: rgba(255,255,255,0.8); margin: 0 0 24px 0; font-size: 15px; line-height: 1.5;">
        Vielen Dank für Ihre Registrierung!<br>
        Als neues Mitglied erhalten Sie einen exklusiven Gutscheincode.
      </p>
      <div style="background: rgba(229,207,142,0.1); border: 2px solid var(--gold); border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
          Ihr Willkommens-Gutscheincode
        </div>
        <div style="color: var(--gold); font-size: 32px; font-weight: 700; letter-spacing: 3px; font-family: monospace; margin: 8px 0;">
          ${discountCode}
        </div>
        <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-top: 8px;">
          20% Rabatt auf Ihre erste Bestellung
        </div>
      </div>
      <p style="color: rgba(255,255,255,0.7); margin: 20px 0 0 0; font-size: 13px; line-height: 1.5;">
        📧 Eine E-Mail mit Ihrem Gutscheincode wurde an<br>
        <strong style="color: var(--gold);">${email}</strong><br>
        gesendet.
      </p>
      <button onclick="this.closest('.welcome-discount-notification').remove()" 
              style="margin-top: 24px; padding: 12px 32px; background: var(--gold); color: #1a1a1a; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s;">
        Verstanden
      </button>
    </div>
    <style>
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    </style>
  `;
  
  // Add backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 100000;
    animation: fadeIn 0.3s ease;
  `;
  backdrop.onclick = () => {
    notification.remove();
    backdrop.remove();
  };
  
  document.body.appendChild(backdrop);
  document.body.appendChild(notification);
  
  // Auto close after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'fadeInScale 0.3s ease reverse';
      backdrop.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => {
        notification.remove();
        backdrop.remove();
      }, 300);
    }
  }, 10000);
}

// Expose functions globally
if (typeof window !== 'undefined') {
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.switchAuthForm = switchAuthForm;
  window.showWelcomeDiscountNotification = showWelcomeDiscountNotification;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthModals);
} else {
  initAuthModals();
}
