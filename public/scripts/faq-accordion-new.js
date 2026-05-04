// Simple FAQ Accordion - Working Version
console.log('FAQ accordion script starting...');

// Wait for DOM to be ready
function initFAQAccordion() {
    console.log('Initializing FAQ accordion...');
    
    // Get all FAQ buttons
    const faqButtons = document.querySelectorAll('[id^="faq-question-"]');
    console.log('Found FAQ buttons:', faqButtons.length);
    
    if (faqButtons.length === 0) {
        console.error('No FAQ buttons found with id^="faq-question-"');
        return;
    }
    
    faqButtons.forEach((button, index) => {
        console.log(`Setting up FAQ ${index}`);
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log(`FAQ ${index} clicked`);
            
            const answer = document.getElementById(`faq-answer-${index}`);
            const icon = document.getElementById(`faq-icon-${index}`);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs
            faqButtons.forEach((otherBtn, i) => {
                if (i !== index) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    const otherAnswer = document.getElementById(`faq-answer-${i}`);
                    const otherIcon = document.getElementById(`faq-icon-${i}`);
                    
                    if (otherAnswer) {
                        otherAnswer.classList.add('hidden');
                        otherAnswer.style.display = 'none';
                    }
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current FAQ
            if (isExpanded) {
                // Close
                this.setAttribute('aria-expanded', 'false');
                if (answer) {
                    answer.classList.add('hidden');
                    answer.style.display = 'none';
                }
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
                console.log(`FAQ ${index} closed`);
            } else {
                // Open
                this.setAttribute('aria-expanded', 'true');
                if (answer) {
                    answer.classList.remove('hidden');
                    answer.style.display = 'block';
                }
                if (icon) {
                    icon.style.transform = 'rotate(45deg)';
                }
                console.log(`FAQ ${index} opened`);
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.click();
                    break;
            }
        });
    });
    
    console.log('FAQ accordion setup complete');
}

// Global backup function
window.toggleFAQ = function(index) {
    console.log('Global toggleFAQ called with index:', index);
    const button = document.getElementById(`faq-question-${index}`);
    if (button) {
        button.click();
    } else {
        console.error('FAQ button not found for index:', index);
    }
};

// Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQAccordion);
} else {
    initFAQAccordion();
}
