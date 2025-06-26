const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  questionPattern: { type: String, required: true },
  response: { type: String, required: true },
});

module.exports = mongoose.model('Chatbot', chatbotSchema);
