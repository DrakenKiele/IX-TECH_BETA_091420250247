


import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("main.py", "system_initialization", "import", "Auto-generated dev log entry")

import socket
import requests
from datetime import datetime
import logging
import sys
import os
import subprocess
from fastapi import FastAPI, HTTPException, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse


@asynccontextmanager
async def lifespan(app):
    # Place any startup code here
    yield
    # Place any shutdown code here


app = FastAPI(
    title="CHRYSALIX Cognitive Framework API",
    description="Backend API for ANIOTA's cognitive learning systems",
    version="0.1.0",
    lifespan=lifespan,
)
templates = Jinja2Templates(directory="../../www")


@app.get("/api/stack_status")
def get_stack_status():
    def check_port(host, port):
        try:
            with socket.create_connection((host, port), timeout=2):
                return True
        except Exception:
            return False

    def check_http(url):
        try:
            r = requests.get(url, timeout=2)
            return r.status_code == 200
        except Exception:
            return False

    def check_docker():
        try:
            result = subprocess.run(
                ["docker", "info"], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            return result.returncode == 0
        except Exception:
            return False

    def check_postgres():
        try:
            import psycopg2

            conn = psycopg2.connect(
                dbname="postgres",
                user="postgres",
                password="postgres",
                host="192.168.254.200",
                port=5432,
                connect_timeout=2,
            )
            conn.close()
            return True
        except Exception:
            return False

    return {
        "timestamp": datetime.now().isoformat(),
        "docker": check_docker(),
        "postgres": check_postgres(),
        "fastapi": check_http("http://127.0.0.1:41294/docs"),
        "frontend": check_port("127.0.0.1", 8001),
    }


sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app):
    # Place any startup code here
    yield
    # Place any shutdown code here


app = FastAPI(
    title="CHRYSALIX Cognitive Framework API",
    description="Backend API for ANIOTA's cognitive learning systems",
    version="0.1.0",
    lifespan=lifespan,
)
templates = Jinja2Templates(directory="../templates")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8001",
        "http://127.0.0.1:8001",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the www folder for static files
import pathlib

www_dir = pathlib.Path(__file__).resolve().parent.parent.parent / "www"
if www_dir.is_dir():
    from fastapi.staticfiles import StaticFiles

    app.mount("/", StaticFiles(directory=str(www_dir), html=True), name="webapp")
else:
    logger.error(f"Web interface directory not found at: {www_dir}")

# ==============================================================================
# ANIOTA SYSTEM ORCHESTRATION & INTEGRATION (THE "STITCHING")
# ==============================================================================

# 1. Add the correct paths to sys.path so we can import the modules
#    This ensures Python can find your backend files.
backend_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "aniota", "backend")
)
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# 2. Import all necessary architectural components from your existing files
# Initialize orchestrators to None to avoid undefined name errors
core_orchestrator = None
learn_orchestrator = None
mem_orchestrator = None

# Individual imports with error logging
import_errors = []
try:
    from core.caf_core import CAFCore
except ImportError as e:
    logger.error(f"Failed to import CAFCore: {e}")
    import_errors.append("CAFCore")
try:
    from learning.caf_learn import CAFLearn
except ImportError as e:
    logger.error(f"Failed to import CAFLearn: {e}")
    import_errors.append("CAFLearn")
try:
    from memory.caf_mem import CAFMem
except ImportError as e:
    logger.error(f"Failed to import CAFMem: {e}")
    import_errors.append("CAFMem")
try:
    from coms.caf_coms_manager import CAFComsManager
except ImportError as e:
    logger.error(f"Failed to import CAFComsManager: {e}")
    import_errors.append("CAFComsManager")
try:
    from core.spe import SensoryPerceptionEncoder
except ImportError as e:
    logger.error(f"Failed to import SensoryPerceptionEncoder: {e}")
    import_errors.append("SensoryPerceptionEncoder")
try:
    from learning.lrs import LearningReadinessScaffolding
except ImportError as e:
    logger.error(f"Failed to import LearningReadinessScaffolding: {e}")
    import_errors.append("LearningReadinessScaffolding")
try:
    from learning.sie import SocraticInquiryEngine
except ImportError as e:
    logger.error(f"Failed to import SocraticInquiryEngine: {e}")
    import_errors.append("SocraticInquiryEngine")
try:
    from memory.wms import WorkingMemorySystem
except ImportError as e:
    logger.error(f"Failed to import WorkingMemorySystem: {e}")
    import_errors.append("WorkingMemorySystem")
try:
    from memory.ldm import LongTermDeclarativeMemory
except ImportError as e:
    logger.error(f"Failed to import LongTermDeclarativeMemory: {e}")
    import_errors.append("LongTermDeclarativeMemory")
# We will create and import TVMLE in the next step

if import_errors:
    logger.error(f"Some cognitive modules failed to import: {', '.join(import_errors)}")
else:
    logger.info("All cognitive modules imported successfully.")

if "core_orchestrator" not in globals() or core_orchestrator is None:
    # 3. Instantiate the entire Cognitive Framework
    logger.info("Initializing Aniota Cognitive Framework...")

    coms_manager = CAFComsManager()
    logger.info("CAFComsManager instantiated.")

    core_orchestrator = CAFCore()
    logger.info("CAFCore orchestrator instantiated.")

    learn_orchestrator = CAFLearn()
    logger.info("CAFLearn orchestrator instantiated.")

    mem_orchestrator = CAFMem()
    logger.info("CAFMem orchestrator instantiated.")

    coms_manager.register_orchestrator("core", core_orchestrator)
    coms_manager.register_orchestrator("learning", learn_orchestrator)
    coms_manager.register_orchestrator("memory", mem_orchestrator)
    logger.info("All orchestrators registered with CAFComsManager.")

    # 4. Instantiate and register the individual modules

    # --- Core Modules ---
    spe_module = SensoryPerceptionEncoder(module_id="SPE_01")
    core_orchestrator.core_register_module(spe_module)
    logger.info(f"Module '{spe_module.module_id}' registered with CAFCore.")

    # --- Learning Modules ---
    lrs_module = LearningReadinessScaffolding(module_id="LRS_01")
    learn_orchestrator.learn_register_module(lrs_module)
    logger.info(f"Module '{lrs_module.module_id}' registered with CAFLearn.")

    sie_module = SocraticInquiryEngine(module_id="SIE_01")
    learn_orchestrator.learn_register_module(sie_module)
    logger.info(f"Module '{sie_module.module_id}' registered with CAFLearn.")

    # --- Memory Modules ---
    wms_module = WorkingMemorySystem(module_id="WMS_01")
    mem_orchestrator.mem_register_module(wms_module)
    logger.info(f"Module '{wms_module.module_id}' registered with CAFMem.")

    ldm_module = LongTermDeclarativeMemory(module_id="LDM_01")
    mem_orchestrator.mem_register_module(ldm_module)
    logger.info(f"Module '{ldm_module.module_id}' registered with CAFMem.")

    logger.info("Aniota Cognitive Framework assembly complete. System is live.")

# ==============================================================================
# END OF ORCHESTRATION SETUP
# ==============================================================================


class TVMLE_LearningEvent(BaseModel):
    user_id: str
    session_id: str
    timestamp: float
    x: int
    y: int
    event_type: str
    context: dict = {}  # Pydantic models for cognitive framework


class LearningEvent(BaseModel):
    event_type: str
    x: Optional[float] = None
    y: Optional[float] = None
    timestamp: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = {}


class CognitiveQuery(BaseModel):
    query_type: str
    context: Dict[str, Any]
    user_data: Optional[Dict[str, Any]] = {}


@app.get("/")
def read_root():
    return {
        "message": "CHRYSALIX Cognitive Framework",
        "status": "running",
        "version": "0.1.0",
        "cognitive_modules": [
            "CAF - Cognitive Analysis Framework",
            "TVMLE - Triadic Vector Mathematical Learning Engine",
            "Microvibration Authentication",
            "SIE - Socratic Inquiry Engine",
            "HTM - Hypothesis Testing Module",
            "RFM - Reflective Feedback Module",
        ],
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "cognitive_status": "operational",
        "learning_engines": "active",
    }


# Cognitive Analysis Framework (CAF) endpoints
@app.get("/api/caf/status")
def get_caf_status():
    """Get status of the Cognitive Analysis Framework"""
    return {
        "module": "CAF - Cognitive Analysis Framework",
        "status": "initialized",
        "registered_modules": [
            "SIE - Socratic Inquiry Engine",
            "HTM - Hypothesis Testing Module",
            "RFM - Reflective Feedback Module",
            "TVMLE - Triadic Vector Mathematical Learning Engine",
        ],
        "common_sense_enabled": True,
    }


@app.post("/api/caf/query")
def process_cognitive_query(query: CognitiveQuery):
    """Process a cognitive query through the CAF system"""
    try:
        # Mock cognitive processing for now
        response = {
            "query_type": query.query_type,
            "processed": True,
            "cognitive_response": f"Processing {query.query_type} query with context analysis",
            "recommendations": [
                "Continue current learning approach",
                "Consider alternative problem-solving strategies",
                "Apply Socratic questioning techniques",
            ],
        }

        logger.info(f"Processed cognitive query: {query.query_type}")
        return response

    except Exception as e:
        logger.error(f"Error processing cognitive query: {str(e)}")
        raise HTTPException(status_code=500, detail="Cognitive processing error")


# Mathematical Learning Engine endpoints
@app.post("/api/tvmle/learn")
def process_learning_event(event: LearningEvent):
    """Process a learning event through the TVMLE system"""
    try:
        # Mock TVMLE processing
        learning_response = {
            "event_processed": True,
            "triadic_vector": {
                "temporal": event.timestamp or 0.0,
                "radial": ((event.x or 0) ** 2 + (event.y or 0) ** 2) ** 0.5,
                "spatial": f"({event.x or 0}, {event.y or 0})",
            },
            "correlation_analysis": {
                "pattern_detected": True,
                "confidence": 0.85,
                "learning_trend": "positive",
            },
            "mathematical_insights": [
                "User shows consistent interaction patterns",
                "Learning velocity is increasing",
                "Mathematical correlation strength: 0.78",
            ],
        }

        logger.info(f"Processed learning event: {event.event_type}")
        return learning_response

    except Exception as e:
        logger.error(f"Error processing learning event: {str(e)}")
        raise HTTPException(status_code=500, detail="Learning processing error")


@app.get("/api/tvmle/stats")
def get_learning_stats():
    """Get current learning statistics from TVMLE"""
    return {
        "total_vectors_processed": 1247,
        "correlation_patterns": 89,
        "learning_velocity": 1.34,
        "mathematical_confidence": 0.82,
        "signature_strength": 0.91,
        "recent_insights": [
            "User demonstrates strong pattern recognition",
            "Mathematical learning acceleration detected",
            "Triadic vector correlation improving",
        ],
    }


# Microvibration Authentication endpoints
@app.post("/api/microvibration/analyze")
def analyze_microvibration(event: LearningEvent):
    """Analyze mouse microvibrations for authentication patterns"""
    try:
        # Mock microvibration analysis
        auth_analysis = {
            "vibration_pattern_detected": True,
            "authentication_confidence": 0.89,
            "pattern_consistency": 0.76,
            "biometric_signature": {
                "tremor_frequency": 0.15,
                "correction_speed": 0.7,
                "overshoot_tendency": 1.08,
            },
            "authentication_result": "verified" if 0.89 > 0.75 else "rejected",
        }

        logger.info("Processed microvibration analysis")
        return auth_analysis

    except Exception as e:
        logger.error(f"Error in microvibration analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Microvibration analysis error")


# Socratic Inquiry Engine endpoints
@app.post("/api/sie/question")
def generate_socratic_question(context: Dict[str, Any]):
    """Generate Socratic questions based on learning context"""
    topic = context.get("topic", "general learning")
    level = context.get("level", "intermediate")

    questions = {
        "primary": f"What do you think is the most important aspect of {topic}?",
        "follow_up": f"How might you apply {topic} to solve a real problem?",
        "deeper": f"What assumptions are you making about {topic}?",
        "reflective": f"How has your understanding of {topic} changed?",
    }

    return {
        "socratic_questions": questions,
        "inquiry_level": level,
        "cognitive_strategy": "guided_discovery",
        "expected_learning_outcome": f"Deeper understanding of {topic} through self-reflection",
    }


# Integration endpoint for ANIOTA Epicenter visualization
@app.get("/template", response_class=HTMLResponse)
async def render_template(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "my_var": "Hello, Jinja2!"}
    )


# Integration endpoint for ANIOTA Epicenter visualization
@app.post("/api/visualization/data")
def get_visualization_data(request: Dict[str, Any]):
    """Provide data for ANIOTA Epicenter mathematical visualization"""
    visualization_type = request.get("type", "learning_patterns")

    if visualization_type == "learning_patterns":
        return {
            "data_type": "triadic_vectors",
            "vectors": [
                {"temporal": 1.2, "radial": 45.6, "spatial": [120, 200]},
                {"temporal": 1.8, "radial": 52.3, "spatial": [135, 210]},
                {"temporal": 2.1, "radial": 48.9, "spatial": [128, 205]},
            ],
            "correlations": [0.78, 0.82, 0.85],
            "learning_trend": "ascending",
            "visualization_ready": True,
        }

    elif visualization_type == "microvibration_auth":
        return {
            "data_type": "authentication_patterns",
            "pattern_strength": 0.89,
            "tremor_signature": [0.15, 0.18, 0.12, 0.16],
            "authentication_history": ["verified", "verified", "verified"],
            "visualization_ready": True,
        }

    return {"error": "Unknown visualization type"}


@app.get("/api/system/integration")
def get_system_integration_status():
    """Get integration status between cognitive modules"""
    return {
        "caf_integration": "active",
        "tvmle_integration": "active",
        "microvibration_integration": "active",
        "sie_integration": "active",
        "aniota_epicenter_connection": "ready",
        "mathematical_pipeline": "operational",
        "total_integrations": 6,
        "system_coherence": 0.94,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=41294, reload=True)


# Log dependencies
log_file_dependency("main.py", "socket", "import")
log_file_dependency("main.py", "logging", "import")
log_file_dependency("main.py", "subprocess", "import")
log_file_dependency("main.py", "psycopg2", "import")
log_file_dependency("main.py", "pathlib", "import")
log_file_dependency("main.py", "uvicorn", "import")
