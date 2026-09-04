import type * as Blockly from 'blockly/core';
import { IDE_DESIGN_TOKENS } from './tokens';

export type GridDisplayMode = 'dots' | 'lines' | 'hidden';

export interface IDEGridOptions {
  spacing?: number;
  length?: number;
  colour?: string;
  snap?: boolean;
  mode?: GridDisplayMode;
}

/**
 * Standard Default IDE Grid Configuration.
 */
export const DEFAULT_IDE_GRID_CONFIG = {
  spacing: 20,
  length: 3,
  colour: IDE_DESIGN_TOKENS.gridBorder,
  snap: true,
  mode: 'dots' as GridDisplayMode,
} as const;

export const DEFAULT_WORKSPACE_GRID_OPTIONS = DEFAULT_IDE_GRID_CONFIG;

/**
 * Merges custom grid settings with baseline dark grid defaults.
 * Returns a strongly-typed GridOptions object matching Blockly specifications.
 */
export function createIDEGridConfig(
  options?: IDEGridOptions,
): NonNullable<Blockly.BlocklyOptions['grid']> {
  const spacing = options?.spacing ?? DEFAULT_IDE_GRID_CONFIG.spacing;
  const mode = options?.mode ?? DEFAULT_IDE_GRID_CONFIG.mode;

  let length = options?.length ?? DEFAULT_IDE_GRID_CONFIG.length;
  let colour = options?.colour ?? DEFAULT_IDE_GRID_CONFIG.colour;

  if (mode === 'lines') {
    length = spacing;
  } else if (mode === 'hidden') {
    colour = 'transparent';
  }

  return {
    spacing,
    length,
    colour,
    snap: options?.snap ?? DEFAULT_IDE_GRID_CONFIG.snap,
  };
}

/**
 * Dynamically updates grid spacing, display mode (dots/lines/hidden), or snap-to-grid alignment on an active Blockly workspace.
 */
export function updateWorkspaceGrid(
  workspace: Blockly.WorkspaceSvg,
  options: Partial<IDEGridOptions>,
): void {
  if (options.snap !== undefined && workspace.options) {
    const opts = workspace.options as unknown as { gridOptions?: { snap?: boolean } };
    if (opts.gridOptions) {
      opts.gridOptions.snap = options.snap;
    }
  }

  const grid = workspace.getGrid();
  if (grid) {
    if (options.spacing !== undefined && options.spacing > 0) {
      grid.setSpacing(options.spacing);
    }
  }
}
