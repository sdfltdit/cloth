const fs = require('fs');
const path = require('path');

const pagesDir = 'c:\\Users\\Remon\\Desktop\\ossified-osiris\\src\\pages';

let totalFilesChanged = 0;
let totalReplacements = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // Skip tools directory
    if (stat.isDirectory() && file === 'tools') {
      console.log(`Skipping: ${fullPath}`);
      continue;
    }
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.astro')) {
      fixFile(fullPath);
    }
  }
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let replacementsInFile = 0;
  
  // Pattern A: href="WHATSAPP_URL?text=..."  ->  href={`${WHATSAPP_URL}?text=...`}
  // Pattern B: href="${WHATSAPP_URL}?text=..." ->  href={`${WHATSAPP_URL}?text=...`}
  
  // Regex to match both patterns and capture the entire href value
  const patternA = /href="WHATSAPP_URL\?text=([^"]*)"/g;
  const patternB = /href="\$\{WHATSAPP_URL\}\?text=([^"]*)"/g;
  
  // Fix Pattern A - replace literal WHATSAPP_URL with ${WHATSAPP_URL} inside template literal
  content = content.replace(patternA, (match, query) => {
    replacementsInFile++;
    return `href={\`\${WHATSAPP_URL}?text=${query}\`}`;
  });
  
  // Fix Pattern B - remove the $ since we're already in a template literal context
  content = content.replace(patternB, (match, query) => {
    replacementsInFile++;
    return `href={\`\${WHATSAPP_URL}?text=${query}\`}`;
  });
  
  if (replacementsInFile > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFilesChanged++;
    totalReplacements += replacementsInFile;
    console.log(`Fixed: ${path.relative(pagesDir, filePath)} (${replacementsInFile} replacement(s))`);
  }
}

console.log('Scanning for WHATSAPP_URL bugs in src/pages/...\n');
scanDirectory(pagesDir);

console.log(`\n=== SUMMARY ===`);
console.log(`Files changed: ${totalFilesChanged}`);
console.log(`Total replacements: ${totalReplacements}`);
