import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Blockly from 'blockly/core';
import { registerBlockDefinitions } from '../blocks';
import {
  createDefaultBlockDocument,
  validateBlockDocumentSchema,
  migrateBlockSchema,
  serializeBlockDocumentToJson,
  deserializeBlockDocumentFromJson,
  CURRENT_BLOCK_DOCUMENT_VERSION,
  BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
  type BlockFileDocument,
  type BlockFileType,
  type LegacyV1WorkspaceState,
} from './blockDocumentSchema';
import {
  computeBlockDocumentChecksum,
  verifyBlockDocumentChecksum,
  validateBlockDocumentDeep,
  repairBlockDocument,
} from './documentGuardrails';

describe('Phase 4.2 - Section 8.1: Schema & File Format Unit Tests', () => {
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

  // ===========================================================================
  // 1. Lossless .block Document JSON Encoding & Decoding Across All File Types
  // ===========================================================================
  describe('1. Lossless .block Document JSON Encoding & Decoding Across All File Types', () => {
    it('should encode and decode a Class file (.block) losslessly with complete OOP structure and members', () => {
      // 1. Construct Class document with package, imports, class header, fields, constructor, and methods
      const classDoc: BlockFileDocument = createDefaultBlockDocument({
        id: 'doc_class_player_001',
        fileType: 'class',
        package: 'com.game.entities',
        metadata: {
          title: 'PlayerEntity',
          author: 'Jimmy Santoyo',
          created: 1710000000000,
          lastModified: 1710005000000,
          targetPlatform: 'haxe',
          compilerFlags: ['-dce full', '-debug'],
          description: 'Main player entity class with movement and health logic',
          tags: ['entity', 'gameplay', 'oop'],
        },
        imports: [
          { kind: 'symbol', path: 'haxe.ds.Vector' },
          { kind: 'wildcard', path: 'com.game.events' },
          { kind: 'alias', path: 'com.game.utils.MathUtils', alias: 'FastMath' },
          { kind: 'using', path: 'StringTools' },
        ],
        workspace: {
          version: '1.0.0',
          blocks: {
            languageVersion: 0,
            blocks: [
              {
                id: 'pkg_block_01',
                type: 'package_declaration',
                x: 40,
                y: 40,
                fields: {
                  PACKAGE_NAME: 'com.game.entities',
                },
                next: {
                  block: {
                    id: 'class_block_01',
                    type: 'class_declaration',
                    fields: {
                      ACCESS: 'PUBLIC',
                      MODIFIER: 'NONE',
                      CLASS_NAME: 'PlayerEntity',
                      EXTENDS_CLASS: 'BaseEntity',
                      IMPLEMENTS_INTERFACES: 'IDamageable, IControllable',
                    },
                    inputs: {
                      FIELDS: {
                        block: {
                          id: 'field_health_01',
                          type: 'class_property_declaration',
                          fields: {
                            ACCESS: 'PUBLIC',
                            SPECIFIER: 'NONE',
                            PROP_NAME: 'health',
                            ACCESS_MODE: 'DEFAULT_NULL',
                          },
                          inputs: {
                            TYPE_ANNOTATION: {
                              block: {
                                id: 'type_int_01',
                                type: 'type_primitive',
                                fields: { TYPE: 'INT' },
                              },
                            },
                            INITIAL_VALUE: {
                              block: {
                                id: 'val_100_01',
                                type: 'math_number',
                                fields: { NUM: 100 },
                              },
                            },
                          },
                        },
                      },
                      CONSTRUCTOR: {
                        block: {
                          id: 'ctor_block_01',
                          type: 'class_constructor_declaration',
                          fields: { ACCESS: 'PUBLIC' },
                          inputs: {
                            PARAMS: {
                              block: {
                                id: 'param_initial_hp',
                                type: 'function_param_item',
                                fields: { PARAM_NAME: 'initialHp' },
                                inputs: {
                                  PARAM_TYPE: {
                                    block: {
                                      id: 'type_int_02',
                                      type: 'type_primitive',
                                      fields: { TYPE: 'INT' },
                                    },
                                  },
                                },
                              },
                            },
                            BODY: {
                              block: {
                                id: 'super_call_01',
                                type: 'super_constructor_call',
                                inputs: {
                                  ARG0: {
                                    block: {
                                      id: 'super_arg_01',
                                      type: 'variable_get_scoped_typed',
                                      fields: {
                                        TARGET_SCOPE: 'LOCAL',
                                        VAR_NAME: 'initialHp',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      METHODS: {
                        block: {
                          id: 'method_take_damage_01',
                          type: 'class_method_declaration',
                          fields: {
                            ACCESS: 'PUBLIC',
                            MODIFIER: 'OVERRIDE',
                            METHOD_NAME: 'takeDamage',
                          },
                          inputs: {
                            PARAMS: {
                              block: {
                                id: 'param_amount',
                                type: 'method_param_item',
                                fields: {
                                  IS_OPTIONAL: false,
                                  PARAM_NAME: 'amount',
                                },
                                inputs: {
                                  PARAM_TYPE: {
                                    block: {
                                      id: 'type_int_03',
                                      type: 'type_primitive',
                                      fields: { TYPE: 'INT' },
                                    },
                                  },
                                },
                              },
                            },
                            RETURN_TYPE: {
                              block: {
                                id: 'type_void_01',
                                type: 'type_primitive',
                                fields: { TYPE: 'VOID' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          variables: [
            { name: 'health', id: 'var_health_id', type: 'Int' },
            { name: 'initialHp', id: 'var_initial_hp_id', type: 'Int' },
          ],
        },
      });

      // 2. Encode to canonical JSON string
      const jsonText = serializeBlockDocumentToJson(classDoc, true);
      expect(typeof jsonText).toBe('string');
      expect(jsonText).toContain(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(jsonText).toContain(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(jsonText).toContain('com.game.entities');
      expect(jsonText).toContain('PlayerEntity');
      expect(jsonText).toContain('IDamageable, IControllable');

      // 3. Decode back into document structure
      const restoredDoc = deserializeBlockDocumentFromJson(jsonText);

      // 4. Verify exact lossless reproduction of document envelope & AST
      expect(restoredDoc.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(restoredDoc.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(restoredDoc.id).toBe('doc_class_player_001');
      expect(restoredDoc.fileType).toBe('class');
      expect(restoredDoc.package).toBe('com.game.entities');

      expect(restoredDoc.metadata.title).toBe('PlayerEntity');
      expect(restoredDoc.metadata.author).toBe('Jimmy Santoyo');
      expect(restoredDoc.metadata.created).toBe(1710000000000);
      expect(restoredDoc.metadata.targetPlatform).toBe('haxe');
      expect(restoredDoc.metadata.compilerFlags).toEqual(['-dce full', '-debug']);
      expect(restoredDoc.metadata.description).toBe(
        'Main player entity class with movement and health logic',
      );
      expect(restoredDoc.metadata.tags).toEqual(['entity', 'gameplay', 'oop']);

      expect(restoredDoc.imports).toEqual(classDoc.imports);
      expect(restoredDoc.workspace.blocks?.blocks.length).toBe(1);
      expect(restoredDoc.workspace.variables?.length).toBe(2);

      // Verify deep validation passes on decoded document
      const deepValidation = validateBlockDocumentDeep(restoredDoc);
      expect(deepValidation.valid).toBe(true);
      expect(deepValidation.errors).toEqual([]);
    });

    it('should encode and decode an Interface file (.block) losslessly with abstract signatures', () => {
      const interfaceDoc: BlockFileDocument = createDefaultBlockDocument({
        id: 'doc_interface_damageable_001',
        fileType: 'interface',
        package: 'com.game.contracts',
        metadata: {
          title: 'IDamageable',
          author: 'CoreArchitectureTeam',
          created: 1710000000000,
          targetPlatform: 'haxe',
          compilerFlags: [],
        },
        imports: [{ kind: 'symbol', path: 'com.game.types.DamageReport' }],
        workspace: {
          version: '1.0.0',
          blocks: {
            languageVersion: 0,
            blocks: [
              {
                id: 'interface_decl_01',
                type: 'interface_declaration',
                x: 50,
                y: 50,
                fields: {
                  ACCESS: 'PUBLIC',
                  INTERFACE_NAME: 'IDamageable',
                  EXTENDS_INTERFACES: 'IEntity, ISerializable',
                },
                inputs: {
                  MEMBERS: {
                    block: {
                      id: 'method_sig_01',
                      type: 'interface_method_signature',
                      fields: { METHOD_NAME: 'takeDamage' },
                      inputs: {
                        PARAMS: {
                          block: {
                            id: 'param_sig_amount',
                            type: 'function_param_item',
                            fields: { PARAM_NAME: 'amount' },
                            inputs: {
                              PARAM_TYPE: {
                                block: {
                                  id: 'type_float_01',
                                  type: 'type_primitive',
                                  fields: { TYPE: 'FLOAT' },
                                },
                              },
                            },
                          },
                        },
                        RETURN_TYPE: {
                          block: {
                            id: 'type_bool_01',
                            type: 'type_primitive',
                            fields: { TYPE: 'BOOL' },
                          },
                        },
                      },
                      next: {
                        block: {
                          id: 'prop_sig_01',
                          type: 'interface_property_signature',
                          fields: {
                            PROPERTY_NAME: 'isAlive',
                            READ_ACCESS: 'DEFAULT',
                            WRITE_ACCESS: 'NULL',
                          },
                          inputs: {
                            PROPERTY_TYPE: {
                              block: {
                                id: 'type_bool_02',
                                type: 'type_primitive',
                                fields: { TYPE: 'BOOL' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          variables: [],
        },
      });

      const jsonText = serializeBlockDocumentToJson(interfaceDoc, true);
      const restoredDoc = deserializeBlockDocumentFromJson(jsonText);

      expect(restoredDoc.id).toBe('doc_interface_damageable_001');
      expect(restoredDoc.fileType).toBe('interface');
      expect(restoredDoc.package).toBe('com.game.contracts');
      expect(restoredDoc.metadata.title).toBe('IDamageable');
      expect(restoredDoc.imports.length).toBe(1);
      expect(restoredDoc.imports[0]?.path).toBe('com.game.types.DamageReport');

      const rootBlock = restoredDoc.workspace.blocks?.blocks[0] as Record<string, unknown> | undefined;
      expect(rootBlock).toBeDefined();
      if (rootBlock) {
        expect(rootBlock.type).toBe('interface_declaration');
        const fields = rootBlock.fields as Record<string, unknown> | undefined;
        expect(fields?.INTERFACE_NAME).toBe('IDamageable');
        expect(fields?.EXTENDS_INTERFACES).toBe('IEntity, ISerializable');
      }

      const validation = validateBlockDocumentDeep(restoredDoc);
      expect(validation.valid).toBe(true);
    });

    it('should encode and decode an Enum file (.block) losslessly with scalar and ADT constructors', () => {
      const enumDoc: BlockFileDocument = createDefaultBlockDocument({
        id: 'doc_enum_state_001',
        fileType: 'enum',
        package: 'com.game.state',
        metadata: {
          title: 'GameState',
          author: 'GameStateLead',
          created: 1710000000000,
          targetPlatform: 'cpp',
        },
        imports: [],
        workspace: {
          version: '1.0.0',
          blocks: {
            languageVersion: 0,
            blocks: [
              {
                id: 'enum_decl_01',
                type: 'enum_declaration',
                x: 20,
                y: 20,
                fields: {
                  ACCESS: 'PUBLIC',
                  ENUM_NAME: 'GameState',
                },
                inputs: {
                  VARIANTS: {
                    block: {
                      id: 'variant_idle',
                      type: 'enum_constructor_item',
                      fields: { VARIANT_NAME: 'IDLE' },
                      next: {
                        block: {
                          id: 'variant_playing',
                          type: 'enum_constructor_parameterized',
                          fields: { VARIANT_NAME: 'PLAYING' },
                          inputs: {
                            PARAMS: {
                              block: {
                                id: 'param_level_idx',
                                type: 'function_param_item',
                                fields: { PARAM_NAME: 'levelIndex' },
                                inputs: {
                                  PARAM_TYPE: {
                                    block: {
                                      id: 'type_int_04',
                                      type: 'type_primitive',
                                      fields: { TYPE: 'INT' },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          next: {
                            block: {
                              id: 'variant_game_over',
                              type: 'enum_constructor_parameterized',
                              fields: { VARIANT_NAME: 'GAME_OVER' },
                              inputs: {
                                PARAMS: {
                                  block: {
                                    id: 'param_reason',
                                    type: 'function_param_item',
                                    fields: { PARAM_NAME: 'reason' },
                                    inputs: {
                                      PARAM_TYPE: {
                                        block: {
                                          id: 'type_str_01',
                                          type: 'type_primitive',
                                          fields: { TYPE: 'STRING' },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          variables: [],
        },
      });

      const jsonText = serializeBlockDocumentToJson(enumDoc, true);
      const restoredDoc = deserializeBlockDocumentFromJson(jsonText);

      expect(restoredDoc.id).toBe('doc_enum_state_001');
      expect(restoredDoc.fileType).toBe('enum');
      expect(restoredDoc.package).toBe('com.game.state');
      expect(restoredDoc.metadata.title).toBe('GameState');
      expect(restoredDoc.metadata.targetPlatform).toBe('cpp');

      const validation = validateBlockDocumentDeep(restoredDoc);
      expect(validation.valid).toBe(true);
    });

    it('should encode and decode Script and Package file types losslessly', () => {
      (['script', 'package'] as BlockFileType[]).forEach((fileType) => {
        const doc: BlockFileDocument = createDefaultBlockDocument({
          id: `doc_${fileType}_001`,
          fileType,
          package: fileType === 'package' ? 'com.game.subsystem' : '',
          metadata: {
            title: `Sample${fileType.toUpperCase()}`,
            targetPlatform: 'python',
          },
          workspace: {
            version: '1.0.0',
            blocks: {
              languageVersion: 0,
              blocks: [
                {
                  id: `start_${fileType}`,
                  type: 'event_on_start',
                  x: 30,
                  y: 30,
                },
              ],
            },
          },
        });

        const jsonText = serializeBlockDocumentToJson(doc, true);
        const restored = deserializeBlockDocumentFromJson(jsonText);

        expect(restored.fileType).toBe(fileType);
        expect(restored.id).toBe(`doc_${fileType}_001`);
        expect(restored.workspace.blocks?.blocks.length).toBe(1);
        expect(validateBlockDocumentSchema(restored).valid).toBe(true);
      });
    });
  });

  // ===========================================================================
  // 2. Schema Migration from V1 to V2 without Loss of Coordinates or Metadata
  // ===========================================================================
  describe('2. Schema Migration from V1 to V2 without Loss of Block Coordinates or Custom Metadata', () => {
    it('should migrate bare legacy V1 workspace state preserving (x, y) coordinates, fields, and variables', () => {
      const legacyState: LegacyV1WorkspaceState = {
        version: '1.0.0',
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              id: 'legacy_block_01',
              type: 'class_wrapper',
              x: 180,
              y: 250,
              fields: {
                ACCESS: 'PUBLIC',
                CLASS_NAME: 'LegacyPlayer',
                EXTENDS_CLASS: 'BaseEntity',
              },
              inputs: {
                FIELDS: {
                  block: {
                    id: 'legacy_field_01',
                    type: 'variable_declare_typed',
                    fields: {
                      ACCESS: 'PRIVATE',
                      VAR_NAME: 'score',
                    },
                  },
                },
              },
            },
            {
              id: 'legacy_block_02',
              type: 'event_on_start',
              x: -45,
              y: 600,
            },
          ],
        },
        variables: [
          { name: 'score', id: 'var_score_1', type: 'Int' },
          { name: 'speed', id: 'var_speed_2', type: 'Float' },
        ],
      };

      const migrated = migrateBlockSchema(legacyState);

      // Verify envelope migration to 2.0.0
      expect(migrated.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(migrated.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(migrated.id).toBeDefined();
      expect(typeof migrated.id).toBe('string');
      expect(migrated.fileType).toBe('class');
      expect(migrated.package).toBe('');
      expect(migrated.imports).toEqual([]);

      // Verify block coordinates preservation
      const blocks = migrated.workspace.blocks?.blocks;
      expect(blocks?.length).toBe(2);

      const b1 = blocks?.[0] as Record<string, unknown>;
      expect(b1.id).toBe('legacy_block_01');
      expect(b1.type).toBe('class_wrapper');
      expect(b1.x).toBe(180);
      expect(b1.y).toBe(250);
      expect((b1.fields as Record<string, unknown>).CLASS_NAME).toBe('LegacyPlayer');

      const b2 = blocks?.[1] as Record<string, unknown>;
      expect(b2.id).toBe('legacy_block_02');
      expect(b2.x).toBe(-45);
      expect(b2.y).toBe(600);

      // Verify variables preservation
      expect(migrated.workspace.variables?.length).toBe(2);
      expect(migrated.workspace.variables?.[0]?.name).toBe('score');
      expect(migrated.workspace.variables?.[1]?.name).toBe('speed');

      const validation = validateBlockDocumentSchema(migrated);
      expect(validation.valid).toBe(true);
    });

    it('should migrate legacy document containing top-level metadata and compiler flags', () => {
      const legacyWithMeta = {
        title: 'LegacyProjectTitle',
        author: 'FlashDevelopMigrator',
        created: 1650000000000,
        targetPlatform: 'node',
        compilerFlags: ['-debug', '--times'],
        fileType: 'script',
        package: 'com.legacy.app',
        imports: [{ kind: 'symbol', path: 'haxe.ds.Vector' }],
        blocks: {
          languageVersion: 0,
          blocks: [
            {
              id: 'script_node_01',
              type: 'text_log_custom',
              x: 100,
              y: 120,
              fields: { LEVEL: 'INFO' },
            },
          ],
        },
      };

      const migrated = migrateBlockSchema(legacyWithMeta);

      expect(migrated.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(migrated.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(migrated.metadata.title).toBe('LegacyProjectTitle');
      expect(migrated.metadata.author).toBe('FlashDevelopMigrator');
      expect(migrated.metadata.created).toBe(1650000000000);
      expect(migrated.metadata.targetPlatform).toBe('node');
      expect(migrated.metadata.compilerFlags).toEqual(['-debug', '--times']);
      expect(migrated.fileType).toBe('script');
      expect(migrated.package).toBe('com.legacy.app');
      expect(migrated.imports.length).toBe(1);

      const block0 = migrated.workspace.blocks?.blocks?.[0] as Record<string, unknown> | undefined;
      expect(block0).toBeDefined();
      if (block0) {
        expect(block0.id).toBe('script_node_01');
        expect(block0.x).toBe(100);
        expect(block0.y).toBe(120);
      }

      expect(validateBlockDocumentSchema(migrated).valid).toBe(true);
    });

    it('should migrate legacy documents with nested metadata objects, descriptions, and tags', () => {
      const legacyNested = {
        id: 'legacy_doc_custom_id',
        metadata: {
          title: 'NestedMetadataTitle',
          author: 'Jimmy',
          created: 1670000000000,
          targetPlatform: 'arduino',
          compilerFlags: ['-O3'],
          description: 'Microcontroller hardware control logic',
          tags: ['hardware', 'embedded'],
        },
        fileType: 'interface',
        package: 'hardware.sensors',
        imports: [{ kind: 'wildcard', path: 'hardware.base' }],
        workspace: {
          version: '1.0.0',
          blocks: {
            languageVersion: 0,
            blocks: [{ id: 'b_sensor', type: 'interface_declaration', x: 200, y: 350 }],
          },
        },
      };

      const migrated = migrateBlockSchema(legacyNested);

      expect(migrated.id).toBe('legacy_doc_custom_id');
      expect(migrated.metadata.title).toBe('NestedMetadataTitle');
      expect(migrated.metadata.author).toBe('Jimmy');
      expect(migrated.metadata.created).toBe(1670000000000);
      expect(migrated.metadata.targetPlatform).toBe('arduino');
      expect(migrated.metadata.compilerFlags).toEqual(['-O3']);
      expect(migrated.metadata.description).toBe('Microcontroller hardware control logic');
      expect(migrated.metadata.tags).toEqual(['hardware', 'embedded']);
      expect(migrated.fileType).toBe('interface');
      expect(migrated.package).toBe('hardware.sensors');

      const block = migrated.workspace.blocks?.blocks?.[0] as Record<string, unknown> | undefined;
      expect(block).toBeDefined();
      if (block) {
        expect(block.x).toBe(200);
        expect(block.y).toBe(350);
      }

      expect(validateBlockDocumentSchema(migrated).valid).toBe(true);
    });

    it('should auto-generate fallback envelope fields when migrating empty, null, or partial inputs', () => {
      const fallbackNull = migrateBlockSchema(null);
      expect(fallbackNull.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(fallbackNull.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(fallbackNull.metadata.title).toBe('Untitled');
      expect(fallbackNull.fileType).toBe('class');

      const fallbackEmptyObj = migrateBlockSchema({});
      expect(fallbackEmptyObj.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
      expect(fallbackEmptyObj.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);
      expect(fallbackEmptyObj.id).toBeDefined();
      expect(validateBlockDocumentSchema(fallbackEmptyObj).valid).toBe(true);
    });
  });

  // ===========================================================================
  // 3. Schema Validation Failure on Malformed Documents & Deep Auto-Recovery
  // ===========================================================================
  describe('3. Schema Validation Failure on Malformed Documents & Deep Auto-Recovery Pipeline', () => {
    describe('3.1 Rejection of Invalid / Tampered Documents', () => {
      it('should reject non-object and primitive input structures', () => {
        expect(validateBlockDocumentSchema(null).valid).toBe(false);
        expect(validateBlockDocumentSchema(undefined).valid).toBe(false);
        expect(validateBlockDocumentSchema('plain-string-payload').valid).toBe(false);
        expect(validateBlockDocumentSchema(12345).valid).toBe(false);
        expect(validateBlockDocumentSchema([]).valid).toBe(false);
      });

      it('should reject documents with invalid format identifier or unsupported schema versions', () => {
        const docInvalidFormat = {
          format: 'invalid-format-header',
          version: '2.0.0',
          id: 'doc_1',
          metadata: { title: 'Test' },
          fileType: 'class',
          package: '',
          imports: [],
          workspace: {},
        };
        const resFormat = validateBlockDocumentSchema(docInvalidFormat);
        expect(resFormat.valid).toBe(false);
        expect(resFormat.errors.some((e) => e.includes('Invalid or missing format identifier'))).toBe(
          true,
        );

        const docInvalidVersion = {
          format: BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
          version: '99.0.0',
          id: 'doc_1',
          metadata: { title: 'Test' },
          fileType: 'class',
          package: '',
          imports: [],
          workspace: {},
        };
        const resVersion = validateBlockDocumentSchema(docInvalidVersion);
        expect(resVersion.valid).toBe(false);
        expect(resVersion.errors.some((e) => e.includes('Unsupported schema version'))).toBe(true);
      });

      it('should reject documents with missing or invalid id, metadata, fileType, package, or imports', () => {
        const malformedDoc = {
          format: BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
          version: CURRENT_BLOCK_DOCUMENT_VERSION,
          id: '', // Empty ID
          metadata: { title: 123 }, // Non-string title
          fileType: 'unsupported_binary_type', // Invalid fileType
          package: 456, // Non-string package
          imports: 'not-an-array', // Non-array imports
          workspace: 'not-an-object', // Non-object workspace
        };

        const result = validateBlockDocumentSchema(malformedDoc);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(6);
      });
    });

    describe('3.2 Deep Structural & Tamper Detection', () => {
      it('should detect checksum changes when AST blocks or metadata attributes are modified', () => {
        const originalDoc = createDefaultBlockDocument({
          id: 'doc_checksum_test',
          fileType: 'class',
          package: 'com.secure.app',
          metadata: { title: 'SecureModule', created: 1700000000000 },
          workspace: {
            version: '1.0.0',
            blocks: {
              languageVersion: 0,
              blocks: [{ id: 'b_sec_01', type: 'event_on_start' }],
            },
          },
        });

        const originalChecksum = computeBlockDocumentChecksum(originalDoc);
        expect(originalChecksum).toBeDefined();
        expect(originalChecksum.startsWith('sha256_')).toBe(true);

        // Verification matches original
        const initialReport = verifyBlockDocumentChecksum(originalDoc, originalChecksum);
        expect(initialReport.isMatch).toBe(true);

        // Tamper AST block type safely
        const tamperedDoc = JSON.parse(JSON.stringify(originalDoc)) as BlockFileDocument;
        const blockToTamper = tamperedDoc.workspace.blocks?.blocks?.[0] as Record<string, unknown> | undefined;
        if (blockToTamper) {
          blockToTamper.type = 'controls_while';
        }

        const tamperedReport = verifyBlockDocumentChecksum(tamperedDoc, originalChecksum);
        expect(tamperedReport.isMatch).toBe(false);
        expect(tamperedReport.checksum).not.toBe(originalChecksum);
      });

      it('should detect duplicate block IDs across nested connection trees', () => {
        const docWithDuplicateIds: BlockFileDocument = createDefaultBlockDocument({
          id: 'doc_dup_id_test',
          fileType: 'class',
          package: 'com.game.test',
          workspace: {
            version: '1.0.0',
            blocks: {
              languageVersion: 0,
              blocks: [
                {
                  id: 'shared_duplicate_id',
                  type: 'class_declaration',
                  inputs: {
                    FIELDS: {
                      block: {
                        id: 'shared_duplicate_id', // Duplicate of parent ID
                        type: 'class_property_declaration',
                      },
                    },
                  },
                },
              ],
            },
          },
        });

        const deepValidation = validateBlockDocumentDeep(docWithDuplicateIds);
        expect(deepValidation.valid).toBe(false);
        expect(
          deepValidation.errors.some((e) =>
            e.includes("Duplicate block ID detected: 'shared_duplicate_id'"),
          ),
        ).toBe(true);
      });
    });

    describe('3.3 Resilient Auto-Repair Pipeline', () => {
      it('should auto-repair duplicate block IDs and broken connection references', () => {
        const brokenPayload = {
          format: BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
          version: CURRENT_BLOCK_DOCUMENT_VERSION,
          id: 'broken_doc_001',
          package: '...com..game..corrupted_dots...',
          imports: [
            { kind: 'symbol', path: 'haxe.ds.Vector' },
            { kind: 'symbol', path: 'haxe.ds.Vector' }, // duplicate import
            { kind: 'symbol', path: '   ' }, // empty import
          ],
          workspace: {
            blocks: {
              blocks: [
                {
                  id: 'conflict_id_01',
                  type: 'class_declaration',
                  inputs: {
                    FIELDS: {
                      block: {
                        id: 'conflict_id_01', // Duplicate ID
                        type: 'class_property_declaration',
                        inputs: {
                          BROKEN_INPUT: {
                            block: 'string_instead_of_object', // Broken connection
                          },
                        },
                      },
                    },
                  },
                  next: {
                    block: 'invalid_next_link', // Broken next link
                  },
                },
              ],
            },
          },
        };

        const repairResult = repairBlockDocument(brokenPayload);

        expect(repairResult.repaired).toBe(true);
        expect(repairResult.actions.length).toBeGreaterThanOrEqual(3);

        const repairedDoc = repairResult.document;

        // Verify sanitized package
        expect(repairedDoc.package).toBe('com.game.corrupted_dots');

        // Verify duplicate and empty imports pruned
        expect(repairedDoc.imports.length).toBe(1);
        expect(repairedDoc.imports[0]?.path).toBe('haxe.ds.Vector');

        // Verify unique block IDs assigned
        const rootBlock = repairedDoc.workspace.blocks?.blocks?.[0] as Record<string, unknown> | undefined;
        expect(rootBlock).toBeDefined();

        const rootInputs = rootBlock?.inputs as Record<string, { block: Record<string, unknown> }> | undefined;
        const childBlock = rootInputs?.FIELDS?.block;

        expect(rootBlock?.id).toBeDefined();
        expect(childBlock?.id).toBeDefined();

        if (rootBlock && childBlock) {
          expect(rootBlock.id).not.toBe(childBlock.id);

          // Verify broken connections pruned
          const childInputs = childBlock.inputs as Record<string, unknown> | undefined;
          expect(childInputs?.BROKEN_INPUT).toBeUndefined();
          expect(rootBlock.next).toBeUndefined();
        }

        // Verify deep validation passes cleanly after auto-repair
        const validationAfterRepair = validateBlockDocumentDeep(repairedDoc);
        expect(validationAfterRepair.valid).toBe(true);
        expect(validationAfterRepair.errors).toEqual([]);
      });

      it('should auto-recover from null or completely unparseable input to a valid document', () => {
        const nullRepair = repairBlockDocument(null);
        expect(nullRepair.repaired).toBe(true);
        expect(nullRepair.document.format).toBe(BLOCK_DOCUMENT_FORMAT_IDENTIFIER);
        expect(nullRepair.document.version).toBe(CURRENT_BLOCK_DOCUMENT_VERSION);

        const deepValidation = validateBlockDocumentDeep(nullRepair.document);
        expect(deepValidation.valid).toBe(true);
      });
    });
  });
});
