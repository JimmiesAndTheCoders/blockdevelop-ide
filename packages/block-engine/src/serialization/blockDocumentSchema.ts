import * as Blockly from 'blockly/core';
import type { TargetPlatform } from '@blockdevelop/core';
import type { SerializedWorkspaceState } from '../types';
import { serializeWorkspaceToXml, deserializeWorkspaceFromXml } from './xmlSerialization';
import { serializeWorkspaceToJson, deserializeWorkspaceFromJson } from './jsonSerialization';

export const CURRENT_BLOCK_DOCUMENT_VERSION = '2.0.0' as const;
export const BLOCK_DOCUMENT_FORMAT_IDENTIFIER = 'blockdevelop-block' as const;

export type BlockFileType = 'class' | 'interface' | 'enum' | 'script' | 'package';

export interface ImportDeclarationSpec {
  kind: 'symbol' | 'wildcard' | 'alias' | 'using';
  path: string;
  alias?: string | undefined;
}

export interface BlockDocumentMetadata {
  title: string;
  author?: string | undefined;
  created: number;
  lastModified: number;
  targetPlatform?: TargetPlatform | string | undefined;
  compilerFlags?: string[] | undefined;
  description?: string | undefined;
  tags?: string[] | undefined;
}

/**
 * Standardized single-file `.block` document envelope (Version 2.0.0).
 */
export interface BlockFileDocument {
  format: typeof BLOCK_DOCUMENT_FORMAT_IDENTIFIER;
  version: typeof CURRENT_BLOCK_DOCUMENT_VERSION;
  id: string;
  metadata: BlockDocumentMetadata;
  fileType: BlockFileType;
  package: string;
  imports: ImportDeclarationSpec[];
  workspace: SerializedWorkspaceState;
}

/**
 * Legacy V1 Document format for backwards-compatibility checking.
 */
export interface LegacyV1WorkspaceState {
  version?: string | undefined;
  blocks?:
    | {
        languageVersion?: number | undefined;
        blocks?: Record<string, unknown>[] | undefined;
      }
    | undefined;
  variables?:
    | {
        name: string;
        id: string;
        type?: string | undefined;
      }[]
    | undefined;
  [key: string]: unknown;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

export interface CreateBlockDocumentOptions {
  id?: string | undefined;
  metadata?: Partial<BlockDocumentMetadata> | undefined;
  fileType?: BlockFileType | undefined;
  package?: string | undefined;
  imports?: ImportDeclarationSpec[] | undefined;
  workspace?: SerializedWorkspaceState | undefined;
}

/**
 * Generates a unique GUID/UUID string for document IDs.
 */
function generateDocumentId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a default standard BlockFileDocument envelope.
 */
export function createDefaultBlockDocument(
  options: CreateBlockDocumentOptions = {},
): BlockFileDocument {
  const now = Date.now();
  return {
    format: BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
    version: CURRENT_BLOCK_DOCUMENT_VERSION,
    id: options.id || generateDocumentId(),
    metadata: {
      title: options.metadata?.title || 'Untitled',
      author: options.metadata?.author,
      created: options.metadata?.created ?? now,
      lastModified: options.metadata?.lastModified ?? now,
      targetPlatform: options.metadata?.targetPlatform || 'html5',
      compilerFlags: options.metadata?.compilerFlags || [],
      description: options.metadata?.description,
      tags: options.metadata?.tags || [],
    },
    fileType: options.fileType || 'class',
    package: options.package || '',
    imports: options.imports || [],
    workspace: options.workspace || {
      version: '1.0.0',
      blocks: {
        languageVersion: 0,
        blocks: [],
      },
      variables: [],
    },
  };
}

/**
 * Validates a raw document structure against the BlockFileDocument (v2.0.0) JSON schema.
 */
export function validateBlockDocumentSchema(raw: unknown): SchemaValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { valid: false, errors: ['Document must be a non-null object.'] };
  }

  const doc = raw as Record<string, unknown>;

  if (doc.format !== BLOCK_DOCUMENT_FORMAT_IDENTIFIER) {
    errors.push(
      `Invalid or missing format identifier. Expected '${BLOCK_DOCUMENT_FORMAT_IDENTIFIER}', got '${String(doc.format)}'.`,
    );
  }

  if (doc.version !== CURRENT_BLOCK_DOCUMENT_VERSION) {
    errors.push(
      `Unsupported schema version. Expected '${CURRENT_BLOCK_DOCUMENT_VERSION}', got '${String(doc.version)}'.`,
    );
  }

  if (typeof doc.id !== 'string' || !doc.id.trim()) {
    errors.push('Document property "id" must be a non-empty string.');
  }

  if (!doc.metadata || typeof doc.metadata !== 'object') {
    errors.push('Document property "metadata" must be a valid metadata object.');
  } else {
    const meta = doc.metadata as Record<string, unknown>;
    if (typeof meta.title !== 'string') {
      errors.push('Metadata property "title" must be a string.');
    }
  }

  const validFileTypes = new Set(['class', 'interface', 'enum', 'script', 'package']);
  if (typeof doc.fileType !== 'string' || !validFileTypes.has(doc.fileType)) {
    errors.push(`Invalid fileType. Expected one of: ${Array.from(validFileTypes).join(', ')}.`);
  }

  if (typeof doc.package !== 'string') {
    errors.push('Document property "package" must be a string.');
  }

  if (!Array.isArray(doc.imports)) {
    errors.push('Document property "imports" must be an array.');
  }

  if (!doc.workspace || typeof doc.workspace !== 'object') {
    errors.push('Document property "workspace" must be a valid workspace state object.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Migration pipeline: Automatically upgrades legacy V1 format documents or incomplete structures into valid V2.0.0 BlockFileDocuments.
 */
export function migrateBlockSchema(input: unknown): BlockFileDocument {
  if (!input || typeof input !== 'object') {
    return createDefaultBlockDocument();
  }

  const raw = input as Record<string, unknown>;
  const now = Date.now();

  const rawMeta =
    raw.metadata && typeof raw.metadata === 'object'
      ? (raw.metadata as Record<string, unknown>)
      : {};

  const title =
    typeof rawMeta.title === 'string' && rawMeta.title
      ? rawMeta.title
      : typeof raw.title === 'string' && raw.title
        ? raw.title
        : 'Untitled';

  const author =
    typeof rawMeta.author === 'string'
      ? rawMeta.author
      : typeof raw.author === 'string'
        ? raw.author
        : undefined;

  const created =
    typeof rawMeta.created === 'number'
      ? rawMeta.created
      : typeof raw.created === 'number'
        ? raw.created
        : now;

  const lastModified =
    typeof rawMeta.lastModified === 'number' ? rawMeta.lastModified : now;

  const targetPlatform =
    typeof rawMeta.targetPlatform === 'string'
      ? (rawMeta.targetPlatform as TargetPlatform)
      : typeof raw.targetPlatform === 'string'
        ? (raw.targetPlatform as TargetPlatform)
        : undefined;

  const compilerFlags = Array.isArray(rawMeta.compilerFlags)
    ? (rawMeta.compilerFlags as string[])
    : Array.isArray(raw.compilerFlags)
      ? (raw.compilerFlags as string[])
      : undefined;

  const description =
    typeof rawMeta.description === 'string' ? rawMeta.description : undefined;

  const tags = Array.isArray(rawMeta.tags) ? (rawMeta.tags as string[]) : undefined;

  const rawWs =
    raw.workspace && typeof raw.workspace === 'object'
      ? (raw.workspace as Record<string, unknown>)
      : {};

  const workspaceData: SerializedWorkspaceState = {
    version:
      typeof rawWs.version === 'string'
        ? rawWs.version
        : typeof raw.version === 'string'
          ? raw.version
          : '1.0.0',
    blocks:
      rawWs.blocks && typeof rawWs.blocks === 'object'
        ? (rawWs.blocks as SerializedWorkspaceState['blocks'])
        : raw.blocks && typeof raw.blocks === 'object'
          ? (raw.blocks as SerializedWorkspaceState['blocks'])
          : { languageVersion: 0, blocks: [] },
    variables: Array.isArray(rawWs.variables)
      ? (rawWs.variables as SerializedWorkspaceState['variables'])
      : Array.isArray(raw.variables)
        ? (raw.variables as SerializedWorkspaceState['variables'])
        : [],
  };

  const fileType: BlockFileType =
    typeof raw.fileType === 'string' &&
    ['class', 'interface', 'enum', 'script', 'package'].includes(raw.fileType)
      ? (raw.fileType as BlockFileType)
      : 'class';

  const pkg = typeof raw.package === 'string' ? raw.package : '';
  const imports = Array.isArray(raw.imports) ? (raw.imports as ImportDeclarationSpec[]) : [];

  return {
    format: BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
    version: CURRENT_BLOCK_DOCUMENT_VERSION,
    id: typeof raw.id === 'string' && raw.id ? raw.id : generateDocumentId(),
    metadata: {
      title,
      author,
      created,
      lastModified,
      targetPlatform,
      compilerFlags,
      description,
      tags,
    },
    fileType,
    package: pkg,
    imports,
    workspace: workspaceData,
  };
}

/**
 * Serializes a BlockFileDocument to canonical `.block` JSON string.
 */
export function serializeBlockDocumentToJson(
  document: BlockFileDocument,
  pretty = true,
): string {
  document.metadata.lastModified = Date.now();
  return pretty ? JSON.stringify(document, null, 2) : JSON.stringify(document);
}

/**
 * Deserializes a canonical `.block` JSON string into a validated BlockFileDocument with auto-migration.
 */
export function deserializeBlockDocumentFromJson(jsonInput: string | unknown): BlockFileDocument {
  if (typeof jsonInput === 'string') {
    try {
      const parsed = JSON.parse(jsonInput);
      return migrateBlockSchema(parsed);
    } catch (err) {
      console.warn('[BlockDocumentSchema] JSON parse error, generating default document:', err);
      return createDefaultBlockDocument();
    }
  }

  return migrateBlockSchema(jsonInput);
}

/**
 * Converts XML special characters to escaped entities.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Serializes a BlockFileDocument into a lossless XML compatibility envelope.
 */
export function serializeBlockDocumentToXml(
  doc: BlockFileDocument,
  workspaceSource?: Blockly.WorkspaceSvg | Blockly.Workspace,
): string {
  let innerWorkspaceXml = '';

  if (workspaceSource) {
    innerWorkspaceXml = serializeWorkspaceToXml(workspaceSource, true);
  } else {
    const tempWs = new Blockly.Workspace();
    deserializeWorkspaceFromJson(tempWs, doc.workspace);
    innerWorkspaceXml = serializeWorkspaceToXml(tempWs, true);
    tempWs.dispose();
  }

  const importsXml = doc.imports
    .map((imp) => {
      const aliasAttr = imp.alias ? ` alias="${escapeXml(imp.alias)}"` : '';
      return `    <import kind="${escapeXml(imp.kind)}" path="${escapeXml(imp.path)}"${aliasAttr}/>`;
    })
    .join('\n');

  const compilerFlagsXml = (doc.metadata.compilerFlags || [])
    .map((flag) => `      <flag>${escapeXml(flag)}</flag>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<blockdevelop-document format="${doc.format}" version="${doc.version}" id="${doc.id}">
  <metadata>
    <title>${escapeXml(doc.metadata.title)}</title>
    ${doc.metadata.author ? `<author>${escapeXml(doc.metadata.author)}</author>` : ''}
    <created>${doc.metadata.created}</created>
    <lastModified>${Date.now()}</lastModified>
    ${doc.metadata.targetPlatform ? `<targetPlatform>${escapeXml(doc.metadata.targetPlatform)}</targetPlatform>` : ''}
    ${doc.metadata.description ? `<description>${escapeXml(doc.metadata.description)}</description>` : ''}
    <compilerFlags>
${compilerFlagsXml}
    </compilerFlags>
  </metadata>
  <header>
    <fileType>${doc.fileType}</fileType>
    <package>${escapeXml(doc.package)}</package>
    <imports>
${importsXml}
    </imports>
  </header>
  <workspace-content>
${innerWorkspaceXml}
  </workspace-content>
</blockdevelop-document>`;
}

/**
 * Deserializes an XML compatibility document envelope into a BlockFileDocument.
 */
export function deserializeBlockDocumentFromXml(xmlText: string): BlockFileDocument {
  if (!xmlText || !xmlText.trim()) {
    return createDefaultBlockDocument();
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    const root = doc.querySelector('blockdevelop-document');
    if (!root) {
      // Fallback for bare Blockly <xml> files
      const tempWs = new Blockly.Workspace();
      deserializeWorkspaceFromXml(tempWs, xmlText);
      const wsState = serializeWorkspaceToJson(tempWs);
      tempWs.dispose();

      return createDefaultBlockDocument({
        workspace: wsState,
      });
    }

    const id = root.getAttribute('id') || generateDocumentId();
    const title = root.querySelector('metadata > title')?.textContent || 'Untitled';
    const author = root.querySelector('metadata > author')?.textContent || undefined;
    const created = parseInt(root.querySelector('metadata > created')?.textContent || '0', 10) || Date.now();
    const lastModified = parseInt(root.querySelector('metadata > lastModified')?.textContent || '0', 10) || Date.now();
    const targetPlatform = (root.querySelector('metadata > targetPlatform')?.textContent as TargetPlatform) || undefined;
    const description = root.querySelector('metadata > description')?.textContent || undefined;

    const flagElements = root.querySelectorAll('metadata > compilerFlags > flag');
    const compilerFlags: string[] = [];
    flagElements.forEach((el) => {
      if (el.textContent) compilerFlags.push(el.textContent.trim());
    });

    const fileType = (root.querySelector('header > fileType')?.textContent || 'class') as BlockFileType;
    const pkg = root.querySelector('header > package')?.textContent || '';

    const importElements = root.querySelectorAll('header > imports > import');
    const imports: ImportDeclarationSpec[] = [];
    importElements.forEach((el) => {
      const kind = (el.getAttribute('kind') || 'symbol') as ImportDeclarationSpec['kind'];
      const path = el.getAttribute('path') || '';
      const alias = el.getAttribute('alias') || undefined;
      if (path) {
        imports.push({ kind, path, alias });
      }
    });

    const workspaceContent = root.querySelector('workspace-content');
    let wsState: SerializedWorkspaceState = { version: '1.0.0', blocks: { languageVersion: 0, blocks: [] } };

    if (workspaceContent) {
      const xmlNode = workspaceContent.querySelector('xml') || workspaceContent.firstElementChild;
      if (xmlNode) {
        const tempWs = new Blockly.Workspace();
        Blockly.Xml.domToWorkspace(xmlNode as Element, tempWs);
        wsState = serializeWorkspaceToJson(tempWs);
        tempWs.dispose();
      }
    }

    return {
      format: BLOCK_DOCUMENT_FORMAT_IDENTIFIER,
      version: CURRENT_BLOCK_DOCUMENT_VERSION,
      id,
      metadata: {
        title,
        author,
        created,
        lastModified,
        targetPlatform,
        compilerFlags,
        description,
      },
      fileType,
      package: pkg,
      imports,
      workspace: wsState,
    };
  } catch (err) {
    console.error('[BlockDocumentSchema] Failed to parse XML document envelope:', err);
    return createDefaultBlockDocument();
  }
}
