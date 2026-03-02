import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const db = new Database("chat.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/messages", (req, res) => {
    try {
      const messages = db.prepare("SELECT * FROM messages ORDER BY timestamp ASC").all();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", (req, res) => {
    const { role, content } = req.body;
    if (!role || !content) {
      return res.status(400).json({ error: "Role and content are required" });
    }
    try {
      const info = db.prepare("INSERT INTO messages (role, content) VALUES (?, ?)").run(role, content);
      res.json({ id: info.lastInsertRowid, role, content });
    } catch (error) {
      res.status(500).json({ error: "Failed to save message" });
    }
  });

  app.delete("/api/messages", (req, res) => {
    try {
      db.prepare("DELETE FROM messages").run();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear history" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
