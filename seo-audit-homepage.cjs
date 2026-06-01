const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/pages/index.astro', 'utf-8');
const lines = content.split('\n');

const keyword = "Clothing Manufacturers";
const keywordLower = keyword.toLowerCase();
const keywordSingular = "Clothing Manufacturer";
const keywordSingularLower = keywordSingular.toLowerCase();

const results = {
  pageTitle: null,
  pageDescription: null,
  h1: [],
  h2: [],
  h3: [],
  first100Words: [],
  imageAltTexts: [],
  internalLinksToHome: [],
  allHeadings: [],
  keywordCount: 0,
  keywordSingularCount: 0,
  canonicalUrl: null,
  schemaTypes: [],
  ogTags: [],
  noindexTags: []
};

// Extract pageTitle
const pageTitleMatch = content.match(/const pageTitle = "([^"]+)"/);
if (pageTitleMatch) {
  results.pageTitle = {
    line: lines.findIndex(l => l.includes('const pageTitle')) + 1,
    text: pageTitleMatch[1],
    containsKeyword: pageTitleMatch[1].includes(keyword) || pageTitleMatch[1].includes(keywordSingular)
  };
}

// Extract pageDescription
const pageDescMatch = content.match(/const pageDescription = "([^"]+)"/);
if (pageDescMatch) {
  results.pageDescription = {
    line: lines.findIndex(l => l.includes('const pageDescription')) + 1,
    text: pageDescMatch[1],
    containsKeyword: pageDescMatch[1].toLowerCase().includes(keywordLower) || pageDescMatch[1].toLowerCase().includes(keywordSingularLower)
  };
}

// Extract H1, H2, H3 tags
const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gis;
let match;
while ((match = headingRegex.exec(content)) !== null) {
  const level = parseInt(match[1]);
  const text = match[2].replace(/<[^>]*>/g, '').trim();
  const lineNum = content.substring(0, match.index).split('\n').length;
  
  const heading = { level, text, line: lineNum, containsKeyword: text.toLowerCase().includes(keywordLower) || text.toLowerCase().includes(keywordSingularLower) };
  results.allHeadings.push(heading);
  
  if (level === 1) results.h1.push(heading);
  else if (level === 2) results.h2.push(heading);
  else if (level === 3) results.h3.push(heading);
}

// Extract image alt texts
const imgRegex = /<img[^>]*alt="([^"]*)"[^>]*>/gi;
while ((match = imgRegex.exec(content)) !== null) {
  const lineNum = content.substring(0, match.index).split('\n').length;
  results.imageAltTexts.push({
    line: lineNum,
    text: match[1],
    containsKeyword: match[1].toLowerCase().includes(keywordLower) || match[1].toLowerCase().includes(keywordSingularLower)
  });
}

// Extract internal links to home
const homeLinkRegex = /<a\s+[^>]*href="\/"[^>]*>(.*?)<\/a>/gi;
while ((match = homeLinkRegex.exec(content)) !== null) {
  const lineNum = content.substring(0, match.index).split('\n').length;
  const anchorText = match[1].replace(/<[^>]*>/g, '').trim();
  results.internalLinksToHome.push({
    line: lineNum,
    anchorText: anchorText
  });
}

// Extract first 100 words of visible body content
const bodyContent = content.replace(/---[\s\S]*?---/g, '') // Remove frontmatter
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
  .replace(/<[^>]+>/g, ' ') // Remove HTML tags
  .replace(/\s+/g, ' ') // Normalize whitespace
  .trim();

const words = bodyContent.split(' ').filter(w => w.length > 0).slice(0, 100);
results.first100Words = words.join(' ');
results.containsKeywordInFirst100 = results.first100Words.toLowerCase().includes(keywordLower) || results.first100Words.toLowerCase().includes(keywordSingularLower);

// Count keyword occurrences
const keywordRegexPlural = new RegExp(keyword, 'gi');
const keywordRegexSingular = new RegExp(keywordSingular, 'gi');
results.keywordCount = (content.match(keywordRegexPlural) || []).length;
results.keywordSingularCount = (content.match(keywordRegexSingular) || []).length;

// Extract canonical URL
const canonicalMatch = content.match(/canonicalUrl={([^}]+)}/);
if (canonicalMatch) {
  results.canonicalUrl = {
    line: lines.findIndex(l => l.includes('canonicalUrl={')) + 1,
    value: canonicalMatch[1]
  };
}

// Extract schema types
const schemaRegex = /"@type":\s*"([^"]+)"/g;
while ((match = schemaRegex.exec(content)) !== null) {
  results.schemaTypes.push(match[1]);
}

// Check for OG tags
const ogRegex = /<meta[^>]*property="og:[^"]*"[^>]*>/gi;
while ((match = ogRegex.exec(content)) !== null) {
  const lineNum = content.substring(0, match.index).split('\n').length;
  results.ogTags.push({ line: lineNum, tag: match[0] });
}

// Check for noindex
if (content.toLowerCase().includes('noindex')) {
  const noindexLine = lines.findIndex(l => l.toLowerCase().includes('noindex'));
  if (noindexLine !== -1) {
    results.noindexTags.push({ line: noindexLine + 1, content: lines[noindexLine] });
  }
}

// Estimate word count
const totalWords = bodyContent.split(' ').filter(w => w.length > 0).length;
results.totalWordCount = totalWords;

// Generate report
console.log('\n=== COMPREHENSIVE ON-PAGE SEO AUDIT ===');
console.log('Target Keyword: "Clothing Manufacturers"\n');

console.log('1. KEYWORD USAGE\n================\n');

console.log('Page Title:');
if (results.pageTitle) {
  console.log(`  Line ${results.pageTitle.line}: "${results.pageTitle.text}"`);
  console.log(`  Contains "${keyword}" or "${keywordSingular}": ${results.pageTitle.containsKeyword ? 'YES ✓' : 'NO ✗'}`);
}

console.log('\nPage Description:');
if (results.pageDescription) {
  console.log(`  Line ${results.pageDescription.line}: "${results.pageDescription.text}"`);
  console.log(`  Contains "${keyword}" or "${keywordSingular}": ${results.pageDescription.containsKeyword ? 'YES ✓' : 'NO ✗'}`);
}

console.log('\nH1 Tag:');
results.h1.forEach(h => {
  console.log(`  Line ${h.line}: "${h.text}"`);
  console.log(`  Contains "${keyword}" or "${keywordSingular}": ${h.containsKeyword ? 'YES ✓' : 'NO ✗'}`);
});

console.log('\nH2 Tags (ALL):');
results.h2.forEach(h => {
  console.log(`  Line ${h.line}: "${h.text}" ${h.containsKeyword ? '✓' : '✗'}`);
});

console.log('\nH3 Tags (First 10):');
results.h3.slice(0, 10).forEach(h => {
  console.log(`  Line ${h.line}: "${h.text}" ${h.containsKeyword ? '✓' : '✗'}`);
});

console.log('\nFirst 100 Words of Visible Body Content:');
console.log(`  "${results.first100Words}"`);
console.log(`  Contains "${keyword}" or "${keywordSingular}": ${results.containsKeywordInFirst100 ? 'YES ✓' : 'NO ✗'}`);

console.log('\nImage Alt Texts:');
if (results.imageAltTexts.length === 0) {
  console.log('  No image alt texts found');
} else {
  results.imageAltTexts.forEach(img => {
    console.log(`  Line ${img.line}: "${img.text}" ${img.containsKeyword ? '✓' : '✗'}`);
  });
}

console.log('\nInternal Links Pointing to Home Page (href="/"):');
if (results.internalLinksToHome.length === 0) {
  console.log('  No internal links to home found');
} else {
  results.internalLinksToHome.forEach(link => {
    console.log(`  Line ${link.line}: "${link.anchorText}"`);
  });
}

console.log('\n\n2. CONTENT STRUCTURE\n=====================\n');

console.log('ALL Heading Tags in Order:');
results.allHeadings.forEach(h => {
  console.log(`  Line ${h.line}: <h${h.level}> "${h.text}"`);
});

console.log(`\nTotal Word Count Estimate: ${results.totalWordCount} words`);

console.log(`\nKeyword Frequency:`);
console.log(`  "${keyword}" (plural): appears ${results.keywordCount} times`);
console.log(`  "${keywordSingular}" (singular): appears ${results.keywordSingularCount} times`);
console.log(`  Total (both forms): ${results.keywordCount + results.keywordSingularCount} times`);

console.log('\n\n3. TECHNICAL SEO\n================\n');

console.log('Canonical URL:');
if (results.canonicalUrl) {
  console.log(`  Line ${results.canonicalUrl.line}: canonicalUrl={${results.canonicalUrl.value}}`);
} else {
  console.log('  Not found');
}

console.log('\nSchema Markup Types:');
const uniqueSchema = [...new Set(results.schemaTypes)];
uniqueSchema.forEach(type => console.log(`  - ${type}`));

console.log('\nOG Tags:');
if (results.ogTags.length === 0) {
  console.log('  No OG tags found in index.astro (likely in BaseHead component)');
} else {
  results.ogTags.forEach(og => {
    console.log(`  Line ${og.line}: ${og.tag.substring(0, 100)}...`);
  });
}

console.log('\nNoindex Tags:');
if (results.noindexTags.length === 0) {
  console.log('  ✓ No noindex tags found');
} else {
  results.noindexTags.forEach(tag => {
    console.log(`  ⚠️  Line ${tag.line}: ${tag.content}`);
  });
}

console.log('\n\n=== END OF AUDIT ===\n');
