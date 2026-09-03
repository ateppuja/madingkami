'use client';

import React, { useState, useEffect } from 'react';
import { Comment, UserRole } from '@/lib/types';
import { karyaService } from '@/lib/services/karyaService';
import { MessageSquare, Send, Trash2, Edit3, Check, X, Shield, User, Clock } from 'lucide-react';

interface CommentsSectionProps {
  karyaId: string;
}

export default function CommentsSection({ karyaId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Admin Mode & Edit State
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const fetchComments = async () => {
    setIsLoading(true);
    const data = await karyaService.getCommentsByKaryaId(karyaId);
    setComments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchComments();

    const checkAdmin = () => {
      const role = localStorage.getItem('mading_user_role') as UserRole;
      const isAuth = localStorage.getItem('mading_admin_authenticated') === 'true';
      setIsAdmin(role === 'admin' && isAuth);
    };

    checkAdmin();
    window.addEventListener('mading_role_changed', checkAdmin);
    return () => window.removeEventListener('mading_role_changed', checkAdmin);
  }, [karyaId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authorName.trim() || !content.trim()) {
      setError('Mohon isi nama Anda dan pesan komentar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await karyaService.addComment(karyaId, authorName.trim(), content.trim());
      setContent('');
      fetchComments();
    } catch (err) {
      console.error(err);
      setError('Gagal mengirim komentar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editingContent.trim()) return;
    await karyaService.updateComment(commentId, editingContent.trim());
    setEditingCommentId(null);
    setEditingContent('');
    fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      await karyaService.deleteComment(commentId);
      fetchComments();
    }
  };

  return (
    <section className="bg-white border border-[#e2ebd5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[#e2ebd5] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#eef5e4] text-[#548716] rounded-xl border border-[#d2e4b8]">
            <MessageSquare className="w-5 h-5 text-[#659f1d]" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl">
            Komentar Pengunjung ({comments.length})
          </h3>
        </div>

        {isAdmin && (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-700 font-extrabold text-xs rounded-full border border-amber-500/30 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Admin Moderasi Aktif
          </span>
        )}
      </div>

      {/* New Comment Submission Form */}
      <form onSubmit={handleAddComment} className="bg-[#f8faf4] border border-[#e2ebd5] p-4 sm:p-5 rounded-2xl space-y-4">
        <h4 className="text-xs font-extrabold text-[#548716] uppercase tracking-wider">
          Tulis Komentar atau Apresiasi Karya
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1 space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Lengkap / Peran *</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Contoh: Andi (Siswa XII DKV)"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700">Pesan Komentar *</label>
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis kesan, apresiasi, atau masukan untuk karya ini..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 focus:border-[#659f1d] rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#659f1d] hover:bg-[#548716] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#659f1d]/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-6 text-center text-slate-400 text-xs font-bold">Memuat komentar...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500 text-xs font-medium">
            Belum ada komentar. Jadilah yang pertama memberikan masukan!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-white border border-[#e2ebd5] rounded-2xl space-y-2 shadow-xs transition-all hover:border-[#659f1d]/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#eef5e4] border border-[#d2e4b8] flex items-center justify-center text-[#659f1d] font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-800 block">{comment.authorName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(comment.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Admin Actions: Edit & Delete Buttons */}
                {isAdmin && (
                  <div className="flex items-center gap-1.5">
                    {editingCommentId === comment.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 hover:bg-emerald-700"
                          title="Simpan Perubahan"
                        >
                          <Check className="w-3 h-3" /> Simpan
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-slate-300"
                          title="Batal"
                        >
                          <X className="w-3 h-3" /> Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(comment)}
                          className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-xs transition-all"
                          title="Edit Komentar (Admin)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 text-xs transition-all"
                          title="Hapus Komentar (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Body / Edit Form */}
              {editingCommentId === comment.id ? (
                <div className="pt-2 space-y-2">
                  <textarea
                    rows={2}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full p-2.5 bg-[#f8faf4] border border-[#659f1d] rounded-xl text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed font-normal pt-1">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>

    </section>
  );
}
