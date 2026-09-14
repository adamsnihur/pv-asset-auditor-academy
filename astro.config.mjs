import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://adamsnihur.github.io',
  base: '/pv-asset-auditor-academy',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
});
