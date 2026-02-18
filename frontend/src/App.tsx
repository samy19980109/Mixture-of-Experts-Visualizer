import { useStore } from '@/store/useStore';
import { useInference } from '@/hooks/useInference';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { TextInput } from '@/components/Controls/TextInput';
import { ExpertHeatmap } from '@/components/Visualization/ExpertHeatmap';
import { TokenFlow } from '@/components/Visualization/TokenFlow';
import { WaferView } from '@/components/Visualization/WaferView';
import { MemoryUsage } from '@/components/Metrics/MemoryUsage';
import { TokenSpeed } from '@/components/Metrics/TokenSpeed';

function App() {
  const { currentView, modelInfo, isModelLoaded, generatedText, tokenRoutes } = useStore();
  const { isGenerating, runInference, stopInference } = useInference();

  const renderVisualization = () => {
    switch (currentView) {
      case 'heatmap':
        return <ExpertHeatmap />;
      case 'wafer':
        return <WaferView />;
      case 'tokens':
        return <TokenFlow />;
      case 'metrics':
        return (
          <div className="grid grid-cols-2 gap-4">
            <MemoryUsage />
            <TokenSpeed />
          </div>
        );
      default:
        return <ExpertHeatmap />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Model Info */}
            {modelInfo && (
              <div className="bg-card rounded-lg p-4 border">
                <h2 className="text-lg font-semibold mb-2">Model Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{modelInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Parameters:</span>
                    <p className="font-medium">{modelInfo.totalParams} total / {modelInfo.activeParams} active</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Experts:</span>
                    <p className="font-medium">{modelInfo.numExperts} ({modelInfo.expertsPerToken} per token)</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className={`font-medium ${isModelLoaded ? 'text-green-600' : 'text-yellow-600'}`}>
                      {isModelLoaded ? 'Loaded' : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Section */}
            <TextInput 
              onSubmit={runInference}
              isGenerating={isGenerating}
              onStop={stopInference}
            />

            {/* Output Section */}
            {generatedText && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Generated Output</h3>
                <p className="text-sm whitespace-pre-wrap">{generatedText}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {tokenRoutes.length} tokens generated
                </p>
              </div>
            )}

            {/* Visualization Section */}
            {tokenRoutes.length > 0 && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="text-lg font-semibold mb-4">Visualization</h3>
                {renderVisualization()}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
