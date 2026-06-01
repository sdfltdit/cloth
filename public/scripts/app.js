/**
 * SDF Clothing — app.js
 * Optimized: batched DOM reads, passive listeners, idle callbacks
 */

(function () {
  'use strict';

  /* ============================================================
     PERF UTIL — batch DOM reads to prevent forced reflow
  ============================================================ */
  var _pendingReads = [];
  var _pendingWrites = [];
  var _rafScheduled = false;

  function scheduleRaf() {
    if (_rafScheduled) return;
    _rafScheduled = true;
    requestAnimationFrame(function () {
      _rafScheduled = false;
      var reads = _pendingReads.slice();
      _pendingReads = [];
      for (var i = 0; i < reads.length; i++) reads[i]();
      var writes = _pendingWrites.slice();
      _pendingWrites = [];
      for (var j = 0; j < writes.length; j++) writes[j]();
    });
  }

  function batchRead(fn) { _pendingReads.push(fn); scheduleRaf(); }
  function batchWrite(fn) { _pendingWrites.push(fn); scheduleRaf(); }

  /* ============================================================
     2. FOOTER ACCORDION (mobile)
  ============================================================ */
  window.toggleFooter = function (section) {
    var el = document.querySelector('[data-section="' + section + '"]');
    if (!el) return;
    var btn  = el.querySelector('button');
    var list = el.querySelector('.footer-links-list, ul');
    if (!btn || !list) return;

    var isOpen = list.classList.contains('open');

    // Read scrollHeight BEFORE any write — prevents forced reflow
    batchRead(function () {
      var targetHeight = isOpen ? 0 : list.scrollHeight;

      batchWrite(function () {
        document.querySelectorAll('[data-section]').forEach(function (sec) {
          var b = sec.querySelector('button');
          var l = sec.querySelector('.footer-links-list, ul');
          var a = sec.querySelector('.footer-arrow');
          if (l) { l.classList.remove('open'); l.style.maxHeight = '0'; }
          if (b) b.setAttribute('aria-expanded', 'false');
          if (a) a.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          list.classList.add('open');
          list.style.maxHeight = targetHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
          var arrow = btn.querySelector('.footer-arrow');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    });
  };

  function initFooterAccordion() {
    document.querySelectorAll('[data-section]').forEach(function (sec) {
      var btn = sec.querySelector('button');
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
    var buttons = document.querySelectorAll('[id^="faq-question-"]');
    if (!buttons.length) return;

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var answer = document.getElementById('faq-answer-' + i);
        var icon   = document.getElementById('faq-icon-' + i);
        var isOpen = this.getAttribute('aria-expanded') === 'true';

        // Batch: read first, then write
        batchWrite(function () {
          buttons.forEach(function (b, j) {
            b.setAttribute('aria-expanded', 'false');
            var a  = document.getElementById('faq-answer-' + j);
            var ic = document.getElementById('faq-icon-' + j);
            if (a)  { a.classList.remove('open'); a.style.display = 'none'; }
            if (ic) ic.style.transform = 'rotate(0deg)';
          });

          if (!isOpen) {
            btn.setAttribute('aria-expanded', 'true');
            if (answer)  { answer.classList.add('open'); answer.style.display = 'block'; }
            if (icon) icon.style.transform = 'rotate(45deg)';
          }
        });
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      });
    });

    window.toggleFAQ = function (i) {
      var b = document.getElementById('faq-question-' + i);
      if (b) b.click();
    };
  }

  /* ============================================================
     4. SECTION HEADER SCROLL ANIMATIONS
  ============================================================ */
  function initSectionAnimations() {
    var headers = document.querySelectorAll('.section-header');
    if (!headers.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Write only — no read inside observer callback
            batchWrite(function () {
              entry.target.classList.add('visible');
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      headers.forEach(function (h) { obs.observe(h); });
    } else {
      batchWrite(function () {
        headers.forEach(function (h) { h.classList.add('visible'); });
      });
    }
  }

  /* ============================================================
     5. LAZY IMAGE LOADING
  ============================================================ */
  function initLazyImages() {
    var imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            // Write only — src assignment triggers load, not reflow
            batchWrite(function () {
              img.src = img.dataset.src;
              if (img.dataset.srcset) img.srcset = img.dataset.srcset;
              img.removeAttribute('data-src');
            });
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
    var banner = document.getElementById('cookie-consent');
    if (!banner) return;
    try {
      if (localStorage.getItem('cookie-consent')) return;
    } catch (e) {}

    setTimeout(function () {
      batchWrite(function () { banner.style.display = 'block'; });
    }, 1500);

    var accept  = document.getElementById('accept-cookies');
    var decline = document.getElementById('decline-cookies');

    if (accept) accept.addEventListener('click', function () {
      try { localStorage.setItem('cookie-consent', 'accepted'); } catch (e) {}
      batchWrite(function () { banner.style.display = 'none'; });
    });
    if (decline) decline.addEventListener('click', function () {
      try { localStorage.setItem('cookie-consent', 'declined'); } catch (e) {}
      batchWrite(function () { banner.style.display = 'none'; });
    });
  }

  /* ============================================================
     7. SCROLL LISTENER — passive for performance
  ============================================================ */
  function initScrollListeners() {
    var stickyBar = document.getElementById('sticky-bar');
    if (!stickyBar) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        // Read scroll position (cheap, no reflow)
        var scrollY = window.scrollY || window.pageYOffset;
        batchWrite(function () {
          if (scrollY > 600) {
            stickyBar.style.opacity = '1';
            stickyBar.style.transform = 'translateY(0)';
          } else {
            stickyBar.style.opacity = '0';
            stickyBar.style.transform = 'translateY(100%)';
          }
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============================================================
     8. BODY LOADED CLASS
  ============================================================ */
  function initBodyLoaded() {
    requestAnimationFrame(function () {
      document.body.classList.add('loaded');
    });
  }

  /* ============================================================
     INIT — DOMContentLoaded → idle callback for non-critical
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initBodyLoaded();
    initScrollListeners();

    var idle = 'requestIdleCallback' in window ? requestIdleCallback : function (cb) { setTimeout(cb, 1); };
    idle(function () {
      initFooterAccordion();
      initFAQ();
      initSectionAnimations();
      initLazyImages();
      initCookieConsent();
    });
  });

})();
