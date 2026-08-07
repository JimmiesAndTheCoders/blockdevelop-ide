import { useEffect } from 'react';
import { ideEventBus, IDEEventTypes } from '@blockdevelop/core';

export function useIDEEvent<K extends keyof IDEEventTypes>(
  event: K,
  handler: (data: IDEEventTypes[K]) => void
): void {
  useEffect(() => {
    ideEventBus.on(event, handler);
    return () => {
      ideEventBus.off(event, handler);
    };
  }, [event, handler]);
}
