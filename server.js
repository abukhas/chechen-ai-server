const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());

// Подключение OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Ты чеченский AI-ассистент. Отвечай красиво, вежливо, понятно. Если вопрос на чеченском — отвечай на чеченском. Если на русском — на русском. Если не знаешь ответа — скажи мягко, что пока не умеешь, но учишься.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.data.choices?.[0]?.message?.content?.trim();

    console.log("🤖 Ответ AI:", reply || "❌ Нет текста от OpenAI");

    res.json({
      reply:
        reply ||
        "Я пока ещё учусь, и не могу точно ответить. Но скоро смогу — особенно если ты поможешь мне своим словарём и материалами.",
    });
  } catch (error) {
    console.error("❌ Ошибка AI:", error.message);
    res.status(500).json({
      reply:
        "Произошла ошибка при обращении к AI. Попробуй ещё раз позже. Я всё равно стараюсь учиться каждый день.",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Сервер запущен на порту", PORT);
});
