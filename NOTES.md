# Project Notes

## Locked Dependencies

### @astrojs/sitemap — locked to 3.1.0
- Version 3.5+ contains a bug causing build failure: "Cannot read properties of undefined (reading 'reduce')"
- Bug location: node_modules/@astrojs/sitemap/dist/index.js:85
- Do not upgrade without testing in a separate branch
- If upgrading, run: npm run build and verify sitemap-index.xml is generated correctly
