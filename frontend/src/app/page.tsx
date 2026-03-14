'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Map } from 'lucide-react';
import { getSession } from '@/lib/auth';

export default function Home() {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [role, setRole] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [nearby, setNearby] = React.useState<any[]>([]);
  const [searching, setSearching] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedRole = localStorage.getItem('ola-mexico-role');
      const session = getSession();
      if (session?.role === 'merchant') {
        window.location.href = '/merchant';
        return;
      }
      if (session?.role === 'tourist') {
        setRole('tourist');
      } else if (savedRole === 'tourist') {
        setRole('tourist');
      }
    } catch {}

    const fetchBusinesses = async () => {
      try {
        const response = await fetch("/api/businesses");
        const data = await response.json();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      let lat = null;
      let lng = null;
      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              lat = pos.coords.latitude;
              lng = pos.coords.longitude;
              resolve();
            },
            () => resolve()
          );
        });
      }
      const params = new URLSearchParams({ query: query.trim() });
      if (lat !== null && lng !== null) {
        params.set('lat', String(lat));
        params.set('lng', String(lng));
      }
      const response = await fetch(`/api/businesses/search?${params.toString()}`);
      const data = await response.json();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const loadNearby = async () => {
    try {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const params = new URLSearchParams({
          lat: String(pos.coords.latitude),
          lng: String(pos.coords.longitude),
          radius_km: '3',
        });
        const response = await fetch(`/api/businesses/nearby?${params.toString()}`);
        const data = await response.json();
        setNearby(Array.isArray(data) ? data : []);
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (role === null) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6 text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 pt-4">
            <h2 className="text-4xl font-black italic tracking-tighter">
              OLA <span className="text-[var(--primary)]">MÉXICO</span>
            </h2>
            <p className="text-[var(--secondary)] font-black mt-1 text-xs uppercase tracking-widest">World Cup 2026</p>
            <p className="text-gray-600 font-medium mt-8 text-lg">¿Cómo deseas usar la app hoy?</p>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10 pb-2">
            <button 
              onClick={() => {
                try {
                  localStorage.setItem('ola-mexico-role', 'tourist');
                  const deviceLang = navigator.language?.split('-')[0] || 'en';
                  localStorage.setItem('ola-mexico-lang', deviceLang);
                } catch {}
                window.location.href = '/auth?role=tourist';
              }}
              className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Soy Turista / Visitante
            </button>
            <button 
              onClick={() => {
                try {
                  localStorage.setItem('ola-mexico-role', 'merchant');
                  localStorage.setItem('ola-mexico-lang', 'es');
                } catch {}
                window.location.href = '/auth?role=merchant';
              }}
              className="w-full bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-bold py-4 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
            >
              Soy Comerciante Local
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-black italic tracking-tighter">
            OLA <span className="text-[var(--primary)]">MÉXICO</span>
          </h1>
          <span className="bg-[var(--secondary)] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest rotate-2 shadow-lg">
            2026 WC
          </span>
        </div>
        <p className="text-[var(--muted)] font-medium">Nivela la cancha digital y apoya lo local.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar local por nombre"
            className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-[var(--primary)] text-white font-bold px-4 py-3 rounded-xl"
            >
              Buscar
            </button>
            <button
              onClick={loadNearby}
              className="border-2 border-[var(--primary)] text-[var(--primary)] font-bold px-4 py-3 rounded-xl"
            >
              Cerca de mí
            </button>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t('discover')}</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {loading || searching ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
          ) : (
            businesses.map((biz) => (
              <div key={biz.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 transition-transform active:scale-[0.98]">
                <div className="relative h-48 w-full">
                  <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-black text-[var(--primary)] uppercase tracking-tight shadow-sm">
                    {biz.category}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl tracking-tight">{biz.name}</h3>
                      <p className="text-[var(--muted)] text-sm flex items-center gap-1 mt-1 font-medium">
                        <MapPin size={14} className="text-[var(--primary)]" /> {biz.address}
                        {biz.distance_km ? (
                          <span className="text-xs text-gray-400 ml-2">{biz.distance_km} km</span>
                        ) : null}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-xl">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">{biz.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)]"
                      href={
                        biz.lat && biz.lng
                          ? `https://www.google.com/maps/search/?api=1&query=${biz.lat},${biz.lng}`
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address || biz.name)}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Map size={16} />
                      {t('view_map')}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
