'use client';

import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--primary)]/10 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-black italic tracking-tighter hover:opacity-80 transition-opacity">
          OLA <span className="text-[var(--primary)]">MÉXICO</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex">
          <LanguageSelector />
        </div>
        <Link href="/merchant" className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] border-2 border-[var(--primary)] px-3 py-1.5 rounded-full hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm">
          Portal Socio
        </Link>
        <button className="p-2 text-[var(--muted)] hover:bg-gray-100 rounded-full transition-colors">
          <Search size={20} />
        </button>
        <button className="p-2 text-[var(--muted)] hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-white"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
