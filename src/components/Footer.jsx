import { Link } from "react-router-dom"; // Mengambil Link untuk navigasi ke halaman lain

// Komponen footer website pelanggan
export default function Footer() {
  return (
    <footer className="site-footer text-center py-4 px-3 mt-5">

      {/* Nama website */}
      <p className="mb-1"><strong>Sate Bang Dopir</strong></p>

      {/* Informasi kontak dan lokasi */}
      <p className="mb-1 small">WhatsApp | Instagram | Jakarta</p>

      {/* Link menuju dashboard admin */}
      <p className="mb-1 small">
        <Link to="/admin" className="link-light">Dashboard Admin</Link>
      </p>

      {/* Informasi hak cipta */}
      <p className="mb-0 small">
        &copy; 2026 Sate Bang Dopir. All Rights Reserved.
      </p>
    </footer>
  );
}
