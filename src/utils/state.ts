import { HapticSpec, HapticSpecV1, HapticSpecV2, VersionedState } from '../types';

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
    const parsed = JSON.parse(savedState) as VersionedState<any>;
    
    if (!parsed.version) {
      const v1Data = parsed as HapticSpecV1;
      return migrateV1ToV2(v1Data);
    }

    switch (parsed.version) {
      case 1:
        return migrateV1ToV2(parsed.data);
      case 2:
        return parsed.data;
      default:
        console.warn(`Unknown version ${parsed.version}, using current version`);
        return defaultState;
    }
  } catch (error) {
    console.warn('Failed to migrate state:', error);
    return defaultState;
  }
}

export function usePersistentState<T>(id: string, initialState: T): [T, (value: T) => void] {
  const storageKey = `haptic-widget-${id}`;
  
  const loadState = (): T => {
    try {
      const savedState = figma.root.getPluginData(storageKey);
      if (!savedState) return initialState;
      
      return migrateState(savedState) as T;
    } catch {
      return initialState;
    }
  };

  const [state, setState] = figma.widget.useSyncedState<T>(storageKey, loadState());

  const setPersistedState = (value: T) => {
    const versionedState: VersionedState<T> = {
      version: CURRENT_VERSION,
      data: value
    };
    
    setState(value);
    try {
      figma.root.setPluginData(storageKey, JSON.stringify(versionedState));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  };

  return [state, setPersistedState];
} 