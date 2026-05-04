// Core Web Vitals Monitoring
(function() {
  // Import web-vitals library (you'll need to add this to your package.json)
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
  script.onload = function() {
    // Largest Contentful Paint (LCP)
    webVitals.getLCP(function(metric) {
      console.log('LCP:', metric);
      // Send to analytics
      if (gtag) {
        gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: metric.value,
          custom_parameter_1: metric.id
        });
      }
    });
    
    // First Input Delay (FID)
    webVitals.getFID(function(metric) {
      console.log('FID:', metric);
      if (gtag) {
        gtag('event', 'FID', {
          event_category: 'Web Vitals',
          value: metric.value,
          custom_parameter_1: metric.id
        });
      }
    });
    
    // Cumulative Layout Shift (CLS)
    webVitals.getCLS(function(metric) {
      console.log('CLS:', metric);
      if (gtag) {
        gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: metric.value,
          custom_parameter_1: metric.id
        });
      }
    });
    
    // First Contentful Paint (FCP)
    webVitals.getFCP(function(metric) {
      console.log('FCP:', metric);
      if (gtag) {
        gtag('event', 'FCP', {
          event_category: 'Web Vitals',
          value: metric.value,
          custom_parameter_1: metric.id
        });
      }
    });
    
    // Time to First Byte (TTFB)
    webVitals.getTTFB(function(metric) {
      console.log('TTFB:', metric);
      if (gtag) {
        gtag('event', 'TTFB', {
          event_category: 'Web Vitals',
          value: metric.value,
          custom_parameter_1: metric.id
        });
      }
    });
  };
  document.head.appendChild(script);
})();
