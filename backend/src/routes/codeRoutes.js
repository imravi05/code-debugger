import express from "express";
import { explainCode } from "../services/aiService.js";
import Query from "../models/Query.js";
const router = express.Router();

router.post("/run", async (req, res) => {
  const { code, mode, level, language } = req.body;
  const explanation = await explainCode(code, mode, level, language);
  const q = await new Query({ code, mode, level, language, response: explanation }).save();
  res.json({ response: explanation, id: q._id, code, mode, level, language });
});


router.get("/history", async (req, res) => {
  const history = await Query.find().sort({ createdAt: -1 }).limit(20);
  res.json({ history });
});

export default router;
