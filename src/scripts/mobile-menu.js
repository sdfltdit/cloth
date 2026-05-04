// Mobile Menu - Separate Clean Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded...');
    
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    console.log('Mobile menu button:', mobileMenuButton);
    console.log('Mobile menu:', mobileMenu);
    
    if (mobileMenuButton && mobileMenu) {
        console.log('Setting up mobile menu functionality...');
        
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Mobile menu button clicked!');
            
            mobileMenu.classList.toggle('hidden');
            
            // Toggle hamburger menu icon
            const icon = this.querySelector('svg');
            if (icon) {
                const isOpen = !mobileMenu.classList.contains('hidden');
                console.log('Menu is now:', isOpen ? 'open' : 'closed');
                
                if (isOpen) {
                    // Change to X icon
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                } else {
                    // Change back to hamburger icon
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('svg');
                if (icon) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            }
        });
        
        // Close menu when clicking on links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                console.log('Menu link clicked, closing menu...');
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('svg');
                if (icon) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            });
        });
        
        console.log('Mobile menu setup complete!');
    } else {
        console.error('Mobile menu elements not found!');
    }
});
