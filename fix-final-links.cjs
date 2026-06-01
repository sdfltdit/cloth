const fs = require('fs');
const path = require('path');

// Recursively get all files
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.match(/\.(astro|js|ts|tsx|jsx)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const files = getAllFiles('src');

console.log(`Found ${files.length} files to process`);

// BATCH F - Fix remaining broken links
const batchF = [
  { from: 'href="/quality-control-checklist/"', to: 'href="/insights/quality-control-checklist/index"', count: 0 },
  { from: 'href="/gots-certification-guide"', to: 'href="/insights/gots-label-guide"', count: 0 },
  { from: 'href="/clothing-manufacturing-cost"', to: 'href="/guides/clothing-manufacturing-cost-bangladesh"', count: 0 },
  { from: 'href="/tools"', to: 'href="/all-services"', count: 0 }
];

// Process BATCH F
console.log('\n=== BATCH F (Fix remaining broken links) ===');
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    batchF.forEach(replacement => {
      const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        replacement.count += matches.length;
        content = content.replace(regex, replacement.to);
      }
    });

    fs.writeFileSync(file, content, 'utf8');
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

batchF.forEach(r => {
  console.log(`${r.from} → ${r.to}: ${r.count} replacements`);
});

console.log(`\n=== SUMMARY ===`);
console.log(`BATCH F total: ${batchF.reduce((sum, r) => sum + r.count, 0)} replacements`);
