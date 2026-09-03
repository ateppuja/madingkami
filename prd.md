# Product Requirement Document (PRD)
## Mading Online Karya Siswa

---

## 1. Document Information
- **Project Name:** Mading Online Karya Siswa
- **Tech Stack:** Next.js (App Router), InsForge BaaS (PostgreSQL, Auth, Storage), Tailwind CSS
- **Version:** 1.0 (MVP Specification & Future Roadmap)
- **Status:** Approved / In Planning

---

## 2. Vision & Objectives

### 2.1 Vision
Menjadi platform mading digital sekolah yang modern, inklusif, dan menginspirasi bagi siswa untuk memamerkan kreativitas mereka dalam berbagai bidang (Seni, Sastra, Teknologi, dan Multimedia), dengan alur kurasi yang aman dan terverifikasi oleh pihak sekolah.

### 2.2 Objectives
1. **Wadah Kreativitas Terstruktur:** Memfasilitasi 4 tipe media karya (Gambar, Video, Tulisan, Aplikasi).
2. **Penjaminan Mutu Konten:** Memastikan setiap karya yang tampil di mading publik telah diverifikasi dan disetujui oleh Admin/Guru.
3. **Pengalaman Pengguna yang Intuitive:** Menyediakan antarmuka mading publik yang responsif, estetis, serta mudah dicari dan disaring.
4. **Kecepatan & Kemudahan Integrasi:** Menggunakan InsForge sebagai backend-as-a-service yang aman, fleksibel, dan mendukung skenario pengembangan modern.

---

## 3. Target Audience & User Personas

| Persona | Peran | Kebutuhan Utama |
|---|---|---|
| **Siswa (Student Creator)** | Pengunggah Karya | - Mengunggah karya dalam format Gambar, Video, Tulisan, atau Aplikasi.<br>- Memantau status verifikasi karya (Pending, Disetujui, Ditolak).<br>- Mendapatkan masukan/alasan jika karya ditolak. |
| **Admin (Guru Pembina / Mod)** | Kurator & Pengelola | - Memeriksa antrean verifikasi karya siswa.<br>- Menyetujui atau menolak karya dengan catatan/umpan balik.<br>- Mengatur karya sorotan (*Featured*) dan mengelola kategori. |
| **Pengunjung (Siswa / Guru / Umum)** | Penikmat Mading | - Menjelajahi karya yang terbit.<br>- Menyaring karya berdasarkan format (Gambar, Video, Tulisan, Aplikasi) dan kategori.<br>- Memberikan apresiation (Like, Komentar). |

---

## 4. Release Roadmap & Scope Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCT RELEASE ROADMAP                            │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│    MVP (v1.0)     │   Version 1.1     │   Version 1.2     │   Version 2.0   │
│ Core Moderation & │ Engagement & Social│ Analytics & Badge │  AI Assistant & │
│ Multi-Format Work │   Interactivity   │   Gamification    │ Digital Portfolio│
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

### 4.1 Version 1.0 — MVP (Minimum Viable Product)
*Fokus Utama: Alur dasar upload karya, moderasi admin, dan tampilan mading publik.*

- **Multi-Format Submission (Siswa):**
  - Form upload karya dengan 4 pilihan tipe media:
    1. 🖼️ **Gambar:** Photo/Artwork (JPEG/PNG/WebP upload atau URL).
    2. 🎬 **Video:** Embed YouTube/Vimeo atau MP4 link.
    3. 📝 **Tulisan:** Artikel, puisi, cerpen (Editor teks terstruktur).
    4. 💻 **Aplikasi:** Tautan Live Demo, Repository (GitHub), dan screenshot preview.
  - Form meta data: Judul, Deskripsi, Nama Siswa, Kelas/NISN, Kategori.

- **Admin Verification & Moderation Dashboard:**
  - Antrean karya `pending` (Menunggu Verifikasi).
  - Aksi 1-Klik: **Setujui (Approve)** → Langsung terbit di mading publik.
  - Aksi **Tolak (Reject)** → Modal input alasan penolakan untuk dikirim ke siswa.
  - Fitur **Pilih Featured Karya** (pin karya terbaik ke hero banner).

- **Student Status Dashboard:**
  - Halaman karya milik siswa bersangkutan.
  - Indikator status visual:
    - 🟡 **Menunggu Verifikasi** (Pending)
    - 🟢 **Disetujui / Terbit** (Approved)
    - 🔴 **Ditolak** (Rejected - beserta pesan alasan dari Admin)

- **Public Mading Portal:**
  - Grid card karya yang responsif dan estetis.
  - Tab Filter Media: Semua, Gambar, Video, Tulisan, Aplikasi.
  - Filter Kategori: Seni, Sastra, Teknologi, Multimedia, Sains.
  - Fitur Pencarian (Search bar): Judul, Nama Siswa, Kelas.
  - Modal / Page Viewer detail karya (Khusus tampilan gambar, player video, reader artikel, & preview aplikasi).

---

### 4.2 Version 1.1 — Interactivity & Social Engagement
*Fokus Utama: Apresiasi dan interaksi komunitas sekolah.*

- **Apresiasi & Like System:**
  - Tombol Love / Like pada setiap karya dengan penghitung real-time.
- **Komentar Terverifikasi:**
  - Kolom komentar di halaman detail karya.
  - Opsi auto-moderasi kata kasar / opsi review komentar oleh admin.
- **Mode Berbagi (Share & Print Mading):**
  - Tombol Bagikan ke WhatsApp, Salin Tautan.
  - Mode **QR Code Generator** untuk dicetak di mading fisik sekolah agar siswa dapat mendeteksi versi digitalnya melalui smartphone.

---

### 4.3 Version 1.2 — Gamification & Analytics
*Fokus Utama: Laporan sekolah dan motivasi siswa.*

- **Papan Peringkat (Leaderboard):**
  - "Karya Terfavorit Mingguan/Bulanan".
  - "Siswa Terproduktif" berdasarkan jumlah karya disetujui.
- **Sistem Lencana / Badges:**
  - Badge prestasi otomatis untuk siswa (contoh: *Master Penulis*, *Tekno Inovator*, *Artisan Sekolah*).
- **Admin Analytics & School Reports:**
  - Grafik tren pengajuan karya per bulan.
  - Statistik partisipasi per kelas/jurusan.
  - Fitur ekspor ringkasan laporan ke PDF/Excel untuk Kepala Sekolah/Guru Pembina.

---

### 4.4 Version 2.0 — AI Assistant & Digital Portfolio Network
*Fokus Utama: Kecerdasan buatan dan portofolio kelulusan siswa.*

- **AI Content Pre-screening (InsForge AI Gateway):**
  - Deteksi otomatis kelayakan gambar/teks dari potensi unsur ujaran kebencian/SARA sebelum masuk antrean admin.
  - AI Auto-tagging & Saran Kategori.
- **Digital Student Portfolio Generator:**
  - Mengubah seluruh karya siswa yang telah disetujui selama masa sekolah menjadi link **Portofolio Digital Siswa** yang siap dipakai untuk melamar perguruan tinggi / kerja.
- **Multi-School Showcase Federation:**
  - Kemampuan menghubungkan mading antar-sekolah untuk ajang kompetisi atau pertukaran karya regional.

---

## 5. Database Schema Specification (InsForge / PostgreSQL)

### 5.1 Table: `karya`
| Field | Type | Description |
|---|---|---|
| `id` | `UUID` (PK) | Unique Identifier |
| `title` | `VARCHAR(255)` | Judul karya |
| `description` | `TEXT` | Ringkasan/Deskripsi karya |
| `author_name` | `VARCHAR(100)` | Nama siswa |
| `author_class` | `VARCHAR(50)` | Kelas siswa (contoh: XII IPA 1) |
| `category` | `VARCHAR(50)` | Kategori (Seni, Sastra, Teknologi, dll) |
| `type` | `VARCHAR(20)` | `gambar` \| `video` \| `tulisan` \| `aplikasi` |
| `content_url` | `TEXT` | Link media (Gambar/Video URL) |
| `media_urls` | `JSONB` / `TEXT[]` | Daftar URL gambar tambahan/galeri |
| `text_content` | `TEXT` | Isi lengkap tulisan (khusus tipe `tulisan`) |
| `app_demo_url` | `TEXT` | Link Live Demo (khusus tipe `aplikasi`) |
| `app_repo_url` | `TEXT` | Link Source Code (khusus tipe `aplikasi`) |
| `status` | `VARCHAR(20)` | `pending` \| `approved` \| `rejected` |
| `rejection_reason` | `TEXT` | Catatan penolakan dari admin |
| `likes_count` | `INT` | Jumlah suka (Default: 0) |
| `views_count` | `INT` | Jumlah tayangan (Default: 0) |
| `featured` | `BOOLEAN` | Status karya disorot (Default: false) |
| `created_at` | `TIMESTAMP` | Waktu buat |
| `updated_at` | `TIMESTAMP` | Waktu pembaruan |

---

## 6. Non-Functional Requirements

1. **Performance:** Waktu muat halaman publik < 2 detik, kompresi gambar otomatis saat upload.
2. **Security:** Proteksi endpoint admin, enkripsi variabel lingkungan InsForge.
3. **Responsiveness:** Tampilan 100% responsif pada perangkat Smartphone (Mobile), Tablet, dan Desktop/TV Display Mading Sekolah.
4. **Reliability:** Mendukung mode uji coba offline/mock jika koneksi jaringan atau kredensial BaaS belum aktif.
