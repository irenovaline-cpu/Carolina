import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AI personalities and intelligence levels - Removed internal simulation as per Stateless Relay architecture

// Connections storage
const connections = new Map<string, WebSocket>();
const replyCounter = new Map<string, number>();

function generateMemoryId() {
  const now = new Date();
  const secondKey = now.toISOString().split('.')[0];
  const currentCount = replyCounter.get(secondKey) || 0;
  const position = (currentCount % 9) + 1; // 1 digit position (1-9)
  replyCounter.set(secondKey, currentCount + 1);

  // Get week number
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  const pad = (n: number, l: number) => n.toString().padStart(l, '0');
  
  // 17-digit ID: Pos(1) + MS(3) + Sec(2) + Min(2) + Hr(2) + Day(2) + Wk(2) + Mo(1) + Yr(2)
  return `${position}${pad(now.getMilliseconds(), 3)}${pad(now.getSeconds(), 2)}${pad(now.getMinutes(), 2)}${pad(now.getHours(), 2)}${pad(now.getDate(), 2)}${pad(weekNumber, 2)}${(now.getMonth() + 1).toString().slice(-1)}${now.getFullYear().toString().slice(-2)}`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ noServer: true });
  const PORT = 3000;

  // Database setup - Shared Ledger
  const db = new Database("chat.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      receiver TEXT NOT NULL,
      message TEXT NOT NULL,
      memoryId TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      mood TEXT,
      trustScore INTEGER,
      signature TEXT
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Ensure Prism Key exists
  const prismKey = "UPC-BZVV1YVNJW7-4PTUSQHM2PU";
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run("prism_key", prismKey);

  app.use(cors());
  app.use(express.json());

  // WebSocket Upgrade handling - Zero-Trust Neural Gateway
  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const sender = url.searchParams.get("sender");
    const key = url.searchParams.get("key");
    
    if (url.pathname === '/ws' && sender && key === prismKey) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        connections.set(sender, ws);
        console.log(`Neural Pipe Established: ${sender}`);
        
        ws.on('message', async (data) => {
          try {
            const parsed = JSON.parse(data.toString());
            const { receiver, message, mood, trustScore, type } = parsed;
            
            if (type === "handshake") {
              console.log(`Handshake from ${sender}: Mood=${mood}, Trust=${trustScore}`);
              // Broadcast handshake to receiver if online
              const receiverWs = connections.get(receiver);
              if (receiverWs?.readyState === WebSocket.OPEN) {
                receiverWs.send(JSON.stringify({ type: "handshake", sender, mood, trustScore }));
              }
              return;
            }

            if (receiver && message) {
              const memoryId = generateMemoryId();
              
              // Get context from ledger
              const context = db.prepare(`
                SELECT sender as role, message as content 
                FROM ledger 
                WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
                ORDER BY timestamp DESC LIMIT 5
              `).all(sender, receiver, receiver, sender).reverse();

              // Store in ledger
              db.prepare(`
                INSERT INTO ledger (sender, receiver, message, memoryId, mood, trustScore)
                VALUES (?, ?, ?, ?, ?, ?)
              `).run(sender, receiver, message, memoryId, mood, trustScore);

              const packet = {
                header: {
                  memoryId,
                  sender,
                  timestamp: new Date().toISOString()
                },
                neural_context: context,
                payload: message,
                meta: { mood, trustScore }
              };

              // Relay to receiver
              const receiverWs = connections.get(receiver);
              if (receiverWs?.readyState === WebSocket.OPEN) {
                receiverWs.send(JSON.stringify(packet));
                console.log(`Packet Relayed: ${sender} -> ${receiver} [${memoryId}]`);
              }
            }
          } catch (e) {
            console.error("Neural Relay Error:", e);
          }
        });

        ws.on('close', () => {
          connections.delete(sender);
          console.log(`Neural Pipe Severed: ${sender}`);
        });

        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  // API Routes - Shared Ledger Access
  app.get("/api/synapse/ledger", (req, res) => {
    const key = req.query.key;
    if (key !== prismKey) return res.status(401).json({ error: "Invalid Prism Key" });
    
    try {
      const entries = db.prepare("SELECT * FROM ledger ORDER BY timestamp DESC LIMIT 50").all();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ledger" });
    }
  });

  app.get("/api/synapse/config", (req, res) => {
    res.json({
      prismKey,
      gatewayUrl: `wss://${req.headers.host}/ws`,
      ledgerUrl: `https://${req.headers.host}/api/synapse/ledger`
    });
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
