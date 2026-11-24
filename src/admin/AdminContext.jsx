import { createContext, useContext, useEffect, useState } from "react"; // Mengambil fungsi React untuk membuat context, mengambil context, menjalankan efek, dan menyimpan state
import { bacaProduk, simpanProduk, bacaPesanan, simpanPesanan } from "./storage.js"; // Mengambil fungsi untuk membaca dan menyimpan data produk serta pesanan

// Membuat context agar data admin dapat digunakan oleh beberapa halaman
const AdminCtx = createContext(null);

// Custom hook untuk mengambil isi AdminCtx
export const useAdmin = () => useContext(AdminCtx);

// Provider yang menyediakan data dan fungsi pengelolaan admin ke komponen turunannya
export function AdminProvider({ children }) {

  // Mengambil data produk dari localStorage saat pertama kali dijalankan
  const [produk, setProduk] = useState(bacaProduk);

  // Mengambil data pesanan dari localStorage saat pertama kali dijalankan
  const [pesanan, setPesanan] = useState(bacaPesanan);

  // Menyimpan ulang data produk ke localStorage setiap kali produk berubah
  useEffect(() => simpanProduk(produk), [produk]);

  // Menyimpan ulang data pesanan ke localStorage setiap kali pesanan berubah
  useEffect(() => simpanPesanan(pesanan), [pesanan]);

  // Fungsi untuk menambahkan produk baru ke dalam daftar produk
  // ID dibuat menggunakan waktu saat ini agar setiap produk memiliki ID
  const tambahProduk = (p) =>
    setProduk((lama) => [...lama, { ...p, id: "produk-" + Date.now() }]);

  // Fungsi untuk mengubah data produk berdasarkan ID
  // map() mengulang semua produk dan mengganti produk yang ID-nya sama
  const ubahProduk = (p) =>
    setProduk((lama) => lama.map((x) => (x.id === p.id ? p : x)));

  // Fungsi untuk menghapus produk berdasarkan ID
  // filter() mempertahankan produk yang ID-nya tidak sama dengan ID yang dihapus
  const hapusProduk = (id) =>
    setProduk((lama) => lama.filter((x) => x.id !== id));

  // Fungsi untuk mengubah status pesanan berdasarkan ID pesanan
  // ...x mempertahankan data pesanan lainnya, lalu status diganti dengan nilai baru
  const ubahStatus = (id, status) =>
    setPesanan((lama) => lama.map((x) => (x.id === id ? { ...x, status } : x)));

  // Fungsi untuk menghapus pesanan berdasarkan ID
  const hapusPesanan = (id) =>
    setPesanan((lama) => lama.filter((x) => x.id !== id));

  // Menyediakan data dan fungsi agar dapat diakses komponen di dalam Provider
  return (
    <AdminCtx.Provider
      value={{ produk, pesanan, tambahProduk, ubahProduk, hapusProduk, ubahStatus, hapusPesanan }}
    >
      {/* Menampilkan komponen anak yang dibungkus oleh AdminProvider */}
      {children}
    </AdminCtx.Provider>
  );
}
