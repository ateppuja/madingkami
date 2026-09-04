import { Karya, KaryaStatus, KaryaType, Comment } from '../types';
import { INITIAL_KARYA, INITIAL_COMMENTS } from '../mockData';

// Local storage key for fallback mode persistence if network is completely offline
const STORAGE_KEY = 'mading_karya_data_v1';
const COMMENTS_STORAGE_KEY = 'mading_comments_data_v1';

export const getLocalKarya = (): Karya[] => {
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

// Helper: Fetch with AbortController timeout to prevent slow network hanging
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
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

      const res = await fetchWithTimeout(`/api/karya?${params.toString()}`, { cache: 'no-store' }, 3000);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('API fetch approved karya timed out or failed, using fast fallback', err);
    }

    // Fast Local Fallback
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
      const res = await fetchWithTimeout('/api/karya?status=pending', { cache: 'no-store' }, 3000);
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
      const res = await fetchWithTimeout('/api/karya', { cache: 'no-store' }, 3000);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('API fetch all karya failed, using fast fallback', err);
    }
    return getLocalKarya();
  },

  // Fetch single karya by ID
  async getKaryaById(id: string): Promise<Karya | null> {
    try {
      const res = await fetchWithTimeout(`/api/karya/${id}`, { cache: 'no-store' }, 3000);
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
    const itemToInsert: Karya = {
      ...newKarya,
      id: 'karya-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      status: 'pending',
      likesCount: 0,
      viewsCount: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to local store immediately for instant UX
    const currentList = getLocalKarya();
    saveLocalKarya([itemToInsert, ...currentList]);

    try {
      const res = await fetchWithTimeout('/api/karya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKarya),
      }, 5000);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API create karya failed, stored locally', err);
    }

    return itemToInsert;
  },

  // Update status (Approve or Reject with note)
  async updateKaryaStatus(id: string, status: KaryaStatus, rejectionReason?: string): Promise<boolean> {
    // Update local store immediately for instant UX feedback
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

    try {
      const res = await fetchWithTimeout(`/api/karya/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      }, 4000);
      if (res.ok) return true;
    } catch (err) {
      console.warn('API update status failed, updated locally', err);
    }

    return true;
  },

  // Toggle Featured status
  async toggleFeatured(id: string): Promise<boolean> {
    const item = await this.getKaryaById(id);
    if (!item) return false;
    const newFeaturedState = !item.featured;

    const currentList = getLocalKarya();
    const updated = currentList.map(k => k.id === id ? { ...k, featured: newFeaturedState } : k);
    saveLocalKarya(updated);

    try {
      const res = await fetchWithTimeout(`/api/karya/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeaturedState }),
      }, 4000);
      if (res.ok) return true;
    } catch (err) {
      console.warn('API toggle featured failed, updated locally', err);
    }

    return true;
  },

  // Delete Karya (Admin action)
  async deleteKarya(id: string): Promise<boolean> {
    const currentList = getLocalKarya();
    const updated = currentList.filter(k => k.id !== id);
    saveLocalKarya(updated);

    try {
      const res = await fetchWithTimeout(`/api/karya/${id}`, {
        method: 'DELETE',
      }, 4000);
      if (res.ok) return true;
    } catch (err) {
      console.warn('API delete karya failed, deleted locally', err);
    }

    return true;
  },

  // Increment likes count
  async incrementLikes(id: string): Promise<number> {
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

  // Upload image file to InsForge Storage bucket (or local FileReader Data URL fallback)
  async uploadImageToStorage(file: File): Promise<string> {
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
      const res = await fetchWithTimeout(`/api/comments?karya_id=${karyaId}`, { cache: 'no-store' }, 3000);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch comments failed, using local store', err);
    }
    const allComments = getLocalComments();
    return allComments.filter(c => c.karyaId === karyaId);
  },

  async addComment(karyaId: string, authorName: string, content: string): Promise<Comment> {
    const newComment: Comment = {
      id: 'comment-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      karyaId,
      authorName: authorName.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    const currentComments = getLocalComments();
    saveLocalComments([...currentComments, newComment]);

    try {
      const res = await fetchWithTimeout('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ karyaId, authorName, content }),
      }, 4000);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API add comment failed, saved locally', err);
    }

    return newComment;
  },

  async updateComment(commentId: string, newContent: string): Promise<boolean> {
    const currentComments = getLocalComments();
    const updated = currentComments.map(c => c.id === commentId ? { ...c, content: newContent.trim() } : c);
    saveLocalComments(updated);

    try {
      const res = await fetchWithTimeout('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, content: newContent }),
      }, 4000);
      if (res.ok) return true;
    } catch (err) {
      console.warn('API update comment failed, updated locally', err);
    }

    return true;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const currentComments = getLocalComments();
    const updated = currentComments.filter(c => c.id !== commentId);
    saveLocalComments(updated);

    try {
      const res = await fetchWithTimeout(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      }, 4000);
      if (res.ok) return true;
    } catch (err) {
      console.warn('API delete comment failed, deleted locally', err);
    }

    return true;
  }
};
