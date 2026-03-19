'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { setSession } from '@/lib/auth';
import { toast } from 'sonner';

const BUILD_SHA = 'auth-v3';

export default function AuthClient() {
  const params = useSearchParams();
  const { t } = useTranslation();
  const [role, setRole] = React.useState<'merchant' | 'tourist'>('tourist');
  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const qRole = params.get('role');
    if (qRole === 'merchant' || qRole === 'tourist') {
      setRole(qRole);
    } else {
      const stored = localStorage.getItem('vive-mexico-role');
      if (stored === 'merchant' || stored === 'tourist') setRole(stored);
    }
  }, [params]);

  const submit = async () => {
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload: any = { email, password, role };
      if (mode === 'register') {
        payload.name = name || null;
        payload.phone = role === 'merchant' ? phone || null : null;
      }
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const raw = await resp.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }
      if (!resp.ok) {
        const detail = data?.detail ? ` (${data.detail})` : raw ? ` (${raw})` : '';
        toast.error(`${data?.message || t('auth_error')} [${resp.status}]${detail}`);
        return;
      }
      const account = data?.account;
      if (account?.id) {
        setSession({
          id: account.id,
          role: account.role,
          email: account.email,
          merchant_id: account.merchant_id || null,
          tourist_id: account.tourist_id ?? null,
          token: data?.token || null,
        });
        localStorage.setItem('vive-mexico-role', account.role);
        if (account.merchant_id) {
          localStorage.setItem('vive-mexico-merchant-id', account.merchant_id);
        }
        if (account.tourist_id) {
          localStorage.setItem('vive-mexico-tourist-id', String(account.tourist_id));
        }
      }
      if (role === 'merchant') {
        window.location.href = '/merchant';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(`${t('auth_error')}${err?.message ? ` (${err.message})` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full max-w-md mx-auto flex flex-col gap-6 justify-center px-4 sm:px-0">
      <header className="text-center relative">
        <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Actualizado {BUILD_SHA}
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter mt-3">
          VIVE <span className="text-[var(--primary)]">MÉXICO</span>
        </h1>
        <p className="text-[var(--muted)] font-medium mt-2">{t('auth_title')}</p>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Paso 1 · ¿Quién eres?</p>
          <p className="text-sm text-gray-500">Selecciona el perfil para personalizar tu experiencia.</p>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 rounded-xl text-sm font-bold ${role === 'tourist' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setRole('tourist')}
          >
            {t('role_tourist')}
          </button>
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-bold ${role === 'merchant' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setRole('merchant')}
          >
            {t('role_merchant')}
          </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Paso 2 · Acceso</p>
          <p className="text-sm text-gray-500">Si ya tienes cuenta, inicia sesión. Si no, regístrate.</p>
          <div className="flex gap-2">
            <button
              className={`flex-1 py-2 rounded-xl text-sm font-bold ${mode === 'login' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setMode('login')}
          >
            {t('auth_login')}
          </button>
          <button
            className={`flex-1 py-2 rounded-xl text-sm font-bold ${mode === 'register' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setMode('register')}
          >
            {t('auth_register')}
          </button>
          </div>
        </div>

        {mode === 'register' && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder={t('auth_name')}
              aria-label={t('auth_name')}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {role === 'merchant' && (
              <input
                type="text"
                placeholder={t('auth_phone')}
                aria-label={t('auth_phone')}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            )}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="email"
            placeholder={t('auth_email')}
            aria-label={t('auth_email')}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={t('auth_password')}
            aria-label={t('auth_password')}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading || !email || !password}
          className={`w-full ${loading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-3 rounded-xl shadow-lg shadow-[var(--primary)]/20`}
        >
          {loading ? t('auth_processing') : mode === 'login' ? t('auth_login') : t('auth_register')}
        </button>

        {mode === 'login' && (
          <button
            className="w-full text-sm text-gray-500 hover:text-gray-700"
            onClick={() => setMode('register')}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        )}
      </div>
    </div>
  );
}
