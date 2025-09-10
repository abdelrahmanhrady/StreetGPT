// /pages/api/GeminiAPI.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY missing in .env");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    // ✅ Initialize Gemini client with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Choose the model you want (gemini-1.5-flash is fast & free tier friendly)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // ✅ Generate response
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    console.log("✅ Gemini reply:", reply);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Unexpected server error:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
