const fs = require('fs');
const path = require('path');

const pagesDir = 'c:\\Users\\Remon\\Desktop\\ossified-osiris\\src\\pages';

let totalFilesChanged = 0;
let totalReplacements = 0;
let importsAdded = 0;

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
  let replacementsInFile = 0;
  let importAdded = false;
  
  // Check if file has the import
  const hasImport = content.includes("import { PHONE, WHATSAPP_NUMBER, EMAIL, WHATSAPP_URL }") ||
                    content.includes("import { WHATSAPP_URL }") ||
                    content.includes("WHATSAPP_URL from");
  
  // Check if file has Pattern A or Pattern B
  const hasPatternA = /href="WHATSAPP_URL/.test(content);
  const hasPatternB = /href="\$\{WHATSAPP_URL\}/.test(content);
  
  if (!hasPatternA && !hasPatternB) {
    return; // No fixes needed
  }
  
  // Add import if missing
  if (!hasImport) {
    // Find the frontmatter section (between --- and ---)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatterEnd = frontmatterMatch.index + frontmatterMatch[0].length;
      const importStatement = "import { PHONE, WHATSAPP_NUMBER, EMAIL, WHATSAPP_URL } from '../data/schema';\n";
      
      // Insert import after frontmatter
      content = content.slice(0, frontmatterEnd) + '\n' + importStatement + content.slice(frontmatterEnd);
      importAdded = true;
      importsAdded++;
    }
  }
  
  // Fix Pattern A: href="WHATSAPP_URL..." -> href={`${WHATSAPP_URL}...`}
  const patternA = /href="WHATSAPP_URL([^"]*)"/g;
  content = content.replace(patternA, (match, suffix) => {
    replacementsInFile++;
    return `href={\`\${WHATSAPP_URL}${suffix}\`}`;
  });
  
  // Fix Pattern B: href="${WHATSAPP_URL}..." -> href={`${WHATSAPP_URL}...`}
  const patternB = /href="\$\{WHATSAPP_URL\}([^"]*)"/g;
  content = content.replace(patternB, (match, suffix) => {
    replacementsInFile++;
    return `href={\`\${WHATSAPP_URL}${suffix}\`}`;
  });
  
  if (replacementsInFile > 0 || importAdded) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFilesChanged++;
    totalReplacements += replacementsInFile;
    const importNote = importAdded ? ' [import added]' : '';
    console.log(`Fixed: ${path.relative(pagesDir, filePath)} (${replacementsInFile} replacement(s)${importNote})`);
  }
}

console.log('Scanning for WHATSAPP_URL bugs in src/pages/...\n');
scanDirectory(pagesDir);

console.log(`\n=== SUMMARY ===`);
console.log(`Files changed: ${totalFilesChanged}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log(`Imports added: ${importsAdded}`);
