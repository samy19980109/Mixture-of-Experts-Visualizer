"""FastAPI main application."""

import asyncio
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.api.websocket import set_model_instances, websocket_endpoint
from app.config import BACKEND_PORT, FRONTEND_URL, MAX_TOKENS
from app.models.expert_manager import ExpertManager
from app.models.moe_model import MoEModel
from app.utils.memory_tracker import get_memory_usage

# Global model instance
model: Optional[MoEModel] = None
expert_manager: Optional[ExpertManager] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan."""
    global model, expert_manager

    # Startup
    print("Loading MoE model...")
    model = MoEModel()
    model.load()
    expert_manager = ExpertManager(model)

    # Set model instances for WebSocket handlers
    set_model_instances(model, expert_manager)

    print("Model loaded successfully!")

    yield

    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title="MoE Router Visualizer",
    description="Interactive visualization tool for Mixture of Experts models",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "model_loaded": model is not None}


@app.get("/api/model/info")
async def get_model_info():
    """Get model information."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return model.get_model_info()


@app.get("/api/memory")
async def get_memory():
    """Get current memory usage."""
    return get_memory_usage()


@app.get("/api/experts")
async def get_experts():
    """Get all expert information."""
    if not expert_manager:
        raise HTTPException(status_code=503, detail="Expert manager not initialized")
    return {"experts": expert_manager.get_all_experts()}


@app.get("/api/experts/{expert_id}")
async def get_expert(expert_id: int):
    """Get specific expert information."""
    if not expert_manager:
        raise HTTPException(status_code=503, detail="Expert manager not initialized")
    if expert_id < 0 or expert_id >= 64:
        raise HTTPException(status_code=400, detail="Invalid expert ID")
    return expert_manager.get_expert_info(expert_id)


@app.post("/api/inference")
async def inference(prompt: str, max_tokens: int = MAX_TOKENS):
    """Run synchronous inference."""
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        result = model.generate(prompt, max_tokens=max_tokens)
        return {
            "result": result,
            "expert_activations": model.expert_tracker.activation_history,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    """WebSocket endpoint for real-time inference."""
    await websocket_endpoint(websocket)
