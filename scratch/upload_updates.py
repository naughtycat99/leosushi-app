import paramiko

host = 'access-5018889236.webspace-host.com'
port = 22
username = 'su396940'
password = 'Leo0301.'

try:
    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)

    print("Uploading admin.html...")
    sftp.put(r'd:\jatodemo\leosushi2\admin.html', '/public/admin.html')
    
    print("Uploading js/receipt-generator.js...")
    sftp.put(r'd:\jatodemo\leosushi2\js\receipt-generator.js', '/public/js/receipt-generator.js')
    
    print("Uploading api/orders.php...")
    sftp.put(r'd:\jatodemo\leosushi2\api\orders.php', '/public/api/orders.php')
    
    print("All uploads successful!")
    
except Exception as e:
    print(f"Error during upload: {e}")
finally:
    if 'sftp' in locals(): sftp.close()
    if 'transport' in locals(): transport.close()
