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
 * Category & Block Style Brand Color Palette for BlockDevelop IDE.
 */
export const BLOCKDEVELOP_DARK_PALETTE = {
  bg: IDE_DESIGN_TOKENS.workspaceBg,
  panel: IDE_DESIGN_TOKENS.panelBg,
  header: IDE_DESIGN_TOKENS.headerBg,
  border: IDE_DESIGN_TOKENS.gridBorder,
  text: IDE_DESIGN_TOKENS.textPrimary,
  accent: IDE_DESIGN_TOKENS.accentBlue,
  selection: IDE_DESIGN_TOKENS.selection,
  structure: '#06B6D4', // Cyan / OOP & Package Wrappers
  types: '#F59E0B', // Amber / Type Annotations
  logic: '#007ACC', // Blue / Control Flow & Conditionals
  loops: '#007ACC', // Blue Gradient / Iteration & Enhanced Loops
  branch: '#0284C7', // Sky Blue / Branching, Switches & Selection
  exception: '#DC2626', // Rose-Red / Try-Catch-Finally & Exceptions
  collections: '#8B5CF6', // Purple / Arrays & 2D Matrices
  math: '#8A2BE2', // Violet / Numerical & Math
  textCategory: '#10B981', // Emerald / Strings & Printing
  variables: '#EA8220', // Haxe Orange / Variables & Memory
  functions: '#E11D48', // Rose / Methods & Calls
  events: '#06B6D4', // Cyan / Event Listeners
  target: '#F59E0B', // Amber / Target Hardware & Platforms
} as const;
