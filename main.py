


from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Dict, Any, List
import logging  # COMMENTED OUT: Logging import for log file creation
import uvicorn
import json
import asyncio
from backend.aniota_presence import aniota_presence
from contextlib import asynccontextmanager

# logging.basicConfig(level=logging.INFO)  # COMMENTED OUT: Logging setup for log file creation
# logger = logging.getLogger(__name__)  # COMMENTED OUT: Logger instance

@asynccontextmanager
def lifespan(app):
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
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001", "http://127.0.0.1:8001", "http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    
    # logger.info(f"User registered: {user.username}")  # COMMENTED OUT: Log file write
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
    # logger.info(f"User logged in: {credentials.username}")  # COMMENTED OUT: Log file write
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
    
    # logger.info(f"Learning session created: {session_id}")  # COMMENTED OUT: Log file write
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
    # Mock AI response for development
    topic = request.get("topic", "general")
    level = request.get("level", 2)
    
    mock_question = {
        "question": f"What do you find most interesting about {topic}?",
        "topic": topic,
        "level": level,
        "hints": ["Think about what you already know", "Consider examples from your experience"],
        "generated_at": "2025-08-03"
    }
    
    # logger.info(f"Generated question for topic: {topic}")  # COMMENTED OUT: Log file write
    return mock_question

@app.post("/api/ai/validate-response")
def validate_response(request: Dict[str, Any]):
    # Mock validation for development
    response_text = request.get("response", "")
    response_length = len(response_text.split())
    
    if response_length < 3:
        score = 0.3
        feedback = "Try to provide more detail in your response."
    elif response_length > 15:
        score = 0.8
        feedback = "Great detail! Well thought out response."
    else:
        score = 0.6
        feedback = "Good response! Can you add an example?"
    
    validation = {
        "score": score,
        "feedback": feedback,
        "suggestions": ["Add more examples", "Explain your reasoning"],
        "validated_at": "2025-08-03"
    }
    
    # logger.info(f"Validated response with score: {score}")  # COMMENTED OUT: Log file write
    return validation

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


# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                pass

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


@app.websocket("/ws/aniota")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time Aniota presence sync"""
    await manager.connect(websocket)
    
    # Send initial state
    await websocket.send_text(json.dumps({
        "type": "initial_state",
        "state": aniota_presence.get_state()
    }))
    
    try:
        while True:
            # Listen for client messages
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
