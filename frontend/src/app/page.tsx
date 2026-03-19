'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Map } from 'lucide-react';
import { getSession } from '@/lib/auth';
import dynamic from 'next/dynamic';

const TouristCityMap = dynamic(() => import('@/components/TouristCityMap'), { ssr: false });

export default function Home() {
  const { t } = useTranslation();
  const [businesses, setBusinesses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [role, setRole] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [nearby, setNearby] = React.useState<any[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [touristLocation, setTouristLocation] = React.useState<[number, number] | null>(null);
  const [poiList, setPoiList] = React.useState<any[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = React.useState<any[]>([]);
  const [mapLoading, setMapLoading] = React.useState(false);
  const [mapError, setMapError] = React.useState<string | null>(null);
  const [likedCategories, setLikedCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const savedRole = localStorage.getItem('vive-mexico-role');
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

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('vive-mexico-swipe-categories');
      if (raw) {
        const data = JSON.parse(raw);
        const top = Object.entries(data)
          .sort((a: any, b: any) => (b[1] as number) - (a[1] as number))
          .map(([key]) => key);
        setLikedCategories(top.slice(0, 3));
      }
    } catch {}
  }, []);

  const loadTouristMapData = async (lat: number, lng: number) => {
    setMapLoading(true);
    setMapError(null);
    try {
      const poiParams = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius_km: '5',
        limit: '12',
      });
      const bizParams = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius_km: '5',
        limit: '12',
      });
      const [poiResp, bizResp] = await Promise.all([
        fetch(`/api/poi/nearby?${poiParams.toString()}`),
        fetch(`/api/businesses/nearby?${bizParams.toString()}`),
      ]);
      const poiData = await poiResp.json();
      const bizData = await bizResp.json();
      setPoiList(Array.isArray(poiData) ? poiData : []);
      setNearbyBusinesses(Array.isArray(bizData) ? bizData : []);
    } catch (e) {
      setMapError(t('tourist_map_error'));
    } finally {
      setMapLoading(false);
    }
  };

  const requestTouristLocation = () => {
    if (!navigator.geolocation) {
      setMapError(t('tourist_map_no_geo'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setTouristLocation([lat, lng]);
        loadTouristMapData(lat, lng);
      },
      () => setMapError(t('tourist_map_error'))
    );
  };

  const bestCategory = React.useMemo(() => {
    if (!nearbyBusinesses.length) return null;
    const counts: Record<string, number> = {};
    nearbyBusinesses.forEach((biz: any) => {
      const cat = biz.category || 'Otros';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [nearbyBusinesses]);

  const routeStops = React.useMemo(() => {
    if (!nearbyBusinesses.length) return [];
    let filtered = nearbyBusinesses;
    if (likedCategories.length) {
      filtered = nearbyBusinesses.filter((b: any) => likedCategories.includes(b.category));
    }
    const list = (filtered.length ? filtered : nearbyBusinesses).slice(0, 4);
    return list;
  }, [nearbyBusinesses, likedCategories]);

  const routePoints = React.useMemo<[number, number][]>(() => {
    if (!touristLocation || routeStops.length === 0) return [];
    return [
      touristLocation,
      ...routeStops
        .map((b: any) => [Number(b.lat), Number(b.lng)] as [number, number])
        .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1])),
    ];
  }, [touristLocation, routeStops]);

  React.useEffect(() => {
    if (role !== 'tourist') return;
    const session = getSession();
    const touristId = session?.tourist_id || localStorage.getItem('vive-mexico-tourist-id');
    if (!touristId) return;
    fetch(`/api/tourists/${touristId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.lat && data?.lng) {
          const lat = Number(data.lat);
          const lng = Number(data.lng);
          setTouristLocation([lat, lng]);
          loadTouristMapData(lat, lng);
        }
      })
      .catch(() => {});
  }, [role]);

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
              VIVE <span className="text-[var(--primary)]">MÉXICO</span>
            </h2>
            <p className="text-[var(--secondary)] font-black mt-1 text-xs uppercase tracking-widest">World Cup 2026</p>
            <p className="text-gray-600 font-medium mt-8 text-lg">¿Cómo deseas usar la app hoy?</p>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10 pb-2">
            <button 
              onClick={() => {
                try {
                  localStorage.setItem('vive-mexico-role', 'tourist');
                  const deviceLang = navigator.language?.split('-')[0] || 'en';
                  localStorage.setItem('vive-mexico-lang', deviceLang);
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
                  localStorage.setItem('vive-mexico-role', 'merchant');
                  localStorage.setItem('vive-mexico-lang', 'es');
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

      {role === 'tourist' && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{t('tourist_map_title')}</h2>
              <p className="text-sm text-[var(--muted)]">{t('tourist_map_help')}</p>
            </div>
            <button
              onClick={requestTouristLocation}
              className="border-2 border-[var(--primary)] text-[var(--primary)] font-bold px-4 py-2 rounded-xl text-sm"
            >
              {t('tourist_map_cta')}
            </button>
          </div>

          {mapError ? <div className="text-sm text-red-600">{mapError}</div> : null}

          {touristLocation ? (
            <TouristCityMap
              center={touristLocation}
              userLocation={touristLocation}
              pois={poiList}
              businesses={nearbyBusinesses}
              route={routePoints}
            />
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 text-sm text-gray-500">
              {t('tourist_map_empty')}
            </div>
          )}

          {mapLoading ? (
            <div className="text-sm text-gray-500">{t('tourist_map_loading')}</div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('tourist_insights')}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>{t('tourist_insight_places')}: <span className="font-bold">{poiList.length}</span></div>
                <div>{t('tourist_insight_locales')}: <span className="font-bold">{nearbyBusinesses.length}</span></div>
                <div>{t('tourist_insight_topcat')}: <span className="font-bold">{bestCategory || t('tourist_insight_none')}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('tourist_route_title')}
              </h3>
              {routeStops.length === 0 ? (
                <div className="text-sm text-gray-500">{t('tourist_route_empty')}</div>
              ) : (
                <div className="space-y-2 text-sm text-gray-700">
                  {routeStops.map((stop: any, idx: number) => (
                    <div key={`route-${stop.id}`} className="flex items-center justify-between">
                      <span>{idx + 1}. {stop.name}</span>
                      <a
                        className="text-xs text-[var(--primary)] font-bold"
                        href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('open_in_maps')}
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {likedCategories.length ? (
                <div className="text-xs text-gray-400 mt-3">
                  {t('tourist_route_based')}: {likedCategories.join(', ')}
                </div>
              ) : null}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('tourist_places')}
              </h3>
              <div className="space-y-3">
                {poiList.length === 0 ? (
                  <div className="text-sm text-gray-500">{t('tourist_places_empty')}</div>
                ) : (
                  poiList.map((poi: any) => (
                    <div key={`poi-${poi.id || poi.title}`} className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">{poi.title}</div>
                      <a
                        className="text-xs text-[var(--primary)] font-bold"
                        href={`https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('open_in_maps')}
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t('tourist_locales')}
              </h3>
              <div className="space-y-3">
                {nearbyBusinesses.length === 0 ? (
                  <div className="text-sm text-gray-500">{t('tourist_locales_empty')}</div>
                ) : (
                  nearbyBusinesses.map((biz: any) => (
                    <div key={`biz-${biz.id}`} className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{biz.name}</div>
                        {biz.distance_km ? (
                          <div className="text-xs text-gray-400">{biz.distance_km} km</div>
                        ) : null}
                      </div>
                      <a
                        className="text-xs text-[var(--primary)] font-bold"
                        href={`https://www.google.com/maps/search/?api=1&query=${biz.lat},${biz.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('open_in_maps')}
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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
