import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

try:
    print(f"Connecting to SSH on {host}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname=host, port=port, username=username, password=password)
    
    print("Executing PHP script on remote server...")
    
    # We create a php script that will be executed directly via command line
    # We use the correct password: 'leo0301.'
    php_code = """
<?php
$conn = new mysqli('db5019177072.hosting-data.io', 'dbu2318386', 'leo0301.', 'dbs15058296');
if ($conn->connect_error) {
    die("DB Connection failed: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

$sql = "SELECT order_id, payment_status, summary FROM orders WHERE LOWER(payment_method) = 'paypal' AND (payment_status IS NULL OR payment_status != 'paid')";
$result = $conn->query($sql);
$count = $result->num_rows;
echo "Found {$count} PayPal orders with payment_status != 'paid'\\n";

$fixed = 0;
while ($row = $result->fetch_assoc()) {
    $orderId = $row['order_id'];
    echo "Fixing Order: {$orderId}\\n";
    
    $stmt = $conn->prepare("UPDATE orders SET payment_status = 'paid' WHERE order_id = ?");
    $stmt->bind_param('s', $orderId);
    $stmt->execute();
    
    $summary = json_decode($row['summary'] ?? '{}', true);
    if (is_array($summary)) {
        $summary['payment_status'] = 'paid';
        $summaryJson = json_encode($summary, JSON_UNESCAPED_UNICODE);
        
        $stmt2 = $conn->prepare("UPDATE orders SET summary = ? WHERE order_id = ?");
        $stmt2->bind_param('ss', $summaryJson, $orderId);
        $stmt2->execute();
        $stmt2->close();
    }
    
    $fixed++;
    $stmt->close();
}
echo "Fixed {$fixed} orders.\\n";
$conn->close();
?>
"""
    
    # Run the php code
    stdin, stdout, stderr = client.exec_command("php")
    stdin.write(php_code)
    stdin.close()
    
    print("OUTPUT:")
    print(stdout.read().decode())
    print("ERRORS:")
    print(stderr.read().decode())
    
    client.close()
except Exception as e:
    print(f"Error: {e}")
