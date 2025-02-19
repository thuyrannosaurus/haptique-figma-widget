const { widget } = figma;
const { AutoLayout, Text } = widget;
import { useTheme } from '../utils/theme';
import { ThemeColors } from '../utils/theme';

interface CardHeaderProps {
  title: string;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const CardHeader = ({ 
  title, 
  onDelete, 
  onMoveUp, 
  onMoveDown,
  isFirst,
  isLast
}: CardHeaderProps): AutoLayout => {
  const theme = useTheme();
  
  return new AutoLayout({
    width: 'fill-parent',
    spacing: 8,
    verticalAlignItems: 'center',
    children: [
      figma.widget.h(Text, {
        characters: title,
        fontSize: 16,
        fill: theme.text.primary,
        fontWeight: 600
      }),
      // Spacer
      new AutoLayout({
        width: 'fill-parent'
      }),
      // Controls
      new AutoLayout({
        spacing: 4,
        verticalAlignItems: 'center',
        children: [
          // Up arrow
          new AutoLayout({
            padding: 4,
            cornerRadius: 4,
            opacity: isFirst ? 0.3 : 1,
            hoverStyle: isFirst ? undefined : { fill: theme.surfaceHover },
            onClick: isFirst ? undefined : onMoveUp,
            children: [
              figma.widget.h(Text, {
                characters: "↑",
                fontSize: 12,
                fill: theme.text.secondary
              })
            ]
          }),
          // Down arrow
          new AutoLayout({
            padding: 4,
            cornerRadius: 4,
            opacity: isLast ? 0.3 : 1,
            hoverStyle: isLast ? undefined : { fill: theme.surfaceHover },
            onClick: isLast ? undefined : onMoveDown,
            children: [
              figma.widget.h(Text, {
                characters: "↓",
                fontSize: 12,
                fill: theme.text.secondary
              })
            ]
          }),
          // Delete button
          new AutoLayout({
            padding: 4,
            cornerRadius: 4,
            hoverStyle: { fill: '#FFF5F5' },
            onClick: onDelete,
            children: [
              figma.widget.h(Text, {
                characters: "✕",
                fontSize: 12,
                fill: '#FF3B30'
              })
            ]
          })
        ]
      })
    ]
  });
}; 