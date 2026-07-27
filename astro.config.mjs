// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://in3d-help.pages.dev',
  output: 'static',
  integrations: [
    sitemap(),
  ],
});