import sys

with open('api/orders.php', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                        }
                        elseif ($eta) {
                            $finalEta = $eta . ' Min.';
                        }
                        else {"""

replacement = """                        }
                        elseif ($eta) {
                            // Convert ETA like "30 min" into exact time like "19:45 Uhr"
                            $parsedMins = 0;
                            if (preg_match('/^\\s*(\\d+)\\s*(min|m|phút|h|hour)\\b/i', $eta, $matches)) {
                                $parsedMins = intval($matches[1]);
                                if (strtolower(substr($matches[2], 0, 1)) === 'h') {
                                    $parsedMins *= 60;
                                }
                            } elseif (preg_match('/^\\d+$/', trim($eta))) {
                                $parsedMins = intval(trim($eta));
                            }
                            
                            if ($parsedMins > 0) {
                                // Default timezone for Berlin
                                $tz = new DateTimeZone('Europe/Berlin');
                                $dt = new DateTime('now', $tz);
                                $dt->modify("+$parsedMins minutes");
                                $finalEta = $dt->format('H:i') . ' Uhr';
                            } else {
                                $finalEta = $eta;
                            }
                        }
                        else {"""

content = content.replace(target, replacement)

with open('api/orders.php', 'w', encoding='utf-8') as f:
    f.write(content)
