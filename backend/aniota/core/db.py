

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("db.py", "system_initialization", "import", "Auto-generated dev log entry")

backend/core/db.py
Multi-database SQLAlchemy setup for IX-TECH Aniota
Loads DB URLs from .env and provides SessionLocal for each DB.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

ANIOTA_IN_DB_URL = os.getenv("ANIOTA_IN_DB_URL")
ANIOTA_THINK_DB_URL = os.getenv("ANIOTA_THINK_DB_URL")
ANIOTA_OUT_DB_URL = os.getenv("ANIOTA_OUT_DB_URL")

# Create SQLAlchemy engines
engine_in = create_engine(ANIOTA_IN_DB_URL, pool_pre_ping=True)
engine_think = create_engine(ANIOTA_THINK_DB_URL, pool_pre_ping=True)
engine_out = create_engine(ANIOTA_OUT_DB_URL, pool_pre_ping=True)

# Create session factories
SessionLocalIn = sessionmaker(autocommit=False, autoflush=False, bind=engine_in)
SessionLocalThink = sessionmaker(autocommit=False, autoflush=False, bind=engine_think)
SessionLocalOut = sessionmaker(autocommit=False, autoflush=False, bind=engine_out)

# Dependency functions for FastAPI

def get_db_in():
    db = SessionLocalIn()
    try:
        yield db
    finally:
        db.close()

def get_db_think():
    db = SessionLocalThink()
    try:
        yield db
    finally:
        db.close()

def get_db_out():
    db = SessionLocalOut()
    try:
        yield db
    finally:
        db.close()
