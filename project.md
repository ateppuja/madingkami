# PROJECT DOCUMENTATION
## Mading Online Karya Siswa (Next.js + InsForge)

Platform mading digital sekolah berbasis web untuk publikasi karya siswa (Gambar, Video, Tulisan, Aplikasi) dengan alur verifikasi dan kurasi dari Admin sekolah.

---

## 1. Tech Stack Overview

- **Frontend Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling UI:** Tailwind CSS, Framer Motion (Animasi & Transisi), Lucide Icons
- **Backend-as-a-Service:** InsForge BaaS (`@insforge/sdk`)
  - **Database:** PostgreSQL (Tabel `karya`, `comments`, `likes`)
  - **Storage:** InsForge Storage Bucket (`mading-media`)
  - **Auth:** InsForge Auth / Role-based Session
- **Deployment Ready:** Vercel / Netlify / Node.js Server

---

## 2. Project Architecture & Directory Layout

```
d:/mading/
├── app/
│   ├── layout.tsx              # Root Layout, Navigation Header & Footer
│   ├── page.tsx                # Halaman Mading Utama (Public Showcase & Filter)
│   ├── upload/
│   │   └── page.tsx            # Form Upload Karya Siswa (4 Tipe Media)
│   ├── siswa/
│   │   └── dashboard/
│   │       └── page.tsx        # Dashboard Status Karya Siswa (Pending, Approved, Rejected)
│   ├── admin/
│   │   └── page.tsx            # Dashboard Admin Moderasi (Antrean Verifikasi & Publisher)
│   └── karya/
│       └── [id]/
│           └── page.tsx        # Halaman Detail Viewer Karya (Custom Layout per Tipe)
├── components/
│   ├── Navbar.tsx              # Header Navigasi & Switcher Status Role
│   ├── Footer.tsx              # Footer Mading Sekolah
│   ├── KaryaCard.tsx           # Card Komponen Karya di Grid
│   ├── MediaFilterTabs.tsx     # Filter Tab Media (Semua, Gambar, Video, Tulisan, Aplikasi)
│   ├── CategoryBadge.tsx       # Badge Kategori Karya
│   ├── AdminActionModal.tsx    # Modal Alasan Penolakan / Catatan Admin
│   └── viewers/                # Viewer Khusus (Gambar Lightbox, Video Player, Article Reader, App Preview)
├── lib/
│   ├── types.ts                # Type Definitions (Karya, User, Category, Status)
│   ├── insforge.ts             # InsForge Client Initialization (`@insforge/sdk`)
│   ├── services/
│   │   └── karyaService.ts     # Unified CRUD Service (Auto-detect InsForge vs Mock Fallback)
│   └── mockData.ts             # Data Sampel Awal Karya Siswa
├── prd.md                      # Product Requirement Document
├── project.md                  # Dokumentasi Proyek Ini
└── .env.local                  # Environment Variables InsForge
```

---

## 3. Environment Variables Configuration

Buat file `.env.local` di root proyek untuk menyambungkan ke backend InsForge Anda:

```env
# InsForge Credentials
NEXT_PUBLIC_INSFORGE_BASE_URL=https://your-project.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-insforge-anon-key
```

*Catatan: Apabila variabel lingkungan di atas belum diisi, aplikasi secara otomatis berjalan dalam **Mock Local Storage Mode** sehingga dapat diuji langsung tanpa kendala koneksi.*

---

## 4. Feature Development Checklist & Versioning Roadmap

### 🟢 Version 1.0 — MVP (Current Release)
- [x] Perancangan PRD & Project Documentation
- [ ] Setup Next.js 14 App Router, Tailwind CSS, & Lucide Icons
- [ ] Definisi Tipe Data (`lib/types.ts`) & Mock Storage Fallback (`lib/services/karyaService.ts`)
- [ ] Integrasi InsForge SDK (`@insforge/sdk`)
- [ ] Halaman Mading Publik (`/`): Grid Karya, Tab Filter Media (Gambar, Video, Tulisan, Aplikasi), Kategori, & Search
- [ ] Form Upload Karya Siswa (`/upload`): Dukungan 4 Tipe Media & Form Meta Data
- [ ] Halaman Status Siswa (`/siswa/dashboard`): Status Pending, Approved, Rejected + Alasan Penolakan
- [ ] Dashboard Admin Moderasi (`/admin`): Antrean Verifikasi 1-Klik Approve & Modal Reject dengan Catatan
- [ ] Halaman Detail Viewer Karya (`/karya/[id]`): Layout Responsif Khusus per Format Media

---

### 🔵 Version 1.1 — Interactivity & Social Engagement
- [ ] Tombol Like / Apresiasi Karya Real-Time
- [ ] Sistem Komentar Siswa pada Karya Terbit
- [ ] Modal QR Code Generator untuk Cetak Mading Fisik Sekolah
- [ ] Tombol Share ke WhatsApp & Copy Direct Link

---

### 🟡 Version 1.2 — Analytics & Gamification
- [ ] Leaderboard Karya Terfavorit & Siswa Terproduktif
- [ ] System Lencana Prestasi Siswa (Artisan, Tekno Innovator, Master Penulis)
- [ ] Admin Analytics Dashboard & Ekspor Laporan Rekap ke PDF/Excel

---

### 💜 Version 2.0 — AI Assistant & Digital Portfolio
- [ ] InsForge AI Gateway Pre-screening (Filter Otimatis SARA / Konten Negatif)
- [ ] Generator Portofolio Digital Kelulusan Siswa
- [ ] Jaringan Mading Antar-Sekolah (Multi-School Federation)

---

## 5. Instructions to Run the Project

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```
