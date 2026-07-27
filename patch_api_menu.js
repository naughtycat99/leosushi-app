const fs = require('fs');
let content = fs.readFileSync('api/menu.php', 'utf8');

const regex = /\$isAdmin = isset\(\$_GET\['admin'\]\) && \$_GET\['admin'\] === 'true';\s*if \(!\$isAdmin\) \{\s*\$whereConditions\[\] = '\(mi\.available = 1 OR mi\.available IS NULL\)';\s*\}/g;
const replacement = `// Removed filtering by available so frontend can show 'Sold out' status
        $isAdmin = isset($_GET['admin']) && $_GET['admin'] === 'true';`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('api/menu.php', content, 'utf8');
    console.log('Successfully patched api/menu.php');
} else {
    console.log('Could not find code to replace in api/menu.php');
}
