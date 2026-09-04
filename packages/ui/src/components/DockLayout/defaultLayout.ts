import { IJsonModel, Model } from 'flexlayout-react';
import { PANEL_IDS, COMPONENT_KEYS, PanelId, ComponentKey } from './panelConstants';
import { LayoutSanitizer } from './layoutSanitizer';

export { PANEL_IDS, COMPONENT_KEYS, type PanelId, type ComponentKey };

export interface PanelMetadata {
  id: string;
  name: string;
  component: ComponentKey;
  icon: string;
  enableClose: boolean;
}

export interface BaselinePanelsMap {
  explorer: PanelMetadata;
  toolbox: PanelMetadata;
  editor: PanelMetadata;
  terminal: PanelMetadata;
  problems: PanelMetadata;
  properties: PanelMetadata;
}

/**
 * Panel Definitions Metadata Catalog
 */
export const BASELINE_PANELS: BaselinePanelsMap = {
  explorer: {
    id: PANEL_IDS.EXPLORER,
    name: 'Project Explorer',
    component: COMPONENT_KEYS.EXPLORER,
    icon: 'folder',
    enableClose: false,
  },
  toolbox: {
    id: PANEL_IDS.TOOLBOX,
    name: 'Block Toolbox',
    component: COMPONENT_KEYS.TOOLBOX,
    icon: 'box',
    enableClose: false,
  },
  editor: {
    id: PANEL_IDS.EDITOR,
    name: 'Main.block',
    component: COMPONENT_KEYS.EDITOR,
    icon: 'block',
    enableClose: true,
  },
  terminal: {
    id: PANEL_IDS.TERMINAL,
    name: 'Terminal',
    component: COMPONENT_KEYS.TERMINAL,
    icon: 'terminal',
    enableClose: false,
  },
  problems: {
    id: PANEL_IDS.PROBLEMS,
    name: 'Problems & Diagnostics',
    component: COMPONENT_KEYS.PROBLEMS,
    icon: 'bug',
    enableClose: false,
  },
  properties: {
    id: PANEL_IDS.PROPERTIES,
    name: 'Properties',
    component: COMPONENT_KEYS.PROPERTIES,
    icon: 'settings',
    enableClose: false,
  },
};

export type LayoutPresetType = 'default' | 'visual-builder' | 'code-centric' | 'debugger';

export interface LayoutPresetMetadata {
  id: LayoutPresetType;
  name: string;
  description: string;
  icon: string;
}

export const LAYOUT_PRESETS: Record<LayoutPresetType, LayoutPresetMetadata> = {
  default: {
    id: 'default',
    name: 'Default Workspace',
    description: 'Full IDE view with Explorer, Editor, Properties, and Terminal.',
    icon: 'layout',
  },
  'visual-builder': {
    id: 'visual-builder',
    name: 'Visual Builder',
    description: 'Maximized Blockly block canvas with Toolbox and minimal sidebar.',
    icon: 'box',
  },
  'code-centric': {
    id: 'code-centric',
    name: 'Code Centric',
    description: 'Maximized code editor view with file explorer and side terminal.',
    icon: 'code',
  },
  debugger: {
    id: 'debugger',
    name: 'Debugger & Runner',
    description: 'Focused view on execution stack, variable inspector, and output console.',
    icon: 'bug',
  },
};

/**
 * Common Global Constraints for all IDE Layout Presets
 */
const BASELINE_GLOBAL_CONFIG = {
  tabEnableClose: true,
  tabEnableFloat: true,
  tabEnableRename: false,
  tabSetEnableClose: false,
  tabSetEnableDrop: true,
  tabSetEnableSingleTabStretch: false,
  tabSetMinWidth: 180,
  tabSetMinHeight: 120,
  splitterSize: 6,
  splitterExtra: 4,
};

/**
 * 🎨 1. Default Workspace Layout Configuration
 */
export const DEFAULT_WORKSPACE_LAYOUT_JSON: IJsonModel = {
  global: BASELINE_GLOBAL_CONFIG,
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        id: 'tabset-left',
        weight: 20,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.explorer.id,
            name: BASELINE_PANELS.explorer.name,
            component: BASELINE_PANELS.explorer.component,
            icon: BASELINE_PANELS.explorer.icon,
            enableClose: BASELINE_PANELS.explorer.enableClose,
          },
          {
            type: 'tab',
            id: BASELINE_PANELS.toolbox.id,
            name: BASELINE_PANELS.toolbox.name,
            component: BASELINE_PANELS.toolbox.component,
            icon: BASELINE_PANELS.toolbox.icon,
            enableClose: BASELINE_PANELS.toolbox.enableClose,
          },
        ],
      },
      {
        type: 'row',
        weight: 60,
        children: [
          {
            type: 'tabset',
            id: 'tabset-main',
            weight: 70,
            selected: 0,
            children: [
              {
                type: 'tab',
                id: BASELINE_PANELS.editor.id,
                name: BASELINE_PANELS.editor.name,
                component: BASELINE_PANELS.editor.component,
                icon: BASELINE_PANELS.editor.icon,
                enableClose: BASELINE_PANELS.editor.enableClose,
              },
            ],
          },
          {
            type: 'tabset',
            id: 'tabset-bottom',
            weight: 30,
            selected: 0,
            children: [
              {
                type: 'tab',
                id: BASELINE_PANELS.terminal.id,
                name: BASELINE_PANELS.terminal.name,
                component: BASELINE_PANELS.terminal.component,
                icon: BASELINE_PANELS.terminal.icon,
                enableClose: BASELINE_PANELS.terminal.enableClose,
              },
              {
                type: 'tab',
                id: BASELINE_PANELS.problems.id,
                name: BASELINE_PANELS.problems.name,
                component: BASELINE_PANELS.problems.component,
                icon: BASELINE_PANELS.problems.icon,
                enableClose: BASELINE_PANELS.problems.enableClose,
              },
            ],
          },
        ],
      },
      {
        type: 'tabset',
        id: 'tabset-right',
        weight: 20,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.properties.id,
            name: BASELINE_PANELS.properties.name,
            component: BASELINE_PANELS.properties.component,
            icon: BASELINE_PANELS.properties.icon,
            enableClose: BASELINE_PANELS.properties.enableClose,
          },
        ],
      },
    ],
  },
};

/**
 * 🧩 2. Visual Builder Mode: Focuses on Blockly canvas and block toolbox.
 */
export const VISUAL_BUILDER_LAYOUT_JSON: IJsonModel = {
  global: BASELINE_GLOBAL_CONFIG,
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        id: 'tabset-left',
        weight: 22,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.toolbox.id,
            name: BASELINE_PANELS.toolbox.name,
            component: BASELINE_PANELS.toolbox.component,
            icon: BASELINE_PANELS.toolbox.icon,
            enableClose: BASELINE_PANELS.toolbox.enableClose,
          },
          {
            type: 'tab',
            id: BASELINE_PANELS.explorer.id,
            name: BASELINE_PANELS.explorer.name,
            component: BASELINE_PANELS.explorer.component,
            icon: BASELINE_PANELS.explorer.icon,
            enableClose: BASELINE_PANELS.explorer.enableClose,
          },
        ],
      },
      {
        type: 'tabset',
        id: 'tabset-main',
        weight: 78,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.editor.id,
            name: BASELINE_PANELS.editor.name,
            component: BASELINE_PANELS.editor.component,
            icon: BASELINE_PANELS.editor.icon,
            enableClose: BASELINE_PANELS.editor.enableClose,
          },
        ],
      },
    ],
  },
};

/**
 * 💻 3. Code Centric Mode: Maximizes editor view with side file explorer and side console.
 */
export const CODE_CENTRIC_LAYOUT_JSON: IJsonModel = {
  global: BASELINE_GLOBAL_CONFIG,
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        id: 'tabset-left',
        weight: 18,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.explorer.id,
            name: BASELINE_PANELS.explorer.name,
            component: BASELINE_PANELS.explorer.component,
            icon: BASELINE_PANELS.explorer.icon,
            enableClose: BASELINE_PANELS.explorer.enableClose,
          },
        ],
      },
      {
        type: 'tabset',
        id: 'tabset-main',
        weight: 60,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.editor.id,
            name: BASELINE_PANELS.editor.name,
            component: BASELINE_PANELS.editor.component,
            icon: BASELINE_PANELS.editor.icon,
            enableClose: BASELINE_PANELS.editor.enableClose,
          },
        ],
      },
      {
        type: 'tabset',
        id: 'tabset-right',
        weight: 22,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.terminal.id,
            name: BASELINE_PANELS.terminal.name,
            component: BASELINE_PANELS.terminal.component,
            icon: BASELINE_PANELS.terminal.icon,
            enableClose: BASELINE_PANELS.terminal.enableClose,
          },
          {
            type: 'tab',
            id: BASELINE_PANELS.problems.id,
            name: BASELINE_PANELS.problems.name,
            component: BASELINE_PANELS.problems.component,
            icon: BASELINE_PANELS.problems.icon,
            enableClose: BASELINE_PANELS.problems.enableClose,
          },
        ],
      },
    ],
  },
};

/**
 * 🐞 4. Debugger / Runner Mode: Focused execution stack, variable inspector, and console.
 */
export const DEBUGGER_LAYOUT_JSON: IJsonModel = {
  global: BASELINE_GLOBAL_CONFIG,
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'row',
        weight: 70,
        children: [
          {
            type: 'tabset',
            id: 'tabset-main',
            weight: 70,
            selected: 0,
            children: [
              {
                type: 'tab',
                id: BASELINE_PANELS.editor.id,
                name: BASELINE_PANELS.editor.name,
                component: BASELINE_PANELS.editor.component,
                icon: BASELINE_PANELS.editor.icon,
                enableClose: BASELINE_PANELS.editor.enableClose,
              },
            ],
          },
          {
            type: 'tabset',
            id: 'tabset-right',
            weight: 30,
            selected: 0,
            children: [
              {
                type: 'tab',
                id: BASELINE_PANELS.properties.id,
                name: 'Variables & Scope',
                component: BASELINE_PANELS.properties.component,
                icon: BASELINE_PANELS.properties.icon,
                enableClose: BASELINE_PANELS.properties.enableClose,
              },
              {
                type: 'tab',
                id: BASELINE_PANELS.explorer.id,
                name: BASELINE_PANELS.explorer.name,
                component: BASELINE_PANELS.explorer.component,
                icon: BASELINE_PANELS.explorer.icon,
                enableClose: BASELINE_PANELS.explorer.enableClose,
              },
            ],
          },
        ],
      },
      {
        type: 'tabset',
        id: 'tabset-bottom',
        weight: 30,
        selected: 0,
        children: [
          {
            type: 'tab',
            id: BASELINE_PANELS.terminal.id,
            name: BASELINE_PANELS.terminal.name,
            component: BASELINE_PANELS.terminal.component,
            icon: BASELINE_PANELS.terminal.icon,
            enableClose: BASELINE_PANELS.terminal.enableClose,
          },
          {
            type: 'tab',
            id: BASELINE_PANELS.problems.id,
            name: BASELINE_PANELS.problems.name,
            component: BASELINE_PANELS.problems.component,
            icon: BASELINE_PANELS.problems.icon,
            enableClose: BASELINE_PANELS.problems.enableClose,
          },
        ],
      },
    ],
  },
};

/**
 * LayoutModelFactory creates FlexLayout Model instances from presets or JSON specs with auto-recovery protection.
 */
export class LayoutModelFactory {
  public static createDefaultJson(): IJsonModel {
    return JSON.parse(JSON.stringify(DEFAULT_WORKSPACE_LAYOUT_JSON)) as IJsonModel;
  }

  public static createDefaultModel(): Model {
    return Model.fromJson(this.createDefaultJson());
  }

  public static createPresetJson(preset: LayoutPresetType): IJsonModel {
    switch (preset) {
      case 'visual-builder':
        return JSON.parse(JSON.stringify(VISUAL_BUILDER_LAYOUT_JSON)) as IJsonModel;
      case 'code-centric':
        return JSON.parse(JSON.stringify(CODE_CENTRIC_LAYOUT_JSON)) as IJsonModel;
      case 'debugger':
        return JSON.parse(JSON.stringify(DEBUGGER_LAYOUT_JSON)) as IJsonModel;
      case 'default':
      default:
        return this.createDefaultJson();
    }
  }

  public static createPresetModel(preset: LayoutPresetType): Model {
    return Model.fromJson(this.createPresetJson(preset));
  }

  /**
   * Safely instantiates a FlexLayout Model from raw JSON.
   * Auto-recovers to default layout if parsing or structure throws an exception.
   */
  public static safeCreateModel(rawJson?: unknown): Model {
    try {
      if (!rawJson) {
        return this.createDefaultModel();
      }
      const sanitized = LayoutSanitizer.sanitize(rawJson);
      return Model.fromJson(sanitized);
    } catch (err) {
      console.error(
        '[LayoutModelFactory] Model creation failed, auto-recovering to DEFAULT_WORKSPACE_LAYOUT:',
        err,
      );
      return this.createDefaultModel();
    }
  }

  /**
   * Safely sanitizes raw JSON structure.
   * Auto-recovers to default layout JSON if sanitization fails.
   */
  public static safeCreateJson(rawJson?: unknown): IJsonModel {
    try {
      if (!rawJson) {
        return this.createDefaultJson();
      }
      return LayoutSanitizer.sanitize(rawJson);
    } catch (err) {
      console.error(
        '[LayoutModelFactory] JSON sanitization failed, auto-recovering to DEFAULT_WORKSPACE_LAYOUT:',
        err,
      );
      return this.createDefaultJson();
    }
  }
}
