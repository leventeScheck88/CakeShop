import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ro from './locales/ro/translation.json';
import en from './locales/en/translation.json';
import hu from './locales/hu/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ro: { translation: ro },
      en: { translation: en },
      hu: { translation: hu },
    },
    fallbackLng: 'ro',
    supportedLngs: ['ro', 'en', 'hu'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'cakestore-lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
