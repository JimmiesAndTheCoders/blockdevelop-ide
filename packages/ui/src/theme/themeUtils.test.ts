import { describe, it, expect } from 'vitest';
import { getIDEThemeVariables } from './themeUtils';

describe('themeUtils', () => {
  it('should return dark theme variables by default', () => {
    const vars = getIDEThemeVariables('dark');
    expect(vars.bg).toBe('#181818');
    expect(vars.accent).toBe('#007acc');
  });

  it('should return light theme variables when requested', () => {
    const vars = getIDEThemeVariables('light');
    expect(vars.bg).toBe('#f3f3f3');
    expect(vars.text).toBe('#1e1e1e');
  });

  it('should return high contrast theme variables when requested', () => {
    const vars = getIDEThemeVariables('high-contrast');
    expect(vars.bg).toBe('#000000');
    expect(vars.border).toBe('#6fc06d');
  });
});
