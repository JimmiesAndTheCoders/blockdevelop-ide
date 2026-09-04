import * as Blockly from 'blockly/core';
import type { CustomBlockDefinition } from '../../types';
import { ARRAY_SORT_DIRECTION_OPTIONS, ARRAY_TRANSFORMATION_MODE_OPTIONS } from './types';

export const ARRAY_1D_BLOCK_DEFINITIONS: CustomBlockDefinition[] = [
  // 1. Create Empty Array Literal: []
  {
    type: 'array_create_empty',
    message0: 'empty list [ ]',
    output: 'Array',
    style: 'math_blocks',
    tooltip: 'Creates an empty 1D array literal [].',
    helpUrl: '',
  },

  // 2. Create Array with Elements Literal: [item0, item1, item2]
  {
    type: 'array_create_with',
    message0: 'create list with %1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'ADD0',
      },
      {
        type: 'input_value',
        name: 'ADD1',
      },
      {
        type: 'input_value',
        name: 'ADD2',
      },
    ],
    output: 'Array',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Creates a 1D array literal populated with the specified initial elements.',
    helpUrl: '',
  },

  // 3. Typed Array Constructor: new Array<T>(length)
  {
    type: 'array_create_typed',
    message0: 'new Array<%1> ( length: %2 )',
    args0: [
      {
        type: 'input_value',
        name: 'ELEMENT_TYPE',
        check: 'Type',
      },
      {
        type: 'input_value',
        name: 'LENGTH',
        check: 'Number',
      },
    ],
    output: 'Array',
    inputsInline: true,
    style: 'math_blocks',
    tooltip:
      'Instantiates a new typed Array<T> with an explicit type annotation and initial capacity.',
    helpUrl: '',
  },

  // 4. Array Length / Item Count Query: list.length
  {
    type: 'array_length',
    message0: 'length of list %1',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns the number of elements contained in the array.',
    helpUrl: '',
  },

  // 5. Array Element Access by Index: list[index]
  {
    type: 'array_get_index',
    message0: 'in list %1 get item at index %2',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Retrieves the element at the specified zero-based index from the array.',
    helpUrl: '',
  },

  // 6. Array Element Assignment by Index: list[index] = value
  {
    type: 'array_set_index',
    message0: 'in list %1 set item at index %2 = %3',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Assigns a new value to the element at the specified index in the array.',
    helpUrl: '',
  },

  // 7. Array Push: list.push(item)
  {
    type: 'array_push',
    message0: 'in list %1 push item to end %2',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ITEM',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Appends a new element to the end of the array (push).',
    helpUrl: '',
  },

  // 8. Array Pop: list.pop()
  {
    type: 'array_pop',
    message0: 'in list %1 pop last item',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Removes and returns the last element from the array (pop).',
    helpUrl: '',
  },

  // 9. Array Unshift: list.unshift(item)
  {
    type: 'array_unshift',
    message0: 'in list %1 insert item at start %2',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ITEM',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Prepends a new element to the beginning of the array (unshift).',
    helpUrl: '',
  },

  // 10. Array Shift: list.shift()
  {
    type: 'array_shift',
    message0: 'in list %1 remove first item',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
    ],
    output: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Removes and returns the first element from the array (shift).',
    helpUrl: '',
  },

  // 11. Array Insert At: list.insert(index, item)
  {
    type: 'array_insert_at',
    message0: 'in list %1 insert item %2 at index %3',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ITEM',
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Inserts an element into the array at the specified index.',
    helpUrl: '',
  },

  // 12. Array Remove At: list.splice(index, 1)
  {
    type: 'array_remove_at',
    message0: 'in list %1 remove item at index %2',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'INDEX',
        check: 'Number',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Removes the element at the specified index from the array.',
    helpUrl: '',
  },

  // 13. Array Slice: list.slice(start, end)
  {
    type: 'array_slice',
    message0: 'slice list %1 from index %2 to index %3',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'START',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'END',
        check: 'Number',
      },
    ],
    output: 'Array',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns a shallow copy of a portion of the array from start to end index.',
    helpUrl: '',
  },

  // 14. Array Splice: list.splice(start, deleteCount, replacement)
  {
    type: 'array_splice',
    message0: 'in list %1 splice at %2 delete %3 items and insert %4',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'START',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'DELETE_COUNT',
        check: 'Number',
      },
      {
        type: 'input_value',
        name: 'NEW_ITEM',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: 'math_blocks',
    tooltip:
      'Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.',
    helpUrl: '',
  },

  // 15. Array IndexOf: list.indexOf(item)
  {
    type: 'array_indexOf',
    message0: 'in list %1 first index of item %2',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ITEM',
      },
    ],
    output: 'Number',
    inputsInline: true,
    style: 'math_blocks',
    tooltip:
      'Returns the first index at which a given element can be found in the array, or -1 if not present.',
    helpUrl: '',
  },

  // 16. Array Contains: list.contains(item) / list.indexOf(item) != -1
  {
    type: 'array_contains',
    message0: 'list %1 contains item %2',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'input_value',
        name: 'ITEM',
      },
    ],
    output: 'Boolean',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Returns true if the array contains the specified element.',
    helpUrl: '',
  },

  // 17. Array Reverse: list.reverse()
  {
    type: 'array_reverse',
    message0: 'reverse list %1 (%2)',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'field_dropdown',
        name: 'MODE',
        options: ARRAY_TRANSFORMATION_MODE_OPTIONS,
      },
    ],
    output: 'Array',
    inputsInline: true,
    style: 'math_blocks',
    tooltip: 'Reverses an array in place or returns a reversed copy.',
    helpUrl: '',
  },

  // 18. Array Sort: list.sort(...)
  {
    type: 'array_sort',
    message0: 'sort list %1 %2 (%3)',
    args0: [
      {
        type: 'input_value',
        name: 'ARRAY',
        check: 'Array',
      },
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: ARRAY_SORT_DIRECTION_OPTIONS,
      },
      {
        type: 'field_dropdown',
        name: 'MODE',
        options: ARRAY_TRANSFORMATION_MODE_OPTIONS,
      },
    ],
    output: 'Array',
    inputsInline: true,
    style: 'math_blocks',
    tooltip:
      'Sorts the elements of an array in ascending or descending order in-place or as a copy.',
    helpUrl: '',
  },
];

/**
 * Registers all 1D Array & Collection blocks into Blockly's global registry.
 */
export function registerArray1DBlocks(): void {
  ARRAY_1D_BLOCK_DEFINITIONS.forEach((def) => {
    if (!Blockly.Blocks[def.type]) {
      Blockly.defineBlocksWithJsonArray([def as unknown as Record<string, unknown>]);
    }
  });
}
