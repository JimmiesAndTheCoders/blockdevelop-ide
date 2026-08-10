/**
 * @blockdevelop/ui
 * Design System, Theme Engine, Atomic UI Primitives, and Workspace Components.
 */

// Theme Engine & Utilities
export * from './theme/ThemeProvider';
export * from './theme/themeUtils';

// FlexLayout CSS Path Constant
export const FLEXLAYOUT_THEME_PATH = '@blockdevelop/ui/flexlayout-theme.css';

// Atomic UI Components
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
export * from './components/Modal/Modal';
export * from './components/ContextMenu/ContextMenu';
export * from './components/ContextMenu/useContextMenu';

// Specialized IDE Workspace Primitives
export * from './components/Panel/PanelHeader';
export * from './components/Panel/PanelSection';
export * from './components/Tabs/TabItem';
export * from './components/Tabs/TabBar';
export * from './components/Progress/ProgressBar';
export * from './components/Progress/Spinner';
export * from './components/Kbd/Kbd';

// Hooks
export * from './hooks/useIDEEvent';

// Theme Constants & Types
export const UI_THEMES = ['dark', 'light', 'high-contrast', 'system'] as const;
export type UITheme = (typeof UI_THEMES)[number];
