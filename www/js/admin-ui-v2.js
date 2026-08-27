(function () {
    'use strict';

    const TAB_META = {
        orders: { icon: '📦', title: 'Đơn hàng', subtitle: 'Tiếp nhận, xác nhận, in và theo dõi đơn theo thời gian thực' },
        stats: { icon: '📊', title: 'Thống kê', subtitle: 'Doanh thu, tiền mặt, tiền tip và hoàn tiền theo thời gian' },
        reservations: { icon: '📅', title: 'Đặt bàn', subtitle: 'Quản lý lịch đặt, số khách, chi nhánh và trạng thái xác nhận' },
        customers: { icon: '👥', title: 'Khách hàng', subtitle: 'Thông tin khách, điểm thưởng và lịch sử sử dụng dịch vụ' },
        menu: { icon: '🍣', title: 'Thực đơn', subtitle: 'Món ăn, danh mục, giá, hình ảnh và trạng thái còn hàng' },
        'discount-codes': { icon: '🎁', title: 'Mã giảm giá', subtitle: 'Tạo, chỉnh sửa và theo dõi các mã ưu đãi' },
        promotions: { icon: '⭐', title: 'Đổi điểm', subtitle: 'Thiết lập quy tắc tích điểm và đổi phần thưởng' },
        'holiday-schedule': { icon: '🗓️', title: 'Lịch nghỉ lễ', subtitle: 'Quản lý ngày nghỉ và giờ mở cửa đặc biệt' },
        printer: { icon: '🖨️', title: 'Máy in & âm báo', subtitle: 'Bluetooth, mạng LAN, in thử và âm thanh thông báo' }
    };

    const PRIMARY_TABS = ['orders', 'reservations', 'customers', 'menu', 'stats'];
    let currentTab = 'orders';
    let summaryObserver = null;

    function callIfAvailable(name, ...args) {
        const fn = window[name];
        if (typeof fn === 'function') return fn(...args);
        return undefined;
    }

    function refreshForTab(tabId) {
        const loaders = {
            orders: 'loadOrders',
            reservations: 'loadReservations',
            customers: 'loadCustomers',
            menu: 'loadMenuItems',
            'discount-codes': 'loadDiscountCodes',
            promotions: 'loadRedemptionRules',
            'holiday-schedule': 'loadHolidaySchedule'
        };

        if (tabId === 'stats' && window.AdminStats && typeof window.AdminStats.loadStats === 'function') {
            window.AdminStats.loadStats();
            return;
        }

        const loader = loaders[tabId];
        if (loader) callIfAvailable(loader);
        else callIfAvailable('loadAllData');
    }

    function makeButton(label, tabId, extraClass = '') {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `admin-quick-nav-btn ${extraClass}`.trim();
        button.dataset.adminV2Tab = tabId;
        button.textContent = label;
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            if (typeof window.switchTab === 'function') window.switchTab(tabId);
        });
        return button;
    }

    function buildCommandBar() {
        if (document.getElementById('adminCommandBar')) return;
        const header = document.querySelector('.admin-header');
        const layout = document.querySelector('.admin-layout');
        if (!header || !layout) return;

        const bar = document.createElement('div');
        bar.id = 'adminCommandBar';
        bar.className = 'admin-command-bar';
        bar.innerHTML = `
            <div class="admin-command-context">
                <span class="admin-command-eyebrow">Không gian vận hành</span>
                <span class="admin-command-title" id="adminCommandTitle">📦 Đơn hàng</span>
            </div>
            <nav class="admin-quick-nav" id="adminQuickNav" aria-label="Điều hướng nhanh quản trị"></nav>
        `;

        const quickNav = bar.querySelector('#adminQuickNav');
        PRIMARY_TABS.forEach((tabId) => {
            const meta = TAB_META[tabId];
            quickNav.appendChild(makeButton(`${meta.icon} ${meta.title}`, tabId));
        });

        const moreButton = document.createElement('button');
        moreButton.type = 'button';
        moreButton.className = 'admin-quick-nav-btn';
        moreButton.textContent = '＋ Thêm';
        moreButton.addEventListener('click', (event) => {
            event.stopPropagation();
            callIfAvailable('toggleMoreMenu');
        });
        quickNav.appendChild(moreButton);

        layout.parentNode.insertBefore(bar, layout);
    }

    function buildSidebarGroups() {
        const tabs = document.querySelector('.admin-tabs');
        if (!tabs || tabs.dataset.adminV2Ready === '1') return;
        tabs.dataset.adminV2Ready = '1';

        const allTabs = Array.from(tabs.querySelectorAll('.admin-tab'));
        const uniqueMenuTabs = allTabs.filter((tab) => tab.dataset.tab === 'menu');
        if (uniqueMenuTabs.length > 1) {
            uniqueMenuTabs.slice(1).forEach((tab) => {
                tab.setAttribute('aria-hidden', 'true');
                tab.tabIndex = -1;
            });
        }

        const statsTab = allTabs.find((tab) => tab.dataset.tab === 'stats');
        if (statsTab) statsTab.style.removeProperty('display');

        if (!tabs.querySelector('[data-tab="printer"]')) {
            const printerTab = document.createElement('button');
            printerTab.type = 'button';
            printerTab.className = 'admin-tab';
            printerTab.dataset.tab = 'printer';
            printerTab.textContent = '🖨️ Máy in & âm báo';
            printerTab.addEventListener('click', (event) => {
                event.stopPropagation();
                window.switchTab('printer');
            });
            tabs.appendChild(printerTab);
        }

        const insertLabel = (text, beforeTab) => {
            if (!beforeTab) return;
            const label = document.createElement('div');
            label.className = 'admin-nav-group-label';
            label.textContent = text;
            tabs.insertBefore(label, beforeTab);
        };

        insertLabel('Vận hành hôm nay', tabs.querySelector('[data-tab="orders"]'));
        insertLabel('Khách hàng & sản phẩm', tabs.querySelector('[data-tab="customers"]'));
        insertLabel('Ưu đãi & thiết lập', tabs.querySelector('[data-tab="discount-codes"]'));
    }

    function addPageHeadings() {
        Object.entries(TAB_META).forEach(([tabId, meta]) => {
            const contentId = tabId === 'discount-codes'
                ? 'discount-codesContent'
                : tabId === 'holiday-schedule'
                    ? 'holiday-scheduleContent'
                    : `${tabId}Content`;
            const content = document.getElementById(contentId);
            if (!content || content.querySelector(':scope > .admin-page-heading')) return;

            const heading = document.createElement('div');
            heading.className = 'admin-page-heading';
            heading.innerHTML = `
                <div>
                    <h2>${meta.icon} ${meta.title}</h2>
                    <p>${meta.subtitle}</p>
                </div>
                <button type="button" class="admin-page-refresh" aria-label="Làm mới ${meta.title}" title="Làm mới">↻</button>
            `;
            heading.querySelector('button').addEventListener('click', (event) => {
                event.stopPropagation();
                refreshForTab(tabId);
            });
            content.insertBefore(heading, content.firstChild);
        });
    }

    function buildOpsSummary() {
        const ordersContent = document.getElementById('ordersContent');
        if (!ordersContent || document.getElementById('adminOpsSummary')) return;

        const summary = document.createElement('div');
        summary.id = 'adminOpsSummary';
        summary.className = 'admin-ops-summary';
        summary.innerHTML = `
            <button type="button" class="admin-ops-card is-alert" data-action="pending-orders">
                <span class="admin-ops-card-label">📦 Đơn chờ xử lý</span>
                <strong class="admin-ops-card-value" id="adminV2PendingOrders">0</strong>
            </button>
            <button type="button" class="admin-ops-card is-live" data-action="delivery-orders">
                <span class="admin-ops-card-label">🛵 Đang giao</span>
                <strong class="admin-ops-card-value" id="adminV2DeliveryOrders">0</strong>
            </button>
            <button type="button" class="admin-ops-card" data-action="pending-reservations">
                <span class="admin-ops-card-label">📅 Đặt bàn chờ duyệt</span>
                <strong class="admin-ops-card-value" id="adminV2PendingReservations">0</strong>
            </button>
            <button type="button" class="admin-ops-card" data-action="missing-branches">
                <span class="admin-ops-card-label">⚠️ Chưa rõ chi nhánh</span>
                <strong class="admin-ops-card-value" id="adminV2MissingBranches">0</strong>
            </button>
        `;

        summary.addEventListener('click', (event) => {
            const card = event.target.closest('.admin-ops-card');
            if (!card) return;
            const action = card.dataset.action;
            if (action === 'pending-orders') {
                window.switchTab('orders');
                callIfAvailable('filterOrdersByStatus', 'pending');
            } else if (action === 'delivery-orders') {
                window.switchTab('orders');
                callIfAvailable('filterOrdersByStatus', 'in_delivery');
            } else {
                window.switchTab('reservations');
                if (action === 'pending-reservations') callIfAvailable('filterReservationsByStatus', 'pending');
            }
        });

        const heading = ordersContent.querySelector(':scope > .admin-page-heading');
        if (heading) heading.insertAdjacentElement('afterend', summary);
        else ordersContent.insertBefore(summary, ordersContent.firstChild);
    }

    function getArray(name) {
        return Array.isArray(window[name]) ? window[name] : [];
    }

    function updateSummary() {
        const orders = getArray('allOrdersData');
        const reservations = getArray('allReservationsData');
        const setText = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = String(value);
        };

        setText('adminV2PendingOrders', orders.filter((order) => (order.status || 'pending') === 'pending').length);
        setText('adminV2DeliveryOrders', orders.filter((order) => order.status === 'in_delivery').length);
        setText('adminV2PendingReservations', reservations.filter((reservation) => (reservation.status || 'pending') === 'pending').length);
        setText('adminV2MissingBranches', reservations.filter((reservation) => !reservation.branch_id).length);
    }
    window.updateAdminV2Summary = updateSummary;

    function syncTabUi(tabId) {
        currentTab = TAB_META[tabId] ? tabId : currentTab;
        const meta = TAB_META[currentTab] || TAB_META.orders;
        const commandTitle = document.getElementById('adminCommandTitle');
        if (commandTitle) commandTitle.textContent = `${meta.icon} ${meta.title}`;

        document.querySelectorAll('[data-admin-v2-tab]').forEach((button) => {
            button.classList.toggle('active', button.dataset.adminV2Tab === currentTab);
        });

        document.querySelectorAll('.admin-tab').forEach((tab) => {
            const active = tab.dataset.tab === currentTab;
            tab.classList.toggle('active', active);
            if (active) tab.setAttribute('aria-current', 'page');
            else tab.removeAttribute('aria-current');
        });

        document.querySelectorAll('.bottom-nav .nav-item').forEach((button) => {
            const handler = button.getAttribute('onclick') || '';
            const active = handler.includes(`'${currentTab}'`) || handler.includes(`"${currentTab}"`);
            if (active) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        });
    }

    function wrapSwitchTab() {
        const originalSwitchTab = window.switchTab;
        if (typeof originalSwitchTab !== 'function' || originalSwitchTab.__adminV2Wrapped) return;

        function enhancedSwitchTab(tabId) {
            const result = originalSwitchTab.apply(this, arguments);
            syncTabUi(tabId);
            window.setTimeout(updateSummary, 100);
            return result;
        }
        enhancedSwitchTab.__adminV2Wrapped = true;
        window.switchTab = enhancedSwitchTab;
    }

    function watchOperationalData() {
        if (summaryObserver) summaryObserver.disconnect();
        const targets = [
            document.getElementById('ordersList'),
            document.getElementById('reservationsList'),
            document.getElementById('statsContent')
        ].filter(Boolean);
        summaryObserver = new MutationObserver(() => window.setTimeout(() => {
            updateSummary();
            // AdminStats renders its whole container again after each refresh.
            // Restore the common page heading without changing the stats controls.
            addPageHeadings();
        }, 0));
        targets.forEach((target) => summaryObserver.observe(target, { childList: true, subtree: true }));
        window.setInterval(updateSummary, 5000);
    }

    function improveAccessibility() {
        document.querySelectorAll('.admin-tab, .bottom-nav .nav-item').forEach((button) => {
            if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', button.textContent.trim().replace(/\s+/g, ' '));
        });
        const searchInputs = document.querySelectorAll('input[id$="Search"]');
        searchInputs.forEach((input) => {
            if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', input.placeholder || 'Tìm kiếm');
        });
    }

    function initAdminUiV2() {
        document.body.classList.add('admin-ui-v2');
        buildCommandBar();
        buildSidebarGroups();
        addPageHeadings();
        buildOpsSummary();
        wrapSwitchTab();
        improveAccessibility();
        watchOperationalData();
        syncTabUi('orders');
        updateSummary();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminUiV2, { once: true });
    } else {
        initAdminUiV2();
    }
})();
