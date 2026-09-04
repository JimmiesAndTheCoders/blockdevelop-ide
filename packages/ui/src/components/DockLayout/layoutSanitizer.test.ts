import { describe, it, expect } from 'vitest';
import { IJsonRowNode, IJsonTabSetNode } from 'flexlayout-react';
import { LayoutSanitizer } from './layoutSanitizer';
import { LayoutModelFactory, DEFAULT_WORKSPACE_LAYOUT_JSON } from './defaultLayout';

describe('LayoutSanitizer Baseline Suite', () => {
  it('should pass through valid layout JSON untouched', () => {
    const valid = LayoutModelFactory.createDefaultJson();
    const result = LayoutSanitizer.sanitize(valid);

    expect(result.layout).toBeDefined();
    expect(result.global).toBeDefined();
  });

  it('should fallback to default layout on null, non-object, or empty input', () => {
    expect(LayoutSanitizer.sanitize(null)).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
    expect(LayoutSanitizer.sanitize('invalid_string')).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
    expect(LayoutSanitizer.sanitize({})).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
  });

  it('should prune unknown component keys from saved layouts', () => {
    const malformed = {
      global: {},
      layout: {
        type: 'row',
        children: [
          {
            type: 'tabset',
            children: [
              { type: 'tab', id: 't1', name: 'Explorer', component: 'explorer' },
              {
                type: 'tab',
                id: 't2',
                name: 'Malicious Plugin',
                component: 'unknown_deprecated_plugin',
              },
            ],
          },
        ],
      },
    };

    const sanitized = LayoutSanitizer.sanitize(malformed);
    const rootRow = sanitized.layout as IJsonRowNode;
    const tabsetNode = rootRow.children[0] as IJsonTabSetNode;

    expect(tabsetNode.children.length).toBe(1);
    expect(tabsetNode.children[0]?.component).toBe('explorer');
  });

  it('should fallback gracefully if all tabs in candidate layout are invalid', () => {
    const allInvalid = {
      layout: {
        type: 'row',
        children: [
          {
            type: 'tabset',
            children: [
              { type: 'tab', id: 't1', name: 'Bad 1', component: 'corrupted_a' },
              { type: 'tab', id: 't2', name: 'Bad 2', component: 'corrupted_b' },
            ],
          },
        ],
      },
    };

    const sanitized = LayoutSanitizer.sanitize(allInvalid);
    expect(sanitized).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
  });
});
