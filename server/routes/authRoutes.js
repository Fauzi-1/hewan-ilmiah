// authRoutes.js
const express = require('express');
const { loginUser } = require('../controllers/authController');
const router = express.Router();

// Hanya route untuk login
router.post('/login', loginUser);

module.exports = router;
