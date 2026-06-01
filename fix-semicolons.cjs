const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/denim-jacket-manufacturer.astro',
  'src/pages/knitwear-factory.astro',
  'src/pages/garment-exporter.astro',
  'src/pages/leggings-manufacturer.astro',
  'src/pages/sweatshirt-manufacturer.astro',
  'src/pages/bomber-jacket-manufacturer.astro',
  'src/pages/best-clothing-manufacturer-for-startups.astro',
  'src/pages/clothing-manufacturing-cost-guide.astro',
  'src/pages/clothing-factory.astro',
  'src/pages/wholesale-polo-shirt-supplier.astro',
  'src/pages/clothing-manufacturer-philippines.astro'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Fix missing semicolon after color: var(--color-text-muted)
    const newContent = content.replace(/color: var\(--color-text-muted\)\r?\n(\s+)/g, 'color: var(--color-text-muted);\r\n$1');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed:', file);
    }
  }
});

console.log('Semicolon fix complete');
