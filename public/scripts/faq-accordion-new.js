(function() {
  'use strict';
  
  function initFAQ() {
    const buttons = document.querySelectorAll('[id^="faq-question-"]');
    
    // Silent exit if no FAQ on this page
    if (buttons.length === 0) {
      return;
    }
    
    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        const answerId = this.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        
        // Close all other FAQ items
        buttons.forEach(function(otherButton) {
          if (otherButton !== button) {
            otherButton.setAttribute('aria-expanded', 'false');
            const otherAnswerId = otherButton.getAttribute('aria-controls');
            const otherAnswer = document.getElementById(otherAnswerId);
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0';
              otherAnswer.setAttribute('aria-hidden', 'true');
            }
          }
        });
        
        // Toggle current FAQ
        this.setAttribute('aria-expanded', String(!expanded));
        if (answer) {
          if (expanded) {
            answer.style.maxHeight = '0';
            answer.setAttribute('aria-hidden', 'true');
          } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.setAttribute('aria-hidden', 'false');
          }
        }
      });
    });
  }
  
  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
