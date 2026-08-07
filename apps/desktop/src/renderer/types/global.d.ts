import { BlockDevelopAPI } from '../../preload';

declare global {
  interface Window {
    blockDevelopAPI: BlockDevelopAPI;
  }
}

export {};
