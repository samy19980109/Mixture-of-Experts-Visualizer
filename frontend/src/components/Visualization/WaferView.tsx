import { useMemo } from 'react';
import { useStore } from '@/store/useStore';

const WAFER_SIZE = 8; // 8x8 grid
const NUM_EXPERTS = 64; // 1 expert per tile

export function WaferView() {
  const { tokenRoutes } = useStore();

  // Calculate per-expert (per-tile) activation data
  const tileData = useMemo(() => {
    const tiles = new Array(NUM_EXPERTS).fill(0).map(() => ({
      count: 0,
      totalWeight: 0,
    }));

    tokenRoutes.forEach((route) => {
      if (route.expertData?.experts) {
        route.expertData.experts.forEach((expertList: number[], layerIdx: number) => {
          const weights = route.expertData?.weights?.[layerIdx] || [];
          expertList.forEach((expertId, idx) => {
            if (expertId < NUM_EXPERTS) {
              tiles[expertId].count++;
              tiles[expertId].totalWeight += weights[idx] || 0;
            }
          });
        });
      }
    });

    return tiles;
  }, [tokenRoutes]);

  const maxCount = Math.max(...tileData.map((d) => d.count), 1);

  const getTileColor = (count: number) => {
    if (count === 0) return '#1a1a2e';
    const intensity = Math.min(count / maxCount, 1);
    // Dark blue → orange → red heat gradient
    if (intensity < 0.5) {
      const t = intensity * 2;
      const r = Math.floor(26 + (234 - 26) * t);
      const g = Math.floor(26 + (88 - 26) * t);
      const b = Math.floor(46 + (12 - 46) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (intensity - 0.5) * 2;
      const r = Math.floor(234 + (239 - 234) * t);
      const g = Math.floor(88 + (68 - 88) * t);
      const b = Math.floor(12 + (68 - 12) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const activeTiles = tileData.filter((t) => t.count > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Cerebras-Style Wafer Topology</h3>
          <p className="text-xs text-muted-foreground">
            {WAFER_SIZE}×{WAFER_SIZE} grid • {NUM_EXPERTS} experts • 1 expert per tile
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Idle</span>
          <div
            className="w-32 h-2 rounded"
            style={{ background: 'linear-gradient(to right, #1a1a2e, #ea580c, #ef4444)' }}
          />
          <span>Hot</span>
        </div>
      </div>

      {/* Wafer grid */}
      <div className="relative bg-[#0a0a1a] rounded-2xl p-3">
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${WAFER_SIZE}, 1fr)`,
          }}
        >
          {tileData.map((tile, index) => (
            <div
              key={index}
              className="aspect-square rounded-sm relative cursor-pointer group transition-all hover:ring-1 hover:ring-white/40"
              style={{ backgroundColor: getTileColor(tile.count) }}
              title={`Expert ${index}: ${tile.count} activations, avg weight ${tile.count > 0 ? (tile.totalWeight / tile.count).toFixed(3) : '0'}`}
            >
              {/* Expert ID shown on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-sm">
                <span className="text-[10px] text-white font-medium">E{index}</span>
              </div>

              {/* Expert ID always visible */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-[10px] font-medium ${
                    tile.count > maxCount / 3 ? 'text-white/90' : 'text-white/40'
                  }`}
                >
                  {index}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats overlay */}
        <div className="absolute top-5 left-5 bg-black/80 rounded-lg px-3 py-2 text-[11px] text-white/90 space-y-0.5">
          <div>Active: {activeTiles}/{NUM_EXPERTS}</div>
          <div>Peak: {maxCount}</div>
          <div>Util: {((activeTiles / NUM_EXPERTS) * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 text-xs">
        <div className="bg-muted rounded p-3">
          <div className="font-medium mb-1">Layout</div>
          <div className="text-muted-foreground">
            {WAFER_SIZE}×{WAFER_SIZE} = {NUM_EXPERTS} tiles
          </div>
        </div>
        <div className="bg-muted rounded p-3">
          <div className="font-medium mb-1">Hotspots</div>
          <div className="text-muted-foreground">
            Red/orange = high traffic
          </div>
        </div>
        <div className="bg-muted rounded p-3">
          <div className="font-medium mb-1">Load Balance</div>
          <div className="text-muted-foreground">
            {activeTiles}/{NUM_EXPERTS} tiles active
          </div>
        </div>
      </div>
    </div>
  );
}
