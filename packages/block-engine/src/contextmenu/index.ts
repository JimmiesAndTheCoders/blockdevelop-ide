import * as Blockly from 'blockly/core';
import type { ContextMenuItem } from '@blockdevelop/ui';
import { ideEventBus } from '@blockdevelop/core';

export interface BlocklyContextMenuScope {
  block?: Blockly.BlockSvg | undefined;
  workspace?: Blockly.WorkspaceSvg | undefined;
}

export interface IDEContextMenuActions {
  onDuplicate?: ((block: Blockly.BlockSvg) => void) | undefined;
  onToggleDisable?: ((block: Blockly.BlockSvg) => void) | undefined;
  onToggleComment?: ((block: Blockly.BlockSvg) => void) | undefined;
  onToggleCollapse?: ((block: Blockly.BlockSvg) => void) | undefined;
  onCopyJson?: ((block: Blockly.BlockSvg) => void) | undefined;
  onPasteJson?: ((workspace: Blockly.WorkspaceSvg) => void) | undefined;
  onDelete?: ((block: Blockly.BlockSvg) => void) | undefined;
  onJumpToCode?: ((block: Blockly.BlockSvg) => void) | undefined;
  onCleanupWorkspace?: ((workspace: Blockly.WorkspaceSvg) => void) | undefined;
  onResetZoom?: ((workspace: Blockly.WorkspaceSvg) => void) | undefined;
}

/**
 * Builds a comprehensive list of `@blockdevelop/ui` ContextMenuItems for a right-clicked Blockly Block or Workspace.
 */
export function buildIDEContextMenuItems(
  scope: BlocklyContextMenuScope,
  actions?: IDEContextMenuActions,
): ContextMenuItem[] {
  const { block, workspace } = scope;

  // 1. Block Context Menu Items (8 Actions)
  if (block) {
    const isDisabled = !block.isEnabled();
    const isCollapsed = block.isCollapsed();
    const hasComment = Boolean(block.getCommentText());

    return [
      // Action 1: Duplicate Block
      {
        id: 'duplicate',
        label: 'Duplicate Block',
        icon: 'copy',
        shortcut: 'Ctrl+D',
        onClick: () => {
          if (actions?.onDuplicate) {
            actions.onDuplicate(block);
          } else {
            const svgBlock = block as Blockly.BlockSvg;
            if (svgBlock.workspace) {
              const jsonState = Blockly.serialization.blocks.save(svgBlock);
              if (jsonState) {
                Blockly.Events.setGroup(true);
                const newBlock = Blockly.serialization.blocks.append(
                  jsonState,
                  svgBlock.workspace,
                ) as Blockly.BlockSvg;
                if (newBlock) {
                  newBlock.moveBy(20, 20);
                  if (typeof newBlock.select === 'function') {
                    newBlock.select();
                  }
                }
                Blockly.Events.setGroup(false);
              }
            }
          }
        },
      },
      // Action 2: Enable / Disable Block
      {
        id: 'toggle-disable',
        label: isDisabled ? 'Enable Block' : 'Disable Block',
        icon: 'eye-off',
        onClick: () => {
          if (actions?.onToggleDisable) {
            actions.onToggleDisable(block);
          } else {
            block.setEnabled(isDisabled);
          }
        },
      },
      // Action 3: Add / Edit Block Comment
      {
        id: 'toggle-comment',
        label: hasComment ? 'Edit Block Comment' : 'Add Block Comment',
        icon: 'code',
        onClick: () => {
          if (actions?.onToggleComment) {
            actions.onToggleComment(block);
          } else {
            const current = block.getCommentText() || '';
            const updated = prompt('Enter block documentation comment:', current);
            if (updated !== null) {
              block.setCommentText(updated.trim() ? updated.trim() : null);
            }
          }
        },
      },
      // Action 4: Collapse / Expand Block Tree
      {
        id: 'toggle-collapse',
        label: isCollapsed ? 'Expand Block' : 'Collapse Block',
        icon: 'chevron-down',
        onClick: () => {
          if (actions?.onToggleCollapse) {
            actions.onToggleCollapse(block);
          } else {
            block.setCollapsed(!isCollapsed);
          }
        },
      },
      { id: 'div-1', divider: true },
      // Action 5: Copy Block JSON
      {
        id: 'copy-json',
        label: 'Copy Block JSON',
        icon: 'copy',
        onClick: () => {
          if (actions?.onCopyJson) {
            actions.onCopyJson(block);
          } else {
            const jsonState = Blockly.serialization.blocks.save(block);
            if (jsonState && typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(JSON.stringify(jsonState, null, 2)).catch((err) => {
                console.error('[BlockEngine ContextMenu] Clipboard write failed:', err);
              });
            }
          }
        },
      },
      // Action 6: Jump to Generated Code
      {
        id: 'jump-to-code',
        label: 'Jump to Generated Code',
        icon: 'file-code',
        shortcut: 'F12',
        onClick: () => {
          if (actions?.onJumpToCode) {
            actions.onJumpToCode(block);
          } else {
            ideEventBus.emit('block:selected', {
              blockId: block.id,
              blockType: block.type,
            });
            ideEventBus.emit('ui:notify', {
              message: `Navigated to code generated for block '${block.type}' (${block.id})`,
              type: 'info',
            });
          }
        },
      },
      { id: 'div-2', divider: true },
      // Action 7: Delete Block (with Undo support)
      {
        id: 'delete-block',
        label: 'Delete Block',
        icon: 'trash',
        danger: true,
        shortcut: 'Del',
        onClick: () => {
          if (actions?.onDelete) {
            actions.onDelete(block);
          } else {
            Blockly.Events.setGroup(true);
            block.dispose(true);
            Blockly.Events.setGroup(false);
          }
        },
      },
    ];
  }

  // 2. Workspace Canvas Context Menu Items (Includes Action 8: Paste Block JSON)
  if (workspace) {
    return [
      {
        id: 'undo',
        label: 'Undo',
        icon: 'chevron-left',
        shortcut: 'Ctrl+Z',
        onClick: () => workspace.undo(false),
      },
      {
        id: 'redo',
        label: 'Redo',
        icon: 'chevron-right',
        shortcut: 'Ctrl+Y',
        onClick: () => workspace.undo(true),
      },
      { id: 'div-1', divider: true },
      // Action 8: Paste Block JSON into Cursor Workspace Position
      {
        id: 'paste-json',
        label: 'Paste Block JSON',
        icon: 'copy',
        shortcut: 'Ctrl+V',
        onClick: () => {
          if (actions?.onPasteJson) {
            actions.onPasteJson(workspace);
          } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard
              .readText()
              .then((text) => {
                if (!text.trim()) return;
                const jsonState = JSON.parse(text);
                Blockly.Events.setGroup(true);
                const newBlock = Blockly.serialization.blocks.append(
                  jsonState,
                  workspace,
                ) as Blockly.BlockSvg;
                if (newBlock) {
                  newBlock.moveBy(40, 40);
                  if (typeof newBlock.select === 'function') {
                    newBlock.select();
                  }
                }
                Blockly.Events.setGroup(false);
              })
              .catch((err) => {
                console.error('[BlockEngine ContextMenu] Clipboard read failed:', err);
              });
          }
        },
      },
      {
        id: 'cleanup-workspace',
        label: 'Clean Up Blocks',
        icon: 'box',
        onClick: () => {
          if (actions?.onCleanupWorkspace) {
            actions.onCleanupWorkspace(workspace);
          } else {
            workspace.cleanUp();
          }
        },
      },
      { id: 'div-2', divider: true },
      {
        id: 'reset-zoom',
        label: 'Reset Zoom (100%)',
        icon: 'refresh',
        shortcut: 'Ctrl+0',
        onClick: () => {
          if (actions?.onResetZoom) {
            actions.onResetZoom(workspace);
          } else {
            workspace.setScale(1.0);
            workspace.scrollCenter();
          }
        },
      },
    ];
  }

  return [];
}

/**
 * Registers custom IDE context menu options into Blockly's global ContextMenuRegistry.
 */
export function registerCustomContextMenuOptions(): void {
  const registry = Blockly.ContextMenuRegistry.registry;

  const copyJsonOption: Blockly.ContextMenuRegistry.RegistryItem = {
    displayText: () => 'Copy Block as JSON',
    preconditionFn: (scope) => {
      return scope.block ? 'enabled' : 'hidden';
    },
    callback: (scope) => {
      if (!scope.block) return;
      const jsonState = Blockly.serialization.blocks.save(scope.block);
      if (jsonState && typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(JSON.stringify(jsonState, null, 2)).catch((err) => {
          console.error('[BlockEngine ContextMenu] Clipboard write failed:', err);
        });
      }
    },
    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    id: 'blockdevelop_copy_json',
    weight: 100,
  };

  if (!registry.getItem('blockdevelop_copy_json')) {
    registry.register(copyJsonOption);
  }
}
