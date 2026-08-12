/**
 * Core IDE Design Tokens mapped directly to Blockly Component Styles.
 */
export const IDE_DESIGN_TOKENS = {
  workspaceBg: '#181818',
  panelBg: '#1f1f1f',
  headerBg: '#2d2d2d',
  gridBorder: '#3c3c3c',
  textPrimary: '#e0e0e0',
  textMuted: '#858585',
  accentBlue: '#007acc',
  accentBlueHover: '#1e90ff',
  haxeOrange: '#ea8220',
  selection: '#094771',
} as const;

/**
 * Category & Block Style Brand Color Palette.
 */
export const BLOCKDEVELOP_DARK_PALETTE = {
  bg: IDE_DESIGN_TOKENS.workspaceBg,
  panel: IDE_DESIGN_TOKENS.panelBg,
  header: IDE_DESIGN_TOKENS.headerBg,
  border: IDE_DESIGN_TOKENS.gridBorder,
  text: IDE_DESIGN_TOKENS.textPrimary,
  accent: IDE_DESIGN_TOKENS.accentBlue,
  selection: IDE_DESIGN_TOKENS.selection,
  logic: '#007ACC',
  math: '#8A2BE2',
  textCategory: '#10B981',
  variables: '#EA8220',
  functions: '#E11D48',
  events: '#06B6D4',
  target: '#F59E0B',
} as const;
