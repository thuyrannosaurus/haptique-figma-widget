const { widget } = figma;
const { AutoLayout, Text } = widget;
import { useTheme } from '../utils/theme';

interface UrlSuggestionsProps {
  onSelect: (url: string) => void;
}

const SUGGESTIONS = [
  { url: 'https://www.figma.com/file/...', label: 'Figma File' },
  { url: 'https://www.figma.com/proto/...', label: 'Figma Prototype' },
  { url: 'https://github.com/...', label: 'GitHub Repository' }
] as const;

export const UrlSuggestions = ({ onSelect }: UrlSuggestionsProps): AutoLayout => {
  const theme = useTheme();
  
  return new AutoLayout({
    direction: 'vertical',
    spacing: 4,
    padding: 8,
    fill: theme.surface,
    cornerRadius: 4,
    width: 'fill-parent',
    children: [
      figma.widget.h(Text, {
        characters: "Suggested formats:",
        fontSize: 10,
        fill: theme.text.secondary
      }),
      new AutoLayout({
        direction: 'vertical',
        spacing: 4,
        children: SUGGESTIONS.map(suggestion => 
          new AutoLayout({
            padding: { vertical: 4, horizontal: 8 },
            cornerRadius: 4,
            hoverStyle: { fill: theme.surfaceHover },
            onClick: () => onSelect(suggestion.url),
            children: [
              figma.widget.h(Text, {
                characters: suggestion.label,
                fontSize: 10,
                fill: theme.text.secondary
              })
            ]
          })
        )
      })
    ]
  });
}; 