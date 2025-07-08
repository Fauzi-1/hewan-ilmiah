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

// Endpoint untuk menambah soal quiz
router.post('/', async (req, res) => {
  try {
    const { question, options, answer, image } = req.body;
    const newQuiz = new Quiz({ question, options, answer,});
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint lainnya seperti edit dan delete juga bisa ditambahkan

module.exports = router;
