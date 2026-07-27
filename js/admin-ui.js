/**
 * Leo Sushi Admin - UI & Interface Logic
 */

function switchTab(tab) {
    console.log('🔄 [UI] Switching to tab:', tab);
    document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.admin-tab, .nav-item').forEach(t => t.classList.remove('active'));

    const content = document.getElementById(tab + 'Content');
    if (content) content.classList.add('active');

    const tabBtn = document.querySelector(`.admin-tab[data-tab="${tab}"], .nav-item[data-tab="${tab}"]`);
    if (tabBtn) tabBtn.classList.add('active');

    // Load data if needed
    if (tab === 'stats' && typeof AdminStats !== 'undefined') AdminStats.loadStats();
    if (tab === 'customers' && typeof loadCustomers === 'function') loadCustomers();
    if (tab === 'menu' && typeof loadMenuItems === 'function') loadMenuItems();
}

function showAdminReservationSuccessNotification(reservation, reservationId, formattedTime) {
    const notification = document.createElement('div');
    notification.className = 'admin-success-notification';
    notification.id = 'adminReservationSuccessNotification';

    const reservationDateFormatted = reservation.date ? new Date(reservation.date).toLocaleDateString('de-DE', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    }) : '';

    notification.innerHTML = `
        <div class="admin-success-content">
            <div class="admin-success-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="32" fill="url(#adminReservationSuccessGradient)" />
                    <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <defs>
                        <linearGradient id="adminReservationSuccessGradient" x1="0" y1="0" x2="64" y2="64">
                            <stop offset="0%" stop-color="#10b981" />
                            <stop offset="100%" stop-color="#059669" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <h2 class="admin-success-title">Reservierung bestätigt!</h2>
            <p class="admin-success-message">Reservierung <strong>#${reservationId.replace('RES-', '').slice(-8)}</strong> wurde erfolgreich bestätigt.</p>
            <div class="admin-success-details">
                <div class="admin-detail-item">
                    <span class="admin-detail-label">Kunde:</span>
                    <span class="admin-detail-value">${reservation.first_name || ''} ${reservation.last_name || ''}</span>
                </div>
                <div class="admin-detail-item">
                    <span class="admin-detail-label">Datum & Zeit:</span>
                    <span class="admin-detail-value" style="color: var(--gold);">${reservationDateFormatted} um ${formattedTime || reservation.time || ''}</span>
                </div>
            </div>
            <button class="admin-success-btn" onclick="closeAdminReservationSuccessNotification()">Verstanden</button>
        </div>`;

    document.body.appendChild(notification);
    setTimeout(() => closeAdminReservationSuccessNotification(), 8000);
}

function closeAdminReservationSuccessNotification() {
    const notification = document.getElementById('adminReservationSuccessNotification');
    if (notification) {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }
}

function switchLoginMode(mode) {
    const tabNormal = document.getElementById('tabNormal');
    const tabMaster = document.getElementById('tabMaster');
    const normalFlow = document.getElementById('normalLoginFlow');
    const masterFlow = document.getElementById('masterLoginFlow');

    if (mode === 'normal') {
        if (tabNormal) { tabNormal.style.background = 'var(--gold)'; tabNormal.style.color = '#000'; }
        if (tabMaster) { tabMaster.style.background = 'transparent'; tabMaster.style.color = 'rgba(255,255,255,0.6)'; }
        if (normalFlow) normalFlow.style.display = 'block';
        if (masterFlow) masterFlow.style.display = 'none';
    } else {
        if (tabMaster) { tabMaster.style.background = 'var(--gold)'; tabMaster.style.color = '#000'; }
        if (tabNormal) { tabNormal.style.background = 'transparent'; tabNormal.style.color = 'rgba(255,255,255,0.6)'; }
        if (normalFlow) normalFlow.style.display = 'none';
        if (masterFlow) masterFlow.style.display = 'block';
        setTimeout(() => document.getElementById('masterKeyInput')?.focus(), 100);
    }
}

// Global Exports
window.switchTab = switchTab;
window.showAdminReservationSuccessNotification = showAdminReservationSuccessNotification;
window.closeAdminReservationSuccessNotification = closeAdminReservationSuccessNotification;
window.switchLoginMode = switchLoginMode;
