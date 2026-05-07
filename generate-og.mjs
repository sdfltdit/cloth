import sharp from 'sharp';
import fs from 'fs';

// Read factory.webp from public folder
const inputPath = './public/factory.webp';
const ogOutputPath = './public/og-image.jpg';
const sdfOutputPath = './public/sdf.jpg';

async function generateOG() {
  try {
    console.log('Reading factory.webp...');
    
    // Resize and crop to exactly 1200×630 pixels (cover fit, center crop)
    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 90,
        progressive: true
      })
      .toFile(ogOutputPath);
    
    console.log('✓ Generated og-image.jpg (1200×630, quality 90, progressive)');
    
    // Copy sdf.jpg from root to public
    if (fs.existsSync('./sdf.jpg')) {
      fs.copyFileSync('./sdf.jpg', sdfOutputPath);
      console.log('✓ Copied sdf.jpg to /public/');
    } else {
      console.error('✗ sdf.jpg not found in project root');
    }
    
    console.log('\nOG image generation complete!');
  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  }
}

generateOG();
