const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const protect = require('../middleware/authMiddleware');

// Health check / default route supaya tidak error
router.get('/test', (req, res) => {
  res.send('Chatbot API working ✅');
});

// User bertanya ke chatbot
router.post('/ask', chatbotController.getResponse);

// Admin kelola chatbot
router.get('/', protect, chatbotController.getAllChatbots);
router.post('/', protect, chatbotController.addChatResponse);
router.put('/:id', protect, chatbotController.updateChatbot);
router.delete('/:id', protect, chatbotController.deleteChatbot);

module.exports = router;
