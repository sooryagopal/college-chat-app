import React from 'react';
import RoleBadge from './RoleBadge';

const MessageItem = ({ message, currentUser }) => {
  const isCurrentUser = message.sender._id === currentUser._id;
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xl p-4 rounded-xl shadow-md ${
          isCurrentUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold">{message.sender.name}</span>
          <RoleBadge role={message.sender.role} />
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{timestamp}</span>
        </div>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default MessageItem;