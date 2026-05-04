// Mobile Footer Accordion - Separate Clean Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Footer accordion script loaded...');
    
    // Get all footer accordion buttons
    const accordionButtons = document.querySelectorAll('.footer-accordion-btn');
    console.log('Found footer accordion buttons:', accordionButtons.length);
    
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
});
