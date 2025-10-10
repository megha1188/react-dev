const chatWindow = document.getElementById('chat-window')!;
const chatForm = document.getElementById('chat-form')!;
const messageInput = document.getElementById('message-input') as HTMLInputElement;
const SESSION_ID = 'vanilla';

// --- Load Initial Chat History ---
async function fetchHistory() {
    try {
        const response = await fetch(`http://localhost:3003/api/history?sessionId=${SESSION_ID}`);
        const history = await response.json();
        
        const fragment = document.createDocumentFragment();
        history.forEach((msg: { text: string; sender: 'user' | 'ai' }) => {
            const messageElement = createMessageElement(msg.text, msg.sender);
            fragment.appendChild(messageElement);
        });
        chatWindow.appendChild(fragment);
        
        chatWindow.scrollTop = chatWindow.scrollHeight;

    } catch (error) {
        console.error('Error fetching chat history:', error);
        appendMessage('Failed to load chat history.', 'ai');
    }
}

// --- Handle New Messages ---
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    messageInput.value = '';

    try {
        const response = await fetch(`http://localhost:3003/api/chat?sessionId=${SESSION_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();
        appendMessage(data.message, 'ai');
    } catch (error) {
        console.error('Error fetching AI response:', error);
        appendMessage('Sorry, something went wrong.', 'ai');
    }
});

// --- Helper Functions ---
function createMessageElement(text: string, sender: 'user' | 'ai') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    const span = document.createElement('span');
    span.textContent = text;
    messageElement.appendChild(span);
    
    return messageElement;
}

function appendMessage(text: string, sender: 'user' | 'ai') {
    const messageElement = createMessageElement(text, sender);
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Initial Load ---
fetchHistory();