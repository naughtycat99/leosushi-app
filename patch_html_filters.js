const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const regexDesktop = /<div class="desktop-status-filters"[\s\S]*?<\/div>/;
const replacementDesktop = `<div class="desktop-status-filters"
                                style="position: relative; z-index: 10001 !important; pointer-events: auto !important; display: flex; flex-wrap: wrap; gap: 8px;">
                                <button class="filter-btn active"
                                    onclick="console.log('Click: Pending'); filterOrdersByStatus('pending')"
                                    data-status="pending"
                                    style="pointer-events: auto !important; cursor: pointer !important; position: relative; z-index: 10002 !important;">Chờ
                                    xử lý</button>
                                <button class="filter-btn"
                                    onclick="console.log('Click: Confirmed'); filterOrdersByStatus('confirmed')"
                                    data-status="confirmed"
                                    style="pointer-events: auto !important; cursor: pointer !important; position: relative; z-index: 10002 !important;">Đã
                                    xác nhận</button>
                                <button class="filter-btn"
                                    onclick="console.log('Click: Completed'); filterOrdersByStatus('completed')"
                                    data-status="completed"
                                    style="pointer-events: auto !important; cursor: pointer !important; position: relative; z-index: 10002 !important;">Đã
                                    xong</button>
                                <button class="filter-btn"
                                    onclick="console.log('Click: Cancelled'); filterOrdersByStatus('cancelled')"
                                    data-status="cancelled"
                                    style="pointer-events: auto !important; cursor: pointer !important; position: relative; z-index: 10002 !important;">Đã
                                    hủy</button>
                            </div>`;

const regexMobile = /<select class="filter-input mobile-status-filter"[\s\S]*?<\/select>/;
const replacementMobile = `<select class="filter-input mobile-status-filter"
                                onchange="filterOrdersByStatus(this.value)"
                                style="position: relative; z-index: 10001 !important; pointer-events: auto !important;">
                                <option value="pending">Chờ xử lý</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="completed">Đã xong</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>`;

let success = false;
if (regexDesktop.test(content) && regexMobile.test(content)) {
    content = content.replace(regexDesktop, replacementDesktop);
    content = content.replace(regexMobile, replacementMobile);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully patched admin.html with new filters');
    success = true;
} else {
    console.log('Regex not found!');
}
