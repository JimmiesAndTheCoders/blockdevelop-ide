import { describe, it, expect } from 'vitest';
import { filterToolboxCategories } from './search';
import { DEFAULT_TOOLBOX_DEFINITION } from './index';

describe('Toolbox Search Filter Engine', () => {
  it('should return original toolbox definition when query is empty', () => {
    const result = filterToolboxCategories(DEFAULT_TOOLBOX_DEFINITION, '');
    expect(result).toEqual(DEFAULT_TOOLBOX_DEFINITION);
  });

  it('should filter blocks by query matching block type or category name', () => {
    const result = filterToolboxCategories(DEFAULT_TOOLBOX_DEFINITION, 'event');
    expect(result.contents.length).toBe(1);
    const category = result.contents[0];
    expect(category?.name).toContain('Search: "event"');
    expect(category?.contents?.length).toBeGreaterThan(0);
  });

  it('should return empty result category when query matches no blocks', () => {
    const result = filterToolboxCategories(DEFAULT_TOOLBOX_DEFINITION, 'non_existent_query_xyz');
    expect(result.contents.length).toBe(1);
    expect(result.contents[0]?.name).toContain('No results');
  });
});
