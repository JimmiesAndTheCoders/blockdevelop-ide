import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { ideEventBus, useUIStore, useEditorStore } from '@blockdevelop/core';
import { registerBlockDefinitions } from './blocks';
import { buildIDEContextMenuItems, registerCustomContextMenuOptions } from './contextmenu';
import {
  createDefaultBlockDocument,
  serializeBlockDocumentToJson,
  deserializeBlockDocumentFromJson,
  type BlockFileDocument,
} from './serialization/blockDocumentSchema';
import {
  serializeWorkspaceToJson,
  deserializeWorkspaceFromJson,
} from './serialization/jsonSerialization';
import {
  validateBlockDocumentDeep,
  computeBlockDocumentChecksum,
  verifyBlockDocumentChecksum,
} from './serialization/documentGuardrails';

describe('Phase 4.2 - Section 8.3: Workspace Integration & Event Bus Test Suite', () => {
  let workspace: Blockly.WorkspaceSvg;
  let container: HTMLDivElement;

  beforeEach(() => {
    registerBlockDefinitions();
    registerCustomContextMenuOptions();
    Blockly.Events.enable();

    useUIStore.setState({ statusMessage: 'Ready' });
    useEditorStore.setState({ tabs: [], activeTabId: 'main.block' });

    // Create SVG workspace in DOM container
    container = document.createElement('div');
    document.body.appendChild(container);
    workspace = Blockly.inject(container, {
      trashcan: true,
    });
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    useUIStore.setState({ statusMessage: 'Ready' });
  });

  // ===========================================================================
  // 1. Full Workspace Serialization to .block File and Restored Canvas
  // ===========================================================================
  describe('1. Full Workspace Serialization to .block File & Restored Canvas Rendering', () => {
    it('should construct a comprehensive OOP workspace, serialize to a .block document, and restore canvas rendering losslessly', () => {
      // 1. Package Declaration
      const pkgBlock = workspace.newBlock('package_declaration') as Blockly.BlockSvg;
      (pkgBlock.getField('PACKAGE_NAME') as Blockly.FieldTextInput).setValue('com.game.entities');
      pkgBlock.initSvg();
      pkgBlock.render();

      // 2. Imports
      const importBlock = workspace.newBlock('import_type') as Blockly.BlockSvg;
      (importBlock.getField('MODULE_PATH') as Blockly.FieldTextInput).setValue('haxe.ds.Vector');
      importBlock.initSvg();
      importBlock.render();

      const usingBlock = workspace.newBlock('using_mixin') as Blockly.BlockSvg;
      (usingBlock.getField('MODULE_PATH') as Blockly.FieldTextInput).setValue('StringTools');
      usingBlock.initSvg();
      usingBlock.render();

      pkgBlock.nextConnection?.connect(importBlock.previousConnection!);
      importBlock.nextConnection?.connect(usingBlock.previousConnection!);

      // 3. Class Declaration with Fields, Constructor & Methods
      const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
      (classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('PlayerEntity');
      (classBlock.getField('EXTENDS_CLASS') as Blockly.FieldTextInput).setValue('BaseEntity');
      (classBlock.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput).setValue(
        'IDamageable, IControllable',
      );
      classBlock.initSvg();
      classBlock.render();

      // Field: health: Int = 100
      const propBlock = workspace.newBlock('class_property_declaration') as Blockly.BlockSvg;
      (propBlock.getField('PROP_NAME') as Blockly.FieldTextInput).setValue('health');
      (propBlock.getField('ACCESS_MODE') as Blockly.FieldDropdown).setValue('DEFAULT_NULL');
      const intType = workspace.newBlock('type_primitive') as Blockly.BlockSvg;
      (intType.getField('TYPE') as Blockly.FieldDropdown).setValue('INT');
      const val100 = workspace.newBlock('math_number') as Blockly.BlockSvg;
      (val100.getField('NUM') as Blockly.FieldNumber).setValue(100);

      propBlock.getInput('TYPE_ANNOTATION')?.connection?.connect(intType.outputConnection!);
      propBlock.getInput('INITIAL_VALUE')?.connection?.connect(val100.outputConnection!);
      classBlock.getInput('FIELDS')?.connection?.connect(propBlock.previousConnection!);

      // Constructor with super()
      const ctorBlock = workspace.newBlock('class_constructor_declaration') as Blockly.BlockSvg;
      const superCall = workspace.newBlock('super_constructor_call') as Blockly.BlockSvg;
      ctorBlock.getInput('BODY')?.connection?.connect(superCall.previousConnection!);
      classBlock.getInput('CONSTRUCTOR')?.connection?.connect(ctorBlock.previousConnection!);

      // Method: updatePosition
      const methodBlock = workspace.newBlock('class_method_declaration') as Blockly.BlockSvg;
      (methodBlock.getField('METHOD_NAME') as Blockly.FieldTextInput).setValue('updatePosition');
      (methodBlock.getField('MODIFIER') as Blockly.FieldDropdown).setValue('OVERRIDE');
      const retBool = workspace.newBlock('type_primitive') as Blockly.BlockSvg;
      (retBool.getField('TYPE') as Blockly.FieldDropdown).setValue('BOOL');
      methodBlock.getInput('RETURN_TYPE')?.connection?.connect(retBool.outputConnection!);
      classBlock.getInput('METHODS')?.connection?.connect(methodBlock.previousConnection!);

      // 4. Interface Declaration
      const interfaceBlock = workspace.newBlock('interface_declaration') as Blockly.BlockSvg;
      (interfaceBlock.getField('INTERFACE_NAME') as Blockly.FieldTextInput).setValue('IDamageable');
      const methodSig = workspace.newBlock('interface_method_signature') as Blockly.BlockSvg;
      (methodSig.getField('METHOD_NAME') as Blockly.FieldTextInput).setValue('takeDamage');
      interfaceBlock.getInput('MEMBERS')?.connection?.connect(methodSig.previousConnection!);

      // 5. Enum Declaration
      const enumBlock = workspace.newBlock('enum_declaration') as Blockly.BlockSvg;
      (enumBlock.getField('ENUM_NAME') as Blockly.FieldTextInput).setValue('PlayerState');
      const variantIdle = workspace.newBlock('enum_constructor_item') as Blockly.BlockSvg;
      (variantIdle.getField('VARIANT_NAME') as Blockly.FieldTextInput).setValue('IDLE');
      const variantMoving = workspace.newBlock('enum_constructor_parameterized') as Blockly.BlockSvg;
      (variantMoving.getField('VARIANT_NAME') as Blockly.FieldTextInput).setValue('MOVING');
      variantIdle.nextConnection?.connect(variantMoving.previousConnection!);
      enumBlock.getInput('VARIANTS')?.connection?.connect(variantIdle.previousConnection!);

      const initialCount = workspace.getAllBlocks(false).length;
      expect(initialCount).toBeGreaterThanOrEqual(13);

      // Serialize workspace state directly into native BlockFileDocument format
      const workspaceState = serializeWorkspaceToJson(workspace);
      const doc: BlockFileDocument = createDefaultBlockDocument({
        id: 'doc_integration_test_001',
        fileType: 'class',
        package: 'com.game.entities',
        metadata: {
          title: 'PlayerEntity',
          author: 'Jimmy',
          targetPlatform: 'haxe',
          compilerFlags: ['-dce full'],
        },
        imports: [
          { kind: 'symbol', path: 'haxe.ds.Vector' },
          { kind: 'using', path: 'StringTools' },
        ],
        workspace: workspaceState,
      });

      const jsonFileContent = serializeBlockDocumentToJson(doc, true);
      const checksum = computeBlockDocumentChecksum(doc);

      // Clear the active SVG workspace
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      // Restore workspace from .block JSON file content
      const parsedDoc = deserializeBlockDocumentFromJson(jsonFileContent);
      expect(parsedDoc.id).toBe('doc_integration_test_001');
      expect(parsedDoc.fileType).toBe('class');
      expect(parsedDoc.package).toBe('com.game.entities');
      expect(parsedDoc.imports.length).toBe(2);

      const restoreSuccess = deserializeWorkspaceFromJson(workspace, parsedDoc.workspace);
      expect(restoreSuccess).toBe(true);

      // Verify canvas rendered blocks match original count
      const restoredBlocks = workspace.getAllBlocks(false);
      expect(restoredBlocks.length).toBe(initialCount);

      const restoredTypes = restoredBlocks.map((b) => b.type);
      expect(restoredTypes).toContain('package_declaration');
      expect(restoredTypes).toContain('import_type');
      expect(restoredTypes).toContain('using_mixin');
      expect(restoredTypes).toContain('class_declaration');
      expect(restoredTypes).toContain('class_property_declaration');
      expect(restoredTypes).toContain('class_constructor_declaration');
      expect(restoredTypes).toContain('super_constructor_call');
      expect(restoredTypes).toContain('class_method_declaration');
      expect(restoredTypes).toContain('interface_declaration');
      expect(restoredTypes).toContain('interface_method_signature');
      expect(restoredTypes).toContain('enum_declaration');
      expect(restoredTypes).toContain('enum_constructor_item');
      expect(restoredTypes).toContain('enum_constructor_parameterized');

      // Verify checksum and deep validation pass
      expect(verifyBlockDocumentChecksum(parsedDoc, checksum).isMatch).toBe(true);
      expect(validateBlockDocumentDeep(parsedDoc).valid).toBe(true);
    });
  });

  // ===========================================================================
  // 2. Event Dispatch Over ideEventBus on OOP Modifications & Selection
  // ===========================================================================
  describe('2. Event Dispatch Over ideEventBus on OOP Modifications, Selection & Context Menu', () => {
    it('should dispatch block:changed event on ideEventBus when an OOP block is created or removed', () => {
      const handleBlockChanged = vi.fn();
      ideEventBus.on('block:changed', handleBlockChanged);

      // Attach workspace event bridge matching BlocklyCanvas
      workspace.addChangeListener((e: Blockly.Events.Abstract) => {
        if (
          e.type === Blockly.Events.BLOCK_CREATE ||
          e.type === Blockly.Events.BLOCK_DELETE ||
          e.type === Blockly.Events.BLOCK_CHANGE ||
          e.type === 'create' ||
          e.type === 'delete' ||
          e.type === 'change'
        ) {
          const count = workspace.getAllBlocks(false).length;
          ideEventBus.emit('block:changed', {
            fileId: 'main.block',
            blockCount: count,
          });
        }
      });

      // 1. Create Class Block
      const classBlock = workspace.newBlock('class_declaration');
      const createEvent = new Blockly.Events.BlockCreate(classBlock);
      workspace.fireChangeListener(createEvent);

      expect(handleBlockChanged).toHaveBeenCalledWith({
        fileId: 'main.block',
        blockCount: 1,
      });

      // 2. Create Interface Block
      const interfaceBlock = workspace.newBlock('interface_declaration');
      const createEvent2 = new Blockly.Events.BlockCreate(interfaceBlock);
      workspace.fireChangeListener(createEvent2);

      expect(handleBlockChanged).toHaveBeenLastCalledWith({
        fileId: 'main.block',
        blockCount: 2,
      });

      // 3. Dispose Interface Block
      const deleteEvent = new Blockly.Events.BlockDelete(interfaceBlock);
      interfaceBlock.dispose(true);
      workspace.fireChangeListener(deleteEvent);

      expect(handleBlockChanged).toHaveBeenLastCalledWith({
        fileId: 'main.block',
        blockCount: 1,
      });

      ideEventBus.off('block:changed', handleBlockChanged);
    });

    it('should dispatch block:selected event and update uiStore when an OOP structure is selected', () => {
      const handleBlockSelected = vi.fn();
      ideEventBus.on('block:selected', handleBlockSelected);

      workspace.addChangeListener((e: Blockly.Events.Abstract) => {
        if (e.type === Blockly.Events.SELECTED || e.type === 'selected') {
          const selectedEvent = e as unknown as { newElementId: string | null };
          const selectedId = selectedEvent.newElementId;
          if (selectedId) {
            const selectedBlock = workspace.getBlockById(selectedId);
            const blockType = selectedBlock ? selectedBlock.type : 'unknown';
            ideEventBus.emit('block:selected', { blockId: selectedId, blockType });
            useUIStore.getState().setStatusMessage(`Selected Block: ${blockType}`);
          }
        }
      });

      const enumBlock = workspace.newBlock('enum_declaration');
      const selectEvent = new Blockly.Events.Selected(null, enumBlock.id, workspace.id);
      workspace.fireChangeListener(selectEvent);

      expect(handleBlockSelected).toHaveBeenCalledWith({
        blockId: enumBlock.id,
        blockType: 'enum_declaration',
      });
      expect(useUIStore.getState().statusMessage).toBe('Selected Block: enum_declaration');

      ideEventBus.off('block:selected', handleBlockSelected);
    });

    it('should dispatch ui:notify and execute Generate Constructor context menu action', () => {
      const handleNotify = vi.fn();
      ideEventBus.on('ui:notify', handleNotify);

      const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
      (classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('GameSession');

      const menuItems = buildIDEContextMenuItems({ block: classBlock, workspace });
      const generateCtorItem = menuItems.find((item) => item.id === 'generate-constructor');

      expect(generateCtorItem).toBeDefined();

      // Trigger action
      generateCtorItem?.onClick?.();

      expect(handleNotify).toHaveBeenCalledWith({
        message: expect.stringContaining('GameSession'),
        type: 'info',
      });

      // Verify that constructor was attached to class
      const ctorInput = classBlock.getInput('CONSTRUCTOR');
      expect(ctorInput?.connection?.isConnected()).toBe(true);

      ideEventBus.off('ui:notify', handleNotify);
    });

    it('should dispatch ui:notify and execute Implement Interface Methods context menu action', () => {
      const handleNotify = vi.fn();
      ideEventBus.on('ui:notify', handleNotify);

      const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
      (classBlock.getField('IMPLEMENTS_INTERFACES') as Blockly.FieldTextInput).setValue(
        'IDamageable',
      );

      const menuItems = buildIDEContextMenuItems({ block: classBlock, workspace });
      const implementItem = menuItems.find((item) => item.id === 'implement-interfaces');

      expect(implementItem).toBeDefined();

      implementItem?.onClick?.();

      expect(handleNotify).toHaveBeenCalledWith({
        message: 'Generated interface method stubs.',
        type: 'info',
      });

      const methodsInput = classBlock.getInput('METHODS');
      expect(methodsInput?.connection?.isConnected()).toBe(true);

      ideEventBus.off('ui:notify', handleNotify);
    });

    it('should dispatch ui:notify and toggle abstract modifier on Class blocks via context menu', () => {
      const handleNotify = vi.fn();
      ideEventBus.on('ui:notify', handleNotify);

      const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
      const modField = classBlock.getField('MODIFIER') as Blockly.FieldDropdown;
      expect(modField.getValue()).toBe('NONE');

      const menuItems = buildIDEContextMenuItems({ block: classBlock, workspace });
      const toggleAbstractItem = menuItems.find((item) => item.id === 'toggle-abstract');
      expect(toggleAbstractItem).toBeDefined();

      toggleAbstractItem?.onClick?.();

      expect(modField.getValue()).toBe('ABSTRACT');
      expect(handleNotify).toHaveBeenCalledWith({
        message: 'Class marked as abstract.',
        type: 'info',
      });

      ideEventBus.off('ui:notify', handleNotify);
    });

    it('should dispatch ui:notify and export Class block as .block template via context menu', () => {
      const handleNotify = vi.fn();
      ideEventBus.on('ui:notify', handleNotify);

      const classBlock = workspace.newBlock('class_declaration') as Blockly.BlockSvg;
      (classBlock.getField('CLASS_NAME') as Blockly.FieldTextInput).setValue('Player');

      const menuItems = buildIDEContextMenuItems({ block: classBlock, workspace });
      const exportItem = menuItems.find((item) => item.id === 'export-block-template');
      expect(exportItem).toBeDefined();

      exportItem?.onClick?.();

      expect(handleNotify).toHaveBeenCalledWith({
        message: 'Exported .block template to clipboard.',
        type: 'info',
      });

      ideEventBus.off('ui:notify', handleNotify);
    });

    it('should dispatch block:selected and ui:notify when Jump to Code context menu option is triggered', () => {
      const handleBlockSelected = vi.fn();
      const handleNotify = vi.fn();

      ideEventBus.on('block:selected', handleBlockSelected);
      ideEventBus.on('ui:notify', handleNotify);

      const block = workspace.newBlock('class_method_declaration') as Blockly.BlockSvg;

      const menuItems = buildIDEContextMenuItems({ block });
      const jumpToCodeItem = menuItems.find((item) => item.id === 'jump-to-code');

      expect(jumpToCodeItem).toBeDefined();

      jumpToCodeItem?.onClick?.();

      expect(handleBlockSelected).toHaveBeenCalledWith({
        blockId: block.id,
        blockType: 'class_method_declaration',
      });

      expect(handleNotify).toHaveBeenCalledWith({
        message: expect.stringContaining('class_method_declaration'),
        type: 'info',
      });

      ideEventBus.off('block:selected', handleBlockSelected);
      ideEventBus.off('ui:notify', handleNotify);
    });
  });
});
