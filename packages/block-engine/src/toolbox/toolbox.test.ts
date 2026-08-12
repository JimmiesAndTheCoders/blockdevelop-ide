import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TOOLBOX_DEFINITION,
  BlockDevelopToolboxCategory,
  registerCustomToolboxCategory,
} from './index';

describe('Toolbox & Category Navigation Suite', () => {
  it('should expose valid default toolbox definition', () => {
    expect(DEFAULT_TOOLBOX_DEFINITION.kind).toBe('categoryToolbox');
    expect(DEFAULT_TOOLBOX_DEFINITION.contents.length).toBeGreaterThan(0);
  });

  it('should register custom BlockDevelopToolboxCategory without throwing', () => {
    expect(() => registerCustomToolboxCategory()).not.toThrow();
  });

  it('should instantiate BlockDevelopToolboxCategory class', () => {
    expect(BlockDevelopToolboxCategory).toBeDefined();
  });
});
