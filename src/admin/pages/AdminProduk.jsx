import { useState } from "react"; // Mengambil useState untuk menyimpan data form produk
import { useAdmin } from "../AdminContext.jsx"; // Mengambil data produk dan fungsi CRUD dari AdminContext
import PageHeader from "../PageHeader.jsx"; // Mengambil komponen judul halaman
import { formatRupiah } from "../../data.js"; // Mengambil fungsi untuk mengubah angka menjadi format Rupiah

// Data awal form ketika admin belum memilih edit atau selesai menambah produk
const formKosong = {
  id: null, // ID null berarti produk belum dipilih untuk diedit
  nama: "", // Menyimpan nama produk
  hargaPerTusuk: "", // Menyimpan harga produk per tusuk
  deskripsi: "", // Menyimpan deskripsi produk
  aktif: true // Menentukan apakah produk aktif atau tidak
};

// Komponen utama halaman pengelolaan produk
export default function AdminProduk() {

  // Mengambil data produk dan fungsi untuk menambah, mengubah, serta menghapus produk
  const { produk, tambahProduk, ubahProduk, hapusProduk } = useAdmin();

  // Menyimpan isi form produk yang sedang diisi admin
  const [form, setForm] = useState(formKosong);

  // Mengecek apakah admin sedang mengedit produk
  // Jika form.id tidak null, berarti ada produk yang sedang diedit
  const sedangEdit = form.id !== null;

  // Fungsi untuk menangani perubahan nilai pada input form
  const ubah = (e) => {

    // Mengambil informasi dari elemen input yang berubah
    // name = nama atribut input
    // value = nilai yang dimasukkan
    // type = tipe input
    // checked = kondisi checkbox
    const { name, value, type, checked } = e.target;

    // Memperbarui data form
    // ...form mempertahankan data form yang sebelumnya
    // [name] mengubah properti sesuai nama input
    // Checkbox menggunakan checked, input biasa menggunakan value
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Fungsi yang dijalankan ketika form disubmit
  const kirim = (e) => {

    // Mencegah halaman melakukan refresh ketika form dikirim
    e.preventDefault();

    // Membuat data produk dari form
    // ...form menyalin seluruh data form
    // trim() menghapus spasi di awal dan akhir nama produk
    // Number() mengubah harga dari string menjadi angka
    const data = {
      ...form,
      nama: form.nama.trim(),
      hargaPerTusuk: Number(form.hargaPerTusuk)
    };

    // Validasi: nama produk tidak boleh kosong dan harga harus minimal 1
    // Jika tidak memenuhi kondisi, proses dihentikan
    if (!data.nama || data.hargaPerTusuk < 1) return;

    // Jika sedangEdit bernilai true, data produk akan diperbarui
    if (sedangEdit) ubahProduk(data);

    // Jika bukan sedang mengedit, produk baru akan ditambahkan
    else tambahProduk(data);

    // Mengosongkan form setelah proses tambah atau edit selesai
    setForm(formKosong);
  };

  // Fungsi untuk menghapus produk
  const hapus = (p) => {

    // Meminta konfirmasi admin sebelum produk dihapus
    if (window.confirm(`Hapus produk "${p.nama}"?`)) {

      // Menghapus produk berdasarkan ID
      hapusProduk(p.id);

      // Jika produk yang dihapus sedang tampil di form edit,
      // form dikembalikan ke kondisi kosong
      if (form.id === p.id) setForm(formKosong);
    }
  };

  // Bagian tampilan halaman produk
  return (
    <>
      {/* Menampilkan judul halaman */}
      <PageHeader judul="Produk" />

      <div className="app-content">
        <div className="container-fluid">
          <div className="row">

            {/* Kolom kiri: menampilkan daftar produk */}
            <div className="col-lg-8 mb-3">
              <div className="card">

                {/* Judul tabel dan jumlah produk */}
                <div className="card-header">
                  <h3 className="card-title">
                    Daftar Produk ({produk.length})
                  </h3>
                </div>

                <div className="card-body p-0 table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">

                    {/* Judul kolom tabel */}
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Harga / tusuk</th>
                        <th>Status</th>
                        <th style={{ width: 110 }}>Aksi</th>
                      </tr>
                    </thead>

                    <tbody>

                      {/* Mengulang seluruh data produk untuk ditampilkan ke tabel */}
                      {produk.map((p) => (
                        <tr key={p.id}>

                          {/* Menampilkan nama dan deskripsi produk */}
                          <td>
                            <strong>{p.nama}</strong>
                            <div className="small text-secondary">
                              {p.deskripsi}
                            </div>
                          </td>

                          {/* Menampilkan harga per tusuk dalam format Rupiah */}
                          <td>{formatRupiah(p.hargaPerTusuk)}</td>

                          {/* Menampilkan status produk */}
                          <td>
                            <span className={"badge text-bg-" + (p.aktif ? "success" : "secondary")}>
                              {p.aktif ? "Aktif" : "Nonaktif"}
                            </span>
                          </td>

                          {/* Tombol aksi untuk mengedit dan menghapus produk */}
                          <td>

                            {/* Tombol edit: memasukkan data produk yang dipilih ke dalam form */}
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => setForm(p)}
                              aria-label={`Edit ${p.nama}`}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            {/* Tombol hapus: menjalankan fungsi hapus */}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => hapus(p)}
                              aria-label={`Hapus ${p.nama}`}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Jika belum ada produk, tampilkan pesan */}
                      {produk.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-secondary py-4">
                            Belum ada produk.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Kolom kanan: form untuk tambah atau edit produk */}
            <div className="col-lg-4 mb-3">
              <div className="card card-warning card-outline">

                {/* Judul form berubah sesuai kondisi tambah atau edit */}
                <div className="card-header">
                  <h3 className="card-title">
                    {sedangEdit ? "Edit Produk" : "Tambah Produk"}
                  </h3>
                </div>

                {/* Ketika tombol submit ditekan, fungsi kirim dijalankan */}
                <form onSubmit={kirim}>
                  <div className="card-body">

                    {/* Input nama produk */}
                    <div className="mb-3">
                      <label htmlFor="nama" className="form-label">
                        Nama Produk
                      </label>

                      <input
                        id="nama"
                        name="nama"
                        className="form-control"
                        value={form.nama}
                        onChange={ubah}
                        required
                      />
                    </div>

                    {/* Input harga produk per tusuk */}
                    <div className="mb-3">
                      <label htmlFor="hargaPerTusuk" className="form-label">
                        Harga per Tusuk (Rp)
                      </label>

                      <input
                        id="hargaPerTusuk"
                        name="hargaPerTusuk"
                        type="number"
                        min="1"
                        className="form-control"
                        value={form.hargaPerTusuk}
                        onChange={ubah}
                        required
                      />
                    </div>

                    {/* Input deskripsi produk */}
                    <div className="mb-3">
                      <label htmlFor="deskripsi" className="form-label">
                        Deskripsi
                      </label>

                      <textarea
                        id="deskripsi"
                        name="deskripsi"
                        rows="3"
                        className="form-control"
                        value={form.deskripsi}
                        onChange={ubah}
                      ></textarea>
                    </div>

                    {/* Checkbox untuk menentukan produk aktif atau nonaktif */}
                    <div className="form-check form-switch">
                      <input
                        id="aktif"
                        name="aktif"
                        type="checkbox"
                        className="form-check-input"
                        checked={form.aktif}
                        onChange={ubah}
                      />

                      <label htmlFor="aktif" className="form-check-label">
                        Produk aktif
                      </label>
                    </div>
                  </div>

                  {/* Tombol aksi form */}
                  <div className="card-footer d-flex gap-2">

                    {/* Teks tombol berubah sesuai mode tambah atau edit */}
                    <button type="submit" className="btn btn-warning">
                      {sedangEdit ? "Simpan Perubahan" : "Tambah"}
                    </button>

                    {/* Tombol batal hanya muncul ketika sedang mengedit */}
                    {sedangEdit && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setForm(formKosong)}
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
