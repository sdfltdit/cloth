const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/cargo-pants-manufacturer.astro',
  'src/pages/clothing-exporter.astro',
  'src/pages/knitwear-exporter.astro',
  'src/pages/knitwear-factory.astro',
  'src/pages/garment-exporter.astro',
  'src/pages/leggings-manufacturer.astro',
  'src/pages/denim-jacket-manufacturer.astro',
  'src/pages/bomber-jacket-manufacturer.astro',
  'src/pages/best-clothing-manufacturer-for-startups.astro',
  'src/pages/clothing-manufacturing-cost-guide.astro',
  'src/pages/clothing-factory.astro',
  'src/pages/wholesale-polo-shirt-supplier.astro',
  'src/pages/clothing-manufacturer-philippines.astro',
  'src/pages/t-shirt-manufacturer.astro'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Fix missing semicolon after color: var(--color-text-muted) followed by any whitespace
    const newContent = content.replace(/color: var\(--color-text-muted\)(\r?\n\s+)/g, 'color: var(--color-text-muted);\n$1');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed:', file);
    }
  }
});

console.log('All semicolon fixes complete');
