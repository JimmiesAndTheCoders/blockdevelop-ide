/**
 * @blockdevelop/ui
 * Reusable UI components, themes, hooks, and dockable panel primitives.
 */

export const UI_THEMES = ['dark', 'light', 'high-contrast'] as const;
export type UITheme = typeof UI_THEMES[number];

export * from './hooks/useIDEEvent';
