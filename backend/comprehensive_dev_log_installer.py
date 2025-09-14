

"""
BREADCRUMB: backend > comprehensive_dev_log_installer.py
FILE: comprehensive_dev_log_installer.py
ROLE: Utility script for installing comprehensive development logs across the codebase.
STATUS: [U]tility
FLOW CHART: Standalone utility, not part of main runtime flow.
NOTES:
    - Used for dev log setup and maintenance.
    - Not called by main orchestrators.
    - Update this header if integrated into runtime or called by other modules.
"""
"""
Comprehensive Dev Log Installation for ALL Backend Files
=======================================================

This script will systematically add dev logging to every Python file
in the backend directory structure to trace the complete dependency chain.
"""

import os
import re
import sys
from pathlib import Path

def add_dev_log_to_file(file_path):
    """Add dev logging to a single Python file"""
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if dev logging already added
        if 'dev_log import' in content or 'log_file_traversal' in content:
            print(f"  ⏭️  {file_path} - Already has dev logging")
            return False
        
        # Skip if file is empty or too small
        if len(content.strip()) < 50:
            print(f"  ⏭️  {file_path} - File too small/empty")
            return False
        
        # Find the right place to insert dev logging
        lines = content.split('\n')
        insert_index = 0
        
        # Skip shebang and docstrings
        for i, line in enumerate(lines):
            if line.strip().startswith('#!'):
                insert_index = i + 1
            elif line.strip().startswith('"""') or line.strip().startswith("'''"):
                # Find end of docstring
                quote_type = '"""' if '"""' in line else "'''"
                if line.count(quote_type) >= 2:
                    insert_index = i + 1
                else:
                    for j in range(i + 1, len(lines)):
                        if quote_type in lines[j]:
                            insert_index = j + 1
                            break
                break
            elif line.strip() and not line.strip().startswith('#'):
                break
        
        # Determine relative path for dev_log import
        relative_depth = len(Path(file_path).parts) - len(Path('backend').parts) - 1
        if relative_depth <= 0:
            dev_log_import = "from dev_log import log_file_traversal, log_file_dependency"
            fallback_import = "from dev_log import log_file_traversal, log_file_dependency"
        else:
            dots = '.' * (relative_depth + 1)
            dev_log_import = f"from {dots}dev_log import log_file_traversal, log_file_dependency"
            fallback_import = f"from {'...' * relative_depth}dev_log import log_file_traversal, log_file_dependency"
        
        filename = os.path.basename(file_path)
        
        # Create dev log insertion
        dev_log_code = f'''
try:
    {dev_log_import}
except ImportError:
    try:
        {fallback_import}
    except ImportError:
        # Fallback if dev_log not available
        def log_file_traversal(*args, **kwargs): pass
        def log_file_dependency(*args, **kwargs): pass

log_file_traversal("{filename}", "import_chain", "module_load", "Backend system component")
'''
        
        # Insert dev logging code
        lines.insert(insert_index, dev_log_code)
        
        # Write back to file
        new_content = '\n'.join(lines)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ {file_path} - Dev logging added")
        return True
        
    except Exception as e:
        print(f"  ❌ {file_path} - Error: {e}")
        return False

def scan_and_add_dev_logs():
    """Scan all backend Python files and add dev logging"""
    
    backend_dir = Path('.')
    if not backend_dir.exists():
        backend_dir = Path('backend')
    
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return
    
    python_files = []
    
    # Find all Python files recursively
    for root, dirs, files in os.walk(backend_dir):
        # Skip __pycache__ directories
        dirs[:] = [d for d in dirs if d != '__pycache__']
        
        for file in files:
            if file.endswith('.py') and file != 'dev_log.py':
                file_path = os.path.join(root, file)
                python_files.append(file_path)
    
    print(f"🔍 Found {len(python_files)} Python files to process")
    print()
    
    # Group files by directory for organized processing
    files_by_dir = {}
    for file_path in python_files:
        dir_path = os.path.dirname(file_path)
        if dir_path not in files_by_dir:
            files_by_dir[dir_path] = []
        files_by_dir[dir_path].append(file_path)
    
    total_processed = 0
    total_updated = 0
    
    # Process files by directory
    for dir_path in sorted(files_by_dir.keys()):
        print(f"📁 Processing directory: {dir_path}")
        
        for file_path in sorted(files_by_dir[dir_path]):
            total_processed += 1
            if add_dev_log_to_file(file_path):
                total_updated += 1
        
        print()
    
    print("=" * 60)
    print(f"📊 SUMMARY:")
    print(f"  Total files processed: {total_processed}")
    print(f"  Files updated with dev logs: {total_updated}")
    print(f"  Files skipped: {total_processed - total_updated}")
    print()
    
    # Generate file list for dependency analysis
    print("📋 COMPLETE FILE LIST FOR DEPENDENCY ANALYSIS:")
    print("-" * 50)
    
    for dir_path in sorted(files_by_dir.keys()):
        print(f"\n{dir_path}:")
        for file_path in sorted(files_by_dir[dir_path]):
            filename = os.path.basename(file_path)
            print(f"  - {filename}")
    
    return total_processed, total_updated

def analyze_missing_files():
    """Analyze what key files might be missing from the dependency chain"""
    
    print("\n🔍 ANALYZING POTENTIAL MISSING DEPENDENCIES:")
    print("-" * 50)
    
    key_systems = {
        'Core Learning': ['sie.py', 'qvmle.py', 'truth_engine.py'],
        'Memory Systems': ['caf_mem.py', 'ldm.py', 'pdm.py', 'wms.py'],
        'Knowledge Management': ['knowledge_matrix.py', 'knowledge_registry.py'],
        'API Layer': ['main.py', 'thin_client_api.py', 'static_server.py'],
        'Phonemix System': ['phonemix_entry_main.py', 'phonemix_project_generator.py'],
        'Learning Analytics': ['microvibration_auth.py', 'operant_conditioning.py'],
        'Social Systems': ['viral_token_network.py', 'social_conditioning_system.py']
    }
    
    for system_name, required_files in key_systems.items():
        print(f"\n{system_name}:")
        for file_name in required_files:
            found = False
            for root, dirs, files in os.walk('.'):
                if file_name in files:
                    print(f"  ✅ {file_name} - Found in {root}")
                    found = True
                    break
            if not found:
                print(f"  ❌ {file_name} - Missing or not accessible")

if __name__ == "__main__":
    print("🚀 COMPREHENSIVE DEV LOG INSTALLATION")
    print("=" * 60)
    print("Adding development logging to ALL backend Python files...")
    print()
    
    processed, updated = scan_and_add_dev_logs()
    
    analyze_missing_files()
    
    print("\n🎯 NEXT STEPS:")
    print("1. Test import chain: python -c \"import main\"")
    print("2. Run dependency analysis: python test_dependency_chain.py")
    print("3. Check dev logs: ls *.log")
    print("4. Generate dependency report: python dependency_chain_report.py")
