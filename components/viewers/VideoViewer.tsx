'use client';

import React from 'react';
import { Karya } from '@/lib/types';
import { Video, ExternalLink } from 'lucide-react';

interface VideoViewerProps {
  karya: Karya;
}

export default function VideoViewer({ karya }: VideoViewerProps) {
  const url = karya.contentUrl || '';

  const getYouTubeEmbedUrl = (rawUrl: string): string | null => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = rawUrl.match(regExp);
      return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    } catch {
      return null;
    }
  };

  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="space-y-6">
      
      {/* Responsive Video Container */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-[#e2ebd5] shadow-md flex items-center justify-center">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={karya.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : url.endsWith('.mp4') || url.endsWith('.webm') ? (
          <video controls src={url} className="w-full h-full object-contain">
            Browser Anda tidak mendukung pemutaran video HTML5.
          </video>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mx-auto">
              <Video className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Tautan Video Luar</p>
              <p className="text-xs text-slate-300 truncate max-w-md">{url || 'Tidak ada URL video yang valid'}</p>
            </div>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-purple-600/30"
              >
                <span>Tonton Video di Tab Baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
