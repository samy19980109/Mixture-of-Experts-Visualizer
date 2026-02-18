# Complete Implementation Plan: MoE Router Visualizer

## Executive Summary

Building an interactive visualization tool for the **OLMoE-1B-7B-0125-Instruct-4bit** model on your 16GB MacBook Air, featuring real-time expert activation tracking, Cerebras-style wafer visualization, and hot-swappable expert weights.

---

## 1. System Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Python 3.11+ | MoE model inference & API |
| **ML Framework** | MLX (Apple Silicon) | Optimized 4-bit inference |
| **Model** | OLMoE-1B-7B-0125-Instruct-4bit | 7B params, 1B active, 64 experts |
| **API Server** | FastAPI + WebSocket | Real-time data streaming |
| **Frontend** | React 18 + TypeScript | Interactive UI |
| **Visualization** | D3.js + Recharts | Charts & graphs |
| **3D/Wafer View** | Three.js or React-Three-Fiber | Cerebras wafer topology |
| **State Management** | Zustand | Lightweight state |
| **Styling** | Tailwind CSS + shadcn/ui | Modern UI components |

### Model Specifications

```
Model: OLMoE-1B-7B-0125-Instruct-4bit
├── Total Parameters: 7B
├── Active Parameters: 1B per token
├── Number of Experts: 64
├── Experts Activated: 8 per token (top-8 routing)
├── Quantization: 4-bit (MLX format)
├── Memory Footprint: ~3.5GB
├── Context Window: 4096 tokens
└── Expected Speed: 15-25 tokens/sec on M2/M3
```

---

## 2. Project Structure

```
moe-router-visualizer/
├── README.md
├── requirements.txt
├── pyproject.toml
├── .gitignore
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI entry point
│   │   ├── config.py                # Configuration settings
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── moe_model.py         # MLX model wrapper
│   │   │   ├── router_analyzer.py   # Expert routing analysis
│   │   │   └── expert_manager.py    # Hot-swap management
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py            # REST endpoints
│   │   │   └── websocket.py         # WebSocket handlers
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── inference_service.py # Inference orchestration
│   │   │   ├── benchmark_service.py # Latency benchmarking
│   │   │   └── visualization_data.py # Data transformation
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── mlx_utils.py         # MLX-specific helpers
│   │       └── memory_tracker.py    # RAM usage monitoring
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── Footer.tsx
│       │   ├── Visualization/
│       │   │   ├── TokenFlow.tsx        # Token routing flow
│       │   │   ├── ExpertHeatmap.tsx    # Expert utilization
│       │   │   ├── WaferView.tsx        # Cerebras wafer topology
│       │   │   ├── LatencyChart.tsx     # Performance comparison
│       │   │   ├── LoadBalance.tsx      # Load balancing metrics
│       │   │   └── AttentionMap.tsx     # Optional: attention viz
│       │   ├── Controls/
│       │   │   ├── TextInput.tsx        # User input
│       │   │   ├── InferenceControls.tsx # Play/pause/stop
│       │   │   ├── ModelConfig.tsx      # Expert count, top-k
│       │   │   └── ExportPanel.tsx      # Data export
│       │   ├── ExpertManager/
│       │   │   ├── ExpertList.tsx       # List all 64 experts
│       │   │   ├── WeightUploader.tsx   # Hot-swap interface
│       │   │   ├── ExpertDetail.tsx     # Individual expert stats
│       │   │   └── SwapHistory.tsx      # Modification log
│       │   └── Metrics/
│       │       ├── MemoryUsage.tsx      # RAM tracking
│       │       ├── TokenSpeed.tsx       # Tokens/sec display
│       │       └── RouterStats.tsx      # Routing statistics
│       ├── hooks/
│       │   ├── useWebSocket.ts          # Real-time connection
│       │   ├── useInference.ts          # Inference state
│       │   ├── useModel.ts              # Model configuration
│       │   └── useBenchmark.ts          # Performance testing
│       ├── services/
│       │   ├── api.ts                   # API client
│       │   └── websocket.ts             # WebSocket client
│       ├── types/
│       │   └── index.ts                 # TypeScript definitions
│       ├── store/
│       │   └── useStore.ts              # Zustand store
│       └── utils/
│           ├── formatters.ts            # Data formatting
│           └── colorScales.ts           # Visualization colors
└── docs/
    ├── ARCHITECTURE.md
    └── API.md
```

---

## 3. Key Features Implementation

### 3.1 Expert Router Visualization

**Data Flow:**
```
User Input → Tokenization → Router Forward Pass → 
Expert Selection (top-8) → Visualization Data → WebSocket → Frontend
```

**Visualization Components:**
- **Token Flow**: Sankey diagram showing token → expert routing
- **Expert Heatmap**: 8×8 grid (64 experts) with color-coded utilization
- **Timeline View**: Token-by-token animation of expert activation

### 3.2 Cerebras Wafer Topology

**Wafer Simulation:**
```
Grid Layout: 8×8 tiles (representing Cerebras CS-3 wafer)
├── Each tile holds 8 experts
├── Memory bandwidth visualization
├── Expert placement optimization
└── Hot-spot detection
```

**Features:**
- 2D/3D toggle view
- Real-time load balancing overlay
- Memory bandwidth utilization heatmap

### 3.3 Latency Benchmarking

**Comparison Metrics:**
- Dense vs. Sparse activation time
- Expert switching overhead
- Memory bandwidth saturation
- Token generation latency (P50, P95, P99)

### 3.4 Expert Hot-Swapping

**Implementation:**
- Dynamic weight loading without model restart
- Expert weight upload (PyTorch format)
- Rollback capability
- A/B testing between expert versions

---

## 4. Implementation Phases

### Phase 1: Foundation (Week 1)

**Days 1-2: Project Setup**
- Initialize Python project with Poetry/pip
- Set up React + TypeScript + Vite
- Configure Tailwind + shadcn/ui
- Set up linting (ruff, ESLint) and formatting (black, prettier)

**Days 3-4: Model Integration**
```python
# Core model wrapper
from mlx_lm import load_model

class MoEModel:
    def __init__(self, model_path="mlx-community/OLMoE-1B-7B-0125-Instruct-4bit"):
        self.model, self.tokenizer = load_model(model_path)
        self.expert_tracker = ExpertTracker()
    
    def generate_with_tracking(self, prompt, callback=None):
        # Hook into router to track expert activation
        # Stream tokens with metadata
        pass
```

**Days 5-7: Backend API**
- FastAPI server setup
- REST endpoints for model info, inference
- WebSocket endpoint for streaming
- Health checks and memory monitoring

**Deliverable:** Backend server running model with basic API

### Phase 2: Core Visualization (Week 2)

**Days 1-2: Frontend Infrastructure**
- WebSocket connection management
- Global state store (Zustand)
- API service layer
- Basic layout components

**Days 3-4: Token Flow Visualization**
```typescript
// Token routing data structure
interface TokenRoute {
  tokenId: number;
  token: string;
  selectedExperts: number[]; // 8 expert indices
  routerWeights: number[];   // 64 weights
  timestamp: number;
}

// D3.js Sankey diagram
// Animated token flow
```

**Days 5-6: Expert Heatmap**
- 8×8 grid visualization
- Real-time color updates
- Utilization statistics
- Expert detail view on click

**Day 7: Integration Testing**
- End-to-end inference flow
- WebSocket data streaming
- Performance optimization

**Deliverable:** Working visualization with live inference

### Phase 3: Advanced Features (Week 3)

**Days 1-2: Wafer Topology View**
- Cerebras-style wafer grid
- 2D/3D toggle
- Load balancing overlay
- Memory bandwidth visualization

**Days 3-4: Benchmarking System**
- Dense vs. sparse comparison
- Automated benchmark suite
- Results storage and visualization
- Statistical analysis (P50, P95, P99)

**Days 5-6: Expert Hot-Swapping**
- Weight upload interface
- Dynamic expert replacement
- Version management
- Rollback functionality

**Day 7: Polish & Documentation**
- UI/UX refinements
- Loading states and error handling
- User documentation
- Code comments and cleanup

**Deliverable:** Complete application with all features

### Phase 4: Optimization (Week 4 - Optional)

- Performance profiling
- Memory optimization
- Animation smoothness
- Mobile responsiveness
- Export functionality (PNG, JSON, CSV)

---

## 5. Dependencies

### Backend (requirements.txt)
```
# Core
fastapi==0.115.0
uvicorn[standard]==0.32.0
websockets==13.0
python-multipart==0.0.12

# ML/MLX
mlx>=0.21.0
mlx-lm>=0.20.0
numpy>=1.26.0
safetensors>=0.4.0

# Utilities
pydantic>=2.5.0
python-dotenv>=1.0.0
psutil>=6.0.0  # Memory tracking

# Dev
pytest>=8.0.0
pytest-asyncio>=0.23.0
httpx>=0.27.0
```

### Frontend (package.json key deps)
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^5.0.0",
    "d3": "^7.9.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "recharts": "^2.13.0",
    "socket.io-client": "^4.8.0",
    "axios": "^1.7.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/d3": "^7.4.0",
    "@types/three": "^0.170.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
```

---

## 6. API Specification

### REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/model/info` | GET | Model metadata (experts, params) |
| `/api/model/config` | GET/POST | Get/update model config |
| `/api/inference` | POST | Synchronous inference |
| `/api/benchmark` | POST | Run benchmark test |
| `/api/experts` | GET | List all experts with stats |
| `/api/experts/{id}` | GET | Expert details |
| `/api/experts/{id}/weights` | POST | Upload new weights |
| `/api/export/{format}` | GET | Export visualization data |

### WebSocket Events

**Client → Server:**
- `start_inference`: Begin token generation
- `stop_inference`: Cancel generation
- `update_config`: Change model settings

**Server → Client:**
- `token`: New token with routing data
- `expert_activation`: Expert utilization update
- `benchmark_progress`: Benchmark status
- `memory_update`: RAM usage stats
- `error`: Error message

---

## 7. Configuration

### Environment Variables (.env)
```bash
# Model
MODEL_PATH=mlx-community/OLMoE-1B-7B-0125-Instruct-4bit
MODEL_CACHE_DIR=./models
MAX_CONTEXT_LENGTH=4096

# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173

# Inference
DEFAULT_TEMPERATURE=0.7
DEFAULT_TOP_P=0.9
MAX_TOKENS=1024

# Visualization
WS_HEARTBEAT_INTERVAL=30
BENCHMARK_ITERATIONS=10
```

---

## 8. Technical Considerations

### Memory Management

With 16GB RAM:
- **Model**: ~3.5GB (4-bit quantized)
- **KV Cache**: ~1-2GB (depends on context)
- **OS + Apps**: ~4-6GB
- **Visualizer**: ~1-2GB
- **Buffer**: ~2-3GB ✅

### MLX Optimizations

```python
# Key optimizations for Apple Silicon
import mlx.core as mx

# Use Metal GPU
mx.set_default_device(mx.gpu)

# Quantization already applied in model
# Streaming generation to manage memory

def generate_stream(self, prompt, max_tokens=100):
    tokens = self.tokenizer.encode(prompt)
    for i in range(max_tokens):
        # Process single token
        logits = self.model(tokens[-1:])
        # Track expert activation here
        yield token, expert_data
```

### Router Hook Implementation

```python
# Hook into OLMoE router to capture expert selection
class ExpertTracker:
    def __init__(self):
        self.activation_history = []
    
    def on_router_forward(self, hidden_states):
        # Capture router logits
        router_logits = self.model.router(hidden_states)
        # Get top-8 experts
        weights, selected_experts = mx.topk(
            router_logits, 
            k=8, 
            axis=-1
        )
        self.activation_history.append({
            'experts': selected_experts.tolist(),
            'weights': weights.tolist()
        })
```

---

## 9. Testing Strategy

### Unit Tests
- Model loading and inference
- Expert tracking accuracy
- API endpoint validation
- WebSocket connection

### Integration Tests
- End-to-end inference flow
- Hot-swap functionality
- Benchmark accuracy

### Performance Tests
- Token generation speed
- Memory usage limits
- WebSocket latency
- UI responsiveness

---

## 10. Deployment Options

### Option A: Local Development (Recommended)
```bash
# Terminal 1
cd backend && uvicorn app.main:app --reload

# Terminal 2
cd frontend && npm run dev
```

### Option B: Docker (Future)
```dockerfile
# Multi-stage build for production
# Backend container with MLX
# Frontend Nginx container
```

### Option C: Distribution
- PyInstaller for backend executable
- Electron wrapper for desktop app
- One-click installer for Mac

---

## Open Questions

Before implementation, please confirm:

1. **3D Wafer View**: Do you want a 2D grid (simpler) or full 3D wafer visualization (more complex)?

2. **Hot-swap Scope**: Should hot-swapping work on individual experts or require full expert set replacement?

3. **Export Formats**: What data export formats do you need? (JSON, CSV, PNG screenshots, MP4 video?)

4. **Benchmark Modes**: Should I include comparison with dense models (like Llama-3-8B) or just MoE analysis?

5. **Persistence**: Should expert swap history and benchmark results be saved to disk or just session-based?

---

## Ready to Proceed

This plan is complete and ready for implementation. The OLMoE-1B-7B-0125-Instruct-4bit model provides an excellent foundation for demonstrating:
- Real-time expert routing visualization
- Cerebras-style wafer topology
- Load balancing across 64 experts
- Efficient 4-bit inference on 16GB MacBook Air

Expected timeline: 3-4 weeks for complete implementation.
