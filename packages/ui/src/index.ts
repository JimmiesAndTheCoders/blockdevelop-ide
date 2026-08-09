export const UI_THEMES = ['dark', 'light', 'high-contrast', 'system'] as const;
export type UITheme = (typeof UI_THEMES)[number];

export * from './theme/ThemeProvider';
export * from './theme/themeUtils';
export * from './components/Icon/Icon';
export * from './components/Icon/StatusIcon';
export * from './components/Button/Button';
export * from './components/Input/TextInput';
export * from './components/Input/SearchInput';
export * from './components/Input/NumberInput';
export * from './components/Select/Select';
export * from './components/Toggle/Checkbox';
export * from './components/Toggle/Switch';
export * from './components/Badge/Badge';
export * from './components/Tooltip/Tooltip';
export * from './hooks/useIDEEvent';
