import { useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { api } from '@/services/api';
import type { WebSocketMessage, TokenRoute } from '@/types';

export function useInference() {
  const {
    isGenerating,
    setModelLoaded,
    setModelInfo,
    startGeneration,
    stopGeneration,
    addToken,
    setMemoryStats,
    setIsConnected,
    config,
  } = useStore();

  const handleConnect = useCallback(() => {
    console.log('WebSocket connected');
    setIsConnected(true);
  }, [setIsConnected]);

  const handleDisconnect = useCallback(() => {
    console.log('WebSocket disconnected');
    setIsConnected(false);
  }, [setIsConnected]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'connected':
        console.log('Connected to inference server');
        break;
      case 'token':
        if (message.data) {
          const raw = message.data;
          const tokenRoute: TokenRoute = {
            tokenId: raw.token_id,
            token: raw.token,
            expertData: raw.expert_data ?? null,
            index: raw.index,
            timestamp: Date.now(),
          };
          addToken(tokenRoute);
        }
        break;
      case 'complete':
        stopGeneration();
        break;
      case 'error':
        console.error('Inference error:', message.message);
        stopGeneration();
        break;
      case 'memory_update':
        if (message.data) {
          const m = message.data;
          setMemoryStats({
            processRssMb: m.process_rss_mb,
            processVmsMb: m.process_vms_mb,
            systemTotalMb: m.system_total_mb,
            systemAvailableMb: m.system_available_mb,
            systemPercent: m.system_percent,
          });
        }
        break;
    }
  }, [addToken, stopGeneration, setMemoryStats]);

  const { send, isConnected } = useWebSocket(handleWebSocketMessage, handleConnect, handleDisconnect);

  // Load model info on mount
  useEffect(() => {
    const loadModelInfo = async () => {
      try {
        const info = await api.getModelInfo();
        setModelInfo(info);
        setModelLoaded(true);
      } catch (error) {
        console.error('Failed to load model info:', error);
        // Retry after 2 seconds
        setTimeout(loadModelInfo, 2000);
      }
    };
    
    loadModelInfo();
  }, [setModelInfo, setModelLoaded]);

  const runInference = useCallback((prompt: string) => {
    if (!isConnected) {
      console.warn('WebSocket not connected, cannot start inference');
      return;
    }
    
    startGeneration();
    send({
      action: 'start_inference',
      prompt,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      top_p: config.topP,
    });
  }, [isConnected, startGeneration, send, config]);

  const stopInference = useCallback(() => {
    send({ action: 'stop_inference' });
    stopGeneration();
  }, [send, stopGeneration]);

  return {
    isGenerating,
    isConnected,
    runInference,
    stopInference,
  };
}

