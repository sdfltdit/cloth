/**
 * SDF Clothing — Contact Form Handler
 * Primary: Web3Forms | Backup: Formcarry
 * Shows device, IP, location on success
 */

(function () {
  'use strict';

  const WEB3_KEY     = '6cdc0c73-5cd1-4d25-a4c8-562a46b623ae';
  const FORMCARRY_URL = 'https://formcarry.com/s/46IEwVrAjO_';

  /* ---- Detect device info (client-side only) ---- */
  function getDeviceInfo() {
    const ua  = navigator.userAgent;
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

  /* ---- Fetch IP + country ---- */
  async function getGeoInfo() {
    try {
      const res  = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
      const data = await res.json();
      return {
        ip:      data.ip      || 'Unknown',
        city:    data.city    || '',
        country: data.country_name || 'Unknown',
      };
    } catch {
      try {
        const res  = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return { ip: data.ip || 'Unknown', city: '', country: 'Unknown' };
      } catch {
        return { ip: 'Unknown', city: '', country: 'Unknown' };
      }
    }
  }

  /* ---- Show thank-you overlay ---- */
  function showThankYou(geo, device, formEl) {
    const now    = new Date();
    const time   = now.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const location = [geo.city, geo.country].filter(Boolean).join(', ');

    const html = `
      <div id="sdf-thankyou" style="
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.96);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;padding:2rem;
        animation:sdfFadeIn 0.4s ease forwards;
      ">
        <div style="
          max-width:480px;width:100%;
          border:1px solid #e00;
          padding:2.5rem 2rem;
          text-align:center;
          animation:sdfSlideUp 0.45s ease forwards;
        ">
          <div style="font-size:2.5rem;margin-bottom:1rem;">✓</div>
          <h2 style="font-size:1.2rem;font-weight:600;letter-spacing:0.08em;margin-bottom:0.5rem;color:#fff;text-transform:uppercase;">
            Message Received
          </h2>
          <p style="font-size:0.82rem;color:#FFFFFF;margin-bottom:2rem;line-height:1.7;">
            Our team will respond within 24 hours.
          </p>
          <div style="border-top:1px solid #e00;padding-top:1.5rem;text-align:left;">
            <p style="font-size:0.72rem;color:#FFFFFF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem;">Session Info</p>
            <div style="display:grid;grid-template-columns:auto 1fr;gap:0.4rem 1rem;font-size:0.8rem;">
              <span style="color:#FFFFFF;">Device</span>
              <span style="color:#fff;">${device}</span>
              <span style="color:#FFFFFF;">Location</span>
              <span style="color:#fff;">${location || 'Unknown'}</span>
              <span style="color:#FFFFFF;">IP</span>
              <span style="color:#fff;">${geo.ip}</span>
              <span style="color:#FFFFFF;">Time</span>
              <span style="color:#fff;">${time}</span>
            </div>
          </div>
          <button onclick="document.getElementById('sdf-thankyou').remove()" style="
            margin-top:2rem;
            background:#e00;color:#fff;
            border:none;padding:0.7rem 2rem;
            font-size:0.75rem;letter-spacing:0.12em;
            text-transform:uppercase;cursor:pointer;
            transition:background 0.2s;
            min-height:44px;
          " onmouseover="this.style.background='#aa0000'" onmouseout="this.style.background='#e00'">
            Close
          </button>
        </div>
      </div>
      <style>
        @keyframes sdfFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes sdfSlideUp { from { opacity:0;transform:translateY(24px) } to { opacity:1;transform:translateY(0) } }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  /* ---- Submit to Web3Forms ---- */
  async function submitWeb3(data) {
    const body = new FormData();
    body.append('access_key', WEB3_KEY);
    Object.entries(data).forEach(([k, v]) => body.append(k, v));

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body,
    });
    const json = await res.json();
    return json.success;
  }

  /* ---- Submit to Formcarry ---- */
  async function submitFormcarry(data) {
    const res = await fetch(FORMCARRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.code === 200 || res.ok;
  }

  /* ---- Handle form submit ---- */
  async function handleSubmit(e) {
    e.preventDefault();
    const form   = e.target;
    const submit = form.querySelector('[type="submit"]');
    if (!submit) return;

    // Disable button
    const orig = submit.textContent;
    submit.disabled    = true;
    submit.textContent = 'Sending…';

    // Collect fields
    const data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    // Get geo + device
    const [geo, device] = await Promise.all([getGeoInfo(), Promise.resolve(getDeviceInfo())]);
    data['_device']   = device;
    data['_location'] = [geo.city, geo.country].filter(Boolean).join(', ');
    data['_ip']       = geo.ip;

    // Submit to both — primary + backup
    let success = false;
    try { success = await submitWeb3(data); }    catch { /* try backup */ }
    if (!success) {
      try { success = await submitFormcarry(data); } catch { /* both failed */ }
    } else {
      // Fire backup silently (no await — don't block UI)
      submitFormcarry(data).catch(() => {});
    }

    submit.disabled    = false;
    submit.textContent = orig;

    if (success) {
      form.reset();
      showThankYou(geo, device, form);
    } else {
      alert('Something went wrong. Please try our WhatsApp contact button.');
    }
  }

  /* ---- Attach to all contact forms ---- */
  function init() {
    document.querySelectorAll('form[data-contact], form.contact-form, #contact-form').forEach(function (form) {
      form.addEventListener('submit', handleSubmit);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
