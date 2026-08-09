export const UI_THEMES = ['dark', 'light', 'high-contrast', 'system'] as const;
export type UITheme = (typeof UI_THEMES)[number];

export * from './theme/ThemeProvider';
export * from './theme/themeUtils';
export * from './components/Icon/Icon';
export * from './components/Icon/StatusIcon';
export * from './hooks/useIDEEvent';
