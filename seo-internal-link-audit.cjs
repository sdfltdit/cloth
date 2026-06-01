const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// STEP 1: Collect all valid routes from src/pages/
function getValidRoutes(pagesDir) {
  const routes = [];
  
  function scanDirectory(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, path.join(basePath, file));
      } else if (file.endsWith('.astro')) {
        // Convert file path to URL route
        let route = basePath;
        
        if (file === 'index.astro') {
          // index.astro becomes the directory path or root
          if (route === '') {
            route = '/';
          } else {
            // Ensure trailing slash for directory index
            if (!route.endsWith('/')) {
              route = route + '/';
            }
          }
        } else {
          // other files become the filename without .astro
          const fileName = file.replace('.astro', '');
          route = path.join(basePath, fileName);
        }
        
        // Normalize path separators to forward slashes
        route = route.replace(/\\/g, '/');
        
        // Ensure leading slash for all routes except root
        if (route !== '/' && !route.startsWith('/')) {
          route = '/' + route;
        }
        
        // Ensure trailing slash for all routes except root
        if (route !== '/' && !route.endsWith('/')) {
          route = route + '/';
        }
        
        routes.push({
          url: route,
          filePath: fullPath,
          isTools: route.includes('/tools/')
        });
      }
    }
  }
  
  scanDirectory(pagesDir);
  return routes;
}

// STEP 2: Scan all internal links from .astro files
function extractInternalLinks(dir) {
  const links = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.endsWith('.astro')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Match href attributes in links
          const hrefRegex = /href=["']([^"']+)["']/g;
          let match;
          
          while ((match = hrefRegex.exec(line)) !== null) {
            const href = match[1];
            
            // Skip external links, anchors, mailto, tel
            if (href.startsWith('http://') || 
                href.startsWith('https://') || 
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.startsWith('javascript:')) {
              continue;
            }
            
            // Normalize the href
            let normalizedHref = href.replace(/\\/g, '/');
            
            // Remove query parameters and hash for comparison
            normalizedHref = normalizedHref.split('?')[0].split('#')[0];
            
            // Ensure trailing slash for consistency
            if (normalizedHref !== '/' && !normalizedHref.endsWith('/')) {
              normalizedHref = normalizedHref + '/';
            }
            
            links.push({
              href: normalizedHref,
              sourceFile: fullPath,
              lineNumber: index + 1,
              originalHref: href
            });
          }
        });
      }
    }
  }
  
  scanDirectory(dir);
  return links;
}

// Main audit function
function performAudit() {
  const projectRoot = 'c:\\Users\\Remon\\Desktop\\ossified-osiris';
  const pagesDir = path.join(projectRoot, 'src', 'pages');
  const componentsDir = path.join(projectRoot, 'src', 'components');
  const layoutsDir = path.join(projectRoot, 'src', 'layouts');
  
  let reportOutput = '';
  
  function log(message) {
    console.log(message);
    reportOutput += message + '\n';
  }
  
  log(`${colors.cyan}=== SEO INTERNAL LINKING AUDIT ===${colors.reset}\n`);
  
  // STEP 1: Collect valid routes
  log(`${colors.blue}STEP 1: Collecting valid routes...${colors.reset}`);
  const validRoutes = getValidRoutes(pagesDir);
  log(`  Found ${validRoutes.length} valid pages\n`);
  
  // STEP 2: Scan internal links
  log(`${colors.blue}STEP 2: Scanning internal links...${colors.reset}`);
  const allLinks = [];
  allLinks.push(...extractInternalLinks(pagesDir));
  allLinks.push(...extractInternalLinks(componentsDir));
  allLinks.push(...extractInternalLinks(layoutsDir));
  log(`  Found ${allLinks.length} internal links\n`);
  
  // STEP 3: Find broken links
  log(`${colors.blue}STEP 3: Finding broken internal links...${colors.reset}`);
  const validUrls = new Set(validRoutes.map(r => r.url));
  const brokenLinks = [];
  
  for (const link of allLinks) {
    if (!validUrls.has(link.href)) {
      brokenLinks.push(link);
    }
  }
  
  // STEP 4: Find orphan pages
  log(`${colors.blue}STEP 4: Finding orphan pages...${colors.reset}`);
  const inboundLinks = {};
  
  // Initialize count for all routes
  for (const route of validRoutes) {
    inboundLinks[route.url] = [];
  }
  
  // Count inbound links
  for (const link of allLinks) {
    if (inboundLinks[link.href]) {
      inboundLinks[link.href].push({
        sourceFile: link.sourceFile,
        lineNumber: link.lineNumber
      });
    }
  }
  
  const orphanPages = validRoutes.filter(route => 
    route.url !== '/' && inboundLinks[route.url].length === 0
  );
  
  // STEP 5: Find weakly linked pages
  log(`${colors.blue}STEP 5: Finding weakly linked pages...${colors.reset}`);
  const weaklyLinkedPages = validRoutes.filter(route => 
    route.url !== '/' && inboundLinks[route.url].length === 1
  );
  
  // STEP 6: Check hub pages
  log(`${colors.blue}STEP 6: Checking hub page link health...${colors.reset}`);
  const hubPages = [
    '/all-services/',
    '/insights/',
    '/wholesale-clothing-manufacturer/',
    '/clothing-manufacturer-bangladesh/',
    '/how-to-start-a-clothing-brand/'
  ];
  
  const hubPageAnalysis = {};
  
  for (const hubUrl of hubPages) {
    // Find which file corresponds to this hub page
    const hubRoute = validRoutes.find(r => r.url === hubUrl);
    if (!hubRoute) {
      hubPageAnalysis[hubUrl] = { error: 'Page not found' };
      continue;
    }
    
    // Count inbound links
    const inboundCount = inboundLinks[hubUrl].length;
    
    // Count outbound links from this page
    const outboundLinks = [];
    const content = fs.readFileSync(hubRoute.filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const hrefRegex = /href=["']([^"']+)["']/g;
      let match;
      
      while ((match = hrefRegex.exec(line)) !== null) {
        const href = match[1];
        
        // Skip external links, anchors, etc.
        if (href.startsWith('http://') || 
            href.startsWith('https://') || 
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:')) {
          continue;
        }
        
        let normalizedHref = href.replace(/\\/g, '/');
        normalizedHref = normalizedHref.split('?')[0].split('#')[0];
        if (normalizedHref !== '/' && !normalizedHref.endsWith('/')) {
          normalizedHref = normalizedHref + '/';
        }
        
        if (validUrls.has(normalizedHref)) {
          outboundLinks.push(normalizedHref);
        }
      }
    });
    
    hubPageAnalysis[hubUrl] = {
      inboundLinks: inboundCount,
      outboundLinks: outboundLinks.length,
      inboundSources: inboundLinks[hubUrl],
      outboundTargets: [...new Set(outboundLinks)]
    };
  }
  
  // STEP 7: Generate report
  log(`${colors.blue}STEP 7: Generating final report...${colors.reset}\n`);
  
  log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  log(`${colors.cyan}                    SEO INTERNAL LINKING AUDIT REPORT${colors.reset}`);
  log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  log(`${colors.green}✅ TOTAL PAGES FOUND${colors.reset}`);
  log(`   ${validRoutes.length} total pages`);
  log(`   ${validRoutes.filter(r => r.isTools).length} tools pages\n`);
  
  log(`${colors.red}🔴 BROKEN INTERNAL LINKS (404s)${colors.reset}`);
  if (brokenLinks.length === 0) {
    log(`   None found! ${colors.green}✓${colors.reset}\n`);
  } else {
    log(`   ${brokenLinks.length} broken links:\n`);
    for (const link of brokenLinks) {
      log(`   • ${link.href}`);
      log(`     Found in: ${path.relative(projectRoot, link.sourceFile)}:${link.lineNumber}`);
      log(`     Original: ${link.originalHref}\n`);
    }
  }
  
  log(`${colors.yellow}🟠 ORPHAN PAGES (zero inbound links)${colors.reset}`);
  if (orphanPages.length === 0) {
    log(`   None found! ${colors.green}✓${colors.reset}\n`);
  } else {
    log(`   ${orphanPages.length} orphan pages:\n`);
    for (const page of orphanPages) {
      const toolsNote = page.isTools ? ` ${colors.cyan}[tools page]${colors.reset}` : '';
      log(`   • ${page.url}${toolsNote}`);
      log(`     File: ${path.relative(projectRoot, page.filePath)}\n`);
    }
  }
  
  log(`${colors.yellow}🟡 WEAKLY LINKED PAGES (only 1 inbound link)${colors.reset}`);
  if (weaklyLinkedPages.length === 0) {
    log(`   None found! ${colors.green}✓${colors.reset}\n`);
  } else {
    log(`   ${weaklyLinkedPages.length} weakly linked pages:\n`);
    for (const page of weaklyLinkedPages) {
      const sources = inboundLinks[page.url];
      const toolsNote = page.isTools ? ` ${colors.cyan}[tools page]${colors.reset}` : '';
      log(`   • ${page.url}${toolsNote}`);
      log(`     Inbound links: 1`);
      log(`     Linked from: ${path.relative(projectRoot, sources[0].sourceFile)}:${sources[0].lineNumber}\n`);
    }
  }
  
  log(`${colors.blue}🔵 HUB PAGE LINK HEALTH${colors.reset}\n`);
  for (const hubUrl of hubPages) {
    const analysis = hubPageAnalysis[hubUrl];
    if (analysis.error) {
      log(`   ${colors.red}• ${hubUrl}${colors.reset}`);
      log(`     ERROR: ${analysis.error}\n`);
      continue;
    }
    
    log(`   ${colors.blue}• ${hubUrl}${colors.reset}`);
    log(`     Inbound links: ${analysis.inboundLinks}`);
    log(`     Outbound links: ${analysis.outboundLinks}`);
    
    if (analysis.inboundLinks === 0) {
      log(`     ${colors.red}WARNING: No inbound links!${colors.reset}`);
    }
    if (analysis.outboundLinks === 0) {
      log(`     ${colors.red}WARNING: No outbound links!${colors.reset}`);
    }
    log('');
  }
  
  log(`${colors.green}🟢 SUMMARY${colors.reset}\n`);
  
  let issues = 0;
  if (brokenLinks.length > 0) issues += brokenLinks.length;
  if (orphanPages.length > 0) issues += orphanPages.length;
  if (weaklyLinkedPages.length > 0) issues += weaklyLinkedPages.length;
  
  if (issues === 0) {
    log(`   ${colors.green}Excellent! No SEO linking issues found.${colors.reset}`);
  } else {
    log(`   ${colors.yellow}Found ${issues} issues that need attention:${colors.reset}`);
    if (brokenLinks.length > 0) {
      log(`   - ${brokenLinks.length} broken internal links`);
    }
    if (orphanPages.length > 0) {
      log(`   - ${orphanPages.length} orphan pages`);
    }
    if (weaklyLinkedPages.length > 0) {
      log(`   - ${weaklyLinkedPages.length} weakly linked pages`);
    }
  }
  
  log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // Write report to file
  const reportPath = path.join(projectRoot, 'SEO-INTERNAL-LINK-AUDIT-REPORT.txt');
  fs.writeFileSync(reportPath, reportOutput.replace(/\x1b\[[0-9]+m/g, ''), 'utf8');
  console.log(`\n${colors.green}Full report saved to: SEO-INTERNAL-LINK-AUDIT-REPORT.txt${colors.reset}\n`);
}

// Run the audit
performAudit();
