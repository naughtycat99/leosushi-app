/**
 * Leo Sushi Admin - Core Logic & Session Management
 */

// Global state
window.__adminDataInitialized = false;

// Check admin login status (server-side)
async function checkAdminLogin() {
    // 1. Check Master Key Bypass (Local Storage persistent)
    const masterToken = localStorage.getItem('leo_admin_session_token');
    const isLoggedInLocal = localStorage.getItem('leo_admin_logged_in') === 'true';

    if (masterToken === 'master_session_bypass' || (isLoggedInLocal && masterToken === 'master_session_bypass')) {
        const loginModal = document.getElementById('adminLoginModal');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminStatus = document.getElementById('adminStatus');

        if (loginModal) loginModal.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (adminStatus) adminStatus.textContent = '✓ Chủ quán (Bypass)';

        localStorage.setItem('leo_admin_logged_in', 'true');
        localStorage.setItem('leo_admin_role', 'owner');
        localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

        const statsBtnBypass = document.querySelector('.admin-tab[data-tab="stats"]');
        if (statsBtnBypass) statsBtnBypass.style.display = 'flex';

        return true;
    }

    // 2. Localhost helper - auto-fill bypass token if missing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (!localStorage.getItem('leo_admin_session_token')) {
            localStorage.setItem('leo_admin_session_token', 'master_session_bypass');
        }
        const loginModal = document.getElementById('adminLoginModal');
        if (loginModal) loginModal.style.display = 'none';
        localStorage.setItem('leo_admin_logged_in', 'true');
        return true;
    }

    try {
        let response = await fetch(`api/index.php?route=${encodeURIComponent('v1/session')}&_t=${Date.now()}`, {
            method: 'GET',
            credentials: 'include'
        });

        let checkData = null;
        try {
            checkData = await response.json();
        } catch (e) {
            checkData = { success: false, logged_in: false };
        }

        let finalData = checkData;

        if (!checkData || !checkData.logged_in) {
            const savedToken = localStorage.getItem('leo_admin_session_token');
            if (savedToken) {
                try {
                    const restoreResponse = await fetch(`api/index.php?route=${encodeURIComponent('v1/session/restore')}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: savedToken }),
                        credentials: 'include'
                    });
                    const restoreData = await restoreResponse.json();
                    if (restoreData && restoreData.success && restoreData.logged_in) {
                        finalData = restoreData;
                    } else {
                        localStorage.removeItem('leo_admin_session_token');
                    }
                } catch (e) {
                    console.error('Failed to restore admin session automatically:', e);
                }
            }
        }

        const isLoggedIn = finalData.success && finalData.logged_in === true;
        const role = finalData.role || 'staff';

        const loginModal = document.getElementById('adminLoginModal');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminStatus = document.getElementById('adminStatus');
        const passwordInput = document.getElementById('adminPassword');

        if (isLoggedIn) {
            if (loginModal) loginModal.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (adminStatus) adminStatus.textContent = '✓ ' + (role === 'owner' ? 'Owner' : 'Staff');
            if (passwordInput) passwordInput.value = '';

            localStorage.setItem('leo_admin_logged_in', 'true');
            localStorage.setItem('leo_admin_role', role);

            const adminMainContent = document.querySelector('.admin-layout');
            if (adminMainContent) adminMainContent.style.opacity = '1';

            const sidebarStatsBtn = document.querySelector('.admin-tab[data-tab="stats"]');
            if (sidebarStatsBtn) {
                sidebarStatsBtn.style.display = (role === 'owner' || masterToken === 'master_session_bypass') ? 'flex' : 'none';
            }

            if (!window.__adminDataInitialized) {
                console.log('🚀 [INIT] First load after login/restore, calling loadAllData()');
                window.__adminDataInitialized = true;
                if (typeof loadAllData === 'function') loadAllData();
            }
        } else {
            const currentBypassToken = localStorage.getItem('leo_admin_session_token');
            if (currentBypassToken === 'master_session_bypass') {
                return await checkAdminLogin();
            }
            if (loginModal) loginModal.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (adminStatus) adminStatus.textContent = '';
            localStorage.removeItem('leo_admin_logged_in');
            localStorage.removeItem('leo_admin_role');
        }

        return isLoggedIn;
    } catch (error) {
        console.error('Error checking admin login:', error);
        const loginModal = document.getElementById('adminLoginModal');
        if (loginModal) loginModal.style.display = 'flex';
        return false;
    }
}

// Handle admin login - Step 1: Send verification code
async function handleAdminLogin() {
    const password = document.getElementById('adminPassword')?.value;
    const loginBtn = document.querySelector('#loginStep1 .btn-confirm');
    const originalBtnText = loginBtn?.textContent;

    if (!password) {
        if (typeof showMenuNotification === 'function') showMenuNotification('❌ Bitte geben Sie ein Passwort ein.', 'error');
        return;
    }

    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Wird geprüft...';
    }

    try {
        const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/auth/send-code')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ password: password })
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            showMenuNotification('❌ Server-Fehler. Bitte versuchen Sie es erneut.', 'error');
            return;
        }

        const data = await response.json();

        if (data.success) {
            document.getElementById('loginStep1').style.display = 'none';
            document.getElementById('loginStep2').style.display = 'block';
            document.getElementById('adminVerificationCode').focus();
            showMenuNotification('✅ Bestätigungscode wurde an Ihre E-Mail gesendet.', 'success');
        } else {
            const message = data.message || 'Falsches Passwort';
            const attemptsRemaining = data.attempts_remaining;
            let errorMsg = `❌ ${message} `;
            if (attemptsRemaining !== undefined) {
                errorMsg += ` (${attemptsRemaining} Versuche verbleibend)`;
            }
            showMenuNotification(errorMsg, 'error');
        }
    } catch (error) {
        console.error('Error during admin login:', error);
        showMenuNotification('❌ Fehler beim Senden des Codes. Bitte versuchen Sie es erneut.', 'error');
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = originalBtnText || 'Weiter';
        }
    }
}

async function handleVerifyCode() {
    const code = document.getElementById('adminVerificationCode')?.value;
    const verifyBtn = document.querySelector('#loginStep2 .btn-confirm');
    const originalBtnText = verifyBtn?.textContent;

    if (!code || code.length !== 6) {
        showMenuNotification('❌ Bitte geben Sie den 6-stelligen Code ein.', 'error');
        return;
    }

    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Wird geprüft...';
    }

    try {
        const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/auth/verify-code')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code: code })
        });

        const data = await response.json();

        if (data.success) {
            if (data.session_id) localStorage.setItem('leo_admin_session_token', data.session_id);
            if (data.role) localStorage.setItem('leo_admin_role', data.role);

            showMenuNotification('✅ Erfolgreich angemeldet!', 'success');
            const loginModal = document.getElementById('adminLoginModal');
            if (loginModal) loginModal.style.display = 'none';

            document.getElementById('loginStep1').style.display = 'block';
            document.getElementById('loginStep2').style.display = 'none';
            await checkAdminLogin();
        } else {
            showMenuNotification(`❌ ${data.message || 'Ungültiger Code'} `, 'error');
        }
    } catch (error) {
        console.error('Error during code verification:', error);
        showMenuNotification('❌ Fehler tại thư viện Code-Verifizierung. Bitte versuchen Sie es erneut.', 'error');
    } finally {
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalBtnText || 'Code bestätigen';
        }
    }
}

async function handleMasterLogin() {
    const key = document.getElementById('masterKeyInput')?.value;
    if (key === '0301') {
        showMenuNotification('✅ Mật mã Chủ chính xác. Đang vào hệ thống...', 'success');
        localStorage.setItem('leo_admin_logged_in', 'true');
        localStorage.setItem('leo_admin_role', 'owner');
        localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

        const loginModal = document.getElementById('adminLoginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
            loginModal.setAttribute('data-bypass-active', 'true');
        }
        await checkAdminLogin();
        if (typeof loadAllData === 'function') await loadAllData(false);
        if (typeof switchTab === 'function') switchTab('orders');
    } else {
        showMenuNotification('❌ Mật mã Chủ không đúng!', 'error');
    }
}

async function handleAdminLogout() {
    if (!confirm('Möchten Sie sich abmelden?')) return;
    try {
        const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/session/end')}`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
            localStorage.removeItem('leo_admin_session_token');
            showMenuNotification('✅ Erfolgreich abgemeldet!', 'success');
            await checkAdminLogin();
        }
    } catch (error) {
        localStorage.removeItem('leo_admin_session_token');
        await checkAdminLogin();
    }
}

// Global Exports
window.checkAdminLogin = checkAdminLogin;
window.handleAdminLogin = handleAdminLogin;
window.handleVerifyCode = handleVerifyCode;
window.handleMasterLogin = handleMasterLogin;
window.handleAdminLogout = handleAdminLogout;

// Auto-refresh loops
let isRefreshingOrders = false;
let refreshPaused = false;
let isUserInteracting = false;

function isModalOpen() {
    return !!document.querySelector('.modal.active, .time-schedule-modal.active, .admin-login-modal[style*="display: flex"]');
}

async function autoRefreshData() {
    if (localStorage.getItem('leo_admin_logged_in') === 'true' && !refreshPaused) {
        if (!isUserInteracting && !isModalOpen()) {
            const activeTab = document.querySelector('.admin-tab.active');
            const tabId = activeTab ? activeTab.dataset.tab : '';

            try {
                if (tabId === 'orders' && !isRefreshingOrders) {
                    isRefreshingOrders = true;
                    if (typeof loadOrders === 'function') await loadOrders(true, true);
                    isRefreshingOrders = false;
                } else if (tabId === 'reservations') {
                    if (typeof loadReservations === 'function') await loadReservations(true);
                } else if (tabId === 'stats') {
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                        await AdminStats.loadStats(AdminStats.currentPeriod, AdminStats.customDate, true);
                    }
                }
            } catch (e) {
                console.warn('Auto-refresh error (silent):', e);
                isRefreshingOrders = false;
            }
        }
    }
    setTimeout(autoRefreshData, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Check login first
    checkAdminLogin().then(() => {
        // Start refresh loop if logged in
        setTimeout(autoRefreshData, 5000);
    });
});
