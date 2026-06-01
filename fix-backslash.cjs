const fs = require('fs');

// Fix backslash issues by removing the broken links
const fixes = [
  {
    file: 'src/pages/skirts-manufacturer.astro',
    replacements: [
      { from: 'href="/sampling-service\\"', to: '' },
      { from: 'href="/fit-engineering-service\\"', to: '' },
      { from: 'href="/dress-manufacturer\\"', to: '' }
    ]
  },
  {
    file: 'src/pages/socks-manufacturer.astro',
    replacements: [
      { from: 'href="/pattern-making-service\\"', to: '' }
    ]
  }
];

console.log('Fixing backslash issues...\n');

fixes.forEach(fix => {
  try {
    let content = fs.readFileSync(fix.file, 'utf8');
    let count = 0;
    
    fix.replacements.forEach(replacement => {
      const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        count += matches.length;
        content = content.replace(regex, replacement.to);
      }
    });
    
    fs.writeFileSync(fix.file, content, 'utf8');
    console.log(`Fixed ${fix.file}: ${count} replacements`);
  } catch (err) {
    console.error(`Error processing ${fix.file}:`, err.message);
  }
});

console.log('\nDone!');
