import type { ToolboxDefinition } from '../types';

export const DEFAULT_TOOLBOX_DEFINITION: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Events',
      colour: '#06b6d4',
      categorystyle: 'event_category',
      contents: [
        { kind: 'block', type: 'event_on_start' },
        { kind: 'block', type: 'event_on_update' },
      ],
    },
    {
      kind: 'category',
      name: 'Logic & Control',
      colour: '#007acc',
      categorystyle: 'logic_category',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
      ],
    },
    {
      kind: 'category',
      name: 'Mathematics',
      colour: '#8a2be2',
      categorystyle: 'math_category',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
      ],
    },
    {
      kind: 'category',
      name: 'Text & Strings',
      colour: '#10b981',
      categorystyle: 'text_category',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_print' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#ea8220',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Functions',
      colour: '#e11d48',
      custom: 'PROCEDURE',
    },
  ],
};
