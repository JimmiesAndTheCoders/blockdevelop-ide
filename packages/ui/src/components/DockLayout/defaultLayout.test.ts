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

describe('LayoutModelFactory & Serialization / Deserialization Suite', () => {
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
      expect(model.getNodeById('editor-main')).toBeDefined();
    });
  });

  it('should verify serialization and deserialization roundtrip preserves layout tree structure', () => {
    presets.forEach((presetKey) => {
      const originalJson = LayoutModelFactory.createPresetJson(presetKey);
      const serializedStr = JSON.stringify(originalJson);
      const deserializedJson = JSON.parse(serializedStr);
      const sanitized = LayoutSanitizer.sanitize(deserializedJson);

      const modelFromOriginal = Model.fromJson(originalJson);
      const modelFromDeserialized = Model.fromJson(sanitized);

      expect(modelFromOriginal).toBeInstanceOf(Model);
      expect(modelFromDeserialized).toBeInstanceOf(Model);
    });
  });

  it('should auto-recover when safeCreateModel or safeCreateJson receives corrupted or null input', () => {
    const safeModel = LayoutModelFactory.safeCreateModel({ corrupted_invalid: true });
    expect(safeModel).toBeInstanceOf(Model);

    const safeModelFromNull = LayoutModelFactory.safeCreateModel(null);
    expect(safeModelFromNull).toBeInstanceOf(Model);

    const safeJson = LayoutModelFactory.safeCreateJson(null);
    expect(safeJson).toEqual(DEFAULT_WORKSPACE_LAYOUT_JSON);
  });

  it('should pass layout sanitization for all preset models', () => {
    presets.forEach((presetKey) => {
      const presetJson = LayoutModelFactory.createPresetJson(presetKey);
      const sanitized = LayoutSanitizer.sanitize(presetJson);
      expect(sanitized.layout).toBeDefined();
      expect(sanitized.global?.tabSetMinWidth).toBe(180);
      expect(sanitized.global?.tabSetMinHeight).toBe(120);
    });
  });
});
