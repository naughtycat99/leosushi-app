<?php
/**
 * Birthday Promotion Cron Job
 * Chạy script này mỗi ngày để check và gửi email mã khuyến mãi sinh nhật
 * 
 * Cách chạy:
 * - Windows Task Scheduler: php api/birthday-cron.php
 * - Linux Cron: 0 9 * * * /usr/bin/php /path/to/api/birthday-cron.php
 * - Hoặc gọi qua URL: https://yourdomain.com/api/birthday-cron.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/mailer.php';

// Set headers
header('Content-Type: application/json; charset=utf-8');

// Optional: Add security token check
$cronToken = $_GET['token'] ?? '';
$expectedToken = getenv('BIRTHDAY_CRON_TOKEN') ?: 'your-secret-token-here';

if (!empty($expectedToken) && $cronToken !== $expectedToken) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    $conn = getDbConnection();
    $today = date('Y-m-d');
    
    // Get customers whose birthday is today
    $stmt = $conn->prepare('
        SELECT id, email, first_name, last_name, birthday 
        FROM customers 
        WHERE birthday IS NOT NULL 
        AND DATE_FORMAT(birthday, "%m-%d") = DATE_FORMAT(?, "%m-%d")
        AND email_verified = 1
    ');
    $stmt->bind_param('s', $today);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $customers = [];
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }
    
    if (empty($customers)) {
        echo json_encode([
            'success' => true,
            'message' => 'No birthdays today',
            'count' => 0
        ]);
        exit;
    }
    
    $results = [
        'sent' => [],
        'failed' => []
    ];
    
    foreach ($customers as $customer) {
        try {
            // Check if birthday promotion already exists for this year
            $year = date('Y');
            $checkStmt = $conn->prepare('
                SELECT promotion_id FROM birthday_promotions 
                WHERE customer_id = ? AND birthday_year = ?
            ');
            $checkStmt->bind_param('si', $customer['id'], $year);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();
            
            if ($checkResult->num_rows > 0) {
                // Promotion already sent this year
                $results['sent'][] = [
                    'email' => $customer['email'],
                    'message' => 'Birthday promotion already sent this year'
                ];
                continue;
            }
            
            // Create birthday promotion
            $promoCode = 'LEO-BIRTHDAY-' . strtoupper(substr(md5($customer['id'] . $year), 0, 8));
            $promoId = 'PROMO-' . strtoupper(substr(md5($promoCode . time()), 0, 8));
            
            $startDate = date('Y-m-d');
            $endDate = date('Y-m-d', strtotime('+7 days'));
            
            $conn->begin_transaction();
            
            try {
                // Create promotion (20% off, valid for 7 days)
                $promoStmt = $conn->prepare('
                    INSERT INTO promotions (
                        promotion_id, code, discount_type, discount_value, min_order, max_discount,
                        start_date, end_date, usage_limit, per_user_limit, first_order_only, status
                    ) VALUES (?, ?, "percentage", 20.00, 0, NULL, ?, ?, 1, 1, 0, "active")
                ');
                $promoStmt->bind_param('ssss', $promoId, $promoCode, $startDate, $endDate);
                $promoStmt->execute();
                
                // Record birthday promotion
                $birthdayStmt = $conn->prepare('
                    INSERT INTO birthday_promotions (customer_id, promotion_id, birthday_year)
                    VALUES (?, ?, ?)
                ');
                $birthdayStmt->bind_param('ssi', $customer['id'], $promoId, $year);
                $birthdayStmt->execute();
                
                $conn->commit();
                
                // Send birthday promotion email
                $customerName = trim($customer['first_name'] . ' ' . $customer['last_name']);
                sendBirthdayPromotionEmail($customer['email'], $customerName, $promoCode, $endDate);
                
                $results['sent'][] = [
                    'email' => $customer['email'],
                    'promo_code' => $promoCode,
                    'message' => 'Birthday promotion sent successfully'
                ];
                
            } catch (Exception $e) {
                $conn->rollback();
                throw $e;
            }
            
        } catch (Exception $e) {
            error_log('Error processing birthday for ' . $customer['email'] . ': ' . $e->getMessage());
            $results['failed'][] = [
                'email' => $customer['email'],
                'error' => $e->getMessage()
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'date' => $today,
        'total_customers' => count($customers),
        'sent' => count($results['sent']),
        'failed' => count($results['failed']),
        'results' => $results
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
    error_log('Birthday cron error: ' . $e->getMessage());
}

/**
 * Send birthday promotion email
 */
function sendBirthdayPromotionEmail($email, $customerName, $promoCode, $validUntil) {
    try {
        $subject = '🎂 Alles Gute zum Geburtstag! Ihr besonderer Gutschein von LEO SUSHI';
        
        $htmlContent = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Geburtstagsgutschein</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #e5cf8e 0%, #d4af37 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #1a1a1a; margin: 0; font-size: 32px;">🎂 Alles Gute zum Geburtstag!</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <p style="font-size: 18px; color: #333; line-height: 1.6;">
                        Liebe/r ' . htmlspecialchars($customerName) . ',
                    </p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Wir wünschen Ihnen alles Gute zum Geburtstag! 🎉
                    </p>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Als kleines Geschenk haben wir einen <strong style="color: #d4af37;">exklusiven Geburtstagsgutschein</strong> für Sie vorbereitet:
                    </p>
                    <div style="background: linear-gradient(135deg, #e5cf8e 0%, #d4af37 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 24px; font-weight: bold; color: #1a1a1a; margin-bottom: 10px;">
                            ' . htmlspecialchars($promoCode) . '
                        </div>
                        <div style="font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 15px 0;">
                            20% RABATT
                        </div>
                        <div style="font-size: 14px; color: #1a1a1a; margin-top: 10px;">
                            Gültig bis: ' . date('d.m.Y', strtotime($validUntil)) . '
                        </div>
                    </div>
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Verwenden Sie diesen Code bei Ihrer nächsten Bestellung und genießen Sie 20% Rabatt auf Ihre gesamte Bestellung!
                    </p>
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/menu.html" 
                           style="display: inline-block; background: linear-gradient(135deg, #e5cf8e 0%, #d4af37 100%); color: #1a1a1a; 
                                  padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Jetzt bestellen
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #888; line-height: 1.6; margin-top: 30px;">
                        Wir freuen uns, Sie wieder bei LEO SUSHI begrüßen zu dürfen!
                    </p>
                    <p style="font-size: 14px; color: #888; line-height: 1.6;">
                        Herzliche Grüße,<br>
                        <strong>Das Team von LEO SUSHI</strong>
                    </p>
                </div>
            </div>
        </body>
        </html>
        ';
        
        sendEmail($email, $subject, $htmlContent);
        
    } catch (Exception $e) {
        error_log('Error sending birthday email to ' . $email . ': ' . $e->getMessage());
        throw $e;
    }
}

