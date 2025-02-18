import type { HapticSpec } from './types';

export const defaultState: HapticSpec = {
  trigger: 'long-press',
  hapticType: 'success',
  accentColor: '#7F00FF',
  hasSwiftUI: false,
  hasUIKit: false,
  notes: [],
  prototypeLinks: []
};

export const CURRENT_VERSION = 2;

export const URL_PATTERNS = [
  { pattern: /^https:\/\/www\.figma\.com\/file\//, label: 'Figma File' },
  { pattern: /^https:\/\/www\.figma\.com\/proto\//, label: 'Figma Prototype' },
  { pattern: /^https:\/\/www\.youtube\.com\//, label: 'YouTube' },
  { pattern: /^https:\/\/github\.com\//, label: 'GitHub' }
] as const;

export const COPY_HTML = `<script>
window.onmessage = async (event) => {
  if (event.data.pluginMessage.type === 'copy') {
    try {
      await navigator.clipboard.writeText(event.data.pluginMessage.text);
      parent.postMessage({ pluginMessage: { type: 'copy-success' } }, '*');
    } catch (err) {
      parent.postMessage({ pluginMessage: { type: 'copy-error', error: err.message } }, '*');
    }
  }
};
</script>`; 