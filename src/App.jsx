import { Routes, Route } from "react-router-dom"; // Mengambil Routes dan Route untuk mengatur halaman berdasarkan URL
import Layout from "./components/Layout.jsx"; // Mengambil layout website pelanggan
import Home from "./pages/Home.jsx"; // Mengambil halaman utama
import Product from "./pages/Product.jsx"; // Mengambil halaman produk
import Pricelist from "./pages/Pricelist.jsx"; // Mengambil halaman daftar harga
import Order from "./pages/Order.jsx"; // Mengambil halaman pemesanan
import AdminLayout from "./admin/AdminLayout.jsx"; // Mengambil layout dashboard admin
import Dashboard from "./admin/pages/Dashboard.jsx"; // Mengambil halaman dashboard
import AdminProduk from "./admin/pages/AdminProduk.jsx"; // Mengambil halaman pengelolaan produk admin
import AdminPesanan from "./admin/pages/AdminPesanan.jsx"; // Mengambil halaman pengelolaan pesanan admin

// Komponen utama aplikasi untuk menentukan halaman berdasarkan URL
export default function App() {
  return (
    <Routes>

      {/* Kelompok route untuk website pelanggan */}
      {/* Semua halaman di dalamnya menggunakan Layout */}
      <Route element={<Layout />}>

        {/* Halaman utama */}
        <Route path="/" element={<Home />} />

        {/* Halaman daftar produk */}
        <Route path="/product" element={<Product />} />

        {/* Halaman daftar harga */}
        <Route path="/pricelist" element={<Pricelist />} />

        {/* Halaman pemesanan */}
        <Route path="/order" element={<Order />} />
      </Route>

      {/* Kelompok route untuk dashboard admin menggunakan AdminLTE */}
      <Route path="/admin" element={<AdminLayout />}>

        {/* Halaman utama admin ketika membuka /admin */}
        <Route index element={<Dashboard />} />

        {/* Halaman pengelolaan produk admin */}
        <Route path="produk" element={<AdminProduk />} />

        {/* Halaman pengelolaan pesanan admin */}
        <Route path="pesanan" element={<AdminPesanan />} />
      </Route>
    </Routes>
  );
}
