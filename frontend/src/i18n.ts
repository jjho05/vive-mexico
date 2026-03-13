import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Ola México",
      "discover": "Discover",
      "swipe": "Swipe",
      "scanner": "Scanner",
      "profile": "Profile"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a Ola México",
      "discover": "Descubrir",
      "swipe": "Deslizar",
      "scanner": "Escáner",
      "profile": "Perfil"
    }
  },
  ko: {
    translation: {
      "welcome": "올라 멕시코에 오신 것을 환영합니다",
      "discover": "발견하다",
      "swipe": "스와이프",
      "scanner": "스캐너",
      "profile": "프로필"
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen bei Ola México",
      "discover": "Entdecken",
      "swipe": "Wischen",
      "scanner": "Scanner",
      "profile": "Profil"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue à Ola México",
      "discover": "Découvrir",
      "swipe": "Balayer",
      "scanner": "Scanner",
      "profile": "Profil"
    }
  },
  ar: {
    translation: {
      "welcome": "مرحبًا بكم في أولا مكسيكو",
      "discover": "اكتشف",
      "swipe": "سحب",
      "scanner": "ماسح ضوئي",
      "profile": "الملف الشخصي"
    }
  },
  pt: {
    translation: {
      "welcome": "Bem-vindo ao Ola México",
      "discover": "Descobrir",
      "swipe": "Deslizar",
      "scanner": "Scanner",
      "profile": "Perfil"
    }
  },
  no: {
    translation: {
      "welcome": "Velkommen til Ola México",
      "discover": "Oppdag",
      "swipe": "Sveip",
      "scanner": "Skanner",
      "profile": "Profil"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ola-mexico-lang',
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
