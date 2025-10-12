import { trackEvent } from "./posthog";

export const trackPageView = (path: string, title?: string): void => {
  trackEvent("$pageview", {
    $current_url: path,
    $title: title,
  });
};

export const trackSignupAttempt = (
  formType: "svelte" | "react",
  email?: string
): void => {
  trackEvent("signup_attempt", {
    form_type: formType,
    has_email: !!email,
  });
};

export const trackSignupSuccess = (formType: "svelte" | "react"): void => {
  trackEvent("signup_success", {
    form_type: formType,
  });
};

export const trackSignupError = (
  formType: "svelte" | "react",
  error: string
): void => {
  trackEvent("signup_error", {
    form_type: formType,
    error_message: error,
  });
};

export const trackLinkClick = (
  url: string,
  linkType: "internal" | "external" | "docs" | "social"
): void => {
  trackEvent("link_click", {
    url,
    link_type: linkType,
  });
};

export const trackLanguageSwitch = (fromLang: string, toLang: string): void => {
  trackEvent("language_switch", {
    from_language: fromLang,
    to_language: toLang,
  });
};

export const trackWaitlistClick = (): void => {
  trackEvent("waitlist_button_click");
};

export const trackScrollDepth = (depth: number, pagePath: string): void => {
  trackEvent("scroll_depth", {
    depth_percentage: depth,
    page: pagePath,
  });
};

export const trackBlogPostView = (
  postId: string,
  title: string,
  author: string,
  tags: string[]
): void => {
  trackEvent("blog_post_view", {
    post_id: postId,
    title,
    author,
    tags,
  });
};

export const trackBlogListView = (page: number): void => {
  trackEvent("blog_list_view", {
    page_number: page,
  });
};

export const trackNewsletterSubscribe = (
  source: "blog_list" | "blog_post"
): void => {
  trackEvent("newsletter_subscribe_attempt", {
    source,
  });
};

export const trackNewsletterSuccess = (
  source: "blog_list" | "blog_post"
): void => {
  trackEvent("newsletter_subscribe_success", {
    source,
  });
};

export const trackNewsletterError = (
  source: "blog_list" | "blog_post",
  error: string
): void => {
  trackEvent("newsletter_subscribe_error", {
    source,
    error_message: error,
  });
};

export const trackBlogLinkClick = (
  postId: string,
  linkText: string,
  fromPage: "list" | "post"
): void => {
  trackEvent("blog_link_click", {
    post_id: postId,
    link_text: linkText,
    from_page: fromPage,
  });
};
