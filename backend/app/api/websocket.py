"""WebSocket handlers for real-time inference."""

import asyncio
import json
from typing import TYPE_CHECKING, Dict, Optional

from fastapi import WebSocket, WebSocketDisconnect

from app.utils.memory_tracker import get_memory_usage

if TYPE_CHECKING:
    from app.models.expert_manager import ExpertManager
    from app.models.moe_model import MoEModel

# Store active connections
active_connections: Dict[str, WebSocket] = {}

# These will be set by the main app
_model: Optional["MoEModel"] = None
_expert_manager: Optional["ExpertManager"] = None


def set_model_instances(model: "MoEModel", expert_manager: "ExpertManager"):
    """Set the model instances to be used by the WebSocket handlers."""
    global _model, _expert_manager
    _model = model
    _expert_manager = expert_manager


async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connections for real-time inference."""
    await websocket.accept()
    client_id = str(id(websocket))
    active_connections[client_id] = websocket

    try:
        # Send initial connection message
        await websocket.send_json(
            {
                "type": "connected",
                "client_id": client_id,
            }
        )

        # Send memory usage periodically
        asyncio.create_task(send_memory_updates(websocket))

        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            message = json.loads(data)

            action = message.get("action")

            if action == "start_inference":
                await handle_inference(websocket, message)
            elif action == "stop_inference":
                pass
            elif action == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        if client_id in active_connections:
            del active_connections[client_id]
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except Exception:
            pass
        if client_id in active_connections:
            del active_connections[client_id]


async def handle_inference(websocket: WebSocket, message: dict):
    """Handle inference request via WebSocket."""
    prompt = message.get("prompt", "")
    max_tokens = message.get("max_tokens", 100)
    temperature = message.get("temperature", 0.7)
    top_p = message.get("top_p", 0.9)

    if not _model:
        await websocket.send_json(
            {
                "type": "error",
                "message": "Model not loaded",
            }
        )
        return

    try:
        tokens_generated = []

        def on_token(token_data: dict):
            """Callback for each generated token."""
            tokens_generated.append(token_data)

            # Update expert stats
            if _expert_manager and token_data.get("expert_data"):
                _expert_manager.update_stats(token_data["expert_data"])

        # Run inference synchronously (MLX requires main thread)
        result = _model.generate(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            callback=on_token,
        )

        # Send all tokens to client
        for token_data in tokens_generated:
            await websocket.send_json(
                {
                    "type": "token",
                    "data": token_data,
                }
            )

        # Send completion message
        await websocket.send_json(
            {
                "type": "complete",
                "result": result,
                "total_tokens": len(tokens_generated),
            }
        )

    except Exception as e:
        await websocket.send_json(
            {
                "type": "error",
                "message": str(e),
            }
        )


async def send_memory_updates(websocket: WebSocket, interval: int = 5):
    """Send memory usage updates periodically."""
    try:
        while True:
            await asyncio.sleep(interval)
            memory = get_memory_usage()
            await websocket.send_json(
                {
                    "type": "memory_update",
                    "data": memory,
                }
            )
    except Exception:
        pass  # Connection closed
