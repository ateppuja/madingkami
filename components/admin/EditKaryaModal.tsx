'use client';

import React, { useState, useEffect } from 'react';
import { Karya } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { X, Save, Edit3, Loader2 } from 'lucide-react';

interface EditKaryaModalProps {
  isOpen: boolean;
  karya: Karya | null;
  onClose: () => void;
  onSave: (updatedFields: Partial<Karya>) => Promise<void>;
}

export default function EditKaryaModal({ isOpen, karya, onClose, onSave }: EditKaryaModalProps) {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorClass, setAuthorClass] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (karya) {
      setTitle(karya.title || '');
      setAuthorName(karya.authorName || '');
      setAuthorClass(karya.authorClass || '');
      setDescription(karya.description || '');
      setCategoryId(karya.categoryId || INITIAL_CATEGORIES[0].id);
      setContentUrl(karya.contentUrl || '');
      setTextContent(karya.textContent || '');
      setStatus(karya.status || 'pending');
    }
  }, [karya]);

  if (!isOpen || !karya) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        authorName: authorName.trim(),
        authorClass: authorClass.trim(),
        description: description.trim(),
        categoryId,
        contentUrl: contentUrl.trim() || undefined,
        textContent: textContent.trim() || undefined,
        status,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-[#e2ebd5] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e2ebd5] pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#eef5e4] text-[#548716] rounded-xl border border-[#d2e4b8]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Edit Karya Siswa (Admin)</h3>
              <p className="text-xs text-slate-500">Ubah detail karya siswa dari portal moderasi.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Judul Karya *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Siswa *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kelas Siswa *</label>
              <input
                type="text"
                value={authorClass}
                onChange={(e) => setAuthorClass(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kategori Mading *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-semibold"
              >
                {INITIAL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Status Verifikasi *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-bold"
              >
                <option value="pending">Menunggu Verifikasi (Pending)</option>
                <option value="approved">Disetujui & Terbit (Approved)</option>
                <option value="rejected">Ditolak (Rejected)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Deskripsi Karya *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              required
            />
          </div>

          {karya.type === 'tulisan' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Isi Lengkap Puisi / Cerpen</label>
              <textarea
                rows={5}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-serif"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">URL Media (Foto / Video)</label>
              <input
                type="text"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#e2ebd5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Perubahan</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
