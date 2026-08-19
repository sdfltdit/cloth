/**
 * SDF Clothing — a11y-new-window.js
 * Adds a visually-hidden "(opens in a new window)" notice to every
 * target="_blank" link so screen reader and keyboard users are warned
 * before a new tab/window opens. Fixes WCAG 3.2.5 / AAA F22 flagged
 * by accessibility audits across the site.
 */
(function () {
  'use strict';

  function addNewWindowNotice() {
    var links = document.querySelectorAll('a[target="_blank"]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.querySelector('.sr-only-newwindow')) continue;

      var notice = document.createElement('span');
      notice.className = 'sr-only sr-only-newwindow';
      notice.textContent = ' (opens in a new window)';
      link.appendChild(notice);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addNewWindowNotice);
  } else {
    addNewWindowNotice();
  }
})();
