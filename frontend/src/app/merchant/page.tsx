'use client';

import React from 'react';
import { Store, Save, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSession } from '@/lib/auth';

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
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [stripeStatus, setStripeStatus] = React.useState<any | null>(null);
  const [stripeLoading, setStripeLoading] = React.useState(false);
  const [payAmount, setPayAmount] = React.useState('');
  const [payDescription, setPayDescription] = React.useState('');
  const [checkoutUrl, setCheckoutUrl] = React.useState<string | null>(null);
  const [feePreview, setFeePreview] = React.useState<{ amount: number; fee: number; total: number } | null>(null);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);

  const mapEmbedSrc = (latVal: number, lngVal: number) => {
    const delta = 0.003;
    const left = lngVal - delta;
    const right = lngVal + delta;
    const bottom = latVal - delta;
    const top = latVal + delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latVal}%2C${lngVal}`;
  };

  React.useEffect(() => {
    const session = getSession();
    if (!session || session.role !== 'merchant') {
      window.location.href = '/auth?role=merchant';
      return;
    }
    const stored = session.merchant_id || localStorage.getItem('ola-merchant-id');
    if (stored) {
      setMerchantId(stored);
      localStorage.setItem('ola-merchant-id', stored);
      fetchBusinesses(stored);
      fetchMerchant(stored);
      fetchStripeStatus(stored);
    }
  }, []);

  React.useEffect(() => {
    if (merchantId) {
      localStorage.setItem('ola-mexico-role', 'merchant');
    }
  }, [merchantId]);

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
      const raw = await resp.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {}
      if (!resp.ok) {
        setErrorMsg(data?.message ? `${data.message}${data?.detail ? ` (${data.detail})` : ''}` : 'No se pudo cargar locales');
        return;
      }
      setBusinesses(Array.isArray(data) ? data : []);
    } catch {}
  };

  const fetchMerchant = async (id: string) => {
    try {
      const resp = await fetch(`/api/merchants/${id}`);
      const data = await resp.json();
      if (data?.name) setMerchantName(data.name);
      if (data?.phone) setMerchantPhone(data.phone);
    } catch {}
  };

  const fetchStripeStatus = async (id: string) => {
    try {
      const resp = await fetch(`/api/stripe/connect/status?merchant_id=${id}`);
      const data = await resp.json();
      setStripeStatus(data);
    } catch {}
  };

  const createMerchant = async () => {
    setLoading(true);
    try {
      const session = getSession();
      const payload: any = { name: merchantName, phone: merchantPhone };
      if (session?.id) {
        payload.id = session.id;
        payload.email = session.email;
      }
      const resp = await fetch('/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    setErrorMsg(null);
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
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const raw = await resp.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {}
      if (!resp.ok) {
        setErrorMsg(data?.message ? `${data.message}${data?.detail ? ` (${data.detail})` : ''}` : 'No se pudo guardar');
        return;
      }
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

  const connectStripe = async () => {
    if (!merchantId) return;
    setStripeLoading(true);
    setPaymentError(null);
    try {
      const resp = await fetch('/api/stripe/connect/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: merchantId }),
      });
      const raw = await resp.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {}
      if (!resp.ok) {
        setPaymentError(data?.message ? `${data.message}${data?.detail ? ` (${data.detail})` : ''}` : 'No se pudo conectar Stripe');
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setPaymentError(data?.message || 'No se pudo conectar Stripe');
      }
    } finally {
      setStripeLoading(false);
    }
  };

  const createPaymentLink = async () => {
    if (!merchantId) return;
    setPaymentError(null);
    setStripeLoading(true);
    try {
      const amount = Number(payAmount);
      if (!amount || amount <= 0) {
        setPaymentError('Monto inválido');
        return;
      }
      const idempotencyKey = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
        ? globalThis.crypto.randomUUID()
        : String(Date.now());
      const resp = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchantId,
          amount_mxn: amount,
          description: payDescription || 'Cobro Ola México',
          idempotency_key: idempotencyKey,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setPaymentError(data?.message || 'No se pudo crear el cobro');
        return;
      }
      setCheckoutUrl(data.checkout_url);
      setFeePreview({ amount: data.amount_mxn, fee: data.fee_mxn, total: data.total_mxn });
    } finally {
      setStripeLoading(false);
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
            {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
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
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">{t('search_location')}</label>
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
              {lat !== null && lng !== null && (
                <div className="rounded-2xl border border-gray-200 overflow-hidden">
                  <iframe
                    title="Mapa"
                    src={mapEmbedSrc(lat, lng)}
                    className="w-full h-48"
                    loading="lazy"
                  />
                  <div className="p-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{t('selected_location')}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--primary)] font-bold"
                    >
                      {t('open_in_maps')}
                    </a>
                  </div>
                </div>
              )}
              {lat === null || lng === null ? (
                <p className="text-xs text-gray-500">{t('select_suggestion')}</p>
              ) : null}
              <button
                onClick={saveBusiness}
                disabled={loading || !businessName || !address || lat === null || lng === null}
                className={`w-full ${loading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-transform`}
              >
                {loading ? t('merchant_processing') : 'Guardar local'}
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
            <h2 className="text-xl font-bold">Cobros con tarjeta</h2>
            <p className="text-sm text-gray-500">
              Genera un QR para que el turista pague con Apple Pay, Google Pay o tarjeta.
            </p>
            {stripeStatus?.connected ? (
              <div className="text-xs text-green-600 font-bold">Stripe conectado</div>
            ) : (
              <button
                onClick={connectStripe}
                disabled={stripeLoading}
                className={`w-full ${stripeLoading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-3 rounded-xl`}
              >
                {stripeLoading ? 'Conectando…' : 'Conectar Stripe'}
              </button>
            )}

            {stripeStatus?.connected ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Monto en MXN"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Descripción (opcional)"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    value={payDescription}
                    onChange={(e) => setPayDescription(e.target.value)}
                  />
                </div>

                <button
                  onClick={createPaymentLink}
                  disabled={stripeLoading || !payAmount}
                  className={`w-full ${stripeLoading ? 'opacity-50' : 'bg-black'} text-white font-bold py-3 rounded-xl`}
                >
                  {stripeLoading ? 'Generando…' : 'Generar QR de pago'}
                </button>

                {paymentError ? <p className="text-sm text-red-600">{paymentError}</p> : null}

                {feePreview ? (
                  <div className="text-sm text-gray-600">
                    Monto: <span className="font-bold">${feePreview.amount} MXN</span> · Comisión:
                    <span className="font-bold"> ${feePreview.fee} MXN</span> · Total:
                    <span className="font-bold"> ${feePreview.total} MXN</span>
                  </div>
                ) : null}

                {checkoutUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(checkoutUrl)}`}
                      alt="QR de pago"
                      className="w-64 h-64"
                    />
                    <a
                      href={checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[var(--primary)] font-bold"
                    >
                      Abrir link de pago
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}
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
