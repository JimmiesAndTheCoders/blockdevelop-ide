import type { ToolboxDefinition, ToolboxCategorySpec, ToolboxBlockSpec } from '../types';

export interface SearchFilterOptions {
  includeCategoryNames?: boolean;
  maxResults?: number;
}

/**
 * Searches and filters a ToolboxDefinition by matching query terms against block types or category names.
 * When a query is present, returns a dynamically composed ToolboxDefinition containing search results.
 */
export function filterToolboxCategories(
  toolboxDef: ToolboxDefinition,
  rawQuery: string,
  options: SearchFilterOptions = {},
): ToolboxDefinition {
  const query = rawQuery.toLowerCase().trim();
  if (!query) {
    return toolboxDef;
  }

  const includeCategoryNames = options.includeCategoryNames ?? true;
  const maxResults = options.maxResults ?? 50;

  const matchedBlocks: ToolboxBlockSpec[] = [];
  const seenBlockTypes = new Set<string>();

  function searchCategory(category: ToolboxCategorySpec): void {
    if (!category.contents) return;

    const categoryNameMatch =
      includeCategoryNames && category.name && category.name.toLowerCase().includes(query);

    for (const item of category.contents) {
      if (item.kind === 'block') {
        const blockType = item.type.toLowerCase();
        const readableType = blockType.replace(/_/g, ' ');

        if (categoryNameMatch || blockType.includes(query) || readableType.includes(query)) {
          if (!seenBlockTypes.has(item.type) && matchedBlocks.length < maxResults) {
            seenBlockTypes.add(item.type);
            matchedBlocks.push(item);
          }
        }
      } else if (item.kind === 'category') {
        searchCategory(item);
      }
    }
  }

  for (const category of toolboxDef.contents) {
    searchCategory(category);
  }

  // If search query returns results, wrap them into a "Search Results" category
  if (matchedBlocks.length > 0) {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: `Search: "${rawQuery.trim()}" (${matchedBlocks.length})`,
          colour: '#007ACC',
          categorystyle: 'logic_category',
          contents: matchedBlocks,
        },
      ],
    };
  }

  // Return empty result category when query yields no matches
  return {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: `No results for "${rawQuery.trim()}"`,
        colour: '#3C3C3C',
        contents: [],
      },
    ],
  };
}
