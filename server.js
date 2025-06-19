const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
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

// Mendefinisikan dan Menggunakan Routes
// Semua permintaan ke /api/auth akan ditangani oleh file routes/auth.js
app.use("/api/auth", require("./routes/auth"));

// Semua permintaan ke /api/chats akan ditangani oleh file routes/chats.js
app.use("/api/chats", require("./routes/chats"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
