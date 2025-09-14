import os
import re
import datetime
from pathlib import Path

# Configuration
INCLUDE_EXTENSIONS = {'.py', '.css', '.js', '.html'}
EXCLUDE_FOLDER_PATTERNS = ['node', 'doc', 'venv', 'util']  # Exclude if any of these substrings in folder name
EXCLUDE_EXTENSIONS = {'.md', '.txt', '.log', '.bak'}
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), '_file_information_data_template.md')
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUTPUT_SUFFIX = '-file-info-data.md'
SCRIPT_DIR = os.path.dirname(__file__)
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'fid_storage')

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Read template
with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
    TEMPLATE = f.read()

def should_exclude_folder(folder_name):
    folder_name_lower = folder_name.lower()
    return any(pattern in folder_name_lower for pattern in EXCLUDE_FOLDER_PATTERNS)

def should_include(file_path):
    ext = file_path.suffix.lower()
    if ext not in INCLUDE_EXTENSIONS:
        return False
    if ext in EXCLUDE_EXTENSIONS:
        return False
    # Exclude if any parent folder matches pattern
    for part in file_path.parts:
        if should_exclude_folder(part):
            return False
    return True

def get_main_components_py(file_content):
    classes = re.findall(r'^class (\w+)', file_content, re.MULTILINE)
    funcs = re.findall(r'^def (\w+)', file_content, re.MULTILINE)
    return classes + funcs

def get_imports_py(file_content):
    local_imports = set()
    third_party = set()
    for line in file_content.splitlines():
        if line.startswith('import ') or line.startswith('from '):
            if 'from .' in line or 'from ..' in line or 'import .' in line or 'import ..' in line:
                continue
            m = re.match(r'(from|import) ([\w\.]+)', line)
            if m:
                mod = m.group(2)
                if '.' in mod:
                    local_imports.add(mod.replace('.', os.sep) + '.py')
                else:
                    third_party.add(mod)
    return sorted(local_imports), sorted(third_party)

def get_entry_point_py(file_content):
    return 'yes' if '__main__' in file_content else 'no'

def analyze_file(file_path):
    ext = file_path.suffix.lower()
    info = {
        'File': str(file_path.relative_to(ROOT_DIR)),
        'Purpose': '(auto: not implemented)',
        'Main Components': [],
        'Direct Python File Dependencies (local imports)': [],
        'Third-party/Standard Library Imports': [],
        'What it opens/creates': '(auto: not implemented)',
        'What it exports': '(auto: not implemented)',
        'Entry Point': 'no',
    }
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        if ext == '.py':
            info['Main Components'] = get_main_components_py(content)
            local, third = get_imports_py(content)
            info['Direct Python File Dependencies (local imports)'] = local
            info['Third-party/Standard Library Imports'] = third
            info['Entry Point'] = get_entry_point_py(content)
        # For .js, .css, .html: could add similar logic if needed
    except Exception as e:
        info['Purpose'] = f'(error reading file: {e})'
    return info

def fill_template(info):
    filled = TEMPLATE
    filled = filled.replace('<filename>', info['File'])
    filled = filled.replace('<Short description of what this file does>', info['Purpose'])
    filled = filled.replace('<List of main classes, functions, or endpoints defined>', '\n'.join(info['Main Components']) or '-')
    filled = filled.replace('<relative/path/to/dependency1.py>\n- <relative/path/to/dependency2.py>', '\n'.join(info['Direct Python File Dependencies (local imports)']) or '-')
    filled = filled.replace('<package1>\n- <package2>', '\n'.join(info['Third-party/Standard Library Imports']) or '-')
    filled = filled.replace('<Files, sockets, ports, or resources this file opens or creates>', info['What it opens/creates'])
    filled = filled.replace('<Main objects, endpoints, or data provided to other files>', info['What it exports'])
    filled = filled.replace('<yes/no, and if yes, describe the entry point>', info['Entry Point'])
    return filled

def write_change_record(output_path, content):
    now = datetime.datetime.now().isoformat()
    record = f'\n\n# === Change Record: {now} ===\n{content}\n# === End Change Record ===\n'
    with open(output_path, 'a', encoding='utf-8') as f:
        f.write(record)

def main():
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        # Exclude folders by pattern
        dirnames[:] = [d for d in dirnames if not should_exclude_folder(d)]
        for filename in filenames:
            file_path = Path(dirpath) / filename
            if not should_include(file_path):
                continue
            parent_folder = file_path.parent.name
            output_name = f"{parent_folder}-{file_path.stem}{OUTPUT_SUFFIX}"
            output_path = Path(OUTPUT_DIR) / output_name
            info = analyze_file(file_path)
            content = fill_template(info)
            write_change_record(output_path, content)
            print(f'Updated: {output_path}')

if __name__ == '__main__':
    main()
