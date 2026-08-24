import sharp from 'sharp';
import { readFileSync, statSync, renameSync } from 'fs';

const inputPath = 'public/logo-small.webp';
const tmpPath = 'public/logo-small.webp.tmp';

const originalSize = statSync(inputPath).size;
console.log(`Original size: ${(originalSize / 1024).toFixed(2)} KiB`);

const buffer = readFileSync(inputPath);

let quality = 80;
let finalSize = 0;

while (quality >= 60) {
  await sharp(buffer)
    .resize(72, 72, { 
      fit: 'contain', 
      background: { r: 0, g: 0, b: 0, alpha: 0 } 
    })
    .webp({ quality: quality, effort: 6 })
    .toFile(tmpPath);
  
  finalSize = statSync(tmpPath).size;
  
  if (finalSize <= 2048) {
    console.log(`Quality ${quality}: ${(finalSize / 1024).toFixed(2)} KiB ✓`);
    break;
  }
  
  console.log(`Quality ${quality}: ${(finalSize / 1024).toFixed(2)} KiB (over 2 KiB, reducing quality)`);
  quality -= 5;
}

renameSync(tmpPath, inputPath);

const newSize = statSync(inputPath).size;
const savings = originalSize - newSize;

console.log('---');
console.log(`Final size: ${(newSize / 1024).toFixed(2)} KiB`);
console.log(`Savings: ${(savings / 1024).toFixed(2)} KiB (${((savings / originalSize) * 100).toFixed(1)}%)`);
console.log(`Quality used: ${quality}`);
