import React from 'react';

interface MessageProps {
    text: string;
    isSelf: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isSelf }) => {
    const senderClass = isSelf ? 'user' : 'ai';
    return (
        <div className={`message ${senderClass}`}>
            <span>{text}</span>
        </div>
    );
};

export default Message;
