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

// BATCH E - Fix index page orphan issue
const batchE = [
  { from: 'href="/journal/"', to: 'href="/journal/index"', count: 0 },
  { from: 'href="/insights/"', to: 'href="/insights/index"', count: 0 },
  { from: 'href="/case-studies/"', to: 'href="/case-studies/index"', count: 0 },
  { from: 'href="/nda/"', to: 'href="/nda/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/"', to: 'href="/pet-clothing-manufacturer/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/dog-coat-manufacturer/"', to: 'href="/pet-clothing-manufacturer/dog-coat-manufacturer/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/dog-hoodie-manufacturer/"', to: 'href="/pet-clothing-manufacturer/dog-hoodie-manufacturer/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/organic-pet-clothing-manufacturer/"', to: 'href="/pet-clothing-manufacturer/organic-pet-clothing-manufacturer/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/equestrian-clothing-manufacturer/"', to: 'href="/pet-clothing-manufacturer/equestrian-clothing-manufacturer/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/private-label-pet-clothing/"', to: 'href="/pet-clothing-manufacturer/private-label-pet-clothing/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/pet-clothing-manufacturing-cost/"', to: 'href="/pet-clothing-manufacturer/pet-clothing-manufacturing-cost/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/how-to-start-pet-clothing-brand/"', to: 'href="/pet-clothing-manufacturer/how-to-start-pet-clothing-brand/index"', count: 0 },
  { from: 'href="/pet-clothing-manufacturer/dog-clothing-manufacturer-usa/"', to: 'href="/pet-clothing-manufacturer/dog-clothing-manufacturer-usa/index"', count: 0 }
];

// Process BATCH E
console.log('\n=== BATCH E (Fix index page orphan issue) ===');
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    batchE.forEach(replacement => {
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

batchE.forEach(r => {
  console.log(`${r.from} → ${r.to}: ${r.count} replacements`);
});

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
console.log(`BATCH E total: ${batchE.reduce((sum, r) => sum + r.count, 0)} replacements`);
console.log(`BATCH F total: ${batchF.reduce((sum, r) => sum + r.count, 0)} replacements`);
});

batchE.forEach(r => {
  console.log(`${r.from} → ${r.to}: ${r.count} replacements`);
});

console.log(`\n=== SUMMARY ===`);
console.log(`BATCH E total: ${batchE.reduce((sum, r) => sum + r.count, 0)} replacements`);
