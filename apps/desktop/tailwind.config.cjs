/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/renderer/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workspace: {
          dark: '#181818',
          panel: '#1f1f1f',
          tab: '#252526',
          header: '#2d2d2d',
          border: '#3c3c3c',
          activeTab: '#1e1e1e',
        },
        brand: {
          blue: '#007ACC',
          blueHover: '#1E90FF',
          haxeOrange: '#EA8220',
          haxeHover: '#FFA500',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
