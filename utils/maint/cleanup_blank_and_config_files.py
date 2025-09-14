# BREADCRUMB: [Project/Module] > cleanup_blank_and_config_files.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: cleanup_blank_and_config_files.py
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
from datetime import datetime


# Path math helpers
class Path(str):
    def __add__(self, other):
        return Path(os.path.join(self, other))
    def __sub__(self, other):
        # Remove 'other' from the end if present
        if self.endswith(other):
            return Path(self[:-len(other)])
        return self

# Set PROJECT_ROOT to two levels up from this script (the repo root)
PROJECT_ROOT = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
IX_TECH = PROJECT_ROOT + 'IX-TECH'
DEVLOG = IX_TECH + 'backend' + 'docs' + '+devLog.md'

# File extensions and names to consider as config or blank
CONFIG_EXTS = ['.ini', '.cfg', '.env', '.json', '.toml', '.yaml', '.yml']
CONFIG_NAMES = [
    'config', 'settings', 'manifest', 'requirements', 'docker-compose'
]


# Helper to log actions
def log(msg):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_dir = os.path.dirname(DEVLOG)
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    with open(DEVLOG, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {msg}\n")
    print(msg)


# Delete blank files and config files outside IX-TECH
def delete_blank_and_config_files():
    log('--- Starting config/blank file cleanup ---')
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Don't delete inside IX-TECH
        if IX_TECH in os.path.abspath(root):
            continue
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, PROJECT_ROOT)
            # Check for blank file
            try:
                if os.path.getsize(file_path) == 0:
                    os.remove(file_path)
                    log(f"Deleted blank file: {rel_path}")
                    continue
            except Exception:
                continue
            # Check for config file by extension or name
            name, ext = os.path.splitext(file)
            if (
                ext in CONFIG_EXTS or
                any(n in name.lower() for n in CONFIG_NAMES)
            ):
                os.remove(file_path)
                log(f"Deleted config file: {rel_path}")
    log('--- Config/blank file cleanup complete ---')


if __name__ == "__main__":
    delete_blank_and_config_files()
