import sharp from 'sharp';

const inputPath = './public/logo.webp';
const outputPath = './public';

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-touch-icon-57x57.png', size: 57 },
  { name: 'apple-touch-icon-60x60.png', size: 60 },
  { name: 'apple-touch-icon-72x72.png', size: 72 },
  { name: 'apple-touch-icon-76x76.png', size: 76 },
  { name: 'apple-touch-icon-114x114.png', size: 114 },
  { name: 'apple-touch-icon-120x120.png', size: 120 },
  { name: 'apple-touch-icon-144x144.png', size: 144 },
  { name: 'apple-touch-icon-152x152.png', size: 152 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'mstile-144x144.png', size: 144 }
];

async function generateFavicons() {
  try {
    console.log('Reading logo.webp...');
    const image = sharp(inputPath);
    
    for (const { name, size } of sizes) {
      await image
        .clone()
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(`${outputPath}/${name}`);
      console.log(`✓ Generated ${name} (${size}×${size})`);
    }
    
    // Generate favicon.ico (32×32)
    await image
      .clone()
      .resize(32, 32, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(`${outputPath}/favicon.ico`);
    console.log('✓ Generated favicon.ico (32×32)');
    
    console.log('\nFavicon generation complete! All 16 files saved to /public/');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
