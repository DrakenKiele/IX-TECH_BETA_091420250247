import subprocess
import os
import sys

project_dir = os.path.dirname(os.path.abspath(__file__))
venv_python = os.path.join(project_dir, ".venv", "Scripts", "python.exe")
launcher = os.path.join(project_dir, "unified_launcher.py")

if not os.path.exists(venv_python):
    print(f"[ERROR] venv python executable not found at {venv_python}. Please create the venv first.")
    sys.exit(1)
if not os.path.exists(launcher):
    print(f"[ERROR] unified_launcher.py not found at {launcher}.")
    sys.exit(1)

# Pass along any command-line arguments
args = [venv_python, launcher] + sys.argv[1:]
subprocess.run(args)
