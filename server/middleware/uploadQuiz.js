const express = require('express');
const multer = require('multer');
const path = require('path');
const { Quiz } = require('../models/Quiz');
const router = express.Router();
const fs = require('fs');

const uploadDir = 'uploads/quiz';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter file gambar
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Hanya file gambar yang diizinkan!', false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Endpoint untuk upload gambar soal
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Gambar tidak ditemukan' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Endpoint untuk menambah soal quiz
router.post('/', async (req, res) => {
  try {
    const { question, options, answer, image } = req.body;
    const newQuiz = new Quiz({ question, options, answer, image });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint lainnya seperti edit dan delete juga bisa ditambahkan

module.exports = router;
