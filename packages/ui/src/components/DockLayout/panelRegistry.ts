import React, { type ReactNode } from 'react';
import type { PanelProps, PanelRegistration } from './panelTypes';
import { COMPONENT_KEYS } from './defaultLayout';
import { PanelErrorBoundary } from './PanelErrorBoundary';
import { ExplorerPanelView } from './views/ExplorerPanelView';
import { EditorPanelView } from './views/EditorPanelView';
import { PropertiesPanelView } from './views/PropertiesPanelView';
import { TerminalPanelView } from './views/TerminalPanelView';
import { ProblemsPanelView } from './views/ProblemsPanelView';
import { ToolboxPanelView } from './views/ToolboxPanelView';
import { PreviewPanelView } from './views/PreviewPanelView';

/**
 * PanelRegistry maps component key strings to React panel view components wrapped in panel-level ErrorBoundaries.
 */
export class PanelRegistry {
  private static registry = new Map<string, PanelRegistration>();

  /**
   * Registers a panel component mapping.
   */
  public static registerPanel(registration: PanelRegistration): void {
    this.registry.set(registration.key, registration);
  }

  /**
   * Retrieves a registered panel.
   */
  public static getPanel(key: string): PanelRegistration | undefined {
    return this.registry.get(key);
  }

  /**
   * Checks if a panel key is registered.
   */
  public static hasPanel(key: string): boolean {
    return this.registry.has(key);
  }

  /**
   * Returns all registered panels.
   */
  public static getAllPanels(): PanelRegistration[] {
    return Array.from(this.registry.values());
  }

  /**
   * Renders a registered panel view safely wrapped in a PanelErrorBoundary.
   */
  public static renderPanel(key: string, props: PanelProps): ReactNode {
    const registration = this.getPanel(key);

    if (!registration) {
      return React.createElement(
        'div',
        { className: 'p-4 text-xs font-mono text-status-error bg-workspace-panel border border-workspace-border rounded' },
        `⚠ Warning: Unregistered panel component key '${key}'.`
      );
    }

    const Component = registration.component;
    const title = props.title || registration.defaultTitle || registration.name;

    return React.createElement(
      PanelErrorBoundary,
      { panelId: key, title },
      React.createElement(Component, props)
    );
  }

  /**
   * Clears the registry.
   */
  public static clear(): void {
    this.registry.clear();
  }
}

// Register default baseline panels
PanelRegistry.registerPanel({
  key: COMPONENT_KEYS.EXPLORER,
  name: 'Project Explorer',
  icon: 'folder',
  component: ExplorerPanelView,
  defaultTitle: 'Project Explorer',
});

PanelRegistry.registerPanel({
  key: COMPONENT_KEYS.EDITOR,
  name: 'Editor',
  icon: 'block',
  component: EditorPanelView,
  defaultTitle: 'Main.block',
});

PanelRegistry.registerPanel({
  key: COMPONENT_KEYS.PROPERTIES,
  name: 'Properties',
  icon: 'settings',
  component: PropertiesPanelView,
  defaultTitle: 'Properties',
});

PanelRegistry.registerPanel({
  key: COMPONENT_KEYS.TERMINAL,
  name: 'Terminal',
  icon: 'terminal',
  component: TerminalPanelView,
  defaultTitle: 'Terminal',
});

PanelRegistry.registerPanel({
  key: COMPONENT_KEYS.PROBLEMS,
  name: 'Problems & Diagnostics',
  icon: 'bug',
  component: ProblemsPanelView,
  defaultTitle: 'Problems',
});

PanelRegistry.registerPanel({
  key: COMPONENT_KEYS.TOOLBOX,
  name: 'Block Toolbox',
  icon: 'box',
  component: ToolboxPanelView,
  defaultTitle: 'Block Toolbox',
});

PanelRegistry.registerPanel({
  key: 'preview',
  name: 'Live App Preview',
  icon: 'globe',
  component: PreviewPanelView,
  defaultTitle: 'Live Preview',
});
