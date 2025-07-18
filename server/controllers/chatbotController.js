const Chatbot = require('../models/Chatbot');

// Fungsi: Mendapatkan respons chatbot berdasarkan pesan dari user
exports.getResponse = async (req, res) => {
  const { message } = req.body;
  try {
    const entries = await Chatbot.find();

    for (let entry of entries) {
      try {
        const pattern = new RegExp(entry.questionPattern, 'i');
        if (pattern.test(message)) {
          return res.json({ response: entry.response });
        }
      } catch (err) {
        console.warn(`Invalid regex ignored: ${entry.questionPattern}`);
        continue;
      }
    }

    res.json({ response: 'Maaf, saya tidak mengerti. Coba pertanyaan lain.' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memproses permintaan chatbot.' });
  }
};

// Fungsi: Menambahkan entri chatbot baru
exports.addChatResponse = async (req, res) => {
  try {
    const { questionPattern, response } = req.body;

    // Validasi pola regex
    try {
      new RegExp(questionPattern);
    } catch (err) {
      return res.status(400).json({ message: 'Pola pertanyaan (Regex) tidak valid.' });
    }

    const newEntry = new Chatbot({ questionPattern, response });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menyimpan entri chatbot.' });
  }
};

// Fungsi: Mengambil semua entri chatbot
exports.getAllChatbots = async (req, res) => {
  try {
    const chatbots = await Chatbot.find();
    res.json(chatbots);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar chatbot.' });
  }
};

// Fungsi: Memperbarui entri chatbot
exports.updateChatbot = async (req, res) => {
  try {
    const { questionPattern, response } = req.body;

    // Validasi regex
    try {
      new RegExp(questionPattern);
    } catch (err) {
      return res.status(400).json({ message: 'Pola pertanyaan (Regex) tidak valid.' });
    }

    const updated = await Chatbot.findByIdAndUpdate(
      req.params.id,
      { questionPattern, response },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui entri chatbot.' });
  }
};

// Fungsi: Menghapus entri chatbot
exports.deleteChatbot = async (req, res) => {
  try {
    await Chatbot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chatbot berhasil dihapus.' });
  } catch (error) {
    res.status(400).json({ message: 'Gagal menghapus chatbot.' });
  }
};
