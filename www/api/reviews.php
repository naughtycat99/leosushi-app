<?php
/**
 * Reviews API - Handle customer reviews
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

function handleReviewRequest($method, $action, $input) {
    switch ($method) {
        case 'GET':
            if ($action === 'list' || empty($action)) {
                listReviews();
            } elseif ($action === 'stats') {
                getReviewStats();
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Action not found']);
            }
            break;
            
        case 'POST':
            if ($action === 'create' || empty($action)) {
                createReview($input);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Action not found']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
}

function listReviews() {
    global $conn;
    
    try {
        // Get query parameters
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $status = isset($_GET['status']) ? $_GET['status'] : 'approved';
        
        // Build query
        $query = "SELECT r.*, 
                         c.first_name, 
                         c.last_name,
                         c.email,
                         o.order_id as order_number
                  FROM reviews r
                  LEFT JOIN customers c ON r.customer_id = c.id
                  LEFT JOIN orders o ON r.order_id = o.order_id
                  WHERE r.status = ?
                  ORDER BY r.created_at DESC
                  LIMIT ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $status, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            // Format customer name
            $customerName = trim(($row['first_name'] ?? '') . ' ' . ($row['last_name'] ?? ''));
            if (empty($customerName)) {
                $customerName = 'Anonym';
            }
            
            // Get first letter for avatar
            $authorInitial = strtoupper(substr($customerName, 0, 1));
            
            $reviews[] = [
                'review_id' => $row['review_id'],
                'author_name' => $customerName,
                'author_initial' => $authorInitial,
                'rating' => (int)$row['rating'],
                'text' => $row['comment'] ?? '',
                'comment' => $row['comment'] ?? '',
                'order_id' => $row['order_number'] ?? null,
                'created_at' => $row['created_at'],
                'status' => $row['status']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'reviews' => $reviews,
            'count' => count($reviews)
        ]);
        
    } catch (Exception $e) {
        error_log("Error listing reviews: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching reviews',
            'error' => $e->getMessage()
        ]);
    }
}

function getReviewStats() {
    global $conn;
    
    try {
        // Get total reviews count
        $query = "SELECT COUNT(*) as total, 
                         AVG(rating) as avg_rating,
                         COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
                  FROM reviews
                  WHERE status = 'approved'";
        
        $result = $conn->query($query);
        $stats = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'stats' => [
                'total' => (int)$stats['total'],
                'approved' => (int)$stats['approved_count'],
                'average_rating' => round((float)$stats['avg_rating'], 1)
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("Error getting review stats: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching review stats',
            'error' => $e->getMessage()
        ]);
    }
}

function createReview($input) {
    global $conn;
    
    try {
        // Validate input
        if (empty($input['customer_id'])) {
            throw new Exception('Customer ID is required');
        }
        
        if (empty($input['rating']) || $input['rating'] < 1 || $input['rating'] > 5) {
            throw new Exception('Rating must be between 1 and 5');
        }
        
        // Generate review ID
        $reviewId = 'REV-' . strtoupper(uniqid());
        
        // Prepare data
        $customerId = $input['customer_id'];
        $orderId = $input['order_id'] ?? null;
        $rating = (int)$input['rating'];
        $comment = $input['comment'] ?? '';
        $status = 'pending'; // Reviews need admin approval
        
        // Insert review
        $query = "INSERT INTO reviews (review_id, customer_id, order_id, rating, comment, status)
                  VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssiss", $reviewId, $customerId, $orderId, $rating, $comment, $status);
        
        if (!$stmt->execute()) {
            throw new Exception('Failed to create review: ' . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Review submitted successfully. It will be published after admin approval.',
            'review_id' => $reviewId
        ]);
        
    } catch (Exception $e) {
        error_log("Error creating review: " . $e->getMessage());
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

// Entry point for direct access
if (basename($_SERVER['PHP_SELF']) === 'reviews.php') {
    $method = $_SERVER['REQUEST_METHOD'];
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = array_filter(explode('/', trim($path, '/')));
    $pathParts = array_values($pathParts);
    
    $action = '';
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
    } elseif (isset($pathParts[count($pathParts) - 1]) && $pathParts[count($pathParts) - 1] !== 'reviews.php') {
        $action = $pathParts[count($pathParts) - 1];
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    handleReviewRequest($method, $action, $input);
}

