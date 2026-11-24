import { Link } from "react-router-dom"; // Mengambil Link untuk navigasi ke halaman admin

// Komponen untuk menampilkan judul halaman dan breadcrumb
// judul diterima dari halaman yang memanggil komponen ini
export default function PageHeader({ judul }) {
  return (
    <div className="app-content-header">
      <div className="container-fluid">
        <div className="row">

          {/* Menampilkan judul halaman di sebelah kiri */}
          <div className="col-sm-6">
            <h3 className="mb-0">{judul}</h3>
          </div>

          {/* Menampilkan breadcrumb di sebelah kanan */}
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">

              {/* Link untuk kembali ke halaman utama admin */}
              <li className="breadcrumb-item">
                <Link to="/admin">Admin</Link>
              </li>

              {/* Menampilkan nama halaman yang sedang dibuka */}
              <li className="breadcrumb-item active" aria-current="page">
                {judul}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
