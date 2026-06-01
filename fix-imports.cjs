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
  
  // Find frontmatter boundaries
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return;
  
  const frontmatterEnd = frontmatterMatch.index + frontmatterMatch[0].length;
  const frontmatterContent = content.slice(0, frontmatterEnd);
  const bodyContent = content.slice(frontmatterEnd);
  
  // Remove import statements from body (outside frontmatter)
  const bodyWithoutImports = bodyContent.replace(/^import\s+.*?from\s+['"][^'"]+['"];\n?/gm, '');
  
  // Check if file uses schema variables
  const usesPhone = bodyWithoutImports.includes('PHONE');
  const usesWhatsappNumber = bodyWithoutImports.includes('WHATSAPP_NUMBER');
  const usesEmail = bodyWithoutImports.includes('EMAIL');
  const usesWhatsappUrl = bodyWithoutImports.includes('WHATSAPP_URL');
  
  if (!usesPhone && !usesWhatsappNumber && !usesEmail && !usesWhatsappUrl) {
    return; // No schema variables used
  }
  
  // Check if frontmatter already has schema import
  const hasSchemaImport = frontmatterContent.includes("from '../data/schema'");
  
  let newFrontmatter = frontmatterContent;
  
  if (hasSchemaImport) {
    // Update existing import to include all needed variables
    const importMatch = newFrontmatter.match(/import\s*\{([^}]+)\}\s*from\s*['"]..\/data\/schema['"]/);
    if (importMatch) {
      const existingVars = importMatch[1].split(',').map(v => v.trim());
      const neededVars = [];
      if (usesPhone && !existingVars.includes('PHONE')) neededVars.push('PHONE');
      if (usesWhatsappNumber && !existingVars.includes('WHATSAPP_NUMBER')) neededVars.push('WHATSAPP_NUMBER');
      if (usesEmail && !existingVars.includes('EMAIL')) neededVars.push('EMAIL');
      if (usesWhatsappUrl && !existingVars.includes('WHATSAPP_URL')) neededVars.push('WHATSAPP_URL');
      
      if (neededVars.length > 0) {
        const allVars = [...existingVars, ...neededVars].join(', ');
        newFrontmatter = newFrontmatter.replace(
          /import\s*\{[^}]+\}\s*from\s*['"]..\/data\/schema['"]/,
          `import { ${allVars} } from '../data/schema'`
        );
      }
    }
  } else {
    // Add new import to frontmatter
    const vars = [];
    if (usesPhone) vars.push('PHONE');
    if (usesWhatsappNumber) vars.push('WHATSAPP_NUMBER');
    if (usesEmail) vars.push('EMAIL');
    if (usesWhatsappUrl) vars.push('WHATSAPP_URL');
    
    if (vars.length > 0) {
      const importStatement = `import { ${vars.join(', ')} } from '../data/schema';\n`;
      const insertPos = frontmatterMatch.index + 4; // After opening ---
      newFrontmatter = content.slice(0, insertPos) + importStatement + content.slice(insertPos, frontmatterEnd);
    }
  }
  
  // Only write if something changed
  if (newFrontmatter !== frontmatterContent || bodyWithoutImports !== bodyContent) {
    const newContent = newFrontmatter + bodyWithoutImports;
    fs.writeFileSync(filePath, newContent, 'utf8');
    filesFixed++;
    console.log(`Fixed: ${path.relative(pagesDir, filePath)}`);
  }
}

console.log('Fixing import statements in src/pages/...\n');
scanDirectory(pagesDir);

console.log(`\n=== SUMMARY ===`);
console.log(`Files fixed: ${filesFixed}`);
