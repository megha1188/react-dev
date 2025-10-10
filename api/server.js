const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

// --- In-Memory Storage for Chat Histories ---
const chatHistories = {
    // Example:
    // 'vanilla': [{ text: '...', sender: '...' }],
    // 'react': [{ text: '...', sender: '...' }]
};

// --- Mock Data ---
const gibberish = [
    "Blork zorp flibbertigibbet.", "Glim-glam snoo-snoo.", "Floop dee-doop.",
    "Zibble-zabble wibble-wobble.", "Snicker-snack, a-flumph.", "Quibble-quabble, a-fizz.",
    "Zorp! Gloop. Bleep.", "Wobbledy-wobbledy, a-splat.",
];
const userMessages = [
    "Tell me more.", "How does that work?", "Interesting.",
    "Can you elaborate?", "Okay, what's next?", "I see.",
];

// --- Helper to generate a new history ---
const generateMockHistory = (count) => {
    const history = [];
    for (let i = 0; i < count; i++) {
        history.push({
            text: (i % 2 === 0) ? userMessages[i % userMessages.length] : gibberish[i % gibberish.length],
            sender: (i % 2 === 0) ? 'user' : 'ai'
        });
    }
    return history;
};

// --- API Endpoints ---

// Get (or create) the chat history for a session
app.get('/api/history', (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).json({ error: 'sessionId is required' });
    }

    if (!chatHistories[sessionId]) {
        console.log(`Creating new history for sessionId: ${sessionId}`);
        chatHistories[sessionId] = generateMockHistory(1500);
    }

    res.json(chatHistories[sessionId]);
});

// Handle a new chat message for a session
app.post('/api/chat', (req, res) => {
    const { sessionId } = req.query;
    const { message } = req.body;

    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required' });
    }

    // Ensure history exists
    if (!chatHistories[sessionId]) {
        chatHistories[sessionId] = [];
    }

    // Add user message to history
    chatHistories[sessionId].push({ text: message, sender: 'user' });

    // Generate and add AI response
    const aiResponse = gibberish[Math.floor(Math.random() * gibberish.length)];
    chatHistories[sessionId].push({ text: aiResponse, sender: 'ai' });

    // Send back only the new AI response
    setTimeout(() => {
        res.json({ message: aiResponse });
    }, 500); // Simulate network delay
});

app.listen(port, () => {
  console.log(`Chat API server listening at http://localhost:${port}`);
});
