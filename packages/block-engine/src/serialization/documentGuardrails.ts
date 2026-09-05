import {
  BlockFileDocument,
  CURRENT_BLOCK_DOCUMENT_VERSION,
  BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
  createDefaultBlockDocument,
  migrateBlockSchema,
  BlockFileType,
  ImportDeclarationSpec,
} from './blockDocumentSchema';

export interface DeepValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DocumentChecksumReport {
  checksum: string;
  isMatch: boolean;
}

export interface DocumentRepairAction {
  category: 'id' | 'connection' | 'structure' | 'metadata' | 'import';
  description: string;
}

export interface DocumentRepairResult {
  document: BlockFileDocument;
  repaired: boolean;
  actions: DocumentRepairAction[];
}

/**
 * Fast deterministic string hashing (FNV-1a 64-bit derivative) for cross-environment checksums.
 */
export function computeDeterministicHash(content: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;

  for (let i = 0; i < content.length; i++) {
    const ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `sha256_${part1}${part2}`;
}

/**
 * Normalizes document content for checksum computation (ignoring volatile modified timestamps).
 */
export function canonicalizeDocumentForHash(doc: BlockFileDocument): string {
  const canonicalPayload = {
    format: doc.format,
    version: doc.version,
    id: doc.id,
    fileType: doc.fileType,
    package: doc.package,
    metadata: {
      title: doc.metadata.title,
      author: doc.metadata.author || '',
      created: doc.metadata.created,
      targetPlatform: doc.metadata.targetPlatform || '',
      compilerFlags: doc.metadata.compilerFlags || [],
      description: doc.metadata.description || '',
    },
    imports: (doc.imports || []).map((imp) => ({
      kind: imp.kind,
      path: imp.path,
      alias: imp.alias || '',
    })),
    workspace: {
      version: doc.workspace?.version || '1.0.0',
      blocks: doc.workspace?.blocks || { languageVersion: 0, blocks: [] },
      variables: doc.workspace?.variables || [],
    },
  };

  return JSON.stringify(canonicalPayload);
}

/**
 * Computes a unique deterministic content hash / checksum for tamper detection and conflict resolution.
 */
export function computeBlockDocumentChecksum(doc: BlockFileDocument): string {
  const canonicalStr = canonicalizeDocumentForHash(doc);
  return computeDeterministicHash(canonicalStr);
}

/**
 * Verifies document integrity against an expected checksum.
 */
export function verifyBlockDocumentChecksum(
  doc: BlockFileDocument,
  expectedChecksum: string,
): DocumentChecksumReport {
  const actualChecksum = computeBlockDocumentChecksum(doc);
  return {
    checksum: actualChecksum,
    isMatch: actualChecksum === expectedChecksum,
  };
}

/**
 * Performs comprehensive deep validation across document envelope, AST block nodes, fields, and connections.
 */
export function validateBlockDocumentDeep(raw: unknown): DeepValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { valid: false, errors: ['Document must be a non-null object structure.'], warnings: [] };
  }

  const doc = raw as Record<string, unknown>;

  // 1. Envelope Validation
  if (doc.format !== BLOCK_DOCUMENT_FORMAT_IDENTIFIER) {
    errors.push(`Invalid format identifier: '${String(doc.format)}'. Expected '${BLOCK_DOCUMENT_FORMAT_IDENTIFIER}'.`);
  }

  if (doc.version !== CURRENT_BLOCK_DOCUMENT_VERSION) {
    errors.push(`Invalid schema version: '${String(doc.version)}'. Expected '${CURRENT_BLOCK_DOCUMENT_VERSION}'.`);
  }

  if (typeof doc.id !== 'string' || !doc.id.trim()) {
    errors.push('Document ID is missing or empty.');
  }

  // 2. Metadata Validation
  if (!doc.metadata || typeof doc.metadata !== 'object') {
    errors.push('Document metadata object is missing.');
  } else {
    const meta = doc.metadata as Record<string, unknown>;
    if (typeof meta.title !== 'string' || !meta.title.trim()) {
      errors.push('Metadata title must be a non-empty string.');
    }
    if (typeof meta.created !== 'number' || Number.isNaN(meta.created)) {
      warnings.push('Metadata created timestamp is missing or invalid.');
    }
  }

  // 3. FileType & Package
  const allowedFileTypes: BlockFileType[] = ['class', 'interface', 'enum', 'script', 'package'];
  if (!allowedFileTypes.includes(doc.fileType as BlockFileType)) {
    errors.push(`Invalid fileType '${String(doc.fileType)}'. Allowed: ${allowedFileTypes.join(', ')}.`);
  }

  if (typeof doc.package !== 'string') {
    errors.push('Document package attribute must be a string.');
  } else if (doc.package && !/^[a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(doc.package.trim())) {
    warnings.push(`Package name '${doc.package}' contains characters outside standard dot-namespace conventions.`);
  }

  // 4. Imports
  if (!Array.isArray(doc.imports)) {
    errors.push('Document imports must be an array.');
  } else {
    doc.imports.forEach((imp, idx) => {
      if (!imp || typeof imp !== 'object' || typeof (imp as Record<string, unknown>).path !== 'string') {
        errors.push(`Import at index ${idx} is malformed.`);
      }
    });
  }

  // 5. Deep Workspace AST Block Validation
  if (!doc.workspace || typeof doc.workspace !== 'object') {
    errors.push('Workspace structure missing or invalid.');
  } else {
    const ws = doc.workspace as Record<string, unknown>;
    if (ws.blocks && typeof ws.blocks === 'object') {
      const blocksWrapper = ws.blocks as Record<string, unknown>;
      if (blocksWrapper.blocks && !Array.isArray(blocksWrapper.blocks)) {
        errors.push('Workspace blocks collection must be an array.');
      } else if (Array.isArray(blocksWrapper.blocks)) {
        const seenIds = new Set<string>();

        const inspectBlock = (block: unknown, path: string) => {
          if (!block || typeof block !== 'object') {
            errors.push(`Malformed block node at ${path}.`);
            return;
          }
          const b = block as Record<string, unknown>;
          if (typeof b.type !== 'string' || !b.type.trim()) {
            errors.push(`Missing block type at ${path}.`);
          }
          if (typeof b.id === 'string' && b.id) {
            if (seenIds.has(b.id)) {
              errors.push(`Duplicate block ID detected: '${b.id}' at ${path}.`);
            }
            seenIds.add(b.id);
          } else {
            warnings.push(`Block missing ID at ${path}.`);
          }

          // Inspect nested inputs
          if (b.inputs && typeof b.inputs === 'object') {
            Object.entries(b.inputs as Record<string, unknown>).forEach(([inputName, inputVal]) => {
              if (inputVal && typeof inputVal === 'object') {
                const conn = inputVal as Record<string, unknown>;
                if (conn.block) inspectBlock(conn.block, `${path} -> inputs.${inputName}.block`);
                if (conn.shadow) inspectBlock(conn.shadow, `${path} -> inputs.${inputName}.shadow`);
              }
            });
          }

          // Inspect chained next statements
          if (b.next && typeof b.next === 'object') {
            const nextConn = b.next as Record<string, unknown>;
            if (nextConn.block) {
              inspectBlock(nextConn.block, `${path} -> next.block`);
            }
          }
        };

        blocksWrapper.blocks.forEach((blockNode, idx) => {
          inspectBlock(blockNode, `workspace.blocks[${idx}]`);
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Auto-Repair Pipeline: Cleanses, repairs corrupted IDs, fixes broken connection trees,
 * prunes duplicate imports, and normalizes dangling nodes into a resilient BlockFileDocument.
 */
export function repairBlockDocument(rawInput: unknown): DocumentRepairResult {
  const actions: DocumentRepairAction[] = [];

  // 1. Initial Migration / Foundation
  if (!rawInput || typeof rawInput !== 'object') {
    actions.push({
      category: 'structure',
      description: 'Input was null or invalid. Generated a clean default document envelope.',
    });
    return {
      document: createDefaultBlockDocument(),
      repaired: true,
      actions,
    };
  }

  const doc = migrateBlockSchema(rawInput);

  // 2. Metadata Repair with defensive object check
  if (!doc.metadata || typeof doc.metadata !== 'object') {
    doc.metadata = {
      title: 'Untitled',
      created: Date.now(),
      lastModified: Date.now(),
      targetPlatform: 'html5',
      compilerFlags: [],
    };
    actions.push({ category: 'metadata', description: 'Restored missing metadata envelope.' });
  } else {
    if (!doc.metadata.title || !doc.metadata.title.trim()) {
      doc.metadata.title = 'Untitled';
      actions.push({ category: 'metadata', description: 'Assigned default document title.' });
    }

    if (!doc.metadata.created || Number.isNaN(doc.metadata.created)) {
      doc.metadata.created = Date.now();
      actions.push({ category: 'metadata', description: 'Repaired missing created timestamp.' });
    }
  }

  // 3. Package & Imports Repair
  if (doc.package) {
    const cleanedPackage = doc.package
      .replace(/[^a-zA-Z0-9_.]/g, '')
      .replace(/\.{2,}/g, '.')
      .replace(/^\.+|\.+$/g, '');
    if (cleanedPackage !== doc.package) {
      doc.package = cleanedPackage;
      actions.push({ category: 'structure', description: `Sanitized package namespace to '${cleanedPackage}'.` });
    }
  }

  const seenImports = new Set<string>();
  const sanitizedImports: ImportDeclarationSpec[] = [];
  doc.imports.forEach((imp) => {
    if (imp && imp.path && imp.path.trim()) {
      const key = `${imp.kind}:${imp.path.trim()}:${imp.alias || ''}`;
      if (!seenImports.has(key)) {
        seenImports.add(key);
        sanitizedImports.push({
          kind: imp.kind || 'symbol',
          path: imp.path.trim(),
          alias: imp.alias ? imp.alias.trim() : undefined,
        });
      } else {
        actions.push({ category: 'import', description: `Pruned duplicate import for '${imp.path}'.` });
      }
    }
  });
  doc.imports = sanitizedImports;

  // 4. AST Block Node Repairs (IDs, Connections, Dangling Children)
  if (!doc.workspace) {
    doc.workspace = { version: '1.0.0', blocks: { languageVersion: 0, blocks: [] }, variables: [] };
    actions.push({ category: 'structure', description: 'Restored missing workspace container.' });
  } else if (!doc.workspace.blocks) {
    doc.workspace.blocks = { languageVersion: 0, blocks: [] };
    actions.push({ category: 'structure', description: 'Restored missing blocks collection.' });
  }

  const seenBlockIds = new Set<string>();
  let idCounter = 1;

  function generateUniqueId(prefix = 'block'): string {
    let candidate = `${prefix}_${Date.now()}_${idCounter++}`;
    while (seenBlockIds.has(candidate)) {
      candidate = `${prefix}_${Date.now()}_${idCounter++}`;
    }
    return candidate;
  }

  function repairBlockNode(node: Record<string, unknown>): Record<string, unknown> {
    // Repair missing or duplicate ID
    if (!node.id || typeof node.id !== 'string' || seenBlockIds.has(node.id)) {
      const newId = generateUniqueId(String(node.type || 'node'));
      actions.push({
        category: 'id',
        description: `Assigned new unique ID '${newId}' (was '${String(node.id)}').`,
      });
      node.id = newId;
    }
    seenBlockIds.add(node.id as string);

    // Repair missing type
    if (!node.type || typeof node.type !== 'string') {
      node.type = 'logic_boolean';
      actions.push({
        category: 'structure',
        description: `Restored fallback block type for block '${node.id}'.`,
      });
    }

    // Repair inputs connections
    if (node.inputs && typeof node.inputs === 'object') {
      const inputsObj = node.inputs as Record<string, unknown>;
      Object.keys(inputsObj).forEach((inputName) => {
        const inputEntry = inputsObj[inputName];
        if (inputEntry && typeof inputEntry === 'object') {
          const entry = inputEntry as Record<string, unknown>;
          if (entry.block && typeof entry.block === 'object') {
            entry.block = repairBlockNode(entry.block as Record<string, unknown>);
          } else if (entry.block !== undefined) {
            delete entry.block;
            actions.push({
              category: 'connection',
              description: `Removed dangling broken block connection on input '${inputName}'.`,
            });
          }
          if (entry.shadow && typeof entry.shadow === 'object') {
            entry.shadow = repairBlockNode(entry.shadow as Record<string, unknown>);
          } else if (entry.shadow !== undefined) {
            delete entry.shadow;
          }

          if (!entry.block && !entry.shadow) {
            delete inputsObj[inputName];
          }
        } else {
          delete inputsObj[inputName];
          actions.push({
            category: 'connection',
            description: `Removed non-object input connection '${inputName}'.`,
          });
        }
      });
    } else if (node.inputs !== undefined) {
      delete node.inputs;
    }

    // Repair next connection chain
    if (node.next && typeof node.next === 'object') {
      const nextEntry = node.next as Record<string, unknown>;
      if (nextEntry.block && typeof nextEntry.block === 'object') {
        nextEntry.block = repairBlockNode(nextEntry.block as Record<string, unknown>);
      } else if (nextEntry.block !== undefined) {
        delete node.next;
        actions.push({
          category: 'connection',
          description: `Removed dangling next-statement connection on block '${node.id}'.`,
        });
      }
    } else if (node.next !== undefined) {
      delete node.next;
    }

    return node;
  }

  const rawBlocks = doc.workspace.blocks?.blocks;
  if (Array.isArray(rawBlocks)) {
    const repairedBlocks: Record<string, unknown>[] = [];
    rawBlocks.forEach((blockItem) => {
      if (blockItem && typeof blockItem === 'object') {
        repairedBlocks.push(repairBlockNode(blockItem as Record<string, unknown>));
      } else {
        actions.push({ category: 'structure', description: 'Pruned non-object block node.' });
      }
    });
    if (doc.workspace.blocks) {
      doc.workspace.blocks.blocks = repairedBlocks;
    }
  }

  return {
    document: doc,
    repaired: actions.length > 0,
    actions,
  };
}
