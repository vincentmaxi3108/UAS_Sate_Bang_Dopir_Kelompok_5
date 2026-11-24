import { produkList } from "../data.js"; // Mengambil daftar produk awal dari file data.js

// Nama key yang digunakan untuk menyimpan data produk di localStorage
const KUNCI_PRODUK = "sbd_produk_admin";

// Nama key yang digunakan untuk menyimpan data pesanan di localStorage
const KUNCI_PESANAN = "sbd_pesanan";

// Membuat data produk awal berdasarkan produkList
// map() mengambil data produk dan menyusun properti yang dibutuhkan admin
const produkAwal = produkList.map((p) => ({
  id: p.id,
  nama: p.nama,
  hargaPerTusuk: p.hargaPerTusuk,
  deskripsi: p.deskripsi,
  aktif: true,
}));

// Data pesanan awal yang digunakan jika localStorage belum memiliki data pesanan
const pesananAwal = [
  { id: "P001", tanggal: "2026-11-02", nama: "Budi Santoso", produkNama: "Sate Ayam", jumlah: 20, metode: "Delivery", tambahan: "Lontong", total: 45000, status: "selesai" },
  { id: "P002", tanggal: "2026-11-03", nama: "Siti Aminah", produkNama: "Sate Taichan", jumlah: 10, metode: "Pickup", tambahan: "Nasi", total: 25000, status: "selesai" },
  { id: "P003", tanggal: "2026-11-05", nama: "Rudi Hartono", produkNama: "Sate Kambing", jumlah: 15, metode: "Delivery", tambahan: "Kuah Sop", total: 45000, status: "selesai" },
  { id: "P004", tanggal: "2026-11-07", nama: "Dewi Lestari", produkNama: "Sate Sapi", jumlah: 10, metode: "Pickup", tambahan: "Tidak ada", total: 30000, status: "diproses" },
  { id: "P005", tanggal: "2026-11-08", nama: "Andi Wijaya", produkNama: "Sate Ayam", jumlah: 30, metode: "Delivery", tambahan: "Nasi, Lontong", total: 70000, status: "baru" },
  { id: "P006", tanggal: "2026-11-09", nama: "Maya Putri", produkNama: "Sate Taichan", jumlah: 5, metode: "Pickup", tambahan: "Kuah Sop", total: 10000, status: "baru" },
  { id: "P007", tanggal: "2026-11-09", nama: "Joko Susilo", produkNama: "Sate Kambing", jumlah: 8, metode: "Pickup", tambahan: "Tidak ada", total: 24000, status: "batal" },
];

// Fungsi umum untuk membaca data dari localStorage
// Parameter kunci menentukan nama penyimpanan
// Parameter awal digunakan jika data belum tersedia atau gagal dibaca
function baca(kunci, awal) {
  try {
    // Mengambil data mentah dari localStorage berdasarkan key
    const mentah = localStorage.getItem(kunci);

    // Jika data ditemukan, ubah teks JSON menjadi object atau array JavaScript
    if (mentah) return JSON.parse(mentah);
  } catch (e) {
    // Jika terjadi error saat membaca atau mengubah JSON, proses dilanjutkan ke data awal
  }

  // Mengembalikan data awal jika data tidak ditemukan atau gagal dibaca
  return awal;
}

// Fungsi umum untuk menyimpan data ke localStorage
function simpan(kunci, data) {
  try {
    // JSON.stringify() mengubah object atau array menjadi teks JSON
    // localStorage hanya menyimpan data dalam bentuk string
    localStorage.setItem(kunci, JSON.stringify(data));
  } catch (e) {
    // Jika penyimpanan gagal, error ditangani agar aplikasi tidak berhenti
  }
}

// Fungsi untuk membaca data produk
// Jika belum ada data tersimpan, gunakan produkAwal
export const bacaProduk = () => baca(KUNCI_PRODUK, produkAwal);

// Fungsi untuk menyimpan data produk ke localStorage
export const simpanProduk = (data) => simpan(KUNCI_PRODUK, data);

// Fungsi untuk membaca data pesanan
// Jika belum ada data tersimpan, gunakan pesananAwal
export const bacaPesanan = () => baca(KUNCI_PESANAN, pesananAwal);

// Fungsi untuk menyimpan data pesanan ke localStorage
export const simpanPesanan = (data) => simpan(KUNCI_PESANAN, data);

// Mengambil daftar item dari pesanan.
// Pesanan lama (format 1 produk) tetap terbaca.
export const itemsPesanan = (p) =>
  p.items || [{ produkNama: p.produkNama, jumlah: p.jumlah }];

// Teks ringkas untuk tabel, contoh: "Sate Ayam × 10, Sate Kambing × 5"
export const teksItems = (p) =>
  itemsPesanan(p).map((i) => `${i.produkNama} × ${i.jumlah}`).join(", ");

// Dipanggil dari halaman Order supaya pesanan pelanggan muncul di dashboard
export function tambahPesananBaru(pesanan) {

  // Membaca daftar pesanan yang sudah tersimpan
  const daftar = bacaPesanan();

  // Menyimpan ulang daftar pesanan dengan menambahkan pesanan baru di bagian akhir
  simpanPesanan([
    ...daftar,
    {
      // Membuat ID pesanan menggunakan enam angka terakhir dari waktu saat ini
      id: "P" + String(Date.now()).slice(-6),

      // Mengambil tanggal saat ini dalam format YYYY-MM-DD
      tanggal: new Date().toISOString().slice(0, 10),

      // Setiap pesanan baru memiliki status awal "baru"
      status: "baru",

      // Memasukkan seluruh data pesanan yang diterima sebagai parameter
      ...pesanan,
    },
  ]);
}
