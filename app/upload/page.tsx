'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { karyaService } from '@/lib/services/karyaService';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { KaryaType } from '@/lib/types';
import { Upload, Image as ImageIcon, Video, BookOpen, ArrowLeft, Send, CheckCircle2, Loader2, Link as LinkIcon, HardDrive } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<KaryaType>('gambar');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorClass, setAuthorClass] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0].id);

  const [contentUrl, setContentUrl] = useState('');
  const [textContent, setTextContent] = useState('');

  // Storage Upload State
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // File Upload Handler to InsForge Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFile(true);
      setUploadStatusText('Mengunggah berkas gambar ke Storage InsForge...');

      const publicUrl = await karyaService.uploadImageToStorage(file);
      setContentUrl(publicUrl);
      setUploadStatusText('✅ Berkas gambar berhasil diunggah ke Storage InsForge!');
    } catch (err) {
      console.error('Upload storage error:', err);
      setErrorMessage('Gagal mengunggah file gambar ke storage. Silakan coba lagi.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !authorName.trim() || !authorClass.trim() || !description.trim()) {
      setErrorMessage('Mohon lengkapi semua field wajib (Judul, Deskripsi, Nama Siswa, dan Kelas).');
      return;
    }

    if (selectedType === 'gambar' && !contentUrl.trim()) {
      setErrorMessage('Mohon unggah berkas gambar atau masukkan URL Gambar karya Anda.');
      return;
    }

    if (selectedType === 'video' && !contentUrl.trim()) {
      setErrorMessage('Mohon sertakan URL Video (YouTube / Vimeo / MP4).');
      return;
    }

    if (selectedType === 'tulisan' && !textContent.trim()) {
      setErrorMessage('Mohon tuliskan isi artikel / puisi karya Anda.');
      return;
    }

    try {
      setIsSubmitting(true);
      await karyaService.createKarya({
        title: title.trim(),
        description: description.trim(),
        authorName: authorName.trim(),
        authorClass: authorClass.trim(),
        categoryId,
        type: selectedType,
        contentUrl: contentUrl.trim() || undefined,
        textContent: textContent.trim() || undefined,
      });

      setSuccessMessage(true);
      setTimeout(() => {
        router.push('/siswa/dashboard');
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal mengirim karya. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#e2ebd5] pb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs text-[#548716] font-extrabold mb-2 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Upload Karya Siswa</h1>
            <span className="px-2.5 py-0.5 text-xs bg-[#eef5e4] text-[#548716] font-bold rounded-full border border-[#d2e4b8]">
              WhiteBee Form
            </span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Unggah karya siswa (Gambar, Video, atau Tulisan) untuk diverifikasi oleh Admin.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Karya Berhasil Dikirim!</p>
            <p className="text-xs text-emerald-700">Mengarahkan ke Dashboard Status Siswa...</p>
          </div>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-[#e2ebd5] p-6 sm:p-8 rounded-3xl shadow-sm">
        
        {/* Step 1: Select Media Format */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-800">
            1. Pilih Format Media Karya:
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'gambar' as const, label: 'Gambar / Artwork', icon: ImageIcon, color: 'text-sky-600' },
              { id: 'video' as const, label: 'Video / Film', icon: Video, color: 'text-purple-600' },
              { id: 'tulisan' as const, label: 'Tulisan / Puisi', icon: BookOpen, color: 'text-emerald-600' },
            ].map((media) => {
              const Icon = media.icon;
              const isSelected = selectedType === media.id;
              return (
                <button
                  key={media.id}
                  type="button"
                  onClick={() => setSelectedType(media.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                    isSelected
                      ? 'bg-[#eef5e4] border-[#659f1d] text-[#548716] shadow-sm scale-[1.02] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${media.color}`} />
                  <span className="text-xs">{media.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Format Specific Inputs */}
        <div className="p-5 bg-[#f8faf4] border border-[#e2ebd5] rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-[#548716] uppercase tracking-wider">
            Detail Konten Khusus ({selectedType.toUpperCase()})
          </h3>

          {selectedType === 'gambar' && (
            <div className="space-y-4">
              
              {/* Method Switcher: Direct File Upload vs URL Link */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    uploadMode === 'file'
                      ? 'bg-[#659f1d] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Upload File ke Storage InsForge</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    uploadMode === 'url'
                      ? 'bg-[#659f1d] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Tempel URL Gambar</span>
                </button>
              </div>

              {/* Mode A: File Upload */}
              {uploadMode === 'file' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Pilih Berkas Gambar dari Perangkat (JPG/PNG/WebP):</label>
                  
                  <div className="relative border-2 border-dashed border-[#cbe1a5] hover:border-[#659f1d] bg-white p-6 rounded-2xl text-center space-y-2 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={isUploadingFile}
                    />
                    
                    {isUploadingFile ? (
                      <div className="flex flex-col items-center gap-2 text-[#548716]">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs font-bold">{uploadStatusText}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-8 h-8 text-[#659f1d]" />
                        <span className="text-xs font-bold text-slate-700">Klik atau tarik file gambar ke sini</span>
                        <span className="text-[11px] text-slate-400">Otomatis tersimpan di Bucket Storage InsForge (`mading-media`)</span>
                      </div>
                    )}
                  </div>

                  {uploadStatusText && !isUploadingFile && (
                    <p className="text-xs text-[#548716] font-bold">{uploadStatusText}</p>
                  )}
                </div>
              )}

              {/* Mode B: Direct URL */}
              {uploadMode === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">URL Gambar Utama / Artwork:</label>
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau URL link foto karya Anda"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
                  />
                </div>
              )}

              {/* Image Preview Box */}
              {contentUrl && (
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-bold text-[#548716]">Preview Gambar Hasil Upload:</span>
                  <div className="relative max-h-56 rounded-2xl overflow-hidden border border-[#d6e7bf] bg-slate-50">
                    <img src={contentUrl} alt="Preview Karya" className="max-h-56 w-full object-contain mx-auto" />
                  </div>
                </div>
              )}

            </div>
          )}

          {selectedType === 'video' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">URL Video YouTube / Vimeo / File MP4:</label>
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... atau link embed video"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>
          )}

          {selectedType === 'tulisan' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Isi Lengkap Puisi / Cerpen / Artikel:</label>
              <textarea
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Tuliskan bait puisi atau cerita karya Anda di sini..."
                className="w-full px-4 py-3 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-serif leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Step 3: General Metadata */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#548716] uppercase tracking-wider">
            2. Informasi Identitas & Metadata Karya
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Karya *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lukisan Senja di Lapangan Sekolah"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kelas / Jurusan *</label>
              <input
                type="text"
                value={authorClass}
                onChange={(e) => setAuthorClass(e.target.value)}
                placeholder="Contoh: XII RPL 1"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kategori Karya</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none font-semibold"
              >
                {INITIAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} — {cat.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Deskripsi Ringkat Karya *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berikan ringkasan singkat tentang latar belakang atau pesan dari karya ini..."
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>

          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingFile}
            className="px-6 py-3 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-sm rounded-xl shadow-md shadow-[#659f1d]/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim Karya...' : 'Kirim Karya untuk Verifikasi Admin'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
