import { useRef } from 'react';
import { useStore } from '@/store/useStore';

export function TokenFlow() {
  const { tokenRoutes } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="space-y-4 max-h-96 overflow-y-auto">
      <h3 className="text-sm font-medium">Token Generation Flow</h3>
      
      <div className="space-y-2">
        {tokenRoutes.map((route, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-xs text-muted-foreground w-8">#{index + 1}</span>
            
            <div className="flex-1">
              <span className="font-medium text-lg">"{route.token}"</span>
            </div>

            <div className="flex gap-1">
              {route.expertData?.experts?.[0]?.slice(0, 4).map((expertId: number, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded bg-primary/10 text-primary"
                  title={`Expert ${expertId}`}
                >
                  E{expertId}
                </span>
              ))}
              {(route.expertData?.experts?.[0]?.length || 0) > 4 && (
                <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  +{(route.expertData?.experts?.[0]?.length || 0) - 4}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {tokenRoutes.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No tokens generated yet. Start inference to see the token flow.
        </p>
      )}
    </div>
  );
}
