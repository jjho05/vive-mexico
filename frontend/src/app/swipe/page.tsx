'use client';

import React, { useState } from 'react';
import SwipeCard from '@/components/SwipeCard';
import { AnimatePresence } from 'framer-motion';

const MOCK_DATA = [
  {
    id: 1,
    name: "Tacos El Guero",
    category: "Comida y Bebida",
    description: "Auténticos tacos al pastor con receta de la abuela. No te pierdas la salsa de habanero.",
    image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
    address: "Centro Histórico"
  },
  {
    id: 2,
    name: "Artesanías El Jaguar",
    category: "Artesanías",
    description: "Artesanías únicas de manos indígenas. Barro negro, textiles y alebrijes.",
    image_url: "https://images.unsplash.com/photo-1590076215667-873d3215904a",
    address: "Colonia Juárez"
  },
  {
    id: 3,
    name: "Cantina La Bota",
    category: "Vida Nocturna",
    description: "Cerveza artesanal y chamorros. El mejor ambiente bohemio de la ciudad.",
    image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    address: "Calle San Jerónimo"
  }
];

export default function SwipePage() {
  const [index, setIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    const current = MOCK_DATA[index];
    if (direction === 'right' && current?.category) {
      try {
        const raw = localStorage.getItem('vive-mexico-swipe-categories');
        const data = raw ? JSON.parse(raw) : {};
        data[current.category] = (data[current.category] || 0) + 1;
        localStorage.setItem('vive-mexico-swipe-categories', JSON.stringify(data));
      } catch {}
    }
    console.log(`Swiped ${direction} on ${MOCK_DATA[index].name}`);
    setIndex((prev) => (prev + 1) % MOCK_DATA.length);
  };

  return (
    <div className="relative h-[calc(100vh-180px)] overflow-hidden flex flex-col items-center justify-center">
      <AnimatePresence>
        <SwipeCard 
          key={MOCK_DATA[index].id} 
          business={MOCK_DATA[index]} 
          onSwipe={handleSwipe} 
        />
      </AnimatePresence>
      
      <div className="absolute bottom-4 flex gap-8">
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 active:scale-95 transition-transform">
          <span className="text-2xl font-bold">✕</span>
        </button>
        <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 active:scale-95 transition-transform">
          <span className="text-2xl font-bold">♥</span>
        </button>
      </div>
    </div>
  );
}
