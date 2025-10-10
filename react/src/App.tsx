import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import './App.css';

interface MessageData {
    text: string;
    sender: 'user' | 'ai';
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<MessageData[]>([
        { text: 'Hello! I am a mock AI.', sender: 'ai' }
    ]);

    const handleSendMessage = async (message: string) => {
        const userMessage: MessageData = { text: message, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            const response = await fetch('http://localhost:3003/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            const aiMessage: MessageData = { text: data.message, sender: 'ai' };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            const errorMessage: MessageData = { text: 'Sorry, something went wrong.', sender: 'ai' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
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