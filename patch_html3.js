const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// The replacement HTML template
const newHtml = `
                <div class="order-card \${status}" data-order-id="\${orderId}">
                    <div class="card-header-compact" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="compact-circle" style="border-color: \${isReservation ? '#10b981' : (summary.scheduled_delivery_time ? 'var(--gold)' : '#10b981')}; color: \${isReservation ? '#10b981' : (summary.scheduled_delivery_time ? 'var(--gold)' : '#10b981')};">
                            \${isReservation ? \`<span>🪑</span><span style="font-size:10px">\${order.time||'--:--'}</span>\` : (summary.scheduled_delivery_time ? \`<span>\${summary.scheduled_delivery_time.time||''}</span><span style="font-size:8px">Uhr</span>\` : \`<span>ASAP</span>\`)}
                        </div>
                        <div class="compact-details">
                            <div class="compact-address">\${isReservation ? (order.name || 'Kunde') : (addressStr || customerName)}</div>
                            <div class="compact-id">
                                <span>#\${orderIdShort}</span>
                                \${(() => {
                                    const type = (order.service_type || '').toLowerCase();
                                    if (type === 'reservation') return '<span style="color:#10b981">• Đặt bàn</span>';
                                    if (type === 'dinein') return '<span style="color:#3b82f6">• Tại chỗ</span>';
                                    if (type === 'delivery') return '<span style="color:#ef4444">• Giao hàng</span>';
                                    if (type === 'pickup') return '<span style="color:#f59e0b">• Mang về</span>';
                                    return '';
                                })()}
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                            <span class="card-status status-\${status}" style="margin:0">\${statusText}</span>
                            <span style="font-size: 14px; font-weight: bold; color: var(--gold);">\${total}</span>
                        </div>
                    </div>
                    
                    <div class="card-info">`;

const renderFuncStart = content.indexOf('function renderOrderCard');
const startHtml = content.indexOf('<div class="order-card ${status}"', renderFuncStart);

if (startHtml !== -1) {
    const endHtmlTarget = content.indexOf('<div class="card-info">', startHtml) + '<div class="card-info">'.length;
    if (endHtmlTarget > startHtml) {
        content = content.substring(0, startHtml) + newHtml + content.substring(endHtmlTarget);
        
        // Fix up bubbling inside renderOrderCard ONLY
        const renderFuncEnd = content.indexOf('function displayOrders');
        let renderBlock = content.substring(startHtml, renderFuncEnd);
        renderBlock = renderBlock.replace(/onclick="([^"]+)\(/g, 'onclick="event.stopPropagation(); $1(');
        content = content.substring(0, startHtml) + renderBlock + content.substring(renderFuncEnd);
        
        fs.writeFileSync('admin.html', content, 'utf8');
        console.log('Successfully patched admin.html');
    } else {
        console.log('endHtmlTarget not found');
    }
} else {
    console.log('startHtml not found');
}
