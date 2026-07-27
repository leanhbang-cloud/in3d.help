// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://in3d-help.pages.dev',
  output: 'static',
  adapter: cloudflare({
    remoteBindings: false,
  }),
  integrations: [
    sitemap(),
  ],
});