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
      // Exclude noindex pages from the sitemap. Submitting a URL in the
      // sitemap while its <meta name="robots" content="noindex"> tag says
      // not to index it sends Google a mixed signal (found via
      // 2026-07-22 GSC Coverage audit: sitemap included several
      // noindex=true pages, which likely caused at least one of them to
      // surface as "Excluded by noindex tag" in Page Indexing).
      filter: (page) => {
        const noindexPaths = [
          '/booking/',
          '/visa-docs/',
          '/public-notice/',
          '/philanthropy/',
          '/editorial-policy/',
          '/case-studies/',
          '/agreement/',
          // 2026-08-18: thin (<800 word) non-priority-market country pages,
          // noindexed to reduce scaled/near-duplicate content footprint.
          // Europe + North America country pages kept indexed as priority
          // markets even where thin; these Asia/Middle East/LatAm pages
          // were not, per business call.
          '/clothing-manufacturer-malaysia/',
          '/clothing-manufacturer-saudi-arabia/',
          '/clothing-manufacturer-philippines/',
          '/clothing-manufacturer-thailand/',
          '/clothing-manufacturer-singapore/',
          '/clothing-manufacturer-uae/',
          '/clothing-manufacturer-indonesia/',
          '/clothing-manufacturer-argentina/',
          '/clothing-manufacturer-india/',
          '/clothing-manufacturer-mexico/',
          '/clothing-manufacturer-vietnam/',
          '/clothing-manufacturer-japan/',
          '/clothing-manufacturer-south-korea/',
          '/clothing-manufacturer-new-zealand/',
          '/clothing-manufacturer-brazil/',
          '/clothing-manufacturer-australia/',
        ];
        return !noindexPaths.some((p) => page.endsWith(p));
      },
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
