import * as Blockly from 'blockly/core';
import { IDE_DESIGN_TOKENS, BLOCKDEVELOP_DARK_PALETTE } from './tokens';

export * from './tokens';
export * from './grid';

/**
 * Instantiates the High-Contrast `blockdevelop-dark` Blockly Theme instance.
 */
export function createBlockDevelopDarkTheme(): Blockly.Theme {
  return Blockly.Theme.defineTheme('blockdevelop-dark', {
    name: 'blockdevelop-dark',
    base: Blockly.Themes.Classic,
    blockStyles: {
      structure_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.structure,
        colourSecondary: '#0891b2',
        colourTertiary: '#0e7490',
        hat: 'cap',
      },
      type_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.types,
        colourSecondary: '#d97706',
        colourTertiary: '#b45309',
      },
      logic_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.logic,
        colourSecondary: '#005999',
        colourTertiary: '#003e6b',
      },
      loop_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.loops,
        colourSecondary: '#005999',
        colourTertiary: '#003e6b',
      },
      branch_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.branch,
        colourSecondary: '#0369a1',
        colourTertiary: '#075985',
      },
      exception_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.exception,
        colourSecondary: '#b91c1c',
        colourTertiary: '#991b1b',
      },
      collection_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.collections,
        colourSecondary: '#7c3aed',
        colourTertiary: '#6d28d9',
      },
      math_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.math,
        colourSecondary: '#6b21a8',
        colourTertiary: '#4c1d95',
      },
      text_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.textCategory,
        colourSecondary: '#047857',
        colourTertiary: '#065f46',
      },
      variable_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.variables,
        colourSecondary: '#c2410c',
        colourTertiary: '#9a3412',
      },
      procedure_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.functions,
        colourSecondary: '#be123c',
        colourTertiary: '#9f1239',
      },
      event_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.events,
        colourSecondary: '#0e7490',
        colourTertiary: '#155e75',
        hat: 'cap',
      },
      target_blocks: {
        colourPrimary: BLOCKDEVELOP_DARK_PALETTE.target,
        colourSecondary: '#d97706',
        colourTertiary: '#b45309',
      },
    },
    categoryStyles: {
      structure_category: { colour: BLOCKDEVELOP_DARK_PALETTE.structure },
      type_category: { colour: BLOCKDEVELOP_DARK_PALETTE.types },
      logic_category: { colour: BLOCKDEVELOP_DARK_PALETTE.logic },
      loop_category: { colour: BLOCKDEVELOP_DARK_PALETTE.loops },
      branch_category: { colour: BLOCKDEVELOP_DARK_PALETTE.branch },
      exception_category: { colour: BLOCKDEVELOP_DARK_PALETTE.exception },
      collection_category: { colour: BLOCKDEVELOP_DARK_PALETTE.collections },
      math_category: { colour: BLOCKDEVELOP_DARK_PALETTE.math },
      text_category: { colour: BLOCKDEVELOP_DARK_PALETTE.textCategory },
      variable_category: { colour: BLOCKDEVELOP_DARK_PALETTE.variables },
      procedure_category: { colour: BLOCKDEVELOP_DARK_PALETTE.functions },
      event_category: { colour: BLOCKDEVELOP_DARK_PALETTE.events },
      target_category: { colour: BLOCKDEVELOP_DARK_PALETTE.target },
    },
    componentStyles: {
      workspaceBackgroundColour: IDE_DESIGN_TOKENS.workspaceBg,
      toolboxBackgroundColour: IDE_DESIGN_TOKENS.panelBg,
      toolboxForegroundColour: IDE_DESIGN_TOKENS.textPrimary,
      flyoutBackgroundColour: IDE_DESIGN_TOKENS.panelBg,
      flyoutForegroundColour: IDE_DESIGN_TOKENS.textPrimary,
      flyoutOpacity: 0.95,
      scrollbarColour: IDE_DESIGN_TOKENS.gridBorder,
      scrollbarOpacity: 0.6,
      insertionMarkerColour: IDE_DESIGN_TOKENS.accentBlue,
      insertionMarkerOpacity: 0.45,
      markerColour: IDE_DESIGN_TOKENS.accentBlue,
      cursorColour: IDE_DESIGN_TOKENS.accentBlue,
      selectedGlowColour: IDE_DESIGN_TOKENS.accentBlue,
      selectedGlowOpacity: 0.85,
      replacementGlowColour: IDE_DESIGN_TOKENS.haxeOrange,
      replacementGlowOpacity: 0.85,
    },
    fontStyle: {
      family: 'JetBrains Mono, Consolas, monospace',
      size: 12,
    },
  });
}
