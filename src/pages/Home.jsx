import { Link } from "react-router-dom"; // Mengambil Link untuk berpindah halaman
import ProductCard from "../components/ProductCard.jsx"; // Mengambil komponen kartu produk
import SideBox from "../components/SideBox.jsx"; // Mengambil komponen kotak informasi samping
import { produkList } from "../data.js"; // Mengambil daftar produk dari data.js

// Komponen halaman utama website
export default function Home() {

  // Mengambil tiga produk pertama untuk ditampilkan sebagai produk unggulan
  const unggulan = produkList.slice(0, 3);

  return (
    <>
      {/* Bagian hero atau banner utama halaman Home */}
      <section className="hero mb-4">
        <div className="row align-items-center g-4 p-4 p-lg-5">

          {/* Bagian teks dan tombol pada hero */}
          <div className="col-lg-7">
            <span className="hero-badge">Buka hari ini</span>

            {/* Judul utama halaman */}
            <h2 className="hero-title mt-3">
              Sate hangat, langsung dari bakaran Bang Dopir
            </h2>

            {/* Deskripsi singkat layanan */}
            <p className="hero-sub">
              Pilih sate dan makanan pendampingmu, isi form, dan pesanan siap diambil atau diantar.
            </p>

            {/* Tombol menuju halaman menu produk */}
            <Link className="btn btn-hero" to="/product">
              Lihat menu
            </Link>
          </div>

          {/* Bagian ilustrasi nota pesanan */}
          <div className="col-lg-5 d-flex justify-content-lg-end">
            <div className="nota" aria-label="Contoh nota pesanan">

              {/* Nama usaha pada nota */}
              <p className="nota-judul">Sate Bang Dopir</p>

              {/* Keterangan nota */}
              <p className="nota-ket">sate satee~</p>

              {/* Contoh rincian pesanan */}
              <div className="nota-baris">
                <span>10 Sate Ayam</span>
                <span>20.000</span>
              </div>

              <div className="nota-baris">
                <span>1 Lontong</span>
                <span>5.000</span>
              </div>

              {/* Total contoh pesanan */}
              <div className="nota-baris nota-total">
                <span>Total</span>
                <span>25.000</span>
              </div>

              {/* Keterangan tambahan nota */}
              <p className="nota-ket mt-2">
                Duduk manis, sate sedang dibakar.
              </p>

              {/* Ilustrasi barcode dan kode nota */}
              <div className="nota-kode">
                <span className="barcode"></span>
                <span>SBD-012</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi tambahan di bawah hero */}
        <div className="hero-strip">
          Ayam, taichan, kambing, dan sapi, dibakar saat dipesan!
        </div>
      </section>

      {/* Baris utama yang berisi konten dan sidebar */}
      <div className="row g-4">

        {/* Bagian konten utama */}
        <section className="col-lg-9">
          <div className="main-content p-4">

            {/* Judul produk unggulan */}
            <h2 className="section-title h3 mb-4">Featured Product</h2>

            <div className="row g-3">

              {/* Mengulang tiga produk unggulan untuk ditampilkan dalam kartu */}
              {unggulan.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                  <ProductCard produk={p} tampilkan="home" />
                </div>
              ))}
            </div>

            {/* Bagian informasi tentang usaha */}
            <div className="about mt-5 pt-4">
              <h2 className="section-title h3 mb-3">About Us</h2>
              <p>
                Sate Bang Dopir merupakan UMKM yang menyediakan berbagai pilihan sate dengan rasa yang lezat dan harga yang terjangkau.
              </p>
              <p className="mb-0">
                Kami menyediakan sate ayam, sate taichan, sate kambing, dan sate sapi serta makanan pendamping seperti lontong, nasi, kuah sop, dan sayur asem.
              </p>
            </div>

            {/* Bagian lokasi usaha */}
            <div className="mt-5">
              <h2 className="section-title h3 mb-3">Lokasi Kami</h2>

              {/* Menampilkan peta Google Maps menggunakan iframe */}
              <div className="ratio ratio-16x9 rounded overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Jakarta&output=embed"
                  title="Lokasi Sate Bang Dopir"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar informasi */}
        <SideBox judul="Informasi">
          <p className="small">
            Lihat pilihan sate dan makanan pendamping yang tersedia di Sate Bang Dopir.
          </p>

          {/* Tombol menuju halaman produk */}
          <div className="d-grid gap-2">
            <Link className="btn btn-sbd" to="/product">
              Lihat Menu
            </Link>

            {/* Tombol menuju halaman pricelist */}
            <Link className="btn btn-outline-light" to="/pricelist">
              Lihat Pricelist
            </Link>
          </div>
        </SideBox>
      </div>
    </>
  );
}
