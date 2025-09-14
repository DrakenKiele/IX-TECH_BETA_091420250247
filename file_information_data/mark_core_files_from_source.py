import os
import re
import shutil
from pathlib import Path

# Configuration
INCLUDE_EXTENSIONS = {'.py', '.js'}  # Extend as needed
EXCLUDE_FOLDER_PATTERNS = ['node', 'doc', 'venv', 'util']
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FID_STORAGE = os.path.join(os.path.dirname(__file__), 'fid_storage')
CORE_PREFIX = 'CORE-'

# Helper functions
def should_exclude_folder(folder_name):
    folder_name_lower = folder_name.lower()
    return any(pattern in folder_name_lower for pattern in EXCLUDE_FOLDER_PATTERNS)

def should_include(file_path):
    ext = file_path.suffix.lower()
    if ext not in INCLUDE_EXTENSIONS:
        return False
    for part in file_path.parts:
        if should_exclude_folder(part):
            return False
    return True

def extract_py_deps(file_content):
    deps = set()
    for line in file_content.splitlines():
        m = re.match(r'(?:from|import)\s+([\w\.]+)', line)
        if m:
            mod = m.group(1).split('.')[0]
            deps.add(mod)
    return deps

def extract_js_deps(file_content):
    deps = set()
    for line in file_content.splitlines():
        m = re.match(r'import\s+.*from\s+["\']([\w\./-]+)["\']', line)
        if m:
            mod = m.group(1).split('/')[0]
            deps.add(mod)
    return deps

def get_all_source_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        dirnames[:] = [d for d in dirnames if not should_exclude_folder(d)]
        for filename in filenames:
            file_path = Path(dirpath) / filename
            if should_include(file_path):
                files.append(file_path)
    return files

def build_dependency_graph(files):
    graph = {}
    name_to_path = {}
    for f in files:
        ext = f.suffix.lower()
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        if ext == '.py':
            deps = extract_py_deps(content)
        elif ext == '.js':
            deps = extract_js_deps(content)
        else:
            deps = set()
        base = f.stem
        graph[base] = deps
        name_to_path[base] = f
    return graph, name_to_path

def find_entry_points(files):
    entry_points = set()
    for f in files:
        ext = f.suffix.lower()
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        if ext == '.py' and '__main__' in content:
            entry_points.add(f.stem)
        # For .js, could add logic for main entry
    return entry_points

def traverse_core(graph, entry_points):
    core = set()
    def visit(node):
        if node in core:
            return
        core.add(node)
        for dep in graph.get(node, []):
            if dep in graph:
                visit(dep)
    for entry in entry_points:
        visit(entry)
    return core

def update_fid_storage(core_set):
    for fname in os.listdir(FID_STORAGE):
        if not fname.endswith('-file-info-data.md'):
            continue
        fpath = os.path.join(FID_STORAGE, fname)
        # Remove any existing CORE: line
        with open(fpath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        lines = [line for line in lines if not line.startswith('CORE:')]
        # Add new CORE: line
        base = fname.split('-')[1] if '-' in fname else fname
        is_core = any(base == c or base in c for c in core_set)
        lines.insert(0, f'CORE: {"yes" if is_core else "no"}\n')
        with open(fpath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        # Rename file with or without CORE- prefix
        if is_core and not fname.startswith(CORE_PREFIX):
            new_fname = CORE_PREFIX + fname
            new_fpath = os.path.join(FID_STORAGE, new_fname)
            shutil.move(fpath, new_fpath)
            print(f"Renamed {fname} -> {new_fname}")
        elif not is_core and fname.startswith(CORE_PREFIX):
            new_fname = fname[len(CORE_PREFIX):]
            new_fpath = os.path.join(FID_STORAGE, new_fname)
            shutil.move(fpath, new_fpath)
            print(f"Renamed {fname} -> {new_fname}")
        else:
            print(f"Checked {fname} (CORE: {'yes' if is_core else 'no'})")

def main():
    files = get_all_source_files()
    graph, name_to_path = build_dependency_graph(files)
    entry_points = find_entry_points(files)
    core_set = traverse_core(graph, entry_points)
    update_fid_storage(core_set)

if __name__ == '__main__':
    main()
