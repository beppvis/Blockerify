// YouTube Shorts Blocker - Content Script
// Blocks access to YouTube Shorts pages and redirects to homepage

(function() {
  'use strict';

  // Function to check if current URL is a Shorts page
  function isShortsPage(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.startsWith('/shorts') || urlObj.pathname.startsWith('/shorts/') || urlObj.pathname.includes('shorts');
    } catch (e) {
      return false;
    }
  }

  // Function to redirect to YouTube homepage
  function redirectToHomepage() {
    const currentUrl = window.location.href;
    if (isShortsPage(currentUrl)) {
      window.location.href = 'https://www.youtube.com/';
    }
  }

  // Handle initial page load
  if (isShortsPage(window.location.href)) {
    redirectToHomepage();
  }
  if (document.body.classList.contains('page-shorts')||document.body.classList.contains('shorts-carousel')){
        redirectToHomepage();
  }

  // Monitor URL changes for SPA navigation
  // YouTube uses pushState/replaceState for navigation, so we need to intercept these
  let lastUrl = location.href;

  // Override pushState and replaceState to detect navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    checkAndRedirect();
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    checkAndRedirect();
  };

  // Listen for popstate events (back/forward navigation)
  window.addEventListener('popstate', checkAndRedirect);
  window.addEventListener('yt-navigate-finish', checkAndRedirect);

  // Function to check URL and redirect if needed
  function checkAndRedirect() {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (isShortsPage(currentUrl)) {
        // Use replaceState to avoid adding to history
        history.replaceState(null, '', 'https://www.youtube.com/');
        window.location.href = 'https://www.youtube.com/';
      }
    }
  }

  // Use MutationObserver as a fallback to detect DOM changes that might indicate navigation
  // This helps catch cases where YouTube's navigation isn't caught by pushState
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (isShortsPage(currentUrl)) {
        history.replaceState(null, '', 'https://www.youtube.com/');
        window.location.href = 'https://www.youtube.com/';
      }
    }
  });

  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Periodic check as additional safety measure (for edge cases)
  setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (isShortsPage(currentUrl)) {
        history.replaceState(null, '', 'https://www.youtube.com/');
        window.location.href = 'https://www.youtube.com/';
      }
    }
  }, 500);

})();
