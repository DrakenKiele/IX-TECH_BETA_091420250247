# BREADCRUMB: [Project/Module] > convertToAutoPathing.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: convertToAutoPathing.py
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

"""
convertToAutoPathing.py
Scans a Python file for hardcoded project file paths and replaces them with get_path("logical_name") calls using paths.json.
- Backs up the original file as <filename>.bak
- Adds import for get_path if missing
- Handles common cases (subprocess.Popen, open, etc.)
Usage: python convertToAutoPathing.py <target_file.py>
"""
import os
import sys
import json
import re

# Load logical paths
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..')
)
PATHS_JSON = os.path.join(PROJECT_ROOT, 'paths.json')
with open(PATHS_JSON, 'r', encoding='utf-8') as f:
    logical_paths = json.load(f)

# Reverse map: path -> logical name
path_to_logical = {v: k for k, v in logical_paths.items()}

IMPORT_BLOCK = (
    'import sys\n'
    'import os\n'
    'sys.path.append(os.path.abspath(os.path.join('
    'os.path.dirname(__file__), "..", "..")))\n'
    'from paths import get_path\n'
)


def backup_file(filename):
    bak = filename + '.bak'
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(bak, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Backup created: {bak}")


def convert_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    new_lines = []
    import_inserted = False
    for i, line in enumerate(lines):
        # Insert import block after any shebang or encoding lines
        if (
            not import_inserted and (
                i == 0 or
                not line.strip() or
                line.startswith('#!') or
                'coding' in line
            )
        ):
            new_lines.append(line)
            continue
        if not import_inserted:
            new_lines.append(IMPORT_BLOCK)
            import_inserted = True
        for path, logical in path_to_logical.items():
            # Replace string literal paths
            pattern = re.compile(rf'(["\"])({re.escape(path)})(["\"])')
            if pattern.search(line):
                line = pattern.sub(rf'get_path("{logical}")', line)
        new_lines.append(line)
    with open(filename, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Converted: {filename}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convertToAutoPathing.py <target_file.py>")
        sys.exit(1)
    target = sys.argv[1]
    if not os.path.isfile(target):
        print(f"File not found: {target}")
        sys.exit(1)
    backup_file(target)
    convert_file(target)
