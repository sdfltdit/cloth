const fs = require('fs');
const path = require('path');

// Extract all internal links from BaseLayout.astro specifically
const baseLayoutPath = 'src/layouts/BaseLayout.astro';
const content = fs.readFileSync(baseLayoutPath, 'utf-8');

const links = [];
const hrefRegex = /href=["']\/([^"']+)["']/g;
let match;
while ((match = hrefRegex.exec(content)) !== null) {
  const link = match[1];
  links.push('/' + link);
}

console.log('Links found in BaseLayout.astro:');
console.log('='.repeat(80));
links.forEach(link => console.log(link));
console.log('\nTotal links:', links.length);

// Now let's check if specific pages are in this list
const testPages = ['/about', '/products', '/work-process', '/certifications', '/csr', '/contact', '/all-services'];
console.log('\nChecking specific pages:');
testPages.forEach(page => {
  const found = links.includes(page);
  console.log(`${page}: ${found ? '✅ FOUND' : '❌ NOT FOUND'}`);
});
