import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../blocks';
import {
  createDefaultBlockDocument,
  validateBlockDocumentSchema,
  migrateBlockSchema,
  serializeBlockDocumentToJson,
  deserializeBlockDocumentFromJson,
  serializeBlockDocumentToXml,
  deserializeBlockDocumentFromXml,
  BlockFileDocument,
  CURRENT_BLOCK_DOCUMENT_VERSION,
  BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
} from './blockDocumentSchema';

describe('Phase 4.2 - Task 1.1: Native .block Schema & Dual Codecs Suite', () => {
  let workspace: Blockly.Workspace;

  beforeEach(() => {
    registerBlockDefinitions();
    workspace = new Blockly.Workspace();
  });

  afterEach(() => {
    if (workspace) {
      workspace.dispose();
    }
  });

  describe('1. Default Document Envelope & Schema Validation', () => {
    it('should generate a valid v2.0.0 BlockFileDocument with complete envelope fields', () => {
      const doc = createDefaultBlockDocument({
        id: 'doc_test_123',
        fileType: 'class',
        package: 'com.game.entities',
        metadata: {
          title: 'PlayerEntity',
          author: 'Jimmy',
          created: 1700000000000,
          lastModified: 1700000000000,
          targetPlatform: 'haxe',
          compilerFlags: ['-dce full'],
        },
        imports: [
          { kind: 'symbol', path: 'haxe.ds.Vector' },
          { kind: 'wildcard', path: 'com.game.events' },
          { kind: 'alias', path: 'com.game.utils.MathUtil', alias: 'FastMath' },
        ],
      });

      expect(doc.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(doc.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(doc.id).toBe('doc_test_123');
      expect(doc.fileType).toBe('class');
      expect(doc.package).toBe('com.game.entities');
      expect(doc.imports.length).toBe(3);
      expect(doc.metadata.title).toBe('PlayerEntity');

      const validation = validateBlockDocumentSchema(doc);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should reject invalid document payloads during schema validation', () => {
      expect(validateBlockDocumentSchema(null).valid).toBe(false);
      expect(validateBlockDocumentSchema('non-object-payload').valid).toBe(false);

      const invalidDoc = {
        format: 'wrong-format',
        version: '1.0.0',
        id: '',
        fileType: 'unknown_type',
      };

      const result = validateBlockDocumentSchema(invalidDoc);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('2. Legacy V1 Migration Pipeline', () => {
    it('should migrate legacy V1 workspace state ({ version: "1.0.0", blocks: ... }) to V2 envelope', () => {
      const legacyState = {
        version: '1.0.0',
        blocks: {
          languageVersion: 0,
          blocks: [{ type: 'event_on_start', id: 'start_01' }],
        },
        variables: [{ name: 'score', id: 'var_score', type: 'Int' }],
      };

      const migrated = migrateBlockSchema(legacyState);

      expect(migrated.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(migrated.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(migrated.id).toBeDefined();
      expect(migrated.workspace.blocks?.blocks.length).toBe(1);
      expect(migrated.workspace.variables?.length).toBe(1);
      expect(migrated.fileType).toBe('class');

      const validation = validateBlockDocumentSchema(migrated);
      expect(validation.valid).toBe(true);
    });
  });

  describe('3. Canonical JSON Serialization (.block) Roundtrip', () => {
    it('should perform lossless roundtrip serialization and deserialization in JSON', () => {
      workspace.newBlock('class_wrapper');
      workspace.newBlock('package_declare');

      const initialDoc = createDefaultBlockDocument({
        id: 'doc_roundtrip_json',
        fileType: 'class',
        package: 'net.blockdevelop.demo',
        metadata: {
          title: 'DemoClass',
          author: 'CoreTeam',
          targetPlatform: 'html5',
        },
        imports: [{ kind: 'symbol', path: 'haxe.ds.StringMap' }],
      });

      const jsonString = serializeBlockDocumentToJson(initialDoc, true);
      expect(typeof jsonString).toBe('string');
      expect(jsonString).toContain(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(jsonString).toContain(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(jsonString).toContain('net.blockdevelop.demo');

      const restoredDoc = deserializeBlockDocumentFromJson(jsonString);
      expect(restoredDoc.id).toBe(initialDoc.id);
      expect(restoredDoc.package).toBe('net.blockdevelop.demo');
      expect(restoredDoc.fileType).toBe('class');
      expect(restoredDoc.imports).toEqual(initialDoc.imports);
      expect(restoredDoc.metadata.title).toBe('DemoClass');
    });
  });

  describe('4. XML Document Envelope Compatibility Roundtrip', () => {
    it('should serialize BlockFileDocument into valid XML envelope and restore losslessly', () => {
      workspace.newBlock('event_on_start');

      const originalDoc: BlockFileDocument = createDefaultBlockDocument({
        id: 'doc_xml_001',
        fileType: 'enum',
        package: 'com.game.enums',
        metadata: {
          title: 'GameDirection',
          author: 'Tester',
          targetPlatform: 'cpp',
          compilerFlags: ['-debug'],
        },
        imports: [{ kind: 'wildcard', path: 'com.game.base' }],
      });

      const xmlString = serializeBlockDocumentToXml(originalDoc, workspace);
      expect(xmlString).toContain('<blockdevelop-document');
      expect(xmlString).toContain('<title>GameDirection</title>');
      expect(xmlString).toContain('<package>com.game.enums</package>');
      expect(xmlString).toContain('<fileType>enum</fileType>');
      expect(xmlString).toContain('<flag>-debug</flag>');

      const restoredDoc = deserializeBlockDocumentFromXml(xmlString);

      expect(restoredDoc.id).toBe('doc_xml_001');
      expect(restoredDoc.fileType).toBe('enum');
      expect(restoredDoc.package).toBe('com.game.enums');
      expect(restoredDoc.metadata.title).toBe('GameDirection');
      expect(restoredDoc.metadata.compilerFlags).toContain('-debug');
      expect(restoredDoc.imports.length).toBe(1);
      expect(restoredDoc.imports[0]?.path).toBe('com.game.base');
      expect(restoredDoc.workspace.blocks?.blocks.length).toBe(1);
    });

    it('should fallback gracefully to default document envelope when raw legacy XML is deserialized', () => {
      const bareXml = '<xml><block type="event_on_start"/></xml>';
      const doc = deserializeBlockDocumentFromXml(bareXml);

      expect(doc.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(doc.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(doc.workspace.blocks?.blocks.length).toBe(1);
    });
  });
});
