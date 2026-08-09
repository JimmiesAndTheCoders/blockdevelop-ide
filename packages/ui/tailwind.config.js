/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const tailwindPreset = require('./tailwind.preset.js');

module.exports = {
  presets: [tailwindPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
