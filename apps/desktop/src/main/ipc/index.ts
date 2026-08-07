import { registerSystemHandlers } from './systemHandler';
import { registerFSHandlers } from './fsHandler';
import { registerDialogHandlers } from './dialogHandler';
import { registerProcessHandlers } from './processHandler';

export function registerAllIPCHandlers(): void {
  registerSystemHandlers();
  registerFSHandlers();
  registerDialogHandlers();
  registerProcessHandlers();
}
