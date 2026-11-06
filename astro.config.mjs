import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Preview-first foundation; production routing is not switched during migration.
export default defineConfig({
  site: 'https://www.btecky.tech',
  output: 'static',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
});
