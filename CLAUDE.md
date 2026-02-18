# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (from `backend/`)
```bash
source venv/bin/activate
uvicorn app.main:app --reload --port 8000   # dev server
pytest                                       # run all tests
pytest tests/test_model.py -k test_name      # single test
ruff check app/                              # lint
black app/ --check                           # format check
```

### Frontend (from `frontend/`)
```bash
npm run dev       # dev server on :5173
npm run build     # typecheck (tsc) + production build
npm run lint      # eslint
```

Both servers must run simultaneously. The frontend Vite dev server proxies `/api/*` and `/ws` to the backend on port 8000.

## Architecture

This is a full-stack visualizer for a Mixture-of-Experts (OLMoE) model running on Apple Silicon via MLX.

### Data Flow
```
TextInput → useInference.runInference(prompt)
  → WebSocket sends { action: "start_inference", prompt, ... }
  → Backend MoEModel.generate() runs synchronously (MLX needs main thread)
  → ExpertTracker hooks capture router logits per layer per token
  → on_token callback collects tokens in a list
  → After generation completes, all tokens sent over WebSocket as { type: "token" }
  → Frontend useInference maps snake_case backend data → camelCase TokenRoute
  → Zustand store.addToken() updates tokenRoutes[] and generatedText
  → Visualization components (ExpertHeatmap, WaferView, TokenFlow) re-render
```

### Expert Hook System (`backend/app/models/moe_model.py`)
The ExpertTracker monkey-patches the `OlmoeSparseMoeBlock` **class** (not instance) `__call__` to intercept router logits before each MoE forward pass. Instance-level `__call__` overrides don't work for Python dunder methods. Each MoE layer's `mlp` gets `_expert_tracker` and `_hook_layer_idx` attributes; the patched `__call__` reads these to route captured logits to the tracker. Hooks are wrapped in try/except so failures never break inference.

### Snake_case ↔ camelCase Boundary
The backend uses Python snake_case (`token_id`, `expert_data`, `process_rss_mb`). The frontend maps to camelCase at two points:
- `useInference.ts` — WebSocket token and memory_update messages
- `services/api.ts` — REST responses (model info)

### State Management
Single Zustand store (`frontend/src/store/useStore.ts`) holds all app state: model info, inference state, token routes, expert activations, memory stats, UI preferences (view, config, dark mode). No prop drilling — components read from the store directly.

### Key Types (`frontend/src/types/index.ts`)
`TokenRoute` contains `expertData: { layer, experts: number[][], weights: number[][] } | null`. The `experts` and `weights` arrays are per-layer, each containing a list of selected expert IDs and their normalized routing weights.

## Important Constraints

- **MLX must run on the main thread.** Do not use `asyncio.run_in_executor` or threading for model inference — MLX operations are not thread-safe.
- **Top-p sampling requires index remapping.** `mx.random.categorical` returns an index into the sorted probability array, not a vocabulary token ID. Must use `mx.argsort` + `mx.take_along_axis` to map back.
- **Strict TypeScript.** `tsconfig.json` has `noUnusedLocals` and `noUnusedParameters` enabled — unused imports cause build failures.
- **Python style:** line-length 100, target Python 3.11.
- **Model auto-downloads** from Hugging Face (`mlx-community/OLMoE-1B-7B-0125-Instruct-4bit`) on first backend start. Requires ~3.5GB RAM.
