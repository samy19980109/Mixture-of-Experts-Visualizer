export interface ExpertData {
  layer: number;
  experts: number[][];
  weights: number[][];
}

export interface TokenRoute {
  tokenId: number;
  token: string;
  expertData: ExpertData | null;
  index: number;
  timestamp: number;
}

export interface ExpertActivation {
  expertId: number;
  count: number;
  avgWeight: number;
  lastActivated: number;
}

export interface ModelInfo {
  name: string;
  totalParams: string;
  activeParams: string;
  numExperts: number;
  expertsPerToken: number;
  quantization: string;
  contextWindow: number;
}

export interface MemoryStats {
  processRssMb: number;
  processVmsMb: number;
  systemTotalMb: number;
  systemAvailableMb: number;
  systemPercent: number;
}

export interface InferenceConfig {
  temperature: number;
  topP: number;
  maxTokens: number;
}

export interface WebSocketMessage {
  type: 'connected' | 'token' | 'complete' | 'error' | 'memory_update' | 'pong';
  data?: TokenRoute | MemoryStats | any;
  clientId?: string;
  result?: string;
  totalTokens?: number;
  message?: string;
}

export type VisualizationView = 'heatmap' | 'wafer' | 'tokens' | 'metrics';
