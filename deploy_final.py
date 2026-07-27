import paramiko
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

local_dir = r"d:\jatodemo\leosushi2\www"
remote_dir = "/public/"

# Files to upload
files = [
    "admin.html",
    "fix_paypal_orders.php",
]

print(f"Connecting to {host}...")
transport = paramiko.Transport((host, port))
transport.connect(username=username, password=password)
sftp = paramiko.SFTPClient.from_transport(transport)
print("Connected!\n")

success = 0
failed = 0

for file in files:
    local_file = os.path.join(local_dir, file.replace("/", "\\"))
    remote_file = remote_dir + file
    
    if not os.path.exists(local_file):
        print(f"WARNING: File not found locally: {local_file}")
        failed += 1
        continue
        
    print(f"Uploading {file} to {remote_file}...")
    try:
        sftp.put(local_file, remote_file)
        print(f"  OK: {file}")
        success += 1
    except Exception as e:
        print(f"  FAIL: {file} -> {e}")
        failed += 1

sftp.close()
transport.close()

print(f"\nResult: {success} OK / {failed} FAIL")
if success > 0:
    print(f"\nFix URL: https://www.leo-sushi-berlin.de/fix_paypal_orders.php")
print("Done!")
