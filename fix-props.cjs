const fs = require('fs');
const path = require('path');

const { execSync } = require('child_process');

// Get all .astro files
const files = execSync('dir /s /b src\\pages\\*.astro', { encoding: 'utf8' }).trim().split('\n');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Fix canonical= to canonicalUrl= in BaseLayout
  const newContent = content.replace(
    /<BaseLayout([^>]*?)canonical=([^>]*?)>/g,
    (match, before, after) => {
      if (match.includes('canonicalUrl=')) return match;
      return match.replace('canonical=', 'canonicalUrl=');
    }
  );
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed:', file);
  }
});

console.log('Prop fixes complete');
