'use client';

export type SessionRole = 'merchant' | 'tourist';

export type SessionData = {
  id: string;
  role: SessionRole;
  email: string;
  merchant_id?: string | null;
  tourist_id?: number | null;
  token?: string | null;
};

const STORAGE_KEY = 'vive-mexico-session';

export const getSession = (): SessionData | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
};

export const setSession = (session: SessionData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
};

export const clearSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

export const getAuthHeaders = () => {
  const session = getSession();
  if (!session?.token) return {};
  return { Authorization: `Bearer ${session.token}` };
};
