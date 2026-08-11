/**
 * Baseline Panel Node Identifiers
 */
export const PANEL_IDS = {
  EXPLORER: 'explorer',
  TOOLBOX: 'block-toolbox',
  EDITOR: 'editor-main',
  TERMINAL: 'terminal-panel',
  PROBLEMS: 'problems-panel',
  PROPERTIES: 'properties-panel',
} as const;

export type PanelId = (typeof PANEL_IDS)[keyof typeof PANEL_IDS];

/**
 * Component keys mapped by PanelRegistry
 */
export const COMPONENT_KEYS = {
  EXPLORER: 'explorer',
  TOOLBOX: 'toolbox',
  EDITOR: 'editor',
  TERMINAL: 'terminal',
  PROBLEMS: 'problems',
  PROPERTIES: 'properties',
} as const;

export type ComponentKey = (typeof COMPONENT_KEYS)[keyof typeof COMPONENT_KEYS];
