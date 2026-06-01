const fs = require('fs');

// Fix the last broken link
let content = fs.readFileSync('src/pages/insights/AQL-inspection-explained.astro', 'utf8');
content = content.replace('href="/insights/quality-control-checklist/index"', 'href="/insights/quality-control-checklist"');
fs.writeFileSync('src/pages/insights/AQL-inspection-explained.astro', content);

console.log('Fixed the last broken link');
