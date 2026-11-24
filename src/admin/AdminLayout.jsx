import { useEffect, useLayoutEffect, useState } from "react"; // Mengambil hook untuk mengatur state dan efek
import { NavLink, Link, Outlet } from "react-router-dom"; // Mengambil komponen navigasi dan tempat menampilkan halaman sesuai route
import adminLteCss from "admin-lte/dist/css/adminlte.min.css?inline"; // Mengimpor CSS AdminLTE sebagai teks agar dapat dipasang secara dinamis
import { AdminProvider } from "./AdminContext.jsx"; // Mengambil Provider untuk menyediakan data admin

// Daftar menu yang ditampilkan pada sidebar admin
const menu = [
  { to: "/admin", label: "Dashboard", ikon: "bi-speedometer2", end: true },
  { to: "/admin/produk", label: "Produk", ikon: "bi-basket3" },
  { to: "/admin/pesanan", label: "Pesanan", ikon: "bi-receipt" },
];

// Komponen utama layout halaman admin
export default function AdminLayout() {

  // Menyimpan kondisi apakah CSS AdminLTE sudah siap dipasang
  const [siap, setSiap] = useState(false);

  // CSS AdminLTE hanya dipasang selama berada di halaman /admin,
  // supaya tidak merusak tampilan website pelanggan.
  useLayoutEffect(() => {

    // Membuat elemen style baru di HTML
    const style = document.createElement("style");

    // Memberi atribut khusus pada elemen style
    style.setAttribute("data-adminlte", "true");

    // Memasukkan isi CSS AdminLTE ke dalam elemen style
    style.textContent = adminLteCss;

    // Memasukkan elemen style ke bagian head HTML
    document.head.appendChild(style);

    // Menandakan bahwa CSS sudah siap digunakan
    setSiap(true);

    // Menghapus CSS ketika komponen AdminLayout dilepas
    return () => style.remove();

    // Array kosong berarti efek hanya dijalankan saat komponen dipasang dan dilepas
  }, []);

  // Menambahkan class pada body yang diperlukan oleh AdminLTE
  useEffect(() => {

    // Daftar class yang akan dipasang pada body
    const kelas = ["layout-fixed", "sidebar-expand-lg", "bg-body-tertiary"];

    // Menambahkan semua class ke body
    document.body.classList.add(...kelas);

    // Menghapus class ketika keluar dari halaman admin
    return () => {
      document.body.classList.remove(...kelas, "sidebar-collapse", "sidebar-open");
    };
  }, []);

  // Fungsi untuk membuka atau menutup sidebar
  const toggleSidebar = () => {

    // Jika lebar layar minimal 992px, sidebar menggunakan mode collapse
    // Jika layar lebih kecil, sidebar menggunakan mode open
    const kelas = window.innerWidth >= 992 ? "sidebar-collapse" : "sidebar-open";

    // Mengubah kondisi class sidebar pada body
    document.body.classList.toggle(kelas);
  };

  // Fungsi untuk menutup sidebar pada tampilan layar kecil
  const tutupSidebar = () => document.body.classList.remove("sidebar-open");

  // Jika CSS belum siap, halaman belum ditampilkan
  if (!siap) return null;

  // Tampilan utama layout admin
  return (
    <AdminProvider>
      <div className="app-wrapper">

        {/* Navbar bagian atas */}
        <nav className="app-header navbar navbar-expand bg-body">
          <div className="container-fluid">
            <ul className="navbar-nav">

              {/* Tombol untuk membuka atau menutup sidebar */}
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link btn btn-link"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <i className="bi bi-list fs-4"></i>
                </button>
              </li>

              {/* Link menuju website pelanggan, disembunyikan pada layar kecil */}
              <li className="nav-item d-none d-md-block">
                <Link to="/" className="nav-link">Lihat Website</Link>
              </li>
            </ul>

            {/* Informasi akun admin di sebelah kanan navbar */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <span className="nav-link">
                  <i className="bi bi-person-circle me-1"></i> Admin Bang Dopir
                </span>
              </li>
            </ul>
          </div>
        </nav>

        {/* Sidebar atau menu navigasi admin */}
        <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">

          {/* Nama brand pada bagian atas sidebar */}
          <div className="sidebar-brand">
            <Link to="/admin" className="brand-link">
              <span className="brand-text fw-light">🍢 Sate Bang Dopir</span>
            </Link>
          </div>

          <div className="sidebar-wrapper">
            <nav className="mt-2">
              <ul className="nav sidebar-menu flex-column" role="menu">

                {/* Mengulang daftar menu untuk membuat navigasi sidebar */}
                {menu.map((m) => (
                  <li className="nav-item" key={m.to}>

                    {/* NavLink dapat mengetahui apakah halaman sedang aktif */}
                    <NavLink
                      to={m.to}
                      end={m.end}
                      onClick={tutupSidebar}

                      // Menambahkan class active jika route sedang dibuka
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                    >
                      {/* Ikon menu sesuai data pada array menu */}
                      <i className={"nav-icon bi " + m.ikon}></i>

                      {/* Nama menu */}
                      <p>{m.label}</p>
                    </NavLink>
                  </li>
                ))}

                {/* Judul kelompok menu tambahan */}
                <li className="nav-header">LAINNYA</li>

                {/* Link untuk kembali ke website pelanggan */}
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <i className="nav-icon bi bi-box-arrow-up-right"></i>
                    <p>Website Pelanggan</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Bagian utama untuk menampilkan halaman sesuai route */}
        <main className="app-main">
          <Outlet />
        </main>

        {/* Footer dashboard admin */}
        <footer className="app-footer">
          <strong>Sate Bang Dopir</strong> &mdash; Dashboard Admin &copy; 2026
        </footer>

        {/* Lapisan yang dapat diklik untuk menutup sidebar pada layar kecil */}
        <div className="sidebar-overlay" onClick={tutupSidebar}></div>
      </div>
    </AdminProvider>
  );
}
