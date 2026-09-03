'use client';

import React, { useState } from 'react';
import { Karya } from '@/lib/types';
import { Maximize2, Image as ImageIcon } from 'lucide-react';

interface GambarViewerProps {
  karya: Karya;
}

export default function GambarViewer({ karya }: GambarViewerProps) {
  const mediaList = karya.mediaUrls && karya.mediaUrls.length > 0 
    ? karya.mediaUrls 
    : karya.contentUrl ? [karya.contentUrl] : [];

  const [selectedImage, setSelectedImage] = useState(mediaList[0] || '');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Main Image View Box */}
      <div className="relative group w-full max-h-[600px] bg-slate-900 rounded-3xl overflow-hidden border border-[#e2ebd5] flex items-center justify-center shadow-md">
        {selectedImage ? (
          <>
            <img
              src={selectedImage}
              alt={karya.title}
              className="max-h-[600px] w-auto object-contain mx-auto"
            />
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-[#659f1d] hover:text-white text-slate-800 rounded-xl backdrop-blur-md transition-all shadow-md opacity-0 group-hover:opacity-100 font-bold"
              title="Perbesar Gambar (Lightbox)"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ImageIcon className="w-12 h-12 mx-auto text-[#659f1d]" />
            <p className="font-semibold">Tidak ada gambar untuk ditampilkan</p>
          </div>
        )}
      </div>

      {/* Gallery Thumbnail Selector (Multi-Photo) */}
      {mediaList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {mediaList.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(url)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedImage === url ? 'border-[#659f1d] scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 px-4 py-2 bg-white text-slate-800 font-extrabold rounded-xl text-sm shadow-md hover:bg-slate-100"
          >
            Tutup [ESC]
          </button>
          <img src={selectedImage} alt={karya.title} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
        </div>
      )}

    </div>
  );
}
