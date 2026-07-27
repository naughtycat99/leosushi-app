import paramiko

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

files_to_upload = [
    ("checkout.html", "public/checkout.html")
]

try:
    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    for local_path, remote_path in files_to_upload:
        print(f"Uploading {local_path} to {remote_path}...")
        sftp.put(local_path, remote_path)
    
    sftp.close()
    transport.close()
    print("All files uploaded successfully!")
except Exception as e:
    print(f"Error: {e}")
