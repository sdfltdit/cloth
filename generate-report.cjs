const fs = require('fs');
const path = require('path');

const results = JSON.parse(fs.readFileSync('audit-results-detailed.json', 'utf-8'));

console.log('\n=== COMPREHENSIVE SEO AUDIT REPORT ===\n');
console.log('Domain: https://sdfltd.com/\n');

// 1. HTTP REDIRECTS
console.log('1. HTTP REDIRECTS AUDIT');
console.log('=========================\n');
console.log(`Total redirect rules: ${results.redirects.rules.length}\n`);

console.log('All redirect rules:');
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

// 2. INTERNAL LINKS
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
  console.log(`\n⚠️  ANCHOR TEXTS LONGER THAN 60 CHARACTERS (${results.internalLinks.longAnchorTexts.length} found):`);
  results.internalLinks.longAnchorTexts.slice(0, 20).forEach(item => {
    console.log(`  - ${path.basename(item.file)}:${item.line}`);
    console.log(`    Text: "${item.text.substring(0, 80)}..." (${item.length} chars)`);
  });
  if (results.internalLinks.longAnchorTexts.length > 20) {
    console.log(`  ... and ${results.internalLinks.longAnchorTexts.length - 20} more`);
  }
} else {
  console.log('\n✓ No anchor texts longer than 60 characters');
}

if (results.internalLinks.genericAnchorTexts.length > 0) {
  console.log(`\n⚠️  GENERIC ANCHOR TEXTS FOUND (${results.internalLinks.genericAnchorTexts.length} found):`);
  const uniqueFiles = [...new Set(results.internalLinks.genericAnchorTexts.map(i => i.file))];
  console.log(`  Affected files: ${uniqueFiles.length}`);
  results.internalLinks.genericAnchorTexts.slice(0, 15).forEach(item => {
    console.log(`  - ${path.basename(item.file)}:${item.line}`);
    console.log(`    Text: "${item.text}" (matches: ${item.matchedGeneric})`);
  });
  if (results.internalLinks.genericAnchorTexts.length > 15) {
    console.log(`  ... and ${results.internalLinks.genericAnchorTexts.length - 15} more`);
  }
} else {
  console.log('\n✓ No generic anchor texts found');
}

if (results.internalLinks.brokenLinks.length > 0) {
  console.log(`\n⚠️  POTENTIAL BROKEN INTERNAL LINKS (${results.internalLinks.brokenLinks.length} found):`);
  const uniqueFiles = [...new Set(results.internalLinks.brokenLinks.map(i => i.file))];
  console.log(`  Affected files: ${uniqueFiles.length}`);
  results.internalLinks.brokenLinks.slice(0, 20).forEach(item => {
    console.log(`  - ${path.basename(item.file)}:${item.line}`);
    console.log(`    href="${item.href}" text="${item.anchorText}"`);
  });
  if (results.internalLinks.brokenLinks.length > 20) {
    console.log(`  ... and ${results.internalLinks.brokenLinks.length - 20} more`);
  }
} else {
  console.log('\n✓ No broken internal links found');
}

// 3. HEADINGS
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
  console.log(`EXISTING HREFLANG TAGS (${results.hreflang.existingHreflang.length} found):`);
  results.hreflang.existingHreflang.forEach(item => {
    console.log(`  - ${path.basename(item.file)}:${item.line}`);
    console.log(`    lang="${item.lang}" href="${item.href}"`);
  });
} else {
  console.log('✓ No hreflang tags found in the codebase');
}

if (results.hreflang.missingSelfReferential.length > 0) {
  console.log(`\n⚠️  PAGES MISSING SELF-REFERENTIAL HREFLANG (${results.hreflang.missingSelfReferential.length} pages):`);
  const pagesOnly = results.hreflang.missingSelfReferential.filter(i => i.file.includes('src/pages'));
  console.log(`  Pages affected: ${pagesOnly.length}`);
  pagesOnly.slice(0, 10).forEach(item => {
    console.log(`  - ${item.file}`);
    if (item.existingTags.length > 0) {
      console.log(`    Existing tags: ${item.existingTags.map(t => t.lang).join(', ')}`);
    } else {
      console.log('    No hreflang tags present');
    }
  });
  if (pagesOnly.length > 10) {
    console.log(`  ... and ${pagesOnly.length - 10} more pages`);
  }
} else {
  console.log('\n✓ All pages have self-referential hreflang');
}

console.log('\n\n=== END OF REPORT ===\n');
