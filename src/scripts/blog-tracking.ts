import {
  trackBlogPostView,
  trackPageView,
  trackScrollDepth,
} from "@/utils/analytics";

// Make tracking functions available globally for inline scripts
declare global {
  interface Window {
    trackPageView: typeof trackPageView;
    trackBlogPostView: typeof trackBlogPostView;
    trackScrollDepth: typeof trackScrollDepth;
  }
}

// Expose tracking functions to window
if (typeof window !== "undefined") {
  window.trackPageView = trackPageView;
  window.trackBlogPostView = trackBlogPostView;
  window.trackScrollDepth = trackScrollDepth;
}
