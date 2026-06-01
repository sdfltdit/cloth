const fs = require('fs');
const path = require('path');

const pagesDir = 'c:\\Users\\Remon\\Desktop\\ossified-osiris\\src\\pages';

let filesFixed = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // Skip tools directory
    if (stat.isDirectory() && file === 'tools') {
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
  
  // Check if file uses WHATSAPP_URL
  if (!content.includes('WHATSAPP_URL')) {
    return;
  }
  
  // Check if file already has the import (more flexible check)
  const hasImport = content.includes("WHATSAPP_URL") && content.includes("import") && content.includes("from '../data/schema'");
  
  if (hasImport) {
    return; // Already has import
  }
  
  // Add import inside frontmatter (before the closing ---)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatterStart = frontmatterMatch.index + 4; // After opening ---
    const importStatement = "import { PHONE, WHATSAPP_NUMBER, EMAIL, WHATSAPP_URL } from '../data/schema';\n";
    content = content.slice(0, frontmatterStart) + importStatement + content.slice(frontmatterStart);
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed++;
    console.log(`Added import: ${path.relative(pagesDir, filePath)}`);
  }
}

console.log('Adding WHATSAPP_URL import to files that use it...\n');
scanDirectory(pagesDir);

console.log(`\n=== SUMMARY ===`);
console.log(`Files fixed: ${filesFixed}`);
