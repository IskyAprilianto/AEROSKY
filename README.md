# AEROSKY - Aplikasi Chatbot AI Full-Stack

Selamat datang di AEROSKY, sebuah aplikasi web chatbot full-stack yang cerdas, interaktif, dan modern. Proyek ini dibangun dengan Node.js, Express, dan MongoDB untuk backend, serta menggunakan vanilla HTML, CSS, dan JavaScript untuk frontend. Inti dari chatbot ini didukung oleh model AI canggih dari Google, **Gemini 2.0 Flash**.

Aplikasi ini mencakup sistem autentikasi pengguna yang lengkap (login/register), penyimpanan riwayat percakapan yang persisten untuk setiap pengguna, serta mode tamu untuk percakapan sementara.

![Demo Aplikasi AEROSKY](https://media.giphy.com/media/ixgMR6rxVsxJZHUtig/giphy.gif)

---

## ✨ Fitur Utama

- **Percakapan Cerdas:** Berinteraksi dengan AI Gemini 1.5 Flash untuk mendapatkan respons yang relevan dan kontekstual.
- **Sistem Autentikasi Pengguna:**
    - Pengguna dapat mendaftar (Register) dengan username, email, dan password.
    - Pengguna dapat masuk (Login) ke akun mereka untuk mengakses fitur penuh.
    - Password di-hash menggunakan `bcryptjs` untuk keamanan maksimal.
    - Sesi pengguna dikelola menggunakan JSON Web Tokens (JWT) yang aman.
- **Riwayat Percakapan Persisten:**
    - Semua percakapan pengguna yang sudah login akan disimpan secara otomatis di database MongoDB.
    - Pengguna dapat melihat daftar semua percakapan sebelumnya di sidebar, yang dikelompokkan berdasarkan waktu ("Hari Ini", "Kemarin", "7 Hari Terakhir").
    - Pengguna dapat beralih antar percakapan lama dan menghapus riwayat yang tidak diinginkan.
- **Mode Tamu (Guest Mode):** Pengguna yang belum login tetap bisa melakukan percakapan secara anonim. Percakapan ini bersifat sementara dan tidak disimpan di database.
- **Antarmuka Modern:**
    - Desain yang bersih dan responsif.
    - Latar belakang gradasi yang menarik.
    - Sidebar riwayat yang intuitif dengan ikon hamburger.
    - Tombol aksi yang jelas (Login/Logout, Percakapan Baru, Hapus Riwayat).

---

## 💻 Tumpukan Teknologi (Tech Stack)

-   **Frontend:**
    -   HTML5
    -   CSS3 (Flexbox, Variabel CSS)
    -   JavaScript (Vanilla JS, Fetch API, ES6+)
-   **Backend:**
    -   Node.js
    -   Express.js
-   **Database:**
    -   MongoDB
    -   MongoDB Atlas (sebagai layanan cloud)
    -   Mongoose (sebagai ODM)
-   **AI & Autentikasi:**
    -   Google Generative AI (`@google/generative-ai`)
    -   JSON Web Token (`jsonwebtoken`)
    -   BCrypt.js (`bcryptjs`)
-   **Lain-lain:**
    -   `dotenv` untuk manajemen environment variables.
    -   `cors` untuk mengelola Cross-Origin Resource Sharing.
    -   `node-fetch` sebagai polyfill untuk lingkungan Node.js v16.

---

## 🚀 Setup & Instalasi Lokal

Untuk menjalankan proyek ini di komputer lokal Anda, ikuti langkah-langkah berikut:

### **Prasyarat**
-   [Node.js](https://nodejs.org/) (disarankan v16 ke atas)
-   Akun [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cluster M0 gratis sudah cukup)
-   [API Key Google AI](https://aistudio.google.com/)

### **Langkah-langkah Instalasi**
1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/](https://github.com/)<username-anda>/<nama-repositori-anda>.git
    cd <nama-repositori-anda>
    ```

2.  **Install dependensi backend:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Di dalam direktori utama proyek, buat file bernama `.env` dan isi dengan format berikut menggunakan kunci Anda sendiri:
    ```env
    # Kunci API dari Google AI Studio
    GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxx

    # Port untuk server backend
    PORT=3000

    # Connection String dari MongoDB Atlas (jangan lupa ganti <password>)
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.../namaDatabaseAnda

    # Kunci rahasia acak untuk menandatangani JWT
    JWT_SECRET=ini_adalah_kalimat_rahasia_yang_sangat_aman
    ```

4.  **Jalankan Server Backend:**
    ```bash
    node server.js
    ```
    Server Anda sekarang berjalan di `http://localhost:3000`.

5.  **Jalankan Frontend:**
    -   Gunakan ekstensi seperti **"Live Server"** di VS Code, klik kanan pada file `public/index.html` dan pilih "Open with Live Server".
    -   Aplikasi akan berjalan di alamat seperti `http://127.0.0.1:5500`.

Aplikasi Anda sekarang siap digunakan di lingkungan lokal!

---

## 📖 API Endpoints

-   `POST /api/auth/register` - Mendaftarkan pengguna baru.
-   `POST /api/auth/login` - Login dan mendapatkan JWT.
-   `GET /api/chats` - Mendapatkan daftar semua riwayat percakapan pengguna (terproteksi).
-   `GET /api/chats/:id` - Mendapatkan detail satu percakapan (terproteksi).
-   `POST /api/chats` - Mengirim pesan dalam sebuah percakapan (terproteksi).
-   `DELETE /api/chats/:id` - Menghapus sebuah percakapan (terproteksi).
-   `POST /api/chats/guest` - Mengirim pesan sebagai tamu (publik).

---

Dibuat dengan semangat oleh **[Nama Anda di sini]**.
