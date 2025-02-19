const { widget } = figma;
const { AutoLayout, Input } = widget;
import { useTheme } from '../utils/theme';
import { CardHeader } from './CardHeader';
import { Note } from '../types';
import type { InputEvent } from '../types';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  index: number;
  total: number;
}

export const NoteCard = ({ 
  note, 
  onUpdate, 
  onDelete,
  onMoveUp,
  onMoveDown,
  index, 
  total 
}: NoteCardProps): AutoLayout => {
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
        title: note.title || "Untitled Note",
        onDelete: () => onDelete(note.id),
        onMoveUp: () => onMoveUp(note.id),
        onMoveDown: () => onMoveDown(note.id),
        isFirst: index === 0,
        isLast: index === total - 1
      }),
      // Content
      new Input({
        placeholder: "Add your note here...",
        value: note.content,
        onTextEditEnd: (e: InputEvent) => {
          onUpdate(note.id, { content: e.characters });
        },
        fontSize: 12,
        fill: theme.text.primary,
        width: 'fill-parent',
        inputFrameProps: {
          fill: theme.background,
          padding: 8,
          cornerRadius: 4,
          stroke: theme.border
        }
      })
    ]
  });
}; 