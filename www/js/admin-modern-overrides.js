
/* ==========================================================================
   MODERN DASHBOARD OVERRIDES - v8
   ========================================================================== */

// Global State
window.__loadOrdersRunning = false;

const MOCK_ORDERS = [
    { order_id: "ORD-001", customer_name: "Anh Hoàng (Mẫu)", total_price: 32.50, status: "pending", created_at: new Date().toISOString(), phone: "0901234567" },
    { order_id: "ORD-002", customer_name: "Chị Mai (Mẫu)", total_price: 18.00, status: "confirmed", created_at: new Date().toISOString(), phone: "0988776655" }
];

// Renderer
window.displayOrders = function (orders) {
    console.log('Rendering orders:', orders ? orders.length : 0);
    const list = document.getElementById('ordersList');
    if (!list) return;

    if (!orders || orders.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:100px; opacity:0.5;">📭 Không có đơn hàng.</div>';
        return;
    }

    list.innerHTML = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:20px;">` +
        orders.map(o => `
            <div class="card-modern" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:16px; padding:20px; transition:all 0.3s;">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                    <span style="font-size:12px; color:var(--gold);">#${o.order_id}</span>
                    <span style="background:${o.status === 'pending' ? 'rgba(255,152,0,0.1)' : 'rgba(0,230,118,0.1)'}; color:${o.status === 'pending' ? '#ff9800' : '#00e676'}; padding:4px 10px; border-radius:8px; font-size:11px; font-weight:700;">
                        ${o.status === 'pending' ? 'Chờ xử lý' : 'Đã nhận'}
                    </span>
                </div>
                <h3 style="margin:0 0 10px 0; font-size:18px;">${o.customer_name}</h3>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:15px; margin-top:10px;">
                    <span style="font-size:22px; font-weight:800; color:var(--gold);">${o.total_price}€</span>
                    <button style="background:var(--gold); color:#000; padding:8px 16px; border:none; border-radius:8px; font-weight:700; cursor:pointer;" onclick="alert('Xem chi tiết đơn ${o.order_id}')">Chi tiết</button>
                </div>
            </div>
        `).join('') + `</div>`;
};

// Core Functions
window.loadOrders = async function (silent = false) {
    if (window.__loadOrdersRunning) return;
    window.__loadOrdersRunning = true;

    const list = document.getElementById('ordersList');
    if (!silent && list) list.innerHTML = '<div style="text-align:center; padding:100px;"><div class="spinner-modern"></div><p style="margin-top:20px; color:rgba(255,255,255,0.4);">Đang đồng bộ dữ liệu...</p></div>';

    try {
        const res = await fetch('api/index.php?route=v1/data/orders');
        const data = await res.json();
        if (data.success && data.orders && data.orders.length > 0) {
            window.displayOrders(data.orders);
        } else {
            window.displayOrders(MOCK_ORDERS);
        }
    } catch (e) {
        console.warn('API Error, using mock:', e);
        window.displayOrders(MOCK_ORDERS);
    } finally {
        window.__loadOrdersRunning = false;
    }
};

window.filterOrdersByStatus = function (status) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.status === status));
    loadOrders();
};

window.switchTab = function (tabId) {
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    document.querySelectorAll('.admin-content').forEach(c => { c.style.display = 'none'; c.classList.remove('active'); });
    const target = document.getElementById(tabId + 'Content');
    if (target) { target.style.display = 'block'; target.classList.add('active'); }
    if (tabId === 'orders') loadOrders();
    else if (tabId === 'stats' && window.AdminStats) AdminStats.loadStats();
};

window.handleAdminLogin = function () {
    document.getElementById('adminLoginModal').style.display = 'none';
    loadOrders();
};

// Auto Start
if (document.readyState === 'complete') { loadOrders(); }
else { window.addEventListener('load', loadOrders); }

// Global Styles
const s = document.createElement('style');
s.innerHTML = `
    .spinner-modern { border: 3px solid rgba(255,215,0,0.1); border-top: 3px solid #ffd700; border-radius: 50%; width: 40px; height: 40px; animation: spinModern 1s linear infinite; margin: 0 auto; }
    @keyframes spinModern { to { transform: rotate(360deg); } }
    .card-modern:hover { transform: translateY(-4px); background: rgba(255,255,255,0.07) !important; border-color: var(--gold) !important; cursor: default; }
`;
document.head.appendChild(s);

console.log('🚀 Modern Core v8 Active');
