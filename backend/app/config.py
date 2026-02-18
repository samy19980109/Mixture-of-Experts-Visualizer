"""Backend configuration."""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent

MODEL_PATH = os.getenv("MODEL_PATH", "mlx-community/OLMoE-1B-7B-0125-Instruct-4bit")
MODEL_CACHE_DIR = Path(os.getenv("MODEL_CACHE_DIR", "./models"))
MAX_CONTEXT_LENGTH = int(os.getenv("MAX_CONTEXT_LENGTH", "4096"))

BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

DEFAULT_TEMPERATURE = float(os.getenv("DEFAULT_TEMPERATURE", "0.7"))
DEFAULT_TOP_P = float(os.getenv("DEFAULT_TOP_P", "0.9"))
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1024"))

WS_HEARTBEAT_INTERVAL = int(os.getenv("WS_HEARTBEAT_INTERVAL", "30"))
BENCHMARK_ITERATIONS = int(os.getenv("BENCHMARK_ITERATIONS", "10"))
