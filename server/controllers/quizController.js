const Quiz = require('../models/Quiz');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil daftar kuis.' });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat kuis.' });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui kuis.' });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kuis berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kuis.' });
  }
};
