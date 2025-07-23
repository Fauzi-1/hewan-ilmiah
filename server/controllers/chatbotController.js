const Chatbot = require('../models/Chatbot');
const Animal = require('../models/Animal');

exports.getResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Pesan tidak boleh kosong' });

    const allPatterns = await Chatbot.find({});
    for (const pattern of allPatterns) {
      const regex = new RegExp(pattern.questionPattern, 'i');
      if (regex.test(message)) {
        // Cek apakah respons-nya berformat "Image:<nama hewan>"
        if (pattern.response.startsWith('Image:')) {
          const animalName = pattern.response.split('Image:')[1].trim();
          const animalData = await Animal.findOne({ name: { $regex: new RegExp(`^${animalName}$`, 'i') } });
          if (!animalData) {
            return res.json({ response: `Maaf, data gambar untuk ${animalName} tidak ditemukan.` });
          }
          console.log('🐾 Animal Data ditemukan:', animalData);

          return res.json({
            response: `Ini gambar ${animalName}:`,
            image: animalData.image,
            name: animalData.name,
          });
        }

        // Jika respons biasa (bukan gambar)
        return res.json({ response: pattern.response });
      }
    }

    return res.json({ response: 'Maaf, saya belum mengerti pertanyaan itu. Kalau kamu bingung pertanyaan apa saja yang bisa ditanyakan, kamu bisa ketik "Help"' });
  } catch (error) {
    console.error('Error chatbot:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan di server' });
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
