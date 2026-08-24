/**
 * Leo Sushi Admin - Orders Management V2
 */

var allOrdersData = [];
var timerInterval = null;

async function loadOrders(silent = false) {
    const ordersList = document.getElementById('ordersList');
    if (!silent && ordersList) {
        ordersList.innerHTML = `<div class="empty-state"><div class="loading-spinner"></div><p>Đang tải dữ liệu đơn hàng...</p></div>`;
    }

    try {
        const statusFilter = document.querySelector('.filter-btn.active[data-status]')?.dataset.status || 'all';
        const token = localStorage.getItem('leo_admin_session_token');
        let response;

        if (window.api && window.api.orders && window.api.orders.list && window.api.orders.isMock) {
            const result = await window.api.orders.list('all');
            response = { ok: true, headers: { get: () => 'application/json' }, json: async () => result };
        } else {
            const url = `api/index.php?route=${encodeURIComponent('v1/data/orders')}&status=all`;
            response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });
        }

        let data = await response.json();

        // Handle mock mode which returns direct array
        if (Array.isArray(data)) {
            data = { success: true, orders: data };
        }

        if (data.success && data.orders) {
            allOrdersData = [...data.orders];

            // Auto-printing unconfirmed orders is disabled per user request

            // Apply filter
            let filteredOrders = allOrdersData;
            if (statusFilter !== 'all') {
                filteredOrders = allOrdersData.filter(o => (o.status || 'pending') === statusFilter);
            }

            if (filteredOrders.length > 0) {
                displayOrders(filteredOrders);
                initOrderTimers();
            } else {
                ordersList.innerHTML = `<div class="empty-state"><h3>Không có đơn hàng</h3></div>`;
            }
        }
    } catch (error) {
        console.error('Lỗi tải đơn hàng:', error);
        if (ordersList) {
            ordersList.innerHTML = `<div class="empty-state" style="color:red">Lỗi tải dữ liệu: ${error.message}</div>`;
        }
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    if (!orders || orders.length === 0) {
        ordersList.innerHTML = `<div class="empty-state">Không có đơn hàng nào.</div>`;
        return;
    }

    // Sort newest first
    const sortedOrders = [...orders].sort((a, b) => {
        const getTs = (o) => o.created_at ? new Date(o.created_at).getTime() : 0;
        return getTs(b) - getTs(a);
    });

    let html = '';
    sortedOrders.forEach(order => {
        html += renderOrderCard(order);
    });

    ordersList.innerHTML = html;
}

function renderOrderCard(order) {
    const orderId = order.order_id || order.id || 'N/A';
    const orderIdShort = orderId.toString().slice(-8);
    const status = order.status || 'pending';
    const time = order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---';
    const total = order.total || order.order_total || order.summary?.total || '0 đ';

    // Fallbacks for nested properties
    let customerName = order.delivery_address?.first_name || order.first_name || 'Khách';
    let phone = order.delivery_address?.phone || order.phone || '---';

    let statusHtml = '';
    if (status === 'pending') statusHtml = '<span class="badge badge-warning">Chờ xử lý</span>';
    else if (status === 'confirmed') statusHtml = '<span class="badge badge-success">Đã xác nhận</span>';
    else if (status === 'cancelled') statusHtml = '<span class="badge badge-danger">Đã hủy</span>';
    else statusHtml = `<span class="badge badge-info">${status}</span>`;

    return `
    <div class="order-card" data-order-id="${orderId}">
        <div class="card-header">
            <div>
                <strong>#LEO-${orderIdShort}</strong>
                <div class="text-sm text-muted">${time}</div>
            </div>
            ${statusHtml}
        </div>
        <div class="card-body">
            <p><strong>Khách hàng:</strong> ${customerName}</p>
            <p><strong>SĐT:</strong> ${phone}</p>
            <p><strong>Tổng tiền:</strong> <span style="color: var(--gold); font-weight: bold;">${total} đ</span></p>
        </div>
        <div class="card-footer">
            ${status === 'pending' ? `
                <button class="btn btn-primary" onclick="confirmOrder('${orderId}')">Gửi In Bếp</button>
                <button class="btn btn-danger" onclick="cancelOrder('${orderId}')">Hủy đơn</button>
            ` : ''}
            <button class="btn btn-outline" onclick="viewOrder('${orderId}')">Chi tiết</button>
            <button class="btn btn-outline" onclick="printOrderBill('${orderId}')">🖨️ In bill</button>
        </div>
    </div>
    `;
}

// Actions wrappers
window.confirmOrder = async function (id) {
    if (!confirm('Duyệt đơn và gửi lệnh Máy In?')) return;
    try {
        await window.api.orders.updateStatus(id, 'confirmed');
        if (typeof checkAutoPrinting === 'function') checkAutoPrinting(allOrdersData.filter(o => o.order_id === id));
        loadOrders(true);
    } catch (e) { alert('Lỗi: ' + e.message); }
}

window.cancelOrder = async function (id) {
    if (!confirm('Chắc chắn hủy đơn này?')) return;
    try {
        await window.api.orders.updateStatus(id, 'cancelled');
        loadOrders(true);
    } catch (e) { alert('Lỗi: ' + e.message); }
}

window.filterOrdersByStatus = function (status) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.status === status));
    loadOrders(false);
}

// Expose explicitly explicitly to window
window.loadOrders = loadOrders;
window.displayOrders = displayOrders;

function initOrderTimers() { } // Placeholder for future feature
