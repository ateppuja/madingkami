'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { karyaService, getLocalKarya } from '@/lib/services/karyaService';
import { Karya } from '@/lib/types';
import EditKaryaModal from '@/components/admin/EditKaryaModal';
import { Clock, CheckCircle2, XCircle, Upload, BookOpen, AlertCircle, ArrowUpRight, ShieldCheck, Edit3, Trash2 } from 'lucide-react';

export default function StudentDashboardPage() {
  // Initialize with local storage data for 0ms instant loading
  const [karyaList, setKaryaList] = useState<Karya[]>(() => getLocalKarya());
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedKarya, setSelectedKarya] = useState<Karya | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('mading_user_role');
    const isAuth = localStorage.getItem('mading_admin_authenticated') === 'true';
    setIsAdmin(role === 'admin' && isAuth);

    const handleRoleChange = () => {
      const currentRole = localStorage.getItem('mading_user_role');
      const currentAuth = localStorage.getItem('mading_admin_authenticated') === 'true';
      setIsAdmin(currentRole === 'admin' && currentAuth);
    };

    window.addEventListener('mading_role_changed', handleRoleChange);
    return () => window.removeEventListener('mading_role_changed', handleRoleChange);
  }, []);

  const fetchStudentData = async () => {
    const data = await karyaService.getAllKarya();
    if (data && data.length > 0) {
      setKaryaList(data);
    }
  };

  useEffect(() => {
    fetchStudentData();

    // Auto polling every 5s to sync latest status updates from admin
    const interval = setInterval(() => {
      fetchStudentData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenEdit = (karya: Karya) => {
    setSelectedKarya(karya);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedFields: Partial<Karya>) => {
    if (!selectedKarya) return;
    await karyaService.updateKarya(selectedKarya.id, updatedFields);
    fetchStudentData();
  };

  const handleDeleteKarya = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus permanen karya "${title}"?`)) {
      await karyaService.deleteKarya(id);
      fetchStudentData();
    }
  };

  const pendingCount = karyaList.filter(k => k.status === 'pending').length;
  const approvedCount = karyaList.filter(k => k.status === 'approved').length;
  const rejectedCount = karyaList.filter(k => k.status === 'rejected').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2ebd5] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef5e4] text-[#548716] text-xs font-extrabold uppercase tracking-wider mb-2 border border-[#d2e4b8]">
            <BookOpen className="w-3.5 h-3.5" /> WhiteBee Student Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Status Verifikasi Karya Siswa</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Pantau status persetujuan karya Anda dari pihak Admin / Guru Pembina.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="px-3 py-1.5 bg-[#659f1d] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> Mode Akses Admin Aktif
            </span>
          )}

          <Link
            href="/upload"
            className="px-5 py-2.5 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-[#659f1d]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Karya Baru</span>
          </Link>
        </div>
      </div>

      {/* Summary Counters (WhiteBee UI Card Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-[#e2ebd5] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-800 block">{pendingCount}</span>
            <span className="text-xs text-slate-500 font-semibold">Menunggu Verifikasi</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2ebd5] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-[#eef5e4] text-[#548716] rounded-xl border border-[#d2e4b8]">
            <CheckCircle2 className="w-6 h-6 text-[#659f1d]" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-800 block">{approvedCount}</span>
            <span className="text-xs text-slate-500 font-semibold">Disetujui & Terbit</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2ebd5] shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-800 block">{rejectedCount}</span>
            <span className="text-xs text-slate-500 font-semibold">Ditolak (Perlu Perbaikan)</span>
          </div>
        </div>

      </div>

      {/* Karya Submissions Table / List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800">Daftar Pengajuan Karya Siswa</h2>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-semibold">Memuat data karya...</div>
        ) : karyaList.length === 0 ? (
          <div className="p-12 bg-white border border-[#e2ebd5] rounded-3xl text-center space-y-3 shadow-xs">
            <BookOpen className="w-12 h-12 text-[#659f1d] mx-auto" />
            <p className="text-slate-600 text-sm font-semibold">Belum ada karya yang diunggah.</p>
            <Link
              href="/upload"
              className="inline-block px-4 py-2 bg-[#659f1d] text-white rounded-xl text-xs font-bold"
            >
              Upload Karya Pertama Anda
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {karyaList.map((karya) => (
              <div
                key={karya.id}
                className="bg-white border border-[#e2ebd5] hover:border-[#659f1d]/50 rounded-2xl p-5 sm:p-6 space-y-4 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-[#eef5e4] text-[#548716] border border-[#d2e4b8]">
                        {karya.type}
                      </span>
                      <span className="text-xs text-slate-400">• {new Date(karya.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-800">{karya.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-1">{karya.description}</p>
                    <p className="text-[11px] text-[#548716] font-bold">Kreator: {karya.authorName} ({karya.authorClass})</p>
                  </div>

                  {/* Status Badge & Admin Edit/Delete Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {karya.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Menunggu Verifikasi</span>
                      </span>
                    )}

                    {karya.status === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef5e4] border border-[#d2e4b8] text-[#548716] font-bold text-xs rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#659f1d]" />
                        <span>Disetujui & Terbit</span>
                      </span>
                    )}

                    {karya.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ditolak Admin</span>
                      </span>
                    )}

                    {/* ADMIN EDIT AND DELETE BUTTONS */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                        <button
                          onClick={() => handleOpenEdit(karya)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#eef5e4] text-slate-700 hover:text-[#548716] rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-1"
                          title="Edit Karya (Admin)"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#659f1d]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteKarya(karya.id, karya.title)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-200 flex items-center gap-1"
                          title="Hapus Karya (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}

                    {karya.status === 'approved' && (
                      <Link
                        href={`/karya/${karya.id}`}
                        className="p-2 bg-[#eef5e4] text-[#548716] hover:bg-[#659f1d] hover:text-white rounded-xl text-xs font-bold transition-all"
                        title="Lihat di Mading"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Rejection Note Alert Box */}
                {karya.status === 'rejected' && karya.rejectionReason && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Catatan Perbaikan / Alasan Penolakan dari Admin:</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed font-medium italic">
                      "{karya.rejectionReason}"
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Karya Modal */}
      <EditKaryaModal
        isOpen={editModalOpen}
        karya={selectedKarya}
        onClose={() => { setEditModalOpen(false); setSelectedKarya(null); }}
        onSave={handleSaveEdit}
      />

    </div>
  );
}
