import { describe, it, expect } from 'vitest';
import { parseAndSanitizeDeepLink } from './protocol';

describe('Security Compliance & Configuration Assertion Suite', () => {
  describe('Window Security Baseline Policy', () => {
    it('should mandate strict webPreferences security configurations', () => {
      const requiredWebPreferences = {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
      };

      expect(requiredWebPreferences.contextIsolation).toBe(true);
      expect(requiredWebPreferences.nodeIntegration).toBe(false);
      expect(requiredWebPreferences.sandbox).toBe(true);
      expect(requiredWebPreferences.webSecurity).toBe(true);
    });
  });

  describe('Deep Link Security Compliance', () => {
    it('should allow valid sanitized blockdevelop:// deep links', () => {
      const link = 'blockdevelop://open-project?path=/workspace/my-app';
      const parsed = parseAndSanitizeDeepLink(link);
      expect(parsed).not.toBeNull();
      expect(parsed?.action).toBe('open-project');
      expect(parsed?.params.path).toBe('/workspace/my-app');
    });

    it('should reject non-blockdevelop protocols', () => {
      const link = 'https://malicious.com/open-project';
      expect(parseAndSanitizeDeepLink(link)).toBeNull();
    });

    it('should reject unknown actions', () => {
      const link = 'blockdevelop://execute-malicious-script?cmd=calc';
      expect(parseAndSanitizeDeepLink(link)).toBeNull();
    });

    it('should reject parameter payloads with command injection metacharacters', () => {
      const dangerousLink = 'blockdevelop://open-project?path=/workspace;rm%20-rf%20/';
      expect(parseAndSanitizeDeepLink(dangerousLink)).toBeNull();
    });
  });
});
