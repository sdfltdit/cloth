/**
 * SDF Clothing — app.js
 * Single unified script: mobile menu · footer accordion · FAQ accordion · section animations · cookie consent
 */

(function () {
  'use strict';

  /* ============================================================
     2. FOOTER ACCORDION (mobile)
  ============================================================ */
  // Called from inline onclick in BaseLayout.astro — also attached via JS below
  window.toggleFooter = function (section) {
    const el = document.querySelector('[data-section="' + section + '"]');
    if (!el) return;
    const btn  = el.querySelector('button');
    const list = el.querySelector('.footer-links-list, ul');
    if (!btn || !list) return;

    const isOpen = list.classList.contains('open');

    // Close all
    document.querySelectorAll('[data-section]').forEach(function (sec) {
      const b = sec.querySelector('button');
      const l = sec.querySelector('.footer-links-list, ul');
      const a = sec.querySelector('.footer-arrow');
      if (l) { l.classList.remove('open'); l.style.maxHeight = '0'; }
      if (b) b.setAttribute('aria-expanded', 'false');
      if (a) a.style.transform = 'rotate(0deg)';
    });

    if (!isOpen) {
      list.classList.add('open');
      list.style.maxHeight = list.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
      const arrow = btn.querySelector('.footer-arrow');
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
  };

  function initFooterAccordion() {
    // Also attach keyboard / accessibility on desktop — graceful no-op on large screens
    document.querySelectorAll('[data-section]').forEach(function (sec) {
      const btn = sec.querySelector('button');
      if (!btn) return;
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  /* ============================================================
     3. FAQ ACCORDION
  ============================================================ */
  function initFAQ() {
    const buttons = document.querySelectorAll('[id^="faq-question-"]');
    if (!buttons.length) return;

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        const answer  = document.getElementById('faq-answer-' + i);
        const icon    = document.getElementById('faq-icon-' + i);
        const isOpen  = this.getAttribute('aria-expanded') === 'true';

        // Close all
        buttons.forEach(function (b, j) {
          b.setAttribute('aria-expanded', 'false');
          const a = document.getElementById('faq-answer-' + j);
          const ic = document.getElementById('faq-icon-' + j);
          if (a)  { a.classList.remove('open'); a.style.display = 'none'; }
          if (ic) ic.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          this.setAttribute('aria-expanded', 'true');
          if (answer)  { answer.classList.add('open'); answer.style.display = 'block'; }
          if (icon) icon.style.transform = 'rotate(45deg)';
        }
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      });
    });

    // Global helper (used by inline onclick fallback)
    window.toggleFAQ = function (i) {
      const b = document.getElementById('faq-question-' + i);
      if (b) b.click();
    };
  }

  /* ============================================================
     4. SECTION HEADER SCROLL ANIMATIONS
  ============================================================ */
  function initSectionAnimations() {
    const headers = document.querySelectorAll('.section-header');
    if (!headers.length) return;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      headers.forEach(function (h) { obs.observe(h); });
    } else {
      headers.forEach(function (h) { h.classList.add('visible'); });
    }
  }

  /* ============================================================
     5. LAZY IMAGE LOADING
  ============================================================ */
  function initLazyImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      imgs.forEach(function (img) { obs.observe(img); });
    } else {
      imgs.forEach(function (img) { img.src = img.dataset.src; });
    }
  }

  /* ============================================================
     6. COOKIE CONSENT
  ============================================================ */
  function initCookieConsent() {
    const banner = document.getElementById('cookie-consent');
    if (!banner) return;
    if (localStorage.getItem('cookie-consent')) return;

    setTimeout(function () { banner.style.display = 'block'; }, 1500);

    const accept  = document.getElementById('accept-cookies');
    const decline = document.getElementById('decline-cookies');

    if (accept) accept.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'accepted');
      banner.style.display = 'none';
    });
    if (decline) decline.addEventListener('click', function () {
      localStorage.setItem('cookie-consent', 'declined');
      banner.style.display = 'none';
    });
  }

  /* ============================================================
     7. FOOTER LIVE COUNTER + COPYRIGHT YEAR
  ============================================================ */
  function initFooterMeta() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const counter = document.getElementById('live-counter');
    if (!counter) return;
    // Fake live visitor count (realistic range for a B2B site)
    const count = Math.floor(Math.random() * 12) + 18;
    counter.textContent = count + ' online';
  }

  /* ============================================================
     8. BODY LOADED CLASS (for animation unlock)
  ============================================================ */
  function initBodyLoaded() {
    requestAnimationFrame(function () {
      document.body.classList.add('loaded');
    });
  }

  /* ============================================================
     INIT — run after DOM ready
  ============================================================ */
  function init() {
    initFooterAccordion();
    initFAQ();
    initSectionAnimations();
    initLazyImages();
    initCookieConsent();
    initFooterMeta();
    initBodyLoaded();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();