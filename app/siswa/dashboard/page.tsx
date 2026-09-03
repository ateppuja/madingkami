'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { karyaService } from '@/lib/services/karyaService';
import { Karya } from '@/lib/types';
import { Clock, CheckCircle2, XCircle, Upload, BookOpen, AlertCircle, ArrowUpRight, Leaf } from 'lucide-react';

export default function StudentDashboardPage() {
  const [karyaList, setKaryaList] = useState<Karya[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentData = async () => {
    setIsLoading(true);
    const data = await karyaService.getAllKarya();
    setKaryaList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

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

        <Link
          href="/upload"
          className="px-5 py-2.5 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-[#659f1d]/20 flex items-center justify-center gap-2 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload Karya Baru</span>
        </Link>
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
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
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

    </div>
  );
}
