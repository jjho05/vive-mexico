'use client';

import React from 'react';
import { User, Settings, Globe, CreditCard, LogOut, Languages, Store } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { loadSettings, saveSettings } from '@/lib/settings';
import { useTranslation } from 'react-i18next';
import { clearSession, getSession } from '@/lib/auth';

export default function ProfilePage() {
  const [currency, setCurrency] = React.useState('USD');
  const [advancedEnabled, setAdvancedEnabled] = React.useState(false);
  const [translateLang, setTranslateLang] = React.useState('en');
  const [country, setCountry] = React.useState('MX');
  const [touristName, setTouristName] = React.useState('');
  const [touristEmail, setTouristEmail] = React.useState('');
  const [touristAddress, setTouristAddress] = React.useState('');
  const [touristLat, setTouristLat] = React.useState<number | null>(null);
  const [touristLng, setTouristLng] = React.useState<number | null>(null);
  const [touristSuggestions, setTouristSuggestions] = React.useState<any[]>([]);
  const [locationStatus, setLocationStatus] = React.useState<string | null>(null);
  const [touristId, setTouristId] = React.useState<number | null>(null);
  const [role, setRole] = React.useState<string>('tourist');
  const [merchantName, setMerchantName] = React.useState<string | null>(null);
  const [touristDisplayName, setTouristDisplayName] = React.useState<string | null>(null);
  const { t } = useTranslation();

  React.useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = '/auth';
      return;
    }
    const settings = loadSettings();
    setCurrency(settings.currency);
    setAdvancedEnabled(settings.advancedEnabled);
    setTranslateLang(settings.translateLang || 'en');
    setCountry(settings.country || 'MX');
    const storedTourist = localStorage.getItem('ola-tourist-id');
    if (storedTourist) {
      setTouristId(Number(storedTourist));
    }
    setRole(session.role);
    if (session.tourist_id) {
      setTouristId(session.tourist_id);
    }

    if (session.role === 'merchant') {
      const merchantId = session.merchant_id || localStorage.getItem('ola-merchant-id');
      if (merchantId) {
        fetch(`/api/merchants/${merchantId}`)
          .then((r) => r.json())
          .then((data) => {
            if (data?.name) setMerchantName(data.name);
          })
          .catch(() => {});
      }
    }

    if (session.role === 'tourist' && session.tourist_id) {
      fetch(`/api/tourists/${session.tourist_id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.name) setTouristDisplayName(data.name);
        })
        .catch(() => {});
    }
  }, []);

  React.useEffect(() => {
    if (!touristAddress) {
      setTouristSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: touristAddress, format: 'json', limit: '5' });
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          headers: { 'User-Agent': 'ola-mexico/1.0' },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        setTouristSuggestions(data || []);
      } catch {}
    }, 400);
    return () => clearTimeout(handle);
  }, [touristAddress]);

  React.useEffect(() => {
    saveSettings({
      language: localStorage.getItem('ola-mexico-lang') || 'es',
      currency,
      advancedEnabled,
      translateLang,
      country,
    });
  }, [currency, advancedEnabled, translateLang, country]);

  const saveTourist = async (lat?: number, lng?: number) => {
    try {
      const payload = {
        name: touristName || "Turista",
        email: touristEmail || null,
        country,
        preferred_currency: currency,
        lat: lat ?? null,
        lng: lng ?? null,
      };
      const endpoint = touristId ? `/api/tourists/${touristId}` : "/api/tourists/register";
      const method = touristId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("error");
      const data = await response.json();
      const id = data?.data?.[0]?.id;
      if (id) {
        setTouristId(id);
        localStorage.setItem('ola-tourist-id', String(id));
      }
      setLocationStatus("Guardado");
    } catch {
      setLocationStatus("Error");
    }
  };

  const deleteTourist = async () => {
    if (!touristId) return;
    try {
      const response = await fetch(`/api/tourists/${touristId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("error");
      localStorage.removeItem('ola-tourist-id');
      setTouristId(null);
      setLocationStatus("Eliminado");
    } catch {
      setLocationStatus("Error");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ola-mexico-role');
      localStorage.removeItem('ola-merchant-id');
      localStorage.removeItem('ola-tourist-id');
      clearSession();
    } catch (e) {}
    window.location.href = '/';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 h-full pb-20">
      <header className="mb-2 w-full flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">
            {t('profile_title').split(' ')[0]} <span className="text-[var(--primary)]">{t('profile_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-[var(--muted)] font-medium">Gestiona tu experiencia.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-red-500 bg-red-50 p-3 rounded-full hover:bg-red-100 transition-colors"
          title={t('logout')}
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)]">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              {role === 'merchant' ? t('role_merchant') : t('role_tourist')}
            </h2>
            <p className="text-sm font-medium text-[var(--muted)]">
              {role === 'merchant' ? (merchantName || t('role_section')) : (touristDisplayName || t('role_section'))}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 pl-2">{t('preferences')}</h3>

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Globe size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold block text-gray-900">{t('language_primary')}</span>
              <span className="text-xs text-gray-500 font-medium">{t('language_help')}</span>
            </div>
          </div>
          <LanguageSelector />
        </div>

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Languages size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold block text-gray-900">{t('translate_language')}</span>
              <span className="text-xs text-gray-500 font-medium">{t('translate_language_help')}</span>
            </div>
          </div>
          <select
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
            value={translateLang}
            onChange={(e) => setTranslateLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="pt">Português</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ko">한국어</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        {role !== 'merchant' && (
        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <User size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold block text-gray-900">{t('tourist_register_title')}</span>
              <span className="text-xs text-gray-500 font-medium">{t('tourist_register_help')}</span>
            </div>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={touristName}
                onChange={(e) => setTouristName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email (opcional)"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={touristEmail}
                onChange={(e) => setTouristEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={t('search_location')}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={touristAddress}
                onChange={(e) => setTouristAddress(e.target.value)}
              />
              {touristSuggestions.length > 0 && (
                <div className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-56 overflow-auto shadow-lg">
                  {touristSuggestions.map((s: any, idx: number) => (
                    <button
                      key={`${s.display_name}-${idx}`}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setTouristAddress(s.display_name);
                        setTouristLat(Number(s.lat));
                        setTouristLng(Number(s.lon));
                        setTouristSuggestions([]);
                      }}
                    >
                      {s.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {touristLat !== null && touristLng !== null && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <img
                  src={`https://staticmap.openstreetmap.de/staticmap.php?center=${touristLat},${touristLng}&zoom=16&size=600x240&markers=${touristLat},${touristLng},red-pushpin`}
                  alt="Mapa"
                  className="w-full h-40 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{t('selected_location')}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${touristLat},${touristLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--primary)] font-bold"
                  >
                    {t('open_in_maps')}
                  </a>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                className="bg-[var(--primary)] text-white font-bold px-4 py-2 rounded-xl"
                onClick={() => {
                  setLocationStatus("Guardando...");
                  if (touristLat && touristLng) {
                    saveTourist(touristLat, touristLng);
                    return;
                  }
                  if (!navigator.geolocation) {
                    setLocationStatus("Geolocalización no disponible");
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      saveTourist(pos.coords.latitude, pos.coords.longitude);
                    },
                    () => setLocationStatus("No se pudo obtener ubicación")
                  );
                }}
              >
                {t('save_location')}
              </button>
            {touristId ? (
              <button
                className="border border-red-200 text-red-600 font-bold px-4 py-2 rounded-xl"
                onClick={deleteTourist}
              >
                {t('delete_registration')}
              </button>
            ) : null}
            {locationStatus ? (
              <span className="text-xs text-gray-500">{locationStatus}</span>
            ) : null}
          </div>
        </div>
        )}

        {role === 'merchant' && (
          <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Store size={20} />
              </div>
              <div className="text-left">
                <span className="font-bold block text-gray-900">{t('manage_locations')}</span>
                <span className="text-xs text-gray-500 font-medium">{t('merchant_subtitle')}</span>
              </div>
            </div>
            <button
              className="bg-[var(--primary)] text-white font-bold px-4 py-2 rounded-xl"
              onClick={() => window.location.href = '/merchant'}
            >
              {t('manage_locations')}
            </button>
          </div>
        )}

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold block text-gray-900">{t('currency_display')}</span>
              <span className="text-xs text-gray-500 font-medium">{t('currency_help')}</span>
            </div>
          </div>
          <select
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="MXN">MXN ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Globe size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold block text-gray-900">{t('visit_country')}</span>
              <span className="text-xs text-gray-500 font-medium">{t('visit_country_help')}</span>
            </div>
          </div>
          <select
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white"
            value={country}
            onChange={(e) => {
              const value = e.target.value;
              setCountry(value);
              if (value === 'MX') setCurrency('MXN');
              if (value === 'US') setCurrency('USD');
              if (value === 'EU') setCurrency('EUR');
              if (value === 'GB') setCurrency('GBP');
              if (value === 'JP') setCurrency('JPY');
            }}
          >
            <option value="MX">México (MXN)</option>
            <option value="US">Estados Unidos (USD)</option>
            <option value="EU">Unión Europea (EUR)</option>
            <option value="GB">Reino Unido (GBP)</option>
            <option value="JP">Japón (JPY)</option>
          </select>
        </div>

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-xl">
              <Settings size={20} />
            </div>
            <div className="text-left">
              <span className="font-bold block text-gray-900">{t('advanced_settings')}</span>
              <span className="text-xs text-gray-500 font-medium">{t('advanced_help')}</span>
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={advancedEnabled}
              onChange={(e) => setAdvancedEnabled(e.target.checked)}
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[var(--primary)] transition-colors relative">
              <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="mt-8 text-center px-4">
        <p className="text-xs text-gray-400 font-medium">Ola México - Edición Especial Mundial 2026</p>
        <p className="text-xs text-gray-400 font-medium">Versión 1.0.0 (Cloud Build)</p>
      </div>
    </div>
  );
}
