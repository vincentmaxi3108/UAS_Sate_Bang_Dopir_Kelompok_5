import { useEffect } from "react"; // Mengambil useEffect untuk menjalankan efek ketika halaman berubah
import { Outlet, useLocation } from "react-router-dom"; // Outlet menampilkan halaman sesuai route, useLocation mengambil informasi URL
import Header from "./Header.jsx"; // Mengambil komponen header
import Navbar from "./Navbar.jsx"; // Mengambil komponen navigasi
import Footer from "./Footer.jsx"; // Mengambil komponen footer

// Layout utama untuk seluruh halaman website pelanggan
export default function Layout() {

  // Mengambil pathname dan hash dari URL
  // pathname adalah alamat halaman, sedangkan hash adalah bagian setelah tanda #
  const { pathname, hash } = useLocation();

  // Mengatur posisi scroll setiap kali halaman atau hash berubah
  useEffect(() => {

    // Jika URL memiliki hash, berarti halaman mengarah ke bagian tertentu
    if (hash) {

      // Mengambil elemen HTML berdasarkan ID yang terdapat pada hash
      // slice(1) menghilangkan karakter # dari hash
      const el = document.getElementById(hash.slice(1));

      // Jika elemen ditemukan, arahkan halaman ke elemen tersebut
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });

        // Menghentikan proses agar tidak menjalankan scroll ke atas
        return;
      }
    }

    // Jika tidak ada hash atau elemen tidak ditemukan, kembali ke atas halaman
    window.scrollTo(0, 0);

  // Efek dijalankan ulang ketika pathname atau hash berubah
  }, [pathname, hash]);

  // Tampilan layout website pelanggan
  return (
    <>
      {/* Header website */}
      <Header />

      {/* Navbar website */}
      <Navbar />

      {/* Bagian utama untuk menampilkan isi halaman */}
      <main className="container my-4 my-lg-5">
        <Outlet />
      </main>

      {/* Footer website */}
      <Footer />
    </>
  );
}
