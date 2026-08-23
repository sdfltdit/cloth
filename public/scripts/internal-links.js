// Internal Linking Enhancement Script
(function() {
  'use strict';

  // Prevent multiple executions - check immediately
  if (window.__internalLinksProcessed || document.querySelector('.internal-link')) {
    return;
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Double-check inside DOMContentLoaded
    if (window.__internalLinksProcessed || document.querySelector('.internal-link')) {
      return;
    }
    window.__internalLinksProcessed = true;
    document.body.setAttribute('data-internal-links-processed', 'true');

    // Add contextual internal links - ONLY in text content, NOT in attributes
    const content = document.querySelector('main, .main-content, article');
    if (!content) return;
  
  // HTML escape function to prevent injection
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Keywords to link mapping
  // 2026-08-22 site prune: removed keywords whose target page no longer
  // exists (garments/apparel/textile-manufacturers, t-shirt/hoodie
  // manufacturer, garments factory — pages deleted in the cleanup) and
  // three that were already pointing at non-existent URLs before the
  // cleanup (sample request, manufacturing cost, production lead time,
  // eu regulations — typo'd/never-built /guides/ paths). Every remaining
  // URL below resolves to a real page.
  const linkMapFull = {
    'clothing manufacturers': '/clothing-manufacturers/',
    'sustainability': '/sustainability/',
    'certifications': '/certifications/',
    'contact': '/contact/',
    'about': '/about/',
    'work process': '/work-process/',
    'moq calculator': '/tools/moq-calculator/',
    'price calculator': '/tools/price-calculator/',
    'lead time calculator': '/tools/lead-time-calculator/',
    'eu compliance': '/tools/eu-readiness-checker/',
    'bangladesh clothing': '/clothing-manufacturers/',
    'private label': '/products/',
    'oem manufacturing': '/products/',
    'ethical manufacturing': '/sustainability/',
    'gots certified': '/certifications/',
    'quality control': '/work-process/',
    'production timeline': '/work-process/',
    'clothing sourcing': '/products/',
    'fashion brands': '/products/',
    'international buyers': '/contact/',
    'bulk orders': '/products/',
    'custom clothing': '/products/'
  };

  // ── Two separate protections (the first one alone is NOT enough — see note) ──
  //
  // 1) True self-link prevention: don't link a page to its own URL.
  //
  // 2) Own-keyword protection: the real cannibalization bug wasn't a page
  //    linking to ITSELF — it was the homepage's own body text containing
  //    "clothing manufacturers" (its own primary target keyword) getting
  //    auto-linked AWAY to /clothing-manufacturers/, a *different* URL.
  //    normalizePath(url) !== currentPath does not catch that case, because
  //    '/' (home) and '/clothing-manufacturers/' are genuinely different
  //    paths. So each cluster page must also declare which exact-match
  //    keyword(s) are its OWN target and have those specific keywords
  //    removed from the map while rendering that page, regardless of which
  //    URL they point to.
  function normalizePath(path) {
    if (!path) return '/';
    return ('/' + path.replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/');
  }

  const OWN_KEYWORDS_BY_PATH = {
    '/': ['clothing manufacturers', 'apparel manufacturers', 'garments manufacturers'],
    '/clothing-manufacturers/': ['clothing manufacturers'],
    '/apparel-manufacturers/': ['apparel manufacturers'],
    '/garments-manufacturers/': ['garments manufacturers'],
    '/fashion-manufacturers/': ['fashion manufacturers']
  };

  const currentPath = normalizePath(window.location.pathname);
  const ownKeywords = new Set(OWN_KEYWORDS_BY_PATH[currentPath] || []);

  const linkMap = Object.fromEntries(
    Object.entries(linkMapFull).filter(([keyword, url]) =>
      normalizePath(url) !== currentPath &&   // (1) never link to self
      !ownKeywords.has(keyword)                // (2) never export this page's own keyword elsewhere
    )
  );

  // Walk through text nodes only - NEVER modify attributes
  function walkTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Check if we're inside a tag that shouldn't be modified
      const parent = node.parentElement;
      if (!parent) return;

      // Skip if inside an anchor tag
      if (parent.tagName === 'A' || parent.closest('a')) {
        return;
      }

      // Skip script and style tags
      if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
        return;
      }

      // Skip if inside any element with data-internal-link attribute (already processed)
      if (parent.closest('[data-internal-link]')) {
        return;
      }
      
      let text = node.nodeValue;
      let modified = false;
      
      // Replace keywords in text content ONLY
      Object.entries(linkMap).forEach(([keyword, url]) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(text)) {
          modified = true;
          text = text.replace(regex, (match) => {
            // Use simple title without the keyword to avoid recursive issues
            return `<a href="${url}" class="internal-link" title="Learn more">${match}</a>`;
          });
        }
      });
      
      // Only modify DOM if text was actually changed
      if (modified) {
        const span = document.createElement('span');
        span.setAttribute('data-internal-link', 'true');
        span.innerHTML = text;
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      // Recursively process child nodes
      const children = Array.from(node.childNodes);
      children.forEach(child => walkTextNodes(child));
    }
  }
  
  // Process content
  walkTextNodes(content);
  
  // Add styles for internal links
  const style = document.createElement('style');
  style.textContent = `
    .internal-link {
      color: #999;
      text-decoration: underline;
      text-decoration-color: rgba(150, 150, 150, 0.3);
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
      transition: all 0.2s ease;
    }
    .internal-link:hover {
      color: #fff;
      text-decoration-color: #fff;
      background: rgba(100, 100, 100, 0.1);
      padding: 0 2px;
      border-radius: 2px;
    }
    .internal-link:focus {
      outline: 2px solid #666;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
  
  // Track internal link clicks
  document.querySelectorAll('.internal-link').forEach(link => {
    link.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'internal_link_click', {
          event_category: 'Navigation',
          event_label: this.href,
          custom_parameter_1: this.textContent
        });
      }
    });
  });
  }); // closes document.addEventListener('DOMContentLoaded', ...) — this was
      // missing in the original file, which made the whole script a syntax
      // error (SyntaxError: Unexpected end of input) that silently failed to
      // load in every browser.
})();
