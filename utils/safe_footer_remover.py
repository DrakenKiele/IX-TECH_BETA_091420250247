import os


EXCLUDED_DIRS = {'node_modules', 'venv', '.venv', 'aniota_ui/node_modules', 'util', 'utils', 'doc', 'docs'}
EXTENSIONS = {'.py', '.js', '.css', '.html'}

COMMENT_PREFIXES = ['#', '//', '/*', '*/', '*', '<!--']

def remove_footer(filepath, ext):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    # Remove trailing blank lines
    while lines and lines[-1].strip() == '':
        lines.pop()
    # Remove any trailing lines that start with a comment prefix
    i = len(lines) - 1
    while i >= 0:
        line = lines[i].lstrip()
        if any(line.startswith(prefix) for prefix in COMMENT_PREFIXES):
            i -= 1
        else:
            break
    if i < len(lines) - 1:
        lines = lines[:i+1]
    # Remove trailing blank lines again
    while lines and lines[-1].strip() == '':
        lines.pop()
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Removed footer from: {filepath}")


def main(root_dir):
    for dirpath, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSIONS:
                full_path = os.path.join(dirpath, file)
                remove_footer(full_path, ext)

if __name__ == '__main__':
    main('.')
