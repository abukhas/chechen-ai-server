const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { OpenAI } = require("openai");

const app = express();
app.use(express.json());

// Подключаем OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS — разрешаем только твоему сайту
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed: " + origin));
      }
    },
  })
);

// Главный маршрут
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Нет сообщения" });
  }

  try {
    // Формируем запрос к OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Ты чеченский AI-ассистент. Ты всегда отвечаешь красиво, понятно и вежливо. Если вопрос на чеченском — отвечай на чеченском. Если на русском — на русском. Не используй интернет. Отвечай, как умный, но добрый учитель.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "Нет ответа.";
    res.json({ reply });
  } catch (error) {
    console.error("Ошибка AI:", error);
    res.status(500).json({ error: "Ошибка генерации ответа AI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Сервер запущен на порту", PORT);
});
