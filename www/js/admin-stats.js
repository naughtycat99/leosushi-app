/**
 * Admin Statistics Module - Leo Sushi
 * Handles revenue calculation and premium UI rendering
 * Includes Role Display and Password Protection (Master Password)
 */

const AdminStats = {
    currentPeriod: 'today',
    customDate: '', // Specific date (YYYY-MM-DD)
    isUnlocked: false, // For manual password entry if role is staff
    masterPassword: '0301', // Mật mã bảo vệ (Customized by user)

    parseDateSafe(dateStr) {
        if (!dateStr) return new Date(0);
        if (dateStr instanceof Date) return dateStr;
        
        const dateStrTrimmed = dateStr.trim();
        // If it's already an ISO string or has 'T', parse directly
        if (dateStrTrimmed.includes('T')) {
            const d = new Date(dateStrTrimmed);
            if (!isNaN(d.getTime())) return d;
        }
        
        // Convert "YYYY-MM-DD HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
        const normalized = dateStrTrimmed.replace(' ', 'T');
        const d = new Date(normalized);
        if (!isNaN(d.getTime())) {
            return d;
        }
        
        // Fallback for Safari/WebView: replace '-' with '/'
        const fallback = dateStrTrimmed.replace(/-/g, '/');
        const dFallback = new Date(fallback);
        if (!isNaN(dFallback.getTime())) {
            return dFallback;
        }
        
        return new Date(dateStr);
    },

    init() {
        console.log("AdminStats initialized");
        this.loadStats('today');
    },

    async loadStats(period = 'today', customDate = '', silent = false) {
        this.currentPeriod = period;
        this.customDate = customDate;

        const container = document.getElementById('statsContent');
        if (!container) return;

        // Get current admin role
        let adminRole = 'staff';
        let adminBranch = null;
        try {
            const saved = localStorage.getItem('leo_admin_role');
            if (saved) {
                const parsed = JSON.parse(saved);
                adminRole = parsed.role || 'staff';
                adminBranch = parsed.branch || null;
            }
        } catch(e) { adminRole = localStorage.getItem('leo_admin_role') || 'staff'; }
        
        const isOwner = adminRole === 'owner' || adminRole === 'admin' || adminRole === 'branch_admin';

        // Check Access & Unlock State
        if (!isOwner && !this.isUnlocked) {
            this.renderUnlockGate(container, adminRole);
            return;
        }

        // Show loading state only if NOT silent
        if (!silent) {
            container.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="min-height: 400px; background: #090909;">
                    <div class="spinner-border text-warning" role="status" style="color: #d4af37 !important;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
        }

        try {
            // Fetch orders and reservations separately with Auth headers
            const authHeader = { 'Authorization': `Bearer ${localStorage.getItem('leo_admin_session_token')}` };
            const [ordersRes, reservationsRes] = await Promise.all([
                fetch(`api/index.php?route=v1/data/orders`, { headers: authHeader, credentials: 'include' }).then(r => r.json()),
                fetch(`api/index.php?route=v1/data/reservations`, { headers: authHeader, credentials: 'include' }).then(r => r.json())
            ]);

            let allOrders = ordersRes.orders || [];
            let allReservations = reservationsRes.reservations || [];

            // Filter by branch
            let targetBranch = this.currentBranch || 'all';
            if (adminRole === 'branch_admin' && adminBranch) {
                targetBranch = adminBranch;
            }

            if (targetBranch !== 'all') {
                allOrders = allOrders.filter(o => {
                    const summary = typeof o.summary === 'string' ? JSON.parse(o.summary || '{}') : (o.summary || {});
                    // Fallback: If no branch data exists (old orders), assume it belongs to the main branch (Flora)
                    const branchId = summary.branch?.id || o.branch_id || 'branch_flora';
                    return branchId === targetBranch;
                });
                
                allReservations = allReservations.filter(r => {
                    return r.branch_id === targetBranch || r.branch === targetBranch;
                });
            }

            // Filter by period or custom date
            const filteredOrders = this.filterByPeriod(allOrders, period, customDate);
            const filteredReservations = this.filterByPeriod(allReservations, period, customDate);

            const stats = this.calculateMetrics(filteredOrders, filteredReservations);
            this.render(stats, period, customDate, adminRole);
        } catch (error) {
            console.error("Error loading stats:", error);
            container.innerHTML = `<div class="alert alert-danger mx-3">Lỗi tải dữ liệu: ${error.message}</div>`;
        }
    },

    renderUnlockGate(container, role) {
        // Ensure role is a clean string even if an object is passed
        let displayRole = 'STAFF';
        if (typeof role === 'string') {
            try {
                const parsed = JSON.parse(role);
                displayRole = (parsed.role || 'STAFF').toUpperCase();
            } catch(e) {
                displayRole = role.toUpperCase();
            }
        } else if (role && role.role) {
            displayRole = role.role.toUpperCase();
        }

        container.style.background = '#090909';
        container.innerHTML = `
            <div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 500px; color: #fff; padding: 20px;">
                <div class="lock-icon mb-4" style="font-size: 50px; filter: drop-shadow(0 0 10px rgba(212,175,55,0.3));">🔒</div>
                <h4 class="text-gold fw-bold mb-2">Dữ liệu bảo mật</h4>
                <p class="opacity-50 small text-center mb-4">Bạn đang truy cập với quyền: <b class="text-white">${displayRole}</b>.<br>Vui lòng nhập mật mã để xem doanh thu.</p>
                
                <div class="unlock-form w-100" style="max-width: 280px;">
                    <input type="password" id="statsPassInput" class="form-control mb-3 text-center" 
                           placeholder="Mật mã bảo vệ" 
                           style="background: #1a1a1a; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px;">
                    <button onclick="AdminStats.verifyPassword()" class="btn btn-gold w-100" 
                            style="border-radius: 12px; padding: 12px; font-weight: 700; background: #d4af37; border: none; color: #000;">
                        Mở khoá
                    </button>
                    <div id="unlockError" class="text-danger small mt-2 text-center" style="display: none;">Mật mã không chính xác!</div>
                </div>
            </div>
        `;
    },

    verifyPassword() {
        const input = document.getElementById('statsPassInput');
        const error = document.getElementById('unlockError');
        if (input.value === this.masterPassword) {
            this.isUnlocked = true;
            this.loadStats('today');
        } else {
            error.style.display = 'block';
            input.classList.add('is-invalid');
            setTimeout(() => {
                input.classList.remove('is-invalid');
            }, 500);
        }
    },

    filterByPeriod(data, period, customDate) {
        if (customDate) {
            const targetDate = this.parseDateSafe(customDate);
            targetDate.setHours(0, 0, 0, 0);
            const targetEnd = new Date(targetDate);
            targetEnd.setHours(23, 59, 59, 999);

            return data.filter(item => {
                const dateStr = item.created_at || item.order_date || item.reservation_date;
                if (!dateStr) return false;
                const itemDate = this.parseDateSafe(dateStr);
                return itemDate >= targetDate && itemDate <= targetEnd;
            });
        }

        if (period === 'all') return data;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Start of week (Monday)
        const dayOfWeek = now.getDay() || 7;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1);

        // Start of month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Start of year
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        return data.filter(item => {
            const dateStr = item.created_at || item.order_date || item.reservation_date;
            if (!dateStr) return false;
            const itemDate = this.parseDateSafe(dateStr);

            switch (period) {
                case 'today':
                    return itemDate >= today;
                case 'this_week':
                    return itemDate >= startOfWeek;
                case 'this_month':
                    return itemDate >= startOfMonth;
                case 'this_year':
                    return itemDate >= startOfYear;
                default:
                    return true;
            }
        });
    },

    calculateMetrics(orders, reservations) {
        const validOrders = orders.filter(o => {
            const s = (o.status || '').toLowerCase();
            return ['pending', 'confirmed', 'completed', 'delivered', 'in_delivery', 'cancelled', 'rejected'].includes(s);
        });
        const validReservations = reservations.filter(r => {
            const s = (r.status || '').toLowerCase();
            return ['pending', 'completed', 'confirmed', 'cancelled', 'rejected'].includes(s);
        });

        // Helper to parse Euro strings like "42,50 €" or "42.50"
        const parseAmount = (val) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            // Remove currency symbols, replace German decimal comma with dot
            return parseFloat(String(val).replace(/[€$\s]/g, '').replace(',', '.')) || 0;
        };

        let totalRevenue = 0;
        let tips = 0;
        let refundsCount = 0;

        const paymentMethods = {};

        validOrders.forEach(o => {
            const summary = o.summary || {};
            const s = (o.status || '').toLowerCase();
            const isRevenueStatus = ['confirmed', 'completed', 'delivered', 'in_delivery'].includes(s);
            
            if (isRevenueStatus) {
                const amount = parseAmount(summary.total || o.total_amount || 0);
                totalRevenue += amount;

                const method = o.payment_method || summary.payment_method || 'Online';
                if (!paymentMethods[method]) {
                    paymentMethods[method] = { amount: 0, count: 0 };
                }
                paymentMethods[method].amount += amount;
                paymentMethods[method].count += 1;

                tips += parseAmount(summary.tip || o.tip_amount || 0);
            }

            if (s === 'cancelled' || s === 'rejected') {
                refundsCount++;
            }
        });

        validReservations.forEach(r => {
            const s = (r.status || '').toLowerCase();
            if (s === 'completed' || s === 'confirmed') {
                const amount = parseAmount(r.total_amount || 0);
                totalRevenue += amount;

                const method = 'Tại bàn';
                if (!paymentMethods[method]) {
                    paymentMethods[method] = { amount: 0, count: 0 };
                }
                paymentMethods[method].amount += amount;
                paymentMethods[method].count += 1;

                tips += parseAmount(r.tip_amount || 0);
            }
            
            if (s === 'cancelled' || s === 'rejected') {
                refundsCount++;
            }
        });

        const transactions = [
            ...validOrders.map(o => {
                const summary = o.summary || {};
                const addr = o.delivery_address || {};
                const name = (addr.first_name || addr.firstName || '') + ' ' + (addr.last_name || addr.lastName || '') || 'Khách';
                return {
                    date: o.created_at || o.order_date,
                    id: o.order_id || o.id,
                    customer: name.trim() || 'Khách',
                    phone: addr.phone || '',
                    method: o.payment_method || summary.payment_method || 'Online',
                    type: o.service_type || 'Đơn hàng',
                    amount: summary.total || '—',
                    items: o.items || [],
                    note: addr.note || summary.note || '',
                    address: addr.street ? `${addr.street}, ${addr.postal || ''} ${addr.city || ''}`.trim() : '',
                    status: o.status || ''
                };
            }),
            ...validReservations.map(r => ({
                date: r.reservation_date + ' ' + (r.reservation_time || ''),
                id: r.reservation_id || r.id,
                customer: ((r.first_name || '') + ' ' + (r.last_name || '')).trim() || 'Khách',
                phone: r.phone || '',
                method: 'Tại bàn',
                type: 'Đặt bàn',
                amount: r.total_amount ? this.formatCurrency(r.total_amount) : '—',
                items: [],
                note: r.notes || r.special_requests || '',
                address: '',
                status: r.status || '',
                guests: r.guests || r.party_size || ''
            }))
        ].sort((a, b) => this.parseDateSafe(b.date) - this.parseDateSafe(a.date));

        return {
            orderCount: validOrders.length,
            reservationCount: validReservations.length,
            totalRevenue,
            paymentMethods,
            tips,
            refundsCount,
            transactions
        };
    },

    render(stats, period, customDate, role) {
        const container = document.getElementById('statsContent');
        const periodLabels = {
            'today': 'Hôm nay',
            'this_week': 'Tuần này',
            'this_month': 'Tháng này',
            'this_year': 'Năm nay',
            'all': 'Tất cả'
        };
        const periodLabel = customDate ? `${new Date(customDate).toLocaleDateString('vi-VN')}` : (periodLabels[period] || period);

        container.style.padding = '0';
        container.style.background = '#090909';
        container.innerHTML = `
            <div class="stats-fintech-dashboard" style="color: #fff; font-family: 'Inter', sans-serif;">
                <!-- Header -->
                <div class="stats-header p-4 pb-0" style="background: linear-gradient(to bottom, rgba(212,175,55,0.05) 0%, transparent 100%);">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h2 class="h4 mb-0 fw-800 text-gold">Báo cáo doanh thu</h2>
                        <div class="stats-refresh-btn" onclick="AdminStats.loadStats('${this.currentPeriod}', '${this.customDate}')" 
                             style="cursor: pointer; background: #1a1a1a; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
                            🔄
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="opacity-70 small">${periodLabel} • <span class="text-gold fw-bold">${role.toUpperCase()}</span></div>
                        <div class="lock-status opacity-40 small" style="cursor: pointer;" onclick="AdminStats.isUnlocked=false; AdminStats.loadStats()">🔓 Đã mở khoá</div>
                    </div>

                    <div class="pill-navigation-container mb-4 d-flex flex-wrap gap-2">
                        <div class="date-picker-tab" style="position: relative; display: flex; align-items: center;">
                            <input type="date" id="statsDatePicker" value="${customDate}" 
                                   onchange="AdminStats.loadStats('custom', this.value)"
                                   style="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;">
                            <button class="pill-btn ${customDate ? 'active' : ''}" style="pointer-events: none; padding-right: 35px;">
                                📅 Chọn ngày
                                <span style="position: absolute; right: 12px; font-size: 10px; opacity: 0.5;">▼</span>
                            </button>
                        </div>
                        ${Object.entries(periodLabels).map(([key, label]) => `
                            <button class="pill-btn ${this.currentPeriod === key && !customDate ? 'active' : ''}" 
                                onclick="AdminStats.loadStats('${key}')">${label}</button>
                        `).join('')}

                        ${(role === 'owner' || role === 'admin') ? `
                        <div style="margin-left:auto;">
                            <select id="statsBranchSelect" onchange="AdminStats.currentBranch = this.value; AdminStats.loadStats('${this.currentPeriod}', '${this.customDate}')" 
                                style="background:#1a1a1a; border:1px solid #d4af37; color:#fff; padding:8px 12px; border-radius:12px; font-size:13px; font-weight:600; cursor:pointer; outline:none;">
                                <option value="all" ${this.currentBranch === 'all' ? 'selected' : ''}>🌐 Tất cả chi nhánh</option>
                                <option value="branch_flora" ${this.currentBranch === 'branch_flora' ? 'selected' : ''}>🏠 Cơ sở 1: Florastraße</option>
                                <option value="branch_haupt" ${this.currentBranch === 'branch_haupt' ? 'selected' : ''}>🏠 Cơ sở 2: Hauptstraße</option>
                            </select>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="p-3 pt-2">
                    <!-- Main Card -->
                    <div class="hero-revenue-card mb-4">
                        <div class="blur-effect"></div>
                        <div class="card-content text-center">
                            <div class="label opacity-60 small mb-1" style="color: #d4af37;">TỔNG DOANH THU</div>
                            <div class="value mb-4" style="font-size: 44px; font-weight: 900;">${this.formatCurrency(stats.totalRevenue)}</div>
                            <div class="payment-board">
                                ${Object.entries(stats.paymentMethods).map(([method, data]) => `
                                    <div class="p-item d-flex justify-content-between align-items-center mb-1">
                                        <div class="p-method d-flex align-items-center">
                                            <span class="p-dot ${method === 'Tại bàn' ? 'bg-reservation' : 'bg-info'}"></span>
                                            <span class="opacity-70 small">${method} (${data.count} đơn)</span>
                                        </div>
                                        <div class="p-amount fw-bold small">${this.formatCurrency(data.amount)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div class="row g-2 mb-4">
                        ${this.renderMetric('🍱', 'Đơn hàng', stats.orderCount)}
                        ${this.renderMetric('📅', 'Đặt bàn', stats.reservationCount, 'border-reservation')}
                        ${this.renderMetric('✨', 'Tiền Tip', this.formatCurrency(stats.tips), 'border-info text-info')}
                        ${this.renderMetric('🔄', 'Huỷ đơn', stats.refundsCount, 'border-danger text-danger')}
                    </div>

                    <!-- Transactions -->
                    <div class="section-header d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center">
                            <span class="pulse-dot"></span>
                            <h3 class="mb-0 small fw-bold opacity-50" style="letter-spacing: 1.5px;">GIAO DỊCH GẦN NHẤT</h3>
                        </div>
                    <div class="transaction-list" id="statsTxList">
                        ${stats.transactions.length > 0 ? stats.transactions.map((t, idx) => `
                            <div class="transaction-item" data-idx="${idx}" style="flex-direction:column;align-items:stretch;cursor:pointer;padding:0;">
                                <div style="display:flex;align-items:center;padding:12px 16px;gap:12px;">
                                    <div class="t-icon ${t.type === 'Đặt bàn' ? 'bg-reservation' : 'bg-order'}" style="flex-shrink:0;">${t.type === 'Đặt bàn' ? '📅' : '🍱'}</div>
                                    <div class="t-main flex-grow-1" style="min-width:0;">
                                        <div class="t-name fw-bold small" style="display:flex;gap:8px;align-items:baseline;">
                                            <span style="color:#fff;">#${t.id.toString().slice(-9)}</span>
                                            <span style="font-weight:600;opacity:.9;">${t.customer}</span>
                                        </div>
                                        <div style="font-size:11px;opacity:.55;margin-top:2px;">
                                            ${this.formatDateShort(t.date)} • ${t.method}${t.phone ? ' &nbsp;📞 ' + t.phone : ''}${t.guests ? ' &nbsp;👥 ' + t.guests + ' người' : ''}
                                        </div>
                                    </div>
                                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;">
                                        <div style="font-weight:700;color:#d4af37;font-size:13px;">${t.amount || '—'}</div>
                                        <div class="t-tag" style="font-size:8px;">${t.type === 'Đặt bàn' ? 'Bàn' : t.type === 'delivery' ? '🛵 Ship' : t.type === 'pickup' ? '🥡 Tự lấy' : 'Đơn'}</div>
                                    </div>
                                    <div class="t-arrow" style="opacity:.3;font-size:10px;margin-left:4px;flex-shrink:0;">▼</div>
                                </div>
                                <div class="t-detail" style="display:none;border-top:1px solid rgba(255,255,255,0.05);padding:10px 16px 14px 16px;background:rgba(255,255,255,0.02);">
                                    ${t.note ? `<div style="font-size:11px;background:rgba(212,175,55,0.08);color:#d4af37;border-radius:8px;padding:6px 10px;margin-bottom:8px;">📝 ${t.note}</div>` : ''}
                                    ${t.address ? `<div style="font-size:11px;opacity:.5;margin-bottom:8px;">📍 ${t.address}</div>` : ''}
                                    ${t.items && t.items.length > 0 ? `
                                        <div style="font-size:10px;opacity:.4;letter-spacing:1px;margin-bottom:6px;font-weight:700;">MÓN ĐÃ ĐẶT</div>
                                        <div style="display:flex;flex-direction:column;gap:3px;">
                                            ${t.items.map(item => `
                                                <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 8px;background:rgba(255,255,255,0.03);border-radius:6px;">
                                                    <span style="opacity:.9;">${item.qty || item.quantity || 1}× ${item.name || ''}</span>
                                                    <span style="color:#d4af37;font-weight:600;">${item.total || ''}</span>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : `<div style="font-size:12px;opacity:.35;text-align:center;padding:6px;">${t.type === 'Đặt bàn' ? 'Đặt bàn – không có món' : 'Không có dữ liệu món'}</div>`}
                                    <div style="margin-top:12px;text-align:right;">
                                        <button onclick="event.stopPropagation(); AdminStats.deleteTransaction('${t.type === 'Đặt bàn' ? 'reservation' : 'order'}', '${t.id}')" style="background:rgba(239, 68, 68, 0.1);border:1px solid rgba(239, 68, 68, 0.3);padding:6px 12px;border-radius:6px;font-size:11px;color:#ef4444;cursor:pointer;font-weight:600;">🗑️ Xóa Đơn Mẫu/Test</button>
                                    </div>
                                </div>
                            </div>
                        `).join('') : '<div class="text-center py-5 opacity-30">Không có dữ liệu</div>'}
                    </div>
                </div>
            </div>
            
            <style>
                .stats-fintech-dashboard { background: #090909; min-height: 90vh; }
                .text-gold { color: #d4af37 !important; }
                .fw-800 { font-weight: 800; }
                .pill-btn { background: #1a1a1a; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 18px; font-size: 13px; font-weight: 600; }
                .pill-btn.active { background: #d4af37; color: #000; font-weight: 800; border-color: #d4af37; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
                .hero-revenue-card { background: linear-gradient(145deg, #181818 0%, #111111 100%); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 30px 24px; position: relative; overflow: hidden; }
                .hero-revenue-card .blur-effect { position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: #d4af37; filter: blur(80px); opacity: 0.1; }
                .payment-board { background: rgba(255,255,255,0.03); border-radius: 20px; padding: 14px; border: 1px solid rgba(255,255,255,0.05); }
                .p-dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 8px; }
                .bg-reservation { background: #d4af37; }
                .bg-info { background: #00d2ff; }
                .metric-card-compact { background: #161616; border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 15px; display: flex; align-items: center; gap: 10px; height: 100%; }
                .metric-card-compact.border-reservation { border-color: rgba(212,175,55,0.2); }
                .metric-card-compact.border-info { border-color: rgba(0,210,255,0.2); }
                .metric-card-compact.border-danger { border-color: rgba(255,107,107,0.2); }
                .metric-card-compact .m-label { font-size: 9px; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700; }
                .metric-card-compact .m-val { font-size: 16px; font-weight: 800; }
                .transaction-list { background: #161616; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; }
                .transaction-item { display: flex; align-items: center; padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.02); gap: 12px; }
                .t-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
                .bg-order { background: rgba(0, 210, 255, 0.1); }
                .bg-reservation { background: rgba(212, 175, 55, 0.1); }
                .t-tag { font-size: 8px; padding: 3px 8px; border-radius: 8px; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); font-weight: 700; text-transform: uppercase; }
                .pulse-dot { width: 5px; height: 5px; background: #00ff88; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 8px #00ff88; }
            </style>
        `;

        // Wire up expand/collapse via event listeners (inline onclick blocked by CSP on some servers)
        container.querySelectorAll('.transaction-item').forEach(item => {
            item.addEventListener('click', function () {
                const detail = this.querySelector('.t-detail');
                const arrow = this.querySelector('.t-arrow');
                if (!detail) return;
                const isOpen = detail.style.display !== 'none';
                detail.style.display = isOpen ? 'none' : 'block';
                if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
            });
        });
    },

    renderMetric(icon, label, val, cls = '') {
        return `
            <div class="col-6">
                <div class="metric-card-compact ${cls}">
                    <span class="m-icon">${icon}</span>
                    <div class="m-data">
                        <div class="m-label">${label}</div>
                        <div class="m-val">${val}</div>
                    </div>
                </div>
            </div>
        `;
    },

    formatDateShort(dateStr) {
        if (!dateStr) return 'N/A';
        const date = this.parseDateSafe(dateStr);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' +
            date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    },

    async deleteTransaction(type, id) {
        if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn ${type === 'reservation' ? 'đặt bàn' : 'đơn hàng'} #${id} không? Hành động này không thể hoàn tác.`)) return;

        try {
            let url = '';
            let body = {};

            if (type === 'reservation') {
                url = 'api/index.php?route=v1/data/reservations&action=delete';
                body = { reservation_id: id };
            } else {
                url = 'api/index.php?route=v1/data/orders&action=delete';
                body = { order_id: id };
            }

            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (data.success) {
                // Refresh list directly without reloading page
                this.loadStats(this.currentPeriod, this.customDate);

                // Show brief success toast
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 10px 25px rgba(0,0,0,0.2)';
                toast.innerText = 'Đã xóa thành công!';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
            } else {
                alert('Xóa thất bại: ' + (data.message || 'Lỗi hệ thống'));
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert('Lỗi kết nối khi thử xóa dữ liệu!');
        }
    }
};

// Global access
window.AdminStats = AdminStats;
