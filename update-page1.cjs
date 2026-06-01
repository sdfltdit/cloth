const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\Remon\\Desktop\\ossified-osiris\\src\\pages\\fashion-manufacturers.astro', 'utf8');
const lines = content.split('\n');

const before = lines.slice(0, 68).join('\n');
const after = lines.slice(68).join('\n');

const newContent = `

<section style="padding:4rem 0;border-bottom:1px solid #e00;">
  <div class="container">
    <h2 style="font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;color:#fff;margin-bottom:1.5rem;">How Fashion Manufacturing Works at SDF</h2>
    <p style="color:#FFFFFF;line-height:1.9;font-size:0.9rem;max-width:760px;margin-bottom:1.5rem;">Fashion manufacturing at SDF follows a clear, structured process from your initial concept to final delivery. It starts with a brief discussion about your design vision and requirements. We then help develop or refine your tech pack, which serves as the blueprint for production. Our pattern makers create precise patterns followed by sampling, typically taking 2 to 3 weeks for you to review and approve. Once you sign off on the sample, we move to bulk production, which runs 45 to 60 days depending on order complexity and quantity. Throughout production, our quality control team conducts AQL inspections at multiple stages. Finally, we handle FOB shipping from Chittagong or Dhaka to your destination port. Whether you need CMT services or full package production including fabric sourcing, we adapt the fashion manufacturing process to your specific needs.</p>
  </div>
</section>

<section style="padding:4rem 0;border-bottom:1px solid #e00;">
  <div class="container">
    <h2 style="font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;color:#fff;margin-bottom:1.5rem;">What Fashion Manufacturers Should Actually Offer</h2>
    <p style="color:#FFFFFF;line-height:1.9;font-size:0.9rem;max-width:760px;margin-bottom:1.5rem;">A full-service fashion manufacturer provides far more than basic assembly. At SDF, we handle pattern making and sizing grading to ensure consistency across your size range. We source fabrics from certified suppliers and manage all trims and accessories. You can choose between CMT (cut, make, trim) where you provide materials, or full package production where we handle everything from fabric to finished garment. Our in-house decoration capabilities include embroidery up to 15 colors, DTF printing, screen printing, heat transfer, and sublimation. We conduct thorough quality inspections using AQL standards before any shipment leaves our facility. Unlike many competitors who only offer CMT services, SDF operates as a complete OEM and ODM partner supporting private label clothing manufacturers and brands needing end-to-end production support.</p>
  </div>
</section>

<section style="padding:4rem 0;border-bottom:1px solid #e00;">
  <div class="container">
    <h2 style="font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;color:#fff;margin-bottom:1.5rem;">Fashion Manufacturing for Startups and Growing Brands</h2>
    <p style="color:#FFFFFF;line-height:1.9;font-size:0.9rem;max-width:760px;margin-bottom:1.5rem;">Startup fashion brands in the USA, UK, Australia, and EU often face significant barriers when seeking manufacturing partners. Many factories demand minimum orders of 1000 pieces or more, which simply doesn't work for new labels testing the market. Lead times can stretch to 4 months or longer, and most manufacturers offer little help with tech pack development if you lack technical design experience. SDF breaks down these barriers. We accept orders from 300 pieces per style, making us one of the most accessible low MOQ fashion manufacturers for small brands. Our team provides free tech pack assistance to help you translate your ideas into production-ready specifications. You'll work with a dedicated account manager who understands the challenges startup brands face. Whether you're launching your first collection or scaling an existing line, we offer the flexibility and support growing fashion brands need.</p>
  </div>
</section>

<section style="padding:4rem 0;border-bottom:1px solid #e00;">
  <div class="container">
    <h2 style="font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;color:#fff;margin-bottom:1.5rem;">Sustainability in Fashion Manufacturing</h2>
    <p style="color:#FFFFFF;line-height:1.9;font-size:0.9rem;max-width:760px;margin-bottom:1.5rem;">Sustainable fashion production has moved from optional to essential, especially as EU regulations tighten in 2026. SDF is certified under GOTS for organic cotton and OEKO-TEX for chemical safety, ensuring your garments meet the highest environmental standards. Our facility maintains ethical labor certifications including SA8000 and WRAP, guaranteeing fair working conditions throughout our supply chain. We offer recycled material options for brands focused on circular fashion, and our carbon-conscious FOB shipping practices help reduce the environmental impact of transport. For brands selling into European markets, we already track the data required for upcoming sustainability regulations, including material sourcing and production methods. Partnering with an ethical fashion manufacturer like SDF positions your brand for compliance while meeting growing consumer demand for responsible production.</p>
  </div>
</section>

<section style="padding:4rem 0;border-bottom:1px solid #e00;">
  <div class="container">
    <h2 style="font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;color:#fff;margin-bottom:1.5rem;">Frequently Asked Questions</h2>
    <div style="max-width:760px;">
      <div style="margin-bottom:2rem;">
        <h3 style="font-size:1rem;font-weight:500;color:#fff;margin-bottom:0.75rem;">What is the minimum order for fashion manufacturing?</h3>
        <p style="color:#FFFFFF;line-height:1.9;font-size:0.88rem;">SDF accepts orders from 300 pieces per style for fashion manufacturing, making us accessible to startups and small brands. This minimum applies across most garment types including t-shirts, hoodies, and woven shirts. Some heavily customized pieces may require higher minimums due to setup costs.</p>
      </div>
      <div style="margin-bottom:2rem;">
        <h3 style="font-size:1rem;font-weight:500;color:#fff;margin-bottom:0.75rem;">How long does fashion manufacturing take from start to finish?</h3>
        <p style="color:#FFFFFF;line-height:1.9;font-size:0.88rem;">The complete fashion manufacturing process typically takes 60 to 90 days. Sampling requires 2 to 3 weeks, followed by your review and approval time. Bulk production runs 45 to 60 days, and FOB shipping adds 20 to 35 days depending on your destination port.</p>
      </div>
      <div style="margin-bottom:2rem;">
        <h3 style="font-size:1rem;font-weight:500;color:#fff;margin-bottom:0.75rem;">Do fashion manufacturers help with design and tech packs?</h3>
        <p style="color:#FFFFFF;line-height:1.9;font-size:0.88rem;">Yes, SDF provides free tech pack assistance for clients who need help developing production-ready specifications. Our design team can refine your concepts, create detailed measurements, and specify construction methods. This service is particularly valuable for startup brands without in-house technical design expertise.</p>
      </div>
      <div style="margin-bottom:2rem;">
        <h3 style="font-size:1rem;font-weight:500;color:#fff;margin-bottom:0.75rem;">Can fashion manufacturers handle embroidery and custom printing?</h3>
        <p style="color:#FFFFFF;line-height:1.9;font-size:0.88rem;">SDF handles all decoration processes in-house, including embroidery up to 15 colors, DTF printing, screen printing, heat transfer, and sublimation. Having these capabilities under one roof ensures quality control and faster turnaround times compared to outsourcing decoration to third-party vendors.</p>
      </div>
      <div style="margin-bottom:0;">
        <h3 style="font-size:1rem;font-weight:500;color:#fff;margin-bottom:0.75rem;">How do I find a reliable fashion manufacturer for my brand?</h3>
        <p style="color:#FFFFFF;line-height:1.9;font-size:0.88rem;">Look for certified manufacturers with verified quality standards and social compliance. Check their certifications such as OEKO-TEX, GOTS, and WRAP. Request samples to assess construction quality. Verify their experience with your target market and garment type. Reliable manufacturers like SDF offer transparent communication, clear pricing, and dedicated account management.</p>
      </div>
    </div>
  </div>
</section>

`;

const finalContent = before + newContent + after;
fs.writeFileSync('c:\\Users\\Remon\\Desktop\\ossified-osiris\\src\\pages\\fashion-manufacturers.astro', finalContent, 'utf8');
console.log('File updated successfully');
