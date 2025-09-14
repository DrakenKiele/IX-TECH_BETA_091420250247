

"""
BREADCRUMB: backend > fix_logging.py
FILE: fix_logging.py
ROLE: Utility script for fixing logging issues in the codebase.
STATUS: [U]tility
FLOW CHART: Standalone utility, not part of main runtime flow.
NOTES:
    - Used for maintenance and log correction.
    - Not called by main orchestrators.
    - Update this header if integrated into runtime or called by other modules.
"""
"""Fix dev logging functions in files that need them"""

import os

def fix_file_logging(filename):
    if not os.path.exists(filename) or not filename.endswith('.py'):
        return False
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has log_file_dependency calls but no definition
    if 'log_file_dependency(' in content and 'def log_file_dependency(' not in content:
        # Add logging functions at the top after docstring
        logging_funcs = '''
def log_file_traversal(file_name, source, purpose):
    print(f"📝 DEV LOG [{file_name}]: Traversal from {source} - {purpose}")

def log_file_dependency(file_name, dependency, dep_type):
    print(f"🔗 DEV LOG [{file_name}]: Depends on {dependency} ({dep_type})")

'''
        # Find insertion point after docstring
        lines = content.split('\n')
        insert_line = 0
        
        # Skip shebang and docstring
        for i, line in enumerate(lines):
            if line.strip().startswith('"""') and line.strip().endswith('"""') and len(line.strip()) > 6:
                # Single line docstring
                insert_line = i + 1
                break
            elif line.strip().startswith('"""'):
                # Multi-line docstring, find the end
                for j in range(i + 1, len(lines)):
                    if '"""' in lines[j]:
                        insert_line = j + 1
                        break
                break
        
        # Insert logging functions
        lines.insert(insert_line, logging_funcs)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f'✅ Fixed logging in {filename}')
        return True
    return False

files_fixed = []
for filename in ['qvmle.py', 'truth_engine.py', 'hard_coded_knowledge.py']:
    if fix_file_logging(filename):
        files_fixed.append(filename)

print(f'✅ Fixed dev logging functions in {len(files_fixed)} files: {files_fixed}')
