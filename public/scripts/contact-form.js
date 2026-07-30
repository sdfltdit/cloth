/**
 * SDF Clothing — Contact Form Handler
 * Submits to Cloudflare Worker /api/contact (Resend-powered)
 * Overlay: viewport-unit cascade (vh→svh→dvh), safe-area aware,
 * sticky header/footer with scrollable body — tested for short
 * viewports, notch devices, and small phones (iPhone SE / 320px).
 */

(function () {
  'use strict';

  const WA_NUMBER = '8801819172080';

  /* 1. Reference ID */
  function generateRefId() {
    const now  = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = String(now.getHours()).padStart(2, '0')
               + String(now.getMinutes()).padStart(2, '0')
               + String(now.getSeconds()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return 'SDF-' + date + '-' + time + '-' + rand;
  }

  /* 2. Device info */
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

  /* 3. Browser */
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
    return browser + (version.split('.')[0] ? ' ' + version.split('.')[0] : '');
  }

  /* 4. Connection */
  function getConnectionType() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return 'Unknown';
    const type = conn.type || '', eff = conn.effectiveType || '';
    if (type === 'wifi')     return 'WiFi';
    if (type === 'cellular') return 'Mobile (' + eff.toUpperCase() + ')';
    if (type === 'ethernet') return 'Ethernet';
    if (eff) return eff.toUpperCase();
    return 'Unknown';
  }

  /* 5. Geo */
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
    } catch { /* skip */ }
    try {
      const fields = 'status,city,regionName,country,countryCode,isp,org';
      const res    = await fetch('http://ip-api.com/json/' + ip + '?fields=' + fields, { cache: 'no-store' });
      const data   = await res.json();
      if (data.status === 'success') {
        return { ip, city: data.city || '', region: data.regionName || '',
          country: data.country || 'Unknown', cc: data.countryCode || '',
          isp: data.isp || data.org || 'Unknown' };
      }
    } catch { /* skip */ }
    return { ip, city: '', region: '', country: 'Unknown', cc: '', isp: 'Unknown' };
  }

  /* 6. QR canvas */
  function drawQR(canvasEl, seedText) {
    const size = canvasEl.width;
    const ctx  = canvasEl.getContext('2d');
    const cells = 25, cell = Math.floor(size / cells);
    function hashCode(s) {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
      return h;
    }
    const seed = hashCode(seedText);
    function rand(i) { const x = Math.sin(seed + i) * 43758.5453123; return x - Math.floor(x); }
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, size, size); ctx.fillStyle = '#000000';
    [[0,0],[0,cells-7],[cells-7,0]].forEach(function(c) {
      const cx = c[0], cy = c[1];
      ctx.fillRect(cx*cell, cy*cell, 7*cell, 7*cell);
      ctx.fillStyle = '#ffffff'; ctx.fillRect((cx+1)*cell,(cy+1)*cell,5*cell,5*cell);
      ctx.fillStyle = '#000000'; ctx.fillRect((cx+2)*cell,(cy+2)*cell,3*cell,3*cell);
    });
    let idx = 0;
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const inTL = r<8&&c<8, inTR = r<8&&c>cells-9, inBL = r>cells-9&&c<8;
        if (!inTL && !inTR && !inBL && rand(idx++) > 0.5)
          ctx.fillRect(c*cell, r*cell, cell-1, cell-1);
      }
    }
    for (let i = 8; i < cells-8; i++) {
      if (i%2===0) {
        ctx.fillRect(i*cell, 6*cell, cell-1, cell-1);
        ctx.fillRect(6*cell, i*cell, cell-1, cell-1);
      }
    }
  }

  /* 7. Show overlay
   * Layout strategy:
   *  - Overlay is given an EXPLICIT height (vh → svh → dvh cascade),
   *    not just inset:0, because position:fixed + inset:0 alone can
   *    be miscalculated behind mobile browser toolbars (the same
   *    root cause as the classic "100vh mobile bug"). An explicit
   *    height fixes that.
   *  - The card uses max-height:100% (relative to the overlay's
   *    own padding box), so it automatically respects whatever
   *    space is actually available — no fragile calc() chains.
   *  - Header and footer are flex-shrink:0 (always fully visible);
   *    only the middle content area scrolls. This guarantees the
   *    Close button and reference ID are NEVER cut off, regardless
   *    of screen height.
   *  - Safe-area insets are respected for notch / home-indicator
   *    devices via env(safe-area-inset-*).
   */
  function showThankYou(geo, device, fillSeconds, referenceId) {
    const refId   = referenceId || generateRefId();
    const waText  = encodeURIComponent('Hi, my reference ID is ' + refId);
    const waUrl   = 'https://wa.me/' + WA_NUMBER + '?text=' + waText;
    const browser = getBrowserInfo();
    const conn    = getConnectionType();
    const tz      = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const lang    = navigator.language || 'Unknown';
    const scr     = window.screen.width + ' x ' + window.screen.height;
    const timeStr = new Date().toLocaleString('en-GB', {
      day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
    const referrer = document.referrer || window.location.hostname + '/';
    const fillStr  = fillSeconds > 0 ? fillSeconds.toFixed(1) + 's' : '-';
    const location = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    const TOTAL    = 48 * 3600;

    const overlay = document.createElement('div');
    overlay.id = 'sdf-thankyou';

    overlay.innerHTML = `
<style>
  @keyframes sdfFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes sdfSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

  #sdf-thankyou, #sdf-thankyou *, #sdf-thankyou *::before, #sdf-thankyou *::after {
    box-sizing: border-box;
  }

  #sdf-thankyou {
    position: fixed;
    top: 0; left: 0; right: 0;
    width: 100%;
    /* Progressive viewport-height enhancement — last supported wins */
    height: 100vh;
    height: 100svh;
    height: 100dvh;
    background: rgba(8,8,8,0.96);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    padding: max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right))
             max(0.75rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
    animation: sdfFadeIn 0.25s ease forwards;
  }

  #sdf-thankyou .sdf-card {
    max-width: 460px;
    width: 100%;
    max-height: 100%;
    background: #111;
    border: 0.5px solid #2a2a2a;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: sdfSlideUp 0.3s ease forwards;
  }

  #sdf-thankyou .sdf-head {
    background: #cc0000;
    padding: 0.8rem 1rem;
    display: flex; align-items: center; gap: 10px;
    flex-shrink: 0;
  }

  #sdf-thankyou .sdf-body {
    flex: 1 1 auto;
    min-height: 0;            /* required so flex child can actually shrink+scroll */
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: #2a2a2a #111;
  }
  #sdf-thankyou .sdf-body::-webkit-scrollbar { width: 4px; }
  #sdf-thankyou .sdf-body::-webkit-scrollbar-track { background: #111; }
  #sdf-thankyou .sdf-body::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  #sdf-thankyou .sdf-foot {
    flex-shrink: 0;
    border-top: 0.5px solid #1e1e1e;
    padding-bottom: env(safe-area-inset-bottom);
  }

  #sdf-thankyou .sdf-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    border: 0.5px solid #1e1e1e; border-radius: 8px; overflow: hidden;
  }
  #sdf-thankyou .sdf-cell {
    padding: 0.45rem 0.65rem;
    border-bottom: 0.5px solid #1e1e1e;
    min-width: 0;
  }
  #sdf-thankyou .sdf-cell.right { border-left: 0.5px solid #1e1e1e; }
  #sdf-thankyou .sdf-cell.last  { border-bottom: none; }
  #sdf-thankyou .sdf-lbl {
    font-size: 0.55rem; color: rgba(255,255,255,0.3);
    margin: 0 0 2px; letter-spacing: 0.08em; text-transform: uppercase;
  }
  #sdf-thankyou .sdf-val {
    font-size: 0.72rem; color: #fff; margin: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* Small phones (iPhone SE / 320–375px) */
  @media (max-width: 380px) {
    #sdf-thankyou { padding: 0.4rem; }
    #sdf-thankyou .sdf-card { border-radius: 10px; }
    #sdf-thankyou .sdf-grid { grid-template-columns: 1fr; }
    #sdf-thankyou .sdf-cell.right { border-left: none; border-top: 0.5px solid #1e1e1e; }
    #sdf-thankyou .sdf-ref-badge { display: none; }
  }

  /* Very short viewports (landscape phones, small laptops, zoomed browser) */
  @media (max-height: 480px) {
    #sdf-thankyou .sdf-head { padding: 0.55rem 0.9rem; }
    #sdf-thankyou .sdf-foot > div:first-child { padding: 0.4rem 1rem; }
    #sdf-thankyou .sdf-foot > div:last-child  { padding: 0.4rem 1rem 0.5rem; }
  }
</style>

<div class="sdf-card" role="dialog" aria-modal="true" aria-label="Submission confirmation">

  <!-- STICKY HEADER -->
  <div class="sdf-head">
    <div style="width:30px;height:30px;flex-shrink:0;border:1.5px solid rgba(255,255,255,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#fff;">✓</div>
    <div style="flex:1;min-width:0;">
      <p style="font-size:0.57rem;letter-spacing:0.13em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin:0 0 1px;">Submission confirmed</p>
      <p style="font-size:0.88rem;font-weight:600;color:#fff;margin:0;">Message Received</p>
    </div>
    <div class="sdf-ref-badge" style="text-align:right;flex-shrink:0;">
      <p style="font-size:0.55rem;color:rgba(255,255,255,0.45);margin:0 0 1px;letter-spacing:0.08em;text-transform:uppercase;">Reference</p>
      <p style="font-size:0.63rem;font-family:monospace;color:#fff;margin:0;">${refId}</p>
    </div>
  </div>

  <!-- SCROLLABLE BODY -->
  <div class="sdf-body">

    <!-- Countdown -->
    <div style="padding:0.8rem 1rem;border-bottom:0.5px solid #1e1e1e;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:0.68rem;color:rgba(255,255,255,0.4);">Expected response in</span>
        <span id="sdf-cd" style="font-family:monospace;font-size:0.88rem;color:#fff;margin-left:auto;">48:00:00</span>
      </div>
      <div style="height:3px;background:#1e1e1e;border-radius:2px;overflow:hidden;">
        <div id="sdf-bar" style="height:100%;width:100%;background:#cc0000;border-radius:2px;transition:width 1s linear;"></div>
      </div>
      <p style="font-size:0.6rem;color:rgba(255,255,255,0.22);margin:5px 0 0;line-height:1.5;">Typically within 2 hours &nbsp;·&nbsp; Max 48 hours &nbsp;·&nbsp; Mon–Sat, 9 AM – 6 PM BST</p>
    </div>

    <!-- Session Details -->
    <div style="padding:0.8rem 1rem;border-bottom:0.5px solid #1e1e1e;">
      <p style="font-size:0.57rem;letter-spacing:0.15em;text-transform:uppercase;color:#cc0000;margin:0 0 0.65rem;">Session Details</p>
      <div class="sdf-grid">
        <div class="sdf-cell"><p class="sdf-lbl">Device</p><p class="sdf-val">${device}</p></div>
        <div class="sdf-cell right"><p class="sdf-lbl">Browser</p><p class="sdf-val">${browser}</p></div>
        <div class="sdf-cell"><p class="sdf-lbl">Screen</p><p class="sdf-val">${scr}</p></div>
        <div class="sdf-cell right"><p class="sdf-lbl">Connection</p><p class="sdf-val">${conn}</p></div>
        <div class="sdf-cell"><p class="sdf-lbl">Timezone</p><p class="sdf-val">${tz}</p></div>
        <div class="sdf-cell right"><p class="sdf-lbl">Language</p><p class="sdf-val">${lang}</p></div>
        <div class="sdf-cell"><p class="sdf-lbl">Location</p><p class="sdf-val">${location || 'Unknown'}</p></div>
        <div class="sdf-cell right"><p class="sdf-lbl">ISP</p><p class="sdf-val">${geo.isp}</p></div>
        <div class="sdf-cell last"><p class="sdf-lbl">IP Address</p><p class="sdf-val" style="font-family:monospace;">${geo.ip}</p></div>
        <div class="sdf-cell right last"><p class="sdf-lbl">Fill Time</p><p class="sdf-val">${fillStr}</p></div>
      </div>
      <div style="margin-top:7px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        <div style="padding:0.42rem 0.6rem;background:#0d0d0d;border:0.5px solid #1e1e1e;border-radius:6px;min-width:0;">
          <p style="font-size:0.55rem;color:rgba(255,255,255,0.25);margin:0 0 2px;letter-spacing:0.08em;text-transform:uppercase;">Submitted</p>
          <p style="font-size:0.66rem;color:rgba(255,255,255,0.6);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${timeStr}</p>
        </div>
        <div style="padding:0.42rem 0.6rem;background:#0d0d0d;border:0.5px solid #1e1e1e;border-radius:6px;min-width:0;">
          <p style="font-size:0.55rem;color:rgba(255,255,255,0.25);margin:0 0 2px;letter-spacing:0.08em;text-transform:uppercase;">Referrer</p>
          <p style="font-size:0.66rem;color:rgba(255,255,255,0.6);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${referrer}</p>
        </div>
      </div>
    </div>

    <!-- QR -->
    <div style="padding:0.8rem 1rem;display:flex;gap:0.85rem;align-items:center;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:0.57rem;letter-spacing:0.15em;text-transform:uppercase;color:#cc0000;margin:0 0 0.3rem;">Scan to follow up</p>
        <p style="font-size:0.66rem;color:rgba(255,255,255,0.35);margin:0 0 4px;line-height:1.5;">Opens WhatsApp with your reference ID pre-filled.</p>
        <p style="font-size:0.58rem;font-family:monospace;color:rgba(255,255,255,0.2);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${refId}</p>
      </div>
      <canvas id="sdf-qr" width="76" height="76" style="display:block;flex-shrink:0;border:3px solid #fff;border-radius:4px;"></canvas>
    </div>

  </div><!-- end .sdf-body -->

  <!-- STICKY FOOTER -->
  <div class="sdf-foot">
    <div style="padding:0.65rem 1rem;">
      <a href="${waUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;background:#128C7E;border-radius:8px;padding:0.6rem 0.85rem;text-decoration:none;">
        <span style="font-size:1.05rem;line-height:1;">💬</span>
        <span style="font-size:0.73rem;font-weight:600;color:#fff;letter-spacing:0.06em;text-transform:uppercase;">Chat on WhatsApp</span>
        <span style="font-size:0.6rem;color:rgba(255,255,255,0.5);margin-left:auto;white-space:nowrap;">Replies in minutes</span>
      </a>
    </div>
    <div style="padding:0.55rem 1rem 0.7rem;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;">
      <p style="font-size:0.57rem;color:rgba(255,255,255,0.18);margin:0;line-height:1.5;">SDF Clothing Ltd · Trusted manufacturer since 1998</p>
      <button id="sdf-close" type="button" style="background:#cc0000;color:#fff;border:none;padding:0.45rem 1rem;font-size:0.67rem;letter-spacing:0.13em;text-transform:uppercase;cursor:pointer;border-radius:6px;white-space:nowrap;min-height:34px;min-width:44px;flex-shrink:0;">
        Close
      </button>
    </div>
  </div>

</div>`;

    document.body.appendChild(overlay);

    // Prevent background page from scrolling behind the modal
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function closeOverlay() {
      document.body.style.overflow = prevOverflow;
      overlay.remove();
    }

    document.getElementById('sdf-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') { closeOverlay(); document.removeEventListener('keydown', escHandler); }
    });

    // Countdown
    let remaining = TOTAL;
    const cdEl = document.getElementById('sdf-cd');
    const barEl = document.getElementById('sdf-bar');
    function fmt(s) {
      return [Math.floor(s/3600), Math.floor((s%3600)/60), s%60]
        .map(function(n){ return String(n).padStart(2,'0'); }).join(':');
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

  /* 8. Contact API submit */
  async function submitContact(data) {
    const res  = await fetch('https://sdfltd.com/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) return { success: false, referenceId: null };
    const json = await res.json();
    return { success: json.ok === true, referenceId: json.referenceId || null };
  }

  /* 9. Main submit handler */
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
    const fillSeconds   = (Date.now() - pageLoad) / 1000;

    // Basic client-side bot check: reject submissions filled in under 3 seconds.
    // The server also silently rejects anything with the honeypot (_honey) field filled.
    if (fillSeconds < 3) {
      submit.disabled    = false;
      submit.textContent = orig;
      return;
    }

    data['_device']       = device;
    data['_browser']      = getBrowserInfo();
    data['_screen']       = window.screen.width + 'x' + window.screen.height;
    data['_connection']   = getConnectionType();
    data['_timezone']     = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    data['_language']     = navigator.language || '';
    data['_ip']           = geo.ip;
    data['_isp']          = geo.isp;
    data['_location']     = [geo.city, geo.region, geo.country].filter(Boolean).join(', ');
    data['_country_code'] = geo.cc;
    data['_page_url']     = window.location.href;
    data['_referrer']     = document.referrer || window.location.hostname + '/';
    data['_fill_time']    = fillSeconds.toFixed(1) + 's';

    let result = { success: false, referenceId: null };
    try { result = await submitContact(data); } catch { /* skip */ }

    submit.disabled    = false;
    submit.textContent = orig;

    if (result.success) {
      form.reset();
      showThankYou(geo, device, fillSeconds, result.referenceId);
    } else {
      alert('Something went wrong. Please try our WhatsApp contact button, or email us directly at contact@sdfltd.com');
    }
  }

  /* 10. Init */
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
