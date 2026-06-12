import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sdfltd.com',
  output: 'static',
  compressHTML: true,

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const url = item.url;
        const today = new Date().toISOString().split('T')[0];

        item.lastmod = today;

        if (url === 'https://sdfltd.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
          return item;
        }

        const corePaths = ['/contact/', '/about/', '/certifications/',
          '/products/', '/sustainability/', '/work-process/',
          '/low-moq-clothing-manufacturers/', '/clothing-manufacturers/',
          '/clothing-manufacturers-for-startups/'];
        if (corePaths.some(p => url.endsWith(p))) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
          return item;
        }

        if (url.includes('/clothing-manufacturer-')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

        if (url.includes('/tools/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

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

        if (url.includes('/guides/') || url.includes('/insights/') ||
          url.includes('/journal/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
          return item;
        }

        const secondaryPaths = ['/careers/', '/csr/', '/philanthropy/',
          '/case-studies/', '/branding-launch/', '/editorial-policy/',
          '/public-notice/'];
        if (secondaryPaths.some(p => url.endsWith(p))) {
          item.priority = 0.5;
          item.changefreq = 'monthly';
          return item;
        }

        const legalPaths = ['/privacy/', '/terms/'];
        if (legalPaths.some(p => url.endsWith(p))) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
          return item;
        }

        item.priority = 0.6;
        item.changefreq = 'monthly';
        return item;
      }
    })
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    assets: '_astro',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      cssMinify: 'esbuild',
      minify: 'esbuild',
      cssTarget: 'esnext',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      assetsInlineLimit: 20480,
      modulePreload: false,
    },
    css: {
      devSourcemap: false,
    },
  },

  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  }
});
