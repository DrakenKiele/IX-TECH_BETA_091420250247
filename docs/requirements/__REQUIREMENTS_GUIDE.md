# IX-TECH Requirements Structure
# Use this file to understand the different requirement levels

## Current Implementation:

### backend/requirements.txt
- **Purpose**: Complete backend system with AI consciousness features
- **Status**: Now merged with DOCS/requirements.txt
- **Usage**: `pip install -r backend/requirements.txt`

### DOCS/requirements.txt  
- **Purpose**: Reference specification for full ANIOTA system
- **Status**: Documentation/planning file
- **Usage**: Reference for system architects

## Layered Installation Options:

### Minimal Development Setup
```bash
pip install fastapi uvicorn websockets pydantic httpx aiofiles
```

### Full Backend System
```bash
pip install -r backend/requirements.txt
```

### Development Tools Only
```bash
pip install pytest black flake8 mypy
```

## Recommendation:
- Use `backend/requirements.txt` for all installations
- Keep `DOCS/requirements.txt` as system specification reference
- Consider requirements-dev.txt for development-only dependencies
