import os
import re

EXCLUDED_DIRS = {'node_modules', 'venv', '.venv', 'aniota_ui/node_modules', 'util', 'utils', 'doc', 'docs'}
EXTENSIONS = {'.py', '.css', '.html', '.json', '.js'}

def get_header_pattern(ext):
    if ext == '.py':
        return r'^(#.*\n)+'
    elif ext == '.js':
        # Remove consecutive lines at the top starting with // or #
        return r'^((//|#).*\n)+'
    elif ext == '.css':
        return r'^/\*([\s\S]*?)\*/\s*'
    elif ext == '.html':
        # Remove all top lines starting with #, <!-- #, <!-- <!-- #, <!--, or -->
        return r'^(#.*\n|<!-- ?<!-- ?#.*\n|<!-- ?#.*\n|<!--\s*\n|-->\s*\n)+'
    elif ext == '.json':
        return r'^(//.*\n)+'
    return None

def should_exclude(path):
    parts = set(path.replace('\\', '/').split('/'))
    return not EXCLUDED_DIRS.isdisjoint(parts)

def remove_top_comment(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    pattern = get_header_pattern(ext)
    if not pattern:
        return
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    new_content = re.sub(pattern, '', content, count=1, flags=re.MULTILINE)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned: {filepath}")

def main(root_dir):
    for dirpath, dirs, files in os.walk(root_dir):
        # Exclude unwanted directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSIONS:
                full_path = os.path.join(dirpath, file)
                if not should_exclude(full_path):
                    remove_top_comment(full_path)

if __name__ == '__main__':
    main('.')
