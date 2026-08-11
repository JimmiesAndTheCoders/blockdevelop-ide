import * as Blockly from 'blockly/core';

export const BLOCKDEVELOP_DARK_PALETTE = {
  bg: '#181818',
  panel: '#1f1f1f',
  header: '#2d2d2d',
  border: '#3c3c3c',
  text: '#e0e0e0',
  accent: '#007acc',
  selection: '#094771',
  logic: '#007acc',
  math: '#8a2be2',
  textCategory: '#10b981',
  variables: '#ea8220',
  functions: '#e11d48',
  events: '#06b6d4',
  target: '#f59e0b',
} as const;

export function createBlockDevelopDarkTheme(): Blockly.Theme {
  return Blockly.Theme.defineTheme('blockdevelop-dark', {
    name: 'blockdevelop-dark',
    base: Blockly.Themes.Classic,
    blockStyles: {
      logic_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.logic },
      math_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.math },
      text_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.textCategory },
      variable_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.variables },
      procedure_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.functions },
      event_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.events },
      target_blocks: { colourPrimary: BLOCKDEVELOP_DARK_PALETTE.target },
    },
    categoryStyles: {
      logic_category: { colour: BLOCKDEVELOP_DARK_PALETTE.logic },
      math_category: { colour: BLOCKDEVELOP_DARK_PALETTE.math },
      text_category: { colour: BLOCKDEVELOP_DARK_PALETTE.textCategory },
      variable_category: { colour: BLOCKDEVELOP_DARK_PALETTE.variables },
      procedure_category: { colour: BLOCKDEVELOP_DARK_PALETTE.functions },
      event_category: { colour: BLOCKDEVELOP_DARK_PALETTE.events },
      target_category: { colour: BLOCKDEVELOP_DARK_PALETTE.target },
    },
    componentStyles: {
      workspaceBackgroundColour: BLOCKDEVELOP_DARK_PALETTE.bg,
      toolboxBackgroundColour: BLOCKDEVELOP_DARK_PALETTE.panel,
      toolboxForegroundColour: BLOCKDEVELOP_DARK_PALETTE.text,
      flyoutBackgroundColour: BLOCKDEVELOP_DARK_PALETTE.panel,
      flyoutForegroundColour: BLOCKDEVELOP_DARK_PALETTE.text,
      flyoutOpacity: 0.95,
      scrollbarColour: '#797979',
      scrollbarOpacity: 0.4,
      insertionMarkerColour: BLOCKDEVELOP_DARK_PALETTE.accent,
      insertionMarkerOpacity: 0.3,
      cursorColour: BLOCKDEVELOP_DARK_PALETTE.accent,
    },
  });
}
