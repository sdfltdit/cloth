    data['_isp']          = geo.isp || '';
    data['_reference_id'] = referenceId;
    data['_screen']       = deviceFingerprint.screen;
    data['_timezone']     = deviceFingerprint.timezone;
    data['_language']     = deviceFingerprint.language;
    data['_connection']   = (function(){const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;if(!c)return 'Unknown';if(c.type==='wifi')return 'WiFi';if(c.type==='cellular')return 'Mobile ('+(c.effectiveType||'').toUpperCase()+')';if(c.effectiveType)return c.effectiveType.toUpperCase();return 'Unknown';})();
    data['_page_url']     = window.location.href;
    data['_referrer']     = document.referrer || window.location.hostname + '/';
    data['_fill_time']    = fillDuration + 's';

    let success = false;
    try { success = await submitToWeb3Forms(data); } catch {}

    setButtonLoading(btn, false);

    if (success) {
      form.reset();
      showThanks(geo, device, fillDuration, referenceId);
    } else {
      btn.disabled = false;
      btn.textContent = 'Send Inquiry';
      alert('Something went wrong. Please email us directly at contact@sdfltd.com');
    }
  });

  // ==================== CALCULATOR SCRIPTS ====================
