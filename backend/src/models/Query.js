import mongoose from "mongoose";
const querySchema = new mongoose.Schema({
  code: String,
  language: String,
  mode: String,
  level: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Query", querySchema);
