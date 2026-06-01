const fs = require('fs');
const path = require('path');

const files = [
    "src/pages/apparel-manufacturers.astro",
    "src/pages/bamboo-clothing-manufacturer.astro",
    "src/pages/cargo-pants-manufacturer.astro",
    "src/pages/cashmere-clothing-manufacturer.astro",
    "src/pages/clothing-manufacturer-argentina.astro",
    "src/pages/clothing-manufacturer-australia.astro",
    "src/pages/clothing-manufacturer-brazil.astro",
    "src/pages/clothing-manufacturer-denmark.astro",
    "src/pages/clothing-manufacturer-greece.astro",
    "src/pages/clothing-manufacturer-norway.astro",
    "src/pages/clothing-manufacturer-poland.astro",
    "src/pages/clothing-manufacturer-portugal.astro",
    "src/pages/clothing-manufacturer-russia.astro",
    "src/pages/clothing-manufacturer-saudi-arabia.astro",
    "src/pages/clothing-manufacturer-singapore.astro",
    "src/pages/clothing-manufacturer-south-africa.astro",
    "src/pages/clothing-manufacturer-south-korea.astro",
    "src/pages/clothing-manufacturer-spain.astro",
    "src/pages/clothing-manufacturer-sweden.astro",
    "src/pages/clothing-manufacturer-switzerland.astro",
    "src/pages/clothing-manufacturer-thailand.astro",
    "src/pages/clothing-manufacturer-uae.astro",
    "src/pages/clothing-manufacturer-uk.astro",
    "src/pages/clothing-manufacturer-usa.astro",
    "src/pages/clothing-manufacturer-vietnam.astro",
    "src/pages/clothing-manufacturers.astro",
    "src/pages/cut-and-sew-service.astro",
    "src/pages/cycling-apparel-manufacturer.astro",
    "src/pages/dance-wear-manufacturer.astro",
    "src/pages/denim-jacket-manufacturer.astro",
    "src/pages/denim-manufacturer.astro",
    "src/pages/dress-manufacturer.astro",
    "src/pages/dye-house-service.astro",
    "src/pages/dyeing-service.astro",
    "src/pages/eco-friendly-clothing-manufacturer.astro",
    "src/pages/embroidery-service.astro",
    "src/pages/fabric-sourcing.astro",
    "src/pages/fashion-consulting-service.astro",
    "src/pages/fashion-manufacturers.astro",
    "src/pages/faq.astro",
    "src/pages/fit-engineering-service.astro",
    "src/pages/garment-development-service.astro",
    "src/pages/garments-factory.astro",
    "src/pages/hemp-clothing-manufacturer.astro",
    "src/pages/jacket-manufacturer.astro",
    "src/pages/knitwear-factory.astro",
    "src/pages/knitting-service.astro",
    "src/pages/lab-dip-service.astro",
    "src/pages/leggings-manufacturer.astro",
    "src/pages/linen-clothing-manufacturer.astro",
    "src/pages/maternity-clothing-manufacturer.astro",
    "src/pages/medical-uniform-manufacturer.astro",
    "src/pages/modal-clothing-manufacturer.astro",
    "src/pages/organic-cotton-clothing-manufacturer.astro",
    "src/pages/petite-clothing-manufacturer.astro",
    "src/pages/print-on-demand-manufacturer.astro",
    "src/pages/printing-service.astro",
    "src/pages/private-label-manufacturer.astro",
    "src/pages/recycled-clothing-manufacturer.astro",
    "src/pages/sampling-service.astro",
    "src/pages/shirt-manufacturer.astro",
    "src/pages/silk-clothing-manufacturer.astro",
    "src/pages/small-batch-clothing-manufacturer.astro",
    "src/pages/sweater-manufacturer.astro",
    "src/pages/sustainable-clothing-manufacturer.astro",
    "src/pages/sustainability.astro",
    "src/pages/tencel-clothing-manufacturer.astro",
    "src/pages/tech-pack-service.astro",
    "src/pages/textile-manufacturers.astro",
    "src/pages/trims-sourcing.astro",
    "src/pages/uniform-manufacturer.astro",
    "src/pages/wedding-dress-manufacturer.astro",
    "src/pages/wholesale-activewear-supplier.astro",
    "src/pages/wholesale-hoodie-supplier.astro",
    "src/pages/wholesale-polo-shirt-supplier.astro",
    "src/pages/wholesale-t-shirt-supplier.astro",
    "src/pages/wool-clothing-manufacturer.astro",
    "src/pages/yarn-sourcing.astro",
    "src/pages/yoga-wear-manufacturer.astro",
    "src/pages/insights/bangladesh-vs-china-manufacturing.astro",
    "src/pages/insights/clothing-manufacturing-lead-time.astro",
    "src/pages/insights/avoiding-clothing-manufacturer-scams.astro",
    "src/pages/insights/eu-clothing-regulations-2026.astro",
    "src/pages/insights/tech-pack-template-guide.astro",
    "src/pages/insights/wholesale-clothing-manufacturer.astro",
    "src/pages/insights/sustainable-clothing-manufacturing.astro",
    "src/pages/insights/sample-cost-explained.astro",
    "src/pages/insights/quality-control-checklist.astro",
    "src/pages/insights/private-label-clothing-manufacturer.astro",
    "src/pages/insights/oem-vs-odm-vs-cmt.astro",
    "src/pages/insights/MOQ-meaning-clothing.astro",
    "src/pages/insights/manufacturing-costs.astro",
    "src/pages/insights/low-moq-clothing-manufacturer.astro",
    "src/pages/insights/how-to-negotiate-with-clothing-manufacturers.astro",
    "src/pages/insights/how-to-find-clothing-manufacturer.astro",
    "src/pages/insights/how-to-calculate-landed-cost.astro",
    "src/pages/insights/gots-certification-explained.astro",
    "src/pages/insights/garment-grading-explained.astro",
    "src/pages/insights/fabric-gsm-explained.astro",
    "src/pages/insights/EU-EPR-2026-guide.astro",
    "src/pages/insights/digital-product-passport-textile.astro",
    "src/pages/insights/customs-clearance-guide.astro",
    "src/pages/insights/CPSIA-compliance-guide.astro",
    "src/pages/bulk-clothing-manufacturer.astro",
    "src/pages/clothing-manufacturer-austria.astro",
    "src/pages/clothing-manufacturer-belgium.astro",
    "src/pages/clothing-manufacturer-czech-republic.astro",
    "src/pages/clothing-manufacturer-canada.astro",
    "src/pages/clothing-manufacturer-new-zealand.astro",
    "src/pages/clothing-manufacturer-netherlands.astro",
    "src/pages/clothing-manufacturer-malaysia.astro",
    "src/pages/clothing-manufacturer-mexico.astro",
    "src/pages/clothing-manufacturer-italy.astro",
    "src/pages/clothing-manufacturer-japan.astro",
    "src/pages/clothing-manufacturer-israel.astro",
    "src/pages/clothing-manufacturer-indonesia.astro",
    "src/pages/clothing-manufacturer-india.astro",
    "src/pages/clothing-manufacturer-ireland.astro",
    "src/pages/clothing-manufacturer-hong-kong.astro",
    "src/pages/clothing-manufacturer-germany.astro",
    "src/pages/clothing-manufacturer-france.astro",
    "src/pages/clothing-manufacturer-finland.astro",
    "src/pages/clothing-manufacturer-europe.astro",
    "src/pages/garments-manufacturers.astro",
    "src/pages/guides/clothing-manufacturing-cost-bangladesh.astro",
    "src/pages/guides/clothing-manufacturing-lead-time.astro",
    "src/pages/full-package-production.astro",
    "src/pages/insights/AQL-inspection-explained.astro",
    "src/pages/hi-vis-workwear-manufacturer.astro",
    "src/pages/modest-fashion-manufacturer.astro"
];

const baseDir = "c:\\Users\\Remon\\Desktop\\ossified-osiris\\";
let changedCount = 0;

files.forEach(file => {
    const filePath = path.join(baseDir, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Pattern to match the entire section
        const pattern = /<section style="padding:3rem 0;border-top:1px solid var\(--color-border\)">\s*<div style="max-width:900px;margin:0 auto;padding:0 1\.5rem">\s*<h2[^>]*>\s*Getting Started with SDF Clothing[\s\S]*?manufacturing process from there\.\s*<\/p>\s*<\/div>\s*<\/section>\s*/g;
        
        if (pattern.test(content)) {
            const newContent = content.replace(pattern, '');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Removed section from: ${file}`);
            changedCount++;
        } else {
            console.log(`Pattern not found in: ${file}`);
        }
    } else {
        console.log(`File not found: ${filePath}`);
    }
});

console.log(`\nTotal files changed: ${changedCount}`);
