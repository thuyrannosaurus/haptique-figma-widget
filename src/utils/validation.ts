const URL_PATTERNS = [
  { pattern: /^https:\/\/www\.figma\.com\/file\//, label: 'Figma File' },
  { pattern: /^https:\/\/www\.figma\.com\/proto\//, label: 'Figma Prototype' },
  { pattern: /^https:\/\/www\.youtube\.com\//, label: 'YouTube' },
  { pattern: /^https:\/\/github\.com\//, label: 'GitHub' }
];

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

export function getUrlType(url: string): string {
  const match = URL_PATTERNS.find(p => p.pattern.test(url));
  return match ? match.label : 'Website';
} 