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

// Extract all internal links from a file
function extractLinksFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const links = [];
    
    // Match href="/..." or href='/...'
    const hrefRegex = /href=["']\/([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      const link = match[1];
      // Filter out external links, assets, etc.
      if (!link.startsWith('http') && 
          !link.startsWith('#') && 
          !link.startsWith('fonts/') && 
          !link.startsWith('_astro') &&
          !link.startsWith('scripts/') &&
          !link.includes('.css') &&
          !link.includes('.js') &&
          !link.includes('.woff') &&
          !link.includes('.webp') &&
          !link.includes('.svg') &&
          !link.includes('.png')) {
        links.push('/' + link);
      }
    }
    
    return links;
  } catch (error) {
    return [];
  }
}

// Get all .astro, .js, .ts files in src/
function getAllSourceFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      files.push(...getAllSourceFiles(fullPath));
    } else if (entry.name.match(/\.(astro|js|ts|mjs|cjs)$/)) {
      files.push(fullPath);
    }
  }
  return files;
}

const pages = getAllPages('src/pages');
console.log(`Found ${pages.length} pages to check\n`);

// Collect all internal links from all source files
const allLinks = new Map();
const sourceFiles = getAllSourceFiles('src');

console.log(`Scanning ${sourceFiles.length} source files for internal links...`);

for (const sourceFile of sourceFiles) {
  const links = extractLinksFromFile(sourceFile);
  for (const link of links) {
    if (!allLinks.has(link)) {
      allLinks.set(link, []);
    }
    allLinks.get(link).push(sourceFile);
  }
}

console.log(`Found ${allLinks.size} unique internal links\n`);

// Debug: Check specific pages
const testPages = ['/about', '/products', '/work-process', '/certifications', '/csr', '/contact', '/all-services'];
console.log('Testing specific pages:');
console.log('='.repeat(80));

for (const pageUrl of testPages) {
  const page = pages.find(p => p.url === pageUrl);
  if (!page) {
    console.log(`${pageUrl}: PAGE NOT FOUND IN PAGE LIST`);
    continue;
  }
  
  const incomingLinks = allLinks.get(pageUrl) || [];
  const urlWithoutSlash = pageUrl.replace(/^\//, '');
  const linksWithoutSlash = allLinks.get(urlWithoutSlash) || [];
  const urlWithSlash = pageUrl + '/';
  const linksWithSlash = allLinks.get(urlWithSlash) || [];
  
  console.log(`\nPage: ${pageUrl} (${page.file})`);
  console.log(`  Direct match (${pageUrl}): ${incomingLinks.length} refs`);
  if (incomingLinks.length > 0) {
    incomingLinks.forEach(ref => console.log(`    - ${ref}`));
  }
  console.log(`  Without slash (${urlWithoutSlash}): ${linksWithoutSlash.length} refs`);
  if (linksWithoutSlash.length > 0) {
    linksWithoutSlash.forEach(ref => console.log(`    - ${ref}`));
  }
  console.log(`  With slash (${urlWithSlash}): ${linksWithSlash.length} refs`);
  if (linksWithSlash.length > 0) {
    linksWithSlash.forEach(ref => console.log(`    - ${ref}`));
  }
  
  const allRefs = new Set([...incomingLinks, ...linksWithoutSlash, ...linksWithSlash]);
  const externalRefs = Array.from(allRefs).filter(ref => {
    const normalizedRef = ref.replace(/\\/g, '/');
    const normalizedPageFile = page.file.replace(/\\/g, '/');
    console.log(`    Checking: ${normalizedRef} includes ${normalizedPageFile}? ${normalizedRef.includes(normalizedPageFile)}`);
    return !normalizedRef.includes(normalizedPageFile);
  });
  
  console.log(`  External refs after filtering: ${externalRefs.length}`);
  if (externalRefs.length > 0) {
    externalRefs.forEach(ref => console.log(`    - ${ref}`));
  }
}
