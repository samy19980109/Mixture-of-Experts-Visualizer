import { create } from 'zustand';
import type { 
  TokenRoute, 
  ExpertActivation, 
  ModelInfo, 
  MemoryStats, 
  InferenceConfig,
  VisualizationView 
} from '@/types';

interface AppState {
  // Model state
  modelInfo: ModelInfo | null;
  isModelLoaded: boolean;
  
  // Inference state
  isGenerating: boolean;
  generatedText: string;
  tokenRoutes: TokenRoute[];
  
  // Expert state
  expertActivations: Map<number, ExpertActivation>;
  
  // System state
  memoryStats: MemoryStats | null;
  
  // UI state
  currentView: VisualizationView;
  config: InferenceConfig;
  isConnected: boolean;
  darkMode: boolean;

  // Actions
  setModelInfo: (info: ModelInfo) => void;
  setModelLoaded: (loaded: boolean) => void;
  startGeneration: () => void;
  stopGeneration: () => void;
  addToken: (token: TokenRoute) => void;
  clearTokens: () => void;
  updateExpertActivation: (expertId: number, activation: Partial<ExpertActivation>) => void;
  setMemoryStats: (stats: MemoryStats) => void;
  setCurrentView: (view: VisualizationView) => void;
  updateConfig: (config: Partial<InferenceConfig>) => void;
  setIsConnected: (connected: boolean) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  modelInfo: null,
  isModelLoaded: false,
  isGenerating: false,
  generatedText: '',
  tokenRoutes: [],
  expertActivations: new Map(),
  memoryStats: null,
  currentView: 'heatmap',
  isConnected: false,
  darkMode: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  config: {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 100,
  },

  // Actions
  setModelInfo: (info) => set({ modelInfo: info }),
  setModelLoaded: (loaded) => set({ isModelLoaded: loaded }),
  
  startGeneration: () => set({ 
    isGenerating: true, 
    generatedText: '', 
    tokenRoutes: [],
    expertActivations: new Map()
  }),
  
  stopGeneration: () => set({ isGenerating: false }),
  
  addToken: (token) => set((state) => ({
    tokenRoutes: [...state.tokenRoutes, token],
    generatedText: state.generatedText + token.token,
  })),
  
  clearTokens: () => set({ 
    generatedText: '', 
    tokenRoutes: [],
    expertActivations: new Map()
  }),
  
  updateExpertActivation: (expertId, activation) => set((state) => {
    const newMap = new Map(state.expertActivations);
    const existing = newMap.get(expertId) || {
      expertId,
      count: 0,
      avgWeight: 0,
      lastActivated: Date.now(),
    };
    newMap.set(expertId, { ...existing, ...activation });
    return { expertActivations: newMap };
  }),
  
  setMemoryStats: (stats) => set({ memoryStats: stats }),
  setCurrentView: (view) => set({ currentView: view }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  updateConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),
  toggleDarkMode: () => set((state) => {
    const next = !state.darkMode;
    document.documentElement.classList.toggle('dark', next);
    return { darkMode: next };
  }),
}));
