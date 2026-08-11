import * as Blockly from 'blockly/core';

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
