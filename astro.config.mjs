import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sdfltd.com',
  output: 'static',
  compressHTML: true,

  prefetch: false,

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // 2026-08-22: site pruned from 347 -> 44 pages. Filter/serialize
      // rewritten for the small page set (the old version special-cased
      // ~300 paths that no longer exist). Kept the noindex calls that are
      // still relevant: these three stay out of the sitemap because
      // they're transactional/personal-data pages, not content Google
      // should be sending search traffic to.
      filter: (page) => {
        const noindexPaths = ['/booking/', '/visa-docs/', '/agreement/'];
        return !noindexPaths.some((p) => page.endsWith(p));
      },
      serialize(item) {
        const url = item.url;
        item.lastmod = new Date().toISOString().split('T')[0];

        if (url === 'https://sdfltd.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
          return item;
        }

        const corePaths = ['/contact/', '/about/', '/certifications/',
          '/products/', '/all-services/', '/sustainability/', '/work-process/',
          '/csr/', '/clothing-manufacturers/'];
        if (corePaths.some(p => url.endsWith(p))) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
          return item;
        }

        if (url.includes('/tools/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
          return item;
        }

        const legalPaths = ['/privacy/', '/terms/', '/cookies/', '/confidentiality/', '/verify/'];
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
    inlineStylesheets: 'always',
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

  // FIX: was 'astro/assets/services/noop' which DISABLED all image optimisation.
  // sharp is Astro's built-in service — automatically converts to WebP/AVIF,
  // generates responsive srcset, and resizes images at build time.
  // Run: npm install sharp   (one-time, already in most Astro installs)
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    // Default formats in order of preference: AVIF (best), then WebP, then original
    defaultFormat: 'webp',
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  }
});
