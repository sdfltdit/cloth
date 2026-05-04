// Index page interactive features - Capabilities, FAQ, Calculators, Exit Banner, Sticky Bar

// Capabilities Tabs
document.querySelectorAll('.capabilities-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabId = tab.dataset.tab;
    document.querySelectorAll('.capabilities-tab').forEach(t => t.classList.remove('capabilities-tab--active'));
    tab.classList.add('capabilities-tab--active');
    document.querySelectorAll('.capabilities-pane').forEach(pane => pane.classList.remove('capabilities-pane--active'));
    const selectedPane = document.getElementById(tabId);
    if (selectedPane) selectedPane.classList.add('capabilities-pane--active');
  });
});

// FAQ Accordion
document.querySelectorAll('.index__faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqIndex = button.dataset.faq;
    const answer = document.querySelector(`.index__faq-answer[data-answer="${faqIndex}"]`);
    const icon = button.querySelector('.index__faq-icon');
    answer.classList.toggle('index__faq-answer--visible');
    icon.classList.toggle('index__faq-icon--open');
  });
});

// Exit Intent Banner
let exitShown = false;
document.addEventListener('mouseout', (e) => {
  if (e.clientY < 10 && !exitShown) {
    document.getElementById('exit-banner').classList.add('index__exit-banner--visible');
    exitShown = true;
  }
});
document.getElementById('exit-banner').querySelector('.index__btn').addEventListener('click', () => {
  document.getElementById('exit-banner').classList.remove('index__exit-banner--visible');
});

// Sticky Bottom Bar (Mobile)
const stickyBar = document.getElementById('sticky-bar');
let scrollShown = false;
window.addEventListener('scroll', () => {
  if (window.scrollY > 500 && !scrollShown && window.innerWidth <= 768) {
    stickyBar.classList.add('index__sticky-bar--visible');
    scrollShown = true;
  }
});

// Cost Savings Calculator
const calculateCostBtn = document.getElementById('calculate-cost');
if (calculateCostBtn) {
  calculateCostBtn.addEventListener('click', () => {
    const costCountry = document.getElementById('cost-country');
    const costValue = document.getElementById('cost-value');
    if (!costCountry.value || !costValue.value) { alert('Please fill in all fields'); return; }
    const value = parseFloat(costValue.value);
    const savingsPercent = { china: { min: 35, max: 45 }, vietnam: { min: 28, max: 38 }, india: { min: 15, max: 25 }, turkey: { min: 25, max: 35 }, portugal: { min: 40, max: 50 } }[costCountry.value] || { min: 20, max: 30 };
    const minSavings = value * (savingsPercent.min / 100);
    const maxSavings = value * (savingsPercent.max / 100);
    document.getElementById('cost-savings').textContent = `You could save $${minSavings.toLocaleString()} - $${maxSavings.toLocaleString()} per month`;
    document.getElementById('cost-result').style.display = 'block';
  });
}

// Duty Savings Calculator
const calculateDutyBtn = document.getElementById('calculate-duty');
const dutyRates = { eu: 12, uk: 9.6, usa: 0, australia: 7.5, canada: 8, other: 0 };
const portData = {
  eu: { name: 'EU', seaPorts: [{ name: 'Port of Rotterdam', code: 'NLRTM', email: 'customs@portofrotterdam.com', phone: '+31 10 252 1010', website: 'https://www.portofrotterdam.com' }], airPorts: [{ name: 'Amsterdam Schiphol', code: 'AMS', email: 'cargo@schiphol.nl', phone: '+31 20 794 0800', website: 'https://www.schiphol.nl' }], customs: [{ name: 'EU Customs Union', website: 'https://taxation-customs.ec.europa.eu' }] },
  uk: { name: 'UK', seaPorts: [{ name: 'Port of Felixstowe', code: 'GBFXT', email: 'info@portoffelixstowe.co.uk', phone: '+44 1394 604500', website: 'https://www.portoffelixstowe.co.uk' }], airPorts: [{ name: 'London Heathrow', code: 'LHR', email: 'cargo@heathrow.com', phone: '+44 20 8745 7224', website: 'https://www.heathrow.com' }], customs: [{ name: 'HMRC imports', website: 'https://www.gov.uk/topic/business-tax/import-export' }] },
  usa: { name: 'USA', seaPorts: [{ name: 'Port of Los Angeles', code: 'USLAX', email: 'info@portla.org', phone: '+1 310 732 3508', website: 'https://www.portoflosangeles.org' }], airPorts: [{ name: 'LAX', code: 'LAX', email: 'cargo@lawa.org', phone: '+1 310 646 5252', website: 'https://www.flylax.com' }], customs: [{ name: 'US Customs', website: 'https://www.cbp.gov' }] },
  australia: { name: 'Australia', seaPorts: [{ name: 'Port of Sydney', code: 'AUSYD', email: 'info@portauthoritynsw.com.au', phone: '+61 2 9296 4999', website: 'https://www.portauthoritynsw.com.au' }], airPorts: [{ name: 'Sydney Airport', code: 'SYD', email: 'cargo@sydneyairport.com.au', phone: '+61 2 9667 9111', website: 'https://www.sydneyairport.com.au' }], customs: [{ name: 'Australian Border Force', website: 'https://www.abf.gov.au' }] },
  canada: { name: 'Canada', seaPorts: [{ name: 'Port of Vancouver', code: 'CAVAN', email: 'info@portvancouver.com', phone: '+1 604 665 9000', website: 'https://www.portvancouver.com' }], airPorts: [{ name: 'Toronto Pearson', code: 'YYZ', email: 'cargo@torontopearson.com', phone: '+1 416 247 7678', website: 'https://www.torontopearson.com' }], customs: [{ name: 'CBSA', website: 'https://www.cbsa-asfc.gc.ca' }] }
};

function renderPortItem(port) {
  let html = `<p style="margin-bottom: 8px;"><strong>${port.name}</strong>  ${port.code}<br>`;
  if (port.email) html += `<a href="mailto:${port.email}" style="color: #fff; text-decoration: none;">${port.email}</a><br>`;
  if (port.phone) html += `<a href="tel:${port.phone.replace(/\s/g, '')}" style="color: #fff; text-decoration: none;">${port.phone}</a><br>`;
  if (port.website) html += `<a href="${port.website}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: none;">${port.website}</a>`;
  return html + '</p>';
}

function renderCustomsItem(item) {
  let html = '<p style="margin-bottom: 8px;">';
  if (item.name) html += item.name;
  if (item.website) html += `<br><a href="${item.website}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: none;">${item.website}</a>`;
  if (item.email) html += `<br><a href="mailto:${item.email}" style="color: #fff; text-decoration: none;">${item.email}</a>`;
  if (item.phone) html += `<br><a href="tel:${item.phone.replace(/\s/g, '')}" style="color: #fff; text-decoration: none;">${item.phone}</a>`;
  return html + '</p>';
}

if (calculateDutyBtn) {
  calculateDutyBtn.addEventListener('click', () => {
    const dutyCountry = document.getElementById('duty-country');
    const dutyValue = document.getElementById('duty-value');
    if (!dutyCountry.value || !dutyValue.value) { alert('Please fill in all fields'); return; }
    const value = parseFloat(dutyValue.value);
    const rate = dutyRates[dutyCountry.value];
    if (dutyCountry.value === 'other') {
      document.getElementById('duty-savings').textContent = 'Contact us for duty information for your destination';
      document.getElementById('duty-port-info').style.display = 'none';
    } else {
      const savings = value * (rate / 100);
      document.getElementById('duty-savings').textContent = rate === 0 ? `For ${portData[dutyCountry.value].name}, Bangladesh has standard MFN rates. Contact us for specific duty information.` : `You save $${savings.toLocaleString()} in import duties (${rate}% duty-free)`;
      const data = portData[dutyCountry.value];
      if (data) {
        document.getElementById('duty-port-heading').textContent = `Key ports & customs contacts for ${data.name}`;
        document.getElementById('duty-sea-ports-list').innerHTML = data.seaPorts.map(renderPortItem).join('');
        document.getElementById('duty-air-ports-list').innerHTML = data.airPorts.map(renderPortItem).join('');
        document.getElementById('duty-customs-list').innerHTML = data.customs.map(renderCustomsItem).join('');
        document.getElementById('duty-port-info').style.display = 'block';
      }
    }
    document.getElementById('duty-result').style.display = 'block';
  });
}

// MOQ Calculator
const calculateMoqBtn = document.getElementById('calculate-moq');
if (calculateMoqBtn) {
  calculateMoqBtn.addEventListener('click', () => {
    const moqPieces = document.getElementById('moq-pieces');
    if (!moqPieces.value) { alert('Please fill in all fields'); return; }
    const pieces = parseInt(moqPieces.value);
    const moqMessage = document.getElementById('moq-message');
    const moqCta = document.getElementById('moq-cta');
    if (pieces >= 300) {
      moqMessage.textContent = 'Yes  your order qualifies. Get your free quote.';
      moqCta.innerHTML = '<a href="/contact" class="index__btn index__btn--primary" style="flex: 1;">Get Free Quote</a><a href="https://wa.me/8801911733226" target="_blank" rel="noopener noreferrer" class="index__btn index__btn--secondary" style="flex: 1;">WhatsApp Us</a>';
    } else if (pieces >= 100) {
      moqMessage.textContent = 'Possibly  contact us to discuss your specific requirements.';
      moqCta.innerHTML = '<a href="/contact" class="index__btn index__btn--primary" style="flex: 1;">Contact Us</a><a href="https://wa.me/8801911733226" target="_blank" rel="noopener noreferrer" class="index__btn index__btn--secondary" style="flex: 1;">WhatsApp Us</a>';
    } else {
      moqMessage.textContent = 'Our standard MOQ is 300 pieces per style. Let us help you plan your order.';
      moqCta.innerHTML = '<a href="/contact" class="index__btn index__btn--primary" style="flex: 1;">Plan Your Order</a><a href="https://wa.me/8801911733226" target="_blank" rel="noopener noreferrer" class="index__btn index__btn--secondary" style="flex: 1;">WhatsApp Us</a>';
    }
    document.getElementById('moq-result').style.display = 'block';
  });
}

// Service Matcher
const matchMeBtn = document.getElementById('match-me-btn');
if (matchMeBtn) {
  function calculateServiceResult(q1, q2, q3) {
    if (q1 === 'fabric-ready') return { service: 'CMT Services', description: 'You supply the fabric, we cut, sew, and finish. No MOQ restrictions on CMT.' };
    if (q2 === 'under-300' && q3 === 'starting') return { service: 'Low MOQ Startup', description: 'Our 300-piece MOQ was built for exactly this. We guide you through every step.' };
    if (q2 === 'under-300' && q3 !== 'starting') return { service: 'Contact Us', description: 'We may be able to accommodate your requirements depending on style complexity.' };
    if (q1 === 'tech-packs' && q2 === '300-1000') return { service: 'OEM Manufacturing', description: 'Send us your tech pack. We match your specs exactly and deliver FOB.' };
    if (q1 === 'tech-packs' && (q2 === '1000-10000' || q2 === 'over-10000')) return { service: 'OEM Manufacturing Scale', description: 'You qualify for our dedicated production line. Up to 50,000 pieces per month.' };
    if ((q1 === 'sketches' || q1 === 'design-help') && q3 === 'starting') return { service: 'Private Label + Startup Support', description: 'We develop your tech pack, source fabric, sample, produce, and ship. Full service.' };
    if (q1 === 'sketches' && q3 === 'scaling') return { service: 'Bespoke Development', description: 'Our design team converts your concept into production-ready specs.' };
    if (q1 === 'design-help' && q3 === 'starting') return { service: 'First-Time Brand Support', description: 'We start from zero with you. No experience needed.' };
    if (q1 === 'design-help' && (q3 === 'established' || q3 === 'scaling' || q3 === 'large')) return { service: 'Bespoke Development', description: 'We reverse-engineer your existing product or build new styles from brief.' };
    return { service: 'Private Label', description: 'Based on your answers, private label manufacturing fits best.' };
  }
  matchMeBtn.addEventListener('click', () => {
    const q1 = document.getElementById('q1-select').value;
    const q2 = document.getElementById('q2-select').value;
    const q3 = document.getElementById('q3-select').value;
    if (!q1 || !q2 || !q3) { alert('Please select all options'); return; }
    const result = calculateServiceResult(q1, q2, q3);
    document.getElementById('result-service').textContent = result.service;
    document.getElementById('result-description').textContent = result.description;
    document.getElementById('service-result').style.display = 'block';
  });
}

// DPP Checker
const dppCheckBtn = document.getElementById('dpp-check-btn');
if (dppCheckBtn) {
  dppCheckBtn.addEventListener('click', () => {
    const answers = [
      document.getElementById('dpp-q1').value,
      document.getElementById('dpp-q2').value,
      document.getElementById('dpp-q3').value,
      document.getElementById('dpp-q4').value,
      document.getElementById('dpp-q5').value,
      document.getElementById('dpp-q6').value
    ];
    if (answers.some(a => !a)) { alert('Please answer all questions'); return; }
    const yesCount = answers.filter(a => a === 'yes').length;
    const dppStatus = document.getElementById('dpp-status');
    const dppMessage = document.getElementById('dpp-message');
    const dppCta = document.getElementById('dpp-cta');
    if (yesCount === 6) {
      dppStatus.textContent = 'DPP Ready'; dppStatus.style.color = '#22c55e';
      dppMessage.textContent = 'Your brand meets all EU Digital Product Passport requirements. You are ready for 2026 compliance.';
      dppCta.style.display = 'none';
    } else if (yesCount >= 4) {
      dppStatus.textContent = 'Almost Ready'; dppStatus.style.color = '#f59e0b';
      dppMessage.textContent = 'You are close to full DPP compliance. A few documentation gaps need addressing before 2026.';
      dppCta.style.display = 'none';
    } else if (yesCount >= 2) {
      dppStatus.textContent = 'Gaps Identified'; dppStatus.style.color = '#dc2626';
      dppMessage.textContent = 'Several DPP requirements are missing. Source from SDF Apparel and we provide the documentation you need.';
      dppCta.innerHTML = '<a href="/contact" style="color: #ffffff; text-decoration: none; font-size: 0.9rem; font-weight: 500;">Get DPP Support </a>';
      dppCta.style.display = 'block';
    } else {
      dppStatus.textContent = 'Not DPP Ready'; dppStatus.style.color = '#dc2626';
      dppMessage.textContent = 'Your brand needs full DPP compliance documentation before 2026. We can help.';
      dppCta.innerHTML = '<a href="/contact" style="color: #ffffff; text-decoration: none; font-size: 0.9rem; font-weight: 500;">Get DPP Support </a>';
      dppCta.style.display = 'block';
    }
    document.getElementById('dpp-result').style.display = 'block';
  });
}
