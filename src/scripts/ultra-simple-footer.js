// Ultra Simple Footer Accordion - Direct Approach
console.log('Ultra simple footer accordion starting...');

// Wait for DOM and then setup
setTimeout(function() {
    console.log('Setting up footer accordions after delay...');
    
    // Try multiple selectors
    const buttons = document.querySelectorAll('.footer-accordion-btn');
    console.log('Found buttons with .footer-accordion-btn:', buttons.length);
    
    // Also try by text content
    const allButtons = document.querySelectorAll('button');
    const footerButtons = Array.from(allButtons).filter(btn => 
        btn.textContent.includes('Resources') || 
        btn.textContent.includes('Insights') || 
        btn.textContent.includes('Company') || 
        btn.textContent.includes('Briefing')
    );
    console.log('Found buttons by text:', footerButtons.length);
    
    // Setup click handlers for all found buttons
    const allFooterButtons = buttons.length > 0 ? buttons : footerButtons;
    
    allFooterButtons.forEach((button, index) => {
        console.log(`Setting up button ${index}:`, button.textContent.trim());
        
        // Remove any existing handlers
        button.onclick = null;
        
        // Add new click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Button clicked:', this.textContent.trim());
            
            // Find the parent column
            const column = this.closest('div');
            if (!column) return;
            
            // Find the content to toggle (look for ul with max-h-0)
            const content = column.querySelector('.max-h-0');
            if (!content) return;
            
            // Check if already expanded
            const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';
            
            if (isExpanded) {
                // Collapse
                content.style.maxHeight = '0px';
                content.style.overflow = 'hidden';
                const arrow = this.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
                console.log('Collapsed');
            } else {
                // Expand
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.overflow = 'visible';
                const arrow = this.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                console.log('Expanded');
            }
        });
    });
    
    console.log('Footer accordion setup complete');
}, 1000); // 1 second delay
