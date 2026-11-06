import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Use the public production origin for canonical URLs, Open Graph metadata and sitemap generation.
export default defineConfig({
  site: 'https://www.btecky.tech',
  output: 'static',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
});
