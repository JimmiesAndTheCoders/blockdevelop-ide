import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TargetPlatform = 'html5' | 'node' | 'python' | 'haxe' | 'cpp' | 'arduino';

export interface ProjectState {
  activeProjectPath: string | null;
  projectName: string | null;
  targetPlatform: TargetPlatform;
  isProjectOpen: boolean;

  // Actions
  openProject: (path: string, name: string, target?: TargetPlatform) => void;
  closeProject: () => void;
  setTargetPlatform: (target: TargetPlatform) => void;
}

export const useProjectStore = create<ProjectState>()(
  immer((set) => ({
    activeProjectPath: null,
    projectName: null,
    targetPlatform: 'html5',
    isProjectOpen: false,

    openProject: (path, name, target = 'html5') =>
      set((state) => {
        state.activeProjectPath = path;
        state.projectName = name;
        state.targetPlatform = target;
        state.isProjectOpen = true;
      }),

    closeProject: () =>
      set((state) => {
        state.activeProjectPath = null;
        state.projectName = null;
        state.isProjectOpen = false;
      }),

    setTargetPlatform: (target) =>
      set((state) => {
        state.targetPlatform = target;
      }),
  }))
);
