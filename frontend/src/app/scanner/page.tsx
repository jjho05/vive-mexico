'use client';

import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Languages, Coins } from 'lucide-react';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickPhoto = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleScan = async (file: File) => {
    setScanning(true);
    setResult(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/vision/scan-menu", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error(`Scan failed with status ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Scan error:", error);
      setError("No se pudo procesar la imagen. Intenta de nuevo.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
      <header>
        <h1 className="text-2xl font-bold">AI Menu Scanner</h1>
        <p className="text-gray-500">Translate and convert prices in real-time.</p>
      </header>

      <div className="relative aspect-square w-full bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border-4 border-white">
        {!scanning && !result && (
          <button 
            onClick={handlePickPhoto}
            className="flex flex-col items-center gap-4 text-white"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
              <Camera size={40} />
            </div>
            <span className="font-bold text-lg">Tomar Foto del Menú</span>
          </button>
        )}

        {scanning && (
          <div className="flex flex-col items-center gap-4 text-white">
            <RefreshCw size={48} className="animate-spin text-green-500" />
            <span className="font-bold text-lg">Analizando con AI...</span>
          </div>
        )}

        {result && (
          <div className="absolute inset-0 bg-white/95 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl">Menú Traducido</h2>
              <button onClick={() => setResult(null)} className="text-gray-400 transition-colors hover:text-gray-900">
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="flex gap-2 mb-6">
              <div className="flex-1 bg-green-50 p-2 rounded-xl flex items-center gap-2">
                <Languages className="text-green-600" size={18} />
                <span className="text-xs font-bold uppercase text-green-700">
                  {result?.target_lang ? `ES ➜ ${String(result.target_lang).toUpperCase()}` : "Traducción"}
                </span>
              </div>
              <div className="flex-1 bg-blue-50 p-2 rounded-xl flex items-center gap-2">
                <Coins className="text-blue-600" size={18} />
                <span className="text-xs font-bold uppercase text-blue-700">
                  {result?.target_currency ? `MXN ➜ ${String(result.target_currency).toUpperCase()}` : "Conversión"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {(Array.isArray(result.items) ? result.items : []).length === 0 && (
                <div className="text-sm text-gray-500">No se detectaron platillos. Intenta con otra foto.</div>
              )}
              {(Array.isArray(result.items) ? result.items : []).map((item: any, i: number) => (
                <div key={i} className="border-b pb-4 last:border-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.original}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold text-lg text-gray-900">{item.translated}</p>
                    <p className="font-black text-green-600">
                      {item.currency || result?.target_currency || "MXN"} {Number(item.price_target || item.price_mxn || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleScan(file);
          }
        }}
      />

      <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3 italic text-yellow-800 text-sm">
         💡 Tip: Asegúrate de que el texto sea legible y haya buena iluminación.
      </div>
    </div>
  );
}
