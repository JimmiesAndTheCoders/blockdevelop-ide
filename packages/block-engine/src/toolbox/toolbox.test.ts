import { describe, it, expect } from 'vitest';
import {
  DEFAULT_TOOLBOX_DEFINITION,
  BlockDevelopToolboxCategory,
  registerCustomToolboxCategory,
} from './index';
import type { ToolboxBlockSpec } from '../types';

describe('Phase 4.2 - Section 7.1: Toolbox Reorganization Suite', () => {
  it('should expose valid default toolbox definition with 7 main categories including OOP & Architecture', () => {
    expect(DEFAULT_TOOLBOX_DEFINITION.kind).toBe('categoryToolbox');
    expect(DEFAULT_TOOLBOX_DEFINITION.contents.length).toBe(7);

    const categoryNames = DEFAULT_TOOLBOX_DEFINITION.contents.map((c) => c.name);
    expect(categoryNames).toContain('OOP & Architecture');
    expect(categoryNames).toContain('Types & Variables');
    expect(categoryNames).toContain('Lists & 2D Arrays');
    expect(categoryNames).toContain('Functions & Methods');
    expect(categoryNames).toContain('Logic & Control');
    expect(categoryNames).toContain('Mathematics');
    expect(categoryNames).toContain('Text & Strings');
  });

  it('should contain all required OOP blocks inside the "OOP & Architecture" category', () => {
    const oopCategory = DEFAULT_TOOLBOX_DEFINITION.contents.find(
      (c) => c.name === 'OOP & Architecture',
    );
    expect(oopCategory).toBeDefined();

    const blockTypes = (oopCategory?.contents || [])
      .filter((item): item is ToolboxBlockSpec => item.kind === 'block')
      .map((item) => item.type);

    // Packages & Imports
    expect(blockTypes).toContain('package_declaration');
    expect(blockTypes).toContain('import_type');
    expect(blockTypes).toContain('import_wildcard');
    expect(blockTypes).toContain('import_alias');
    expect(blockTypes).toContain('using_mixin');

    // Classes & Constructors
    expect(blockTypes).toContain('class_declaration');
    expect(blockTypes).toContain('class_constructor_declaration');
    expect(blockTypes).toContain('instance_instantiation');
    expect(blockTypes).toContain('super_constructor_call');

    // Interfaces
    expect(blockTypes).toContain('interface_declaration');
    expect(blockTypes).toContain('interface_method_signature');
    expect(blockTypes).toContain('interface_property_signature');

    // Enums
    expect(blockTypes).toContain('enum_declaration');
    expect(blockTypes).toContain('enum_constructor_item');
    expect(blockTypes).toContain('enum_constructor_parameterized');
    expect(blockTypes).toContain('enum_value_reference');
    expect(blockTypes).toContain('enum_pattern_match');

    // Properties
    expect(blockTypes).toContain('class_property_declaration');
    expect(blockTypes).toContain('property_getter_def');
    expect(blockTypes).toContain('property_setter_def');

    // Methods
    expect(blockTypes).toContain('class_method_declaration');
    expect(blockTypes).toContain('method_param_item');
  });

  it('should register custom BlockDevelopToolboxCategory without throwing', () => {
    expect(() => registerCustomToolboxCategory()).not.toThrow();
  });

  it('should instantiate BlockDevelopToolboxCategory class', () => {
    expect(BlockDevelopToolboxCategory).toBeDefined();
  });
});
