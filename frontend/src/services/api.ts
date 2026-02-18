import axios from 'axios';
import type { ModelInfo, MemoryStats } from '@/types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<{ status: string; model_loaded: boolean }> {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  },

  async getModelInfo(): Promise<ModelInfo> {
    const response = await axios.get(`${API_BASE}/model/info`);
    const d = response.data;
    return {
      name: d.name,
      totalParams: d.total_params,
      activeParams: d.active_params,
      numExperts: d.num_experts,
      expertsPerToken: d.experts_per_token,
      quantization: d.quantization,
      contextWindow: d.context_window,
    };
  },

  async getMemory(): Promise<MemoryStats> {
    const response = await axios.get(`${API_BASE}/memory`);
    return response.data;
  },

  async getExperts(): Promise<{ experts: any[] }> {
    const response = await axios.get(`${API_BASE}/experts`);
    return response.data;
  },

  async getExpert(expertId: number): Promise<any> {
    const response = await axios.get(`${API_BASE}/experts/${expertId}`);
    return response.data;
  },

  async runInference(prompt: string, maxTokens: number = 100): Promise<any> {
    const response = await axios.post(`${API_BASE}/inference`, null, {
      params: { prompt, max_tokens: maxTokens },
    });
    return response.data;
  },
};
