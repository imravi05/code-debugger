import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import codeRoutes from "./routes/codeRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI);
app.use("/api", codeRoutes);
app.listen(8000, () => console.log("Server running on port 8000"));
