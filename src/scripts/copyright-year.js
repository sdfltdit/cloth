// Dynamic copyright year - deferred for performance
(function() {
  const copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    copyrightEl.textContent = new Date().getFullYear();
  }
})();
