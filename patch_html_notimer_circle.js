const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const newHtml = `
                <div class="order-card \${status}" data-order-id="\${orderId}">
                    <div class="card-header-compact" onclick="const det = this.nextElementSibling; if(det.style.display==='none'){det.style.display='block';}else{det.style.display='none';}" style="display: flex; flex-direction: column; gap: 8px; cursor: pointer; padding: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="font-size: 16px; font-weight: 700; color: #fff; line-height: 1.2;">
                                    \${isReservation ? (order.name || 'Kunde') : (addressStr || customerName)}
                                </div>
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
                        
                        \${ (status === 'confirmed' || status === 'preparing' || status === 'ready') ? \`
                        <div class="order-timers" id="timers-\${orderId}" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; padding: 8px 12px; margin-top: 4px;">
                            <div class="timer-phase completion-phase">
                                <div class="timer-header" style="color: #10b981; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                                    <span>⏳ Thời gian còn lại:</span>
                                    <span class="timer-value" style="color: #10b981; font-size: 15px;">--:--</span>
                                </div>
                                <div class="timer-progress-bg" style="height: 6px; background: rgba(255,255,255,0.1); margin-top: 8px; border-radius: 3px; overflow: hidden;">
                                    <div class="timer-progress-fill" style="width: 0%; height: 100%; background: #10b981; transition: width 1s linear;"></div>
                                </div>
                            </div>
                        </div>
                        \` : ( (isReservation || summary.scheduled_delivery_time) ? \`
                        <div style="background: rgba(229,207,142,0.1); border: 1px solid rgba(229,207,142,0.3); border-radius: 8px; padding: 6px 12px; margin-top: 4px; display: flex; align-items: center; gap: 8px;">
                            <span style="font-size:14px;">\${isReservation ? '🪑' : '🕐'}</span>
                            <strong style="color: var(--gold); font-size: 13px;">\${isReservation ? \`Khách: \${order.guests || 1} • Giờ đặt: \${order.time || '--:--'}\` : \`Hẹn: \${summary.scheduled_delivery_time.time}\`}</strong>
                        </div>
                        \` : '' ) }
                    </div>
                    
                    <div class="card-info" style="display: none; margin-top:0; padding-top:12px; border-top:1px solid rgba(255,255,255,0.1);">`;

const startHtml = content.indexOf('<div class="order-card ${status}"');
if (startHtml !== -1) {
    const endHtmlTarget = content.indexOf('<div class="card-info"', startHtml);
    const endHtmlEnd = content.indexOf('>', endHtmlTarget) + 1;
    if (endHtmlEnd > startHtml) {
        content = content.substring(0, startHtml) + newHtml + content.substring(endHtmlEnd);
        fs.writeFileSync('admin.html', content, 'utf8');
        console.log('Successfully patched admin.html to remove circle and use progress bar');
    } else {
        console.log('endHtmlTarget not found');
    }
} else {
    console.log('startHtml not found');
}
