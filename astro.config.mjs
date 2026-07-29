// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://3dprinting.ledainhan.com',
  output: 'static',
  integrations: [
    sitemap(),
  ],
});