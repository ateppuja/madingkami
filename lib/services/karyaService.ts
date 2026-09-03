import { Karya, KaryaStatus, KaryaType, Comment } from '../types';
import { INITIAL_KARYA, INITIAL_COMMENTS } from '../mockData';

// Local storage key for fallback mode persistence if network is completely offline
const STORAGE_KEY = 'mading_karya_data_v1';
const COMMENTS_STORAGE_KEY = 'mading_comments_data_v1';

const getLocalKarya = (): Karya[] => {
  if (typeof window === 'undefined') return INITIAL_KARYA;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_KARYA));
      return INITIAL_KARYA;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading local karya data:', e);
    return INITIAL_KARYA;
  }
};

const saveLocalKarya = (items: Karya[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local karya data:', e);
  }
};

const getLocalComments = (): Comment[] => {
  if (typeof window === 'undefined') return INITIAL_COMMENTS;
  try {
    const data = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(INITIAL_COMMENTS));
      return INITIAL_COMMENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading local comments data:', e);
    return INITIAL_COMMENTS;
  }
};

const saveLocalComments = (items: Comment[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local comments data:', e);
  }
};

export const karyaService = {
  // Fetch all approved karya for public mading
  async getApprovedKarya(typeFilter?: KaryaType, categoryId?: string, search?: string): Promise<Karya[]> {
    try {
      const params = new URLSearchParams({ status: 'approved' });
      if (typeFilter) params.append('type', typeFilter);
      if (categoryId) params.append('category_id', categoryId);
      if (search && search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/karya?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch approved karya failed, using local store', err);
    }

    // Local Fallback
    let list = getLocalKarya().filter(k => k.status === 'approved');
    if (typeFilter) list = list.filter(k => k.type === typeFilter);
    if (categoryId) list = list.filter(k => k.categoryId === categoryId);
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(k => 
        k.title.toLowerCase().includes(q) ||
        k.authorName.toLowerCase().includes(q) ||
        k.authorClass.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q)
      );
    }
    return list;
  },

  // Fetch pending karya for Admin Moderation queue
  async getPendingKarya(): Promise<Karya[]> {
    try {
      const res = await fetch('/api/karya?status=pending');
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch pending karya failed, using local store', err);
    }
    return getLocalKarya().filter(k => k.status === 'pending');
  },

  // Fetch all karya (Admin or Student view)
  async getAllKarya(): Promise<Karya[]> {
    try {
      const res = await fetch('/api/karya');
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch all karya failed, using local store', err);
    }
    return getLocalKarya();
  },

  // Fetch single karya by ID
  async getKaryaById(id: string): Promise<Karya | null> {
    try {
      const res = await fetch(`/api/karya/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch karya by id failed, using local store', err);
    }
    const item = getLocalKarya().find(k => k.id === id);
    return item || null;
  },

  // Create new submission from Student
  async createKarya(newKarya: Omit<Karya, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'viewsCount' | 'status' | 'featured'>): Promise<Karya> {
    try {
      const res = await fetch('/api/karya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKarya),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API create karya failed, saving to local store', err);
    }

    const itemToInsert: Karya = {
      ...newKarya,
      id: 'karya-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      status: 'pending',
      likesCount: 0,
      viewsCount: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const currentList = getLocalKarya();
    saveLocalKarya([itemToInsert, ...currentList]);
    return itemToInsert;
  },

  // Update status (Approve or Reject with note)
  async updateKaryaStatus(id: string, status: KaryaStatus, rejectionReason?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/karya/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('API update status failed, using local fallback', err);
    }

    const currentList = getLocalKarya();
    const updated = currentList.map(k => {
      if (k.id === id) {
        return {
          ...k,
          status,
          rejectionReason: rejectionReason || undefined,
          updatedAt: new Date().toISOString()
        };
      }
      return k;
    });
    saveLocalKarya(updated);
    return true;
  },

  // Toggle Featured status
  async toggleFeatured(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/karya/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_featured' }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('API toggle featured failed, using local fallback', err);
    }

    const item = await this.getKaryaById(id);
    if (!item) return false;
    const currentList = getLocalKarya();
    const updated = currentList.map(k => k.id === id ? { ...k, featured: !k.featured } : k);
    saveLocalKarya(updated);
    return true;
  },

  // Increment likes count
  async incrementLikes(id: string): Promise<number> {
    try {
      const res = await fetch(`/api/karya/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.likesCount || 0;
      }
    } catch (err) {
      console.warn('API increment likes failed, using local fallback', err);
    }

    const list = getLocalKarya();
    let newLikes = 0;
    const updated = list.map(k => {
      if (k.id === id) {
        newLikes = (k.likesCount || 0) + 1;
        return { ...k, likesCount: newLikes };
      }
      return k;
    });
    saveLocalKarya(updated);
    return newLikes;
  },

  // Upload image file
  async uploadImageToStorage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (err) {
      console.warn('API upload failed, falling back to FileReader Data URL', err);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to Data URL'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  // --- COMMENTS FEATURE ---
  async getCommentsByKaryaId(karyaId: string): Promise<Comment[]> {
    try {
      const res = await fetch(`/api/comments?karya_id=${karyaId}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch comments failed, using local fallback', err);
    }
    const allComments = getLocalComments();
    return allComments.filter(c => c.karyaId === karyaId);
  },

  async addComment(karyaId: string, authorName: string, content: string): Promise<Comment> {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ karyaId, authorName, content }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API add comment failed, saving to local store', err);
    }

    const newComment: Comment = {
      id: 'comment-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      karyaId,
      authorName: authorName.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    const currentComments = getLocalComments();
    saveLocalComments([...currentComments, newComment]);
    return newComment;
  },

  async updateComment(commentId: string, newContent: string): Promise<boolean> {
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, content: newContent }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('API update comment failed, using local fallback', err);
    }

    const currentComments = getLocalComments();
    const updated = currentComments.map(c => c.id === commentId ? { ...c, content: newContent.trim() } : c);
    saveLocalComments(updated);
    return true;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('API delete comment failed, using local fallback', err);
    }

    const currentComments = getLocalComments();
    const updated = currentComments.filter(c => c.id !== commentId);
    saveLocalComments(updated);
    return true;
  }
};
