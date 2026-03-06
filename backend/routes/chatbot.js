const GEMINI_MODEL = "gemini-2.5-flash"; // ✅ CONFIRMED WORKING
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const AIReport = require("../models/AIReport");
const { GoogleGenAI } = require("@google/genai");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    console.log("✅ [CHATBOT] Message received:", message.substring(0, 80));

    // Fetch any existing report for context
    let contextText = "No health report available yet.";
    try {
      const report = await AIReport.findOne({ userId: req.userId }).sort({ createdAt: -1 });
      if (report) {
        contextText = `User's PCOS Data: Risk=${report.riskLevel}, BMI=${report.BMI}, Prediction=${report.pcosPrediction}, Irregularity=${report.menstrualIrregularity}`;
      }
    } catch (e) {}

    const prompt = `You are Saheli AI, a compassionate PCOS health assistant.

Patient context: ${contextText}

User question: ${message}

Give a helpful, empathetic, PCOS-specific response in 2-3 sentences. Do not use markdown formatting.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const reply = response.text;
    console.log("✅ [CHATBOT] Reply sent, length:", reply.length);
    res.json({ reply });

  } catch (err) {
    console.error("❌ [CHATBOT] ERROR:", err.message);
    if (err.message?.includes("429")) {
      return res.json({ reply: "⏳ I'm receiving too many requests right now. Please wait a moment and try again." });
    }
    res.json({ reply: `AI Error: ${err.message?.substring(0, 100) || "Unknown error"}. Please try again.` });
  }
});

module.exports = router;
