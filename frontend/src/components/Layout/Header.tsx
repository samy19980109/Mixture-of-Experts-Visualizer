import { Brain, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Header() {
  const { memoryStats, isConnected } = useStore();

  // Check if memoryStats has the required properties
  const hasMemoryStats = memoryStats &&
    typeof memoryStats.processRssMb === 'number' &&
    typeof memoryStats.systemPercent === 'number';

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">MoE Router Visualizer</h1>
            <p className="text-xs text-muted-foreground">OLMoE-1B-7B-0125-Instruct-4bit</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {hasMemoryStats && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Memory:</span>
                <span className="font-medium">
                  {memoryStats.processRssMb.toFixed(0)} MB
                </span>
                <span className="text-muted-foreground">
                  ({memoryStats.systemPercent.toFixed(1)}% system)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
