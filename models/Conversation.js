const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "model"], required: true },
  parts: [{ text: { type: String, required: true } }],
});

const conversationSchema = new mongoose.Schema({
  // Menghubungkan setiap percakapan ke seorang pengguna
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Judul untuk ditampilkan di sidebar riwayat
  title: {
    type: String,
    default: "Percakapan Baru",
  },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", conversationSchema);
