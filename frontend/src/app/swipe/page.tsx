'use client';

import React, { useState, useEffect } from 'react';
import SwipeCard from '@/components/SwipeCard';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function SwipePage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let params = '';
        try {
          const raw = localStorage.getItem('vive-mexico-swipe-categories');
          if (raw) {
            const data = JSON.parse(raw);
            // sort categories by count desc, take top 2
            const sorted = Object.entries(data).sort((a: any, b: any) => b[1] - a[1]);
            const top = sorted.slice(0, 2).map((x) => x[0]).join(',');
            if (top) {
              params = `?interests=${encodeURIComponent(top)}`;
            }
          }
        } catch {}

        const res = await fetch(`/api/recommendations${params}`);
        if (!res.ok) throw new Error('Failed to load recommendations');
        const data = await res.json();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        toast.error('No se pudieron cargar los locales de Swipe.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    const current = businesses[index];
    if (direction === 'right' && current?.category) {
      try {
        const raw = localStorage.getItem('vive-mexico-swipe-categories');
        const data = raw ? JSON.parse(raw) : {};
        data[current.category] = (data[current.category] || 0) + 1;
        // Optionally store tags as well or just category
        localStorage.setItem('vive-mexico-swipe-categories', JSON.stringify(data));

        const rawFavs = localStorage.getItem('vive-mexico-favorites');
        const favs = rawFavs ? JSON.parse(rawFavs) : [];
        if (!favs.some((f: any) => f.id === current.id)) {
          favs.push(current);
          localStorage.setItem('vive-mexico-favorites', JSON.stringify(favs));
        }
      } catch {}
    }
    setIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="relative h-[calc(100vh-180px)] overflow-hidden flex flex-col items-center justify-center">
        <div className="w-[300px] h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100 animate-pulse flex flex-col">
          <div className="h-full w-full bg-gray-200 rounded-t-3xl" />
          <div className="p-4 space-y-2 h-32">
            <div className="h-6 bg-gray-200 rounded-md w-3/4" />
            <div className="h-4 bg-gray-200 rounded-md w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (businesses.length === 0 || index >= businesses.length) {
    return (
      <div className="relative h-[calc(100vh-180px)] overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-gray-100">
          <div className="text-4xl mb-4 text-[var(--primary)]">🎉</div>
          <h2 className="text-xl font-black italic tracking-tighter mb-2">¡LO HAS VISTO TODO!</h2>
          <p className="text-gray-500 text-sm">
            No hay más locales nuevos por hoy en tu zona basados en tus gustos.
          </p>
          <button 
            className="mt-6 bg-[var(--primary)] text-white font-bold py-3 px-6 rounded-xl w-full active:scale-95 transition-transform"
            onClick={() => { setIndex(0); window.location.href = '/'; }}
          >
            Volver al Mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-180px)] overflow-hidden flex flex-col items-center justify-center">
      <AnimatePresence>
        <SwipeCard 
          key={businesses[index].id || index} 
          business={businesses[index]} 
          onSwipe={handleSwipe} 
        />
      </AnimatePresence>
      
      <div className="absolute bottom-4 flex gap-8 z-10">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 active:scale-90 transition-transform hover:bg-red-50"
        >
          <span className="text-2xl font-bold">✕</span>
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 active:scale-90 transition-transform hover:bg-green-50"
        >
          <span className="text-2xl font-bold">♥</span>
        </button>
      </div>
    </div>
  );
}
