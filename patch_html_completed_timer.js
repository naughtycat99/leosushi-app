const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regex = /\$\{\s*\(status\s*===\s*'confirmed'.*?:\s*''\s*\)\s*\}/s;

const replacement = `\${ (status === 'completed' || status === 'delivered' || status === 'done') ? \`
                        <div class="order-timers" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; padding: 8px 12px; margin-top: 4px;">
                            <div class="timer-phase completion-phase">
                                <div class="timer-header" style="color: #10b981; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                                    <span>✅ Hoàn thành</span>
                                    <span class="timer-value" style="color: #10b981; font-size: 15px;">00:00</span>
                                </div>
                                <div class="timer-progress-bg" style="height: 6px; background: rgba(255,255,255,0.1); margin-top: 8px; border-radius: 3px; overflow: hidden;">
                                    <div class="timer-progress-fill" style="width: 100%; height: 100%; background: #10b981;"></div>
                                </div>
                            </div>
                        </div>
                        \` : ( (status === 'confirmed' || status === 'preparing' || status === 'ready') ? \`
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
                        \` : '' ) ) }`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully patched admin.html with completed timer');
} else {
    console.log('Regex not found!');
}
