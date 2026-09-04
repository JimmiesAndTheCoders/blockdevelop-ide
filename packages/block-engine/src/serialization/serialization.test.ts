import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../blocks';
import {
  serializeWorkspaceToJson,
  deserializeWorkspaceFromJson,
  serializeWorkspaceToJsonString,
  deserializeWorkspaceFromJsonString,
  serializeWorkspaceToXml,
  deserializeWorkspaceFromXml,
  validateWorkspaceJson,
  validateWorkspaceXml,
  WorkspaceAutoSaveEngine,
  DEFAULT_AUTO_SAVE_KEY,
} from './index';

describe('Serialization, Deserialization & Workspace Auto-Recovery Engine Suite', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    vi.useFakeTimers();
    registerBlockDefinitions();
    workspace = new Blockly.Workspace();

    let store: Record<string, string> = {};
    const localStorageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: 0,
      key: () => null,
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (workspace) {
      workspace.dispose();
    }
  });

  describe('JSON Serialization & Deserialization', () => {
    it('should serialize empty workspace to valid JSON state structure', () => {
      const jsonState = serializeWorkspaceToJson(workspace);
      expect(jsonState.version).toBe('1.0.0');
    });

    it('should roundtrip JSON object serialization and deserialization with block elements', () => {
      workspace.newBlock('event_on_start');

      const jsonState = serializeWorkspaceToJson(workspace);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      const success = deserializeWorkspaceFromJson(workspace, jsonState);
      expect(success).toBe(true);
      expect(workspace.getAllBlocks(false).length).toBe(1);
      expect(workspace.getAllBlocks(false)[0]?.type).toBe('event_on_start');
    });

    it('should roundtrip JSON string serialization and deserialization with block elements', () => {
      workspace.newBlock('event_on_start');

      const jsonString = serializeWorkspaceToJsonString(workspace);
      expect(jsonString).toContain('event_on_start');

      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      const success = deserializeWorkspaceFromJsonString(workspace, jsonString);
      expect(success).toBe(true);
      expect(workspace.getAllBlocks(false).length).toBe(1);
      expect(workspace.getAllBlocks(false)[0]?.type).toBe('event_on_start');
    });

    it('should validate JSON schemas and reject invalid objects', () => {
      expect(validateWorkspaceJson(null).valid).toBe(false);
      expect(validateWorkspaceJson('string').valid).toBe(false);
      expect(validateWorkspaceJson({ blocks: 'invalid_type' }).valid).toBe(false);
      expect(validateWorkspaceJson({ variables: 'invalid_array' }).valid).toBe(false);
      expect(validateWorkspaceJson({ blocks: {}, variables: [] }).valid).toBe(true);
    });

    it('should gracefully handle malformed JSON strings without throwing', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const success = deserializeWorkspaceFromJsonString(workspace, '{{invalid_json_markup');
      expect(success).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Phase 4.1 Comprehensive Block Matrix Serialization Roundtrips', () => {
    it('should roundtrip all Phase 4.1 scoping and variable blocks (JSON & XML)', () => {
      workspace.newBlock('type_primitive');
      workspace.newBlock('type_array_of');
      workspace.newBlock('type_map_of');
      workspace.newBlock('type_custom');
      workspace.newBlock('type_nullable');
      workspace.newBlock('variable_declare_typed');
      workspace.newBlock('variable_declare_inferred');
      workspace.newBlock('variable_declare_local');
      workspace.newBlock('variable_get_scoped_typed');
      workspace.newBlock('variable_assign_op');
      workspace.newBlock('variable_increment_decrement');

      const initialCount = workspace.getAllBlocks(false).length;
      expect(initialCount).toBe(11);

      // JSON String Roundtrip
      const jsonString = serializeWorkspaceToJsonString(workspace);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);
      deserializeWorkspaceFromJsonString(workspace, jsonString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      // XML Roundtrip
      const xmlString = serializeWorkspaceToXml(workspace);
      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);
      deserializeWorkspaceFromXml(workspace, xmlString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);
    });

    it('should roundtrip all Phase 4.1 1D and 2D collection blocks (JSON & XML)', () => {
      workspace.newBlock('array_create_empty');
      workspace.newBlock('array_create_with');
      workspace.newBlock('array_create_typed');
      workspace.newBlock('array_length');
      workspace.newBlock('array_get_index');
      workspace.newBlock('array_set_index');
      workspace.newBlock('array_push');
      workspace.newBlock('array_pop');
      workspace.newBlock('array_unshift');
      workspace.newBlock('array_shift');
      workspace.newBlock('array_insert_at');
      workspace.newBlock('array_remove_at');
      workspace.newBlock('array_slice');
      workspace.newBlock('array_splice');
      workspace.newBlock('array_indexOf');
      workspace.newBlock('array_contains');
      workspace.newBlock('array_reverse');
      workspace.newBlock('array_sort');
      workspace.newBlock('matrix_create_2d');
      workspace.newBlock('matrix_get_2d');
      workspace.newBlock('matrix_set_2d');
      workspace.newBlock('matrix_dimensions');
      workspace.newBlock('matrix_fill_2d');

      const initialCount = workspace.getAllBlocks(false).length;
      expect(initialCount).toBe(23);

      // JSON Roundtrip
      const jsonString = serializeWorkspaceToJsonString(workspace);
      workspace.clear();
      deserializeWorkspaceFromJsonString(workspace, jsonString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      // XML Roundtrip
      const xmlString = serializeWorkspaceToXml(workspace);
      workspace.clear();
      deserializeWorkspaceFromXml(workspace, xmlString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);
    });

    it('should roundtrip all Phase 4.1 functions and method invocation blocks (JSON & XML)', () => {
      workspace.newBlock('function_def_typed');
      workspace.newBlock('function_param_item');
      workspace.newBlock('function_def_simple');
      workspace.newBlock('return_value');
      workspace.newBlock('return_bare');
      workspace.newBlock('function_call_typed');
      workspace.newBlock('function_call_typed_statement');
      workspace.newBlock('method_call_instance');
      workspace.newBlock('method_call_instance_statement');
      workspace.newBlock('method_call_static');

      const initialCount = workspace.getAllBlocks(false).length;
      expect(initialCount).toBe(10);

      const jsonString = serializeWorkspaceToJsonString(workspace);
      workspace.clear();
      deserializeWorkspaceFromJsonString(workspace, jsonString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      const xmlString = serializeWorkspaceToXml(workspace);
      workspace.clear();
      deserializeWorkspaceFromXml(workspace, xmlString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);
    });

    it('should roundtrip all Phase 4.1 package, class, and import structural blocks (JSON & XML)', () => {
      workspace.newBlock('package_declare');
      workspace.newBlock('package_declare_header');
      workspace.newBlock('class_wrapper');
      workspace.newBlock('class_constructor');
      workspace.newBlock('import_statement');
      workspace.newBlock('import_wildcard');
      workspace.newBlock('import_alias');

      const initialCount = workspace.getAllBlocks(false).length;
      expect(initialCount).toBe(7);

      const jsonString = serializeWorkspaceToJsonString(workspace);
      workspace.clear();
      deserializeWorkspaceFromJsonString(workspace, jsonString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);

      const xmlString = serializeWorkspaceToXml(workspace);
      workspace.clear();
      deserializeWorkspaceFromXml(workspace, xmlString);
      expect(workspace.getAllBlocks(false).length).toBe(initialCount);
    });
  });

  describe('XML Serialization & Deserialization', () => {
    it('should serialize workspace to valid XML string', () => {
      workspace.newBlock('event_on_start');

      const xmlText = serializeWorkspaceToXml(workspace);
      expect(xmlText).toContain('<xml');
      expect(xmlText).toContain('event_on_start');
    });

    it('should roundtrip XML serialization and deserialization', () => {
      workspace.newBlock('event_on_start');

      const xmlText = serializeWorkspaceToXml(workspace);

      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      const success = deserializeWorkspaceFromXml(workspace, xmlText);
      expect(success).toBe(true);
      expect(workspace.getAllBlocks(false).length).toBe(1);
    });

    it('should validate XML strings and reject malformed tags', () => {
      expect(validateWorkspaceXml('').valid).toBe(false);
      expect(validateWorkspaceXml('<xml><block type="event_on_start"></xml>').valid).toBe(false);
      expect(validateWorkspaceXml('<other_root></other_root>').valid).toBe(false);
      expect(validateWorkspaceXml('<xml><block type="event_on_start"/></xml>').valid).toBe(true);
    });
  });

  describe('WorkspaceAutoSaveEngine & Persistent Storage', () => {
    it('should save and load workspace state from localStorage', () => {
      workspace.newBlock('event_on_start');

      const saved = WorkspaceAutoSaveEngine.saveToStorage(workspace);
      expect(saved).toBe(true);
      expect(window.localStorage.getItem(DEFAULT_AUTO_SAVE_KEY)).not.toBeNull();

      workspace.clear();
      expect(workspace.getAllBlocks(false).length).toBe(0);

      const loaded = WorkspaceAutoSaveEngine.loadFromStorage(workspace);
      expect(loaded).toBe(true);
      expect(workspace.getAllBlocks(false).length).toBe(1);
    });

    it('should schedule auto-save with debounce protection', () => {
      WorkspaceAutoSaveEngine.scheduleAutoSave(workspace, DEFAULT_AUTO_SAVE_KEY, 500);

      expect(window.localStorage.getItem(DEFAULT_AUTO_SAVE_KEY)).toBeNull();

      vi.advanceTimersByTime(500);

      expect(window.localStorage.getItem(DEFAULT_AUTO_SAVE_KEY)).not.toBeNull();
    });

    it('should auto-recover by clearing corrupted auto-save data', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      window.localStorage.setItem(DEFAULT_AUTO_SAVE_KEY, '{{corrupted_autosave_data');

      const loaded = WorkspaceAutoSaveEngine.loadFromStorage(workspace);
      expect(loaded).toBe(false);
      expect(window.localStorage.getItem(DEFAULT_AUTO_SAVE_KEY)).toBeNull();

      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });
});
