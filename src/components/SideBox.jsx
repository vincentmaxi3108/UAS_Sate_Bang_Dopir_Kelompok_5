// Komponen kotak informasi pada bagian samping halaman
// judul = judul kotak yang diterima melalui props
// children = isi kotak yang dikirim dari komponen pemanggil
export default function SideBox({ judul, children }) {
  return (
    <aside className="col-lg-3">
      <div className="side-box p-4">

        {/* Menampilkan judul kotak */}
        <h2 className="h4 mb-3">{judul}</h2>

        {/* Menampilkan isi yang dimasukkan melalui children */}
        {children}
      </div>
    </aside>
  );
}
