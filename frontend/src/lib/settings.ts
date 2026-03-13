export type Settings = {
  language: string;
  currency: string;
  advancedEnabled: boolean;
  translateLang?: string;
  country?: string;
};

const DEFAULT_SETTINGS: Settings = {
  language: 'es',
  currency: 'USD',
  advancedEnabled: false,
  translateLang: 'en',
  country: 'MX',
};

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem('ola-mexico-settings');
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem('ola-mexico-settings', JSON.stringify(settings));
  } catch {}
}
