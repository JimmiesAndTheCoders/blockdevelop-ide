/**
 * @blockdevelop/code-gen
 * Code generation pipelines translating Blockly XML/JSON to target languages.
 */

import { IDE_METADATA } from '@blockdevelop/core';

export type TargetLanguage = 'javascript' | 'typescript' | 'python' | 'haxe' | 'cpp' | 'lua';

export interface GenerationResult {
  code: string;
  language: TargetLanguage;
  errors: string[];
}

export function getSupportedLanguages(): TargetLanguage[] {
  return ['javascript', 'typescript', 'python', 'haxe', 'cpp', 'lua'];
}

export function getGeneratorVersion(): string {
  return `${IDE_METADATA.NAME} Code Generator v${IDE_METADATA.VERSION}`;
}
