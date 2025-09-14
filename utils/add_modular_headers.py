HTML_HEADER_TEMPLATE = '''<!--
File: {filename}
Purpose: Central entry point and orchestrator for the system.
Type: Main launcher script (not a class file, but acts as a system controller)
Responsibilities:
  - Loads configuration and resolves paths for all major dependencies ([List dependencies])
  - Checks and manages the status of critical services (starts/stops as needed)
  - Launches and monitors all core services:
      * [Service 1] ([Tech/Port])
      * [Service 2] ([Tech/Port])
      * [Service 3] ([Tech/Port])
      * [Service 4] ([Tech/Port])
  - Provides command-line flags for status reporting and service termination ([flags])
  - Handles process cleanup and error reporting
Key Functions:
  - main(): Orchestrates the full launch sequence and handles CLI flags
  - launch_service(): Starts a subprocess for a given service
  - stream_logs(): Streams and truncates logs from subprocesses
  - run_static_server(): Runs the static file server (if applicable)
  - is_port_in_use(): Checks if a TCP port is active
  - get_service_status(): Returns a dict of service statuses
  - check_service(): Ensures a service is running, starts if not
  - resolve_path(): Finds the first valid path for a dependency from config
  - find_dependency_path(): Locates the executable for a dependency
Relationships:
  - Reads from configuration files for dependency paths
  - Launches and monitors other scripts and processes
  - Interacts with the OS for process and port management
CHANGE MANAGEMENT LOG
Date        | Initials | Description of Change                | Reason for Change
-----------------------------------------------------------------------------
2025-09-11 | [XX]    | [Description]                        | [Reason]
-----------------------------------------------------------------------------
-->
'''

def clean_html_header(filepath):
    """
    Remove all lines at the top of an HTML file that start with # or <!-- #, and replace with a single clean HTML comment block header.
    """
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    # Remove all lines at the top that start with # or <!-- # or <!-- <!-- #
    i = 0
    while i < len(lines):
        l = lines[i].lstrip()
        if l.startswith('#') or l.startswith('<!-- #') or l.startswith('<!-- <!-- #') or l.strip() == '<!--' or l.strip() == '-->':
            i += 1
        else:
            break
    # Insert the clean header
    new_lines = [HTML_HEADER_TEMPLATE.format(filename=filename)] + lines[i:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

def clean_html_headers_in_dir(root):
    """Recursively clean up all HTML headers in the directory."""
    for dirpath, dirs, files in os.walk(root):
        for file in files:
            if file.lower().endswith('.html'):
                clean_html_header(os.path.join(dirpath, file))
import os
import datetime
import re
import argparse

def remove_all_duplicate_modular_headers(filepath):
    """
    Remove all duplicate modular headers (of any comment style) from a file, leaving only the first occurrence at the top.
    """
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    # Patterns for all supported header styles
    patterns = [
        r'(# File: .+[\s\S]+?# -+\n)',  # Python
        r'(// File: .+[\s\S]+?// -+\n)',  # JS
        r'(\/\* # File: .+[\s\S]+?\*\/\n)',  # CSS
        r'(<!-- File: .+[\s\S]+?-->)',  # HTML
    ]
    for pat in patterns:
        matches = list(re.finditer(pat, content, re.MULTILINE))
        if len(matches) > 1:
            # Keep only the first occurrence
            first = matches[0]
            keep = content[first.start():first.end()]
            # Remove all other occurrences
            rest = re.sub(pat, '', content[first.end():])
            content = keep + rest
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def remove_all_duplicate_modular_headers_in_dir(root):
    """Recursively remove duplicate modular headers from all supported files in the directory."""
    for dirpath, dirs, files in os.walk(root):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.py', '.js', '.css', '.html']:
                remove_all_duplicate_modular_headers(os.path.join(dirpath, file))

def remove_all_duplicate_modular_headers_in_dir(root):
    """Recursively remove duplicate modular headers from all supported files in the directory."""
    for dirpath, dirs, files in os.walk(root):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.py', '.js', '.css', '.html']:
                remove_all_duplicate_modular_headers(os.path.join(dirpath, file))

def extract_and_save_header(filepath, header_template=None):
    """
    For JS files: If a header (lines starting with // at the top) exists, copy it, create a .md file, and paste the contents into it.
    If no header exists, create a .md file and paste the header template into it.
    For other file types, extend as needed.
    """
    filename = os.path.basename(filepath)
    md_path = filepath + ".md"
    ext = os.path.splitext(filename)[1].lower()
    header_lines = []
    code_lines = []
    header_found = False
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    if ext == ".js":
        # JS: lines starting with //
        for line in lines:
            if line.strip().startswith('//'):
                header_lines.append(line)
            else:
                break
        code_lines = lines[len(header_lines):]
        header_found = len(header_lines) > 0
    elif ext == ".py":
        # Python: lines starting with #
        for line in lines:
            if line.strip().startswith('#'):
                header_lines.append(line)
            else:
                break
        code_lines = lines[len(header_lines):]
        header_found = len(header_lines) > 0
    elif ext == ".css":
        # CSS: block /* ... */ at the top
        in_header = False
        for i, line in enumerate(lines):
            if i == 0 and line.strip().startswith('/*'):
                in_header = True
            if in_header:
                header_lines.append(line)
                if '*/' in line:
                    in_header = False
                    code_lines = lines[i+1:]
                    header_found = True
                    break
        if not header_found:
            code_lines = lines
    elif ext == ".html":
        # HTML: block <!-- ... --> at the top
        in_header = False
        for i, line in enumerate(lines):
            if i == 0 and line.strip().startswith('<!--'):
                in_header = True
            if in_header:
                header_lines.append(line)
                if '-->' in line:
                    in_header = False
                    code_lines = lines[i+1:]
                    header_found = True
                    break
        if not header_found:
            code_lines = lines
    else:
        code_lines = lines
    # Write header to .md file
    with open(md_path, 'w', encoding='utf-8') as md:
        if header_found:
            md.writelines(header_lines)
        else:
            if header_template:
                md.write(header_template.format(filename=filename, date=datetime.date.today().isoformat()))
    # Remove header from code file if present
    if header_found:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(code_lines)

def process_js_headers_in_dir(root, header_template=None):
    """Process all .js files in the directory and subdirectories."""
    for dirpath, dirs, files in os.walk(root):
        for file in files:
            if file.endswith('.js'):
                extract_and_save_header(os.path.join(dirpath, file), header_template=header_template)


HEADER_TEMPLATE = '''# {date} | [XX]    | [Description]                        | [Reason]
'''

EXTENSIONS = ['.py', '.js', '.css', '.html']
EXCLUDED_DIRS = ['.venv', 'venv', 'node_modules', 'aniota_ui/node_modules', 'util', 'utils', 'doc', 'docs']


def remove_all_headers(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    # Remove the modular header if present at the top (Python/JS/CSS/HTML)
    patterns = [
        r'^(# BREADCRUMB: \[Project/Module\][\s\S]+?# -+\n)',  # Python
        r'^(// BREADCRUMB: \[Project/Module\][\s\S]+?// -+\n)',  # JS
        r'^(\/\* BREADCRUMB: \[Project/Module\][\s\S]+?\*\/\n)',  # CSS
        r'^(<!-- BREADCRUMB: \[Project/Module\][\s\S]+?-->)',  # HTML
        r'^(# File: .+[\s\S]+?# -+\n)',  # Alt Python header
    ]
    new_content = content
    for pat in patterns:
        new_content = re.sub(pat, '', new_content, count=1, flags=re.MULTILINE)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

def remove_headers_and_md_in_dirs(root, dirs_to_clean=None):
    if dirs_to_clean is None:
        dirs_to_clean = ['.venv', 'node_modules']
    for dirpath, dirs, files in os.walk(root):
        for d in dirs_to_clean:
            if d in dirpath.split(os.sep):
                # Remove headers from code files
                for file in files:
                    ext = os.path.splitext(file)[1].lower()
                    if ext in EXTENSIONS:
                        filepath = os.path.join(dirpath, file)
                        remove_duplicate_headers(filepath)
                    # Remove md files
                    if file.endswith('_header.md'):
                        try:
                            os.remove(os.path.join(dirpath, file))
                        except Exception:
                            pass

def clean_project(root):
    # Remove duplicate headers everywhere
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        if any(part in EXCLUDED_DIRS for part in dirpath.split(os.sep)):
            continue
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSIONS:
                remove_duplicate_headers(os.path.join(dirpath, file))
    # Remove headers and md files in .venv and node_modules
    remove_headers_and_md_in_dirs(root)
