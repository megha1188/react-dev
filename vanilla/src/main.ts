const chatWindow = document.getElementById("chat-window")!;
const chatForm = document.getElementById("chat-form")!;
const messageInput = document.getElementById(
  "message-input"
) as HTMLInputElement;

const SENDER_ID = "vanilla";
const API_ENDPOINT = "http://localhost:3000";

let lastTimestamp = 0;

// --- Message Rendering ---
function createMessageElement(text: string, sender: string) {
  const messageElement = document.createElement("div");
  const senderClass = sender === SENDER_ID ? "user" : "ai";
  messageElement.classList.add("message", senderClass);

  const span = document.createElement("span");
  span.textContent = text;
  messageElement.appendChild(span);

  return messageElement;
}

function appendMessages(messages: any[], shouldScroll: boolean) {
  if (messages.length === 0) return;

  const fragment = document.createDocumentFragment();
  messages.forEach((msg) => {
    const messageElement = createMessageElement(msg.text, msg.sender);
    fragment.appendChild(messageElement);
  });
  chatWindow.appendChild(fragment);

  lastTimestamp = messages[messages.length - 1].timestamp;

  if (shouldScroll) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

// --- API Communication ---

async function fetchHistory() {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/history`);
    const history = await response.json();
    appendMessages(history, true);
  } catch (error) {
    console.error("Error fetching chat history:", error);
  }
}

// Poll for new messages from the OTHER client
setInterval(async () => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/api/messages?since=${lastTimestamp}`
    );
    const newMessages = await response.json();

    const otherClientMessages = newMessages.filter(
      (msg: { sender: string }) => msg.sender !== SENDER_ID
    );

    appendMessages(otherClientMessages, true);
  } catch (error) {
    console.error("Error polling for messages:", error);
  }
}, 2000);

// Handle sending a new message
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  const messageElement = createMessageElement(messageText, SENDER_ID);
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  const messageToSend = { text: messageText, sender: SENDER_ID };
  messageInput.value = "";

  try {
    await fetch(`${API_ENDPOINT}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageToSend),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
});

// --- Initial Load ---
fetchHistory();
