import { useState } from "react"; // Mengambil useState untuk mengatur kondisi menu dan dropdown
import { NavLink, Link, useLocation } from "react-router-dom"; // Mengambil komponen navigasi dan informasi URL

// Dropdown dibagi per kategori menu, bukan per produk
const kategori = [
  { label: "Pilihan Sate", hash: "#sate" },
  { label: "Makanan Pendamping", hash: "#pendamping" },
];

// Komponen navigasi website
export default function Navbar() {

  // Menyimpan kondisi apakah menu navbar pada layar kecil sedang terbuka
  const [menuBuka, setMenuBuka] = useState(false);

  // Menyimpan kondisi apakah dropdown kategori sedang terbuka
  const [dropdownBuka, setDropdownBuka] = useState(false);

  // Mengambil pathname untuk mengetahui halaman yang sedang dibuka
  const { pathname } = useLocation();

  // Fungsi untuk menutup menu dan dropdown
  const tutupSemua = () => {
    setMenuBuka(false);
    setDropdownBuka(false);
  };

  // Fungsi untuk menentukan class link berdasarkan status aktif
  // Jika halaman aktif, tambahkan class active
  const kelasLink = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg site-nav">
      <div className="container">

        {/* Tombol untuk membuka navbar pada layar kecil */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          aria-expanded={menuBuka}
          aria-label="Buka menu"
          onClick={() => setMenuBuka(!menuBuka)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Bagian isi navbar */}
        {/* Class show ditambahkan ketika menuBuka bernilai true */}
        <div className={"collapse navbar-collapse" + (menuBuka ? " show" : "")}>
          <ul className="navbar-nav gap-lg-3 text-center">

            {/* Link menuju halaman Home */}
            <li className="nav-item">
              <NavLink className={kelasLink} to="/" end onClick={tutupSemua}>
                Home
              </NavLink>
            </li>

            {/* Menu dropdown kategori produk */}
            <li className="nav-item dropdown">

              {/* Link menuju halaman produk */}
              <Link
                className={"nav-link dropdown-toggle" + (pathname === "/product" ? " active" : "")}
                to="/product"
                aria-expanded={dropdownBuka}
                onClick={tutupSemua}
              >
                Menu
              </Link>

              {/* Tombol buka/tutup kategori yang hanya muncul pada layar kecil */}
              <button
                type="button"
                className="btn btn-link d-lg-none p-0 mx-auto"
                style={{ color: "var(--sbd-brown)" }}
                onClick={() => setDropdownBuka(!dropdownBuka)}
              >
                {/* Teks tombol berubah sesuai kondisi dropdown */}
                {dropdownBuka ? "Tutup pilihan ▲" : "Pilih kategori ▼"}
              </button>

              {/* Daftar kategori dropdown */}
              <ul className={"dropdown-menu" + (dropdownBuka ? " show" : "")}>

                {/* Mengulang data kategori untuk membuat pilihan dropdown */}
                {kategori.map((k) => (
                  <li key={k.hash}>

                    {/* Link menuju kategori tertentu pada halaman produk */}
                    <Link
                      className="dropdown-item"
                      to={{ pathname: "/product", hash: k.hash }}
                      onClick={tutupSemua}
                    >
                      {k.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Link menuju halaman pricelist */}
            <li className="nav-item">
              <NavLink className={kelasLink} to="/pricelist" onClick={tutupSemua}>
                Pricelist
              </NavLink>
            </li>

            {/* Link menuju halaman order */}
            <li className="nav-item">
              <NavLink className={kelasLink} to="/order" onClick={tutupSemua}>
                Order
              </NavLink>
            </li>
          </ul>

          {/* Tombol ikon di sebelah kanan navbar */}
          <div className="d-flex gap-2 justify-content-center ms-lg-auto mt-2 mt-lg-0">

            {/* Ikon pencarian menuju halaman produk */}
            <Link to="/product" className="icon-btn" aria-label="Cari menu" onClick={tutupSemua}>
              <i className="bi bi-search"></i>
            </Link>

            {/* Ikon keranjang menuju halaman order */}
            <Link to="/order" className="icon-btn" aria-label="Buat pesanan" onClick={tutupSemua}>
              <i className="bi bi-bag"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
