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

// BATCH A replacements
const batchA = [
  { from: 'href="/price-calculator"', to: 'href="/tools/price-calculator"', count: 0 },
  { from: 'href="/sample-request/"', to: 'href="/tools/sample-request"', count: 0 },
  { from: 'href="/lead-time-calculator"', to: 'href="/tools/lead-time-calculator"', count: 0 },
  { from: 'href="/eu-readiness-checker"', to: 'href="/tools/eu-readiness-checker"', count: 0 },
  { from: 'href="/tools"', to: 'href="/all-services"', count: 0, skipInFiles: ['tools'] } // Skip in files that contain 'tools' in path
];

// BATCH B replacements (all-services.astro only)
const batchB = [
  { from: 'href="/insights/how-to-find-a-clothing-manufacturer"', to: 'href="/insights/how-to-find-clothing-manufacturer"', count: 0 },
  { from: 'href="/insights/private-label-clothing-guide"', to: 'href="/insights/private-label-clothing-manufacturer"', count: 0 },
  { from: 'href="/insights/eu-epr-2026-guide"', to: 'href="/insights/EU-EPR-2026-guide"', count: 0 },
  { from: 'href="/insights/cpsia-compliance-guide"', to: 'href="/insights/CPSIA-compliance-guide"', count: 0 },
  { from: 'href="/insights/low-moq-clothing-manufacturing"', to: 'href="/insights/low-moq-clothing-manufacturer"', count: 0 },
  { from: 'href="/insights/aql-2-5-inspection-explained"', to: 'href="/insights/AQL-inspection-explained"', count: 0 },
  { from: 'href="/insights/moq-meaning-clothing"', to: 'href="/insights/MOQ-meaning-clothing"', count: 0 },
  { from: 'href="/insights/lc-vs-tt-payment-terms"', to: 'href="/insights/payment-terms-LC-vs-TT"', count: 0 },
  { from: 'href="/insights/how-to-negotiate-with-manufacturers"', to: 'href="/insights/how-to-negotiate-with-clothing-manufacturers"', count: 0 },
  { from: 'href="/insights/avoiding-manufacturer-scams"', to: 'href="/insights/avoiding-clothing-manufacturer-scams"', count: 0 }
];

// BATCH C replacements
const batchC = [
  { from: 'href="/gots-certification-explained"', to: 'href="/insights/gots-certification-explained"', count: 0 },
  { from: 'href="/manufacturing-costs"', to: 'href="/insights/manufacturing-costs"', count: 0 },
  { from: 'href="/clothing-manufacturing-lead-time"', to: 'href="/guides/clothing-manufacturing-lead-time"', count: 0 },
  { from: 'href="/clothing-manufacturing-cost-bangladesh"', to: 'href="/guides/clothing-manufacturing-cost-bangladesh"', count: 0 },
  { from: 'href="/eu-clothing-regulations-2026"', to: 'href="/insights/eu-clothing-regulations-2026"', count: 0 },
  { from: 'href="/private-label-clothing-manufacturer"', to: 'href="/private-label-manufacturer"', count: 0 },
  { from: 'href="/wholesale-clothing-manufacturer"', to: 'href="/wholesale-clothing-supplier"', count: 0 },
  { from: 'href="/sock-manufacturer"', to: 'href="/socks-manufacturer"', count: 0 },
  { from: 'href="/tshirt-manufacturer"', to: 'href="/t-shirt-manufacturer"', count: 0 },
  { from: 'href="/quality-control-checklist"', to: 'href="/insights/quality-control-checklist"', count: 0 }
];

// BATCH D - Remove non-existent page links
const batchD = [
  { from: 'href="/school-uniform-manufacturer"', to: 'href="/kids-clothing-manufacturer"', count: 0 },
  { from: 'href="/start-up-clothing-manufacturer"', to: 'href="/clothing-manufacturers-for-startups"', count: 0 },
  { from: 'href="/eco-friendly-production"', to: 'href="/eco-friendly-clothing-manufacturer"', count: 0 },
  { from: 'href="/gots-cotton"', to: 'href="/organic-cotton-clothing-manufacturer"', count: 0 },
  { from: 'href="/brand-development-service"', to: 'href="/branding-launch"', count: 0 },
  { from: 'href="/apparel-finishing"', to: 'href="/finishing-service"', count: 0 },
  { from: 'href="/accessory-manufacturer"', to: '', count: 0 },
  { from: 'href="/insights/fob-vs-cif-vs-ddp-incoterms"', to: '', count: 0 },
  { from: 'href="/journal/how-to-choose-clothing-manufacturer"', to: '', count: 0 },
  { from: 'href="/hero.webp"', to: '', count: 0 }
];

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

// Process BATCH A
console.log('\n=== BATCH A ===');
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    batchA.forEach(replacement => {
      // Skip if file path contains the skip pattern
      if (replacement.skipInFiles && replacement.skipInFiles.some(skip => file.includes(skip))) {
        return;
      }
      
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

batchA.forEach(r => {
  console.log(`${r.from} → ${r.to}: ${r.count} replacements`);
});

// Process BATCH B (all-services.astro only)
console.log('\n=== BATCH B (all-services.astro only) ===');
const allServicesFile = 'src/pages/all-services.astro';
if (fs.existsSync(allServicesFile)) {
  let content = fs.readFileSync(allServicesFile, 'utf8');
  
  batchB.forEach(replacement => {
    const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      replacement.count += matches.length;
      content = content.replace(regex, replacement.to);
    }
  });
  
  fs.writeFileSync(allServicesFile, content, 'utf8');
  
  batchB.forEach(r => {
    console.log(`${r.from} → ${r.to}: ${r.count} replacements`);
  });
} else {
  console.log('all-services.astro not found');
}

// Process BATCH C
console.log('\n=== BATCH C ===');
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    batchC.forEach(replacement => {
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

batchC.forEach(r => {
  console.log(`${r.from} → ${r.to}: ${r.count} replacements`);
});

// Process BATCH D
console.log('\n=== BATCH D (Remove non-existent page links) ===');
files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');

    batchD.forEach(replacement => {
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

batchD.forEach(r => {
  console.log(`${r.from}: ${r.count} replacements`);
});

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

//    const matches = content.match(regex);
      if (matches) {
        replacement.count += matches.length;
        content = content.replace(regex, replacement.to);
      }
    });.reduce((sum, r) => sum + r.count, 0)} replacements`);
consolelog(`BATCH E total: ${batchE.
.reduce((sum, r) => sum + r.count, 0) + batchE
    fs.writeFileSync(file, content, 'utf8');
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

batchD.forEach(r => {
  console.log(`${r.from}: ${r.count} replacements`);
});

// Summary
console.log('\n=== SUMMARY ===');
console.log(`BATCH A total: ${batchA.reduce((sum, r) => sum + r.count, 0)} replacements`);
console.log(`BATCH B total: ${batchB.reduce((sum, r) => sum + r.count, 0)} replacements`);
console.log(`BATCH C total: ${batchC.reduce((sum, r) => sum + r.count, 0)} replacements`);
console.log(`BATCH D total: ${batchD.reduce((sum, r) => sum + r.count, 0)} replacements`);
console.log(`TOTAL: ${batchA.reduce((sum, r) => sum + r.count, 0) + batchB.reduce((sum, r) => sum + r.count, 0) + batchC.reduce((sum, r) => sum + r.count, 0) + batchD.reduce((sum, r) => sum + r.count, 0)} replacements`);
