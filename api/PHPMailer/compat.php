<?php
/**
 * PHPMailer Compatibility Interfaces for non-composer environments.
 */

namespace PHPMailer\PHPMailer {
    if (!interface_exists('PHPMailer\PHPMailer\OAuthTokenProvider')) {
        interface OAuthTokenProvider {
            public function getOauth64();
        }
    }
}

namespace Psr\Log {
    if (!interface_exists('Psr\Log\LoggerInterface')) {
        interface LoggerInterface {
            public function emergency($message, array $context = array());
            public function alert($message, array $context = array());
            public function critical($message, array $context = array());
            public function error($message, array $context = array());
            public function warning($message, array $context = array());
            public function notice($message, array $context = array());
            public function info($message, array $context = array());
            public function debug($message, array $context = array());
            public function log($level, $message, array $context = array());
        }
    }
}

namespace {
    // Global namespace
}
