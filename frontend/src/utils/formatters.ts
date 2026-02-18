/**
 * Data formatting utilities
 */

export function formatToken(token: string): string {
  // Escape HTML and control characters
  return token
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return value.toFixed(decimals) + '%';
}

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return ms.toFixed(0) + 'ms';
  }
  return (ms / 1000).toFixed(2) + 's';
}
