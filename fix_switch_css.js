const fs = require('fs');
let cssContent = fs.readFileSync('css/admin-style.css', 'utf8');

// Check if .switch already exists
if (!cssContent.includes('.switch')) {
    const switchCSS = `
/* Toggle Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  margin: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #10b981; /* Emerald green */
}

input:focus + .slider {
  box-shadow: 0 0 1px #10b981;
}

input:checked + .slider:before {
  transform: translateX(20px);
}
`;
    fs.writeFileSync('css/admin-style.css', cssContent + switchCSS, 'utf8');
    console.log('Added switch CSS to admin-style.css');
} else {
    console.log('Switch CSS already exists');
}

// Clean up inline styles in admin.html for the switch
let htmlContent = fs.readFileSync('admin.html', 'utf8');
const oldSwitch = `<label class="switch" style="position: relative; display: inline-block; width: 44px; height: 24px; margin: 0;">
                                <input type="checkbox" id="storeStatusToggle" checked onchange="toggleStoreStatus(this.checked)" style="opacity: 0; width: 0; height: 0; position: absolute; margin: 0;">
                                <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>`;
const newSwitch = `<label class="switch">
                                <input type="checkbox" id="storeStatusToggle" checked onchange="toggleStoreStatus(this.checked)">
                                <span class="slider round"></span>
                            </label>`;

if (htmlContent.includes(oldSwitch)) {
    htmlContent = htmlContent.replace(oldSwitch, newSwitch);
    fs.writeFileSync('admin.html', htmlContent, 'utf8');
    console.log('Cleaned up inline styles for switch in admin.html');
} else {
    console.log('Could not find the exact old switch HTML to replace');
    // Try to find it by regex to be safe
    const regex = /<label class="switch".*?<\/label>/s;
    const match = htmlContent.match(regex);
    if(match) {
        console.log('Found it with regex, replacing...');
        htmlContent = htmlContent.replace(match[0], newSwitch);
        fs.writeFileSync('admin.html', htmlContent, 'utf8');
    }
}
