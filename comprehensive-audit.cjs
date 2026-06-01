const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://sdfltd.com/';
const PAGES_DIR = 'src/pages';
const COMPONENTS_DIR = 'src/components';
const LAYOUTS_DIR = 'src/layouts';
const REDIRECTS_FILE = 'public/_redirects';

// Generic anchor texts to find
const GENERIC_ANCHOR_TEXTS = ['click here', 'read more', 'here', 'this', 'learn more', 'more info', 'view more'];

// Results storage
const results = {
  redirects: {
    rules: [],
    chains: [],
    missingVariations: []
  },
  internalLinks: {
    anchorTextCounts: {},
    longAnchorTexts: [],
    genericAnchorTexts: [],
    brokenLinks: []
  },
  headings: {
    emptyHeadings: [],
    missingH1: [],
    multipleH1: []
  },
  hreflang: {
    existingHreflang: [],
    missingSelfReferential: []
  }
};

// Helper function to read all files in a directory recursively
function getFiles(dir, extension = '.astro') {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getFiles(fullPath, extension));
    } else if (item.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

// 1. Audit HTTP Redirects
function auditRedirects() {
  console.log('Auditing HTTP redirects...');
  
  if (!fs.existsSync(REDIRECTS_FILE)) {
    console.log('  No _redirects file found');
    return;
  }
  
  const content = fs.readFileSync(REDIRECTS_FILE, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  // Parse redirect rules
  const redirectMap = new Map();
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      const from = parts[0];
      const to = parts[1];
      redirectMap.set(from, to);
      results.redirects.rules.push({ from, to, line: lines.indexOf(line) + 1 });
    }
  }
  
  // Check for redirect chains (A->B->C)
  for (const [from, to] of redirectMap) {
    let current = to;
    const chain = [from];
    const visited = new Set();
    
    while (current && redirectMap.has(current) && !visited.has(current)) {
      visited.add(current);
      chain.push(current);
      current = redirectMap.get(current);
    }
    
    if (chain.length > 2) {
      results.redirects.chains.push({
        chain: chain.join(' -> '),
        recommendation: `Redirect directly from ${chain[0]} to ${chain[chain.length - 1]}`
      });
    }
  }
  
  // Check for common URL variations
  const basePaths = Array.from(redirectMap.keys()).map(p => p.replace(/\/$/, ''));
  for (const basePath of basePaths) {
    const withSlash = basePath + '/';
    const withoutSlash = basePath;
    
    if (redirectMap.has(withSlash) && !redirectMap.has(withoutSlash)) {
      results.redirects.missingVariations.push({
        path: withoutSlash,
        suggestion: `Add redirect for ${withoutSlash} to match ${withSlash}`
      });
    } else if (redirectMap.has(withoutSlash) && !redirectMap.has(withSlash)) {
      results.redirects.missingVariations.push({
        path: withSlash,
        suggestion: `Add redirect for ${withSlash} to match ${withoutSlash}`
      });
    }
  }
}

// 2. Audit Internal Links
function auditInternalLinks() {
  console.log('Auditing internal links...');
  
  const pageFiles = getFiles(PAGES_DIR);
  const componentFiles = getFiles(COMPONENTS_DIR);
  const allFiles = [...pageFiles, ...componentFiles];
  
  // Get all existing pages for link validation
  const existingPages = new Set();
  for (const file of pageFiles) {
    const relativePath = file.replace(PAGES_DIR, '').replace(/\.astro$/, '');
    // Convert to URL path
    const urlPath = relativePath.replace(/\\/g, '/').replace(/\/index$/, '') || '/';
    existingPages.add(urlPath);
  }
  
  const anchorTextMap = new Map();
  
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    // Find all anchor tags with href
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gis;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1];
      const anchorText = match[2].trim();
      const startPos = match.index;
      const lineNumber = content.substring(0, startPos).split('\n').length;
      
      // Skip external links
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }
      
      // Count anchor text usage
      if (anchorText) {
        const key = anchorText.toLowerCase();
        anchorTextMap.set(key, (anchorTextMap.get(key) || 0) + 1);
      }
      
      // Check for long anchor text (> 60 chars)
      if (anchorText.length > 60) {
        results.internalLinks.longAnchorTexts.push({
          file,
          line: lineNumber,
          text: anchorText,
          length: anchorText.length
        });
      }
      
      // Check for generic anchor text
      const lowerText = anchorText.toLowerCase();
      for (const generic of GENERIC_ANCHOR_TEXTS) {
        if (lowerText === generic || lowerText.includes(generic)) {
          results.internalLinks.genericAnchorTexts.push({
            file,
            line: lineNumber,
            text: anchorText,
            matchedGeneric: generic
          });
          break;
        }
      }
      
      // Check for broken links (internal links to non-existent pages)
      if (href.startsWith('/') && !href.includes('#') && !href.includes('?')) {
        let targetPath = href.replace(/\/$/, '') || '/';
        if (!existingPages.has(targetPath)) {
          // Try with .astro extension
          if (!existingPages.has(targetPath + '/')) {
            results.internalLinks.brokenLinks.push({
              file,
              line: lineNumber,
              href,
              anchorText
            });
          }
        }
      }
    }
  }
  
  // Find anchor texts used more than 5 times
  for (const [text, count] of anchorTextMap) {
    if (count > 5) {
      results.internalLinks.anchorTextCounts[text] = count;
    }
  }
}

// 3. Audit Headings
function auditHeadings() {
  console.log('Auditing headings...');
  
  const pageFiles = getFiles(PAGES_DIR);
  
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    const h1Tags = [];
    const emptyHeadings = [];
    
    // Find all heading tags
    const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gis;
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const innerText = match[2].trim();
      const startPos = match.index;
      const lineNumber = content.substring(0, startPos).split('\n').length;
      
      if (level === 1) {
        h1Tags.push({ line: lineNumber, text: innerText });
      }
      
      // Check for empty headings
      if (!innerText || innerText === '') {
        emptyHeadings.push({
          file,
          line: lineNumber,
          level: `h${level}`
        });
      }
    }
    
    // Check for missing h1
    if (h1Tags.length === 0) {
      results.headings.missingH1.push({ file });
    }
    
    // Check for multiple h1
    if (h1Tags.length > 1) {
      results.headings.multipleH1.push({
        file,
        count: h1Tags.length,
        locations: h1Tags
      });
    }
    
    // Add empty headings to results
    results.headings.emptyHeadings.push(...emptyHeadings);
  }
}

// 4. Audit hreflang
function auditHreflang() {
  console.log('Auditing hreflang tags...');
  
  const pageFiles = getFiles(PAGES_DIR);
  const layoutFiles = getFiles(LAYOUTS_DIR);
  const allFiles = [...pageFiles, ...layoutFiles];
  
  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    // Find all hreflang tags
    const hreflangRegex = /<link[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    const hreflangTags = [];
    while ((match = hreflangRegex.exec(content)) !== null) {
      const lang = match[1];
      const href = match[2];
      const startPos = match.index;
      const lineNumber = content.substring(0, startPos).split('\n').length;
      
      hreflangTags.push({
        lang,
        href,
        line: lineNumber
      });
      
      results.hreflang.existingHreflang.push({
        file,
        line: lineNumber,
        lang,
        href
      });
    }
    
    // Check if file has self-referential hreflang
    if (hreflangTags.length > 0) {
      const hasSelfReferential = hreflangTags.some(tag => 
        tag.lang === 'x-default' || tag.lang === 'en'
      );
      
      if (!hasSelfReferential) {
        results.hreflang.missingSelfReferential.push({
          file,
          existingTags: hreflangTags
        });
      }
    } else {
      // Pages with no hreflang at all
      if (file.startsWith(PAGES_DIR)) {
        results.hreflang.missingSelfReferential.push({
          file,
          existingTags: []
        });
      }
    }
  }
}

// Generate report
function generateReport() {
  console.log('\n\n=== COMPREHENSIVE AUDIT REPORT ===\n');
  
  // 1. HTTP Redirects
  console.log('1. HTTP REDIRECTS AUDIT');
  console.log('=========================\n');
  console.log(`Total redirect rules: ${results.redirects.rules.length}`);
  console.log('\nAll redirect rules:');
  results.redirects.rules.forEach(rule => {
    console.log(`  Line ${rule.line}: ${rule.from} -> ${rule.to}`);
  });
  
  if (results.redirects.chains.length > 0) {
    console.log('\n⚠️  REDIRECT CHAINS FOUND:');
    results.redirects.chains.forEach(chain => {
      console.log(`  - ${chain.chain}`);
      console.log(`    Recommendation: ${chain.recommendation}`);
    });
  } else {
    console.log('\n✓ No redirect chains found');
  }
  
  if (results.redirects.missingVariations.length > 0) {
    console.log('\n⚠️  MISSING REDIRECT VARIATIONS:');
    results.redirects.missingVariations.forEach(variation => {
      console.log(`  - ${variation.path}`);
      console.log(`    ${variation.suggestion}`);
    });
  } else {
    console.log('\n✓ No missing redirect variations found');
  }
  
  // 2. Internal Links
  console.log('\n\n2. INTERNAL LINKS AUDIT');
  console.log('=======================\n');
  
  const frequentAnchorTexts = Object.entries(results.internalLinks.anchorTextCounts)
    .sort((a, b) => b[1] - a[1]);
  
  if (frequentAnchorTexts.length > 0) {
    console.log('⚠️  ANCHOR TEXTS USED MORE THAN 5 TIMES:');
    frequentAnchorTexts.forEach(([text, count]) => {
      console.log(`  - "${text}" (used ${count} times)`);
    });
  } else {
    console.log('✓ No anchor texts used more than 5 times');
  }
  
  if (results.internalLinks.longAnchorTexts.length > 0) {
    console.log('\n⚠️  ANCHOR TEXTS LONGER THAN 60 CHARACTERS:');
    results.internalLinks.longAnchorTexts.forEach(item => {
      console.log(`  - ${path.basename(item.file)}:${item.line}`);
      console.log(`    Text: "${item.text}" (${item.length} chars)`);
    });
  } else {
    console.log('\n✓ No anchor texts longer than 60 characters');
  }
  
  if (results.internalLinks.genericAnchorTexts.length > 0) {
    console.log('\n⚠️  GENERIC ANCHOR TEXTS FOUND:');
    results.internalLinks.genericAnchorTexts.forEach(item => {
      console.log(`  - ${path.basename(item.file)}:${item.line}`);
      console.log(`    Text: "${item.text}" (matches: ${item.matchedGeneric})`);
    });
  } else {
    console.log('\n✓ No generic anchor texts found');
  }
  
  if (results.internalLinks.brokenLinks.length > 0) {
    console.log('\n⚠️  POTENTIAL BROKEN INTERNAL LINKS:');
    results.internalLinks.brokenLinks.forEach(item => {
      console.log(`  - ${path.basename(item.file)}:${item.line}`);
      console.log(`    href="${item.href}" text="${item.anchorText}"`);
    });
  } else {
    console.log('\n✓ No broken internal links found');
  }
  
  // 3. Headings
  console.log('\n\n3. HEADINGS AUDIT');
  console.log('================\n');
  
  if (results.headings.emptyHeadings.length > 0) {
    console.log('⚠️  EMPTY HEADING TAGS:');
    results.headings.emptyHeadings.forEach(item => {
      console.log(`  - ${path.basename(item.file)}:${item.line} (${item.level})`);
    });
  } else {
    console.log('✓ No empty heading tags found');
  }
  
  if (results.headings.missingH1.length > 0) {
    console.log('\n⚠️  PAGES MISSING H1:');
    results.headings.missingH1.forEach(item => {
      console.log(`  - ${item.file}`);
    });
  } else {
    console.log('\n✓ All pages have H1 tags');
  }
  
  if (results.headings.multipleH1.length > 0) {
    console.log('\n⚠️  PAGES WITH MULTIPLE H1 TAGS:');
    results.headings.multipleH1.forEach(item => {
      console.log(`  - ${item.file} (${item.count} H1 tags)`);
      item.locations.forEach(loc => {
        console.log(`    Line ${loc.line}: "${loc.text}"`);
      });
    });
  } else {
    console.log('\n✓ No pages with multiple H1 tags');
  }
  
  // 4. hreflang
  console.log('\n\n4. HREFLANG AUDIT');
  console.log('=================\n');
  
  if (results.hreflang.existingHreflang.length > 0) {
    console.log('EXISTING HREFLANG TAGS:');
    results.hreflang.existingHreflang.forEach(item => {
      console.log(`  - ${path.basename(item.file)}:${item.line}`);
      console.log(`    lang="${item.lang}" href="${item.href}"`);
    });
  } else {
    console.log('✓ No hreflang tags found in the codebase');
  }
  
  if (results.hreflang.missingSelfReferential.length > 0) {
    console.log('\n⚠️  PAGES MISSING SELF-REFERENTIAL HREFLANG:');
    results.hreflang.missingSelfReferential.forEach(item => {
      console.log(`  - ${item.file}`);
      if (item.existingTags.length > 0) {
        console.log(`    Existing tags: ${item.existingTags.map(t => t.lang).join(', ')}`);
      } else {
        console.log('    No hreflang tags present');
      }
    });
  } else {
    console.log('\n✓ All pages have self-referential hreflang');
  }
  
  // Save detailed JSON report
  fs.writeFileSync('audit-results-detailed.json', JSON.stringify(results, null, 2));
  console.log('\n\nDetailed JSON report saved to: audit-results-detailed.json');
}

// Run all audits
try {
  auditRedirects();
  auditInternalLinks();
  auditHeadings();
  auditHreflang();
  generateReport();
} catch (error) {
  console.error('Error during audit:', error);
  process.exit(1);
}
