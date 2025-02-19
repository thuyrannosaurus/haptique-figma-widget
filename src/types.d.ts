// Export all types
export type TriggerType = 'long-press' | 'tap' | 'touch-down' | 'touch-up' | 'pan' | 'scroll' | 'timer';
export type HapticType = 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'selection';

// Message types
export interface UIMessage {
  type: 'copy-success' | 'copy-error';
  error?: string;
}

export interface InputEvent {
  characters: string;
}

export interface ClickEvent {
  type: 'CLICK';
  point: { x: number; y: number };
}

export interface PropertyMenuEvent {
  propertyName: string;
  propertyValue: string;
}

export interface PropertyMenuItem {
  itemType: 'action' | 'color' | 'dropdown';
  propertyName: string;
  tooltip: string;
  value?: string | { r: number; g: number; b: number; a: number };
  selectedOption?: string;
  options?: Array<{ option: string; label: string }>;
}

// Data models
export interface ReorderableItem {
  id: string;
  position: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  position: number;
}

export interface PrototypeLink {
  id: string;
  title: string;
  url: string;
  position: number;
}

// State versions
export interface HapticSpecV1 {
  trigger: TriggerType;
  hapticType: HapticType;
  accentColor: string;
  hasSwiftUI: boolean;
  hasUIKit: boolean;
  notes: Array<{ id: string; content: string }>;
  prototypeLinks: Array<{ id: string; url: string }>;
}

export interface HapticSpecV2 {
  trigger: TriggerType;
  hapticType: HapticType;
  accentColor: string;
  hasSwiftUI: boolean;
  hasUIKit: boolean;
  notes: Note[];
  prototypeLinks: PrototypeLink[];
}

export type HapticSpec = HapticSpecV2;

export interface VersionedState<T> {
  version: number;
  data: T;
}

// Widget node types
export type WidgetNode = AutoLayoutNode | FrameNode | TextNode | InputNode;

export interface BaseNode {
  readonly type: string;
  readonly props: Record<string, any>;
}

export interface AutoLayoutNode extends BaseNode {
  type: 'AutoLayout';
  children?: WidgetNode[];
}

export interface FrameNode extends BaseNode {
  type: 'Frame';
  children?: WidgetNode[];
}

export interface TextNode extends BaseNode {
  type: 'Text';
  characters: string;
}

export interface InputNode extends BaseNode {
  type: 'Input';
  characters: string;
}

// Global augmentations
declare global {
  interface Window {
    open: (url: string, target: string) => void;
  }

  interface Console {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  }

  const console: Console;
  const window: Window;

  const figma: {
    widget: {
      h: any;
      register: (component: () => WidgetNode) => void;
      AutoLayout: typeof AutoLayout;
      Text: typeof Text;
      Input: typeof Input;
      useSyncedState: <T>(key: string, initial: T) => [T, (value: T) => void];
      usePropertyMenu: (items: PropertyMenuItem[], callback: (event: PropertyMenuEvent) => void) => void;
    };
    root: {
      getPluginData: (key: string) => string;
      setPluginData: (key: string, value: string) => void;
    };
    notify: (message: string) => void;
    showUI: (html: string, options: { visible: boolean }) => void;
    ui: {
      postMessage: (message: any) => void;
      onmessage: ((msg: UIMessage) => void) | null;
      close: () => void;
    };
    mode: 'light' | 'dark';
  };

  interface AutoLayoutProps {
    name?: string;
    effect?: {
      type: "drop-shadow";
      color: { r: number; g: number; b: number; a: number };
      offset: { x: number; y: number };
      blur: number;
    };
    direction?: "vertical" | "horizontal";
    spacing?: number;
    padding?: number;
    cornerRadius?: number;
    fill?: string;
    width?: number | "fill-parent";
    children?: WidgetNode[];
  }

  interface TextProps {
    name?: string;
    characters: string;
    fontSize: number;
    fill?: string;
    width?: number | "fill-parent";
  }
}

// This is needed to make this a module
export {};

export interface ComponentProps {
  // Base props that all components share
  width?: number | 'fill-parent' | 'hug-contents';
  height?: number | 'fill-parent' | 'hug-contents';
  x?: number;
  y?: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
}

export interface AutoLayoutProps extends ComponentProps {
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  padding?: number | { horizontal?: number; vertical?: number };
  stroke?: string | null;
  cornerRadius?: number;
  fill?: string | null;
} 