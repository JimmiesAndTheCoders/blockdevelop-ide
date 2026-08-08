import { describe, it, expect } from 'vitest';
import { wrapIPCHandler } from './errorHandling';
import { IpcMainInvokeEvent } from 'electron';

describe('IPC Error Handling Engine', () => {
  it('should pass through successful handler results', async () => {
    const handler = wrapIPCHandler('test:channel', async () => 'success_result');
    const mockEvent = {} as IpcMainInvokeEvent;
    const result = await handler(mockEvent);
    expect(result).toBe('success_result');
  });

  it('should serialize thrown errors into JSON error payloads', async () => {
    const handler = wrapIPCHandler('test:channel', async () => {
      throw new Error('Test main process error');
    });
    const mockEvent = {} as IpcMainInvokeEvent;

    await expect(handler(mockEvent)).rejects.toThrow();

    try {
      await handler(mockEvent);
    } catch (err: unknown) {
      const parsed = JSON.parse((err as Error).message);
      expect(parsed.name).toBe('Error');
      expect(parsed.message).toBe('Test main process error');
      expect(parsed.channel).toBe('test:channel');
    }
  });
});
