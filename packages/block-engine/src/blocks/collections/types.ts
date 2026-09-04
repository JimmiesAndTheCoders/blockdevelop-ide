/**
 * Collection & Array Types and Constants for BlockDevelop IDE.
 */

export const ARRAY_INSERTION_POSITION_OPTIONS: [string, string][] = [
  ['at end (push)', 'END'],
  ['at beginning (unshift)', 'START'],
  ['at index', 'INDEX'],
];

export const ARRAY_REMOVE_POSITION_OPTIONS: [string, string][] = [
  ['from end (pop)', 'END'],
  ['from beginning (shift)', 'START'],
  ['at index', 'INDEX'],
];

export const ARRAY_SORT_DIRECTION_OPTIONS: [string, string][] = [
  ['ascending (A-Z / 1-9)', 'ASC'],
  ['descending (Z-A / 9-1)', 'DESC'],
];

export const ARRAY_TRANSFORMATION_MODE_OPTIONS: [string, string][] = [
  ['in-place mutate', 'IN_PLACE'],
  ['return new copy', 'COPY'],
];

export const MATRIX_DIMENSION_OPTIONS: [string, string][] = [
  ['rows count (height)', 'ROWS'],
  ['columns count (width)', 'COLS'],
];
