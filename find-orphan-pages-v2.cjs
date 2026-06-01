const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
console.log(`Found ${pages.length} pages to check\n`);

// Search for each URL in the codebase with multiple patterns
const results = [];

for (const page of pages) {
  if (page.url === '/404') {
    results.push({ ...page, status: '✅ Linked (special page)', refs: ['N/A'] });
    continue;
  }
  
  if (page.url === '/') {
    // Homepage is always linked
    results.push({ ...page, status: '✅ Linked (homepage)', refs: ['N/A'] });
    continue;
  }
  
  // Create multiple search patterns
  const searchPatterns = [
    page.url,                                    // /about
    page.url.replace(/^\//, ''),                 // about
    `${page.url}/`,                              // /about/
    `${page.url.replace(/^\//, '')}/`,           // about/
    `"${page.url}"`,                             // "/about"
    `'${page.url}'`,                             // '/about'
    `"${page.url.replace(/^\//, '')}"`,          // "about"
    `'${page.url.replace(/^\//, '')}'`,          // 'about'
  ];
  
  let foundRefs = new Set();
  
  for (const pattern of searchPatterns) {
    if (pattern.length < 3) continue; // Skip very short patterns
    
    try {
      // Search for the pattern in .astro, .js, .ts, .mjs, .cjs, .json, .md, .html, .xml files
      const grepCmd = `rg -l "${pattern.replace(/"/g, '\\"')}" --type-add 'astro:*.astro' --type astro --type js --type ts --type mjs --type cjs --type json --type md --type html --type xml .`;
      
      const output = execSync(grepCmd, { 
        cwd: 'c:\\Users\\Remon\\Desktop\\ossified-osiris',
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 5000
      });
      
      const matchingFiles = output.trim().split('\n').filter(f => f);
      
      // Filter out the page itself and script files
      const externalRefs = matchingFiles.filter(f => 
        !f.includes(page.file.replace(/\\/g, '/')) &&
        !f.includes('find-orphan-pages') &&
        !f.includes('orphan-pages-report')
      );
      
      externalRefs.forEach(ref => foundRefs.add(ref));
    } catch (error) {
      // No matches found for this pattern, continue
    }
  }
  
  if (foundRefs.size > 0) {
    results.push({ 
      ...page, 
      status: '✅ Linked', 
      refs: Array.from(foundRefs) 
    });
  } else {
    results.push({ 
      ...page, 
      status: '❌ Orphan', 
      refs: [] 
    });
  }
}

// Print results
console.log('='.repeat(80));
console.log('ORPHAN PAGE AUDIT REPORT');
console.log('='.repeat(80));
console.log();

const linked = results.filter(r => r.status.includes('✅'));
const orphans = results.filter(r => r.status.includes('❌'));

console.log(`Total Pages: ${results.length}`);
console.log(`Linked Pages: ${linked.length}`);
console.log(`Orphan Pages: ${orphans.length}`);
console.log();

console.log('='.repeat(80));
console.log('LINKED PAGES');
console.log('='.repeat(80));
linked.forEach(r => {
  console.log(`${r.status} ${r.url} (${r.file})`);
  if (r.refs.length > 0 && r.refs[0] !== 'N/A') {
    console.log(`  Referenced in: ${r.refs.slice(0, 3).join(', ')}${r.refs.length > 3 ? '...' : ''}`);
  }
});

console.log();
console.log('='.repeat(80));
console.log('ORPHAN PAGES');
console.log('='.repeat(80));
orphans.forEach(r => {
  console.log(`${r.status} ${r.url} (${r.file})`);
});

// Save to file
const report = `
ORPHAN PAGE AUDIT REPORT
========================

Total Pages: ${results.length}
Linked Pages: ${linked.length}
Orphan Pages: ${orphans.length}

LINKED PAGES
------------
${linked.map(r => `${r.status} ${r.url} (${r.file})${r.refs.length > 0 && r.refs[0] !== 'N/A' ? '\n  Referenced in: ' + r.refs.slice(0, 3).join(', ') + (r.refs.length > 3 ? '...' : '') : ''}`).join('\n\n')}

ORPHAN PAGES
------------
${orphans.map(r => `${r.status} ${r.url} (${r.file})`).join('\n')}
`;

fs.writeFileSync('orphan-pages-report.txt', report);
console.log('\nReport saved to orphan-pages-report.txt');
