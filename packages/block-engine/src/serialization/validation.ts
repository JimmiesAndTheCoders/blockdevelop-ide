export interface SerializationValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates JSON workspace object schema before mounting to prevent workspace crashes.
 */
export function validateWorkspaceJson(jsonState: unknown): SerializationValidationResult {
  const errors: string[] = [];

  if (!jsonState || typeof jsonState !== 'object') {
    return { valid: false, errors: ['Workspace JSON must be a non-null object.'] };
  }

  const obj = jsonState as Record<string, unknown>;

  if (obj.blocks !== undefined) {
    if (typeof obj.blocks !== 'object' || obj.blocks === null) {
      errors.push('Property "blocks" must be an object.');
    }
  }

  if (obj.variables !== undefined) {
    if (!Array.isArray(obj.variables)) {
      errors.push('Property "variables" must be an array.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks balance and structural integrity of XML opening and closing tags.
 */
function checkXmlTagBalance(xmlText: string): boolean {
  const tagRegex = /<(\/)?([a-zA-Z0-9_:-]+)(?:\s+[^>]*?)?(\/)?>/g;
  const stack: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(xmlText)) !== null) {
    const isClosing = Boolean(match[1]);
    const tagName = match[2]?.toLowerCase();
    const isSelfClosing = Boolean(match[3]);

    if (!tagName || tagName === 'xml' || isSelfClosing) {
      continue;
    }

    if (isClosing) {
      if (stack.length === 0 || stack[stack.length - 1] !== tagName) {
        return false;
      }
      stack.pop();
    } else {
      stack.push(tagName);
    }
  }

  return stack.length === 0;
}

/**
 * Validates XML string markup before deserializing.
 */
export function validateWorkspaceXml(xmlText: string): SerializationValidationResult {
  const errors: string[] = [];

  if (typeof xmlText !== 'string' || !xmlText.trim()) {
    return { valid: false, errors: ['XML content must be a non-empty string.'] };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    const parserErrors = doc.getElementsByTagName('parsererror');
    if (parserErrors && parserErrors.length > 0) {
      errors.push(`XML Parsing Error: ${parserErrors[0]?.textContent || 'Malformed XML syntax.'}`);
    } else {
      let rootElement = doc.documentElement;

      if (rootElement && rootElement.nodeName.toLowerCase() === 'html') {
        const innerRoot = doc.querySelector('xml') || doc.querySelector('block');
        if (innerRoot) {
          rootElement = innerRoot as HTMLElement;
        }
      }

      const rootName = rootElement ? rootElement.nodeName.toLowerCase().replace(/.*:/, '') : '';

      if (rootName !== 'xml' && rootName !== 'block') {
        errors.push(`XML root element must be <xml> or <block>, received <${rootName}>.`);
      } else if (!checkXmlTagBalance(xmlText)) {
        errors.push('Malformed XML syntax: unclosed or mismatched XML tags detected.');
      }
    }
  } catch (err) {
    errors.push(`XML Validation Exception: ${(err as Error).message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
