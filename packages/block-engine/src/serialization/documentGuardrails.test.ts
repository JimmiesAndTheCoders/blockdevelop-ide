import { describe, it, expect } from 'vitest';
import {
  createDefaultBlockDocument,
  BlockFileDocument,
} from './blockDocumentSchema';
import {
  computeBlockDocumentChecksum,
  verifyBlockDocumentChecksum,
  validateBlockDocumentDeep,
  repairBlockDocument,
} from './documentGuardrails';

describe('Phase 4.2 - Section 1.2: Deep Validation, Checksums & Auto-Repair Guardrails', () => {
  const createValidDoc = (): BlockFileDocument =>
    createDefaultBlockDocument({
      id: 'doc_guardrails_001',
      fileType: 'class',
      package: 'com.game.entities',
      metadata: {
        title: 'PlayerEntity',
        created: 1700000000000,
        lastModified: 1700000000000,
      },
      imports: [{ kind: 'symbol', path: 'haxe.ds.Vector' }],
      workspace: {
        version: '1.0.0',
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              id: 'block_01',
              type: 'event_on_start',
              inputs: {
                DO: {
                  block: {
                    id: 'block_02',
                    type: 'math_number',
                  },
                },
              },
            },
          ],
        },
      },
    });

  describe('1. Checksum Generation & Tamper Detection', () => {
    it('should compute deterministic checksum matching identical payload content', () => {
      const docA = createValidDoc();
      const docB = createValidDoc();

      const hashA = computeBlockDocumentChecksum(docA);
      const hashB = computeBlockDocumentChecksum(docB);

      expect(hashA).toBe(hashB);
      expect(hashA.startsWith('sha256_')).toBe(true);
    });

    it('should detect document tampering when AST content or metadata is altered', () => {
      const originalDoc = createValidDoc();
      const originalChecksum = computeBlockDocumentChecksum(originalDoc);

      const tamperedDoc = JSON.parse(JSON.stringify(originalDoc)) as BlockFileDocument;
      tamperedDoc.package = 'com.malicious.payload';

      const report = verifyBlockDocumentChecksum(tamperedDoc, originalChecksum);

      expect(report.isMatch).toBe(false);
      expect(report.checksum).not.toBe(originalChecksum);
    });
  });

  describe('2. Deep Structural & Connection Validation', () => {
    it('should pass valid document structure without errors', () => {
      const validDoc = createValidDoc();
      const result = validateBlockDocumentDeep(validDoc);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect duplicate block IDs across nested connection trees', () => {
      const corruptedDoc = createValidDoc();
      // Inject duplicate ID in child node safely
      const rootBlock = corruptedDoc.workspace.blocks?.blocks?.[0] as Record<string, unknown> | undefined;
      expect(rootBlock).toBeDefined();

      const inputs = rootBlock?.inputs as Record<string, { block: Record<string, unknown> }> | undefined;
      expect(inputs?.DO?.block).toBeDefined();

      if (inputs?.DO?.block) {
        inputs.DO.block.id = 'block_01'; // duplicate of parent ID
      }

      const result = validateBlockDocumentDeep(corruptedDoc);

      expect(result.valid).toBe(false);
      expect(result.errors.some((err) => err.includes('Duplicate block ID detected'))).toBe(true);
    });

    it('should detect malformed imports and invalid fileTypes', () => {
      const corruptedDoc = {
        format: 'blockdevelop-block',
        version: '2.0.0',
        id: 'bad_doc',
        metadata: { title: 'Bad' },
        fileType: 'invalid_type_kind',
        package: 'com.game',
        imports: ['not_an_object_spec'],
        workspace: {},
      };

      const result = validateBlockDocumentDeep(corruptedDoc);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid fileType'))).toBe(true);
      expect(result.errors.some((e) => e.includes('Import at index 0 is malformed'))).toBe(true);
    });
  });

  describe('3. Auto-Repair Pipeline for Corrupted AST Trees', () => {
    it('should auto-repair duplicate block IDs and broken connections', () => {
      const brokenDoc = {
        format: 'blockdevelop-block',
        version: '2.0.0',
        id: 'broken_01',
        package: 'com..game...bad_format.',
        imports: [
          { kind: 'symbol', path: 'haxe.ds.Vector' },
          { kind: 'symbol', path: 'haxe.ds.Vector' }, // duplicate
        ],
        workspace: {
          blocks: {
            blocks: [
              {
                id: 'dup_id',
                type: 'class_wrapper',
                inputs: {
                  FIELDS: {
                    block: {
                      id: 'dup_id', // Duplicate ID
                      type: 'variable_declare_typed',
                    },
                  },
                  BROKEN: {
                    block: 'invalid_string_connection', // Broken link
                  },
                },
              },
            ],
          },
        },
      };

      const repairResult = repairBlockDocument(brokenDoc);

      expect(repairResult.repaired).toBe(true);
      expect(repairResult.actions.length).toBeGreaterThanOrEqual(3);

      const fixedDoc = repairResult.document;
      expect(fixedDoc.package).toBe('com.game.bad_format');
      expect(fixedDoc.imports.length).toBe(1); // Pruned duplicate import

      // Validate that block IDs are now distinct
      const blocks = fixedDoc.workspace.blocks?.blocks;
      const rootBlock = blocks?.[0] as Record<string, unknown> | undefined;
      expect(rootBlock).toBeDefined();

      const inputs = rootBlock?.inputs as Record<string, { block: Record<string, unknown> }> | undefined;
      const childBlock = inputs?.FIELDS?.block;
      expect(childBlock).toBeDefined();

      if (rootBlock && childBlock) {
        expect(rootBlock.id).not.toBe(childBlock.id);
      }

      // Verify that after repair, the document passes deep validation
      const validationAfterRepair = validateBlockDocumentDeep(fixedDoc);
      expect(validationAfterRepair.valid).toBe(true);
    });

    it('should auto-recover from completely null or unparseable input to a valid document', () => {
      const result = repairBlockDocument(null);

      expect(result.repaired).toBe(true);
      expect(result.document.format).toBe('blockdevelop-block');
      expect(result.document.version).toBe('2.0.0');

      const validation = validateBlockDocumentDeep(result.document);
      expect(validation.valid).toBe(true);
    });
  });
});
