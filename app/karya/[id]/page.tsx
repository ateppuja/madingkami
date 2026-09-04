'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { karyaService } from '@/lib/services/karyaService';
import { Karya } from '@/lib/types';
import GambarViewer from '@/components/viewers/GambarViewer';
import VideoViewer from '@/components/viewers/VideoViewer';
import TulisanViewer from '@/components/viewers/TulisanViewer';
import CommentsSection from '@/components/CommentsSection';
import { ArrowLeft, Heart, Eye, Calendar, User, Share2, Leaf, Trash2 } from 'lucide-react';

export default function KaryaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [karya, setKarya] = useState<Karya | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('mading_user_role');
    const isAuth = localStorage.getItem('mading_admin_authenticated') === 'true';
    setIsAdmin(role === 'admin' && isAuth);

    if (id) {
      karyaService.getKaryaById(id).then((data) => {
        if (data) {
          setKarya(data);
          setLikesCount(data.likesCount || 0);
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleLike = async () => {
    if (!karya || hasLiked) return;
    setHasLiked(true);
    const updatedCount = await karyaService.incrementLikes(karya.id);
    setLikesCount(updatedCount);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: karya?.title || 'WhiteBee Mading Online',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan karya berhasil disalin ke clipboard!');
    }
  };

  const handleDeleteByAdmin = async () => {
    if (!karya) return;
    if (confirm(`Apakah Anda yakin ingin menghapus permanen karya "${karya.title}"?`)) {
      await karyaService.deleteKarya(karya.id);
      router.push('/admin');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500 font-bold">
        Memuat detail karya WhiteBee...
      </div>
    );
  }

  if (!karya) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-800">Karya tidak ditemukan</h2>
        <p className="text-slate-500 text-sm">Karya ini mungkin telah dihapus atau belum disetujui admin.</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-[#659f1d] text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Mading Utama
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e2ebd5] text-slate-700 hover:text-[#548716] text-xs font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Mading
        </button>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={handleDeleteByAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all shadow-xs"
              title="Hapus Karya Permanen (Admin)"
            >
              <Trash2 className="w-4 h-4" /> Hapus Karya (Admin)
            </button>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eef5e4] border border-[#d2e4b8] text-[#548716] hover:bg-[#659f1d] hover:text-white text-xs font-bold transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" /> Bagikan Karya
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="space-y-4 border-b border-[#e2ebd5] pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#eef5e4] border border-[#d2e4b8] text-[#548716] font-extrabold text-xs rounded-full uppercase tracking-wider">
            Format: {karya.type}
          </span>
          {karya.featured && (
            <span className="px-3 py-1 bg-amber-500 text-white font-extrabold text-xs rounded-full uppercase">
              ★ Featured Karya
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
          {karya.title}
        </h1>

        {/* Creator Info Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-semibold">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <User className="w-4 h-4 text-[#659f1d]" />
            <span>Kreator: {karya.authorName}</span>
            <span className="text-[#548716]">({karya.authorClass})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{new Date(karya.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{karya.viewsCount || 0}x Dilihat</span>
          </div>
        </div>
      </div>

      {/* Dynamic Viewer Render according to Karya Type */}
      <section className="py-2">
        {karya.type === 'gambar' && <GambarViewer karya={karya} />}
        {karya.type === 'video' && <VideoViewer karya={karya} />}
        {karya.type === 'tulisan' && <TulisanViewer karya={karya} />}
      </section>

      {/* Karya Description Box */}
      {karya.type !== 'tulisan' && (
        <section className="bg-white border border-[#e2ebd5] rounded-3xl p-6 space-y-3 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#659f1d]" /> Deskripsi & Latar Belakang Karya
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {karya.description}
          </p>
        </section>
      )}

      {/* Appreciation & Interaction Section */}
      <section className="flex items-center justify-between p-6 bg-white border border-[#e2ebd5] rounded-3xl shadow-xs">
        <div>
          <h4 className="font-extrabold text-slate-800 text-sm">Apresiasi Karya Siswa Ini</h4>
          <p className="text-xs text-slate-500 font-medium">Berikan dukungan semangat bagi kreator WhiteBee School Of Life!</p>
        </div>

        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all shadow-md ${
            hasLiked
              ? 'bg-rose-100 text-rose-700 border border-rose-200 cursor-default'
              : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/20 hover:scale-105'
          }`}
        >
          <Heart className={`w-5 h-5 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'fill-white text-white'}`} />
          <span>{likesCount} Menyukai</span>
        </button>
      </section>

      {/* Visitor Comments & Admin Moderation Section */}
      <CommentsSection karyaId={karya.id} />

    </div>
  );
}
