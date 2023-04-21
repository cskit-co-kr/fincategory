import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../lang/en.json'
import ko from '../lang/ko.json'

i18next.use(initReactI18next).use(LanguageDetector).init({
    resources: {
        en: {
            translation: en,
        },
        ko: {
            translation: ko,
        }
    },
    detection: {
        order: ['localStorage'],
        lookupLocalStorage: 'lng',
        caches: ['localStorage'],
    },
    fallbackLng: ["ko", "en"]
})

export default i18next