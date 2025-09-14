import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const Composer = ({ onSendMessage, isStudent }) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-600 p-2">
        <input
          type="text"
          placeholder={isStudent ? "You cannot send messages." : "Write an announcement..."}
          className="flex-grow p-2 bg-transparent focus:outline-none text-gray-900 dark:text-white"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={isStudent}
        />
        <button
          onClick={handleSend}
          className={`p-3 text-white rounded-full shadow-lg transition-transform transform hover:scale-105 ${isStudent ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          disabled={isStudent}
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
};

export default Composer;