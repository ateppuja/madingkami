# Task Breakdown Document
## Mading Online Karya Siswa

Dokumen ini memuat breakdown daftar tugas pengkodean (*tasks & sub-tasks*) berdasarkan User Stories pada [PRD Document](file:///d:/mading/prd.md) dan arsitektur database [ERD Document](file:///d:/mading/erd.md).

---

## 🟢 PHASE 1: MVP (Minimum Viable Product - Release v1.0)

---

### 📦 TASK 0: Project Setup & Boilerplate Architecture
**Target File / Folder:** `package.json`, `app/layout.tsx`, `app/globals.css`, `lib/types.ts`, `lib/insforge.ts`, `lib/services/karyaService.ts`

- **1. Detail Spec:**
  - Menginisialisasi proyek Next.js 14 App Router dengan TypeScript, Tailwind CSS, Lucide Icons, dan Framer Motion.
  - Membuat definisi tipe data TypeScript (`lib/types.ts`) mencakup `Karya`, `User`, `Category`, `KaryaType`, `KaryaStatus`, dan `ModerationLog`.
  - Mengonfigurasi InsForge Client (`lib/insforge.ts`) menggunakan `@insforge/sdk`.
  - Membuat `karyaService.ts` dengan skenario *Auto-Fallback Mock Storage*: jika `NEXT_PUBLIC_INSFORGE_BASE_URL` terdeteksi maka menggunakan SDK InsForge, jika tidak maka menggunakan penyimpanan memori/localStorage lokal dengan data awal sampel karya siswa.
  - Membuat tata letak utama (`app/layout.tsx`) dengan Header Navbar (Logo Mading, Menu Navigasi, & Switcher Mode User) dan Footer.

- **2. Acceptance Criteria:**
  - [x] Proyek dapat dijalankan tanpa error melalui command `npm run dev` dan `npm run build`.
  - [x] Pengaturan Tailwind CSS & Lucide Icons berfungsi dengan baik pada seluruh komponen.
  - [x] Service `karyaService.ts` berhasil menyediakan method CRUD (`getAllApproved`, `getPending`, `createKarya`, `updateStatus`, `getById`) secara transparan baik dalam mode InsForge maupun Mock.
  - [x] Header Navbar responsif dan menampilkan tombol navigasi: `Mading Utama`, `Upload Karya`, `Dashboard Siswa`, dan `Admin Portal`.

---

### 📝 TASK 1: US-01 - Siswa Upload Karya Multi-Format
**Target File:** `app/upload/page.tsx`, `components/upload/`

- **Sub-task 1.1:** Form Dasar & Selector Tipe Media (Gambar, Video, Tulisan, Aplikasi).
- **Sub-task 1.2:** Dynamic Form Input sesuai Tipe Media (File Upload/URL Gambar, Embed Link Video, Rich Text Editor Tulisan, Live Demo & Repo URL Aplikasi).
- **Sub-task 1.3:** Pengisian Metadata Karya (Judul, Deskripsi, Nama Siswa, Kelas/NISN, Kategori).

- **1. Detail Spec:**
  - Membuat halaman formulir interaktif di `app/upload/page.tsx`.
  - Menyediakan tab/card selector 4 format media. Tampilan input form menyesuaikan secara dinamis:
    - 🖼️ **Gambar:** Input URL Gambar atau upload file preview.
    - 🎬 **Video:** Input URL YouTube / Vimeo / MP4 video link.
    - 📝 **Tulisan:** Textarea/Editor terstruktur untuk isi cerita/puisi/artikel.
    - 💻 **Aplikasi:** Input Tautan Live Demo, Repository GitHub, dan Screenshot Preview.
  - Validasi field wajib (Judul, Nama, Kelas, Kategori, dan konten media).
  - Menyimpan karya baru ke database melalui `karyaService.createKarya()` dengan status awal default `pending`.

- **2. Acceptance Criteria:**
  - [x] Siswa dapat memilih satu dari 4 tipe media, dan field input menyesuaikan tanpa reload halaman.
  - [x] Mengirim form yang tidak lengkap memunculkan pesan error validasi yang jelas.
  - [x] Setelah form disubmit, karya tersimpan dengan status `pending` dan pengguna diarahkan ke halaman `/siswa/dashboard` dengan notifikasi sukses.

---

### 📊 TASK 2: US-02 - Siswa Dashboard & Status Verifikasi
**Target File:** `app/siswa/dashboard/page.tsx`

- **1. Detail Spec:**
  - Membuat halaman dashboard khusus siswa di `app/siswa/dashboard/page.tsx`.
  - Menampilkan daftar karya yang diunggah oleh siswa bersangkutan.
  - Menampilkan indikator status visual:
    - 🟡 **Menunggu Verifikasi (Pending):** Badge kuning dengan pesan edukatif.
    - 🟢 **Disetujui & Terbit (Approved):** Badge hijau dengan tautan langsung ke tampilan mading publik.
    - 🔴 **Ditolak (Rejected):** Badge merah beserta kotak pesan khusus yang menampilkan **Alasan Penolakan dari Admin**.
  - Menyediakan statistik ringkasan siswa (Total Upload, Terbit, Menunggu).

- **2. Acceptance Criteria:**
  - [ ] Siswa dapat melihat seluruh karya milik mereka beserta badge status warna yang tepat.
  - [ ] Karya dengan status `rejected` menampilkan catatan/alasan penolakan dari admin dengan jelas.
  - [ ] Terdapat tombol aksi cepat "+ Upload Karya Baru".

---

### 🛡️ TASK 3: US-03 - Admin Moderasi & Verifikasi Karya
**Target File:** `app/admin/page.tsx`, `components/admin/AdminActionModal.tsx`

- **Sub-task 3.1:** Admin Dashboard Interface & Antrean Verifikasi Karya (`pending`).
- **Sub-task 3.2:** Aksi Moderasi 1-Klik **Setujui (Approve)** dan **Tolak (Reject)** (dengan Modal Input Alasan Penolakan).
- **Sub-task 3.3:** Tab Manajemen Karya Publik & Fitur **Featured Karya** (Pin/Unpin ke Hero Banner).

- **1. Detail Spec:**
  - Membuat dasbor admin di `app/admin/page.tsx`.
  - Menyediakan 2 Tab Utama:
    1. **Antrean Verifikasi (Pending):** Menampilkan daftar karya siswa yang menunggu persetujuan admin.
    2. **Karya Publik (Approved):** Menampilkan karya yang sudah terbit di mading.
  - Pada Antrean Pending:
    - Tombol **Setujui:** Mengubah status karya menjadi `approved` (otomatis terbit di mading).
    - Tombol **Tolak:** Membuka modal `AdminActionModal` untuk mengisi alasan penolakan, lalu mengubah status menjadi `rejected`.
  - Pada Karya Approved:
    - Tombol **Sorot / Featured:** Mengaktifkan flag `featured` untuk menampilkan karya di Hero Banner utama.
    - Tombol **Hapus / Unpublish:** Menarik karya dari publikasi.

- **2. Acceptance Criteria:**
  - [x] Admin dapat melihat jumlah antrean pending pada kartu counter ringkasan.
  - [x] Menekan tombol "Setujui" memindahkan karya dari antrean pending ke daftar terbit dan database memperbarui `status = 'approved'`.
  - [x] Menekan tombol "Tolak" mengharuskan admin menginput alasan penolakan, lalu memperbarui `status = 'rejected'` dan `rejection_reason`.
  - [x] Admin dapat menyalakan/mematikan status `featured` pada karya yang disetujui.

---

### 🎨 TASK 4: US-04 - Public Mading Showcase, Filter, & Search
**Target File:** `app/page.tsx`, `components/KaryaCard.tsx`, `components/MediaFilterTabs.tsx`

- **Sub-task 4.1:** Hero Banner Showcase & Section Karya Sorotan (*Featured*).
- **Sub-task 4.2:** Filter Tab Media (Semua, Gambar, Video, Tulisan, Aplikasi) & Filter Kategori Tematik.
- **Sub-task 4.3:** Kolom Pencarian Real-Time (Search Bar Judul, Nama Siswa, Kelas).
- **Sub-task 4.4:** Grid Responsive Karya Card (`components/KaryaCard.tsx`).

- **1. Detail Spec:**
  - Membuat halaman beranda utama di `app/page.tsx`.
  - Hero banner menampilkan karya sorotan (*Featured*) dengan animasi transisi yang menarik.
  - Menyediakan tab filter media visual: **Semua**, 🖼️ **Gambar**, 🎬 **Video**, 📝 **Tulisan**, 💻 **Aplikasi**.
  - Menyediakan dropdown/badge filter kategori (Seni, Sastra, Teknologi, Multimedia, Sains).
  - Menyediakan kolom pencarian cepat berdasarkan kata kunci judul, nama siswa, atau kelas.
  - Menyusun karya publik (`status = 'approved'`) dalam bentuk Responsive Card Grid (1 kolom di mobile, 2 di tablet, 3-4 di desktop).

- **2. Acceptance Criteria:**
  - [x] Halaman utama hanya menampilkan karya yang telah berstatus `approved`.
  - [x] Klik tab filter media (misal "Video") langsung menyaring grid karya secara presisi tanpa lag.
  - [x] Kolom pencarian menyaring karya secara real-time berdasarkan input kata kunci pengguna.
  - [x] Setiap card karya menampilkan thumbnail, badge tipe media, judul, nama siswa, kelas, kategori, dan tombol lihat detail.

---

### 👁️ TASK 5: US-05 - Detail Viewer Karya Siswa Per Format Media
**Target File:** `app/karya/[id]/page.tsx`, `components/viewers/`

- **1. Detail Spec:**
  - Membuat halaman detail dinamis di `app/karya/[id]/page.tsx`.
  - Menyediakan layout viewer khusus yang beradaptasi sesuai tipe karya:
    - 🖼️ **Gambar:** Display gambar resolusi tinggi dengan kemampuan lightbox / zoom dan galeri multi-foto.
    - 🎬 **Video:** Player video embed (YouTube/Vimeo) atau HTML5 Video player.
    - 📝 **Tulisan:** Reader layout dengan tipografi yang rapi (gaya artikel/puisi mading).
    - 💻 **Aplikasi:** Display card interaktif dengan tombol besar "🚀 Buka Live Demo", link Repository GitHub, serta gambar screenshot aplikasi.
  - Menampilkan informasi kreator (Nama, Kelas, Tanggal Terbit, Kategori).
  - Menyediakan tombol navigasi "Kembali ke Mading".

- **2. Acceptance Criteria:**
  - [x] Membuka detail karya menampilkan tata letak viewer yang sesuai dengan tipe media karya tersebut.
  - [x] Pada karya tipe aplikasi, tautan Live Demo dan GitHub Repository dapat diklik dan membuka tab baru.
  - [x] Pada karya tipe video, video dapat diputar langsung di dalam halaman.

---

## 🔵 PHASE 2: Interactivity & Social Engagement (Release v1.1)

---

### 💖 TASK 6: US-06 - Apresiasi (Like) & Sistem Komentar
**Target File:** `components/viewers/LikeButton.tsx`, `components/viewers/CommentSection.tsx`

- **1. Detail Spec:**
  - Menambahkan tombol Love/Like di halaman detail karya yang memperbarui `likes_count` secara real-time.
  - Menambahkan kolom komentar di bagian bawah detail karya bagi siswa/pengunjung untuk memberikan umpan balik positif.

- **2. Acceptance Criteria:**
  - [ ] Jumlah like bertambah saat diklik dan tersimpan di database.
  - [ ] Komentar baru muncul pada daftar komentar karya.

---

### 📱 TASK 7: US-07 - Share WhatsApp & Generator QR Code Mading Fisik
**Target File:** `components/viewers/ShareModal.tsx`, `components/QRCodeModal.tsx`

- **1. Detail Spec:**
  - Menyediakan modal berbagi cepat (WhatsApp Share & Copy Link).
  - Menyediakan fitur generator QR Code per karya agar dapat dicetak dan ditempel di papan mading fisik sekolah.

- **2. Acceptance Criteria:**
  - [ ] QR Code karya dapat di-generate dan diunduh/dicetak dengan resolusi tinggi.

---

## 🟡 PHASE 3: Gamification & Analytics (Release v1.2)

---

### 🏆 TASK 8: US-08 - Leaderboard, Badges, & Laporan Rekap Sekolah
**Target File:** `app/leaderboard/page.tsx`, `app/admin/reports/page.tsx`

- **1. Detail Spec:**
  - Halaman Papan Peringkat Karya Terfavorit & Siswa Terproduktif.
  - Sistem pemberian lencana digital otomatis (*Artisan Sekolah*, *Tekno Inovator*).
  - Fitur admin untuk mengekspor rekapitulasi data karya ke PDF/Excel.

- **2. Acceptance Criteria:**
  - [ ] Leaderboard menampilkan peringkat karya terbaik berdasar akumulasi like & tampilan.
  - [ ] Laporan rekapitulasi karya sekolah dapat diekspor.
