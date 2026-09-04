import type * as Blockly from 'blockly/core';

/**
 * Field argument types accepted in Blockly block JSON definitions.
 */
export type BlockArgumentType =
  | 'input_value'
  | 'input_statement'
  | 'input_dummy'
  | 'field_input'
  | 'field_number'
  | 'field_dropdown'
  | 'field_checkbox'
  | 'field_colour'
  | 'field_variable'
  | 'field_image';

export interface BlockArgument {
  type: BlockArgumentType;
  name: string;
  check?: string | string[] | undefined;
  text?: string | undefined;
  value?: unknown;
  options?: [string, string][] | undefined;
  src?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  alt?: string | undefined;
  variable?: string | undefined;
  variableTypes?: string[] | undefined;
  defaultType?: string | undefined;
  [key: string]: unknown;
}

/**
 * Declarative JSON Schema for defining custom Blockly blocks.
 */
export interface CustomBlockDefinition {
  type: string;
  message0: string;
  args0?: BlockArgument[] | undefined;
  message1?: string | undefined;
  args1?: BlockArgument[] | undefined;
  message2?: string | undefined;
  args2?: BlockArgument[] | undefined;
  message3?: string | undefined;
  args3?: BlockArgument[] | undefined;
  message4?: string | undefined;
  args4?: BlockArgument[] | undefined;
  output?: string | string[] | null | undefined;
  previousStatement?: string | string[] | null | undefined;
  nextStatement?: string | string[] | null | undefined;
  style?: string | undefined;
  colour?: string | number | undefined;
  tooltip?: string | undefined;
  helpUrl?: string | undefined;
  inputsInline?: boolean | undefined;
  mutator?: string | undefined;
  extensions?: string[] | undefined;
  [key: string]: unknown;
}

/**
 * Toolbox Category item specification.
 */
export interface ToolboxCategorySpec {
  kind: 'category' | 'sep';
  id?: string | undefined;
  name?: string | undefined;
  colour?: string | undefined;
  categorystyle?: string | undefined;
  icon?: string | undefined;
  custom?: string | undefined;
  contents?: (ToolboxBlockSpec | ToolboxCategorySpec | ToolboxSeparatorSpec)[] | undefined;
}

export interface ToolboxBlockSpec {
  kind: 'block';
  type: string;
  id?: string | undefined;
  disabled?: boolean | undefined;
  inputs?: Record<string, { block?: ToolboxBlockSpec; shadow?: ToolboxBlockSpec }> | undefined;
  fields?: Record<string, unknown> | undefined;
}

export interface ToolboxSeparatorSpec {
  kind: 'sep';
  gap?: number | undefined;
}

export interface ToolboxDefinition {
  kind: 'categoryToolbox';
  contents: ToolboxCategorySpec[];
}

/**
 * High-Contrast Dark Theme Specification for BlockDevelop IDE.
 */
export interface IDEBlockThemeConfig {
  name: string;
  base: 'classic' | 'modern' | 'high_contrast';
  blockStyles: Record<string, Blockly.Theme.BlockStyle>;
  categoryStyles: Record<string, Blockly.Theme.CategoryStyle>;
  componentStyles: Record<string, unknown>;
  fontStyle?:
    | {
        family?: string | undefined;
        weight?: string | undefined;
        size?: number | undefined;
      }
    | undefined;
}

/**
 * Custom Context Menu Action Item.
 */
export interface CustomBlockContextMenuOption {
  text: string;
  enabled: boolean;
  callback: (scope: Blockly.ContextMenuRegistry.Scope) => void;
  weight?: number | undefined;
  id: string;
}

/**
 * Serialized JSON format for Blockly workspace state persistence.
 */
export interface SerializedWorkspaceState {
  version: string;
  blocks?:
    | {
        languageVersion: number;
        blocks: Record<string, unknown>[];
      }
    | undefined;
  variables?:
    | {
        name: string;
        id: string;
        type?: string | undefined;
      }[]
    | undefined;
}

/**
 * Typed configuration wrapper for initializing Blockly instances.
 */
export interface IDEWorkspaceOptions extends Blockly.BlocklyOptions {
  themeName?: string | undefined;
  enableMinimap?: boolean | undefined;
  enableSoundEffects?: boolean | undefined;
  gridSnapSpacing?: number | undefined;
}
