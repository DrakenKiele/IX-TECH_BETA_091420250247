

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("db_health_check.py", "system_initialization", "import", "Auto-generated dev log entry")

backend/app/main.py
FastAPI app integrating multi-database dependencies from core/db.py
"""
from fastapi import FastAPI
import psycopg2
import os

app = FastAPI()


@app.get("/health/db")
def health_db():
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/ix-tech")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        conn.close()
        return {"status": "ix-tech DB OK"}
    except Exception as e:
        return {"status": "ix-tech DB ERROR", "error": str(e)}


log_file_dependency("db_health_check.py", "psycopg2", "import")
