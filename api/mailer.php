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
    if ($html === false) $html = '';
    foreach ($variables as $key => $value) {
        $placeholder = '{{' . strtoupper($key) . '}}';
        $html = str_replace($placeholder, (string)($value ?? ''), (string)$html);
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
        $messageBox = '<div class="message-box"><p class="text">' . htmlspecialchars((string)$message) . '</p></div>';
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
        $discountDetails .= '<div style="margin-top: 8px; font-size: 13px; color: rgba(255,255,255,0.7);">Có hiệu lực đến: ' . htmlspecialchars((string)$validUntil) . '</div>';
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
            $itemNote = trim((string)($item['note'] ?? $item['notes'] ?? $item['options'] ?? ''));
            $itemsHtml .= '<div class="item">';
            $itemsHtml .= '<span class="item-name">' . htmlspecialchars((string)($item['name'] ?? '')) . ' x' . htmlspecialchars((string)($item['quantity'] ?? $item['qty'] ?? 1)) . '</span>';
            $itemsHtml .= '<span class="item-total">' . htmlspecialchars((string)($item['total'] ?? '0,00 €')) . '</span>';
            if ($itemNote !== '') {
                $itemsHtml .= '<div style="font-size: 12px; color: #d9534f; font-weight: bold; margin-top: 3px;">👉 Hinweis: ' . htmlspecialchars($itemNote) . '</div>';
            }
            $itemsHtml .= '</div>';
        }
    } else if (!empty($variables['order_items']) && is_string($variables['order_items'])) {
        $itemsHtml = $variables['order_items'];
    }

    // Translate payment method to German
    $pmStr = strtolower((string)($variables['payment_method'] ?? 'cash'));
    if (strpos($pmStr, 'paypal') !== false) {
        $payLabel = 'PayPal';
    } elseif (strpos($pmStr, 'stripe') !== false || strpos($pmStr, 'apple') !== false || strpos($pmStr, 'google') !== false || strpos($pmStr, 'online') !== false) {
        $payLabel = 'Online-Zahlung (Karte / Apple Pay)';
    } elseif (strpos($pmStr, 'card') !== false || strpos($pmStr, 'kartenzahlung') !== false || strpos($pmStr, 'thẻ') !== false) {
        $payLabel = 'Kartenzahlung';
    } else {
        $payLabel = 'Barzahlung'; // Default strictly to cash
    }

    // Translate service type to German
    $rawServiceType = $variables['service_type'] ?? 'Abholung';
    if ($rawServiceType === 'Lieferung' || $rawServiceType === 'delivery') {
        $serviceLabel = 'Lieferung';
    } elseif ($rawServiceType === 'Dine-in' || $rawServiceType === 'dine-in' || $rawServiceType === 'eat-in' || $rawServiceType === 'Im Restaurant' || $rawServiceType === 'reservation') {
        $serviceLabel = 'Im Restaurant';
    } else {
        $serviceLabel = 'Abholung';
    }

    $template = __DIR__ . '/email-templates/order-confirmation-email.html';
    return sendTemplatedEmail($to, 'Ihre Bestellung bei LEO SUSHI', $template, array_merge([
        'name' => 'Gast',
        'order_id' => 'LEO-' . date('His'),
        'order_time' => date('d.m.Y H:i'),
        'service_type' => $serviceLabel,
        'payment_method' => $payLabel,
        'delivery_address' => '',
        'phone' => '',
        'order_items' => $itemsHtml,
        'order_total' => '0,00 €',
        'eta' => 'Schnellstmoeglich',
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
            $itemNote = trim((string)($item['note'] ?? $item['notes'] ?? $item['options'] ?? ''));
            $itemsHtml .= '<div class="item">';
            $itemsHtml .= '<span class="item-name">' . htmlspecialchars((string)($item['name'] ?? '')) . ' x' . htmlspecialchars((string)($item['quantity'] ?? 1)) . '</span>';
            $itemsHtml .= '<span class="item-total">' . htmlspecialchars((string)($item['total'] ?? '0,00 €')) . '</span>';
            if ($itemNote !== '') {
                $itemsHtml .= '<div style="font-size: 12px; color: #d9534f; font-weight: bold; margin-top: 3px;">👉 Hinweis: ' . htmlspecialchars($itemNote) . '</div>';
            }
            $itemsHtml .= '</div>';
        }
    }
    
    // Build discount code section if provided
    $discountSection = '';
    if (!empty($discountCode)) {
        $discountSection = '
            <div style="background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 8px 0;">🎁 Mã khuyến mãi cho lần đặt hàng tiếp theo:</p>
                <p style="color: #d4af37; font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 0;">' . htmlspecialchars((string)$discountCode) . '</p>
            </div>
        ';
    }
    
    // Translate payment method to German
    $pmStr = strtolower((string)($orderData['payment_method'] ?? 'cash'));
    if (strpos($pmStr, 'paypal') !== false) {
        $payLabel = 'PayPal';
    } elseif (strpos($pmStr, 'stripe') !== false || strpos($pmStr, 'apple') !== false || strpos($pmStr, 'google') !== false || strpos($pmStr, 'online') !== false) {
        $payLabel = 'Online-Zahlung (Karte / Apple Pay)';
    } elseif (strpos($pmStr, 'card') !== false || strpos($pmStr, 'kartenzahlung') !== false || strpos($pmStr, 'thẻ') !== false) {
        $payLabel = 'Kartenzahlung';
    } else {
        $payLabel = 'Barzahlung'; // Default strictly to cash
    }
    
    // Translate service type to German
    $rawServiceType = $orderData['service_type'] ?? 'Abholung';
    if ($rawServiceType === 'Lieferung' || $rawServiceType === 'delivery') {
        $serviceLabel = 'Lieferung';
    } elseif ($rawServiceType === 'Dine-in' || $rawServiceType === 'dine-in' || $rawServiceType === 'eat-in' || $rawServiceType === 'Im Restaurant' || $rawServiceType === 'reservation') {
        $serviceLabel = 'Im Restaurant';
    } else {
        $serviceLabel = 'Abholung';
    }
    
    $variables = [
        'name' => $name ?: 'Gast',
        'order_id' => $orderData['order_id'] ?? 'LEO-' . date('His'),
        'order_time' => date('d.m.Y H:i'),
        'service_type' => $serviceLabel,
        'payment_method' => $payLabel,
        'delivery_address' => $orderData['delivery_address'] ?? '',
        'phone' => $orderData['phone'] ?? '',
        'order_items' => $itemsHtml,
        'order_total' => $orderData['total'] ?? $orderData['order_total'] ?? '0,00 €',
        'eta' => $orderData['eta'] ?? 'Schnellstmoeglich',
        'discount_code_section' => $discountSection,
        'year' => date('Y')
    ];
    
    $template = __DIR__ . '/email-templates/order-confirmation-email.html';
    return sendTemplatedEmail($to, 'Ihre Bestellung bei LEO SUSHI', $template, $variables);
}

function sendOrderCancellationEmail($to, $name, $orderData, $reason = '') {
    $reasonSection = '';
    if (!empty($reason)) {
        $reasonSection = '<div class="info-row"><span>Grund:</span><strong>' . htmlspecialchars((string)$reason) . '</strong></div>';
    }

    $variables = [
        'name' => $name ?: 'Gast',
        'order_id' => $orderData['order_id'] ?? 'LEO-' . date('His'),
        'order_time' => date('d.m.Y H:i'),
        'reason_section' => $reasonSection,
        'year' => date('Y')
    ];

    $template = __DIR__ . '/email-templates/order-cancellation-email.html';
    return sendTemplatedEmail($to, 'Ihre Bestellung wurde storniert - LEO SUSHI', $template, $variables);
}

function sendAdminNewOrderEmail($orderData) {
    if (!defined('ADMIN_EMAIL')) {
        return false;
    }

    // Prepare variables
    $itemsHtml = '';
    if (!empty($orderData['items']) && is_array($orderData['items'])) {
        foreach ($orderData['items'] as $item) {
            $itemNote = trim((string)($item['note'] ?? $item['notes'] ?? $item['options'] ?? ''));
            $itemsHtml .= '<tr>';
            $itemsHtml .= '<td style="padding: 8px 0; border-bottom: 1px solid #eee;">' . htmlspecialchars((string)($item['name'] ?? '')) . ' x' . htmlspecialchars((string)($item['quantity'] ?? 1));
            if ($itemNote !== '') {
                $itemsHtml .= '<div style="font-size: 12px; color: #d9534f; font-weight: bold; margin-top: 3px;">👉 HINWEIS: ' . htmlspecialchars($itemNote) . '</div>';
            }
            $itemsHtml .= '</td>';
            $itemsHtml .= '<td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; vertical-align: top;">' . htmlspecialchars((string)($item['total'] ?? '0,00 €')) . '</td>';
            $itemsHtml .= '</tr>';
        }
    }

    $serviceType = $orderData['service_type'] ?? 'Abholung';
    if ($serviceType === 'Lieferung' || $serviceType === 'delivery') {
        $serviceClass = 'badge-delivery';
        $serviceLabel = 'Lieferung 🛵';
    } elseif ($serviceType === 'Dine-in' || $serviceType === 'dine-in' || $serviceType === 'eat-in' || $serviceType === 'Im Restaurant') {
        $serviceClass = 'badge-dinein';
        $serviceLabel = 'Im Restaurant 🍽️';
    } else {
        $serviceClass = 'badge-pickup';
        $serviceLabel = 'Abholung 🥡';
    }

    // Prepare Delivery Details
    $deliveryDetails = '';
    
    if (!empty($orderData['branch'])) {
        $branchName = ($orderData['branch']['id'] === 'branch_haupt') ? 'Hauptstraße 29a' : 'Florastraße 10A';
        $deliveryDetails .= '<div class="info-row" style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 10px; margin-bottom: 15px;"><span class="info-label" style="color: #b08d00; font-weight: bold;">Filiale (Chi nhánh):</span><span class="info-value" style="color: #b08d00; font-size: 16px;">' . htmlspecialchars((string)$branchName) . '</span></div>';
    }

    if ($serviceType === 'Lieferung' || $serviceType === 'delivery') {
        $addrFormatted = '';
        if (is_array($orderData['delivery_address'] ?? null)) {
            $da = $orderData['delivery_address'];
            $addrFormatted = trim(($da['street'] ?? '') . ' ' . ($da['house_number'] ?? ($da['houseNumber'] ?? '')) . ', ' . ($da['postal'] ?? '') . ' ' . ($da['city'] ?? ''));
        } else {
            $addrFormatted = (string)($orderData['delivery_address'] ?? '');
        }
        $deliveryDetails .= '<div class="info-row"><span class="info-label">Adresse:</span><span class="info-value">' . htmlspecialchars($addrFormatted) . '</span></div>';
    }

    $noteSection = '';
    if (!empty($orderData['note'])) {
        $noteSection = '<div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 4px; border: 1px solid #ffeeba;"><strong>Hinweis:</strong> ' . htmlspecialchars((string)($orderData['note'] ?? '')) . '</div>';
    }

    $variables = [
        'order_id' => $orderData['order_id'] ?? '',
        'order_time' => date('d.m.Y H:i'),
        'service_type' => $serviceLabel,
        'service_class' => $serviceClass,
        'payment_method' => $orderData['payment_method'] ?? 'Barzahlung',
        'customer_name' => $orderData['customer_name'] ?? 'Gast',
        'phone' => $orderData['phone'] ?? '',
        'delivery_details' => $deliveryDetails,
        'note_section' => $noteSection,
        'order_items' => $itemsHtml,
        'order_total' => $orderData['total'] ?? '0,00 €',
        'year' => date('Y')
    ];

    $template = __DIR__ . '/email-templates/admin-new-order-email.html';
    $subject = '🔔 Neue Bestellung #' . ($orderData['order_id'] ?? '') . ' (' . $serviceLabel . ')';
    
    return sendTemplatedEmail(ADMIN_EMAIL, $subject, $template, $variables);
}

function sendAdminReservationEmail($reservationData) {
    if (!defined('ADMIN_EMAIL')) {
        return false;
    }

    $noteSection = '';
    if (!empty($reservationData['note'])) {
        $noteSection = '<div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 4px; border: 1px solid #ffeeba;"><strong>Hinweis:</strong> ' . htmlspecialchars((string)($reservationData['note'] ?? '')) . '</div>';
    }

    $variables = [
        'RESERVATION_ID' => $reservationData['reservation_id'] ?? '',
        'RES_DATE' => $reservationData['date'] ?? '',
        'RES_TIME' => $reservationData['time'] ?? '',
        'GUESTS' => $reservationData['guests'] ?? '1',
        'CUSTOMER_NAME' => trim(($reservationData['first_name'] ?? '') . ' ' . ($reservationData['last_name'] ?? '')),
        'PHONE' => $reservationData['phone'] ?? '',
        'EMAIL' => $reservationData['email'] ?? '',
        'NOTE_SECTION' => $noteSection,
        'YEAR' => date('Y')
    ];

    $template = __DIR__ . '/email-templates/admin-new-reservation-email.html';
    $subject = '📅 Neue Tischreservierung am ' . ($reservationData['date'] ?? '') . ' um ' . ($reservationData['time'] ?? '') . ' Uhr';
    
    return sendTemplatedEmail(ADMIN_EMAIL, $subject, $template, $variables);
}

function sendReservationConfirmationEmail($to, $name, $reservationData) {
    $variables = [
        'NAME' => $name ?: 'Gast',
        'RESERVATION_ID' => $reservationData['reservation_id'] ?? '',
        'RES_DATE' => $reservationData['date'] ?? '',
        'RES_TIME' => $reservationData['time'] ?? '',
        'GUESTS' => $reservationData['guests'] ?? '1',
        'YEAR' => date('Y')
    ];

    $template = __DIR__ . '/email-templates/reservation-confirmation-email.html';
    return sendTemplatedEmail($to, 'Ihre Tischreservierung ist bestätigt - LEO SUSHI', $template, $variables);
}

function sendReservationCancellationEmail($to, $name, $reservationData, $reason = '') {
    $reasonSection = '';
    if (!empty($reason)) {
        $reasonSection = '<div class="info-row"><span>Grund:</span><strong>' . htmlspecialchars((string)$reason) . '</strong></div>';
    }

    $variables = [
        'NAME' => $name ?: 'Gast',
        'RESERVATION_ID' => $reservationData['reservation_id'] ?? '',
        'RES_DATE' => $reservationData['date'] ?? '',
        'RES_TIME' => $reservationData['time'] ?? '',
        'GUESTS' => $reservationData['guests'] ?? '1',
        'REASON_SECTION' => $reasonSection,
        'YEAR' => date('Y')
    ];

    $template = __DIR__ . '/email-templates/reservation-cancellation-email.html';
    return sendTemplatedEmail($to, 'Ihre Tischreservierung wurde storniert - LEO SUSHI', $template, $variables);
}

/**
 * Gửi email khi tài xế bắt đầu đi giao hàng (Lieferung)
 */
function sendOrderOutForDeliveryEmail($to, $name, $orderData) {
    $orderId = $orderData['order_id'] ?? date('YmdHis');
    $shortId = preg_replace('/^(ORD-|LEO-)/', '', $orderId);
    $template = __DIR__ . '/email-templates/order-out-for-delivery-email.html';

    $branch = $orderData['branch'] ?? [];
    $branchAddress = $branch['address'] ?? 'Florastraße 10A, 13187 Berlin';
    $branchPhone = $branch['phone'] ?? '030 37476736';

    $pm = strtolower((string)($orderData['payment_method'] ?? 'cash'));
    $payStatus = (strpos($pm, 'paid') !== false || strpos($pm, 'paypal') !== false || strpos($pm, 'stripe') !== false || strpos($pm, 'karte') !== false) ? 'Bereits online bezahlt' : 'Barzahlung bei Lieferung';

    $variables = [
        'NAME' => $name ?: 'Gast',
        'ORDER_ID' => $orderId,
        'DELIVERY_ADDRESS' => $orderData['delivery_address'] ?? 'Ihre angegebene Adresse',
        'ORDER_TOTAL' => $orderData['total'] ?? '0,00 €',
        'PAYMENT_STATUS' => $payStatus,
        'BRANCH_PHONE' => $branchPhone,
        'BRANCH_ADDRESS' => $branchAddress,
        'YEAR' => date('Y')
    ];

    $subject = '🛵 Ihre Bestellung #' . $shortId . ' ist auf dem Weg zu Ihnen! - LEO SUSHI';
    return sendTemplatedEmail($to, $subject, $template, $variables);
}

/**
 * Gửi email khi món đã làm xong, sẵn sàng để khách đến lấy (Abholung)
 */
function sendOrderReadyForPickupEmail($to, $name, $orderData) {
    $orderId = $orderData['order_id'] ?? date('YmdHis');
    $shortId = preg_replace('/^(ORD-|LEO-)/', '', $orderId);
    $template = __DIR__ . '/email-templates/order-ready-for-pickup-email.html';

    $branch = $orderData['branch'] ?? [];
    $branchAddress = $branch['address'] ?? 'Florastraße 10A, 13187 Berlin';
    $branchPhone = $branch['phone'] ?? '030 37476736';

    $pm = strtolower((string)($orderData['payment_method'] ?? 'cash'));
    $payStatus = (strpos($pm, 'paid') !== false || strpos($pm, 'paypal') !== false || strpos($pm, 'stripe') !== false || strpos($pm, 'karte') !== false) ? 'Bereits online bezahlt' : 'Barzahlung bei Abholung';

    $variables = [
        'NAME' => $name ?: 'Gast',
        'ORDER_ID' => $orderId,
        'ORDER_TOTAL' => $orderData['total'] ?? '0,00 €',
        'PAYMENT_STATUS' => $payStatus,
        'BRANCH_PHONE' => $branchPhone,
        'BRANCH_ADDRESS' => $branchAddress,
        'YEAR' => date('Y')
    ];

    $subject = '🥡 Ihre Bestellung #' . $shortId . ' ist abholbereit! - LEO SUSHI';
    return sendTemplatedEmail($to, $subject, $template, $variables);
}

/**
 * Gửi hóa đơn (bill) PDF cho khách khi đơn được xác nhận.
 * Tạo PDF thật bằng PdfReceipt (thuần PHP, không cần thư viện ngoài)
 * và attach vào email.
 */
function sendOrderBillEmail($to, $name, $orderData) {
    require_once __DIR__ . '/pdf-receipt.php';

    $orderId  = $orderData['order_id'] ?? date('YmdHis');
    $subject  = 'Ihre Rechnung #' . $orderId . ' - LEO SUSHI';
    $orderIdShort = preg_replace('/^(ORD-|LEO-)/', '', $orderId);
    $fileName = 'Rechnung-LEO-SUSHI-' . $orderIdShort . '.pdf';

    // ---- 1. Generate PDF ----
    $pdfData = [
        'order_id'         => $orderId,
        'order_time'       => $orderData['order_time'] ?? date('d.m.Y H:i'),
        'customer_name'    => $name ?: 'Gast',
        'phone'            => $orderData['phone'] ?? '',
        'delivery_address' => $orderData['delivery_address'] ?? '',
        'service_type'     => $orderData['service_type'] ?? 'pickup',
        'payment_method'   => $orderData['payment_method'] ?? 'cash',
        'items'            => $orderData['items'] ?? [],
        'subtotal'         => $orderData['subtotal'] ?? 0,
        'delivery_fee'     => $orderData['delivery_fee'] ?? 0,
        'tip'              => $orderData['tip'] ?? 0,
        'discount'         => $orderData['discount'] ?? 0,
        'total'            => $orderData['total'] ?? '0,00',
        'note'             => $orderData['note'] ?? '',
        'branch'           => $orderData['branch'] ?? null,
    ];

    $pdfGenerator = new PdfReceipt();
    $pdfString    = $pdfGenerator->generate($pdfData);

    // ---- 2. Build HTML email body ----
    // (Simple but nice-looking email - the PDF is the main deliverable)
    $serviceType = $orderData['service_type'] ?? 'pickup';
    if ($serviceType === 'delivery')     $serviceLabel = '🛵 Lieferung';
    elseif ($serviceType === 'reservation') $serviceLabel = '🍽️ Reservierung';
    else $serviceLabel = '🥡 Abholung';

    $pmStr = strtolower((string)($orderData['payment_method'] ?? 'cash'));
    if (strpos($pmStr, 'paypal') !== false) {
        $payLabel = 'PayPal';
    } elseif (strpos($pmStr, 'stripe') !== false || strpos($pmStr, 'apple') !== false || strpos($pmStr, 'google') !== false || strpos($pmStr, 'online') !== false) {
        $payLabel = 'Online-Zahlung (Karte / Apple Pay)';
    } elseif (strpos($pmStr, 'card') !== false || strpos($pmStr, 'kartenzahlung') !== false || strpos($pmStr, 'thẻ') !== false) {
        $payLabel = 'Kartenzahlung';
    } else {
        $payLabel = 'Barzahlung'; // Default strictly to cash instead of strictly evaluating missing values to cash
    }

    $total = $orderData['total'] ?? '0,00';
    $safeName = htmlspecialchars($name ?: 'Gast');

    $etaText = '';
    if (!empty($orderData['eta'])) {
        $etaText = '<div style="background:#fff8e1; border-left:4px solid #d4af37; padding:12px; margin: 16px 0; font-size:15px; color:#555;">' .
            '<strong>⏳ Voraussichtliche Zeit:</strong> ' . htmlspecialchars((string)$orderData['eta']) .
            '<div style="font-size:12px; color:#777; margin-top:6px; font-style:italic;">' .
            '* Hinweis: Aufgrund von hohem Bestellaufkommen kann es zu einer Abweichung von 5-10 Minuten kommen. Vielen Dank für Ihr Verständnis!' .
            '</div></div>';
    }

    $branchAddress = 'Florastrasse 10A, 13187 Berlin';
    if (!empty($orderData['branch']) && !empty($orderData['branch']['address'])) {
        $branchAddress = htmlspecialchars((string)$orderData['branch']['address']);
    }

    $htmlBody = '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Ihre Rechnung</title></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1);">
  <div style="background:linear-gradient(135deg,#1a1a1a,#2a2a2a);padding:32px 24px;text-align:center;">
    <div style="font-size:28px;font-weight:900;color:#d4af37;letter-spacing:4px;">LEO SUSHI</div>
    <div style="color:rgba(255,255,255,.5);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">' . $branchAddress . '</div>
    <div style="display:inline-block;background:#d4af37;color:#1a1a1a;padding:6px 18px;border-radius:20px;font-size:12px;font-weight:700;margin-top:14px;">&#10020; RECHNUNG #' . htmlspecialchars((string)$orderIdShort) . '</div>
  </div>
  <div style="padding:28px 24px;">
    <p style="font-size:15px;color:#333;">Hallo <strong>' . $safeName . '</strong>,<br>Ihre Bestellung wurde bestätigt! Vielen Dank. Ihre Rechnung ist als <strong>PDF-Anhang</strong> beigef&uuml;gt.</p>
    ' . $etaText . '
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#777;">Service</td><td style="padding:8px 0;font-weight:600;text-align:right;">' . $serviceLabel . '</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:8px 0;color:#777;">Zahlung</td><td style="padding:8px 0;font-weight:600;text-align:right;">' . htmlspecialchars((string)$payLabel) . '</td></tr>
      <tr><td style="padding:10px 0;color:#d4af37;font-weight:700;font-size:16px;">Gesamt</td><td style="padding:10px 0;color:#d4af37;font-weight:700;font-size:18px;text-align:right;">&euro;' . htmlspecialchars((string)$total) . '</td></tr>
    </table>
    <div style="background:#f0f8ff;border:1px dashed #90cdf4;border-radius:8px;padding:14px;text-align:center;font-size:13px;color:#2b6cb0;margin:20px 0;">
      <strong>&#128196; PDF-Rechnung im Anhang</strong><br>
      Bitte &ouml;ffnen Sie den Anhang, um Ihre vollst&auml;ndige Rechnung anzuzeigen oder zu drucken.
    </div>
  </div>';
  $branchPhone = ($orderData['branch']['id'] ?? '') === 'branch_haupt' ? '030 55617056' : '03037476736';
  $htmlBody .= '
  <div style="background:#1a1a1a;padding:20px;text-align:center;">
    <p style="color:rgba(255,255,255,.5);font-size:12px;margin:4px 0;"><strong style="color:#d4af37;">LEO SUSHI</strong> &bull; ' . $branchAddress . '</p>
    <p style="color:rgba(255,255,255,.5);font-size:12px;margin:4px 0;">&#128222; <a href="tel:' . str_replace(' ', '', $branchPhone) . '" style="color:#d4af37;text-decoration:none;">' . $branchPhone . '</a> &bull; <a href="https://www.leo-sushi-berlin.de" style="color:#d4af37;text-decoration:none;">leo-sushi-berlin.de</a></p>
  </div></div></body></html>';

    // ---- 3. Send via PHPMailer with PDF attachment ----
    $host       = SMTP_HOST;
    $port       = SMTP_PORT;
    $username   = SMTP_USERNAME;
    $password   = str_replace(' ', '', trim((string)(SMTP_PASSWORD ?? '')));
    $encryption = strtolower(SMTP_ENCRYPTION);
    $fromEmail  = SMTP_FROM_EMAIL;
    $fromName   = SMTP_FROM_NAME;

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $username;
    $mail->Password   = $password;
    $mail->SMTPSecure = $encryption === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $port;
    $mail->CharSet    = 'UTF-8';
    $mail->SMTPOptions = ['ssl' => ['verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => false]];
    $mail->Timeout    = 30;

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($to);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = "Ihre Rechnung #$orderIdShort ist als PDF-Anhang beigefuegt. Gesamt: $total EUR";

    // Attach PDF
    $mail->addStringAttachment($pdfString, $fileName, 'base64', 'application/pdf');

    try {
        $mail->send();
        logMailEvent("Bill PDF sent to {$to} for order #{$orderId}");
        return true;
    } catch (Exception $e) {
        $errorMsg = "Bill PDF email error: {$mail->ErrorInfo}";
        logMailEvent($errorMsg);
        throw new Exception($errorMsg);
    }
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
        $cleanPassword = str_replace(' ', '', trim((string)($password ?? '')));
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
        $cleanPassword = str_replace(' ', '', trim((string)($password ?? '')));
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

