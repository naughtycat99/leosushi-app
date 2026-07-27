<?php
/**
 * Widget Data API for Native iOS/Android Widgets
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$type = $_GET['type'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($type === 'admin') {
        // --- ADMIN WIDGET ---
        $conn = getDbConnection();
        $today = date('Y-m-d');
        
        // 1. Get Pending Orders Count
        $stmtPending = $conn->prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
        $stmtPending->execute();
        $pendingCount = $stmtPending->get_result()->fetch_assoc()['count'] ?? 0;
        
        // 2. Get Confirmed Orders Count
        $stmtConfirmed = $conn->prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'confirmed'");
        $stmtConfirmed->execute();
        $confirmedCount = $stmtConfirmed->get_result()->fetch_assoc()['count'] ?? 0;
        
        // 3. Get Today's Revenue broken down by payment method
        $stmtRevenue = $conn->prepare(
            "SELECT summary, payment_method FROM orders WHERE (status = 'completed' OR status = 'confirmed') AND date = ?"
        );
        $stmtRevenue->bind_param('s', $today);
        $stmtRevenue->execute();
        $revenueResult = $stmtRevenue->get_result();
        
        $totalRevenue  = 0.0;
        $paypalRevenue = 0.0;
        $cashRevenue   = 0.0;
        $cardRevenue   = 0.0;
        
        while ($row = $revenueResult->fetch_assoc()) {
            $summary = json_decode($row['summary'] ?? '{}', true);
            $amount  = parseEuroAmount($summary['total'] ?? 0);
            
            $totalRevenue += $amount;
            
            // Identify payment method (prioritize DB column, then summary)
            $pmValue = $row['payment_method'] ?: ($summary['payment_method'] ?? '');
            $pm = strtolower((string)$pmValue);
            
            if (strpos($pm, 'paypal') !== false) {
                $paypalRevenue += $amount;
            } elseif (strpos($pm, 'card') !== false || strpos($pm, 'kartenzahlung') !== false || strpos($pm, 'quẹt') !== false || strpos($pm, 'terminal') !== false) {
                $cardRevenue += $amount;
            } else {
                $cashRevenue += $amount;
            }
        }
        
        // 4. Get Latest Pending Order (Newest first)
        $stmtLatest = $conn->prepare(
            "SELECT order_id, summary, delivery_address, payment_method FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1"
        );
        $stmtLatest->execute();
        $latestResult = $stmtLatest->get_result();
        $latestOrder  = null;
        if ($row = $latestResult->fetch_assoc()) {
            $summary    = json_decode($row['summary'] ?? '{}', true);
            $addr       = json_decode($row['delivery_address'] ?? '{}', true);
            
            $orderTotal = parseEuroAmount($summary['total'] ?? 0);
            
            $firstName = $addr['first_name'] ?? $summary['first_name'] ?? $addr['firstName'] ?? '';
            $lastName  = $addr['last_name'] ?? $summary['last_name'] ?? $addr['lastName'] ?? '';
            $customerName = trim($firstName . ' ' . $lastName) ?: 'Kunde';
            $phone = $addr['phone'] ?? $summary['phone'] ?? '';
            $note = $addr['note'] ?? $summary['note'] ?? '';

            $latestOrder = [
                'order_id'      => $row['order_id'],
                'order_total'   => number_format((float)$orderTotal, 2, '.', '') . ' €',
                'service_type'  => $summary['service_type'] ?? '',
                'time'          => $summary['time'] ?? '',
                'customer_name' => $customerName,
                'phone'         => $phone,
                'note'          => $note
            ];
        }

        // 5. Get Active Orders with Countdown
        $stmtActive = $conn->prepare(
            "SELECT order_id, summary FROM orders WHERE status = 'confirmed' ORDER BY created_at DESC LIMIT 100"
        );
        $stmtActive->execute();
        $activeResult = $stmtActive->get_result();
        $allActive = [];
        $now = time();
        while ($row = $activeResult->fetch_assoc()) {
            $summary = json_decode($row['summary'], true) ?: [];
            
            // Fixed logic to parse confirmed_at and total_minutes
            $confirmedAt = 0;
            if (!empty($summary['confirmed_at'])) {
                $confirmedAt = strtotime($summary['confirmed_at']);
            }
            
            $totalMinutes = 30; // Default
            if (!empty($summary['total_minutes'])) {
                $totalMinutes = (int)$summary['total_minutes'];
            }
            
            $remainingMinutes = 0;
            if ($confirmedAt > 0) {
                $elapsedSeconds = $now - $confirmedAt;
                $elapsedMinutes = floor($elapsedSeconds / 60);
                $remainingMinutes = max(0, $totalMinutes - $elapsedMinutes);
            }
            
            $allActive[] = [
                'id' => $row['order_id'],
                'remaining_minutes' => $remainingMinutes,
                'total_minutes' => $totalMinutes,
            ];
        }

        // Sort by remaining minutes ASC, but push 0 (finished) to the end
        usort($allActive, function($a, $b) {
            if ($a['remaining_minutes'] == 0 && $b['remaining_minutes'] > 0) return 1;
            if ($b['remaining_minutes'] == 0 && $a['remaining_minutes'] > 0) return -1;
            return $a['remaining_minutes'] <=> $b['remaining_minutes'];
        });

        // Take top 5
        $activeOrders = array_slice($allActive, 0, 5);

        echo json_encode([
            'success'        => true,
            'pending'        => (int)$pendingCount,
            'confirmed'      => (int)$confirmedCount,
            'revenue'        => round($totalRevenue, 2),
            'revenue_paypal' => round($paypalRevenue, 2),
            'revenue_cash'   => round($cashRevenue, 2),
            'revenue_card'   => round($cardRevenue, 2),
            'latest_pending' => $latestOrder,
            'active_orders'  => $activeOrders,
        ]);
        exit;
    }
}

// Fallback
http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid type or method']);
