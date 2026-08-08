import { IpcMainInvokeEvent } from 'electron';
import { IPCSerializedError } from '@blockdevelop/core';

/**
 * Wraps an ipcMain handler to catch exceptions and serialize them cleanly across context isolation boundaries.
 */
export function wrapIPCHandler<TArgs extends unknown[], TReturn>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: TArgs) => Promise<TReturn> | TReturn
) {
  return async (event: IpcMainInvokeEvent, ...args: TArgs): Promise<TReturn> => {
    try {
      return await handler(event, ...args);
    } catch (err: unknown) {
      const errorObj = err as { name?: string; message?: string; code?: string; stack?: string };
      console.error(`[IPC Error] Channel '${channel}' threw error:`, errorObj.message || errorObj);

      const serialized: IPCSerializedError = {
        name: errorObj.name || 'IPCError',
        message: errorObj.message || 'An unexpected IPC error occurred.',
        code: errorObj.code || 'IPC_EXECUTION_ERROR',
        channel,
      };

      if (errorObj.stack) {
        serialized.stack = errorObj.stack;
      }

      // Throw JSON stringified error payload so Electron bridges structured error details
      throw new Error(JSON.stringify(serialized));
    }
  };
}
