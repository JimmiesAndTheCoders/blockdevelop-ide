import { describe, it, expect } from 'vitest';
import { createIDEGridConfig, DEFAULT_IDE_GRID_CONFIG } from './grid';

describe('IDE Workspace Grid Configuration Suite', () => {
  it('should generate default grid configuration with 20px spacing and dark border color', () => {
    const config = createIDEGridConfig();
    expect(config.spacing).toBe(20);
    expect(config.colour).toBe('#3c3c3c');
    expect(config.snap).toBe(true);
  });

  it('should override spacing and snap options cleanly when specified', () => {
    const config = createIDEGridConfig({ spacing: 30, snap: false });
    expect(config.spacing).toBe(30);
    expect(config.snap).toBe(false);
    expect(config.colour).toBe(DEFAULT_IDE_GRID_CONFIG.colour);
  });
});
