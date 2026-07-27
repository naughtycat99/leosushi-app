import sys
import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """        function startAlarm() {
            // If already running, reset play count so it plays 3 times for the new order
            _alarmPlayCount = 0;
            if (_alarmInterval) {
                console.log('🚨 startAlarm: Alarm already running, reset play count to 0');
                return;
            }
            console.log('🚨 startAlarm: Starting repeating alarm (max 3 times)');
            
            // Play immediately (1st time)
            playNotificationSound();
            _alarmPlayCount++;
            
            // Repeat every 5 seconds, up to 10 times
            _alarmInterval = setInterval(() => {
                if (_alarmPlayCount >= 10) {
                    console.log('🚨 Alarm played 10 times, stopping repeat.');
                    stopAlarm();
                    return;
                }
                playNotificationSound();
                _alarmPlayCount++;
            }, 5000);
        }

        function stopAlarm() {
            if (_alarmInterval) {
                console.log('🚨 stopAlarm: Stopping repeating alarm');
                clearInterval(_alarmInterval);
                _alarmInterval = null;
            }
            _pendingAlarmOrders = 0;
            _alarmPlayCount = 0;
        }"""

replacement = """        function startAlarm() {
            _alarmPlayCount = 0;
            if (_alarmInterval) {
                console.log('🚨 startAlarm: Alarm already running, reset play count to 0');
                return;
            }
            console.log('🚨 startAlarm: Starting alarm cycle');
            
            function alarmLoop() {
                if (_alarmPlayCount < 10) {
                    playNotificationSound();
                    _alarmPlayCount++;
                    _alarmInterval = setTimeout(alarmLoop, 5000); // Ring every 5 seconds
                } else {
                    console.log('🚨 Alarm played 10 times, pausing for 30 seconds.');
                    _alarmPlayCount = 0; // Reset for next cycle
                    _alarmInterval = setTimeout(alarmLoop, 30000); // Wait 30 seconds
                }
            }
            
            alarmLoop(); // Start immediately
        }

        function stopAlarm() {
            if (_alarmInterval) {
                console.log('🚨 stopAlarm: Stopping alarm');
                clearTimeout(_alarmInterval);
                _alarmInterval = null;
            }
            _pendingAlarmOrders = 0;
            _alarmPlayCount = 0;
        }"""

content = content.replace(target, replacement)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
