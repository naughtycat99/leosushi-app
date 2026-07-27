const fs = require('fs');

const apiResponse = JSON.parse(fs.readFileSync('scratch/test_query_result_utf8.json', 'utf8'));
const allMenuItems = apiResponse.data || [];

const menuCategories = [
    {category_id: 'vorspeisen', name: 'Vorspeisen'}
];

function renderMenuItems(items) {
    const htmlStrings = items.map(item => {
        if (!item.item_id) {
            console.error('Menu item missing ID:', item);
            return '';
        }
        const category = menuCategories.find(c => c.category_id === item.category_id);
        return `
            <div class="order-card" style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h3 style="color: var(--gold); margin-bottom: 8px;">${item.name}</h3>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 4px 0;">
                            <strong>Kategorie:</strong> ${category ? category.name : item.category_id || 'N/A'}<br>
                            <strong>Preis:</strong> ${parseFloat(item.price).toFixed(2)}€
                        </p>
                        ${item.description ? `<p style="color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 8px;">${item.description}</p>` : ''}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-action toggle-available-btn" data-item-id="${item.item_id}" data-available="${item.available == 0 ? 0 : 1}" style="background: ${item.available == 0 ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}; color: ${item.available == 0 ? '#ef4444' : '#22c55e'}; padding: 4px 10px; font-size: 13px; font-weight: bold; border-radius: 6px;" title="${item.available == 0 ? 'Hiện đang Hết hàng - Bấm để mở lại' : 'Đang bán - Bấm để báo hết hàng'}">
                            ${item.available == 0 ? '❌ Hết hàng' : '✅ Có sẵn'}
                        </button>
                        <button class="btn-action btn-view edit-menu-item-btn" data-item-id="${item.item_id}" title="Bearbeiten">✏️</button>
                        <button class="btn-action delete-menu-item-btn" data-item-id="${item.item_id}" style="background: rgba(239,68,68,0.1);" title="Löschen">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });
    console.log('Map successful! Length of first element:', htmlStrings[0].length);
}
try {
    renderMenuItems(allMenuItems);
} catch(e) {
    console.error('Error during renderMenuItems:', e);
}
