/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "vscode-bg": "#1e1e1e",
        "vscode-panel": "#252526",
        "vscode-border": "#333333",
        "vscode-text": "#d4d4d4",
        "vscode-accent": "#007acc",
      },
      fontFamily: {
        code: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
