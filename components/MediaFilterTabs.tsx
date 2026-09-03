'use client';

import React from 'react';
import { KaryaType } from '@/lib/types';
import { LayoutGrid, Image as ImageIcon, Video, BookOpen } from 'lucide-react';

interface MediaFilterTabsProps {
  activeType: KaryaType | 'all';
  onSelectType: (type: KaryaType | 'all') => void;
  counts?: Record<string, number>;
}

export default function MediaFilterTabs({ activeType, onSelectType, counts }: MediaFilterTabsProps) {
  const tabs = [
    { id: 'all' as const, label: 'Semua Karya', icon: LayoutGrid, color: 'text-[#659f1d]' },
    { id: 'gambar' as const, label: 'Gambar & Artwork', icon: ImageIcon, color: 'text-sky-600' },
    { id: 'video' as const, label: 'Video & Film', icon: Video, color: 'text-purple-600' },
    { id: 'tulisan' as const, label: 'Tulisan & Puisi', icon: BookOpen, color: 'text-emerald-600' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-[#e2ebd5] rounded-2xl shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeType === tab.id;
        const count = counts ? counts[tab.id] : undefined;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectType(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive
                ? 'bg-[#659f1d] text-white shadow-md shadow-[#659f1d]/20 scale-[1.02]'
                : 'text-slate-600 hover:text-[#548716] hover:bg-[#f2f7ea]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
            <span>{tab.label}</span>
            {typeof count === 'number' && (
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-extrabold ${
                isActive ? 'bg-white/25 text-white' : 'bg-[#eef5e4] text-[#548716]'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
