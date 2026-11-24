import { Link } from "react-router-dom"; // Mengambil Link untuk menuju halaman order

// Komponen kartu produk yang dapat digunakan di beberapa halaman
// produk = data produk yang akan ditampilkan
// tampilkan = menentukan jenis tampilan kartu
// jenis = menentukan apakah produk berupa sate atau makanan pendamping
export default function ProductCard({ produk, tampilkan = "product", jenis = "sate" }) {

  // Mengecek apakah kartu ditampilkan pada halaman product
  const isProduct = tampilkan === "product";

  // Menentukan tujuan link berdasarkan jenis produk
  // Jika sate, produk dimasukkan ke parameter produk
  // Jika makanan pendamping, produk dimasukkan ke parameter tambahan
  const tujuan = jenis === "sate"
    ? `/order?produk=${produk.id}`
    : `/order?tambahan=${produk.id}`;

  return (
    <div className="card product-card h-100 text-center p-3">

      {/* Menampilkan gambar produk */}
      <img
        src={produk.gambar}
        className="card-img-top rounded mb-3"
        alt={produk.nama}
      />

      <div className="card-body d-flex flex-column p-0">

        {/* Menampilkan nama produk */}
        <h3 className="card-title h5">{produk.nama}</h3>

        {/* Deskripsi menyesuaikan jenis tampilan kartu */}
        <p className="card-text">
          {isProduct ? produk.deskripsi : produk.deskripsiHome}
        </p>

        {/* Harga dan tombol order hanya muncul pada halaman product */}
        {isProduct && (
          <>
            {/* Menampilkan label harga produk */}
            <p className="fw-bold mb-3">{produk.labelHarga}</p>

            {/* Link untuk memasukkan produk ke halaman order */}
            <Link className="btn btn-sbd mt-auto" to={tujuan}>
              {jenis === "sate" ? "Order" : "Tambah ke order"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
