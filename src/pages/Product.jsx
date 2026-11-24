import { useState } from "react"; // Mengambil useState untuk menyimpan kata pencarian
import { Link } from "react-router-dom"; // Mengambil Link untuk navigasi halaman
import ProductCard from "../components/ProductCard.jsx"; // Mengambil komponen kartu produk
import SideBox from "../components/SideBox.jsx"; // Mengambil komponen kotak informasi samping
import { produkList, tambahanList } from "../data.js"; // Mengambil data sate dan makanan pendamping

// Komponen halaman menu produk
export default function Product() {

  // Menyimpan kata yang diketik pelanggan pada kolom pencarian
  const [kataKunci, setKataKunci] = useState("");

  // Mengubah kata pencarian menjadi huruf kecil dan menghapus spasi di awal/akhir
  const kunci = kataKunci.toLowerCase().trim();

  // Fungsi untuk mengecek apakah data produk cocok dengan kata pencarian
  const cocok = (p) =>
    (p.nama + " " + p.deskripsi + " " + p.labelHarga)
      .toLowerCase()
      .includes(kunci);

  // Menyaring daftar sate berdasarkan kata pencarian
  const sate = produkList.filter(cocok);

  // Menyaring daftar makanan pendamping berdasarkan kata pencarian
  const pendamping = tambahanList.filter(cocok);

  // Menghitung total menu yang cocok dari kedua kategori
  const total = sate.length + pendamping.length;

  return (
    <div className="row g-4">

      {/* Bagian utama halaman menu */}
      <section className="col-lg-9">
        <div className="main-content p-4">

          {/* Judul halaman */}
          <h2 className="section-title h3 mb-4">Menu Kami</h2>

          {/* Kolom pencarian menu */}
          <div className="mb-4">
            <label htmlFor="cariProduk" className="form-label">
              Cari Menu
            </label>

            <input
              type="text"
              className="form-control"
              id="cariProduk"
              placeholder="Ketik nama menu yang ingin dicari..."
              value={kataKunci}

              // Memperbarui kata pencarian setiap kali pelanggan mengetik
              onChange={(e) => setKataKunci(e.target.value)}
            />

            {/* Menampilkan informasi jumlah hasil pencarian */}
            <p className="small mt-2 mb-0" aria-live="polite">
              {kunci === ""
                ? ""
                : total > 0
                  ? `${total} menu ditemukan.`
                  : "Menu tidak ditemukan."}
            </p>
          </div>

          {/* Bagian daftar sate hanya muncul jika ada sate yang cocok */}
          {sate.length > 0 && (
            <div id="sate" className="mb-4">

              {/* Judul kategori sate */}
              <h3 className="h4 mb-3">Pilihan Sate</h3>

              <div className="row g-3">

                {/* Mengulang data sate untuk menampilkan kartu produk */}
                {sate.map((p) => (
                  <div key={p.id} className="col-12 col-sm-6">
                    <ProductCard produk={p} jenis="sate" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bagian makanan pendamping hanya muncul jika ada hasil yang cocok */}
          {pendamping.length > 0 && (
            <div id="pendamping">

              {/* Judul kategori makanan pendamping */}
              <h3 className="h4 mb-3">Makanan Pendamping</h3>

              <div className="row g-3">

                {/* Mengulang data pendamping untuk menampilkan kartu produk */}
                {pendamping.map((p) => (
                  <div key={p.id} className="col-12 col-sm-6">
                    <ProductCard produk={p} jenis="pendamping" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar informasi menu */}
      <SideBox judul="Menu">
        <p className="small">
          Pilih sate dan makanan pendamping yang kamu inginkan, lalu lakukan pemesanan lewat halaman Order.
        </p>

        {/* Link menuju halaman daftar harga */}
        <Link className="btn btn-sbd" to="/pricelist">Lihat Harga</Link>
      </SideBox>
    </div>
  );
}
