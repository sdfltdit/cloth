// Insights Accordion - Specific Script
console.log('Insights accordion script starting...');

setTimeout(function() {
    console.log('Setting up Insights accordion...');
    
    // Find Insights button specifically
    const insightsButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.trim().includes('Insights')
    );
    
    if (insightsButton) {
        console.log('Found Insights button');
        
        insightsButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Insights button clicked');
            
            // Find the parent column
            const column = this.closest('div');
            if (!column) return;
            
            // Find the Insights content (should contain manufacturing costs, lead times, regulations)
            const content = column.querySelector('ul');
            if (!content) return;
            
            // Check if already expanded
            const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
            
            // Close other accordions first
            closeAllFooterAccordions();
            
            if (isExpanded) {
                // Collapse Insights
                content.style.maxHeight = '0px';
                content.style.overflow = 'hidden';
                content.style.display = 'none';
                const arrow = this.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
                console.log('Insights collapsed');
            } else {
                // Expand Insights
                content.style.display = 'block';
                content.style.overflow = 'hidden';
                
                const height = content.scrollHeight;
                content.style.maxHeight = height + 'px';
                
                setTimeout(() => {
                    content.style.overflow = 'visible';
                }, 300);
                
                const arrow = this.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
                console.log('Insights expanded');
            }
        });
    } else {
        console.error('Insights button not found');
    }
}, 1200);

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
