import paramiko
import os

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

local_dir = r"d:\jatodemo\leosushi2\www"
remote_dir = "/"

files = [
    "js/config.js",
    "js/menu.js",
    "js/main.js",
    "index.html",
    "menu.html"
]

print(f"Connecting to {host}...")
transport = paramiko.Transport((host, port))
transport.connect(username=username, password=password)

sftp = paramiko.SFTPClient.from_transport(transport)

for file in files:
    local_file = os.path.join(local_dir, file.replace("/", "\\"))
    remote_file = remote_dir + file
    
    if not os.path.exists(local_file):
        print(f"File not found locally: {local_file}")
        continue
        
    print(f"Uploading {local_file} to {remote_file}...")
    try:
        sftp.put(local_file, remote_file)
        print(f"Upload successful: {file}")
    except Exception as e:
        print(f"Upload failed for {file}: {e}")
        # Try to create directory
        parts = file.split("/")
        if len(parts) > 1:
            d = remote_dir + parts[0]
            try:
                sftp.mkdir(d)
                print(f"Created directory {d}")
            except:
                pass
        try:
            sftp.put(local_file, remote_file)
            print(f"Upload successful after retry: {file}")
        except Exception as e2:
            print(f"Final upload failed: {e2}")

sftp.close()
transport.close()
print("All done!")
