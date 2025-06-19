const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Middleware proteksi
const Conversation = require("../models/Conversation");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint GET / (Tidak berubah)
router.get("/", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("title createdAt");
    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Endpoint GET /:id (Tidak berubah)
router.get("/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!conversation) {
      return res.status(404).json({ msg: "Percakapan tidak ditemukan" });
    }
    res.json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Endpoint POST / (Tidak berubah)
router.post("/", auth, async (req, res) => {
  const { message, conversationId } = req.body;

  try {
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user.id,
      });
    } else {
      conversation = new Conversation({ userId: req.user.id });
    }

    conversation.messages.push({ role: "user", parts: [{ text: message }] });

    if (conversation.messages.length === 1) {
      conversation.title = message.substring(0, 30);
    }

    const chat = model.startChat({
      history: conversation.messages.map((msg) => ({
        role: msg.role,
        parts: msg.parts.map((p) => ({ text: p.text })),
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    conversation.messages.push({
      role: "model",
      parts: [{ text: responseText }],
    });
    await conversation.save();

    res.json({ response: responseText, conversationId: conversation._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Endpoint POST /guest (Tidak berubah)
router.post("/guest", async (req, res) => {
  const { message, history } = req.body;

  try {
    const chat = model.startChat({ history: history || [] });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    res.json({ response: responseText });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- ENDPOINT BARU UNTUK MENGHAPUS ---
// @route   DELETE api/chats/:id
// @desc    Menghapus percakapan berdasarkan ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ msg: "Percakapan tidak ditemukan" });
    }

    await Conversation.findByIdAndDelete(req.params.id);

    res.json({ msg: "Percakapan berhasil dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// --- AKHIR ENDPOINT BARU ---

module.exports = router;
