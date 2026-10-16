import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  css: {
    modules: {
      // kebab-case in the stylesheets, camelCase in TypeScript
      localsConvention: 'camelCaseOnly',
    },
    postcss: {
      // Vendor prefixes for the browsers in package.json "browserslist"
      plugins: [autoprefixer()],
    },
  },
  plugins: [react()],
});
