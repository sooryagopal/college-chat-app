import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000');
  }
  return socket;
};

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

export const sendMessage = (message) => {
  getSocket().emit('sendMessage', message);
};
