const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // PENTING: Impor modul 'path'
const fetch = require("node-fetch");

// --- SOLUSI UNTUK 'FETCH' & 'HEADERS' DI NODE.JS v16 ---
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}
if (!globalThis.Headers) {
  globalThis.Headers = require("node-fetch").Headers;
}
// -----------------------------------------------------------

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Koneksi ke Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("SUCCESS: Berhasil terhubung ke MongoDB Atlas!"))
  .catch((err) => console.error("FAILED: Gagal terhubung ke MongoDB.", err));

// Mendefinisikan dan Menggunakan Routes API
// Semua permintaan ke /api/auth akan ditangani oleh file routes/auth.js
app.use("/api/auth", require("./routes/auth"));

// Semua permintaan ke /api/chats akan ditangani oleh file routes/chats.js
app.use("/api/chats", require("./routes/chats"));

// --- KODE BARU UNTUK MENYAJIKAN FRONTEND ---
// Baris ini memberitahu Express untuk menyajikan semua file statis (HTML, CSS, JS, gambar)
// dari folder bernama 'public'.
app.use(express.static(path.join(__dirname, "public")));

// Baris ini adalah 'catch-all'. Jika ada permintaan yang tidak cocok dengan API di atas,
// maka kirimkan file index.html sebagai respons. Ini penting untuk Single Page Application.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
// --- AKHIR KODE BARU ---

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
