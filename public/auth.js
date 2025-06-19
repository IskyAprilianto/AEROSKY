// Menggunakan path relatif, bukan alamat lengkap
const API_URL = "/api/auth";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const errorMessage = document.getElementById("error-message");

// Jika kita berada di halaman login, tambahkan event listener ini
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Mencegah form dari refresh halaman

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika ada error, tampilkan pesan dari server
        throw new Error(data.msg || "Terjadi kesalahan");
      }

      // Simpan token ke localStorage
      localStorage.setItem("token", data.token);

      // Arahkan ke halaman chat utama
      window.location.href = "/"; // Mengarahkan ke root
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
}

// Jika kita berada di halaman register, tambahkan event listener ini
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    // Validasi password di sisi klien
    if (password.length < 8) {
      errorMessage.textContent = "Password minimal harus 8 karakter.";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Terjadi kesalahan");
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/"; // Mengarahkan ke root
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
}
