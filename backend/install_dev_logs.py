

"""
BREADCRUMB: backend > install_dev_logs.py
FILE: install_dev_logs.py
ROLE: Utility script for installing development logs in the codebase.
STATUS: [U]tility
FLOW CHART: Standalone utility, not part of main runtime flow.
NOTES:
    - Used for dev log setup and maintenance.
    - Not called by main orchestrators.
    - Update this header if integrated into runtime or called by other modules.
"""
"""
COMPREHENSIVE DEV LOG INSTALLER
===============================

This script adds development logging to ALL backend Python files systematically.
It identifies dependencies and adds logging to track the complete dependency chain.
"""

import os
import re
from typing import List, Set

def add_dev_log_to_file(file_path: str, file_name: str) -> bool:
    """Add dev logging to a single Python file"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if dev log already present
        if 'log_file_traversal' in content:
            print(f"✓ {file_name}: Dev log already present")
            return True
        
        # Find the first import or class/function definition
        lines = content.split('\n')
        insert_line = 0
        
        # Find where to insert dev log imports
        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith('import ') or stripped.startswith('from '):
                insert_line = i
                break
            elif stripped.startswith('class ') or stripped.startswith('def '):
                insert_line = i
                break
            elif stripped and not stripped.startswith('#') and not stripped.startswith('"""'):
                insert_line = i
                break
        
        # Determine the relative path to dev_log.py
        # Count directory depth to get back to backend/
        depth = file_path.replace('\\', '/').count('backend/') - 1 + file_path.replace('\\', '/').count('/')
        if 'backend/' in file_path:
            backend_path_parts = file_path.split('backend/')[-1].split('/')
            depth = len(backend_path_parts) - 1  # -1 for the file itself
        else:
            depth = 0
        
        # Create dev log import
        dev_log_import = f"""
import sys
import os
{"sys.path.append(os.path.dirname(" + "os.path.dirname(" * depth + "__file__" + ")" * depth + "))" if depth > 0 else ""}
try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("{file_name}", "system_initialization", "import", "Auto-generated dev log entry")
"""
        
        # Insert dev log
        lines.insert(insert_line, dev_log_import)
        
        # Look for imports to add dependency logging
        import_lines = []
        for i, line in enumerate(lines):
            stripped = line.strip()
            if stripped.startswith('from ') and ' import ' in stripped and not 'dev_log' in stripped:
                # Extract module name
                module_match = re.match(r'from\s+([^\s]+)\s+import', stripped)
                if module_match:
                    module_name = module_match.group(1)
                    if not module_name.startswith('.') or module_name.startswith('..'):
                        continue  # Skip external modules
                    import_lines.append(f'log_file_dependency("{file_name}", "{module_name}", "import")')
            elif stripped.startswith('import ') and not 'dev_log' in stripped and not any(std in stripped for std in ['sys', 'os', 'json', 'time', 'datetime', 're', 'typing']):
                # Extract module name
                module_match = re.match(r'import\s+([^\s]+)', stripped)
                if module_match:
                    module_name = module_match.group(1)
                    import_lines.append(f'log_file_dependency("{file_name}", "{module_name}", "import")')
        
        # Add dependency logs
        if import_lines:
            dependency_logs = '\n# Log dependencies\n' + '\n'.join(import_lines) + '\n'
            lines.append(dependency_logs)
        
        # Write back to file
        new_content = '\n'.join(lines)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ {file_name}: Dev log added successfully")
        return True
        
    except Exception as e:
        print(f"✗ {file_name}: Error adding dev log - {e}")
        return False

def find_all_python_files(directory: str) -> List[str]:
    """Find all Python files in the backend directory"""
    python_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.py') and not file.startswith('__'):
                file_path = os.path.join(root, file)
                python_files.append(file_path)
    
    return python_files

def install_dev_logs_to_all_files():
    """Install dev logs to all backend Python files"""
    
    backend_dir = "."  # Current directory should be backend/
    
    print("COMPREHENSIVE DEV LOG INSTALLATION")
    print("=" * 40)
    
    # Find all Python files
    python_files = find_all_python_files(backend_dir)
    
    print(f"Found {len(python_files)} Python files to process")
    print()
    
    success_count = 0
    for file_path in python_files:
        file_name = os.path.basename(file_path)
        
        # Skip certain files
        if file_name in ['dev_log.py', 'test_dependency_chain.py', '__init__.py']:
            print(f"⏭️  {file_name}: Skipped (system file)")
            continue
        
        if add_dev_log_to_file(file_path, file_name):
            success_count += 1
    
    print()
    print(f"SUMMARY: {success_count}/{len(python_files)} files processed successfully")
    
    # Generate dependency report
    print("\nGenerating dependency report...")
    try:
        from dev_log import generate_dependency_report
        generate_dependency_report()
    except ImportError:
        print("⚠️ Could not generate dependency report - dev_log not available")

if __name__ == "__main__":
    install_dev_logs_to_all_files()
