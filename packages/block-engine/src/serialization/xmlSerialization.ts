import * as Blockly from 'blockly/core';
import { validateWorkspaceXml } from './validation';
import type { DeserializationOptions } from './jsonSerialization';

/**
 * Serializes a Blockly workspace to an XML string.
 */
export function serializeWorkspaceToXml(
  workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
  pretty = true,
): string {
  const xmlElement = Blockly.Xml.workspaceToDom(workspace);
  return pretty ? Blockly.Xml.domToPrettyText(xmlElement) : Blockly.Xml.domToText(xmlElement);
}

/**
 * Deserializes an XML string into a Blockly workspace with validation and error recovery.
 */
export function deserializeWorkspaceFromXml(
  workspace: Blockly.WorkspaceSvg | Blockly.Workspace,
  xmlText: string,
  options: DeserializationOptions = {},
): boolean {
  const { clearWorkspace = true, clearUndoStack = true } = options;

  if (!xmlText || !xmlText.trim()) {
    if (clearWorkspace) {
      workspace.clear();
    }
    return true;
  }

  const validation = validateWorkspaceXml(xmlText);
  if (!validation.valid) {
    console.warn('[Serialization Engine] Invalid workspace XML structure:', validation.errors);
    return false;
  }

  try {
    if (clearWorkspace) {
      workspace.clear();
    }

    let xmlDoc = Blockly.utils.xml.textToDom(xmlText);

    // Unwrap Happy DOM / DOMParser HTML wrapper if present
    if (xmlDoc && xmlDoc.nodeName.toLowerCase() === 'html') {
      const realXmlNode = xmlDoc.querySelector('xml') || xmlDoc.querySelector('block');
      if (realXmlNode) {
        xmlDoc = realXmlNode as Element;
      }
    }

    Blockly.Xml.domToWorkspace(xmlDoc, workspace);

    if (clearUndoStack) {
      workspace.clearUndo();
    }

    return true;
  } catch (err) {
    console.error('[Serialization Engine] Failed to deserialize workspace XML:', err);
    return false;
  }
}
