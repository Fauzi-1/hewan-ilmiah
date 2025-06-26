const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', quizController.getAllQuizzes);
router.post('/', authMiddleware, quizController.createQuiz);
router.put('/:id', authMiddleware, quizController.updateQuiz);
router.delete('/:id', authMiddleware, quizController.deleteQuiz);

module.exports = router;
