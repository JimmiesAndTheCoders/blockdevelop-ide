import { describe, it, expect } from 'vitest';
import {
  initializeBlockEngine,
  createBlockDevelopDarkTheme,
  CORE_BLOCK_DEFINITIONS,
  DEFAULT_TOOLBOX_DEFINITION,
  registerBlockDefinitions,
  registerCustomContextMenuOptions,
} from './index';

describe('Block Engine Core Suite', () => {
  it('should return initialization metadata string', () => {
    const result = initializeBlockEngine();
    expect(result).toContain('Block Engine Initialized');
  });

  it('should define blockdevelop-dark custom theme', () => {
    const theme = createBlockDevelopDarkTheme();
    expect(theme.name).toBe('blockdevelop-dark');
  });

  it('should expose baseline core block definitions', () => {
    expect(CORE_BLOCK_DEFINITIONS.length).toBeGreaterThan(0);
    expect(CORE_BLOCK_DEFINITIONS[0]?.type).toBe('event_on_start');
  });

  it('should expose default toolbox categories', () => {
    expect(DEFAULT_TOOLBOX_DEFINITION.contents.length).toBeGreaterThan(0);
  });

  it('should register block definitions without throwing', () => {
    expect(() => registerBlockDefinitions()).not.toThrow();
  });

  it('should register custom context menu items without throwing', () => {
    expect(() => registerCustomContextMenuOptions()).not.toThrow();
  });
});
