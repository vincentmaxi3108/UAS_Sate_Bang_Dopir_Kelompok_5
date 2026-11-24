// Object untuk menentukan warna badge berdasarkan status pesanan
const warna = {
  baru: "warning", // Status baru menggunakan warna kuning
  diproses: "info", // Status diproses menggunakan warna biru
  selesai: "success", // Status selesai menggunakan warna hijau
  batal: "danger", // Status batal menggunakan warna merah
};

// Komponen untuk menampilkan status pesanan dalam bentuk badge
// Nilai status diterima melalui props
export default function StatusBadge({ status }) {
  return (
    <span className={`badge text-bg-${warna[status] || "secondary"} text-capitalize`}>
      {/* Menampilkan teks status pesanan */}
      {status}
    </span>
  );
}
