export interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  code: {
    background: string;
    surface: string;
  };
}

const THEMES: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#FFFFFF',
    surface: '#F6F6F6',
    surfaceHover: '#F5F5F5',
    border: '#E8E8E8',
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#888888'
    },
    code: {
      background: '#F6F6F6',
      surface: '#FFFFFF'
    }
  },
  dark: {
    background: '#1E1E1E',
    surface: '#2D2D2D',
    surfaceHover: '#3D3D3D',
    border: '#404040',
    text: {
      primary: '#FFFFFF',
      secondary: '#BBBBBB',
      disabled: '#888888'
    },
    code: {
      background: '#2D2D2D',
      surface: '#1E1E1E'
    }
  }
};

export function useTheme(): ThemeColors {
  const systemTheme = figma.mode as 'light' | 'dark';
  return THEMES[systemTheme];
} 