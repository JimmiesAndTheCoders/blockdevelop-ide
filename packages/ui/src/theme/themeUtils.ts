import { ResolvedTheme } from './ThemeProvider';

export interface IDEThemeVariables {
  bg: string;
  panel: string;
  header: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  selection: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

/**
 * Returns raw hex values for active theme variables, useful for canvas contexts (e.g. Blockly, SVG graphics).
 */
export function getIDEThemeVariables(theme: ResolvedTheme = 'dark'): IDEThemeVariables {
  switch (theme) {
    case 'light':
      return {
        bg: '#f3f3f3',
        panel: '#ffffff',
        header: '#e8e8e8',
        border: '#cccccc',
        text: '#1e1e1e',
        muted: '#616161',
        accent: '#007acc',
        selection: '#add6ff',
        error: '#e53e3e',
        warning: '#dd6b20',
        success: '#38a169',
        info: '#3182ce',
      };
    case 'high-contrast':
      return {
        bg: '#000000',
        panel: '#000000',
        header: '#000000',
        border: '#6fc06d',
        text: '#ffffff',
        muted: '#ffff00',
        accent: '#f38518',
        selection: '#1a85ff',
        error: '#ff0000',
        warning: '#ffaa00',
        success: '#00ff00',
        info: '#00ffff',
      };
    case 'dark':
    default:
      return {
        bg: '#181818',
        panel: '#1f1f1f',
        header: '#2d2d2d',
        border: '#3c3c3c',
        text: '#e0e0e0',
        muted: '#858585',
        accent: '#007acc',
        selection: '#094771',
        error: '#f87171',
        warning: '#fbbf24',
        success: '#34d399',
        info: '#60a5fa',
      };
  }
}
