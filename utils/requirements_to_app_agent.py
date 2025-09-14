# BREADCRUMB: [Project/Module] > requirements_to_app_agent.py
# This file is the root entry point and orchestrator for the entire system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: requirements_to_app_agent.py
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
import re
import json
from datetime import datetime

REQUIREMENTS_MD = 'docs/+ALL REQUIREMENTS.md'
CORE_DIR = 'backend/core/'
CONFIG_DIR = 'backend/config/'

# Map requirement IDs to modules/configs (extend as needed)
REQUIREMENT_MAP = {
    '1': ['perception_cortex.py', 'inference_cortex.py', 'temporal_cortex.py', 'atemporal_cortex.py', 'communication_cortex.py'],
    '2': ['recursive_pattern_matcher.py'],
    '3': ['memory_buffers.py'],
    '5': ['core/'],
    '32': ['config_phonemix_template.json'],
    '33': ['config_phonemix_template.json'],
    '34': ['documentation_manager.py'],
    '35': ['MAQNETIX/phonemix-engine.js'],
    '36': ['communication_cortex.py'],
    # ...extend for all requirements...
}

META_BLUEPRINT_HEADER = '## META-ORCHESTRATION BLUEPRINT (For Recursive Automation)'
ACTIONABLE_TASKS_HEADER = '## ACTIONABLE IMPROVEMENT & AUTOMATION TASKS (For Next Cycle)'


def parse_dependency_ordered_requirements(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()
    # Fallback: parse all numbered requirements in the requirements section
    req_ids = re.findall(r'^(\d+)\. ', text, re.MULTILINE)
    return req_ids


def parse_orchestration_log(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()
    steps = re.findall(r'### Step (?:\(auto\) )?\d*:?\n- \*\*Requirement\(s\):\*\* (.*?)\n', text)
    completed = set()
    for reqs in steps:
        completed.update(re.findall(r'\d+', reqs))
    return completed


def check_or_generate_module(module, base_dir):
    path = os.path.join(base_dir, module)
    if os.path.exists(path):
        print(f"[OK] {module} exists.")
        return 'exists'
    

    # Generate skeleton
    if module.endswith('.py'):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(f'"""Skeleton for {module}"""\n\n')
        print(f"[GEN] Created skeleton: {module}")
        return 'generated'
    

    elif module.endswith('.json'):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump({}, f, indent=2)
        print(f"[GEN] Created skeleton: {module}")
        return 'generated'
    
    elif module.endswith('.js'):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(f'// Skeleton for {module}\n\n')
        print(f"[GEN] Created skeleton: {module}")
        return 'generated'


def append_orchestration_step(md_path, req_id, modules, actions, notes):
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    step = f"\n### Step (auto) {now}:\n- **Requirement(s):** {req_id}\n- **Modules:** {', '.join(modules)}\n- **Action:** {actions}\n- **Decision/Note:** {notes}\n"
    with open(md_path, 'a', encoding='utf-8') as f:
        f.write(step)
    print(f"[LOG] Appended orchestration step for requirement {req_id}.")


def update_actionable_tasks(md_path, new_tasks):
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()
    if ACTIONABLE_TASKS_HEADER not in text:
        return
    before, after = text.split(ACTIONABLE_TASKS_HEADER, 1)
    tasks_section, rest = after.split('---', 1)
    lines = [line for line in tasks_section.split('\n') if line.strip() and not line.strip().startswith('- [x]')]
    for task in new_tasks:
        lines.append(f'- [ ] {task}')
    new_tasks_section = '\n'.join(sorted(set(lines)))
    new_text = before + ACTIONABLE_TASKS_HEADER + '\n\n' + new_tasks_section + '\n---' + rest
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("[LOG] Updated actionable tasks.")


def update_meta_blueprint(md_path, meta_note):
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()
    if META_BLUEPRINT_HEADER not in text:
        return
    before, after = text.split(META_BLUEPRINT_HEADER, 1)
    blueprint, rest = after.split('---', 1)
    blueprint = blueprint.strip() + f"\n- [AUTO] {meta_note}"
    new_text = before + META_BLUEPRINT_HEADER + '\n' + blueprint + '\n---' + rest
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("[LOG] Updated meta-blueprint.")


def main():
    req_ids = parse_dependency_ordered_requirements(REQUIREMENTS_MD)
    completed = parse_orchestration_log(REQUIREMENTS_MD)
    print(f"Parsed requirements: {req_ids}")
    print(f"Completed requirements: {completed}")
    meta_notes = []
    new_tasks = []
    for req_id in req_ids:
        if req_id in completed:
            continue
        modules = REQUIREMENT_MAP.get(req_id, [])
        actions = []
        for module in modules:
            # Determine base directory by file extension or folder
            if module.endswith('.py'):
                result = check_or_generate_module(module, CORE_DIR)
            elif module.endswith('.json'):
                result = check_or_generate_module(module, CONFIG_DIR)
            elif module.endswith('.js'):
                result = check_or_generate_module(module, 'MAQNETIX/')
            elif module.endswith('/'):
                result = check_or_generate_module(module, CORE_DIR)
            else:
                result = check_or_generate_module(module, CORE_DIR)
            actions.append(f"{result}: {module}")
            if result == 'generated':
                new_tasks.append(f"Implement logic for {module} (requirement {req_id})")
        append_orchestration_step(REQUIREMENTS_MD, req_id, modules, '; '.join(actions), 'Auto-generated by agent.')
        meta_notes.append(f"Processed requirement {req_id} and updated orchestration log.")
    if new_tasks:
        update_actionable_tasks(REQUIREMENTS_MD, new_tasks)
    if meta_notes:
        update_meta_blueprint(REQUIREMENTS_MD, '; '.join(meta_notes))
    # Handoff protocol: log meta-level process change
    print("[META] Cycle complete. State exported. Ready for next agent or human handoff.")

if __name__ == '__main__':
    main()
