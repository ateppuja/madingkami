'use client';

import React from 'react';
import { Karya } from '@/lib/types';
import { Code2, ExternalLink, GitBranch, MonitorPlay } from 'lucide-react';

interface AplikasiViewerProps {
  karya: Karya;
}

export default function AplikasiViewer({ karya }: AplikasiViewerProps) {
  return (
    <div className="space-y-6">
      
      {/* App Main Preview Container */}
      <div className="relative bg-white border border-[#e2ebd5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Cover / Screenshot Preview */}
        {karya.contentUrl && (
          <div className="relative w-full max-h-96 rounded-2xl overflow-hidden border border-[#e2ebd5] bg-slate-50">
            <img src={karya.contentUrl} alt={karya.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Application Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2ebd5] pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200 shrink-0">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 rounded-full uppercase tracking-wider">
                Software / Web Application
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">{karya.title}</h2>
              <p className="text-xs text-[#548716] font-bold">Pengembang: {karya.authorName} ({karya.authorClass})</p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex items-center gap-3">
            {karya.appDemoUrl && (
              <a
                href={karya.appDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#659f1d]/20 flex items-center gap-2"
              >
                <MonitorPlay className="w-4 h-4" />
                <span>Buka Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {karya.appRepoUrl && (
              <a
                href={karya.appRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all border border-slate-200 flex items-center gap-2"
              >
                <GitBranch className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Application Description */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800">Deskripsi & Fitur Utama Aplikasi:</h4>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-[#f8faf4] p-5 rounded-2xl border border-[#e2ebd5]">
            {karya.description}
          </p>
        </div>

      </div>

    </div>
  );
}
