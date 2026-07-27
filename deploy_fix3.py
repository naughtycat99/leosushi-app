import paramiko
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

print(f"Connecting to {host}...")
transport = paramiko.Transport((host, port))
transport.connect(username=username, password=password)

sftp = paramiko.SFTPClient.from_transport(transport)
print("Connected!\n")

local_file = r"d:\jatodemo\leosushi2\www\fix_paypal_orders.php"
remote_file = "/fix_paypal_orders.php"

print(f"Uploading fix_paypal_orders.php to root...")
sftp.put(local_file, remote_file)
print("OK!")

sftp.close()
transport.close()

print(f"\nRun fix: https://www.leo-sushi-berlin.de/fix_paypal_orders.php")
print("Done!")
