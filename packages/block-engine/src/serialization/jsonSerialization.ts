import * as Blockly from 'blockly/core';
import type { SerializedWorkspaceState } from '../types';
import { validateWorkspaceJson } from './validation';

export interface DeserializationOptions {
  clearWorkspace?: boolean;
  clearUndoStack?: boolean;
}

/**
 * Serializes a Blockly workspace to a strongly-typed JSON object.
 */
export function serializeWorkspaceToJson(
  workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
): SerializedWorkspaceState {
  const jsonState = Blockly.serialization.workspaces.save(workspace);
  return {
    version: '1.0.0',
    blocks: jsonState.blocks as unknown as SerializedWorkspaceState['blocks'],
    variables: jsonState.variables as unknown as SerializedWorkspaceState['variables'],
  };
}

/**
 * Serializes a Blockly workspace to a formatted JSON string.
 */
export function serializeWorkspaceToJsonString(
  workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
  pretty = true,
): string {
  const jsonState = serializeWorkspaceToJson(workspace);
  return pretty ? JSON.stringify(jsonState, null, 2) : JSON.stringify(jsonState);
}

/**
 * Deserializes a JSON workspace object into a Blockly workspace with validation and error recovery.
 */
export function deserializeWorkspaceFromJson(
  workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
  state: SerializedWorkspaceState,
  options: DeserializationOptions = {},
): boolean {
  const { clearWorkspace = true, clearUndoStack = true } = options;

  const validation = validateWorkspaceJson(state);
  if (!validation.valid) {
    console.warn('[Serialization Engine] Invalid workspace JSON schema:', validation.errors);
    return false;
  }

  try {
    if (clearWorkspace) {
      workspace.clear();
    }

    if (state.blocks || state.variables) {
      Blockly.serialization.workspaces.load(state as unknown as Record<string, unknown>, workspace);
    }

    if (clearUndoStack) {
      workspace.clearUndo();
    }

    return true;
  } catch (err) {
    console.error('[Serialization Engine] Failed to deserialize workspace JSON:', err);
    return false;
  }
}

/**
 * Deserializes a JSON string into a Blockly workspace with graceful fallback on error.
 */
export function deserializeWorkspaceFromJsonString(
  workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
  jsonString: string,
  options: DeserializationOptions = {},
): boolean {
  if (!jsonString || !jsonString.trim()) {
    if (options.clearWorkspace !== false) {
      workspace.clear();
    }
    return true;
  }

  try {
    const parsed = JSON.parse(jsonString) as SerializedWorkspaceState;
    return deserializeWorkspaceFromJson(workspace, parsed, options);
  } catch (err) {
    console.error('[Serialization Engine] JSON string parse error:', err);
    return false;
  }
}
