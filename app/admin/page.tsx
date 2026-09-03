'use client';

import React, { useState, useEffect } from 'react';
import { karyaService } from '@/lib/services/karyaService';
import { Karya } from '@/lib/types';
import AdminActionModal from '@/components/admin/AdminActionModal';
import { ShieldCheck, CheckCircle2, XCircle, Star, Clock, Eye, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [karyaList, setKaryaList] = useState<Karya[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedKarya, setSelectedKarya] = useState<Karya | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    const data = await karyaService.getAllKarya();
    setKaryaList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const pendingItems = karyaList.filter(k => k.status === 'pending');
  const approvedItems = karyaList.filter(k => k.status === 'approved');

  const handleApprove = async (id: string) => {
    await karyaService.updateKaryaStatus(id, 'approved');
    fetchAdminData();
  };

  const openRejectModal = (karya: Karya) => {
    setSelectedKarya(karya);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!selectedKarya) return;
    await karyaService.updateKaryaStatus(selectedKarya.id, 'rejected', reason);
    setRejectModalOpen(false);
    setSelectedKarya(null);
    fetchAdminData();
  };

  const handleToggleFeatured = async (id: string) => {
    await karyaService.toggleFeatured(id);
    fetchAdminData();
  };

  const handleUnpublish = async (id: string) => {
    await karyaService.updateKaryaStatus(id, 'pending');
    fetchAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2ebd5] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef5e4] text-[#548716] text-xs font-extrabold uppercase tracking-wider mb-2 border border-[#d2e4b8]">
            <ShieldCheck className="w-4 h-4 text-[#659f1d]" /> WhiteBee Admin Kurasi Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Dashboard Moderasi Karya Siswa</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Verifikasi kelayakan karya sebelum dipublikasikan ke mading sekolah digital.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-white border border-[#e2ebd5] rounded-2xl text-xs text-slate-700 font-bold shadow-xs">
            <span className="text-[#659f1d] font-extrabold">{pendingItems.length}</span> Karya Menunggu Persetujuan
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#e2ebd5] gap-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-[#659f1d] text-[#548716]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Antrean Verifikasi (Pending)</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-extrabold">
            {pendingItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'approved'
              ? 'border-[#659f1d] text-[#548716]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#659f1d]" />
          <span>Karya Terbit di Mading</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-[#eef5e4] text-[#548716] font-extrabold">
            {approvedItems.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PENDING QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500 font-semibold">Memuat antrean pending...</div>
          ) : pendingItems.length === 0 ? (
            <div className="p-12 bg-white border border-[#e2ebd5] rounded-3xl text-center space-y-2 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-[#659f1d] mx-auto" />
              <h3 className="font-extrabold text-slate-800 text-base">Antrean Kosong!</h3>
              <p className="text-slate-500 text-xs">Semua karya siswa telah diverifikasi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingItems.map((karya) => (
                <div
                  key={karya.id}
                  className="bg-white border border-[#e2ebd5] hover:border-[#659f1d]/50 rounded-2xl p-6 space-y-4 shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#eef5e4] text-[#548716] border border-[#d2e4b8]">
                      Format: {karya.type}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {new Date(karya.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800">{karya.title}</h3>
                    <p className="text-xs text-[#548716] font-bold mt-0.5">Oleh: {karya.authorName} ({karya.authorClass})</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{karya.description}</p>
                  </div>

                  {karya.contentUrl && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 truncate">
                      <span className="font-bold text-slate-800 block">Link Media:</span>
                      <a href={karya.contentUrl} target="_blank" rel="noopener noreferrer" className="text-[#659f1d] underline truncate block">
                        {karya.contentUrl}
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-[#e2ebd5] flex items-center justify-end gap-3">
                    <button
                      onClick={() => openRejectModal(karya)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Tolak Karya
                    </button>

                    <button
                      onClick={() => handleApprove(karya.id)}
                      className="px-5 py-2 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-[#659f1d]/20 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Setujui & Terbitkan
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVED PUBLISHED LIST */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedItems.map((karya) => (
              <div
                key={karya.id}
                className="bg-white border border-[#e2ebd5] rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#eef5e4] text-[#548716] border border-[#d2e4b8]">
                      {karya.type}
                    </span>

                    <button
                      onClick={() => handleToggleFeatured(karya.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full border transition-all ${
                        karya.featured
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>{karya.featured ? 'Disorot (Featured)' : '+ Sorot Karya'}</span>
                    </button>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800 line-clamp-1">{karya.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{karya.authorName} ({karya.authorClass})</p>
                </div>

                <div className="pt-3 border-t border-[#e2ebd5] flex items-center justify-between text-xs font-bold">
                  <Link
                    href={`/karya/${karya.id}`}
                    className="text-[#659f1d] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Lihat di Mading
                  </Link>

                  <button
                    onClick={() => handleUnpublish(karya.id)}
                    className="text-slate-400 hover:text-rose-600 underline text-[11px]"
                  >
                    Tarik Publikasi
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Action Modal for Reject Notes */}
      <AdminActionModal
        isOpen={rejectModalOpen}
        karyaTitle={selectedKarya?.title || ''}
        onClose={() => { setRejectModalOpen(false); setSelectedKarya(null); }}
        onSubmit={handleRejectSubmit}
      />

    </div>
  );
}
