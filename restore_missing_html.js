const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const searchStr = `                    </div>\n                <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">`;

const replaceStr = `                    </div>
                </div>
            </div>
        </div>
        <div class="admin-header">
            <div>
                <div>
                    <h1>🍣 LEO SUSHI Admin Panel <span
                            style="font-size: 14px; color: var(--gold); opacity: 0.6; font-weight: normal; vertical-align: middle;">v1.1</span>
                    </h1>
                    <p style="color: rgba(255,255,255,.7); margin: 0;">Verwaltung von Bestellungen und Reservierungen
                    </p>
                </div>
                <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully restored missing HTML block');
} else {
    console.log('Could not find the search string. Let\'s try a regex.');
    const regex = /<\/div>\s*<div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">/;
    const match = content.match(regex);
    if (match) {
        content = content.replace(regex, `</div>
                </div>
            </div>
        </div>
        <div class="admin-header">
            <div>
                <div>
                    <h1>🍣 LEO SUSHI Admin Panel <span
                            style="font-size: 14px; color: var(--gold); opacity: 0.6; font-weight: normal; vertical-align: middle;">v1.1</span>
                    </h1>
                    <p style="color: rgba(255,255,255,.7); margin: 0;">Verwaltung von Bestellungen und Reservierungen
                    </p>
                </div>
                <div style="margin-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">`);
        fs.writeFileSync('admin.html', content, 'utf8');
        console.log('Successfully restored missing HTML block using regex');
    } else {
        console.log('Failed completely to find the block.');
    }
}
