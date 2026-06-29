      formData.append('screen',      data._screen        || '');
      formData.append('timezone',    data._timezone      || '');
      formData.append('language',    data._language      || '');
      formData.append('connection',  data._connection    || '');
      formData.append('page_url',    data._page_url      || '');
      formData.append('referrer',    data._referrer      || '');
      formData.append('fill_time',   data._fill_time     || '');
      const r = await withTimeout(
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData }),
        8000
      );
      const j = await r.json();
      if (j.success === true) return true;
    } catch {}
    return false;
  }

  function setButtonLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;"></span>';
    } else {
      btn.textContent = 'Send Inquiry';
    }
  }

  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('form-submit-btn');
  if (!form) return;

  const ipSubmissionCount = {};

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!btn) return;

    combinePhone();

    const data = {};
    new FormData(form).forEach(function(v, k) { data[k] = v; });
    data['_replyto'] = data.email || '';
    data['_subject'] = 'New Inquiry — SDF Clothing';

    const fillDuration = ((Date.now() - pageLoadTime) / 1000).toFixed(1);

    if (data._honey) {
      form.reset();
      const geo = await getGeo();
      const referenceId = generateReferenceId(geo.ip);
