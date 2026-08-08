import path from 'node:path';

export class IPCValidationError extends Error {
  constructor(message: string) {
    super(`[IPC Validation Error] ${message}`);
    this.name = 'IPCValidationError';
  }
}

export function assertObject(val: unknown, paramName: string): Record<string, unknown> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    throw new IPCValidationError(`Expected parameter '${paramName}' to be a valid object.`);
  }
  return val as Record<string, unknown>;
}

export function assertString(val: unknown, paramName: string): string {
  if (typeof val !== 'string') {
    throw new IPCValidationError(`Expected parameter '${paramName}' to be a string.`);
  }
  return val;
}

export function assertNonEmptyString(val: unknown, paramName: string): string {
  const str = assertString(val, paramName).trim();
  if (str.length === 0) {
    throw new IPCValidationError(`Expected parameter '${paramName}' to be a non-empty string.`);
  }
  return str;
}

export function assertNumber(val: unknown, paramName: string): number {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    throw new IPCValidationError(`Expected parameter '${paramName}' to be a valid number.`);
  }
  return val;
}

export function assertPositiveInteger(val: unknown, paramName: string): number {
  const num = assertNumber(val, paramName);
  if (!Number.isInteger(num) || num <= 0) {
    throw new IPCValidationError(`Expected parameter '${paramName}' to be a positive integer.`);
  }
  return num;
}

export function assertArrayOfStrings(val: unknown, paramName: string): string[] {
  if (!Array.isArray(val)) {
    throw new IPCValidationError(`Expected parameter '${paramName}' to be an array.`);
  }
  return val.map((item, index) => assertString(item, `${paramName}[${index}]`));
}

export function sanitizePath(rawPath: unknown, paramName = 'filePath'): string {
  const str = assertNonEmptyString(rawPath, paramName);
  if (str.includes('\0')) {
    throw new IPCValidationError(`Path parameter '${paramName}' contains invalid null-byte characters.`);
  }
  return path.normalize(str);
}

export function assertPathWithinBoundary(targetPath: unknown, rootBoundary?: string, paramName = 'filePath'): string {
  const normalizedTarget = sanitizePath(targetPath, paramName);
  if (!rootBoundary) return normalizedTarget;

  const normalizedRoot = path.normalize(rootBoundary);
  const relative = path.relative(normalizedRoot, normalizedTarget);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new IPCValidationError(
      `Security Violation: Path parameter '${paramName}' (${normalizedTarget}) escapes root workspace boundary (${normalizedRoot}).`
    );
  }

  return normalizedTarget;
}

/**
 * Escapes CLI argument string for Windows / POSIX environments to prevent argument injection.
 */
export function escapeCLIArgument(arg: string): string {
  if (typeof arg !== 'string') return '';
  const cleaned = arg.replace(/[\0\r\n]/g, '');

  if (process.platform === 'win32') {
    if (!cleaned || /[\s\t"\\<>&|^]/.test(cleaned)) {
      return `"${cleaned.replace(/(\\+)("|$)/g, '$1$1$2').replace(/"/g, '\\"')}"`;
    }
    return cleaned;
  }
  if (!cleaned || /[\s\t\n\r"'\\$`*?#~<>|&;()[\]{}]/.test(cleaned)) {
    return `'${cleaned.replace(/'/g, "'\\''")}'`;
  }
  return cleaned;
}

/**
 * Sanitizes an array of process arguments against null-byte and line-break injections.
 */
export function sanitizeCLIArguments(args: string[]): string[] {
  return args.map((arg, idx) => {
    const safeStr = assertString(arg, `args[${idx}]`).replace(/[\0\r\n]/g, '');
    return safeStr;
  });
}
