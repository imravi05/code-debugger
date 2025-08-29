import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function App() {
  const [code, setCode] = useState("// Write your code here...");
  const [explanation, setExplanation] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Options
  const [language, setLanguage] = useState("python");
  const [mode, setMode] = useState("Explain");
  const [level, setLevel] = useState("Beginner");

  // Fetch history on load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const runCode = async () => {
    if (!code) return;
    setLoading(true);
    setExplanation("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/run`, {
        code,
        language,
        mode,
        level,
      });

      setExplanation(res.data.explanation);
      fetchHistory(); // update history after new run
    } catch (err) {
      setExplanation("❌ Error running AI service");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* History Sidebar */}
      <aside className="w-1/4 bg-vscode-panel p-2 overflow-auto border-r border-vscode-border">
        <h3 className="text-vscode-accent mb-2">History</h3>
        {history.map((q, idx) => (
          <div
            key={idx}
            onClick={() => {
              setCode(q.code);
              setExplanation(q.explanation);
            }}
            className="p-2 cursor-pointer hover:bg-vscode-bg border-b border-vscode-border"
          >
            <code>{q.code.substring(0, 40)}...</code>
          </div>
        ))}
      </aside>

      {/* Main Section */}
      <main className="flex flex-col flex-1">
        {/* Controls */}
        <div className="flex items-center gap-2 p-2 bg-vscode-panel border-b border-vscode-border">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-vscode-bg text-vscode-text p-1 rounded"
          >
            <option>Explain</option>
            <option>Debug</option>
            <option>Optimize</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-vscode-bg text-vscode-text p-1 rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-vscode-bg text-vscode-text p-1 rounded"
          >
            <option>javascript</option>
            <option>python</option>
            <option>java</option>
            <option>cpp</option>
          </select>

          <button
            onClick={runCode}
            disabled={loading}
            className="bg-vscode-accent text-white px-3 py-1 rounded"
          >
            {loading ? "Running..." : "Run"}
          </button>
        </div>

        {/* Monaco Editor */}
        <Editor
          height="60%"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")} // ✅ fixed handler
          language={language}
        />

        {/* Explanation Panel */}
        <div className="flex-1 p-4 bg-vscode-panel overflow-auto">
          {loading ? (
            <p className="text-vscode-accent">⏳ Generating response...</p>
          ) : (
            <pre className="whitespace-pre-wrap">{explanation}</pre>
          )}
        </div>
      </main>
    </div>
  );
}
