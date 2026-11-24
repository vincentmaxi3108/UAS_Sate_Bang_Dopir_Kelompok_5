// Nilai awal filter yang digunakan ketika halaman pertama kali dibuka atau filter di-reset
export const filterAwal = {
  dari: "", // Tanggal awal penyaringan
  sampai: "", // Tanggal akhir penyaringan
  metode: "semua", // Menampilkan semua metode pemesanan
  status: "semua" // Menampilkan semua status pesanan
};

// Fungsi untuk menyaring daftar pesanan berdasarkan tanggal, metode, dan status
// pesanan = seluruh data pesanan
// f = nilai filter yang sedang dipilih
export const saring = (pesanan, f) =>
  pesanan.filter(
    (p) =>
      // Jika tanggal awal kosong, semua tanggal diperbolehkan
      // Jika diisi, tanggal pesanan harus sama dengan atau setelah tanggal awal
      (!f.dari || p.tanggal >= f.dari) &&

      // Jika tanggal akhir kosong, semua tanggal diperbolehkan
      // Jika diisi, tanggal pesanan harus sama dengan atau sebelum tanggal akhir
      (!f.sampai || p.tanggal <= f.sampai) &&

      // Jika metode "semua", semua metode ditampilkan
      // Jika tidak, metode pesanan harus sama dengan pilihan filter
      (f.metode === "semua" || p.metode === f.metode) &&

      // Jika status "semua", semua status ditampilkan
      // Jika tidak, status pesanan harus sama dengan pilihan filter
      (f.status === "semua" || p.status === f.status)
  );

// Komponen filter pesanan
// filter = data filter yang sedang aktif
// setFilter = fungsi untuk mengubah data filter
// children = kolom tambahan, misalnya kolom pencarian pada AdminPesanan
export default function FilterPesanan({ filter, setFilter, children }) {

  // Fungsi untuk mengubah nilai filter ketika input atau select berubah
  const ubah = (e) =>
    setFilter({
      ...filter, // Mempertahankan nilai filter lainnya
      [e.target.name]: e.target.value // Mengubah nilai berdasarkan name input yang berubah
    });

  // Mengecek apakah filter berbeda dari kondisi awal
  // JSON.stringify mengubah object menjadi teks agar dapat dibandingkan
  const aktif = JSON.stringify(filter) !== JSON.stringify(filterAwal);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-2 align-items-end">

          {/* Input untuk memilih tanggal awal */}
          <div className="col-6 col-lg-2">
            <label htmlFor="fDari" className="form-label small mb-1">
              Dari tanggal
            </label>

            <input
              type="date"
              id="fDari"
              name="dari"
              className="form-control form-control-sm"
              value={filter.dari}

              // Tanggal awal tidak boleh melewati tanggal akhir
              max={filter.sampai || undefined}

              // Memperbarui filter ketika tanggal berubah
              onChange={ubah}
            />
          </div>

          {/* Input untuk memilih tanggal akhir */}
          <div className="col-6 col-lg-2">
            <label htmlFor="fSampai" className="form-label small mb-1">
              Sampai tanggal
            </label>

            <input
              type="date"
              id="fSampai"
              name="sampai"
              className="form-control form-control-sm"
              value={filter.sampai}

              // Tanggal akhir tidak boleh lebih awal dari tanggal awal
              min={filter.dari || undefined}

              // Memperbarui filter ketika tanggal berubah
              onChange={ubah}
            />
          </div>

          {/* Dropdown untuk memilih metode pemesanan */}
          <div className="col-6 col-lg-2">
            <label htmlFor="fMetode" className="form-label small mb-1">
              Metode
            </label>

            <select
              id="fMetode"
              name="metode"
              className="form-select form-select-sm"
              value={filter.metode}
              onChange={ubah}
            >
              <option value="semua">Semua</option>
              <option value="Pickup">Pickup</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          {/* Dropdown untuk memilih status pesanan */}
          <div className="col-6 col-lg-2">
            <label htmlFor="fStatus" className="form-label small mb-1">
              Status
            </label>

            <select
              id="fStatus"
              name="status"
              className="form-select form-select-sm"
              value={filter.status}
              onChange={ubah}
            >
              <option value="semua">Semua</option>
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="batal">Batal</option>
            </select>
          </div>

          {/* Menampilkan elemen tambahan yang dikirim melalui props children */}
          {children}

          {/* Tombol untuk mengembalikan semua filter ke nilai awal */}
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"

              // Tombol dinonaktifkan jika belum ada filter yang berubah
              disabled={!aktif}

              // Mengembalikan filter ke kondisi awal
              onClick={() => setFilter(filterAwal)}
            >
              Reset filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
