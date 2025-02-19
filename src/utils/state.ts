import type { 
  HapticSpec, 
  HapticSpecV1, 
  HapticSpecV2, 
  VersionedState,
  Note,
  PrototypeLink,
  TriggerType,
  HapticType
} from '../types';

import { defaultState } from '../constants';

const CURRENT_VERSION = 2;

function migrateV1ToV2(v1: HapticSpecV1): HapticSpecV2 {
  return {
    ...v1,
    notes: v1.notes.map((note, index) => ({
      ...note,
      title: '',
      position: index
    })),
    prototypeLinks: v1.prototypeLinks.map((link, index) => ({
      ...link,
      title: '',
      position: index
    }))
  };
}

export function migrateState(savedState: string): HapticSpec {
  try {
    const parsed = JSON.parse(savedState);
    
    if (!parsed.version) {
      // Convert to v1 first
      const v1Data = parsed as unknown as HapticSpecV1;
      return migrateV1ToV2(v1Data);
    }

    const versionedState = parsed as VersionedState<HapticSpecV1 | HapticSpecV2>;
    
    switch (versionedState.version) {
      case 1:
        return migrateV1ToV2(versionedState.data as HapticSpecV1);
      case 2:
        return versionedState.data as HapticSpecV2;
      default:
        console.warn(`Unknown version ${versionedState.version}, using current version`);
        return defaultState;
    }
  } catch (error) {
    console.warn('Failed to migrate state:', error);
    return defaultState;
  }
}

export function usePersistentState<T extends HapticSpec>(
  id: string, 
  initialState: T
): [T, (value: T) => void] {
  const storageKey = `haptic-widget-${id}`;
  return figma.widget.useSyncedState<T>(storageKey, initialState);
} 