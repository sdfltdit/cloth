const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');

// Get all .astro files recursively
function getAstroFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAstroFiles(filePath, fileList);
    } else if (file.endsWith('.astro')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract primary keyword from page title/filename
function extractKeyword(filename, content) {
  // Remove .astro extension
  const name = filename.replace('.astro', '');
  
  // Convert hyphens to spaces and capitalize
  const keyword = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return keyword;
}

// Analyze a single page
function analyzePage(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(__dirname, filePath);
  const pageName = relativePath.replace('src/pages/', '').replace('.astro', '');
  const filename = path.basename(filePath, '.astro');
  
  const issues = [];
  const warnings = [];
  
  // Extract title (check for both pageTitle and title patterns)
  const titleMatch = content.match(/const (?:pageTitle|title) = ["']([^"']+)["']/);
  const title = titleMatch ? titleMatch[1] : null;
  
  // Extract meta description (check for both pageDescription and description patterns)
  const descMatch = content.match(/const (?:pageDescription|description) = ["']([^"']+)["']/);
  const description = descMatch ? descMatch[1] : null;
  
  // Extract primary keyword from filename
  const primaryKeyword = extractKeyword(filename, content).toLowerCase();
  
  // 1. TITLE TAG CHECKS
  if (!title) {
    issues.push('Title: MISSING');
  } else {
    const titleLength = title.length;
    if (titleLength < 50 || titleLength > 60) {
      issues.push(`Title: WRONG LENGTH (${titleLength} chars, should be 50-60)`);
    } else if (!title.toLowerCase().includes(primaryKeyword.split(' ')[0])) {
      warnings.push(`Title: May not contain primary keyword`);
    } else if (!title.endsWith('| SDF Clothing')) {
      issues.push(`Title: Does not end with "| SDF Clothing"`);
    } else {
      issues.push(`Title: OK (${titleLength} chars)`);
    }
  }
  
  // 2. META DESCRIPTION CHECKS
  if (!description) {
    issues.push('Meta: MISSING');
  } else {
    const descLength = description.length;
    if (descLength < 150 || descLength > 160) {
      issues.push(`Meta: WRONG LENGTH (${descLength} chars, should be 150-160)`);
    } else if (!description.toLowerCase().includes(primaryKeyword.split(' ')[0])) {
      warnings.push(`Meta: May not contain primary keyword`);
    } else {
      issues.push(`Meta: OK (${descLength} chars)`);
    }
  }
  
  // 3. H1 TAG CHECKS
  const h1Matches = content.match(/<h1[^>]*>(.*?)<\/h1>/gis);
  const h1Count = h1Matches ? h1Matches.length : 0;
  
  if (h1Count === 0) {
    issues.push('H1: MISSING');
  } else if (h1Count > 1) {
    issues.push(`H1: TOO MANY (${h1Count} found, should be exactly 1)`);
  } else {
    const h1Text = h1Matches[0].replace(/<[^>]+>/g, '').trim();
    if (!h1Text.toLowerCase().includes(primaryKeyword.split(' ')[0])) {
      warnings.push(`H1: May not contain primary keyword`);
    } else if (title && h1Text === title) {
      warnings.push(`H1: Same as title tag`);
    } else {
      issues.push('H1: OK');
    }
  }
  
  // 4. H2 TAG CHECKS
  const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gis);
  const h2Count = h2Matches ? h2Matches.length : 0;
  
  if (h2Count < 3) {
    issues.push(`H2: TOO FEW (only ${h2Count} found, need at least 3)`);
  } else {
    issues.push(`H2: OK (${h2Count} found)`);
  }
  
  // 5. CONTENT CHECKS
  // Extract text content (remove HTML tags and frontmatter)
  const textContent = content
    .replace(/---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/<[^>]+>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const wordCount = textContent.split(/\s+/).length;
  
  if (wordCount < 1000) {
    issues.push(`Word count: TOO LOW (${wordCount} words, need 1000+)`);
  } else {
    issues.push(`Word count: OK (${wordCount} words)`);
  }
  
  // Check keyword in first 100 words
  const first100Words = textContent.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
  if (!first100Words.includes(primaryKeyword.split(' ')[0])) {
    warnings.push('Keyword in first 100 words: NOT FOUND');
  }
  
  // Calculate keyword density
  const keywordOccurrences = (textContent.toLowerCase().match(new RegExp(primaryKeyword.split(' ')[0], 'g')) || []).length;
  const keywordDensity = (keywordOccurrences / wordCount) * 100;
  if (keywordDensity < 1 || keywordDensity > 2) {
    warnings.push(`Keyword density: ${keywordDensity.toFixed(2)}% (should be 1-2%)`);
  }
  
  // 6. IMAGES CHECKS
  const imgMatches = content.match(/<img[^>]*>/gi);
  const imgCount = imgMatches ? imgMatches.length : 0;
  const imagesWithoutAlt = imgMatches ? imgMatches.filter(img => !img.includes('alt=') || img.includes('alt=""')).length : 0;
  
  if (imgCount > 0 && imagesWithoutAlt > 0) {
    issues.push(`Images: ${imagesWithoutAlt} images missing alt text`);
  } else if (imgCount > 0) {
    issues.push('Images: OK (all have alt text)');
  } else {
    issues.push('Images: No images found');
  }
  
  // 7. INTERNAL LINKS CHECKS
  const linkMatches = content.match(/<a[^>]*href=["']\/[^"']*["'][^>]*>/gi);
  const internalLinkCount = linkMatches ? linkMatches.length : 0;
  
  if (internalLinkCount < 3) {
    issues.push(`Internal links: TOO FEW (only ${internalLinkCount} found, need at least 3)`);
  } else {
    issues.push(`Internal links: OK (${internalLinkCount} links)`);
  }
  
  // 8. SCHEMA MARKUP CHECKS
  const schemaMatch = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!schemaMatch) {
    issues.push('Schema: MISSING');
  } else {
    try {
      const schema = JSON.parse(schemaMatch[1]);
      const schemaTypes = Array.isArray(schema) ? schema.map(s => s['@type']) : [schema['@type']];
      issues.push(`Schema: OK (${schemaTypes.join(', ')})`);
    } catch (e) {
      issues.push('Schema: INVALID JSON');
    }
  }
  
  // 9. CANONICAL TAG CHECKS
  const canonicalMatch = content.match(/canonicalUrl/i);
  if (!canonicalMatch) {
    issues.push('Canonical: MISSING');
  } else {
    issues.push('Canonical: OK');
  }
  
  // 10. PAGE SPEED SIGNALS
  const hasRenderBlockingScripts = content.includes('<script') && !content.includes('defer') && !content.includes('async');
  const hasLazyLoading = content.includes('loading="lazy"');
  
  if (hasRenderBlockingScripts) {
    warnings.push('Page speed: Potential render-blocking scripts');
  }
  if (!hasLazyLoading && imgCount > 0) {
    warnings.push('Page speed: Images not using lazy loading');
  }
  
  return {
    pageName,
    issues,
    warnings
  };
}

// Main audit function
function runAudit() {
  const files = getAstroFiles(pagesDir);
  const results = [];
  const allTitles = [];
  
  files.forEach(file => {
    const result = analyzePage(file);
    results.push(result);
    
    // Collect titles for uniqueness check
    const content = fs.readFileSync(file, 'utf-8');
    const titleMatch = content.match(/const pageTitle = ["']([^"']+)["']/);
    if (titleMatch) {
      allTitles.push({ page: result.pageName, title: titleMatch[1] });
    }
  });
  
  // Check for duplicate titles
  const duplicateTitles = allTitles.filter((item, index, self) =>
    index !== self.findIndex(t => t.title === item.title)
  );
  
  // Generate report
  let report = '# SEO AUDIT REPORT\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Total pages audited: ${results.length}\n\n`;
  report += '---\n\n';
  
  results.forEach(result => {
    report += `PAGE: /${result.pageName}\n`;
    
    result.issues.forEach(issue => {
      if (issue.startsWith('Title:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('Meta:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('H1:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('H2:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('Word count:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('Images:') && (issue.includes('OK') || issue.includes('No images'))) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('Internal links:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('Schema:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else if (issue.startsWith('Canonical:') && issue.includes('OK')) {
        report += `✅ ${issue}\n`;
      } else {
        report += `❌ ${issue}\n`;
      }
    });
    
    result.warnings.forEach(warning => {
      report += `⚠️ ${warning}\n`;
    });
    
    report += '\n';
  });
  
  // Summary
  report += '---\n\n';
  report += '# SUMMARY\n\n';
  
  const pagesWithAllChecksPassing = results.filter(r => 
    r.issues.every(i => i.includes('OK') || i.includes('No images')) && r.warnings.length === 0
  ).length;
  
  report += `Total pages audited: ${results.length}\n`;
  report += `Total pages with ALL checks passing: ${pagesWithAllChecksPassing}\n\n`;
  
  // Count issues
  const issueCounts = {};
  results.forEach(r => {
    r.issues.forEach(i => {
      const issueType = i.split(':')[0];
      issueCounts[issueType] = (issueCounts[issueType] || 0) + 1;
    });
    r.warnings.forEach(w => {
      const warningType = w.split(':')[0];
      issueCounts[warningType] = (issueCounts[warningType] || 0) + 1;
    });
  });
  
  report += '## Top 5 Most Common Issues\n\n';
  const sortedIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  sortedIssues.forEach(([issue, count], index) => {
    report += `${index + 1}. ${issue}: ${count} pages\n`;
  });
  
  report += '\n## Priority Fix List\n\n';
  report += '1. **Fix all MISSING elements** (titles, meta descriptions, H1s, schema, canonical tags)\n';
  report += '2. **Adjust title and meta description lengths** to 50-60 and 150-160 characters respectively\n';
  report += '3. **Ensure all titles end with "| SDF Clothing"**\n';
  report += '4. **Add more H2 tags** to pages with fewer than 3\n';
  report += '5. **Increase word count** on pages with less than 1000 words\n';
  report += '6. **Add alt text to all images**\n';
  report += '7. **Add internal links** to pages with fewer than 3\n';
  report += '8. **Add schema markup** to pages missing it\n';
  report += '9. **Ensure primary keyword appears in first 100 words**\n';
  report += '10. **Optimize keyword density** to 1-2%\n';
  
  if (duplicateTitles.length > 0) {
    report += '\n## Duplicate Titles Found\n\n';
    duplicateTitles.forEach(dup => {
      report += `- "${dup.title}" on /${dup.page}\n`;
    });
  }
  
  // Save report
  fs.writeFileSync(path.join(__dirname, 'seo-audit-report-5.txt'), report);
  console.log('SEO audit complete. Report saved to seo-audit-report-5.txt');
}

runAudit();
