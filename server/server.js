// server/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const detect = require("detect-port").default;
const fs = require("fs");
const path = require("path");
const connectDB = require("./config");

const animalRoutes = require("./routes/animalRoutes");
const quizRoutes = require("./routes/quizRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;

const startServer = async () => {
  try {
    // 1. Koneksi MongoDB
    await connectDB();
    console.log("MongoDB Connected");

    // 2. Cek port yang tersedia
    const availablePort = await detect(DEFAULT_PORT);

    if (availablePort !== DEFAULT_PORT) {
      console.log(
        ` Port ${DEFAULT_PORT} sedang digunakan. Menggunakan port ${availablePort} sebagai gantinya.`
      );
    }

    // 3. Middleware & Routing
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://hewan-edu.vercel.app",
      "https://hewan-edu.my.id",
    ];

    // middleware CORS dengan konfigurasi
    app.use(
      cors({
        origin: function (origin, callback) {
          // allow requests with no origin (like mobile apps or curl)
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      })
    );
    app.use(express.json());

    // 4. API Routes
    app.use("/api/animals", animalRoutes);
    app.use("/api/quizzes", quizRoutes);
    app.use("/api/chatbot", chatbotRoutes);
    app.use("/api/auth", authRoutes);

    // 6. Root endpoint
    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    // 7. Jalankan server
    app.listen(availablePort, "0.0.0.0", () => {
      console.log(`Server berjalan di http://0.0.0.0:${availablePort}`);

      // 8. Update .env jika port berubah
      const envPath = path.resolve(__dirname, ".env");
      let envContent = "";

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
        if (!envContent.includes(`PORT=${availablePort}`)) {
          envContent = envContent.replace(/PORT=\d+/, `PORT=${availablePort}`);
          fs.writeFileSync(envPath, envContent);
          console.log(
            `🔄 PORT di file .env diperbarui menjadi ${availablePort}`
          );
        }
      } else {
        fs.writeFileSync(envPath, `PORT=${availablePort}`);
        console.log(`File .env dibuat dengan PORT=${availablePort}`);
      }
    });
  } catch (error) {
    console.error("Gagal menjalankan server:", error.message);
    process.exit(1);
  }
};

startServer();
