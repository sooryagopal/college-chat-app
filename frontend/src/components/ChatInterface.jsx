import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import Composer from './Composer';
import MessageFeed from './MessageFeed';
import { getSocket } from '../lib/socket';
import api, { sendMessage } from '../lib/api';

const ChatInterface = ({ currentUser, handleLogout }) => {
  const [selectedGroup, setSelectedGroup] = useState('Global');
  const [messages, setMessages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch groups on initial load
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/chat/groups');
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };
    fetchGroups();
  }, []); // 🟢 FIX: Empty dependency array ensures this runs only once

  // Fetch messages for the selected group
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/chat/messages/${selectedGroup}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedGroup]); // 🟢 FIX: This runs only when the selected group changes

  // Handle real-time messages via Socket.IO
  useEffect(() => {
    const socket = getSocket();

    // Join the selected group's room
    if (selectedGroup) {
      socket.emit('joinGroup', selectedGroup);
    }

    const handleNewMessage = (newMessage) => {
      setMessages((prevMessages) => {
        // Check if message is already in the list to avoid duplicates
        const messageExists = prevMessages.some(msg => msg._id === newMessage._id);
        if (!messageExists) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    };

    socket.on('receiveMessage', handleNewMessage);

    // Cleanup function
    return () => {
      socket.off('receiveMessage', handleNewMessage);
      if (selectedGroup) {
        socket.emit('leaveGroup', selectedGroup);
      }
    };
  }, [selectedGroup]); // Runs when selected group changes

  const onSendMessage = async (text) => {
    if (!text || !currentUser) return;
    try {
      const newMessage = await

        sendMessage(selectedGroup, text);

      // FIX: Immediately add the new message to the state
      // This ensures the message appears for the sender without waiting for the socket broadcast
      setMessages(prevMessages => [...prevMessages, newMessage]);

    } catch (err) {
      console.error('Failed to send message:', err.response?.data?.message || err.message);
    }
  };

  const visibleGroups = groups;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Sidebar for groups */}
      <div className="w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Groups</h2>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
        <ul className="space-y-2 flex-grow overflow-y-auto">
          {visibleGroups.map((group) => (
            <li
              key={group.name}
              onClick={() => setSelectedGroup(group.name)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedGroup === group.name
                ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 font-semibold shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {group.name}
            </li>
          ))}
        </ul>
        {currentUser && (
          <div className="mt-4 p-4 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{currentUser.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col p-6">
        <header className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold">{selectedGroup}</h1>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MessageFeed messages={messages} currentUser={currentUser} />
        )}

        {currentUser && ['Admin', 'HOD', 'Advisor'].includes(currentUser.role) && (
          <Composer onSendMessage={onSendMessage} />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;