import os
import re
import ast
import datetime

EXTENSIONS = ['.py', '.js', '.css', '.html']
EXCLUDED_DIRS = ['.venv', 'venv', 'node_modules', 'aniota_ui/node_modules']

HEADER_TEMPLATE = '''# BREADCRUMB: [Project/Module] > {filename}
# File: {filename}
# Purpose: {purpose}
#
# Type: {file_type}
#
# Responsibilities:
#   {responsibilities}
#
# Key Functions/Classes:
#   {key_functions}
#
# Relationships:
#   {relationships}
#
# Summary:
#   {summary}
#
# CHANGE MANAGEMENT LOG
# Date        | Initials | Description of Change                | Reason for Change
# -----------------------------------------------------------------------------
# {date} | [XX]    | Automated header update                 | Initial population
# -----------------------------------------------------------------------------
'''

def extract_python_metadata(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    try:
        tree = ast.parse(content)
        docstring = ast.get_docstring(tree) or ''
        functions = [n.name for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)]
        classes = [n.name for n in ast.walk(tree) if isinstance(n, ast.ClassDef)]
        imports = [n.module for n in ast.walk(tree) if isinstance(n, ast.ImportFrom) and n.module]
        import_names = [n.names[0].name for n in ast.walk(tree) if isinstance(n, ast.Import)]
        all_imports = imports + import_names
    except Exception:
        docstring = ''
        functions = []
        classes = []
        all_imports = []
    return docstring, functions, classes, all_imports

def build_header(filepath):
    filename = os.path.basename(filepath)
    today = datetime.date.today().isoformat()
    ext = os.path.splitext(filename)[1].lower()
    purpose = ''
    file_type = ''
    responsibilities = ''
    key_functions = ''
    relationships = ''
    summary = ''
    if ext == '.py':
        docstring, functions, classes, imports = extract_python_metadata(filepath)
        purpose = docstring.split('\n')[0] if docstring else 'No docstring found.'
        file_type = 'Python script' if not classes else 'Python module/class'
        responsibilities = '\n#   '.join(docstring.split('\n')[1:4]) if docstring else 'N/A'
        key_functions = ', '.join(functions + classes) if (functions or classes) else 'N/A'
        relationships = 'Imports: ' + ', '.join(imports) if imports else 'N/A'
        summary = 'Auto-generated from code analysis.'
    else:
        # For JS/CSS/HTML, just use filename and placeholders
        purpose = 'Auto-generated header.'
        file_type = ext.upper().replace('.', '') + ' file'
        responsibilities = 'N/A'
        key_functions = 'N/A'
        relationships = 'N/A'
        summary = 'Auto-generated from file scan.'
    return HEADER_TEMPLATE.format(
        filename=filename,
        purpose=purpose,
        file_type=file_type,
        responsibilities=responsibilities,
        key_functions=key_functions,
        relationships=relationships,
        summary=summary,
        date=today
    )

def update_header(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    if ext not in EXTENSIONS:
        return
    header = build_header(filepath)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    # Remove any existing modular header at the top
    content = re.sub(r'^(# BREADCRUMB: \[Project/Module\][\s\S]+?# -+\n)', '', content, count=1, flags=re.MULTILINE)
    content = re.sub(r'^(# File: .+[\s\S]+?# -+\n)', '', content, count=1, flags=re.MULTILINE)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(header + '\n' + content)

def process_all_files(root):
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        if any(part in EXCLUDED_DIRS for part in dirpath.split(os.sep)):
            continue
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXTENSIONS:
                update_header(os.path.join(dirpath, file))

if __name__ == '__main__':
    process_all_files('.')
