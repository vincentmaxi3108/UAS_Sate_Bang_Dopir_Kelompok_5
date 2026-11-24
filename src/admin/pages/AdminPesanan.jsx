import { useState } from "react"; // Mengambil useState untuk menyimpan data filter dan pencarian
import { useAdmin } from "../AdminContext.jsx"; // Mengambil data pesanan dan fungsi pengelolaan pesanan dari AdminContext
import PageHeader from "../PageHeader.jsx"; // Mengambil komponen judul halaman
import StatusBadge from "../StatusBadge.jsx"; // Mengambil komponen untuk menampilkan status pesanan
import FilterPesanan, { filterAwal, saring } from "../FilterPesanan.jsx"; // Mengambil komponen filter, nilai filter awal, dan fungsi penyaringan
import { formatRupiah } from "../../data.js"; // Mengambil fungsi untuk mengubah angka menjadi format Rupiah
import { teksItems } from "../storage.js"; // Mengambil fungsi untuk menampilkan daftar produk dalam pesanan

// Daftar status yang dapat dipilih oleh admin
const daftarStatus = ["baru", "diproses", "selesai", "batal"];

// Komponen utama halaman admin pesanan
export default function AdminPesanan() {

  // Mengambil data pesanan dan fungsi untuk mengubah status serta menghapus pesanan
  const { pesanan, ubahStatus, hapusPesanan } = useAdmin();

  // Menyimpan pilihan filter yang digunakan admin
  // Nilai awalnya diambil dari filterAwal
  const [filter, setFilter] = useState(filterAwal);

  // Menyimpan kata yang dimasukkan admin pada kolom pencarian
  const [cari, setCari] = useState("");

  // Menampilkan pesanan yang sudah melewati beberapa tahap filter
  const tampil = saring(pesanan, filter)
    .filter((p) => (p.nama + teksItems(p) + p.id).toLowerCase().includes(cari.toLowerCase().trim()))
    .reverse();

  // Fungsi untuk menghapus pesanan
  const hapus = (p) => {

    // Menampilkan konfirmasi sebelum pesanan benar-benar dihapus
    if (window.confirm(`Hapus pesanan ${p.id} atas nama ${p.nama}?`)) {

      // Jika admin menekan OK, pesanan dihapus berdasarkan ID
      hapusPesanan(p.id);
    }
  };

  // Bagian tampilan halaman
  return (
    <>
      {/* Menampilkan judul halaman Pesanan */}
      <PageHeader judul="Pesanan" />

      <div className="app-content">
        <div className="container-fluid">

          {/* Komponen filter pesanan */}
          {/* filter berisi pilihan filter saat ini, sedangkan setFilter digunakan untuk mengubahnya */}
          <FilterPesanan filter={filter} setFilter={setFilter}>

            {/* Kolom pencarian pesanan */}
            <div className="col-12 col-lg">
              <label htmlFor="fCari" className="form-label small mb-1">
                Cari
              </label>

              <input
                type="search"
                id="fCari"
                className="form-control form-control-sm"
                placeholder="Nama / produk / ID..."
                value={cari}

                // Setiap kali admin mengetik, nilai cari diperbarui
                onChange={(e) => setCari(e.target.value)}
              />
            </div>
          </FilterPesanan>

          {/* Card yang berisi tabel pesanan */}
          <div className="card">
            <div className="card-body p-0 table-responsive">

              <table className="table table-striped table-hover align-middle mb-0">

                {/* Bagian judul kolom tabel */}
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th>Pesanan</th>
                    <th>Metode</th>
                    <th>Tambahan</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {/* Mengulang data pesanan untuk membuat satu baris tabel untuk setiap pesanan */}
                  {tampil.map((p) => (
                    <tr key={p.id}>

                      {/* Menampilkan ID pesanan */}
                      <td>{p.id}</td>

                      {/* Menampilkan tanggal pesanan */}
                      <td>{p.tanggal}</td>

                      {/* Menampilkan nama pelanggan dan nomor WhatsApp */}
                      <td>
                        {p.nama}
                        <div className="small text-secondary">
                          {p.whatsapp}
                        </div>
                      </td>

                      {/* Menampilkan daftar produk yang dipesan */}
                      <td>{teksItems(p)}</td>

                      {/* Menampilkan metode pemesanan dan alamat jika tersedia */}
                      <td>
                        {p.metode}

                        {/* Alamat hanya ditampilkan jika data alamat tersedia */}
                        {p.alamat && (
                          <div className="small text-secondary">
                            {p.alamat}
                          </div>
                        )}
                      </td>

                      {/* Menampilkan tambahan pesanan */}
                      <td>{p.tambahan}</td>

                      {/* Menampilkan total pembayaran dalam format Rupiah */}
                      <td>{formatRupiah(p.total)}</td>

                      {/* Bagian untuk menampilkan dan mengubah status pesanan */}
                      <td style={{ minWidth: 150 }}>

                        {/* Menampilkan badge status pesanan */}
                        <StatusBadge status={p.status} />

                        {/* Dropdown untuk memilih status pesanan */}
                        <select
                          className="form-select form-select-sm mt-1"
                          value={p.status}

                          // Memanggil ubahStatus ketika admin memilih status baru
                          // Parameter pertama adalah ID pesanan
                          // Parameter kedua adalah status yang dipilih
                          onChange={(e) => ubahStatus(p.id, e.target.value)}
                          aria-label={`Ubah status ${p.id}`}
                        >

                          {/* Membuat pilihan dropdown berdasarkan daftarStatus */}
                          {daftarStatus.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Tombol untuk menghapus pesanan */}
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => hapus(p)}
                          aria-label={`Hapus ${p.id}`}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Jika tidak ada pesanan yang cocok dengan filter atau pencarian */}
                  {tampil.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center text-secondary py-4">
                        Tidak ada pesanan yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Menampilkan jumlah pesanan yang sedang ditampilkan dibandingkan seluruh pesanan */}
            <div className="card-footer text-secondary small">
              Menampilkan {tampil.length} dari {pesanan.length} pesanan
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
