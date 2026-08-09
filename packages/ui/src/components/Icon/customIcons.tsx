import type { FC, SVGProps } from 'react';

export const customIconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
  haxe: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.24l7.6 3.8v7.92L12 19.76l-7.6-3.8V8.04L12 4.24zM8.5 8v8h2v-3h3v3h2V8h-2v3h-3V8h-2z" />
    </svg>
  ),
  arduino: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
      <line x1="5" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="19" y2="12" />
      <line x1="17" y1="10" x2="17" y2="14" />
    </svg>
  ),
  block: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 6h4a2 2 0 0 1 2 2v0a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v0a2 2 0 0 1 2-2h4v12h-4a2 2 0 0 1-2-2v0a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v0a2 2 0 0 1-2 2H4V6z" />
    </svg>
  ),
  scope: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8-18h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3" />
    </svg>
  ),
  event: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  function: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17c1.5 0 2.5-.8 3-2.5L13.5 10c.5-1.7 1.5-2.5 3-2.5" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  ),
  variable: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 8l4 8M12 8l-4 8" />
      <line x1="15" y1="11" x2="19" y2="11" />
      <line x1="15" y1="14" x2="19" y2="14" />
    </svg>
  ),
  'step-into': (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="3" x2="12" y2="15" />
      <polyline points="7 10 12 15 17 10" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  ),
  'step-over': (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <polyline points="16 14 20 14 20 10" />
      <circle cx="12" cy="18" r="2" />
    </svg>
  ),
  'step-out': (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="17" x2="12" y2="5" />
      <polyline points="7 10 12 5 17 10" />
      <circle cx="12" cy="20" r="2" />
    </svg>
  ),
};
