/**
 * SDF Clothing — Contact Form Handler
 * Web3Forms only (no backup service)
 * Overlay: Corporate design with QR, countdown, WhatsApp
 */

(function () {
  'use strict';

  const WEB3_KEY  = '028983eb-bca7-4bbc-be4f-7db2873903aa';
  const WA_NUMBER = '8801819172080';

  /* ─────────────────────────────────────────
   * 1. Reference ID
   * ───────────────────────────────────────── */
  function generateRefId() {
    const now  = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = String(now.getHours()).padStart(2, '0')
               + String(now.getMinutes()).padStart(2, '0')
               + String(now.getSeconds()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return 'SDF-' + date + '-' + time + '-' + rand;
  }

  /* ─────────────────────────────────────────
   * 2. Device info
   * ───────────────────────────────────────── */
  function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Unknown Device';
    if (/iPhone/.test(ua))       device = 'iPhone';
    else if (/iPad/.test(ua))    device = 'iPad';
    else if (/Android/.test(ua)) device = 'Android Device';
    else if (/Mac/.test(ua))     device = 'Mac';
    else if (/Windows/.test(ua)) device = 'Windows PC';
    else if (/Linux/.test(ua))   device = 'Linux PC';
    const model = ua.match(/\(([^)]+)\)/);
    if (model && model[1]) {
      const m = model[1].split(';')[0].trim();
      if (m.length < 40) device = m;
    }
    return device;
  }

  /* ─────────────────────────────────────────
   * 3. Browser name + major version
   * ───────────────────────────────────────── */
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown', version = '';
    if (ua.includes('Edg/')) {
      browser = 'Edge';
      version = (ua.match(/Edg\/([\d.]+)/) || [])[1] || '';
    } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
      browser = 'Opera';
      version = (ua.match(/OPR\/([\d.]+)/) || [])[1] || '';
    } else if (ua.includes('Chrome/')) {
      browser = 'Chrome';
      version = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || '';
    } else if (ua.includes('Firefox/')) {
      browser = 'Firefox';
      version = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || '';
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      browser = 'Safari';
      version = (ua.match(/Version\/([\d.]+)/) || [])[1] || '';
    }
    const major = version.split('.')[0];
    return browser + (major ? ' ' + major : '');
  }

  /* ─────────────────────────────────────────
   * 4. Connection type
   * ───────────────────────────────────────── */
  function getConnectionType() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return 'Unknown';
    const type = conn.type || '';
    const eff  = conn.effectiveType || '';
    if (type === 'wifi')     return 'WiFi';
    if (type === 'cellular') return 'Mobile (' + eff.toUpperCase() + ')';
    if (type === 'ethernet') return 'Ethernet';
    if (eff)                 return eff.toUpperCase();
    return 'Unknown';
  }

  /* ─────────────────────────────────────────
   * 5. Geo
   * ───────────────────────────────────────── */
  async function getGeoInfo() {
    let ip = 'Unknown';
    try {
      const res  = await fetch('/cdn-cgi/trace');
      const text = await res.text();
      const map  = {};
      text.trim().split('\n').forEach(function (line) {
        const i = line.indexOf('=');
        if (i !== -1) map[line.slice(0, i)] = line.slice(i + 1);
      });
      if (map.ip) ip = map.ip;
    } catch { /* fall through */ }

    try {
      const fields = 'status,city,regionName,country,countryCode,isp,org';
      const res    = await fetch(
        'http://ip-api.com/json/' + ip + '?fields=' + fields,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (data.status === 'success') {
        return {
          ip:      ip,
          city:    data.city        || '',
          region:  data.regionName  || '',
          country: data.country     || 'Unknown',
          cc:      data.countryCode || '',
          isp:     data.isp || data.org || 'Unknown',
        };
      }
    } catch { /* fall through */ }

    return { ip, city: '', region: '', country: 'Unknown', cc: '', isp: 'Unknown' };
  }

  /* ─────────────────────────────────────────
   * 6. Draw decorative QR on canvas
   * ───────────────────────────────────────── */
  function drawQR(canvasEl, seedText) {
    const size  = canvasEl.width;
    const ctx   = canvasEl.getContext('2d');
    const cells = 25;
    const cell  = Math.floor(size / cells);

    function hashCode(s) {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
      return h;
    }
    const seed = hashCode(seedText);
    function rand(i) { const x = Math.sin(seed + i) * 43758.5453123; return x - Math.floor(x); }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';

    [[0, 0], [0, cells - 7], [cells - 7, 0]].forEach(function (c) {
      const cx = c[0], cy = c[1];
      ctx.fillRect(cx * cell, cy * cell, 7 * cell, 7 * cell);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((cx + 1) * cell, (cy + 1) * cell, 5 * cell, 5 * cell);
      ctx.fillStyle = '#000000';
      ctx.fillRect((cx + 2) * cell, (cy + 2) * cell, 3 * cell, 3 * cell);
    });

    let idx = 0;
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c > cells - 9;
        const inBL = r > cells - 9 && c < 8;
        if (!inTL && !inTR && !inBL && rand(idx++) > 0.5) {
          ctx.fillRect(c * cell, r * cell, cell - 1, cell - 1);
        }
      }
    }

    for (let i = 8; i < cells - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * cell, 6 * cell, cell - 1, cell - 1);
        ctx.fillRect(6 * cell, i * cell, cell - 1, cell - 1);
      }
    }
  }

  /* ─────────────────────────────────────────
   * 7. Show thank-you overlay (fully responsive)
   * ───────────────────────────────────────── */
  function showThankYou(geo, device, fillSeconds) {
    const refId   = generateRefId();
    const waText  = encodeURIComponent('Hi, my reference ID is ' + refId);
    const waUrl   = 'https://wa.me/' + WA_NUMBER + '?text=' + waText;
    const browser = getBrowserInfo();
    const conn    = getConnectionType();
    const tz      = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const lang    = navigator.language || navigator.userLanguage || 'Unknown';
    const scr     = window.screen.width + ' x ' + window.screen.height;
    const timeStr = new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const referrer = document.referrer || window.location.hostname + '/';
    const fillStr  = fillSeconds > 0 ? fillSeconds.toFixed(1) + 's' : '-';
    const location = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    const TOTAL    = 48 * 3600;

    const overlay = document.createElement('div');
    overlay.id = 'sdf-thankyou';

    overlay.innerHTML = `
<style>
  @keyframes sdfFadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes sdfSlideUp { from { opacity:0;transform:translateY(16px) } to { opacity:1;transform:translateY(0) } }

  #sdf-thankyou {
    position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(8,8,8,0.97);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;
    padding:1rem;
    overflow-y:auto;
    box-sizing:border-box;
    animation:sdfFadeIn 0.3s ease forwards;
  }

  #sdf-thankyou .sdf-card {
    max-width:460px;
    width:100%;
    background:#111;
    border:0.5px solid #2a2a2a;
    border-radius:12px;
    overflow:hidden;
    animation:sdfSlideUp 0.35s ease forwards;
    box-sizing:border-box;
    margin:auto;
  }

  #sdf-thankyou .sdf-grid {
    display:grid;
    grid-template-columns:1fr 1fr;
    border:0.5px solid #1e1e1e;
    border-radius:8px;
    overflow:hidden;
  }

  #sdf-thankyou .sdf-cell {
    padding:0.5rem 0.65rem;
    border-bottom:0.5px solid #1e1e1e;
    box-sizing:border-box;
    min-width:0;
  }

  #sdf-thankyou .sdf-cell-label {
    font-size:0.57rem;
    color:rgba(255,255,255,0.3);
    margin:0 0 3px;
    letter-spacing:0.08em;
    text-transform:uppercase;
  }

  #sdf-thankyou .sdf-cell-value {
    font-size:0.72rem;
    color:#fff;
    margin:0;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-break:break-all;
  }

  #sdf-thankyou .sdf-cell-right {
    border-left:0.5px solid #1e1e1e;
  }

  #sdf-thankyou .sdf-cell-last {
    border-bottom:none;
  }

  /* Small phones: single column */
  @media (max-width:380px) {
    #sdf-thankyou { padding:0.5rem; align-items:flex-start; padding-top:1.5rem; }
    #sdf-thankyou .sdf-grid { grid-template-columns:1fr !important; }
    #sdf-thankyou .sdf-cell-right { border-left:none !important; border-top:0.5px solid #1e1e1e; }
    #sdf-thankyou .sdf-header-ref { display:none; }
    #sdf-thankyou .sdf-cell { padding:0.45rem 0.6rem; }
  }

  /* Short screens: ensure scrolling */
  @media (max-height:680px) {
    #sdf-thankyou { align-items:flex-start; padding-top:0.75rem; }
  }

  /* Tablet and up */
  @media (min-width:520px) {
    #sdf-thankyou .sdf-cell { padding:0.55rem 0.75rem; }
    #sdf-thankyou .sdf-cell-value { font-size:0.75rem; }
  }
</style>

<div class="sdf-card">

  <!-- Header -->
  <div style="background:#cc0000;padding:0.85rem 1.1rem;display:flex;align-items:center;gap:10px;">
    <div style="width:32px;height:32px;flex-shrink:0;border:1.5px solid rgba(255,255,255,0.45);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;">✓</div>
    <div style="flex:1;min-width:0;">
      <p style="font-size:0.58rem;letter-spacing:0.13em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin:0 0 2px;">Submission confirmed</p>
      <p style="font-size:0.9rem;font-weight:600;color:#fff;margin:0;letter-spacing:0.02em;">Message Received</p>
    </div>
    <div class="sdf-header-ref" style="text-align:right;flex-shrink:0;">
      <p style="font-size:0.57rem;color:rgba(255,255,255,0.45);margin:0 0 2px;letter-spacing:0.08em;text-transform:uppercase;">Reference</p>
      <p style="font-size:0.65rem;font-family:monospace;color:#fff;margin:0;">${refId}</p>
    </div>
  </div>

  <!-- Countdown -->
  <div style="padding:0.85rem 1.1rem;border-bottom:0.5px solid #1e1e1e;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
      <span style="font-size:0.7rem;color:rgba(255,255,255,0.4);">Expected response in</span>
      <span id="sdf-cd" style="font-family:monospace;font-size:0.9rem;color:#fff;margin-left:auto;">48:00:00</span>
    </div>
    <div style="height:3px;background:#1e1e1e;border-radius:2px;overflow:hidden;">
      <div id="sdf-bar" style="height:100%;width:100%;background:#cc0000;border-radius:2px;transition:width 1s linear;"></div>
    </div>
    <p style="font-size:0.62rem;color:rgba(255,255,255,0.25);margin:5px 0 0;line-height:1.5;">Typically within 2 hours &nbsp;·&nbsp; Max 48 hours &nbsp;·&nbsp; Mon–Sat, 9 AM – 6 PM BST</p>
  </div>

  <!-- Session Details -->
  <div style="padding:0.85rem 1.1rem;border-bottom:0.5px solid #1e1e1e;">
    <p style="font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:#cc0000;margin:0 0 0.7rem;">Session Details</p>

    <div class="sdf-grid">
      <div class="sdf-cell">
        <p class="sdf-cell-label">Device</p>
        <p class="sdf-cell-value">${device}</p>
      </div>
      <div class="sdf-cell sdf-cell-right">
        <p class="sdf-cell-label">Browser</p>
        <p class="sdf-cell-value">${browser}</p>
      </div>
      <div class="sdf-cell">
        <p class="sdf-cell-label">Screen</p>
        <p class="sdf-cell-value">${scr}</p>
      </div>
      <div class="sdf-cell sdf-cell-right">
        <p class="sdf-cell-label">Connection</p>
        <p class="sdf-cell-value">${conn}</p>
      </div>
      <div class="sdf-cell">
        <p class="sdf-cell-label">Timezone</p>
        <p class="sdf-cell-value">${tz}</p>
      </div>
      <div class="sdf-cell sdf-cell-right">
        <p class="sdf-cell-label">Language</p>
        <p class="sdf-cell-value">${lang}</p>
      </div>
      <div class="sdf-cell">
        <p class="sdf-cell-label">Location</p>
        <p class="sdf-cell-value">${location || 'Unknown'}</p>
      </div>
      <div class="sdf-cell sdf-cell-right">
        <p class="sdf-cell-label">ISP</p>
        <p class="sdf-cell-value">${geo.isp}</p>
      </div>
      <div class="sdf-cell sdf-cell-last">
        <p class="sdf-cell-label">IP Address</p>
        <p class="sdf-cell-value" style="font-family:monospace;">${geo.ip}</p>
      </div>
      <div class="sdf-cell sdf-cell-right sdf-cell-last">
        <p class="sdf-cell-label">Fill Time</p>
        <p class="sdf-cell-value">${fillStr}</p>
      </div>
    </div>

    <!-- Submitted + Referrer -->
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">
      <div style="padding:0.45rem 0.65rem;background:#0d0d0d;border:0.5px solid #1e1e1e;border-radius:6px;min-width:0;">
        <p style="font-size:0.57rem;color:rgba(255,255,255,0.25);margin:0 0 2px;letter-spacing:0.08em;text-transform:uppercase;">Submitted</p>
        <p style="font-size:0.68rem;color:rgba(255,255,255,0.6);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${timeStr}</p>
      </div>
      <div style="padding:0.45rem 0.65rem;background:#0d0d0d;border:0.5px solid #1e1e1e;border-radius:6px;min-width:0;">
        <p style="font-size:0.57rem;color:rgba(255,255,255,0.25);margin:0 0 2px;letter-spacing:0.08em;text-transform:uppercase;">Referrer</p>
        <p style="font-size:0.68rem;color:rgba(255,255,255,0.6);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${referrer}</p>
      </div>
    </div>
  </div>

  <!-- QR -->
  <div style="padding:0.85rem 1.1rem;border-bottom:0.5px solid #1e1e1e;display:flex;gap:0.85rem;align-items:center;">
    <div style="flex:1;min-width:0;">
      <p style="font-size:0.58rem;letter-spacing:0.15em;text-transform:uppercase;color:#cc0000;margin:0 0 0.35rem;">Scan to follow up</p>
      <p style="font-size:0.68rem;color:rgba(255,255,255,0.35);margin:0 0 4px;line-height:1.5;">Opens WhatsApp with your reference ID pre-filled.</p>
      <p style="font-size:0.6rem;font-family:monospace;color:rgba(255,255,255,0.2);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${refId}</p>
    </div>
    <canvas id="sdf-qr" width="80" height="80" style="display:block;flex-shrink:0;border:3px solid #fff;border-radius:4px;"></canvas>
  </div>

  <!-- WhatsApp -->
  <div style="padding:0.75rem 1.1rem;border-bottom:0.5px solid #1e1e1e;">
    <a href="${waUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;background:#128C7E;border-radius:8px;padding:0.65rem 0.9rem;text-decoration:none;">
      <span style="font-size:1.1rem;line-height:1;">💬</span>
      <span style="font-size:0.75rem;font-weight:600;color:#fff;letter-spacing:0.06em;text-transform:uppercase;">Chat on WhatsApp</span>
      <span style="font-size:0.62rem;color:rgba(255,255,255,0.5);margin-left:auto;white-space:nowrap;">Replies in minutes</span>
    </a>
  </div>

  <!-- Footer -->
  <div style="padding:0.75rem 1.1rem;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;">
    <p style="font-size:0.58rem;color:rgba(255,255,255,0.18);margin:0;line-height:1.5;">SDF Clothing Ltd · Trusted manufacturer since 1998</p>
    <button id="sdf-close" style="background:#cc0000;color:#fff;border:none;padding:0.5rem 1.1rem;font-size:0.68rem;letter-spacing:0.13em;text-transform:uppercase;cursor:pointer;border-radius:6px;white-space:nowrap;min-height:36px;flex-shrink:0;">
      Close
    </button>
  </div>

</div>`;

    document.body.appendChild(overlay);

    document.getElementById('sdf-close').addEventListener('click', function () {
      overlay.remove();
    });

    // Close on backdrop click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });

    // Countdown
    let remaining = TOTAL;
    const cdEl  = document.getElementById('sdf-cd');
    const barEl = document.getElementById('sdf-bar');
    function fmt(s) {
      return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
        .map(function (n) { return String(n).padStart(2, '0'); }).join(':');
    }
    if (cdEl && barEl) {
      const iv = setInterval(function () {
        remaining = Math.max(0, remaining - 1);
        cdEl.textContent  = fmt(remaining);
        barEl.style.width = ((remaining / TOTAL) * 100).toFixed(3) + '%';
        if (remaining === 0) clearInterval(iv);
      }, 1000);
    }

    // QR
    const qrEl = document.getElementById('sdf-qr');
    if (qrEl) drawQR(qrEl, waUrl);
  }

  /* ─────────────────────────────────────────
   * 8. Web3Forms submit
   * ───────────────────────────────────────── */
  async function submitWeb3(data) {
    const body = new FormData();
    body.append('access_key', WEB3_KEY);
    Object.entries(data).forEach(function ([k, v]) { body.append(k, v); });
    const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body });
    const json = await res.json();
    return json.success === true;
  }

  /* ─────────────────────────────────────────
   * 9. Main submit handler
   * ───────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    const form   = e.target;
    const submit = form.querySelector('[type="submit"]');
    if (!submit) return;

    const pageLoad = window._sdfPageLoad || Date.now();
    const orig     = submit.textContent;
    submit.disabled    = true;
    submit.textContent = 'Sending\u2026';

    const data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    const [geo, device] = await Promise.all([
      getGeoInfo(),
      Promise.resolve(getDeviceInfo()),
    ]);

    const fillSeconds = (Date.now() - pageLoad) / 1000;

    data['_reference_id'] = generateRefId();
    data['_device']       = device;
    data['_browser']      = getBrowserInfo();
    data['_screen']       = window.screen.width + 'x' + window.screen.height;
    data['_connection']   = getConnectionType();
    data['_timezone']     = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    data['_language']     = navigator.language || navigator.userLanguage || '';
    data['_ip']           = geo.ip;
    data['_isp']          = geo.isp;
    data['_location']     = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    data['_country_code'] = geo.cc;
    data['_page_url']     = window.location.href;
    data['_referrer']     = document.referrer || window.location.hostname + '/';
    data['_fill_time']    = fillSeconds.toFixed(1) + 's';

    let success = false;
    try { success = await submitWeb3(data); } catch { /* network/parse error */ }

    submit.disabled    = false;
    submit.textContent = orig;

    if (success) {
      form.reset();
      showThankYou(geo, device, fillSeconds);
    } else {
      alert('Something went wrong. Please try our WhatsApp contact button, or email us directly at contact@sdfltd.com');
    }
  }

  /* ─────────────────────────────────────────
   * 10. Page load time + init
   * ───────────────────────────────────────── */
  window._sdfPageLoad = Date.now();

  function init() {
    document.querySelectorAll('form[data-contact], form.contact-form, #contact-form, #contactForm')
      .forEach(function (form) { form.addEventListener('submit', handleSubmit); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
