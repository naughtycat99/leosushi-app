const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// The replacement HTML template using fully inline CSS
const newHtml = `
                <div class="order-card \${status}" data-order-id="\${orderId}">
                    <div class="card-header-compact" onclick="const det = this.nextElementSibling; if(det.style.display==='none'){det.style.display='block';}else{det.style.display='none';}" style="display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 8px 0;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; border: 3px solid \${isReservation ? '#10b981' : (summary.scheduled_delivery_time ? 'var(--gold)' : '#10b981')}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; color: \${isReservation ? '#10b981' : (summary.scheduled_delivery_time ? 'var(--gold)' : '#10b981')}; background: rgba(0,0,0,0.2);">
                            \${isReservation ? \`<span>🪑</span><span style="font-size:10px">\${order.time||'--:--'}</span>\` : (summary.scheduled_delivery_time ? \`<span>\${summary.scheduled_delivery_time.time||''}</span><span style="font-size:8px">Uhr</span>\` : \`<span>ASAP</span>\`)}
                        </div>
                        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px;">
                            <div style="font-size: 16px; font-weight: 700; color: #fff; line-height: 1.2;">\${isReservation ? (order.name || 'Kunde') : (addressStr || customerName)}</div>
                            <div style="font-size: 13px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 6px;">
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
                    
                    <div class="card-info" style="display: none; margin-top:0; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1);">`;

const renderFuncStart = content.indexOf('function renderOrderCard');
const startHtml = content.indexOf('<div class="order-card ${status}"', renderFuncStart);

if (startHtml !== -1) {
    const endHtmlTarget = content.indexOf('<div class="card-info"', startHtml);
    const endHtmlEnd = content.indexOf('>', endHtmlTarget) + 1;
    if (endHtmlEnd > startHtml) {
        content = content.substring(0, startHtml) + newHtml + content.substring(endHtmlEnd);
        fs.writeFileSync('admin.html', content, 'utf8');
        console.log('Successfully patched admin.html with inline styles');
    } else {
        console.log('endHtmlTarget not found');
    }
} else {
    console.log('startHtml not found');
}
