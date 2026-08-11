import { IJsonModel, Model, IJsonTabNode, IJsonRowNode, IJsonTabSetNode } from 'flexlayout-react';
import { COMPONENT_KEYS } from './panelConstants';

export function getKnownComponentKeys(): Set<string> {
  return new Set<string>(Object.values(COMPONENT_KEYS));
}

export interface SanitizeLayoutOptions {
  knownComponents?: Set<string> | string[];
  fallbackJson?: IJsonModel;
}

function cleanTabNode(rawTab: unknown, knownKeys: Set<string>): IJsonTabNode | null {
  if (!rawTab || typeof rawTab !== 'object') return null;
  const tab = rawTab as IJsonTabNode;
  const componentKey = String(tab.component || '').trim();

  if (!componentKey || !knownKeys.has(componentKey)) {
    console.warn(`[LayoutSanitizer] Removing unknown panel component: '${componentKey}'`);
    return null;
  }

  return {
    ...tab,
    id: tab.id || `tab_${Math.random().toString(36).substring(2, 7)}`,
    name: tab.name || 'Untitled Panel',
    component: componentKey,
  };
}

function cleanTabSetNode(rawTabSet: unknown, knownKeys: Set<string>): IJsonTabSetNode | null {
  if (!rawTabSet || typeof rawTabSet !== 'object') return null;
  const tabSet = rawTabSet as IJsonTabSetNode;
  const rawChildren = Array.isArray(tabSet.children) ? tabSet.children : [];
  const validChildren: IJsonTabNode[] = [];

  for (const child of rawChildren) {
    const validTab = cleanTabNode(child, knownKeys);
    if (validTab) {
      validChildren.push(validTab);
    }
  }

  if (validChildren.length === 0) return null;

  return {
    ...tabSet,
    children: validChildren,
  };
}

function cleanRowNode(rawRow: unknown, knownKeys: Set<string>): IJsonRowNode | null {
  if (!rawRow || typeof rawRow !== 'object') return null;
  const row = rawRow as IJsonRowNode;
  const rawChildren = Array.isArray(row.children) ? row.children : [];
  const validChildren: (IJsonRowNode | IJsonTabSetNode)[] = [];

  for (const child of rawChildren) {
    if (child && typeof child === 'object') {
      const type = (child as { type?: string }).type;
      if (type === 'tabset') {
        const validTabSet = cleanTabSetNode(child, knownKeys);
        if (validTabSet) validChildren.push(validTabSet);
      } else if (type === 'row') {
        const validSubRow = cleanRowNode(child, knownKeys);
        if (validSubRow) validChildren.push(validSubRow);
      }
    }
  }

  if (validChildren.length === 0) return null;

  return {
    ...row,
    children: validChildren,
  };
}

/**
 * Validates, cleanses, and repairs raw layout JSON models loaded from storage or network state.
 */
export class LayoutSanitizer {
  /**
   * Strictly sanitizes raw JSON state to prevent corrupted or outdated layouts from crashing the IDE.
   */
  public static sanitize(
    rawJson: unknown,
    options: SanitizeLayoutOptions = {}
  ): IJsonModel {
    const knownKeys = options.knownComponents
      ? new Set(options.knownComponents)
      : getKnownComponentKeys();

    const fallback: IJsonModel = {
      global: {
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
      },
      borders: [],
      layout: {
        type: 'row',
        weight: 100,
        children: [
          {
            type: 'tabset',
            id: 'tabset-main',
            weight: 100,
            children: [{ type: 'tab', id: 'editor-main', name: 'Main.block', component: 'editor' }],
          },
        ],
      },
    };

    if (!rawJson || typeof rawJson !== 'object' || Array.isArray(rawJson)) {
      console.warn('[LayoutSanitizer] Invalid raw layout state, reverting to fallback layout.');
      return fallback;
    }

    const candidate = JSON.parse(JSON.stringify(rawJson)) as Partial<IJsonModel>;

    if (!candidate.layout || typeof candidate.layout !== 'object') {
      console.warn('[LayoutSanitizer] Layout configuration missing root layout node, reverting to fallback.');
      return fallback;
    }

    try {
      const rawRoot = candidate.layout as unknown as Record<string, unknown>;
      let cleanedRoot: IJsonRowNode | IJsonTabSetNode | null = null;

      if (rawRoot.type === 'tabset') {
        cleanedRoot = cleanTabSetNode(rawRoot, knownKeys);
      } else {
        cleanedRoot = cleanRowNode(rawRoot, knownKeys);
      }

      if (!cleanedRoot) {
        console.warn('[LayoutSanitizer] All tabs pruned during layout sanitization, falling back to default layout.');
        return fallback;
      }

      let rootRow: IJsonRowNode;
      if (cleanedRoot.type === 'row') {
        rootRow = cleanedRoot as IJsonRowNode;
      } else {
        rootRow = {
          type: 'row',
          weight: 100,
          children: [cleanedRoot as IJsonTabSetNode],
        };
      }

      const sanitizedModel: IJsonModel = {
        global: {
          ...fallback.global,
          ...(candidate.global || {}),
          tabSetMinWidth: 180,
          tabSetMinHeight: 120,
        },
        borders: Array.isArray(candidate.borders) ? candidate.borders : [],
        layout: rootRow,
      };

      // Verify that FlexLayout can parse the sanitized model without throwing
      Model.fromJson(sanitizedModel);

      return sanitizedModel;
    } catch (err) {
      console.error('[LayoutSanitizer] Failed to parse candidate layout model, reverting to default layout:', err);
      return fallback;
    }
  }
}
