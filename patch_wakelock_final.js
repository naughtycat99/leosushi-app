const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const wakeLockCode = `
<script>
        // Auto-WakeLock for POS to keep screen ON
        let autoWakeLock = null;
        async function requestAutoWakeLock() {
            if (!autoWakeLock && 'wakeLock' in navigator) {
                try {
                    autoWakeLock = await navigator.wakeLock.request('screen');
                    console.log('✅ Auto-WakeLock acquired. Screen will stay ON.');
                    autoWakeLock.addEventListener('release', () => {
                        autoWakeLock = null;
                        console.log('WakeLock released');
                        // Re-request after release (e.g. if user switched tabs and came back)
                        setTimeout(requestAutoWakeLock, 1000);
                    });
                } catch (err) {
                    console.log('Auto-WakeLock failed:', err);
                }
            }
        }
        document.addEventListener('click', requestAutoWakeLock, { once: true });
        document.addEventListener('touchstart', requestAutoWakeLock, { once: true });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') requestAutoWakeLock();
        });
</script>
`;

if (!content.includes('requestAutoWakeLock')) {
    content = content.replace('</html>', '</body>\n' + wakeLockCode + '\n</html>');
    fs.writeFileSync('admin.html', content, 'utf8');
    console.log('Successfully injected WakeLock at the end of the document.');
} else {
    console.log('WakeLock code already exists somewhere.');
}
