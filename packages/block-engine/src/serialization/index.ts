import * as Blockly from 'blockly/core';
import type { SerializedWorkspaceState } from '../types';

export function serializeWorkspaceToJson(workspace: Blockly.WorkspaceSvg): SerializedWorkspaceState {
  const jsonState = Blockly.serialization.workspaces.save(workspace);
  return {
    version: '1.0.0',
    blocks: jsonState.blocks as unknown as SerializedWorkspaceState['blocks'],
    variables: jsonState.variables as unknown as SerializedWorkspaceState['variables'],
  };
}

export function deserializeWorkspaceFromJson(
  workspace: Blockly.WorkspaceSvg,
  state: SerializedWorkspaceState
): void {
  workspace.clear();
  if (state.blocks || state.variables) {
    Blockly.serialization.workspaces.load(state as unknown as Record<string, unknown>, workspace);
  }
}

export function serializeWorkspaceToXml(workspace: Blockly.WorkspaceSvg): string {
  const xmlElement = Blockly.Xml.workspaceToDom(workspace);
  return Blockly.Xml.domToPrettyText(xmlElement);
}

export function deserializeWorkspaceFromXml(workspace: Blockly.WorkspaceSvg, xmlText: string): void {
  workspace.clear();
  if (xmlText && xmlText.trim().length > 0) {
    const xmlElement = new DOMParser().parseFromString(xmlText, 'text/xml').documentElement;
    Blockly.Xml.domToWorkspace(xmlElement, workspace);
  }
}
