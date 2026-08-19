// Mobile menu toggle - deferred for performance
(function() {
  function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (!toggle || !menu) return;

    if (toggle.dataset.initialized) return;
    toggle.dataset.initialized = 'true';

    let isOpen = false;
    
    function openMenu() {
      isOpen = true;
      menu.style.display = 'flex';
      toggle.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function() {
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
      });
    }
    
    function closeMenu() {
      isOpen = false;
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-8px)';
      toggle.setAttribute('aria-expanded', 'false');
      setTimeout(function() {
        if (!isOpen) menu.style.display = 'none';
      }, 200);
    }
    
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });
    
    document.addEventListener('click', function(e) {
      if (isOpen && !menu.contains(e.target) && e.target !== toggle) {
        closeMenu();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) { closeMenu(); toggle.focus(); }
    });
    
    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() { closeMenu(); });
    });
    
    const closeBtn = document.getElementById('mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() { closeMenu(); });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
  
  document.addEventListener('astro:page-load', initMobileMenu);
})();
