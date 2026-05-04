// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        // Service worker registered successfully
      })
      .catch(function(registrationError) {
        // Service worker registration failed
      });
  });
}
