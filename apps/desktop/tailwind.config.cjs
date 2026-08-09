/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const tailwindPreset = require('../../packages/ui/tailwind.preset.js');

module.exports = {
  presets: [tailwindPreset],
  content: [
    './index.html',
    './src/renderer/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
