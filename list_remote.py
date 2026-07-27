import paramiko
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

# List root directory
print("=== ROOT / ===")
for name in sorted(sftp.listdir("/")):
    try:
        attr = sftp.stat("/" + name)
        ftype = "DIR" if attr.st_mode and (attr.st_mode & 0o40000) else "FILE"
    except:
        ftype = "???"
    print(f"  {ftype:4s}  {name}")

# Check if /api exists
try:
    sftp.stat("/api")
    print("\n/api/ exists!")
    print("\n=== /api/ ===")
    for name in sorted(sftp.listdir("/api"))[:20]:
        print(f"  {name}")
except:
    print("\n/api/ does NOT exist on server")

# Check common paths
for p in ["/leosushi", "/public_html", "/htdocs", "/www"]:
    try:
        sftp.stat(p)
        print(f"\n{p} EXISTS!")
        for name in sorted(sftp.listdir(p))[:15]:
            print(f"  {name}")
    except:
        pass

sftp.close()
transport.close()
