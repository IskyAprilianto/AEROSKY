const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Ambil token dari header 'x-auth-token'
  const token = req.header("x-auth-token");

  // Jika tidak ada token, tolak akses
  if (!token) {
    return res.status(401).json({ msg: "Akses ditolak, tidak ada token." });
  }

  // Jika ada token, verifikasi
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Simpan informasi pengguna dari token ke object request
    req.user = decoded.user;
    next(); // Lanjutkan ke proses selanjutnya
  } catch (err) {
    res.status(401).json({ msg: "Token tidak valid." });
  }
};
