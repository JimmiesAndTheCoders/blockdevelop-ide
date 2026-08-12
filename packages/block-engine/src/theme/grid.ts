import type * as Blockly from 'blockly/core';
import { IDE_DESIGN_TOKENS } from './tokens';

export interface IDEGridOptions {
  spacing?: number;
  length?: number;
  colour?: string;
  snap?: boolean;
}

/**
 * Standard Default IDE Grid Configuration.
 */
export const DEFAULT_IDE_GRID_CONFIG = {
  spacing: 20,
  length: 3,
  colour: IDE_DESIGN_TOKENS.gridBorder,
  snap: true,
} as const;

// Alias export for workspace grid configuration options
export const DEFAULT_WORKSPACE_GRID_OPTIONS = DEFAULT_IDE_GRID_CONFIG;

/**
 * Merges custom grid settings with baseline dark grid defaults.
 * Returns a strongly-typed GridOptions object matching Blockly specifications.
 */
export function createIDEGridConfig(
  options?: IDEGridOptions
): NonNullable<Blockly.BlocklyOptions['grid']> {
  return {
    spacing: options?.spacing ?? DEFAULT_IDE_GRID_CONFIG.spacing,
    length: options?.length ?? DEFAULT_IDE_GRID_CONFIG.length,
    colour: options?.colour ?? DEFAULT_IDE_GRID_CONFIG.colour,
    snap: options?.snap ?? DEFAULT_IDE_GRID_CONFIG.snap,
  };
}

/**
 * Dynamically updates grid spacing or snap-to-grid alignment on an active Blockly workspace.
 */
export function updateWorkspaceGrid(
  workspace: Blockly.WorkspaceSvg,
  options: Partial<IDEGridOptions>
): void {
  if (options.snap !== undefined && workspace.options) {
    const opts = workspace.options as unknown as { gridOptions?: { snap?: boolean } };
    if (opts.gridOptions) {
      opts.gridOptions.snap = options.snap;
    }
  }

  const grid = workspace.getGrid();
  if (grid && options.spacing !== undefined) {
    grid.setSpacing(options.spacing);
  }
}
