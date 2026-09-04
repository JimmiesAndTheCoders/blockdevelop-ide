import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TOOLBOX_DEFINITION,
  BlockDevelopToolboxCategory,
  registerCustomToolboxCategory,
} from './index';

describe('Toolbox & Category Navigation Suite', () => {
  it('should expose valid default toolbox definition with 7 main categories', () => {
    expect(DEFAULT_TOOLBOX_DEFINITION.kind).toBe('categoryToolbox');
    expect(DEFAULT_TOOLBOX_DEFINITION.contents.length).toBe(7);

    const categoryNames = DEFAULT_TOOLBOX_DEFINITION.contents.map((c) => c.name);
    expect(categoryNames).toContain('Structure & Classes');
    expect(categoryNames).toContain('Types & Variables');
    expect(categoryNames).toContain('Lists & 2D Arrays');
    expect(categoryNames).toContain('Functions & Methods');
    expect(categoryNames).toContain('Logic & Control');
    expect(categoryNames).toContain('Mathematics');
    expect(categoryNames).toContain('Text & Strings');
  });

  it('should register custom BlockDevelopToolboxCategory without throwing', () => {
    expect(() => registerCustomToolboxCategory()).not.toThrow();
  });

  it('should instantiate BlockDevelopToolboxCategory class', () => {
    expect(BlockDevelopToolboxCategory).toBeDefined();
  });
});
