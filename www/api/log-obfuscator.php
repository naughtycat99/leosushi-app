<?php
/**
 * Log Obfuscator
 * Prevents sensitive API endpoints from appearing in access logs
 * This should be included at the top of sensitive API files
 */

// Custom error handler to prevent logging sensitive info
function obfuscateLogEntry($message) {
    // Replace sensitive API paths with generic ones
    $patterns = [
        '/admin-auth\.php/' => 'api/v1/auth',
        '/orders\.php/' => 'api/v1/data/orders',
        '/menu\.php/' => 'api/v1/data/menu',
        '/customers\.php/' => 'api/v1/data/customers',
        '/points\.php/' => 'api/v1/data/points',
        '/reservations\.php/' => 'api/v1/data/reservations',
        '/config\.php/' => 'api/v1/config',
        '/security-config\.php/' => 'api/v1/security',
    ];
    
    foreach ($patterns as $pattern => $replacement) {
        $message = preg_replace($pattern, $replacement, $message);
    }
    
    return $message;
}

// Override error_log to obfuscate sensitive paths
if (!function_exists('original_error_log')) {
    function original_error_log($message, $message_type = 0, $destination = null, $extra_headers = null) {
        $obfuscated = obfuscateLogEntry($message);
        return call_user_func_array('error_log', [$obfuscated, $message_type, $destination, $extra_headers]);
    }
}

