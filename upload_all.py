import paramiko
import os

host = 'access-5018889236.webspace-host.com'
port = 22
username = 'su396940'
password = 'Leo0301.'

files_to_upload = [
    ('api/store_status.json', '/public/api/store_status.json'),
    ('api/store_status.php', '/public/api/store_status.php'),
    ('api/menu.php', '/public/api/menu.php'),
    ('admin.html', '/public/admin.html'),
    ('js/main.js', '/public/js/main.js'),
    ('js/cart.js', '/public/js/cart.js'),
    ('js/menu.js', '/public/js/menu.js'),
    ('style.css', '/public/style.css')
]

try:
    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    for local_path, remote_path in files_to_upload:
        abs_local = os.path.join(r'd:\jatodemo\leosushi2', local_path)
        print(f"Uploading {abs_local} to {remote_path}...")
        sftp.put(abs_local, remote_path)
        
    sftp.close()
    transport.close()
    print("All files uploaded successfully!")
except Exception as e:
    print(f"Error: {e}")
