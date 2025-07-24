const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed: " + origin));
    }
  }
}));

// 🔥 ВАЖНО: вот маршрут, которого не было!
app.post("/api/chat", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  // Пока просто возвращаем текст (можно позже подключить OpenAI)
  res.json({ reply: "AI получил сообщение: " + message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Сервер запущен на порту", PORT);
});
