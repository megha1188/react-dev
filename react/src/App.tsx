import React, { useEffect, useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

interface MessageData {
  text: string;
  sender: "user" | "ai";
}

const SESSION_ID = "react";

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);

  // Fetch initial chat history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:3003/api/history?sessionId=${SESSION_ID}`
        );
        const history = await response.json();
        setMessages(history);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setMessages([{ text: "Failed to load chat history.", sender: "ai" }]);
      }
    };
    fetchHistory();
  }, []); // Empty dependency array ensures this runs only once

  const handleSendMessage = async (message: string) => {
    const userMessage: MessageData = { text: message, sender: "user" };
    // Optimistically update the UI with the user's message
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch(
        `http://localhost:3003/api/chat?sessionId=${SESSION_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );
      const data = await response.json();
      const aiMessage: MessageData = { text: data.message, sender: "ai" };
      // Add the AI's response to the message list
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: MessageData = {
        text: "Sorry, something went wrong.",
        sender: "ai",
      };
      // Add an error message to the list
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div id="chat-container">
      <div className="header">
        <h1>React Chat</h1>
      </div>
      <ChatWindow messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default App;
