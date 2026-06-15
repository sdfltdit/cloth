/**
 * SDF Clothing — Contact Form Handler
 * Primary: Web3Forms | Backup: Formcarry
 * Overlay: Corporate design with QR, countdown, WhatsApp
 */

(function () {
  'use strict';

  const WEB3_KEY      = '6cdc0c73-5cd1-4d25-a4c8-562a46b623ae';
  const FORMCARRY_URL = 'https://formcarry.com/s/46IEwVrAjO_';
  const WA_NUMBER     = '8801819172080';

  /* ─────────────────────────────────────────
   * 1. Reference ID generator
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
   * 4. Geo — Cloudflare trace first, ipify fallback
   * ───────────────────────────────────────── */
  async function getGeoInfo() {
    try {
      const res  = await fetch('/cdn-cgi/trace');
      const text = await res.text();
      const map  = {};
      text.trim().split('\n').forEach(function (line) {
        const i = line.indexOf('=');
        if (i !== -1) map[line.slice(0, i)] = line.slice(i + 1);
      });
      if (map.ip) {
        return {
          ip:      map.ip,
          city:    map.colo ? 'via ' + map.colo : '',
          country: map.loc  || 'Unknown',
        };
      }
    } catch { /* fall through */ }
    try {
      const res  = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return { ip: data.ip || 'Unknown', city: '', country: 'Unknown' };
    } catch {
      return { ip: 'Unknown', city: '', country: 'Unknown' };
    }
  }

  /* ─────────────────────────────────────────
   * 5. Draw decorative QR on canvas
   *    Seeded by waUrl so it's unique per ref
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

    // Corner finder patterns
    [[0, 0], [0, cells - 7], [cells - 7, 0]].forEach(function (c) {
      const cx = c[0], cy = c[1];
      ctx.fillRect(cx * cell, cy * cell, 7 * cell, 7 * cell);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((cx + 1) * cell, (cy + 1) * cell, 5 * cell, 5 * cell);
      ctx.fillStyle = '#000000';
      ctx.fillRect((cx + 2) * cell, (cy + 2) * cell, 3 * cell, 3 * cell);
    });

    // Data modules
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

    // Timing patterns
    for (let i = 8; i < cells - 8; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * cell, 6 * cell, cell - 1, cell - 1);
        ctx.fillRect(6 * cell, i * cell, cell - 1, cell - 1);
      }
    }
  }

  /* ─────────────────────────────────────────
   * 6. Show thank-you overlay
   * ───────────────────────────────────────── */
  function showThankYou(geo, device, fillSeconds) {
    const refId   = generateRefId();
    const waText  = encodeURIComponent('Hi, my reference ID is ' + refId);
    const waUrl   = 'https://wa.me/' + WA_NUMBER + '?text=' + waText;
    const browser = getBrowserInfo();
    const tz      = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const res     = window.screen.width + ' x ' + window.screen.height;
    const timeStr = new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const referrer = document.referrer || window.location.hostname + '/';
    const fillStr  = fillSeconds > 0 ? fillSeconds.toFixed(1) + 's' : '-';
    const location = [geo.city, geo.country].filter(Boolean).join(' / ');
    const TOTAL    = 48 * 3600;

    const overlay = document.createElement('div');
    overlay.id = 'sdf-thankyou';
    overlay.style.cssText = [
      'position:fixed;top:0;left:0;right:0;bottom:0',
      'background:rgba(8,8,8,0.97)',
      'display:flex;align-items:center;justify-content:center',
      'z-index:9999;padding:1.25rem;overflow-y:auto',
      'animation:sdfFadeIn 0.35s ease forwards',
    ].join(';');

    overlay.innerHTML = `
<div style="max-width:460px;width:100%;background:#111;border:0.5px solid #2a2a2a;border-radius:12px;overflow:hidden;animation:sdfSlideUp 0.4s ease forwards;">

  <div style="background:#cc0000;padding:1rem 1.25rem;display:flex;align-items:center;gap:12px;">
    <div style="width:34px;height:34px;flex-shrink:0;border:1.5px solid rgba(255,255,255,0.45);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff;">✓</div>
    <div style="flex:1;min-width:0;">
      <p style="font-size:0.6rem;letter-spacing:0.13em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin:0 0 2px;">Submission confirmed</p>
      <p style="font-size:0.95rem;font-weight:600;color:#fff;margin:0;letter-spacing:0.03em;">Message Received</p>
    </div>
    <div style="text-align:right;flex-shrink:0;">
      <p style="font-size:0.58rem;color:rgba(255,255,255,0.45);margin:0 0 2px;letter-spacing:0.08em;text-transform:uppercase;">Reference</p>
      <p style="font-size:0.7rem;font-family:monospace;color:#fff;margin:0;">${refId}</p>
    </div>
  </div>

  <div style="padding:1rem 1.25rem;border-bottom:0.5px solid #1e1e1e;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <span style="font-size:0.72rem;color:rgba(255,255,255,0.4);">Expected response in</span>
      <span id="sdf-cd" style="font-family:monospace;font-size:0.95rem;color:#fff;margin-left:auto;">48:00:00</span>
    </div>
    <div style="height:3px;background:#1e1e1e;border-radius:2px;overflow:hidden;">
      <div id="sdf-bar" style="height:100%;width:100%;background:#cc0000;border-radius:2px;transition:width 1s linear;"></div>
    </div>
    <p style="font-size:0.63rem;color:rgba(255,255,255,0.25);margin:6px 0 0;line-height:1.5;">Typically within 2 hours &nbsp;·&nbsp; Max 48 hours &nbsp;·&nbsp; Mon–Sat, 9 AM – 6 PM BST</p>
  </div>

  <div style="padding:1rem 1.25rem;border-bottom:0.5px solid #1e1e1e;">
    <p style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#cc0000;margin:0 0 0.85rem;">Session Details</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;border:0.5px solid #1e1e1e;border-radius:8px;overflow:hidden;">
      <div style="padding:0.55rem 0.75rem;border-bottom:0.5px solid #1e1e1e;border-right:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Device</p>
        <p style="font-size:0.75rem;color:#fff;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${device}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;border-bottom:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Browser</p>
        <p style="font-size:0.75rem;color:#fff;margin:0;">${browser}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;border-bottom:0.5px solid #1e1e1e;border-right:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Resolution</p>
        <p style="font-size:0.75rem;color:#fff;margin:0;">${res}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;border-bottom:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Timezone</p>
        <p style="font-size:0.75rem;color:#fff;margin:0;">${tz}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;border-bottom:0.5px solid #1e1e1e;border-right:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Location</p>
        <p style="font-size:0.75rem;color:#fff;margin:0;">${location || 'Unknown'}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;border-bottom:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">IP Address</p>
        <p style="font-size:0.75rem;color:#fff;font-family:monospace;margin:0;">${geo.ip}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;border-right:0.5px solid #1e1e1e;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Fill Time</p>
        <p style="font-size:0.75rem;color:#fff;margin:0;">${fillStr}</p>
      </div>
      <div style="padding:0.55rem 0.75rem;">
        <p style="font-size:0.58rem;color:rgba(255,255,255,0.3);margin:0 0 3px;letter-spacing:0.08em;text-transform:uppercase;">Submitted</p>
        <p style="font-size:0.72rem;color:#fff;margin:0;">${timeStr}</p>
      </div>
    </div>
    <div style="margin-top:8px;padding:0.5rem 0.75rem;background:#0d0d0d;border:0.5px solid #1e1e1e;border-radius:6px;display:flex;align-items:center;gap:8px;">
      <span style="font-size:0.63rem;color:rgba(255,255,255,0.25);flex-shrink:0;">Referrer</span>
      <span style="font-size:0.7rem;color:rgba(255,255,255,0.4);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${referrer}</span>
    </div>
  </div>

  <div style="padding:1rem 1.25rem;border-bottom:0.5px solid #1e1e1e;display:flex;gap:1rem;align-items:center;">
    <div style="flex:1;min-width:0;">
      <p style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#cc0000;margin:0 0 0.4rem;">Scan to follow up</p>
      <p style="font-size:0.7rem;color:rgba(255,255,255,0.35);margin:0 0 5px;line-height:1.5;">Opens WhatsApp with your reference ID pre-filled.</p>
      <p style="font-size:0.63rem;font-family:monospace;color:rgba(255,255,255,0.2);margin:0;">${refId}</p>
    </div>
    <canvas id="sdf-qr" width="90" height="90" style="display:block;flex-shrink:0;border:3px solid #fff;border-radius:4px;"></canvas>
  </div>

  <div style="padding:0.85rem 1.25rem;border-bottom:0.5px solid #1e1e1e;">
    <a href="${waUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;background:#128C7E;border-radius:8px;padding:0.7rem 1rem;text-decoration:none;">
      <span style="font-size:1.15rem;line-height:1;">💬</span>
      <span style="font-size:0.78rem;font-weight:600;color:#fff;letter-spacing:0.06em;text-transform:uppercase;">Chat on WhatsApp</span>
      <span style="font-size:0.63rem;color:rgba(255,255,255,0.5);margin-left:auto;white-space:nowrap;">Replies in minutes</span>
    </a>
  </div>

  <div style="padding:0.85rem 1.25rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
    <p style="font-size:0.6rem;color:rgba(255,255,255,0.18);margin:0;line-height:1.5;">SDF Clothing Ltd · Trusted manufacturer since 1998</p>
    <button id="sdf-close" style="background:#cc0000;color:#fff;border:none;padding:0.55rem 1.25rem;font-size:0.7rem;letter-spacing:0.13em;text-transform:uppercase;cursor:pointer;border-radius:6px;white-space:nowrap;min-height:36px;transition:background 0.2s;flex-shrink:0;">
      Close
    </button>
  </div>

</div>
<style>
  @keyframes sdfFadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes sdfSlideUp { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }
</style>`;

    document.body.appendChild(overlay);

    // Close button
    document.getElementById('sdf-close').addEventListener('click', function () {
      overlay.remove();
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

    // QR — seeded by waUrl so unique per refId
    const qrEl = document.getElementById('sdf-qr');
    if (qrEl) drawQR(qrEl, waUrl);
  }

  /* ─────────────────────────────────────────
   * 7. Web3Forms submit
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
   * 8. Formcarry backup
   * ───────────────────────────────────────── */
  async function submitFormcarry(data) {
    const res = await fetch(FORMCARRY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(data),
    });
    const json = await res.json();
    return json.code === 200 || res.ok;
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

    const [geo, device] = await Promise.all([getGeoInfo(), Promise.resolve(getDeviceInfo())]);

    const fillSeconds       = (Date.now() - pageLoad) / 1000;
    data['_device']         = device;
    data['_browser']        = getBrowserInfo();
    data['_ip']             = geo.ip;
    data['_country']        = geo.country;
    data['_location']       = [geo.city, geo.country].filter(Boolean).join(' / ');
    data['_resolution']     = window.screen.width + 'x' + window.screen.height;
    data['_timezone']       = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    data['_referrer']       = document.referrer || window.location.hostname + '/';
    data['_fill_time']      = fillSeconds.toFixed(1) + 's';

    let success = false;
    try { success = await submitWeb3(data); } catch { /* backup */ }

    if (success) {
      submitFormcarry(data).catch(function () {});
    } else {
      try { success = await submitFormcarry(data); } catch { /* both failed */ }
    }

    submit.disabled    = false;
    submit.textContent = orig;

    if (success) {
      form.reset();
      showThankYou(geo, device, fillSeconds);
    } else {
      alert('Something went wrong. Please try our WhatsApp contact button.');
    }
  }

  /* ─────────────────────────────────────────
   * 10. Track page load time + init
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
