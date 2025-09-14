



from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("thin_client_api.py", "system_initialization", "import", "Thin client API for Chrome extension/PWA")

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

@asynccontextmanager
async def lifespan(app):
    yield

app = FastAPI(
    title="ANIOTA Thin Client API",
    description="Minimal API for Chrome extension or local thin client.",
    version="0.1.0",
    lifespan=lifespan
)

# CORS for extension/thin client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {
        "message": "ANIOTA Thin Client API",
        "status": "running",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Add any endpoints needed for extension/thin client below

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("thin_client_api:app", host="0.0.0.0", port=41300, reload=True)
