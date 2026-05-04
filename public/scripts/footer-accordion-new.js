// Simple Footer Accordion - Working Version
console.log('Footer accordion script starting...');

// Wait for DOM to be ready
function initFooterAccordion() {
    console.log('Initializing footer accordion...');
    
    // Get all footer accordion buttons
    const accordionButtons = document.querySelectorAll('.footer-accordion-btn');
    console.log('Found accordion buttons:', accordionButtons.length);
    
    if (accordionButtons.length === 0) {
        console.error('No accordion buttons found with class .footer-accordion-btn');
        return;
    }
    
    accordionButtons.forEach((button, index) => {
        console.log(`Setting up footer button ${index}:`, button.textContent.trim());
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Footer accordion clicked:', this.textContent.trim());
            
            const parent = this.parentElement;
            const isExpanded = parent.classList.contains('expanded');
            
            // Toggle expanded class
            parent.classList.toggle('expanded');
            
            // Find content to toggle
            const content = parent.querySelector('.max-h-0');
            if (content) {
                if (isExpanded) {
                    // Collapse
                    content.style.maxHeight = '0';
                    content.style.overflow = 'hidden';
                    console.log('Footer section collapsed');
                } else {
                    // Expand
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.overflow = 'visible';
                    console.log('Footer section expanded');
                    
                    // Close other accordions
                    accordionButtons.forEach(otherButton => {
                        if (otherButton !== this) {
                            const otherParent = otherButton.parentElement;
                            const otherContent = otherParent.querySelector('.max-h-0');
                            if (otherContent) {
                                otherParent.classList.remove('expanded');
                                otherContent.style.maxHeight = '0';
                                otherContent.style.overflow = 'hidden';
                            }
                            const otherArrow = otherButton.querySelector('svg');
                            if (otherArrow) {
                                otherArrow.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                }
            }
            
            // Rotate arrow
            const arrow = this.querySelector('svg');
            if (arrow) {
                arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });
    
    console.log('Footer accordion setup complete');
}

// Initialize immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterAccordion);
} else {
    initFooterAccordion();
}
