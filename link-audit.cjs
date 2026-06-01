const fs = require('fs');
const path = require('path');

// Configuration
const projectRoot = 'c:\\Users\\Remon\\Desktop\\ossified-osiris';
const pagesDir = path.join(projectRoot, 'src', 'pages');

// Results storage
const allPages = new Map();
const allLinks = [];
const emailAddresses = [];
const linkGraph = new Map(); // page -> Set of pages it links to
const inboundLinks = new Map(); // page -> Set of pages that link to it

// Helper function to read all .astro files recursively
function getAstroFiles(dir, basePath = '') {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAstroFiles(fullPath, path.join(basePath, item)));
    } else if (item.endsWith('.astro')) {
      const relativePath = path.join(basePath, item);
      files.push({
        fullPath,
        relativePath,
        name: item.replace('.astro', '')
      });
    }
  }
  
  return files;
}

// Helper function to convert file path to URL path
function filePathToUrl(filePath) {
  // Remove src/pages prefix and .astro extension
  let url = filePath.replace('src\\pages\\', '').replace('.astro', '');
  
  // Convert backslashes to forward slashes
  url = url.replace(/\\/g, '/');
  
  // Handle index.astro -> root
  if (url === 'index') {
    return '/';
  }
  
  // Add leading slash
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  
  return url;
}

// Helper function to normalize URL for comparison
function normalizeUrl(url) {
  if (!url) return null;
  
  // Remove query parameters and fragments
  url = url.split('?')[0].split('#')[0];
  
  // Remove trailing slash except for root
  if (url !== '/' && url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  return url;
}

// Helper function to check if URL is internal
function isInternalUrl(url) {
  if (!url) return false;
  
  // Check for external URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return false;
  }
  
  // Check for mailto, tel, etc.
  if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('whatsapp:')) {
    return false;
  }
  
  // Check for anchor-only links
  if (url.startsWith('#')) {
    return false;
  }
  
  return true;
}

// Extract links and emails from file content
function extractLinksAndEmails(content, filePath) {
  const links = [];
  const emails = [];
  const lines = content.split('\n');
  
  // Regex patterns
  const hrefPattern = /href=["']([^"']+)["']/gi;
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  lines.forEach((line, lineNum) => {
    // Extract href links
    let match;
    while ((match = hrefPattern.exec(line)) !== null) {
      const url = match[1];
      links.push({
        url,
        line: lineNum + 1,
        fullLine: line.trim()
      });
      
      // Check for email in mailto links
      if (url.startsWith('mailto:')) {
        const email = url.replace('mailto:', '').split('?')[0];
        if (email && email.includes('@')) {
          emails.push({
            email,
            line: lineNum + 1,
            fullLine: line.trim(),
            file: filePath
          });
        }
      }
    }
    
    // Extract standalone emails
    const emailMatches = line.match(emailPattern);
    if (emailMatches) {
      emailMatches.forEach(email => {
        // Skip if already captured as mailto
        if (!line.includes(`mailto:${email}`)) {
          emails.push({
            email,
            line: lineNum + 1,
            fullLine: line.trim(),
            file: filePath
          });
        }
      });
    }
  });
  
  return { links, emails };
}

// Main analysis
console.log('Starting comprehensive link audit...\n');

// Get all Astro pages
const astroFiles = getAstroFiles(pagesDir);
console.log(`Found ${astroFiles.length} .astro pages\n`);

// Build page map
astroFiles.forEach(file => {
  const url = filePathToUrl(file.relativePath);
  allPages.set(url, {
    fullPath: file.fullPath,
    relativePath: file.relativePath,
    name: file.name,
    url
  });
  
  linkGraph.set(url, new Set());
  inboundLinks.set(url, new Set());
});

// Process each file
astroFiles.forEach(file => {
  const content = fs.readFileSync(file.fullPath, 'utf8');
  const url = filePathToUrl(file.relativePath);
  
  const { links, emails } = extractLinksAndEmails(content, file.relativePath);
  
  // Store emails
  emails.forEach(email => {
    emailAddresses.push(email);
  });
  
  // Process links
  links.forEach(link => {
    const normalizedUrl = normalizeUrl(link.url);
    
    allLinks.push({
      sourceFile: file.relativePath,
      sourceUrl: url,
      targetUrl: link.url,
      normalizedUrl,
      line: link.line,
      fullLine: link.fullLine
    });
    
    // If internal link, add to link graph
    if (isInternalUrl(normalizedUrl)) {
      linkGraph.get(url).add(normalizedUrl);
      
      // Add to inbound links
      if (inboundLinks.has(normalizedUrl)) {
        inboundLinks.get(normalizedUrl).add(url);
      } else {
        inboundLinks.set(normalizedUrl, new Set([url]));
      }
    }
  });
});

// Analysis results
console.log('='.repeat(80));
console.log('COMPREHENSIVE LINK AUDIT REPORT');
console.log('='.repeat(80));
console.log(`\nTotal pages analyzed: ${allPages.size}`);
console.log(`Total links found: ${allLinks.length}`);
console.log(`Total email addresses found: ${emailAddresses.length}\n`);

// 1. Broken or empty links
console.log('1. BROKEN OR EMPTY LINKS');
console.log('-'.repeat(80));
const brokenLinks = [];
const emptyLinks = [];

allLinks.forEach(link => {
  const normalized = normalizeUrl(link.targetUrl);
  
  // Check for empty links
  if (!link.targetUrl || link.targetUrl === '' || link.targetUrl === '#') {
    emptyLinks.push(link);
  }
  
  // Check for broken internal links
  if (isInternalUrl(normalized) && normalized && !allPages.has(normalized)) {
    brokenLinks.push(link);
  }
});

console.log(`\nEmpty links (${emptyLinks.length}):`);
if (emptyLinks.length === 0) {
  console.log('  None found');
} else {
  emptyLinks.slice(0, 50).forEach(link => {
    console.log(`  File: ${link.sourceFile}, Line ${link.line}`);
    console.log(`    URL: "${link.targetUrl}"`);
    console.log(`    Context: ${link.fullLine.substring(0, 100)}...`);
  });
  if (emptyLinks.length > 50) {
    console.log(`  ... and ${emptyLinks.length - 50} more`);
  }
}

console.log(`\nBroken internal links (${brokenLinks.length}):`);
if (brokenLinks.length === 0) {
  console.log('  None found');
} else {
  brokenLinks.slice(0, 50).forEach(link => {
    console.log(`  File: ${link.sourceFile}, Line ${link.line}`);
    console.log(`    Points to: ${link.targetUrl} (normalized: ${link.normalizedUrl})`);
    console.log(`    Context: ${link.fullLine.substring(0, 100)}...`);
  });
  if (brokenLinks.length > 50) {
    console.log(`  ... and ${brokenLinks.length - 50} more`);
  }
}

// 2. Orphan pages (pages with no inbound links)
console.log('\n2. ORPHAN PAGES (No Inbound Links)');
console.log('-'.repeat(80));
const orphanPages = [];

allPages.forEach((page, url) => {
  const inbound = inboundLinks.get(url) || new Set();
  // Exclude index page from orphan check (it's the homepage)
  if (url !== '/' && inbound.size === 0) {
    orphanPages.push(page);
  }
});

console.log(`\nFound ${orphanPages.length} orphan pages:`);
if (orphanPages.length === 0) {
  console.log('  None found');
} else {
  orphanPages.forEach(page => {
    console.log(`  - ${page.relativePath} (URL: ${page.url})`);
  });
}

// 3. Email addresses
console.log('\n3. EMAIL ADDRESSES');
console.log('-'.repeat(80));
const uniqueEmails = [...new Set(emailAddresses.map(e => e.email))];

console.log(`\nFound ${uniqueEmails.length} unique email addresses:`);
uniqueEmails.forEach(email => {
  const occurrences = emailAddresses.filter(e => e.email === email);
  console.log(`  - ${email}`);
  console.log(`    Found in ${occurrences.length} location(s):`);
  occurrences.slice(0, 5).forEach(occ => {
    console.log(`      ${occ.file}:${occ.line}`);
  });
  if (occurrences.length > 5) {
    console.log(`      ... and ${occurrences.length - 5} more`);
  }
});

// 4. Pages with no inbound internal links (SEO issue)
console.log('\n4. PAGES WITH NO INBOUND INTERNAL LINKS (SEO ISSUE)');
console.log('-'.repeat(80));
const noInboundPages = [];

allPages.forEach((page, url) => {
  const inbound = inboundLinks.get(url) || new Set();
  // Exclude index page
  if (url !== '/' && inbound.size === 0) {
    noInboundPages.push(page);
  }
});

console.log(`\nFound ${noInboundPages.length} pages with no inbound internal links:`);
if (noInboundPages.length === 0) {
  console.log('  None found');
} else {
  noInboundPages.forEach(page => {
    console.log(`  - ${page.relativePath} (URL: ${page.url})`);
  });
}

// 5. Pages with no outbound internal links
console.log('\n5. PAGES WITH NO OUTBOUND INTERNAL LINKS');
console.log('-'.repeat(80));
const noOutboundPages = [];

allPages.forEach((page, url) => {
  const outbound = linkGraph.get(url) || new Set();
  if (outbound.size === 0) {
    noOutboundPages.push(page);
  }
});

console.log(`\nFound ${noOutboundPages.length} pages with no outbound internal links:`);
if (noOutboundPages.length === 0) {
  console.log('  None found');
} else {
  noOutboundPages.forEach(page => {
    console.log(`  - ${page.relativePath} (URL: ${page.url})`);
  });
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total Pages: ${allPages.size}`);
console.log(`Empty Links: ${emptyLinks.length}`);
console.log(`Broken Internal Links: ${brokenLinks.length}`);
console.log(`Orphan Pages: ${orphanPages.length}`);
console.log(`Unique Email Addresses: ${uniqueEmails.length}`);
console.log(`Pages with No Inbound Links: ${noInboundPages.length}`);
console.log(`Pages with No Outbound Links: ${noOutboundPages.length}`);

// Save detailed report to file
const reportPath = path.join(projectRoot, 'link-audit-report.txt');
let reportContent = `
COMPREHENSIVE LINK AUDIT REPORT
Generated: ${new Date().toISOString()}
Project: ${projectRoot}

================================================================================
SUMMARY
================================================================================
Total Pages: ${allPages.size}
Total Links Found: ${allLinks.length}
Empty Links: ${emptyLinks.length}
Broken Internal Links: ${brokenLinks.length}
Orphan Pages: ${orphanPages.length}
Unique Email Addresses: ${uniqueEmails.length}
Pages with No Inbound Links: ${noInboundPages.length}
Pages with No Outbound Links: ${noOutboundPages.length}

================================================================================
1. BROKEN OR EMPTY LINKS
================================================================================

EMPTY LINKS (${emptyLinks.length}):
${emptyLinks.length === 0 ? 'None found' : emptyLinks.map(l => 
  `File: ${l.sourceFile}, Line ${l.line}\n  URL: "${l.targetUrl}"\n  Context: ${l.fullLine.substring(0, 150)}...`
).join('\n\n')}

BROKEN INTERNAL LINKS (${brokenLinks.length}):
${brokenLinks.length === 0 ? 'None found' : brokenLinks.map(l =>
  `File: ${l.sourceFile}, Line ${l.line}\n  Points to: ${l.targetUrl}\n  Normalized: ${l.normalizedUrl}\n  Context: ${l.fullLine.substring(0, 150)}...`
).join('\n\n')}

================================================================================
2. ORPHAN PAGES (No Inbound Links)
================================================================================
${orphanPages.length === 0 ? 'None found' : orphanPages.map(p => 
  `- ${p.relativePath} (URL: ${p.url})`
).join('\n')}

================================================================================
3. EMAIL ADDRESSES
================================================================================
${uniqueEmails.length === 0 ? 'None found' : uniqueEmails.map(email => {
  const occurrences = emailAddresses.filter(e => e.email === email);
  return `- ${email}\n  Found in ${occurrences.length} location(s):\n${occurrences.map(o => `    ${o.file}:${o.line}`).join('\n')}`;
}).join('\n\n')}

================================================================================
4. PAGES WITH NO INBOUND INTERNAL LINKS (SEO ISSUE)
================================================================================
${noInboundPages.length === 0 ? 'None found' : noInboundPages.map(p => 
  `- ${p.relativePath} (URL: ${p.url})`
).join('\n')}

================================================================================
5. PAGES WITH NO OUTBOUND INTERNAL LINKS
================================================================================
${noOutboundPages.length === 0 ? 'None found' : noOutboundPages.map(p => 
  `- ${p.relativePath} (URL: ${p.url})`
).join('\n')}

================================================================================
ALL PAGES LIST
================================================================================
${Array.from(allPages.values()).map(p => `${p.url} -> ${p.relativePath}`).sort().join('\n')}
`;

fs.writeFileSync(reportPath, reportContent);
console.log(`\nDetailed report saved to: ${reportPath}`);
