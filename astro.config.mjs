// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// SSR output: Cloudflare Pages serves dynamic content using Workers runtime.
// Old static pages are marked with export const prerender = true.
export default defineConfig({
  site: 'https://nuidinh.help',
  output: 'server',
  adapter: cloudflare({
    remoteBindings: false,
  }),
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/upload-anh') &&
        !page.includes('/api/'),
    }),
  ],
});