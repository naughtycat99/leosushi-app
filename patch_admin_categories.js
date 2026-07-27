const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

// 1. Add branch filter HTML right before the search input
const filterGroupHtml = `<select id="menuCategoryFilter" class="filter-input" onchange="filterMenuItems()"
                                style="min-width: 200px; position: relative; z-index: 1000 !important; pointer-events: auto !important;">
                                <option value="">Tất cả danh mục</option>
                            </select>`;
const branchFilterHtml = `<select id="menuBranchFilter" class="filter-input" onchange="filterMenuItems()"
                                style="min-width: 150px; position: relative; z-index: 1000 !important; pointer-events: auto !important;">
                                <option value="">Tất cả cơ sở</option>
                                <option value="branch_flora">Flora</option>
                                <option value="branch_haupt">Hauptstraße</option>
                            </select>`;
// Replace `<select id="menuCategoryFilter" ... onchange="filterMenuByCategory()" ...>` with `onchange="filterMenuItems()"`
const oldCategoryFilterRegex = /<select id="menuCategoryFilter"[^>]*>[\s\S]*?<\/select>/;
const newCategoryFilters = `<select id="menuCategoryFilter" class="filter-input" onchange="filterMenuItems()"
                                style="min-width: 200px; position: relative; z-index: 1000 !important; pointer-events: auto !important;">
                                <option value="">Tất cả danh mục</option>
                            </select>
                            ${branchFilterHtml}`;
if (content.match(oldCategoryFilterRegex)) {
    content = content.replace(oldCategoryFilterRegex, newCategoryFilters);
    console.log('Patched filters HTML');
} else {
    console.log('Failed to patch filters HTML');
}

// 2. Update filterMenuItems function
const oldFilterMenuItems = /function filterMenuItems\(\) \{[\s\S]*?renderMenuItems\(filtered\);\s*\}/;
const newFilterMenuItems = `function filterMenuItems() {
            const search = document.getElementById('menuSearch').value.toLowerCase();
            const categoryId = document.getElementById('menuCategoryFilter').value;
            const branchId = document.getElementById('menuBranchFilter') ? document.getElementById('menuBranchFilter').value : '';

            let filtered = allMenuItems;

            if (categoryId) {
                filtered = filtered.filter(item => item.category_id === categoryId);
            }
            
            if (branchId) {
                filtered = filtered.filter(item => item.branch_id === branchId);
            }

            if (search) {
                filtered = filtered.filter(item =>
                    item.name.toLowerCase().includes(search) ||
                    (item.description && item.description.toLowerCase().includes(search))
                );
            }

            renderMenuItems(filtered);
        }`;
if (content.match(oldFilterMenuItems)) {
    content = content.replace(oldFilterMenuItems, newFilterMenuItems);
    console.log('Patched filterMenuItems');
} else {
    console.log('Failed to patch filterMenuItems');
}

// 3. Update filterMenuByCategory - wait, I replaced its usage with filterMenuItems, so I can just leave the function there or remove it.

// 4. Update loadAllData to load categories BEFORE menu items
const oldLoadAllData = /try \{\s*if \(typeof loadMenuItems === 'function'\) await loadMenuItems\(\);\s*\} catch \(error\) \{\s*console\.warn\('Could not load menu items:', error\);\s*\}/;
const newLoadAllData = `try {
                if (typeof loadMenuCategories === 'function') await loadMenuCategories();
                if (typeof loadMenuItems === 'function') await loadMenuItems();
            } catch (error) {
                console.warn('Could not load menu items/categories:', error);
            }`;
if (content.match(oldLoadAllData)) {
    content = content.replace(oldLoadAllData, newLoadAllData);
    console.log('Patched loadAllData');
} else {
    console.log('Failed to patch loadAllData');
}

// 5. Update switchTab to load categories if empty
const oldSwitchTab = /\} else if \(tabId === 'menu'\) \{\s*if \(typeof loadMenuItems === 'function'\) loadMenuItems\(\);\s*\}/;
const newSwitchTab = `} else if (tabId === 'menu') {
                if (typeof loadMenuCategories === 'function' && (!menuCategories || menuCategories.length === 0)) {
                    loadMenuCategories().then(() => {
                        if (typeof loadMenuItems === 'function') loadMenuItems();
                    });
                } else {
                    if (typeof loadMenuItems === 'function') loadMenuItems();
                }
            }`;
if (content.match(oldSwitchTab)) {
    content = content.replace(oldSwitchTab, newSwitchTab);
    console.log('Patched switchTab');
} else {
    console.log('Failed to patch switchTab');
}

// 6. Make sure renderMenuItems displays the branch
const oldRenderCard = /<p style="color: rgba\(255,255,255,0\.7\); font-size: 14px; margin: 4px 0;">\s*<strong>Kategorie:<\/strong> \$\{category \? category\.name : item\.category_id \|\| 'N\/A'\}<br>\s*<strong>Preis:<\/strong> \$\{parseFloat\(item\.price\)\.toFixed\(2\)\}€\s*<\/p>/;
const newRenderCard = `<p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 4px 0;">
                            <strong>Kategorie:</strong> \${category ? category.name : item.category_id || 'N/A'} 
                            <span style="color: rgba(255,255,255,0.4); margin-left: 8px; font-size: 12px;">(Cơ sở: \${item.branch_id === 'branch_flora' ? 'Flora' : (item.branch_id === 'branch_haupt' ? 'Hauptstraße' : 'Chung')})</span><br>
                            <strong>Preis:</strong> \${parseFloat(item.price).toFixed(2)}€
                        </p>`;
if (content.match(oldRenderCard)) {
    content = content.replace(oldRenderCard, newRenderCard);
    console.log('Patched renderMenuItems');
} else {
    console.log('Failed to patch renderMenuItems');
}

fs.writeFileSync('admin.html', content, 'utf8');
