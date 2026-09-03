'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { karyaService } from '@/lib/services/karyaService';
import { Karya, KaryaType } from '@/lib/types';
import MediaFilterTabs from '@/components/MediaFilterTabs';
import KaryaCard from '@/components/KaryaCard';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { Leaf, Search, Upload, BookOpen, Star, ArrowUpRight, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';

export default function Home() {
  const [karyaList, setKaryaList] = useState<Karya[]>([]);
  const [activeType, setActiveType] = useState<KaryaType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchKarya = async () => {
    setIsLoading(true);
    const data = await karyaService.getApprovedKarya(
      activeType === 'all' ? undefined : activeType,
      selectedCategory === 'all' ? undefined : selectedCategory,
      searchQuery
    );
    setKaryaList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKarya();
  }, [activeType, selectedCategory, searchQuery]);

  const featuredItems = karyaList.filter(k => k.featured);

  const counts = {
    all: karyaList.length,
    gambar: karyaList.filter(k => k.type === 'gambar').length,
    video: karyaList.filter(k => k.type === 'video').length,
    tulisan: karyaList.filter(k => k.type === 'tulisan').length,
    aplikasi: karyaList.filter(k => k.type === 'aplikasi').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* WhiteBee Signature Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e5f1d0] via-[#edf6db] to-[#d8eab8] border border-[#d0e4a9] p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="relative z-10 max-w-2xl space-y-5">
          
          {/* Current Date Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#659f1d] text-white text-xs font-bold shadow-xs">
            <Leaf className="w-3.5 h-3.5 fill-white" />
            <span>WHITEBEE SCHOOL OF LIFE • MADING DIGITAL</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm font-bold text-[#548716] block uppercase tracking-wider">Selamat Datang di</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1f2c20] leading-tight tracking-tight">
              Galeri Karya & Kreativitas Siswa
            </h1>
          </div>
          
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Wadah ekspresi digital siswa WhiteBee School Of Life untuk memamerkan <strong>Gambar & Artwork</strong>, <strong>Video Dokumenter</strong>, <strong>Karya Sastra & Puisi</strong>, dan <strong>Aplikasi Software</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/upload"
              className="px-6 py-3 rounded-2xl bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-sm shadow-md shadow-[#659f1d]/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Upload className="w-4 h-4" /> Upload Karya Siswa
            </Link>

            <Link
              href="/siswa/dashboard"
              className="px-6 py-3 rounded-2xl bg-white hover:bg-[#f4f8ee] text-[#548716] font-extrabold text-sm border border-[#cbe1a5] flex items-center gap-2 transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-[#659f1d]" /> Portofolio Status Saya
            </Link>
          </div>
        </div>

        {/* WhiteBee Hero Banner Logo Emblem */}
        <div className="relative z-10 flex flex-col items-center justify-center shrink-0">
          <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white/80 backdrop-blur-md rounded-3xl border border-[#cbe1a5] p-6 shadow-md flex items-center justify-center">
            <img
              src="/logo.png"
              alt="WhiteBee School Of Life Logo Emblem"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Leaf Background Decor */}
        <div className="absolute top-0 right-0 opacity-15 pointer-events-none">
          <Leaf className="w-96 h-96 text-[#659f1d]" />
        </div>
      </section>

      {/* Media Filter Tabs & Search Bar */}
      <section className="space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <MediaFilterTabs
            activeType={activeType}
            onSelectType={setActiveType}
            counts={counts}
          />

          {/* Category Dropdown & Search Bar */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-[#e2ebd5] rounded-2xl text-xs font-semibold text-slate-700 focus:outline-none shadow-xs"
            >
              <option value="all">Semua Kategori</option>
              {INITIAL_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari karya / siswa..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2ebd5] focus:border-[#659f1d] rounded-2xl text-xs text-slate-800 focus:outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Public Works Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-semibold">Memuat karya terbit...</div>
        ) : karyaList.length === 0 ? (
          <div className="p-16 bg-white border border-[#e2ebd5] rounded-3xl text-center space-y-3 shadow-xs">
            <Layers className="w-12 h-12 text-[#659f1d] mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada karya ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau penyaring media.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {karyaList.map((karya) => (
              <KaryaCard key={karya.id} karya={karya} />
            ))}
          </div>
        )}

      </section>

    </div>
  );
}
