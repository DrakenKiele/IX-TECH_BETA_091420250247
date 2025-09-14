# BREADCRUMB: [Project/Module] > annotate_modules.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: annotate_modules.py
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
This script will scan your documentation for module names and descriptions,
and insert or update a docstring header in each corresponding Python module file.

- It expects a markdown file with a table or list of modules and descriptions.
- It expects your module files to be named with the acronym or full name (case-insensitive).
- It will add or update a docstring at the top of each file.

USAGE:
    python annotate_modules.py <path_to_docs_md> <path_to_code_root>

"""
import os
import re
import sys

DOCS_MD = sys.argv[1] if len(sys.argv) > 1 else "docs/+Aniota - Nuts and Bolts.md"
CODE_ROOT = sys.argv[2] if len(sys.argv) > 2 else "."

# 1. Parse module names and descriptions from the markdown doc
def parse_modules_from_md(md_path):
    modules = []
    with open(md_path, encoding="utf-8") as f:
        text = f.read()
    # Look for table lines: Name\tAcronym\tCategory\tDescription
    table_pattern = re.compile(r"^([\w\s\-&]+)\t([A-Z]{2,4})\t\w+\t(.+)$", re.MULTILINE)
    for match in table_pattern.finditer(text):
        name, acronym, desc = match.groups()
        modules.append({
            "name": name.strip(),
            "acronym": acronym.strip(),
            "desc": desc.strip()
        })
    return modules

# 2. For each module, find the corresponding .py file and add/update docstring
def annotate_module_files(modules, code_root):
    for mod in modules:
        found = False
        # Search for file by acronym or name (case-insensitive)
        for root, dirs, files in os.walk(code_root):
            for fname in files:
                if not fname.endswith(".py"): continue
                fname_lower = fname.lower()
                if mod["acronym"].lower() in fname_lower or mod["name"].replace(" ", "_").lower() in fname_lower:
                    fpath = os.path.join(root, fname)
                    with open(fpath, encoding="utf-8") as f:
                        lines = f.readlines()
                    # Remove existing top-level docstring if present
                    if lines and lines[0].strip().startswith('"""'):
                        end_idx = 1
                        while end_idx < len(lines) and not lines[end_idx].strip().endswith('"""'):
                            end_idx += 1
                        if end_idx < len(lines):
                            lines = lines[end_idx + 1:]
                    # Insert new docstring
                    doc = f'"""\n{mod["acronym"]} - {mod["name"]}\n{mod["desc"]}\n"""\n'
                    lines = [doc] + lines
                    with open(fpath, "w", encoding="utf-8") as f:
                        f.writelines(lines)
                    print(f"[ANNOTATED] {fpath}")
                    found = True
        if not found:
            print(f"[NOT FOUND] {mod['acronym']} - {mod['name']}")

if __name__ == "__main__":
    modules = parse_modules_from_md(DOCS_MD)
    annotate_module_files(modules, CODE_ROOT)
    print("\nAnnotation complete.")
