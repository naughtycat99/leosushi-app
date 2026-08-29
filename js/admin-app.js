
/**
 * LEO SUSHI - PREMIUM MODERN ADMIN APP v1.5
 * Smart Status Logic: Auto-Confirm Ship/Pickup, Wait for Dine-in/Res
 */
window.onerror = function (msg, url, lineNo, columnNo, error) {
    alert("JS Error: " + msg + "\nLine: " + lineNo + "\nCol: " + columnNo + "\nStack: " + (error && error.stack ? error.stack : ''));
    return false;
};
window.addEventListener('unhandledrejection', function (event) {
    alert("Promise Error: " + (event.reason && event.reason.stack ? event.reason.stack : event.reason));
});

// Auto-detect API Base from api.v2.js or fallback to relative
const API_BASE = (typeof API_PHP_BASE_URL !== 'undefined' ? API_PHP_BASE_URL : 'api') + '/index.php?route=';
const REFRESH_INTERVAL = 5000;
const PREP_TIME_MINS = 20;

window.currentDateFilter = 'today';
window.adminData = {
    orders: [],
    reservations: [],
    activeTab: 'orders',
    lastKnownOrderId: null,
    isFetching: false,
    sortMode: 'priority' // 'priority' or 'time'
};

const NOTIF_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
const URGENT_ALARM_URL = 'https://www.soundjay.com/buttons/sounds/button-3.mp3'; // Tiếng còi báo động hơn
let notificationAudio = new Audio(NOTIF_SOUND_URL);
let urgentAlarmAudio = new Audio(URGENT_ALARM_URL);
let lastUrgentAlarmTime = 0;

// --- NAVIGATION ---
window.switchTab = function (tabId) {
    console.log('🔄 [UI] switchTab called with:', tabId);
    window.adminData.activeTab = tabId;

    // 1. Update Sidebar Active State
    document.querySelectorAll('.admin-tab, .sidebar-item').forEach(tab => {
        const tid = tab.dataset.tab || (tab.onclick && tab.onclick.toString().includes(tabId) ? tabId : null);
        if (tid === tabId) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    // 2. Update Bottom Nav Active State
    document.querySelectorAll('.nav-item').forEach(nav => {
        const navTab = nav.dataset.tab;
        if (navTab === tabId) nav.classList.add('active');
        else nav.classList.remove('active');
    });

    // 3. Update Content Visibility
    const tabContents = {
        'orders': 'ordersContent',
        'reservations': 'reservationsContent',
        'customers': 'customersContent',
        'menu': 'menuContent',
        'discount-codes': 'discountContent',
        'promotions': 'promotionsContent',
        'holiday-schedule': 'holidayContent',
        'stats': 'statsContent'
    };

    Object.values(tabContents).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const activeContentId = tabContents[tabId];
    const activeContent = document.getElementById(activeContentId);
    if (activeContent) {
        activeContent.style.display = 'block';
        // Show/Hide order filters based on tab
        const filters = document.querySelector('.admin-filters');
        if (filters) {
            filters.style.display = (tabId === 'orders' || tabId === 'reservations') ? 'flex' : 'none';
        }
    }

    // 4. Load data based on tab
    if (tabId === 'orders') {
        window.loadOrders();
    } else if (tabId === 'reservations') {
        window.loadReservations();
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    checkAuth();

    // Vòng lặp chính cập nhật đồng hồ và kiểm tra cảnh báo
    setInterval(() => {
        updateCountdowns();
        checkUrgentOrders();
    }, 1000);

    // Vòng lặp cập nhật thông minh
    setInterval(async () => {
        if (!window.adminData.isFetching) {
            await refreshData();
        }
    }, REFRESH_INTERVAL);
});

function initializeUI() {
    const ap = document.getElementById('autoPrintToggle');
    if (ap) ap.checked = localStorage.getItem('autoPrintEnabled') === 'true';

    const ac = document.getElementById('autoConfirmToggle');
    if (ac) ac.checked = localStorage.getItem('autoConfirmEnabled') !== 'false';

    checkAuth();
    updateAdminRoleBadge();
    if (typeof window.switchTab === 'function') window.switchTab('orders');

    // Initialize Printer Manager
    if (typeof PrinterManager !== 'undefined') {
        PrinterManager.init();
        updatePrinterStatusUI();
    }

    // Monitor printer discovery
    window.addEventListener('printersFound', (e) => {
        const { type, devices, error } = e.detail;
        if (type === 'network') {
            renderLanScanResults(devices, error);
        }
    });

    // Load saved printer IP
    const savedIp = localStorage.getItem('lan_printer_ip');
    if (savedIp) {
        const ipInput = document.getElementById('printerIpInput');
        if (ipInput) ipInput.value = savedIp;
    }

    // Khôi phục trạng thái bộ gạt Tự động nhận đơn & Tự động in
    const autoConfirm = localStorage.getItem('autoConfirmEnabled') === 'true';
    const autoPrint = localStorage.getItem('autoPrintEnabled') === 'true';

    const confirmToggle = document.getElementById('autoConfirmToggle');
    if (confirmToggle) confirmToggle.checked = autoConfirm;

    const printToggle = document.getElementById('autoPrintToggle');
    if (printToggle) printToggle.checked = autoPrint;

    // Thêm đèn báo hiệu "Live" vào giao diện
    const topBar = document.querySelector('.top-bar');
    if (topBar && !document.getElementById('liveIndicator')) {
        const live = document.createElement('div');
        live.id = 'liveIndicator';
        live.innerHTML = `<span style="width:8px; height:8px; background:#34C759; border-radius:50%; display:inline-block; margin-right:5px; box-shadow:0 0 10px #34C759; animation: pulse 1.5s infinite;"></span> <span style="font-size:10px; font-weight:800; color:#34C759; letter-spacing:1px;">REAL-TIME ACTIVE</span>`;
        live.style.cssText = "display:flex; align-items:center; background:rgba(52,199,89,0.1); padding:4px 10px; border-radius:20px; margin-left:15px;";
        topBar.insertBefore(live, topBar.firstChild);

        const style = document.createElement('style');
        style.innerHTML = "@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }";
        document.head.appendChild(style);
    }
}

// Move handleAdminLogin to global scope immediately
window.handleAdminLogin = function () {
    const pwInput = document.getElementById('adminPassword');
    if (!pwInput) return;
    const pw = pwInput.value;

    const roleMap = {
        '0301': { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' },
        '03011': { role: 'branch_admin', branch: 'branch_flora', label: 'Admin - Florastraße' },
        '03012': { role: 'branch_admin', branch: 'branch_haupt', label: 'Admin - Hauptstraße' }
    };

    const matched = roleMap[pw];
    if (matched) {
        localStorage.setItem('leo_admin_session_token', 'master_session_bypass');
        localStorage.setItem('leo_admin_role', JSON.stringify(matched));
        const modal = document.getElementById('adminLoginModal');
        if (modal) modal.style.display = 'none';
        if (typeof updateAdminRoleBadge === 'function') updateAdminRoleBadge();
        refreshData();
    } else {
        alert('Sai mật khẩu! Vui lòng thử lại.');
    }
};

function checkAuth() {
    if (localStorage.getItem('leo_admin_session_token')) {
        const modal = document.getElementById('adminLoginModal');
        if (modal) modal.style.display = 'none';
        refreshData();
    }
}

window.handleAdminLogout = () => {
    if (confirm('Bạn muốn đăng xuất?')) {
        localStorage.removeItem('leo_admin_session_token');
        localStorage.removeItem('leo_admin_role');
        location.reload();
    }
};

// Get current admin role
function getAdminRole() {
    try {
        const saved = localStorage.getItem('leo_admin_role');
        if (saved) return JSON.parse(saved);
    } catch (e) { }
    return { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' };
}

// Update role badge in sidebar
function updateAdminRoleBadge() {
    const roleInfo = getAdminRole();
    const brandEl = document.querySelector('.sidebar-brand p');
    if (brandEl && roleInfo && roleInfo.label) {
        brandEl.textContent = roleInfo.label;
        brandEl.style.color = roleInfo.role === 'owner' ? '#d4af37' : '#34C759';
    }
    // Show/hide branch filter for owner
    const branchFilter = document.getElementById('adminBranchFilter');
    if (branchFilter) {
        branchFilter.style.display = roleInfo.role === 'owner' ? 'flex' : 'none';
    }
}

async function refreshData() {
    if (window.adminData.isFetching) return;
    window.adminData.isFetching = true;

    const tab = window.adminData.activeTab;
    try {
        if (tab === 'orders') await loadOrders(true);
        else if (tab === 'reservations') await loadReservations(true);
        else if (tab === 'customers') await loadCustomers(true);
        else if (tab === 'menu') await loadMenuItems(true);
        else if (tab === 'discount-codes') await loadDiscountCodes(true);
        else if (tab === 'holiday-schedule') await loadHolidaySchedule(true);
        else if (tab === 'stats' && window.AdminStats) AdminStats.loadStats();

        updateSidebarBadges();
    } catch (e) {
        console.error("Refresh error:", e);
    } finally {
        window.adminData.isFetching = false;
    }
}

// --- HELPER FETCH ---
async function adminFetch(endpoint, options = {}) {
    const token = localStorage.getItem('leo_admin_session_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (response.status === 401) {
        // Nếu bị từ chối do hết hạn, quay lại trang login
        localStorage.removeItem('leo_admin_session_token');
        const loginModal = document.getElementById('adminLoginModal');
        if (loginModal) loginModal.style.display = 'flex';
        throw new Error('Unauthorized');
    }

    return response;
}

// --- VIEWED ORDERS TRACKING ---
function getViewedOrders() {
    try {
        return JSON.parse(localStorage.getItem('leo_viewed_orders') || '[]');
    } catch (e) { return []; }
}

function markOrderAsViewed(id) {
    let viewed = getViewedOrders();
    if (!viewed.includes(id)) {
        viewed.push(id);
        localStorage.setItem('leo_viewed_orders', JSON.stringify(viewed.slice(-200))); // Giữ 200 đơn gần nhất
        displayOrders(window.adminData.orders); // Re-render to clear "NEW" badge
    }
}

// --- NOTIFICATION QUEUE ---
let activeNotifications = [];
function showOrderNotification(order) {
    const id = order.order_id || order.id;
    if (activeNotifications.includes(id)) return;
    activeNotifications.push(id);

    const overlay = document.createElement('div');
    overlay.className = 'order-notification-overlay';
    overlay.id = `notif-${id}`;

    const customerName = order.customer_name || 'Khách hàng mới';
    const total = order.order_total || order.total || '0 €';

    // Localization based on service type
    let title = '🔔 CÓ ĐƠN MỚI';
    let typeLabel = 'Loại:';
    let totalLabel = 'Tổng:';
    let viewBtnText = '📍 XEM CHI TIẾT NGAY';
    let dismissBtnText = '✅ ĐÃ XEM / ĐÓNG';
    let type = order.service_type === 'delivery' ? 'Giao hàng' : (order.service_type === 'pickup' ? 'Đến lấy' : 'Ăn tại chỗ');

    if (order.service_type === 'reservation' || id.toString().startsWith('RES-')) {
        title = '📅 NEUE RESERVIERUNG';
        typeLabel = 'Typ:';
        totalLabel = 'Gäste:';
        viewBtnText = '📍 DETAILS ANSEHEN';
        dismissBtnText = '✅ GELESEN / SCHLIESSEN';
        type = 'Reservierung';
    }

    overlay.innerHTML = `
        <div class="notification-card">
            <span class="new-label">${title}</span>
            <h1>${customerName}</h1>
            <p style="margin-bottom:20px;">${typeLabel} <b>${type}</b> - ${totalLabel} <b>${total}</b></p>
            <div class="notif-btn-group">
                <button class="notif-btn-main" onclick="viewOrderDetail('${id}')">${viewBtnText}</button>
                <button class="notif-btn-sec" onclick="dismissNotification('${id}')">${dismissBtnText}</button>
            </div>
        </div>
    `;

    // Stack notifications if multiple exist
    const existing = document.querySelectorAll('.order-notification-overlay').length;
    if (existing > 0) {
        overlay.style.backgroundColor = 'transparent';
        overlay.style.backdropFilter = 'none';
        overlay.querySelector('.notification-card').style.marginTop = `${existing * 40}px`;
    }

    document.body.appendChild(overlay);

    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
    }
}

window.viewOrderDetail = function (id) {
    dismissNotification(id);

    if (id.toString().startsWith('RES-')) {
        window.switchTab('reservations');
    } else {
        window.switchTab('orders');
    }

    // Đợi UI render xong rồi scroll và mở chi tiết
    setTimeout(() => {
        const isRes = id.toString().startsWith('RES-');
        const prefix = isRes ? 'res-card-' : 'order-card-';
        const card = document.getElementById(`${prefix}${id}`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('unread-order-highlight');

            // Tự động mở bảng chi tiết luôn
            if (isRes) {
                // Đặt bàn hiện tại chưa có modal chi tiết riêng, thường xem trực tiếp trên card
                // Nhưng nếu sau này có hàm showReservationDetails thì gọi ở đây
            } else {
                if (typeof window.showOrderDetails === 'function') window.showOrderDetails(id);
            }

            setTimeout(() => card.classList.remove('unread-order-highlight'), 5000);
        }
    }, 800);
};

window.dismissNotification = function (id) {
    const el = document.getElementById(`notif-${id}`);
    if (el) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        setTimeout(() => el.remove(), 500);
    }
    markOrderAsViewed(id);
    activeNotifications = activeNotifications.filter(nid => nid !== id);
};

// --- ORDERS ---
window.loadOrders = async function (silent = false) {
    if (window.adminData.activeTab !== 'orders') return;
    const list = document.getElementById('ordersList');
    let status = document.querySelector('#ordersContent .filter-btn.active')?.dataset.status || 'all';
    const cacheBuster = `&_t=${Date.now()}`;

    if (!silent && list) {
        list.innerHTML = `<div style="text-align:center; padding:100px; grid-column:1/-1;"><div class="premium-loader"></div></div>`;
    }

    const fetchStatus = (status === 'overdue') ? 'confirmed' : status;

    try {
        let data = { success: false, orders: [] };
        try {
            const adminRole = getAdminRole();
            let branchParam = '';
            if (adminRole && adminRole.role === 'branch_admin' && adminRole.branch) {
                branchParam = `&branch_id=${adminRole.branch}`;
            } else {
                const branchSelect = document.getElementById('adminBranchSelect');
                if (branchSelect && branchSelect.value && branchSelect.value !== 'all') {
                    branchParam = `&branch_id=${branchSelect.value}`;
                }
            }
            const res = await adminFetch(`${API_BASE}v1/data/orders&status=${fetchStatus}${branchParam}${cacheBuster}`);
            data = await res.json();
        } catch (fetchErr) {
            console.warn("Fetch orders failed, using samples:", fetchErr);
        }



        if (data.success && data.orders) {
            // Cập nhật ngầm dữ liệu đặt bàn để hiện Badge ở sidebar
            try {
                const resRes = await adminFetch(`${API_BASE}v1/data/reservations&status=all`);
                const resData = await resRes.json();
                if (resData.success && resData.reservations) {
                    window.adminData.reservations = resData.reservations.map(r => ({
                        ...r,
                        customer_name: r.customer_name || [r.first_name, r.last_name].filter(Boolean).join(' ') || 'Khách không tên',
                        order_id: r.id && r.id.toString().startsWith('RES-') ? r.id : `RES-${r.id}`
                    }));
                }
            } catch (e) { console.warn("Background fetch reservations failed:", e); }

            window.adminData.orders = data.orders;

            // --- HIỆN THÔNG BÁO CHO ĐƠN CHƯA XEM ---
            const viewed = getViewedOrders();
            const todayStr = new Date().toISOString().split('T')[0];

            // Thông báo Đơn hàng
            data.orders.forEach(o => {
                const id = o.order_id || o.id;
                const createdAt = (o.created_at || '').split(' ')[0];
                if (createdAt === todayStr && !viewed.includes(id) && o.status !== 'completed') {
                    showOrderNotification(o);
                }
            });

            // Thông báo Đặt bàn
            (window.adminData.reservations || []).forEach(r => {
                const id = r.order_id || r.id;
                if (!viewed.includes(id) && r.status === 'pending') {
                    showOrderNotification({
                        ...r,
                        service_type: 'reservation',
                        order_total: `${r.guests} khách`
                    });
                }
            });

            if (data.orders.length > 0) {
                const latestId = data.orders[0].order_id || data.orders[0].id;
                if (window.adminData.lastKnownOrderId && latestId !== window.adminData.lastKnownOrderId) {
                    playNotification();
                }
                window.adminData.lastKnownOrderId = latestId;
            }
            displayOrders(data.orders);
            // Auto-printing unconfirmed orders is disabled per user request
        } else {
            list.innerHTML = `<div style="text-align:center; padding:100px; grid-column:1/-1; opacity:0.5;">Không có dữ liệu</div>`;
        }
    } catch (e) {
        console.error("Fetch orders error:", e);
        list.innerHTML = `<div style="text-align:center; padding:100px; grid-column:1/-1;">
            <p style="color:#ff3b30; font-weight:700;">❌ LỖI KẾT NỐI SERVER</p>
            <p style="font-size:13px; opacity:0.6; margin-top:10px;">Kiểm tra Internet hoặc link API: ${API_BASE}</p>
        </div>`;
    }
};

window.filterByDate = function (val) {
    window.currentDateFilter = val;
    document.getElementById('dateFilterToday')?.classList.toggle('active', val === 'today');
    document.getElementById('dateFilterUpcoming')?.classList.toggle('active', val === 'upcoming');
    document.getElementById('dateFilterAll')?.classList.toggle('active', val === 'all');
    displayOrders(window.adminData.orders);
};

// Helper function to calculate target deadline
function getOrderTargetDate(o) {
    let summary = {}, deliveryAddr = {};
    try { summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch (e) { }
    try { deliveryAddr = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : (o.delivery_address || {}); } catch (e) { }
    summary = summary || {}; deliveryAddr = deliveryAddr || {};
    const sched = o.scheduled_delivery_time || summary.scheduled_delivery_time || deliveryAddr.scheduled_time;

    if (sched) {
        let sObj = typeof sched === 'string' ? null : sched;
        if (typeof sched === 'string' && sched.startsWith('{')) {
            try { sObj = JSON.parse(sched); } catch (e) { }
        }
        if (sObj && sObj.date && sObj.time) {
            return new Date(`${sObj.date}T${sObj.time}`).getTime();
        }
    }

    const createdAt = new Date((o.created_at || '').replace(' ', 'T') || Date.now()).getTime();
    const etaFromSummary = parseInt(summary.eta || summary.estimated_time || 0);
    const prepMins = etaFromSummary > 0 ? etaFromSummary : ((o.service_type === 'delivery') ? 50 : 20);
    return createdAt + (prepMins * 60 * 1000);
}

window.displayOrders = function (orders) {
    const list = document.getElementById('ordersList');
    if (!list || !orders) return;

    let filtered = [...orders];
    const now = Date.now();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Filter by Status (Client-side for reservations and 'overdue')
    const activeStatus = document.querySelector('#ordersContent .filter-btn.active')?.dataset.status || 'all';
    if (activeStatus === 'overdue') {
        filtered = filtered.filter(o => o.status === 'confirmed' && getOrderTargetDate(o) < now);
    } else if (activeStatus !== 'all') {
        // Reservation đã fetch status=all, cần filter client-side theo status đang chọn
        filtered = filtered.filter(o => {
            if (o.service_type === 'reservation') {
                return o.status === activeStatus;
            }
            return true; // Orders đã filter server-side
        });
    }

    // 2. Filter by Date
    if (window.currentDateFilter === 'today') {
        filtered = filtered.filter(o => {
            const createdAtDate = (o.created_at || '').split(' ')[0] || o.date;
            let summary = {}, deliveryAddr = {};
            try { summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch (e) { }
            try { deliveryAddr = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : (o.delivery_address || {}); } catch (e) { }
            summary = summary || {}; deliveryAddr = deliveryAddr || {};
            const sched = o.scheduled_delivery_time || summary.scheduled_delivery_time || deliveryAddr.scheduled_time;
            let schedDate = null;
            if (sched) {
                let sObj = typeof sched === 'string' ? null : sched;
                if (typeof sched === 'string' && sched.startsWith('{')) {
                    try { sObj = JSON.parse(sched); } catch (e) { }
                }
                if (sObj && sObj.date) schedDate = sObj.date;
            }
            const isActive = o.status === 'pending' || o.status === 'confirmed';
            return createdAtDate === todayStr || schedDate === todayStr || isActive;
        });
    } else if (window.currentDateFilter === 'upcoming') {
        filtered = filtered.filter(o => {
            let summary = {}, deliveryAddr = {};
            try { summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch (e) { }
            try { deliveryAddr = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : (o.delivery_address || {}); } catch (e) { }
            summary = summary || {}; deliveryAddr = deliveryAddr || {};
            const sched = o.scheduled_delivery_time || summary.scheduled_delivery_time || deliveryAddr.scheduled_time;
            let schedDate = null;
            if (sched) {
                let sObj = typeof sched === 'string' ? null : sched;
                if (typeof sched === 'string' && sched.startsWith('{')) {
                    try { sObj = JSON.parse(sched); } catch (e) { }
                }
                if (sObj && sObj.date) schedDate = sObj.date;
            }
            return schedDate && schedDate > todayStr;
        });
    } else if (window.currentDateFilter !== 'all' && window.currentDateFilter) {
        filtered = filtered.filter(o => {
            const createdAtDate = (o.created_at || '').split(' ')[0] || o.date;
            let summary = {}, deliveryAddr = {};
            try { summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch (e) { }
            try { deliveryAddr = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : (o.delivery_address || {}); } catch (e) { }
            summary = summary || {}; deliveryAddr = deliveryAddr || {};

            const sched = o.scheduled_delivery_time || summary.scheduled_delivery_time || deliveryAddr.scheduled_time;
            let schedDate = null;
            if (sched) {
                let sObj = typeof sched === 'string' ? null : sched;
                if (typeof sched === 'string' && (sched.startsWith('{') || sched.startsWith('['))) {
                    try { sObj = JSON.parse(sched); } catch (e) { }
                }
                if (sObj && sObj.date) schedDate = sObj.date;
                else if (typeof sched === 'string' && sched.includes('-')) schedDate = sched.split('T')[0];
            }

            return createdAtDate === window.currentDateFilter || schedDate === window.currentDateFilter;
        });
    }

    // 3. Filter by Search Query
    const query = document.getElementById('orderSearch')?.value.toLowerCase();
    if (query) {
        filtered = filtered.filter(o => {
            const name = (o.customer_name || '').toLowerCase();
            const id = (o.order_id || o.id || '').toLowerCase();
            const phone = (o.phone || '').toLowerCase();
            return name.includes(query) || id.includes(query) || phone.includes(query);
        });
    }

    // 4. Filter by Branch
    const adminRole = getAdminRole();
    let activeBranchFilter = null;
    if (adminRole.role === 'branch_admin') {
        activeBranchFilter = adminRole.branch;
    } else {
        const branchSelect = document.getElementById('adminBranchSelect');
        if (branchSelect && branchSelect.value && branchSelect.value !== 'all') {
            activeBranchFilter = branchSelect.value;
        }
    }
    if (activeBranchFilter) {
        filtered = filtered.filter(o => {
            let summary = {};
            try { summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch (e) { }
            summary = summary || {};
            const branchId = summary.branch?.id || o.branch_id;
            // Nếu không có branchId, cho phép hiện ở cả hai để tránh mất đơn
            if (!branchId) return true;
            return branchId === activeBranchFilter;
        });
    }

    // 4. SORTING LOGIC
    if (window.adminData.sortMode === 'time') {
        filtered.sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime());
    } else {
        const getPriority = (o) => {
            if (o.status === 'pending') return 1;
            if (o.status === 'confirmed') {
                const isLate = getOrderTargetDate(o) < now;
                return isLate ? 3 : 2;
            }
            if (o.status === 'completed') return 4;
            if (o.status === 'cancelled' || o.status === 'rejected') return 5;
            return 6;
        };

        filtered.sort((a, b) => {
            const prioA = getPriority(a);
            const prioB = getPriority(b);
            if (prioA !== prioB) return prioA - prioB;
            return new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime();
        });
    }

    // Cập nhật bộ đếm trên tiêu đề và nút lọc
    const cAll = orders.length;
    const cPending = orders.filter(o => o.status === 'pending').length;
    const cConfirmed = orders.filter(o => o.status === 'confirmed').length;
    const cOverdue = orders.filter(o => o.status === 'confirmed' && getOrderTargetDate(o) < now).length;
    const cReservation = orders.filter(o => (o.status === 'reservation' || o.service_type === 'reservation') && o.status !== 'cancelled' && o.status !== 'rejected').length;
    const cCompleted = orders.filter(o => o.status === 'completed').length;
    const cCancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'rejected').length;

    let el;
    el = document.getElementById('countAll'); if (el) el.textContent = cAll > 0 ? '(' + cAll + ')' : '';
    el = document.getElementById('countPending'); if (el) el.textContent = cPending > 0 ? '(' + cPending + ')' : '';
    el = document.getElementById('countConfirmed'); if (el) el.textContent = cConfirmed > 0 ? '(' + cConfirmed + ')' : '';
    el = document.getElementById('countOverdue'); if (el) el.textContent = cOverdue > 0 ? '(' + cOverdue + ')' : '';
    el = document.getElementById('countReservation'); if (el) el.textContent = cReservation > 0 ? '(' + cReservation + ')' : '';
    el = document.getElementById('countCompleted'); if (el) el.textContent = cCompleted > 0 ? '(' + cCompleted + ')' : '';
    el = document.getElementById('countCancelled'); if (el) el.textContent = cCancelled > 0 ? '(' + cCancelled + ')' : '';

    // 5. GROUP BY DATE & RENDER
    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:100px; grid-column:1/-1; opacity:0.5;">Không có đơn hàng phù hợp</div>`;
        return;
    }

    // Nhóm đơn theo ngày
    const groups = {};
    filtered.forEach(o => {
        const dateStr = (o.created_at || '').split(' ')[0] || o.date || 'Unknown';
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(o);
    });

    // Sắp xếp các ngày (mới nhất lên đầu)
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let finalHtml = '';
    sortedDates.forEach(date => {
        // Format date header
        const dObj = new Date(date);
        const isToday = date === todayStr;
        const isYesterday = date === new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let label = date;
        if (isToday) label = 'Hôm nay (' + date + ')';
        else if (isYesterday) label = 'Hôm qua (' + date + ')';
        else {
            label = dObj.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
        }

        finalHtml += `
            <div class="date-group-header" style="grid-column: 1/-1; margin: 25px 0 15px 0; padding: 10px 20px; background: rgba(229, 207, 142, 0.08); border-radius: 12px; color: var(--gold); font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 10px; border-left: 4px solid var(--gold);">
                <span>📅</span> ${label} <span style="font-size: 11px; opacity: 0.6; font-weight: normal;">(${groups[date].length} đơn)</span>
            </div>
        `;

        finalHtml += groups[date].map(o => renderOrderCard(o)).join('');
    });

    list.innerHTML = finalHtml;
    updateCountdowns();
};

function renderOrderCard(o) {
    if (o.service_type === 'reservation') return renderReservationCard(o);
    const orderId = o.order_id || o.id || 'N/A';
    const totalRaw = o.order_total || o.total || o.summary?.total || o.total_price || '0';
    const price = parseFloat(totalRaw.toString().replace('€', '').replace(',', '.'));
    let summary = {}, deliveryAddr = {}, customerObj = {}, itemsArr = [];
    try { summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch (e) { }
    try { deliveryAddr = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : (o.delivery_address || {}); } catch (e) { }
    try { customerObj = typeof o.customer === 'string' ? JSON.parse(o.customer || '{}') : (o.customer || {}); } catch (e) { }
    try { itemsArr = typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || []); } catch (e) { }
    summary = summary || {}; deliveryAddr = deliveryAddr || {}; customerObj = customerObj || {}; itemsArr = itemsArr || [];

    // Lấy thông tin điện thoại và tên
    const phone = o.phone || customerObj.phone || deliveryAddr.phone || 'N/A';
    const customerName = o.customer_name || (customerObj.firstName ? customerObj.firstName + ' ' + (customerObj.lastName || '') : 'Khách vãng lai');

    // Lấy thông tin thời gian hẹn (Scheduled time)
    // Ưu tiên: 1. Top-level, 2. Summary, 3. Delivery Address
    const rawSched = o.scheduled_delivery_time || summary.scheduled_delivery_time || deliveryAddr.scheduled_time || null;
    let schedTime = null;
    if (rawSched && typeof rawSched === 'object' && rawSched.time) {
        schedTime = rawSched;
    } else if (typeof rawSched === 'string' && rawSched.trim().startsWith('{')) {
        try {
            const p = JSON.parse(rawSched);
            if (p.time) schedTime = p;
        } catch (e) { }
    }

    let schedDisplay = '';
    if (schedTime) {
        schedDisplay = `${schedTime.time}${schedTime.date ? ' (' + schedTime.date + ')' : ''}`;
    }

    const priceLabel = o.payment_method === 'PayPal' ? 'PayPal' : (o.payment_method || 'Tiền mặt');
    
    // Address display logic - handle houseNumber separately or combined in street
    const hn = deliveryAddr.houseNumber || deliveryAddr.house_number || deliveryAddr.housenumber || '';
    const street = deliveryAddr.street || '';
    const fullStreet = (hn && !street.includes(hn)) ? `${street} ${hn}` : street;
    
    const addressParts = [fullStreet, deliveryAddr.postal ? deliveryAddr.postal + ' ' + (deliveryAddr.city || '') : deliveryAddr.city].filter(Boolean);
    const addressStr = addressParts.length > 0 ? addressParts.join(', ') : 'Tại nhà hàng';

    const s = {
        'pending': { l: 'CHỜ DUYỆT', c: '#FF9500', g: 'rgba(255,149,0,0.2)' },
        'confirmed': { l: 'ĐANG NẤU', c: '#34C759', g: 'rgba(52,199,89,0.2)' },
        'completed': { l: 'HOÀN THÀNH', c: '#007AFF', g: 'rgba(0,122,255,0.2)' },
        'cancelled': { l: 'ĐÃ HỦY', c: '#FF3B30', g: 'rgba(255,59,48,0.2)' },
        'rejected': { l: 'BỊ TỪ CHỐI', c: '#FF3B30', g: 'rgba(255,59,48,0.2)' }
    }[o.status] || { l: 'KHÁC', c: '#8E8E93', g: 'rgba(142,142,147,0.2)' };

    const typeInfo = {
        'delivery': { l: '🛵 SHIP TẬN NƠI', c: '#007AFF' },
        'pickup': { l: '🥡 ĐẾN LẤY', c: '#34C759' },
        'dine-in': { l: '🍽️ ĂN TẠI CHỖ', c: '#AF52DE' },
        'eat-in': { l: '🍽️ ĂN TẠI CHỖ', c: '#AF52DE' },
        'reservation': { l: '📅 ĐẶT BÀN', c: '#FF2D55' }
    }[o.service_type] || { l: '🍱 ĐƠN HÀNG', c: '#8E8E93' };

    // Logic tính thời hạn (Xong trước)
    let targetDate;
    const createdAtStr = o.created_at ? String(o.created_at).replace(' ', 'T') : '';
    if (schedTime && typeof schedTime === 'object' && schedTime.time && schedTime.date) {
        // Nếu có hẹn giờ chính xác từ khách
        targetDate = new Date(`${schedTime.date}T${schedTime.time}`).getTime();
    } else {
        // Mặc định: Ship 50p, Pickup/Dine-in 20p
        // Nếu Server có gửi ETA thực tế trong summary, dùng nó
        const etaFromSummary = parseInt(summary.eta || summary.estimated_time || 0);
        const prepMins = etaFromSummary > 0 ? etaFromSummary : ((o.service_type === 'delivery') ? 50 : 20);
        const baseTime = createdAtStr ? new Date(createdAtStr).getTime() : Date.now();
        targetDate = (isNaN(baseTime) ? Date.now() : baseTime) + (prepMins * 60 * 1000);
    }
    const targetTimeStr = isNaN(targetDate) ? '--:--' : new Date(targetDate).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    // Check if it's a NEW order (not viewed yet)
    const viewed = getViewedOrders();
    const isUnread = !viewed.includes(orderId) && o.status !== 'completed';
    const newBadge = isUnread ? '<span class="new-badge">MỚI</span>' : '';
    const unreadClass = isUnread ? 'unread-order-highlight' : '';

    return `
        <div id="order-card-${orderId}" class="premium-card ${o.status === 'pending' ? 'pulse-border' : ''} ${o.status === 'completed' ? 'completed-order' : ''} ${unreadClass}" 
             data-order-id="${orderId}"
             style="padding:15px; cursor:pointer; position:relative;" 
             onclick="window.showOrderDetails('${orderId}')">
            
            ${newBadge}
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap;">
                    <span class="type-tag" style="background:${typeInfo.c}; font-size:9px;">${typeInfo.l}</span>
                    ${summary.branch ? `<span style="font-size:8px; padding:3px 8px; border-radius:8px; background:rgba(212,175,55,0.15); color:#d4af37; font-weight:700; white-space:nowrap;">🏪 ${summary.branch.id === 'branch_haupt' ? 'Hauptstr.' : 'Florastr.'}</span>` : ''}
                </div>
                <span class="status-tag" style="color:${s.c}; background:${s.g}; font-size:9px;">${s.l}</span>
            </div>
            
            <div style="margin-bottom:10px;">
                <h3 style="margin:0; font-size:18px; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${customerName}</h3>
                <span style="font-size:10px; opacity:0.4; font-weight:700;">Đơn: #${orderId}</span>
            </div>

            <div style="font-size:12px; margin-bottom:10px; line-height:1.4;">
                <div style="color:rgba(255,255,255,0.7); display:flex; align-items:center; gap:5px;">
                    <span>📱</span> ${phone}
                </div>
                <div style="color:rgba(255,255,255,0.4); font-size:11px; margin-top:2px;">
                    ⏱️ Đặt lúc: ${o.created_at ? new Date(o.created_at).toLocaleTimeString() : '--:--'}
                </div>
                ${schedDisplay ? `
                <div style="color:var(--gold); font-weight:700; margin-top:5px; display:flex; align-items:center; gap:5px;">
                    <span>⏰ HẸN GIỜ:</span> ${schedDisplay}
                </div>
                ` : ''}
                ${addressStr && (o.service_type === 'delivery') ? `
                <div style="color:#fff; margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.05); font-weight:500;">
                    📍 ${addressStr}
                </div>
                ` : ''}
            </div>
            
            ${o.status !== 'completed' ? `
                <div class="progress-wrap" style="margin: 15px 0 10px 0;">
                    <div style="display:flex; justify-content:space-between; font-size:9px; opacity:0.4; margin-bottom:4px; font-weight:700;">
                        <span>TIẾN ĐỘ</span>
                        <span class="progress-text">0%</span>
                    </div>
                    <div class="progress-container" data-start="${new Date(createdAtStr).getTime()}" data-target="${targetDate}" style="height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; border: 1px solid rgba(255,255,255,0.03);">
                        <div class="progress-bar" style="height:100%; width:0%; background:linear-gradient(90deg, #d4af37, #f2d98a); border-radius:3px; transition:width 1s linear;"></div>
                    </div>
                </div>
                <div class="timer-box" data-target="${targetDate}" style="padding:10px; margin-bottom:12px; background:rgba(212,175,55,0.05); border-radius:12px; border:1px solid rgba(212,175,55,0.1); text-align:center;">
                    <div class="timer-label" style="font-size:10px; opacity:0.6; margin-bottom:2px; font-weight:800;">${schedDisplay ? '⏰ GIỜ HẸN TRẢ' : '⏳ CÒN LẠI'}</div>
                    <div style="font-size:11px; opacity:0.8; font-weight:700; color:var(--gold); margin-bottom:5px;">Dự kiến: ${targetTimeStr}</div>
                    <div class="timer-value" style="font-size:22px; font-weight:900; color:#fff; letter-spacing:1px; text-shadow:0 0 10px rgba(255,255,255,0.2);">--:--</div>
                </div>
            ` : ''}

            <div class="order-items-summary" style="margin-top:5px; font-size:12px; color:rgba(255,255,255,0.5); max-height:80px; overflow:hidden; padding:8px; background:rgba(0,0,0,0.2); border-radius:10px; border:1px dashed rgba(255,255,255,0.1);">
                <div style="font-size:9px; margin-bottom:3px; opacity:0.6;">👇 CHẠM ĐỂ XEM CHI TIẾT</div>
                ${itemsArr.slice(0, 2).map(item => `<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:1px;">${item.quantity || 1}x ${item.name}</div>`).join('')}
                ${itemsArr.length > 2 ? `<div style="font-size:10px; opacity:0.4;">+ ${itemsArr.length - 2} món khác...</div>` : ''}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px; margin-top:10px;">
                <div style="font-size:22px; font-weight:800; color:var(--gold);">${isNaN(price) ? '0.00' : price.toFixed(2)}€</div>
                <div style="display:flex; gap:8px;" onclick="event.stopPropagation()">
                    <button class="icon-btn" style="width:36px; height:36px; font-size:14px;" onclick="printOrder('${orderId}')">🖨️</button>
                    ${o.status === 'pending' ? `
                        <button class="main-btn" style="height:36px; padding:0 12px; font-size:11px; background:#34C759;" onclick="${(o.service_type === 'dine-in' || o.service_type === 'eat-in' || o.service_type === 'reservation') ? `updateStatus('${orderId}', 'confirmed')` : `openConfirmModal('${orderId}')`}">NHẬN</button>
                        <button class="main-btn" style="height:36px; padding:0 12px; font-size:11px; background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid #ef4444;" onclick="openRejectModal('${orderId}')">KHÔNG NHẬN</button>
                    ` : ''}
                    ${o.status === 'confirmed' ? `<button class="main-btn" style="background:#007AFF; height:36px; padding:0 12px; font-size:11px;" onclick="updateStatus('${orderId}', 'completed')">XONG</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

window.showOrderDetails = function (orderId) {
    if (!window.adminData || !window.adminData.orders) return;
    const o = window.adminData.orders.find(item => (item.order_id || item.id).toString() === orderId.toString());
    if (!o) return;

    // Đánh dấu đã xem ngay khi mở chi tiết
    markOrderAsViewed(orderId);

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailContent');
    const actions = document.getElementById('modalActionButtons');

    if (!modal || !content) return;

    const totalRaw = o.order_total || o.total || o.summary?.total || o.total_price || '0';
    const price = parseFloat(totalRaw.toString().replace('€', '').replace(',', '.'));
    const phone = o.phone || o.customer?.phone || o.delivery_address?.phone || 'N/A';
    const customerName = o.customer_name || (o.customer?.firstName ? o.customer.firstName + ' ' + (o.customer.lastName || '') : 'Khách vãng lai');

    content.innerHTML = `
        <!-- HEADER -->
        <div style="background: linear-gradient(135deg, #d4af37 0%, #f2d98a 50%, #d4af37 100%); padding: 35px 20px; text-align: center; border-radius: 0 0 40px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div style="text-transform: uppercase; font-size: 11px; letter-spacing: 3px; color: rgba(0,0,0,0.6); font-weight: 800; margin-bottom: 8px;">Order Details</div>
            <h2 style="margin: 0; font-size: 28px; font-weight: 900; color: #000; font-family: 'Fraunces', serif;">#${o.order_id || o.id}</h2>
            <div style="font-size: 13px; font-weight: 800; color: rgba(0,0,0,0.5); margin-top: 5px;">🏪 ${(() => {
                let s = {}; try { s = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {}); } catch(e){}
                const bId = o.branch_id || s.branch?.id || 'branch_flora';
                return bId === 'branch_haupt' ? 'CHI NHÁNH HAUPTSTRASSE' : 'CHI NHÁNH FLORASTRASE';
            })()}</div>
        </div>
        
        <div style="padding: 25px;">
            <!-- CUSTOMER & SERVICE INFO -->
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 18px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                        <span style="font-size: 20px;">👤</span>
                        <h4 style="margin: 0; color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Khách hàng</h4>
                    </div>
                    <div style="font-size: 16px; color: #fff; font-weight: 600;">${customerName}</div>
                    <a href="tel:${phone}" style="display: inline-block; margin-top: 8px; color: #d4af37; text-decoration: none; font-size: 15px; font-weight: 700; background: rgba(212,175,55,0.1); padding: 5px 12px; border-radius: 10px;">📞 ${phone}</a>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 18px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                        <span style="font-size: 20px;">📦</span>
                        <h4 style="margin: 0; color: #d4af37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Thông tin dịch vụ</h4>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.8);">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Giờ đặt:</span>
                            <span style="color: #fff; font-weight: 600;">${o.created_at ? new Date(o.created_at).toLocaleString('de-DE') : '--:--'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Hình thức:</span>
                            <span style="color: #fff; font-weight: 600;">${o.service_type === 'delivery' ? '🛵 Giao hàng tận nơi' : (o.service_type === 'pickup' ? '🥡 Tự đến lấy' : '🍽️ Ăn tại chỗ')}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Thanh toán:</span>
                            <span style="color: ${o.payment_status === 'paid' ? '#34C759' : '#FF9500'}; font-weight: 700;">${o.payment_method?.toUpperCase() || 'TIỀN MẶT'} ${o.payment_status === 'paid' ? '✅' : '⏳'}</span>
                        </div>
                        ${(() => { 
                            let da = {};
                            try { da = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address || '{}') : (o.delivery_address || {}); } catch(e){}
                            da = da || {};
                            return da.street ? `
                        <div style="margin-top: 15px; padding: 15px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.2); border-radius: 15px;">
                            <span style="font-size: 11px; color: var(--gold); font-weight: 800; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">📍 ĐỊA CHỈ GIAO HÀNG:</span>
                            <span style="color: #fff; font-size: 18px; font-weight: 800; line-height: 1.4; display: block;">${(() => {
                                const daStreet = da.street || '';
                                const daHn = da.houseNumber || da.house_number || da.housenumber || '';
                                return (daHn && !daStreet.includes(daHn)) ? `${daStreet} ${daHn}` : daStreet;
                            })()}</span>
                            <span style="color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; margin-top: 4px; display: block;">${da.postal ? da.postal : ''}${da.city ? ' ' + da.city : ''}</span>
                        </div>
                        ` : ''; })()}
                    </div>
                </div>
            </div>

            <!-- NOTES (IF ANY) -->
            ${o.note ? `
            <div style="background: rgba(255,59,48,0.1); border-left: 4px solid #FF3B30; padding: 15px; border-radius: 12px; margin-bottom: 25px;">
                <div style="font-size: 11px; font-weight: 800; color: #FF3B30; margin-bottom: 5px; text-transform: uppercase;">📝 Ghi chú từ khách:</div>
                <div style="color: #fff; font-size: 14px; font-weight: 600; line-height: 1.4;">"${o.note}"</div>
            </div>
            ` : ''}

            <!-- ITEMS LIST -->
            <div style="background: #000; border-radius: 24px; padding: 10px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="padding: 15px 15px 5px 15px; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 2px; font-weight: 700;">DANH SÁCH MÓN ĂN</div>
                <div style="padding: 10px;">
                    ${(o.items || []).map((item, idx) => {
            const itemPrice = parseFloat((item.price || item.total || 0).toString().replace('€', '').replace(',', '.'));
            return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; ${idx !== o.items.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''}">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="background: #d4af37; color: #000; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px;">${item.quantity}</div>
                                <div style="color: #fff; font-weight: 600; font-size: 15px;">${item.name}</div>
                            </div>
                            <div style="color: rgba(255,255,255,0.6); font-family: monospace; font-size: 15px;">${isNaN(itemPrice) ? '--' : itemPrice.toFixed(2)}€</div>
                        </div>
                        `;
        }).join('')}
                </div>
                
                <!-- TOTAL SECTION -->
                <div style="background: rgba(212,175,55,0.05); margin-top: 10px; padding: 20px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 800; font-size: 13px; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">Tổng cộng</div>
                    <div style="color: #d4af37; font-size: 32px; font-weight: 900; font-family: 'Fraunces', serif; text-shadow: 0 0 20px rgba(212,175,55,0.3);">${isNaN(price) ? '0.00' : price.toFixed(2)}€</div>
                </div>

                <!-- REVIEW QR CODE (Browser Print Fallback) -->
                <div style="margin-top: 30px; padding: 20px; text-align: center; border-top: 1px dashed rgba(255,255,255,0.1);">
                    <p style="color: #d4af37; font-size: 11px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 2px;">
                        <button class="admin-tab active" data-tab="orders" onclick="window.switchTab('orders')"
                            style="cursor: pointer; pointer-events: auto; position: relative; z-index: 99999;">📦
                            Đơn hàng</button>
                        <button class="admin-tab" data-tab="reservations" onclick="window.switchTab('reservations')"
                            style="cursor: pointer; pointer-events: auto; position: relative; z-index: 99999;">📅
                            Đặt bàn</button>
                    </p>
                    <div style="background: #fff; padding: 12px; display: inline-block; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(o.branch_id === 'branch_haupt' || (o.summary && o.summary.branch && o.summary.branch.id === 'branch_haupt') ? 'https://search.google.com/local/writereview?placeid=ChIJx0O6mJ1RqEcRk2714nO5w2Y' : 'https://search.google.com/local/writereview?placeid=ChIJq7i33h9RqEcR-w5n_G_k6o4')}" 
                             style="width: 130px; height: 130px; display: block;" 
                             alt="Google Review QR">
                    </div>
                    <p style="color: rgba(255,255,255,0.3); font-size: 10px; margin-top: 10px;">Scannen Sie den Code mit Ihrer Kamera</p>
                </div>
            </div>
        </div>
    `;

    // UPDATE ACTIONS
    actions.style.flex = "2";
    actions.innerHTML = `
        <button class="main-btn" style="flex: 1; background: #fff; color: #000; height: 50px; font-size: 14px; font-weight: 800; border-radius: 15px; box-shadow: 0 4px 15px rgba(255,255,255,0.1);" onclick="printOrder('${o.order_id || o.id}')">🖨️ IN HÓA ĐƠN</button>
        ${o.status === 'pending' ? `
            <button class="main-btn" style="flex: 1; background: #34C759; height: 50px; font-size: 14px; font-weight: 800; border-radius: 15px;" onclick="${(o.service_type === 'dine-in' || o.service_type === 'eat-in' || o.service_type === 'reservation') ? `updateStatus('${o.order_id || o.id}', 'confirmed'); closeOrderDetail();` : `openConfirmModal('${o.order_id || o.id}'); closeOrderDetail();`}">DUYỆT ĐƠN ✅</button>
            <button class="main-btn" style="flex: 1; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444; height: 50px; font-size: 14px; font-weight: 800; border-radius: 15px;" onclick="openRejectModal('${o.order_id || o.id}'); closeOrderDetail();">KHÔNG NHẬN</button>
        ` : ''}
        ${o.status === 'confirmed' ? `<button class="main-btn" style="flex: 1; background: #007AFF; height: 50px; font-size: 14px; font-weight: 800; border-radius: 15px;" onclick="updateStatus('${o.order_id || o.id}', 'completed'); closeOrderDetail();">HOÀN THÀNH ✅</button>` : ''}
    `;

    modal.style.display = 'flex';
};

window.closeOrderDetail = function () {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) modal.style.display = 'none';
};

// --- RESERVATIONS ---
window.loadReservations = async function (silent = false) {
    if (window.adminData.activeTab !== 'reservations') return;
    const list = document.getElementById('reservationsList');
    let status = document.querySelector('#reservationsContent .filter-btn.active')?.dataset.status || 'all';

    if (!silent && list) {
        list.innerHTML = `<div style="text-align:center; padding:100px;"><div class="premium-loader"></div></div>`;
    }

    try {
        const res = await adminFetch(`${API_BASE}v1/data/reservations&status=${status}&_t=${Date.now()}`);
        const data = await res.json();

        if (data.success && data.reservations) {
            // Đồng bộ hóa tên khách và ID giống như trong loadOrders
            const formattedRes = data.reservations.map(r => ({
                ...r,
                customer_name: r.customer_name || [r.first_name, r.last_name].filter(Boolean).join(' ') || 'Khách không tên',
                order_id: r.id && r.id.toString().startsWith('RES-') ? r.id : `RES-${r.id}`
            }));

            window.adminData.reservations = formattedRes;
            displayReservations(formattedRes);
            updateSidebarBadges();
        } else {
            list.innerHTML = `<div style="text-align:center; padding:100px; opacity:0.3; color:#fff;">📭 Không có dữ liệu: ${data.message || 'Error'}</div>`;
        }
    } catch (error) {
        console.error("Lỗi tải đặt bàn:", error);
        if (list) list.innerHTML = '<div style="text-align:center; padding:100px; color:#ff3b30;">Lỗi kết nối máy chủ</div>';
    }
};

window.displayReservations = function (res) {
    const list = document.getElementById('reservationsList');
    if (!list) return;
    if (!res || res.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:100px; opacity:0.3; color:#fff;">📭 Hiện tại không có lịch đặt nào</div>';
        return;
    }

    // Nhóm theo ngày
    const groups = {};
    res.forEach(r => {
        let d = String(r.date || 'Khác');
        // Chuẩn hóa ngày về dạng YYYY-MM-DD để sắp xếp cho chuẩn
        let sortKey = d;
        if (d.includes('.')) {
            const parts = d.split('.');
            if (parts.length === 3) sortKey = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        if (!groups[sortKey]) groups[sortKey] = { display: d, items: [] };
        groups[sortKey].items.push(r);
    });

    // Sắp xếp ngày Giảm dần (Mới nhất/Gần hiện tại nhất lên đầu nếu nhìn từ quá khứ)
    const sortedKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    list.innerHTML = sortedKeys.map(key => {
        const group = groups[key];
        const dateReservations = group.items;
        
        // Sắp xếp theo giờ trong cùng một ngày (Sớm nhất lên đầu)
        dateReservations.sort((a, b) => {
            const t1 = a.time || '00:00';
            const t2 = b.time || '00:00';
            return t1.localeCompare(t2);
        });
        return `
            <div class="date-group-header" style="margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 1px solid rgba(212,175,55,0.2); color: var(--gold); font-weight: 800; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span>📅</span> ${group.display} <span style="font-size: 12px; opacity: 0.5; font-weight: 400;">(${dateReservations.length} lượt đặt)</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px; width:100%;">
                ${dateReservations.map(r => renderReservationCard(r)).join('')}
            </div>
        `;
    }).join('');
};

function filterReservationsByStatus(status) {
    document.querySelectorAll('#reservationsContent .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
    });
    loadReservations();
}
window.filterReservationsByStatus = filterReservationsByStatus;

// --- CUSTOMERS ---
window.loadCustomers = async function loadCustomers(silent = false) {
    if (window.adminData.activeTab !== 'customers') return;
    const container = document.getElementById('customersListContainer');
    if (!silent && container) container.innerHTML = `<div style="text-align:center; padding:100px;"><div class="premium-loader"></div></div>`;
    try {
        const res = await adminFetch(`${API_BASE}v1/data/customers`);
        const data = await res.json();
        if (data.success && data.customers) {
            displayCustomers(data.customers);
        } else {
            console.warn("API Customers error:", data);
        }
    } catch (e) {
        console.error("Fetch customers error:", e);
    }
};

window.displayCustomers = function (customers) {
    const container = document.getElementById('customersListContainer');
    if (!container) return;
    container.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:20px;">
            ${customers.map(c => `
                <div class="premium-card">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:50px; height:50px; border-radius:12px; background:var(--gold); color:#000; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:20px;">
                            ${(c.first_name || 'K').charAt(0)}
                        </div>
                        <div>
                            <h4 style="margin:0; font-size:18px;">${c.first_name || ''} ${c.last_name || ''}</h4>
                            <p style="margin:0; font-size:13px; opacity:0.5;">${c.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div style="margin-top:20px; font-size:14px; opacity:0.8;">
                        <div>📞 ${c.phone || 'N/A'}</div>
                        <div style="margin-top:5px; color:var(--gold); font-weight:700;">⭐ Điểm Loyalty: ${c.loyalty_points || 0}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

// --- MENU ---
window.loadMenuItems = async function (silent = false) {
    const list = document.getElementById('menuListContainer');
    if (!silent && list) list.innerHTML = `<div style="text-align:center; padding:100px;"><div class="premium-loader"></div></div>`;
    try {
        const res = await adminFetch(`${API_BASE}v1/data/menu`);
        const data = await res.json();
        if (data.success && data.menu) {
            displayMenu(data.menu);
        } else {
            console.error("API Error (Menu):", data);
            list.innerHTML = `<p style="text-align:center; padding:20px; color:#ff3b30;">⚠️ Lỗi lấy dữ liệu Menu</p>`;
        }
    } catch (e) {
        console.error("Fetch menu error:", e);
    }
};

window.displayMenu = function (items) {
    const list = document.getElementById('menuListContainer');
    if (!list) return;
    list.innerHTML = `
        <div class="menu-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:15px;">
            ${items.map(i => `
                <div class="premium-card" style="padding:15px; display:flex; align-items:center; gap:15px;">
                    <img src="${i.image || 'assets/img/product-placeholder.png'}" style="width:60px; height:60px; border-radius:10px; object-fit:cover;">
                    <div style="flex:1;">
                        <h5 style="margin:0; font-size:15px;">${i.name}</h5>
                        <div style="color:var(--gold); font-weight:700;">${parseFloat(i.price).toFixed(2)}€</div>
                    </div>
                    <button class="icon-btn" onclick="editProduct('${i.id}')">✏️</button>
                </div>
            `).join('')}
        </div>
    `;
};

// --- DISCOUNT CODES ---
window.loadDiscountCodes = async function (silent = false) {
    const container = document.getElementById('discountCodesContainer');
    if (!silent && container) container.innerHTML = `<div style="text-align:center; padding:100px;"><div class="premium-loader"></div></div>`;
    try {
        const res = await adminFetch(`${API_BASE}v1/data/discount-codes`);
        const data = await res.json();
        if (data.success && (data.codes || data.discounts)) {
            displayDiscountCodes(data.codes || data.discounts);
        } else {
            console.error("API Error (Discounts):", data);
        }
    } catch (e) {
        console.error("Fetch discounts error:", e);
    }
};

window.displayDiscountCodes = function (codes) {
    const container = document.getElementById('discountCodesContainer');
    if (!container) return;
    container.innerHTML = codes.map(c => `
        <div class="premium-card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div>
                <strong style="color:var(--gold); font-size:18px;">${c.code}</strong>
                <p style="margin:4px 0 0 0; opacity:0.5; font-size:12px;">Giảm ${c.discount_type === 'percentage' ? c.discount_value + '%' : c.discount_value + '€'}</p>
            </div>
            <div style="text-align:right;">
                <div style="font-size:12px; opacity:0.6;">Hết hạn: ${c.expiry_date || 'Vô thời hạn'}</div>
                <button class="icon-btn" onclick="deleteDiscount('${c.id}')" style="margin-top:8px;">🗑️</button>
            </div>
        </div>
    `).join('');
};

// --- HOLIDAY SCHEDULE ---
window.loadHolidaySchedule = async function (silent = false) {
    const container = document.getElementById('holidayScheduleContainer');
    if (!silent && container) container.innerHTML = `<div style="text-align:center; padding:100px;"><div class="premium-loader"></div></div>`;
    try {
        const res = await adminFetch(`${API_BASE}v1/data/holiday-schedule`);
        const data = await res.json();
        if (data.success && data.holidays) {
            displayHolidays(data.holidays);
        } else {
            console.error("API Error (Holidays):", data);
        }
    } catch (e) {
        console.error("Fetch holidays error:", e);
    }
};

window.displayHolidays = function (holidays) {
    const container = document.getElementById('holidayScheduleContainer');
    if (!container) return;
    container.innerHTML = holidays.map(h => `
        <div class="premium-card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div>
                <strong style="color:#ef4444; font-size:16px;">${h.date}</strong>
                <p style="margin:4px 0 0 0; opacity:0.7;">${h.reason || 'Nghỉ lễ'}</p>
            </div>
            <button class="icon-btn" onclick="deleteHoliday('${h.id}')">🗑️</button>
        </div>
    `).join('');
};

// --- HELPERS ---
function updateCountdowns() {
    const now = Date.now();
    document.querySelectorAll('.timer-box').forEach(box => {
        const diff = parseInt(box.dataset.target) - now;
        const valEl = box.querySelector('.timer-value');
        if (!valEl) return;

        if (diff <= 0) {
            if (valEl.innerHTML !== 'HẾT GIỜ') {
                valEl.innerHTML = 'HẾT GIỜ';
                valEl.style.color = '#FF3B30';
            }
        } else {
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const timeStr = `${m}p ${s}s`;
            if (valEl.innerHTML !== timeStr) {
                valEl.innerHTML = timeStr;
                if (m < 5) valEl.style.color = '#FF9500';
                else if (m < 15) valEl.style.color = '#F2D98A';
                else valEl.style.color = '#34C759';
            }
        }
    });

    // Cập nhật thanh trạng thái (Progress Bar)
    document.querySelectorAll('.progress-container').forEach(container => {
        const start = parseInt(container.dataset.start);
        const target = parseInt(container.dataset.target);
        const bar = container.querySelector('.progress-bar');
        const text = container.parentElement.querySelector('.progress-text');

        if (!bar || isNaN(start) || isNaN(target)) return;

        const total = target - start;
        if (total <= 0) return;

        let progress = ((now - start) / total) * 100;
        if (progress > 100) progress = 100;
        if (progress < 0) progress = 0;

        const progressStr = progress + '%';
        if (bar.style.width !== progressStr) {
            bar.style.width = progressStr;
        }

        const textStr = Math.round(progress) + '%';
        if (text && text.innerText !== textStr) {
            text.innerText = textStr;
        }

        // Đổi màu cảnh báo
        let newBg = '';
        if (progress > 90) newBg = '#ef4444';
        else if (progress > 70) newBg = '#f59e0b';
        else newBg = 'linear-gradient(90deg, #d4af37, #f2d98a)';

        if (bar.style.background !== newBg) {
            bar.style.background = newBg;
        }
    });
}

// Tính năng tự động in đơn mới
function checkAutoPrinting(orders) {
    const isAutoPrint = localStorage.getItem('autoPrintEnabled') === 'true';
    if (!isAutoPrint) return;

    // Kiểm tra xem đã có cấu hình máy in chưa
    const hasConfig = localStorage.getItem('lan_printer_ip') || localStorage.getItem('bt_printer_id');
    if (!hasConfig) {
        console.warn('Auto-print enabled but no printer configured.');
        return;
    }

    let printedIds = [];
    try {
        printedIds = JSON.parse(localStorage.getItem('leo_printed_orders') || '[]');
    } catch (e) { printedIds = []; }

    const printedSet = new Set(printedIds.map(id => id.toString()));

    // Get current active branch filter to only auto-print orders of that branch
    const adminRole = getAdminRole();
    let activeBranchFilter = null;
    if (adminRole.role === 'branch_admin') {
        activeBranchFilter = adminRole.branch;
    } else {
        const branchSelect = document.getElementById('adminBranchSelect');
        if (branchSelect && branchSelect.value && branchSelect.value !== 'all') {
            activeBranchFilter = branchSelect.value;
        }
    }

    orders.forEach(o => {
        const id = (o.order_id || o.id || '').toString();
        if (!id || printedSet.has(id)) return;

        // Skip orders from other branches for auto-printing
        const summary = typeof o.summary === 'string' ? JSON.parse(o.summary) : (o.summary || {});
        const orderBranchId = summary.branch?.id || o.branch_id || 'branch_flora';
        if (activeBranchFilter && orderBranchId !== activeBranchFilter) {
            return;
        }

        // In đơn đã duyệt (confirmed) HOẶC đơn mới / tiền mặt (pending)
        if (o.status !== 'confirmed' && o.status !== 'pending') return;

        if (summary.is_printed) {
            printedSet.add(id);
            localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
            return;
        }

        // --- ATOMIC PRINT LOCK ---
        // Gọi Server để đánh dấu "Đang in", nếu thành công mới thực hiện in ở Local
        adminFetch(`${API_BASE}v1/data/orders/update-printed`, {
            method: 'POST',
            body: JSON.stringify({ order_id: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log(`🖨️ Printing new order: #${id}`);
                    window.printOrder(id);

                    // Cập nhật local storage
                    printedSet.add(id);
                    localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
                } else if (data.already_printed) {
                    console.log(`🖨️ Order #${id} already printed by another station.`);
                    printedSet.add(id);
                    localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
                }
            })
            .catch(err => console.error("Auto-print check error:", err));
    });
}

window.handleAutoPrintToggle = function (enabled) {
    localStorage.setItem('autoPrintEnabled', enabled);

    if (enabled) {
        const hasConfig = localStorage.getItem('lan_printer_ip') || localStorage.getItem('bt_printer_id');
        if (!hasConfig) {
            alert('Bạn chưa cấu hình máy in. Vui lòng cài đặt Máy in trước khi bật Tự động in.');
            if (window.switchTab) window.switchTab('printer');
        } else {
            console.log('Auto-print enabled and printer config found.');
        }
    }
};

window.updateStatus = async function (id, status, silent = false, etaMinutes = null, reason = null) {
    // Cập nhật giao diện tức thì ở Local (Optimistic Update)
    if (window.adminData && window.adminData.orders) {
        const idx = window.adminData.orders.findIndex(o => (o.order_id || o.id).toString() === id.toString());
        if (idx !== -1) {
            window.adminData.orders[idx].status = status;
            if (etaMinutes) {
                const summary = typeof window.adminData.orders[idx].summary === 'string' ? JSON.parse(window.adminData.orders[idx].summary) : (window.adminData.orders[idx].summary || {});
                summary.eta = etaMinutes;
                window.adminData.orders[idx].summary = summary;
            }
            displayOrders(window.adminData.orders);
        }
    }

    try {
        const body = { order_id: id, status };
        if (etaMinutes) body.eta = etaMinutes;
        if (reason) body.reason = reason;

        await adminFetch(`${API_BASE}v1/data/orders/update-status`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });

        // Load lại dữ liệu để đồng bộ hoàn toàn với Server
        if (!silent) loadOrders(true);
    } catch (e) {
        console.error("Update status error:", e);
        // Nếu lỗi, load lại từ server để quay về trạng thái đúng
        loadOrders(true);
    }
};

// --- TIME MODAL LOGIC ---
let currentActionOrderId = null;
window.openConfirmModal = (orderId) => {
    currentActionOrderId = orderId;
    const modal = document.getElementById('timeScheduleModal');
    if (modal) modal.style.display = 'flex';
};

window.closeTimeScheduleModal = () => {
    const modal = document.getElementById('timeScheduleModal');
    if (modal) modal.style.display = 'none';
};

window.confirmWithScheduledTime = () => {
    const hours = parseInt(document.getElementById('scheduleHours').value || 0);
    const minutes = parseInt(document.getElementById('scheduleMinutes').value || 30);
    const totalMinutes = (hours * 60) + minutes;

    if (currentActionOrderId) {
        updateStatus(currentActionOrderId, 'confirmed', false, totalMinutes);
        closeTimeScheduleModal();
    }
};

// REJECT MODAL LOGIC
let currentActionType = 'order'; // 'order' or 'reservation'

window.openRejectModal = (orderId, type = 'order') => {
    currentActionOrderId = orderId;
    currentActionType = type;
    const modal = document.getElementById('rejectReasonModal');
    if (modal) {
        modal.style.display = 'flex';
        const text = document.getElementById('rejectReasonText');
        if (text) text.value = '';
    }
};

window.closeRejectModal = () => {
    const modal = document.getElementById('rejectReasonModal');
    if (modal) modal.style.display = 'none';
};

window.setRejectReason = (reason) => {
    const text = document.getElementById('rejectReasonText');
    if (text) text.value = reason;
};

window.confirmRejection = () => {
    const reason = document.getElementById('rejectReasonText')?.value || 'Không rõ lý do';
    if (currentActionOrderId) {
        if (currentActionType === 'reservation') {
            updateReservationStatus(currentActionOrderId, 'cancelled', reason);
        } else {
            updateStatus(currentActionOrderId, 'cancelled', false, null, reason);
        }
        closeRejectModal();
    }
};

window.confirmReject = window.confirmRejection; // Alias for backward compatibility with admin.html

window.printOrder = async (id) => {
    if (!window.adminData || !window.adminData.orders) return;
    const o = window.adminData.orders.find(item => (item.order_id || item.id).toString() === id.toString());
    if (!o) return;

    if (window.PrinterManager) {
        try {
            const summary = typeof o.summary === 'string' ? JSON.parse(o.summary) : (o.summary || {});
            const deliveryAddr = typeof o.delivery_address === 'string' ? JSON.parse(o.delivery_address) : (o.delivery_address || {});
            const eta = summary.eta || summary.estimated_time || '';

            console.log('🖨️ Preparing print for:', id);
            await PrinterManager.print(o, deliveryAddr, id, eta);
        } catch (err) {
            console.error('Print Error:', err);
            // Nếu lỗi do chưa cấu hình/kết nối máy in, tự động nhảy thẳng sang tab Máy in
            if (err.message.includes('device') || err.message.includes('printer') || err.message.includes('connect') || err.message.includes('No printer')) {
                console.log('Redirecting to printer setup...');
                if (window.switchTab) window.switchTab('printer');
                // Cuộn lên đầu trang tab máy in để thấy form
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (confirm('Lỗi in: ' + err.message + '\nBạn có muốn in bằng trình duyệt?')) {
                window.print();
            }
        }
    } else {
        console.log('🖨️ PrinterManager not found, falling back to log:', id);
    }
};

function playNotification() {
    notificationAudio.play().catch(e => console.warn('Sound blocked'));
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
}

function playUrgentAlarm() {
    urgentAlarmAudio.play().catch(e => console.warn('Urgent sound blocked'));
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([500, 200, 500]);
}

function checkUrgentOrders() {
    if (!window.adminData.orders || window.adminData.orders.length === 0) return;

    const now = Date.now();
    const viewed = getViewedOrders();
    const URGENT_THRESHOLD = 5 * 60 * 1000; // 5 phút

    let hasUrgentUnread = false;

    window.adminData.orders.forEach(o => {
        if (o.status === 'completed' || o.status === 'cancelled') return;

        const id = (o.order_id || o.id).toString();
        const targetDate = getOrderTargetDate(o);
        const diff = targetDate - now;

        // Nếu đơn SẮP HẾT GIỜ (hoặc ĐÃ TRỄ) mà CHƯA AI XEM (chưa click/chưa dismiss)
        if (diff < URGENT_THRESHOLD && !viewed.includes(id)) {
            hasUrgentUnread = true;
        }
    });

    if (hasUrgentUnread) {
        // Phát âm báo mỗi 10 giây nếu vẫn còn đơn gấp chưa xem
        if (now - lastUrgentAlarmTime > 10000) {
            playUrgentAlarm();
            lastUrgentAlarmTime = now;
        }
    }
}

function updateSidebarBadges() {
    const reservations = window.adminData.reservations || [];
    const pendingCount = reservations.filter(r => r.status === 'pending').length;

    const resTab = document.querySelector('.admin-tab[data-tab="reservations"]');
    if (resTab) {
        let badge = resTab.querySelector('.nav-badge');
        if (pendingCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'nav-badge';
                resTab.appendChild(badge);
            }
            badge.innerText = pendingCount;
            badge.style.display = 'flex';
        } else if (badge) {
            badge.style.display = 'none';
        }
    }
}

window.addNotification = function (type, title, message) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span style="font-size:24px;">🔔</span>
        <div>
            <div style="font-size:14px; text-transform:uppercase; letter-spacing:1px;">${title}</div>
            <div style="font-size:18px; margin-top:2px;">${message}</div>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
};

function getMockData(type, status) {
    if (type === 'orders') {
        const m = [
            {
                order_id: "ORD-9912",
                customer_name: "Anh Hoàng (Ship)",
                phone: "0901234567",
                total_price: 35.0,
                status: "confirmed",
                service_type: "delivery",
                created_at: new Date(Date.now() - 5 * 60000).toISOString(),
                items: [
                    { name: "Sake Nigiri", quantity: 2, price: 4.5 },
                    { name: "California Roll", quantity: 1, price: 8.9 },
                    { name: "Miso Soup", quantity: 2, price: 3.5 }
                ]
            },
            {
                order_id: "ORD-8823",
                customer_name: "Chị Thảo (Ăn tại chỗ)",
                phone: "0988776655",
                total_price: 22.5,
                status: "pending",
                service_type: "dine-in",
                created_at: new Date().toISOString(),
                items: [
                    { name: "Tuna Sashimi", quantity: 1, price: 12.5 },
                    { name: "Green Tea", quantity: 2, price: 2.5 }
                ]
            }
        ];
        return m.filter(o => status === 'all' || o.status === status);
    }
    if (type === 'reservations') {
        return [
            { first_name: "Nguyễn Trung", last_name: "Hiếu", phone: "0901112223", date: "22.04", time: "18:30", guests: "4", status: "pending" },
            { first_name: "Mai", last_name: "Anh", phone: "0904445556", date: "22.04", time: "19:00", guests: "2", status: "confirmed" }
        ].filter(x => status === 'all' || x.status === status);
    }
    if (type === 'customers') {
        return [
            { first_name: "Lâm", last_name: "Gia", email: "lamgia@gmail.com", phone: "0152443322", loyalty_points: 450 },
            { first_name: "Hải", last_name: "Yến", email: "yen.hai@web.de", phone: "0176332211", loyalty_points: 120 }
        ];
    }
    if (type === 'menu') {
        return [
            { id: "p1", name: "Sake Nigiri", price: 4.50, image: "assets/img/products/sake-nigiri.jpg" },
            { id: "p2", name: "California Roll", price: 8.90, image: "assets/img/products/california.jpg" }
        ];
    }
    if (type === 'discounts') {
        return [{ id: "d1", code: "LEO2026", discount_type: "percentage", discount_value: 15, expiry_date: "2026-12-31" }];
    }
    if (type === 'holidays') {
        return [{ id: "h1", date: "2026-05-01", reason: "Maifeiertag" }];
    }
    return [];
}

function filterOrdersByStatus(status) {
    document.querySelectorAll('#ordersContent .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
    });
    loadOrders();
}
window.filterOrdersByStatus = filterOrdersByStatus;

window.updatePrinterStatusUI = () => {
    const statusText = document.getElementById('printerStatusText');
    if (!statusText) return;
    const saved = window.PrinterManager ? PrinterManager.getSavedPrinter() : null;
    statusText.innerText = saved ? `Máy in: ${saved.type === 'bluetooth' ? 'Bluetooth' : 'LAN (' + saved.ip + ')'}` : 'Chưa thiết lập';
    statusText.style.color = saved ? '#34C759' : '#8E8E93';
};

// Modal handlers placeholders
window.showAddProductModal = () => alert('Chức năng thêm món mới sẽ sớm ra mắt');
window.showAddDiscountModal = () => alert('Chức năng tạo mã giảm giá sẽ sớm ra mắt');
window.showAddHolidayModal = () => alert('Chức năng thêm ngày nghỉ sẽ sớm ra mắt');

window.deleteDiscount = (id) => confirm('Xóa mã giảm giá này?') && console.log('Delete discount:', id);
window.deleteHoliday = (id) => confirm('Xóa ngày nghỉ này?') && console.log('Delete holiday:', id);
window.editProduct = (id) => console.log('Edit product:', id);

window.scanBluetoothUI = () => alert('Đang tìm máy in Bluetooth...');
window.scanNetworkUI = () => alert('Đang quét mạng LAN cho máy in...');

window.testNotificationSound = () => {
    playNotification();
    alert('Đang thử âm báo...');
};

window.exportOrders = () => {
    const orders = window.adminData?.orders || [];
    if (orders.length === 0) {
        alert("Không có dữ liệu đơn hàng để xuất!");
        return;
    }

    // Tiêu đề cột
    const headers = ["ID", "Ngày", "Khách hàng", "Dịch vụ", "Thanh toán", "Trạng thái", "Tổng cộng"];
    const rows = orders.map(o => {
        return [
            o.order_id,
            o.created_at || '',
            `"${(o.customer_name || 'Khách lẻ').replace(/"/g, '""')}"`,
            o.service_type || 'Giao hàng',
            o.payment_method || 'Tiền mặt',
            o.status || 'Chờ xử lý',
            `"${o.order_total || '0,00 €'}"`
        ];
    });

    let csvContent = "\uFEFF"; // BOM cho Excel hiểu tiếng Việt/Đức
    csvContent += headers.join(";") + "\n";
    rows.forEach(row => {
        csvContent += row.join(";") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Leo_Sushi_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Xuất dữ liệu CSV thành công!');
};

window.filterOrders = () => {
    const term = document.getElementById('orderSearch').value.toLowerCase();
    const filtered = window.adminData.orders.filter(o =>
        (o.customer_name || '').toLowerCase().includes(term) ||
        (o.phone || '').includes(term) ||
        (o.order_id || '').toLowerCase().includes(term)
    );
    displayOrders(filtered);
};
// switchTab is defined inline in admin.html to avoid cache issues
// Do NOT redefine it here.


const style = document.createElement('style');
style.innerHTML = `
    .premium-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:24px; transition:0.3s; }
    .status-tag { font-size:10px; font-weight:800; padding:4px 10px; border-radius:12px; }
    .type-tag { font-size:9px; font-weight:800; color:#fff; padding:3px 8px; border-radius:4px; letter-spacing:0.5px; }
    .timer-box { background:rgba(255,255,255,0.03); border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center; }
    .timer-value { font-family: monospace; font-size:18px; font-weight:800; color:var(--gold); }
    .pulse-border { border-color: #FF9500; animation: pulseAnim 2s infinite; }
    @keyframes pulseAnim { 0%, 100% { opacity:1; } 50% { opacity:0.6; } }
    .icon-btn { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; width:44px; height:44px; border-radius:12px; cursor:pointer; }
    .main-btn { background:var(--gold); color:#000; border:none; padding:0 22px; height:44px; border-radius:12px; font-weight:800; cursor:pointer; transition:0.2s; }
    .main-btn:hover { transform: scale(1.05); filter: brightness(1.2); }
    .reservation-row { display:grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; align-items:center; background:rgba(255,255,255,0.03); padding:20px; border-radius:15px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.05); transition:0.3s; }
    .premium-loader { border:3px solid rgba(212,175,55,0.1); border-top:3px solid var(--gold); border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite; margin:0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .completed-order { opacity: 0.6; filter: grayscale(0.3); transform: scale(0.98); }
    .completed-order:hover { opacity: 1; filter: grayscale(0); transform: scale(1); }
    .new-badge { position: absolute; top: -8px; left: -8px; background: #ff3b30; color: #fff; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 6px; box-shadow: 0 4px 12px rgba(255,59,48,0.4); z-index: 10; animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes bounceIn { from { transform: scale(0); } to { transform: scale(1); } }
    
    .nav-badge { background: #ff3b30; color: #fff; font-size: 10px; font-weight: 800; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-left: auto; padding: 0 5px; box-shadow: 0 2px 8px rgba(255,59,48,0.3); animation: bounceIn 0.3s; }
    .unread-order-highlight { border: 2px solid var(--accent) !important; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); animation: unreadPulse 2s infinite; }
    @keyframes unreadPulse { 0% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); } 50% { box-shadow: 0 0 25px rgba(212, 175, 55, 0.4); } 100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.2); } }

    /* Order Notification Overlay */
    .order-notification-overlay { 
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); 
        display: flex; align-items: center; justify-content: center; 
        z-index: 9999; transition: 0.5s; 
    }
    .notification-card { 
        background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%); 
        border: 2px solid var(--gold); border-radius: 30px; 
        padding: 40px; width: 90%; max-width: 500px; 
        text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); 
        animation: cardAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    }
    @keyframes cardAppear { from { transform: scale(0.8) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
    .notification-card h1 { font-family: 'Fraunces', serif; color: var(--gold); font-size: 32px; margin: 15px 0; }
    .notification-card p { font-size: 18px; color: rgba(255,255,255,0.7); margin-bottom: 30px; }
    .notif-btn-group { display: flex; flex-direction: column; gap: 15px; }
    .notif-btn-main { 
        background: var(--gold); color: #000; border: none; 
        padding: 16px; border-radius: 15px; font-weight: 800; 
        font-size: 16px; cursor: pointer; transition: 0.3s; 
    }
    .notif-btn-main:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3); }
    .notif-btn-sec { 
        background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); 
        padding: 14px; border-radius: 15px; font-weight: 600; 
        font-size: 14px; cursor: pointer; transition: 0.3s; 
    }
    .notif-btn-sec:hover { background: rgba(255,255,255,0.2); }
    .new-label { 
        background: var(--gold); color: #000; padding: 6px 15px; 
        border-radius: 20px; font-size: 12px; font-weight: 900; 
        letter-spacing: 2px; display: inline-block; 
    }
`;
document.head.appendChild(style);

console.log('✅ Premium v1.5 - Smart Status Logic Active');

/** ══════════════════════════════════════════════════
 *  PRINTER MANAGEMENT LOGIC
 *  ══════════════════════════════════════════════════ */

window.updatePrinterStatusUI = () => {
    if (typeof PrinterManager === 'undefined') return;
    const printer = PrinterManager.getSavedPrinter();

    // Update Bluetooth Badge
    const btBadge = document.getElementById('btStatusBadge');
    if (btBadge) {
        const isBt = printer && printer.type === 'bluetooth';
        const isConnected = isBt && typeof BluetoothPrinter !== 'undefined' && BluetoothPrinter.isConnected;

        if (isConnected) {
            btBadge.innerText = 'Đã kết nối';
            btBadge.style.background = 'rgba(52,199,89,0.1)';
            btBadge.style.color = '#34C759';
        } else if (isBt) {
            btBadge.innerText = 'Đã lưu (Chờ kết nối)';
            btBadge.style.background = 'rgba(255,149,0,0.1)';
            btBadge.style.color = '#FF9500';
        } else {
            btBadge.innerText = 'Chưa kết nối';
            btBadge.style.background = 'rgba(255,255,255,0.05)';
            btBadge.style.color = 'var(--text-dim)';
        }
    }

    // Update LAN Badge
    const lanBadge = document.getElementById('lanStatusBadge');
    if (lanBadge) {
        const isLan = printer && (printer.type === 'network' || printer.type === 'network_fallback');
        if (isLan && printer.ip) {
            lanBadge.innerText = `Đã lưu (${printer.ip})`;
            lanBadge.style.background = 'rgba(52,199,89,0.1)';
            lanBadge.style.color = '#34C759';
        } else {
            lanBadge.innerText = 'Chưa thiết lập';
            lanBadge.style.background = 'rgba(255,255,255,0.05)';
            lanBadge.style.color = 'var(--text-dim)';
        }
    }
};

window.connectBluetoothPrinter = async () => {
    if (typeof BluetoothPrinter === 'undefined') {
        alert('Tính năng Bluetooth không khả dụng trên trình duyệt/thiết bị này.');
        return;
    }

    try {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.disabled = true;
        btn.innerText = 'Đang tìm kiếm...';

        const device = await BluetoothPrinter.connect();
        PrinterManager.savePrinter({ type: 'bluetooth', id: device.id, name: device.name });

        btn.innerText = originalText;
        btn.disabled = false;

        updatePrinterStatusUI();
        alert(`Đã kết nối máy in: ${device.name}`);
    } catch (err) {
        alert('Lỗi kết nối Bluetooth: ' + (err.message || 'Không rõ lỗi'));
        updatePrinterStatusUI();
    } finally {
        const btn = document.querySelector('button[onclick="connectBluetoothPrinter()"]');
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Kết nối Bluetooth';
        }
    }
};

window.connectLanPrinter = async () => {
    const ip = document.getElementById('printerIpInput').value.trim();
    if (!ip) {
        alert('Vui lòng nhập địa chỉ IP máy in (ví dụ: 192.168.1.100)');
        return;
    }

    try {
        if (typeof NativeLanPrinter !== 'undefined' && NativeLanPrinter.hasNativeBridge()) {
            const res = await NativeLanPrinter.connect(ip);
            if (res.success) {
                PrinterManager.savePrinter({ type: 'network', ip: ip });
                updatePrinterStatusUI();
                alert('Đã kết nối máy in LAN thành công!');
            }
        } else {
            // Browser fallback: just save the IP
            PrinterManager.savePrinter({ type: 'network', ip: ip });
            updatePrinterStatusUI();
            alert('Cài đặt đã được lưu (Sẽ dùng in hệ thống trên trình duyệt).');
        }
    } catch (err) {
        alert('Không thể kết nối tới IP này: ' + err.message);
    }
};

window.discoverLanPrinters = async () => {
    if (typeof NativeLanPrinter === 'undefined' || !NativeLanPrinter.hasNativeBridge()) {
        alert('Tính năng tự động quét chỉ hỗ trợ trong ứng dụng Android (APK).');
        return;
    }

    const resultsDiv = document.getElementById('lanScanResults');
    resultsDiv.innerHTML = '<p style="color:var(--accent); animation: pulse 1s infinite;">🔍 Đang quét mạng LAN (30s)...</p>';

    try {
        await PrinterManager.startSmartDiscovery();
    } catch (err) {
        resultsDiv.innerHTML = `<p style="color:#ff3b30;">Lỗi: ${err.message}</p>`;
    }
};

function renderLanScanResults(ips, error) {
    const resultsDiv = document.getElementById('lanScanResults');
    if (!resultsDiv) return;

    if (error) {
        resultsDiv.innerHTML = `<p style="color:#ff3b30;">${error}</p>`;
        return;
    }

    if (!ips || ips.length === 0) {
        resultsDiv.innerHTML = '<p style="opacity:0.5;">Không tìm thấy máy in nào tự động. Hãy nhập IP thủ công.</p>';
        return;
    }

    let html = '<p style="font-weight:700; margin-bottom:5px;">Máy in tìm thấy:</p>';
    ips.forEach(ip => {
        html += `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:8px; border-radius:6px; margin-bottom:5px;">
            <span>📍 IP: ${ip}</span>
            <button class="btn btn-primary" style="padding:4px 10px; font-size:11px;" onclick="selectScannedIp('${ip}')">Chọn</button>
        </div>`;
    });
    resultsDiv.innerHTML = html;
}

window.selectScannedIp = (ip) => {
    const input = document.getElementById('printerIpInput');
    if (input) input.value = ip;
    window.connectLanPrinter();
};

window.testPrint = async (type) => {
    try {
        if (type === 'bluetooth') {
            if (typeof BluetoothPrinter === 'undefined') throw new Error('Bluetooth không khả dụng');
            await BluetoothPrinter.printTest();
        } else {
            if (typeof NetworkPrinter === 'undefined') throw new Error('Network Printer không khả dụng');
            await NetworkPrinter.printTest();
        }
    } catch (err) {
        alert('Lỗi in thử: ' + err.message);
    }
};

function renderReservationCard(r) {
    let statusInfo;
    if (r.status === 'confirmed') statusInfo = { l: 'ĐÃ XÁC NHẬN', c: '#34C759', b: 'rgba(52,199,89,0.1)' };
    else if (r.status === 'completed') statusInfo = { l: 'HOÀN THÀNH', c: '#007AFF', b: 'rgba(0,122,255,0.1)' };
    else if (r.status === 'cancelled') statusInfo = { l: 'ĐÃ HỦY', c: '#ef4444', b: 'rgba(239,68,68,0.1)' };
    else statusInfo = { l: 'CHỜ DUYỆT', c: '#FF9500', b: 'rgba(255,149,0,0.1)' };

    const dateStr = r.date + ' ' + r.time;
    const id = r.id || r.order_id;

    return `
        <div id="order-card-${id}" class="premium-card" data-order-id="${id}" style="border-left: 4px solid #FF2D55; position:relative; padding:15px; background:rgba(255,255,255,0.02); border-radius:15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span class="type-tag" style="background:#FF2D55; color:#fff; font-size:10px; padding:3px 8px; border-radius:6px; font-weight:700;">📅 ĐẶT BÀN</span>
                <span class="status-tag" style="background:${statusInfo.b}; color:${statusInfo.c}; font-size:10px; padding:3px 8px; border-radius:6px; font-weight:700;">${statusInfo.l}</span>
            </div>
            
            <h3 style="font-family:'Fraunces', serif; font-size:18px; color:#fff; margin-bottom:4px;">${r.customer_name}</h3>
            <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">📱 ${r.phone}</p>
            
            <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:10px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="opacity:0.6;">Thời gian:</span>
                    <span style="font-weight:700; color:#fff;">${dateStr}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:4px;">
                    <span style="opacity:0.6;">Số khách:</span>
                    <span style="font-weight:700; color:#d4af37;">${r.guests} KHÁCH</span>
                </div>
                ${r.note ? `<div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(255,255,255,0.05); font-size:11px; font-style:italic; color:#FF9500;">📝 ${r.note}</div>` : ''}
            </div>

            <div style="display:flex; gap:8px;">
                ${r.status === 'pending' ? `
                    <button class="main-btn" style="flex:1; padding:8px; font-size:12px;" onclick="updateReservationStatus('${r.id}', 'confirmed')">XÁC NHẬN</button>
                    <button class="main-btn" style="padding:8px; font-size:12px; background:rgba(239, 68, 68, 0.1); color:#ef4444; border:1px solid #ef4444;" onclick="openRejectModal('${r.id}', 'reservation')">KHÔNG NHẬN</button>
                ` : r.status === 'confirmed' ? `
                    <button class="main-btn" style="flex:1; background:#007AFF; padding:8px; font-size:12px;" onclick="updateReservationStatus('${r.id}', 'completed')">XONG</button>
                    <button class="main-btn" style="flex:1; background:rgba(255,255,255,0.1); color:#fff; padding:8px; font-size:12px;" onclick="updateReservationStatus('${r.id}', 'pending')">HOÀN TÁC</button>
                ` : `
                    <button class="main-btn" style="flex:1; background:rgba(255,255,255,0.1); color:#fff; padding:8px; font-size:12px;" onclick="updateReservationStatus('${r.id}', 'pending')">HOÀN TÁC</button>
                `}
            </div>
        </div>
    `;
}

window.updateReservationStatus = async function (id, status, reason = null) {
    if (status === 'cancelled' && !reason && !confirm('Xóa lịch đặt bàn này?')) return;
    try {
        const body = { id, status };
        if (reason) body.reason = reason;

        const res = await adminFetch(`${API_BASE}v1/data/reservations/update-status`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
            if (window.addNotification) window.addNotification('order_success', 'ĐÃ CẬP NHẬT', 'Lịch đặt bàn');
            loadOrders(true);
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (e) { console.error(e); }
};

// --- FILTERING ---
window.filterOrdersByStatus = function (status) {
    console.log('Filtering orders by status:', status);
    // Update UI active state
    document.querySelectorAll('#ordersContent .filter-btn').forEach(btn => {
        if (btn.dataset.status) {
            btn.classList.toggle('active', btn.dataset.status === status);
        }
    });
    const mobileSelect = document.querySelector('.mobile-status-filter');
    if (mobileSelect) mobileSelect.value = status;

    // Clear search and date picker when changing status
    const picker = document.getElementById('datePicker');
    if (picker) picker.value = '';
    window.currentDateFilter = 'all';

    loadOrders();
};

window.applyDatePickerFilter = function () {
    const picker = document.getElementById('datePicker');
    if (picker) {
        window.currentDateFilter = picker.value || 'all';
        console.log('📅 Date filter applied:', window.currentDateFilter);
        displayOrders(window.adminData.orders);
    }
};

window.clearDatePicker = function () {
    const picker = document.getElementById('datePicker');
    if (picker) picker.value = '';
    window.currentDateFilter = 'all';
    displayOrders(window.adminData.orders);
};

window.filterOrders = function () {
    displayOrders(window.adminData.orders);
};

window.switchTab = function (tab) {
    console.log('Switching to tab:', tab);
    window.adminData.activeTab = tab;

    // Update Sidebar
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Update Content
    document.querySelectorAll('.admin-content').forEach(c => {
        c.classList.toggle('active', c.id === tab + 'Content');
    });

    // Update Bottom Nav (Mobile)
    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.tab === tab);
    });

    // Clear reservation date filter when switching to tab
    if (tab === 'reservations') {
        const picker = document.getElementById('reservationDatePicker');
        if (picker) {
            picker.value = '';
            console.log("DEBUG: Cleared reservation date picker on tab switch");
        }
    }

    refreshData();
};


// END OF FILE - Cleaned up duplicates
