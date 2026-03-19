'use client';

import Link from 'next/link';
import { Home, ScanLine, User, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import React from 'react';

const BottomNav = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[var(--glass)] backdrop-blur-xl border-t border-[var(--primary)]/10 z-50 flex items-center justify-around px-4 pb-4">
      <Link href="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-green-600' : 'text-gray-400'}`}>
        <Home size={24} />
        <span className="text-xs font-medium">{t('home')}</span>
      </Link>
      <Link href="/favorites" className={`flex flex-col items-center gap-1 ${isActive('/favorites') ? 'text-green-600' : 'text-gray-400'}`}>
        <Heart size={24} />
        <span className="text-xs font-medium">Favoritos</span>
      </Link>
      <Link href="/scanner" className={`flex flex-col items-center gap-1 ${isActive('/scanner') ? 'text-green-600' : 'text-gray-400'}`}>
        <ScanLine size={24} />
        <span className="text-xs font-medium">{t('scanner')}</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-green-600' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-xs font-medium">{t('profile')}</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
