export type KaryaType = 'gambar' | 'video' | 'tulisan' | 'aplikasi';

export type KaryaStatus = 'pending' | 'approved' | 'rejected';

export type UserRole = 'siswa' | 'admin';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  nisnOrNip?: string;
  className?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Karya {
  id: string;
  userId?: string;
  categoryId?: string;
  title: string;
  description: string;
  authorName: string;
  authorClass: string;
  type: KaryaType;
  contentUrl?: string; // Main image or video embed URL
  mediaUrls?: string[]; // Gallery images
  textContent?: string; // Full article / poem / text
  appDemoUrl?: string; // Live demo link for app
  appRepoUrl?: string; // GitHub repository link for app
  status: KaryaStatus;
  rejectionReason?: string;
  likesCount: number;
  viewsCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModerationLog {
  id: string;
  karyaId: string;
  adminId?: string;
  action: 'approved' | 'rejected' | 'featured_toggled';
  note?: string;
  createdAt: string;
}
