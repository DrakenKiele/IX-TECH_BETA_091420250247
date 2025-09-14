import os
import re
from pathlib import Path
import shutil

FID_STORAGE = os.path.join(os.path.dirname(__file__), 'fid_storage')
CORE_PREFIX = 'CORE-'

# Helper to extract dependencies and entry point from a file info markdown

def extract_info(md_path):
    deps = set()
    entry_point = False
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if line.strip().startswith('Direct Python File Dependencies'):
            # Next lines are dependencies until a blank or non-list line
            for dep_line in lines[i+1:]:
                dep_line = dep_line.strip()
                if not dep_line or not dep_line.startswith('- '):
                    break
                dep = dep_line[2:].strip()
                if dep and dep != '-':
                    deps.add(dep)
        if line.strip().startswith('Entry Point:'):
            if 'yes' in line.lower():
                entry_point = True
    return deps, entry_point

# Build dependency graph
file_nodes = {}
entry_points = set()

for fname in os.listdir(FID_STORAGE):
    if not fname.endswith('-file-info-data.md'):
        continue
    fpath = os.path.join(FID_STORAGE, fname)
    deps, is_entry = extract_info(fpath)
    file_nodes[fname] = {'deps': deps, 'is_entry': is_entry}
    if is_entry:
        entry_points.add(fname)

# Traverse dependencies from entry points to find all CORE files
core_files = set()
def visit(fname):
    if fname in core_files:
        return
    core_files.add(fname)
    for dep in file_nodes.get(fname, {}).get('deps', []):
        # Try to match dependency to a file in fid_storage
        dep_base = Path(dep).stem
        for candidate in file_nodes:
            if dep_base in candidate:
                visit(candidate)
                break
for entry in entry_points:
    visit(entry)

# Mark and rename CORE files
for fname in os.listdir(FID_STORAGE):
    if not fname.endswith('-file-info-data.md'):
        continue
    fpath = os.path.join(FID_STORAGE, fname)
    is_core = fname in core_files
    # Add CORE: yes or no at the top (if not already present)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'CORE:' not in content:
        content = f'CORE: {"yes" if is_core else "no"}\n' + content
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
    # Rename file with CORE- prefix if core
    if is_core and not fname.startswith(CORE_PREFIX):
        new_fname = CORE_PREFIX + fname
        new_fpath = os.path.join(FID_STORAGE, new_fname)
        shutil.move(fpath, new_fpath)
        print(f"Renamed {fname} -> {new_fname}")
    elif not is_core and fname.startswith(CORE_PREFIX):
        # Remove CORE- if not core
        new_fname = fname[len(CORE_PREFIX):]
        new_fpath = os.path.join(FID_STORAGE, new_fname)
        shutil.move(fpath, new_fpath)
        print(f"Renamed {fname} -> {new_fname}")
    else:
        print(f"Checked {fname} (CORE: {'yes' if is_core else 'no'})")
