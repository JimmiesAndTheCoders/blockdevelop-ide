import { describe, it, expect } from 'vitest';
import { Model } from 'flexlayout-react';
import {
  LayoutModelFactory,
  LAYOUT_PRESETS,
  LayoutPresetType,
  DEFAULT_WORKSPACE_LAYOUT_JSON,
  VISUAL_BUILDER_LAYOUT_JSON,
  CODE_CENTRIC_LAYOUT_JSON,
  DEBUGGER_LAYOUT_JSON,
} from './defaultLayout';
import { LayoutSanitizer } from './layoutSanitizer';

describe('Layout Presets Engine & Model Factory', () => {
  const presets: LayoutPresetType[] = ['default', 'visual-builder', 'code-centric', 'debugger'];

  it('should expose metadata catalog for all 4 layout presets', () => {
    presets.forEach((presetKey) => {
      const metadata = LAYOUT_PRESETS[presetKey];
      expect(metadata).toBeDefined();
      expect(metadata.id).toBe(presetKey);
      expect(metadata.name.length).toBeGreaterThan(0);
      expect(metadata.description.length).toBeGreaterThan(0);
    });
  });

  it('should generate valid JSON models for all 4 layout presets', () => {
    expect(LayoutModelFactory.createPresetJson('default')).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
    expect(LayoutModelFactory.createPresetJson('visual-builder')).toEqual(VISUAL_BUILDER_LAYOUT_JSON);
    expect(LayoutModelFactory.createPresetJson('code-centric')).toEqual(CODE_CENTRIC_LAYOUT_JSON);
    expect(LayoutModelFactory.createPresetJson('debugger')).toEqual(DEBUGGER_LAYOUT_JSON);
  });

  it('should instantiate FlexLayout Model instances without throwing for all presets', () => {
    presets.forEach((presetKey) => {
      const model = LayoutModelFactory.createPresetModel(presetKey);
      expect(model).toBeInstanceOf(Model);
    });
  });

  it('should pass layout sanitization for all preset models', () => {
    presets.forEach((presetKey) => {
      const presetJson = LayoutModelFactory.createPresetJson(presetKey);
      const sanitized = LayoutSanitizer.sanitize(presetJson);
      expect(sanitized.layout).toBeDefined();
      expect(sanitized.global).toBeDefined();
    });
  });
});