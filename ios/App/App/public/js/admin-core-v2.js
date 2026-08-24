/**
 * Leo Sushi Admin Core V2
 * Chứa logic dùng chung: Định tuyến, Nhạc báo, Máy in...
 */

// VISUAL LOG for auto-print debugging (works on mobile app without Console)
function printLog(msg, type = 'info') {
    const el = document.getElementById('autoPrintLogEntries');
    if (!el) return;
    const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const colors = { info: '#94a3b8', success: '#10b981', error: '#ef4444', warn: '#fbbf24' };
    const icons = { info: '📋', success: '✅', error: '❌', warn: '⚠️' };
    el.innerHTML = `<div style="color:${colors[type] || colors.info};border-bottom:1px solid rgba(255,255,255,0.05);padding:2px 0;"> ${icons[type] || ''} <span style="color:rgba(255,255,255,0.4)">${time}</span> ${msg}</div>` + el.innerHTML;
    // Keep only last 15 entries
    const entries = el.querySelectorAll('div');
    if (entries.length > 15) {
        for (let i = 15; i < entries.length; i++) entries[i].remove();
    }
    console.log(`🖨️[AutoPrint] ${msg} `);
}

// AUTO-PRINTING ENGINE
function checkAutoPrinting(orders) {
    const isAutoPrintEnabled = localStorage.getItem('autoPrintEnabled') === 'true';
    if (!isAutoPrintEnabled) return;

    let printedIds = [];
    try {
        printedIds = JSON.parse(localStorage.getItem('leo_printed_orders') || '[]');
    } catch (e) { printedIds = []; }

    const printedSet = new Set(printedIds.map(id => id.toString()));
    let newlyPrinted = false;
    const now = Date.now();

    orders.forEach(order => {
        const id = (order.order_id || order.id || '').toString();
        if (!id) return;

        if (printedSet.has(id)) return;

        let summary = order.summary;
        if (typeof summary === 'string') {
            try { summary = JSON.parse(summary); } catch (e) { return; }
        }
        // CHỈ IN KHI ĐƠN ĐÃ ĐƯỢC DUYỆT (confirmed)
        if (order.status !== 'confirmed') return;

        if (summary.is_printed) {
            printedSet.add(id);
            newlyPrinted = true;
            return;
        }

        const createdAtTime = order.created_at ? new Date(order.created_at).getTime() : (summary.timestamp ? new Date(summary.timestamp).getTime() : now);
        const isAncient = (now - createdAtTime > 12 * 60 * 60 * 1000);

        if (!isAncient) {
            const shortId = id.replace(/^(ORD-|LEO-)/, '').slice(-8);
            printLog(`Đang in đơn #${shortId}...`, 'info');

            const printUrl = `api/index.php?route=${encodeURIComponent('v1/data/orders/update-printed')}`;
            fetch(printUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: id })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        if (typeof printOrderBill === 'function') {
                            printOrderBill(id);
                            printedSet.add(id);
                            newlyPrinted = true;
                            printLog(`IN THÀNH CÔNG #${shortId}`, 'success');
                            showMenuNotification('Đã tự động in đơn #' + shortId, 'success');
                        }
                    } else if (data.already_printed) {
                        printLog(`#${shortId} đã in ở máy khác`, 'warn');
                        printedSet.add(id);
                    }
                    localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
                })
                .catch(err => {
                    printLog(`LỖI KẾT NỐI: ${err.message}`, 'error');
                });
        }
    });

    if (newlyPrinted) {
        localStorage.setItem('leo_printed_orders', JSON.stringify(Array.from(printedSet).slice(-500)));
    }
}

// Auto-Print Toggle logic
function toggleAutoPrint(checked) {
    if (checked && typeof PrinterManager !== 'undefined') {
        const savedPrinter = PrinterManager.getSavedPrinter();
        if (!savedPrinter) {
            alert('Bạn chưa kết nối máy in! Vui lòng chọn máy in trước.');
            document.getElementById('autoPrintToggle').checked = false;
            return;
        }
    }
    localStorage.setItem('autoPrintEnabled', checked ? 'true' : 'false');

    const logPanel = document.getElementById('autoPrintLogPanel');
    const statusEl = document.getElementById('autoPrintStatus');
    if (logPanel) logPanel.style.display = checked ? 'block' : 'none';
    if (statusEl) {
        statusEl.style.color = checked ? '#10b981' : '#ef4444';
        statusEl.textContent = checked ? '● ĐANG BẬT' : '● ĐÃ TẮT';
    }

    if (checked) {
        printLog('Đã BẬT tự động in', 'success');
        localStorage.removeItem('leo_printed_orders');
        printLog('Đã xoá cache đơn cũ', 'info');
    } else {
        printLog('Đã TẮT tự động in', 'warn');
    }
    showMenuNotification(checked ? 'Đã BẬT tự động in' : 'Đã TẮT tự động in', checked ? 'success' : 'info');
}

// Visual Notifications
function showMenuNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        padding: 12px 24px; border-radius: 8px; color: #fff;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease;
    `;
    toast.textContent = (type === 'success' ? '✅ ' : '❌ ') + message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Common Date Helper
function getLocalDateStr(dateObj) {
    const yyyy = dateObj.getFullYear();
    let mm = dateObj.getMonth() + 1;
    let dd = dateObj.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    return `${yyyy}-${mm}-${dd}`;
}

// Check Modal Open
function isModalOpen() {
    return document.querySelector('.modal:not([style*="display: none"])') !== null;
}

// Load All Data
async function loadAllData(silent = false) {
    try {
        if (typeof loadOrders === 'function') await loadOrders(silent);
        if (typeof loadReservations === 'function') await loadReservations(silent);
        if (typeof AdminStats !== 'undefined' && typeof AdminStats.loadStats === 'function') AdminStats.loadStats();
    } catch (err) {
        console.error('Data loading error:', err);
    }
}

// Make globals available
window.printLog = printLog;
window.checkAutoPrinting = checkAutoPrinting;
window.toggleAutoPrint = toggleAutoPrint;
window.showMenuNotification = showMenuNotification;
window.getLocalDateStr = getLocalDateStr;
window.isModalOpen = isModalOpen;
window.loadAllData = loadAllData;
