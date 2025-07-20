// 🌐 Load environment variables
require("dotenv").config();

// 🔧 Import dependencies
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// 🧠 Connect to MongoDB
const connectDB = require("./config");

// 📦 Import route modules
const animalRoutes = require("./routes/animalRoutes");
const quizRoutes = require("./routes/quizRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const authRoutes = require("./routes/authRoutes");

// 🚀 Initialize Express app
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 8081;

// ✅ Allowed CORS origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://hewan-edu.my.id",
  "https://api.hewan-edu.my.id",
];

// ✅ CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Basic root route
app.get("/", (req, res) => {
  res.send("🚀 API is running at /api");
});

// ✅ Optional: add /api root
app.get("/api", (req, res) => {
  res.send("🧪 API is working!");
});

// ✅ API routes
app.use("/api/animals", animalRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);

// ✅ Start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);

      // 🔄 Update or create .env with latest port
      const envPath = path.resolve(__dirname, ".env");
      let envContent = "";

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
        if (!envContent.includes(`PORT=${PORT}`)) {
          envContent = envContent.replace(/PORT=\d+/, `PORT=${PORT}`);
          fs.writeFileSync(envPath, envContent);
          console.log(`🔁 .env updated with PORT=${PORT}`);
        }
      } else {
        fs.writeFileSync(envPath, `PORT=${PORT}`);
        console.log(`📄 .env file created with PORT=${PORT}`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// 🔥 Start app
startServer();