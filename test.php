<?php
/**
 * PHP Test File
 * Upload this to your hosting to verify PHP is working
 * Access via: https://leo-sushi-berlin.de/test.php
 */

// Test 1: Basic PHP execution
echo "<h1>✅ PHP IS WORKING!</h1>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Server: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";

// Test 2: Show PHP configuration
echo "<hr>";
echo "<h2>PHP Configuration:</h2>";
phpinfo();
?>
