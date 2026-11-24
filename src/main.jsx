import React from "react"; // Mengambil library React
import ReactDOM from "react-dom/client"; // Mengambil ReactDOM untuk menampilkan aplikasi ke halaman HTML
import { BrowserRouter } from "react-router-dom"; // Mengambil BrowserRouter untuk mengaktifkan navigasi berdasarkan URL
import "bootstrap/dist/css/bootstrap.min.css"; // Mengimpor CSS Bootstrap
import "bootstrap-icons/font/bootstrap-icons.css"; // Mengimpor kumpulan ikon Bootstrap
import "./style.css"; // Mengimpor CSS buatan project
import App from "./App.jsx"; // Mengambil komponen utama aplikasi

// Mencari elemen HTML dengan ID root
// Kemudian membuat aplikasi React dan menampilkannya pada elemen tersebut
ReactDOM.createRoot(document.getElementById("root")).render(

  // StrictMode membantu mendeteksi masalah tertentu selama proses pengembangan
  <React.StrictMode>

    {/* BrowserRouter membungkus aplikasi agar fitur routing dapat digunakan */}
    <BrowserRouter>

      {/* Menampilkan komponen utama aplikasi */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
