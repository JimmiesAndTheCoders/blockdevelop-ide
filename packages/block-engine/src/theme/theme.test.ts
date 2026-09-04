import { describe, it, expect } from 'vitest';
import {
  createBlockDevelopDarkTheme,
  IDE_DESIGN_TOKENS,
  BLOCKDEVELOP_DARK_PALETTE,
  DEFAULT_IDE_GRID_CONFIG,
} from './index';

describe('BlockDevelop Dark Theme Suite', () => {
  it('should instantiate blockdevelop-dark theme with correct name', () => {
    const theme = createBlockDevelopDarkTheme();
    expect(theme.name).toBe('blockdevelop-dark');
  });

  it('should match IDE design tokens for workspace, flyout, and grid options', () => {
    const theme = createBlockDevelopDarkTheme();
    const componentStyles = theme.componentStyles;

    expect(componentStyles.workspaceBackgroundColour).toBe(IDE_DESIGN_TOKENS.workspaceBg);
    expect(componentStyles.flyoutBackgroundColour).toBe(IDE_DESIGN_TOKENS.panelBg);
    expect(DEFAULT_IDE_GRID_CONFIG.colour).toBe(IDE_DESIGN_TOKENS.gridBorder);
    expect(DEFAULT_IDE_GRID_CONFIG.spacing).toBe(20);
  });

  it('should configure insertion marker, selection glow, and replacement glow component styles', () => {
    const theme = createBlockDevelopDarkTheme();
    const componentStyles = theme.componentStyles;

    expect(componentStyles.insertionMarkerColour).toBe(IDE_DESIGN_TOKENS.accentBlue);
    expect(componentStyles.selectedGlowColour).toBe(IDE_DESIGN_TOKENS.accentBlue);
    expect(componentStyles.replacementGlowColour).toBe(IDE_DESIGN_TOKENS.haxeOrange);
  });

  it('should map standard IDE brand colors across all block and category styles', () => {
    const theme = createBlockDevelopDarkTheme();
    const styles = theme.blockStyles;

    expect(styles.structure_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.structure);
    expect(styles.type_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.types);
    expect(styles.collection_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.collections);
    expect(styles.logic_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.logic);
    expect(styles.math_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.math);
    expect(styles.text_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.textCategory);
    expect(styles.variable_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.variables);
    expect(styles.procedure_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.functions);
    expect(styles.event_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.events);
    expect(styles.target_blocks?.colourPrimary).toBe(BLOCKDEVELOP_DARK_PALETTE.target);
  });
});
