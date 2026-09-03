const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:8e3d1a4f280745feb9d43a0094e24ece@sa4ue85s.ap-southeast.database.insforge.app:5432/insforge?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  console.log('Connecting to PostgreSQL to seed data...');
  await pool.query('DELETE FROM comments;');
  await pool.query('DELETE FROM karya;');

  await pool.query(`
    INSERT INTO karya (
      id, category_id, title, description, author_name, author_class, type, content_url, media_urls, status, likes_count, views_count, featured, created_at, updated_at
    ) VALUES (
      '11111111-0000-0000-0000-000000000001',
      '11111111-1111-1111-1111-111111111111',
      'Poster Digital: Melestarikan Budaya Nusantara',
      'Ilustrasi vektor digital yang menggabungkan elemen batik ragam hias khas Nusantara dengan sentuhan gaya cyberpunk modern.',
      'Aulia Rahma',
      'XII DKV 1',
      'gambar',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      '["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80"]',
      'approved',
      34,
      182,
      true,
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '3 days'
    );

    INSERT INTO karya (
      id, category_id, title, description, author_name, author_class, type, text_content, status, likes_count, views_count, featured, created_at, updated_at
    ) VALUES (
      '11111111-0000-0000-0000-000000000003',
      '22222222-2222-2222-2222-222222222222',
      'Puisi: Jejak Langkah di Selasar Sekolah',
      'Rangkaian bait puisi bertema kenangan masa SMA, persahabatan, dan semangat meniti impian menuju masa depan.',
      'Dewi Lestari',
      'XI MIPA 3',
      'tulisan',
      'Di bawah naungan pohon rindang selasar,\nSuara tawa kita menggema hangat.\nDi antara barisan buku dan ruang belajar,\nKita rajut mimpi dengan tekad yang kuat.\n\nWaktu berlari tanpa ragu,\nMeninggalkan jejak di papan tulis biru.\nNamun persahabatan ini kan selalu bersatu,\nMenjadi pelita di setiap langkah baru.',
      'approved',
      28,
      145,
      false,
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '2 days'
    );

    INSERT INTO karya (
      id, category_id, title, description, author_name, author_class, type, content_url, status, likes_count, views_count, featured, created_at, updated_at
    ) VALUES (
      '11111111-0000-0000-0000-000000000004',
      '44444444-4444-4444-4444-444444444444',
      'Short Cinematic: Harmoni Alam Sekolah Kami',
      'Video dokumenter pendek berdurasi 3 menit yang menampilkan keindahan kebun hidroponik dan kegiatan gerakan peduli lingkungan hidup di sekolah.',
      'Bima Putra',
      'XII Multimedia',
      'video',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'approved',
      41,
      230,
      false,
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    );

    INSERT INTO karya (
      id, category_id, title, description, author_name, author_class, type, content_url, status, rejection_reason, likes_count, views_count, featured, created_at, updated_at
    ) VALUES (
      '11111111-0000-0000-0000-000000000006',
      '11111111-1111-1111-1111-111111111111',
      'Lukisan Cat Air: Senja di Lapangan Basket',
      'Sketsa dan lukisan cat air buatan tangan yang menangkap suasana senja hangat usai latihan basket.',
      'Siti Nurhaliza',
      'X IPS 2',
      'gambar',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      'rejected',
      'Mohon unggah foto lukisan dengan pencahayaan yang lebih terang dan jelas agar detail warna terlihat sempurna.',
      0,
      8,
      false,
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '4 days'
    );

    INSERT INTO comments (id, karya_id, author_name, content, created_at) VALUES
    ('comment-1', '11111111-0000-0000-0000-000000000003', 'Rian Hidayat (Siswa)', 'Puisinya sangat menyentuh dan mengingatkan pada kenangan sekolah!', NOW() - INTERVAL '5 hours'),
    ('comment-2', '11111111-0000-0000-0000-000000000003', 'Ibu Rahmawati (Guru Bahasa)', 'Bait puisinya memiliki rima yang bagus dan gaya bahasa yang indah. Selamat karya yang luar biasa!', NOW() - INTERVAL '2 hours'),
    ('comment-3', '11111111-0000-0000-0000-000000000001', 'Farhan DKV', 'Pencahayaan dan pemilihan warna cyberpunk-nya keren sekali!', NOW() - INTERVAL '10 hours');
  `);

  console.log('Seed completed successfully!');
  await pool.end();
}

seed().catch(err => {
  console.error('Seed Error:', err);
  pool.end();
});
