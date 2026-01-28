<?php
/**
 * Email sender using PHPMailer (SMTP Gmail)
 */

require_once __DIR__ . '/config.php';

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

function logMailEvent($message) {
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0777, true);
    }
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL;
    file_put_contents($logDir . '/mail.log', $line, FILE_APPEND);
}

function sendTemplatedEmail($to, $subject, $templatePath, $variables = []) {
    if (!file_exists($templatePath)) {
        throw new Exception("Email template not found: {$templatePath}");
    }

    $html = file_get_contents($templatePath);
    foreach ($variables as $key => $value) {
        $placeholder = '{{' . strtoupper($key) . '}}';
        $html = str_replace($placeholder, $value, $html);
    }

    $text = strip_tags(preg_replace('/<br\s*\/?\s*>/i', "\n", $html));
    logMailEvent("Sending email to {$to} with subject '{$subject}' using template {$templatePath}");
    return sendSmtpEmail($to, $subject, $html, $text);
}

function sendVerificationEmailTemplate($to, $name, $code) {
    $template = __DIR__ . '/email-templates/verification-email.html';
    return sendTemplatedEmail($to, 'Bitte bestätigen Sie Ihre E-Mail-Adresse', $template, [
        'name' => $name ?: 'Gast',
        'verification_code' => $code,
        'year' => date('Y')
    ]);
}

function sendThankYouEmailTemplate($to, $name, $discountCode) {
    $template = __DIR__ . '/email-templates/thank-you-email.html';
    return sendTemplatedEmail($to, 'Willkommen bei LEO SUSHI', $template, [
        'name' => $name ?: 'Gast',
        'discount_code' => $discountCode,
        'year' => date('Y')
    ]);
}

function sendWelcomeDiscountEmailTemplate($to, $name, $discountCode) {
    $template = __DIR__ . '/email-templates/welcome-discount-email.html';
    return sendTemplatedEmail($to, 'Willkommen bei LEO SUSHI - Ihr Gutscheincode', $template, [
        'name' => $name ?: 'Gast',
        'discount_code' => $discountCode,
        'year' => date('Y')
    ]);
}

function sendPasswordResetEmailTemplate($to, $name, $resetLink) {
    $template = __DIR__ . '/email-templates/password-reset-email.html';
    return sendTemplatedEmail($to, 'Passwort zurücksetzen - LEO SUSHI', $template, [
        'name' => $name ?: 'Gast',
        'reset_link' => $resetLink,
        'year' => date('Y')
    ]);
}

function sendPromotionEmailTemplate($to, $name, $discountCode, $discountPercent = 0, $discountAmount = 0, $minOrder = 0, $message = '', $validUntil = '') {
    $template = __DIR__ . '/email-templates/promotion-email.html';
    
    // Build message box HTML
    $messageBox = '';
    if (!empty($message)) {
        $messageBox = '<div class="message-box"><p class="text">' . htmlspecialchars($message) . '</p></div>';
    }
    
    // Build discount details HTML
    $discountDetails = '';
    if ($discountPercent > 0) {
        $discountDetails .= '<div>Giảm ' . $discountPercent . '% cho đơn hàng của bạn</div>';
    }
    if ($discountAmount > 0) {
        $discountDetails .= '<div>Giảm ' . number_format($discountAmount, 2) . '€ cho đơn hàng của bạn</div>';
    }
    if ($minOrder > 0) {
        $discountDetails .= '<div style="margin-top: 8px; font-size: 13px; color: rgba(255,255,255,0.7);">Áp dụng cho đơn hàng từ ' . number_format($minOrder, 2) . '€</div>';
    }
    if (!empty($validUntil)) {
        $discountDetails .= '<div style="margin-top: 8px; font-size: 13px; color: rgba(255,255,255,0.7);">Có hiệu lực đến: ' . htmlspecialchars($validUntil) . '</div>';
    }
    
    $variables = [
        'name' => $name ?: 'Gast',
        'discount_code' => $discountCode,
        'message_box' => $messageBox,
        'discount_details' => $discountDetails,
        'year' => date('Y')
    ];
    
    return sendTemplatedEmail($to, 'Khuyến mãi đặc biệt từ LEO SUSHI', $template, $variables);
}

function sendOrderConfirmationEmail($to, $variables = []) {
    $itemsHtml = '';
    if (!empty($variables['order_items']) && is_array($variables['order_items'])) {
        foreach ($variables['order_items'] as $item) {
            $itemsHtml .= '<div class="item">';
            $itemsHtml .= '<span class="item-name">' . htmlspecialchars($item['name']) . ' x' . htmlspecialchars($item['quantity']) . '</span>';
            $itemsHtml .= '<span class="item-total">' . htmlspecialchars($item['total']) . '</span>';
            $itemsHtml .= '</div>';
        }
    } else if (!empty($variables['order_items']) && is_string($variables['order_items'])) {
        $itemsHtml = $variables['order_items'];
    }

    $template = __DIR__ . '/email-templates/order-confirmation-email.html';
    return sendTemplatedEmail($to, 'Ihre Bestellung bei LEO SUSHI', $template, array_merge([
        'name' => 'Gast',
        'order_id' => 'LEO-' . date('His'),
        'order_time' => date('d.m.Y H:i'),
        'service_type' => 'Abholung',
        'payment_method' => 'Barzahlung',
        'delivery_address' => '',
        'phone' => '',
        'order_items' => $itemsHtml,
        'order_total' => '0,00 €',
        'eta' => '30 Minuten',
        'discount_code' => '', // Mã khuyến mãi sẽ được thêm nếu có
        'year' => date('Y')
    ], $variables));
}

/**
 * Gửi email xác nhận đơn hàng kèm mã khuyến mãi
 */
function sendOrderConfirmationWithDiscountCode($to, $name, $orderData, $discountCode = null) {
    // Build order items HTML
    $itemsHtml = '';
    if (!empty($orderData['items']) && is_array($orderData['items'])) {
        foreach ($orderData['items'] as $item) {
            $itemsHtml .= '<div class="item">';
            $itemsHtml .= '<span class="item-name">' . htmlspecialchars($item['name'] ?? '') . ' x' . htmlspecialchars($item['quantity'] ?? 1) . '</span>';
            $itemsHtml .= '<span class="item-total">' . htmlspecialchars($item['total'] ?? '0,00 €') . '</span>';
            $itemsHtml .= '</div>';
        }
    }
    
    // Build discount code section if provided
    $discountSection = '';
    if (!empty($discountCode)) {
        $discountSection = '
            <div style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 8px 0;">🎁 Mã khuyến mãi cho lần đặt hàng tiếp theo:</p>
                <p style="color: #d4af37; font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 0;">' . htmlspecialchars($discountCode) . '</p>
            </div>
        ';
    }
    
    $variables = [
        'name' => $name ?: 'Gast',
        'order_id' => $orderData['order_id'] ?? 'LEO-' . date('His'),
        'order_time' => date('d.m.Y H:i'),
        'service_type' => $orderData['service_type'] ?? 'Abholung',
        'payment_method' => $orderData['payment_method'] ?? 'Barzahlung',
        'delivery_address' => '',
        'phone' => '',
        'order_items' => $itemsHtml,
        'order_total' => $orderData['total'] ?? '0,00 €',
        'eta' => $orderData['eta'] ?? '30 Minuten',
        'discount_code_section' => $discountSection,
        'year' => date('Y')
    ];
    
    $template = __DIR__ . '/email-templates/order-confirmation-email.html';
    return sendTemplatedEmail($to, 'Ihre Bestellung bei LEO SUSHI', $template, $variables);
}

function sendResendEmail($to, $subject, $htmlBody, $textBody = '') {
    $apiKey = RESEND_API_KEY;
    $fromEmail = SMTP_FROM_EMAIL;
    $fromName = SMTP_FROM_NAME;
    
    if (empty($apiKey)) {
        throw new Exception('Resend API key is missing. Please update api/config.php');
    }
    
    $url = 'https://api.resend.com/emails';
    
    $data = [
        'from' => "{$fromName} <{$fromEmail}>",
        'to' => [$to],
        'subject' => $subject,
        'html' => $htmlBody
    ];
    
    if (!empty($textBody)) {
        $data['text'] = $textBody;
    }
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        logMailEvent("Resend API error: {$error}");
        throw new Exception("Resend API error: {$error}");
    }
    
    $result = json_decode($response, true);
    
    if ($httpCode !== 200) {
        $errorMsg = $result['message'] ?? 'Unknown error';
        logMailEvent("Resend API error ({$httpCode}): {$errorMsg}");
        throw new Exception("Resend API error ({$httpCode}): {$errorMsg}");
    }
    
    logMailEvent("Email sent successfully to {$to} via Resend API (ID: {$result['id']})");
    return true;
}

function sendSmtpEmail($to, $subject, $htmlBody, $textBody = '') {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $username = SMTP_USERNAME;
    $password = SMTP_PASSWORD;
    $encryption = strtolower(SMTP_ENCRYPTION);
    $fromEmail = SMTP_FROM_EMAIL;
    $fromName = SMTP_FROM_NAME;

    if (empty($host) || empty($port) || empty($fromEmail)) {
        throw new Exception('SMTP configuration is missing. Please update api/config.php');
    }

    // Use PHPMailer for reliable SMTP
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $username;
        
        // Remove spaces from app password and log for debugging
        $cleanPassword = str_replace(' ', '', trim($password));
        $mail->Password = $cleanPassword;
        
        // Log password info (without exposing actual password)
        logMailEvent("SMTP Auth - Username: {$username}, Password length: " . strlen($cleanPassword) . " chars");
        
        $mail->SMTPSecure = $encryption === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';
        
        // Additional settings for Gmail
        // Disable SSL verification for compatibility
        // In production with proper CA certificates, you can enable verification
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => false
            )
        );
        $mail->Timeout = 30;
        
        // Recipients
        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        if (!empty($textBody)) {
            $mail->AltBody = $textBody;
        }
        
        $mail->send();
        logMailEvent("Email sent successfully to {$to} via PHPMailer");
        return true;
    } catch (Exception $e) {
        $errorMsg = "PHPMailer error: {$mail->ErrorInfo}";
        logMailEvent($errorMsg);
        
        // More detailed error logging
        if (strpos($errorMsg, '535') !== false || strpos($errorMsg, 'BadCredentials') !== false) {
            logMailEvent("Gmail authentication failed. Please verify:");
            logMailEvent("1. App password is correct (16 characters, no spaces)");
            logMailEvent("2. 2-Step Verification is enabled");
            logMailEvent("3. App password was created for 'Mail' application");
            logMailEvent("4. Wait 2-3 minutes after creating new app password");
        }
        
        throw new Exception($errorMsg);
    }
}

// Old SMTP client (kept for reference, not used)
function sendSmtpEmailOld($to, $subject, $htmlBody, $textBody = '') {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $username = SMTP_USERNAME;
    $password = SMTP_PASSWORD;
    $encryption = strtolower(SMTP_ENCRYPTION);
    $fromEmail = SMTP_FROM_EMAIL;
    $fromName = SMTP_FROM_NAME;

    if (empty($host) || empty($port) || empty($fromEmail)) {
        throw new Exception('SMTP configuration is missing. Please update api/config.php');
    }

    $remoteHost = $host;
    if ($encryption === 'ssl') {
        $remoteHost = "ssl://{$host}";
    }

    $connection = fsockopen($remoteHost, $port, $errno, $errstr, 30);
    if (!$connection) {
        logMailEvent("SMTP connection failed: {$errstr} ({$errno})");
        throw new Exception("SMTP connection failed: {$errstr} ({$errno})");
    }

    stream_set_timeout($connection, 30);

    smtpExpectResponse($connection, 220);

    $domain = parse_url(FRONTEND_URL, PHP_URL_HOST) ?: 'localhost';
    smtpCommand($connection, "EHLO {$domain}", 250);

    if ($encryption === 'tls') {
        smtpCommand($connection, "STARTTLS", 220);
        if (!stream_socket_enable_crypto($connection, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new Exception('Failed to enable TLS encryption');
        }
        smtpCommand($connection, "EHLO {$domain}", 250);
    }

    if (!empty($username)) {
        // Remove spaces from app password (Gmail displays them in groups but they shouldn't be sent)
        $cleanPassword = str_replace(' ', '', trim($password));
        logMailEvent("Attempting AUTH with username: " . $username . ", password length: " . strlen($cleanPassword));
        smtpCommand($connection, "AUTH LOGIN", 334);
        smtpCommand($connection, base64_encode($username), 334);
        smtpCommand($connection, base64_encode($cleanPassword), 235);
    }

    smtpCommand($connection, "MAIL FROM:<{$fromEmail}>", 250);
    smtpCommand($connection, "RCPT TO:<{$to}>", 250);
    smtpCommand($connection, "DATA", 354);

    $boundary = md5(uniqid(time()));
    $headers = [];
    $headers[] = "Date: " . date('r');
    $headers[] = "From: {$fromName} <{$fromEmail}>";
    $headers[] = "Reply-To: {$fromEmail}";
    $headers[] = "To: <{$to}>";
    $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

    if (empty($textBody)) {
        $textBody = strip_tags($htmlBody);
    }

    $body = [];
    $body[] = "--{$boundary}";
    $body[] = "Content-Type: text/plain; charset=utf-8";
    $body[] = "Content-Transfer-Encoding: base64";
    $body[] = "";
    $body[] = chunk_split(base64_encode($textBody));

    $body[] = "--{$boundary}";
    $body[] = "Content-Type: text/html; charset=utf-8";
    $body[] = "Content-Transfer-Encoding: base64";
    $body[] = "";
    $body[] = chunk_split(base64_encode($htmlBody));
    $body[] = "--{$boundary}--";
    $body[] = "";

    $message = implode("\r\n", $headers) . "\r\n\r\n" . implode("\r\n", $body);
    smtpSendData($connection, $message);
    smtpCommand($connection, ".", 250);
    smtpCommand($connection, "QUIT", 221);
    fclose($connection);

    logMailEvent("Email sent successfully to {$to}");
    return true;
}

function smtpCommand($connection, $command, $expectedCode = null) {
    fwrite($connection, $command . "\r\n");
    return smtpExpectResponse($connection, $expectedCode);
}

function smtpCommandRaw($connection, $data) {
    fwrite($connection, $data . "\r\n");
}

function smtpSendData($connection, $data) {
    // Ensure CRLF line endings
    $normalized = preg_replace("/(?<!\r)\n/", "\r\n", $data);
    // Dot-stuffing: lines beginning with '.' must be prefixed with another '.'
    $normalized = preg_replace("/\r\n\./", "\r\n..", $normalized);
    if (strpos($normalized, '.') === 0) {
        $normalized = '.' . $normalized;
    }
    fwrite($connection, $normalized . "\r\n");
}

function smtpExpectResponse($connection, $expectedCode = null) {
    $response = '';
    while ($line = fgets($connection, 515)) {
        $response .= $line;
        if (substr($line, 3, 1) === ' ') {
            break;
        }
    }

    if ($response === '') {
        throw new Exception('No response from SMTP server');
    }

    if ($expectedCode !== null) {
        $code = (int)substr($response, 0, 3);
        if ($code !== (int)$expectedCode && $code >= 400) {
            logMailEvent("SMTP error ({$code}): {$response}");
            throw new Exception("SMTP error ({$code}): {$response}");
        }
    }

    return $response;
}

