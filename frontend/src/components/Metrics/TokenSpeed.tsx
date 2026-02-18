import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Zap } from 'lucide-react';

export function TokenSpeed() {
  const { tokenRoutes, isGenerating } = useStore();

  // Calculate tokens per second
  const stats = useMemo(() => {
    if (tokenRoutes.length < 2) {
      return { tps: 0, totalTime: 0, avgTimePerToken: 0 };
    }

    const firstToken = tokenRoutes[0].timestamp;
    const lastToken = tokenRoutes[tokenRoutes.length - 1].timestamp;
    const totalTime = lastToken - firstToken;
    const tps = totalTime > 0 ? (tokenRoutes.length / totalTime) * 1000 : 0;

    return {
      tps,
      totalTime: totalTime / 1000, // Convert to seconds
      avgTimePerToken: totalTime / tokenRoutes.length,
    };
  }, [tokenRoutes]);

  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-yellow-500" />
        <h3 className="font-medium">Token Generation Speed</h3>
      </div>

      <div className="space-y-4">
        {/* Tokens per second */}
        <div className="text-center">
          <div className="text-3xl font-bold">
            {isGenerating ? (
              <span className="animate-pulse">{stats.tps.toFixed(1)}</span>
            ) : (
              stats.tps.toFixed(1)
            )}
          </div>
          <div className="text-sm text-muted-foreground">tokens/second</div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-muted rounded p-2">
            <div className="text-muted-foreground">Total Tokens</div>
            <div className="font-medium text-lg">{tokenRoutes.length}</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="text-muted-foreground">Total Time</div>
            <div className="font-medium text-lg">{stats.totalTime.toFixed(2)}s</div>
          </div>
        </div>

        {/* Progress indicator */}
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Generating tokens...
          </div>
        )}
      </div>
    </div>
  );
}
