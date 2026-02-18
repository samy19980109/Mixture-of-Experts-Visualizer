import { useStore } from '@/store/useStore';
import { HardDrive } from 'lucide-react';

export function MemoryUsage() {
  const { memoryStats } = useStore();

  // Check if memoryStats has the required properties
  const hasMemoryStats = memoryStats && 
    typeof memoryStats.processRssMb === 'number' && 
    typeof memoryStats.systemPercent === 'number';

  if (!hasMemoryStats) {
    return (
      <div className="bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2 mb-3">
          <HardDrive className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium">Memory Usage</h3>
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const processPercent = (memoryStats.processRssMb / memoryStats.systemTotalMb) * 100;

  return (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-medium">Memory Usage</h3>
      </div>

      <div className="space-y-4">
        {/* Process Memory */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Process</span>
            <span className="font-medium">{memoryStats.processRssMb.toFixed(0)} MB</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(processPercent * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* System Memory */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">System</span>
            <span className="font-medium">{memoryStats.systemPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                memoryStats.systemPercent > 80 ? 'bg-destructive' : 'bg-green-500'
              }`}
              style={{ width: `${memoryStats.systemPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {memoryStats.systemAvailableMb.toFixed(0)} MB available of {memoryStats.systemTotalMb.toFixed(0)} MB
          </p>
        </div>
      </div>
    </div>
  );
}
