/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CONVERTKIT_API_KEY: string;
  readonly CONVERTKIT_FORM_ID: string;
  readonly PUBLIC_POSTHOG_KEY: string;
  readonly PUBLIC_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
