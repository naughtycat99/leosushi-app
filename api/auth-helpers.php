<?php
/**
 * Authentication Helper Functions
 * Provides missing functions for password hashing, token generation, and user identification.
 */

require_once __DIR__ . '/config.php';

/**
 * Generate a unique customer ID based on email
 */
if (!function_exists('generateCustomerId')) {
    function generateCustomerId($email) {
        // Simple but unique ID: C- (for customer) + first 4 chars of md5(email) + short timestamp
        $hash = substr(md5(strtolower(trim($email))), 0, 4);
        $time = substr(time(), -6);
        return 'C-' . strtoupper($hash . $time);
    }
}

/**
 * Get the welcome discount code from config
 */
if (!function_exists('getWelcomeDiscountCode')) {
    function getWelcomeDiscountCode() {
        return defined('NEW_CUSTOMER_DISCOUNT_CODE') ? NEW_CUSTOMER_DISCOUNT_CODE : 'LEO-WELCOME20';
    }
}

/**
 * Hash a password using BCRYPT
 */
if (!function_exists('hashPassword')) {
    function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}

/**
 * Verify a password against a hash
 */
if (!function_exists('verifyPassword')) {
    function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
}

/**
 * Generate a simple JWT-like token
 */
if (!function_exists('generateToken')) {
    function generateToken($userId) {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload = json_encode([
            'userId' => $userId,
            'iat' => time(),
            'exp' => time() + (defined('JWT_EXPIRES_IN') ? JWT_EXPIRES_IN : 604800) // Default 7 days
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $secret = defined('JWT_SECRET') ? JWT_SECRET : 'default-secret-key';
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
}

/**
 * Get the Auth token from Authorization header
 */
if (!function_exists('getAuthToken')) {
    function getAuthToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
}

/**
 * Verify and decode a token
 */
if (!function_exists('verifyToken')) {
    function verifyToken($token) {
        if (!$token) return null;

        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        $header = $parts[0];
        $payload = $parts[1];
        $signature = $parts[2];

        $secret = defined('JWT_SECRET') ? JWT_SECRET : 'default-secret-key';
        $validSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(hash_hmac('sha256', $header . "." . $payload, $secret, true)));

        if (!hash_equals($signature, $validSignature)) {
            return null;
        }

        $decodedPayload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        
        // Check expiration
        if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
            return null;
        }

        return $decodedPayload;
    }
}
