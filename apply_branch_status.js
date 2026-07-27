const fs = require('fs');

// 1. Update api/store_status.php
const phpCode = `<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$statusFile = __DIR__ . '/store_status.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($statusFile)) {
        echo file_get_contents($statusFile);
    } else {
        echo json_encode(["is_open" => true]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['is_open'])) {
        $isOpen = (bool)$input['is_open'];
        $branch = isset($input['branch']) ? $input['branch'] : null;
        
        $currentData = ["is_open" => true, "branches" => ["branch_flora" => true, "branch_haupt" => true]];
        if (file_exists($statusFile)) {
            $savedData = json_decode(file_get_contents($statusFile), true);
            if ($savedData) {
                $currentData = array_merge($currentData, $savedData);
            }
        }

        if ($branch) {
            $currentData['branches'][$branch] = $isOpen;
        } else {
            $currentData['is_open'] = $isOpen;
            $currentData['branches'] = [
                'branch_flora' => $isOpen,
                'branch_haupt' => $isOpen
            ];
        }

        file_put_contents($statusFile, json_encode($currentData));
        echo json_encode(["success" => true, "data" => $currentData]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing is_open field"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
`;
fs.writeFileSync('api/store_status.php', phpCode, 'utf8');

// 2. Update js/main.js
let mainJs = fs.readFileSync('js/main.js', 'utf8');
const mainJsOldFetch = `window.STORE_IS_OPEN = data.is_open !== false;
     if (!window.STORE_IS_OPEN) {`;
const mainJsNewFetch = `let storeIsOpen = data.is_open !== false;
     try {
         const currentSaved = localStorage.getItem('leoSelectedBranch');
         if (currentSaved) {
             const parsed = JSON.parse(currentSaved);
             if (parsed && parsed.id && data.branches && typeof data.branches[parsed.id] !== 'undefined') {
                 storeIsOpen = data.branches[parsed.id] !== false;
             }
         }
     } catch (e) {}
     window.STORE_IS_OPEN = storeIsOpen;
     if (!window.STORE_IS_OPEN) {`;
mainJs = mainJs.replace(mainJsOldFetch, mainJsNewFetch);
fs.writeFileSync('js/main.js', mainJs, 'utf8');

// 3. Update admin.html
let adminHtml = fs.readFileSync('admin.html', 'utf8');
const toggleFuncOld = `async function toggleStoreStatus(isOpen) {
            try {
                const response = await fetch('api/store_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_open: isOpen })
                });`;
const toggleFuncNew = `async function toggleStoreStatus(isOpen) {
            try {
                let currentBranch = null;
                try {
                    const savedRole = localStorage.getItem('leo_admin_role');
                    if (savedRole && savedRole.startsWith('{')) {
                        const roleObj = JSON.parse(savedRole);
                        currentBranch = roleObj.branch;
                    }
                } catch (e) {}
                
                const response = await fetch('api/store_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_open: isOpen, branch: currentBranch })
                });`;
adminHtml = adminHtml.replace(toggleFuncOld, toggleFuncNew);

// Also need to fix the admin dashboard initialization to check the correct state of the toggle
// Let's find where the toggle is initialized on load
const initAdminHtmlOld = `// Initialize toggle state from store_status.php
        fetch('api/store_status.php')
            .then(res => res.json())
            .then(data => {
                const toggle = document.getElementById('storeStatusToggle');
                if (toggle) {
                    toggle.checked = data.is_open !== false;
                }
            })
            .catch(console.error);`;
            
const initAdminHtmlNew = `// Initialize toggle state from store_status.php
        fetch('api/store_status.php')
            .then(res => res.json())
            .then(data => {
                const toggle = document.getElementById('storeStatusToggle');
                if (toggle) {
                    let isOpen = data.is_open !== false;
                    try {
                        const savedRole = localStorage.getItem('leo_admin_role');
                        if (savedRole && savedRole.startsWith('{')) {
                            const roleObj = JSON.parse(savedRole);
                            if (roleObj.branch && data.branches && typeof data.branches[roleObj.branch] !== 'undefined') {
                                isOpen = data.branches[roleObj.branch] !== false;
                            }
                        }
                    } catch (e) {}
                    toggle.checked = isOpen;
                }
            })
            .catch(console.error);`;
if (adminHtml.includes(initAdminHtmlOld)) {
    adminHtml = adminHtml.replace(initAdminHtmlOld, initAdminHtmlNew);
} else {
    // maybe it doesn't have the exact comment, search with regex
    const regex = /fetch\('api\/store_status\.php'\)[\s\S]*?toggle\.checked = data\.is_open !== false;[\s\S]*?\}\)[\s\S]*?\.catch\(console\.error\);/;
    adminHtml = adminHtml.replace(regex, initAdminHtmlNew);
}
fs.writeFileSync('admin.html', adminHtml, 'utf8');

console.log('Successfully applied branch-specific store status changes.');
