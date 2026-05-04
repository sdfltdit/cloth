import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sdfltd.com',
  output: "static",
  compressHTML: true,
  integrations: [tailwind()], // sitemap()],
  build: {
    format: "directory",
  },
  vite: {
    build: {
      minify: "esbuild",
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
  }
});