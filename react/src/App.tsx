import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import './App.css';

interface MessageData {
    text: string;
    sender: 'user' | 'ai';
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<MessageData[]>([]);

    // Fetch initial chat history on component mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('http://localhost:3003/api/history');
                const history = await response.json();
                setMessages(history);
            } catch (error) {
                console.error('Error fetching chat history:', error);
                setMessages([{ text: 'Failed to load chat history.', sender: 'ai' }]);
            }
        };
        fetchHistory();
    }, []); // Empty dependency array ensures this runs only once

    const handleSendMessage = async (message: string) => {
        const userMessage: MessageData = { text: message, sender: 'user' };
        // Add user message to the state immediately for a responsive feel
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            const response = await fetch('http://localhost:3003/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });
            const data = await response.json();
            const aiMessage: MessageData = { text: data.message, sender: 'ai' };
            // Add AI response to the state
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
