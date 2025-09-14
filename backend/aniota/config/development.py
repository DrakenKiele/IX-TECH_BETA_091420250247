


import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("development.py", "system_initialization", "import", "Auto-generated dev log entry")

POSTGRES_HOST = "192.168.254.200"
FRONTEND_HOST = "192.168.254.200"
