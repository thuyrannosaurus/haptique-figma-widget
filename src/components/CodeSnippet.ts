const { widget } = figma;
const { AutoLayout, Text } = widget;
import { useTheme } from '../utils/theme';
import { highlightCode } from '../utils/syntax';
import { COPY_HTML } from '../constants';

interface CodeSnippetProps {
  code: string;
  title: string;
}

export const CodeSnippet = ({ code, title }: CodeSnippetProps): AutoLayout => {
  const theme = useTheme();
  const highlightedCode = highlightCode(code);
  
  return new AutoLayout({
    direction: 'vertical',
    spacing: 8,
    padding: 16,
    fill: theme.code.background,
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
      // Header with title and copy button
      new AutoLayout({
        width: 'fill-parent',
        spacing: 8,
        verticalAlignItems: 'center',
        children: [
          figma.widget.h(Text, {
            characters: title,
            fontSize: 14,
            fill: theme.text.primary,
            fontWeight: 600
          }),
          // Copy button
          new AutoLayout({
            padding: { vertical: 4, horizontal: 8 },
            fill: theme.surface,
            stroke: theme.border,
            cornerRadius: 4,
            hoverStyle: {
              fill: theme.surfaceHover
            },
            onClick: () => {
              figma.showUI(COPY_HTML, { visible: false });
              figma.ui.postMessage({ type: 'copy', text: code });
              
              figma.ui.onmessage = (msg) => {
                if (msg.type === 'copy-success') {
                  figma.notify('Code copied to clipboard');
                  figma.ui.close();
                } else if (msg.type === 'copy-error') {
                  figma.notify('Failed to copy code');
                  figma.ui.close();
                }
              };
            },
            children: [
              figma.widget.h(Text, {
                characters: "Copy",
                fontSize: 12,
                fill: theme.text.primary
              })
            ]
          })
        ]
      }),
      // Code block
      new AutoLayout({
        direction: 'vertical',
        spacing: 4,
        padding: 12,
        fill: theme.code.surface,
        stroke: theme.border,
        cornerRadius: 4,
        children: highlightedCode.map(part => 
          figma.widget.h(Text, {
            characters: part.text,
            fontSize: 12,
            fontFamily: 'Source Code Pro',
            fill: part.fill,
            letterSpacing: 0.5
          })
        )
      })
    ]
  });
}; 