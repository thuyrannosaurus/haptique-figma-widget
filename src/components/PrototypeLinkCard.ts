const { widget } = figma;
const { AutoLayout, Input, Text } = widget;
import { useTheme } from '../utils/theme';
import { CardHeader } from './CardHeader';
import { PrototypeLink } from '../types';
import { isValidUrl, formatUrl, getUrlType } from '../utils/validation';
import { UrlSuggestions } from './UrlSuggestions';

interface PrototypeLinkCardProps {
  link: PrototypeLink;
  onUpdate: (id: string, updates: Partial<PrototypeLink>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  index: number;
  total: number;
}

interface InputEvent {
  characters: string;
}

interface ClickEvent {
  type: 'CLICK';
  point: { x: number; y: number };
}

export const PrototypeLinkCard = ({ 
  link, 
  onUpdate, 
  onDelete,
  onMoveUp,
  onMoveDown,
  index, 
  total 
}: PrototypeLinkCardProps): AutoLayout => {
  const theme = useTheme();
  
  return new AutoLayout({
    direction: 'vertical',
    spacing: 8,
    padding: 16,
    fill: theme.surface,
    stroke: theme.border,
    cornerRadius: 8,
    width: 'fill-parent',
    effect: {
      type: 'drop-shadow',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 2 },
      blur: 4,
      spread: 0,
      visible: true
    },
    children: [
      CardHeader({
        title: link.title || "Untitled Link",
        onDelete: () => onDelete(link.id),
        onMoveUp: () => onMoveUp(link.id),
        onMoveDown: () => onMoveDown(link.id),
        isFirst: index === 0,
        isLast: index === total - 1
      }),
      // URL Input
      new AutoLayout({
        width: 'fill-parent',
        spacing: 8,
        direction: 'vertical',
        children: [
          // URL Input with type indicator
          new AutoLayout({
            width: 'fill-parent',
            spacing: 8,
            children: [
              new Input({
                placeholder: "https://...",
                value: link.url,
                onTextEditEnd: (e: InputEvent) => {
                  const formattedUrl = formatUrl(e.characters);
                  if (isValidUrl(formattedUrl)) {
                    onUpdate(link.id, { url: formattedUrl });
                  } else {
                    figma.notify('Please enter a valid URL');
                  }
                },
                fontSize: 12,
                fill: theme.text.primary,
                width: 'fill-parent',
                inputFrameProps: {
                  fill: theme.background,
                  padding: 8,
                  cornerRadius: 4,
                  stroke: isValidUrl(link.url) ? theme.border : '#FF3B30'
                }
              }),
              // URL Type Badge
              link.url && isValidUrl(link.url) && new AutoLayout({
                padding: { vertical: 2, horizontal: 6 },
                fill: '#EEEEFF',
                cornerRadius: 4,
                children: [
                  figma.widget.h(Text, {
                    characters: getUrlType(link.url),
                    fontSize: 10,
                    fill: theme.text.secondary
                  })
                ]
              }),
              // Open button
              new AutoLayout({
                padding: { vertical: 4, horizontal: 8 },
                fill: isValidUrl(link.url) ? '#FFFFFF' : '#E8E8E8',
                stroke: theme.border,
                cornerRadius: 4,
                opacity: isValidUrl(link.url) ? 1 : 0.5,
                onClick: () => {
                  if (isValidUrl(link.url)) {
                    figma.notify('Opening link in browser...');
                    window.open(link.url, '_blank');
                  }
                },
                children: [
                  figma.widget.h(Text, {
                    characters: "Open",
                    fontSize: 12,
                    fill: isValidUrl(link.url) ? '#000000' : theme.text.disabled
                  })
                ]
              })
            ]
          }),
          // Show suggestions only when URL is empty or invalid
          (!link.url || !isValidUrl(link.url)) && UrlSuggestions({
            onSelect: (url) => onUpdate(link.id, { url })
          })
        ]
      })
    ]
  });
}; 