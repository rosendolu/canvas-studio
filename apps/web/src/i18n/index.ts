import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './zh';
import en from './en';

// Initialize i18next
i18n.use(initReactI18next).init({
    resources: {
        zh: zh,
        en: en,
    },
    lng: 'zh', // Default language
    fallbackLng: 'zh',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
