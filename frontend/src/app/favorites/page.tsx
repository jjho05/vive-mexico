'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Map, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vive-mexico-favorites');
      if (raw) {
        setFavorites(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const removeFavorite = (id: number) => {
    const newFavs = favorites.filter((f) => f.id !== id);
    setFavorites(newFavs);
    localStorage.setItem('vive-mexico-favorites', JSON.stringify(newFavs));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
      <header>
        <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-2">
          MIS <span className="text-[var(--primary)]">FAVORITOS</span>
          <Heart className="text-[var(--primary)]" fill="currentColor" size={28} />
        </h1>
        <p className="text-[var(--muted)] font-medium mt-1">
          Tus lugares guardados desde Swipe para tu próximo recorrido.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm mt-8">
          <div className="text-4xl mb-4 text-gray-300">💔</div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">Aún no tienes favoritos</h2>
          <p className="text-gray-500 text-sm">
            Ve a la sección de Swipe y dale "Corazón" a los lugares que te gustaría visitar.
          </p>
          <a href="/swipe" className="mt-6 inline-block bg-[var(--primary)] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity">
            Ir a Descubrir
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((biz) => (
            <div key={biz.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col relative group transition-transform hover:-translate-y-1">
              <button 
                onClick={() => removeFavorite(biz.id)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:scale-110 hover:bg-red-50 transition-all shadow-md"
                aria-label="Quitar de favoritos"
              >
                ✕
              </button>
              <div className="relative h-48 w-full">
                <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl text-xs font-black text-[var(--primary)] uppercase tracking-tight shadow-sm">
                  {biz.category}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-xl tracking-tight pr-8">{biz.name}</h3>
                    <div className="flex items-center gap-1 bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-xl shrink-0">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">{biz.rating}</span>
                    </div>
                  </div>
                  <p className="text-[var(--muted)] text-sm flex items-start gap-1 mt-2 font-medium">
                    <MapPin size={16} className="text-[var(--primary)] shrink-0 mt-0.5" /> 
                    <span className="line-clamp-2">{biz.address}</span>
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    className="flex justify-center items-center gap-2 text-sm font-bold bg-gray-50 text-gray-700 py-3 rounded-xl hover:bg-gray-100 active:scale-95 transition-all w-full"
                    href={biz.lat && biz.lng ? `https://www.google.com/maps/search/?api=1&query=${biz.lat},${biz.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address || biz.name)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Map size={16} className="text-[var(--primary)]" />
                    Abrir en Mapa
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
