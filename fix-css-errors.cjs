const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/sweatshirt-manufacturer.astro',
  'src/pages/leggings-manufacturer.astro',
  'src/pages/knitwear-factory.astro',
  'src/pages/knitwear-exporter.astro',
  'src/pages/garment-exporter.astro',
  'src/pages/faux-leather-clothing-manufacturer.astro',
  'src/pages/denim-jacket-manufacturer.astro',
  'src/pages/clothing-manufacturing-cost-guide.astro',
  'src/pages/clothing-factory.astro',
  'src/pages/clothing-exporter.astro',
  'src/pages/cargo-pants-manufacturer.astro',
  'src/pages/bomber-jacket-manufacturer.astro',
  'src/pages/best-clothing-manufacturer-for-startups.astro',
  'src/pages/wholesale-polo-shirt-supplier.astro',
  'src/pages/clothing-manufacturer-philippines.astro'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/`r`n/g, '\r\n');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed:', file);
    }
  } else {
    console.log('Not found:', file);
  }
});

console.log('CSS fix complete');
