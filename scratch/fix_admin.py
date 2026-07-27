import sys

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            document.body.appendChild(toast);
            });
        });"""

replacement = """            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        window.showMenuNotification = showMenuNotification;

        // Close mobile stats dropdown when clicking outside
        document.addEventListener('click', function (event) {
            const dropdowns = document.querySelectorAll('.custom-stats-menu.active');
            dropdowns.forEach(menu => {
                // Check if click is outside the menu and its button
                if (!menu.contains(event.target) && !menu.previousElementSibling.contains(event.target)) {
                    menu.classList.remove('active');
                }
            });
        });"""

content = content.replace(target.replace("\r", ""), replacement)

# Now fix the auto-print condition:
target_print = """                if (order.status === 'cancelled' || order.status === 'completed') return;"""
replacement_print = """                if (order.status !== 'confirmed') return;"""
content = content.replace(target_print, replacement_print)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
