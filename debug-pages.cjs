const fs = require('fs');
const path = require('path');

// Get all .astro files in src/pages
function getAllPages(dir, baseDir = 'src/pages') {
  const pages = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      pages.push(...getAllPages(fullPath, path.join(baseDir, file.name)));
    } else if (file.name.endsWith('.astro')) {
      const relativePath = path.join(baseDir, file.name);
      // Convert file path to URL
      let url = relativePath
        .replace(/\\/g, '/')
        .replace('src/pages/', '')
        .replace('.astro', '');
      
      if (url === 'index') {
        url = '/';
      } else if (url.endsWith('/index')) {
        url = url.replace('/index', '');
      }
      
      pages.push({
        file: relativePath,
        url: url
      });
    }
  }
  return pages;
}

const pages = getAllPages('src/pages');
console.log(`Found ${pages.length} pages\n`);

// Show first 20 pages
console.log('First 20 pages:');
pages.slice(0, 20).forEach(p => {
  console.log(`  ${p.url} -> ${p.file}`);
});

// Check for specific pages
const testUrls = ['/about', '/products', '/work-process'];
console.log('\nLooking for specific URLs:');
testUrls.forEach(url => {
  const found = pages.find(p => p.url === url);
  console.log(`  ${url}: ${found ? '✅ FOUND' : '❌ NOT FOUND'}`);
  if (found) {
    console.log(`    File: ${found.file}`);
  }
});
