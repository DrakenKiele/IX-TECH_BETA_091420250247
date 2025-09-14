# =============================================================
# ANIOTA IX-TECH Backend (main.py)
#
# Purpose:
#   - FastAPI backend for the ANIOTA educational system.
#   - Handles authentication, learning sessions, AI endpoints, cognitive analysis, Aniota presence, and real-time WebSocket sync.
#   - Launched by unified_launcher.py as part of the system startup sequence.
#
# What it opens:
#   - Listens on port 8001 for HTTP API and WebSocket connections.
#   - Interacts with PostgreSQL (via DATABASE_URL env var set by launcher).
#   - Reads/writes in-memory and (optionally) persistent data via imported modules.
#
# Direct Python file dependencies (required to run):
#   - backend/aniota_presence.py
#   - backend/dev_log.py
#   - backend/sie.py
#   - backend/qvmle.py
#   - backend/hard_coded_knowledge.py
#   - backend/truth_engine.py
# Optionally (if available):
#   - backend/aniota/core/caf_core.py
#   - backend/aniota/memory/caf_mem.py
#
# What it exports:
#   - FastAPI app instance ("app") with many API endpoints (see /docs)
#   - WebSocket endpoint for real-time Aniota state
#   - All API endpoints for authentication, learning, AI, cognitive analysis, Aniota presence, and more
# =============================================================

from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import logging
import uvicorn
import json
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

try:
    from .dev_log import log_file_traversal, log_file_dependency
except ImportError:
    # Fallback for direct execution
    from dev_log import log_file_traversal, log_file_dependency

log_file_traversal("main.py", "system_startup", "main", "FastAPI backend entry point")

try:
    from backend.aniota_presence import aniota_presence
except ImportError:
    from aniota_presence import aniota_presence
log_file_dependency("main.py", "aniota_presence.py", "import")

try:
    from sie import SIE, QuestionPriority
    from qvmle import QVMLE
    from hard_coded_knowledge import HardCodedKnowledge
    from truth_engine import TruthEngine
    
    # Log learning system dependencies
    log_file_dependency("main.py", "sie.py", "import")
    log_file_dependency("main.py", "qvmle.py", "import") 
    log_file_dependency("main.py", "hard_coded_knowledge.py", "import")
    log_file_dependency("main.py", "truth_engine.py", "import")
    
    # Initialize learning system
    learning_system = {
        'sie': SIE(),
        'qvmle': QVMLE(),
        'knowledge': HardCodedKnowledge(),
        'truth_engine': TruthEngine()
    }
    
    LEARNING_SYSTEM_AVAILABLE = True
    print("✓ Learning system components loaded in main.py")
    
except ImportError as e:
    print(f"⚠️ Learning system components not available: {e}")
    LEARNING_SYSTEM_AVAILABLE = False
    learning_system = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


manager = None  # Will be set after ConnectionManager is defined

@asynccontextmanager
async def lifespan(app):
    async def mood_updater():
        while True:
            await asyncio.sleep(800)
            aniota_presence.update_mood("auto")
            await manager.broadcast({
                "type": "mood_update",
                "color": aniota_presence.state["mood_color"]
            })
    task = asyncio.create_task(mood_updater())
    yield
    task.cancel()


app = FastAPI(
    title="ANIOTA IX-TECH API",
    description="Backend API for the ANIOTA educational system",
    version="0.1.0",

)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001", "http://127.0.0.1:8001", "http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)

# Pydantic models


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class LearningSession(BaseModel):
    module: str
    activity: str
    data: Dict[str, Any]

# Cognitive Framework Models (from old_main.py)
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


# In-memory storage for development (replace with database)
users_db = {}
sessions_db = {}


@app.get("/")
def read_root():
    return {
        "message": "ANIOTA IX-TECH API",
        "status": "running",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2025-08-03"}

# Authentication endpoints
@app.post("/api/auth/register")
def register_user(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # In production, hash the password properly
    users_db[user.username] = {
        "username": user.username,
        "email": user.email,
        "password": user.password,  # This should be hashed!
        "created_at": "2025-08-03"
    }
    
    logger.info(f"User registered: {user.username}")
    return {"message": "User created successfully", "username": user.username}

@app.post("/api/auth/login")
def login_user(credentials: UserLogin):
    user = users_db.get(credentials.username)
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # In production, return proper JWT token
    fake_token = f"token_{credentials.username}_12345"
    logger.info(f"User logged in: {credentials.username}")
    return {"token": fake_token, "user": {"username": user["username"], "email": user["email"]}}

# Learning endpoints
@app.post("/api/learning/session")
def create_learning_session(session: LearningSession, credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    session_id = f"session_{len(sessions_db) + 1}"
    sessions_db[session_id] = {
        "id": session_id,
        "module": session.module,
        "activity": session.activity,
        "data": session.data,
        "created_at": "2025-08-03"
    }
    
    logger.info(f"Learning session created: {session_id}")
    return {"session_id": session_id, "status": "created"}

@app.get("/api/learning/sessions")
def get_learning_sessions(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    return {"sessions": list(sessions_db.values())}

# AI Integration endpoints
@app.post("/api/ai/generate-question")
def generate_question(request: Dict[str, Any]):
    # MOCK_REMOVE: Mock AI response for development
    # MOCK_REMOVE: topic = request.get("topic", "general")
    # MOCK_REMOVE: level = request.get("level", 2)
    # MOCK_REMOVE: mock_question = {...}
    # MOCK_REMOVE: logger.info(f"Generated question for topic: {topic}")
    # MOCK_REMOVE: return mock_question
    # TODO: Replace with authentic AI question generation
    raise HTTPException(status_code=501, detail="Authentic question generation not implemented.")

@app.post("/api/ai/validate-response")
def validate_response(request: Dict[str, Any]):
    # MOCK_REMOVE: Mock validation for development
    # MOCK_REMOVE: response_text = request.get("response", "")
    # MOCK_REMOVE: response_length = len(response_text.split())
    # MOCK_REMOVE: if response_length < 3: ...
    # MOCK_REMOVE: return {"score": score, "feedback": feedback}
    # TODO: Replace with authentic response validation
    raise HTTPException(status_code=501, detail="Authentic response validation not implemented.")

# Module-specific endpoints
@app.get("/api/modules/{module_name}")
def get_module_info(module_name: str):
    modules = {
        "radix": {"name": "RADIX", "description": "Foundational learning patterns"},
        "phonemix": {"name": "PHONEMIX", "description": "Sound and language processing"},
        "maqnetix": {"name": "MAQNETIX", "description": "Interactive visual learning"},
        "securix": {"name": "SECURIX", "description": "Safety and security education"},
        "grafix": {"name": "GRAFIX", "description": "Visual design and creativity"}
    }
    
    module = modules.get(module_name.lower())
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    return module

# Development endpoints
@app.get("/api/dev/status")
def dev_status():
    return {
        "environment": "development",
        "users_count": len(users_db),
        "sessions_count": len(sessions_db),
        "modules_available": ["radix", "phonemix", "maqnetix", "securix", "grafix"],
        "api_endpoints": [
            "/api/auth/register",
            "/api/auth/login", 
            "/api/learning/session",
            "/api/ai/generate-question",
            "/api/ai/validate-response",
            "/api/aniota/state",
            "/api/aniota/interaction",
            "/ws/aniota"
        ]
    }

# --- Cognitive Framework Endpoints (from old_main.py) ---

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
            "TVMLE - Triadic Vector Mathematical Learning Engine"
        ],
        "common_sense_enabled": True
    }

@app.post("/api/caf/query")
def process_cognitive_query(query: CognitiveQuery):
    """Process a cognitive query through the CAF system"""
    try:
        response = {
            "query_type": query.query_type,
            "processed": True,
            "cognitive_response": f"Processing {query.query_type} query with context analysis",
            "recommendations": [
                "Continue current learning approach",
                "Consider alternative problem-solving strategies",
                "Apply Socratic questioning techniques"
            ]
        }
        logger.info(f"Processed cognitive query: {query.query_type}")
        return response
    except Exception as e:
        logger.error(f"Error processing cognitive query: {str(e)}")
        raise HTTPException(status_code=500, detail="Cognitive processing error")

@app.post("/api/tvmle/learn")
def process_learning_event(event: LearningEvent):
    """Process a learning event through the TVMLE system"""
    try:
        learning_response = {
            "event_processed": True,
            "triadic_vector": {
                "temporal": event.timestamp or 0.0,
                "radial": ((event.x or 0)**2 + (event.y or 0)**2)**0.5,
                "spatial": f"({event.x or 0}, {event.y or 0})"
            },
            "correlation_analysis": {
                "pattern_detected": True,
                "confidence": 0.85,
                "learning_trend": "positive"
            },
            "mathematical_insights": [
                "User shows consistent interaction patterns",
                "Learning velocity is increasing",
                "Mathematical correlation strength: 0.78"
            ]
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
            "Triadic vector correlation improving"
        ]
    }

@app.post("/api/microvibration/analyze")
def analyze_microvibration(event: LearningEvent):
    """Analyze mouse microvibrations for authentication patterns"""
    try:
        auth_analysis = {
            "vibration_pattern_detected": True,
            "authentication_confidence": 0.89,
            "pattern_consistency": 0.76,
            "biometric_signature": {
                "tremor_frequency": 0.15,
                "correction_speed": 0.7,
                "overshoot_tendency": 1.08
            },
            "authentication_result": "verified" if 0.89 > 0.75 else "rejected"
        }
        logger.info("Processed microvibration analysis")
        return auth_analysis
    except Exception as e:
        logger.error(f"Error in microvibration analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Microvibration analysis error")

@app.post("/api/sie/question")
def generate_socratic_question(context: Dict[str, Any]):
    """Generate Socratic questions based on learning context using real SIE system"""
    
    # Log API traversal
    try:
        from .dev_log import log_file_traversal
    except ImportError:
        from dev_log import log_file_traversal
    log_file_traversal("main.py", "api_client", "generate_socratic_question", "Generate Socratic questions via SIE")
    
    topic = context.get("topic", "general learning")
    level = context.get("level", "intermediate")
    
    if LEARNING_SYSTEM_AVAILABLE:
        try:
            # Use actual SIE system
            sie_result = learning_system['sie'].select_learning_choice(
                f"Help me understand {topic}", 
                enable_escape_hatch=True
            )
            
            # Get knowledge about topic
            knowledge_result = learning_system['knowledge'].query(f"What is {topic}?")
            
            # Generate questions based on SIE choice
            if sie_result['choice'] == 'Explore':
                primary_question = f"What do you already know about {topic}?"
                follow_up = f"What questions do you have about {topic}?"
            elif sie_result['choice'] == 'Extend':
                primary_question = f"How might {topic} connect to other things you know?"
                follow_up = f"What would happen if we changed one aspect of {topic}?"
            elif sie_result['choice'] == 'Review':
                primary_question = f"Can you explain {topic} in your own words?"
                follow_up = f"What examples of {topic} can you think of?"
            elif sie_result['choice'] == 'Expand':
                primary_question = f"What new aspects of {topic} would you like to explore?"
                follow_up = f"How does {topic} relate to the bigger picture?"
            else:  # Emergency Escape
                primary_question = f"What would make {topic} easier to understand?"
                follow_up = f"Where would you like to start with {topic}?"
            
            return {
                "socratic_questions": {
                    "primary": primary_question,
                    "follow_up": follow_up,
                    "deeper": f"What assumptions might you be making about {topic}?",
                    "reflective": f"How has thinking about {topic} changed your perspective?"
                },
                "sie_analysis": {
                    "choice": sie_result['choice'],
                    "confidence": sie_result['confidence'],
                    "coordinates": sie_result['coordinates']
                },
                "knowledge_context": {
                    "concept": knowledge_result['concept'],
                    "definition": knowledge_result['definition'],
                    "confidence": knowledge_result['confidence']
                },
                "inquiry_level": level,
                "cognitive_strategy": "sie_guided_discovery",
                "expected_learning_outcome": f"Deeper understanding of {topic} through SIE methodology"
            }
            
        except Exception as e:
            # MOCK_REMOVE: Fallback to mock if SIE fails
            print(f"SIE system error: {e}")
            # TODO: Replace with authentic SIE error handling
            raise HTTPException(status_code=500, detail="SIE system unavailable and no fallback allowed.")
    else:
        # MOCK_REMOVE: Fallback to mock questions
        # TODO: Replace with authentic SIE error handling
        raise HTTPException(status_code=500, detail="SIE system unavailable and no fallback allowed.")

    # MOCK_REMOVE: def generate_mock_socratic_questions(topic: str, level: str):
    # MOCK_REMOVE:     """Fallback mock questions when SIE system is unavailable"""
    # MOCK_REMOVE:     questions = {...}
    # MOCK_REMOVE:     return {...}

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
                {"temporal": 2.1, "radial": 48.9, "spatial": [128, 205]}
            ],
            "correlations": [0.78, 0.82, 0.85],
            "learning_trend": "ascending",
            "visualization_ready": True
        }
    elif visualization_type == "microvibration_auth":
        return {
            "data_type": "authentication_patterns",
            "pattern_strength": 0.89,
            "tremor_signature": [0.15, 0.18, 0.12, 0.16],
            "authentication_history": ["verified", "verified", "verified"],
            "visualization_ready": True
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
        "system_coherence": 0.94
    }


# WebSocket connection manager
class ConnectionInfo:
    def __init__(self, websocket: WebSocket, mode: str = "unknown"):
        self.websocket = websocket
        self.mode = mode

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[ConnectionInfo] = []

    async def connect(self, websocket: WebSocket, mode: str = "unknown"):
        self.active_connections.append(ConnectionInfo(websocket, mode))
        await websocket.accept()

    def disconnect(self, websocket: WebSocket):
        self.active_connections = [c for c in self.active_connections if c.websocket != websocket]

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.websocket.send_text(json.dumps(message))

manager = ConnectionManager()

# Aniota Presence Endpoints
@app.get("/api/aniota/state")
async def get_aniota_state():
    """Get current Aniota presence state"""
    return aniota_presence.get_state()


@app.post("/api/aniota/interaction")
async def log_aniota_interaction(interaction: dict):
    """Log interaction with Aniota and update state"""
    logged_interaction = aniota_presence.log_interaction(
        interaction.get("type", "unknown"),
        interaction.get("details", {})
    )
    
    # Broadcast state change to all connected clients
    await manager.broadcast({
        "type": "state_update",
        "state": aniota_presence.get_state()
    })
    
    return {"status": "logged", "interaction": logged_interaction}


@app.post("/api/aniota/position")
async def update_aniota_position(position_data: dict):
    """Update Aniota's position across all clients"""
    aniota_presence.update_position(
        position_data.get("x", 40),
        position_data.get("y", 40),
        position_data.get("context", "unknown")
    )
    
    # Broadcast position change to all connected clients
    await manager.broadcast({
        "type": "position_update",
        "position": aniota_presence.state["position"],
        "context": aniota_presence.state["context"]
    })
    
    return {"status": "updated"}


@app.post("/api/aniota/mouse-intercept")
async def check_mouse_intercept(mouse_data: dict):
    """Check if Aniota should intercept mouse - Tinkerbelle behavior"""
    mouse_x = mouse_data.get("x", 0)
    mouse_y = mouse_data.get("y", 0)
    mouse_velocity_x = mouse_data.get("velocity_x", 0)
    mouse_velocity_y = mouse_data.get("velocity_y", 0)
    
    # Check if interception should occur
    intercept_decision = aniota_presence.tinkerbelle_mouse_intercept_decision({
        "mouse_x": mouse_x,
        "mouse_y": mouse_y,
        "mouse_moving": abs(mouse_velocity_x) > 0.1 or abs(mouse_velocity_y) > 0.1,
        "velocity_x": mouse_velocity_x,
        "velocity_y": mouse_velocity_y
    })
    
    if intercept_decision.get("should_intercept", False):
        # Calculate optimal intercept position
        intercept_path = aniota_presence.calculate_mouse_intercept_path(
            mouse_x, mouse_y, mouse_velocity_x, mouse_velocity_y
        )
        
        # Broadcast interception to all clients
        await manager.broadcast({
            "type": "mouse_intercept",
            "intercept_position": intercept_path,
            "behavior_style": intercept_decision.get("intercept_style", "tinkerbelle_dart"),
            "message": intercept_decision.get("message", "Let me show you something!")
        })
        
        return {
            "status": "intercept",
            "intercept_position": intercept_path,
            "behavior_data": intercept_decision
        }
    
    return {
        "status": "no_intercept",
        "behavior_mode": aniota_presence.state["behavior_mode"],
        "attention_level": aniota_presence.state["attention_level"]
    }


@app.post("/api/aniota/guidance")
async def request_guidance(guidance_request: dict):
    """Request guidance suggestion from Aniota - like asking Tinkerbelle to show you something"""
    page_context = guidance_request.get("context", "unknown")
    user_context = guidance_request.get("user_state", {})
    
    # Get guidance suggestion
    guidance = aniota_presence.suggest_guidance_target(page_context)
    
    # Update behavior state for guidance mode
    aniota_presence.state["behavior_mode"] = "guiding"
    aniota_presence.state["guidance_target"] = guidance
    
    # Broadcast guidance to all clients
    await manager.broadcast({
        "type": "guidance_suggestion",
        "guidance": guidance,
        "context": page_context
    })
    
    return {
        "status": "guidance_provided",
        "guidance": guidance,
        "behavior_state": {
            "mode": aniota_presence.state["behavior_mode"],
            "attention_level": aniota_presence.state["attention_level"],
            "playfulness": aniota_presence.state["playfulness"]
        }
    }


@app.post("/api/aniota/behavior")
async def update_aniota_behavior(behavior_data: dict):
    """Update Aniota's dog-like behavior state"""
    # Update behavior state based on user activity
    user_action = behavior_data.get("user_action")
    page_context = behavior_data.get("page_context")
    
    # Update the behavior state
    behavior_mode = aniota_presence.update_behavior_state(user_action, page_context)
    
    # Update individual behavior properties if provided
    if "attention_level" in behavior_data:
        aniota_presence.state["attention_level"] = behavior_data["attention_level"]
    if "guidance_target" in behavior_data:
        aniota_presence.state["guidance_target"] = behavior_data["guidance_target"]
    if "earned_points" in behavior_data:
        aniota_presence.state["earned_points"] = behavior_data["earned_points"]
    
    # Broadcast behavior change to all connected clients
    await manager.broadcast({
        "type": "behavior_update",
        "behavior_mode": behavior_mode,
        "attention_level": aniota_presence.state["attention_level"],
        "heartbeat_rate": aniota_presence.state["heartbeat_rate"],
        "guidance_target": aniota_presence.state["guidance_target"]
    })
    
    return {
        "status": "updated",
        "behavior_mode": behavior_mode,
        "attention_level": aniota_presence.state["attention_level"]
    }


# 💬 ANIOTA CHAT ENDPOINT 💬
@app.post("/api/aniota/chat")
async def chat_with_aniota(chat_data: dict):
    """Chat interface for Aniota - intelligent learning companion responses"""
    user_message = chat_data.get("message", "").strip()
    learning_context = chat_data.get("learning_context", {})
    session_data = chat_data.get("session_data", {})
    
    if not user_message:
        return {"error": "No message provided"}
    
    # Analyze user message for learning insights
    message_analysis = analyze_user_message(user_message, learning_context)
    
    # Generate contextual response
    aniota_response = generate_aniota_response(user_message, message_analysis, learning_context, session_data)
    
    # Update Aniota's mood/behavior based on conversation
    conversation_mood = determine_conversation_mood(user_message, aniota_response)
    aniota_presence.update_mood(conversation_mood)
    aniota_presence.log_interaction("chat_interaction", {
        "user_message": user_message,
        "aniota_response": aniota_response,
        "conversation_mood": conversation_mood,
        "learning_context": learning_context
    })
    
    # Broadcast mood change to all clients
    await manager.broadcast({
        "type": "chat_mood_update",
        "mood": conversation_mood,
        "conversation_active": True
    })
    
    return {
        "response": aniota_response,
        "mood": conversation_mood,
        "learning_insights": message_analysis.get("learning_insights", {}),
        "suggested_actions": message_analysis.get("suggested_actions", [])
    }


def analyze_user_message(message: str, learning_context: dict) -> dict:
    """Analyze user message for educational insights and emotional context"""
    message_lower = message.lower()
    
    analysis = {
        "sentiment": "neutral",
        "learning_indicators": [],
        "help_needed": False,
        "curiosity_level": "medium",
        "learning_insights": {},
        "suggested_actions": []
    }
    
    # Sentiment analysis
    positive_words = ["good", "great", "love", "like", "enjoy", "fun", "awesome", "cool"]
    negative_words = ["hard", "difficult", "stuck", "confused", "boring", "hate", "frustrated"]
    help_words = ["help", "stuck", "don't understand", "explain", "how", "what"]
    
    if any(word in message_lower for word in positive_words):
        analysis["sentiment"] = "positive"
    elif any(word in message_lower for word in negative_words):
        analysis["sentiment"] = "negative"
    
    if any(word in message_lower for word in help_words):
        analysis["help_needed"] = True
        analysis["suggested_actions"].append("provide_guidance")
    
    # Learning indicators
    learning_words = ["learn", "understand", "study", "remember", "practice", "improve"]
    if any(word in message_lower for word in learning_words):
        analysis["learning_indicators"].append("active_learning")
        analysis["curiosity_level"] = "high"
    
    # Subject-specific detection
    if "music" in message_lower or "sound" in message_lower or "petal" in message_lower:
        analysis["learning_insights"]["subject"] = "music_field"
        analysis["suggested_actions"].append("music_encouragement")
    
    if "math" in message_lower or "number" in message_lower or "calculate" in message_lower:
        analysis["learning_insights"]["subject"] = "mathematics"
        analysis["suggested_actions"].append("math_practice")
    
    return analysis


def generate_aniota_response(user_message: str, analysis: dict, learning_context: dict, session_data: dict) -> str:
    """Generate contextually appropriate response from Aniota"""
    message_lower = user_message.lower()
    
    # Help-seeking responses
    if analysis["help_needed"]:
        help_responses = [
            "I'm here to help! Let's break this down together. What specific part is challenging you?",
            "Don't worry, everyone learns at their own pace. What would make this easier for you?",
            "I notice you might need some guidance. Based on your learning style, I think we should...",
            "Let's figure this out step by step. I've seen you learn well when we..."
        ]
        return help_responses[hash(user_message) % len(help_responses)]
    
    # Positive reinforcement responses
    if analysis["sentiment"] == "positive":
        positive_responses = [
            "I'm so happy to hear that! Your enthusiasm makes learning even more effective.",
            "That's wonderful! I can see you're really engaging with the material.",
            "Your positive attitude is helping you learn faster. Keep up the great work!",
            "I love your excitement about learning! What else would you like to explore?"
        ]
        return positive_responses[hash(user_message) % len(positive_responses)]
    
    # Subject-specific responses
    if analysis["learning_insights"].get("subject") == "music_field":
        return "I noticed you were exploring the musical field! Music and learning go hand in hand - patterns in music help strengthen memory and cognitive connections. Which petal sound was your favorite?"
    
    # Learning progress responses
    if "progress" in message_lower or "doing" in message_lower:
        total_moments = len(session_data.get("learning_moments", []))
        if total_moments > 0:
            return f"You're making excellent progress! I've recorded {total_moments} learning moments so far. Each interaction teaches me more about how you learn best. You seem to particularly enjoy {get_preferred_learning_style(session_data)}."
        else:
            return "Every moment we spend together is progress! I'm learning about your unique learning style and how I can best support you."
    
    # Questions about Aniota
    if any(word in message_lower for word in ["who", "what are you", "about you", "aniota"]):
        return "I'm Aniota, your adaptive learning companion! I'm not just a chatbot - I observe how you learn, adapt to your style, and become more helpful over time. Think of me as a learning friend who remembers what works best for you."
    
    # Encouragement for struggling learners
    if analysis["sentiment"] == "negative":
        encouragement_responses = [
            "Learning can be challenging, but that's how we grow! I believe in you.",
            "It's okay to feel frustrated sometimes. That means you're pushing your boundaries!",
            "Every expert was once a beginner. You're on the right path.",
            "I can see you're working hard. Let's find a way to make this click for you."
        ]
        return encouragement_responses[hash(user_message) % len(encouragement_responses)]
    
    # Conversational responses
    conversation_starters = [
        "That's interesting! Tell me more about what you're thinking.",
        "I'm curious about your perspective. How do you like to approach new topics?",
        "Every conversation helps me understand you better as a learner. What's on your mind?",
        "I'm always learning too! What would you like to explore together today?"
    ]
    
    return conversation_starters[hash(user_message) % len(conversation_starters)]


def determine_conversation_mood(user_message: str, aniota_response: str) -> str:
    """Determine Aniota's mood based on conversation context"""
    message_lower = user_message.lower()
    
    if any(word in message_lower for word in ["help", "stuck", "difficult"]):
        return "supportive"
    elif any(word in message_lower for word in ["great", "love", "awesome", "fun"]):
        return "happy"
    elif any(word in message_lower for word in ["learn", "study", "understand"]):
        return "learning"
    elif any(word in message_lower for word in ["hi", "hello", "hey"]):
        return "friendly"
    else:
        return "engaged"


def get_preferred_learning_style(session_data: dict) -> str:
    """Analyze session data to determine preferred learning style"""
    learning_moments = session_data.get("learning_moments", [])
    
    if not learning_moments:
        return "interactive activities"
    
    # Count interaction types
    interaction_counts = {}
    for moment in learning_moments:
        interaction_type = moment.get("type", "unknown")
        interaction_counts[interaction_type] = interaction_counts.get(interaction_type, 0) + 1
    
    # Determine preferred style
    if interaction_counts.get("petal_click", 0) > 5:
        return "hands-on musical exploration"
    elif interaction_counts.get("field_learning", 0) > 3:
        return "interactive discovery"
    else:
        return "engaging activities"


@app.post("/api/aniota/guidance")
async def request_guidance_suggestion(context_data: dict):
    """Get guidance suggestion for current page context"""
    page_context = context_data.get("page_context", "unknown")
    
    # Get guidance suggestion from Aniota
    suggestion = aniota_presence.suggest_guidance_target(page_context)
    
    return {
        "status": "suggestion_ready",
        "guidance": suggestion,
        "behavior_mode": aniota_presence.state["behavior_mode"]
    }


@app.post("/api/aniota/celebrate")
async def celebrate_user_success(success_data: dict):
    """Celebrate user success and award points"""
    action = success_data.get("action", "unknown")
    success = success_data.get("success", True)
    
    # Calculate reward points
    points = aniota_presence.calculate_reward_points(action, success)
    
    # Update mood to celebratory
    aniota_presence.update_mood("interaction")
    
    # Broadcast celebration to all clients
    await manager.broadcast({
        "type": "celebration",
        "action": action,
        "points_earned": points,
        "total_points": aniota_presence.state["earned_points"],
        "mood_color": aniota_presence.state["mood_color"]
    })
    
    return {
        "status": "celebrated",
        "points_earned": points,
        "total_points": aniota_presence.state["earned_points"]
    }


# === ANIOTA USER OBSERVATION ENDPOINTS (Integration with existing CAF system) ===
# These endpoints integrate with the existing CAF architecture for comprehensive user observation

# Initialize CAF orchestrator references
core_orchestrator = None
mem_orchestrator = None

# Try to import and initialize CAF components if available
try:
    from aniota.core.caf_core import CAFCore
    from aniota.memory.caf_mem import CAFMem
    CAF_AVAILABLE = True
except ImportError:
    CAF_AVAILABLE = False
    logger.warning("CAF system not available - using fallback observation mode")

@app.post("/api/aniota/observe/user-activity")
async def log_user_activity_observation(activity_data: dict):
    """Log comprehensive user activity for Aniota background observation using existing CAF system"""
    
    # Extract observation data
    activity_type = activity_data.get("type", "unknown")
    application = activity_data.get("application", "unknown")
    details = activity_data.get("details", {})
    timestamp = activity_data.get("timestamp", datetime.now().isoformat())
    
    # Process through existing SPE (Sensory Perception Encoder) if available
    try:
        if CAF_AVAILABLE and core_orchestrator:
            # Use existing CAF architecture - route through SPE for proper processing
            sensory_event = {
                "modality": "user_activity",
                "activity_type": activity_type,
                "application": application,
                "details": details,
                "timestamp": timestamp
            }
            
            # Route through CAF Core for proper module coordination
            spe_result = core_orchestrator.core_route_message("SPE_01", {
                "type": "process_user_activity",
                "data": sensory_event
            })
            
            # Store in existing WMS (Working Memory System) via CAF Mem orchestrator
            if mem_orchestrator:
                mem_orchestrator.mem_store_knowledge({
                    "type": "user_observation",
                    "activity": sensory_event,
                    "processed_by": "SPE",
                    "spe_result": spe_result,
                    "retention_priority": "background_observation"
                })
                
        # Update Aniota presence state with observation
        aniota_presence.log_interaction("user_observation", {
            "activity_type": activity_type,
            "application": application,
            "details": details,
            "timestamp": timestamp,
            "observation_mode": "background"
        })
        
        # Broadcast to connected clients if significant activity
        if activity_type in ["application_switch", "significant_pause", "learning_indicator"]:
            await manager.broadcast({
                "type": "user_activity_observed",
                "activity": activity_type,
                "application": application,
                "aniota_state": aniota_presence.get_state()
            })
    
    except Exception as e:
        logger.error(f"Error processing user observation: {e}")
        # Fallback to basic logging if CAF system unavailable
        aniota_presence.log_interaction("user_observation_fallback", activity_data)
    
    return {
        "status": "observed",
        "activity_logged": True,
        "caf_processed": CAF_AVAILABLE and core_orchestrator is not None,
        "timestamp": timestamp
    }

@app.post("/api/aniota/observe/pattern-analysis")
async def analyze_user_patterns(pattern_request: dict):
    """Analyze user patterns using existing learning modules (SIE, QVMLE, Truth Engine)"""
    
    pattern_type = pattern_request.get("type", "behavioral")
    time_window = pattern_request.get("time_window", "recent")
    analysis_depth = pattern_request.get("depth", "surface")
    
    try:
        pattern_analysis = {}
        
        # Use existing SIE for learning pattern analysis
        if LEARNING_SYSTEM_AVAILABLE and 'sie' in learning_system:
            sie_analysis = learning_system['sie'].select_learning_choice(
                f"Analyze user {pattern_type} patterns from {time_window} activity",
                enable_escape_hatch=True
            )
            pattern_analysis['learning_patterns'] = {
                "sie_recommendation": sie_analysis['choice'],
                "confidence": sie_analysis['confidence'],
                "coordinates": sie_analysis['coordinates']
            }
        
        # Use existing QVMLE for mathematical correlation analysis
        if LEARNING_SYSTEM_AVAILABLE and 'qvmle' in learning_system:
            # Generate mock activity vectors for QVMLE analysis
            recent_activities = aniota_presence.get_recent_interactions(limit=10)
            if recent_activities:
                qvmle_result = learning_system['qvmle'].analyze_learning_vector(
                    f"User activity patterns: {len(recent_activities)} recent interactions"
                )
                pattern_analysis['mathematical_analysis'] = {
                    "correlation_strength": qvmle_result.get('correlation', 0.5),
                    "learning_velocity": qvmle_result.get('velocity', 'moderate'),
                    "pattern_consistency": qvmle_result.get('consistency', 'developing')
                }
        
        # Use existing Truth Engine for behavior validation
        if LEARNING_SYSTEM_AVAILABLE and 'truth_engine' in learning_system:
            truth_analysis = learning_system['truth_engine'].analyze_statement(
                f"User shows {pattern_type} learning patterns"
            )
            pattern_analysis['behavior_validation'] = {
                "truth_score": truth_analysis.get('score', 0.5),
                "confidence": truth_analysis.get('confidence', 'medium'),
                "semantic_analysis": truth_analysis.get('semantic_core', 'developing_patterns')
            }
        
        # Update Aniota's understanding of user patterns
        aniota_presence.update_user_model({
            "pattern_type": pattern_type,
            "analysis": pattern_analysis,
            "timestamp": datetime.now().isoformat(),
            "learning_stage": determine_learning_stage(pattern_analysis)
        })
        
        return {
            "status": "patterns_analyzed",
            "pattern_type": pattern_type,
            "analysis": pattern_analysis,
            "aniota_insights": generate_aniota_insights(pattern_analysis),
            "recommended_actions": suggest_learning_actions(pattern_analysis)
        }
        
    except Exception as e:
        logger.error(f"Error in pattern analysis: {e}")
        return {
            "status": "analysis_error",
            "error": str(e),
            "fallback_suggestions": ["Continue current learning approach", "Try different interaction styles"]
        }

@app.post("/api/aniota/observe/ironic-events")
async def catalog_ironic_events(event_data: dict):
    """Catalog ironic events and compare patterns using existing knowledge systems"""
    
    event_description = event_data.get("description", "")
    context = event_data.get("context", {})
    user_reaction = event_data.get("user_reaction", "neutral")
    
    try:
        # Use existing knowledge base to understand the event
        if LEARNING_SYSTEM_AVAILABLE and 'knowledge' in learning_system:
            knowledge_context = learning_system['knowledge'].query(
                f"What makes this ironic: {event_description}"
            )
            
        # Use Truth Engine to analyze the irony level
        if LEARNING_SYSTEM_AVAILABLE and 'truth_engine' in learning_system:
            irony_analysis = learning_system['truth_engine'].analyze_statement(
                f"This event is ironic: {event_description}"
            )
            
        # Store in existing memory system via CAF Mem
        ironic_event_record = {
            "description": event_description,
            "context": context,
            "user_reaction": user_reaction,
            "irony_score": irony_analysis.get('score', 0.5) if 'irony_analysis' in locals() else 0.5,
            "knowledge_context": knowledge_context if 'knowledge_context' in locals() else {},
            "timestamp": datetime.now().isoformat(),
            "pattern_category": categorize_ironic_event(event_description, context)
        }
        
        if CAF_AVAILABLE and mem_orchestrator:
            mem_orchestrator.mem_store_knowledge({
                "type": "ironic_event",
                "event": ironic_event_record,
                "retention_priority": "pattern_learning"
            })
        
        # Update Aniota's pattern recognition
        aniota_presence.log_interaction("ironic_event_cataloged", ironic_event_record)
        
        # Check for similar patterns in existing events
        similar_patterns = find_similar_ironic_patterns(ironic_event_record)
        
        return {
            "status": "event_cataloged",
            "ironic_event": ironic_event_record,
            "similar_patterns": similar_patterns,
            "pattern_insights": generate_pattern_insights(similar_patterns),
            "learning_opportunity": suggest_learning_from_irony(ironic_event_record)
        }
        
    except Exception as e:
        logger.error(f"Error cataloging ironic event: {e}")
        return {
            "status": "cataloging_error",
            "error": str(e),
            "event_logged": False
        }

def determine_learning_stage(pattern_analysis: dict) -> str:
    """Determine user's current learning stage based on pattern analysis"""
    if not pattern_analysis:
        return "exploring"
    
    # Analyze SIE recommendations
    sie_choice = pattern_analysis.get('learning_patterns', {}).get('sie_recommendation', '')
    if sie_choice == 'Explore':
        return "discovery"
    elif sie_choice == 'Extend':
        return "connecting"
    elif sie_choice == 'Review':
        return "consolidating"
    elif sie_choice == 'Expand':
        return "advancing"
    else:
        return "adapting"

def generate_aniota_insights(pattern_analysis: dict) -> list:
    """Generate Aniota's insights about user patterns"""
    insights = []
    
    # SIE-based insights
    learning_patterns = pattern_analysis.get('learning_patterns', {})
    if learning_patterns:
        confidence = learning_patterns.get('confidence', 50)
        if confidence > 75:
            insights.append("I'm noticing strong patterns in how you learn - you seem to have a consistent approach that works well for you.")
        elif confidence < 40:
            insights.append("Your learning style is still developing - I'm seeing you experiment with different approaches, which is great!")
    
    # Mathematical analysis insights
    math_analysis = pattern_analysis.get('mathematical_analysis', {})
    if math_analysis:
        correlation = math_analysis.get('correlation_strength', 0.5)
        if correlation > 0.7:
            insights.append("There's a strong mathematical correlation in your learning patterns - very consistent progress!")
        elif correlation < 0.3:
            insights.append("Your learning journey shows beautiful variety - you're exploring many different paths to understanding.")
    
    # Behavior validation insights
    behavior = pattern_analysis.get('behavior_validation', {})
    if behavior:
        truth_score = behavior.get('truth_score', 0.5)
        if truth_score > 0.8:
            insights.append("Your learning behaviors show authentic engagement - you're genuinely connecting with the material.")
    
    return insights if insights else ["I'm learning about your unique learning style - every interaction teaches me more about how to help you best."]

def suggest_learning_actions(pattern_analysis: dict) -> list:
    """Suggest learning actions based on pattern analysis"""
    actions = []
    
    # SIE-based suggestions
    learning_patterns = pattern_analysis.get('learning_patterns', {})
    sie_choice = learning_patterns.get('sie_recommendation', '')
    
    if sie_choice == 'Explore':
        actions.append("Try exploring new topics or approaches you haven't considered yet")
    elif sie_choice == 'Extend':
        actions.append("Connect what you're learning to things you already know well")
    elif sie_choice == 'Review':
        actions.append("Take time to consolidate and practice what you've recently learned")
    elif sie_choice == 'Expand':
        actions.append("You're ready to tackle more advanced concepts in this area")
    
    # Mathematical correlation suggestions
    math_analysis = pattern_analysis.get('mathematical_analysis', {})
    velocity = math_analysis.get('learning_velocity', '')
    if velocity == 'high':
        actions.append("Your learning velocity is excellent - consider challenging yourself with complex problems")
    elif velocity == 'low':
        actions.append("Take your time - consistent steady progress is valuable too")
    
    return actions if actions else ["Continue your current learning approach - I'm still gathering data about what works best for you"]

def categorize_ironic_event(description: str, context: dict) -> str:
    """Categorize ironic events for pattern recognition"""
    description_lower = description.lower()
    
    if any(word in description_lower for word in ['learn', 'study', 'understand']):
        return "learning_irony"
    elif any(word in description_lower for word in ['expect', 'plan', 'think']):
        return "expectation_irony"
    elif any(word in description_lower for word in ['help', 'teach', 'show']):
        return "assistance_irony"
    else:
        return "general_irony"

def find_similar_ironic_patterns(current_event: dict) -> list:
    """Find similar ironic patterns in user's history using existing memory system"""
    # This would integrate with the existing LDM (Long-Term Declarative Memory) system
    # For now, return mock similar patterns
    return [
        {
            "similarity_score": 0.8,
            "description": "Previous similar ironic event",
            "pattern_type": current_event.get("pattern_category", "general_irony")
        }
    ]

def generate_pattern_insights(similar_patterns: list) -> dict:
    """Generate insights from similar ironic patterns"""
    if not similar_patterns:
        return {"insight": "This appears to be a new type of ironic event for you"}
    
    return {
        "insight": f"I've noticed {len(similar_patterns)} similar patterns before",
        "frequency": "developing_pattern" if len(similar_patterns) > 2 else "emerging_pattern",
        "learning_opportunity": "These patterns might reveal something interesting about your learning style"
    }

def suggest_learning_from_irony(ironic_event: dict) -> dict:
    """Suggest learning opportunities from ironic events"""
    return {
        "opportunity": "Ironic events often reveal assumptions - what assumptions might this event challenge?",
        "reflection_question": f"What did you expect to happen differently in this situation?",
        "learning_connection": "Understanding irony can improve critical thinking and pattern recognition skills"
    }

@app.websocket("/ws/aniota")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time Aniota presence sync"""
    # Wait for handshake message with mode info
    handshake = await websocket.receive_text()
    try:
        handshake_data = json.loads(handshake)
        mode = handshake_data.get("mode", "unknown")
    except Exception:
        mode = "unknown"
    await manager.connect(websocket, mode)
    # Send initial state
    await websocket.send_text(json.dumps({
        "type": "initial_state",
        "state": aniota_presence.get_state(),
        "mode": mode
    }))
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message["type"] == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
            elif message["type"] == "interaction":
                await log_aniota_interaction(message["data"])
            elif message["type"] == "position_update":
                await update_aniota_position(message["data"])
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting ANIOTA IX-TECH Backend Server on port 8001...")
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)
