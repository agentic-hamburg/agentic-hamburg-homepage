import en from "./en.json";

const translations = {
  en,
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof en;

export function getTranslations(lang: Language): TranslationKeys {
  return translations[lang] || translations.en;
}

export function getLangFromUrl(): Language {
  return "en";
}

export function useTranslations() {
  return getTranslations("en");
}
