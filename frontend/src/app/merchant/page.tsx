'use client';

import React from 'react';
import { Store, Save, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function MerchantDashboard() {
  const { t } = useTranslation();
  const [merchantId, setMerchantId] = React.useState<string | null>(null);
  const [merchantName, setMerchantName] = React.useState('');
  const [merchantPhone, setMerchantPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [businessId, setBusinessId] = React.useState<number | null>(null);
  const [businessName, setBusinessName] = React.useState('');
  const [category, setCategory] = React.useState('Comida y Bebida');
  const [address, setAddress] = React.useState('');
  const [lat, setLat] = React.useState<number | null>(null);
  const [lng, setLng] = React.useState<number | null>(null);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [businesses, setBusinesses] = React.useState<any[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('ola-merchant-id');
    if (stored) {
      setMerchantId(stored);
      fetchBusinesses(stored);
    }
  }, []);

  React.useEffect(() => {
    if (!address) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: address, format: 'json', limit: '5' });
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          headers: { 'User-Agent': 'ola-mexico/1.0' },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        setSuggestions(data || []);
      } catch {}
    }, 400);
    return () => clearTimeout(handle);
  }, [address]);

  const fetchBusinesses = async (id: string) => {
    try {
      const resp = await fetch(`/api/merchants/${id}/businesses`);
      const data = await resp.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch {}
  };

  const createMerchant = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: merchantName, phone: merchantPhone }),
      });
      const data = await resp.json();
      const id = data?.data?.[0]?.id || data?.merchant?.id;
      if (id) {
        localStorage.setItem('ola-merchant-id', id);
        setMerchantId(id);
        fetchBusinesses(id);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveBusiness = async () => {
    if (!merchantId) return;
    setLoading(true);
    try {
      const payload = {
        name: businessName,
        category,
        description: 'Local registrado en Ola México.',
        tags: [category.toLowerCase()],
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        lat,
        lng,
        rating: 5.0,
        address,
      };
      const url = businessId
        ? `/api/merchants/${merchantId}/businesses/${businessId}`
        : `/api/merchants/${merchantId}/businesses`;
      const method = businessId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setBusinessId(null);
      setBusinessName('');
      setCategory('Comida y Bebida');
      setAddress('');
      setLat(null);
      setLng(null);
      setSuggestions([]);
      fetchBusinesses(merchantId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-24">
      <header className="mb-4">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          {t('merchant_portal').split(' ')[0]} <span className="text-[var(--primary)]">{t('merchant_portal').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-[var(--muted)] font-medium">{t('merchant_subtitle')}</p>
      </header>

      {!merchantId ? (
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-2">
            <Store size={32} />
          </div>
          <h2 className="text-xl font-bold">Perfil de comerciante</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Nombre</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Teléfono</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={merchantPhone}
                onChange={(e) => setMerchantPhone(e.target.value)}
              />
            </div>
            <button
              onClick={createMerchant}
              disabled={loading || !merchantName}
              className={`w-full ${loading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-transform`}
            >
              {loading ? t('merchant_processing') : 'Crear perfil'}
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <h2 className="text-xl font-bold">Agregar / editar local</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{t('merchant_business_name')}</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{t('merchant_category')}</label>
                <select
                  className="w-full p-3 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Comida y Bebida</option>
                  <option>Artesanías</option>
                  <option>Servicios</option>
                  <option>Alojamiento</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Dirección</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-20 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-56 overflow-auto shadow-lg">
                    {suggestions.map((s, idx) => (
                      <button
                        key={`${s.display_name}-${idx}`}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        onClick={() => {
                          setAddress(s.display_name);
                          setLat(Number(s.lat));
                          setLng(Number(s.lon));
                          setSuggestions([]);
                        }}
                      >
                        {s.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={saveBusiness}
                disabled={loading || !businessName || !address}
                className={`w-full ${loading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-transform`}
              >
                {loading ? t('merchant_processing') : 'Guardar local'}
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <h2 className="text-xl font-bold">Mis locales</h2>
            {businesses.length === 0 ? (
              <div className="text-sm text-gray-500">{t('menu_empty')}</div>
            ) : (
              <div className="space-y-3">
                {businesses.map((biz) => (
                  <div key={biz.id} className="border rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{biz.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {biz.address}
                      </p>
                    </div>
                    <button
                      className="text-sm text-[var(--primary)] font-bold"
                      onClick={() => {
                        setBusinessId(biz.id);
                        setBusinessName(biz.name || '');
                        setCategory(biz.category || 'Comida y Bebida');
                        setAddress(biz.address || '');
                        setLat(biz.lat || null);
                        setLng(biz.lng || null);
                      }}
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
