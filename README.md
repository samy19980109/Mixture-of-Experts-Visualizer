# MoE Router Visualizer

Interactive visualization tool for the OLMoE-1B-7B-0125-Instruct-4bit model, featuring real-time expert activation tracking, Cerebras-style wafer visualization, and hot-swappable expert weights.

## Features

- **Real-time Expert Tracking**: Visualize which experts are activated for each token
- **Expert Heatmap**: 8×8 grid showing utilization across all 64 experts
- **Token Flow**: View token-by-token generation with expert routing
- **Memory Monitoring**: Track RAM usage during inference
- **Performance Metrics**: Tokens per second and latency stats
- **WebSocket Streaming**: Real-time updates during generation

## Tech Stack

### Backend
- Python 3.11+
- FastAPI + WebSocket
- MLX (Apple Silicon optimized)
- OLMoE-1B-7B-0125-Instruct-4bit model

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- WebSocket client

## Project Structure

```
moe-router-visualizer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── models/
│   │   │   ├── moe_model.py     # MLX model wrapper
│   │   │   └── expert_manager.py
│   │   ├── api/
│   │   │   └── websocket.py     # WebSocket handlers
│   │   └── utils/
│   │       └── memory_tracker.py
│   ├── requirements.txt
│   └── pyproject.toml
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── Layout/
    │   │   ├── Visualization/
    │   │   ├── Controls/
    │   │   └── Metrics/
    │   ├── hooks/
    │   ├── store/
    │   └── services/
    ├── package.json
    └── vite.config.ts
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- macOS with Apple Silicon (for MLX)
- 16GB RAM recommended

### Backend Setup

```bash
cd moe-router-visualizer/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the server
uvicorn app.main:app --reload
```

The backend will start on `http://localhost:8000` and automatically download the OLMoE model on first run.

### Frontend Setup

```bash
cd moe-router-visualizer/frontend

# Install dependencies
npm install

# Install missing dependency
cd .. && npm install tailwindcss-animate

# Run development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Usage

1. Open your browser to `http://localhost:5173`
2. Wait for the model to load (check the backend logs)
3. Enter a prompt in the text area
4. Adjust temperature, top-p, and max tokens as needed
5. Click "Generate" to start inference
6. Watch the expert heatmap and token flow update in real-time
7. Switch between visualizations using the sidebar

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/model/info` - Model metadata
- `GET /api/memory` - Memory usage
- `GET /api/experts` - List all experts
- `POST /api/inference` - Run synchronous inference
- `WS /ws` - WebSocket for streaming inference

## Model Specifications

- **Model**: OLMoE-1B-7B-0125-Instruct-4bit
- **Total Parameters**: 7B
- **Active Parameters**: 1B per token
- **Number of Experts**: 64
- **Experts Activated**: 8 per token (top-8 routing)
- **Quantization**: 4-bit (MLX format)
- **Memory Footprint**: ~3.5GB
- **Context Window**: 4096 tokens

## Configuration

Edit `backend/.env` to customize:

```bash
MODEL_PATH=mlx-community/OLMoE-1B-7B-0125-Instruct-4bit
DEFAULT_TEMPERATURE=0.7
DEFAULT_TOP_P=0.9
MAX_TOKENS=1024
BACKEND_PORT=8000
```

## Development

### Backend Development

```bash
cd backend
# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Run tests
pytest
```

### Frontend Development

```bash
cd frontend
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Model download fails
The model will be downloaded from Hugging Face on first run. Ensure you have a stable internet connection.

### Out of memory
- Reduce `MAX_TOKENS` in the configuration
- Close other applications
- Restart the backend

### WebSocket connection issues
- Ensure the backend is running on port 8000
- Check that the frontend proxy is configured correctly in `vite.config.ts`

## License

MIT
