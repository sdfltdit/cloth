import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://www.sdfltd.com',
  output: "hybrid",
  compressHTML: true,

  integrations: [
    tailwind(), 
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const url = item.url;
        const today = new Date().toISOString().split('T')[0];

        // Set lastmod for all pages
        item.lastmod = today;

        // Homepage
        if (url === 'https://www.sdfltd.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
          return item;
        }

        // Core pages — priority 0.9
        const corePaths = ['/contact/', '/about/', '/certifications/', 
          '/products/', '/sustainability/', '/work-process/',
          '/low-moq-clothing-manufacturers/', '/clothing-manufacturers/',
          '/clothing-manufacturers-for-startups/'];
        if (corePaths.some(p => url.endsWith(p))) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
          return item;
        }

        // Country pages — priority 0.8
        if (url.includes('/clothing-manufacturer-')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

        // Tool pages — priority 0.8
        if (url.includes('/tools/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

        // Service/category pages — priority 0.7
        const servicePaths = ['/apparel-manufacturers/', '/fashion-manufacturers/',
          '/garments-factory/', '/garments-manufacturers/', '/textile-manufacturers/',
          '/t-shirt-manufacturer/', '/hoodie-manufacturer/', '/full-package-production/',
          '/sustainable-clothing-manufacturers/', '/white-label/',
          '/best-clothing-manufacturers-2026/', '/top-50-clothing-manufacturers/',
          '/top-apparel-manufacturers/', '/top-fashion-manufacturers/',
          '/top-garments-manufacturers/'];
        if (servicePaths.some(p => url.endsWith(p))) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
          return item;
        }

        // Guide/insight/journal pages — priority 0.7
        if (url.includes('/guides/') || url.includes('/insights/') || 
            url.includes('/journal/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
          return item;
        }

        // Secondary pages — priority 0.5
        const secondaryPaths = ['/careers/', '/csr/', '/philanthropy/',
          '/case-studies/', '/branding-launch/', '/editorial-policy/',
          '/public-notice/'];
        if (secondaryPaths.some(p => url.endsWith(p))) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
          return item;
        }

        // Legal pages — priority 0.3
        const legalPaths = ['/privacy/', '/terms/'];
        if (legalPaths.some(p => url.endsWith(p))) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
          return item;
        }

        // Default
        item.priority = 0.6;
        item.changefreq = 'monthly';
        return item;
      }
    })
  ],

  build: {
    format: "directory",
    inlineStylesheets: 'always',
  },

  vite: {
    build: {
      minify: 'terser',
      cssCodeSplit: true,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    css: {
      devSourcemap: false,
    },
    server: {
      fs: {
        allow: ['..']
      }
    }
  },

  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },

  adapter: cloudflare()
});