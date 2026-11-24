// Kategori 1: daftar produk sate
// Sate dijual per tusuk, tetapi ayam dan taichan memiliki pilihan paket tetap
export const produkList = [

  {
    id: "sate-ayam", // ID unik produk
    nama: "Sate Ayam", // Nama produk
    gambar: "/images/sate-ayam.jpg", // Lokasi file gambar produk
    deskripsi: "Sate ayam dengan cita rasa gurih dan nikmat. Tersedia dalam pilihan 5, 10, 15, dan 20 tusuk.", // Deskripsi pada halaman produk
    deskripsiHome: "Sate ayam gurih, pilihan 5, 10, 15, atau 20 tusuk.", // Deskripsi singkat pada halaman Home
    hargaPerTusuk: 2000, // Harga satu tusuk sate
    paket: [5, 10, 15, 20], // Pilihan jumlah tusuk yang tersedia
    labelHarga: "Mulai dari Rp 10.000" // Tulisan harga yang ditampilkan pada kartu produk
  },

  {
    id: "sate-taichan",
    nama: "Sate Taichan",
    gambar: "/images/sate-taichan.jpg",
    deskripsi: "Sate taichan dengan rasa gurih dan cita rasa khas yang cocok dinikmati kapan saja.",
    deskripsiHome: "Sate taichan gurih khas, pilihan 5 sampai 20 tusuk.",
    hargaPerTusuk: 2000,
    paket: [5, 10, 15, 20],
    labelHarga: "Mulai dari Rp 10.000"
  },

  {
    id: "sate-kambing",
    nama: "Sate Kambing",
    gambar: "/images/sate-kambing.jpg",
    deskripsi: "Sate kambing dengan potongan daging yang nikmat dan cocok untuk pecinta sate kambing.",
    deskripsiHome: "Sate kambing lezat, Rp3.000 per tusuk.",
    hargaPerTusuk: 3000,

    // null berarti produk tidak memiliki pilihan paket tetap
    paket: null,

    labelHarga: "Rp 3.000 / tusuk"
  },

  {
    id: "sate-sapi",
    nama: "Sate Sapi",
    gambar: "/images/sate-sapi.jpg",
    deskripsi: "Sate sapi dengan rasa gurih dan cocok dinikmati bersama keluarga maupun teman.",
    deskripsiHome: "Sate sapi gurih, Rp3.000 per tusuk.",
    hargaPerTusuk: 3000,
    paket: null,
    labelHarga: "Rp 3.000 / tusuk"
  },
];

// Kategori 2: daftar makanan pendamping
// Makanan pendamping dijual per porsi
// CATATAN: harga sayur asem dan file gambar dapat disesuaikan
export const tambahanList = [

  {
    id: "kuah-sop",
    nama: "Kuah Sop",
    harga: 0,
    gambar: "/images/kuah-sop.jpg",
    deskripsi: "Kuah sop hangat sebagai teman makan sempurna.",
    labelHarga: "Gratis"
  },

  {
    id: "lontong",
    nama: "Lontong",
    harga: 5000,
    gambar: "/images/lontong.jpg",
    deskripsi: "Lontong lembut, pas dengan bumbu kacang.",
    labelHarga: "Rp5.000 / porsi"
  },

  {
    id: "nasi",
    nama: "Nasi",
    harga: 5000,
    gambar: "/images/nasi.jpg",
    deskripsi: "Nasi putih hangat.",
    labelHarga: "Rp5.000 / porsi"
  },

  {
    id: "sayur-asem",
    nama: "Sayur Asem",
    harga: 8000,
    gambar: "/images/sayur-asem.jpg",
    deskripsi: "Sayur asem yang menyegarkan.",
    labelHarga: "Rp8.000 / porsi"
  },
];

// Fungsi untuk mengubah angka menjadi format mata uang Rupiah
export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", // Menggunakan format mata uang
    currency: "IDR", // Menentukan mata uang Rupiah
    maximumFractionDigits: 0, // Tidak menampilkan angka desimal
  }).format(angka);
}
