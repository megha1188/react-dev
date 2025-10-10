const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- A single, shared chat history for all clients ---
let chatHistory = [];

// --- Helper to generate a new history ---
const generateMockHistory = (count) => {
  const history = [];
  const now = Date.now();
  const client1Messages = [
    "Hey!",
    "How are you?",
    "Did you see the game last night?",
    "I'm not sure.",
    "That's a good point.",
  ];
  const client2Messages = [
    "Hello there.",
    "I'm doing well, thanks for asking.",
    "No, I missed it. What happened?",
    "Let me think about that.",
    "Indeed.",
  ];

  for (let i = 0; i < count; i++) {
    const sender = i % 2 === 0 ? "vanilla" : "react";
    const text =
      i % 2 === 0
        ? client1Messages[i % client1Messages.length]
        : client2Messages[i % client2Messages.length];
    history.push({
      id: now - (count - i) * 1000, // Use timestamp as a unique ID
      text: text,
      sender: sender,
      timestamp: now - (count - i) * 1000,
    });
  }
  return history;
};

// Initialize the chat with a mock history
chatHistory = generateMockHistory(1500);

// --- API Endpoints ---

// Endpoint for the initial full history load
app.get("/api/history", (req, res) => {
  res.json(chatHistory);
});

// Endpoint for polling for new messages
app.get("/api/messages", (req, res) => {
  const { since } = req.query;
  if (!since) {
    return res
      .status(400)
      .json({ error: "`since` query parameter is required" });
  }

  const newMessages = chatHistory.filter(
    (msg) => msg.timestamp > parseInt(since)
  );
  res.json(newMessages);
});

// Endpoint to receive a new message from a client
app.post("/api/chat", (req, res) => {
  const { text, sender } = req.body;

  if (!text || !sender) {
    return res.status(400).json({ error: "`text` and `sender` are required" });
  }

  const newMessage = {
    id: Date.now(),
    text,
    sender,
    timestamp: Date.now(),
  };

  chatHistory.push(newMessage);

  // Return the message that was successfully added
  res.status(201).json(newMessage);
});

app.listen(port, () => {
  console.log(
    `Chat API server (broker mode) listening at http://localhost:${port}`
  );
});
