import { useState } from 'react';
import { Send, Square } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface TextInputProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  onStop: () => void;
}

export function TextInput({ onSubmit, isGenerating, onStop }: TextInputProps) {
  const [prompt, setPrompt] = useState('');
  const { config, updateConfig } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 border space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type something to generate text..."
            className="w-full h-32 p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isGenerating}
          />
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Temperature</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
              className="w-full"
              disabled={isGenerating}
            />
            <span className="text-xs text-muted-foreground">{config.temperature}</span>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Top-p</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) => updateConfig({ topP: parseFloat(e.target.value) })}
              className="w-full"
              disabled={isGenerating}
            />
            <span className="text-xs text-muted-foreground">{config.topP}</span>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Max Tokens</label>
            <input
              type="number"
              min="1"
              max="1024"
              value={config.maxTokens}
              onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
              className="w-full px-2 py-1 rounded border text-sm"
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="flex justify-end">
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Generate
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
