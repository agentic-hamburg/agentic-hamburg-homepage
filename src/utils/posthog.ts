export interface PostHogConfig {
  api_host: string;
  autocapture?: boolean;
  capture_pageview?: boolean;
  capture_pageleave?: boolean;
  persistence?: "localStorage" | "cookie" | "memory";
}

export const posthogConfig: PostHogConfig = {
  api_host: import.meta.env.PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
  autocapture: true,
  capture_pageview: true,
  capture_pageleave: true,
  persistence: "localStorage",
};

// Define PostHog type on window
declare global {
  interface Window {
    posthog?: {
      capture: (
        eventName: string,
        properties?: Record<string, unknown>
      ) => void;
      identify: (userId: string, properties?: Record<string, unknown>) => void;
      people: {
        set: (properties: Record<string, unknown>) => void;
      };
    };
  }
}

export const isPostHogEnabled = (): boolean => {
  return !!(
    import.meta.env.PUBLIC_POSTHOG_KEY &&
    import.meta.env.PUBLIC_POSTHOG_HOST &&
    typeof window !== "undefined" &&
    window.posthog
  );
};

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>
): void => {
  if (isPostHogEnabled() && window.posthog) {
    try {
      window.posthog.capture(eventName, properties);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("PostHog tracking error:", error);
    }
  }
};

export const identifyUser = (
  userId: string,
  properties?: Record<string, unknown>
): void => {
  if (isPostHogEnabled() && window.posthog) {
    try {
      window.posthog.identify(userId, properties);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("PostHog identify error:", error);
    }
  }
};

export const setUserProperties = (
  properties: Record<string, unknown>
): void => {
  if (isPostHogEnabled() && window.posthog) {
    try {
      window.posthog.people.set(properties);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("PostHog set properties error:", error);
    }
  }
};
