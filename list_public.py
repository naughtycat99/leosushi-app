import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

transport = paramiko.Transport((host, port))
transport.connect(username=username, password=password)
sftp = paramiko.SFTPClient.from_transport(transport)

# Check /public directory
print("=== /public/ ===")
try:
    for name in sorted(sftp.listdir("/public"))[:30]:
        print(f"  {name}")
except Exception as e:
    print(f"Error: {e}")

# Check /public/api
print("\n=== /public/api/ ===")
try:
    for name in sorted(sftp.listdir("/public/api"))[:30]:
        print(f"  {name}")
except Exception as e:
    print(f"Error: {e}")

sftp.close()
transport.close()
