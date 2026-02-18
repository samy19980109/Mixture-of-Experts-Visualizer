import { useMemo } from 'react';
import { useStore } from '@/store/useStore';

const NUM_EXPERTS = 64;
const GRID_SIZE = 8; // 8x8 grid

export function ExpertHeatmap() {
  const { tokenRoutes } = useStore();

  // Calculate expert activation counts
  const expertData = useMemo(() => {
    const counts = new Array(NUM_EXPERTS).fill(0);
    const totalWeight = new Array(NUM_EXPERTS).fill(0);

    tokenRoutes.forEach((route) => {
      if (route.expertData?.experts) {
        route.expertData.experts.forEach((expertList: number[], layerIdx: number) => {
          const weights = route.expertData?.weights?.[layerIdx] || [];
          expertList.forEach((expertId, idx) => {
            counts[expertId]++;
            totalWeight[expertId] += weights[idx] || 0;
          });
        });
      }
    });

    return counts.map((count, i) => ({
      expertId: i,
      count,
      avgWeight: count > 0 ? totalWeight[i] / count : 0,
    }));
  }, [tokenRoutes]);

  // Find max count for color scaling
  const maxCount = Math.max(...expertData.map((d) => d.count), 1);

  // Generate color based on activation count
  const getColor = (count: number) => {
    if (count === 0) return '#f3f4f6';
    const intensity = Math.min(count / maxCount, 1);
    // Blue gradient from light to dark
    const r = Math.floor(59 + (37 - 59) * intensity);
    const g = Math.floor(130 + (99 - 130) * intensity);
    const b = Math.floor(246 + (235 - 246) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Expert Activation Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Low</span>
          <div className="w-24 h-2 bg-gradient-to-r from-gray-100 to-blue-600 rounded" />
          <span>High</span>
        </div>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {expertData.map((expert) => (
          <div
            key={expert.expertId}
            className="aspect-square rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:ring-2 hover:ring-primary transition-all"
            style={{ backgroundColor: getColor(expert.count) }}
            title={`Expert ${expert.expertId}: ${expert.count} activations`}
          >
            <span className={expert.count > maxCount / 2 ? 'text-white' : 'text-gray-700'}>
              {expert.expertId}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Total Activations:</span>{' '}
          {expertData.reduce((sum, d) => sum + d.count, 0)}
        </div>
        <div>
          <span className="font-medium">Active Experts:</span>{' '}
          {expertData.filter((d) => d.count > 0).length} / {NUM_EXPERTS}
        </div>
        <div>
          <span className="font-medium">Most Active:</span>{' '}
          Expert {expertData.reduce((max, d) => (d.count > max.count ? d : max), expertData[0])?.expertId}
        </div>
        <div>
          <span className="font-medium">Load Balance:</span>{' '}
          {((1 - expertData.filter(d => d.count > 0).length / NUM_EXPERTS) * 100).toFixed(1)}% utilized
        </div>
      </div>
    </div>
  );
}
