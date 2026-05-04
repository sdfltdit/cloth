// Main Site Scripts - Mobile Menu, Cookies, Footer, Counter, Email Protection
(function() {
  'use strict';

  // === Mobile Menu ===
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function(e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // === Scroll Animation Observer ===
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.section-header').forEach(function(el) {
    observer.observe(el);
  });

  // === Cookie Consent ===
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');
  const consentChoice = localStorage.getItem('sdf_cookie_consent');

  if (!consentChoice && cookieConsent) {
    setTimeout(function() {
      cookieConsent.style.display = 'block';
    }, 1500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      localStorage.setItem('sdf_cookie_consent', 'accepted');
      cookieConsent.style.display = 'none';
    });
    acceptBtn.addEventListener('mouseenter', function() {
      acceptBtn.style.background = '#777';
    });
    acceptBtn.addEventListener('mouseleave', function() {
      acceptBtn.style.background = '#666';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', function() {
      localStorage.setItem('sdf_cookie_consent', 'declined');
      cookieConsent.style.display = 'none';
    });
    declineBtn.addEventListener('mouseenter', function() {
      declineBtn.style.borderColor = '#555';
    });
    declineBtn.addEventListener('mouseleave', function() {
      declineBtn.style.borderColor = '#333';
    });
  }

  // === Live Counter ===
  const founded = new Date(1998, 7, 22);
  function pad(n) { return String(n).padStart(2, '0'); }
  function updateCounter() {
    var now = new Date();
    var diff = now - founded;
    var totalSec = Math.floor(diff / 1000);
    var secs = totalSec % 60;
    var totalMin = Math.floor(totalSec / 60);
    var mins = totalMin % 60;
    var totalHrs = Math.floor(totalMin / 60);
    var hrs = totalHrs % 24;
    var days = Math.floor(totalHrs / 24);
    var years = Math.floor(days / 365.25);
    var remainDays = Math.floor(days % 365.25);
    var el = document.getElementById('live-counter');
    if (el) {
      el.textContent = years + ' yrs · ' + remainDays.toLocaleString() + ' days · ' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
    }
    var cy = document.getElementById('copyright-year');
    if (cy) cy.textContent = now.getFullYear();
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  // === Email Protection ===
  document.querySelectorAll('.email-protected').forEach(function(el) {
    var email = el.dataset.u + '@' + el.dataset.d;
    el.href = 'mailto:' + email;
    el.textContent = email;
  });

  // === Footer Accordion ===
  window.toggleFooter = function(section) {
    var col = document.querySelector('[data-section="' + section + '"]');
    if (!col) return;
    var btn = col.querySelector('button');
    var list = col.querySelector('.footer-links-list');
    if (!btn || !list) return;
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('[data-section]').forEach(function(c) {
      var b = c.querySelector('button');
      var l = c.querySelector('.footer-links-list');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (l) { l.style.maxHeight = '0'; l.style.paddingBottom = '0'; }
      var arrow = c.querySelector('.footer-arrow');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      list.style.maxHeight = list.scrollHeight + 'px';
      list.style.paddingBottom = '1.25rem';
      var arrow = col.querySelector('.footer-arrow');
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
  };

  function setFooterDesktop() {
    document.querySelectorAll('.footer-links-list').forEach(function(l) {
      l.style.maxHeight = 'none';
      l.style.paddingBottom = '0';
      l.style.overflow = 'visible';
    });
    document.querySelectorAll('[data-section] button').forEach(function(b) {
      b.setAttribute('aria-expanded', 'true');
    });
    document.querySelectorAll('.footer-arrow').forEach(function(a) {
      a.style.display = 'none';
    });
  }

  function setFooterMobile() {
    document.querySelectorAll('.footer-links-list').forEach(function(l) {
      l.style.overflow = 'hidden';
      l.style.paddingBottom = '0';
      var btn = l.closest('[data-section]') && l.closest('[data-section]').querySelector('button');
      if (!btn || btn.getAttribute('aria-expanded') !== 'true') {
        l.style.maxHeight = '0';
      }
    });
    document.querySelectorAll('.footer-arrow').forEach(function(a) {
      a.style.display = '';
    });
  }

  function initFooter() {
    if (window.innerWidth >= 768) {
      setFooterDesktop();
    } else {
      setFooterMobile();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      setFooterDesktop();
    } else {
      setFooterMobile();
    }
  });
})();
