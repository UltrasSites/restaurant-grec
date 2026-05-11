// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://modele.ultras-sites.com',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
