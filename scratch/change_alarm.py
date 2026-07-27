import sys

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """            // Repeat every 3 seconds
            _alarmInterval = setInterval(() => {
                if (_alarmPlayCount >= 30) {
                    console.log('🚨 Alarm played 30 times, stopping repeat.');
                    stopAlarm();
                    return;
                }
                playNotificationSound();
                _alarmPlayCount++;
            }, 3000);"""

replacement = """            // Repeat every 5 seconds, up to 10 times
            _alarmInterval = setInterval(() => {
                if (_alarmPlayCount >= 10) {
                    console.log('🚨 Alarm played 10 times, stopping repeat.');
                    stopAlarm();
                    return;
                }
                playNotificationSound();
                _alarmPlayCount++;
            }, 5000);"""

content = content.replace(target, replacement)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
