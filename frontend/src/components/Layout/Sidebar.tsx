import type { ElementType } from 'react';
import { useStore } from '@/store/useStore';
import { Activity, Layers, BarChart3, Cpu } from 'lucide-react';
import type { VisualizationView } from '@/types';

const views: { id: VisualizationView; label: string; icon: ElementType }[] = [
  { id: 'heatmap', label: 'Expert Heatmap', icon: Activity },
  { id: 'wafer', label: 'Wafer View', icon: Cpu },
  { id: 'tokens', label: 'Token Flow', icon: Layers },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
];

export function Sidebar() {
  const { currentView, setCurrentView } = useStore();

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-64px)]">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Visualizations
        </h3>
        <nav className="space-y-1">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === view.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {view.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
