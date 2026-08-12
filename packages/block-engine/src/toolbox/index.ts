import type { ToolboxDefinition } from '../types';

export * from './category';
export * from './search';

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
        { kind: 'block', type: 'event_listener' },
      ],
    },
    {
      kind: 'category',
      name: 'Logic & Control',
      colour: '#007acc',
      categorystyle: 'logic_category',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_if_else' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_while' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_flow_statements' },
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
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_constrain' },
      ],
    },
    {
      kind: 'category',
      name: 'Text & Strings',
      colour: '#10b981',
      categorystyle: 'text_category',
      contents: [
        { kind: 'block', type: 'text_literal' },
        { kind: 'block', type: 'text_join_custom' },
        { kind: 'block', type: 'text_length_custom' },
        { kind: 'block', type: 'text_isEmpty_custom' },
        { kind: 'block', type: 'text_print_custom' },
        { kind: 'block', type: 'text_log_custom' },
      ],
    },
    {
      kind: 'category',
      name: 'Variables',
      colour: '#ea8220',
      categorystyle: 'variable_category',
      custom: 'VARIABLE',
      contents: [
        { kind: 'block', type: 'variables_get_custom' },
        { kind: 'block', type: 'variables_set_custom' },
        { kind: 'block', type: 'variables_declare_scoped' },
        { kind: 'block', type: 'variables_get_scoped' },
        { kind: 'block', type: 'variables_set_scoped' },
      ],
    },
    {
      kind: 'category',
      name: 'Functions',
      colour: '#e11d48',
      categorystyle: 'procedure_category',
      custom: 'PROCEDURE',
      contents: [
        { kind: 'block', type: 'procedure_defnoreturn_custom' },
        { kind: 'block', type: 'procedure_defreturn_custom' },
        { kind: 'block', type: 'procedure_callnoreturn_custom' },
        { kind: 'block', type: 'procedure_callreturn_custom' },
      ],
    },
  ],
};
