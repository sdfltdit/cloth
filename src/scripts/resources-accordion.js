// Resources Accordion - Specific Script
console.log('Resources accordion script starting...');

setTimeout(function() {
    console.log('Setting up Resources accordion...');
    
    // Find Resources button specifically
    const resourcesButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.trim().includes('Resources')
    );
    
    if (resourcesButton) {
        console.log('Found Resources button');
        
        resourcesButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Resources button clicked');
            
            // Find the parent column
            const column = this.closest('div');
            if (!column) return;
            
            // Find the Resources content (should contain calculator links)
            const content = column.querySelector('ul');
            if (!content) return;
            
            // Check if already expanded
            const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
            
            // Close other accordions first
            closeAllFooterAccordions();
            
            if (isExpanded) {
                // Collapse Resources
                content.style.maxHeight = '0px';
                content.style.overflow = 'hidden';
                content.style.display = 'none';
                const arrow = this.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
                console.log('Resources collapsed');
            } else {
                // Expand Resources
                content.style.display = 'block';
                content.style.overflow = 'hidden';
                
                const height = content.scrollHeight;
                content.style.maxHeight = height + 'px';
                
                setTimeout(() => {
                    content.style.overflow = 'visible';
                }, 300);
                
                const arrow = this.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                console.log('Resources expanded');
            }
        });
    } else {
        console.error('Resources button not found');
    }
}, 1000);

function closeAllFooterAccordions() {
    const allFooterButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Resources') || 
        btn.textContent.includes('Insights') || 
        btn.textContent.includes('Company') || 
        btn.textContent.includes('Briefing')
    );
    
    allFooterButtons.forEach(button => {
        const column = button.closest('div');
        const content = column.querySelector('ul');
        if (content) {
            content.style.maxHeight = '0px';
            content.style.overflow = 'hidden';
            content.style.display = 'none';
        }
        const arrow = button.querySelector('svg');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    });
}
