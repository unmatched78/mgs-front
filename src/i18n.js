import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import rw from './locales/rw/translation.json';

i18n
  .use(LanguageDetector)        // auto-detect language
  .use(initReactI18next)        // pass i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: en },
      rw: { translation: rw }
    },
    fallbackLng: 'en',          // use English if detection fails
    debug: false,

    interpolation: {
      escapeValue: false        // React already safe-escapes
    }
  });

export default i18n;
