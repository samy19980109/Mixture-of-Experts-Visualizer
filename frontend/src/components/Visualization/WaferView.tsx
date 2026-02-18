import { useMemo } from 'react';
import { useStore } from '@/store/useStore';

const WAFER_SIZE = 8; // 8x8 tiles
const TILES_PER_WAFER = WAFER_SIZE * WAFER_SIZE;
const EXPERTS_PER_TILE = 8; // 8 experts per tile

export function WaferView() {
  const { tokenRoutes } = useStore();

  // Calculate expert activations per tile
  const tileData = useMemo(() => {
    const tileActivations = new Array(TILES_PER_WAFER).fill(0).map(() => ({
      count: 0,
      experts: new Set<number>(),
    }));

    tokenRoutes.forEach((route) => {
      if (route.expertData?.experts) {
        route.expertData.experts.forEach((expertList: number[]) => {
          expertList.forEach((expertId) => {
            const tileId = Math.floor(expertId / EXPERTS_PER_TILE);
            if (tileId < TILES_PER_WAFER) {
              tileActivations[tileId].count++;
              tileActivations[tileId].experts.add(expertId);
            }
          });
        });
      }
    });

    return tileActivations;
  }, [tokenRoutes]);

  const maxCount = Math.max(...tileData.map((d) => d.count), 1);

  const getTileColor = (count: number) => {
    if (count === 0) return '#1a1a2e';
    const intensity = Math.min(count / maxCount, 1);
    // Heat gradient from dark blue to red
    const r = Math.floor(26 + (239 - 26) * intensity);
    const g = Math.floor(26 + (68 - 26) * intensity);
    const b = Math.floor(46 + (68 - 46) * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Cerebras-Style Wafer Topology</h3>
          <p className="text-xs text-muted-foreground">
            {WAFER_SIZE}×{WAFER_SIZE} tiles • {TILES_PER_WAFER} tiles • {TILES_PER_WAFER * EXPERTS_PER_TILE} experts
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Idle</span>
          <div className="w-24 h-2 bg-gradient-to-r from-[#1a1a2e] via-[#4a4a8e] to-[#ef4444] rounded" />
          <span>Hot</span>
        </div>
      </div>

      <div className="relative">
        {/* Wafer container with rounded corners */}
        <div 
          className="relative rounded-full overflow-hidden bg-[#0a0a1a] p-8"
          style={{ aspectRatio: '1' }}
        >
          {/* Grid of tiles */}
          <div 
            className="grid gap-1 h-full"
            style={{ 
              gridTemplateColumns: `repeat(${WAFER_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${WAFER_SIZE}, 1fr)`,
            }}
          >
            {tileData.map((tile, index) => (
              <div
                key={index}
                className="relative rounded-sm overflow-hidden cursor-pointer group"
                style={{ backgroundColor: getTileColor(tile.count) }}
                title={`Tile ${index}: ${tile.count} activations, ${tile.experts.size} unique experts`}
              >
                {/* Tile ID */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                  <span className="text-xs text-white font-medium">{index}</span>
                </div>
                
                {/* Expert count indicator */}
                {tile.count > 0 && (
                  <div className="absolute bottom-1 right-1 text-[10px] text-white/70">
                    {tile.experts.size}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics overlay */}
        <div className="absolute top-4 left-4 bg-black/70 rounded p-3 text-xs text-white">
          <div className="space-y-1">
            <div>Active Tiles: {tileData.filter(t => t.count > 0).length}/{TILES_PER_WAFER}</div>
            <div>Max Activations: {maxCount}</div>
            <div>Load Balance: {((tileData.filter(t => t.count > 0).length / TILES_PER_WAFER) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-muted rounded p-3">
          <div className="font-medium mb-2">Tile Structure</div>
          <div className="text-muted-foreground space-y-1">
            <div>• Each tile: {EXPERTS_PER_TILE} experts</div>
            <div>• Total tiles: {TILES_PER_WAFER}</div>
            <div>• Wafer layout: {WAFER_SIZE}×{WAFER_SIZE}</div>
          </div>
        </div>
        <div className="bg-muted rounded p-3">
          <div className="font-medium mb-2">Hotspots</div>
          <div className="text-muted-foreground space-y-1">
            <div>• Red: High utilization</div>
            <div>• Blue: Medium utilization</div>
            <div>• Dark: Idle</div>
          </div>
        </div>
      </div>
    </div>
  );
}
