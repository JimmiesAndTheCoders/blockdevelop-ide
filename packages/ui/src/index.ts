/**
 * @blockdevelop/ui
 * Reusable UI components, themes, hooks, and dockable panel primitives.
 */

export const UI_THEMES = ['dark', 'light', 'high-contrast', 'system'] as const;
export type UITheme = (typeof UI_THEMES)[number];

export * from './theme/ThemeProvider';
export * from './theme/themeUtils';
export * from './hooks/useIDEEvent';
