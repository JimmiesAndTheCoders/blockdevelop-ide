import type { ComponentType } from 'react';
import type { TabNode } from 'flexlayout-react';

export interface PanelProps {
  panelId: string;
  node?: TabNode | undefined;
  title?: string | undefined;
  icon?: string | undefined;
  params?: Record<string, unknown> | undefined;
}

export type PanelComponent = ComponentType<PanelProps>;

export interface PanelRegistration {
  key: string;
  name: string;
  icon: string;
  component: PanelComponent;
  defaultTitle?: string | undefined;
}
