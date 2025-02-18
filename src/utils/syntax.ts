interface CodePart {
  text: string;
  fill: string;
}

const KEYWORDS = ['let', 'var', 'func', 'return'] as const;
const TYPES = [
  'UIImpactFeedbackGenerator',
  'UINotificationFeedbackGenerator',
  'UISelectionFeedbackGenerator'
] as const;

export function highlightCode(code: string): CodePart[] {
  return code.split('\n').map(line => {
    const parts: CodePart[] = [];
    
    // Split the line into tokens
    const tokens = line.split(/([^a-zA-Z0-9_.])/g).filter(Boolean);
    
    tokens.forEach(token => {
      if (KEYWORDS.includes(token as typeof KEYWORDS[number])) {
        parts.push({ text: token, fill: '#C41A16' }); // Red for keywords
      } else if (TYPES.includes(token as typeof TYPES[number])) {
        parts.push({ text: token, fill: '#643820' }); // Brown for types
      } else if (token.startsWith('.')) {
        parts.push({ text: token, fill: '#326D74' }); // Teal for properties
      } else if (token.match(/^[0-9]+$/)) {
        parts.push({ text: token, fill: '#1C00CF' }); // Blue for numbers
      } else if (token.match(/^[A-Z][a-zA-Z0-9]*$/)) {
        parts.push({ text: token, fill: '#643820' }); // Brown for types
      } else {
        parts.push({ text: token, fill: '#000000' }); // Black for everything else
      }
    });
    
    return parts;
  }).flat();
} 