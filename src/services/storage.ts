/**
 * Storage service abstraction.
 * Desktop: wired to Node.js fs via platform adapter
 * Mobile (future): SQLite or device document directory
 * Web/Preview: in-memory via Zustand (no persistence)
 */

export function exportAsText(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
