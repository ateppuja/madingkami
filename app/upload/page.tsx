'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { karyaService } from '@/lib/services/karyaService';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { KaryaType } from '@/lib/types';
import { Upload, Image as ImageIcon, Video, BookOpen, ArrowLeft, Send, CheckCircle2, Loader2, Link as LinkIcon, HardDrive, Trash2, Plus } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<KaryaType>('gambar');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorClass, setAuthorClass] = useState('');
  const [categoryId, setCategoryId] = useState(INITIAL_CATEGORIES[0].id);

  const [contentUrl, setContentUrl] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [newUrlInput, setNewUrlInput] = useState('');
  const [textContent, setTextContent] = useState('');

  // Storage Upload State
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // File Upload Handler for Single or Multiple Files to InsForge Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingFile(true);
      const uploadedList: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStatusText(`Mengunggah gambar (${i + 1}/${files.length}): ${file.name}...`);
        const publicUrl = await karyaService.uploadImageToStorage(file);
        uploadedList.push(publicUrl);
      }

      setMediaUrls(prev => [...prev, ...uploadedList]);
      if (!contentUrl && uploadedList.length > 0) {
        setContentUrl(uploadedList[0]);
      }
      setUploadStatusText(`✅ Berhasil mengunggah ${uploadedList.length} gambar ke Storage InsForge!`);
    } catch (err) {
      console.error('Upload storage error:', err);
      setErrorMessage('Gagal mengunggah file gambar. Silakan coba lagi.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleAddUrl = () => {
    if (!newUrlInput.trim()) return;
    const url = newUrlInput.trim();
    setMediaUrls(prev => [...prev, url]);
    if (!contentUrl) setContentUrl(url);
    setNewUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = mediaUrls.filter((_, idx) => idx !== indexToRemove);
    setMediaUrls(updated);
    if (updated.length > 0) {
      setContentUrl(updated[0]);
    } else {
      setContentUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !authorName.trim() || !authorClass.trim() || !description.trim()) {
      setErrorMessage('Mohon lengkapi semua field wajib (Judul, Deskripsi, Nama Siswa, dan Kelas).');
      return;
    }

    const finalMediaUrls = mediaUrls.length > 0 ? mediaUrls : (contentUrl.trim() ? [contentUrl.trim()] : []);

    if (selectedType === 'gambar' && finalMediaUrls.length === 0) {
      setErrorMessage('Mohon unggah minimal 1 berkas gambar atau masukkan URL Gambar karya Anda.');
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
        contentUrl: finalMediaUrls[0] || contentUrl.trim() || undefined,
        mediaUrls: finalMediaUrls.length > 0 ? finalMediaUrls : undefined,
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
            Unggah karya siswa (Gambar/Multi-Foto, Video, atau Tulisan) untuk diverifikasi oleh Admin.
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
              { id: 'gambar' as const, label: 'Gambar / Artwork (Multi-Foto)', icon: ImageIcon, color: 'text-sky-600' },
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

              {/* Mode A: File Upload (Multi-file enabled) */}
              {uploadMode === 'file' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Pilih Berkas Gambar dari Perangkat (Bisa Pilih Banyak Foto Sekaligus):
                    </label>
                    <span className="text-[11px] font-bold text-[#548716]">
                      {mediaUrls.length} Gambar Dipilih
                    </span>
                  </div>
                  
                  <div className="relative border-2 border-dashed border-[#cbe1a5] hover:border-[#659f1d] bg-white p-6 rounded-2xl text-center space-y-2 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
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
                        <span className="text-xs font-bold text-slate-700">Klik atau tarik file gambar ke sini (Bisa Pilih Banyak)</span>
                        <span className="text-[11px] text-slate-400">Otomatis tersimpan di Bucket Storage InsForge (`mading-media`)</span>
                      </div>
                    )}
                  </div>

                  {uploadStatusText && !isUploadingFile && (
                    <p className="text-xs text-[#548716] font-bold">{uploadStatusText}</p>
                  )}
                </div>
              )}

              {/* Mode B: Direct URL Input */}
              {uploadMode === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">URL Gambar / Artwork (Bisa Tambah Banyak URL):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newUrlInput}
                      onChange={(e) => setNewUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/... atau URL link foto"
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-4 py-2.5 bg-[#659f1d] hover:bg-[#548716] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Tambah URL
                    </button>
                  </div>
                </div>
              )}

              {/* Uploaded Images List Gallery Grid */}
              {mediaUrls.length > 0 && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Daftar Gambar Karya ({mediaUrls.length} Foto):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {mediaUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#d6e7bf] bg-white h-28 flex items-center justify-center shadow-xs">
                        <img src={url} alt={`Karya ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 shadow-md"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#659f1d] text-white text-[9px] font-extrabold rounded">
                            Sampul Utama
                          </span>
                        )}
                      </div>
                    ))}
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
          <h3 className="text-sm font-bold text-slate-800">2. Identitas Karya & Siswa Kreator:</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Karya *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Lukisan Senja di Sekolah"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Contoh: Ahmad Rizky"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kelas / Tingkat *</label>
              <input
                type="text"
                value={authorClass}
                onChange={(e) => setAuthorClass(e.target.value)}
                placeholder="Contoh: XII RPL 1"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Deskripsi / Latar Belakang Karya *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan pesan, makna, atau cerita di balik karya ini..."
              className="w-full px-4 py-3 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-sm text-slate-800 focus:outline-none"
            />
          </div>

        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#e2ebd5]">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingFile}
            className="w-full py-3.5 bg-[#659f1d] hover:bg-[#548716] disabled:bg-slate-300 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-[#659f1d]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengirim Karya...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Karya untuk Verifikasi Admin</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
