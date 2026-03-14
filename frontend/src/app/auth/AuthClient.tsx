'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { setSession } from '@/lib/auth';

const BUILD_SHA = '5d35d9c';

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
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const qRole = params.get('role');
    if (qRole === 'merchant' || qRole === 'tourist') {
      setRole(qRole);
    } else {
      const stored = localStorage.getItem('ola-mexico-role');
      if (stored === 'merchant' || stored === 'tourist') setRole(stored);
    }
  }, [params]);

  const submit = async () => {
    setLoading(true);
    setError(null);
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
        setError(`${data?.message || t('auth_error')} [${resp.status}]${detail}`);
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
        });
        localStorage.setItem('ola-mexico-role', account.role);
        if (account.merchant_id) {
          localStorage.setItem('ola-merchant-id', account.merchant_id);
        }
        if (account.tourist_id) {
          localStorage.setItem('ola-tourist-id', String(account.tourist_id));
        }
      }
      if (role === 'merchant') {
        window.location.href = '/merchant';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(`${t('auth_error')}${err?.message ? ` (${err.message})` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full max-w-md mx-auto flex flex-col gap-6 justify-center">
      <header className="text-center relative">
        <h1 className="text-3xl font-black italic tracking-tighter">
          OLA <span className="text-[var(--primary)]">MÉXICO</span>
        </h1>
        <p className="text-[var(--muted)] font-medium mt-2">{t('auth_title')}</p>
        <span className="absolute right-0 -top-3 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          Build {BUILD_SHA}
        </span>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-5">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">1. Elige tu perfil</p>
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
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">2. ¿Ya tienes cuenta?</p>
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
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {role === 'merchant' && (
              <input
                type="text"
                placeholder={t('auth_phone')}
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
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={t('auth_password')}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          onClick={submit}
          disabled={loading || !email || !password}
          className={`w-full ${loading ? 'opacity-50' : 'bg-[var(--primary)]'} text-white font-bold py-3 rounded-xl shadow-lg shadow-[var(--primary)]/20`}
        >
          {loading ? t('auth_processing') : mode === 'login' ? t('auth_login') : t('auth_register')}
        </button>
      </div>
    </div>
  );
}
