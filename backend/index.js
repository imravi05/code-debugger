// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://frontend-fquylodlt-ravi05s-projects.vercel.app/", // replace with your actual Vercel domain
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "ai_code_debugger" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Schema for past queries
const querySchema = new mongoose.Schema({
  code: String,
  language: String,
  explanation: String,
  mode: String,
  level: String,
  createdAt: { type: Date, default: Date.now },
});
const Query = mongoose.model("Query", querySchema);

// Test Route
app.get("/", (req, res) => {
  res.send("✅ AI Code Debugger Backend is running...");
});

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
// POST route

app.post("/api/run", async (req, res) => {
  const { code, language, mode, level } = req.body;
//console.log(req.body);

  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const prompt = `
You are an expert programmer and teacher.
Task: ${mode} the following ${language} code at a ${level} level.
---
Code:
${code}
---
Return your response in clear and structured text.
    `;

    // Access the model and generate content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    // Save in MongoDB
    const newQuery = new Query({ code, language, explanation, mode, level });
    await newQuery.save();

    res.json({ explanation });
  } catch (err) {
    console.error(" Gemini error:", err); // Log the full error for better debugging
    res.status(500).json({ error: "Gemini service failed" });
  }
});


// ✅ Fetch last 10 queries
app.get("/api/history", async (req, res) => {
  try {
    const history = await Query.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);


