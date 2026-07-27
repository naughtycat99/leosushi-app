
        window.onerror = function(msg, url, line, col, error) {
            alert('🚨 LỖI TRÌNH DUYỆT (Chụp màn hình gửi tôi):\n\n' + msg + '\nLine: ' + line + '\n' + (error ? error.stack : ''));
            return false;
        };
        window.addEventListener('unhandledrejection', function(event) {
            alert('🚨 LỖI NGẦM (Chụp màn hình gửi tôi):\n\n' + event.reason);
        });
    