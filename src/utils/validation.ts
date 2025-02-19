import type { Note, PrototypeLink, TriggerType, HapticType } from '../types';

const URL_PATTERNS = [
  { pattern: /^https:\/\/www\.figma\.com\/file\//, label: 'Figma File' },
  { pattern: /^https:\/\/www\.figma\.com\/proto\//, label: 'Figma Prototype' },
  { pattern: /^https:\/\/www\.youtube\.com\//, label: 'YouTube' },
  { pattern: /^https:\/\/github\.com\//, label: 'GitHub' }
];

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const parsedUrl = new URL(url);
    // Check for minimum URL requirements
    return Boolean(
      parsedUrl.protocol && 
      parsedUrl.host && 
      parsedUrl.host.includes('.')
    );
  } catch {
    return false;
  }
}

export function formatUrl(url: string): string {
  if (!url) return '';
  
  try {
    const trimmedUrl = url.trim();
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
  } catch (error) {
    console.error('Error formatting URL:', error);
    return url;
  }
}

export function getUrlType(url: string): string {
  if (!url || !isValidUrl(url)) {
    return 'Invalid URL';
  }
  
  try {
    const match = URL_PATTERNS.find(p => p.pattern.test(url));
    return match ? match.label : 'Website';
  } catch (error) {
    console.error('Error getting URL type:', error);
    return 'Website';
  }
}

export function isTriggerType(value: unknown): value is TriggerType {
  if (typeof value !== 'string') return false;
  
  return ['long-press', 'tap', 'touch-down', 'touch-up', 'pan', 'scroll', 'timer']
    .includes(value as TriggerType);
}

export function isHapticType(value: unknown): value is HapticType {
  if (typeof value !== 'string') return false;
  
  return ['success', 'warning', 'error', 'light', 'medium', 'heavy', 'rigid', 'soft', 'selection']
    .includes(value as HapticType);
}

export function isNote(value: unknown): value is Note {
  if (!value || typeof value !== 'object') return false;
  
  const note = value as Note;
  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.position === 'number'
  );
}

export function isPrototypeLink(value: unknown): value is PrototypeLink {
  if (!value || typeof value !== 'object') return false;
  
  const link = value as PrototypeLink;
  return (
    typeof link.id === 'string' &&
    typeof link.title === 'string' &&
    typeof link.url === 'string' &&
    typeof link.position === 'number'
  );
} 