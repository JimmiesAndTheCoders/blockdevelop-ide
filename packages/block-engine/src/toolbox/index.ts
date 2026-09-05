import type { ToolboxDefinition } from '../types';

export * from './category';
export * from './search';

export const DEFAULT_TOOLBOX_DEFINITION: ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    // 1. OOP & Architecture Category (Cyan / Blue-green)
    {
      kind: 'category',
      name: 'OOP & Architecture',
      colour: '#06b6d4',
      categorystyle: 'structure_category',
      contents: [
        // Packages & Imports
        { kind: 'block', type: 'package_declaration' },
        { kind: 'block', type: 'package_block_wrapper' },
        { kind: 'block', type: 'import_type' },
        { kind: 'block', type: 'import_wildcard' },
        { kind: 'block', type: 'import_alias' },
        { kind: 'block', type: 'using_mixin' },
        { kind: 'block', type: 'import_statement' },

        // Classes & Constructors
        { kind: 'block', type: 'class_declaration' },
        { kind: 'block', type: 'class_wrapper' },
        { kind: 'block', type: 'class_constructor_declaration' },
        { kind: 'block', type: 'class_constructor' },
        { kind: 'block', type: 'super_constructor_call' },
        { kind: 'block', type: 'instance_instantiation' },

        // Interfaces & Contracts
        { kind: 'block', type: 'interface_declaration' },
        { kind: 'block', type: 'interface_method_signature' },
        { kind: 'block', type: 'interface_property_signature' },

        // Enumerations & Pattern Matching
        { kind: 'block', type: 'enum_declaration' },
        { kind: 'block', type: 'enum_constructor_item' },
        { kind: 'block', type: 'enum_constructor_parameterized' },
        { kind: 'block', type: 'enum_value_reference' },
        { kind: 'block', type: 'enum_pattern_match' },

        // Properties & Accessors
        { kind: 'block', type: 'class_property_declaration' },
        { kind: 'block', type: 'property_getter_def' },
        { kind: 'block', type: 'property_setter_def' },

        // Member Methods
        { kind: 'block', type: 'class_method_declaration' },
        { kind: 'block', type: 'method_param_item' },

        // Core Life-cycle Events
        { kind: 'block', type: 'event_on_start' },
        { kind: 'block', type: 'event_on_update' },
        { kind: 'block', type: 'event_listener' },
      ],
    },

    // 2. Types & Variables Category (Orange)
    {
      kind: 'category',
      name: 'Types & Variables',
      colour: '#ea8220',
      categorystyle: 'variable_category',
      contents: [
        { kind: 'block', type: 'type_primitive' },
        { kind: 'block', type: 'type_array_of' },
        { kind: 'block', type: 'type_map_of' },
        { kind: 'block', type: 'type_custom' },
        { kind: 'block', type: 'type_nullable' },
        { kind: 'block', type: 'variable_declare_typed' },
        { kind: 'block', type: 'variable_declare_inferred' },
        { kind: 'block', type: 'variable_declare_local' },
        { kind: 'block', type: 'variable_get_scoped_typed' },
        { kind: 'block', type: 'variable_assign_op' },
        { kind: 'block', type: 'variable_increment_decrement' },
        { kind: 'block', type: 'variables_get_custom' },
        { kind: 'block', type: 'variables_set_custom' },
      ],
    },

    // 3. Lists & 2D Arrays Category (Purple / Violet)
    {
      kind: 'category',
      name: 'Lists & 2D Arrays',
      colour: '#8a2be2',
      categorystyle: 'math_category',
      contents: [
        { kind: 'block', type: 'array_create_empty' },
        { kind: 'block', type: 'array_create_with' },
        { kind: 'block', type: 'array_create_typed' },
        { kind: 'block', type: 'array_length' },
        { kind: 'block', type: 'array_get_index' },
        { kind: 'block', type: 'array_set_index' },
        { kind: 'block', type: 'array_push' },
        { kind: 'block', type: 'array_pop' },
        { kind: 'block', type: 'array_unshift' },
        { kind: 'block', type: 'array_shift' },
        { kind: 'block', type: 'array_insert_at' },
        { kind: 'block', type: 'array_remove_at' },
        { kind: 'block', type: 'array_slice' },
        { kind: 'block', type: 'array_splice' },
        { kind: 'block', type: 'array_indexOf' },
        { kind: 'block', type: 'array_contains' },
        { kind: 'block', type: 'array_reverse' },
        { kind: 'block', type: 'array_sort' },
        { kind: 'block', type: 'matrix_create_2d' },
        { kind: 'block', type: 'matrix_get_2d' },
        { kind: 'block', type: 'matrix_set_2d' },
        { kind: 'block', type: 'matrix_dimensions' },
        { kind: 'block', type: 'matrix_fill_2d' },
      ],
    },

    // 4. Functions & Methods Category (Rose / Red)
    {
      kind: 'category',
      name: 'Functions & Methods',
      colour: '#e11d48',
      categorystyle: 'procedure_category',
      contents: [
        { kind: 'block', type: 'function_def_typed' },
        { kind: 'block', type: 'function_param_item' },
        { kind: 'block', type: 'function_def_simple' },
        { kind: 'block', type: 'return_value' },
        { kind: 'block', type: 'return_bare' },
        { kind: 'block', type: 'function_call_typed' },
        { kind: 'block', type: 'function_call_typed_statement' },
        { kind: 'block', type: 'method_call_instance' },
        { kind: 'block', type: 'method_call_instance_statement' },
        { kind: 'block', type: 'method_call_static' },
        { kind: 'block', type: 'procedure_defnoreturn_custom' },
        { kind: 'block', type: 'procedure_defreturn_custom' },
        { kind: 'block', type: 'procedure_callnoreturn_custom' },
        { kind: 'block', type: 'procedure_callreturn_custom' },
      ],
    },

    // 5. Logic & Control Category (Classic Blue)
    {
      kind: 'category',
      name: 'Logic & Control',
      colour: '#007acc',
      categorystyle: 'logic_category',
      contents: [
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

    // 6. Mathematics Category
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

    // 7. Text & Strings Category
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
  ],
};
