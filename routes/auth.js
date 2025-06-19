const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @route   POST api/auth/register
// @desc    Mendaftarkan pengguna baru
router.post("/register", async (req, res) => {
  // Ambil username, email, dan password dari body
  const { username, email, password } = req.body;

  try {
    // --- Validasi Input ---
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Harap isi semua field." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password minimal harus 8 karakter." });
    }

    // Cek apakah username atau email sudah ada
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ msg: "Username sudah digunakan." });
    }
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: "Email sudah digunakan." });
    }

    // Buat user baru
    let user = new User({ username, email, password });

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Simpan user ke database
    await user.save();

    // Buat dan kirim token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth/login
// @desc    Login pengguna & mendapatkan token
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ msg: "Harap isi semua field." });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Username atau password salah." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Username atau password salah." });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
