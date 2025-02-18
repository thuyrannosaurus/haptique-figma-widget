import { widget } from '@figma/widget-typings';
const { 
  AutoLayout,
  Text,
  Input,
  useSyncedState, 
  usePropertyMenu,
} = widget;

import type { 
  HapticSpec,
  PropertyMenuEvent,
  Note,
  PrototypeLink,
  VersionedState
} from './types';

import {
  generateSwiftUICode,
  generateUIKitCode,
  usePersistentState,
  useTheme,
} from './utils';

import {
  CodeSnippet,
  NoteCard,
  PrototypeLinkCard,
} from './components';

// Initial state
const defaultState: HapticSpec = {
  trigger: 'long-press',
  hapticType: 'success',
  accentColor: '#7F00FF',
  hasSwiftUI: false,
  hasUIKit: false,
  notes: [],
  prototypeLinks: []
};

function HapticWidget() {
  const [widgetId] = useSyncedState('widgetId', `widget-${Date.now()}`);
  const [spec, setSpec] = usePersistentState<HapticSpec>(widgetId, defaultState);
  const theme = useTheme();

  // Move functions
  const moveNote = (id: string, direction: 'up' | 'down') => {
    const index = spec.notes.findIndex(note => note.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= spec.notes.length) return;

    const newNotes = [...spec.notes];
    [newNotes[index], newNotes[newIndex]] = [newNotes[newIndex], newNotes[index]];
    
    const updatedNotes = newNotes.map((note, idx) => ({
      ...note,
      position: idx
    }));

    setSpec({ ...spec, notes: updatedNotes });
  };

  const movePrototypeLink = (id: string, direction: 'up' | 'down') => {
    const index = spec.prototypeLinks.findIndex(link => link.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= spec.prototypeLinks.length) return;

    const newLinks = [...spec.prototypeLinks];
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    
    const updatedLinks = newLinks.map((link, idx) => ({
      ...link,
      position: idx
    }));

    setSpec({ ...spec, prototypeLinks: updatedLinks });
  };

  // Property menu
  usePropertyMenu([
    {
      itemType: 'dropdown',
      propertyName: 'trigger',
      tooltip: 'Select trigger type',
      selectedOption: spec.trigger,
      options: [
        { option: 'long-press', label: 'Long-Press' },
        { option: 'tap', label: 'Tap' },
        { option: 'touch-down', label: 'Touch Down' },
        { option: 'touch-up', label: 'Touch Up' },
        { option: 'pan', label: 'Pan' },
        { option: 'scroll', label: 'Scroll' },
        { option: 'timer', label: 'Timer' }
      ]
    },
    {
      itemType: 'dropdown',
      propertyName: 'hapticType',
      tooltip: 'Select haptic type',
      selectedOption: spec.hapticType,
      options: [
        { option: 'success', label: 'Success' },
        { option: 'warning', label: 'Warning' },
        { option: 'error', label: 'Error' },
        { option: 'light', label: 'Light' },
        { option: 'medium', label: 'Medium' },
        { option: 'heavy', label: 'Heavy' },
        { option: 'rigid', label: 'Rigid' },
        { option: 'soft', label: 'Soft' },
        { option: 'selection', label: 'Selection' }
      ]
    },
    {
      itemType: 'color',
      propertyName: 'accentColor',
      tooltip: 'Choose accent color',
      value: spec.accentColor
    }
  ], (event: PropertyMenuEvent) => {
    setSpec({ ...spec, [event.propertyName]: event.propertyValue });
  });

  // Main widget layout
  return new AutoLayout({
    direction: 'vertical',
    spacing: 16,
    padding: 16,
    cornerRadius: 8,
    fill: theme.background,
    width: 'fill-parent',
    children: [
      // Trigger section
      new AutoLayout({
        spacing: 8,
        padding: 4,
        children: [
          new Text({
            text: "When the user",
            fontSize: 16,
            fill: theme.text.primary
          }),
          new Text({
            text: spec.trigger,
            fontSize: 16,
            fill: theme.text.primary
          })
        ]
      }),
      
      // Haptic section
      new AutoLayout({
        spacing: 8,
        padding: 4,
        children: [
          new Text({
            text: "Then trigger the",
            fontSize: 16,
            fill: theme.text.primary
          }),
          new Text({
            text: spec.hapticType,
            fontSize: 16,
            fill: theme.text.primary
          }),
          new Text({
            text: "vibration",
            fontSize: 16,
            fill: theme.text.primary
          })
        ]
      }),

      // SwiftUI Code Snippet (if enabled)
      spec.hasSwiftUI && CodeSnippet({
        title: 'SwiftUI Code',
        code: generateSwiftUICode(spec.trigger, spec.hapticType)
      }),

      // UIKit Code Snippet (if enabled)
      spec.hasUIKit && CodeSnippet({
        title: 'UIKit Code',
        code: generateUIKitCode(spec.trigger, spec.hapticType)
      }),

      // Notes section
      ...spec.notes.map((note, index) => 
        NoteCard({
          note,
          onUpdate: (id, updates) => setSpec({
            ...spec,
            notes: spec.notes.map(n => n.id === id ? { ...n, ...updates } : n)
          }),
          onDelete: id => setSpec({
            ...spec,
            notes: spec.notes.filter(n => n.id !== id)
          }),
          onMoveUp: () => moveNote(note.id, 'up'),
          onMoveDown: () => moveNote(note.id, 'down'),
          index,
          total: spec.notes.length
        })
      ),

      // Prototype Links section
      ...spec.prototypeLinks.map((link, index) => 
        PrototypeLinkCard({
          link,
          onUpdate: (id, updates) => setSpec({
            ...spec,
            prototypeLinks: spec.prototypeLinks.map(l => l.id === id ? { ...l, ...updates } : l)
          }),
          onDelete: id => setSpec({
            ...spec,
            prototypeLinks: spec.prototypeLinks.filter(l => l.id !== id)
          }),
          onMoveUp: () => movePrototypeLink(link.id, 'up'),
          onMoveDown: () => movePrototypeLink(link.id, 'down'),
          index,
          total: spec.prototypeLinks.length
        })
      ),

      // Action buttons
      new AutoLayout({
        direction: 'horizontal',
        spacing: 8,
        children: [
          // SwiftUI Button
          new AutoLayout({
            padding: { vertical: 8, horizontal: 16 },
            fill: spec.hasSwiftUI ? theme.surface : theme.background,
            stroke: theme.border,
            cornerRadius: 6,
            onClick: () => setSpec({ ...spec, hasSwiftUI: !spec.hasSwiftUI }),
            children: [
              new Text({
                text: "SwiftUI",
                fontSize: 14,
                fill: spec.hasSwiftUI ? theme.text.disabled : theme.text.primary
              })
            ]
          }),
          // UIKit Button
          new AutoLayout({
            padding: { vertical: 8, horizontal: 16 },
            fill: spec.hasUIKit ? theme.surface : theme.background,
            stroke: theme.border,
            cornerRadius: 6,
            onClick: () => setSpec({ ...spec, hasUIKit: !spec.hasUIKit }),
            children: [
              new Text({
                text: "UIKit",
                fontSize: 14,
                fill: spec.hasUIKit ? theme.text.disabled : theme.text.primary
              })
            ]
          }),
          // Notes Button
          new AutoLayout({
            padding: { vertical: 8, horizontal: 16 },
            fill: theme.background,
            stroke: theme.border,
            cornerRadius: 6,
            onClick: () => {
              const newNote: Note = {
                id: `note-${Date.now()}`,
                title: '',
                content: '',
                position: spec.notes.length
              };
              setSpec({ ...spec, notes: [...spec.notes, newNote] });
            },
            children: [
              new Text({
                text: "Add Note",
                fontSize: 14,
                fill: theme.text.primary
              })
            ]
          }),
          // Prototype Link Button
          new AutoLayout({
            padding: { vertical: 8, horizontal: 16 },
            fill: theme.background,
            stroke: theme.border,
            cornerRadius: 6,
            onClick: () => {
              const newLink: PrototypeLink = {
                id: `link-${Date.now()}`,
                title: '',
                url: '',
                position: spec.prototypeLinks.length
              };
              setSpec({ ...spec, prototypeLinks: [...spec.prototypeLinks, newLink] });
            },
            children: [
              new Text({
                text: "Add Link",
                fontSize: 14,
                fill: theme.text.primary
              })
            ]
          })
        ]
      })
    ].filter(Boolean)
  });
}

figma.widget.register(HapticWidget);