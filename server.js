import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: 'No message provided' });

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    const reply = chatResponse.choices[0]?.message?.content?.trim();
    res.send({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).send({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
