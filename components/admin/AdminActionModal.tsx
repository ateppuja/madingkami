'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';

interface AdminActionModalProps {
  isOpen: boolean;
  karyaTitle: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function AdminActionModal({ isOpen, karyaTitle, onClose, onSubmit }: AdminActionModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Alasan penolakan wajib diisi agar siswa mengetahui catatan perbaikan.');
      return;
    }
    onSubmit(reason.trim());
    setReason('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-[#e2ebd5] rounded-3xl shadow-2xl p-6 space-y-5">
        
        <div className="flex items-start justify-between border-b border-[#e2ebd5] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Tolak Publikasi Karya</h3>
              <p className="text-xs text-slate-500 font-medium">Berikan catatan masukan untuk siswa</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#f8faf4] p-3 rounded-xl border border-[#e2ebd5]">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Judul Karya:</span>
          <span className="text-sm font-bold text-[#548716] line-clamp-1">{karyaTitle}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Catatan / Alasan Penolakan:</label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              placeholder="Contoh: Mohon unggah foto lukisan dengan pencahayaan yang lebih terang, atau pastikan link YouTube tidak terkunci..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-rose-500 rounded-xl text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
            {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30"
            >
              <Send className="w-3.5 h-3.5" /> Kirim Catatan & Tolak
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
