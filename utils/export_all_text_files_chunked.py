# BREADCRUMB: [Project/Module] > export_all_text_files_chunked.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: export_all_text_files_chunked.py
# Purpose: Central entry point and orchestrator for the system.
#
# Type: Main launcher script (not a class file, but acts as a system controller)
#
# Responsibilities:
#   - Loads configuration and resolves paths for all major dependencies ([List dependencies])
#   - Checks and manages the status of critical services (starts/stops as needed)
#   - Launches and monitors all core services:
#       * [Service 1] ([Tech/Port])
#       * [Service 2] ([Tech/Port])
#       * [Service 3] ([Tech/Port])
#       * [Service 4] ([Tech/Port])
#   - Provides command-line flags for status reporting and service termination ([flags])
#   - Handles process cleanup and error reporting
#
# Key Functions:
#   - main(): Orchestrates the full launch sequence and handles CLI flags
#   - launch_service(): Starts a subprocess for a given service
#   - stream_logs(): Streams and truncates logs from subprocesses
#   - run_static_server(): Runs the static file server (if applicable)
#   - is_port_in_use(): Checks if a TCP port is active
#   - get_service_status(): Returns a dict of service statuses
#   - check_service(): Ensures a service is running, starts if not
#   - resolve_path(): Finds the first valid path for a dependency from config
#   - find_dependency_path(): Locates the executable for a dependency
#
# Relationships:
#   - Reads from configuration files for dependency paths
#   - Launches and monitors other scripts and processes
#   - Interacts with the OS for process and port management
#
# Usefulness & Execution Path:
#   - main() is the required entry point and is always used.
#   - [List of essential functions] are all actively used and essential for orchestrating the system.
#   - [Legacy/optional functions] may become obsolete as the system evolves.
#
# Suggestions:
#   - **Performance:** [Performance notes]
#   - **Code Cleanliness:** [Code cleanliness notes]
#   - **Location:** [Location notes]
#   - **Function:** [Function notes]
#   - **Legacy:** [Legacy notes]
#   - **Config:** [Config notes]
#   - **Error Handling:** [Error handling notes]
#   - **Cross-Platform:** [Cross-platform notes]
#
# Summary:
#   - This file is essential, well-placed, and mostly clean.
#   - All major functions are used and support the requirements for modularity, orchestration, and portability.
#   - Minor cleanup (removing redundant code, legacy functions) is recommended to enhance maintainability.
#   - Overall, it effectively serves as the central controller for the system.
#
# CHANGE MANAGEMENT LOG
# Date        | Initials | Description of Change                | Reason for Change
# -----------------------------------------------------------------------------
# 2025-09-05 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------

import os
import fnmatch

# This script will recursively collect all text-based files (not .gitignored) from the project root and export them to multiple files, each no larger than 200MB.
# It will include .py, .md, .json, .txt, .html, .js, .css, .yml, .yaml, .csv, .ini, .cfg, .xml, .toml, .bat, .sh, .ps1, and more.
# Binary files and files ignored by .gitignore will be skipped.

OUTPUT_FILE_PREFIX = "all_text_files_export_part"
MAX_CHUNK_SIZE = 92 * 1024 * 1024  # 92 MB
TEXT_EXTENSIONS = [
    ".py", ".md", ".json", ".txt", ".html", ".js", ".css", ".yml", ".yaml", ".csv", ".ini", ".cfg", ".xml", ".toml", ".bat", ".sh", ".ps1"
]
CODE_EXTENSIONS = [".py", ".js", ".html", ".css", ".bat", ".sh", ".ps1"]
DOC_EXTENSIONS = [".md", ".txt", ".json", ".yml", ".yaml", ".csv", ".ini", ".cfg", ".xml", ".toml"]
GITIGNORE = ".gitignore"

# Folders to exclude (not your own code)
EXCLUDED_FOLDERS = [
    "__pycache__",
    ".git",
    "node_modules",
    ".vscode",
    ".vs",
    "bin",
    "obj",
    "build",
    "dist",
    "target",
    ".pytest_cache",
    ".mypy_cache",
    "coverage",
    ".coverage",
    "venv",
    ".venv",
    "env",
    ".env",
    "portable_postgres",
    "PostgreSQL",
    "Python313",
    "node2218",
    "PortableGit",
    "VSCode"
]


def load_gitignore_patterns(root_dir):
    patterns = []
    gitignore_path = os.path.join(root_dir, GITIGNORE)
    if os.path.isfile(gitignore_path):
        with open(gitignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    patterns.append(line)
    return patterns


def is_ignored(path, patterns, root_dir):
    rel_path = os.path.relpath(path, root_dir)
    
    # Check if any part of the path contains an excluded folder
    path_parts = rel_path.split(os.sep)
    for folder in EXCLUDED_FOLDERS:
        if folder in path_parts:
            return True
    
    # Check gitignore patterns
    for pat in patterns:
        if fnmatch.fnmatch(rel_path, pat) or fnmatch.fnmatch(os.path.basename(rel_path), pat):
            return True
    return False


def should_include(filename):
    return any(filename.lower().endswith(ext) for ext in TEXT_EXTENSIONS)


def should_include_code(filename):
    return any(filename.lower().endswith(ext) for ext in CODE_EXTENSIONS)


def should_include_doc(filename):
    return any(filename.lower().endswith(ext) for ext in DOC_EXTENSIONS)


def collect_text_files(root_dir, patterns):
    text_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            if should_include(fname) and not is_ignored(fpath, patterns, root_dir):
                text_files.append(fpath)
    return text_files


def collect_code_files(root_dir, patterns):
    code_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            if should_include_code(fname) and not is_ignored(fpath, patterns, root_dir):
                code_files.append(fpath)
    return code_files


def collect_doc_files(root_dir, patterns):
    doc_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            if should_include_doc(fname) and not is_ignored(fpath, patterns, root_dir):
                doc_files.append(fpath)
    return doc_files


def export_all_text_files_chunked(root_dir, output_prefix, max_chunk_size):
    patterns = load_gitignore_patterns(root_dir)
    text_files = collect_text_files(root_dir, patterns)
    chunk_idx = 1
    chunk_size = 0
    out = open(f"{output_prefix}{chunk_idx}.txt", "w", encoding="utf-8")
    for fpath in text_files:
        header = f"# --- {fpath} ---\n"
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception as e:
            content = f"[Could not read file: {e}]\n"
        entry = header + content + "\n\n"
        entry_bytes = entry.encode("utf-8")
        if chunk_size + len(entry_bytes) > max_chunk_size:
            out.close()
            chunk_idx += 1
            out = open(f"{output_prefix}{chunk_idx}.txt", "w", encoding="utf-8")
            chunk_size = 0
        out.write(entry)
        chunk_size += len(entry_bytes)
    out.close()
    print(f"Exported {len(text_files)} files to {chunk_idx} chunk(s)")


def export_code_files_chunked(root_dir, output_prefix, max_chunk_size):
    patterns = load_gitignore_patterns(root_dir)
    code_files = collect_code_files(root_dir, patterns)
    chunk_idx = 1
    chunk_size = 0
    out = open(f"{output_prefix}_code_part{chunk_idx}.txt", "w", encoding="utf-8")
    for fpath in code_files:
        header = f"# --- {fpath} ---\n"
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception as e:
            content = f"[Could not read file: {e}]\n"
        entry = header + content + "\n\n"
        entry_bytes = entry.encode("utf-8")
        if chunk_size + len(entry_bytes) > max_chunk_size:
            out.close()
            chunk_idx += 1
            out = open(f"{output_prefix}_code_part{chunk_idx}.txt", "w", encoding="utf-8")
            chunk_size = 0
        out.write(entry)
        chunk_size += len(entry_bytes)
    out.close()
    print(f"Exported {len(code_files)} code files to {chunk_idx} chunk(s)")


def export_doc_files_chunked(root_dir, output_prefix, max_chunk_size):
    patterns = load_gitignore_patterns(root_dir)
    doc_files = collect_doc_files(root_dir, patterns)
    chunk_idx = 1
    chunk_size = 0
    out = open(f"{output_prefix}_docs_part{chunk_idx}.txt", "w", encoding="utf-8")
    for fpath in doc_files:
        header = f"# --- {fpath} ---\n"
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except Exception as e:
            content = f"[Could not read file: {e}]\n"
        entry = header + content + "\n\n"
        entry_bytes = entry.encode("utf-8")
        if chunk_size + len(entry_bytes) > max_chunk_size:
            out.close()
            chunk_idx += 1
            out = open(f"{output_prefix}_docs_part{chunk_idx}.txt", "w", encoding="utf-8")
            chunk_size = 0
        out.write(entry)
        chunk_size += len(entry_bytes)
    out.close()
    print(f"Exported {len(doc_files)} doc files to {chunk_idx} chunk(s)")


if __name__ == "__main__":
    # Get the directory containing the current script
    script_dir = os.path.dirname(__file__)

    # Go up four parent directories from the script's location to the IX-TECH root
    search_root = os.path.abspath(os.path.join(script_dir, '..', '..'))
    
    # This diagnostic print statement is important
    print(f"Starting search from root directory: {search_root}")

    # Export all text files
    print("\n=== Exporting ALL text files ===")
    export_all_text_files_chunked(search_root, OUTPUT_FILE_PREFIX, MAX_CHUNK_SIZE)

    # Export code files only
    print("\n=== Exporting CODE files only ===")
    export_code_files_chunked(search_root, OUTPUT_FILE_PREFIX, MAX_CHUNK_SIZE)

    # Export documentation files only
    print("\n=== Exporting DOCUMENTATION files only ===")
    export_doc_files_chunked(search_root, OUTPUT_FILE_PREFIX, MAX_CHUNK_SIZE)