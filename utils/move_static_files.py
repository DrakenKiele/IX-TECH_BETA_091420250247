# BREADCRUMB: [Project/Module] > move_static_files.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: move_static_files.py
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
import shutil
import json

STATIC_ROOT = os.path.join('inetpub', 'www')
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATHS_JSON = os.path.join(PROJECT_ROOT, 'scripts', 'paths.json')

def load_paths_json():
    try:
        with open(PATHS_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"[ERROR] Could not load paths.json: {e}")
        return {}

def scan_static_files():
    static_exts = {'.html', '.js', '.css'}
    static_files = []
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Skip inetpub/www (already target)
        if STATIC_ROOT in root:
            continue
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in static_exts or 'assets' in root or 'stylesheets' in root:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, PROJECT_ROOT)
                static_files.append(rel_path)
    return static_files

def build_move_plan():
    paths = load_paths_json()
    move_plan = {}
    # 1. Add all static files from paths.json
    for k, v in paths.items():
        if any(v.endswith(ext) for ext in ['.html', '.js', '.css', '.webmanifest', '.json']) or 'assets' in v or 'stylesheets' in v:
            src = os.path.normpath(os.path.join(PROJECT_ROOT, v))
            # Place in inetpub/www, preserve subfolders after www if present
            if 'inetpub' in v:
                # Already in www, skip
                continue
            fname = os.path.basename(v)
            if v.endswith('.js'):
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'js', fname)
            elif v.endswith('.css'):
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'stylesheets', fname)
            elif v.endswith('.html'):
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, fname)
            elif v.endswith('.webmanifest') or v.endswith('.json'):
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, fname)
            elif 'assets' in v:
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'assets', fname)
            elif 'stylesheets' in v:
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'stylesheets', fname)
            else:
                dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, fname)
            move_plan[src] = dst
    # 2. Add all static files from scan
    for rel_path in scan_static_files():
        src = os.path.join(PROJECT_ROOT, rel_path)
        # Skip if already in move_plan or already in inetpub/www
        if src in move_plan or STATIC_ROOT in src:
            continue
        fname = os.path.basename(rel_path)
        if rel_path.endswith('.js'):
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'js', fname)
        elif rel_path.endswith('.css'):
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'stylesheets', fname)
        elif rel_path.endswith('.html'):
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, fname)
        elif rel_path.endswith('.webmanifest') or rel_path.endswith('.json'):
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, fname)
        elif 'assets' in rel_path:
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'assets', fname)
        elif 'stylesheets' in rel_path:
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, 'stylesheets', fname)
        else:
            dst = os.path.join(PROJECT_ROOT, STATIC_ROOT, fname)
        move_plan[src] = dst
    return move_plan

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def move_file(src, dst):
    if not os.path.exists(src):
        print(f"[MISSING] {src}")
        return
    ensure_dir(os.path.dirname(dst))
    if os.path.exists(dst):
        print(f"[SKIP] {dst} already exists.")
        return
    shutil.move(src, dst)
    print(f"[MOVE] {src} -> {dst}")

def main():
    move_plan = build_move_plan()
    print(f"Planned moves: {len(move_plan)} files\n")
    for src, dst in move_plan.items():
        move_file(src, dst)
    print("\nMove plan complete. Review your project and update references as needed.")

if __name__ == "__main__":
    main()
