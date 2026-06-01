const fs = require('fs');
const path = require('path');

// Recursively find all .astro files
function findAstroFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.')) {
      findAstroFiles(filePath, fileList);
    } else if (file.endsWith('.astro')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = findAstroFiles(path.join(__dirname, 'src/pages'));

console.log('=== Command 1: Hardcoded Phone Numbers ===');
let phoneFound = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (/\+8801911733226|8801911733226/.test(line) && !/PHONE|WHATSAPP|placeholder/i.test(line)) {
      console.log(`${file}: Line ${index + 1}: ${line.trim()}`);
      phoneFound = true;
    }
  });
}
if (!phoneFound) console.log('No hardcoded phone numbers found');

console.log('\n=== Command 2: Hardcoded Emails ===');
let emailFound = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (/contact@sdfltd\.com/.test(line) && !/EMAIL/i.test(line)) {
      console.log(`${file}: Line ${index + 1}: ${line.trim()}`);
      emailFound = true;
    }
  });
}
if (!emailFound) console.log('No hardcoded emails found');

console.log('\n=== Command 3: Truncated or Too Long Page Descriptions ===');
let descFound = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line) => {
    const match = line.match(/const pageDescription\s*=\s*"(.+)"/);
    if (match) {
      const desc = match[1];
      const len = desc.length;
      const isTruncated = desc.endsWith('...');
      const isTooLong = len > 165;
      const noPeriodAndLong = !desc.endsWith('.') && !desc.endsWith('. "') && len > 150;
      
      if (isTruncated || isTooLong || noPeriodAndLong) {
        console.log(`${file}: (${len} chars) - ${desc.substring(0, 80)}...`);
        descFound = true;
      }
    }
  });
}
if (!descFound) console.log('No truncated or too long page descriptions found');
