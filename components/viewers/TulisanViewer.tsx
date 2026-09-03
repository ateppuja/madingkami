'use client';

import React from 'react';
import { Karya } from '@/lib/types';
import { BookOpen, Quote, Leaf } from 'lucide-react';

interface TulisanViewerProps {
  karya: Karya;
}

export default function TulisanViewer({ karya }: TulisanViewerProps) {
  const textContent = karya.textContent || karya.description || '';

  return (
    <div className="bg-white border border-[#e2ebd5] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
      
      {/* Article Header Quote Banner */}
      <div className="flex items-start gap-4 p-5 bg-[#f8faf3] border border-[#d6e7bf] rounded-2xl">
        <Quote className="w-8 h-8 text-[#659f1d] shrink-0" />
        <div className="space-y-1">
          <h4 className="font-serif italic text-slate-800 text-sm sm:text-base">
            "{karya.description}"
          </h4>
          <span className="text-[10px] text-[#548716] font-extrabold tracking-wide uppercase">
            Ringkasan Karya Sastra • {karya.authorName} ({karya.authorClass})
          </span>
        </div>
      </div>

      {/* Styled Article Text Content */}
      <div className="prose max-w-none space-y-4 text-slate-800 leading-relaxed font-serif text-base sm:text-lg whitespace-pre-line border-t border-b border-[#e2ebd5] py-8">
        {textContent}
      </div>

      {/* Author Sign-off Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 italic font-sans pt-2">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-[#659f1d]" />
          <span>Karya Sastra Siswa WhiteBee School Of Life</span>
        </div>
        <span className="font-bold text-slate-700">Ditulis oleh: {karya.authorName}</span>
      </div>

    </div>
  );
}
