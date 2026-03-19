'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { getSession } from '@/lib/auth';
import { migrateLocalStorageKeys } from '@/lib/storage';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    migrateLocalStorageKeys();
    const session = getSession();
    setHasSession(!!session);
  }, []);

  const hideNav = pathname.startsWith('/auth');

  return (
    <>
      {!hideNav && <Navbar />}
      <main className="pt-20 pb-24 px-4 min-h-screen">
        {children}
      </main>
      {!hideNav && hasSession && <BottomNav />}
    </>
  );
}
