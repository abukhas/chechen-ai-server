const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { OpenAI } = require("openai");

const app = express();
app.use(express.json());

// Подключение OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Разрешённые домены
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

  console.log("📩 Сообщение от пользователя:", userMessage);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ✅ заменено с gpt-4 на gpt-3.5-turbo
      messages: [
        {
          role: "system",
          content:
            "Ты чеченский AI-ассистент. Отвечай красиво, вежливо, понятно. Если вопрос на чеченском — отвечай на чеченском. Если на русском — отвечай на русском.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Ошибка AI:", error.message);
    res.status(500).json({
      error:
        "Произошла ошибка при обращении к AI. Попробуй ещё раз позже. Я всё равно стараюсь учиться каждый день.",
      details: error.message,
    });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
