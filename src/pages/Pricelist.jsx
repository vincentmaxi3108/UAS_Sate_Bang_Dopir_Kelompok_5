import { Link } from "react-router-dom"; // Mengambil Link untuk navigasi halaman
import SideBox from "../components/SideBox.jsx"; // Mengambil komponen kotak informasi samping
import { produkList, tambahanList, formatRupiah } from "../data.js"; // Mengambil data produk, pendamping, dan fungsi format Rupiah

// Mengubah data produk sate dan makanan pendamping menjadi baris-baris tabel
function buatBaris() {

  // Array kosong untuk menampung seluruh baris tabel
  const baris = [];

  // Mengulang seluruh produk sate
  produkList.forEach((p) => {

    // Mengecek apakah produk memiliki pilihan paket
    const opsi = p.paket

      // Jika memiliki paket, buat pilihan jumlah dan harga untuk setiap paket
      ? p.paket.map((n) => ({
          jumlah: `${n} tusuk`,
          harga: formatRupiah(n * p.hargaPerTusuk)
        }))

      // Jika tidak memiliki paket, harga ditampilkan per tusuk
      : [{
          jumlah: "Per tusuk",
          harga: formatRupiah(p.hargaPerTusuk)
        }];

    // Mengubah setiap pilihan paket menjadi baris tabel
    opsi.forEach((o, i) =>
      baris.push({
        kunci: `${p.id}-${i}`, // ID unik untuk setiap baris
        produk: p.nama, // Nama produk
        span: opsi.length, // Jumlah baris yang digabung pada kolom produk
        first: i === 0, // Menandai baris pertama produk
        ...o // Memasukkan jumlah dan harga dari pilihan paket
      })
    );
  });

  // Mengulang seluruh makanan pendamping
  tambahanList.forEach((t, i) =>
    baris.push({
      kunci: `tambahan-${t.id}`, // ID unik untuk baris pendamping
      produk: "Pendamping", // Nama kelompok produk
      span: tambahanList.length, // Jumlah baris yang digabung pada kolom produk
      first: i === 0, // Menandai pendamping pertama
      jumlah: t.nama, // Nama makanan pendamping
      harga: t.harga === 0 ? "Gratis" : formatRupiah(t.harga), // Harga gratis atau format Rupiah
    })
  );

  // Mengembalikan seluruh baris yang sudah dibuat
  return baris;
}

// Komponen halaman daftar harga
export default function Pricelist() {

  // Mengambil data baris tabel dari fungsi buatBaris()
  const baris = buatBaris();

  return (
    <div className="row g-4">

      {/* Bagian utama berisi daftar harga */}
      <section className="col-lg-9">
        <div className="main-content p-4">

          {/* Judul halaman */}
          <h2 className="section-title h3 mb-3">Daftar Harga</h2>

          {/* Deskripsi halaman */}
          <p>
            Berikut adalah daftar produk dan harga yang tersedia di Sate Bang Dopir.
          </p>

          {/* Membuat tabel dapat digeser secara horizontal pada layar kecil */}
          <div className="table-responsive">

            {/* table-striped = warna baris bergantian */}
            {/* Kolom Produk diberi warna tetap melalui class sel-produk */}
            <table className="table table-sbd table-striped table-hover align-middle my-4">

              {/* Bagian judul kolom */}
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Harga</th>
                </tr>
              </thead>

              {/* Bagian isi tabel */}
              <tbody>

                {/* Mengulang seluruh data baris untuk membuat isi tabel */}
                {baris.map((b) => (
                  <tr key={b.kunci}>

                    {/* Kolom produk hanya ditampilkan pada baris pertama kelompoknya */}
                    {/* rowSpan menggabungkan beberapa baris dalam satu kolom */}
                    {b.first && (
                      <td rowSpan={b.span} className="fw-bold sel-produk">
                        {b.produk}
                      </td>
                    )}

                    {/* Menampilkan jumlah atau nama pendamping */}
                    <td>{b.jumlah}</td>

                    {/* Menampilkan harga */}
                    <td>{b.harga}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Link menuju halaman pemesanan */}
          <Link className="btn btn-sbd" to="/order">Order Now</Link>
        </div>
      </section>

      {/* Sidebar informasi */}
      <SideBox judul="Information">
        <p className="small">
          Untuk melakukan pemesanan, silakan mengisi form Order.
        </p>

        {/* Tombol menuju halaman order */}
        <Link className="btn btn-sbd" to="/order">Order Sekarang</Link>
      </SideBox>
    </div>
  );
}
