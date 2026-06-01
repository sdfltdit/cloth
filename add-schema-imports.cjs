const fs = require('fs');
const path = require('path');

const pagesDir = 'c:\\Users\\Remon\\Desktop\\ossified-osiris\\src\\pages';

let filesFixed = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
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
  
  // Check if file uses any schema variables
  const usesSchemaVars = content.includes('PHONE') || 
                         content.includes('WHATSAPP_NUMBER') || 
                         content.includes('EMAIL') || 
                         content.includes('WHATSAPP_URL');
  
  if (!usesSchemaVars) {
    return;
  }
  
  // Check if file already has schema import
  const hasSchemaImport = /import\s*\{[^}]*WHATSAPP_URL[^}]*\}\s*from\s*['"][^'"]*schema[^'"]*['"]/.test(content);
  
  if (hasSchemaImport) {
    return; // Already has import
  }
  
  // Find frontmatter and add import
  const frontmatterMatch = content.match(/^---\r?\n/);
  if (frontmatterMatch) {
    const insertPos = frontmatterMatch.index + 4;
    const importStatement = "import { PHONE, WHATSAPP_NUMBER, EMAIL, WHATSAPP_URL } from '../data/schema';\n";
    content = content.slice(0, insertPos) + importStatement + content.slice(insertPos);
    fs.writeFileSync(filePath, content, 'utf8');
    filesFixed++;
    console.log(`Added import: ${path.relative(pagesDir, filePath)}`);
  }
}

console.log('Adding schema imports to files that use them...\n');
scanDirectory(pagesDir);

console.log(`\n=== SUMMARY ===`);
console.log(`Files fixed: ${filesFixed}`);
