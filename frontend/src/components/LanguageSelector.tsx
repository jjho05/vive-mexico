'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
  { code: 'ko', label: '한국어' },
  { code: 'no', label: 'Norsk' },
];

const COUNTRY_TO_LANG: Record<string, string> = {
  MX: 'es',
  ES: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  US: 'en',
  GB: 'en',
  CA: 'en',
  BR: 'pt',
  FR: 'fr',
  DE: 'de',
  KR: 'ko',
  NO: 'no',
  AE: 'ar',
  SA: 'ar',
};

async function detectCountryLang(): Promise<string | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    const country = String(data?.country || '').toUpperCase();
    return COUNTRY_TO_LANG[country] || null;
  } catch {
    return null;
  }
}

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ola-mexico-lang') : null;
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
      setReady(true);
      return;
    }

    detectCountryLang().then((detected) => {
      if (detected && detected !== i18n.language) {
        i18n.changeLanguage(detected);
      }
      setReady(true);
    });
  }, [i18n]);

  if (!ready) return null;

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Idioma</label>
      <select
        className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
        value={i18n.language}
        onChange={(e) => {
          const lang = e.target.value;
          i18n.changeLanguage(lang);
          try {
            localStorage.setItem('ola-mexico-lang', lang);
          } catch {}
        }}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
}
