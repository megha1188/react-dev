const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

const gibberish = [
    "Blork zorp flibbertigibbet.",
    "Glim-glam snoo-snoo.",
    "Floop dee-doop.",
    "Zibble-zabble wibble-wobble.",
    "Snicker-snack, a-flumph.",
    "Quibble-quabble, a-fizz.",
    "Zorp! Gloop. Bleep.",
    "Wobbledy-wobbledy, a-splat.",
];

const userMessages = [
    "Tell me more.",
    "How does that work?",
    "Interesting.",
    "Can you elaborate?",
    "Okay, what's next?",
    "I see.",
];

// Function to generate a large mock chat history
const generateMockHistory = (count) => {
    const history = [];
    for (let i = 0; i < count; i++) {
        if (i % 2 === 0) {
            history.push({
                text: userMessages[i % userMessages.length],
                sender: 'user'
            });
        } else {
            history.push({
                text: gibberish[i % gibberish.length],
                sender: 'ai'
            });
        }
    }
    return history;
};

// Endpoint to get the chat history
app.get('/api/history', (req, res) => {
    res.json(generateMockHistory(1500)); // Generate 1500 messages
});

// Endpoint to handle new messages
app.post('/api/chat', (req, res) => {
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * gibberish.length);
        res.json({ message: gibberish[randomIndex] });
    }, 500); // Simulate network delay
});

app.listen(port, () => {
  console.log(`Chat API server listening at http://localhost:${port}`);
});