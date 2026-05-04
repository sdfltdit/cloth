// Image SEO Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
  // Add structured data for images
  const images = document.querySelectorAll('img[src*=".webp"], img[src*=".jpg"], img[src*=".png"]');
  
  images.forEach((img, index) => {
    // Add loading optimization
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding optimization
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
    
    // Add error handling
    img.addEventListener('error', function() {
      this.style.display = 'none';
      console.log('Image failed to load:', this.src);
    });
    
    // Add load success tracking
    img.addEventListener('load', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'image_load', {
          event_category: 'Images',
          event_label: this.src,
          custom_parameter_1: index
        });
      }
    });
  });
  
  // Add image schema to homepage
  if (window.location.pathname === '/') {
    const imageSchema = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": "SDF Clothing Manufacturing Facility",
      "description": "Modern clothing manufacturing facility in Bangladesh with advanced equipment and skilled workforce",
      "url": "https://sdfltd.com/factory.webp",
      "width": "1200",
      "height": "800",
      "thumbnailUrl": "https://sdfltd.com/factory.webp",
      "author": {
        "@type": "Organization",
        "name": "SDF Clothing"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SDF Clothing",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sdfltd.com/logo.webp",
          "width": 256,
          "height": 256
        }
      },
      "license": "https://creativecommons.org/licenses/by/4.0/"
    };
    
    // Add schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(imageSchema);
    document.head.appendChild(script);
  }
});
