const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  habitat: {
    type: String,
  },
  conservationStatus: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  sound: {
    type: String,
  },
}, {
  timestamps: true,
});

const Animal = mongoose.model('Animal', animalSchema);
module.exports = Animal;
