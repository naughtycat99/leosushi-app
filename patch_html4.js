const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const newHtml = `
            // --- PARSE ITEMS ---
            let items = order.items || [];
            if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch (e) { items = []; }
            }
            if (!items.length && summary.items) {
                items = summary.items;
                if (typeof items === 'string') {
                    try { items = JSON.parse(items); } catch (e) { items = []; }
                }
            }

            let itemsHtml = '';
            let itemCount = 0;
            items.forEach(item => {
                let qty = parseInt(item.qty || item.quantity || 1);
                itemCount += qty;
                let price = parseFloat(item.price || 0);
                let itemTotal = item.total ? parseFloat(item.total) : (price * qty);
                
                itemsHtml += \`
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:14px; font-weight:600;">
                        <span>\${qty} x \${item.name || 'Artikel'}</span>
                        <span>\${itemTotal.toFixed(2).replace('.', ',')} €</span>
                    </div>
                \`;
                
                if (item.options && Array.isArray(item.options)) {
                    item.options.forEach(opt => {
                        let optPrice = parseFloat(opt.price || 0);
                        itemsHtml += \`
                            <div style="display:flex; justify-content:space-between; margin-bottom:2px; font-size:13px; color:rgba(255,255,255,0.6); padding-left:12px;">
                                <span>+ \${opt.name}</span>
                                <span>\${optPrice > 0 ? optPrice.toFixed(2).replace('.', ',') + ' €' : ''}</span>
                            </div>
                        \`;
                    });
                }
                
                if (item.note) {
                    itemsHtml += \`
                        <div style="font-size:13px; color:#fbbf24; padding-left:12px; margin-bottom:4px;">
                            \${item.note}
                        </div>
                    \`;
                }
                itemsHtml += \`<div style="height:8px;"></div>\`;
            });

            // --- END PARSE ITEMS ---

            return \`
                <div class="order-card \${status}" data-order-id="\${orderId}">
                    <!-- COMPACT HEADER -->
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
                                    if (type === 'delivery') return '<span>• 🛵 Lieferung</span>';
                                    if (type === 'pickup') return '<span>• 🥡 Abholung</span>';
                                    return '';
                                })()}
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
                            <span class="card-status status-\${status}" style="margin:0">\${statusText}</span>
                        </div>
                    </div>
                    
                    <!-- EXPANDED INFO -->
                    <div class="card-info" style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                        <!-- Customer Name row -->
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                            <div style="font-size: 16px; font-weight: 600; display:flex; align-items:center; gap:8px;">
                                \${customerName} 
                                \${phone !== 'N/A' ? \`<a href="tel:\${phone}" onclick="event.stopPropagation();" style="background:rgba(229,207,142,0.15); padding:4px 8px; border-radius:6px; color:var(--gold); text-decoration:none; font-size:12px;">📞 Gọi</a>\` : ''}
                            </div>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        
                        <!-- Item Count & Paid Status -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <span style="font-size: 14px; font-weight: 500;">\${itemCount} Artikel</span>
                            <span style="background: \${summary.payment_status === 'paid' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: \${summary.payment_status === 'paid' ? '#10b981' : '#ef4444'}; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                \${summary.payment_status === 'paid' ? '✅ Bezahlt' : '❌ Unbezahlt'}
                            </span>
                        </div>
                        
                        <!-- ITEMS LIST -->
                        <div style="margin-bottom: 16px;">
                            \${itemsHtml}
                        </div>
                        
                        <!-- TOTALS -->
                        <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 12px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:rgba(255,255,255,0.7); font-size:14px;">
                                <span>Zwischensumme</span>
                                <span>\${total}</span>
                            </div>
                            \${summary.discount ? \`
                            <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:rgba(255,255,255,0.7); font-size:14px;">
                                <span>Rabatt</span>
                                <span>-\${summary.discount}</span>
                            </div>\` : ''}
                            <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:16px; font-weight:700;">
                                <span>Gesamtbetrag</span>
                                <span>\${total}</span>
                            </div>
                        </div>
                        
                        \${note ? \`
                        <div style="margin-top: 15px; background: rgba(229,207,142,0.05); padding: 12px; border-radius: 8px; border-left: 3px solid var(--gold);">
                            <span style="font-style: italic; font-size: 13px; color: #eee; white-space: normal;">📝 Ghi chú: \${note}</span>
                        </div>
                        \` : ''}
                    </div>

                    \${status === 'confirmed' && summary.confirmed_at ? \`
                    <div class="order-timers" id="timers-\${orderId}" style="margin-top: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">
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
                    \` : ''
                }

                    <!-- ACTIONS -->
                    <div class="card-actions" style="margin-top: 16px;">
                        \${status === 'pending' ? \`
                            <button class="btn-action btn-confirm" onclick="event.stopPropagation(); \${isReservation ? \`confirmReservation('\${orderId}')\` : \`confirmOrder('\${orderId}')\`}" style="background: #f59e0b; color: #fff; font-size: 18px; font-weight: 700; padding: 12px; border-radius: 8px; width: 100%; border: none;">Übergabe</button>
                            <button class="btn-action btn-cancel" onclick="event.stopPropagation(); \${isReservation ? \`cancelReservation('\${orderId}')\` : \`cancelOrder('\${orderId}')\`}" style="margin-top: 8px; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); padding: 10px; border-radius: 8px; width: 100%;">Stornieren</button>
                        \` : ''}
                        
                        \${(status === 'confirmed' || status === 'in_delivery') && !isReservation ? \`
                            <button class="btn-action btn-confirm" onclick="event.stopPropagation(); completeOrder('\${orderId}')" style="background: #10b981; color: #fff; font-size: 18px; font-weight: 700; padding: 12px; border-radius: 8px; width: 100%; border: none;">✓ Fertig</button>
                        \` : ''}
                        
                        \${(status !== 'pending' && !isReservation) ? \`
                            <button class="btn-action" onclick="event.stopPropagation(); printOrderBill('\${orderId}')" style="margin-top: 12px; width: 100%; padding: 12px; border: 1px dashed rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.8); border-radius: 8px; transition: all 0.2s ease;">🖨️ Drucken (Bill)</button>
                        \` : ''}
                        
                    </div>
                </div>
                \`;
`;

const renderFuncStart = content.indexOf('function renderOrderCard');
const replaceStart = content.indexOf('            return `', renderFuncStart);
const replaceEnd = content.indexOf('        // Helper function to get a date string', replaceStart) - 10;

if (replaceStart !== -1 && replaceEnd !== -1) {
    content = content.substring(0, replaceStart) + newHtml + content.substring(replaceEnd);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Success');
} else {
    console.log('Failed to find bounds');
}
