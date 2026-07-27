import paramiko
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

local_dir = r"d:\jatodemo\leosushi2"
remote_dir = "/"

# Files to upload - api/fix_paypal_orders.php goes to /api/ on server
files = [
    ("api/fix_paypal_orders.php", "/api/fix_paypal_orders.php"),
]

print(f"Connecting to {host}...")
transport = paramiko.Transport((host, port))
transport.connect(username=username, password=password)

sftp = paramiko.SFTPClient.from_transport(transport)
print("Connected!\n")

for local_rel, remote_path in files:
    local_file = os.path.join(local_dir, local_rel.replace("/", "\\"))
    
    if not os.path.exists(local_file):
        print(f"WARNING: File not found locally: {local_file}")
        continue
        
    print(f"Uploading {local_rel} -> {remote_path}...")
    try:
        sftp.put(local_file, remote_path)
        print(f"  OK!")
    except Exception as e:
        print(f"  FAIL: {e}")

sftp.close()
transport.close()

print(f"\nFix URL: https://www.leo-sushi-berlin.de/api/fix_paypal_orders.php")
print("Done!")
