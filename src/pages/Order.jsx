import { useState } from "react"; // Mengambil useState untuk menyimpan data form dan ringkasan pesanan
import { Link, useSearchParams } from "react-router-dom"; // Link untuk navigasi dan useSearchParams untuk membaca parameter URL
import SideBox from "../components/SideBox.jsx"; // Mengambil komponen kotak informasi samping
import { produkList, tambahanList, formatRupiah } from "../data.js"; // Mengambil data sate, makanan pendamping, dan fungsi format Rupiah
import { tambahPesananBaru } from "../admin/storage.js"; // Mengambil fungsi untuk menyimpan pesanan baru

// Bentuk awal satu baris pilihan sate
const itemKosong = {
  produk: "", // ID produk yang dipilih
  jumlah: "" // Jumlah tusuk yang dipesan
};

// Bentuk awal seluruh form pemesanan
const formKosong = {
  nama: "", // Nama pelanggan
  email: "", // Email pelanggan
  whatsapp: "", // Nomor WhatsApp pelanggan
  metode: "", // Metode pengambilan pesanan
  alamat: "", // Alamat jika memilih delivery
  items: [itemKosong], // Daftar sate yang dipesan, minimal satu baris
  tambahan: [], // Daftar ID makanan pendamping yang dipilih
  catatan: "" // Catatan tambahan dari pelanggan
};

// Komponen utama halaman pemesanan
export default function Order() {

  // Mengambil parameter dari URL
  const [searchParams] = useSearchParams();

  // Membaca ID produk dari URL, contoh: ?produk=sate-ayam
  const produkAwal = searchParams.get("produk");

  // Membaca ID makanan pendamping dari URL
  const tambahanAwal = searchParams.get("tambahan");

  // Mengatur data awal form
  // Produk dan makanan pendamping dari URL akan diperiksa terlebih dahulu
  const [form, setForm] = useState({
    ...formKosong,

    // Jika ID produk ditemukan dalam produkList, masukkan ke form
    // Jika tidak ditemukan, gunakan string kosong
    items: [{
      produk: produkList.some((p) => p.id === produkAwal) ? produkAwal : "",
      jumlah: ""
    }],

    // Jika ID pendamping ditemukan, masukkan ke array tambahan
    // Jika tidak ditemukan, gunakan array kosong
    tambahan: tambahanList.some((t) => t.id === tambahanAwal) ? [tambahanAwal] : [],
  });

  // Menyimpan data ringkasan setelah pesanan berhasil dikirim
  // null berarti modal ringkasan belum ditampilkan
  const [ringkasan, setRingkasan] = useState(null);

  // Fungsi untuk mengubah input form biasa
  const ubah = (e) =>
    setForm({
      ...form, // Mempertahankan data form lainnya
      [e.target.name]: e.target.value // Mengubah properti berdasarkan name input
    });

  // --- Fungsi untuk mengatur baris pilihan sate ---

  // Mengubah produk atau jumlah pada baris sate tertentu
  // i = posisi baris
  // field = bagian yang diubah, yaitu produk atau jumlah
  // nilai = nilai baru yang dipilih
  const ubahItem = (i, field, nilai) =>
    setForm({
      ...form,

      // map() mengulang semua baris sate
      items: form.items.map((it, j) =>

        // Jika bukan baris yang sedang diubah, pertahankan datanya
        j !== i
          ? it

          // Jika produk diganti, jumlah dikosongkan kembali
          // Jika jumlah diganti, pertahankan produk dan ubah jumlahnya
          : field === "produk"
            ? { produk: nilai, jumlah: "" }
            : { ...it, jumlah: nilai }
      ),
    });

  // Menambahkan satu baris sate baru ke dalam form
  const tambahItem = () =>
    setForm({
      ...form,
      items: [...form.items, itemKosong]
    });

  // Menghapus baris sate berdasarkan posisi index
  const hapusItem = (i) =>
    setForm({
      ...form,
      items: form.items.filter((_, j) => j !== i)
    });

  // Fungsi untuk memilih atau membatalkan pilihan makanan pendamping
  const ubahTambahan = (id) => {

    // Mengecek apakah makanan pendamping sudah dipilih
    const sudah = form.tambahan.includes(id);

    // Jika sudah dipilih, hapus dari array
    // Jika belum dipilih, tambahkan ke array
    setForm({
      ...form,
      tambahan: sudah
        ? form.tambahan.filter((t) => t !== id)
        : [...form.tambahan, id]
    });
  };

  // --- Perhitungan harga ---

  // Menghitung subtotal setiap baris sate
  const rincian = form.items.map((it) => {

    // Mencari data produk berdasarkan ID yang dipilih
    const p = produkList.find((x) => x.id === it.produk);

    // Mengubah jumlah menjadi angka
    // Jika kosong atau tidak valid, gunakan 0
    const jml = Number(it.jumlah) || 0;

    // Subtotal = harga per tusuk dikali jumlah tusuk
    // Jika produk belum dipilih atau jumlah belum benar, subtotal 0
    return {
      p,
      jml,
      subtotal: p && jml > 0 ? p.hargaPerTusuk * jml : 0
    };
  });

  // Menjumlahkan seluruh subtotal sate
  const totalSate = rincian.reduce((sum, r) => sum + r.subtotal, 0);

  // Mengambil data makanan pendamping yang dipilih berdasarkan ID
  const tambahanDipilih = tambahanList.filter((t) =>
    form.tambahan.includes(t.id)
  );

  // Menjumlahkan harga seluruh makanan pendamping
  const totalTambahan = tambahanDipilih.reduce((sum, t) => sum + t.harga, 0);

  // Total pembayaran adalah harga sate ditambah harga pendamping
  const totalPembayaran = totalSate + totalTambahan;

  // Mengecek apakah pelanggan memilih metode delivery
  const delivery = form.metode === "delivery";

  // --- Fungsi mengirim pesanan ---

  const kirim = (e) => {

    // Mencegah halaman refresh saat form disubmit
    e.preventDefault();

    // Memastikan setiap baris memiliki produk dan jumlah minimal satu
    // Jika ada baris yang tidak valid, proses pengiriman dihentikan
    if (rincian.some((r) => !r.p || r.jml < 1)) return;

    // Mengubah rincian pesanan menjadi daftar nama produk dan jumlah
    const items = rincian.map((r) => ({
      produkNama: r.p.nama,
      jumlah: r.jml
    }));

    // Mengubah daftar pendamping menjadi teks
    // Jika tidak ada yang dipilih, tampilkan "Tidak ada"
    const daftarTambahan =
      tambahanDipilih.map((t) => t.nama).join(", ") || "Tidak ada";

    // Mengubah nilai metode menjadi label yang akan disimpan
    const metodeLabel = delivery ? "Delivery" : "Pickup";

    // Alamat hanya disimpan jika metode yang dipilih adalah delivery
    const alamat = delivery ? form.alamat.trim() : "";

    // Menyimpan data pesanan ke localStorage agar dapat dibaca dashboard admin
    tambahPesananBaru({
      nama: form.nama.trim(),
      email: form.email,
      whatsapp: form.whatsapp,
      items,
      metode: metodeLabel,
      alamat,
      tambahan: daftarTambahan,
      catatan: form.catatan.trim(),
      total: totalPembayaran,
    });

    // Menyimpan data yang akan ditampilkan pada modal ringkasan
    setRingkasan({
      nama: form.nama.trim(),
      email: form.email,
      whatsapp: form.whatsapp,
      items,
      metodeLabel,
      alamat,
      daftarTambahan,
      catatan: form.catatan.trim() || "Tidak ada catatan",
      totalSate,
      totalTambahan,
      totalPembayaran,
    });

    // Mengosongkan form agar pesanan yang sama tidak terkirim kembali
    setForm(formKosong);
  };

  // Menyiapkan daftar informasi pelanggan untuk ditampilkan pada modal
  const baris = ringkasan && [
    ["Email", ringkasan.email],
    ["Nomor WhatsApp", ringkasan.whatsapp],
    ["Metode", ringkasan.metodeLabel],

    // Informasi alamat hanya ditampilkan jika alamat tersedia
    ...(ringkasan.alamat ? [["Alamat", ringkasan.alamat]] : []),

    ["Pendamping", ringkasan.daftarTambahan],
    ["Catatan", ringkasan.catatan],
  ];

  return (
    <div className="row g-4">

      {/* Kolom utama berisi form pemesanan */}
      <section className="col-lg-9">
        <div className="main-content p-4">

          {/* Judul halaman */}
          <h2 className="section-title h3 mb-4">Order Form</h2>

          {/* Ketika form dikirim, fungsi kirim dijalankan */}
          <form onSubmit={kirim}>

            {/* Input nama pelanggan */}
            <div className="mb-3">
              <label htmlFor="nama" className="form-label">Nama</label>
              <input
                type="text"
                className="form-control"
                id="nama"
                name="nama"
                placeholder="Masukkan nama"
                value={form.nama}
                onChange={ubah}
                required
              />
            </div>

            {/* Input email pelanggan */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="contoh@email.com"
                value={form.email}
                onChange={ubah}
                required
              />
            </div>

            {/* Input nomor WhatsApp pelanggan */}
            <div className="mb-3">
              <label htmlFor="whatsapp" className="form-label">Nomor WhatsApp</label>
              <input
                type="tel"
                className="form-control"
                id="whatsapp"
                name="whatsapp"
                placeholder="08xxxxxxxxxx"
                value={form.whatsapp}
                onChange={ubah}
                required
              />
            </div>

            {/* Bagian untuk memilih satu atau lebih jenis sate */}
            <fieldset className="mb-3">
              <legend className="form-label fs-6">Pilihan Sate</legend>

              {/* Mengulang setiap baris sate yang ada di form */}
              {form.items.map((it, i) => {

                // Mencari data produk dari rincian berdasarkan posisi baris
                const p = rincian[i].p;

                return (
                  <div className="row g-2 align-items-end mb-2" key={i}>

                    {/* Dropdown untuk memilih jenis sate */}
                    <div className="col-md-6">
                      <select
                        className="form-select"
                        aria-label={`Jenis sate ${i + 1}`}
                        value={it.produk}
                        onChange={(e) => ubahItem(i, "produk", e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Sate --</option>

                        {/* Menampilkan semua pilihan sate */}
                        {produkList.map((x) => (
                          // Produk yang sudah dipilih pada baris lain tidak bisa dipilih lagi
                          <option
                            key={x.id}
                            value={x.id}
                            disabled={form.items.some(
                              (o, j) => j !== i && o.produk === x.id
                            )}
                          >
                            {x.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bagian input jumlah sate */}
                    <div className="col-8 col-md-4">

                      {/* Jika produk memiliki paket, gunakan dropdown jumlah paket */}
                      {p && p.paket ? (
                        <select
                          className="form-select"
                          aria-label={`Jumlah tusuk ${i + 1}`}
                          value={it.jumlah}
                          onChange={(e) => ubahItem(i, "jumlah", e.target.value)}
                          required
                        >
                          <option value="">-- Jumlah --</option>

                          {/* Menampilkan pilihan jumlah sesuai paket produk */}
                          {p.paket.map((n) => (
                            <option key={n} value={n}>{n} tusuk</option>
                          ))}
                        </select>
                      ) : (

                        // Jika tidak memiliki paket, jumlah tusuk dapat diisi bebas
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          placeholder="Jumlah tusuk"
                          aria-label={`Jumlah tusuk ${i + 1}`}
                          value={it.jumlah}
                          onChange={(e) => ubahItem(i, "jumlah", e.target.value)}
                          required
                        />
                      )}
                    </div>

                    {/* Tombol untuk menghapus baris sate */}
                    <div className="col-4 col-md-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"

                        // Baris pertama tidak dapat dihapus jika hanya ada satu baris
                        disabled={form.items.length === 1}
                        onClick={() => hapusItem(i)}
                        aria-label={`Hapus baris sate ${i + 1}`}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Tombol untuk menambahkan jenis sate lainnya */}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-1"

                // Jumlah baris tidak boleh melebihi jumlah jenis produk sate
                disabled={form.items.length >= produkList.length}
                onClick={tambahItem}
              >
                <i className="bi bi-plus-lg"></i> Tambah jenis sate
              </button>
            </fieldset>

            {/* Bagian untuk memilih metode pengambilan pesanan */}
            <fieldset className="mb-3">
              <legend className="form-label fs-6">Metode Pengambilan</legend>

              {/* Pilihan metode Pickup dan Delivery */}
              {[
                { id: "pickup", label: "Pickup" },
                { id: "delivery", label: "Delivery" }
              ].map((m) => (
                <div key={m.id} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="metode"
                    id={m.id}
                    value={m.id}

                    // Radio aktif jika nilai metode pada form sama dengan ID pilihan
                    checked={form.metode === m.id}
                    onChange={ubah}
                    required
                  />
                  <label className="form-check-label" htmlFor={m.id}>
                    {m.label}
                  </label>
                </div>
              ))}
            </fieldset>

            {/* Input alamat hanya ditampilkan jika pelanggan memilih Delivery */}
            {delivery && (
              <div className="mb-3">
                <label htmlFor="alamat" className="form-label">Alamat Pengantaran</label>
                <textarea
                  className="form-control"
                  id="alamat"
                  name="alamat"
                  rows="3"
                  placeholder="Jalan, nomor rumah, RT/RW, patokan..."
                  value={form.alamat}
                  onChange={ubah}
                  required
                ></textarea>
              </div>
            )}

            {/* Bagian untuk memilih makanan pendamping */}
            <fieldset className="mb-3">
              <legend className="form-label fs-6">Makanan Pendamping</legend>

              {/* Mengulang daftar makanan pendamping */}
              {tambahanList.map((t) => (
                <div key={t.id} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={t.id}

                    // Checkbox aktif jika ID pendamping ada di dalam array tambahan
                    checked={form.tambahan.includes(t.id)}
                    onChange={() => ubahTambahan(t.id)}
                  />

                  {/* Menampilkan nama dan harga makanan pendamping */}
                  <label className="form-check-label" htmlFor={t.id}>
                    {t.nama} ({t.harga === 0 ? "Gratis" : formatRupiah(t.harga)})
                  </label>
                </div>
              ))}
            </fieldset>

            {/* Input catatan tambahan dari pelanggan */}
            <div className="mb-3">
              <label htmlFor="catatan" className="form-label">Catatan</label>
              <textarea
                className="form-control"
                id="catatan"
                name="catatan"
                rows="3"
                placeholder="Tambahkan catatan pesanan..."
                value={form.catatan}
                onChange={ubah}
              ></textarea>
            </div>

            {/* Ringkasan harga yang dihitung secara otomatis */}
            <div className="alert alert-warning mt-4 mb-3" aria-live="polite">
              <h3 className="h6 mb-2">Ringkasan Harga</h3>

              {/* Menampilkan subtotal setiap sate yang sudah dipilih */}
              {rincian.filter((r) => r.subtotal > 0).map((r) => (
                <p key={r.p.id} className="mb-1">
                  {r.jml} {r.p.nama}: <span>{formatRupiah(r.subtotal)}</span>
                </p>
              ))}

              {/* Menampilkan total harga sate */}
              <p className="mb-1">
                Harga Sate: <span>{formatRupiah(totalSate)}</span>
              </p>

              {/* Menampilkan total harga makanan pendamping */}
              <p className="mb-1">
                Harga Pendamping: <span>{formatRupiah(totalTambahan)}</span>
              </p>

              <hr />

              {/* Menampilkan total seluruh pembayaran */}
              <p className="fw-bold mb-0">
                Total Pembayaran: <span>{formatRupiah(totalPembayaran)}</span>
              </p>
            </div>

            {/* Tombol untuk mengirim pesanan */}
            <button type="submit" className="btn btn-sbd">Make Order</button>
          </form>
        </div>
      </section>

      {/* Sidebar informasi pemesanan */}
      <SideBox judul="Order Information">
        <p className="small">
          Kamu bisa memilih lebih dari satu jenis sate. Pastikan jumlah tusuk dan pendamping sudah sesuai sebelum memesan.
        </p>

        {/* Link menuju halaman daftar harga */}
        <Link className="btn btn-sbd" to="/pricelist">Lihat Pricelist</Link>
      </SideBox>

      {/* Modal ringkasan hanya muncul jika ringkasan memiliki data */}
      {ringkasan && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judulModalPesanan"

            // Klik area luar modal akan menutup ringkasan
            onClick={() => setRingkasan(null)}
          >
            {/* Mencegah klik di dalam modal ikut menutup modal */}
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">

                {/* Bagian header modal */}
                <div className="modal-header">
                  <h2 className="modal-title fs-5" id="judulModalPesanan">
                    Ringkasan Pesanan
                  </h2>

                  {/* Tombol silang untuk menutup modal */}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Tutup"
                    onClick={() => setRingkasan(null)}
                  ></button>
                </div>

                {/* Bagian isi modal */}
                <div className="modal-body">

                  {/* Menampilkan nama pelanggan */}
                  <p>Terima kasih, <strong>{ringkasan.nama}</strong>!</p>

                  <p className="mb-1"><strong>Pesanan:</strong></p>

                  {/* Menampilkan semua produk dan jumlah yang dipesan */}
                  <ul>
                    {ringkasan.items.map((it) => (
                      <li key={it.produkNama}>
                        {it.produkNama}: {it.jumlah} tusuk
                      </li>
                    ))}
                  </ul>

                  {/* Menampilkan informasi tambahan pelanggan */}
                  {baris.map(([label, nilai]) => (
                    <p key={label} className="mb-1">
                      <strong>{label}:</strong> {nilai}
                    </p>
                  ))}

                  <hr />

                  {/* Menampilkan rincian harga pada modal */}
                  <p className="mb-1">
                    Harga Sate: {formatRupiah(ringkasan.totalSate)}
                  </p>

                  <p className="mb-1">
                    Harga Pendamping: {formatRupiah(ringkasan.totalTambahan)}
                  </p>

                  {/* Menampilkan total akhir pembayaran */}
                  <h3 className="h5 mt-3">
                    Total: {formatRupiah(ringkasan.totalPembayaran)}
                  </h3>

                  {/* Informasi bahwa pesanan sudah tersimpan */}
                  <div className="alert alert-info mb-0 mt-3">
                    Pesanan kamu sudah tercatat di sistem Sate Bang Dopir.
                  </div>
                </div>

                {/* Bagian footer modal */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setRingkasan(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
