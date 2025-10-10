import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";

interface MessageData {
  id: number;
  text: string;
  sender: string;
  timestamp: number;
}

const SENDER_ID = "react";
const API_ENDPOINT = "http://localhost:3000";

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const lastTimestampRef = useRef<number>(0);

  // Effect for initial history load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/history`);
        const history: MessageData[] = await response.json();
        setMessages(history);
        if (history.length > 0) {
          lastTimestampRef.current = history[history.length - 1].timestamp;
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  // Effect for polling new messages from the OTHER client
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINT}/api/messages?since=${lastTimestampRef.current}`
        );
        const newMessages: MessageData[] = await response.json();

        const otherClientMessages = newMessages.filter(
          (msg) => msg.sender !== SENDER_ID
        );

        if (otherClientMessages.length > 0) {
          setMessages((prevMessages) => [
            ...prevMessages,
            ...otherClientMessages,
          ]);
          lastTimestampRef.current =
            otherClientMessages[otherClientMessages.length - 1].timestamp;
        }
      } catch (error) {
        console.error("Error polling for messages:", error);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, []);

  const handleSendMessage = async (messageText: string) => {
    const optimisticMessage: MessageData = {
      id: Date.now(),
      text: messageText,
      sender: SENDER_ID,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    const messageToSend = { text: messageText, sender: SENDER_ID };

    try {
      await fetch(`${API_ENDPOINT}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageToSend),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div id="chat-container">
      <div className="header">
        <h1>React Chat</h1>
      </div>
      <ChatWindow messages={messages} selfSenderId={SENDER_ID} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default App;
