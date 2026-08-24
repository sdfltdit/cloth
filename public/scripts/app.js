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

    var isOpen = list.classList.contains('expanded');

    document.querySelectorAll('[data-section]').forEach(function (sec) {
      var b = sec.querySelector('button');
      var l = sec.querySelector('.footer-links-list, ul');
      var a = sec.querySelector('.footer-arrow');
      if (l) { l.classList.remove('expanded'); }
      if (b) b.setAttribute('aria-expanded', 'false');
      if (a) a.classList.remove('rotated');
    });

    if (!isOpen) {
      list.classList.add('expanded');
      btn.setAttribute('aria-expanded', 'true');
      var arrow = btn.querySelector('.footer-arrow');
      if (arrow) arrow.classList.add('rotated');
    }
  };

  function initFooterAccordion() {
    document.querySelectorAll('[data-section]').forEach(function (sec) {
      var btn = sec.querySelector('button');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var sectionName = sec.getAttribute('data-section');
        if (sectionName) window.toggleFooter(sectionName);
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  /* ============================================================
     3. SECTION HEADER SCROLL ANIMATIONS
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
     4. LAZY IMAGE LOADING
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
     5. COOKIE CONSENT
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
     6. SCROLL LISTENER — passive for performance
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
     7. BODY LOADED CLASS
  ============================================================ */
  function initBodyLoaded() {
    requestAnimationFrame(function () {
      document.body.classList.add('loaded');
    });
  }

  /* ============================================================
     INIT — DOMContentLoaded → staggered idle work (avoids one
     long task by spreading non-critical init across separate
     idle/timeout slices instead of batching them together)
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initBodyLoaded();
    initScrollListeners();

    var idle = 'requestIdleCallback' in window
      ? requestIdleCallback
      : function (cb, opts) { setTimeout(cb, opts && opts.timeout ? Math.min(opts.timeout, 50) : 50); };

    // Each init runs in its own idle slice so the browser can yield
    // back to the main thread between them instead of running all
    // four in a single uninterrupted block.
    idle(function () { initFooterAccordion(); }, { timeout: 200 });
    idle(function () { initCookieConsent(); }, { timeout: 300 });
    idle(function () { initSectionAnimations(); }, { timeout: 500 });
    idle(function () { initLazyImages(); }, { timeout: 600 });
  });

})();
