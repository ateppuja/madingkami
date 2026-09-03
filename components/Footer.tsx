import React from 'react';
import Link from 'next/link';
import { Leaf, Heart, BookOpen, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e2ebd5] text-slate-600 py-8 text-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <img src="/logo.png" alt="WhiteBee Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-slate-800">WhiteBee School Of Life</span>
              <span className="text-xs text-slate-500 block">System Mading Online & Real-time Showcase</span>
            </div>
          </div>

          {/* Heart indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk Kreativitas Siswa Sekolah</span>
          </div>

          {/* Footer Nav Links */}
          <div className="flex items-center gap-4 text-xs font-semibold text-[#548716]">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Mading Digital
            </Link>
            <span>•</span>
            <span className="text-slate-400">© 2026 WhiteBee School Of Life</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
