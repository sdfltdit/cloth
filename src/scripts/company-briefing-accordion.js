// Company & Briefing Accordions - Specific Script
console.log('Company & Briefing accordion script starting...');

setTimeout(function() {
    console.log('Setting up Company & Briefing accordions...');
    
    // Find Company button
    const companyButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.trim().includes('Company')
    );
    
    // Find Briefing button
    const briefingButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.trim().includes('Briefing')
    );
    
    if (companyButton) {
        console.log('Found Company button');
        
        companyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Company button clicked');
            handleAccordionClick(this, 'Company');
        });
    }
    
    if (briefingButton) {
        console.log('Found Briefing button');
        
        briefingButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Briefing button clicked');
            handleAccordionClick(this, 'Briefing');
        });
    }
    
    function handleAccordionClick(button, sectionName) {
        // Find the parent column
        const column = button.closest('div');
        if (!column) return;
        
        // Find the content (should contain the correct links for this section)
        const content = column.querySelector('ul');
        if (!content) return;
        
        // Check if already expanded
        const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
        
        // Close other accordions first
        closeAllFooterAccordions();
        
        if (isExpanded) {
            // Collapse
            content.style.maxHeight = '0px';
            content.style.overflow = 'hidden';
            content.style.display = 'none';
            const arrow = button.querySelector('svg');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
            console.log(sectionName + ' collapsed');
        } else {
            // Expand
            content.style.display = 'block';
            content.style.overflow = 'hidden';
            
            const height = content.scrollHeight;
            content.style.maxHeight = height + 'px';
            
            setTimeout(() => {
                content.style.overflow = 'visible';
            }, 300);
            
            const arrow = button.querySelector('svg');
            if (arrow) arrow.style.transform = 'rotate(180deg)';
            console.log(sectionName + ' expanded');
        }
    }
    
}, 1400);

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
