'use client';

import React, { useState } from 'react';
import { Store, Camera, Save, Plus } from 'lucide-react';

export default function MerchantDashboard() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Comida y Bebida');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/merchant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Math.floor(Math.random() * 1000), // Temporal
          name: businessName,
          category: category,
          description: "Nuevo socio registrado durante el Mundial.",
          tags: [category.toLowerCase()],
          image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
          lat: 19.4326,
          lng: -99.1332,
          rating: 5.0,
          address: "Ciudad de México"
        })
      });
      
      const data = await response.json();
      console.log("Registered:", data);
      setStep(3); // Mostramos confirmación
    } catch (error) {
      console.error("Error registering:", error);
      alert("Error al registrar tu negocio. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 max-w-md mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-2xl">
          <Save size={40} />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">¡Bienvenido Socio!</h1>
        <p className="text-[var(--muted)] font-medium px-6">
          Tu negocio ya es parte de la Ola México. Prepárate para recibir turistas de todo el mundo.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-[var(--primary)] text-white font-bold px-8 py-3 rounded-xl"
        >
          Ir al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-24">
      <header className="mb-4">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          Portal <span className="text-[var(--primary)]">Comerciante</span>
        </h1>
        <p className="text-[var(--muted)] font-medium">Prepara tu negocio para el Mundial 2026.</p>
      </header>

      {step === 1 ? (
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-2">
            <Store size={32} />
          </div>
          <h2 className="text-xl font-bold">Registra tu Negocio</h2>
          <p className="text-sm text-[var(--muted)]">Cuéntanos un poco sobre tu local para que los turistas puedan encontrarte.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Nombre del Negocio</label>
              <input 
                type="text" 
                placeholder="Ej. Tacos El Guero"
                className="w-full p-3 rounded-xl border border-gray-200 mt-1 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Categoría</label>
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
            <button 
              onClick={() => handleRegister()}
              disabled={loading || !businessName}
              className={`w-full ${loading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-transform`}
            >
              {loading ? 'Procesando...' : 'Registrar Negocio'}
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--secondary)] rounded-xl flex items-center justify-center text-white">
              <Camera size={20} />
            </div>
            <h2 className="text-xl font-bold">Tu Menú Digital</h2>
          </div>
          
          <p className="text-sm text-[var(--muted)]">Sube una foto de tu menú o lista de precios. Nuestra IA lo traducirá automáticamente para visitantes de todo el mundo.</p>
          
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <Plus size={32} className="text-[var(--primary)]" />
            <span className="text-sm font-bold">Subir foto del menú</span>
          </div>

          <div className="pt-4 space-y-2">
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-bold">Tacos al Pastor</span>
                <span className="text-[var(--primary)] font-bold">$50.00 MXN</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-gray-400 italic">
                <span>+ Agregar platillo manualmente</span>
             </div>
          </div>

          <button className="w-full border-2 border-[var(--primary)] text-[var(--primary)] font-bold py-4 rounded-xl active:scale-95 transition-transform">
            Guardar Cambios
          </button>
        </section>
      )}
    </div>
  );
}
