import { Karya, KaryaStatus, KaryaType, Comment } from '../types';
import { insforge, isInsForgeConfigured } from '../insforge';
import { INITIAL_KARYA, INITIAL_COMMENTS } from '../mockData';

// Local storage key for fallback mode persistence
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
    if (isInsForgeConfigured() && insforge) {
      try {
        let query = insforge.database.from('karya').select('*').eq('status', 'approved');
        if (typeFilter) query = query.eq('type', typeFilter);
        if (categoryId) query = query.eq('category_id', categoryId);
        
        const { data, error } = await query;
        if (!error && data) {
          return data as Karya[];
        }
      } catch (err) {
        console.warn('InsForge database query failed, falling back to local store', err);
      }
    }

    // Local Mock Fallback
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
    if (isInsForgeConfigured() && insforge) {
      try {
        const { data, error } = await insforge.database
          .from('karya')
          .select('*')
          .eq('status', 'pending');
        if (!error && data) return data as Karya[];
      } catch (err) {
        console.warn('InsForge pending query error, fallback to mock', err);
      }
    }
    return getLocalKarya().filter(k => k.status === 'pending');
  },

  // Fetch all karya (Admin or Student view)
  async getAllKarya(): Promise<Karya[]> {
    if (isInsForgeConfigured() && insforge) {
      try {
        const { data, error } = await insforge.database.from('karya').select('*');
        if (!error && data) return data as Karya[];
      } catch (err) {
        console.warn('InsForge query failed, using local store', err);
      }
    }
    return getLocalKarya();
  },

  // Fetch single karya by ID
  async getKaryaById(id: string): Promise<Karya | null> {
    if (isInsForgeConfigured() && insforge) {
      try {
        const { data, error } = await insforge.database
          .from('karya')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data as Karya;
      } catch (err) {
        console.warn('InsForge getById failed, using local store', err);
      }
    }
    const item = getLocalKarya().find(k => k.id === id);
    return item || null;
  },

  // Create new submission from Student
  async createKarya(newKarya: Omit<Karya, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'viewsCount' | 'status' | 'featured'>): Promise<Karya> {
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

    if (isInsForgeConfigured() && insforge) {
      try {
        const { data, error } = await insforge.database
          .from('karya')
          .insert([itemToInsert]);
        if (!error && data && data[0]) return data[0] as Karya;
      } catch (err) {
        console.warn('InsForge insert error, saving to local store', err);
      }
    }

    const currentList = getLocalKarya();
    const updated = [itemToInsert, ...currentList];
    saveLocalKarya(updated);
    return itemToInsert;
  },

  // Update status (Approve or Reject with note)
  async updateKaryaStatus(id: string, status: KaryaStatus, rejectionReason?: string): Promise<boolean> {
    if (isInsForgeConfigured() && insforge) {
      try {
        const { error } = await insforge.database
          .from('karya')
          .update({ 
            status, 
            rejection_reason: rejectionReason || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('InsForge update status error, fallback to local', err);
      }
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
    const item = await this.getKaryaById(id);
    if (!item) return false;
    const newFeaturedState = !item.featured;

    if (isInsForgeConfigured() && insforge) {
      try {
        const { error } = await insforge.database
          .from('karya')
          .update({ featured: newFeaturedState })
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('InsForge toggle featured error, fallback to local', err);
      }
    }

    const currentList = getLocalKarya();
    const updated = currentList.map(k => k.id === id ? { ...k, featured: newFeaturedState } : k);
    saveLocalKarya(updated);
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
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `karya-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    if (isInsForgeConfigured() && insforge && (insforge as any).storage) {
      try {
        const { data, error } = await (insforge as any).storage
          .from('mading-media')
          .upload(filePath, file);

        if (!error && data) {
          const { data: publicUrlData } = (insforge as any).storage
            .from('mading-media')
            .getPublicUrl(filePath);
          
          if (publicUrlData && publicUrlData.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('InsForge storage upload error, falling back to FileReader Data URL', err);
      }
    }

    // Fallback: Convert File to base64 Data URL for local preview & offline testing
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
    if (isInsForgeConfigured() && insforge) {
      try {
        const { data, error } = await insforge.database
          .from('comments')
          .select('*')
          .eq('karya_id', karyaId)
          .order('created_at', { ascending: true });
        if (!error && data) return data as Comment[];
      } catch (err) {
        console.warn('InsForge query comments failed, fallback to local', err);
      }
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

    if (isInsForgeConfigured() && insforge) {
      try {
        const { data, error } = await insforge.database
          .from('comments')
          .insert([{
            id: newComment.id,
            karya_id: karyaId,
            author_name: newComment.authorName,
            content: newComment.content,
            created_at: newComment.createdAt,
          }]);
        if (!error && data && data[0]) return data[0] as Comment;
      } catch (err) {
        console.warn('InsForge insert comment error, saving local', err);
      }
    }

    const currentComments = getLocalComments();
    const updated = [...currentComments, newComment];
    saveLocalComments(updated);
    return newComment;
  },

  async updateComment(commentId: string, newContent: string): Promise<boolean> {
    if (isInsForgeConfigured() && insforge) {
      try {
        const { error } = await insforge.database
          .from('comments')
          .update({ content: newContent.trim() })
          .eq('id', commentId);
        if (!error) return true;
      } catch (err) {
        console.warn('InsForge update comment error, fallback to local', err);
      }
    }

    const currentComments = getLocalComments();
    const updated = currentComments.map(c => c.id === commentId ? { ...c, content: newContent.trim() } : c);
    saveLocalComments(updated);
    return true;
  },

  async deleteComment(commentId: string): Promise<boolean> {
    if (isInsForgeConfigured() && insforge) {
      try {
        const { error } = await insforge.database
          .from('comments')
          .delete()
          .eq('id', commentId);
        if (!error) return true;
      } catch (err) {
        console.warn('InsForge delete comment error, fallback to local', err);
      }
    }

    const currentComments = getLocalComments();
    const updated = currentComments.filter(c => c.id !== commentId);
    saveLocalComments(updated);
    return true;
  }
};
