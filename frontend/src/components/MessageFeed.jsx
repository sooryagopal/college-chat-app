import React from 'react';
import MessageItem from './MessageItem';

const MessageFeed = ({ messages, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No announcements in this group yet.
        </p>
      ) : (
        messages.map((msg) => (
          <MessageItem key={msg._id} message={msg} currentUser={currentUser} />
        ))
      )}
    </div>
  );
};

export default MessageFeed;