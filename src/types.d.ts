import { 
  AutoLayout,
  Text,
  Input,
  useSyncedState, 
  usePropertyMenu,
} from '@figma/widget-typings';

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
    // ... rest of your layout code ...
  });
}

figma.widget.register(HapticWidget);