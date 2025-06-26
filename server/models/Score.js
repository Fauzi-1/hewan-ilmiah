const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

const ScoreSchema = new mongoose.Schema({
  name: { type: String },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
