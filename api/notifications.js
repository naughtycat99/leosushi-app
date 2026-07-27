/**
 * Notification System for LEO SUSHI
 * Handles customer notifications: order success, order confirmed, reservation success
 */

// Notification types
const NOTIFICATION_TYPES = {
  ORDER_SUCCESS: 'order_success',
  ORDER_CONFIRMED: 'order_confirmed',
  RESERVATION_SUCCESS: 'reservation_success',
  RESERVATION_CONFIRMED: 'reservation_confirmed'
};

// Storage key
const NOTIFICATIONS_STORAGE_KEY = 'leoNotifications';

/**
 * Initialize notification system
 */
function initNotificationSystem() {
  // Load notifications from storage
  loadNotifications();

  // Setup notification toggle
  const notificationToggle = document.getElementById('notificationToggle');
  if (notificationToggle) {
    notificationToggle.addEventListener('click', toggleNotificationPanel);
  }

  // Create notification panel if it doesn't exist
  createNotificationPanel();

  // Update badge
  updateNotificationBadge();
}

/**
 * Create notification panel HTML
 */
function createNotificationPanel() {
  if (document.getElementById('notificationPanel')) return;

  const panel = document.createElement('div');
  panel.id = 'notificationPanel';
  panel.className = 'notification-panel';
  panel.innerHTML = `
    <div class="notification-panel-header">
      <h3>Benachrichtigungen</h3>
      <button class="notification-close-btn" onclick="closeNotificationPanel()">×</button>
    </div>
    <div class="notification-panel-body" id="notificationPanelBody">
      <div class="notification-empty" id="notificationEmpty">
        <div class="notification-empty-icon">🔔</div>
        <p>Keine Benachrichtigungen</p>
      </div>
    </div>
    <div class="notification-panel-footer" id="notificationPanelFooter" style="display: none;">
      <button class="notification-clear-btn" onclick="clearAllNotifications()">Alle löschen</button>
    </div>
  `;

  // Insert after notification toggle
  const notificationToggle = document.getElementById('notificationToggle');
  if (notificationToggle && notificationToggle.parentElement) {
    notificationToggle.parentElement.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }
}

/**
 * Get all notifications from storage
 */
function getNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading notifications:', e);
    return [];
  }
}

/**
 * Save notifications to storage
 */
function saveNotifications(notifications) {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

/**
 * Add a new notification
 */
function addNotification(type, title, message, data = {}) {
  const notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    title: title,
    message: message,
    data: data,
    read: false,
    timestamp: new Date().toISOString(),
    createdAt: Date.now()
  };

  const notifications = getNotifications();
  notifications.unshift(notification); // Add to beginning

  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }

  saveNotifications(notifications);
  renderNotifications();
  updateNotificationBadge();

  // Show toast notification
  showNotificationToast(notification);

  return notification;
}

/**
 * Mark notification as read
 */
function markNotificationAsRead(notificationId) {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
    renderNotifications();
    updateNotificationBadge();
  }
}

/**
 * Mark all notifications as read
 */
function markAllNotificationsAsRead() {
  const notifications = getNotifications();
  notifications.forEach(n => n.read = true);
  saveNotifications(notifications);
  renderNotifications();
  updateNotificationBadge();
}

/**
 * Delete notification
 */
function deleteNotification(notificationId) {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== notificationId);
  saveNotifications(filtered);
  renderNotifications();
  updateNotificationBadge();
}

/**
 * Clear all notifications
 */
function clearAllNotifications() {
  // Show custom confirmation dialog instead of browser confirm
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'notification-confirm-dialog';
  confirmDialog.innerHTML = `
    <div class="notification-confirm-content">
      <h3>Benachrichtigungen löschen?</h3>
      <p>Möchten Sie wirklich alle Benachrichtigungen löschen?</p>
      <div class="notification-confirm-actions">
        <button class="notification-confirm-btn notification-confirm-cancel" onclick="this.closest('.notification-confirm-dialog').remove()">Abbrechen</button>
        <button class="notification-confirm-btn notification-confirm-delete" onclick="confirmDeleteAllNotifications()">Löschen</button>
      </div>
    </div>
  `;

  document.body.appendChild(confirmDialog);

  // Close on outside click
  confirmDialog.addEventListener('click', (e) => {
    if (e.target === confirmDialog) {
      confirmDialog.remove();
    }
  });
}

/**
 * Confirm delete all notifications (called from dialog)
 */
function confirmDeleteAllNotifications() {
  // Remove dialog
  const dialog = document.querySelector('.notification-confirm-dialog');
  if (dialog) {
    dialog.remove();
  }

  // Clear notifications
  saveNotifications([]);
  renderNotifications();
  updateNotificationBadge();
}

/**
 * Load and render notifications
 */
function loadNotifications() {
  renderNotifications();
  updateNotificationBadge();
}

/**
 * Render notifications in panel
 */
function renderNotifications() {
  const panelBody = document.getElementById('notificationPanelBody');
  const panelFooter = document.getElementById('notificationPanelFooter');
  const emptyState = document.getElementById('notificationEmpty');

  if (!panelBody) return;

  const notifications = getNotifications();

  if (notifications.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (panelFooter) panelFooter.style.display = 'none';
    panelBody.innerHTML = `
      <div class="notification-empty">
        <div class="notification-empty-icon">🔔</div>
        <p>Keine Benachrichtigungen</p>
      </div>
    `;
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (panelFooter) panelFooter.style.display = 'block';

  panelBody.innerHTML = notifications.map(notif => {
    const isRead = notif.read;
    const timeAgo = getTimeAgo(new Date(notif.timestamp));
    const icon = getNotificationIcon(notif.type, notif.data);
    const isError = notif.data?.error;

    return `
      <div class="notification-item ${isRead ? 'read' : 'unread'} ${isError ? 'error' : ''}" data-notification-id="${notif.id}">
        <div class="notification-item-icon">${icon}</div>
        <div class="notification-item-content">
          <div class="notification-item-header">
            <h4 class="notification-item-title">${notif.title}</h4>
            <button class="notification-item-delete" onclick="deleteNotification('${notif.id}')" title="Löschen">×</button>
          </div>
          <p class="notification-item-message">${notif.message}</p>
          <div class="notification-item-footer">
            <span class="notification-item-time">${timeAgo}</span>
            ${!isRead ? `<button class="notification-item-mark-read" onclick="markNotificationAsRead('${notif.id}')">Als gelesen markieren</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Update notification badge
 */
function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  if (!badge) return;

  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (unreadCount > 0) {
    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

/**
 * Toggle notification panel
 */
function toggleNotificationPanel() {
  const panel = document.getElementById('notificationPanel');
  if (!panel) return;

  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    closeNotificationPanel();
  } else {
    openNotificationPanel();
  }
}

/**
 * Open notification panel
 */
function openNotificationPanel() {
  const panel = document.getElementById('notificationPanel');
  if (panel) {
    panel.classList.add('open');
    // Mark all as read when opening
    markAllNotificationsAsRead();
  }
}

/**
 * Close notification panel
 */
function closeNotificationPanel() {
  const panel = document.getElementById('notificationPanel');
  if (panel) {
    panel.classList.remove('open');
  }
}

/**
 * Show toast notification
 */
function showNotificationToast(notification) {
  // Remove any existing toasts first
  const existingToasts = document.querySelectorAll('.notification-toast');
  existingToasts.forEach(t => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  });

  const isError = notification.data?.error;
  const icon = getNotificationIcon(notification.type, notification.data);

  const toast = document.createElement('div');
  toast.className = `notification-toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `
    <div class="notification-toast-icon">${icon}</div>
    <div class="notification-toast-content">
      <div class="notification-toast-title">${notification.title}</div>
      <div class="notification-toast-message">${notification.message}</div>
    </div>
    <button class="notification-toast-close" onclick="closeNotificationToast(this)">×</button>
  `;

  // Make toast clickable to open notification panel
  toast.style.cursor = 'pointer';
  toast.addEventListener('click', (e) => {
    // Don't close if clicking the close button
    if (e.target.classList.contains('notification-toast-close')) {
      return;
    }
    // Open notification panel
    if (window.openNotificationPanel) {
      window.openNotificationPanel();
    }
    // Close toast
    closeNotificationToast(toast.querySelector('.notification-toast-close'));
  });

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    closeNotificationToast(toast.querySelector('.notification-toast-close'));
  }, 5000);
}

/**
 * Close notification toast
 */
function closeNotificationToast(closeBtn) {
  const toast = closeBtn ? closeBtn.closest('.notification-toast') : null;
  if (!toast) return;

  toast.classList.remove('show');
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 300);
}

/**
 * Get notification icon by type
 */
function getNotificationIcon(type) {
  // Check if it's an error notification
  if (type === NOTIFICATION_TYPES.ORDER_SUCCESS && arguments[1]?.error) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  }

  const icons = {
    [NOTIFICATION_TYPES.ORDER_SUCCESS]: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    [NOTIFICATION_TYPES.ORDER_CONFIRMED]: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    [NOTIFICATION_TYPES.RESERVATION_SUCCESS]: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    [NOTIFICATION_TYPES.RESERVATION_CONFIRMED]: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
  };

  return icons[type] || '🔔';
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
  if (hours > 0) return `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
  if (minutes > 0) return `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
  return 'gerade eben';
}

// Expose functions to window
window.addNotification = addNotification;
window.markNotificationAsRead = markNotificationAsRead;
window.deleteNotification = deleteNotification;
window.clearAllNotifications = clearAllNotifications;
window.confirmDeleteAllNotifications = confirmDeleteAllNotifications;
window.toggleNotificationPanel = toggleNotificationPanel;
window.openNotificationPanel = openNotificationPanel;
window.closeNotificationPanel = closeNotificationPanel;
window.closeNotificationToast = closeNotificationToast;
window.NOTIFICATION_TYPES = NOTIFICATION_TYPES;

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
  initNotificationSystem();
}

