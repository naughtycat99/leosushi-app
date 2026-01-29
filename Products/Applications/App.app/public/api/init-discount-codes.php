<?php
/**
 * Script để tạo 2 mã khuyến mãi cố định
 * - LEO-WELCOME20: 20% off cho khách mới đăng ký
 * - LEO-SAVE15: 10% off cho đơn hàng từ 15€
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

try {
    $conn = getDbConnection();
    
    echo "🔄 Đang tạo mã khuyến mãi cố định...\n\n";
    
    // Mã 1: LEO-WELCOME20 - 20% off cho khách mới đăng ký
    $code1 = NEW_CUSTOMER_DISCOUNT_CODE; // LEO-WELCOME20
    $promotionId1 = 'PROMO-WELCOME20';
    
    // Kiểm tra xem mã đã tồn tại chưa
    $checkStmt = $conn->prepare('SELECT promotion_id FROM promotions WHERE code = ?');
    $checkStmt->bind_param('s', $code1);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows > 0) {
        echo "⚠️  Mã $code1 đã tồn tại, đang cập nhật...\n";
        
        $updateStmt = $conn->prepare('UPDATE promotions SET 
            discount_type = ?, 
            discount_value = ?, 
            min_order = ?, 
            start_date = ?, 
            end_date = ?, 
            status = ?
            WHERE code = ?');
        
        $discountType = 'percentage';
        $discountValue = NEW_CUSTOMER_DISCOUNT_PERCENT; // 20
        $minOrder = 0;
        $startDate = date('Y-m-d');
        $endDate = date('Y-m-d', strtotime('+10 years')); // Hiệu lực 10 năm
        $status = 'active';
        
        $updateStmt->bind_param('sddsdss', $discountType, $discountValue, $minOrder, $startDate, $endDate, $status, $code1);
        
        if ($updateStmt->execute()) {
            echo "✅ Đã cập nhật mã $code1 thành công!\n";
        } else {
            echo "❌ Lỗi cập nhật mã $code1: " . $updateStmt->error . "\n";
        }
    } else {
        $stmt = $conn->prepare('INSERT INTO promotions (
            promotion_id, code, discount_type, discount_value, min_order, max_discount,
            start_date, end_date, usage_limit, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $discountType = 'percentage';
        $discountValue = NEW_CUSTOMER_DISCOUNT_PERCENT; // 20
        $minOrder = 0;
        $maxDiscount = null;
        $startDate = date('Y-m-d');
        $endDate = date('Y-m-d', strtotime('+10 years')); // Hiệu lực 10 năm
        $usageLimit = null; // Không giới hạn
        $status = 'active';
        
        $stmt->bind_param(
            'sssddsssis',
            $promotionId1, $code1, $discountType, $discountValue, $minOrder, $maxDiscount,
            $startDate, $endDate, $usageLimit, $status
        );
        
        if ($stmt->execute()) {
            echo "✅ Đã tạo mã $code1 (20% off cho khách mới đăng ký) thành công!\n";
        } else {
            echo "❌ Lỗi tạo mã $code1: " . $stmt->error . "\n";
        }
    }
    
    echo "\n";
    
    // Mã 2: LEO-SAVE15 - 10% off cho đơn hàng từ 15€
    $code2 = MIN_ORDER_DISCOUNT_CODE; // LEO-SAVE15
    $promotionId2 = 'PROMO-SAVE15';
    
    // Kiểm tra xem mã đã tồn tại chưa
    $checkStmt2 = $conn->prepare('SELECT promotion_id FROM promotions WHERE code = ?');
    $checkStmt2->bind_param('s', $code2);
    $checkStmt2->execute();
    
    if ($checkStmt2->get_result()->num_rows > 0) {
        echo "⚠️  Mã $code2 đã tồn tại, đang cập nhật...\n";
        
        $updateStmt2 = $conn->prepare('UPDATE promotions SET 
            discount_type = ?, 
            discount_value = ?, 
            min_order = ?, 
            start_date = ?, 
            end_date = ?, 
            status = ?
            WHERE code = ?');
        
        $discountType2 = 'percentage';
        $discountValue2 = MIN_ORDER_DISCOUNT_PERCENT; // 10
        $minOrder2 = MIN_ORDER_DISCOUNT_AMOUNT; // 15.00
        $startDate2 = date('Y-m-d');
        $endDate2 = date('Y-m-d', strtotime('+10 years')); // Hiệu lực 10 năm
        $status2 = 'active';
        
        $updateStmt2->bind_param('sddsdss', $discountType2, $discountValue2, $minOrder2, $startDate2, $endDate2, $status2, $code2);
        
        if ($updateStmt2->execute()) {
            echo "✅ Đã cập nhật mã $code2 thành công!\n";
        } else {
            echo "❌ Lỗi cập nhật mã $code2: " . $updateStmt2->error . "\n";
        }
    } else {
        $stmt2 = $conn->prepare('INSERT INTO promotions (
            promotion_id, code, discount_type, discount_value, min_order, max_discount,
            start_date, end_date, usage_limit, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        $discountType2 = 'percentage';
        $discountValue2 = MIN_ORDER_DISCOUNT_PERCENT; // 10
        $minOrder2 = MIN_ORDER_DISCOUNT_AMOUNT; // 15.00
        $maxDiscount2 = null;
        $startDate2 = date('Y-m-d');
        $endDate2 = date('Y-m-d', strtotime('+10 years')); // Hiệu lực 10 năm
        $usageLimit2 = null; // Không giới hạn
        $status2 = 'active';
        
        $stmt2->bind_param(
            'sssddsssis',
            $promotionId2, $code2, $discountType2, $discountValue2, $minOrder2, $maxDiscount2,
            $startDate2, $endDate2, $usageLimit2, $status2
        );
        
        if ($stmt2->execute()) {
            echo "✅ Đã tạo mã $code2 (10% off cho đơn hàng từ " . MIN_ORDER_DISCOUNT_AMOUNT . "€) thành công!\n";
        } else {
            echo "❌ Lỗi tạo mã $code2: " . $stmt2->error . "\n";
        }
    }
    
    echo "\n";
    echo "📊 Tổng kết:\n";
    echo str_repeat("-", 60) . "\n";
    
    // Hiển thị danh sách mã khuyến mãi
    $result = $conn->query("SELECT code, discount_type, discount_value, min_order, status, start_date, end_date FROM promotions ORDER BY created_at DESC");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $discount = $row['discount_type'] === 'percentage' ? $row['discount_value'] . '%' : $row['discount_value'] . '€';
            $minOrderText = $row['min_order'] > 0 ? " (từ {$row['min_order']}€)" : "";
            echo sprintf("✅ %-20s: %-10s %s %s\n", 
                $row['code'], 
                $discount,
                $minOrderText,
                $row['status'] === 'active' ? '🟢' : '🔴'
            );
        }
    }
    
    echo "\n✅ Hoàn tất!\n";
    
} catch (Exception $e) {
    echo "❌ Lỗi: " . $e->getMessage() . "\n";
    echo "Chi tiết: " . $e->getTraceAsString() . "\n";
}

