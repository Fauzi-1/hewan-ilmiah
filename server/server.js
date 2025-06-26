// server/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config');
const cors = require('cors');
const detect = require('detect-port').default;
const fs = require('fs');
const path = require('path');
const Admin = require('./models/Admin');

const animalRoutes = require('./routes/animalRoutes');
const quizRoutes = require('./routes/quizRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const DEFAULT_PORT = process.env.PORT || 5001; // Perbaiki jadi DEFAULT_PORT

connectDB()
  .then(async () => {
    const availablePort = await detect(DEFAULT_PORT);

    if (availablePort !== DEFAULT_PORT) {
      console.log(`⚠️  Port ${DEFAULT_PORT} sudah dipakai, pindah ke port ${availablePort}`);
    }

    app.listen(availablePort, () => {
      console.log(`✅ Server is running on port ${availablePort}`);

      // --- Tambahan otomatis update port ke .env ---
      const envPath = path.resolve(__dirname, '.env');
      let envContent = '';

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/PORT=.*/, `PORT=${availablePort}`);
      } else {
        envContent = `PORT=${availablePort}`;
      }

      fs.writeFileSync(envPath, envContent);
      console.log(`🔄 File .env diupdate: PORT=${availablePort}`);
      // --- Akhir tambahan ---
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); // Biar kalau gagal, server tidak lanjut
  });

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/animals', animalRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/auth', authRoutes);

// Static Folder (for uploads)
app.use('/uploads/animals', express.static('uploads/animals'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});
