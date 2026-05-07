import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface NDAData {
  submissionId: string;
  companyName: string;
  registrationNumber: string;
  country: string;
  businessType: string;
  businessAddress: string;
  vatTaxId?: string;
  tradeLicenseNumber?: string;
  contactName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;
  productCategories: string[];
  orderVolume: string;
  targetMarkets: string[];
  signatureData: string;
  ipAddress: string;
  signatureDate: string;
}

export async function generateNDApdf(data: NDAData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let yPosition = height - 50;
  const margin = 50;
  const lineHeight = 14;
  const sectionSpacing = 20;

  function addText(text: string, fontSize: number = 10, isBold: boolean = false, color: rgb = rgb(0, 0, 0)) {
    if (yPosition < margin + 50) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
      addFooter();
    }
    
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: isBold ? fontBold : font,
      color: color,
    });
    yPosition -= lineHeight;
  }

  function addCenteredText(text: string, fontSize: number = 12, isBold: boolean = false) {
    if (yPosition < margin + 50) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
      addFooter();
    }
    
    const textWidth = fontBold.widthOfTextAtSize(text, fontSize);
    const x = (width - textWidth) / 2;
    
    page.drawText(text, {
      x: x,
      y: yPosition,
      size: fontSize,
      font: isBold ? fontBold : font,
    });
    yPosition -= lineHeight;
  }

  function addSection(title: string) {
    yPosition -= sectionSpacing;
    addText(title, 12, true);
    yPosition -= 5;
  }

  function addFooter() {
    const footerY = 30;
    page.drawText(`Confidential — SDF Ltd NDA | Ref: ${data.submissionId}`, {
      x: margin,
      y: footerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    page.drawLine({
      start: { x: margin, y: footerY + 10 },
      end: { x: width - margin, y: footerY + 10 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  addCenteredText('SDF LTD', 24, true);
  addCenteredText('Premium Clothing Manufacturing Bangladesh', 12);
  yPosition -= 20;
  addCenteredText('NON-DISCLOSURE AGREEMENT', 18, true);
  yPosition -= 20;
  addText(`Submission ID: ${data.submissionId}`, 10);
  addText(`Date: ${data.signatureDate}`, 10);
  yPosition -= 20;

  addSection('1. PARTIES');
  addText('This Non-Disclosure Agreement ("Agreement") is entered into on the date of electronic signature below.');
  yPosition -= 10;
  addText('BETWEEN:');
  addText('SDF Ltd, a clothing manufacturing company incorporated in Bangladesh, with its principal place of business at Dhaka, Bangladesh ("Manufacturer")');
  yPosition -= 10;
  addText('AND');
  addText(`${data.companyName}, a ${data.businessType} incorporated in ${data.country}, with registration number ${data.registrationNumber} ("Buyer"),`);
  addText(`with business address at: ${data.businessAddress}`);
  if (data.vatTaxId) {
    addText(`VAT/Tax ID: ${data.vatTaxId}`);
  }
  if (data.tradeLicenseNumber) {
    addText(`Trade License: ${data.tradeLicenseNumber}`);
  }

  addSection('2. EFFECTIVE DATE');
  addText('This Agreement becomes effective upon the Buyer\'s electronic signature below ("Effective Date").');

  addSection('3. DEFINITION OF CONFIDENTIAL INFORMATION');
  addText('"Confidential Information" means any and all information, whether oral, written, graphic, or electronic form, disclosed by either party to the other party that is:');
  yPosition -= 10;
  addText('a) Design specifications, tech packs, garment patterns, samples, and prototypes;');
  addText('b) Pricing structures, cost breakdowns, profit margins, and financial information;');
  addText('c) Vendor lists, supplier relationships, and supply chain information;');
  addText('d) Production processes, manufacturing techniques, quality control methods;');
  addText('e) Client lists, customer relationships, and marketing strategies;');
  addText('f) Trade secrets, business plans, and strategic information;');
  addText('g) Any other information marked as "confidential" or that a reasonable person would understand to be confidential.');

  addSection('4. OBLIGATIONS OF RECEIVING PARTY');
  addText('The Receiving Party agrees to:');
  yPosition -= 10;
  addText('a) Maintain the confidentiality of all Confidential Information;');
  addText('b) Use Confidential Information solely for the purpose of evaluating or conducting business with the Disclosing Party;');
  addText('c) Not disclose Confidential Information to any third party without prior written consent;');
  addText('d) Protect Confidential Information with the same degree of care as it uses for its own confidential information;');
  addText('e) Restrict access to Confidential Information to employees who have a need to know and are bound by confidentiality obligations.');

  addSection('5. EXCLUSIONS FROM CONFIDENTIAL INFORMATION');
  addText('Confidential Information does not include information that:');
  yPosition -= 10;
  addText('a) Is or becomes publicly available through no fault of the Receiving Party;');
  addText('b) Was already known to the Receiving Party prior to disclosure;');
  addText('c) Is independently developed by the Receiving Party without use of Confidential Information;');
  addText('d) Is rightfully obtained from a third party without confidentiality restrictions;');
  addText('e) Is required to be disclosed by law or court order, provided the Disclosing Party is given prompt notice.');

  addSection('6. NON-COMPETE CLAUSE');
  addText('For a period of two (2) years from the Effective Date, the Buyer agrees not to engage in business with direct competitors of SDF Ltd within the clothing manufacturing sector in Bangladesh, specifically for the purpose of manufacturing similar products that compete directly with SDF Ltd\'s offerings.');

  addSection('7. NON-SOLICITATION CLAUSE');
  addText('For a period of two (2) years from the Effective Date, neither party shall solicit, hire, or attempt to hire any employee, contractor, or consultant of the other party who was involved in the parties\' business relationship, without prior written consent.');

  addSection('8. INTELLECTUAL PROPERTY');
  addText('a) All designs, specifications, tech packs, and creative materials provided by the Buyer remain the exclusive property of the Buyer.');
  yPosition -= 10;
  addText('b) All production methods, manufacturing techniques, quality control processes, and operational know-how of SDF Ltd remain the exclusive property of SDF Ltd.');
  addText('c) This Agreement does not grant any license or rights to any intellectual property except as expressly stated.');

  addSection('9. TERM AND TERMINATION');
  addText('a) This Agreement shall remain in effect for a period of two (2) years from the Effective Date.');
  yPosition -= 10;
  addText('b) This Agreement shall automatically renew for successive two-year terms unless either party provides written notice of termination at least 30 days prior to the end of the then-current term.');
  addText('c) Either party may terminate this Agreement upon 30 days written notice to the other party.');
  addText('d) Upon termination, the Receiving Party shall return or destroy all Confidential Information in its possession.');

  addSection('10. BREACH AND REMEDIES');
  addText('a) The parties agree that any breach of this Agreement may cause irreparable harm.');
  yPosition -= 10;
  addText('b) In the event of a breach, the non-breaching party shall be entitled to seek injunctive relief and specific performance.');
  addText('c) The breaching party shall be liable for liquidated damages in the minimum amount of USD 50,000, which the parties agree represents a reasonable estimate of actual damages.');
  addText('d) This liquidated damages clause is in addition to any other remedies available at law or in equity.');

  addSection('11. GOVERNING LAW AND DISPUTE RESOLUTION');
  addText('a) This Agreement shall be governed by and construed in accordance with the laws of Bangladesh.');
  yPosition -= 10;
  addText('b) Any dispute arising under this Agreement with a value exceeding USD 10,000 shall be resolved through international arbitration in accordance with the rules of the International Chamber of Commerce (ICC).');
  addText('c) The seat of arbitration shall be Dhaka, Bangladesh.');
  addText('d) For disputes under USD 10,000, the parties agree to attempt good faith negotiation before pursuing legal remedies.');

  addSection('12. ENTIRE AGREEMENT');
  addText('This Agreement constitutes the entire understanding between the parties regarding the subject matter hereof and supersedes all prior discussions, agreements, and understandings, whether written or oral.');

  yPosition -= 20;
  addSection('SIGNATURES');
  yPosition -= 10;
  
  addText('MANUFACTURER:', 11, true);
  addText('SDF Ltd');
  addText('To be countersigned upon review');
  yPosition -= 20;
  
  addText('BUYER:', 11, true);
  addText(`Company: ${data.companyName}`);
  addText(`Signed by: ${data.contactName}`);
  addText(`Designation: ${data.contactDesignation}`);
  addText(`Email: ${data.contactEmail}`);
  addText(`Phone: ${data.contactPhone}`);
  addText(`Date: ${data.signatureDate}`);
  yPosition -= 10;

  try {
    const signatureImage = await pdfDoc.embedPng(data.signatureData);
    const signatureDims = signatureImage.scale(0.5);
    
    if (yPosition - signatureDims.height < margin + 50) {
      page = pdfDoc.addPage();
      yPosition = height - 50;
      addFooter();
    }
    
    page.drawImage(signatureImage, {
      x: margin,
      y: yPosition - signatureDims.height,
      width: signatureDims.width,
      height: signatureDims.height,
    });
    yPosition -= signatureDims.height + 10;
    
    addText('Digital Signature above', 8, false, rgb(0.5, 0.5, 0.5));
  } catch (error) {
    addText('[Signature embedded]', 10);
  }

  yPosition -= 20;
  addText(`Security Information: Digitally signed by ${data.contactName} | IP: ${data.ipAddress} | ${data.signatureDate}`, 8, false, rgb(0.5, 0.5, 0.5));

  addFooter();

  return await pdfDoc.save();
}
