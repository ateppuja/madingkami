import { Karya, Category, Comment } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Seni & Desain', slug: 'seni', description: 'Lukisan, ilustrasi digital, dan sketsa karya siswa' },
  { id: 'cat-2', name: 'Sastra & Tulisan', slug: 'sastra', description: 'Puisi, cerpen, artikel, dan opini siswa' },
  { id: 'cat-4', name: 'Multimedia & Video', slug: 'multimedia', description: 'Video film pendek, vlog, dan sinematografi' },
  { id: 'cat-5', name: 'Sains & Inovasi', slug: 'sains', description: 'Karya ilmiah remaja dan eksperimen sains' }
];

export const INITIAL_KARYA: Karya[] = [
  {
    id: 'karya-1',
    userId: 'user-1',
    categoryId: 'cat-1',
    title: 'Poster Digital: Melestarikan Budaya Nusantara',
    description: 'Ilustrasi vektor digital yang menggabungkan elemen batik ragam hias khas Nusantara dengan sentuhan gaya cyberpunk modern.',
    authorName: 'Aulia Rahma',
    authorClass: 'XII DKV 1',
    type: 'gambar',
    contentUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    mediaUrls: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'approved',
    likesCount: 34,
    viewsCount: 182,
    featured: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'karya-3',
    userId: 'user-3',
    categoryId: 'cat-2',
    title: 'Puisi: Jejak Langkah di Selasar Sekolah',
    description: 'Rangkaian bait puisi bertema kenangan masa SMA, persahabatan, dan semangat meniti impian menuju masa depan.',
    authorName: 'Dewi Lestari',
    authorClass: 'XI MIPA 3',
    type: 'tulisan',
    textContent: `Di bawah naungan pohon rindang selasar,\nSuara tawa kita menggema hangat.\nDi antara barisan buku dan ruang belajar,\nKita rajut mimpi dengan tekad yang kuat.\n\nWaktu berlari tanpa ragu,\nMeninggalkan jejak di papan tulis biru.\nNamun persahabatan ini kan selalu bersatu,\nMenjadi pelita di setiap langkah baru.`,
    status: 'approved',
    likesCount: 28,
    viewsCount: 145,
    featured: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'karya-4',
    userId: 'user-4',
    categoryId: 'cat-4',
    title: 'Short Cinematic: Harmoni Alam Sekolah Kami',
    description: 'Video dokumenter pendek berdurasi 3 menit yang menampilkan keindahan kebun hidroponik dan kegiatan gerakan peduli lingkungan hidup di sekolah.',
    authorName: 'Bima Putra',
    authorClass: 'XII Multimedia',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    status: 'approved',
    likesCount: 41,
    viewsCount: 230,
    featured: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'karya-6',
    userId: 'user-6',
    categoryId: 'cat-1',
    title: 'Lukisan Cat Air: Senja di Lapangan Basket',
    description: 'Sketsa dan lukisan cat air buatan tangan yang menangkap suasana senja hangat usai latihan basket.',
    authorName: 'Siti Nurhaliza',
    authorClass: 'X IPS 2',
    type: 'gambar',
    contentUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    status: 'rejected',
    rejectionReason: 'Mohon unggah foto lukisan dengan pencahayaan yang lebih terang dan jelas agar detail warna terlihat sempurna.',
    likesCount: 0,
    viewsCount: 8,
    featured: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    karyaId: 'karya-3',
    authorName: 'Rian Hidayat (Siswa)',
    content: 'Puisinya sangat menyentuh dan mengingatkan pada kenangan sekolah!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'comment-2',
    karyaId: 'karya-3',
    authorName: 'Ibu Rahmawati (Guru Bahasa)',
    content: 'Bait puisinya memiliki rima yang bagus dan gaya bahasa yang indah. Selamat karya yang luar biasa!',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'comment-3',
    karyaId: 'karya-1',
    authorName: 'Farhan DKV',
    content: 'Pencahayaan dan pemilihan warna cyberpunk-nya keren sekali!',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  }
];
