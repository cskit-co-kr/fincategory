import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { enUS } from '../lang/en-US.js';
import { koKR } from '../lang/ko-KR.js';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: enUS,
      },
      ko: {
        translation: koKR,
      },
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'lng',
      caches: ['localStorage'],
    },
    fallbackLng: ['ko', 'en'],
  });

export default i18next;
