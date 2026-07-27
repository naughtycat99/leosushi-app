import paramiko

def upload_admin():
    try:
        transport = paramiko.Transport(('access-5018889236.webspace-host.com', 22))
        transport.connect(username='su396940', password='Leo0301.')
        sftp = paramiko.SFTPClient.from_transport(transport)
        
        # Upload admin.html
        local_path = r'd:\jatodemo\leosushi2\admin.html'
        remote_path = '/htdocs/admin.html'
        sftp.put(local_path, remote_path)
        print("Upload admin.html successful!")
        
        sftp.close()
        transport.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    upload_admin()
