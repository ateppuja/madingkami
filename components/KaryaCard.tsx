'use client';

import React from 'react';
import Link from 'next/link';
import { Karya } from '@/lib/types';
import { Image as ImageIcon, Video, BookOpen, Heart, Eye, ArrowUpRight, Star, Play } from 'lucide-react';

interface KaryaCardProps {
  karya: Karya;
}

export const getYouTubeThumbnail = (rawUrl?: string): string | null => {
  if (!rawUrl) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = rawUrl.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
  } catch {
    return null;
  }
  return null;
};

export default function KaryaCard({ karya }: KaryaCardProps) {
  const getTypeBadge = () => {
    switch (karya.type) {
      case 'gambar':
        return { label: 'Gambar', icon: ImageIcon, bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'video':
        return { label: 'Video', icon: Video, bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'tulisan':
        return { label: 'Tulisan', icon: BookOpen, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Karya', icon: ImageIcon, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const badge = getTypeBadge();
  const Icon = badge.icon;

  const ytThumbnail = karya.type === 'video' ? getYouTubeThumbnail(karya.contentUrl) : null;
  const videoCoverUrl = ytThumbnail || (karya.contentUrl && karya.contentUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ? karya.contentUrl : null);

  return (
    <div className="group relative flex flex-col bg-white border border-[#e2ebd5] hover:border-[#659f1d]/60 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
      
      {/* Featured Badge */}
      {karya.featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white font-extrabold text-[10px] uppercase rounded-full shadow-sm">
          <Star className="w-3 h-3 fill-white" />
          <span>Sorotan</span>
        </div>
      )}

      {/* Media Type Badge */}
      <div className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${badge.bg}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{badge.label}</span>
      </div>

      {/* Media Preview Box */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        {karya.type === 'gambar' && karya.contentUrl ? (
          <img
            src={karya.contentUrl}
            alt={karya.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : karya.type === 'video' ? (
          videoCoverUrl ? (
            <div className="relative w-full h-full">
              <img
                src={videoCoverUrl}
                alt={karya.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/40 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform pl-0.5">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500">
              <div className="p-4 bg-white/10 text-white rounded-full backdrop-blur-sm border border-white/20">
                <Play className="w-8 h-8 fill-current pl-0.5" />
              </div>
              <span className="text-xs text-purple-200 font-bold">Putar Video Karya</span>
            </div>
          )
        ) : karya.type === 'tulisan' ? (
          <div className="w-full h-full bg-gradient-to-br from-[#f8faf4] to-[#edf5e3] p-5 flex flex-col justify-between group-hover:scale-105 transition-transform duration-500">
            <BookOpen className="w-8 h-8 text-[#659f1d]/40" />
            <p className="text-xs text-[#2c3d18] italic line-clamp-3 font-serif">
              "{karya.textContent || karya.description}"
            </p>
            <span className="text-[10px] text-[#548716] font-extrabold uppercase tracking-wider">Karya Sastra</span>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            No Preview
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-[#659f1d] transition-colors line-clamp-1">
            {karya.title}
          </h3>
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
            {karya.description}
          </p>
        </div>

        {/* Author & Stats Footer */}
        <div className="pt-3 border-t border-[#e2ebd5] flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-800 block truncate max-w-[140px]">{karya.authorName}</span>
            <span className="text-[11px] text-[#548716] font-semibold">{karya.authorClass}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-semibold">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{karya.likesCount || 0}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{karya.viewsCount || 0}</span>
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          href={`/karya/${karya.id}`}
          className="w-full py-2.5 bg-[#eef5e4] hover:bg-[#659f1d] text-[#548716] hover:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <span>Lihat Karya Selengkapnya</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
