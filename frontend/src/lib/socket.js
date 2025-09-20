import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5001');
  }
  return socket;
};

// This hook is not used in your ChatInterface component, but it's well-structured.
// It can be kept for future use if needed.
export const useSocket = (url) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [url]);

  return socket;
};

export const joinGroup = (groupName) => {
  getSocket().emit('joinGroup', groupName);
};

// 🟢 MENTOR ADVICE: The sendMessage function has been removed from this file.
// The frontend now makes a POST request to the backend API to send messages.
// This is the correct and secure way to handle message sending.