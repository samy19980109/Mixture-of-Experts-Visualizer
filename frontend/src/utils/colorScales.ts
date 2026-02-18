/**
 * Color scales for visualization
 */

export function getHeatmapColor(value: number, max: number): string {
  const normalized = Math.min(value / max, 1);
  
  // Interpolate from light gray to blue
  const r = Math.floor(243 - (243 - 37) * normalized);
  const g = Math.floor(244 - (244 - 99) * normalized);
  const b = Math.floor(246 - (246 - 235) * normalized);
  
  return `rgb(${r}, ${g}, ${b})`;
}

export function getExpertColor(expertId: number): string {
  // Generate distinct colors for experts
  const hue = (expertId * 137) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  }
  if (bytes >= 1024 * 1024) {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  }
  return bytes + ' B';
}
