'use client';

import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Languages, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScannerPage() {
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickPhoto = () => {
    setError(null);
    cameraInputRef.current?.click();
  };

  const handlePickUpload = () => {
    setError(null);
    uploadInputRef.current?.click();
  };

  const handleScan = async (file: File) => {
    setScanning(true);
    setResult(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      let targetLang = "en";
      let targetCurrency = "USD";
      try {
        const settingsRaw = localStorage.getItem('vive-mexico-settings');
        if (settingsRaw) {
          const settings = JSON.parse(settingsRaw);
          if (settings.translateLang) targetLang = settings.translateLang;
          if (settings.currency) targetCurrency = settings.currency;
        }
      } catch {}

      const response = await fetch(`/api/vision/scan-menu?target_lang=${encodeURIComponent(targetLang)}&target_currency=${encodeURIComponent(targetCurrency)}`, {
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
        <h1 className="text-2xl font-bold">{t('menu_scanner_title')}</h1>
        <p className="text-gray-500">{t('menu_scanner_subtitle')}</p>
      </header>

      <div className="relative aspect-square w-full bg-black rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border-4 border-white">
        {!scanning && !result && (
          <div className="flex flex-col items-center gap-4 text-white">
            <button 
              onClick={handlePickPhoto}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                <Camera size={40} />
              </div>
              <span className="font-bold text-lg">{t('take_photo')}</span>
            </button>
            <button
              onClick={handlePickUpload}
              className="text-sm font-semibold text-white/90 underline underline-offset-4"
            >
              {t('upload_image')}
            </button>
            <span className="text-xs text-white/70">
              {t('upload_hint')}
            </span>
          </div>
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
              <h2 className="font-bold text-xl">{t('menu_translated')}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="text-gray-400 transition-colors hover:text-gray-900"
                  title="Limpiar resultado"
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  onClick={handlePickPhoto}
                  className="text-xs font-semibold text-gray-700 underline underline-offset-4"
                >
                  {t('rescan_camera')}
                </button>
                <button
                  onClick={handlePickUpload}
                  className="text-xs font-semibold text-gray-700 underline underline-offset-4"
                >
                  {t('upload_image_short')}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-green-50 p-2 rounded-xl flex items-center gap-2">
                <Languages className="text-green-600" size={18} />
                <span className="text-xs font-bold uppercase text-green-700">
                  {result?.target_lang ? `${String(result.source_lang || 'ES').toUpperCase()} ➜ ${String(result.target_lang).toUpperCase()}` : "Traducción"}
                </span>
              </div>
              <div className="flex-1 bg-blue-50 p-2 rounded-xl flex items-center gap-2">
                <Coins className="text-blue-600" size={18} />
                <span className="text-xs font-bold uppercase text-blue-700">
                  {result?.target_currency ? `MXN ➜ ${String(result.target_currency).toUpperCase()}` : t('conversion')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <label className="text-xs font-semibold text-gray-600">{t('show_original')}</label>
              <button
                onClick={() => setShowOriginal((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors ${showOriginal ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
                aria-pressed={showOriginal}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${showOriginal ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {(Array.isArray(result.items) ? result.items : []).length === 0 && (
                <div className="text-sm text-gray-500">
                  {t('no_items')}
                  {result?.raw_text ? (
                    <div className="mt-2 text-xs text-gray-400">{t('detected_text')}: {result.raw_text}</div>
                  ) : null}
                </div>
              )}
              {(Array.isArray(result.items) ? result.items : []).map((item: any, i: number) => (
                <div key={`${item.category || 'item'}-${i}`} className="border-b pb-4 last:border-0">
                  {item.category ? (
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{item.category}</p>
                  ) : null}
                  <div className="flex justify-between items-start mt-1 gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-lg text-gray-900">{item.translated || item.original}</p>
                      {showOriginal && item.original ? (
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.original}</p>
                      ) : null}
                    </div>
                    <p className="font-black text-green-600 whitespace-nowrap">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: (item.currency || result?.target_currency || 'MXN'),
                        maximumFractionDigits: 2,
                      }).format(Number(item.price_target || item.price_mxn || 0))}
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
      {result?.error && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-sm">
          Error: {result.error}
        </div>
      )}

      <input
        ref={cameraInputRef}
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
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
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
