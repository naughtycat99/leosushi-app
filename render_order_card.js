function renderOrderCard(order, forcedDate = null) {
            // Parse summary first so we can use it for ID
            let summary = {};
            if (order.summary) {
                if (typeof order.summary === 'string') {
                    try { summary = JSON.parse(order.summary) || {}; } catch (e) { }
                } else { summary = order.summary || {}; }
            }
            if (!summary) summary = {};

            const isReservation = order.is_merged_reservation || (order.service_type || '').toLowerCase() === 'reservation';
            const orderId = order.order_id || order.id || (summary.timestamp ? summary.timestamp : 'N/A');
            const orderIdShort = summary.short_id || (orderId.toString().includes('-') ? 'LEO-' + orderId.toString().split('-').pop() : orderId.toString().slice(-8));
            const status = order.status || 'pending';
            const statusText = getStatusText(status);

            // Handle different createdAt formats
            let orderTime = 'Unbekannt';
            try {
                if (order.created_at) {
                    orderTime = new Date(order.created_at).toLocaleString('de-DE');
                } else if (summary.timestamp) {
                    orderTime = new Date(summary.timestamp).toLocaleString('de-DE');
                } else if (order.createdAt) {
                    orderTime = new Date(order.createdAt).toLocaleString('de-DE');
                }
            } catch (e) {
                console.error('Error parsing order date:', e);
                orderTime = order.created_at || summary.timestamp || order.createdAt || 'Unbekannt';
            }

            // IMPORTANT: Ensure the card uses the SAME date as the grouping header if forced
            if (forcedDate) {
                // Update orderTime display if it doesn't match the grouping date (to avoid confusion)
                // If forcedDate is "2026-03-24", and orderTime is "23.03.2026, 23:59", we might have a shift.
            }

            const total = isReservation ? (order.items_total || '0,00 €') : (summary.total || order.order_total || '0,00 €');

            let customerName = 'Kunde';
            let phone = 'N/A';
            let note = '';

            if (isReservation) {
                customerName = order.name || 'Kunde';
                phone = order.phone || 'N/A';
                note = order.note || '';
            } else {
                customerName = `${order.delivery_address?.first_name || order.delivery?.address?.firstName || ''} ${order.delivery_address?.last_name || order.delivery?.address?.lastName || ''} `.trim() || 'Kunde';
                phone = order.delivery_address?.phone || order.delivery?.address?.phone || 'N/A';
                note = order.delivery_address?.note || order.delivery?.address?.note || summary.note || '';
            }

            // Parse delivery_address
            let address = null;
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { }
                } else { address = order.delivery_address; }
            }
            const addressStr = address ? `${address.street || ''} ${address.house_number || address.houseNumber || ''}, ${address.postal || ''} ${address.city || ''}`.trim() : '';

            return `
                <div class="order-card ${status}" data-order-id="${orderId}">
                    <div class="card-header">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div class="order-id" style="font-size: 16px; font-weight: 700;">#${orderIdShort}</div>
                                ${(() => {
                                    const type = (order.service_type || '').toLowerCase();
                                    if (type === 'reservation') return '<span style="background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">ĐẶT BÀN</span>';
                                    if (type === 'dinein') return '<span style="background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">ĂN TẠI CHỖ</span>';
                                    if (type === 'delivery') return '<span style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">GIAO HÀNG</span>';
                                    if (type === 'pickup') return '<span style="background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">MANG VỀ</span>';
                                    return '';
                                })()}
                                ${(() => {
                                    let branchId = order.branch_id;
                                    if (!branchId && order.summary) {
                                        let sum = order.summary;
                                        if (typeof sum === 'string') {
                                            try { sum = JSON.parse(sum); } catch (e) {}
                                        }
                                        if (sum && sum.branch && sum.branch.id) {
                                            branchId = sum.branch.id;
                                        }
                                    }
                                    const bName = branchId === 'branch_haupt' ? 'Hauptstraße' : 'Florastraße';
                                    return `<span style="background: rgba(229,207,142,0.15); color: var(--gold); border: 1px solid rgba(229,207,142,0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-left: 4px;">🏢 ${bName}</span>`;
                                })()}
                            </div>
                            <div style="font-size: 12px; color: rgba(255,255,255,0.5);">${orderTime}</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${(isReservation || summary.scheduled_delivery_time) ? `
                            <div class="scheduled-badge" style="background: ${isReservation ? 'rgba(16,185,129,0.15)' : 'rgba(229,207,142,0.15)'}; border: 1px solid ${isReservation ? '#10b981' : 'var(--gold)'}; color: ${isReservation ? '#10b981' : 'var(--gold)'}; padding: 4px 8px; border-radius: 6px; font-size: 11px; display: flex; flex-direction: column; align-items: flex-start; gap: 2px;">
                                <div style="display: flex; align-items: center; gap: 4px;">
                                    <span>${isReservation ? '🪑' : '🕐'}</span>
                                    <strong>${isReservation ? `Khách: ${order.guests || 1}` : `Hẹn: ${summary.scheduled_delivery_time.time}`}</strong>
                                </div>
                                <div style="font-size: 9px; opacity: 0.8; margin-left: 18px;">${isReservation ? `Giờ: ${order.time || '--:--'}` : `Ngày: ${summary.scheduled_delivery_time.date || ''}`}</div>
                            </div>
                            ` : ''}
                            <span class="card-status status-${status}">${statusText}</span>
                        </div>
                    </div>
                    
                    <div class="card-info">
                        <div class="info-row">
                            <span class="label">👤 Khách hàng</span>
                            <span class="value">${customerName} ${phone !== 'N/A' ? `<a href="tel:${phone}" style="margin-left:8px; color:var(--gold); text-decoration:none;">📞 Gọi</a>` : ''}</span>
                        </div>
                        ${((order.service_type || '').toLowerCase() === 'delivery' && addressStr) ? `
                        <div class="info-row">
                            <span class="label">📍 Địa chỉ</span>
                            <span class="value" style="font-weight: 500; color: #fff;">${addressStr}</span>
                        </div>
                        ` : ''}
                        <div class="info-row">
                            <span class="label">💳 Thanh toán</span>
                            <span class="value">${(() => {
                    const pm = (order.payment_method || summary.payment_method || '').toLowerCase();
                    return pm.includes('cash') || pm.includes('tiền mặt') || pm.includes('bar') ? 'Tiền mặt' : (pm.includes('paypal') ? 'PayPal' : (pm.includes('card') || pm.includes('karte') || pm.includes('thẻ') ? 'Thẻ' : 'Tiền mặt'));
                })()} ${(order.payment_status === 'paid' || summary.payment_status === 'paid') ? '✅' : '❌'}</span>
                        </div>
                        ${note ? `
                        <div class="info-row" style="margin-top: 8px; background: rgba(229,207,142,0.05); padding: 8px; border-radius: 8px; border-left: 3px solid var(--gold);">
                            <span class="value" style="font-style: italic; font-size: 13px; color: #eee; white-space: normal;">📝 ${note}</span>
                        </div>
                        ` : ''}
                        <div class="info-row" style="border-top: 1px solid rgba(229,207,142,0.1); padding-top: 8px; margin-top: 5px;">
                            <span class="label" style="color: var(--gold); font-weight: 600;">Tổng cộng</span>
                            <span class="value" style="color: var(--gold); font-size: 18px; font-weight: 800;">${total}</span>
                        </div>
                    </div>

                    ${status === 'confirmed' && summary.confirmed_at ? `
                    <div class="order-timers" id="timers-${orderId}" style="margin-top: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">
                        <div class="timer-phase completion-phase">
                            <div class="timer-header" style="color: #10b981;">
                                <span>⏳ Thời gian còn lại:</span>
                                <span class="timer-value" style="color: #10b981; font-size: 16px;">--:--</span>
                            </div>
                            <div class="timer-progress-bg" style="height: 4px; background: rgba(255,255,255,0.05);">
                                <div class="timer-progress-fill" style="width: 0%; background: #10b981;"></div>
                            </div>
                        </div>
                    </div>
                    ` : ''
                }

            <div class="card-actions">
                ${status === 'pending' ? `
                            <button class="btn-action btn-confirm" onclick="${isReservation ? `confirmReservation('${orderId}')` : `confirmOrder('${orderId}')`}" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff;">Duyệt</button>
                            <button class="btn-action btn-cancel" onclick="${isReservation ? `cancelReservation('${orderId}')` : `cancelOrder('${orderId}')`}">Hủy</button>
                        ` : ''}
                ${(status === 'confirmed' || status === 'in_delivery') && !isReservation ? `
                            <button class="btn-action btn-confirm" onclick="completeOrder('${orderId}')" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); border: none;">✓ Hoàn thành</button>
                        ` : ''}
                <button class="btn-action btn-view" onclick="${isReservation ? `alert('Đặt bàn: ${customerName}\\nSố người: ${order.guests || 1}\\nThời gian: ${order.date} ${order.time}\\nGhi chú: ${note || 'Không có'}')` : `viewOrderDetails('${orderId}')`}" style="grid-column: ${status === 'pending' || isReservation ? 'span 2' : 'span 1'}; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">${status === 'pending' ? 'Xem nhanh' : 'Chi tiết'}</button>
                ${(status !== 'pending' && !isReservation) ? `<button class="btn-action" onclick="printOrderBill('${orderId}')" style="grid-column: span 2; margin-top: 4px; border: 1px dashed rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.8); transition: all 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.4)';" onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255,255,255,0.2)';">🖨️ In Hóa Đơn (Bill)</button>` : ''}
            </div>
                </div>
                `;
        }

        // Helper function to get a date string (YYYY-MM-DD) from an order object
        function getOrderDate(order) {
            let date;
            if (order.date) {
                // If date is already a string "YYYY-MM-DD", return it
                if (typeof order.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(order.date)) {
                    return order.date;
                }
            }

            if (order.created_at) {
                date = new Date(order.created_at);
            } else if (order.summary) {
                let sum = order.summary;
                if (typeof sum === 'string') {
                    try { sum = JSON.parse(sum); } catch (e) { }
                }
                if (sum && sum.timestamp) {
                    date = new Date(sum.timestamp);
                }
            } else if (order.createdAt) {
                if (order.createdAt.seconds) {
                    date = new Date(order.createdAt.seconds * 1000);
                } else if (order.createdAt.toDate) {
                    date = order.createdAt.toDate();
                } else if (typeof order.createdAt === 'string') {
                    date = new Date(order.createdAt);
                }
            } else if (order.timestamp) {
                date = new Date(order.timestamp);
            }

            if (date && !isNaN(date.getTime())) {
                // Use local date instead of ISO string (UTC) to avoid timezone shift
                return getLocalDateStr(date);
            }

            // Fallback to today but log a warning if needed
            return getLocalDateStr(new Date());
        }

        // Helper function to get local date string (YYYY-MM-DD)
        function getLocalDateStr(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function displayOrders(orders) {
            console.log('🖥️ [DISPLAY] displayOrders called with:', orders ? orders.length : 0, 'orders');
            const ordersList = document.getElementById('ordersList');
            if (!ordersList) {
                console.error('❌ [ERROR] Element #ordersList not found in DOM!');
                return;
            }

            if (!orders || orders.length === 0) {
                console.log('ℹ️ [DISPLAY] No orders to display, showing empty state');
                ordersList.innerHTML = `
                <div class="empty-state">
                        <div class="empty-state-icon">📦</div>
                        <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Không tìm thấy đơn hàng nào</h3>
                        <p style="color: rgba(255,255,255,.5);">Đơn hàng mới nhất sẽ xuất hiện ở đây</p>
                        <button onclick="loadOrders()" style="margin-top:15px; padding:8px 20px; background:var(--gold); border:none; border-radius:5px; cursor:pointer; color:#000; font-weight:bold;">🔄 Thử tải lại</button>
                    </div>
                `;
                return;
            }

            // Sort orders by timestamp (newest first)
            const sortedOrders = [...orders].sort((a, b) => {
                const getTs = (o) => {
                    if (o.created_at) return new Date(o.created_at).getTime();
                    if (o.createdAt) {
                        if (typeof o.createdAt === 'string') return new Date(o.createdAt).getTime();
                        if (o.createdAt.seconds) return o.createdAt.seconds * 1000;
                    }
                    if (o.timestamp) return new Date(o.timestamp).getTime();
                    if (o.summary) {
                        let sum = o.summary;
                        if (typeof sum === 'string') {
                            try { sum = JSON.parse(sum); } catch (e) { }
                        }
                        if (sum && sum.timestamp) return new Date(sum.timestamp).getTime();
                    }
                    return 0;
                };
                return getTs(b) - getTs(a);
            });

            let html = '';
            let lastDate = '';
            const today = getLocalDateStr(new Date());

            sortedOrders.forEach(order => {
                const orderDate = getOrderDate(order);

                if (orderDate !== lastDate) {
                    const dateObj = new Date(orderDate);
                    const formattedDate = isNaN(dateObj.getTime()) ? orderDate : dateObj.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    html += `
                <div class="date-group-header" style="
            grid-column: 1 / -1;
            padding: 12px 20px;
            margin: 20px 0 10px 0;
            background: rgba(229, 207, 142, 0.1);
            border-left: 4px solid var(--gold);
            color: var(--gold);
            font-weight: 700;
            font-size: 16px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            ">
                <span>📅 ${formattedDate}</span>
                    ${orderDate === today ? '<span style="font-size: 12px; background: var(--gold); color: #000; padding: 2px 8px; border-radius: 10px; font-weight: bold;">HEUTE</span>' : ''}
                </div>
                `;
                    lastDate = orderDate;
                }
                html += renderOrderCard(order, orderDate);
            });

            ordersList.innerHTML = html;
            console.log('✅ [DISPLAY] Orders list DOM updated');
        }

        // Global complete order function
        window.completeOrder = async function (orderId) {
            if (!confirm('Xác nhận đơn hàng này đã hoàn thành và khách đã nhận xong?')) {
                return;
            }
            try {
                const result = await (typeof ordersAPI !== 'undefined' ?
                    ordersAPI.updateStatus(orderId, 'completed', 'confirmed') :
                    api.orders.updateStatus(orderId, 'completed', 'confirmed'));

                if (result && result.success) {
                    if (window.showMenuNotification) {
                        showMenuNotification('✅ Đã xác minh đơn hàng hoàn thành!', 'success');
                    } else {
                        alert('Đã xác minh đơn hàng hoàn thành!');
                    }
                    
                    // Optimistic DOM Update for instant feedback
                    const card = document.querySelector(`.order-card[data-order-id="${orderId}"]`);
                    if (card) {
                        const badge = card.querySelector('.card-status');
                        if (badge) {
                            badge.className = 'card-status status-completed';
                            badge.innerHTML = 'Abgeschlossen';
                        }
                        const actions = card.querySelector('.order-actions');
                        if (actions) actions.style.display = 'none';
                    }
                    setTimeout(() => { if (typeof loadOrders === 'function') loadOrders(true, true); }, 1500);
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') AdminStats.loadStats();
                } else {
                    throw new Error(result.message || 'Lỗi không xác định khi cập nhật');
                }
            } catch (error) {
                console.error('❌ Lỗi khi xác minh đơn hoàn thành:', error);
                alert('Lỗi: ' + error.message);
            }
        };

        // Global delete order function
        window.deleteOrder = async function (orderId) {
            if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.')) {
                return;
            }

            try {
                console.log('🗑️ Xóa đơn hàng:', orderId);
                const result = await (typeof ordersAPI !== 'undefined' ? ordersAPI.deleteOrder(orderId) : api.orders.deleteOrder(orderId));

                if (result && result.success) {
                    // Remove from UI
                    const cards = document.querySelectorAll(`[data - order - id="${orderId}"]`);
                    cards.forEach(card => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateX(20px)';
                        setTimeout(() => card.remove(), 300);
                    });

                    // Show notification
                    if (window.showToast) window.showToast('Đơn hàng đã được xóa thành công', 'success');
                    else alert('✅ Đơn hàng đã được xóa thành công');

                    // Update stats
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') AdminStats.loadStats();
                } else {
                    throw new Error(result.message || 'Lỗi không xác định khi xóa đơn hàng');
                }
            } catch (error) {
                console.error('❌ Lỗi khi xóa đơn hàng:', error);
                alert('Lỗi khi xóa đơn hàng: ' + error.message);
            }
        };

        // --- FILTER & DATA LOADING FUNCTIONS ---

        /** 
         * Filter orders by status (all, pending, confirmed, cancelled)
         */
        window.filterOrdersByStatus = function (status) {
            console.log('🔍 [FILTER] Orders by status:', status);

            // Update UI buttons
            document.querySelectorAll('#ordersContent .filter-btn').forEach(btn => {
                if (btn.getAttribute('data-status') === status) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Update mobile select if exists
            const mobileSelect = document.querySelector('#ordersContent .mobile-status-filter');
            if (mobileSelect) mobileSelect.value = status;

            // Reload orders with new filter
            if (typeof loadOrders === 'function') {
                loadOrders(false, false);
            }
        };

        /**
         * Filter orders by search text
         */
        window.filterOrders = function () {
            const searchText = document.getElementById('orderSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.orders-list .order-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const orderId = card.getAttribute('data-order-id') || '';
                if (text.includes(searchText) || orderId.toLowerCase().includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        /**
         * Filter reservations by status
         */
        window.filterReservationsByStatus = function (status) {
            console.log('🔍 [FILTER] Reservations by status:', status);

            document.querySelectorAll('#reservationsContent .filter-btn').forEach(btn => {
                if (btn.getAttribute('data-status') === status) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            const mobileSelect = document.querySelector('#reservationsContent .mobile-status-filter');
            if (mobileSelect) mobileSelect.value = status;

            if (typeof loadReservations === 'function') {
                loadReservations(false);
            }
        };

        /**
         * Filter reservations by search text
         */
        window.filterReservations = function () {
            const searchText = document.getElementById('reservationSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('#reservationsList .order-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchText)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // Load reservations
        async function loadReservations(preserveScroll = false) {

            // Save scroll position if preserving
            if (preserveScroll) {
                savedScrollPosition = reservationsList.scrollTop || window.scrollY || 0;
            }

            // Only show loading if not preserving scroll
            if (!preserveScroll) {
                reservationsList.innerHTML = `
                <div class="empty-state">
                    <div class="loading-spinner"></div>
                    <p style="color: rgba(255,255,255,.7);">Reservierungen werden geladen...</p>
                </div>
                `;
            }

            try {
                // Get current status filter from reservationsContent only
                const statusFilter = document.querySelector('#reservationsContent .filter-btn.active[data-status]')?.dataset.status ||
                    document.querySelector('#reservationsContent .filter-btn[data-status="all"]')?.dataset.status ||
                    'all';

                console.log('🔍 Loading reservations with filter:', statusFilter);

                // Call API to get reservations (GET request với query parameter)
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                // Encode route parameter to handle slashes properly
                const url = `api/index.php?route=${encodeURIComponent('v1/data/reservations')}${statusFilter !== 'all' ? '&status=' + encodeURIComponent(statusFilter) : ''}`;
                const token = localStorage.getItem('leo_admin_session_token');
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token || ''}`
                    },
                    credentials: 'include'
                });

                // Check if response is JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('❌ Non-JSON response from reservations API:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response. This might be a server error. Please check the server logs.');
                }

                const data = await response.json();

                if (data.success && data.reservations) {
                    console.log('📅 Loaded reservations from API:', data.reservations.length);

                    // Filter reservations by selected date if date picker is set
                    const resDatePicker = document.getElementById('reservationDatePicker');
                    const selectedResDate = resDatePicker ? resDatePicker.value : '';

                    let displayData = data.reservations;

                    // Filter by Admin Branch if applicable
                    let adminRoleObj = null;
                    try {
                        const savedRole = localStorage.getItem('leo_admin_role');
                        if (savedRole) {
                            if (savedRole.startsWith('{')) {
                                adminRoleObj = JSON.parse(savedRole);
                            } else if (savedRole === 'owner') {
                                adminRoleObj = { role: 'owner', branch: null };
                            }
                        }
                    } catch (e) {}

                    if (adminRoleObj && adminRoleObj.role === 'branch_admin' && adminRoleObj.branch) {
                        displayData = displayData.filter(r => {
                            const resBranch = r.branch_id || 'branch_flora';
                            return resBranch === adminRoleObj.branch;
                        });
                    }

                    if (selectedResDate) {
                        displayData = displayData.filter(r => r.date === selectedResDate);
                    }

                    // Apply status filter first
                    let filteredReservations = displayData;
                    if (statusFilter !== 'all') {
                        filteredReservations = displayData.filter(r => (r.status || 'pending') === statusFilter);
                    }

                    // If no date selected, only show upcoming + pending
                    let upcomingReservations = filteredReservations;
                    if (!selectedResDate) {
                        const today = new Date().toISOString().split('T')[0];
                        upcomingReservations = filteredReservations.filter(r => {
                            const isPending = (r.status || 'pending') === 'pending';
                            return r.date >= today || isPending;
                        });
                    }

                    // Always check for new reservations (even in silent mode - we still want sound!)
                    const previousReservationIds = new Set(knownReservationIds);
                    const currentReservationIds = new Set();

                    upcomingReservations.forEach(reservation => {
                        if (reservation.reservation_id) {
                            currentReservationIds.add(reservation.reservation_id.toString());
                        }
                    });

                    // Find new reservations
                    if (previousReservationIds.size > 0) {
                        const newReservationIds = [...currentReservationIds].filter(id => !previousReservationIds.has(id));
                        if (newReservationIds.length > 0) {
                            const newReservations = upcomingReservations.filter(reservation =>
                                reservation.reservation_id && newReservationIds.includes(reservation.reservation_id.toString())
                            );

                            newReservations.forEach(reservation => {
                                // Always play sound, even in silent mode
                                console.log('🔔 Neue Reservierung:', reservation);
                                playNotificationSound();

                                // Show notification UI only if not in silent mode
                                if (!preserveScroll) {
                                    showNewReservationNotification(reservation);
                                } else {
                                    // Silent mode: chỉ phát tiếng + browser notification
                                    if ('Notification' in window && Notification.permission === 'granted') {
                                        const reservationId = reservation.reservation_id || reservation.reservationId || 'N/A';
                                        const reservationIdShort = reservationId.toString().replace(/^(RES-)/, '').slice(-8);
                                        const customerName = `${reservation.first_name || ''} ${reservation.last_name || ''} `.trim() || 'Kunde';
                                        const date = reservation.date || '';
                                        const time = reservation.time || '';

                                        new Notification('📅 Neue Reservierung!', {
                                            body: `Reservierung #${reservationIdShort} - ${customerName} - ${date} ${time} `,
                                            icon: '/assets/logo.png',
                                            badge: '/assets/logo.png',
                                            tag: `reservation - ${reservationId} `,
                                            requireInteraction: false
                                        });
                                    }
                                }
                            });
                        }
                    }

                    knownReservationIds = currentReservationIds;

                    if (upcomingReservations.length > 0) {
                        // Use smart update only during auto-refresh (preserveScroll = true)
                        // Use full render when user clicks filter or first load (preserveScroll = false)
                        if (preserveScroll) {
                            // Smart update mode: chỉ update thay đổi (auto-refresh)
                            try {
                                smartUpdateReservations(upcomingReservations);

                                // Restore scroll position
                                setTimeout(() => {
                                    const reservationsList = document.getElementById('reservationsList');
                                    if (reservationsList) {
                                        reservationsList.scrollTop = savedScrollPosition;
                                    } else {
                                        window.scrollTo(0, savedScrollPosition);
                                    }
                                }, 50);
                            } catch (e) {
                                console.error('Error in smartUpdateReservations, falling back to full render:', e);
                                displayReservations(upcomingReservations);
                            }
                        } else {
                            // Full render mode (user clicked filter or first load)
                            displayReservations(upcomingReservations);
                        }
                    } else {
                        reservationsList.innerHTML = `
                <div class="empty-state">
                                <div class="empty-state-icon">📅</div>
                                <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Keine Reservierungen</h3>
                                <p style="color: rgba(255,255,255,.5);">Neue Reservierungen werden hier angezeigt</p>
                            </div>
                `;
                    }
                } else {
                    throw new Error(data.message || 'Fehler beim Laden der Reservierungen');
                }
            } catch (error) {
                console.error('Error loading reservations:', error);
                reservationsList.innerHTML = `
                <div class="empty-state" style="background: rgba(239,68,68,.1); border: 2px solid rgba(239,68,68,.3);">
                                <div class="empty-state-icon">❌</div>
                                <h3 style="color: #ef4444; margin: 16px 0 8px; font-size: 18px;">Fehler beim Laden der Reservierungen</h3>
                                <p style="color: rgba(255,255,255,.7); margin-bottom: 12px;">${error.message || 'Unknown error'}</p>
                                <button class="btn-action btn-view" onclick="loadReservations()" style="margin-top: 12px;">Erneut versuchen</button>
                            </div>
                `;
            }
        }

        // Smart update reservations - chỉ update phần thay đổi
        function smartUpdateReservations(newReservations) {
            const reservationsList = document.getElementById('reservationsList');
            if (!reservationsList) return;

            // Get existing reservation cards
            const existingCards = reservationsList.querySelectorAll('[data-reservation-id]');
            const existingReservationIds = new Set();
            existingCards.forEach(card => {
                const reservationId = card.getAttribute('data-reservation-id');
                if (reservationId) existingReservationIds.add(reservationId);
            });

            // Find new reservations and updated reservations
            const updatedReservations = [];
            const reservationsToAdd = [];

            newReservations.forEach(reservation => {
                const reservationId = (reservation.reservation_id || reservation.reservationId || '').toString();
                if (!reservationId) return;

                if (!existingReservationIds.has(reservationId)) {
                    // New reservation - add to list
                    reservationsToAdd.push(reservation);
                } else {
                    // Existing reservation - check if status changed
                    const existingCard = reservationsList.querySelector(`[data - reservation - id="${reservationId}"]`);
                    if (existingCard) {
                        const currentStatus = existingCard.querySelector('.card-status')?.textContent?.trim();
                        const statusText = {
                            'pending': 'Ausstehend',
                            'confirmed': 'Bestätigt',
                            'cancelled': 'Storniert'
                        }[reservation.status || 'pending'] || 'Ausstehend';

                        if (currentStatus !== statusText) {
                            // Status changed - update this card
                            updatedReservations.push(reservation);
                        }
                    }
                }
            });

            // Update changed reservations
            updatedReservations.forEach(reservation => {
                const reservationId = (reservation.reservation_id || reservation.reservationId || '').toString();
                const existingCard = reservationsList.querySelector(`[data - reservation - id= "${reservationId}"]`);
                if (existingCard) {
                    // Update status badge
                    const statusBadge = existingCard.querySelector('.card-status');
                    if (statusBadge) {
                        const status = reservation.status || 'pending';
                        const statusClass = {
                            'pending': 'status-pending',
                            'confirmed': 'status-confirmed',
                            'cancelled': 'status-cancelled'
                        }[status] || 'status-pending';
                        const statusText = {
                            'pending': 'Ausstehend',
                            'confirmed': 'Bestätigt',
                            'cancelled': 'Storniert'
                        }[status] || 'Ausstehend';

                        statusBadge.className = `card-status ${statusClass}`;
                        statusBadge.textContent = statusText;
                    }
                }
            });

            // Add new reservations to the top
            if (reservationsToAdd.length > 0) {
                // Get current scroll position
                const scrollPos = reservationsList.scrollTop || window.scrollY || 0;

                // Use displayReservations to render new ones, then prepend
                const tempDiv = document.createElement('div');
                displayReservations(reservationsToAdd, tempDiv);

                if (reservationsList.children.length === 0 || reservationsList.querySelector('.empty-state')) {
                    reservationsList.innerHTML = tempDiv.innerHTML;
                } else {
                    reservationsList.insertAdjacentHTML('afterbegin', tempDiv.innerHTML);
                }

                // Restore scroll position (add offset for new items)
                setTimeout(() => {
                    const newCardsHeight = reservationsToAdd.length * 200; // Approximate height per card
                    reservationsList.scrollTop = scrollPos + newCardsHeight;
                }, 50);
            }
        }

        function renderReservationCard(reservation) {
            const status = reservation.status || 'pending';
            const statusText = {
                'pending': 'Ausstehend',
                'confirmed': 'Bestätigt',
                'cancelled': 'Storniert'
            }[status] || 'Ausstehend';

            const statusClass = {
                'pending': 'status-pending',
                'confirmed': 'status-confirmed',
                'cancelled': 'status-cancelled'
            }[status] || 'status-pending';

            let reservationDateTime = 'N/A';
            try {
                if (reservation.date && reservation.time) {
                    reservationDateTime = new Date(`${reservation.date}T${reservation.time} `).toLocaleString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else {
                    reservationDateTime = `${reservation.date || ''} ${reservation.time || ''} `.trim() || 'N/A';
                }
            } catch (e) {
                console.error('Error parsing reservation date:', e);
                reservationDateTime = `${reservation.date || ''} ${reservation.time || ''} `.trim() || 'N/A';
            }

            const reservationId = reservation.reservation_id || reservation.reservationId || 'N/A';
            const reservationIdShort = reservationId.toString().replace('RES-', '').slice(-8);
            const firstName = reservation.first_name || reservation.firstName || '';
            const lastName = reservation.last_name || reservation.lastName || '';
            const customerName = `${firstName} ${lastName} `.trim() || 'Kunde';
            const customerCode = reservation.customer_code || reservation.customerCode || '';
            const note = reservation.note || '';
            const guests = reservation.guests || 1;

            return `
                <div class="reservation-card ${status}" data-reservation-id="${reservationId}">
                    <div class="card-header">
                        <div class="reservation-id">📅 #${reservationIdShort}</div>
                        <span class="card-status status-${status}">${statusText}</span>
                    </div>
                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">👤 Khách:</span>
                            <span class="info-value"><strong>${customerName}</strong></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">⏰ Thời gian:</span>
                            <span class="info-value">${reservationDateTime}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📱 Điện thoại:</span>
                            <span class="info-value">${reservation.phone || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">👥 Số người:</span>
                            <span class="info-value"><strong>${guests} người</strong></span>
                        </div>
                        ${customerCode ? `
                        <div class="info-item">
                            <span class="info-label">🔑 Mã KH:</span>
                            <span class="info-value"><code style="background: rgba(229,207,142,.1); color: var(--gold); padding: 2px 6px; border-radius: 4px;">${customerCode}</code></span>
                        </div>
                        ` : ''}
                        ${note ? `
                        <div class="info-item" style="grid-column: span 2; margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,.1);">
                            <span class="info-label">📝 Ghi chú:</span>
                            <span class="info-value italic" style="color: rgba(255,255,255,.7); display: block; margin-top: 4px;">"${note}"</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="card-actions">
                        ${status === 'pending' ? `
                            <button class="btn-action btn-confirm" onclick="confirmReservation('${reservationId}')">✓ Xác nhận</button>
                            <button class="btn-action btn-cancel" onclick="cancelReservation('${reservationId}')">✗ Hủy</button>
                        ` : ''}
                    </div>
                </div>
                `;
        }

        // Display reservations function
        function displayReservations(reservations, targetElement = null) {
            const reservationsList = targetElement || document.getElementById('reservationsList');

            if (!reservations || reservations.length === 0) {
                reservationsList.innerHTML = `
                <div class="empty-state">
                        <div class="empty-state-icon">📅</div>
                        <h3 style="color: rgba(255,255,255,.8); margin: 16px 0 8px; font-size: 18px;">Chưa có lịch hẹn</h3>
                        <p style="color: rgba(255,255,255,.5);">Lịch hẹn mới sẽ xuất hiện ở đây</p>
                    </div>
                `;
                return;
            }

            // Sort reservations (newest date first)
            const sorted = [...reservations].sort((a, b) => {
                const dateA = a.date || '';
                const timeA = a.time || '';
                const dateB = b.date || '';
                const timeB = b.time || '';
                return (dateB + timeB).localeCompare(dateA + timeA);
            });

            let html = '';
            let lastDate = '';
            const today = getLocalDateStr(new Date());

            sorted.forEach(res => {
                const resDate = res.date || 'Unknown';

                if (resDate !== lastDate) {
                    const dateObj = new Date(resDate);
                    const formattedDate = isNaN(dateObj.getTime()) ? resDate : dateObj.toLocaleDateString('de-DE', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });

                    html += `
                <div class="date-group-header" style="
            grid-column: 1 / -1;
            padding: 12px 20px;
            margin: 20px 0 10px 0;
            background: rgba(229, 207, 142, 0.1);
            border-left: 4px solid var(--gold);
            color: var(--gold);
            font-weight: 700;
            font-size: 16px;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            ">
                <span>📅 ${formattedDate}</span>
                    ${resDate === today ? '<span style="font-size: 12px; background: var(--gold); color: #000; padding: 2px 8px; border-radius: 10px; font-weight: bold;">HEUTE</span>' : ''}
                            </div>
                `;
                    lastDate = resDate;
                }
                html += renderReservationCard(res);
            });

            reservationsList.innerHTML = html;
        }

        // Global variables for time scheduling
        let pendingOrderId = null;
        let pendingReservationId = null;
        let isOrderConfirmation = false;

        // Filter orders
        function filterOrders() {
            const searchTerm = document.getElementById('orderSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.order-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const matchesSearch = !searchTerm || text.includes(searchTerm);
                card.style.display = matchesSearch ? '' : 'none';
            });
        }

        // Filter orders by status
        function filterOrdersByStatus(status) {
            // Update active button
            const filterButtons = document.querySelectorAll('#ordersContent .filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                // Set active on button with matching data-status
                if (btn.getAttribute('data-status') === status) {
                    btn.classList.add('active');
                }
            });

            // Update mobile select if present
            const mobileSelect = document.querySelector('#ordersContent .mobile-status-filter');
            if (mobileSelect && mobileSelect.value !== status) {
                mobileSelect.value = status;
            }

            // Reload orders with new filter
            loadOrders(false); // Not silent, not preserving scroll
        }

        // Filter reservations
        function filterReservations() {
            const searchTerm = document.getElementById('reservationSearch')?.value.toLowerCase() || '';
            // Reservations use order-card class in displayReservations function
            const cards = document.querySelectorAll('#reservationsList .order-card, #reservationsList [data-reservation-id]');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const matchesSearch = !searchTerm || text.includes(searchTerm);
                card.style.display = matchesSearch ? '' : 'none';
            });
        }

        // Filter reservations by status
        function filterReservationsByStatus(status) {
            console.log('🔍 Filter reservations by status:', status);

            // Update active button in reservationsContent only
            const reservationsContent = document.getElementById('reservationsContent');
            if (!reservationsContent) {
                console.error('❌ reservationsContent not found!');
                return;
            }

            const filterButtons = reservationsContent.querySelectorAll('.filter-btn');
            console.log('Found filter buttons:', filterButtons.length);

            if (filterButtons.length === 0) {
                console.error('❌ No filter buttons found in reservationsContent!');
                return;
            }

            filterButtons.forEach(btn => {
                const btnStatus = btn.getAttribute('data-status');
                btn.classList.remove('active');
                // Set active on button with matching data-status
                if (btnStatus === status) {
                    btn.classList.add('active');
                    console.log('✅ Activated button with status:', status, btn);
                }
            });

            // Update mobile select if present
            const mobileSelect = reservationsContent.querySelector('.mobile-status-filter');
            if (mobileSelect && mobileSelect.value !== status) {
                mobileSelect.value = status;
            }

            // Verify active button
            const activeButton = reservationsContent.querySelector('.filter-btn.active[data-status]');
            console.log('Active button after update:', activeButton?.getAttribute('data-status'));

            // Reload reservations with new filter
            loadReservations(false); // Not silent, not preserving scroll
        }


        // Filter customers
        function filterCustomers() {
            const searchTerm = document.getElementById('customerSearch')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.customer-card');

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const email = card.getAttribute('data-customer-email')?.toLowerCase() || '';
                const phone = card.getAttribute('data-customer-phone')?.toLowerCase() || '';
                const customerCode = card.getAttribute('data-customer-code')?.toLowerCase() || '';
                const matchesSearch = !searchTerm || text.includes(searchTerm) || email.includes(searchTerm) || phone.includes(searchTerm) || customerCode.includes(searchTerm);
                card.style.display = matchesSearch ? '' : 'none';
            });
        }

        function applyDatePickerFilter() {
            loadOrders(false);
        }

        function clearDatePicker() {
            const dp = document.getElementById('datePicker');
            if (dp) dp.value = '';
            loadOrders(false);
        }

        function clearReservationDatePicker() {
            const dp = document.getElementById('reservationDatePicker');
            if (dp) dp.value = '';
            loadReservations(false);
        }

        // Show time schedule modal
        function showTimeScheduleModal(orderId, isOrder = true) {
            console.log('⏰ showTimeScheduleModal called:', { orderId, isOrder });

            // Store in global variables
            pendingOrderId = isOrder ? orderId : null;
            pendingReservationId = !isOrder ? orderId : null;
            isOrderConfirmation = isOrder;

            // Also store in modal data attributes as backup
            const modal = document.getElementById('timeScheduleModal');
            if (!modal) {
                console.error('❌ Time schedule modal not found!');
                alert('Fehler: Zeitplan-Modal nicht gefunden. Bitte Seite aktualisieren.');
                return;
            }

            modal.dataset.orderId = isOrder ? orderId : '';
            modal.dataset.reservationId = !isOrder ? orderId : '';
            modal.dataset.isOrder = isOrder ? 'true' : 'false';

            // Reset time inputs
            const hoursInput = document.getElementById('scheduleHours');
            const minutesInput = document.getElementById('scheduleMinutes');

            // Set default time based on order's service_type
            let defaultMinutes = 30;
            if (isOrder && orderId && allOrdersData) {
                const order = allOrdersData.find(o => o.order_id === orderId);
                if (order) {
                    const svcType = order.service_type || '';
                    defaultMinutes = (svcType === 'delivery') ? 60 : 20;
                }
            }
            if (hoursInput) hoursInput.value = Math.floor(defaultMinutes / 60).toString();
            if (minutesInput) minutesInput.value = (defaultMinutes % 60).toString();

            modal.classList.add('active');
            console.log('✅ Time schedule modal shown with data:', {
                pendingOrderId,
                pendingReservationId,
                isOrderConfirmation,
                modalData: {
                    orderId: modal.dataset.orderId,
                    reservationId: modal.dataset.reservationId,
                    isOrder: modal.dataset.isOrder
                }
            });
        }

        // Close time schedule modal
        function closeTimeScheduleModal() {
            const modal = document.getElementById('timeScheduleModal');
            if (modal) {
                modal.classList.remove('active');
            }
            pendingOrderId = null;
            pendingReservationId = null;
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeTimeScheduleModal();
            }
        });

        // Set quick time
        function setQuickTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            document.getElementById('scheduleHours').value = hours;
            document.getElementById('scheduleMinutes').value = mins;
        }

        // Confirm with scheduled time
        async function confirmWithScheduledTime() {
            console.log('⏰ confirmWithScheduledTime called');

            // Get IDs from modal data attributes (backup if global variables are lost)
            const modal = document.getElementById('timeScheduleModal');
            const modalOrderId = modal?.dataset.orderId || '';
            const modalReservationId = modal?.dataset.reservationId || '';
            const modalIsOrder = modal?.dataset.isOrder === 'true';

            // Use global variables first, fallback to modal data
            const orderId = pendingOrderId || modalOrderId;
            const reservationId = pendingReservationId || modalReservationId;
            const isOrder = isOrderConfirmation !== undefined ? isOrderConfirmation : modalIsOrder;

            console.log('📋 IDs from variables:', { pendingOrderId, pendingReservationId, isOrderConfirmation });
            console.log('📋 IDs from modal:', { modalOrderId, modalReservationId, modalIsOrder });
            console.log('📋 Final IDs:', { orderId, reservationId, isOrder });

            const hours = parseInt(document.getElementById('scheduleHours')?.value) || 0;
            const minutes = parseInt(document.getElementById('scheduleMinutes')?.value) || 0;

            if (hours === 0 && minutes === 0) {
                alert('Bitte geben Sie die geplante Zeit ein (mindestens 1 Minute)');
                return;
            }

            const totalMinutes = hours * 60 + minutes;
            const estimatedTime = new Date();
            estimatedTime.setMinutes(estimatedTime.getMinutes() + totalMinutes);
            const estimatedTimeText = estimatedTime.toLocaleString('de-DE', {
                hour: '2-digit',
                minute: '2-digit'
            });

            console.log('📅 Scheduled time:', { hours, minutes, totalMinutes, estimatedTimeText });

            // Close modal first (but keep IDs)
            if (modal) {
                modal.classList.remove('active');
            }

            // Confirm based on type
            if (isOrder && orderId) {
                console.log('✅ Confirming order:', orderId);
                await confirmOrderWithTime(orderId, estimatedTimeText, totalMinutes);
            } else if (!isOrder && reservationId) {
                // Reservations don't need time scheduling - use customer's selected time
                console.log('⚠️ Reservation confirmation should not use time modal. Use confirmReservation() directly.');
                alert('Reservierungen verwenden die vom Kunden gewählte Zeit. Bitte verwenden Sie die Bestätigung direkt.');
                return;
            } else {
                console.error('❌ No pending order or reservation ID found!');
                console.error('Debug info:', {
                    isOrder,
                    orderId,
                    reservationId,
                    pendingOrderId,
                    pendingReservationId,
                    isOrderConfirmation,
                    modalData: modal?.dataset
                });
                alert('Fehler: Keine Bestellung oder Reservierung zum Bestätigen gefunden. Bitte versuchen Sie es erneut.');
                return;
            }

            // Clear variables after successful confirmation
            pendingOrderId = null;
            pendingReservationId = null;
            if (modal) {
                modal.dataset.orderId = '';
                modal.dataset.reservationId = '';
                modal.dataset.isOrder = '';
            }
        }

        // Confirm order
        async function confirmOrder(orderId) {
            try {
            console.log('🔔 confirmOrder called with orderId:', orderId);
            if (!orderId) {
                console.error('❌ No orderId provided to confirmOrder');
                alert('Fehler: Bestell-ID nicht gefunden');
                return;
            }

            // Check if order is a dinein/reservation order
            let order = null;
            if (typeof allOrdersData !== 'undefined' && allOrdersData) {
                order = allOrdersData.find(o => o.order_id === orderId);
            }

            if (order) {
                const type = (order.service_type || '').toLowerCase();
                // If it's a reservation or dine-in, bypass time schedule modal
                if (type === 'reservation' || type === 'dinein' || type === 'table') {
                    console.log('🚀 Bypassing time modal for dine-in/reservation order');
                    confirmOrderWithTime(orderId, 'Sofort', 0);
                    return;
                }

                // Check scheduled delivery time
                let summary = order.summary;
                if (typeof summary === 'string') {
                    try { summary = JSON.parse(summary); } catch (e) { summary = {}; }
                } else { summary = summary || {}; }

                let address = order.delivery_address;
                if (typeof address === 'string') {
                    try { address = JSON.parse(address); } catch (e) { address = {}; }
                } else { address = address || {}; }

                const scheduledTime = address.scheduled_time || order.scheduled_delivery_time || summary.scheduled_delivery_time;
                if (scheduledTime && scheduledTime.time) {
                    const schedTime = scheduledTime.time;
                    const schedDate = scheduledTime.date || 'Heute';
                    console.log('🚀 Bypassing time modal for scheduled order:', schedTime);

                    // Use custom in-page modal instead of window.confirm() (Android WebView blocks native dialogs)
                    showScheduledConfirmModal(orderId, schedTime, schedDate);
                    return;
                }
            }

            showTimeScheduleModal(orderId, true);
            } catch(err) {
                alert('❌ Lỗi khi duyệt đơn: ' + err.message + '\n\nVui lòng reload trang và thử lại.');
                window.isConfirmingOrder = false;
                window.__loadOrdersRunning = false;
            }
        }

        // Confirm order with scheduled time
        async function confirmOrderWithTime(orderId, estimatedTimeText, totalMinutes) {
            console.log('🔄 confirmOrderWithTime called:', { orderId, estimatedTimeText, totalMinutes });

            if (isConfirmingOrder) {
                console.warn('⚠️ Already confirming, resetting flag and retrying...');
                isConfirmingOrder = false;
                return;
            }
            if (!orderId) {
                alert('Lỗi: Không tìm thấy mã đơn!');
                return;
            }

            isConfirmingOrder = true;
            const quickButtons = document.querySelectorAll('.quick-time-btn, .btn-schedule, .btn-cancel-schedule');
            quickButtons.forEach(btn => btn.disabled = true);

            try {
                isConfirmingOrder = true; // Redundant but safe — always inside try now
                // ── Step 1: Get order details ──
                let order = null;
                try {
                    const res = await fetch(`api/index.php?route=v1/data/orders/get&order_id=${orderId}`, {
                        credentials: 'include',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('leo_admin_session_token')}` }
                    });
                    const d = await res.json();
                    if (d.success && d.order) order = d.order;
                } catch (e) {
                    console.warn('⚠️ Could not fetch order from API, using cache:', e.message);
                }
                if (!order && allOrdersData) {
                    order = allOrdersData.find(o => o.order_id === orderId) || null;
                }
                if (!order) {
                    alert('Không tìm thấy đơn hàng: ' + orderId);
                    return;
                }

                // ── Step 2: Update status via API ──
                const currentStatus = order.status || 'pending';
                let result;
                try {
                    if (window.api && window.api.orders && window.api.orders.updateStatus) {
                        result = await window.api.orders.updateStatus(orderId, 'confirmed', {
                            eta: estimatedTimeText,
                            old_status: currentStatus,
                            total_minutes: totalMinutes
                        });
                    } else {
                        const res = await fetch('api/index.php?route=v1/data/orders/update-status', {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('leo_admin_session_token')}`
                            },
                            body: JSON.stringify({
                                order_id: orderId,
                                status: 'confirmed',
                                old_status: currentStatus,
                                eta: estimatedTimeText,
                                total_minutes: totalMinutes
                            })
                        });
                        result = await res.json();
                    }
                } catch (e) {
                    alert('❌ Lỗi kết nối khi duyệt đơn: ' + e.message);
                    return;
                }

                if (!result || !result.success) {
                    alert('❌ Duyệt đơn thất bại: ' + (result?.message || 'Lỗi không xác định'));
                    return;
                }

                console.log('✅ Order status updated successfully');

                // ── Step 3: Optimistic UI update ──
                if (allOrdersData) {
                    const idx = allOrdersData.findIndex(o => o.order_id === orderId);
                    if (idx !== -1) {
                        allOrdersData[idx].status = 'confirmed';
                        let summary = allOrdersData[idx].summary || {};
                        if (typeof summary === 'string') {
                            try { summary = JSON.parse(summary); } catch (e) { summary = {}; }
                        }
                        summary.confirmed_at = new Date().toISOString();
                        summary.total_minutes = totalMinutes;
                        allOrdersData[idx].summary = summary;
                    }
                }
                
                // Optimistically check alarm
                stopAlarm();
                    checkPendingOrdersAndAlarm(allOrdersData);

                // ── Step 4: Print bill ──
                try {
                    let printedIds = [];
                    try { printedIds = JSON.parse(localStorage.getItem('leo_printed_orders') || '[]'); } catch (e) { }
                    const printedSet = new Set(printedIds.map(id => id.toString()));
                    if (!printedSet.has(orderId.toString())) {
                        let deliveryAddress = order.delivery?.address || order.delivery_address || {};
                        if (typeof deliveryAddress === 'string') {
                            try { deliveryAddress = JSON.parse(deliveryAddress); } catch (e) { deliveryAddress = {}; }
                        }
                        if (typeof printOrderBill === 'function') {
                            await printOrderBill(orderId, estimatedTimeText);
                        } else if (typeof window.showPrintBills === 'function') {
                            window.showPrintBills(order, deliveryAddress, orderId, estimatedTimeText);
                        }
                        printedSet.add(orderId.toString());
                        localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
                        fetch(`api/index.php?route=${encodeURIComponent('v1/data/orders/update-printed')}`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('leo_admin_session_token')}` },
                            body: JSON.stringify({ order_id: orderId })
                        }).catch(() => {});
                    }
                } catch (e) {
                    console.warn('⚠️ Print error (non-critical):', e.message);
                }

                // ── Step 5: Show success & reload ──
                if (typeof showAdminSuccessNotification === 'function') {
                    showAdminSuccessNotification(order, orderId);
                } else if (typeof showMenuNotification === 'function') {
                    showMenuNotification(`✅ Đã duyệt đơn ${orderId}`, 'success');
                }
                
                // Optimistic DOM Update for instant feedback
                const card = document.querySelector(`.order-card[data-order-id="${orderId}"]`);
                if (card) {
                    const badge = card.querySelector('.card-status');
                    if (badge) {
                        badge.className = 'card-status status-confirmed';
                        badge.innerHTML = 'Bestätigt';
                    }
                    const actions = card.querySelector('.order-actions');
                    if (actions) actions.style.display = 'none';
                    const timeContainer = card.querySelector('.timer-container');
                    if (timeContainer) {
                        timeContainer.innerHTML = `<div class="d-flex align-items-center gap-2" style="background: rgba(0, 210, 255, 0.1); padding: 8px 15px; border-radius: 12px; border: 1px solid rgba(0, 210, 255, 0.2);"><div class="spinner-grow spinner-grow-sm text-info" style="width: 1rem; height: 1rem;"></div><span style="color: #00d2ff; font-weight: 700; font-size: 14px;">Đang chuẩn bị...</span></div>`;
                    }
                }
                setTimeout(() => { window.__loadOrdersRunning = false; if (typeof loadOrders === 'function') loadOrders(true, true); }, 1500);

            } finally {
                isConfirmingOrder = false;
                window.__loadOrdersRunning = false; // Ensure loadOrders can run after confirm
                quickButtons.forEach(btn => btn.disabled = false);
            }
        }

        // Cancel order
        async function cancelOrder(orderId) {
            if (!confirm('Möchten Sie diese Bestellung wirklich stornieren?')) return;

            // Optional: Ask for reason
            // const reason = prompt('Grund für die Stornierung (optional):', '');
            const reason = 'Admin storniert';

            // Update order status via API
            try {
                // 1. Find order in local data for optimistic update
                const orderIndex = allOrdersData.findIndex(o => o.order_id === orderId || o.id === orderId);
                let currentStatus = 'pending';
                if (orderIndex !== -1) {
                    currentStatus = allOrdersData[orderIndex].status || 'pending';
                } else {
                    console.warn('Order not found locally:', orderId);
                }

                // 2. Call API
                if (window.api && window.api.orders && window.api.orders.updateStatus) {
                    const result = await window.api.orders.updateStatus(orderId, 'cancelled', { reason: reason, old_status: currentStatus });

                    if (!result.success) {
                        throw new Error(result.message || 'Fehler beim Stornieren der Bestellung.');
                    }

                    console.log(`Order ${orderId} status updated to 'cancelled' via API.`);

                    // 3. Optimistic UI Update
                    if (orderIndex !== -1) {
                        allOrdersData[orderIndex].status = 'cancelled';
                        // Optimistically check alarm
                        stopAlarm();
                    checkPendingOrdersAndAlarm(allOrdersData);
                        // Refresh view
                        loadOrders(true);
                    } else {
                        // If not found locally, reload all
                        loadOrders(false, true);
                    }

                    // Show success notification
                    // alert(`✅ Bestellung ${ orderId } wurde erfolgreich storniert.`);
                    if (typeof showMenuNotification === 'function') {
                        showMenuNotification(`✅ Bestellung ${orderId} storniert & E - Mail gesendet.`, 'success');
                    } else {
                        alert(`✅ Bestellung ${orderId} wurde erfolgreich storniert.`);
                    }

                } else {
                    // Fallback (should not happen with api.js loaded)
                    throw new Error('API Client nicht geladen. Bitte Seite neu laden.');
                }

            } catch (error) {
                console.error(`Failed to cancel order ${orderId}: `, error);
                alert(`Fehler beim Stornieren der Bestellung ${orderId}: \n${error.message || error} `);
                // Attempt to reload orders to refresh the list in case of partial state
                loadOrders(false, true);
            }
        }
        // Confirm reservation (using customer's selected time)
        async function confirmReservation(reservationId) {
            // Get reservation from API
            let reservation = null;
            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/reservations/get')}&reservation_id=${reservationId}`);
                const data = await response.json();
                if (data.success && data.reservation) {
                    reservation = data.reservation;
                }
            } catch (error) {
                console.error('Failed to get reservation from API:', error);
                alert('Reservierung nicht gefunden!');
                return;
            }

            if (!reservation) {
                alert('Reservierung nicht gefunden!');
                return;
            }

            // Format the customer's selected time
            const customerTime = reservation.time || '';
            const customerDate = reservation.date || '';
            let formattedTime = '';

            if (customerTime) {
                // Format time from "HH:MM:SS" or "HH:MM" to "HH:MM Uhr"
                const timeParts = customerTime.split(':');
                if (timeParts.length >= 2) {
                    formattedTime = `${timeParts[0]}:${timeParts[1]} Uhr`;
                } else {
                    formattedTime = customerTime;
                }
            }

            // Update reservation status via API
            try {
                const response = await fetch('api/index.php?route=v1/data/reservations/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        status: 'confirmed'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Reservation confirmed:', reservationId);
                } else {
                    throw new Error(data.message || 'Fehler beim Bestätigen');
                }
            } catch (error) {
                console.error('Failed to update reservation:', error);
                alert('Fehler beim Bestätigen der Reservierung. Bitte versuchen Sie es erneut.');
                return;
            }

            // Map API snake_case fields to camelCase for email function
            const reservationForEmail = {
                reservationId: reservation.reservation_id || reservation.reservationId || reservationId,
                firstName: reservation.first_name || reservation.firstName || '',
                lastName: reservation.last_name || reservation.lastName || '',
                email: reservation.email || '',
                phone: reservation.phone || '',
                date: reservation.date || '',
                time: reservation.time || '',
                guests: reservation.guests || 1,
                tableNumber: reservation.table_number || reservation.tableNumber || '',
                note: reservation.note || '',
                timestamp: reservation.created_at || reservation.createdAt || reservation.timestamp || new Date().toISOString(),
                status: 'confirmed'
            };

            // Send confirmation email to customer with their selected time
            if (reservationForEmail.email) {
                if (typeof sendReservationConfirmationEmail === 'function') {
                    console.log('📧 Sending reservation confirmation email to:', reservationForEmail.email);
                    sendReservationConfirmationEmail(reservationForEmail, formattedTime);
                } else {
                    // Fallback: send email directly via EmailJS if the function is not available
                    console.log('📧 Fallback: Sending reservation email directly via EmailJS...');
                    try {
                        if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
                            const customerName = `${reservationForEmail.firstName} ${reservationForEmail.lastName}`.trim() || 'Kunde';
                            const reservationDateTime = new Date(`${reservationForEmail.date}T${reservationForEmail.time}`).toLocaleString('de-DE', {
                                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                            const templateParams = {
                                to_email: reservationForEmail.email.trim(),
                                reply_to: EMAILJS_CONFIG.OWNER_EMAIL,
                                customer_name: customerName,
                                customer_phone: reservationForEmail.phone,
                                customer_email: reservationForEmail.email.trim(),
                                reservation_id: reservationForEmail.reservationId,
                                reservation_datetime: reservationDateTime,
                                reservation_date: reservationForEmail.date,
                                reservation_time_slot: reservationForEmail.time,
                                guests: reservationForEmail.guests,
                                table_number: reservationForEmail.tableNumber || null,
                                table_number_display: reservationForEmail.tableNumber || 'Wird bei Ankunft zugewiesen',
                                note: reservationForEmail.note || '',
                                restaurant_name: 'LEO SUSHI',
                                restaurant_address: 'Florastraße 10A, 13187 Berlin',
                                restaurant_phone: '03071055810',
                                restaurant_email: EMAILJS_CONFIG.OWNER_EMAIL
                            };
                            emailjs.send(
                                EMAILJS_CONFIG.SERVICE_ID,
                                EMAILJS_CONFIG.RESERVATION_TEMPLATE_ID || EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID,
                                templateParams
                            ).then(() => {
                                console.log('✅ Reservation confirmation email sent (fallback)');
                            }).catch(err => {
                                console.error('❌ Failed to send reservation email (fallback):', err);
                            });
                        }
                    } catch (emailError) {
                        console.error('❌ Email fallback error:', emailError);
                    }
                }
            } else {
                console.warn('⚠️ No customer email found for reservation, skipping email.');
            }

            // Show beautiful success notification (same style as order confirmation)
            showAdminReservationSuccessNotification(reservation, reservationId, formattedTime);

            // Only refresh reservations list, don't reload entire page
            await loadReservations();
        }

        // Cancel reservation
        async function cancelReservation(reservationId) {
            if (!confirm('Möchten Sie diese Reservierung wirklich stornieren?')) return;

            // 1. Get reservation details first (for email)
            let reservation = null;
            try {
                const resResponse = await fetch(`api/index.php?route=${encodeURIComponent('v1/data/reservations/get')}&reservation_id=${reservationId}`);
                const resData = await resResponse.json();
                if (resData.success && resData.reservation) {
                    reservation = resData.reservation;
                }
            } catch (error) {
                console.warn('Could not fetch reservation details for email:', error);
            }

            // 2. Update reservation status via API
            try {
                const response = await fetch('api/index.php?route=v1/data/reservations/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        status: 'cancelled'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Reservation cancelled:', reservationId);

                    // 3. Send cancellation email to customer
                    if (reservation && reservation.email) {
                        try {
                            if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
                                const customerName = `${reservation.first_name || reservation.firstName || ''} ${reservation.last_name || reservation.lastName || ''}`.trim() || 'Kunde';
                                const customerTime = reservation.time || '';
                                let formattedTime = '';
                                if (customerTime) {
                                    const timeParts = customerTime.split(':');
                                    if (timeParts.length >= 2) {
                                        formattedTime = `${timeParts[0]}:${timeParts[1]} Uhr`;
                                    } else {
                                        formattedTime = customerTime;
                                    }
                                }

                                let reservationDateTime = '';
                                try {
                                    reservationDateTime = new Date(`${reservation.date}T${reservation.time}`).toLocaleString('de-DE', {
                                        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    });
                                } catch (e) {
                                    reservationDateTime = `${reservation.date || ''} ${reservation.time || ''}`;
                                }

                                const templateParams = {
                                    to_email: reservation.email.trim(),
                                    reply_to: EMAILJS_CONFIG.OWNER_EMAIL,
                                    customer_name: customerName,
                                    customer_phone: reservation.phone || '',
                                    customer_email: reservation.email.trim(),
                                    reservation_id: reservationId,
                                    reservation_datetime: reservationDateTime,
                                    reservation_date: reservation.date || '',
                                    reservation_time: reservation.time || '',
                                    reservation_time_slot: formattedTime,
                                    guests: reservation.guests || 1,
                                    table_number: reservation.table_number || reservation.tableNumber || '',
                                    table_number_display: reservation.table_number || reservation.tableNumber || 'N/A',
                                    note: reservation.note || '',
                                    note_display: '',
                                    estimated_time_display: `<div class="order-info" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left-color: #ef4444; margin-top: 20px;"><h3>❌ Reservierung konnte nicht bestätigt werden</h3><p style="font-size: 16px; font-weight: 600; color: #dc2626; margin: 10px 0;">Leider ist unser Restaurant zu diesem Zeitpunkt voll ausgebucht. Wir bitten Sie, eine andere Uhrzeit oder einen anderen Tag zu wählen.</p><p style="font-size: 14px; color: #7f1d1d; margin-top: 12px;">Wir freuen uns, Sie zu einem anderen Termin begrüßen zu dürfen!</p><p style="font-size: 15px; font-weight: 700; color: #7f1d1d; margin-top: 12px;">📞 Tel: 03071055810</p></div>`,
                                    restaurant_name: 'LEO SUSHI',
                                    restaurant_address: 'Florastraße 10A, 13187 Berlin',
                                    restaurant_phone: '03071055810',
                                    restaurant_email: EMAILJS_CONFIG.OWNER_EMAIL
                                };

                                emailjs.send(
                                    EMAILJS_CONFIG.SERVICE_ID,
                                    EMAILJS_CONFIG.RESERVATION_TEMPLATE_ID || EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID,
                                    templateParams
                                ).then(() => {
                                    console.log('✅ Reservation cancellation email sent to:', reservation.email);
                                }).catch(err => {
                                    console.error('❌ Failed to send cancellation email:', err);
                                });
                            }
                        } catch (emailError) {
                            console.error('❌ Email error:', emailError);
                        }
                    } else {
                        console.warn('⚠️ No customer email found, skipping cancellation email.');
                    }

                    alert('Reservierung storniert! E-Mail wurde an den Kunden gesendet.');
                    await loadReservations();
                } else {
                    throw new Error(data.message || 'Fehler beim Stornieren');
                }
            } catch (error) {
                console.error('Failed to cancel reservation:', error);
                alert('Fehler beim Stornieren der Reservierung. Bitte versuchen Sie es erneut.');
            }
        }

        // Assign table to order
        async function assignTable(orderId) {
            const tableNumber = prompt('Tischnummer eingeben (1-16):');
            if (!tableNumber) return;

            const tableNum = parseInt(tableNumber);
            if (isNaN(tableNum) || tableNum < 1 || tableNum > 16) {
                alert('Ungültige Tischnummer. Bitte geben Sie eine Zahl von 1 bis 16 ein.');
                return;
            }

            // Update order table number via API
            try {
                const response = await fetch('api/index.php?route=v1/data/orders/update-status', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_id: orderId,
                        table_id: tableNum
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Table assigned:', orderId, 'Table:', tableNum);
                    alert(`Tisch ${tableNum} wurde für Bestellung #${orderId.slice(-8)} zugewiesen`);
                    await loadOrders(true); // Silent mode
                } else {
                    throw new Error(data.message || 'Fehler beim Zuweisen');
                }
            } catch (error) {
                console.error('Failed to assign table:', error);
                alert('Fehler beim Zuweisen des Tisches. Bitte versuchen Sie es erneut.');
            }
        }

        // Make assignTable globally available
        window.assignTable = assignTable;

        // Assign table to reservation
        async function assignTableToReservation(reservationId) {
            const tableNumber = prompt('Tischnummer eingeben (1-16):');
            if (!tableNumber) return;

            const tableNum = parseInt(tableNumber);
            if (isNaN(tableNum) || tableNum < 1 || tableNum > 16) {
                alert('Ungültige Tischnummer. Bitte geben Sie eine Zahl von 1 bis 16 ein.');
                return;
            }

            // Update reservation table number via API
            try {
                const response = await fetch('api/index.php?route=v1/data/reservations/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        table_number: tableNum
                    })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('✅ Table assigned to reservation:', reservationId, 'Table:', tableNum);
                    alert(`Tisch ${tableNum} wurde für Reservierung #${reservationId.toString().replace('RES-', '').slice(-8)} zugewiesen`);
                    await loadReservations(); // Reload reservations
                } else {
                    throw new Error(data.message || 'Fehler beim Zuweisen');
                }
            } catch (error) {
                console.error('Failed to assign table to reservation:', error);
                alert('Fehler beim Zuweisen des Tisches. Bitte versuchen Sie es erneut.');
            }
        }

        // Make assignTableToReservation globally available
        window.assignTableToReservation = assignTableToReservation;

        // Export all data (orders and reservations) to JSON file
        async function exportAllData() {
            const today = getLocalDateStr(new Date());

            // Use already loaded MySQL data
            const allOrders = allOrdersData || [];
            const allReservations = allReservationsData || [];

            // Filter today's orders (use local timezone)
            const todayOrders = allOrders.filter(o => {
                const orderDate = getOrderDate(o);
                return orderDate === today;
            });

            // Combine all data
            const exportData = {
                export_date: new Date().toISOString(),
                orders: {
                    today: todayOrders,
                    all: allOrders
                },
                reservations: {
                    all: allReservations
                },
                statistics: {
                    total_orders: allOrders.length,
                    total_reservations: allReservations.length,
                    today_orders: todayOrders.length
                }
            };

            // Create and download JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leo_sushi_data_${today}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('Daten wurden erfolgreich exportiert!');
        }

        window.exportAllData = exportAllData;

        // View order details
        async function viewOrderDetails(orderId) {
            // First try to find order from loaded MySQL data (PRIMARY SOURCE)
            let order = null;
            if (window.allOrdersData && window.allOrdersData.length > 0) {
                order = window.allOrdersData.find(o =>
                    (o.order_id || o._id || '').toString() === orderId.toString()
                );
            }

            if (!order) {
                // Try to fetch from API if not found locally
                try {
                    let response;
                    if (window.api && window.api.orders && window.api.orders.get) {
                        response = await window.api.orders.get(orderId);
                    } else {
                        const res = await fetch(`api/index.php?route=v1/data/orders/get&order_id=${orderId}`);
                        response = await res.json();
                    }

                    if (response && response.success && response.order) {
                        order = response.order;
                    } else {
                        throw new Error('Order not found in API response');
                    }
                } catch (e) {
                    console.error('Error fetching order details:', e);
                    alert('Bestellung nicht gefunden!');
                    return;
                }
            }

            // Parse delivery_address if it's a JSON string
            let address = {};
            if (order.delivery_address) {
                if (typeof order.delivery_address === 'string') {
                    try { address = JSON.parse(order.delivery_address); } catch (e) { }
                } else { address = order.delivery_address; }
            } else if (order.delivery?.address) {
                address = order.delivery.address;
            }

            // Parse summary if it's a JSON string
            let summary = {};
            if (order.summary) {
                if (typeof order.summary === 'string') {
                    try { summary = JSON.parse(order.summary) || {}; } catch (e) { }
                } else { summary = order.summary || {}; }
            }
            if (!summary) summary = {};

            // Parse items
            let items = order.items || [];
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { items = []; }
            }

            const orderIdShort = orderId.toString().replace(/^(ORD-|LEO-)/, '').slice(-8);
            const customerName = `${address.firstName || address.first_name || ''} ${address.lastName || address.last_name || ''} `.trim() || 'Kunde';
            const phone = address.phone || 'N/A';
            const email = address.email || 'N/A';
            const street = address.street || '';
            const postal = address.postal || '';
            const city = address.city || '';
            const note = address.note || summary.note || '';
            const serviceType = order.service_type === 'pickup' ? '🥡 Abholung' : order.service_type === 'delivery' ? '🛵 Lieferung' : '🍽️ Reservierung';
            const pmStr = (order.payment_method || summary.payment_method || '').toLowerCase();
            const payMethod = pmStr.includes('cash') || pmStr.includes('tiền mặt') || pmStr.includes('bar') ? 'Barzahlung' : pmStr.includes('paypal') ? 'PayPal' : (pmStr.includes('card') || pmStr.includes('karte') || pmStr.includes('thẻ') ? 'Kartenzahlung' : 'Barzahlung');
            const status = order.status || 'pending';
            const statusText = { 'pending': 'Ausstehend', 'confirmed': 'Bestätigt', 'cancelled': 'Storniert', 'completed': 'Abgeschlossen' }[status] || 'Ausstehend';

            let orderTime = 'Unbekannt';
            if (order.created_at) {
                orderTime = new Date(order.created_at).toLocaleString('de-DE');
            } else if (summary.timestamp) {
                orderTime = new Date(summary.timestamp).toLocaleString('de-DE');
            } else if (order.createdAt) {
                if (order.createdAt.seconds) orderTime = new Date(order.createdAt.seconds * 1000).toLocaleString('de-DE');
                else orderTime = new Date(order.createdAt).toLocaleString('de-DE');
            }

            const scheduledTime = address.scheduled_time || order.scheduled_delivery_time || summary.scheduled_delivery_time;

            const itemsHTML = items.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <span>${item.qty || item.quantity || 1}x ${item.name || 'N/A'}${item.note ? ` <em style="color: #fbbf24;">(${item.note})</em>` : ''}</span>
                        <span style="color: var(--gold); font-weight: 600;">€${item.total || (parseFloat(item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}</span>
                    </div>
                `).join('');

            // Create modal
            const existingModal = document.getElementById('orderDetailModal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'orderDetailModal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
            modal.innerHTML = `
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; padding: 28px; border: 1px solid rgba(229,207,142,0.2); box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                            <h3 style="color: var(--gold, #e5cf8e); margin:0; font-size: 20px;">📦 Bestellung #${orderIdShort}</h3>
                            <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
                                background: ${status === 'confirmed' ? 'rgba(16,185,129,0.15)' : status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)'};
                                color: ${status === 'confirmed' ? '#10b981' : status === 'cancelled' ? '#ef4444' : '#fbbf24'};
                                border: 1px solid ${status === 'confirmed' ? 'rgba(16,185,129,0.3)' : status === 'cancelled' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'};
                            ">${statusText}</span>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">⏰ Zeit</span><div style="color:#fff;margin-top:4px;">${orderTime}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">🚚 Service</span><div style="color:#fff;margin-top:4px;">${serviceType}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">👤 Kunde</span><div style="color:#fff;margin-top:4px;">${customerName}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">📱 Telefon</span><div style="color:#fff;margin-top:4px;">${phone}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">📧 E-Mail</span><div style="color:#fff;margin-top:4px;word-break:break-all;">${email}</div></div>
                            <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">💳 Zahlung</span><div style="color:#fff;margin-top:4px;">${payMethod}</div></div>
                        </div>
                        ${street ? `<div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;margin-bottom:12px;"><span style="color:rgba(255,255,255,0.5);font-size:12px;">📍 Adresse</span><div style="color:#fff;margin-top:4px;">${street}, ${postal} ${city}</div></div>` : ''}
                        ${order.service_type === 'delivery' ? `
                            <div id="adminOrderMap" style="height: 250px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(229,207,142,0.2); overflow: hidden;"></div>
        ` : ''
                }
        ${scheduledTime ? `<div
            style="background:rgba(251,191,36,0.1);padding:10px;border-radius:8px;margin-bottom:12px;border-left:3px solid #fbbf24;">
            <span style="color:#fbbf24;font-size:12px;">⏰ Gewünschte Lieferzeit</span>
            <div style="color:#fbbf24;margin-top:4px;font-weight:600;">${scheduledTime.date || ''} ${scheduledTime.time
                    || ''}</div>
        </div>` : ''
                }
        <div style="margin-bottom:16px;">
            <h4 style="color:rgba(255,255,255,0.8);margin:0 0 8px;">🍣 Artikel</h4>
            ${itemsHTML || '<div style="color:rgba(255,255,255,0.4);">Keine Artikel</div>'}
        </div>
        <div
            style="background:rgba(229,207,142,0.1);padding:14px;border-radius:10px;margin-bottom:16px;border:1px solid rgba(229,207,142,0.15);">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Zwischensumme</span><span
                    style="color:#fff;">€${parseFloat(summary.subtotal || 0).toFixed(2)}</span></div>
            ${parseFloat(summary.delivery_fee || 0) > 0 ? `<div
                style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Liefergebühr</span><span
                    style="color:#fff;">€${parseFloat(summary.delivery_fee).toFixed(2)}</span></div>` : ''}
            ${parseFloat(summary.tip || 0) > 0 ? `<div
                style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Trinkgeld</span><span
                    style="color:#fff;">€${parseFloat(summary.tip).toFixed(2)}</span></div>` : ''}
            ${parseFloat(summary.discount || 0) > 0 ? `<div
                style="display:flex;justify-content:space-between;margin-bottom:6px;"><span
                    style="color:rgba(255,255,255,0.6);">Rabatt</span><span
                    style="color:#10b981;">-€${parseFloat(summary.discount).toFixed(2)}</span></div>` : ''}
            <div
                style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid rgba(229,207,142,0.2);">
                <span style="color:var(--gold, #e5cf8e);font-weight:700;font-size:18px;">Gesamt</span>
                <span style="color:var(--gold, #e5cf8e);font-weight:700;font-size:18px;">€${parseFloat(summary.total ||
                    0).toFixed(2)}</span>
            </div>
        </div>
        ${note ? `<div
            style="background:rgba(251,191,36,0.1);padding:10px;border-radius:8px;margin-bottom:16px;border-left:3px solid #fbbf24;">
            <strong style="color:#fbbf24;">📝 Hinweis:</strong>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;">${note}</p>
        </div>` : ''
                }

            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <button onclick="document.getElementById('orderDetailModal').remove(); printOrderBill('${orderId}')"
                    style="flex:1;padding:12px;border-radius:8px;border:1px solid rgba(59,130,246,0.3);background:rgba(59,130,246,0.2);color:#60a5fa;cursor:pointer;font-size:15px;font-weight:700;transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(59,130,246,0.35)'"
                    onmouseout="this.style.background='rgba(59,130,246,0.2)'">&nbsp;🖨️ In Bill</button>
                <button onclick="document.getElementById('orderDetailModal').remove()"
                    style="flex:1;padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);color:#fff;cursor:pointer;font-size:14px;transition:all 0.2s;"
                    onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.05)'">Schließen</button>
            </div>
    </div>
                `;
            document.body.appendChild(modal);

            // Initialize Map if delivery
            if (order.service_type === 'delivery') {
                setTimeout(() => {
                    if (window.initOrderTrackingMap) {
                        window.initOrderTrackingMap('adminOrderMap', order);
                        if (status === 'in_delivery' && window.startOrderTracking) {
                            window.startOrderTracking(orderId);
                        }
                    }
                }, 500);
            }
        }


        // Send order confirmation email (admin action)
        function sendOrderConfirmationEmail(order) {
            if (typeof emailjs === 'undefined' || !EMAILJS_CONFIG) return;

            const templateParams = {
                to_email: order.delivery?.address?.email,
                customer_name: `${order.delivery?.address?.firstName || ''} ${order.delivery?.address?.lastName || ''} `.trim() ||
                    'Liebe/r Kunde/in',
                order_id: order.order_id || order.summary?.timestamp || 'N/A',
                order_time: order.summary?.timestamp ? new Date(order.summary.timestamp).toLocaleString('de-DE') : 'Unbekannt',
                items: order.items?.map(item => `${item.quantity}x ${item.name} - €${item.total} `).join('\n') || 'Keine',
                total: `€${order.summary?.total || '0.00'} `,
                restaurant_name: 'LEO SUSHI',
                restaurant_address: 'Florastraße 10A, 13187 Berlin',
                restaurant_phone: '+49 30 37476736'
            };

            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            ).then(() => {
                console.log('Order confirmation email sent');
            }).catch(error => {
                console.error('Failed to send order confirmation email:', error);
            });
        }

        // Show beautiful admin success notification
        // Custom in-page confirmation modal for scheduled orders
        // Replaces window.confirm() which is blocked on Android WebView
        function showScheduledConfirmModal(orderId, schedTime, schedDate) {
            // Remove any existing modal
            const existing = document.getElementById('scheduledConfirmModal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'scheduledConfirmModal';
            modal.style.cssText = `
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(0,0,0,0.75);
                display: flex; align-items: center; justify-content: center;
                padding: 20px;
            `;
            modal.innerHTML = `
                <div style="background: #1a1a1a; border: 1px solid rgba(212,175,55,0.4); border-radius: 20px; padding: 28px 24px; max-width: 340px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6);">
                    <div style="font-size: 36px; margin-bottom: 12px;">⏰</div>
                    <h3 style="color: #d4af37; font-size: 17px; font-weight: 700; margin: 0 0 10px;">Đơn hẹn giờ</h3>
                    <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 20px; line-height: 1.6;">
                        Khách hẹn giao lúc <b style="color:#fff;">${schedTime}</b><br>
                        <span style="font-size:12px; opacity:0.6;">${schedDate}</span><br><br>
                        Duyệt đơn với giờ hẹn của khách?
                    </p>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="document.getElementById('scheduledConfirmModal').remove();"
                            style="flex:1; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: rgba(255,255,255,0.7); font-size: 15px; font-weight: 600; cursor: pointer;">
                            Hủy
                        </button>
                        <button onclick="document.getElementById('scheduledConfirmModal').remove(); confirmOrderWithTime('${orderId}', '${schedTime} (${schedDate})', 0);"
                            style="flex:1; padding: 12px; background: linear-gradient(135deg, #d4af37, #f0c040); border: none; border-radius: 12px; color: #000; font-size: 15px; font-weight: 700; cursor: pointer;">
                            ✅ Xác nhận
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function showAdminSuccessNotification(order, orderId) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'admin-success-notification';
            notification.id = 'adminSuccessNotification';
            notification.innerHTML = `
                <div class="admin-success-content">
        <div class="admin-success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="url(#adminSuccessGradient)" />
                <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round" />
                <defs>
                    <linearGradient id="adminSuccessGradient" x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stop-color="#10b981" />
                        <stop offset="100%" stop-color="#059669" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <h2 class="admin-success-title">Bestellung bestätigt!</h2>
        <p class="admin-success-message">
            Bestellung <strong>#${orderId.replace('ORD-', '').slice(-8)}</strong> wurde erfolgreich bestätigt.
        </p>
        <div class="admin-success-details">
            <div class="admin-detail-item">
                <span class="admin-detail-label">Kunde:</span>
                <span class="admin-detail-value">${order.delivery?.address?.firstName || ''}
                    ${order.delivery?.address?.lastName || ''}</span>
            </div>
            <div class="admin-detail-item">
                <span class="admin-detail-label">Gesamt:</span>
                <span class="admin-detail-value" style="color: var(--gold);">€${order.summary?.total || '0.00'}</span>
            </div>
        </div>
        <div class="admin-success-actions">
            <div class="admin-action-item">
                <div class="admin-action-icon">📧</div>
                <div class="admin-action-text">
                    <strong>E-Mail gesendet</strong><br>
                    <span>Bestätigungs-E-Mail wurde an den Kunden gesendet.</span>
                </div>
            </div>
            <div class="admin-action-item">
                <div class="admin-action-icon">🖨️</div>
                <div class="admin-action-text">
                    <strong>Rechnung gedruckt</strong><br>
                    <span>Kundenrechnung und Küchenticket wurden gedruckt.</span>
                </div>
            </div>
        </div>
        <button class="admin-success-btn" onclick="closeAdminSuccessNotification()">Verstanden</button>
    </div>
                `;

            // Add styles if not already added
            if (!document.getElementById('adminSuccessNotificationStyles')) {
                const style = document.createElement('style');
                style.id = 'adminSuccessNotificationStyles';
                style.textContent = `
                    .admin-success-notification {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .admin-success-content {
                background: linear-gradient(180deg, #1a1a1a, #0f0f11);
                border: 1px solid rgba(229, 207, 142, 0.2);
                border-radius: 24px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.4s ease;
            }
            @keyframes slideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            .admin-success-icon {
                margin: 0 auto 24px;
                animation: scaleIn 0.5s ease 0.2s both;
            }
            @keyframes scaleIn {
                from { transform: scale(0); }
                to { transform: scale(1); }
            }
            .admin-success-title {
                font-family: "Playfair Display", serif;
                font-size: 32px;
                color: #fff;
                margin: 0 0 16px;
                font-weight: 700;
            }
            .admin-success-message {
                color: rgba(255, 255, 255, 0.8);
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 24px;
            }
            .admin-success-message strong {
                color: var(--gold);
                font-weight: 600;
            }
            .admin-success-details {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 20px;
                margin: 0 0 24px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .admin-detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .admin-detail-item:last-child {
                border-bottom: none;
            }
            .admin-detail-label {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
            }
            .admin-detail-value {
                color: #fff;
                font-weight: 600;
                font-size: 16px;
            }
            .admin-success-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 0 0 24px;
            }
            .admin-action-item {
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                text-align: left;
                animation: slideIn 0.4s ease 0.3s both;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .admin-action-icon {
                font-size: 24px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .admin-action-text {
                flex: 1;
            }
            .admin-action-text strong {
                color: #10b981;
                font-size: 15px;
                display: block;
                margin-bottom: 6px;
            }
            .admin-action-text span {
                color: rgba(255, 255, 255, 0.8);
                font-size: 13px;
                line-height: 1.5;
            }
            .admin-success-btn {
                background: linear-gradient(180deg, var(--gold), var(--gold-2));
                color: #1a1a1a;
                border: none;
                padding: 14px 32px;
                border-radius: 100px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
            }
            .admin-success-btn:hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(194, 163, 85, 0.3);
            }
            @media(max-width: 640px) {
                .admin-success-content {
                    padding: 32px 24px;
                }
                .admin-success-title {
                    font-size: 24px;
                }
            }
            `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto close after 8 seconds
            setTimeout(() => {
                closeAdminSuccessNotification();
            }, 8000);
        }

        // Show beautiful admin reservation success notification
        function showAdminReservationSuccessNotification(reservation, reservationId, formattedTime) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'admin-success-notification';
            notification.id = 'adminReservationSuccessNotification';

            const reservationDateFormatted = reservation.date ? new Date(reservation.date).toLocaleDateString('de-DE', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }) : '';

            notification.innerHTML = `
                <div class="admin-success-content">
        <div class="admin-success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="url(#adminReservationSuccessGradient)" />
                <path d="M20 32L28 40L44 24" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"
                    stroke-linejoin="round" />
                <defs>
                    <linearGradient id="adminReservationSuccessGradient" x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stop-color="#10b981" />
                        <stop offset="100%" stop-color="#059669" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <h2 class="admin-success-title">Reservierung bestätigt!</h2>
        <p class="admin-success-message">
            Reservierung <strong>#${reservationId.replace('RES-', '').slice(-8)}</strong> wurde erfolgreich bestätigt.
        </p>
        <div class="admin-success-details">
            <div class="admin-detail-item">
                <span class="admin-detail-label">Kunde:</span>
                <span class="admin-detail-value">${reservation.first_name || ''} ${reservation.last_name || ''}</span>
            </div>
            <div class="admin-detail-item">
                <span class="admin-detail-label">Datum & Zeit:</span>
                <span class="admin-detail-value" style="color: var(--gold);">${reservationDateFormatted} um
                    ${formattedTime || reservation.time || ''}</span>
            </div>
            <div class="admin-detail-item">
                <span class="admin-detail-label">Personen:</span>
                <span class="admin-detail-value">${reservation.guests || 1}</span>
            </div>
        </div>
        <div class="admin-success-actions">
            <div class="admin-action-item">
                <div class="admin-action-icon">📧</div>
                <div class="admin-action-text">
                    <strong>E-Mail gesendet</strong><br>
                    <span>Bestätigungs-E-Mail wurde an den Kunden gesendet.</span>
                </div>
            </div>
        </div>
        <button class="admin-success-btn" onclick="closeAdminReservationSuccessNotification()">Verstanden</button>
    </div>
                `;

            document.body.appendChild(notification);

            // Auto close after 8 seconds
            setTimeout(() => {
                closeAdminReservationSuccessNotification();
            }, 8000);
        }

        // Close admin reservation success notification
        function closeAdminReservationSuccessNotification() {
            const notification = document.getElementById('adminReservationSuccessNotification');
            if (notification) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }

        // Close admin success notification
        function closeAdminSuccessNotification() {
            const notification = document.getElementById('adminSuccessNotification');
            if (notification) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }

        // Make functions globally available
        window.closeAdminSuccessNotification = closeAdminSuccessNotification;
        window.closeAdminReservationSuccessNotification = closeAdminReservationSuccessNotification;

        // ── Expose critical action functions to global scope ──
        // These are needed by onclick="..." in HTML-rendered order/reservation cards
        window.confirmOrder = confirmOrder;
        window.confirmOrderWithTime = confirmOrderWithTime;
        window.confirmWithScheduledTime = confirmWithScheduledTime;
        window.cancelOrder = cancelOrder;
        window.completeOrder = typeof completeOrder !== 'undefined' ? completeOrder : window.completeOrder;
        window.confirmReservation = confirmReservation;
        window.cancelReservation = cancelReservation;
        window.viewOrderDetails = viewOrderDetails;
        window.showTimeScheduleModal = showTimeScheduleModal;
        window.closeTimeScheduleModal = closeTimeScheduleModal;
        window.setQuickTime = setQuickTime;
        window.showScheduledConfirmModal = showScheduledConfirmModal;
        window.loadOrders = loadOrders;
        window.loadReservations = loadReservations;
        window.filterOrders = filterOrders;
        window.filterOrdersByStatus = filterOrdersByStatus;
        window.filterReservations = filterReservations;
        window.filterReservationsByStatus = filterReservationsByStatus;
        window.filterCustomers = filterCustomers;
        window.applyDatePickerFilter = applyDatePickerFilter;
        window.clearDatePicker = clearDatePicker;
        window.clearReservationDatePicker = clearReservationDatePicker;
        window.exportAllData = typeof exportAllData !== 'undefined' ? exportAllData : window.exportAllData;
        window.assignTable = typeof assignTable !== 'undefined' ? assignTable : window.assignTable;
        window.printOrderBill = typeof printOrderBill !== 'undefined' ? printOrderBill : window.printOrderBill;
        console.log('✅ All action functions exposed to global scope');

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

                // Try to get existing role, do not overwrite it if already set
                let currentRoleObj = null;
                try {
                    const savedRole = localStorage.getItem('leo_admin_role');
                    if (savedRole) {
                        if (savedRole.startsWith('{')) {
                            currentRoleObj = JSON.parse(savedRole);
                        } else if (savedRole === 'owner') {
                            currentRoleObj = { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' };
                        }
                    }
                } catch (e) {}

                if (!currentRoleObj || !currentRoleObj.role) {
                    currentRoleObj = { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' };
                    localStorage.setItem('leo_admin_role', JSON.stringify(currentRoleObj));
                }

                if (adminStatus) adminStatus.textContent = '✓ ' + currentRoleObj.label;

                localStorage.setItem('leo_admin_logged_in', 'true');
                localStorage.setItem('leo_admin_session_token', 'master_session_bypass');

                // Show stats button for master bypass (owner only)
                const statsBtnBypass = document.querySelector('.admin-tab[data-tab="stats"]');
                if (statsBtnBypass) {
                    statsBtnBypass.style.display = (currentRoleObj.role === 'owner') ? 'flex' : 'none';
                }

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
                return true; // Bypass on local
            }

            try {
                // Localhost: gọi trực tiếp router PHP để tránh phụ thuộc mod_rewrite
                let response = await fetch(`api/index.php?route=${encodeURIComponent('v1/session')}&_t=${Date.now()}`, {
                    method: 'GET',
                    credentials: 'include' // Important for session cookies
                });

                // Try to restore session if primary check fails
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
                    if (passwordInput) passwordInput.value = ''; // Clear password

                    localStorage.setItem('leo_admin_logged_in', 'true');
                    
                    let roleObj = {
                        role: role,
                        branch: null,
                        label: role === 'owner' ? 'Chủ - Tất cả chi nhánh' : 'Admin Panel'
                    };
                    localStorage.setItem('leo_admin_role', JSON.stringify(roleObj));

                    // Show content sections
                    const adminMainContent = document.querySelector('.admin-layout');
                    if (adminMainContent) adminMainContent.style.opacity = '1';

                    // Show stats tab for owners or master bypass
                    const sidebarStatsBtn = document.querySelector('.admin-tab[data-tab="stats"]');
                    if (sidebarStatsBtn) {
                        sidebarStatsBtn.style.display = (role === 'owner' || masterToken === 'master_session_bypass') ? 'flex' : 'none';
                    }

                    // CRITICAL: Ensure data is loaded if this is the initial login/restore
                    if (!window.__adminDataInitialized) {
                        console.log('🚀 [INIT] First load after login/restore, calling loadAllData()');
                        window.__adminDataInitialized = true;
                        loadAllData();
                    }
                } else {
                    // IMPORTANT: Before clearing, check if master bypass is still active.
                    // The server session may have expired but the client bypass should still persist.
                    const currentBypassToken = localStorage.getItem('leo_admin_session_token');
                    if (currentBypassToken === 'master_session_bypass') {
                        // Re-run the function — this time the bypass check at the top will catch it.
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
                // On error, show login modal
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) loginModal.style.display = 'flex';
                return false;
            }
        }

        // Handle admin login - Step 1: Send verification code
        async function handleAdminLogin() {
            const password = document.getElementById('adminPassword')?.value?.trim();
            const loginBtn = document.querySelector('#loginStep1 .btn-confirm');
            
            if (!password) {
                showMenuNotification('❌ Vui lòng nhập mật mã.', 'error');
                alert('Vui lòng nhập mật mã.');
                return;
            }
            
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.textContent = 'Đang kiểm tra...';
            }

            // 1. Check client-side Master Bypass Keys
            const roleMap = {
                '0301': { role: 'owner', branch: null, label: 'Chủ - Tất cả chi nhánh' },
                '03011': { role: 'branch_admin', branch: 'branch_flora', label: 'Admin - Florastraße' },
                '03012': { role: 'branch_admin', branch: 'branch_haupt', label: 'Admin - Hauptstraße' }
            };
            
            const matched = roleMap[password];
            if (matched) {
                showMenuNotification('✅ Mật mã chính xác. Đang vào hệ thống...', 'success');
                localStorage.setItem('leo_admin_logged_in', 'true');
                localStorage.setItem('leo_admin_role', JSON.stringify(matched));
                localStorage.setItem('leo_admin_session_token', 'master_session_bypass');
                
                const loginModal = document.getElementById('adminLoginModal');
                if (loginModal) loginModal.style.display = 'none';
                
                const adminStatus = document.getElementById('adminStatus');
                if (adminStatus) adminStatus.textContent = '👑 ' + matched.label;
                
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) logoutBtn.style.display = 'block';
                
                const statsBtnBypass = document.querySelector('.admin-tab[data-tab="stats"]');
                if (statsBtnBypass && matched.role === 'owner') statsBtnBypass.style.display = 'flex';

                if (typeof updateAdminRoleBadge === 'function') updateAdminRoleBadge();
                if (typeof loadOrders === 'function') loadOrders();
                if (typeof loadReservations === 'function') loadReservations();
                
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Tiếp tục';
                }
                return;
            }

            // 2. Fallback to Server Login (Direct password verification without OTP)
            try {
                const response = await fetch(`api/index.php?route=${encodeURIComponent('v1/auth/login')}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ password: password })
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Server returned invalid content type');
                }

                const data = await response.json();

                if (data.success) {
                    if (data.requires_verification) {
                        showMenuNotification('❌ Yêu cầu xác thực OTP nhưng chức năng này đã tắt. Vui lòng liên hệ Admin.', 'error');
                        alert('Yêu cầu xác thực OTP nhưng chức năng này đã tắt. Vui lòng liên hệ Admin.');
                    } else {
                        showMenuNotification('✅ Đăng nhập thành công!', 'success');
                        localStorage.setItem('leo_admin_logged_in', 'true');
                        
                        const matchedRole = {
                            role: data.role || 'owner',
                            branch: null,
                            label: data.role === 'owner' ? 'Chủ - Tất cả chi nhánh' : 'Admin Panel'
                        };
                        localStorage.setItem('leo_admin_role', JSON.stringify(matchedRole));
                        localStorage.setItem('leo_admin_session_token', data.session_id);

                        const loginModal = document.getElementById('adminLoginModal');
                        if (loginModal) loginModal.style.display = 'none';

                        const adminStatus = document.getElementById('adminStatus');
                        if (adminStatus) adminStatus.textContent = '✓ ' + matchedRole.label;

                        const logoutBtn = document.getElementById('logoutBtn');
                        if (logoutBtn) logoutBtn.style.display = 'block';

                        if (typeof loadOrders === 'function') loadOrders();
                        if (typeof loadReservations === 'function') loadReservations();
                    }
                } else {
                    const message = data.message || 'Mật mã không chính xác';
                    showMenuNotification('❌ ' + message, 'error');
                    alert('Lỗi đăng nhập: ' + message);
                }
            } catch (err) {
                console.error('Error during admin login:', err);
                showMenuNotification('❌ Không thể kết nối đến máy chủ.', 'error');
                alert('Không thể kết nối đến máy chủ.');
            }

            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Tiếp tục';
            }
        }

        // Wait for scripts to load before initializing
        function waitForScripts() {
            return new Promise((resolve) => {
                const checkScripts = setInterval(() => {
                    if (window.api && window.api.orders) {
                        console.log('✅ API scripts loaded');
                        clearInterval(checkScripts);
                        resolve();
                    }
                }, 100);

                // Timeout after 3 seconds
                setTimeout(() => {
                    clearInterval(checkScripts);
                    console.log('Script loading timeout, continuing anyway...');
                    resolve();
                }, 3000);
            });
        }

        document.addEventListener('DOMContentLoaded', async () => {
            console.log('📋 Admin panel DOMContentLoaded - Main Init');

            // 1. Ensure body is interactive
            document.body.style.pointerEvents = 'auto';

            // IMPORTANT: Bind event listeners manually since inline onclick might be blocked by CSP
            document.querySelectorAll('.admin-tab, .nav-item').forEach(btn => {
                btn.addEventListener('click', function (e) {
                    const onclickStr = this.getAttribute('onclick') || '';
                    const tabMatch = onclickStr.match(/switchTab\('([^']+)'\)/);
                    const tab = this.getAttribute('data-tab') || (tabMatch ? tabMatch[1] : null);

                    if (tab && typeof window.switchTab === 'function') {
                        e.preventDefault();
                        window.switchTab(tab);
                    }
                });
            });

            // 2. Initialize printer and pickers
            if (typeof initPrinterAndPickers === 'function') {
                initPrinterAndPickers();
            } else {
                const today = getLocalDateStr(new Date());
                const dp = document.getElementById('datePicker');
                const rdp = document.getElementById('reservationDatePicker');
                if (dp) dp.value = today;
                if (rdp) rdp.value = today;
            }

            // 2. Initialize Cross-Tab Sync Channel
            if ('BroadcastChannel' in window) {
                window.adminSyncChannel = new BroadcastChannel('leo_admin_sync');
                window.adminSyncChannel.onmessage = (event) => {
                    if (event.data && event.data.type === 'NEW_ORDER') {
                        loadOrders(true, true);
                    }
                };
            }

            // 3. Wait for api script
            await waitForScripts();

            // 4. Check login status
            const isLoggedIn = await checkAdminLogin();

            // 6. Initial data load (silent)
            if (isLoggedIn) {
                try {
                    // Load statistics first as they are quick
                    if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') {
                        AdminStats.loadStats();
                    }

                    // Load primary data
                    await loadAllData(true);

                    if (typeof loadDiscountCodes === 'function') loadDiscountCodes();

                    // Final check: if ordersList still has spinner after loadAllData, something failed silently
                    setTimeout(() => {
                        const ordersList = document.getElementById('ordersList');
                        if (ordersList && ordersList.innerHTML.includes('Đang cập nhật dữ liệu')) {
                            console.warn('⚠️ Dashboard loaded but Orders list is still stuck in loading state. Forcing non-silent reload.');
                            loadOrders(false);
                        }
                    }, 2000);
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            } else {
                console.log('ℹ️ Admin not logged in, waiting for authentication.');
            }

            // 7. Initialize printer status
            if (typeof updatePrinterStatusUI === 'function') updatePrinterStatusUI();

            // 8. Auto-Print status check
            const toggleBtn = document.getElementById('autoPrintToggle');
            if (toggleBtn) {
                const isEnabled = localStorage.getItem('autoPrintEnabled') === 'true';
                toggleBtn.checked = isEnabled;
                const logPanel = document.getElementById('autoPrintLogPanel');
                if (logPanel && isEnabled) {
                    logPanel.style.display = 'block';
                    if (typeof printLog === 'function') printLog('Auto-print đang bật từ phiên trước', 'info');
                }
            }

            // 9. Auto-refresh loops with Safe Recursive Pattern (Prevents PHP Session Deadlocks)
            let isRefreshingOrders = false;

            async function autoRefreshData() {
                if (localStorage.getItem('leo_admin_logged_in') === 'true' && !refreshPaused) {
                    if (!isUserInteracting && !isModalOpen()) {
                        const activeTab = document.querySelector('.admin-tab.active');
                        const activeTabId = activeTab ? activeTab.dataset.tab : 'orders';

                        if (activeTabId === 'orders' && !isRefreshingOrders) {
                            isRefreshingOrders = true;
                            try {
                                await loadOrders(true, true);
                            } catch (e) { }
                            isRefreshingOrders = false;
                        } else if (activeTabId === 'reservations') {
                            try { await loadReservations(true); } catch (e) { }
                        }
                    }
                }

                // Recursively call after 5 seconds to prevent overlapping requests
                setTimeout(autoRefreshData, 5000);
            }

            // Start the safe refresh loop
            setTimeout(autoRefreshData, 5000);

            // 10. Handle deep links
            const urlParams = new URLSearchParams(window.location.search);
            const orderToConfirm = urlParams.get('order_id');
            const action = urlParams.get('action');
            if (orderToConfirm && (action === 'confirm' || action === 'cancel')) {
                if (typeof switchTab === 'function') switchTab('orders');
                setTimeout(() => {
                    if (action === 'confirm' && typeof showTimeScheduleModal === 'function') {
                        showTimeScheduleModal(orderToConfirm);
                    } else if (action === 'cancel' && typeof cancelOrder === 'function') {
                        cancelOrder(orderToConfirm);
                    }
                    window.history.replaceState({}, document.title, window.location.pathname);
                }, 1500);
            }

            // 11. Register mobile push
            setTimeout(() => { if (typeof registerMobilePush === 'function') registerMobilePush(); }, 2000);
        });
    </script>
    <!-- Bottom Navigation for Mobile -->
    <div class="bottom-nav">
        <button class="nav-item active" onclick="switchTab('orders'); updateNav(this)">
            <i>📦</i>
            <span>Đơn hàng</span>
        </button>
        <button class="nav-item" onclick="switchTab('stats'); updateNav(this)">
            <i>📊</i>
            <span>Thống kê</span>
        </button>
        <button class="nav-item" onclick="switchTab('reservations'); updateNav(this)">
            <i>📅</i>
            <span>Lịch đặt</span>
        </button>
        <button class="nav-item" onclick="switchTab('customers'); updateNav(this)">
            <i>👥</i>
            <span>Khách</span>
        </button>
        <button class="nav-item" onclick="toggleMoreMenu()">
            <i>➕</i>
            <span>Thêm</span>
        </button>
    </div>

    <!-- Floating Action Buttons removed -->

    <!-- More Menu (Slide up) -->
    <div id="moreMenu"
        style="position: fixed; bottom: -100%; left: 0; right: 0; background: #1a1a1a; z-index: 1001; transition: 0.3s; border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 20px; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); border-top: 2px solid var(--gold);">
        <h3 style="color: var(--gold); margin-bottom: 20px;">Thêm chức năng</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <button class="btn-action" onclick="switchTab('discount-codes'); toggleMoreMenu()"
                style="background: rgba(255,255,255,0.05);">🎁 Mã giảm giá</button>
            <button class="btn-action" onclick="switchTab('promotions'); toggleMoreMenu()"
                style="background: rgba(255,255,255,0.05);">⭐ Tích điểm</button>
            <button class="btn-action" onclick="switchTab('holiday-schedule'); toggleMoreMenu()"
                style="background: rgba(255,255,255,0.05);">📅 Lịch nghỉ</button>
            <button id="dashboardModeBtn" class="btn-action" onclick="toggleDashboardMode()"
                style="background: rgba(255,255,255,0.05); color: #888;">📺 Dashboard: OFF</button>
            <button class="btn-action btn-cancel" onclick="handleAdminLogout()"
                style="grid-column: span 2; margin-top: 10px;">Logout</button>
        </div>
        <button onclick="toggleMoreMenu()"
            style="width: 100%; margin-top: 20px; padding: 10px; background: none; border: none; color: rgba(255,255,255,0.5);">Đóng</button>
    </div>

    <script>
        function updateNav(el) {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
        }

        function toggleMoreMenu() {
            const menu = document.getElementById('moreMenu');
            if (menu.style.bottom === '0px') {
                menu.style.bottom = '-100%';
            } else {
                menu.style.bottom = '0px';
            }
        }

        let wakeLock = null;
        async function toggleDashboardMode() {
            const btn = document.getElementById('dashboardModeBtn');
            if (!wakeLock) {
                try {
                    if ('wakeLock' in navigator) {
                        wakeLock = await navigator.wakeLock.request('screen');
                        btn.style.color = 'var(--gold)';
                        btn.textContent = '📺 Dashboard: ON';
                        showMenuNotification('✅ Dashboard Mode: Screen will stay ON', 'success');

                        wakeLock.addEventListener('release', () => {
                            wakeLock = null;
                            btn.style.color = '#888';
                            btn.textContent = '📺 Dashboard: OFF';
                        });
                    } else {
                        showMenuNotification('❌ Wake Lock not supported in this browser', 'error');
                    }
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            } else {
                wakeLock.release();
                wakeLock = null;
                btn.style.color = '#888';
                btn.textContent = '📺 Dashboard: OFF';
            }
        }

        // Mobile Push Notification Registration
        async function registerMobilePush() {
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                const PushNotifications = window.Capacitor.Plugins.PushNotifications;

                let permStatus = await PushNotifications.checkPermissions();
                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }
                if (permStatus.receive !== 'granted') return;

                await PushNotifications.register();

                PushNotifications.addListener('registration', async (token) => {
                    console.log('Push registration success, token: ' + token.value);
                    // Register on server
                    try {
                        await fetch('api/index.php?route=v1/data/orders/register-token', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                token: token.value,
                                user_type: 'admin',
                                device_info: navigator.userAgent
                            })
                        });
                    } catch (e) {
                        console.error('Server token registration failed', e);
                    }
                });

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Push received: ', notification);
                    loadOrders(true, true); // Refresh UI
                    // Also trigger custom event for widget if possible
                });
            }
        }

        // Auto-Print Toggle logic
        function toggleAutoPrint(checked) {
            // Check if a printer is configured before allowing auto-print
            if (checked && typeof PrinterManager !== 'undefined') {
                const savedPrinter = PrinterManager.getSavedPrinter();
                if (!savedPrinter) {
                    alert('Bạn chưa kết nối máy in! Vui lòng vào Menu máy in (biểu tượng 🖨️ ở trên) để chọn máy in trước khi bật tính năng này.');
                    document.getElementById('autoPrintToggle').checked = false;
                    return;
                }
            }
            localStorage.setItem('autoPrintEnabled', checked ? 'true' : 'false');

            // Show/hide log panel
            const logPanel = document.getElementById('autoPrintLogPanel');
            const statusEl = document.getElementById('autoPrintStatus');
            if (logPanel) logPanel.style.display = checked ? 'block' : 'none';
            if (statusEl) {
                statusEl.style.color = checked ? '#10b981' : '#ef4444';
                statusEl.textContent = checked ? '● ĐANG BẬT' : '● ĐÃ TẮT';
            }

            if (checked) {
                printLog('Đã BẬT tự động in', 'success');
                // Auto-clear old local cache to give fresh start
                localStorage.removeItem('leo_printed_orders');
                printLog('Đã xoá cache đơn cũ, sẵn sàng in đơn mới', 'info');
            } else {
                printLog('Đã TẮT tự động in', 'warn');
            }

            if (typeof showMenuNotification === 'function') {
                showMenuNotification(checked ? 'Đã BẬT tự động in đơn mới' : 'Đã TẮT tự động in đơn mới', checked ? 'success' : 'info');
            }
        }

        // Final initialization moved to main DOMContentLoaded listener above
    </script>

        // Setup polling for browser clients
        if (!window._adminPollingInterval) {
            window._adminPollingInterval = setInterval(() => {
                if (document.hidden || window.__loadOrdersRunning || typeof loadOrders !== 'function') return;
                if (window.isConfirmingOrder) return;
                loadOrders(true, true).catch(e => console.log('Polling error:', e));
            }, 8000);
        }
    
</body>

</html