import paramiko

host = "access-5018889236.webspace-host.com"
port = 22
username = "su396940"
password = "Leo0301."

try:
    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    print("Current remote dir:", sftp.getcwd())
    print("Files in current dir:", sftp.listdir())
    
    sftp.close()
    transport.close()
except Exception as e:
    print(f"Error: {e}")
