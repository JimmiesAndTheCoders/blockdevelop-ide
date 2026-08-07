import { describe, it, expect } from 'vitest';
import { IPC_CHANNELS } from './ipc';

describe('IPC Channels Sanity Suite', () => {
  it('should have non-empty unique channel names', () => {
    const channelValues = Object.values(IPC_CHANNELS);
    expect(channelValues.length).toBeGreaterThan(0);

    // Verify all channel names are unique
    const uniqueChannels = new Set(channelValues);
    expect(uniqueChannels.size).toEqual(channelValues.length);
  });

  it('should match standard namespace formatting (namespace:action)', () => {
    Object.values(IPC_CHANNELS).forEach((channel) => {
      expect(channel).toMatch(/^[a-z]+:[a-z-]+$/);
    });
  });
});
