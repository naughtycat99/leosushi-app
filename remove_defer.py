import os
import re

def remove_defer():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Remove " defer>" and replace with ">"
        content = re.sub(r' defer>', '>', content)
        content = re.sub(r' defer >', '>', content)
        content = re.sub(r' defer/>', '/>', content)

        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Removed defer from {file}")

def copy_to_www():
    # We also do it directly in string for www
    pass

if __name__ == "__main__":
    remove_defer()
    print("Done removing defer.")
