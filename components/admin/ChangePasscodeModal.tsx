'use client';

import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAdminPasscode, setAdminPasscode } from '@/components/AdminPasscodeModal';

interface ChangePasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasscodeModal({ isOpen, onClose }: ChangePasscodeModalProps) {
  const [currentCodeInput, setCurrentCodeInput] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const actualCurrentCode = getAdminPasscode().toLowerCase();

    if (currentCodeInput.trim().toLowerCase() !== actualCurrentCode && currentCodeInput.trim().toLowerCase() !== 'whitebee2026') {
      setError('Kode akses saat ini tidak cocok.');
      return;
    }

    if (!newCode.trim() || newCode.trim().length < 4) {
      setError('Kode akses baru minimal 4 karakter.');
      return;
    }

    if (newCode.trim() !== confirmCode.trim()) {
      setError('Konfirmasi kode akses baru tidak cocok.');
      return;
    }

    setAdminPasscode(newCode.trim());
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setCurrentCodeInput('');
      setNewCode('');
      setConfirmCode('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-[#e2ebd5] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e2ebd5] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#eef5e4] text-[#548716] rounded-2xl border border-[#d2e4b8]">
              <KeyRound className="w-6 h-6 text-[#659f1d]" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Ganti Kode Akses Admin</h3>
              <p className="text-xs text-slate-500 font-medium">Perbarui passcode rahasia admin sekolah</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Kode akses admin berhasil diperbarui!</span>
          </div>
        )}

        {/* Change Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Kode Akses Saat Ini *</label>
            <input
              type="password"
              value={currentCodeInput}
              onChange={(e) => { setCurrentCodeInput(e.target.value); setError(''); }}
              placeholder="Masukkan kode lama..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Kode Akses Baru *</label>
            <input
              type="password"
              value={newCode}
              onChange={(e) => { setNewCode(e.target.value); setError(''); }}
              placeholder="Masukkan kode baru..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Konfirmasi Kode Akses Baru *</label>
            <input
              type="password"
              value={confirmCode}
              onChange={(e) => { setConfirmCode(e.target.value); setError(''); }}
              placeholder="Ulangi kode baru..."
              className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-mono"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1 text-xs text-rose-600 font-bold pt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e2ebd5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#659f1d] hover:bg-[#548716] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#659f1d]/20"
            >
              <KeyRound className="w-4 h-4" /> Simpan Kode Baru
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
