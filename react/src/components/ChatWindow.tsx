import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface MessageData {
    id: number;
    text: string;
    sender: string;
}

interface ChatWindowProps {
    messages: MessageData[];
    selfSenderId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, selfSenderId }) => {
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id="chat-window" ref={chatWindowRef}>
            {messages.map((msg) => (
                <Message key={msg.id} text={msg.text} isSelf={msg.sender === selfSenderId} />
            ))}
        </div>
    );
};

export default ChatWindow;
