



import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("config.py", "system_initialization", "import", "Auto-generated dev log entry")

DOCKER_COMMAND = "docker"
FRONTEND_HOST = "192.168.254.200"
FRONTEND_PORT = 8001
FASTAPI_DOCS_URL = "http://192.168.254.200:41294/docs"
CORS_ORIGINS = ["*"]
APP_HOST = "192.168.254.200"
APP_PORT = 41294
