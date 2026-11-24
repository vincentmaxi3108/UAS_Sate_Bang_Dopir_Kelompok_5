import { useState } from "react"; // Mengambil useState untuk menyimpan filter dashboard
import { Link } from "react-router-dom"; // Mengambil Link untuk berpindah halaman tanpa reload
import { useAdmin } from "../AdminContext.jsx"; // Mengambil data produk dan pesanan
import PageHeader from "../PageHeader.jsx"; // Mengambil komponen judul halaman
import StatusBadge from "../StatusBadge.jsx"; // Mengambil komponen tampilan status pesanan
import FilterPesanan, { filterAwal, saring } from "../FilterPesanan.jsx"; // Mengambil komponen filter dan fungsi penyaringan pesanan
import { formatRupiah } from "../../data.js"; // Mengambil fungsi format Rupiah
import { itemsPesanan, teksItems } from "../storage.js"; // Mengambil fungsi untuk membaca item dan mengubahnya menjadi teks

// Komponen utama halaman dashboard admin
export default function Dashboard() {

  // Mengambil data produk dan pesanan dari AdminContext
  const { produk, pesanan } = useAdmin();

  // Menyimpan kondisi filter yang sedang dipilih
  // Nilai awal berasal dari filterAwal
  const [filter, setFilter] = useState(filterAwal);

  // Semua angka di dashboard dihitung dari pesanan yang sudah difilter
  // saring() menghasilkan daftar pesanan sesuai filter yang dipilih
  const data = saring(pesanan, filter);

  // Menghitung jumlah pesanan dengan status "baru"
  // filter() mengambil pesanan yang statusnya baru
  // length menghitung jumlah pesanan tersebut
  const pesananBaru = data.filter((p) => p.status === "baru").length;

  // Menghitung total pendapatan dari pesanan yang sudah selesai
  const pendapatan = data

    // Hanya mengambil pesanan dengan status selesai
    .filter((p) => p.status === "selesai")

    // Menjumlahkan nilai total dari setiap pesanan yang selesai
    // sum adalah jumlah sementara
    // p.total adalah total pembayaran dari satu pesanan
    .reduce((sum, p) => sum + p.total, 0);

  // Menghitung jumlah produk yang statusnya aktif
  const produkAktif = produk.filter((p) => p.aktif).length;

  // Jumlah tusuk terjual per produk (pesanan batal tidak dihitung)
  // Satu pesanan bisa berisi beberapa jenis sate, jadi tiap item dijumlahkan

  // Object kosong untuk menyimpan jumlah tusuk yang terjual berdasarkan nama produk
  const terjual = {};

  // Mengambil pesanan yang statusnya bukan batal
  data
    .filter((p) => p.status !== "batal")

    // Mengulang setiap pesanan yang tidak batal
    .forEach((p) => {

      // Mengambil daftar item dari setiap pesanan
      itemsPesanan(p).forEach((i) => {

        // Menambahkan jumlah tusuk berdasarkan nama produk
        // Jika nama produk belum ada, nilai awalnya 0
        // Jika sudah ada, jumlah sebelumnya akan ditambah jumlah item sekarang
        terjual[i.produkNama] = (terjual[i.produkNama] || 0) + i.jumlah;
      });
    });

  // Mengubah object terjual menjadi array pasangan nama produk dan jumlah tusuk
  // sort() mengurutkan dari jumlah terjual paling banyak ke paling sedikit
  const dataGrafik = Object.entries(terjual).sort((a, b) => b[1] - a[1]);

  // Menentukan jumlah penjualan terbesar untuk skala progress bar
  // Jika ada data, gunakan jumlah penjualan tertinggi
  // Jika tidak ada data, gunakan 1 agar tidak terjadi pembagian dengan 0
  const maks = dataGrafik.length ? dataGrafik[0][1] : 1;

  // Mengambil maksimal lima pesanan terbaru
  // ...data membuat salinan array agar data asli tidak berubah
  // reverse() membalik urutan data
  // slice(0, 5) mengambil lima data pertama
  const terbaru = [...data].reverse().slice(0, 5);

  // Menyiapkan data untuk empat kartu ringkasan dashboard
  // Setiap object berisi warna, angka, label, ikon, dan tujuan halaman
  const kartu = [
    {
      warna: "primary",
      angka: data.length,
      label: "Total Pesanan",
      ikon: "bi-bag-check",
      to: "/admin/pesanan"
    },
    {
      warna: "warning",
      angka: pesananBaru,
      label: "Pesanan Baru",
      ikon: "bi-bell",
      to: "/admin/pesanan"
    },
    {
      warna: "success",
      angka: formatRupiah(pendapatan),
      label: "Pendapatan (Selesai)",
      ikon: "bi-cash-stack",
      to: "/admin/pesanan"
    },
    {
      warna: "danger",
      angka: produkAktif,
      label: "Produk Aktif",
      ikon: "bi-basket3",
      to: "/admin/produk"
    },
  ];

  // Bagian tampilan dashboard
  return (
    <>
      {/* Menampilkan judul halaman Dashboard */}
      <PageHeader judul="Dashboard" />

      <div className="app-content">
        <div className="container-fluid">

          {/* Filter untuk menentukan pesanan yang dihitung pada dashboard */}
          <FilterPesanan filter={filter} setFilter={setFilter} />

          {/* Menampilkan jumlah pesanan yang sesuai dengan filter */}
          <p className="small text-secondary" aria-live="polite">
            Menampilkan data dari {data.length} dari {pesanan.length} pesanan.
          </p>

          {/* Baris untuk menampilkan kartu ringkasan */}
          <div className="row">

            {/* Mengulang data kartu untuk membuat empat kartu dashboard */}
            {kartu.map((k) => (
              <div className="col-lg-3 col-6" key={k.label}>

                {/* Warna kartu ditentukan oleh nilai k.warna */}
                <div className={`small-box text-bg-${k.warna}`}>
                  <div className="inner">

                    {/* Menampilkan angka atau nilai ringkasan */}
                    <h3>{k.angka}</h3>

                    {/* Menampilkan nama ringkasan */}
                    <p>{k.label}</p>
                  </div>

                  {/* Menampilkan ikon sesuai data kartu */}
                  <i className={`bi ${k.ikon} position-absolute top-0 end-0 m-3 fs-1 opacity-50`}></i>

                  {/* Link menuju halaman sesuai tujuan kartu */}
                  <Link
                    to={k.to}
                    className="small-box-footer link-light link-underline-opacity-0 d-block text-center py-1"
                  >
                    Selengkapnya <i className="bi bi-arrow-right-circle"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Baris kedua berisi grafik penjualan dan tabel pesanan terbaru */}
          <div className="row">

            {/* Kolom kiri: jumlah tusuk terjual per produk */}
            <div className="col-lg-5 mb-3">
              <div className="card h-100">

                <div className="card-header">
                  <h3 className="card-title">Tusuk Terjual per Produk</h3>
                </div>

                <div className="card-body">

                  {/* Pesan jika belum ada data penjualan */}
                  {dataGrafik.length === 0 && (
                    <p className="text-secondary mb-0">
                      Belum ada data penjualan.
                    </p>
                  )}

                  {/* Mengulang data penjualan setiap produk */}
                  {dataGrafik.map(([nama, jumlah]) => (
                    <div className="mb-3" key={nama}>

                      {/* Menampilkan nama produk dan jumlah tusuk terjual */}
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{nama}</span>
                        <strong>{jumlah} tusuk</strong>
                      </div>

                      {/* Progress bar untuk menggambarkan jumlah penjualan */}
                      <div
                        className="progress"
                        role="progressbar"
                        aria-valuenow={jumlah}
                        aria-valuemin="0"
                        aria-valuemax={maks}
                      >

                        {/* Lebar progress bar dihitung berdasarkan perbandingan jumlah dengan penjualan tertinggi */}
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: `${(jumlah / maks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom kanan: menampilkan lima pesanan terbaru */}
            <div className="col-lg-7 mb-3">
              <div className="card h-100">

                <div className="card-header">

                  {/* Judul bagian tabel */}
                  <h3 className="card-title">Pesanan Terbaru</h3>

                  {/* Tombol untuk membuka seluruh daftar pesanan */}
                  <div className="card-tools">
                    <Link
                      to="/admin/pesanan"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Lihat semua
                    </Link>
                  </div>
                </div>

                {/* Tabel daftar pesanan terbaru */}
                <div className="card-body p-0 table-responsive">
                  <table className="table table-striped align-middle mb-0">

                    {/* Judul kolom tabel */}
                    <thead>
                      <tr>
                        <th>Pelanggan</th>
                        <th>Pesanan</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {/* Mengulang maksimal lima pesanan terbaru */}
                      {terbaru.map((p) => (
                        <tr key={p.id}>

                          {/* Nama pelanggan */}
                          <td>{p.nama}</td>

                          {/* Daftar produk dalam pesanan */}
                          <td>{teksItems(p)}</td>

                          {/* Total pembayaran dalam Rupiah */}
                          <td>{formatRupiah(p.total)}</td>

                          {/* Status pesanan menggunakan komponen StatusBadge */}
                          <td>
                            <StatusBadge status={p.status} />
                          </td>
                        </tr>
                      ))}

                      {/* Jika tidak ada pesanan yang sesuai filter */}
                      {terbaru.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-secondary">
                            Tidak ada pesanan yang cocok.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
