const fs = require('fs');
const path = require('path');

const certificationsPath = path.join(__dirname, 'src', 'pages', 'certifications.astro');

let content = fs.readFileSync(certificationsPath, 'utf8');
const original = content;

// Simple pattern replacements - replacing ?? with emojis based on context
content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">GOTS - Global Organic Textile Standard<\/h3>/,
    '<div class="text-4xl mb-4">🌿</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">GOTS - Global Organic Textile Standard</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">OEKO-TEX Standard 100<\/h3>/,
    '<div class="text-4xl mb-4">🛡️</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">OEKO-TEX Standard 100</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">ISO 9001 Quality Management<\/h3>/,
    '<div class="text-4xl mb-4">⭐</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">ISO 9001 Quality Management</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">BSCI - Business Social Compliance Initiative<\/h3>/,
    '<div class="text-4xl mb-4">🤝</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">BSCI - Business Social Compliance Initiative</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">SEDEX - Supplier Ethical Data Exchange<\/h3>/,
    '<div class="text-4xl mb-4">📋</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">SEDEX - Supplier Ethical Data Exchange</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">LEED Green Building Certification<\/h3>/,
    '<div class="text-4xl mb-4">🏭</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">LEED Green Building Certification</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">WRAP - Worldwide Responsible Accredited Production<\/h3>/,
    '<div class="text-4xl mb-4">🏭</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">WRAP - Worldwide Responsible Accredited Production</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">ZDHC - Zero Discharge of Hazardous Chemicals<\/h3>/,
    '<div class="text-4xl mb-4">⚗️</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">ZDHC - Zero Discharge of Hazardous Chemicals</h3>'
);

content = content.replace(
    /<div class="text-4xl mb-4">\?\?<\/div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">SA8000 Social Accountability Standard<\/h3>/,
    '<div class="text-4xl mb-4">👷</div>\n\t\t\t\t\t<h3 class="text-xl font-bold text-white mb-3">SA8000 Social Accountability Standard</h3>'
);

if (content !== original) {
    fs.writeFileSync(certificationsPath, content, 'utf8');
    console.log('Fixed certifications.astro');
} else {
    console.log('No changes made to certifications.astro');
}
