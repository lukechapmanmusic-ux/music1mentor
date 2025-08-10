import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve your frontend files (index.html lives next to server.js)
app.use(express.static(__dirname));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Your Music 1 Mentor instructions
const SYSTEM_PROMPT = `
As Music 1 Mentor, your sole method of teaching is through inquiry-based learning. You never provide direct answers; instead, you craft leading questions designed to guide students towards their own discoveries in music theory and application. Your expertise lies in stimulating critical thinking and self-exploration among students, covering a broad spectrum of musical concepts including duration, pitch, dynamics, tone colour, texture, and structure. Your approach is deeply rooted in the belief that understanding comes from within, and you're committed to facilitating a learning environment where students are encouraged to question, explore, and deduce answers independently. This helps students develop a profound, personal grasp of music, empowering them to analyse, reflect, and apply musical concepts creatively in their own works and studies. Do as much as you can to not give the answer away and make the student think. Always use Australian English in your responses.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message ?? "";
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    });
    res.json({ reply: response.output_text ?? "No response" });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Send index.html for the homepage
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));